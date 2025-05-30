import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../MasterVehicle/Vehicle.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderNew from "../../../Components/Common/Loader_new";
import Flatpickr from "react-flatpickr";
import classnames from "classnames";
import getChartColorsArray from "../../../Components/Common/ChartsDynamicColor";
import ReactApexChart from "react-apexcharts";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import YardGraphData from "./yardGraphData";


const YardDashboard = () => {


    // Outline Border Nav Tabs
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [outlineBorderNav, setoutlineBorderNav] = useState("1");
    const [countData, setCountData] = useState("");
    const [vehicleYardInData, setVehicleYardInData] = useState([]);
    const [DIReceivedData, setDIReceivedData] = useState([]);
    const [withoutDIReceivedData, setWithoutDIReceivedData] = useState([]);
    const [DocExpiredData, setDocExpiredData] = useState([]);
    const [cardHeader, setCardHeader] = useState('');
    const [activeTable, setActiveTable] = useState('');
    const [latestData, setLatestData] = useState([]);
    const [loader, setloader] = useState(false);
    const [loaderModal, setloaderModal] = useState(false);
    const [plant_Code, setPlantCode] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentBodyType, setBodyType] = useState('');

    const outlineBorderNavtoggle = (tab) => {
        if (outlineBorderNav !== tab) {
            setoutlineBorderNav(tab);
        }
    };

    useEffect(() => {
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
        getCountData();

    }, []);

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            username: process.env.REACT_APP_API_USER_NAME,
            password: process.env.REACT_APP_API_PASSWORD,
        },
    };

    const getCountData = async () => {
        setloader(true);
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        try {
            const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/totalYardInCounts/${plantcode}`, config)
                .then(res => {
                    const data = res;
                    setCountData(data);
                    setloader(false);
                });
        }
        catch (e) {
            toast.error(e, { autoClose: 3000 });
            setloader(false);
        }

    }

    const refreshData = useCallback(() => {
        setRefreshKey(prevKey => prevKey + 1);
        getCountData();
    }, []);


    const RefreshedModalData = async (cardHeader) => {
        if (cardHeader === "Vehicle Yard In Details" && currentBodyType === "BAG") {
            setloaderModal(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/vehicle?plantCode=${plant_Code}&vehicleBodyType=BAG`, config);
                const data = res;
                setVehicleYardInData(data);
                setLatestData(data);
                setloaderModal(false);
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloaderModal(false); // Ensure loader is stopped even if there is an error
            }
        }
        if (cardHeader === "Vehicle Yard In Details" && currentBodyType === "BLK") {
            setloaderModal(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/vehicle?plantCode=${plant_Code}&vehicleBodyType=BLK`, config);
                const data = res;
                setVehicleYardInData(data);
                setLatestData(data);
                setloaderModal(false);
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloaderModal(false); // Ensure loader is stopped even if there is an error
            }
        }
        if (cardHeader === "DI Received Details" && currentBodyType === "BAG") {
            setloaderModal(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/diReceived?plantCode=${plant_Code}&vehicleBodyType=BAG`, config);
                const data = res;
                setDIReceivedData(data);
                setLatestData(data.reverse());
                setloaderModal(false);
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloaderModal(false); // Ensure loader is stopped even if there is an error
            }
        }
        if (cardHeader === "DI Received Details" && currentBodyType === "BLK") {
            setloaderModal(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/diReceived?plantCode=${plant_Code}&vehicleBodyType=BLK`, config);
                const data = res;
                setDIReceivedData(data);
                setLatestData(data.reverse());
                setloaderModal(false);
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloaderModal(false); // Ensure loader is stopped even if there is an error
            }
        }
        if (cardHeader === "Without DI Received Details" && currentBodyType === "BAG") {
            setloaderModal(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/withoutDiReceived?plantCode=${plant_Code}&vehicleBodyType=BAG`, config);
                const data = res;
                setWithoutDIReceivedData(data);
                setLatestData(data);
                setloaderModal(false);
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloaderModal(false); // Ensure loader is stopped even if there is an error
            }
        }
        if (cardHeader === "Without DI Received Details" && currentBodyType === "BLK") {
            setloaderModal(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/withoutDiReceived?plantCode=${plant_Code}&vehicleBodyType=BLK`, config);
                const data = res;
                setWithoutDIReceivedData(data);
                setLatestData(data);
                setloaderModal(false);
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloaderModal(false); // Ensure loader is stopped even if there is an error
            }
        }
        if (cardHeader === "Document Expired Vehicle Details" && currentBodyType === "BAG") {
            setloaderModal(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/documentExpired?plantCode=${plant_Code}&vehicleBodyType=BAG`, config);
                const data = res;
                setDocExpiredData(data);
                setLatestData(data);
                setloaderModal(false);
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloaderModal(false); // Ensure loader is stopped even if there is an error
            }
        }
        if (cardHeader === "Document Expired Vehicle Details" && currentBodyType === "BLK") {
            setloaderModal(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/documentExpired?plantCode=${plant_Code}&vehicleBodyType=BLK`, config);
                const data = res;
                setDocExpiredData(data);
                setLatestData(data);
                setloaderModal(false);
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloaderModal(false); // Ensure loader is stopped even if there is an error
            }
        }
    }

    const getVehicleYardInData = async (bodyType) => {
        setVehicleYardInData([]);
        setLatestData([]);
        if (bodyType === "BAG") {
            setloader(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/vehicle?plantCode=${plant_Code}&vehicleBodyType=BAG`, config);
                const data = res;
                setVehicleYardInData(data);
                setLatestData(data);
                setViewModal();
                setloader(false);
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloader(false); // Ensure loader is stopped even if there is an error
            }
        }
        else {
            setloader(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/vehicle?plantCode=${plant_Code}&vehicleBodyType=BLK`, config);
                const data = res;
                setVehicleYardInData(data);
                setLatestData(data);
                setViewModal();
                setloader(false);
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloader(false); // Ensure loader is stopped even if there is an error
            }
        }

    }

    const getDIReceivedData = async (bodyType) => {
        setDIReceivedData([]);
        setLatestData([]);
        if (bodyType === "BAG") {
            setloader(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/diReceived?plantCode=${plant_Code}&vehicleBodyType=BAG`, config);
                const data = res;
                setDIReceivedData(data);
                setLatestData(data.reverse());
                setloader(false);
                setViewModal();
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloader(false); // Ensure loader is stopped even if there is an error
            }
        }
        else {
            setloader(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/diReceived?plantCode=${plant_Code}&vehicleBodyType=BLK`, config);
                const data = res;
                setDIReceivedData(data);
                setLatestData(data.reverse());
                setloader(false);
                setViewModal();
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloader(false); // Ensure loader is stopped even if there is an error
            }
        }
    }

    const getWithoutDIReceivedData = async (bodyType) => {
        setWithoutDIReceivedData([]);
        setLatestData([]);
        if (bodyType === "BAG") {
            setloader(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/withoutDiReceived?plantCode=${plant_Code}&vehicleBodyType=BAG`, config);
                const data = res;
                setWithoutDIReceivedData(data);
                setLatestData(data);
                setloader(false);
                setViewModal();
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloader(false); // Ensure loader is stopped even if there is an error
            }
        }
        else {
            setloader(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/withoutDiReceived?plantCode=${plant_Code}&vehicleBodyType=BLK`, config);
                const data = res;
                setWithoutDIReceivedData(data);
                setLatestData(data);
                setloader(false);
                setViewModal();
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloader(false); // Ensure loader is stopped even if there is an error
            }
        }
    }

    const getDocExpiredData = async (bodyType) => {
        setDocExpiredData([]);
        setLatestData([]);
        if (bodyType === "BAG") {
            setloader(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/documentExpired?plantCode=${plant_Code}&vehicleBodyType=BAG`, config);
                const data = res;
                setDocExpiredData(data);
                setLatestData(data);
                setloader(false);
                setViewModal();
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloader(false); // Ensure loader is stopped even if there is an error
            }
        }
        else {
            setloader(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/documentExpired?plantCode=${plant_Code}&vehicleBodyType=BLK`, config);
                const data = res;
                setDocExpiredData(data);
                setLatestData(data);
                setloader(false);
                setViewModal();
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloader(false); // Ensure loader is stopped even if there is an error
            }
        }
    }

    const ApproveVehicle = async (vehicleNumber) => {
        setloader(true);
        try {
            if (vehicleNumber) {
                const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/approval?vehicleNumber=${vehicleNumber}`, config)
                console.log(res);
                toast.success("Approval request sent successfully", { autoClose: 3000 });
                setloader(false);
                getCountData();

            }
            else {
                toast.error("Vehicle not found!", { autoClose: 3000 });
            }
        }
        catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
        }
        setViewModal();
    };
    const [documentModal, setDocumentModal] = useState(false);

    const setViewModal = () => {
        setDocumentModal(!documentModal);
    };

    const openModal = (data, bodyType) => {
        setBodyType(bodyType);
        if (data === 1) {
            setCardHeader("Vehicle Yard In Details");
            getVehicleYardInData(bodyType);
            setActiveTable(data);
        }
        if (data === 2) {
            setCardHeader("DI Received Details");
            getDIReceivedData(bodyType);
            setActiveTable(data);
        }
        if (data === 3) {
            setCardHeader("Without DI Received Details");
            getWithoutDIReceivedData(bodyType);
            setActiveTable(data);
        }
        if (data === 4) {
            setloader(false);
            setCardHeader("Document Expired Vehicle Details");
            getDocExpiredData(bodyType);
            setActiveTable(data);
        }
    }


    const updatePriority = async (id, priority) => {debugger;
        setloader(true);
        const data = {
            id: id,
            priorityVehicle: priority   
        };
        try {
            if (id) {
                const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/updatePriorityVehicle`,data, config)
                console.log(res);
                toast.success("Priority updated successfully!", { autoClose: 3000 });
                updateDataAfterPriorityChange(currentBodyType);
                setloader(false);

            }
            else {
                toast.error("Something went wrong!", { autoClose: 3000 });
                setloader(false);
            }
        }
        catch (e) {
            toast.error("Failed to update priority!", { autoClose: 3000 });
            setloader(false);
        }
    };

    const updateDataAfterPriorityChange = async (bodyType) => {
        if (bodyType === "BAG") {
            setloader(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/diReceived?plantCode=${plant_Code}&vehicleBodyType=BAG`, config);
                const data = res;
                setDIReceivedData(data);
                setLatestData(data.reverse());
                setloader(false);
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloader(false); // Ensure loader is stopped even if there is an error
            }
        }
        else {
            setloader(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/diReceived?plantCode=${plant_Code}&vehicleBodyType=BLK`, config);
                const data = res;
                setDIReceivedData(data);
                setLatestData(data.reverse());
                setloader(false);
            } catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloader(false); // Ensure loader is stopped even if there is an error
            }
        }
    }
    

    const columns = useMemo(
        () => [
            {
                Header: '',
                accessor: 'id',
                hiddenColumns: true,
                Cell: (cell) => {
                    return <input type="hidden" value={cell.value} />;
                }
            },
            // {
            //     Header: 'Sr No.',
            //     accessor: (_, index) => vehicleYardInData.length - index, // Calculate index in reverse
            //     disableFilters: true,
            // },
            {
                Header: 'Token No.',
                accessor: "serialNumber",
                disableFilters: true,
            },
            {
                Header: "Vehicle Number",
                accessor: "registrationNumber",
                filterable: false,
            },
            {
                Header: "Transporter",
                accessor: "transporter",
                filterable: false,
            },
            // {
            //     Header: "Vehicle Type",
            //     accessor: "vehicleType",
            //     filterable: false,
            // },
            // {
            //     Header: "Manufacturing Date",
            //     accessor: "manufacturingDate",
            //     filterable: false,
            // },
            // {
            //     Header: "Max Capacity",
            //     accessor: "vehicleCapacityMax",
            //     filterable: false,
            // },
            // {
            //     Header: "Plant Code",
            //     accessor: "plantCode",
            //     filterable: false,
            // },
            // {
            //     Header: "RC Number",
            //     accessor: "rcNumber",
            //     filterable: false,
            // },
            // {
            //     Header: "Tare Weight",
            //     accessor: "tareWeight",
            //     filterable: false,
            // },
            // {
            //     Header: "Gross Weight",
            //     accessor: "grossWeight",
            //     filterable: false,
            // },

            {
                Header: "IGP No",
                accessor: "igpNumber",
                filterable: false,
            },
            {
                Header: "Yard In Date & Time",
                accessor: "yardIn",
                filterable: false,
                Cell: (cell) => {
                    if (cell.value) {
                        return ((cell.value).includes("T") ? (cell.value).replace("T", " ") : cell.value);
                    }

                }
            },
            // {
            //     Header: "Unit Code",
            //     accessor: "unitCode",
            //     filterable: false,
            // },
            {
                Header: "Aging time(HH:MM)",
                accessor: "agingTime",
                filterable: false,
                Cell: (cellProps) => {
                    switch (cellProps.row.original.agingStatus) {
                        case "W":
                            return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.agingTime}</label>
                        case "B":
                            return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.agingTime}</label>
                        case "G":
                            return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.agingTime}</label>
                        case "R":
                            return <label style={{ background: "rgb(206 38 3 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.agingTime}</label>
                        default:
                            return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.agingTime}</label>
                    }
                }
            },
            {
                Header: "Material Code",
                accessor: "materialCode",
                filterable: false,
            },
            {
                Header: "Material Type",
                accessor: "materialType",
                filterable: false,
            },
            {
                Header: "Net Capacity(MT)",
                accessor: "net_weight",
                filterable: false,
            },
        ],
    );

    const DIcolumns = useMemo(
        () => [
            {
                Header: '',
                accessor: 'id',
                hiddenColumns: true,
                Cell: (cell) => {
                    return <input type="hidden" value={cell.value} />;
                }
            },
            {
                Header: 'Token No.',
                accessor: "serialNumber",
                disableFilters: true,
            },
            {
                Header: "Vehicle Number",
                accessor: "vehicleNumber",
                filterable: false,
            },
            {
                Header: "Transporter",
                accessor: "transporter",
                filterable: false,
            },
            {
                Header: "Trip Id",
                accessor: "tripId",
                filterable: false,
            },
            {
                Header: "Order Type",
                accessor: "orderType",
                filterable: false,
            },
            {
                Header: "Consignment Date",
                accessor: "consignmentDate",
                filterable: false,
            },
            {
                Header: "DI Number",
                accessor: "diNumber",
                filterable: false,
            },
            {
                Header: "Material Code",
                accessor: "materialCode",
                filterable: false,
            },
            {
                Header: "Material Type",
                accessor: "materialType_code",
                filterable: false,
            },
            {
                Header: "Sequenced Packer",
                accessor: "sequencedPacker",
                filterable: false,
            },
            {
                Header: "Sequenced Terminal",
                accessor: "sequencedTerminal",
                filterable: false,
            },
            {
                Header: "Priority",
                Cell: (cellProps) => {
                    const { original } = cellProps.row; // Get row data
                    const [isChecked, setIsChecked] = React.useState(original.priority_vehicle === 1); // Set initial state
            
                    const handleToggle = (event) => {
                        const newValue = event.target.checked ? 1 : 0;
                        setIsChecked(event.target.checked);
                        
                        // Call your function here
                        updatePriority(original.diId, newValue);
                    };
            
                    return (
                        <div className="flex-shrink-0">
                            <div className="form-check form-switch form-switch-right form-switch-md">
                                <input
                                    className="form-check-input code-switcher"
                                    type="checkbox"
                                    id={`priority-toggle-${original.id}`}
                                    checked={isChecked}
                                    onChange={handleToggle}
                                />
                            </div>
                        </div>
                    );
                },
            }
            
        ],
    );
    const withoutDIcolumns = useMemo(
        () => [
            {
                Header: '',
                accessor: 'id',
                hiddenColumns: true,
                Cell: (cell) => {
                    return <input type="hidden" value={cell.value} />;
                }
            },
            {
                Header: "Vehicle Number",
                accessor: "vehicleNumber",
                filterable: false,
            },
            {
                Header: "Transporter",
                accessor: "transporter",
                filterable: false,
            },
            {
                Header: "Trip Id",
                accessor: "tripId",
                filterable: false,
            },
            {
                Header: "Order Type",
                accessor: "orderType",
                filterable: false,
            },
            {
                Header: "Consignment Date",
                accessor: "consignmentDate",
                filterable: false,
            },
            {
                Header: "DI Number",
                accessor: "diNumber",
                filterable: false,
            },
            // {
            //     Header: "Custome Code",
            //     accessor: "customerCode",
            //     filterable: false,
            // },
            {
                Header: "Sequenced Packer",
                accessor: "sequencedPacker",
                filterable: false,
            },
            {
                Header: "Sequenced Terminal",
                accessor: "sequencedTerminal",
                filterable: false,
            }
        ],
    );
    const DocExpcolumns = useMemo(
        () => [
            {
                Header: '',
                accessor: 'id',
                hiddenColumns: true,
                Cell: (cell) => {
                    return <input type="hidden" value={cell.value} />;
                }
            },
            {
                Header: "Vehicle Number",
                accessor: "registrationNumber",
                filterable: false,
            },
            {
                Header: "Transporter",
                accessor: "transporter",
                filterable: false,
            },
            // {
            //     Header: "Model Number",
            //     accessor: "modelNumber",
            //     filterable: false,
            // },
            // {
            //     Header: "Vehicle Type",
            //     accessor: "vehicleType",
            //     filterable: false,
            // },
            {
                Header: "Pollution Exp Dt.",
                //accessor: "pollutionExpiryDate",
                Cell: (cellProps) => {
                    return (
                        <span className="text-danger">{cellProps.row.original.pollutionExpiryDate}</span>
                    );
                },
            },
            {
                Header: "Fitness Exp Dt.",
                //accessor: "fitnessExpiryDate",
                Cell: (cellProps) => {
                    return (
                        <span className="text-danger">{cellProps.row.original.fitnessExpiryDate}</span>
                    );
                },
            },
            {
                Header: "Insurance Exp Dt.",
                //accessor: "insurancePolicyExpiry",
                Cell: (cellProps) => {
                    return (
                        <span className="text-danger">{cellProps.row.original.insurancePolicyExpiry}</span>
                    );
                },
            },
            {
                Header: "Max Capacity",
                accessor: "vehicleCapacityMax",
                filterable: false,
            },
            {
                Header: "Plant Code",
                accessor: "plantCode",
                filterable: false,
            },
            // {
            //     Header: "RC Number",
            //     accessor: "rcNumber",
            //     filterable: false,
            // },
            // {
            //     Header: "Action",
            //     Cell: (cellProps) => {
            //         if (cellProps.row.original.documentApproval) {
            //             return (
            //                 <ul className="list-inline hstack gap-2 mb-0">
            //                     <li className="list-inline-item edit" title="Approval Sent"><i className="ri-check-double-line fs-16 text-warning"></i></li>
            //                 </ul>
            //             );
            //         }
            //         else {
            //             return (
            //                 <ul className="list-inline hstack gap-2 mb-0">
            //                     <li className="list-inline-item edit" title="Send for Approval">
            //                         <Link
            //                             to="#"
            //                             className="text-primary d-inline-block approve-item-btn"
            //                             onClick={() => { const vehicleNumber = cellProps.row.original.registrationNumber; ApproveVehicle(vehicleNumber); }}
            //                         ><i className="ri-checkbox-circle-line fs-16 text-success"></i>
            //                         </Link>
            //                     </li>
            //                 </ul>
            //             );
            //         }
            //     },
            // },

        ],
    );

    const handleDownload = async (e) => {
        e.preventDefault();
        downloadCSV();
        setIsExportCSV(false)
    };

    const downloadCSV = () => {
        const bl = [];
        columns.forEach((row) => {
            if (row.accessor !== undefined && row.accessor !== 'id') {
                bl.push(row.accessor + "$$$" + row.Header);
            }
        });
        const bla = [];
        latestData.forEach((row1) => {
            const blp = {};
            bl.forEach((rows2) => {
                const pl = rows2.split("$$$");
                if (pl[0] === 'status') {
                    blp[pl[1]] = (row1[pl[0]] === 1 ? 'Active' : 'Deactive');
                } else if (pl[0] === 'quantity') {
                    blp[pl[1]] = row1[pl[0]] + " " + row1["unitMeasurement"];
                }
                else if (pl[0] === 'yardIn' && row1[pl[0]].includes('T')) {
                    blp[pl[1]] = row1[pl[0]].replace('T', ' ');
                } else {
                    blp[pl[1]] = row1[pl[0]];
                }
            });
            bla.push(blp);
        });
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        // Convert the data to a worksheet
        const ws = XLSX.utils.json_to_sheet(bla, { header: Object.keys(bla[0]) });
        // Apply styling to the header row
        ws["!cols"] = [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }]; // Example: Set column widths
        // ws["A1"].s = { // Style for the header cell A1
        //     fill: {
        //         fgColor: { rgb: "FFFF00" } // Yellow background color
        //     },
        //     font: {
        //         bold: true,
        //         color: { rgb: "000000" } // Black font color
        //     }
        // };
        // Add more styling options as needed

        // Add the worksheet to the workbook

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Generate an XLSX file
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Convert binary string to Blob
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        // Save the Blob as a file using FileSaver
        const fileNames = {
            "1": 'vehicle_yardIN.xlsx',
            "2": 'di_received.xlsx',
            "3": 'without_di_received.xlsx',
            "4": 'documnet_exp.xlsx'
        };
        fileNames[activeTable] && FileSaver.saveAs(blob, fileNames[activeTable]);

        // Utility function to convert a string to an ArrayBuffer
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buf;
        }
    };



    document.title = "Yard Dashboard | EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Yard Dashboard" pageTitle="EPLMS" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <div className="card-body pt-4">
                                    <Nav pills className="nav-customs nav-danger mb-3 nav nav-pills" style={{ marginLeft: '-8px' }}>
                                        <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "1", })} onClick={() => { outlineBorderNavtoggle("1"); }}>
                                                YARD IN
                                            </NavLink>
                                        </NavItem>
                                        {/* <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "2", })} onClick={() => { outlineBorderNavtoggle("2"); }}>
                                                YARD OUT
                                            </NavLink>
                                        </NavItem> */}
                                        <div style={{ position: "absolute", top: "12px", right: "8px" }}>
                                            <button type="button" className="btn btn-info ms-2" title="Refresh Data" onClick={() => refreshData()}>
                                                <i className="ri-refresh-line align-bottom me-1"></i>{" "}
                                            </button>
                                        </div>
                                    </Nav>
                                    <TabContent activeTab={outlineBorderNav} className="text-muted">
                                        <TabPane tabId="1" id="border-nav-home">
                                            <Row className="g-3 border border-dashed">

                                                <Col xl={3}>
                                                    <Card className="shadow bg-danger-subtle">
                                                        <CardBody>
                                                            <div className="d-flex">
                                                                <div className="flex-grow-1">
                                                                    <h6 className="text-muted mb-3">VEHICLE YARD IN</h6>
                                                                    {/* <h4 className="mb-0">{countData.vehicleYardIn}</h4> */}
                                                                    <button class="btn btn-outline-primary btn-border btn-sm yrd_btn" onClick={() => { openModal(1, "BAG") }} style={{ marginTop: "-4px" }}><b>Bag || {countData.vehicleYardIn}</b></button>
                                                                    <button class="btn btn-outline-primary btn-border btn-sm ms-2 yrd_btn" onClick={() => { openModal(1, "BLK") }} style={{ marginTop: "-4px" }}><b>Bulker || {countData.bulkerCount}</b></button>
                                                                </div>
                                                                <div className="flex-shrink-0 avatar-sm">
                                                                    <div className={"avatar-title fs-22 rounded bg-success"}>
                                                                        <lord-icon src="https://cdn.lordicon.com/uetqnvvg.json" trigger="loop" colors="primary:#fff,secondary:#fff" style={{ width: "25px", height: "25px" }} ></lord-icon>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                <Col xl={3}>
                                                    <Card className="shadow bg-success-subtle">
                                                        <CardBody >
                                                            <div className="d-flex">
                                                                <div className="flex-grow-1">
                                                                    <h6 className="text-muted mb-3">DI RECEIVED</h6>
                                                                    {/* <h4 className="mb-0">{countData.diReceived}</h4> */}
                                                                    <button class="btn btn-outline-primary btn-border btn-sm yrd_btn" onClick={() => { openModal(2, "BAG") }} style={{ marginTop: "-4px" }}><b>Bag || {countData.diReceived}</b></button>
                                                                    <button class="btn btn-outline-primary btn-border btn-sm ms-2 yrd_btn" onClick={() => { openModal(2, "BLK") }} style={{ marginTop: "-4px" }}><b>Bulker || {countData.diReceivedBulker}</b></button>
                                                                </div>
                                                                <div className="flex-shrink-0 avatar-sm">
                                                                    <div className={"avatar-title fs-22 rounded bg-success"}>
                                                                        <i className="ri-arrow-left-down-fill"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                <Col xl={3}>
                                                    <Card className="shadow bg-warning-subtle">
                                                        <CardBody >
                                                            <div className="d-flex">
                                                                <div className="flex-grow-1">
                                                                    <h6 className="text-muted mb-3">WITHOUT DI RECEIVED</h6>
                                                                    {/* <h4 className="mb-0">{countData.withoutDiReceived}</h4> */}
                                                                    <button class="btn btn-outline-primary btn-border btn-sm yrd_btn" onClick={() => { openModal(3, "BAG") }} style={{ marginTop: "-4px" }}><b>Bag || {countData.withoutDiReceived}</b></button>
                                                                    <button class="btn btn-outline-primary btn-border btn-sm ms-2 yrd_btn" onClick={() => { openModal(3, "BLK") }} style={{ marginTop: "-4px" }}><b>Bulker || {countData.withoutDiReceivedBulker}</b></button>
                                                                </div>
                                                                <div className="flex-shrink-0 avatar-sm">
                                                                    <div className={"avatar-title fs-22 rounded bg-warning"}>
                                                                        <i className="ri-arrow-left-down-fill"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                <Col xl={3}>
                                                    <Card className="shadow bg-info-subtle">
                                                        <CardBody >
                                                            <div className="d-flex">
                                                                <div className="flex-grow-1">
                                                                    <h6 className="text-muted mb-3">VEHICLE DOC EXP.</h6>
                                                                    {/* <h4 className="mb-0">{countData.vehicleDocumentExp}</h4> */}
                                                                    <button class="btn btn-outline-primary btn-border btn-sm yrd_btn" onClick={() => { openModal(4, "BAG") }} style={{ marginTop: "-4px" }}><b>Bag || {countData.vehicleDocumentExp}</b></button>
                                                                    <button class="btn btn-outline-primary btn-border btn-sm ms-2 yrd_btn" onClick={() => { openModal(4, "BLK") }} style={{ marginTop: "-4px" }}><b>Bulker || {countData.vehicleDocumentExpBulker}</b></button>
                                                                </div>
                                                                <div className="flex-shrink-0 avatar-sm">
                                                                    <div className={"avatar-title fs-22 rounded bg-danger"}>
                                                                        <i className="ri-close-circle-line"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>

                                            <YardGraphData key={refreshKey} />
                                            {loader && <LoaderNew></LoaderNew>}
                                        </TabPane>
                                    </TabContent>
                                    <TabContent activeTab={outlineBorderNav} className="text-muted">
                                        <TabPane tabId="2" id="border-nav-home">
                                            <Row className="g-3">


                                            </Row>
                                        </TabPane>
                                    </TabContent>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>



            <Modal isOpen={documentModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="xl" toggle={setViewModal}>
                <ModalHeader toggle={setViewModal} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
                    {cardHeader}
                </ModalHeader>
                <ModalBody>

                    <div className="product-content mt-0">
                        <ExportCSVModal
                            show={isExportCSV}
                            onCloseClick={() => setIsExportCSV(false)}
                            onDownloadClick={handleDownload}
                            data={latestData}
                        />
                        {" "}
                        <button style={{ float: "right" }} type="button" className="btn btn-info ms-3" onClick={() => RefreshedModalData(cardHeader)} title="Refresh" disabled={loaderModal ? true : false}>
                            <i className="ri-refresh-line align-bottom me-1"></i>
                        </button>

                        <button style={{ float: "right" }} type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)} title="Download">
                            <i className="ri-file-download-line align-bottom me-1"></i>
                        </button>
                        {loaderModal && <span style={{ color: "green", animation: "blink 1s infinite", position: 'absolute', right: '59px', top: '60px' }}>Fetching latest data...</span>}
                        {activeTable === 1 && vehicleYardInData ? (
                            <TableContainer
                                columns={columns}
                                data={vehicleYardInData}
                                isGlobalFilter={true}
                                isAddUserList={false}
                                customPageSize={5}
                                isGlobalSearch={true}
                                className="custom-header-css"
                                isCustomerFilter={false}
                                SearchPlaceholder='Search by Vehicle No., Material or something..'
                                divClass="overflow-auto"
                                tableClass="width-150"
                            />
                        ) : null
                        }
                        {activeTable === 2 && DIReceivedData ? (
                            <TableContainer
                                columns={DIcolumns}
                                data={DIReceivedData}
                                isGlobalFilter={true}
                                isAddUserList={false}
                                customPageSize={5}
                                isGlobalSearch={true}
                                className="custom-header-css"
                                isCustomerFilter={false}
                                SearchPlaceholder='Search by Vehicle No., Material or something..'
                                divClass="overflow-auto"
                                tableClass="width-180"
                            />
                        ) : null
                        }
                        {activeTable === 3 && withoutDIReceivedData ? (
                            <TableContainer
                                columns={withoutDIcolumns}
                                data={withoutDIReceivedData}
                                isGlobalFilter={true}
                                isAddUserList={false}
                                customPageSize={5}
                                isGlobalSearch={true}
                                className="custom-header-css"
                                isCustomerFilter={false}
                                SearchPlaceholder='Search...'
                                style={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
                            />
                        ) : null
                        }
                        {activeTable === 4 && DocExpiredData ? (
                            <>
                                <TableContainer
                                    columns={DocExpcolumns}
                                    data={DocExpiredData}
                                    isGlobalFilter={true}
                                    isAddUserList={false}
                                    customPageSize={5}
                                    isGlobalSearch={true}
                                    className="custom-header-css"
                                    isCustomerFilter={false}
                                    SearchPlaceholder='Search...'
                                    style={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
                                />
                                {loader && <LoaderNew></LoaderNew>}
                            </>
                        ) : null
                        }
                    </div>
                </ModalBody>
            </Modal>
            <ToastContainer closeButton={false} limit={1} />

        </React.Fragment>
    );
};

export default YardDashboard;
