import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, CardHeader, Input, FormGroup, Modal, ModalHeader, ModalBody, Table } from "reactstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../../Components/Common/DeleteModal";
// Import custom components
import BidCard from "./BidCard/BideCard";
import BidHistoryModal from "./BidHistoryModal/BidHistoryModal";
import { getLoginCode } from "../../../../helpers/api_helper";


const ViewAllBids = () => {
    const [bids, setBids] = useState([]);
    const [viewModal, setViewModal] = useState(false);
    const [historyModal, setHistoryModal] = useState(false);
    const [viewData, setViewData] = useState({});
    const [selectedBidNo, setSelectedBidNo] = useState('');
    const [CurrentID, setClickedRowId] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [latestHeader, setLatestHeader] = useState('');
    const [Plant_Code, setPlantCode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [soDetailsModal, setSoDetailsModal] = useState(false);
    const [soDetails, setSoDetails] = useState([]);
    const [loadingSoDetails, setLoadingSoDetails] = useState(false);
    const [loginCode, setLoginCode] = useState('');


    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    const toggleView = useCallback(() => {
        if (viewModal) {
            setViewModal(false);
        } else {
            setViewModal(true);
        }
    }, [viewModal]);

    const toggleSoDetails = useCallback(() => {
        if (soDetailsModal) {
            setSoDetailsModal(false);
        } else {
            setSoDetailsModal(true);
        }
    }, [soDetailsModal]);
    const toggleHistory = useCallback(() => {
        if (historyModal) {
            setHistoryModal(false);
        } else {
            setHistoryModal(true);
        }
    }, [historyModal]);
    // Format date for SO Details table
    const formatSODate = (dateString) => {
        if (!dateString) return '';

        // Check if the date is already in DD-MM-YYYY format
        const dateRegex = /^\d{2}-\d{2}-\d{4}/;
        if (dateRegex.test(dateString)) {
            return dateString;
        }

        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    useEffect(() => {
        const loginCode = getLoginCode();
        if (loginCode) {
            setLoginCode(loginCode);
            console.log("Login code found:", loginCode);
        } else {
            console.warn("Login code not found");
        }
        const HeaderName = localStorage.getItem("HeaderName");
        setLatestHeader(HeaderName);
    }, []);

    // Get status based on date comparison
    const getStatus = (bidFrom, bidTo) => {
        const now = new Date();
        const start = new Date(bidFrom);
        const end = new Date(bidTo);

        if (now < start) return "To Be Started";
        if (now >= start && now <= end) return "Running";
        return "Completed";
    };

    // Fetch bid data from API
    useEffect(() => {
        fetchBidData();
    }, []);

    const fetchBidData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Basic authentication setup
            const username = process.env.REACT_APP_API_USER_NAME;
            const password = process.env.REACT_APP_API_PASSWORD;
            const basicAuth = 'Basic ' + btoa(username + ':' + password);

            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/all
 `, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': basicAuth
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            // Access the data correctly from the API response
            if (responseData && responseData.data && Array.isArray(responseData.data)) {
                // Add status to each bid based on date comparison
                const bidsWithStatus = responseData.data.map(bid => ({
                    ...bid,
                    status: getStatus(bid.bidFrom, bid.bidTo)
                }));
                setBids(bidsWithStatus);
            } else {
                console.log('Unexpected API response structure:', responseData);
                setBids([]);
            }
        } catch (err) {
            console.error('API Error:', err);
            setError("Failed to fetch bid data. Please try again.");
            setBids([]);
            toast.error("Failed to fetch bid data. Please try again.", { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle status filter change
    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // Filter bids based on search term and status
    const filteredBids = bids.filter(bid => {
        const matchesSearch = Object.values(bid).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesStatus = !statusFilter || statusFilter === 'All' || bid.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // View Data
    const handleViewClick = useCallback((bidNo) => {
        // Find the bid in the fetched data
        const selectedBid = bids.find(bid => bid.biddingOrderNo === bidNo);
        if (selectedBid) {
            setViewData(selectedBid);
            setViewModal(true);
        } else {
            toast.error("Bid details not found", { autoClose: 3000 });
        }
    }, [bids]);
    // Fetch SO Details from API
    const fetchSoDetails = async (biddingOrderNo) => {
        try {
            setLoadingSoDetails(true);

            // Basic authentication setup
            const username = process.env.REACT_APP_API_USER_NAME || 'amazin';
            const password = process.env.REACT_APP_API_PASSWORD || 'TE@M-W@RK';
            const basicAuth = 'Basic ' + btoa(username + ':' + password);

            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/getSoDetails?bidNo=${biddingOrderNo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': basicAuth,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            if (Array.isArray(responseData)) {
                setSoDetails(responseData);
                setSoDetailsModal(true);
            } else {
                console.log('Unexpected API response structure:', responseData);
                setSoDetails([]);
                toast.error("Invalid SO details data format", { autoClose: 3000 });
            }
        } catch (err) {
            console.error('API Error:', err);
            toast.error("Failed to fetch SO details. Please try again.", { autoClose: 3000 });
            setSoDetails([]);
        } finally {
            setLoadingSoDetails(false);
        }
    };

    // History Data
    const handleHistoryClick = useCallback((bidNo) => {
        // Find the bid in the fetched data
        const selectedBid = bids.find(bid => bid.biddingOrderNo === bidNo);
        if (selectedBid) {
            setSelectedBidNo(selectedBid.biddingOrderNo);
            setHistoryModal(true);
        } else {
            toast.error("Bid details not found", { autoClose: 3000 });
        }
    }, [bids]);

    // Delete Data
    const onClickDelete = (id) => {
        setClickedRowId(id);
        setDeleteModal(true);
    };

    const handleDeleteCustomer = async (e) => {
        e.preventDefault();

        try {
            // For now, just update the local state
            // In production, you would make an API call here
            const updatedBids = bids.filter(bid => bid.id !== CurrentID);
            setBids(updatedBids);
            toast.success("Bid Deleted Successfully", { autoClose: 3000 });
            setDeleteModal(false);

            // Uncomment and adjust when you have a delete API endpoint
            // const username = process.env.REACT_APP_API_USER_NAME;
            // const password = process.env.REACT_APP_API_PASSWORD;
            // const basicAuth = 'Basic ' + btoa(username + ':' + password);

            // const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8085}/biddingMaster/delete/${CurrentID}`, {
            //     method: 'DELETE',
            //     headers: {
            //         'Authorization': basicAuth
            //     }
            // });

            // if (response.ok) {
            //     toast.success("Bid Deleted Successfully", { autoClose: 3000 });
            //     fetchBidData(); // Refresh the data
            // } else {
            //     throw new Error('Delete failed');
            // }
        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
            setDeleteModal(false);
        }
    };

    document.title = "Bids Management | EPLMS";

    return (
        <React.Fragment>
            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={bids}
                />
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteCustomer}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <Container fluid>
                    <BreadCrumb title={"Auction"} pageTitle="Bids" />
                    <Row>
                        <Col lg={12}>
                            <Card id="bidsList">
                                {/* <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <Col>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div style={{ width: "600px" }}>
                                                    <h5 className="card-title mb-0 p-2 bg-light">Bids Management</h5>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="search-box me-2">
                                                        <Input
                                                            type="text"
                                                            className="form-control search"
                                                            placeholder="Search..."
                                                            value={searchTerm}
                                                            onChange={handleSearchChange}
                                                        />
                                                    </div>
                                                    <FormGroup className="mb-0">
                                                        <Input
                                                            type="select"
                                                            className="form-select"
                                                            value={statusFilter}
                                                            onChange={handleStatusChange}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="All">All</option>
                                                            <option value="Running">Running</option>
                                                            <option value="Completed">Completed</option>
                                                            <option value="To Be Started">To Be Started</option>
                                                        </Input>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardHeader> */}
                                <CardHeader className="border-0 py-3 px-4">
                                    <div className="d-flex align-items-center justify-content-between w-100">
                                        {/* Title Section */}
                                        <div className="flex-shrink-0" style={{ width: "400px" }}>
                                            <h5 className="card-title mb-0 px-4 py-2 bg-light rounded text-muted" style={{ width: "100%" }}>
                                                Bids Management
                                            </h5>
                                        </div>

                                        {/* Search and Filter Section */}
                                        <div className="d-flex align-items-center" style={{ gap: "12px" }}>
                                            {/* Search Box */}
                                            <div className="search-box">
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search..."
                                                    value={searchTerm}
                                                    onChange={handleSearchChange}
                                                    style={{
                                                        width: "280px",
                                                        height: "38px",
                                                        fontSize: "14px"
                                                    }}
                                                />
                                            </div>

                                            {/* Status Filter */}
                                            <div className="filter-box">
                                                <Input
                                                    type="select"
                                                    className="form-select"
                                                    value={statusFilter}
                                                    onChange={handleStatusChange}
                                                    style={{
                                                        width: "150px",
                                                        height: "38px",
                                                        fontSize: "14px"
                                                    }}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="All">All</option>
                                                    <option value="Running">Running</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="To Be Started">To Be Started</option>
                                                </Input>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <div className="card-body pt-0">
                                    <div>
                                        {/* Card view for bids */}
                                        <div className="bid-cards-container">
                                            {loading ? (
                                                <div className="text-center py-5">
                                                    <div className="spinner-border" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                    <p className="mt-2">Loading bid data...</p>
                                                </div>
                                            ) : error ? (
                                                <div className="text-center text-danger py-5">
                                                    <i className="ri-error-warning-line fs-1 mb-3"></i>
                                                    <p>{error}</p>
                                                    <button className="btn btn-primary btn-sm" onClick={fetchBidData}>
                                                        Retry
                                                    </button>
                                                </div>
                                            ) : filteredBids && filteredBids.length ? (
                                                filteredBids.map(bid => (
                                                    <BidCard
                                                        key={bid.id}
                                                        bid={bid}
                                                        handleViewClick={() => handleViewClick(bid.biddingOrderNo)}
                                                        handleHistoryClick={() => handleHistoryClick(bid.biddingOrderNo)}
                                                        handleSoDetailsClick={() => fetchSoDetails(bid.biddingOrderNo)}
                                                    />
                                                ))
                                            ) : (
                                                <div className="text-center my-4">
                                                    <p>No bids found matching your search criteria.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* View Modal */}
                                    {/* <BidViewModal
                                        isOpen={viewModal}
                                        toggle={toggleView}
                                        viewData={viewData}
                                    /> */}

                                    {/* History Modal */}
                                    <BidHistoryModal
                                        isOpen={historyModal}
                                        toggle={toggleHistory}
                                        bidNo={selectedBidNo}
                                        bidData={viewData}
                                    />
                                    {/* SO Details Modal */}
                                    <Modal
                                        isOpen={soDetailsModal}
                                        toggle={toggleSoDetails}
                                        centered
                                        size="lg"
                                        className="so-details-modal"
                                    >
                                        <ModalHeader toggle={toggleSoDetails} className="border-0">
                                            <div className="d-flex">
                                                <h5 className="mb-0">SO Details: {selectedBidNo}</h5>
                                            </div>
                                        </ModalHeader>
                                        <ModalBody>
                                            {loadingSoDetails ? (
                                                <div className="text-center py-4">
                                                    <div className="spinner-border" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                    <p className="mt-2">Loading SO details...</p>
                                                </div>
                                            ) : soDetails.length > 0 ? (
                                                <>
                                                    <div className="mb-3">
                                                        <div className="search-box me-2">
                                                            <Input
                                                                type="text"
                                                                className="form-control search"
                                                                placeholder="Search..."
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="table-responsive">
                                                        <Table className="table align-middle table-nowrap mb-0">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th className="text-nowrap">Sales Order No.</th>
                                                                    <th className="text-nowrap">Validity Start Date</th>
                                                                    <th className="text-nowrap">Validity End Date</th>
                                                                    <th className="text-nowrap">Order Qty.</th>
                                                                    <th className="text-nowrap">Remaining Qty.</th>
                                                                    <th className="text-nowrap">Order Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {soDetails.map((so, index) => (
                                                                    <tr key={index}>
                                                                        <td className="text-nowrap">{so.soNumber}</td>
                                                                        <td className="text-nowrap">{formatSODate(so.validity)}</td>
                                                                        <td className="text-nowrap">{formatSODate(so.validity)}</td>
                                                                        <td className="text-nowrap">{so.quantity} MT</td>
                                                                        <td className="text-nowrap">{Math.floor(so.quantity * 0.3)} MT</td>
                                                                        <td className="text-nowrap">Ship</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                                        <div>Total Results: {soDetails.length}</div>
                                                        <div className="pagination-wrapper">
                                                            <button className="btn btn-sm btn-primary me-1">&lt;</button>
                                                            <span className="mx-2">Page 1 of 1</span>
                                                            <button className="btn btn-sm btn-primary">&gt;</button>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <p>No SO details found for this bid.</p>
                                                </div>
                                            )}
                                        </ModalBody>
                                    </Modal>
                                    <ToastContainer closeButton={false} limit={1} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ViewAllBids;