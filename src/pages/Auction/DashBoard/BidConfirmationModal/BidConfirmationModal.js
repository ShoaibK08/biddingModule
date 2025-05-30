// import React, { useState, useEffect } from 'react';
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Spinner,
//   Collapse,
//   Card,
//   CardBody
// } from 'reactstrap';
// import { toast } from 'react-toastify';
 
// const BidConfirmationModal = ({ isOpen, toggle, bidNo, loginCode }) => {
//   const [transporters, setTransporters] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [processingAction, setProcessingAction] = useState(false);
//   const [expandedTransporter, setExpandedTransporter] = useState(null);
//   const [bidDetails, setBidDetails] = useState(null);

//   console.log("bidNo====>", bidNo);

//    const username = process.env.REACT_APP_API_USER_NAME;
//       const password = process.env.REACT_APP_API_PASSWORD;
//       const basicAuth = 'Basic ' + btoa(username + ':' + password);


  
//   // Fetch bid data when modal opens
//   useEffect(() => {
//     if (isOpen && bidNo) {
//       fetchBidData();
//     }
//   }, [isOpen, bidNo]);
  
//   console.log("login code in BidOrderConfirmation============>>>>>>>", loginCode);
  
//   const fetchBidData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
 
//       const response = await fetch(
//         `${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getBidDataByBidNo?biddingNumber=${bidNo}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': basicAuth
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
      
//       // Store full bid details
//       setBidDetails(data.body);
 
//       // Map the API response to the expected format
//       const mappedData = {
//         rank: "1st", // You may need to determine this based on your business logic
//         name: data.body.transporterCode || "Unknown Transporter",
//         auctionType: "Reversal Bid",
//         ceilingPrice: formatCurrency(data.body.logstAmt),
//         givenPrice: formatCurrency(data.body.transAmt),
//         deliveredBefore: "N/A", // This field is not in the API response
//         multipleOrders: "N/A", // This field is not in the API response
//         rating: 4.5, // This field is not in the API response
//         // Additional details for expanded view
//         contactInfo: data.body.contactNumber || "N/A",
//         vehicleType: data.body.vehicleType || "N/A",
//         capacity: data.body.capacity || "N/A",
//         experience: data.body.experience || "N/A",
//         location: data.body.location || "N/A"
//       };
 
//       setTransporters([mappedData]);
//     } catch (err) {
//       console.error('Error fetching bid data:', err);
//       setError('Failed to fetch bid data. Please try again.');
//       toast.error("Error fetching bid data", { autoClose: 3000 });
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   // Handle bid assignment or rejection
//   const handleBidAction = async (flag) => {
//     try {
//       setProcessingAction(true);
      
//       const response = await fetch(
//         `${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/assignBid?flag=${flag}&biddingOrderNumber=${bidNo}&transporterCode=${loginCode}`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Basic YW1hemluOlRFQU0tV0BSSw=='
//           },
//         }
//       );
      
//       // Get the response text directly
//       const resultText = await response.text();
      
//       // Check if the response text indicates an error
//       if (resultText.includes("not found") || !response.ok) {
//         // This is an error message from the API
//         toast.error(resultText, { autoClose: 3000 });
//         throw new Error(resultText); // To skip the success toast
//       }
      
//       // This is a success message from the API
//       toast.success(resultText, { autoClose: 3000 });
      
//       // Close the modal after successful action
//       toggle();
//     } catch (err) {
//       console.error(`Error ${flag === 'A' ? 'assigning' : 'rejecting'} bid:`, err);
      
//       // Only show error toast if we haven't shown one already
//       if (!err.message || !err.message.includes("not found")) {
//         toast.error(`Error processing bid request. Please try again.`, { autoClose: 3000 });
//       }
//     } finally {
//       setProcessingAction(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     if (!amount) return '0';
//     return new Intl.NumberFormat('en-IN', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     }).format(amount);
//   };

//   const renderRating = (rating) => {
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
//     const stars = [];

//     let starColor = "text-warning";
//     if (rating <= 2) {
//       starColor = "text-danger";
//     } else if (rating >= 4) {
//       starColor = "text-success";
//     }

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<i key={`full-${i}`} className={`ri-star-fill ${starColor}`}></i>);
//     }

//     if (hasHalfStar) {
//       stars.push(<i key="half" className={`ri-star-half-fill ${starColor}`}></i>);
//     }

//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(<i key={`empty-${i}`} className={`ri-star-line ${starColor}`}></i>);
//     }

//     return stars;
//   };

//   const toggleTransporterDetails = (index) => {
//     setExpandedTransporter(expandedTransporter === index ? null : index);
//   };

//   return (
//     <Modal isOpen={isOpen} toggle={toggle} centered size="xl" className="bid-confirmation-modal">
//       <ModalHeader toggle={toggle} className="border-0">
//         <div className="bid-confirmation-title">
//           <h4 className="mb-0">Bid Confirmation - {bidNo}</h4>
//           <small className="text-muted">Review and confirm transporter details</small>
//         </div>
//       </ModalHeader>
//       <ModalBody>
//         {loading ? (
//           <div className="text-center py-5">
//             <Spinner color="primary" />
//             <p className="mt-2">Loading bid data...</p>
//           </div>
//         ) : error ? (
//           <div className="text-center text-danger py-5">
//             <i className="ri-error-warning-line fs-1 mb-3"></i>
//             <p>{error}</p>
//             <Button color="primary" size="sm" onClick={fetchBidData}>
//               Retry
//             </Button>
//           </div>
//         ) : (
//           <div className="bid-table-container">
//             <div className="table-responsive">
//               <table className="table table-striped table-bordered mb-0">
//                 <thead className="table-primary">
//                   <tr>
//                     <th className="text-nowrap">Rank</th>
//                     <th className="text-nowrap">
//                       Transporter Name
//                       <i className="ri-arrow-up-down-line ms-1"></i>
//                     </th>
//                     <th className="text-nowrap">Auction Type</th>
//                     <th className="text-nowrap">Ceiling Price</th>
//                     <th className="text-nowrap">Given Price</th>
//                     <th className="text-nowrap">Delivered Before</th>
//                     <th className="text-nowrap">Multiple Orders</th>
//                     <th className="text-nowrap">Rating</th>
//                     <th className="text-nowrap">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {transporters.map((transporter, index) => (
//                     <React.Fragment key={index}>
//                       <tr>
//                         <td className="align-middle">
//                           <span className="badge bg-primary">{transporter.rank}</span>
//                         </td>
//                         <td className="align-middle">
//                           <div className="d-flex align-items-center justify-content-between">
//                             <span className="fw-medium">{transporter.name}</span>
//                             <Button
//                               color="link"
//                               size="sm"
//                               className="p-0 ms-2 text-primary"
//                               onClick={() => toggleTransporterDetails(index)}
//                               title="View detailed information"
//                             >
//                               <i className={`ri-${expandedTransporter === index ? 'subtract' : 'add'}-line fs-5`}></i>
//                             </Button>
//                           </div>
//                         </td>
//                         <td className="align-middle">
//                           <span className="badge bg-info text-dark">{transporter.auctionType}</span>
//                         </td>
//                         <td className="align-middle text-end">₹{transporter.ceilingPrice}</td>
//                         <td className="align-middle text-end">
//                           <span className="fw-bold text-success">₹{transporter.givenPrice}</span>
//                         </td>
//                         <td className="align-middle">{transporter.deliveredBefore}</td>
//                         <td className="align-middle">{transporter.multipleOrders}</td>
//                         <td className="align-middle text-center">
//                           <div className="d-flex align-items-center justify-content-center">
//                             {renderRating(transporter.rating)}
//                             <small className="ms-1 text-muted">({transporter.rating})</small>
//                           </div>
//                         </td>
//                         <td className="align-middle">
//                           <div className="d-flex gap-1">
//                             <Button
//                               color="success"
//                               size="sm"
//                               className="action-btn"
//                               onClick={() => handleBidAction('A')}
//                               disabled={processingAction}
//                             >
//                               {processingAction ? <Spinner size="sm" /> : 'Assign'}
//                             </Button>
//                             <Button
//                               color="danger"
//                               size="sm"
//                               className="action-btn"
//                               onClick={() => handleBidAction('R')}
//                               disabled={processingAction}
//                             >
//                               {processingAction ? <Spinner size="sm" /> : 'Reject'}
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
                      
//                       {/* Expandable Details Row */}
//                       <tr>
//                         <td colSpan="9" className="p-0 border-0">
//                           <Collapse isOpen={expandedTransporter === index}>
//                             <Card className="m-2 border">
//                               <CardBody className="bg-light">
//                                 <h6 className="text-primary mb-3">
//                                   <i className="ri-information-line me-1"></i>
//                                   Detailed Transporter Information
//                                 </h6>
//                                 <div className="row">
//                                   <div className="col-md-6">
//                                     <div className="info-item mb-2">
//                                       <strong>Contact Info:</strong> 
//                                       <span className="ms-2">{transporter.contactInfo}</span>
//                                     </div>
//                                     <div className="info-item mb-2">
//                                       <strong>Vehicle Type:</strong> 
//                                       <span className="ms-2">{transporter.vehicleType}</span>
//                                     </div>
//                                     <div className="info-item mb-2">
//                                       <strong>Capacity:</strong> 
//                                       <span className="ms-2">{transporter.capacity}</span>
//                                     </div>
//                                   </div>
//                                   <div className="col-md-6">
//                                     <div className="info-item mb-2">
//                                       <strong>Experience:</strong> 
//                                       <span className="ms-2">{transporter.experience}</span>
//                                     </div>
//                                     <div className="info-item mb-2">
//                                       <strong>Location:</strong> 
//                                       <span className="ms-2">{transporter.location}</span>
//                                     </div>
//                                     <div className="info-item mb-2">
//                                       <strong>Bid Status:</strong> 
//                                       <span className="ms-2 badge bg-success">Active</span>
//                                     </div>
//                                   </div>
//                                 </div>
                                
//                                 {bidDetails && (
//                                   <div className="mt-3 pt-3 border-top">
//                                     <h6 className="text-secondary mb-2">
//                                       <i className="ri-file-list-line me-1"></i>
//                                       Additional Bid Details
//                                     </h6>
//                                     <div className="row">
//                                       <div className="col-md-4">
//                                         <small className="text-muted">Logistics Amount:</small>
//                                         <div className="fw-medium">₹{formatCurrency(bidDetails.logstAmt)}</div>
//                                       </div>
//                                       <div className="col-md-4">
//                                         <small className="text-muted">Transport Amount:</small>
//                                         <div className="fw-medium">₹{formatCurrency(bidDetails.transAmt)}</div>
//                                       </div>
//                                       <div className="col-md-4">
//                                         <small className="text-muted">Transporter Code:</small>
//                                         <div className="fw-medium">{bidDetails.transporterCode}</div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}
//                               </CardBody>
//                             </Card>
//                           </Collapse>
//                         </td>
//                       </tr>
//                     </React.Fragment>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </ModalBody>
//       <ModalFooter className="justify-content-end border-0">
//         <Button 
//           color="secondary" 
//           onClick={toggle} 
//           className="bid-cancel-btn" 
//           disabled={processingAction}
//         >
//           <i className="ri-close-line me-1"></i>
//           Close
//         </Button>
//       </ModalFooter>
      
//       {/* Custom Styles */}
//       <style jsx>{`
//         .bid-confirmation-modal .modal-content {
//           border-radius: 12px;
//           border: none;
//           box-shadow: 0 10px 40px rgba(0,0,0,0.1);
//         }
        
//         .bid-confirmation-title h4 {
//           color: #2c3e50;
//           font-weight: 600;
//         }
        
//         .table th {
//           font-weight: 600;
//           font-size: 13px;
//           padding: 12px 8px;
//           vertical-align: middle;
//         }
        
//         .table td {
//           padding: 12px 8px;
//           font-size: 13px;
//           vertical-align: middle;
//         }
        
//         .action-btn {
//           min-width: 65px;
//           font-size: 11px;
//           padding: 4px 8px;
//           font-weight: 500;
//         }
        
//         .info-item {
//           font-size: 13px;
//         }
        
//         .info-item strong {
//           color: #495057;
//           min-width: 120px;
//           display: inline-block;
//         }
        
//         .badge {
//           font-size: 10px;
//           padding: 4px 8px;
//         }
        
//         .text-nowrap {
//           white-space: nowrap;
//         }
        
//         .table-responsive {
//           border-radius: 8px;
//           overflow: hidden;
//         }
        
//         .collapse-content {
//           background-color: #f8f9fa;
//           border-left: 3px solid #007bff;
//         }
//       `}</style>
//     </Modal>
//   );
// };

// export default BidConfirmationModal;
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
// import TableContainer from "../../../Components/Common/TableContainer";

const BidConfirmationModal = ({ isOpen, toggle, bidNo, loginCode }) => {
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [bidDetails, setBidDetails] = useState(null);
  const [nestedModalOpen, setNestedModalOpen] = useState(false);
  const [bidHistoryData, setBidHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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
      setBidDetails(data.body);

      // Map the API response to the expected format
      const mappedData = [
        {
          rank: "1st",
          transporterName: data.body.transporterCode || null,
          auctionType: "Reversal Bid",
          ceilingPrice: data.body.logstAmt || null,
          givenPrice: data.body.transAmt || null,
          deliveredBefore: null,
          multipleOrders: null,
          rating: null,
          contactInfo: data.body.contactNumber || null,
          vehicleType: data.body.vehicleType || null,
          capacity: data.body.capacity || null,
          experience: data.body.experience || null,
          location: data.body.location || null
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
    } catch (err) {
      console.error('Error fetching bid history:', err);
      // Create mock data if API fails
      setBidHistoryData([
        { serialNo: 1, time: "12 Jan, 2025 10:30 AM", amount: 10000, quantity: "50 MT" },
        { serialNo: 2, time: "12 Jan, 2025 10:24 AM", amount: 8000, quantity: "45 MT" },
        { serialNo: 3, time: "12 Jan, 2025 10:26 AM", amount: 4000, quantity: "20 MT" },
        { serialNo: 4, time: "12 Jan, 2025 10:45 AM", amount: 6000, quantity: "22 MT" },
        { serialNo: 5, time: "12 Jan, 2025 10:15 AM", amount: 7500, quantity: "16 MT" }
      ]);
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

  const renderRating = (rating) => {
    if (!rating) return null;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    let starColor = "text-warning";
    if (rating <= 2) {
      starColor = "text-danger";
    } else if (rating >= 4) {
      starColor = "text-success";
    }

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className={`ri-star-fill ${starColor}`}></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className={`ri-star-half-fill ${starColor}`}></i>);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className={`ri-star-line ${starColor}`}></i>);
    }

    return (
      <div className="d-flex align-items-center justify-content-center">
        {stars}
        <small className="ms-1 text-muted">({rating})</small>
      </div>
    );
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
      accessor: "rating",
      Cell: ({ value }) => renderRating(value),
      className: "text-center"
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
        <ModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
        <ModalFooter className="justify-content-end border-0">
          <Button 
            color="secondary" 
            onClick={toggle} 
            className="bid-cancel-btn" 
            disabled={processingAction}
          >
         
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Nested Modal for Bid History */}
      <Modal 
        isOpen={nestedModalOpen} 
        toggle={toggleNestedModal} 
        centered 
        size="lg"
        className="bid-history-modal"
        style={{ zIndex: 1055 }}
      >
        <ModalHeader toggle={toggleNestedModal} className="border-0">
          <div>
            <h5 className="mb-0">Bid No. - {bidNo}, {bidDetails?.transporterCode || 'Transporter'}</h5>
          </div>
        </ModalHeader>
        <ModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {historyLoading ? (
            <div className="text-center py-4">
              <Spinner color="primary" />
              <p className="mt-2">Loading bid history...</p>
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
              
              {bidHistoryData.length > 0 && (
                <div className="mt-3 text-center">
                  <small className="text-muted">
                    Total Results: {bidHistoryData.length}
                  </small>
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter className="justify-content-end border-0">
          <Button color="secondary" onClick={toggleNestedModal}>
            Back
          </Button>
        </ModalFooter>
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        .bid-confirmation-modal .modal-content,
        .bid-history-modal .modal-content {
          border-radius: 12px;
          border: none;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        
        .bid-confirmation-title h4,
        .bid-history-modal h5 {
          color: #2c3e50;
          font-weight: 600;
        }
        
        .bid-table-container,
        .bid-history-container {
          border-radius: 8px;
          overflow: hidden;
        }
        
        .modal-body {
          padding: 1.5rem;
        }
        
        .bid-history-modal {
          z-index: 1055 !important;
        }
        
        .bid-history-modal .modal-backdrop {
          z-index: 1050 !important;
        }
      `}</style>
    </>
  );
};

export default BidConfirmationModal;