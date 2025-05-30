import React, { useState, useEffect, useMemo } from "react";
import { Container, Card, CardBody, Button, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Components
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SalesOrderModal from "./SalesOrderModal/SalesOrderModal";
import BidCard from "./BidCard/BidCard";
import CancelBidModal from "./CancelBidModal/CancelBidModal";
import BidConfirmationModal from "./BidConfirmationModal/BidConfirmationModal";

// Import Helpers
import { getLoginCode } from '../../../helpers/api_helper';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import "./DashBoard.css";

// =====================================================
// CONSTANTS
// =====================================================
const BID_STATUS = {
  TO_BE_START: "To Be Start",
  RUNNING: "Running",
  COMPLETED: "Completed",
  CANCEL_BID: "Cancel Bid"
};

const TEXT_LIMITS = {
  BID_NO: 12,
  MATERIAL: 10,
  CITY: 10,
  QTY: 8,
  ROUTE: 12
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Format date to display format
 */
const formatDate = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.warn('Invalid date:', dateString);
    return '';
  }
};

/**
 * Get bid status based on dates
 */
const getBidStatus = (bidFrom, bidTo) => {
  if (!bidFrom || !bidTo) return BID_STATUS.TO_BE_START;

  try {
    const now = new Date();
    const start = new Date(bidFrom);
    const end = new Date(bidTo);

    if (now < start) return BID_STATUS.TO_BE_START;
    if (now >= start && now <= end) return BID_STATUS.RUNNING;
    return BID_STATUS.COMPLETED;
  } catch (error) {
    console.warn('Date error:', error);
    return BID_STATUS.TO_BE_START;
  }
};

/**
 * Truncate text with ellipsis
 */
const truncateText = (text, maxLength = 15) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Create API headers with basic auth
 */
const getApiHeaders = () => {
  const username = process.env.REACT_APP_API_USER_NAME;
  const password = process.env.REACT_APP_API_PASSWORD;
  const basicAuth = 'Basic ' + btoa(username + ':' + password);

  return {
    'Content-Type': 'application/json',
    'Authorization': basicAuth
  };
};

// =====================================================
// MAIN COMPONENT
// =====================================================
const AuctionDashboard = () => {
  document.title = "Dashboard | EPLMS";

  // =====================================================
  // STATE
  // =====================================================
  const [bidData, setBidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginCode, setLoginCode] = useState('');

  // Modal states
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [isSalesOrderModalOpen, setIsSalesOrderModalOpen] = useState(false);
  const [selectedBidNo, setSelectedBidNo] = useState("");
  const [isCancelBidModalOpen, setIsCancelBidModalOpen] = useState(false);
  const [bidToCancel, setBidToCancel] = useState("");
  const [isBidConfirmationModalOpen, setIsBidConfirmationModalOpen] = useState(false);
  const [bidToConfirm, setBidToConfirm] = useState("");

  // =====================================================
  // API FUNCTIONS
  // =====================================================

  /**
   * Fetch bid data from API
   */
  const fetchBidData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/all`, {
        method: 'GET',
        headers: getApiHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        setBidData(responseData.data);
      } else {
        console.log('Unexpected API response:', responseData);
        setBidData([]);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError("Failed to fetch bid data. Please try again.");
      setBidData([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel bid API call
   */
  const handleCancelBid = async (bidNo, remark) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/cancelBidByBidNumber?bidNumber=${bidNo}&remarks=${encodeURIComponent(remark)}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': getApiHeaders().Authorization
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Bid ${bidNo} cancelled successfully`, result);

      // Refresh data
      fetchBidData();

      return {
        success: true,
        message: `Bid ${bidNo} cancelled successfully`
      };
    } catch (error) {
      console.error('Error cancelling bid:', error);
      return {
        success: false,
        message: error.message || 'Failed to cancel bid. Please try again.'
      };
    }
  };

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  const handleViewClick = (bidNo) => {
    setSelectedBidNo(bidNo);
    setIsSalesOrderModalOpen(true);
  };

  const handleCancelClick = (bidNo) => {
    setBidToCancel(bidNo);
    setIsCancelBidModalOpen(true);
  };

  const handleConfirmOrderClick = (bidNo) => {
    setBidToConfirm(bidNo);
    setIsBidConfirmationModalOpen(true);
  };

  // =====================================================
  // COMPONENT FUNCTIONS
  // =====================================================

  /**
   * Status Badge Component
   */
  const StatusBadge = ({ item }) => {
    const status = getBidStatus(item.bidFrom, item.bidTo);

    const getStatusClass = (status) => {
      switch (status) {
        case BID_STATUS.RUNNING: return "status-running";
        case BID_STATUS.TO_BE_START: return "status-to-be-start";
        case BID_STATUS.CANCEL_BID: return "status-cancel-bid";
        case BID_STATUS.COMPLETED: return "status-completed";
        default: return "";
      }
    };

    return (
      <div className="status-badge-container">
        <span className={`status-badge ${getStatusClass(status)}`}>
          {status}
        </span>
      </div>
    );
  };

  /**
   * Table Cell with truncation
   */
  const TableCell = ({ value, maxLength, title }) => (
    <div className="text-truncate-custom" title={title || value}>
      {truncateText(value, maxLength)}
    </div>
  );

  // =====================================================
  // TABLE CONFIGURATION
  // =====================================================

  const columns = useMemo(() => [
    {
      Header: "Bid Number",
      accessor: "biddingOrderNo",
      Cell: ({ value }) => (
        <TableCell value={value} maxLength={TEXT_LIMITS.BID_NO} />
      ),
      style: { whiteSpace: 'nowrap', minWidth: '120px' }
    },
    {
      Header: "Start Date/Time",
      accessor: "bidFrom",
      Cell: ({ value }) => (
        <TableCell value={formatDate(value)} title={formatDate(value)} />
      ),
      style: { whiteSpace: 'nowrap', minWidth: '140px' }
    },
    {
      Header: "End Date/Time",
      accessor: "bidTo",
      Cell: ({ value }) => (
        <TableCell value={formatDate(value)} title={formatDate(value)} />
      ),
      style: { whiteSpace: 'nowrap', minWidth: '140px' }
    },
    {
      Header: "Material",
      accessor: "material",
      Cell: ({ value }) => (
        <TableCell value={value} maxLength={TEXT_LIMITS.MATERIAL} />
      ),
      style: { whiteSpace: 'nowrap', minWidth: '100px' }
    },
    {
      Header: "City",
      accessor: "city",
      Cell: ({ value }) => (
        <TableCell value={value} maxLength={TEXT_LIMITS.CITY} />
      ),
      style: { whiteSpace: 'nowrap', minWidth: '100px' }
    },
    {
      Header: "Qty",
      accessor: "quantity",
      id: "qty",
      Cell: ({ row }) => {
        const qty = `${row.original.quantity || ''} ${row.original.uom || ''}`;
        return <TableCell value={qty} maxLength={TEXT_LIMITS.QTY} title={qty} />;
      },
      style: { whiteSpace: 'nowrap', minWidth: '80px' }
    },
    {
      Header: "Route",
      accessor: "fromLocation",
      id: "route",
      Cell: ({ row }) => {
        const route = `${row.original.fromLocation || ''} to ${row.original.toLocation || ''}`;
        return <TableCell value={route} maxLength={TEXT_LIMITS.ROUTE} title={route} />;
      },
      style: { whiteSpace: 'nowrap', minWidth: '120px' }
    },
    {
      Header: () => <span className="nowrap-header">Bulker&nbsp;Order</span>,
      accessor: "multiMaterial",
      id: "bulkerOrder",
      Cell: ({ value }) => (
        <div className="text-truncate-custom">
          {value === 1 ? "Yes" : "No"}
        </div>
      ),
      style: { whiteSpace: 'nowrap', minWidth: '90px' }
    },
    {
      Header: "Status",
      id: "status",
      Cell: ({ row }) => <StatusBadge item={row.original} />,
      style: { whiteSpace: 'nowrap', minWidth: '100px' }
    },
    {
      Header: "Action",
      id: "action",
      Cell: ({ row }) => {
        const status = getBidStatus(row.original.bidFrom, row.original.bidTo);
        const bidNo = row.original.biddingOrderNo;

        return (
          <div className="action-buttons-container">
            {/* View Button */}
            <Link
              to="#"
              className="action-icon"
              onClick={(e) => {
                e.preventDefault();
                handleViewClick(bidNo);
              }}
              title="View Details"
            >
              <i className="ri-eye-line"></i>
            </Link>

            {/* Cancel Button - Only for "To Be Start" status */}
            {status === BID_STATUS.TO_BE_START && (
              <Link
                to="#"
                className="action-icon action-icon-close"
                onClick={(e) => {
                  e.preventDefault();
                  handleCancelClick(bidNo);
                }}
                title="Cancel Bid"
              >
                <Icon path={mdiClose} size={0.8} color="#FF7072" />
              </Link>
            )}

            {/* Confirm Order Button - Only for "Completed" status */}
            {status === BID_STATUS.COMPLETED && (
              <Button
                size="sm"
                className="confirm-btn no-hover-effect"
                onClick={() => handleConfirmOrderClick(bidNo)}
                title="Confirm Order"
              >
                Confirm Order
              </Button>
            )}
          </div>
        );
      },
      disableSortBy: true,
      style: { whiteSpace: 'nowrap', minWidth: '120px' }
    }
  ], []);

  // =====================================================
  // EFFECTS
  // =====================================================

  useEffect(() => {
    // Fetch initial data
    fetchBidData();

    // Get login code
    const code = getLoginCode();
    if (code) {
      setLoginCode(code);
      console.log("Login code found in Auction Dashboard:", code);
    }
  }, []);

  // =====================================================
  // RENDER FUNCTIONS
  // =====================================================

  const renderLoadingState = () => (
    <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <p className="mt-2">Loading bid data...</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center text-danger py-5">
      <i className="ri-error-warning-line fs-1 mb-3"></i>
      <p>{error}</p>
      <Button color="primary" size="sm" onClick={fetchBidData}>
        Retry
      </Button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-5">
      <i className="ri-information-line fs-1 mb-3"></i>
      <p>No bid data available</p>
      <Button color="primary" size="sm" onClick={fetchBidData}>
        Refresh
      </Button>
    </div>
  );

  const renderTableContent = () => {
    if (loading) return renderLoadingState();
    if (error) return renderErrorState();
    if (bidData.length === 0) return renderEmptyState();

    return (
      <TableContainer
        columns={columns}
        data={bidData}
        isGlobalFilter={true}
        isAddUserList={false}
        customPageSize={5}
        isGlobalSearch={true}
        className="custom-header-css single-line-headers table-fixed-layout"
        SearchPlaceholder="Search for Bids..."
        theadClasses="th-no-wrap"
        headerWrapperClasses="table-header-override"
      />
    );
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <BreadCrumb title="Dashboard" pageTitle="Auction" />

          <div className="dashboard-container">
            {/* Header Section */}
            <Row className="dashboard-header align-items-center">
              <Col>
                <h4 className="dashboard-title">Dashboard</h4>
              </Col>
              <Col xs="auto">
                <Link to="/view-all-bids" className="view-all-link fw-bold">
                  <i className="ri-link me-1"></i> View All Bids
                </Link>
              </Col>
            </Row>

            {/* Bid Cards */}
            <div className="bid-cards-container">
              <BidCard />
            </div>

            {/* Table Card */}
            <Card className="table-card">
              <CardBody>
                <div className="table-responsive">
                  {renderTableContent()}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Modals */}
          {isExportCSV && (
            <ExportCSVModal
              isOpen={isExportCSV}
              toggle={() => setIsExportCSV(!isExportCSV)}
              data={bidData}
              fileName="auction_dashboard_export"
            />
          )}

          <SalesOrderModal
            isOpen={isSalesOrderModalOpen}
            toggle={() => setIsSalesOrderModalOpen(!isSalesOrderModalOpen)}
            bidNo={selectedBidNo}
          />

          <CancelBidModal
            isOpen={isCancelBidModalOpen}
            toggle={() => setIsCancelBidModalOpen(!isCancelBidModalOpen)}
            bidNo={bidToCancel}
            onCancelBid={handleCancelBid}
          />

          <BidConfirmationModal
            isOpen={isBidConfirmationModalOpen}
            toggle={() => setIsBidConfirmationModalOpen(!isBidConfirmationModalOpen)}
            bidNo={bidToConfirm || "BID-NE205-002"}
            loginCode={loginCode}
          />

          {/* Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AuctionDashboard;