//old code 
// import React, { useState, useEffect, useMemo } from "react";
// import { Container, Row, Col, Card, CardBody, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Badge } from "reactstrap";
// import { Link } from "react-router-dom";
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import TableContainer from "../../../Components/Common/TableContainer";
// import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
// import SalesOrderModal from "./SalesOrderModal/SalesOrderModal";
// import BidCard from "./BidCard/BidCard";
// import "./DashBoard.css";
// import { getLoginCode } from "../../../helpers/api_helper";

// // Import chart libraries
// import GaugeChart from 'react-gauge-chart';
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// // Modal Components
// const CancelBidModal = ({ isOpen, toggle, bidNo, onCancelBid }) => {
//   const [remark, setRemark] = useState("");

//   const handleCancelBid = () => {
//     onCancelBid(bidNo, remark);
//     setRemark("");
//     toggle();
//   };

//   return (
//     <Modal isOpen={isOpen} toggle={toggle} centered>
//       <ModalHeader toggle={toggle}>Cancel Bid</ModalHeader>
//       <ModalBody>
//         <Form>
//           <FormGroup>
//             <Label for="remark">Add Remark <span className="text-danger">*</span></Label>
//             <Input
//               type="textarea"
//               id="remark"
//               placeholder="Remark"
//               value={remark}
//               onChange={(e) => setRemark(e.target.value)}
//               rows={5}
//             />
//           </FormGroup>
//         </Form>
//       </ModalBody>
//       <ModalFooter>
//         <Button color="primary" onClick={handleCancelBid}>Cancel Bid</Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// const BidConfirmationModal = ({ isOpen, toggle, bidData, loginCode, bidNo }) => {
//   const [bidAmount, setBidAmount] = useState("");
//   const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [isValid, setIsValid] = useState(true);

//   // Calculate remaining time based on the bidTo date
//   useEffect(() => {
//     if (!bidData?.bidTo) return;

//     const calculateTimeRemaining = () => {
//       const now = new Date();
//       const endTime = new Date(bidData.bidTo);

//       if (now >= endTime) {
//         // Bid has ended
//         setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
//         return false;
//       }

//       const totalSeconds = Math.floor((endTime - now) / 1000);
//       const hours = Math.floor(totalSeconds / 3600);
//       const minutes = Math.floor((totalSeconds % 3600) / 60);
//       const seconds = totalSeconds % 60;

//       setTimeRemaining({ hours, minutes, seconds });
//       return true;
//     };

//     // Initial calculation
//     const hasTimeLeft = calculateTimeRemaining();

//     // Set up interval only if there's time left
//     if (hasTimeLeft) {
//       const timerId = setInterval(() => {
//         const stillHasTime = calculateTimeRemaining();
//         if (!stillHasTime) {
//           clearInterval(timerId);
//         }
//       }, 1000);

//       return () => clearInterval(timerId);
//     }
//   }, [bidData?.bidTo]);

//   const handleSubmitBid = async () => {
//     if (!bidAmount || isNaN(parseFloat(bidAmount))) {
//       setError("Please enter a valid bid amount");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       // Basic auth credentials (should be stored securely in a real app)
//       const credentials = btoa(`${process.env.REACT_APP_API_USER_NAME}:${process.env.REACT_APP_API_PASSWORD}`);

//       const payload = {
//         id: 0,
//         transBiddingOrdNo: "string", // This should be generated or fetched
//         transAmt: parseFloat(bidAmount),
//         logstAmt: 500, // This should be dynamically determined based on business logic
//         createdDateTime: new Date().toISOString(),
//         biddingOrderNo: bidData.biddingOrderNo,
//         transporterId: 0, // This should come from user context
//         transporterCode: loginCode, // Use loginCode from props
//         plantCode: "PLA-000001", // This should come from bidData or user context
//         status: "A"
//       };

//       const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/createBidding`, {
//         method: 'POST',
//         headers: {
//           'Accept': '*/*',
//           'Content-Type': 'application/json',
//           'Authorization': `Basic ${credentials}`
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Bid successfully created:", data);
//       setSuccess(true);

//       // Close the modal after 2 seconds
//       setTimeout(() => {
//         toggle();
//         // Reset state 
//         setBidAmount("");
//         setSuccess(false);
//       }, 2000);

//     } catch (err) {
//       console.error("Error creating bid:", err);
//       setError(`Failed to create bid: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Format timeRemaining for display
//   const formatTimeDigit = (digit) => {
//     return digit.toString().padStart(2, '0');
//   };
//   const handleBidAmountChange = (e) => {
//     const value = e.target.value;

//     // Allow empty field or numeric input with up to 2 decimal places
//     if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
//       setBidAmount(value);

//       // Check if the value is valid (positive number)
//       if (value === "" || parseFloat(value) <= 0) {
//         setIsValid(false);
//       } else {
//         setIsValid(true);
//         setError(null); // Clear any previous error
//       }
//     }
//     // Don't update state if input is invalid
//   };
//   return (
//     // <Modal isOpen={isOpen} toggle={toggle} centered size="sm" className="minimal-bid-modal">
//     //   <ModalHeader toggle={toggle} className="border-0 pb-0">
//     //     <h5 className="m-0">Bid : {bidData?.biddingOrderNo}</h5>
//     //   </ModalHeader>
//     //   <ModalBody className="pt-0 pb-3">
//     //     <div className="d-flex align-items-center mb-3 mt-1">
//     //       <div className="d-flex align-items-center">
//     //         <i className="ri-timer-line me-2"></i>
//     //         <span className="d-flex align-items-center">
//     //           {timeRemaining.hours > 0 && (
//     //             <>
//     //               <Badge color="dark" pill className="me-1">{formatTimeDigit(Math.floor(timeRemaining.hours / 10))}</Badge>
//     //               <Badge color="dark" pill className="me-1">{formatTimeDigit(timeRemaining.hours % 10)}</Badge>
//     //               <span className="mx-1">:</span>
//     //             </>
//     //           )}
//     //           <Badge color="dark" pill className="me-1">{formatTimeDigit(Math.floor(timeRemaining.minutes / 10))}</Badge>
//     //           <Badge color="dark" pill className="me-1">{formatTimeDigit(timeRemaining.minutes % 10)}</Badge>
//     //           <span className="mx-1">:</span>
//     //           <Badge color="dark" pill className="me-1">{formatTimeDigit(Math.floor(timeRemaining.seconds / 10))}</Badge>
//     //           <Badge color="dark" pill>{formatTimeDigit(timeRemaining.seconds % 10)}</Badge>
//     //         </span>
//     //       </div>
//     //       <span className="ms-2 text-muted small">Time Remaining</span>
//     //     </div>

//     //     <div className="input-group mb-3">
//     //       <span className="input-group-text">₹</span>
//     //       <input
//     //         type="text"
//     //         className="form-control"
//     //         placeholder="Enter Bid Amount"
//     //         value={bidAmount}
//     //         onChange={(e) => setBidAmount(e.target.value)}
//     //         disabled={loading || success}
//     //       />
//     //     </div>

//     //     {error && (
//     //       <div className="alert alert-danger py-2 mb-3">
//     //         {error}
//     //       </div>
//     //     )}

//     //     {success && (
//     //       <div className="alert alert-success py-2 mb-3">
//     //         Bid successfully submitted!
//     //       </div>
//     //     )}

//     //     <div className="d-flex justify-content-end">
//     //       <Button
//     //         color="primary"
//     //         onClick={handleSubmitBid}
//     //         disabled={loading || success || timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds === 0}
//     //       >
//     //         {loading ? (
//     //           <>
//     //             <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
//     //             Processing...
//     //           </>
//     //         ) : success ? "Bid Placed!" : "Start Bid"}
//     //       </Button>
//     //     </div>
//     //   </ModalBody>
//     // </Modal>
//     <Modal isOpen={isOpen} toggle={toggle} centered size="sm">
//       <div className="p-3">
//         {/* Header with close button */}
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="m-0">Bid : {bidData?.biddingOrderNo || "BID0006"}</h5>
//           <button
//             type="button"
//             className="btn-close"
//             onClick={toggle}
//             aria-label="Close"
//           ></button>
//         </div>

//         {/* Horizontal divider */}
//         <hr className="my-2" />

//         {/* Timer display - Improved layout */}
//         <div className="d-flex align-items-center mb-4">
//           <div className="d-flex align-items-center me-2">
//             <i className="ri-timer-line me-1"></i>
//           </div>

//           <div className="d-flex flex-column">
//             <div className="d-flex align-items-center">
//               <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
//                 {formatTimeDigit(Math.floor(timeRemaining.hours / 10))}
//               </Badge>
//               <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
//                 {formatTimeDigit(timeRemaining.hours % 10)}
//               </Badge>
//               <span className="mx-1">:</span>
//               <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
//                 {formatTimeDigit(Math.floor(timeRemaining.minutes / 10))}
//               </Badge>
//               <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
//                 {formatTimeDigit(timeRemaining.minutes % 10)}
//               </Badge>
//               <span className="mx-1">:</span>
//               <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
//                 {formatTimeDigit(Math.floor(timeRemaining.seconds / 10))}
//               </Badge>
//               <Badge color="dark" className="rounded-circle" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
//                 {formatTimeDigit(timeRemaining.seconds % 10)}
//               </Badge>
//             </div>
//             <div className="text-muted small mt-1">Time Remaining</div>
//           </div>
//         </div>

//         {/* Bid amount input */}
//         <div className="input-group mb-4">
//           <span className="input-group-text">₹</span>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Enter Bid Amount"
//             value={bidAmount}
//             onChange={handleBidAmountChange}
//             disabled={loading || success}
//           />
//         </div>

//         {/* Error message */}
//         {error && (
//           <div className="alert alert-danger py-2 mb-3">
//             {error}
//           </div>
//         )}

//         {/* Success message */}
//         {success && (
//           <div className="alert alert-success py-2 mb-3">
//             Bid successfully submitted!
//           </div>
//         )}

//         {/* Submit button */}
//         <div className="d-flex justify-content-end">
//           <Button
//             color="primary"
//             onClick={handleSubmitBid}
//             disabled={loading || success || !isValid || bidAmount === "" || (timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds === 0)}
//           >
//             {loading ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
//                 Processing...
//               </>
//             ) : success ? "Bid Placed!" : "Start Bid"}
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// // Improved Chart Components
// // Reusable panel component to match Figma design
// const DashboardPanel = ({ title, bgColor = '#3F51B5', children }) => {
//   return (
//     <Card className="border-0 shadow-sm h-100">
//       <CardBody className="pt-0">
//         <div className="text-white mb-4">
//           <div
//             className="rounded-pill py-2 px-4 d-inline-block"
//             style={{
//               background: bgColor,
//               position: 'relative',
          
//               fontWeight: '500'
//             }}
//           >
//             {title}
//           </div>
//         </div>
//         {children}
//       </CardBody>
//     </Card>
//   );
// };

// // Fleet Efficiency Chart - Improved styling to match Figma
// const FleetEfficiencyChart = ({ totalFleet, onTheMove }) => {
//   const percentage = totalFleet > 0 ? onTheMove / totalFleet : 0;

//   return (
//     <DashboardPanel title="Fleet Efficiency">
//       <div className="position-relative" style={{ height: '200px' }}>
//         <GaugeChart
//           id="fleet-gauge"
//           nrOfLevels={2}
//           colors={["#5B8DDE", "#EE5A52"]}
//           arcWidth={0.25}
//           percent={percentage}
//           arcPadding={0}
//           needleColor="#DC2626"
//           needleBaseColor="#1F2937"
//           hideText={true}
//           animate={true}
//           animDelay={0}
//           marginInPercent={0.03}
//           style={{ height: '100%' }}
//         />
//       </div>

//       <div className="d-flex justify-content-around mt-4">
//         <div className="text-center">
//           <div className="fw-bold" style={{ color: "#000000" }}>Total Fleet</div>
//           <div className="h3 mb-0 font-weight-bold text-dark">{totalFleet}</div>
//         </div>
//         <div className="text-center">
//           <div className="fw-bold" style={{ color: "#000000" }}>On the move</div>
//           <div className="h3 mb-0 font-weight-bold text-dark">{onTheMove}</div>
//         </div>
//       </div>
//     </DashboardPanel>
//   );
// };

// // Delivery Status Chart - Improved styling to match Figma
// const DeliveryStatusChart = ({ withInTimeLimit, outOFTimeLimit }) => {
//   const total = withInTimeLimit + outOFTimeLimit;
//   const percentage = total > 0 ? Math.round((withInTimeLimit / total) * 100) : 0;

//   const data = [
//     { value: withInTimeLimit, fill: '#4CAF50' },
//     { value: outOFTimeLimit, fill: '#E8F5E9' }
//   ];

//   return (
//     <DashboardPanel title="Delivery Status">
//       <div className="position-relative" style={{ height: '200px' }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               startAngle={90}
//               endAngle={450}
//               innerRadius={60}
//               outerRadius={80}
//               paddingAngle={0}
//               dataKey="value"
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.fill} />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>

//         <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
//           <div className="text-center">
//             <div className="h1 mb-0 font-weight-bold text-dark">{percentage}%</div>
//             <div className="small text-muted">With in<br />Time Limit</div>
//           </div>
//         </div>
//       </div>

//       <div className="d-flex justify-content-around mt-4">
//         <div className="text-center">
//           <div className="fw-bold mb-1" style={{ color: "#000000" }}>Within Time Limit</div>
//           <div className="h3 mb-0 font-weight-bold text-dark">{withInTimeLimit}</div>
//         </div>
//         <div className="text-center">
//           <div className="fw-bold mb-1" style={{ color: "#000000" }}>Out Of Limit</div>
//           <div className="h3 mb-0 font-weight-bold text-dark">{outOFTimeLimit}</div>
//         </div>
//       </div>
//     </DashboardPanel>
//   );
// };

// const BidStatusChart = ({ running, completed, notStarted }) => {
//   const total = running + completed + notStarted;

//   const data = [
//     { name: 'Running', value: running, color: '#FFC107' },
//     { name: 'Completed', value: completed, color: '#4CAF50' },
//     { name: 'Not Started', value: notStarted, color: '#9C27B0' }
//   ];

//   return (
//     <DashboardPanel title="Bid Status">
//       <div className="position-relative" style={{ height: '200px' }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius={60}
//               outerRadius={80}
//               paddingAngle={3}
//               dataKey="value"
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="d-flex justify-content-around mt-4">
//         {data.map((item, index) => (
//           <div key={index} className="text-center">
//             <div className="d-flex align-items-center justify-content-center mb-2">
//               <div
//                 className="rounded-circle me-2"
//                 style={{
//                   width: '12px',
//                   height: '12px',
//                   backgroundColor: item.color
//                 }}
//               ></div>
//               <span className="fw-bold" style={{ color: "#000000" }}>{item.name}</span>
//             </div>
//             <div className="h3 mb-0 font-weight-bold text-dark">
//               {total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%'}
//             </div>
//           </div>
//         ))}
//       </div>
//     </DashboardPanel>
//   );
// };

// const TransporterDashboard = () => {
//   document.title = "Dashboard | EPLMS";

//   const [bidData, setBidData] = useState([]);
//   const [isExportCSV, setIsExportCSV] = useState(false);
//   const [isSalesOrderModalOpen, setIsSalesOrderModalOpen] = useState(false);
//   const [selectedBidNo, setSelectedBidNo] = useState("");
//   const [isCancelBidModalOpen, setIsCancelBidModalOpen] = useState(false);
//   const [bidToCancel, setBidToCancel] = useState("");
//   const [isBidConfirmationModalOpen, setIsBidConfirmationModalOpen] = useState(false);
//   const [bidToConfirm, setBidToConfirm] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [bidStatusData, setBidStatusData] = useState({
//     running: 0,
//     completed: 0,
//     notStarted: 0
//   });
//   const [fleetEfficiencyData, setFleetEfficiencyData] = useState({
//     totalFleet: 0,
//     onTheMove: 0
//   });
//   const [deliveryStatusData, setDeliveryStatusData] = useState({
//     withInTimeLimit: 0,
//     outOFTimeLimit: 0
//   });
//   const [loginCode, setLoginCode] = useState('');

//   // Helper function to get basic auth credentials
//   const getBasicAuthCredentials = () => {
//     return btoa(`${process.env.REACT_APP_API_USER_NAME}:${process.env.REACT_APP_API_PASSWORD}`);
//   };

//   // Helper function to format date
//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Get status based on date comparison
//   const getStatus = (bidFrom, bidTo) => {
//     const now = new Date();
//     const start = new Date(bidFrom);
//     const end = new Date(bidTo);

//     if (now < start) return "To Be Start";
//     if (now >= start && now <= end) return "Running";
//     return "Completed";
//   };

//   // Fetch login code and data on component mount
//   useEffect(() => {
//     const userLoginCode = getLoginCode();
//     if (userLoginCode) {
//       setLoginCode(userLoginCode);
//       console.log("Login code found:", userLoginCode);
//     } else {
//       console.warn("Login code not found");
//     }

//     // Only fetch data after login code is set
//     if (userLoginCode) {
//       fetchBidStatusData(userLoginCode);
//       fetchFleetEfficiencyData(userLoginCode);
//       fetchDeliveryStatusData(userLoginCode);
//       fetchBidData(userLoginCode);
//     }
//   }, []);

//   const fetchFleetEfficiencyData = async (transporterCode) => {
//     try {
//       // Use the provided transporterCode or fall back to state loginCode
//       const codeToUse = transporterCode || loginCode;

//       if (!codeToUse) {
//         console.warn("No transporter code available for fleet efficiency data fetch");
//         return;
//       }

//       // Basic auth credentials
//       const credentials = getBasicAuthCredentials();

//       const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getFleetEfficiency?transporterCode=${codeToUse}`, {
//         method: 'GET',
//         headers: {
//           'Accept': '*/*',
//           'Content-Type': 'application/json',
//           'Authorization': `Basic ${credentials}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const jsonData = await response.json();

//       // Set fleet efficiency data
//       if (jsonData) {
//         setFleetEfficiencyData({
//           totalFleet: jsonData.totalFleet || 0,
//           onTheMove: jsonData.onTheMove || 0
//         });
//         console.log("Fleet efficiency data received:", jsonData);
//       } else {
//         console.log("Empty or invalid fleet efficiency data received");
//         setFleetEfficiencyData({
//           totalFleet: 0,
//           onTheMove: 0
//         });
//       }
//     } catch (err) {
//       console.error("Error fetching fleet efficiency data:", err);
//       setFleetEfficiencyData({
//         totalFleet: 0,
//         onTheMove: 0
//       });
//     }
//   };

//   const fetchDeliveryStatusData = async (transporterCode) => {
//     try {
//       // Use the provided transporterCode or fall back to state loginCode
//       const codeToUse = transporterCode || loginCode;

//       if (!codeToUse) {
//         console.warn("No transporter code available for delivery status data fetch");
//         return;
//       }

//       // Basic auth credentials
//       const credentials = getBasicAuthCredentials();

//       const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getDeliveryStatus?transporterCode=${codeToUse}`, {
//         method: 'GET',
//         headers: {
//           'Accept': '*/*',
//           'Content-Type': 'application/json',
//           'Authorization': `Basic ${credentials}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const jsonData = await response.json();

//       // Set delivery status data
//       if (jsonData) {
//         setDeliveryStatusData({
//           withInTimeLimit: jsonData.withInTimeLimit || 0,
//           outOFTimeLimit: jsonData.outOFTimeLimit || 0
//         });
//         console.log("Delivery status data received:", jsonData);
//       } else {
//         console.log("Empty or invalid delivery status data received");
//         setDeliveryStatusData({
//           withInTimeLimit: 0,
//           outOFTimeLimit: 0
//         });
//       }
//     } catch (err) {
//       console.error("Error fetching delivery status data:", err);
//       setDeliveryStatusData({
//         withInTimeLimit: 0,
//         outOFTimeLimit: 0
//       });
//     }
//   };

//   const fetchBidStatusData = async (transporterCode) => {
//     try {
//       // Use the provided transporterCode or fall back to state loginCode
//       const codeToUse = transporterCode || loginCode;

//       if (!codeToUse) {
//         console.warn("No transporter code available for bid status data fetch");
//         return;
//       }

//       // Basic auth credentials
//       const credentials = getBasicAuthCredentials();

//       const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getBidStatusByTransporterCode?transporterCode=${codeToUse}`, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': `Basic ${credentials}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const jsonData = await response.json();

//       // Check if response has the expected structure
//       if (jsonData && jsonData.body) {
//         setBidStatusData({
//           running: jsonData.body.running || 0,
//           completed: jsonData.body.completed || 0,
//           notStarted: jsonData.body.notStarted || 0
//         });
//         console.log("Bid status data received:", jsonData.body);
//       } else {
//         console.log("Empty or invalid data received:", jsonData);
//         setBidStatusData({
//           running: 0,
//           completed: 0,
//           notStarted: 0
//         });
//       }
//     } catch (err) {
//       console.error("Error fetching bid status data:", err);
//       setBidStatusData({
//         running: 0,
//         completed: 0,
//         notStarted: 0
//       });
//     }
//   };

//   // Fetch bid data from API
//   const fetchBidData = async (loginCode) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const credentials = getBasicAuthCredentials();

//       const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/getAllBidsByTransporterCode?transporterCode=${loginCode}`, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': `Basic ${credentials}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Check the content type of the response
//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`);
//       }

//       const jsonData = await response.json();

//       // Check if response has the expected structure (meta and data)
//       if (jsonData && jsonData.data && Array.isArray(jsonData.data)) {
//         // Set the data array from the nested structure
//         setBidData(jsonData.data);
//         console.log("Bid data received:", jsonData.data);
//       } else {
//         console.log("Empty or invalid data received:", jsonData);
//         setBidData([]);
//       }
//     } catch (err) {
//       console.error("Error fetching bid data:", err);
//       setError(`Failed to fetch bid data: ${err.message}`);
//       setBidData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Modal handlers
//   const handleViewClick = (bidNo) => {
//     setSelectedBidNo(bidNo);
//     setIsSalesOrderModalOpen(true);
//   };

//   const handleCancelClick = (bidNo) => {
//     setBidToCancel(bidNo);
//     setIsCancelBidModalOpen(true);
//   };

//   const handleBidClick = (bidData) => {
//     setBidToConfirm(bidData);
//     setIsBidConfirmationModalOpen(true);
//   };

//   const handleCancelBid = (bidNo, remark) => {
//     console.log(`Bid ${bidNo} cancelled with remark: ${remark}`);
//     // TODO: Add API call to cancel bid

//     // For demonstration purposes, refresh the bid data after cancellation
//     fetchBidData();
//   };

//   // Status badge component
//   const getStatusBadge = (item) => {
//     const status = getStatus(item.bidFrom, item.bidTo);
//     const statusColors = {
//       "Running": "primary",
//       "To Be Start": "warning",
//       "Completed": "success"
//     };

//     return (
//       <Badge color={statusColors[status] || "secondary"}>
//         {status}
//       </Badge>
//     );
//   };

//   // Table columns definition
//   const columns = useMemo(
//     () => [
//       {
//         Header: "Bid Number",
//         accessor: "biddingOrderNo",
//       },
//       {
//         Header: "Start Date/Time",
//         accessor: row => formatDate(row.bidFrom),
//       },
//       {
//         Header: "End Date/Time",
//         accessor: row => formatDate(row.bidTo),
//       },
//       {
//         Header: "Material",
//         accessor: "material",
//       },
//       {
//         Header: "City",
//         accessor: "city",
//       },
//       {
//         Header: "Qty",
//         accessor: row => `${row.quantity} ${row.uom}`,
//       },
//       {
//         Header: "Route",
//         accessor: row => `${row.route}`,
//       },
//       {
//         Header: "Bulker Order",
//         accessor: row => row.multiMaterial === 1 ? "Yes" : "No",
//       },
//       {
//         Header: "Status",
//         accessor: row => row,
//         Cell: ({ value }) => getStatusBadge(value),
//       },
//       {
//         Header: "Action",
//         Cell: ({ row }) => {
//           const status = getStatus(row.original.bidFrom, row.original.bidTo);
//           return (
//             <div className="d-flex gap-2">
//               <Link to="#" onClick={() => handleViewClick(row.original.biddingOrderNo)}>
//                 <i className="ri-eye-line fs-16"></i>
//               </Link>
//               {status === "To Be Start" && (
//                 <Link to="#" onClick={() => handleCancelClick(row.original.biddingOrderNo)}>
//                   <i className="ri-close-line fs-16 text-danger"></i>
//                 </Link>
//               )}
//               {status === "Running" && (
//                 <Button
//                   color="primary"
//                   size="sm"
//                   onClick={() => handleBidClick(row.original)}
//                 >
//                   Bid Now
//                 </Button>
//               )}
//             </div>
//           );
//         },
//         disableSortBy: true,
//       }
//     ],
//     []
//   );

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <BreadCrumb title="Dashboard" pageTitle="Transporter" />

//           <div className="dashboard-container">
//             {/* Header section */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h4>Dashboard</h4>
//               <div>
//                 <Link to="/view-all-transporter-bids" className="fw-bold">
//                   <i className="ri-link me-1"></i> View All My Bids
//                 </Link>
//               </div>
//             </div>

//             {/* Improved Chart Components Row */}
//             <Row className="mb-4">
//               <Col md={4}>
//                 <FleetEfficiencyChart
//                   totalFleet={fleetEfficiencyData.totalFleet}
//                   onTheMove={fleetEfficiencyData.onTheMove}
//                 />
//               </Col>
//               <Col md={4}>
//                 <DeliveryStatusChart
//                   withInTimeLimit={deliveryStatusData.withInTimeLimit}
//                   outOFTimeLimit={deliveryStatusData.outOFTimeLimit}
//                 />
//               </Col>
//               <Col md={4}>
//                 <BidStatusChart
//                   running={bidStatusData.running}
//                   completed={bidStatusData.completed}
//                   notStarted={bidStatusData.notStarted}
//                 />
//               </Col>
//             </Row>

//             {/* Bid Cards */}
//             <BidCard loginCode={loginCode} />

//             {/* Table */}
//             <Card>
//               <CardBody>
//                 {loading ? (
//                   <div className="text-center py-5">
//                     <div className="spinner-border" role="status" aria-hidden="true"></div>
//                     <p className="mt-2">Loading bid data...</p>
//                   </div>
//                 ) : error ? (
//                   <div className="text-center text-danger py-5">
//                     <i className="ri-error-warning-line fs-1 mb-3"></i>
//                     <p>{error}</p>
//                     <Button color="primary" size="sm" onClick={fetchBidData}>
//                       Retry
//                     </Button>
//                   </div>
//                 ) : bidData.length === 0 ? (
//                   <div className="text-center py-5">
//                     <i className="ri-information-line fs-1 mb-3"></i>
//                     <p>No bid data available</p>
//                     <Button color="primary" size="sm" onClick={fetchBidData}>
//                       Refresh
//                     </Button>
//                   </div>
//                 ) : (
//                   <TableContainer
//                     columns={columns}
//                     data={bidData}
//                     isGlobalFilter={true}
//                     isAddUserList={false}
//                     customPageSize={5}
//                     isGlobalSearch={true}
//                     SearchPlaceholder="Search for Bids..."
//                   />
//                 )}
//               </CardBody>
//             </Card>
//           </div>

//           {/* Modals */}
//           {isExportCSV && (
//             <ExportCSVModal
//               isOpen={isExportCSV}
//               toggle={() => setIsExportCSV(false)}
//               data={bidData}
//               fileName="auction_dashboard_export"
//             />
//           )}
//           <SalesOrderModal
//             isOpen={isSalesOrderModalOpen}
//             toggle={() => setIsSalesOrderModalOpen(false)}
//             bidNo={selectedBidNo}
//           />

//           <CancelBidModal
//             isOpen={isCancelBidModalOpen}
//             toggle={() => setIsCancelBidModalOpen(false)}
//             bidNo={bidToCancel}
//             onCancelBid={handleCancelBid}
//           />

//           <BidConfirmationModal
//             isOpen={isBidConfirmationModalOpen}
//             toggle={() => setIsBidConfirmationModalOpen(false)}
//             bidData={bidToConfirm}
//             loginCode={loginCode}
//           />
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default TransporterDashboard;



//latest code 
import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SalesOrderModal from "./SalesOrderModal/SalesOrderModal";
import BidCard from "./BidCard/BidCard";
import "./DashBoard.css";
import { getLoginCode } from "../../../helpers/api_helper";

// Import chart libraries
import GaugeChart from 'react-gauge-chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Modal Components
const CancelBidModal = ({ isOpen, toggle, bidNo, onCancelBid }) => {
  const [remark, setRemark] = useState("");

  const handleCancelBid = () => {
    onCancelBid(bidNo, remark);
    setRemark("");
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Cancel Bid</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="remark">Add Remark <span className="text-danger">*</span></Label>
            <Input
              type="textarea"
              id="remark"
              placeholder="Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={5}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleCancelBid}>Cancel Bid</Button>
      </ModalFooter>
    </Modal>
  );
};

const BidConfirmationModal = ({ isOpen, toggle, bidData, loginCode, bidNo }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // Calculate remaining time based on the bidTo date
  useEffect(() => {
    if (!bidData?.bidTo) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const endTime = new Date(bidData.bidTo);

      if (now >= endTime) {
        // Bid has ended
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        return false;
      }

      const totalSeconds = Math.floor((endTime - now) / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeRemaining({ hours, minutes, seconds });
      return true;
    };

    // Initial calculation
    const hasTimeLeft = calculateTimeRemaining();

    // Set up interval only if there's time left
    if (hasTimeLeft) {
      const timerId = setInterval(() => {
        const stillHasTime = calculateTimeRemaining();
        if (!stillHasTime) {
          clearInterval(timerId);
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [bidData?.bidTo]);

  const handleSubmitBid = async () => {
    if (!bidAmount || isNaN(parseFloat(bidAmount))) {
      setError("Please enter a valid bid amount");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Basic auth credentials (should be stored securely in a real app)
      const credentials = btoa(`${process.env.REACT_APP_API_USER_NAME}:${process.env.REACT_APP_API_PASSWORD}`);

      const payload = {
        id: 0,
        transBiddingOrdNo: "string", // This should be generated or fetched
        transAmt: parseFloat(bidAmount),
        logstAmt: 500, // This should be dynamically determined based on business logic
        createdDateTime: new Date().toISOString(),
        biddingOrderNo: bidData.biddingOrderNo,
        transporterId: 0, // This should come from user context
        transporterCode: loginCode, // Use loginCode from props
        plantCode: "PLA-000001", // This should come from bidData or user context
        status: "A"
      };

      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/createBidding`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Bid successfully created:", data);
      setSuccess(true);

      // Close the modal after 2 seconds
      setTimeout(() => {
        toggle();
        // Reset state 
        setBidAmount("");
        setSuccess(false);
      }, 2000);

    } catch (err) {
      console.error("Error creating bid:", err);
      setError(`Failed to create bid: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format timeRemaining for display
  const formatTimeDigit = (digit) => {
    return digit.toString().padStart(2, '0');
  };
  const handleBidAmountChange = (e) => {
    const value = e.target.value;

    // Allow empty field or numeric input with up to 2 decimal places
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setBidAmount(value);

      // Check if the value is valid (positive number)
      if (value === "" || parseFloat(value) <= 0) {
        setIsValid(false);
      } else {
        setIsValid(true);
        setError(null); // Clear any previous error
      }
    }
    // Don't update state if input is invalid
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="sm">
      <div className="p-3">
        {/* Header with close button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Bid : {bidData?.biddingOrderNo || "BID0006"}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={toggle}
            aria-label="Close"
          ></button>
        </div>

        {/* Horizontal divider */}
        <hr className="my-2" />

        {/* Timer display - Improved layout */}
        <div className="d-flex align-items-center mb-4">
          <div className="d-flex align-items-center me-2">
            <i className="ri-timer-line me-1"></i>
          </div>

          <div className="d-flex flex-column">
            <div className="d-flex align-items-center">
              <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
                {formatTimeDigit(Math.floor(timeRemaining.hours / 10))}
              </Badge>
              <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
                {formatTimeDigit(timeRemaining.hours % 10)}
              </Badge>
              <span className="mx-1">:</span>
              <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
                {formatTimeDigit(Math.floor(timeRemaining.minutes / 10))}
              </Badge>
              <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
                {formatTimeDigit(timeRemaining.minutes % 10)}
              </Badge>
              <span className="mx-1">:</span>
              <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
                {formatTimeDigit(Math.floor(timeRemaining.seconds / 10))}
              </Badge>
              <Badge color="dark" className="rounded-circle" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
                {formatTimeDigit(timeRemaining.seconds % 10)}
              </Badge>
            </div>
            <div className="text-muted small mt-1">Time Remaining</div>
          </div>
        </div>

        {/* Bid amount input */}
        <div className="input-group mb-4">
          <span className="input-group-text">₹</span>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Bid Amount"
            value={bidAmount}
            onChange={handleBidAmountChange}
            disabled={loading || success}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="alert alert-danger py-2 mb-3">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="alert alert-success py-2 mb-3">
            Bid successfully submitted!
          </div>
        )}

        {/* Submit button */}
        <div className="d-flex justify-content-end">
          <Button
            color="primary"
            onClick={handleSubmitBid}
            disabled={loading || success || !isValid || bidAmount === "" || (timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds === 0)}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : success ? "Bid Placed!" : "Start Bid"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Improved Chart Components
// Reusable panel component to match Figma design
const DashboardPanel = ({ title, bgColor = '#405189', children }) => {
  return (
    <Card className="border-0 shadow-sm h-100 dashboard-chart-card">
      <CardBody className="p-4">
        <div className="mb-4">
          <div
            className="dashboard-chart-title"
            style={{
              background: '#405189',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '50px',
              display: 'inline-block',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(64, 81, 137, 0.2)'
            }}
          >
            {title}
          </div>
        </div>
        {children}
      </CardBody>
    </Card>
  );
};

// Fleet Efficiency Chart - Updated to match Figma design
const FleetEfficiencyChart = ({ totalFleet, onTheMove }) => {
  const percentage = totalFleet > 0 ? onTheMove / totalFleet : 0;

  return (
    <DashboardPanel title="Fleet Efficiency" bgColor="#6C7DD2">
      <div className="fleet-efficiency-container">
        <div className="gauge-container position-relative d-flex justify-content-center mb-4">
          <div style={{ width: '200px', height: '120px' }}>
            <GaugeChart
              id="fleet-gauge"
              nrOfLevels={2}
              colors={["#5B8DDE", "#EE5A52"]}
              arcWidth={0.3}
              percent={percentage}
              arcPadding={0.02}
              needleColor="#2C3E50"
              needleBaseColor="#2C3E50"
              hideText={true}
              animate={true}
              animDelay={0}
              marginInPercent={0.02}
            />
          </div>
        </div>

        <div className="d-flex justify-content-around">
          <div className="text-center">
            <div className="fw-bold mb-1" style={{ color: "#333", fontSize: "14px", fontWeight: "700" }}>Total Fleet</div>
            <div className="h4 mb-0" style={{ color: "#2C3E50", fontWeight: "700" }}>{totalFleet}</div>
          </div>
          <div className="text-center">
            <div className="fw-bold mb-1" style={{ color: "#333", fontSize: "14px", fontWeight: "700" }}>On the move</div>
            <div className="h4 mb-0" style={{ color: "#2C3E50", fontWeight: "700" }}>{onTheMove}</div>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
};

// Delivery Status Chart - Updated to match Figma design
const DeliveryStatusChart = ({ withInTimeLimit, outOFTimeLimit }) => {
  const total = withInTimeLimit + outOFTimeLimit;
  const percentage = total > 0 ? Math.round((withInTimeLimit / total) * 100) : 0;

  const data = [
    { value: withInTimeLimit, fill: '#4CAF50' },
    { value: outOFTimeLimit, fill: '#E8F5E9' }
  ];

  return (
    <DashboardPanel title="Delivery Status" bgColor="#6C7DD2">
      <div className="delivery-status-container">
        <div className="position-relative d-flex justify-content-center mb-4" style={{ height: '140px' }}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={450}
                innerRadius={45}
                outerRadius={65}
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <div className="h2 mb-0" style={{ color: "#2C3E50", fontWeight: "bold" }}>{percentage}%</div>
              <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.2" }}>
                With in<br />Time Limit
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-around">
          <div className="text-center">
            <div className="fw-bold mb-1" style={{ color: "#333", fontSize: "14px" }}>Within Time Limit</div>
            <div className="h4 mb-0" style={{ color: "#2C3E50", fontWeight: "bold" }}>{withInTimeLimit}</div>
          </div>
          <div className="text-center">
            <div className="fw-bold mb-1" style={{ color: "#333", fontSize: "14px" }}>Out Of Limit</div>
            <div className="h4 mb-0" style={{ color: "#2C3E50", fontWeight: "bold" }}>{outOFTimeLimit}</div>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
};

// Bid Status Chart - Updated to match Figma design
const BidStatusChart = ({ running, completed, notStarted }) => {
  const total = running + completed + notStarted;

  const data = [
    { name: 'Running', value: running, color: '#FFC107' },
    { name: 'Completed', value: completed, color: '#4CAF50' },
    { name: 'Not Started', value: notStarted, color: '#9C27B0' }
  ];

  return (
    <DashboardPanel title="Bid Status" bgColor="#6C7DD2">
      <div className="bid-status-container">
        <div className="position-relative d-flex justify-content-center mb-4" style={{ height: '140px' }}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="d-flex justify-content-around flex-wrap">
          {data.map((item, index) => (
            <div key={index} className="text-center mb-2" style={{ minWidth: '80px' }}>
              <div className="d-flex align-items-center justify-content-center mb-1">
                <div
                  className="rounded-circle me-1"
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: item.color
                  }}
                ></div>
                <span style={{ fontSize: '12px', color: '#333', fontWeight: '700' }}>{item.name}</span>
              </div>
              <div className="h5 mb-0" style={{ color: "#2C3E50", fontWeight: "700" }}>
                {total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardPanel>
  );
};

const TransporterDashboard = () => {
  document.title = "Dashboard | EPLMS";

  const [bidData, setBidData] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [isSalesOrderModalOpen, setIsSalesOrderModalOpen] = useState(false);
  const [selectedBidNo, setSelectedBidNo] = useState("");
  const [isCancelBidModalOpen, setIsCancelBidModalOpen] = useState(false);
  const [bidToCancel, setBidToCancel] = useState("");
  const [isBidConfirmationModalOpen, setIsBidConfirmationModalOpen] = useState(false);
  const [bidToConfirm, setBidToConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidStatusData, setBidStatusData] = useState({
    running: 0,
    completed: 0,
    notStarted: 0
  });
  const [fleetEfficiencyData, setFleetEfficiencyData] = useState({
    totalFleet: 0,
    onTheMove: 0
  });
  const [deliveryStatusData, setDeliveryStatusData] = useState({
    withInTimeLimit: 0,
    outOFTimeLimit: 0
  });
  const [loginCode, setLoginCode] = useState('');

  // Helper function to get basic auth credentials
  const getBasicAuthCredentials = () => {
    return btoa(`${process.env.REACT_APP_API_USER_NAME}:${process.env.REACT_APP_API_PASSWORD}`);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status based on date comparison
  const getStatus = (bidFrom, bidTo) => {
    const now = new Date();
    const start = new Date(bidFrom);
    const end = new Date(bidTo);

    if (now < start) return "To Be Start";
    if (now >= start && now <= end) return "Running";
    return "Completed";
  };

  // Fetch login code and data on component mount
  useEffect(() => {
    const userLoginCode = getLoginCode();
    if (userLoginCode) {
      setLoginCode(userLoginCode);
      console.log("Login code found:", userLoginCode);
    } else {
      console.warn("Login code not found");
    }

    // Only fetch data after login code is set
    if (userLoginCode) {
      fetchBidStatusData(userLoginCode);
      fetchFleetEfficiencyData(userLoginCode);
      fetchDeliveryStatusData(userLoginCode);
      fetchBidData(userLoginCode);
    }
  }, []);

  const fetchFleetEfficiencyData = async (transporterCode) => {
    try {
      // Use the provided transporterCode or fall back to state loginCode
      const codeToUse = transporterCode || loginCode;

      if (!codeToUse) {
        console.warn("No transporter code available for fleet efficiency data fetch");
        return;
      }

      // Basic auth credentials
      const credentials = getBasicAuthCredentials();

      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getFleetEfficiency?transporterCode=${codeToUse}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();

      // Set fleet efficiency data
      if (jsonData) {
        setFleetEfficiencyData({
          totalFleet: jsonData.totalFleet || 0,
          onTheMove: jsonData.onTheMove || 0
        });
        console.log("Fleet efficiency data received:", jsonData);
      } else {
        console.log("Empty or invalid fleet efficiency data received");
        setFleetEfficiencyData({
          totalFleet: 0,
          onTheMove: 0
        });
      }
    } catch (err) {
      console.error("Error fetching fleet efficiency data:", err);
      setFleetEfficiencyData({
        totalFleet: 0,
        onTheMove: 0
      });
    }
  };

  const fetchDeliveryStatusData = async (transporterCode) => {
    try {
      // Use the provided transporterCode or fall back to state loginCode
      const codeToUse = transporterCode || loginCode;

      if (!codeToUse) {
        console.warn("No transporter code available for delivery status data fetch");
        return;
      }

      // Basic auth credentials
      const credentials = getBasicAuthCredentials();

      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getDeliveryStatus?transporterCode=${codeToUse}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();

      // Set delivery status data
      if (jsonData) {
        setDeliveryStatusData({
          withInTimeLimit: jsonData.withInTimeLimit || 0,
          outOFTimeLimit: jsonData.outOFTimeLimit || 0
        });
        console.log("Delivery status data received:", jsonData);
      } else {
        console.log("Empty or invalid delivery status data received");
        setDeliveryStatusData({
          withInTimeLimit: 0,
          outOFTimeLimit: 0
        });
      }
    } catch (err) {
      console.error("Error fetching delivery status data:", err);
      setDeliveryStatusData({
        withInTimeLimit: 0,
        outOFTimeLimit: 0
      });
    }
  };

  const fetchBidStatusData = async (transporterCode) => {
    try {
      // Use the provided transporterCode or fall back to state loginCode
      const codeToUse = transporterCode || loginCode;

      if (!codeToUse) {
        console.warn("No transporter code available for bid status data fetch");
        return;
      }

      // Basic auth credentials
      const credentials = getBasicAuthCredentials();

      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getBidStatusByTransporterCode?transporterCode=${codeToUse}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();

      // Check if response has the expected structure
      if (jsonData && jsonData.body) {
        setBidStatusData({
          running: jsonData.body.running || 0,
          completed: jsonData.body.completed || 0,
          notStarted: jsonData.body.notStarted || 0
        });
        console.log("Bid status data received:", jsonData.body);
      } else {
        console.log("Empty or invalid data received:", jsonData);
        setBidStatusData({
          running: 0,
          completed: 0,
          notStarted: 0
        });
      }
    } catch (err) {
      console.error("Error fetching bid status data:", err);
      setBidStatusData({
        running: 0,
        completed: 0,
        notStarted: 0
      });
    }
  };

  // Fetch bid data from API
  const fetchBidData = async (loginCode) => {
    try {
      setLoading(true);
      setError(null);
      const credentials = getBasicAuthCredentials();

      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/getAllBidsByTransporterCode?transporterCode=${loginCode}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check the content type of the response
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`);
      }

      const jsonData = await response.json();

      // Check if response has the expected structure (meta and data)
      if (jsonData && jsonData.data && Array.isArray(jsonData.data)) {
        // Set the data array from the nested structure
        setBidData(jsonData.data);
        console.log("Bid data received:", jsonData.data);
      } else {
        console.log("Empty or invalid data received:", jsonData);
        setBidData([]);
      }
    } catch (err) {
      console.error("Error fetching bid data:", err);
      setError(`Failed to fetch bid data: ${err.message}`);
      setBidData([]);
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleViewClick = (bidNo) => {
    setSelectedBidNo(bidNo);
    setIsSalesOrderModalOpen(true);
  };

  const handleCancelClick = (bidNo) => {
    setBidToCancel(bidNo);
    setIsCancelBidModalOpen(true);
  };

  const handleBidClick = (bidData) => {
    setBidToConfirm(bidData);
    setIsBidConfirmationModalOpen(true);
  };

  const handleCancelBid = (bidNo, remark) => {
    console.log(`Bid ${bidNo} cancelled with remark: ${remark}`);
    // TODO: Add API call to cancel bid

    // For demonstration purposes, refresh the bid data after cancellation
    fetchBidData();
  };

  // Status badge component
  const getStatusBadge = (item) => {
    const status = getStatus(item.bidFrom, item.bidTo);
    const statusColors = {
      "Running": "primary",
      "To Be Start": "warning",
      "Completed": "success"
    };

    return (
      <Badge color={statusColors[status] || "secondary"}>
        {status}
      </Badge>
    );
  };

  // Table columns definition
  const columns = useMemo(
    () => [
      {
        Header: "Bid Number",
        accessor: "biddingOrderNo",
      },
      {
        Header: "Start Date/Time",
        accessor: row => formatDate(row.bidFrom),
      },
      {
        Header: "End Date/Time",
        accessor: row => formatDate(row.bidTo),
      },
      
{
        Header: "Material",
        accessor: "material",
      },
      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "Qty",
        accessor: row => `${row.quantity} ${row.uom}`,
      },
      {
        Header: "Route",
        accessor: row => `${row.route}`,
      },
      {
        Header: "Bulker Order",
        accessor: row => row.multiMaterial === 1 ? "Yes" : "No",
      },
      {
        Header: "Status",
        accessor: row => row,
        Cell: ({ value }) => getStatusBadge(value),
      },
      {
        Header: "Action",
        Cell: ({ row }) => {
          const status = getStatus(row.original.bidFrom, row.original.bidTo);
          return (
            <div className="d-flex gap-2">
              <Link to="#" onClick={() => handleViewClick(row.original.biddingOrderNo)}>
                <i className="ri-eye-line fs-16"></i>
              </Link>
              {status === "To Be Start" && (
                <Link to="#" onClick={() => handleCancelClick(row.original.biddingOrderNo)}>
                  <i className="ri-close-line fs-16 text-danger"></i>
                </Link>
              )}
              {status === "Running" && (
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => handleBidClick(row.original)}
                >
                  Bid Now
                </Button>
              )}
            </div>
          );
        },
        disableSortBy: true,
      }
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Dashboard" pageTitle="Transporter" />

          <div className="dashboard-container">
            {/* Header section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Dashboard</h4>
            </div>

            {/* Improved Chart Components Row */}
            <Row className="mb-4">
              <Col md={4} className="mb-3">
                <FleetEfficiencyChart
                  totalFleet={fleetEfficiencyData.totalFleet}
                  onTheMove={fleetEfficiencyData.onTheMove}
                />
              </Col>
              <Col md={4} className="mb-3">
                <DeliveryStatusChart
                  withInTimeLimit={deliveryStatusData.withInTimeLimit}
                  outOFTimeLimit={deliveryStatusData.outOFTimeLimit}
                />
              </Col>
              <Col md={4} className="mb-3">
                <BidStatusChart
                  running={bidStatusData.running}
                  completed={bidStatusData.completed}
                  notStarted={bidStatusData.notStarted}
                />
              </Col>
            </Row>

            {/* View All My Bids link - positioned after charts */}
            <div className="d-flex justify-content-end mb-4">
              <div className="d-flex align-items-center">
                <i className="ri-link me-2" style={{ color: '#4069e6' }}></i>
                <Link 
                  to="/view-all-transporter-bids" 
                  className="text-decoration-none" 
                  style={{ 
                    color: '#4069e6', 
                    fontWeight: '700',
                    fontSize: '14px'
                  }}
                >
                  View All My Bids
                </Link>
              </div>
            </div>

            {/* Bid Cards */}
            <BidCard loginCode={loginCode} />

            {/* Table */}
            <Card>
              <CardBody>
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" role="status" aria-hidden="true"></div>
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
                ) : bidData.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="ri-information-line fs-1 mb-3"></i>
                    <p>No bid data available</p>
                    <Button color="primary" size="sm" onClick={fetchBidData}>
                      Refresh
                    </Button>
                  </div>
                ) : (
                  <TableContainer
                    columns={columns}
                    data={bidData}
                    isGlobalFilter={true}
                    isAddUserList={false}
                    customPageSize={5}
                    isGlobalSearch={true}
                    SearchPlaceholder="Search for Bids..."
                  />
                )}
              </CardBody>
            </Card>
          </div>

          {/* Modals */}
          {isExportCSV && (
            <ExportCSVModal
              isOpen={isExportCSV}
              toggle={() => setIsExportCSV(false)}
              data={bidData}
              fileName="auction_dashboard_export"
            />
          )}
          <SalesOrderModal
            isOpen={isSalesOrderModalOpen}
            toggle={() => setIsSalesOrderModalOpen(false)}
            bidNo={selectedBidNo}
          />

          <CancelBidModal
            isOpen={isCancelBidModalOpen}
            toggle={() => setIsCancelBidModalOpen(false)}
            bidNo={bidToCancel}
            onCancelBid={handleCancelBid}
          />

          <BidConfirmationModal
            isOpen={isBidConfirmationModalOpen}
            toggle={() => setIsBidConfirmationModalOpen(false)}
            bidData={bidToConfirm}
            loginCode={loginCode}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TransporterDashboard;