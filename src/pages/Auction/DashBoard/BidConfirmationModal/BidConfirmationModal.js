import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Badge
} from 'reactstrap';
import { toast } from 'react-toastify';
import TableContainer from "../../../../Components/Common/TableContainer"
 
const BidConfirmationModal = ({ isOpen, toggle, bidNo, loginCode }) => {
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [bidDetails, setBidDetails] = useState(null);
  const [nestedModalOpen, setNestedModalOpen] = useState(false);
  const [bidHistoryData, setBidHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
 
  console.log("bidNo====>", bidNo);
 
  const username = process.env.REACT_APP_API_USER_NAME;
  const password = process.env.REACT_APP_API_PASSWORD;
  const basicAuth = 'Basic ' + btoa(username + ':' + password);
 
  // Fetch bid data when modal opens
  useEffect(() => {
    if (isOpen && bidNo) {
      fetchBidData();
    }
  }, [isOpen, bidNo]);
 
  console.log("login code in BidOrderConfirmation============>>>>>>>", loginCode);
 
  const fetchBidData = async () => {
    try {
      setLoading(true);
      setError(null);
 
      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getBidDataByBidNo?biddingNumber=${bidNo}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': basicAuth
          }
        }
      );
 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
 
      const data = await response.json();
     
      // Check if data.body exists and has required fields
      if (!data.body || !data.body.transporterCode) {
        setTransporters([]);
        return;
      }
 
      setBidDetails(data.body);
 
      // Map the API response to the expected format
      const mappedData = [
        {
          transporterName: data.body.transporterCode,
          auctionType: data.body.auctionType || "N/A",
          ceilingPrice: data.body.logstAmt,
          givenPrice: data.body.transAmt,
          deliveredBefore: data.body.deliveredBefore || "N/A",
          multipleOrders: data.body.multipleOrders || "N/A",
          rating: data.body.rating || "N/A",
          contactInfo: data.body.contactNumber || "N/A",
          vehicleType: data.body.vehicleType || "N/A",
          capacity: data.body.capacity || "N/A",
          experience: data.body.experience || "N/A",
          location: data.body.location || "N/A"
        }
      ];
 
      setTransporters(mappedData);
    } catch (err) {
      console.error('Error fetching bid data:', err);
      setError('Failed to fetch bid data. Please try again.');
      toast.error("Error fetching bid data", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };
 
  // Fetch bid history for nested modal
  const fetchBidHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);
     
      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getBidHistory?biddingNumber=${bidNo}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': basicAuth
          }
        }
      );
 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
 
      const data = await response.json();
     
      // Map history data - adjust based on actual API response structure
      const historyData = data.body?.map((item, index) => ({
        serialNo: index + 1,
        time: item.timestamp || null,
        amount: item.amount || null,
        quantity: item.quantity || null
      })) || [];
 
      setBidHistoryData(historyData);
     
      // If no data returned, keep empty array (no fallback data)
      if (historyData.length === 0) {
        setBidHistoryData([]);
      }
    } catch (err) {
      console.error('Error fetching bid history:', err);
      setHistoryError('Failed to fetch bid history. Please try again.');
      setBidHistoryData([]); // Set empty array instead of dummy data
    } finally {
      setHistoryLoading(false);
    }
  };
 
  // Handle bid assignment or rejection
  const handleBidAction = async (flag) => {
    try {
      setProcessingAction(true);
 
      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/assignBid?flag=${flag}&biddingOrderNumber=${bidNo}&transporterCode=${loginCode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': basicAuth
          },
        }
      );
 
      const resultText = await response.text();
 
      if (resultText.includes("not found") || !response.ok) {
        toast.error(resultText, { autoClose: 3000 });
        throw new Error(resultText);
      }
 
      toast.success(resultText, { autoClose: 3000 });
      toggle();
    } catch (err) {
      console.error(`Error ${flag === 'A' ? 'assigning' : 'rejecting'} bid:`, err);
 
      if (!err.message || !err.message.includes("not found")) {
        toast.error(`Error processing bid request. Please try again.`, { autoClose: 3000 });
      }
    } finally {
      setProcessingAction(false);
    }
  };
 
  const formatCurrency = (amount) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
 
  const handleNestedModalOpen = () => {
    setNestedModalOpen(true);
    fetchBidHistory();
  };
 
  const toggleNestedModal = () => {
    setNestedModalOpen(!nestedModalOpen);
  };
 
  // Define columns for main bid confirmation table
  const mainTableColumns = [
    {
      Header: "Rank",
      accessor: "rank",
      Cell: ({ value }) => <Badge color="primary">{value || null}</Badge>
    },
    {
      Header: () => (
        <div className="d-flex align-items-center">
          Transporter Name
          <i className="ri-arrow-up-down-line ms-1"></i>
        </div>
      ),
      accessor: "transporterName",
      Cell: ({ value, row }) => (
        <div className="d-flex align-items-center justify-content-between">
          <span className="fw-medium">{value || null}</span>
          <Button
            color="link"
            size="sm"
            className="p-0 ms-2 text-primary"
            onClick={handleNestedModalOpen}
            title="View bid history"
          >
            <i className="ri-add-line fs-5"></i>
          </Button>
        </div>
      )
    },
    {
      Header: "Auction Type",
      accessor: "auctionType",
      Cell: ({ value }) => value ? <Badge color="info">{value}</Badge> : null
    },
    {
      Header: "Ceiling Price",
      accessor: "ceilingPrice",
      Cell: ({ value }) => value ? `₹${formatCurrency(value)}` : null,
      className: "text-end"
    },
    {
      Header: "Given Price",
      accessor: "givenPrice",
      Cell: ({ value }) => value ? (
        <span className="fw-bold text-success">₹{formatCurrency(value)}</span>
      ) : null,
      className: "text-end"
    },
    {
      Header: "Delivered Before",
      accessor: "deliveredBefore"
    },
    {
      Header: "Multiple Orders",
      accessor: "multipleOrders"
    },
    {
      Header: "Rating",
      accessor: "rating"
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: () => (
        <div className="d-flex gap-1">
          <Button
            color="success"
            size="sm"
            onClick={() => handleBidAction('A')}
            disabled={processingAction}
          >
            {processingAction ? <Spinner size="sm" /> : 'Assign'}
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={() => handleBidAction('R')}
            disabled={processingAction}
          >
            {processingAction ? <Spinner size="sm" /> : 'Reject'}
          </Button>
        </div>
      ),
      disableSortBy: true
    }
  ];
 
  // Define columns for bid history table
  const historyTableColumns = [
    {
      Header: "Serial No",
      accessor: "serialNo"
    },
    {
      Header: "Time",
      accessor: "time"
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({ value }) => value ? formatCurrency(value) : null
    },
    {
      Header: "Quantity",
      accessor: "quantity"
    }
  ];
 
  return (
    <>
      {/* Main Modal */}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered
        size="xl"
        className="bid-confirmation-modal"
      >
        <ModalHeader toggle={toggle} className="border-0">
          <div className="bid-confirmation-title">
            <h4 className="mb-0">Bid Confirmation - {bidNo}</h4>
            <small className="text-muted">Review and confirm transporter details</small>
          </div>
        </ModalHeader>
        <ModalBody className="overflow-auto" style={{ maxHeight: '70vh' }}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
              <p className="mt-2">Loading bid data...</p>
            </div>
          ) : error ? (
            <div className="text-center text-danger py-5">
              <i className="ri-error-warning-line fs-1 mb-3"></i>
              <p>{error}</p>
              <Button color="primary" size="sm" onClick={fetchBidData}>
                Retry
              </Button>
            </div>
          ) : transporters.length === 0 ? (
            <div className="text-center py-5">
              <i className="ri-file-search-line fs-1 mb-3 text-muted"></i>
              <p>No data found for this bid number</p>
            </div>
          ) : (
            <div className="bid-table-container">
              <TableContainer
                columns={mainTableColumns}
                data={transporters}
                isGlobalFilter={true}
                isAddUserList={false}
                customPageSize={5}
                isGlobalSearch={true}
                className="custom-header-css single-line-headers table-fixed-layout"
                SearchPlaceholder="Search for transporters..."
                theadClasses="th-no-wrap"
                headerWrapperClasses="table-header-override"
              />
            </div>
          )}
        </ModalBody>
      </Modal>
 
      {/* Nested Modal for Bid History */}
      <Modal
        isOpen={nestedModalOpen}
        toggle={toggleNestedModal}
        centered
        size="lg"
        className="bid-history-modal"
      >
        <ModalHeader toggle={toggleNestedModal} className="border-0">
          <div>
            <h5 className="mb-0">Bid No. - {bidNo}, {bidDetails?.transporterCode || 'Transporter'}</h5>
          </div>
        </ModalHeader>
        <ModalBody className="overflow-auto" style={{ maxHeight: '60vh' }}>
          {historyLoading ? (
            <div className="text-center py-4">
              <Spinner color="primary" />
              <p className="mt-2">Loading bid history...</p>
            </div>
          ) : historyError ? (
            <div className="text-center text-danger py-5">
              <i className="ri-error-warning-line fs-1 mb-3"></i>
              <p>{historyError}</p>
              <Button color="primary" size="sm" onClick={fetchBidHistory}>
                Retry
              </Button>
            </div>
          ) : bidHistoryData.length === 0 ? (
            <div className="text-center py-5">
              <i className="ri-file-list-line fs-1 mb-3 text-muted"></i>
              <p className="text-muted">No bid history data found</p>
            </div>
          ) : (
            <div className="bid-history-container">
              <TableContainer
                columns={historyTableColumns}
                data={bidHistoryData}
                isGlobalFilter={false}
                isAddUserList={false}
                customPageSize={10}
                isGlobalSearch={false}
                className="custom-header-css single-line-headers"
                theadClasses="th-no-wrap"
                headerWrapperClasses="table-header-override"
              />
                
              <div className="mt-3 text-center">
                <small className="text-muted">
                  Total Results: {bidHistoryData.length}
                </small>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="justify-content-end border-0">
          <Button color="secondary" onClick={toggleNestedModal}>
            Back
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
 
export default BidConfirmationModal;
 