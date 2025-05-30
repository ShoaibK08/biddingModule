import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Input, Row, Col, Spinner } from "reactstrap";
import { toast } from 'react-toastify';
import "./BidHistoryModal.css";
 
const BidHistoryModal = ({ isOpen, toggle, bidNo, bidData }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [bidHistory, setBidHistory] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
   
    const itemsPerPage = 5;
 
    // Fetch bid history data when modal opens or dependencies change
    useEffect(() => {
        if (isOpen && bidNo) {
            fetchBidHistory();
        }
    }, [isOpen, bidNo, currentPage, searchTerm]);
 
    // Real API call to fetch bid history
    const fetchBidHistory = async () => {
        setLoading(true);
       
        try {
            // Get authentication details
            const username = process.env.REACT_APP_API_USER_NAME;
            const password = process.env.REACT_APP_API_PASSWORD;
            const basicAuth = 'Basic ' + btoa(username + ':' + password);
           
            // Get transporter details from session or bidData
            const authUser = JSON.parse(sessionStorage.getItem("authUser") || '{}');
            const transporterId = authUser?.data?.transporterId || bidData?.transporterId;
            const transporterCode = authUser?.data?.transporterCode || bidData?.transporterCode;
           
            // Prepare request body
            const requestBody = {
                transporterId: transporterId,
                biddingOrderNo: bidNo,
                transporterCode: transporterCode,
                search: searchTerm,
                page: currentPage,
                size: itemsPerPage
            };
           
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/biddingHistory`, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': basicAuth
                },
                body: JSON.stringify(requestBody)
            });
 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
 
            const responseData = await response.json();
           
            // Process the response based on API structure
            if (responseData && responseData.status === 'success' && responseData.data) {
                // Extract bid history data
                const historyData = responseData.data.content || [];
               
                // Map the data to match our component's format
                const formattedHistory = historyData.map((item, index) => ({
                    serialNo: (currentPage - 1) * itemsPerPage + index + 1,
                    time: formatDateTime(item.biddingDate || item.createdDate),
                    amount: formatCurrency(item.amount || item.bidAmount),
                    material: item.material || item.materialName || '-',
                    quantity: `${item.quantity || '-'} ${item.quantityUnit || ''}`
                }));
               
                setBidHistory(formattedHistory);
                setTotalResults(responseData.data.totalElements || 0);
                setTotalPages(responseData.data.totalPages || Math.ceil((responseData.data.totalElements || 0) / itemsPerPage));
            } else {
                // Handle empty or unexpected response structure
                setBidHistory([]);
                setTotalResults(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Error fetching bid history:', error);
            toast.error("Failed to fetch bid history. Please try again.", { autoClose: 3000 });
            setBidHistory([]);
            setTotalResults(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };
 
    // Format date and time
    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
       
        const date = new Date(dateString);
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
       
        return date.toLocaleString('en-US', options);
    };
 
    // Format currency
    const formatCurrency = (amount) => {
        if (!amount) return '0';
        return amount.toLocaleString('en-IN');
    };
 
    // Handle search input change with debounce
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
        setCurrentPage(1); // Reset to first page on search
    };
 
    // Handle page change
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
 
    // Handle input change for page number
    const handlePageInputChange = (e) => {
        const page = parseInt(e.target.value);
        if (!isNaN(page) && page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
 
    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm("");
            setCurrentPage(1);
            setBidHistory([]);
            setTotalResults(0);
            setTotalPages(0);
        }
    }, [isOpen]);
 
    return (
        <Modal isOpen={isOpen} toggle={toggle} centered size="lg" className="bid-history-modal">
            <ModalHeader toggle={toggle} className="border-bottom modal-title-header">
                Bid No. - {bidNo}
            </ModalHeader>
            <ModalBody className="p-0">
                {/* Search bar */}
                <div className="p-3 d-flex justify-content-end">
                    <div className="search-box">
                        <Input
                            type="search"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="form-control"
                        />
                    </div>
                </div>
 
                {/* Data table */}
                <div className="table-responsive">
                    {loading ? (
                        <div className="text-center my-5">
                            <Spinner color="primary" />
                            <p className="mt-2">Loading bid history...</p>
                        </div>
                    ) : (
                        <table className="table bid-history-table mb-0">
                            <thead>
                                <tr>
                                    <th>Serial No</th>
                                    <th>Time</th>
                                    <th>Amount</th>
                                    <th>Material</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bidHistory.length > 0 ? (
                                    bidHistory.map((bid, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                            <td>{bid.serialNo}</td>
                                            <td>{bid.time}</td>
                                            <td>{bid.amount}</td>
                                            <td>{bid.material}</td>
                                            <td>{bid.quantity}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No bid history found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
 
                {/* Pagination */}
                {totalResults > 0 && (
                    <div className="pagination-container p-3 d-flex justify-content-between align-items-center">
                        <div>Total Results: {totalResults}</div>
                        <div className="d-flex align-items-center">
                            <button
                                className="pagination-btn prev-btn"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <i className="mdi mdi-chevron-left"></i>
                            </button>
                            <span className="page-info">Page {currentPage} of {totalPages}</span>
                            <button
                                className="pagination-btn next-btn"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <i className="mdi mdi-chevron-right"></i>
                            </button>
                            <input
                                type="text"
                                className="page-input"
                                value={currentPage}
                                onChange={handlePageInputChange}
                            />
                        </div>
                    </div>
                )}
            </ModalBody>
        </Modal>
    );
};
 
export default BidHistoryModal;