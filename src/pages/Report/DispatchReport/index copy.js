import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../CSR/Csr.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import cameraPic from "../../../assets/images/camera.png";
import WhatsApp from "../../../assets/images/whatsapp.png";
import authbg from "../../../assets/images/WhatsAppBanner.jpeg";

const initialValues = {
    name: "",
    mainmenuName: "",
    displayOrder: "",
    icon: "",
    companyCode: "",
    plantCode: "",
    status: "",
};


const DispatchReport = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [devices, setDevice] = useState([]);
    const [Plant, setPlant] = useState([]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [CurrentID, setClickedRowId] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [dynamicFlag, setDynamicFlag] = useState(1);
    const [mobileNumber, setMobileNumber] = useState("9898555555");
    const [linkUrl, setLinkUrl] = useState("http://localhost:3000/static/media/video.cb1cbfce4c75b1d2380d.mp4");
    const [HeaderName, setHeaderName] = useState("");

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
        } else {
            setModal(true);
        }
    }, [modal]);

    useEffect(() => {
        getHeaderName();
    }, []);

    const getHeaderName = () => {
        const main_menu = sessionStorage.getItem("main_menu_login");
        const obj = JSON.parse(main_menu).menuItems[7].subMenuMaster.name;
        setHeaderName(obj);
    }


    // Add Data
    const handleCustomerClicks = () => {
        setIsEdit(false);
        toggle();
    };
  


    const status = [
        {
            options: [
                { label: "Select Status", value: "" },
                { label: "Active", value: "A" },
                { label: "Deactive", value: "D" },
            ],
        },
    ];

    const handleDownload = async (e) => {
        e.preventDefault();
        downloadCSV();
        setIsExportCSV(false)
    };

    const downloadCSV = () => {
        const header = Object.keys(firstData[0]).join(',') + '\n';
        const csv = firstData.map((row) => Object.values(row).join(',')).join('\n');
        const csvData = header + csv;
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'dispatchReports.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const handleShare = () => {
        // Replace 'your-mobile-number' with the actual mobile number (including the country code)
        const mobileNumber = '9871262365';

        // Replace 'your-message' with the actual message you want to share
        const message = 'your-message';

        // Construct the WhatsApp share URL with the mobile number and message
        const whatsappUrl = `https://wa.me/${mobileNumber}?text=${encodeURIComponent(linkUrl)}`;

        // Open the WhatsApp share link in a new tab
        window.open(whatsappUrl, '_blank');

        // Alternatively, if you want to redirect to the WhatsApp link in the same tab, you can use:
        // window.location.href = whatsappUrl;
    };

    const [cameraModal, setCameraModal] = useState(false);
    const [whatsappModal, setwhatsappModal] = useState(false);
    const setViewModalCamera = () => {
        setCameraModal(!cameraModal);
    };
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




    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    document.title = "Dispatch Reports" + " || EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    onDownloadClick={handleDownload}
                    data={devices}
                />
                <Container fluid>
                    <BreadCrumb title={"Dispatch Reports"} pageTitle="Reports" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Dispatch Reports Details</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0 mt-3">
                                    <div>

                                        <TableContainer
                                            columns={columns}
                                            data={firstData}
                                            isGlobalFilter={true}
                                            isAddUserList={false}
                                            customPageSize={5}
                                            isGlobalSearch={true}
                                            className="custom-header-css"
                                            handleCustomerClick={handleCustomerClicks}
                                            //isCustomerFilter={true}
                                            SearchPlaceholder='Search for Vehicle Number or something...'
                                            divClass="overflow-auto"
                                        />
                                    </div>
                                    <ToastContainer closeButton={false} limit={1} />
                                </div>
                            </Card>
                        </Col>
                    </Row>

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
                                <i className="ri-close-line fs-24 position-absolute" style={{ right: "5px", zIndex: "9", cursor: "pointer" }} onClick={() => { setwhatsappModal() }}></i>
                                <div className="subscribe-modals-cover h-100">
                                    <img src={authbg} alt="" className="h-100 w-100 object-cover" style={{ clipPath: "polygon(100% 0%, 100% 100%, 100% 100%, 0% 100%, 25% 50%, 0% 0%)" }} />
                                </div>
                            </Col>
                        </Row>
                    </Modal>
                </Container>
            </div>


        </React.Fragment>
    );
};

export default DispatchReport;
