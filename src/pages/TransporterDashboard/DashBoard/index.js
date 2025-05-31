








//latest code 
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Container, Row, Col, Card, CardBody, Modal, ModalHeader, ModalFooter, Form, FormGroup, Label,
//   ModalBody,
//   Button,
//   Badge,
//   InputGroup,
//   InputGroupText,
//   Input,
//   Alert, Spinner
// } from "reactstrap";
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


// const BidConfirmationModal = ({ isOpen, toggle, bidData, loginCode, bidNo, plantcode }) => {
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
//       // Convert everything to minutes and seconds (no hours)
//       const totalMinutes = Math.floor(totalSeconds / 60);
//       const seconds = totalSeconds % 60;

//       setTimeRemaining({ hours: 0, minutes: totalMinutes, seconds });
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
//       const credentials = btoa(`${process.env.REACT_APP_API_USER_NAME}:${process.env.REACT_APP_API_PASSWORD}`);

//       const payload = {
//         transBiddingOrdNo: bidData?.transBiddingOrdNo || "",
//         transAmt: parseFloat(bidAmount),
//         logstAmt: bidData?.logstAmt || 0,
//         createdDateTime: new Date().toISOString(),
//         biddingOrderNo: bidData?.biddingOrderNo || "",
//         transporterId: bidData?.transporterId || 0,
//         transporterCode: loginCode,
//         plantCode: plantcode,
//         status: "A"
//       };

//       const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/createBidding`, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': `Basic ${credentials}`
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         // Handle 406 status specifically
//         if (response.status === 406) {
//           throw new Error("Transporter amount is greater than assigned amount");
//         }

//         try {
//           const errorData = await response.json();
//           if (errorData.meta && errorData.meta.message) {
//             throw new Error(errorData.meta.message);
//           } else {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }
//         } catch (parseError) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//       }

//       const data = await response.json();
//       console.log("Bid successfully created:", data);

//       if (data.meta && data.meta.message) {
//         setSuccess(data.meta.message);
//       } else {
//         setSuccess("Bid successfully submitted!");
//       }

//       setTimeout(() => {
//         toggle();
//         setBidAmount("");
//         setSuccess(false);
//       }, 2000);

//     } catch (err) {
//       console.error("Error creating bid:", err);
//       setError(err.message || "Failed to create bid");
//     } finally {
//       setLoading(false);
//     }
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

//   // Custom styles only for elements that can't be achieved with Reactstrap classes
//   const timerCircleStyle = {
//     width: '28px',
//     height: '28px',
//     backgroundColor: '#212529',
//     color: 'white',
//     fontSize: '12px',
//     fontWeight: 'bold'
//   };

//   const separatorStyle = {
//     fontSize: '16px',
//     color: '#212529'
//   };

//   return (
//     <Modal isOpen={isOpen} toggle={toggle} centered size="sm">
//       <ModalBody className="p-3">
//         {/* Header with close button */}
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h6 className="m-0 fw-bold fs-6">
//             Bid : {bidData?.biddingOrderNo || "N/A"}
//           </h6>
//           <Button
//             close
//             onClick={toggle}
//             className="btn-sm"
//             aria-label="Close"
//           />
//         </div>

//         {/* Timer section - centered and compact */}
//         <div className="d-flex justify-content-center align-items-center mb-3">
//           <div className="d-flex align-items-center">
//             {/* Timer icon */}
//             <div className="me-2">
//               <i className="ri-timer-line fs-5 text-muted"></i>
//             </div>

//             {/* Minutes */}
//             <div className="d-flex">
//               <Badge
//                 color="dark"
//                 className="rounded-circle d-flex align-items-center justify-content-center me-1"
//                 style={timerCircleStyle}
//               >
//                 {Math.floor(timeRemaining.minutes / 10)}
//               </Badge>
//               <Badge
//                 color="dark"
//                 className="rounded-circle d-flex align-items-center justify-content-center"
//                 style={timerCircleStyle}
//               >
//                 {timeRemaining.minutes % 10}
//               </Badge>
//             </div>

//             {/* Separator */}
//             <span className="mx-1 fw-bold" style={separatorStyle}>:</span>

//             {/* Seconds */}
//             <div className="d-flex">
//               <Badge
//                 color="dark"
//                 className="rounded-circle d-flex align-items-center justify-content-center me-1"
//                 style={timerCircleStyle}
//               >
//                 {Math.floor(timeRemaining.seconds / 10)}
//               </Badge>
//               <Badge
//                 color="dark"
//                 className="rounded-circle d-flex align-items-center justify-content-center"
//                 style={timerCircleStyle}
//               >
//                 {timeRemaining.seconds % 10}
//               </Badge>
//             </div>

//             {/* Time Remaining label */}
//             <div className="ms-2">
//               <small className="text-muted" style={{ fontSize: '11px' }}>Time Remaining</small>
//             </div>
//           </div>
//         </div>

//         {/* Bid amount input */}
//         <div className="mb-3">
//           <InputGroup size="sm">
//             <InputGroupText className="bg-light">
//               ₹
//             </InputGroupText>
//             <Input
//               type="text"
//               placeholder="Enter Bid Amount"
//               value={bidAmount}
//               onChange={handleBidAmountChange}
//               disabled={loading || success}
//               bsSize="sm"
//             />
//           </InputGroup>
//         </div>

//         {/* Error message */}
//         {error && (
//           <Alert color="danger" className="py-2 mb-3 small">
//             {error}
//           </Alert>
//         )}

//         {/* Success message */}
//         {success && (
//           <Alert color="success" className="py-2 mb-3 small">
//             {typeof success === 'string' ? success : 'Bid successfully submitted!'}
//           </Alert>
//         )}

//         {/* Submit button */}
//         <div className="d-flex justify-content-end">
//           <Button
//             color="primary"
//             size="sm"
//             onClick={handleSubmitBid}
//             disabled={loading || success || !isValid || bidAmount === "" || (timeRemaining.minutes === 0 && timeRemaining.seconds === 0)}
//             className="px-3"
//           >
//             {loading ? (
//               <>
//                 <Spinner size="sm" className="me-1" />
//                 Processing...
//               </>
//             ) : success ? "Bid Placed!" : "Start Bid"}
//           </Button>
//         </div>
//       </ModalBody>
//     </Modal>
//   );
// }; 

// // Improved Chart Components
// // Reusable panel component to match Figma design
// const DashboardPanel = ({ title, bgColor = '#405189', children }) => {
//   return (
//     <Card className="border-0 shadow-sm h-100 dashboard-chart-card">
//       <CardBody className="p-4">
//         <div className="mb-4">
//           <div
//             className="dashboard-chart-title"
//             style={{
//               background: '#405189',
//               color: 'white',
//               padding: '8px 20px',
//               borderRadius: '50px',
//               display: 'inline-block',
//               fontSize: '14px',
//               fontWeight: '500',
//               boxShadow: '0 2px 4px rgba(64, 81, 137, 0.2)'
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

// // Fleet Efficiency Chart - Updated to match Figma design
// const FleetEfficiencyChart = ({ totalFleet, onTheMove }) => {
//   const percentage = totalFleet > 0 ? onTheMove / totalFleet : 0;

//   return (
//     <DashboardPanel title="Fleet Efficiency" bgColor="#6C7DD2">
//       <div className="fleet-efficiency-container">
//         <div className="gauge-container position-relative d-flex justify-content-center mb-4">
//           <div style={{ width: '200px', height: '120px' }}>
//             <GaugeChart
//               id="fleet-gauge"
//               nrOfLevels={2}
//               colors={["#5B8DDE", "#EE5A52"]}
//               arcWidth={0.3}
//               percent={percentage}
//               arcPadding={0.02}
//               needleColor="#2C3E50"
//               needleBaseColor="#2C3E50"
//               hideText={true}
//               animate={true}
//               animDelay={0}
//               marginInPercent={0.02}
//             />
//           </div>
//         </div>

//         <div className="d-flex justify-content-around">
//           <div className="text-center">
//             <div className="fw-bold mb-1" style={{ color: "#333", fontSize: "14px", fontWeight: "700" }}>Total Fleet</div>
//             <div className="h4 mb-0" style={{ color: "#2C3E50", fontWeight: "700" }}>{totalFleet}</div>
//           </div>
//           <div className="text-center">
//             <div className="fw-bold mb-1" style={{ color: "#333", fontSize: "14px", fontWeight: "700" }}>On the move</div>
//             <div className="h4 mb-0" style={{ color: "#2C3E50", fontWeight: "700" }}>{onTheMove}</div>
//           </div>
//         </div>
//       </div>
//     </DashboardPanel>
//   );
// };

// // Delivery Status Chart - Updated to match Figma design
// const DeliveryStatusChart = ({ withInTimeLimit, outOFTimeLimit }) => {
//   const total = withInTimeLimit + outOFTimeLimit;
//   const percentage = total > 0 ? Math.round((withInTimeLimit / total) * 100) : 0;

//   const data = [
//     { value: withInTimeLimit, fill: '#4CAF50' },
//     { value: outOFTimeLimit, fill: '#E8F5E9' }
//   ];

//   return (
//     <DashboardPanel title="Delivery Status" bgColor="#6C7DD2">
//       <div className="delivery-status-container">
//         <div className="position-relative d-flex justify-content-center mb-4" style={{ height: '140px' }}>
//           <ResponsiveContainer width={140} height={140}>
//             <PieChart>
//               <Pie
//                 data={data}
//                 cx="50%"
//                 cy="50%"
//                 startAngle={90}
//                 endAngle={450}
//                 innerRadius={45}
//                 outerRadius={65}
//                 paddingAngle={0}
//                 dataKey="value"
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.fill} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>

//           <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
//             <div className="text-center">
//               <div className="h2 mb-0" style={{ color: "#2C3E50", fontWeight: "bold" }}>{percentage}%</div>
//               <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.2" }}>
//                 With in<br />Time Limit
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="d-flex justify-content-around">
//           <div className="text-center">
//             <div className="fw-bold mb-1" style={{ color: "#333", fontSize: "14px" }}>Within Time Limit</div>
//             <div className="h4 mb-0" style={{ color: "#2C3E50", fontWeight: "bold" }}>{withInTimeLimit}</div>
//           </div>
//           <div className="text-center">
//             <div className="fw-bold mb-1" style={{ color: "#333", fontSize: "14px" }}>Out Of Limit</div>
//             <div className="h4 mb-0" style={{ color: "#2C3E50", fontWeight: "bold" }}>{outOFTimeLimit}</div>
//           </div>
//         </div>
//       </div>
//     </DashboardPanel>
//   );
// };

// // Bid Status Chart - Updated to match Figma design
// const BidStatusChart = ({ running, completed, notStarted }) => {
//   const total = running + completed + notStarted;

//   const data = [
//     { name: 'Running', value: running, color: '#FFC107' },
//     { name: 'Completed', value: completed, color: '#4CAF50' },
//     { name: 'Not Started', value: notStarted, color: '#9C27B0' }
//   ];

//   return (
//     <DashboardPanel title="Bid Status" bgColor="#6C7DD2">
//       <div className="bid-status-container">
//         <div className="position-relative d-flex justify-content-center mb-4" style={{ height: '140px' }}>
//           <ResponsiveContainer width={140} height={140}>
//             <PieChart>
//               <Pie
//                 data={data}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={45}
//                 outerRadius={65}
//                 paddingAngle={2}
//                 dataKey="value"
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="d-flex justify-content-around flex-wrap">
//           {data.map((item, index) => (
//             <div key={index} className="text-center mb-2" style={{ minWidth: '80px' }}>
//               <div className="d-flex align-items-center justify-content-center mb-1">
//                 <div
//                   className="rounded-circle me-1"
//                   style={{
//                     width: '10px',
//                     height: '10px',
//                     backgroundColor: item.color
//                   }}
//                 ></div>
//                 <span style={{ fontSize: '12px', color: '#333', fontWeight: '700' }}>{item.name}</span>
//               </div>
//               <div className="h5 mb-0" style={{ color: "#2C3E50", fontWeight: "700" }}>
//                 {total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%'}
//               </div>
//             </div>
//           ))}
//         </div>
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
//   const obj = JSON.parse(sessionStorage.getItem("authUser"));
//   let plantcode = obj.data.plantCode;
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
//               <Button
//                 color="primary"
//                 size="sm"
//                 onClick={() => status === "Running" && handleBidClick(row.original)}
//                 disabled={status !== "Running"}
//                 className={status !== "Running" ? "opacity-50" : ""}
//               >
//                 Bid Now
//               </Button>
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
//               <h4 className="mb-0">Dashboard</h4>
//             </div>

//             {/* Improved Chart Components Row */}
//             <Row className="mb-4">
//               <Col md={4} className="mb-3">
//                 <FleetEfficiencyChart
//                   totalFleet={fleetEfficiencyData.totalFleet}
//                   onTheMove={fleetEfficiencyData.onTheMove}
//                 />
//               </Col>
//               <Col md={4} className="mb-3">
//                 <DeliveryStatusChart
//                   withInTimeLimit={deliveryStatusData.withInTimeLimit}
//                   outOFTimeLimit={deliveryStatusData.outOFTimeLimit}
//                 />
//               </Col>
//               <Col md={4} className="mb-3">
//                 <BidStatusChart
//                   running={bidStatusData.running}
//                   completed={bidStatusData.completed}
//                   notStarted={bidStatusData.notStarted}
//                 />
//               </Col>
//             </Row>

//             {/* View All My Bids link - positioned after charts */}
//             <div className="d-flex justify-content-end mb-4">
//               <div className="d-flex align-items-center">
//                 <i className="ri-link me-2" style={{ color: '#4069e6' }}></i>
//                 <Link
//                   to="/view-all-transporter-bids"
//                   className="text-decoration-none"
//                   style={{
//                     color: '#4069e6',
//                     fontWeight: '700',
//                     fontSize: '14px'
//                   }}
//                 >
//                   View All My Bids
//                 </Link>
//               </div>
//             </div>

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
//             plantcode={plantcode}
//           />
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default TransporterDashboard;










import React, { useState, useEffect, useMemo } from "react";
import {
  Container, Row, Col, Card, CardBody, Modal, ModalHeader, ModalFooter, Form, FormGroup, Label,
  ModalBody,
  Button,
  Badge,
  InputGroup,
  InputGroupText,
  Input,
  Alert, Spinner
} from "reactstrap";
import { Link } from "react-router-dom";
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Components
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SalesOrderModal from "./SalesOrderModal/SalesOrderModal";
import BidCard from "./BidCard/BidCard";

// Import Helpers
import { getLoginCode } from '../../../helpers/api_helper';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import "./DashBoard.css";

// Import chart libraries
import GaugeChart from 'react-gauge-chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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

const CHART_COLORS = {
  FLEET_EFFICIENCY: ["#5B8DDE", "#EE5A52"],
  DELIVERY_STATUS: {
    WITHIN_TIME: '#4CAF50',
    OUT_OF_TIME: '#E8F5E9'
  },
  BID_STATUS: {
    RUNNING: '#FFC107',
    COMPLETED: '#4CAF50',
    NOT_STARTED: '#9C27B0'
  }
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
// const truncateText = (text, maxLength = 50) => {
//   if (!text || text.length <= maxLength) return text;
//   return text.substring(0, maxLength) + '...';
// };
/**
 * Truncate text with ellipsis - Fixed version
 */
const truncateText = (text, maxLength = 50) => {
  // Handle null, undefined, or non-string values
  if (text === null || text === undefined) {
    return '';
  }

  // Convert to string if it's not already a string
  const stringValue = String(text);

  // Check if truncation is needed
  if (stringValue.length <= maxLength) {
    return stringValue;
  }

  return stringValue.substring(0, maxLength) + '...';
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

/**
 * Get user plant code from session storage
 */
const getPlantCode = () => {
  try {
    const authUser = JSON.parse(sessionStorage.getItem("authUser"));
    return authUser?.data?.plantCode || '';
  } catch (error) {
    console.warn('Error getting plant code:', error);
    return '';
  }
};

// =====================================================
// CHART COMPONENTS
// =====================================================

/**
 * Reusable Dashboard Panel Component
 */
const DashboardPanel = ({ title, bgColor = '#405189', children }) => {
  return (
    <Card className="border-0 shadow-sm h-100 dashboard-chart-card">
      <CardBody className="p-4">
        <div className="mb-4">
          <div
            className="dashboard-chart-title"
            style={{
              background: bgColor,
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

/**
 * Fleet Efficiency Chart Component
 */
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
              colors={CHART_COLORS.FLEET_EFFICIENCY}
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
            <div className="fw-bold mb-1" style={{ color: "#333", fontSize: "14px", fontWeight: "700" }}>
              Total Fleet
            </div>
            <div className="h4 mb-0" style={{ color: "#2C3E50", fontWeight: "700" }}>
              {totalFleet}
            </div>
          </div>
          <div className="text-center">
            <div className="fw-bold mb-1" style={{ color: "#333", fontSize: "14px", fontWeight: "700" }}>
              On the move
            </div>
            <div className="h4 mb-0" style={{ color: "#2C3E50", fontWeight: "700" }}>
              {onTheMove}
            </div>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
};

/**
 * Delivery Status Chart Component
 */
const DeliveryStatusChart = ({ withInTimeLimit, outOFTimeLimit }) => {
  const total = withInTimeLimit + outOFTimeLimit;
  const percentage = total > 0 ? Math.round((withInTimeLimit / total) * 100) : 0;

  const data = [
    { value: withInTimeLimit, fill: CHART_COLORS.DELIVERY_STATUS.WITHIN_TIME },
    { value: outOFTimeLimit, fill: CHART_COLORS.DELIVERY_STATUS.OUT_OF_TIME }
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
              <div className="h2 mb-0" style={{ color: "#2C3E50", fontWeight: "bold" }}>
                {percentage}%
              </div>
              <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.2" }}>
                With in<br />Time Limit
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-around">
          <div className="text-center">
            <div className="fw-bold mb-1" style={{ color: "#333", fontSize: "14px" }}>
              Within Time Limit
            </div>
            <div className="h4 mb-0" style={{ color: "#2C3E50", fontWeight: "bold" }}>
              {withInTimeLimit}
            </div>
          </div>
          <div className="text-center">
            <div className="fw-bold mb-1" style={{ color: "#333", fontSize: "14px" }}>
              Out Of Limit
            </div>
            <div className="h4 mb-0" style={{ color: "#2C3E50", fontWeight: "bold" }}>
              {outOFTimeLimit}
            </div>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
};

/**
 * Bid Status Chart Component
 */
const BidStatusChart = ({ running, completed, notStarted }) => {
  const total = running + completed + notStarted;

  const data = [
    { name: 'Running', value: running, color: CHART_COLORS.BID_STATUS.RUNNING },
    { name: 'Completed', value: completed, color: CHART_COLORS.BID_STATUS.COMPLETED },
    { name: 'Not Started', value: notStarted, color: CHART_COLORS.BID_STATUS.NOT_STARTED }
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
                <span style={{ fontSize: '12px', color: '#333', fontWeight: '700' }}>
                  {item.name}
                </span>
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
const BidConfirmationModal = ({ isOpen, toggle, bidData, loginCode, bidNo, plantcode }) => {
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
      // Convert everything to minutes and seconds (no hours)
      const totalMinutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setTimeRemaining({ hours: 0, minutes: totalMinutes, seconds });
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
      const credentials = btoa(`${process.env.REACT_APP_API_USER_NAME}:${process.env.REACT_APP_API_PASSWORD}`);

      const payload = {
        transBiddingOrdNo: bidData?.transBiddingOrdNo || "",
        transAmt: parseFloat(bidAmount),
        logstAmt: bidData?.logstAmt || 0,
        createdDateTime: new Date().toISOString(),
        biddingOrderNo: bidData?.biddingOrderNo || "",
        transporterId: bidData?.transporterId || 0,
        transporterCode: loginCode,
        plantCode: plantcode,
        status: "A"
      };

      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/createBidding`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        // Handle 406 status specifically
        if (response.status === 406) {
          throw new Error("Transporter amount is greater than assigned amount");
        }

        try {
          const errorData = await response.json();
          if (errorData.meta && errorData.meta.message) {
            throw new Error(errorData.meta.message);
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } catch (parseError) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log("Bid successfully created:", data);

      if (data.meta && data.meta.message) {
        setSuccess(data.meta.message);
      } else {
        setSuccess("Bid successfully submitted!");
      }

      setTimeout(() => {
        toggle();
        setBidAmount("");
        setSuccess(false);
      }, 2000);

    } catch (err) {
      console.error("Error creating bid:", err);
      setError(err.message || "Failed to create bid");
    } finally {
      setLoading(false);
    }
  };
  // const handleSubmitBid = async () => {
  //   if (!bidAmount || isNaN(parseFloat(bidAmount))) {
  //     setError("Please enter a valid bid amount");
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // Basic auth credentials (should be stored securely in a real app)
  //     const credentials = btoa(`${process.env.REACT_APP_API_USER_NAME}:${process.env.REACT_APP_API_PASSWORD}`);

  //     const payload = {
  //       id: 0,
  //       transBiddingOrdNo: "string", // This should be generated or fetched
  //       transAmt: parseFloat(bidAmount),
  //       logstAmt: 500, // This should be dynamically determined based on business logic
  //       createdDateTime: new Date().toISOString(),
  //       biddingOrderNo: bidData?.biddingOrderNo || "N/A",
  //       transporterId: 0, // This should come from user context
  //       transporterCode: loginCode, // Use loginCode from props
  //       plantCode: plantcode, // This should come from bidData or user context
  //       status: "A"
  //     };

  //     const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/createBidding`, {
  //       method: 'POST',
  //       headers: {
  //         'Accept': '*/*',
  //         'Content-Type': 'application/json',
  //         'Authorization': `Basic ${credentials}`
  //       },
  //       body: JSON.stringify(payload)
  //     });

  //     if (!response.ok) {
  //       // Parse error response to get API message
  //       try {
  //         const errorData = await response.json();
  //         if (errorData.meta && errorData.meta.message) {
  //           throw new Error(errorData.meta.message);
  //         } else {
  //           throw new Error(`HTTP error! Status: ${response.status}`);
  //         }
  //       } catch (parseError) {
  //         // If JSON parsing fails, throw generic HTTP error
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //     }

  //     const data = await response.json();
  //     console.log("Bid successfully created:", data);

  //     // Check if response has success message
  //     if (data.meta && data.meta.message) {
  //       setSuccess(data.meta.message);
  //     } else {
  //       setSuccess("Bid successfully submitted!");
  //     }

  //     // Close the modal after 2 seconds
  //     setTimeout(() => {
  //       toggle();
  //       // Reset state 
  //       setBidAmount("");
  //       setSuccess(false);
  //     }, 2000);

  //   } catch (err) {
  //     console.error("Error creating bid:", err);

  //     // Try to parse error response for API error messages
  //     if (err.response) {
  //       try {
  //         const errorData = await err.response.json();
  //         if (errorData.meta && errorData.meta.message) {
  //           setError(errorData.meta.message);
  //         } else {
  //           setError(`Failed to create bid: ${err.message}`);
  //         }
  //       } catch (parseError) {
  //         setError(`Failed to create bid: ${err.message}`);
  //       }
  //     } else {
  //       setError(`Failed to create bid: ${err.message}`);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  // Custom styles only for elements that can't be achieved with Reactstrap classes
  const timerCircleStyle = {
    width: '28px',
    height: '28px',
    backgroundColor: '#212529',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold'
  };

  const separatorStyle = {
    fontSize: '16px',
    color: '#212529'
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="sm">
      <ModalBody className="p-3">
        {/* Header with close button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="m-0 fw-bold fs-6">
            Bid : {bidData?.biddingOrderNo || "N/A"}
          </h6>
          <Button
            close
            onClick={toggle}
            className="btn-sm"
            aria-label="Close"
          />
        </div>

        {/* Timer section - centered and compact */}
        <div className="d-flex justify-content-center align-items-center mb-3">
          <div className="d-flex align-items-center">
            {/* Timer icon */}
            <div className="me-2">
              <i className="ri-timer-line fs-5 text-muted"></i>
            </div>

            {/* Minutes */}
            <div className="d-flex">
              <Badge
                color="dark"
                className="rounded-circle d-flex align-items-center justify-content-center me-1"
                style={timerCircleStyle}
              >
                {Math.floor(timeRemaining.minutes / 10)}
              </Badge>
              <Badge
                color="dark"
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={timerCircleStyle}
              >
                {timeRemaining.minutes % 10}
              </Badge>
            </div>

            {/* Separator */}
            <span className="mx-1 fw-bold" style={separatorStyle}>:</span>

            {/* Seconds */}
            <div className="d-flex">
              <Badge
                color="dark"
                className="rounded-circle d-flex align-items-center justify-content-center me-1"
                style={timerCircleStyle}
              >
                {Math.floor(timeRemaining.seconds / 10)}
              </Badge>
              <Badge
                color="dark"
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={timerCircleStyle}
              >
                {timeRemaining.seconds % 10}
              </Badge>
            </div>

            {/* Time Remaining label */}
            <div className="ms-2">
              <small className="text-muted" style={{ fontSize: '11px' }}>Time Remaining</small>
            </div>
          </div>
        </div>

        {/* Bid amount input */}
        <div className="mb-3">
          <InputGroup size="sm">
            <InputGroupText className="bg-light">
              ₹
            </InputGroupText>
            <Input
              type="text"
              placeholder="Enter Bid Amount"
              value={bidAmount}
              onChange={handleBidAmountChange}
              disabled={loading || success}
              bsSize="sm"
            />
          </InputGroup>
        </div>

        {/* Error message */}
        {error && (
          <Alert color="danger" className="py-2 mb-3 small">
            {error}
          </Alert>
        )}

        {/* Success message */}
        {success && (
          <Alert color="success" className="py-2 mb-3 small">
            {typeof success === 'string' ? success : 'Bid successfully submitted!'}
          </Alert>
        )}

        {/* Submit button */}
        <div className="d-flex justify-content-end">
          <Button
            color="primary"
            size="sm"
            onClick={handleSubmitBid}
            disabled={loading || success || !isValid || bidAmount === "" || (timeRemaining.minutes === 0 && timeRemaining.seconds === 0)}
            className="px-3"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-1" />
                Processing...
              </>
            ) : success ? "Bid Placed!" : "Start Bid"}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};
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
// =====================================================
// MAIN COMPONENT
// =====================================================
const TransporterDashboard = () => {
  document.title = "Dashboard | EPLMS";

  // =====================================================
  // STATE
  // =====================================================
  const [bidData, setBidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginCode, setLoginCode] = useState('');
  const [plantCode] = useState(getPlantCode());

  // Modal states
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [isSalesOrderModalOpen, setIsSalesOrderModalOpen] = useState(false);
  const [selectedBidNo, setSelectedBidNo] = useState("");
  const [isCancelBidModalOpen, setIsCancelBidModalOpen] = useState(false);
  const [bidToCancel, setBidToCancel] = useState("");
  const [isBidConfirmationModalOpen, setIsBidConfirmationModalOpen] = useState(false);
  const [bidToConfirm, setBidToConfirm] = useState(null);

  // Chart data states
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

  // =====================================================
  // API FUNCTIONS
  // =====================================================

  /**
   * Fetch fleet efficiency data from API
   */
  const fetchFleetEfficiencyData = async (transporterCode) => {
    try {
      const codeToUse = transporterCode || loginCode;
      if (!codeToUse) {
        console.warn("No transporter code available for fleet efficiency data fetch");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getFleetEfficiency?transporterCode=${codeToUse}`,
        {
          method: 'GET',
          headers: getApiHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      if (jsonData) {
        setFleetEfficiencyData({
          totalFleet: jsonData.totalFleet || 0,
          onTheMove: jsonData.onTheMove || 0
        });
        console.log("Fleet efficiency data received:", jsonData);
      } else {
        setFleetEfficiencyData({ totalFleet: 0, onTheMove: 0 });
      }
    } catch (err) {
      console.error("Error fetching fleet efficiency data:", err);
      setFleetEfficiencyData({ totalFleet: 0, onTheMove: 0 });
    }
  };

  /**
   * Fetch delivery status data from API
   */
  const fetchDeliveryStatusData = async (transporterCode) => {
    try {
      const codeToUse = transporterCode || loginCode;
      if (!codeToUse) {
        console.warn("No transporter code available for delivery status data fetch");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getDeliveryStatus?transporterCode=${codeToUse}`,
        {
          method: 'GET',
          headers: getApiHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      if (jsonData) {
        setDeliveryStatusData({
          withInTimeLimit: jsonData.withInTimeLimit || 0,
          outOFTimeLimit: jsonData.outOFTimeLimit || 0
        });
        console.log("Delivery status data received:", jsonData);
      } else {
        setDeliveryStatusData({ withInTimeLimit: 0, outOFTimeLimit: 0 });
      }
    } catch (err) {
      console.error("Error fetching delivery status data:", err);
      setDeliveryStatusData({ withInTimeLimit: 0, outOFTimeLimit: 0 });
    }
  };

  /**
   * Fetch bid status data from API
   */
  const fetchBidStatusData = async (transporterCode) => {
    try {
      const codeToUse = transporterCode || loginCode;
      if (!codeToUse) {
        console.warn("No transporter code available for bid status data fetch");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getBidStatusByTransporterCode?transporterCode=${codeToUse}`,
        {
          method: 'GET',
          headers: getApiHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      if (jsonData && jsonData.body) {
        setBidStatusData({
          running: jsonData.body.running || 0,
          completed: jsonData.body.completed || 0,
          notStarted: jsonData.body.notStarted || 0
        });
        console.log("Bid status data received:", jsonData.body);
      } else {
        setBidStatusData({ running: 0, completed: 0, notStarted: 0 });
      }
    } catch (err) {
      console.error("Error fetching bid status data:", err);
      setBidStatusData({ running: 0, completed: 0, notStarted: 0 });
    }
  };

  /**
   * Fetch bid data from API
   */
  const fetchBidData = async (transporterCode) => {
    try {
      setLoading(true);
      setError(null);

      const codeToUse = transporterCode || loginCode;
      if (!codeToUse) {
        throw new Error("No transporter code available");
      }

      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/getAllBidsByTransporterCode?transporterCode=${codeToUse}`,
        {
          method: 'GET',
          headers: getApiHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      if (jsonData && jsonData.data && Array.isArray(jsonData.data)) {
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
      toast.success(`Bid ${bidNo} cancelled successfully`, result)

      // Refresh data
      fetchBidData(loginCode);

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

  const handleBidClick = (bidData) => {
    setBidToConfirm(bidData);
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
      accessor: "route",
      id: "route",
      Cell: ({ row }) => {
        const route = row.original.route || `${row.original.fromLocation || ''} to ${row.original.toLocation || ''}`;
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

            {/* Bid Now Button - Only for "Running" status */}
            {status === BID_STATUS.RUNNING && (
              <Button
                size="sm"
                className="confirm-btn no-hover-effect"
                onClick={() => handleBidClick(row.original)}
                title="Start Bidding"
              >
                Bid Now
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
    // Get login code
    const code = getLoginCode();
    if (code) {
      setLoginCode(code);
      console.log("Login code found in Transporter Dashboard:", code);

      // Fetch all data with login code
      fetchBidStatusData(code);
      fetchFleetEfficiencyData(code);
      fetchDeliveryStatusData(code);
      fetchBidData(code);
    } else {
      console.warn("Login code not found");
      setError("Login code not found. Please log in again.");
      setLoading(false);
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
      <Button color="primary" size="sm" onClick={() => fetchBidData(loginCode)}>
        Retry
      </Button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-5">
      <i className="ri-information-line fs-1 mb-3"></i>
      <p>No bid data available</p>
      <Button color="primary" size="sm" onClick={() => fetchBidData(loginCode)}>
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
          <BreadCrumb title="Dashboard" pageTitle="Transporter" />

          <div className="dashboard-container">
            {/* Header Section */}
            <Row className="dashboard-header align-items-center">
              <Col>
                <h4 className="dashboard-title">Dashboard</h4>
              </Col>
            </Row>

            {/* Chart Components Row */}
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

            {/* View All My Bids Link */}
            <Row className="mb-3">
              <Col xs="auto" className="ms-auto">
                <Link to="/view-all-transporter-bids" className="view-all-link fw-bold">
                  <i className="ri-link me-1"></i> View All My Bids
                </Link>
              </Col>
            </Row>

            {/* Bid Cards */}
            <div className="bid-cards-container">
              <BidCard loginCode={loginCode} />
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
              fileName="transporter_dashboard_export"
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
            bidData={bidToConfirm}
            loginCode={loginCode}
            plantcode={plantCode}
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

export default TransporterDashboard;
