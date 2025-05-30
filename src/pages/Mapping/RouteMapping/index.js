// //latest aligned code 
// import React, { useState, useEffect, useMemo } from "react";
// import { Container, Row, Col, Card, CardHeader, Button, Input } from "reactstrap";
// import { Link } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import TableContainer from "../../../Components/Common/TableContainer";
// import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
// import AssignRouteModal from "./AssignRouteModal/AssignRouteModal";
// import ViewRoutesModal from "./ViewRoutesModal/ViewRoutesModal";
// import Loader from "../../../Components/Common/Loader";
// import mappingIcon from "../../../assets/images/mappingIcon.png";


// const RouteMapping = () => {
//     const [transporters, setTransporters] = useState([]);
//     const [selectedRows, setSelectedRows] = useState([]);
//     const [isExportCSV, setIsExportCSV] = useState(false);
//     const [isAssignRouteModalOpen, setIsAssignRouteModalOpen] = useState(false);
//     const [isViewRouteModalOpen, setIsViewRouteModalOpen] = useState(false);
//     const [currentTransporterCode, setCurrentTransporterCode] = useState("");
//     const [viewRouteData, setViewRouteData] = useState([]);
//     const [routes, setRoutes] = useState([]);
//     const [selectedRoutes, setSelectedRoutes] = useState([]);

//     // Loading states
//     const [isTransportersLoading, setIsTransportersLoading] = useState(false);
//     const [isRoutesLoading, setIsRoutesLoading] = useState(false);
//     const [isViewRoutesLoading, setIsViewRoutesLoading] = useState(false);
//     const [isAssigningRoutes, setIsAssigningRoutes] = useState(false);

//     // Modal toggle function
//     const handleModalToggle = () => {
//         if (isAssignRouteModalOpen) {
//             setSelectedRoutes([]);
//             if (!currentTransporterCode) {
//                 setSelectedRows([]);
//             }
//         }
//         setIsAssignRouteModalOpen(!isAssignRouteModalOpen);
//     };

//     // Show success toast notification
//     const showSuccessAlert = () => {
//         toast.success("Routes assigned successfully!", {
//             position: "top-right",
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//         });

//         setSelectedRows([]);
//         setSelectedRoutes([]);
//         setIsAssignRouteModalOpen(false);
//     };

//     // Configuration for API requests with Basic Authentication
//     const getAuthHeaders = () => {
//         const username = process.env.REACT_APP_API_USER_NAME || 'your_default_username';
//         const password = process.env.REACT_APP_API_PASSWORD || 'your_default_password';
//         const base64Auth = btoa(`${username}:${password}`);

//         return {
//             'Content-Type': 'application/json',
//             'Authorization': `Basic ${base64Auth}`
//         };
//     };

//     // Function to fetch transporters data
//     const fetchTransporters = async () => {
//         setIsTransportersLoading(true);
//         try {
//             const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/allTransporters`, {
//                 method: 'GET',
//                 headers: getAuthHeaders()
//             });

//             if (!response.ok) {
//                 throw new Error(`API responded with status: ${response.status}`);
//             }

//             const result = await response.json();
//             console.log("API Response:", result);

//             if (result && result.data && Array.isArray(result.data)) {
//                 const mappedData = result.data.map(item => ({
//                     id: item.id,
//                     transporterCode: item.code,
//                     transporterName: item.name,
//                     contactPerson: item.contactPerson || "",
//                     phoneNo: item.contactNumber || "",
//                     emailId: item.contactEmail || "",
//                     rType: item.modeTransport || ""
//                 }));

//                 console.log("Mapped Data:", mappedData);
//                 setTransporters(mappedData);
//             } else {
//                 console.warn("Response structure is not as expected:", result);
//                 setTransporters([]);
//             }
//         } catch (error) {
//             console.error("Error fetching transporters:", error);
//             setTransporters([]);
//             toast.error("Failed to fetch transporters. Please try again later.", {
//                 position: "top-right",
//                 autoClose: 5000,
//             });
//         } finally {
//             setIsTransportersLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchTransporters();
//     }, []);

//     // Function to fetch all routes for assignment modal
//     // const fetchAllRoutes = async () => {
//     //     setIsRoutesLoading(true);
//     //     try {
//     //         const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/getAllRoutes`, {
//     //             method: 'GET',
//     //             headers: getAuthHeaders()
//     //         });

//     //         if (response.ok) {
//     //             const result = await response.json();

//     //             if (result.data && Array.isArray(result.data)) {
//     //                 const mappedRoutes = result.data.map(route => ({
//     //                     id: route.id,
//     //                     routeCode: route.routeCode || "",
//     //                     departureLocation: route.routeDetermination,
//     //                     destinationLocation: route.routeDestination,
//     //                     routeType: route.routeType || "",
//     //                     distance: route.routeDistance || "",
//     //                 }));
//     //                 setRoutes(mappedRoutes);
//     //             } else {
//     //                 console.error("Invalid data structure received from routes API");
//     //                 setRoutes([]);
//     //             }
//     //         } else {
//     //             console.error("Failed to fetch routes. Status:", response.status);
//     //             setRoutes([]);
//     //             toast.error("Failed to fetch routes. Please try again later.", {
//     //                 position: "top-right",
//     //                 autoClose: 5000,
//     //             });
//     //         }
//     //     } catch (error) {
//     //         console.error("Error fetching all routes:", error);
//     //         setRoutes([]);
//     //         toast.error("Error fetching routes. Please try again later.", {
//     //             position: "top-right",
//     //             autoClose: 5000,
//     //         });
//     //     } finally {
//     //         setIsRoutesLoading(false);
//     //     }
//     // };

// const fetchAllRoutes = async () => {
//     setIsRoutesLoading(true);
//     try {
//         const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/getAllRoutes`, {
//             method: 'GET',
//             headers: getAuthHeaders()
//         });

//         if (response.ok) {
//             const result = await response.json();
//             console.log("Raw API Response:", result); // Debug log

//             // Check if data exists and is an array
//             if (result.data && Array.isArray(result.data)) {
//                 const mappedRoutes = result.data.map(route => {
//                     console.log("Mapping route:", route); // Debug each route
//                     return {
//                         id: route.id,
//                         routeCode: route.routeCode || "",
//                         // Fix the field mapping based on your API response
//                         departureLocation: route.routeDetermination || route.routeName || "",
//                         destinationLocation: route.routeDestination || "",
//                         routeType: route.routeType || "",
//                         distance: route.routeDistance ? `${route.routeDistance} km` : "",
//                     };
//                 });
                
//                 console.log("Mapped routes:", mappedRoutes); // Debug mapped data
//                 setRoutes(mappedRoutes);
                
//                 // Show success message if routes are found
//                 if (mappedRoutes.length > 0) {
//                     console.log(`Successfully loaded ${mappedRoutes.length} routes`);
//                 } else {
//                     console.warn("No routes found in the response");
//                     toast.warning("No routes available for assignment.", {
//                         position: "top-right",
//                         autoClose: 3000,
//                     });
//                 }
//             } else {
//                 console.error("Invalid data structure received from routes API:", result);
//                 setRoutes([]);
//                 toast.error("Invalid data format received from routes API.", {
//                     position: "top-right",
//                     autoClose: 5000,
//                 });
//             }
//         } else {
//             console.error("Failed to fetch routes. Status:", response.status);
//             const errorText = await response.text();
//             console.error("Error response:", errorText);
//             setRoutes([]);
//             toast.error("Failed to fetch routes. Please try again later.", {
//                 position: "top-right",
//                 autoClose: 5000,
//             });
//         }
//     } catch (error) {
//         console.error("Error fetching all routes:", error);
//         setRoutes([]);
//         toast.error("Error fetching routes. Please try again later.", {
//             position: "top-right",
//             autoClose: 5000,
//         });
//     } finally {
//         setIsRoutesLoading(false);
//     }
// };

//     const handleViewRoutes = async (transporterCode) => {
//         setIsViewRoutesLoading(true);
//         try {
//             const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/transportercode/${transporterCode}`, {
//                 method: 'GET',
//                 headers: getAuthHeaders()
//             });

//             if (response.ok) {
//                 const result = await response.json();
//                 console.log("View routes API response:", result);

//                 if (result.datalist && Array.isArray(result.datalist)) {
//                     const transformedData = result.datalist.map(item => ({
//                         routeCode: item.routeCode || "",
//                         departureLocation: item.routeName || "",
//                         destinationLocation: item.routeDestination || "",
//                         routeType: item.routeType || "",
//                         distance: item.routeDistance || ""
//                     }));
//                     setViewRouteData(transformedData);
//                 } else {
//                     console.warn("Invalid data structure in route response");
//                     setViewRouteData([]);
//                 }
//             } else {
//                 console.error(`Failed to fetch routes for transporter. Status: ${response.status}`);
//                 setViewRouteData([]);
//                 toast.warning("No routes found for this transporter.", {
//                     position: "top-right",
//                     autoClose: 3000,
//                 });
//             }

//             setCurrentTransporterCode(transporterCode);
//             setIsViewRouteModalOpen(true);
//         } catch (error) {
//             console.error("Error fetching routes for transporter:", error);
//             setViewRouteData([]);
//             setCurrentTransporterCode(transporterCode);
//             setIsViewRouteModalOpen(true);
//             toast.error("Error fetching routes for this transporter.", {
//                 position: "top-right",
//                 autoClose: 5000,
//             });
//         } finally {
//             setIsViewRoutesLoading(false);
//         }
//     };

//     // Columns for transporters table
//     const columns = useMemo(
//         () => [
//             {
//                 Header: () => (
//                     <Input
//                         type="checkbox"
//                         checked={transporters.length > 0 && selectedRows.length === transporters.length}
//                         onChange={() => {
//                             setSelectedRows(
//                                 selectedRows.length === transporters.length
//                                     ? []
//                                     : transporters.map(t => t.id)
//                             );
//                         }}
//                     />
//                 ),
//                 accessor: "checkbox",
//                 disableHiding: true,
//                 Cell: ({ row }) => (
//                     <Input
//                         type="checkbox"
//                         checked={selectedRows.includes(row.original.id)}
//                         onChange={() => {
//                             setSelectedRows(prevSelected =>
//                                 prevSelected.includes(row.original.id)
//                                     ? prevSelected.filter(id => id !== row.original.id)
//                                     : [...prevSelected, row.original.id]
//                             );
//                         }}
//                     />
//                 ),
//                 disableSortBy: true,
//             },
//             { Header: "Transporter Code", accessor: "transporterCode" },
//             { Header: "Transporter name", accessor: "transporterName" },
//             { Header: "Contact Person", accessor: "contactPerson" },
//             { Header: "Phone No.", accessor: "phoneNo" },
//             { Header: "Email Id", accessor: "emailId" },
//             { Header: "R-Type", accessor: "rType" },
//             {
//                 Header: "Assign Route",
//                 Cell: ({ row }) => (
//                     <div className="d-flex justify-content-center align-items-center gap-2">
//                         <Link
//                             to="#"
//                             className="text-info"
//                             onClick={() => handleViewRoutes(row.original.transporterCode)}
//                         >
//                             <i className="ri-eye-line fs-16"></i>
//                         </Link>
//                         <Link
//                             to="#"
//                             className="text-success"
//                             onClick={() => {
//                                 setCurrentTransporterCode(row.original.transporterCode);
//                                 fetchAllRoutes();
//                                 handleModalToggle();
//                             }}
//                         >
//                            <img 
//                                           src={mappingIcon} 
//                                           alt="Mapping Icon" 
//                                           style={{ 
//                                             width: '16px', 
//                                             height: '18px',
//                                           // NEW (proper blue filter):
//                           filter: 'brightness(0) saturate(100%) invert(45%) sepia(100%) saturate(2878%) hue-rotate(200deg) brightness(90%) contrast(120%)'
//                                           }} 
//                                         />
//                         </Link>
//                     </div>
//                 ),
//                 disableSortBy: true,
//             }
//         ],
//         [selectedRows, transporters]
//     );

//     // Handle route assignment
//     const handleAssignRoutes = async () => {
//         setIsAssigningRoutes(true);
//         try {
//             let mappingData = [];
//             const currentDate = new Date().toISOString().split('T')[0];

//             if (currentTransporterCode) {
//                 mappingData = selectedRoutes.map(routeId => {
//                     const route = routes.find(r => r.id === routeId);
//                     return {
//                         transporterCode: currentTransporterCode,
//                         routeCode: route.routeCode,
//                         createdDate: currentDate,
//                         status: "A"
//                     };
//                 });
//             }
//             else if (selectedRows.length > 0) {
//                 selectedRows.forEach(transporterId => {
//                     const transporter = transporters.find(t => t.id === transporterId);
//                     selectedRoutes.forEach(routeId => {
//                         const route = routes.find(r => r.id === routeId);
//                         mappingData.push({
//                             transporterCode: transporter.transporterCode,
//                             routeCode: route.routeCode,
//                             createdDate: currentDate,
//                             status: "A"
//                         });
//                     });
//                 });
//             }

//             console.log("Attempting to assign routes:", mappingData);

//             const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transportersRouteMap`, {
//                 method: 'POST',
//                 headers: getAuthHeaders(),
//                 body: JSON.stringify(mappingData)
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 console.log("Routes assigned successfully:", result);

//                 if (Array.isArray(result) && result.length > 0 && result[0].meta) {
//                     toast.success(result[0].meta.message, {
//                         position: "top-right",
//                         autoClose: 5000,
//                     });
//                 } else {
//                     toast.success("Routes assigned successfully", {
//                         position: "top-right",
//                         autoClose: 5000,
//                     });
//                 }

//                 fetchTransporters();

//                 if (currentTransporterCode) {
//                     handleViewRoutes(currentTransporterCode);
//                 }
//             } else {
//                 console.error("Failed to assign routes. Status:", response.status);

//                 if (Array.isArray(result) && result.length > 0 && result[0].meta) {
//                     toast.error(result[0].meta.message, {
//                         position: "top-right",
//                         autoClose: 5000,
//                     });
//                 } else {
//                     toast.error("Failed to assign routes. Please try again.", {
//                         position: "top-right",
//                         autoClose: 5000,
//                     });
//                 }
//             }

//         } catch (error) {
//             console.error("Error assigning routes:", error);
//             toast.error("An error occurred while assigning routes.", {
//                 position: "top-right",
//                 autoClose: 5000,
//             });
//         } finally {
//             setIsAssigningRoutes(false);
//         }
//     };

//     // Handle Assign Multiple Route button click
//     const handleAssignMultipleRouteClick = () => {
//         if (selectedRows.length > 0) {
//             setCurrentTransporterCode("");
//             fetchAllRoutes();
//             handleModalToggle();
//         }
//     };

//     // Handle the download functionality
//     const handleDownload = (e) => {
//         e.preventDefault();
//         downloadCSV();
//         setIsExportCSV(false);
//     };

//     // Download CSV function
//     const downloadCSV = () => {
//         if (transporters.length === 0) {
//             toast.warning("No data available to export", {
//                 position: "top-right",
//                 autoClose: 3000,
//             });
//             return;
//         }

//         const headers = [
//             "Transporter Code",
//             "Transporter Name",
//             "Contact Person",
//             "Phone No.",
//             "Email Id",
//             "R-Type"
//         ].join(',') + '\n';

//         const rows = transporters.map(transporter =>
//             [
//                 transporter.transporterCode,
//                 transporter.transporterName,
//                 transporter.contactPerson,
//                 transporter.phoneNo,
//                 transporter.emailId,
//                 transporter.rType
//             ].join(',')
//         ).join('\n');

//         const csvData = headers + rows;

//         const blob = new Blob([csvData], { type: 'text/csv' });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = 'TransporterRouteMapping.csv';
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//     };

//     document.title = "Route Mapping | EPLMS";

//     return (
//         <React.Fragment>
//             <div className="page-content">
//                 <Container fluid>
//                     <BreadCrumb title="Transporter Route Mapping" pageTitle="Transporter Route Mapping" />
                    
//                     <Row>
//                         <Col lg={12}>
//                             <Card id="transporterList">
//                                 <CardHeader className="border-0">
//                                     <Row className="g-4 align-items-center">
//                                         <div className="col-sm">
//                                             <div>
//                                                 <h5 className="card-title1 mb-0 bg-light">Transporter Route Mapping</h5>
//                                             </div>
//                                         </div>
//                                         <div className="col-sm-auto">
//                                             <div className="d-flex gap-2">
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-success add-btn"
//                                                     id="assignMultilpeRoute"
//                                                     onClick={handleAssignMultipleRouteClick}
//                                                     disabled={selectedRows.length === 0}
//                                                 >
//                                                     <i className="ri-map-pin-line align-bottom me-1"></i> Assign Multiple Route
//                                                 </button>
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-info add-btn"
//                                                     onClick={() => setIsExportCSV(true)}
//                                                 >
//                                                     <i className="ri-file-download-line align-bottom me-1"></i> Export
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </Row>
//                                 </CardHeader>
//                                 <div className="card-body pt-0">
//                                     <div>
//                                         {isTransportersLoading ? (
//                                             <Loader />
//                                         ) : (
//                                             <TableContainer
//                                                 columns={columns}
//                                                 data={transporters}
//                                                 isGlobalFilter={true}
//                                                 isAddUserList={false}
//                                                 customPageSize={5}
//                                                 isGlobalSearch={true}
//                                                 className="custom-header-css"
//                                                 SearchPlaceholder="Search for transporter..."
//                                                 divClass="overflow-auto"
//                                                 tableClass="width-50"
//                                             />
//                                         )}
//                                     </div>

//                                     {/* Toast Container */}
//                                     <ToastContainer
//                                         position="top-right"
//                                         autoClose={3000}
//                                         hideProgressBar={false}
//                                         closeOnClick
//                                         rtl={false}
//                                         pauseOnFocusLoss
//                                         draggable
//                                         pauseOnHover
//                                         theme="light"
//                                         toastStyle={{ backgroundColor: "white" }}
//                                     />
//                                 </div>
//                             </Card>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>

//             {/* ViewRoutesModal component */}
//             <ViewRoutesModal
//                 isOpen={isViewRouteModalOpen}
//                 toggle={() => setIsViewRouteModalOpen(!isViewRouteModalOpen)}
//                 currentTransporterCode={currentTransporterCode}
//                 viewRouteData={viewRouteData}
//                 isLoading={isViewRoutesLoading}
//             />

//             {/* AssignRouteModal component */}
//             <AssignRouteModal
//                 isOpen={isAssignRouteModalOpen}
//                 toggle={handleModalToggle}
//                 currentTransporterCode={currentTransporterCode}
//                 routes={routes}
//                 selectedRoutes={selectedRoutes}
//                 setSelectedRoutes={setSelectedRoutes}
//                 handleAssignRoutes={handleAssignRoutes}
//                 isLoading={isRoutesLoading || isAssigningRoutes}
//             />

//             {/* Export CSV Modal */}
//             {isExportCSV && (
//                 <ExportCSVModal
//                     show={isExportCSV}
//                     onCloseClick={() => setIsExportCSV(false)}
//                     onDownloadClick={handleDownload}
//                     data={transporters}
//                 />
//             )}
//         </React.Fragment>
//     );
// };

// export default RouteMapping;
// Updated index.js with route filtering logic
import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, CardHeader, Button, Input } from "reactstrap";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import AssignRouteModal from "./AssignRouteModal/AssignRouteModal";
import ViewRoutesModal from "./ViewRoutesModal/ViewRoutesModal";
import Loader from "../../../Components/Common/Loader";
import mappingIcon from "../../../assets/images/mappingIcon.png";

const RouteMapping = () => {
    const [transporters, setTransporters] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [isAssignRouteModalOpen, setIsAssignRouteModalOpen] = useState(false);
    const [isViewRouteModalOpen, setIsViewRouteModalOpen] = useState(false);
    const [currentTransporterCode, setCurrentTransporterCode] = useState("");
    const [viewRouteData, setViewRouteData] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [selectedRoutes, setSelectedRoutes] = useState([]);

    // NEW: State to store already assigned routes for current transporter
    const [assignedRoutes, setAssignedRoutes] = useState([]);

    // Loading states
    const [isTransportersLoading, setIsTransportersLoading] = useState(false);
    const [isRoutesLoading, setIsRoutesLoading] = useState(false);
    const [isViewRoutesLoading, setIsViewRoutesLoading] = useState(false);
    const [isAssigningRoutes, setIsAssigningRoutes] = useState(false);

    // Modal toggle function
    const handleModalToggle = () => {
        if (isAssignRouteModalOpen) {
            setSelectedRoutes([]);
            setAssignedRoutes([]); // Clear assigned routes when closing modal
            if (!currentTransporterCode) {
                setSelectedRows([]);
            }
        }
        setIsAssignRouteModalOpen(!isAssignRouteModalOpen);
    };

    // Show success toast notification
    const showSuccessAlert = () => {
        toast.success("Routes assigned successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        setSelectedRows([]);
        setSelectedRoutes([]);
        setAssignedRoutes([]);
        setIsAssignRouteModalOpen(false);
    };

    // Configuration for API requests with Basic Authentication
    const getAuthHeaders = () => {
        const username = process.env.REACT_APP_API_USER_NAME || 'your_default_username';
        const password = process.env.REACT_APP_API_PASSWORD || 'your_default_password';
        const base64Auth = btoa(`${username}:${password}`);

        return {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64Auth}`
        };
    };

    // Function to fetch transporters data
    const fetchTransporters = async () => {
        setIsTransportersLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/allTransporters`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const result = await response.json();
            console.log("API Response:", result);

            if (result && result.data && Array.isArray(result.data)) {
                const mappedData = result.data.map(item => ({
                    id: item.id,
                    transporterCode: item.code,
                    transporterName: item.name,
                    contactPerson: item.contactPerson || "",
                    phoneNo: item.contactNumber || "",
                    emailId: item.contactEmail || "",
                    rType: item.modeTransport || ""
                }));

                console.log("Mapped Data:", mappedData);
                setTransporters(mappedData);
            } else {
                console.warn("Response structure is not as expected:", result);
                setTransporters([]);
            }
        } catch (error) {
            console.error("Error fetching transporters:", error);
            setTransporters([]);
            toast.error("Failed to fetch transporters. Please try again later.", {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsTransportersLoading(false);
        }
    };

    useEffect(() => {
        fetchTransporters();
    }, []);

    // NEW: Function to fetch assigned routes for a specific transporter
    const fetchAssignedRoutes = async (transporterCode) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/transportercode/${transporterCode}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Assigned routes API response for", transporterCode, ":", result);

                if (result.datalist && Array.isArray(result.datalist)) {
                    // Extract route codes from assigned routes
                    const assignedRouteCodes = result.datalist
                        .map(item => item.routeCode)
                        .filter(routeCode => routeCode); // Filter out null/undefined values
                    
                    console.log("Extracted assigned route codes:", assignedRouteCodes);
                    return assignedRouteCodes;
                }
            } else {
                console.log("No assigned routes found for transporter:", transporterCode);
            }
            return [];
        } catch (error) {
            console.error("Error fetching assigned routes for", transporterCode, ":", error);
            return [];
        }
    };

    // UPDATED: Function to fetch all routes and identify assigned ones
    const fetchAllRoutes = async (transporterCode = null) => {
        setIsRoutesLoading(true);
        try {
            // Fetch all routes
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/getAllRoutes`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Raw API Response:", result);

                if (result.data && Array.isArray(result.data)) {
                    const mappedRoutes = result.data.map(route => {
                        return {
                            id: route.id,
                            routeCode: route.routeCode || "",
                            departureLocation: route.routeDetermination || route.routeName || "",
                            destinationLocation: route.routeDestination || "",
                            routeType: route.routeType || "",
                            distance: route.routeDistance ? `${route.routeDistance} km` : "",
                        };
                    });

                    console.log("Mapped routes:", mappedRoutes);

                    // Always show ALL routes
                    setRoutes(mappedRoutes);

                    // If transporterCode is provided, identify and pre-check assigned routes
                    if (transporterCode) {
                        const assignedRouteCodes = await fetchAssignedRoutes(transporterCode);
                        console.log("Already assigned route codes:", assignedRouteCodes);

                        // Find assigned route IDs from all routes based on route codes
                        const assignedRouteIds = mappedRoutes
                            .filter(route => assignedRouteCodes.includes(route.routeCode))
                            .map(route => route.id);

                        console.log("Assigned route IDs:", assignedRouteIds);

                        // Set assigned routes IDs for marking in UI
                        setAssignedRoutes(assignedRouteIds);
                        setSelectedRoutes(assignedRouteIds); // Pre-check assigned routes

                        console.log(`Successfully loaded ${mappedRoutes.length} routes with ${assignedRouteIds.length} pre-selected`);
                    } else {
                        // For multiple transporter selection, show all routes with no pre-selection
                        setAssignedRoutes([]);
                        setSelectedRoutes([]);
                        console.log(`Successfully loaded ${mappedRoutes.length} routes`);
                    }

                    if (mappedRoutes.length === 0) {
                        toast.warning("No routes available for assignment.", {
                            position: "top-right",
                            autoClose: 3000,
                        });
                    }
                } else {
                    console.error("Invalid data structure received from routes API:", result);
                    setRoutes([]);
                    toast.error("Invalid data format received from routes API.", {
                        position: "top-right",
                        autoClose: 5000,
                    });
                }
            } else {
                console.error("Failed to fetch routes. Status:", response.status);
                const errorText = await response.text();
                console.error("Error response:", errorText);
                setRoutes([]);
                toast.error("Failed to fetch routes. Please try again later.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Error fetching all routes:", error);
            setRoutes([]);
            toast.error("Error fetching routes. Please try again later.", {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsRoutesLoading(false);
        }
    };

    const handleViewRoutes = async (transporterCode) => {
        setIsViewRoutesLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/transportercode/${transporterCode}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                const result = await response.json();
                console.log("View routes API response:", result);

                if (result.datalist && Array.isArray(result.datalist)) {
                    const transformedData = result.datalist.map(item => ({
                        routeCode: item.routeCode || "",
                        departureLocation: item.routeName || "",
                        destinationLocation: item.routeDestination || "",
                        routeType: item.routeType || "",
                        distance: item.routeDistance || ""
                    }));
                    setViewRouteData(transformedData);
                } else {
                    console.warn("Invalid data structure in route response");
                    setViewRouteData([]);
                }
            } else {
                console.error(`Failed to fetch routes for transporter. Status: ${response.status}`);
                setViewRouteData([]);
                toast.warning("No routes found for this transporter.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            setCurrentTransporterCode(transporterCode);
            setIsViewRouteModalOpen(true);
        } catch (error) {
            console.error("Error fetching routes for transporter:", error);
            setViewRouteData([]);
            setCurrentTransporterCode(transporterCode);
            setIsViewRouteModalOpen(true);
            toast.error("Error fetching routes for this transporter.", {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsViewRoutesLoading(false);
        }
    };

    // Columns for transporters table
    const columns = useMemo(
        () => [
            {
                Header: () => (
                    <Input
                        type="checkbox"
                        checked={transporters.length > 0 && selectedRows.length === transporters.length}
                        onChange={() => {
                            setSelectedRows(
                                selectedRows.length === transporters.length
                                    ? []
                                    : transporters.map(t => t.id)
                            );
                        }}
                    />
                ),
                accessor: "checkbox",
                disableHiding: true,
                Cell: ({ row }) => (
                    <Input
                        type="checkbox"
                        checked={selectedRows.includes(row.original.id)}
                        onChange={() => {
                            setSelectedRows(prevSelected =>
                                prevSelected.includes(row.original.id)
                                    ? prevSelected.filter(id => id !== row.original.id)
                                    : [...prevSelected, row.original.id]
                            );
                        }}
                    />
                ),
                disableSortBy: true,
            },
            { Header: "Transporter Code", accessor: "transporterCode" },
            { Header: "Transporter name", accessor: "transporterName" },
            { Header: "Contact Person", accessor: "contactPerson" },
            { Header: "Phone No.", accessor: "phoneNo" },
            { Header: "Email Id", accessor: "emailId" },
            { Header: "R-Type", accessor: "rType" },
            {
                Header: "Assign Route",
                Cell: ({ row }) => (
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <Link
                            to="#"
                            className="text-info"
                            onClick={() => handleViewRoutes(row.original.transporterCode)}
                        >
                            <i className="ri-eye-line fs-16"></i>
                        </Link>
                        <Link
                            to="#"
                            className="text-success"
                            onClick={() => {
                                setCurrentTransporterCode(row.original.transporterCode);
                                // UPDATED: Pass transporter code to fetch and filter common routes
                                fetchAllRoutes(row.original.transporterCode);
                                handleModalToggle();
                            }}
                        >
                            <img
                                src={mappingIcon}
                                alt="Mapping Icon"
                                style={{
                                    width: '16px',
                                    height: '18px',
                                    filter: 'brightness(0) saturate(100%) invert(45%) sepia(100%) saturate(2878%) hue-rotate(200deg) brightness(90%) contrast(120%)'
                                }}
                            />
                        </Link>
                    </div>
                ),
                disableSortBy: true,
            }
        ],
        [selectedRows, transporters]
    );

    // Handle route assignment
    const handleAssignRoutes = async () => {
        setIsAssigningRoutes(true);
        try {
            let mappingData = [];
            const currentDate = new Date().toISOString().split('T')[0];

            if (currentTransporterCode) {
                mappingData = selectedRoutes.map(routeId => {
                    const route = routes.find(r => r.id === routeId);
                    return {
                        transporterCode: currentTransporterCode,
                        routeCode: route.routeCode,
                        createdDate: currentDate,
                        status: "A"
                    };
                });
            }
            else if (selectedRows.length > 0) {
                selectedRows.forEach(transporterId => {
                    const transporter = transporters.find(t => t.id === transporterId);
                    selectedRoutes.forEach(routeId => {
                        const route = routes.find(r => r.id === routeId);
                        mappingData.push({
                            transporterCode: transporter.transporterCode,
                            routeCode: route.routeCode,
                            createdDate: currentDate,
                            status: "A"
                        });
                    });
                });
            }

            console.log("Attempting to assign routes:", mappingData);

            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transportersRouteMap/update`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(mappingData)
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Routes assigned successfully:", result);

                if (Array.isArray(result) && result.length > 0 && result[0].meta) {
                    toast.success(result[0].meta.message, {
                        position: "top-right",
                        autoClose: 5000,
                    });
                } else {
                    toast.success("Routes assigned successfully", {
                        position: "top-right",
                        autoClose: 5000,
                    });
                }

                fetchTransporters();

                // if (currentTransporterCode) {
                //     handleViewRoutes(currentTransporterCode);
                // }
            } else {
                console.error("Failed to assign routes. Status:", response.status);

                if (Array.isArray(result) && result.length > 0 && result[0].meta) {
                    toast.error(result[0].meta.message, {
                        position: "top-right",
                        autoClose: 5000,
                    });
                } else {
                    toast.error("Failed to assign routes. Please try again.", {
                        position: "top-right",
                        autoClose: 5000,
                    });
                }
            }

        } catch (error) {
            console.error("Error assigning routes:", error);
            toast.error("An error occurred while assigning routes.", {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsAssigningRoutes(false);
        }
    };

    // UPDATED: Handle Assign Multiple Route button click
    const handleAssignMultipleRouteClick = () => {
        if (selectedRows.length > 0) {
            setCurrentTransporterCode("");
            setAssignedRoutes([]); // Clear assigned routes for multiple selection
            fetchAllRoutes(); // Don't pass transporter code for multiple selection - shows all routes
            handleModalToggle();
        }
    };

    // Handle the download functionality
    const handleDownload = (e) => {
        e.preventDefault();
        downloadCSV();
        setIsExportCSV(false);
    };

    // Download CSV function
    const downloadCSV = () => {
        if (transporters.length === 0) {
            toast.warning("No data available to export", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        const headers = [
            "Transporter Code",
            "Transporter Name",
            "Contact Person",
            "Phone No.",
            "Email Id",
            "R-Type"
        ].join(',') + '\n';

        const rows = transporters.map(transporter =>
            [
                transporter.transporterCode,
                transporter.transporterName,
                transporter.contactPerson,
                transporter.phoneNo,
                transporter.emailId,
                transporter.rType
            ].join(',')
        ).join('\n');

        const csvData = headers + rows;

        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'TransporterRouteMapping.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    document.title = "Route Mapping | EPLMS";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Transporter Route Mapping" pageTitle="Transporter Route Mapping" />

                    <Row>
                        <Col lg={12}>
                            <Card id="transporterList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title1 mb-0 bg-light">Transporter Route Mapping</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div className="d-flex gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-success add-btn"
                                                    id="assignMultilpeRoute"
                                                    onClick={handleAssignMultipleRouteClick}
                                                    disabled={selectedRows.length === 0}
                                                >
                                                    <i className="ri-map-pin-line align-bottom me-1"></i> Assign Multiple Route
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-info add-btn"
                                                    onClick={() => setIsExportCSV(true)}
                                                >
                                                    <i className="ri-file-download-line align-bottom me-1"></i> Export
                                                </button>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0">
                                    <div>
                                        {isTransportersLoading ? (
                                            <Loader />
                                        ) : (
                                            <TableContainer
                                                columns={columns}
                                                data={transporters}
                                                isGlobalFilter={true}
                                                isAddUserList={false}
                                                customPageSize={5}
                                                isGlobalSearch={true}
                                                className="custom-header-css"
                                                SearchPlaceholder="Search for transporter..."
                                                divClass="overflow-auto"
                                                tableClass="width-50"
                                            />
                                        )}
                                    </div>

                                    <ToastContainer
                                        position="top-right"
                                        autoClose={3000}
                                        hideProgressBar={false}
                                        closeOnClick
                                        rtl={false}
                                        pauseOnFocusLoss
                                        draggable
                                        pauseOnHover
                                        theme="light"
                                        toastStyle={{ backgroundColor: "white" }}
                                    />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            <ViewRoutesModal
                isOpen={isViewRouteModalOpen}
                toggle={() => setIsViewRouteModalOpen(!isViewRouteModalOpen)}
                currentTransporterCode={currentTransporterCode}
                viewRouteData={viewRouteData}
                isLoading={isViewRoutesLoading}
            />

            {/* UPDATED: Pass assignedRoutes to modal */}
            <AssignRouteModal
                isOpen={isAssignRouteModalOpen}
                toggle={handleModalToggle}
                currentTransporterCode={currentTransporterCode}
                routes={routes}
                selectedRoutes={selectedRoutes}
                setSelectedRoutes={setSelectedRoutes}
                assignedRoutes={assignedRoutes} // NEW PROP
                handleAssignRoutes={handleAssignRoutes}
                isLoading={isRoutesLoading || isAssigningRoutes}
            />

            {isExportCSV && (
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    onDownloadClick={handleDownload}
                    data={transporters}
                />
            )}
        </React.Fragment>
    );
};

export default RouteMapping;