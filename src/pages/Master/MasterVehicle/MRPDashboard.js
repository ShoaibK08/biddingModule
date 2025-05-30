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
import cameraPic from "../../../assets/images/camera.png";
import WhatsApp from "../../../assets/images/whatsapp.png";
import authbg from "../../../assets/images/WhatsAppBanner.jpeg";


const MRPDashboard = () => {


    // Outline Border Nav Tabs
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [outlineBorderNav, setoutlineBorderNav] = useState("1");
    const [outlineBorderNav1, setoutlineBorderNav1] = useState("1");
    const [countData, setCountData] = useState("");
    const [vehicleYardInData, setVehicleYardInData] = useState([]);
    const [DIReceivedData, setDIReceivedData] = useState([]);
    const [withoutDIReceivedData, setWithoutDIReceivedData] = useState([]);
    const [DocExpiredData, setDocExpiredData] = useState([]);
    const [cardHeader, setCardHeader] = useState('');
    const [activeTable, setActiveTable] = useState('');
    const [latestData, setLatestData] = useState([]);
    const [loader, setloader] = useState(false);
    const [values, setValues] = useState([]);
    const [flag, setFlag] = useState(true);
    const [mobileNumber, setMobileNumber] = useState("9898555555");
    const [HeaderName, setHeaderName] = useState("");
    const [linkUrl, setLinkUrl] = useState("http://localhost:3000/static/media/video.cb1cbfce4c75b1d2380d.mp4");

    const outlineBorderNavtoggle = (tab) => {
        if (outlineBorderNav !== tab) {
            setoutlineBorderNav(tab);
        }
    };

    const outlineBorderNavtoggle1 = (tab) => {
        if (outlineBorderNav1 !== tab) {
            setoutlineBorderNav1(tab);
        }
    };

    useEffect(() => {
        getCountData();
        getHeaderName();
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

    const getHeaderName = () => {
        const main_menu = sessionStorage.getItem("main_menu_login");
        const obj = JSON.parse(main_menu).menuItems[0].subMenuMaster.name;
        setHeaderName(obj);
      }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value || value.valueAsNumber,
        });

    };

    const handleSubmit = (e) => {
        console.log(values)
        e.preventDefault();
        setFlag(true);
    }


    const getCountData = async (e) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/totalYardInCounts`, config)
            .then(res => {
                const data = res;
                setCountData(data);
            });
    }

    const getVehicleYardInData = async (e) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/vehicle`, config)
            .then(res => {
                const data = res;
                setVehicleYardInData(data);
                setLatestData(data);
            });
    }

    const getDIReceivedData = async (e) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/diReceived`, config)
            .then(res => {
                const data = res;
                setDIReceivedData(data);
                setLatestData(data);
            });
    }

    const getWithoutDIReceivedData = async (e) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/withoutDiReceived`, config)
            .then(res => {
                const data = res;
                setWithoutDIReceivedData(data);
                setLatestData(data);
            });
    }

    const getDocExpiredData = async (e) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/documentExpired`, config)
            .then(res => {
                const data = res;
                setDocExpiredData(data);
                setLatestData(data);
            });
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
    const [cameraModal, setCameraModal] = useState(false);
    const [whatsappModal, setwhatsappModal] = useState(false);

    const setViewModal = () => {
        setDocumentModal(!documentModal);
    };

    const setViewModalCamera = () => {
        setCameraModal(!cameraModal);
    };

    const openModal = (data) => {
        if (data === 1) {
            setCardHeader("CURRENT PLANT SCENARIOS");
            //getVehicleYardInData();
            setLatestData(firstData);
            setActiveTable(data);
        }
        else if (data === 2) {
            setCardHeader("LAST ONE MONTH INFO");
            //getDIReceivedData();
            setLatestData(firstData);
            setActiveTable(data);
        }
        else if (data === 3) {
            setCardHeader("PACKER UTILIZATION");
            //getWithoutDIReceivedData();
            setLatestData(firstData);
            setActiveTable(data);
        }
        setViewModal();
    }

    const openModalCamera = () => {
        setViewModalCamera();
    }

    const setOpenWhatsappModal = () => {
        setwhatsappModal(!cameraModal);
    };
    const openModalWhatsApp = (data) => {
        
        console.log(data)
        setOpenWhatsappModal();
    }

    const firstData = [
        {
            "id": 1,
            "vehicleNumber": "GH45UH8703",
            "NumberOfBags": "150",
            "loadedBagsQty": "600",
            "packerName": "Packer1",
            "loaderName": "Loader1",
            "target": "600",
            "actual": "600",
            "productCode": "OPC-43",
            "MRP": "500",
            "ShipToParty": "SH0001",
            "mobileNumber": "9898555555",
            "TimesTamp": "29-11-2023 11:00:00",
        },
        {
            "id": 2,
            "vehicleNumber": "GH45UH8704",
            "NumberOfBags": "180",
            "loadedBagsQty": "598",
            "packerName": "Packer2",
            "loaderName": "Loader1",
            "target": "598",
            "actual": "598",
            "productCode": "OPC-53",
            "MRP": "500",
            "ShipToParty": "SH0001",
            "mobileNumber": "9898555555",
            "TimesTamp": "29-11-2023 11:00:00",
        },
        {
            "id": 3,
            "vehicleNumber": "GH45UH8705",
            "NumberOfBags": "175",
            "loadedBagsQty": "600",
            "packerName": "Packer3",
            "loaderName": "Loader1",
            "target": "600",
            "actual": "600",
            "productCode": "PPC",
            "MRP": "500",
            "ShipToParty": "SH0001",
            "mobileNumber": "9898555555",
            "TimesTamp": "29-11-2023 11:00:00",
        },
        {
            "id": 4,
            "vehicleNumber": "GH45UH8706",
            "NumberOfBags": "140",
            "loadedBagsQty": "598",
            "packerName": "Packer4",
            "loaderName": "Loader1",
            "target": "598",
            "actual": "598",
            "productCode": "OPC-43 Non-Trade",
            "MRP": "500",
            "ShipToParty": "SH0001",
            "mobileNumber": "9898555555",
            "TimesTamp": "29-11-2023 11:00:00",
        },
        {
            "id": 5,
            "vehicleNumber": "GH45UH8707",
            "NumberOfBags": "111",
            "loadedBagsQty": "600",
            "packerName": "Packer5",
            "loaderName": "Loader1",
            "target": "600",
            "actual": "600",
            "productCode": "OPC-53 Non-Trade",
            "MRP": "500",
            "ShipToParty": "SH0001",
            "mobileNumber": "9898555555",
            "TimesTamp": "29-11-2023 11:00:00",
        }
    ]

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
            {
                Header: "Vehicle Number",
                accessor: "vehicleNumber",
                filterable: false,
            },
            {
                Header: "No Of Bags",
                accessor: "NumberOfBags",
                filterable: false,
            },
            {
                Header: "Loaded Bags Qty",
                accessor: "loadedBagsQty",
                filterable: false,
            },
            {
                Header: "Packer Name",
                accessor: "packerName",
                filterable: false,
            },
            {
                Header: "Loader Name",
                accessor: "loaderName",
                filterable: false,
            },
            {
                Header: "Target",
                accessor: "target",
                filterable: false,
            },
            {
                Header: "Actual",
                accessor: "actual",
                filterable: false,
            },
            {
                Header: "Product Code",
                accessor: "productCode",
                filterable: false,
            },
            {
                Header: "MRP",
                accessor: "MRP",
                filterable: false,
            },
            {
                Header: "Ship To Party",
                accessor: "ShipToParty",
                filterable: false,
            },
            {
                Header: "Mobile Number",
                accessor: "mobileNumber",
                filterable: false,
            },
            {
                Header: "TimesTamp",
                accessor: "TimesTamp",
                filterable: false,
            },
            {
                Header: "Action",
                Cell: (cellProps) => {
                    return (
                        <ul className="list-inline hstack gap-2 mb-0">
                            <li className="list-inline-item edit" title="Camera View">
                                <Link
                                    to="#"
                                    className="text-primary d-inline-block edit-item-btn" >
                                    <img style={{ marginTop: "-4px" }} src={cameraPic} alt="" height="20" onClick={() => { openModalCamera() }} />
                                </Link>
                            </li>
                            <li className="list-inline-item" title="WhatsApp">
                                <Link
                                    to="#"
                                    className="text-danger d-inline-block remove-item-btn" >
                                    <img style={{ marginTop: "-4px" }} src={WhatsApp} alt="" height="20" onClick={() => { const data = cellProps.row.original; openModalWhatsApp(data); }} />
                                </Link>
                            </li>
                        </ul>
                    );
                },
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
                Header: "Vehicle Number",
                accessor: "vehicleNumber",
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
                Header: "Custome Code",
                accessor: "customerCode",
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
                Header: "Custome Code",
                accessor: "customerCode",
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
                Header: "Model Number",
                accessor: "modelNumber",
                filterable: false,
            },
            {
                Header: "Vehicle Type",
                accessor: "vehicleType",
                filterable: false,
            },
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
            {
                Header: "RC Number",
                accessor: "rcNumber",
                filterable: false,
            },
            {
                Header: "Action",
                Cell: (cellProps) => {
                    if (cellProps.row.original.documentApproval) {
                        return (
                            <ul className="list-inline hstack gap-2 mb-0">
                                <li className="list-inline-item edit" title="Approval Sent"><i className="ri-check-double-line fs-16 text-warning"></i></li>
                            </ul>
                        );
                    }
                    else {
                        return (
                            <ul className="list-inline hstack gap-2 mb-0">
                                <li className="list-inline-item edit" title="Send for Approval">
                                    <Link
                                        to="#"
                                        className="text-primary d-inline-block approve-item-btn"
                                        onClick={() => { const vehicleNumber = cellProps.row.original.registrationNumber; ApproveVehicle(vehicleNumber); }}
                                    ><i className="ri-checkbox-circle-line fs-16 text-success"></i>
                                    </Link>
                                </li>
                            </ul>
                        );
                    }
                },
            },

        ],
    );

    const status = [
        {
            options: [
                { label: "Jk Cement Panna ", value: "Jk Cement Panna " },
                { label: "Jk Cement Panipat", value: "Jk Cement Panipat" },
            ],
        },
    ];

    const handleDownload = async (e) => {
        e.preventDefault();
        downloadCSV();
        setIsExportCSV(false)
    };

    const downloadCSV = () => {
        const header = Object.keys(latestData[0]).join(',') + '\n';
        const csv = latestData.map((row) => Object.values(row).join(',')).join('\n');
        const csvData = header + csv;
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'table_data.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    // const handleShare = () => {
    //     // Replace 'your-mobile-number' with the actual mobile number (including the country code)
    //     const mobileNumber = '9871262365';

    //     // Replace 'your-message' with the actual message you want to share
    //     const message = 'your-message';

    //     // Construct the WhatsApp share URL with the mobile number and message
    //     const whatsappUrl = `https://wa.me/${mobileNumber}?text=${encodeURIComponent(linkUrl)}`;

    //     // Open the WhatsApp share link in a new tab
    //     window.open(whatsappUrl, '_blank');

    //     // Alternatively, if you want to redirect to the WhatsApp link in the same tab, you can use:
    //     // window.location.href = whatsappUrl;
    //   };

    const RotateLable = ({ dataColors }) => {
        var chartColumnRotateLabelsColors = getChartColorsArray(dataColors);
        const series = [{
            name: 'Number Of Vehicles',
            data: [20, 65, 85, 40, 90, 33,]
        }];
        var options = {
            annotations: {
                points: [{
                    x: 'Bananas',
                    seriesIndex: 0,
                    label: {
                        borderColor: '#775DD0',
                        offsetY: 0,
                        style: {
                            color: '#fff',
                            background: '#775DD0',
                        },
                        //text: 'Bananas are good',
                    }
                }]
            },
            chart: {
                height: 350,
                type: 'bar',
                toolbar: {
                    show: false,
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 10,
                    columnWidth: '35%',
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 2
            },
            colors: chartColumnRotateLabelsColors,
            xaxis: {
                labels: {
                    rotate: -45
                },
                categories: ['Packer1', 'Packer2', 'Packer3', 'Packer4', 'Packer5', 'Packer6'],
                tickPlacement: 'on'
            },
            yaxis: {
                title: {
                    text: 'Number Of Vehicles',
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    type: "horizontal",
                    shadeIntensity: 0.25,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 0.85,
                    opacityTo: 0.85,
                    stops: [50, 0, 100]
                },
            }
        };

        return (
            <ReactApexChart className="apex-charts" options={options} series={series} type="bar" height={350} />
        );
    };

    const Basic = ({ dataColors }) => {
        var BasicColors = getChartColorsArray(dataColors);
        const series = [{
            data: [1500, 2500, 4500, 5000, 1900, 2500, 2000],
            name: 'Number Of Vehicles',           //To remove series type text
        }];

        const options = {
            chart: {
                toolbar: {
                    show: !1,
                }
            },
            plotOptions: {
                bar: {
                    horizontal: !0,
                    columnWidth: '10%',
                    borderRadius: 10,
                }
            },
            dataLabels: {
                enabled: !1
            },
            colors: BasicColors,
            grid: {
                borderColor: "#f1f1f1",
            },
            xaxis: {
                categories: ['Packer1', 'Packer2', 'Packer3', 'Packer4', 'Packer5', 'Packer6', 'Packer7'],
                title: {
                    text: 'Number Of Vehicles',  //To remove series type text
                },
            }
        };

        return (
            <React.Fragment>
                <ReactApexChart
                    className="apex-charts"
                    options={options}
                    series={series}
                    type="bar"
                    height={350}

                />
            </React.Fragment>
        );
    };


    const MonochromePie = ({ dataColors }) => {
        var chartMonochromeColors = getChartColorsArray(dataColors);
        const series = [25, 15, 44, 55, 41]
        var options = {

            chart: {
                height: 300,
                type: 'pie',
            },
            labels: ["OPC-43", "OPC-53", "PPC", "OPC-43 Non-Trade", "OPC-53 Non-Trade"],
            theme: {
                monochrome: {
                    enabled: true,
                    color: '#405189',
                    shadeTo: 'light',
                    shadeIntensity: 0.6
                }
            },

            plotOptions: {
                pie: {
                    dataLabels: {
                        offset: -5
                    }
                }
            },
            title: {
                text: "All Packers",
                style: {
                    fontWeight: 500,
                },
            },
            dataLabels: {
                formatter: function (val, opts) {
                    var name = opts.w.globals.labels[opts.seriesIndex];
                    return [name, val.toFixed(1) + '%'];
                },
                dropShadow: {
                    enabled: false,
                }
            },
            legend: {
                show: true
            },
            colors: chartMonochromeColors,
        };
        return (
            <ReactApexChart
                className="apex-charts"
                series={series}
                options={options}
                type="pie"
                height={350}
            />

        )
    }

    const RotateLable1 = ({ dataColors }) => {
        var chartColumnRotateLabelsColors = getChartColorsArray(dataColors);
        const series = [{
            name: 'Number Of Bags',
            data: [2, 4, 6, 8, 3, 5,]
        }];
        var options = {
            annotations: {
                points: [{
                    x: 'Bananas',
                    seriesIndex: 0,
                    label: {
                        borderColor: '#775DD0',
                        offsetY: 0,
                        style: {
                            color: '#fff',
                            background: '#775DD0',
                        },
                        //text: 'Bananas are good',
                    }
                }]
            },
            chart: {
                height: 350,
                type: 'bar',
                toolbar: {
                    show: false,
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 10,
                    columnWidth: '35%',
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 2
            },
            colors: chartColumnRotateLabelsColors,
            xaxis: {
                labels: {
                    rotate: -45
                },
                categories: ['Loader1', 'Loader2', 'Loader3', 'Loader4', 'Loader5', 'Loader6'],
                tickPlacement: 'on'
            },
            yaxis: {
                title: {
                    text: 'Number Of Bags',
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    type: "horizontal",
                    shadeIntensity: 0.25,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 0.85,
                    opacityTo: 0.85,
                    stops: [50, 0, 100]
                },
            }
        };

        return (
            <ReactApexChart className="apex-charts" options={options} series={series} type="bar" height={350} />
        );
    };


    document.title = "MRP & Bag Counter" + " || EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={"MRP & Bag Counter"} pageTitle="Dashboard" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <div className="card-body pt-4">
                                    <Nav pills className="nav-customs nav-danger mb-3 nav nav-pills" style={{ marginLeft: '-8px' }}>
                                        <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "1", })} onClick={() => { outlineBorderNavtoggle("1"); }}>
                                                MRP & Bag Counter Details
                                            </NavLink>
                                        </NavItem>
                                        {/* <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "2", })} onClick={() => { outlineBorderNavtoggle("2"); }}>
                                                YARD OUT
                                            </NavLink>
                                        </NavItem> */}
                                    </Nav>
                                    <TabContent activeTab={outlineBorderNav} className="text-muted">
                                        <TabPane tabId="1" id="border-nav-home">
                                            <Row className="g-3 border border-dashed" style={{ padding: "0px 0 35px 0" }}>
                                                <Form onSubmit={handleSubmit} className="d-flex">
                                                    <Col lg={4}>
                                                        <div>
                                                            <Label className="form-label" >Plant Name<span style={{ color: "red" }}>*</span></Label>
                                                            <Input
                                                                name="master_plant_id"
                                                                type="select"
                                                                className="form-select"
                                                                // value={values.trip_movement_type_code}
                                                                onChange={handleInputChange}
                                                                //required
                                                            >
                                                                {status.map((item, key) => (
                                                                    <React.Fragment key={key}>
                                                                        <option value="JK Laxmi Cement" selected>JK Laxmi Cement</option>
                                                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                    </React.Fragment>
                                                                ))}
                                                            </Input>
                                                        </div>
                                                    </Col>
                                                    <Col md={1} className="hstack gap-2 justify-content-end ms-2" style={{ marginTop: "30px" }}>
                                                        <button type="submit" className="btn btn-success d-flex mt-0"><i className="ri-search-line"></i>&nbsp;&nbsp;<span>Search</span> </button>
                                                    </Col>
                                                </Form>
                                            </Row>
                                            {flag &&
                                                <>
                                                    <Nav pills className="nav-customs nav-danger mb-3 nav nav-pills mt-3" style={{ marginLeft: '-8px' }}>
                                                        <NavItem>
                                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav1 === "1", })} onClick={() => { outlineBorderNavtoggle1("1"); }}>
                                                                Plant Details
                                                            </NavLink>
                                                        </NavItem>
                                                        <NavItem>
                                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav1 === "2", })} onClick={() => { outlineBorderNavtoggle1("2"); }}>
                                                                Packer Details
                                                            </NavLink>
                                                        </NavItem>
                                                    </Nav>

                                                    <TabContent activeTab={outlineBorderNav1} className="text-muted">
                                                        <TabPane tabId="1" id="border-nav-home">
                                                            <Row className="g-3 border border-dashed">
                                                                <Col xl={4}>
                                                                    <Card className="shadow bg-danger-subtle" style={{ pointerEvents: "none" }}>
                                                                        <CardBody >
                                                                            <div className="d-flex">
                                                                                <div className="flex-grow-1">
                                                                                    <h6 className="text-muted mb-3 text-uppercase">Packer Loader Qty (MT)</h6>
                                                                                    <h4 className="mb-0">{"240"}</h4>
                                                                                </div>
                                                                                <div className="flex-shrink-0 avatar-sm">
                                                                                    <div className={"avatar-title fs-22 rounded bg-success"}>
                                                                                        <i className="ri-building-line"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                    </Card>
                                                                </Col>
                                                                <Col xl={4}>
                                                                    <Card className="shadow bg-success-subtle" style={{ pointerEvents: "none" }}>
                                                                        <CardBody >
                                                                            <div className="d-flex">
                                                                                <div className="flex-grow-1">
                                                                                    <h6 className="text-muted mb-3 text-uppercase">Busted bag count</h6>
                                                                                    <h4 className="mb-0">{"7"}</h4>
                                                                                </div>
                                                                                <div className="flex-shrink-0 avatar-sm">
                                                                                    <div className={"avatar-title fs-22 rounded bg-success"}>
                                                                                        <i className="ri-newspaper-line"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                    </Card>
                                                                </Col>
                                                                <Col xl={4}>
                                                                    <Card className="shadow bg-warning-subtle" style={{ pointerEvents: "none" }}>
                                                                        <CardBody >
                                                                            <div className="d-flex">
                                                                                <div className="flex-grow-1">
                                                                                    <h6 className="text-muted mb-3 text-uppercase">Active Loader</h6>
                                                                                    <h4 className="mb-0">{"5/6"}</h4>
                                                                                </div>
                                                                                <div className="flex-shrink-0 avatar-sm">
                                                                                    <div className={"avatar-title fs-22 rounded bg-success"}>
                                                                                        <i className="ri-shopping-basket-2-line"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                    </Card>
                                                                </Col>
                                                            </Row>

                                                            <Card className="mt-3 shadow_light">
                                                                <CardHeader className="bg-light fw-bold text-uppercase">Plant Graph Data</CardHeader>
                                                                <CardBody>
                                                                    <Row>
                                                                        <Col lg={6}>
                                                                            <Card className="shadow_light">
                                                                                <CardHeader style={{ background: "#c6e3f4" }}>
                                                                                    <h4 className="card-title mb-0 text-capitalize border-success">NUMBER OF VEHICLES LOADED <button type="button" title="View" className="btn btn-success btn-sm btn btn-secondary float-end" style={{ margin: "-5px -5px 0 0" }} onClick={() => { openModal(1) }}><i class="ri-eye-line"></i></button></h4>
                                                                                </CardHeader>
                                                                                <CardBody>
                                                                                    <RotateLable dataColors='["--vz-info"]' />
                                                                                </CardBody>
                                                                            </Card>
                                                                        </Col>
                                                                        <Col lg={6}>
                                                                            <Card className="shadow_light">
                                                                                <CardHeader style={{ background: "rgb(147 244 231)" }}>
                                                                                    <h4 className="card-title mb-0 text-capitalize border-success">CURRENT MONTH INFO <button type="button" title="View" className="btn btn-success btn-sm btn btn-secondary float-end" style={{ margin: "-5px -5px 0 0" }} onClick={() => { openModal(2) }}><i class="ri-eye-line"></i></button></h4>
                                                                                </CardHeader>
                                                                                <CardBody>
                                                                                    <Basic dataColors='["--vz-success"]' />
                                                                                </CardBody>
                                                                            </Card>
                                                                        </Col>
                                                                        <Col lg={6}>
                                                                            <Card className="shadow_light">
                                                                                <CardHeader style={{ background: "rgb(203 208 226)" }}>
                                                                                    <h4 className="card-title mb-0 text-capitalize border-success">PRODUCT WISE PRODUCTION <button type="button" title="View" className="btn btn-success btn-sm btn btn-secondary float-end" style={{ margin: "-5px -5px 0 0" }} onClick={() => { openModal(3) }}><i class="ri-eye-line"></i></button></h4>
                                                                                </CardHeader>
                                                                                <CardBody>
                                                                                    <MonochromePie dataColors='["--vz-primary"]' />
                                                                                </CardBody>
                                                                            </Card>
                                                                        </Col>
                                                                        <Col lg={6}>
                                                                            <Card className="shadow_light">
                                                                                <CardHeader style={{ background: "rgb(252 218 211)" }}>
                                                                                    <h4 className="card-title mb-0 text-capitalize border-success">PER DAY BUSTED BAGS <button type="button" title="View" className="btn btn-success btn-sm btn btn-secondary float-end" style={{ margin: "-5px -5px 0 0" }} onClick={() => { openModal(1) }}><i class="ri-eye-line"></i></button></h4>
                                                                                </CardHeader>
                                                                                <CardBody>
                                                                                    <RotateLable1 dataColors='["--vz-danger"]' />
                                                                                </CardBody>
                                                                            </Card>
                                                                        </Col>
                                                                    </Row>
                                                                </CardBody>
                                                            </Card>
                                                        </TabPane>
                                                    </TabContent>

                                                    {/*--------------------------------Packer Container */}

                                                    <TabContent activeTab={outlineBorderNav1} className="text-muted">
                                                        <TabPane tabId="2" id="border-nav-home">
                                                            <Row className="g-3 border border-dashed">

                                                                <Col xxl={3} sm={6} className="project-card">
                                                                    <Card className="card-height-100 shadow_light">
                                                                        <CardBody >
                                                                            <div className="d-flex flex-column h-100">
                                                                                <div className="mt-n3 mx-n3 bg-success-subtle rounded-top" style={{ padding: "8px 5px 8px 17px" }}>
                                                                                    <div className="d-flex">
                                                                                        <div className="flex-grow-1">
                                                                                            {/* <h5 className="text-primary m-0">{"Packer-1 Radial"} <button type="button" title="Refresh" className="btn bg-success btn-sm btn float-end text-white" style={{ margin: "-4px 0 -3px 0px" }} onClick={() => { openModalCamera() }}><i class="ri-vidicon-2-line"></i></button></h5> */}
                                                                                            <h5 className="text-primary m-0">{"Loader-1"}
                                                                                                <Link to="#" className="d-inline-block auth-logo float-end" onClick={() => { openModalCamera() }}>
                                                                                                    <img style={{ marginTop: "-4px" }} src={cameraPic} alt="" height="30" />
                                                                                                </Link>
                                                                                            </h5>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div className="d-flex gap-1 align-items-center">

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="py-3">
                                                                                    <Row className="gy-3">
                                                                                        <Col xs={6}>
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Vehicle No.</p>
                                                                                                <h5 className="fs-14">{"HR72F7376"}</h5>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col xs={6} className="text-center">
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Status</p>
                                                                                                <div className={"fs-12 badge badge-soft-success"}>{"RUNNING"}</div>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </div>
                                                                                <div className="mt-auto">
                                                                                    <div className="d-flex mb-2">
                                                                                        <div className="flex-grow-1">
                                                                                            <div>Counts : </div>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div><i className="ri-list-check align-bottom me-1 text-muted"></i> {"75/400"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="progress progress-sm animated-progess">
                                                                                        <div className="progress-bar bg-success"
                                                                                            role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="400"
                                                                                            style={{ width: "19%" }}>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                        <div className="card-footer bg-transparent border-top-dashed p-2">
                                                                            <div className="">
                                                                                <div className={"fs-14  float-end fw-bold mx-2"}>{"OPC-43 Non-Trade"}</div>
                                                                                <div className={"fs-12 badge badge-soft-success w-50"}>{"Connected"}</div>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                </Col>

                                                                <Col xxl={3} sm={6} className="project-card">
                                                                    <Card className="card-height-100 shadow_light">
                                                                        <CardBody >
                                                                            <div className="d-flex flex-column h-100">
                                                                                <div className="mt-n3 mx-n3 bg-success-subtle rounded-top" style={{ padding: "8px 5px 8px 17px" }}>
                                                                                    <div className="d-flex">
                                                                                        <div className="flex-grow-1">
                                                                                            {/* <h5 className="text-primary m-0">{"Packer-2 Radial"} <button type="button" title="Refresh" className="btn bg-success btn-sm btn float-end text-white" style={{ margin: "-4px 0 -3px 0px" }} onClick={() => { openModalCamera() }}><i class="ri-vidicon-2-line"></i></button></h5> */}
                                                                                            <h5 className="text-primary m-0">{"Loader-2"}
                                                                                                <Link to="#" className="d-inline-block auth-logo float-end" onClick={() => { openModalCamera() }}>
                                                                                                    <img style={{ marginTop: "-4px" }} src={cameraPic} alt="" height="30" />
                                                                                                </Link>
                                                                                            </h5>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div className="d-flex gap-1 align-items-center">

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="py-3">
                                                                                    <Row className="gy-3">
                                                                                        <Col xs={6}>
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Vehicle No.</p>
                                                                                                <h5 className="fs-14">{"N/A"}</h5>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col xs={6} className="text-center">
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Status</p>
                                                                                                <div className={"fs-12 badge badge-soft-danger"}>{"STOP"}</div>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </div>
                                                                                <div className="mt-auto">
                                                                                    <div className="d-flex mb-2">
                                                                                        <div className="flex-grow-1">
                                                                                            <div>Counts : </div>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div><i className="ri-list-check align-bottom me-1 text-muted"></i> {"0/0"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="progress progress-sm animated-progess">
                                                                                        <div className="progress-bar bg-success"
                                                                                            role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                                            style={{ width: "0%" }}>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                        <div className="card-footer bg-transparent border-top-dashed p-2">
                                                                            <div className="">
                                                                                <div className={"fs-14  float-end fw-bold mx-2"}>{"N/A"}</div>
                                                                                <div className={"fs-12 badge badge-soft-danger w-50"}>{"Disconnected"}</div>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                </Col>

                                                                <Col xxl={3} sm={6} className="project-card">
                                                                    <Card className="card-height-100 shadow_light">
                                                                        <CardBody >
                                                                            <div className="d-flex flex-column h-100">
                                                                                <div className="mt-n3 mx-n3 bg-success-subtle rounded-top" style={{ padding: "8px 5px 8px 17px" }}>
                                                                                    <div className="d-flex">
                                                                                        <div className="flex-grow-1">
                                                                                            {/* <h5 className="text-primary m-0">{"Packer-1 Tangential"} <button type="button" title="Refresh" className="btn bg-success btn-sm btn float-end text-white" style={{ margin: "-4px 0 -3px 0px" }} onClick={() => { openModalCamera() }}><i class="ri-vidicon-2-line"></i></button></h5> */}
                                                                                            <h5 className="text-primary m-0">{"Loader-3"}
                                                                                                <Link to="#" className="d-inline-block auth-logo float-end" onClick={() => { openModalCamera() }}>
                                                                                                    <img style={{ marginTop: "-4px" }} src={cameraPic} alt="" height="30" />
                                                                                                </Link>
                                                                                            </h5>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div className="d-flex gap-1 align-items-center">

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="py-3">
                                                                                    <Row className="gy-3">
                                                                                        <Col xs={6}>
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Vehicle No.</p>
                                                                                                <h5 className="fs-14">{"N/A"}</h5>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col xs={6} className="text-center">
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Status</p>
                                                                                                <div className={"fs-12 badge badge-soft-danger"}>{"STOP"}</div>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </div>
                                                                                <div className="mt-auto">
                                                                                    <div className="d-flex mb-2">
                                                                                        <div className="flex-grow-1">
                                                                                            <div>Counts : </div>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div><i className="ri-list-check align-bottom me-1 text-muted"></i> {"0/0"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="progress progress-sm animated-progess">
                                                                                        <div className="progress-bar bg-success"
                                                                                            role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                                            style={{ width: "0%" }}>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                        <div className="card-footer bg-transparent border-top-dashed p-2">
                                                                            <div className="">
                                                                                <div className={"fs-14  float-end fw-bold mx-2"}>{"N/A"}</div>
                                                                                <div className={"fs-12 badge badge-soft-danger w-50"}>{"Disconnected"}</div>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                </Col>

                                                                <Col xxl={3} sm={6} className="project-card">
                                                                    <Card className="card-height-100 shadow_light">
                                                                        <CardBody >
                                                                            <div className="d-flex flex-column h-100">
                                                                                <div className="mt-n3 mx-n3 bg-success-subtle rounded-top" style={{ padding: "8px 5px 8px 17px" }}>
                                                                                    <div className="d-flex">
                                                                                        <div className="flex-grow-1">
                                                                                            {/* <h5 className="text-primary m-0">{"Packer-2 Tangential"} <button type="button" title="Refresh" className="btn bg-success btn-sm btn float-end text-white" style={{ margin: "-4px 0 -3px 0px" }} onClick={() => { openModalCamera() }}><i class="ri-vidicon-2-line"></i></button></h5> */}
                                                                                            {/* <img src={cameraPic} alt="" height="30" /> */}
                                                                                            <h5 className="text-primary m-0">{"Loader-4"}
                                                                                                <Link to="#" className="d-inline-block auth-logo float-end" onClick={() => { openModalCamera() }}>
                                                                                                    <img style={{ marginTop: "-4px" }} src={cameraPic} alt="" height="30" />
                                                                                                </Link>
                                                                                            </h5>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div className="d-flex gap-1 align-items-center">

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="py-3">
                                                                                    <Row className="gy-3">
                                                                                        <Col xs={6}>
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Vehicle No.</p>
                                                                                                <h5 className="fs-14">{"N/A"}</h5>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col xs={6} className="text-center">
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Status</p>
                                                                                                <div className={"fs-12 badge badge-soft-danger"}>{"STOP"}</div>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </div>
                                                                                <div className="mt-auto">
                                                                                    <div className="d-flex mb-2">
                                                                                        <div className="flex-grow-1">
                                                                                            <div>Counts : </div>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div><i className="ri-list-check align-bottom me-1 text-muted"></i> {"0/0"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="progress progress-sm animated-progess">
                                                                                        <div className="progress-bar bg-success"
                                                                                            role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                                            style={{ width: "0%" }}>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                        <div className="card-footer bg-transparent border-top-dashed p-2">
                                                                            <div className="">
                                                                                <div className={"fs-14  float-end fw-bold mx-2"}>{"N/A"}</div>
                                                                                <div className={"fs-12 badge badge-soft-danger w-50"}>{"Disconnected"}</div>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                </Col>
                                                                <Col xxl={3} sm={6} className="project-card">
                                                                    <Card className="card-height-100 shadow_light">
                                                                        <CardBody >
                                                                            <div className="d-flex flex-column h-100">
                                                                                <div className="mt-n3 mx-n3 bg-success-subtle rounded-top" style={{ padding: "8px 5px 8px 17px" }}>
                                                                                    <div className="d-flex">
                                                                                        <div className="flex-grow-1">
                                                                                            {/* <h5 className="text-primary m-0">{"Packer-1 Radial"} <button type="button" title="Refresh" className="btn bg-success btn-sm btn float-end text-white" style={{ margin: "-4px 0 -3px 0px" }} onClick={() => { openModalCamera() }}><i class="ri-vidicon-2-line"></i></button></h5> */}
                                                                                            <h5 className="text-primary m-0">{"Loader-5"}
                                                                                                <Link to="#" className="d-inline-block auth-logo float-end" onClick={() => { openModalCamera() }}>
                                                                                                    <img style={{ marginTop: "-4px" }} src={cameraPic} alt="" height="30" />
                                                                                                </Link>
                                                                                            </h5>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div className="d-flex gap-1 align-items-center">

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="py-3">
                                                                                    <Row className="gy-3">
                                                                                        <Col xs={6}>
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Vehicle No.</p>
                                                                                                <h5 className="fs-14">{"N/A"}</h5>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col xs={6} className="text-center">
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Status</p>
                                                                                                <div className={"fs-12 badge badge-soft-danger"}>{"STOP"}</div>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </div>
                                                                                <div className="mt-auto">
                                                                                    <div className="d-flex mb-2">
                                                                                        <div className="flex-grow-1">
                                                                                            <div>Counts : </div>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div><i className="ri-list-check align-bottom me-1 text-muted"></i> {"0/0"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="progress progress-sm animated-progess">
                                                                                        <div className="progress-bar bg-success"
                                                                                            role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                                            style={{ width: "0%" }}>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                        <div className="card-footer bg-transparent border-top-dashed p-2">
                                                                            <div className="">
                                                                                <div className={"fs-14  float-end fw-bold mx-2"}>{"N/A"}</div>
                                                                                <div className={"fs-12 badge badge-soft-danger w-50"}>{"Disconnected"}</div>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                </Col>

                                                                <Col xxl={3} sm={6} className="project-card">
                                                                    <Card className="card-height-100 shadow_light">
                                                                        <CardBody >
                                                                            <div className="d-flex flex-column h-100">
                                                                                <div className="mt-n3 mx-n3 bg-success-subtle rounded-top" style={{ padding: "8px 5px 8px 17px" }}>
                                                                                    <div className="d-flex">
                                                                                        <div className="flex-grow-1">
                                                                                            {/* <h5 className="text-primary m-0">{"Packer-2 Radial"} <button type="button" title="Refresh" className="btn bg-success btn-sm btn float-end text-white" style={{ margin: "-4px 0 -3px 0px" }} onClick={() => { openModalCamera() }}><i class="ri-vidicon-2-line"></i></button></h5> */}
                                                                                            <h5 className="text-primary m-0">{"Loader-6"}
                                                                                                <Link to="#" className="d-inline-block auth-logo float-end" onClick={() => { openModalCamera() }}>
                                                                                                    <img style={{ marginTop: "-4px" }} src={cameraPic} alt="" height="30" />
                                                                                                </Link>
                                                                                            </h5>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div className="d-flex gap-1 align-items-center">

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="py-3">
                                                                                    <Row className="gy-3">
                                                                                        <Col xs={6}>
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Vehicle No.</p>
                                                                                                <h5 className="fs-14">{"N/A"}</h5>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col xs={6} className="text-center">
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Status</p>
                                                                                                <div className={"fs-12 badge badge-soft-danger"}>{"STOP"}</div>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </div>
                                                                                <div className="mt-auto">
                                                                                    <div className="d-flex mb-2">
                                                                                        <div className="flex-grow-1">
                                                                                            <div>Counts : </div>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div><i className="ri-list-check align-bottom me-1 text-muted"></i> {"0/0"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="progress progress-sm animated-progess">
                                                                                        <div className="progress-bar bg-success"
                                                                                            role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                                            style={{ width: "0%" }}>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                        <div className="card-footer bg-transparent border-top-dashed p-2">
                                                                            <div className="">
                                                                                <div className={"fs-14  float-end fw-bold mx-2"}>{"N/A"}</div>
                                                                                <div className={"fs-12 badge badge-soft-danger w-50"}>{"Disconnected"}</div>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                </Col>

                                                                <Col xxl={3} sm={6} className="project-card">
                                                                    <Card className="card-height-100 shadow_light">
                                                                        <CardBody >
                                                                            <div className="d-flex flex-column h-100">
                                                                                <div className="mt-n3 mx-n3 bg-success-subtle rounded-top" style={{ padding: "8px 5px 8px 17px" }}>
                                                                                    <div className="d-flex">
                                                                                        <div className="flex-grow-1">
                                                                                            {/* <h5 className="text-primary m-0">{"Packer-1 Tangential"} <button type="button" title="Refresh" className="btn bg-success btn-sm btn float-end text-white" style={{ margin: "-4px 0 -3px 0px" }} onClick={() => { openModalCamera() }}><i class="ri-vidicon-2-line"></i></button></h5> */}
                                                                                            <h5 className="text-primary m-0">{"Loader-7"}
                                                                                                <Link to="#" className="d-inline-block auth-logo float-end" onClick={() => { openModalCamera() }}>
                                                                                                    <img style={{ marginTop: "-4px" }} src={cameraPic} alt="" height="30" />
                                                                                                </Link>
                                                                                            </h5>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div className="d-flex gap-1 align-items-center">

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="py-3">
                                                                                    <Row className="gy-3">
                                                                                        <Col xs={6}>
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Vehicle No.</p>
                                                                                                <h5 className="fs-14">{"GJ45Y5555"}</h5>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col xs={6} className="text-center">
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Status</p>
                                                                                                <div className={"fs-12 badge badge-soft-success"}>{"RUNNING"}</div>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </div>
                                                                                <div className="mt-auto">
                                                                                    <div className="d-flex mb-2">
                                                                                        <div className="flex-grow-1">
                                                                                            <div>Counts : </div>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div><i className="ri-list-check align-bottom me-1 text-muted"></i> {"100/400"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="progress progress-sm animated-progess">
                                                                                        <div className="progress-bar bg-success"
                                                                                            role="progressbar" aria-valuenow="300" aria-valuemin="0" aria-valuemax="400"
                                                                                            style={{ width: "75%" }}>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                        <div className="card-footer bg-transparent border-top-dashed p-2">
                                                                            <div className="">
                                                                                <div className={"fs-14  float-end fw-bold mx-2"}>{"OPC-53"}</div>
                                                                                <div className={"fs-12 badge badge-soft-success w-50"}>{"Connected"}</div>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                </Col>

                                                                <Col xxl={3} sm={6} className="project-card">
                                                                    <Card className="card-height-100 shadow_light">
                                                                        <CardBody >
                                                                            <div className="d-flex flex-column h-100">
                                                                                <div className="mt-n3 mx-n3 bg-success-subtle rounded-top" style={{ padding: "8px 5px 8px 17px" }}>
                                                                                    <div className="d-flex">
                                                                                        <div className="flex-grow-1">
                                                                                            {/* <h5 className="text-primary m-0">{"Packer-2 Tangential"} <button type="button" title="Refresh" className="btn bg-success btn-sm btn float-end text-white" style={{ margin: "-4px 0 -3px 0px" }} onClick={() => { openModalCamera() }}><i class="ri-vidicon-2-line"></i></button></h5> */}
                                                                                            {/* <img src={cameraPic} alt="" height="30" /> */}
                                                                                            <h5 className="text-primary m-0">{"Loader-8"}
                                                                                                <Link to="#" className="d-inline-block auth-logo float-end" onClick={() => { openModalCamera() }}>
                                                                                                    <img style={{ marginTop: "-4px" }} src={cameraPic} alt="" height="30" />
                                                                                                </Link>
                                                                                            </h5>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div className="d-flex gap-1 align-items-center">

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="py-3">
                                                                                    <Row className="gy-3">
                                                                                        <Col xs={6}>
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Vehicle No.</p>
                                                                                                <h5 className="fs-14">{"N/A"}</h5>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col xs={6} className="text-center">
                                                                                            <div>
                                                                                                <p className="text-muted mb-1">Status</p>
                                                                                                <div className={"fs-12 badge badge-soft-danger"}>{"STOP"}</div>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </div>
                                                                                <div className="mt-auto">
                                                                                    <div className="d-flex mb-2">
                                                                                        <div className="flex-grow-1">
                                                                                            <div>Counts : </div>
                                                                                        </div>
                                                                                        <div className="flex-shrink-0">
                                                                                            <div><i className="ri-list-check align-bottom me-1 text-muted"></i> {"0/0"}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="progress progress-sm animated-progess">
                                                                                        <div className="progress-bar bg-success"
                                                                                            role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                                            style={{ width: "0%" }}>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                        <div className="card-footer bg-transparent border-top-dashed p-2">
                                                                            <div className="">
                                                                                <div className={"fs-14  float-end fw-bold mx-2"}>{"N/A"}</div>
                                                                                <div className={"fs-12 badge badge-soft-danger w-50"}>{"Disconnected"}</div>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                </Col>
                                                            </Row>
                                                        </TabPane>
                                                    </TabContent>
                                                </>
                                            }
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
                    <h5 className="text-white fs-20">{cardHeader}</h5>
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
                        <button style={{ float: "right" }} type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                            <i className="ri-file-download-line align-bottom me-1"></i>
                        </button>
                        {activeTable === 1 &&
                            <TableContainer
                                columns={columns}
                                data={firstData}
                                isGlobalFilter={true}
                                isAddUserList={false}
                                customPageSize={5}
                                isGlobalSearch={true}
                                className="custom-header-css"
                                isCustomerFilter={false}
                                SearchPlaceholder='Search...'
                                style={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
                            />
                        }
                        {activeTable === 2 &&
                            <TableContainer
                                columns={columns}
                                data={firstData}
                                isGlobalFilter={true}
                                isAddUserList={false}
                                customPageSize={5}
                                isGlobalSearch={true}
                                className="custom-header-css"
                                isCustomerFilter={false}
                                SearchPlaceholder='Search...'
                                style={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
                            />
                        }
                        {activeTable === 3 &&
                            <TableContainer
                                columns={columns}
                                data={firstData}
                                isGlobalFilter={true}
                                isAddUserList={false}
                                customPageSize={5}
                                isGlobalSearch={true}
                                className="custom-header-css"
                                isCustomerFilter={false}
                                SearchPlaceholder='Search...'
                                style={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
                            />
                        }
                    </div>
                </ModalBody>
            </Modal>

            <Modal isOpen={cameraModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="xl" toggle={setViewModalCamera}>
                <ModalHeader toggle={setViewModalCamera} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
                    <h5 className="text-white fs-20 m-0"><img style={{ marginTop: "-4px" }} src={cameraPic} alt="" height="30" /> &nbsp;&nbsp;&nbsp;{"Camera View"}</h5>
                </ModalHeader>
                <ModalBody>
                    <div className="product-content mt-0">
                        <video controls autoPlay width="100%">
                            <source src={"/video/bag_counter_video.mp4"} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </ModalBody>
            </Modal>

            <Modal id="subscribeModals" tabIndex="-1" isOpen={whatsappModal} toggle={() => { setwhatsappModal(); }} centered size='lg'>
                <Row className="g-0">
                    <Col lg={7}>
                        <div className="modal-body p-5">
                            <div className="text-center mb-3"><img style={{ marginTop: "-4px" }} src={WhatsApp} alt="" height="100" /></div>
                            <h5 className="lh-base text-success text-uppercase">Camera Link Sent on Below Number</h5>
                            <div className={"fs-16 badge badge-soft-success"} style={{ width: "100px" }}>{"Mobile No : "} </div> <span className="text-primary fs-16 fw-bold inpt_css">{mobileNumber}</span>
                            <br />
                            <div className={"fs-16 badge badge-soft-success mt-2"} style={{ width: "100px" }}>{"Link : "} </div> <span className="text-primary fs-16 fw-bold inpt_css_1" title={linkUrl}>{linkUrl}</span>
                            {/* <div className="mb-3 text-center mt-3">
                                        <button className="btn btn-success btn-sm w-50" type="button" id="button-addon1" onClick={handleShare}>Share link</button>
                                    </div> */}
                            <div className="d-inline-block mt-3">
                                <span>To See Live Feed</span>
                                <Link to="#" className="auth-logo fs-14 fw-bold ms-2" onClick={() => { openModalCamera() }}>
                                    Click Here 
                                </Link>
                                
                            </div>
                        </div>
                    </Col>
                    <Col lg={5}>
                    <i className="ri-close-line fs-24 position-absolute" style={{right:"5px" , zIndex:"9", cursor:"pointer"}} onClick={() => { setwhatsappModal() }}></i>
                        <div className="subscribe-modals-cover h-100">
                            <img src={authbg} alt="" className="h-100 w-100 object-cover" style={{ clipPath: "polygon(100% 0%, 100% 100%, 100% 100%, 0% 100%, 25% 50%, 0% 0%)" }} />
                        </div>
                    </Col>
                </Row>
            </Modal>
            <ToastContainer closeButton={false} limit={1} />

        </React.Fragment>
    );
};

export default MRPDashboard;
