import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown, CardFooter, UncontrolledPopover, PopoverHeader, PopoverBody, Popover, Button, } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderNew from "../../../Components/Common/Loader_new";
import classnames from "classnames";
import target from "../../../assets/images/companies/img-1.png";
import logoDark from "../../../assets/images/no_data.png";


const WeighBridge = () => {


    // Outline Border Nav Tabs
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [outlineBorderNav, setoutlineBorderNav] = useState("1");
    const [dropDownData, setDropdownData] = useState([]);
    const [liveData, setLiveData] = useState([]);
    const [loader, setloader] = useState(false);
    const [values, setValues] = useState([]);
    const [latestHeader, setLatestHeader] = useState('');
    const [plantCode, setPlantCode] = useState([]);
    const [currentWB, setCurrentWB] = useState("ALL");
    const [modalData, setModalData] = useState({});

    const outlineBorderNavtoggle = (tab) => {
        if (outlineBorderNav !== tab) {
            setoutlineBorderNav(tab);
        }
    };



    useEffect(() => {
        const HeaderName = localStorage.getItem("HeaderName");
        setLatestHeader(HeaderName);
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantCode = obj.data.plantCode;
        setPlantCode(plantCode);
        getDropdownData(plantCode);
        getAllLiveData(plantCode, "ALL");
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


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentWB(value)

    };

    const handleSubmit = async (e) => {

        console.log(values)
        e.preventDefault();
        //alert(currentWB)
        getAllLiveData(plantCode, currentWB);
    }


    const getDropdownData = async (plantCode) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/wbDashbord/wbcode?plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setDropdownData(data);
            });
    }

    const getAllLiveData = async (plantCode, C_WBCode) => {
        setloader(true);
        const CURR_WBCode = currentWB ? currentWB : C_WBCode;
        try {
            const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/wbDashbord/${plantCode}/${CURR_WBCode}`, config)
                .then(res => {
                    const data = res;
                    if (!res.error) {
                        setLiveData(data);
                        setloader(false);
                    }
                    else {
                        setLiveData([]);
                        setloader(false);
                    }
                });
        }
        catch (e) {
            toast.error(e, { autoClose: 3000 });
            setloader(false);
        }

    }

    useEffect(() => {
        // Function to be executed every 3 seconds for main screen
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        const plantCode = obj.data.plantCode;
        
        // Determine CURR_WBCode based on currentWB value
        const CURR_WBCode = currentWB === "" ? "ALL" : currentWB;
    
        const myFunction = () => {
            console.log('Function is running every 3 seconds');
            axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/wbDashbord/${plantCode}/${CURR_WBCode}`, config)
                .then(res => {
                    if (!res.error) {
                        setLiveData(res);
                    } else {
                        setLiveData([]);
                    }
                })
                .catch(error => {
                    console.error("Error fetching live data:", error);
                    setLiveData([]); // Clear the data in case of error
                });
        };
    
        // Set interval to run the function every 3 seconds
        const intervalId = setInterval(myFunction, 3000);
    
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [currentWB]); // Add currentWB as a dependency so the effect re-runs when currentWB changes


    const [cameraModal, setCameraModal] = useState(false);
    const [modalInterval, setmodalForInterval] = useState(false);
    const [currentModalWB, setcurrentModalWB] = useState("");
    const [intervalId, setIntervalId] = useState(null);

    const openModalCamera = (WBCode) => {
        const getObjectByWbCode = (array, targetWbCode) => {
            return array.find(item => item.wbCode === targetWbCode);
        };

        // Example usage
        const resultObject = getObjectByWbCode(liveData, WBCode);
        setModalData(resultObject);
        setmodalForInterval(true);
        setcurrentModalWB(WBCode);
        setCameraModal(true);
    }
    const setViewModalCamera = () => {
        setCameraModal(false);
        setmodalForInterval(false);
        clearInterval(intervalId);
        setcurrentModalWB("");
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (modalInterval) {
                intervalFunction(currentModalWB);
            }
        }, 3000);
        setIntervalId(interval);
        return () => clearInterval(interval);
    }, [currentModalWB]);

    const intervalFunction = async (WBCode) => {
        console.log("3sec");  //Function to be executed every 3 seconds for Modal data
        try {
            const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/wbDashbord/${plantCode}/ALL`, config)
                .then(res => {
                    const liveData = res;
                    const getObjectByWbCode = (array, targetWbCode) => {
                        return array.find(item => item.wbCode === targetWbCode);
                    };

                    // Example usage
                    const resultObject = getObjectByWbCode(liveData, WBCode);
                    setModalData(resultObject);
                    getAllLiveData(plantCode);
                });
        }
        catch (e) {
            toast.error(e, { autoClose: 3000 });
            setModalData({});
        }

    }

    const status = [
        {
            options: [
                { label: "WeightBridge-1 ", value: "Jk Cement Panna " },
                { label: "WeightBridge-2", value: "Jk Cement Panipat" },
                { label: "WeightBridge-3", value: "Havells " },
                { label: "WeightBridge-4", value: "Shree Cement" },
                { label: "WeightBridge-5", value: "Birla Cement" },
            ],
        },
    ];


    //Code to open Pop-over elements

    const [popoverOpen, setPopoverOpen] = useState({});
    const popoverRef = useRef(null);

    const togglePopover = (key) => {
        setPopoverOpen((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const handleClickOutside = (event) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target)) {
            setPopoverOpen(false);
        }
    };

    useEffect(() => {
        if (popoverOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [popoverOpen]);

    //Code to open Pop-over elements end

    document.title = "Weighbridge Dashboard";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={"Weighbridge"} pageTitle="Dashboard" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <div className="card-body pt-4">
                                    <Nav pills className="nav-customs nav-danger mb-3 nav nav-pills" style={{ marginLeft: '-8px' }}>
                                        <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "1", })} onClick={() => { outlineBorderNavtoggle("1"); }}>
                                                Weighbridge Details
                                            </NavLink>
                                        </NavItem>
                                    </Nav>

                                    <TabContent activeTab={outlineBorderNav} className="text-muted">
                                        <TabPane tabId="1" id="border-nav-home">
                                            <Row className="g-3 border shadow_light" style={{ padding: "0px 0 35px 0" }}>
                                                <Form onSubmit={handleSubmit} className="d-flex">
                                                    <Col lg={4}>
                                                        <div>
                                                            <Label className="form-label" >Choose Group<span style={{ color: "red" }}>*</span></Label>
                                                            <Input
                                                                name="wbCode"
                                                                type="select"
                                                                className="form-select"
                                                                // value={values.wbCode}
                                                                onChange={handleInputChange}
                                                                required
                                                            >
                                                                <option value="ALL" selected>All Weighbridge</option>
                                                                {dropDownData.map((item, key) => (
                                                                    <React.Fragment key={key}>
                                                                        <option value={item.locationCode} key={key}>{item.locationCode}</option>
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
                                            <>
                                                {/*--------------------------------Packer Container */}
                                                <Row className="g-3 border shadow_light mt-3">
                                                    {
                                                        liveData && liveData.length !== 0 ?
                                                            liveData.map((item, key) => (
                                                                <Col xxl={4} sm={6} className="project-card " key={key}>
                                                                    <Card className="card-height-100 shadow_light" data_id={item.wbCode} style={{ border: "solid 1px #e9c8a0" }}>
                                                                        <CardBody >
                                                                            <div className="d-flex flex-column h-100">
                                                                                <div className="mt-n3 mx-n3  rounded-top " style={{ padding: "8px 5px 8px 17px", background: "bisque" }}>
                                                                                    <div className="d-flex">
                                                                                        {/* <h5 className="text-primary m-0">{"Packer-1 Radial"} <button type="button" title="Refresh" className="btn bg-success btn-sm btn float-end text-white" style={{ margin: "-4px 0 -3px 0px" }} onClick={() => { openModalCamera() }}><i className="ri-vidicon-2-line"></i></button></h5> */}
                                                                                        <h5 className="text-primary m-0 p-1 ps-0">
                                                                                            {item.wbCode} {item.actualLocationName ? `(${item.actualLocationName})` : ''}
                                                                                        </h5>
                                                                                        <lord-icon src="https://cdn.lordicon.com/uetqnvvg.json" trigger="loop" colors="primary:#405189,secondary:#0ab39c" style={{ width: "45px", height: "45px", position: "absolute", right: "16px", top: "0px" }} ></lord-icon>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="py-1">
                                                                                    <Row className="gy-3">
                                                                                        <Col xs={6}>
                                                                                            <div className="text-start">
                                                                                                <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="mdi mdi-truck-fast-outline me-1"></i></span>{"Vehicle Number"}</h5>
                                                                                                {/* <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-secure-payment-line me-1"></i></span>{"Captured Weight"}</h5>
                                                                                                <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="mdi mdi-package-variant me-1"></i></span>{"Weight Type"}</h5> */}
                                                                                                <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-secure-payment-line me-1"></i></span>{"IGP Number"}</h5>
                                                                                                <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-secure-payment-line me-1"></i></span>{"Tare Weight"}</h5>
                                                                                                <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-secure-payment-line me-1"></i></span>{"Gross Weight"}</h5>
                                                                                                <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-secure-payment-line me-1"></i></span>{"Net Weight"}</h5>
                                                                                                <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-takeaway-fill me-1"></i></span>{"Movement Type"}</h5>
                                                                                                <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-bank-card-line me-1"></i></span>{"Material"}</h5>
                                                                                                <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-file-copy-2-fill me-1"></i></span>{item.movementType === 'OB' ? "DO Number" : "PO Number"}</h5>
                                                                                                <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-stack-fill me-1"></i></span>{item.movementType === 'OB' ? "DO Qty(MT)." : "PO Qty(MT)."}</h5>
                                                                                                <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-stack-fill me-1"></i></span>{"SAP Status"}</h5>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col xs={6}>
                                                                                            <div>
                                                                                                <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0", textTransform: "uppercase" }}>{item.vehicleNumber ? item.vehicleNumber : "N/A"}</h5>
                                                                                                {/* <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.captureWeight !== undefined && item.captureWeight !== null ? item.captureWeight : "N/A"}</h5>
                                                                                                <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.weightType ? item.weightType : "N/A"}</h5> */}
                                                                                                <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.igpNumber ? item.igpNumber : "N/A"}</h5>
                                                                                                <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.tw ? item.tw : "N/A"}</h5>
                                                                                                <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.gw ? item.gw : "N/A"}</h5>
                                                                                                <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.netWeight ? item.netWeight : "N/A"}</h5>
                                                                                                <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.movementType ? item.movementType : "N/A"}</h5>
                                                                                                <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0px -5px 0px", textOverflow: "ellipsis", overflow: " hidden", }} title={item.materialName}>{item.materialName ? item.materialName : "N/A"}</h5>
                                                                                                <h5 className={"fs-12 badge badge-soft-success"} style={{ margin: "5px 0px -6px 0px", width: "-webkit-fill-available", textOverflow: "ellipsis", overflow: " hidden", paddingRight: "25px", cursor: 'pointer', display: 'inline-block' }} id={`PopoverTop-${key}`} onClick={() => togglePopover(key)}>{item.doNumber ? item.doNumber : "N/A"}<span style={{ position: "absolute", right: "18px", marginTop: "-1px" }}><i className="ri-eye-fill align-middle ms-2"></i></span></h5>

                                                                                                <Popover placement="top" isOpen={popoverOpen[key]} target={`PopoverTop-${key}`} toggle={() => togglePopover(key)} innerRef={popoverRef}>
                                                                                                    <PopoverHeader>DO Number Details</PopoverHeader>
                                                                                                    <PopoverBody>{item.doNumber ? item.doNumber : "N/A"}</PopoverBody>
                                                                                                </Popover>

                                                                                                <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.doQty !== undefined && item.doQty !== null ? item.doQty : "N/A"}</h5>
                                                                                                <h5 className={`fs-12 badge ${item.sapResponse === "F" ? "badge-soft-danger" : "badge-soft-success"} w-100`} style={{ margin: "5px 0 0 0" }}>{item.sapResponse === "S" ? "Success" : item.sapResponse === "F" ? "Failed" : "N/A"}</h5>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <div className="mt-1">
                                                                                            <h5 className={"fs-12 badge bg-primary w-100"} style={{ margin: "5px 0px 0px", whiteSpace: "normal" }}>{item.remarks ? `Status : ${item.remarks}` : "Status : N/A"}</h5>
                                                                                        </div>

                                                                                    </Row>
                                                                                </div>
                                                                            </div>
                                                                        </CardBody>
                                                                        <CardFooter className="p-3">
                                                                            <div className="text-center">
                                                                                <button className="btn btn-outline-primary btn-border btn-sm ms-2 outline shadow_light" onClick={() => { openModalCamera(item.wbCode) }}>WeighBridge Details</button>
                                                                            </div>
                                                                        </CardFooter>
                                                                    </Card>
                                                                </Col>
                                                            ))
                                                            : <div className="text-center"><img src={logoDark} alt="" height="273" width="400" /></div>
                                                    }
                                                    {loader && <LoaderNew></LoaderNew>}
                                                </Row>
                                            </>
                                        </TabPane>
                                    </TabContent>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Modal isOpen={cameraModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="xl" toggle={setViewModalCamera}>
                <ModalHeader toggle={setViewModalCamera} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
                    <h5 className="text-white fs-20 m-0"><lord-icon src="https://cdn.lordicon.com/uetqnvvg.json" trigger="loop" colors="primary:#405189,secondary:#0ab39c" style={{ width: "45px", height: "45px", position: "absolute", left: "16px", top: "7px" }} ></lord-icon> <span style={{ marginLeft: "60px" }}>{"Weighbridge Details"}</span></h5>
                </ModalHeader>
                <ModalBody>

                    <Row>
                        <Col xl={12} className="text-center">
                            <Card className="shadow_light bg-light" style={{ pointerEvents: "none", height: '90%' }}>
                                <CardHeader className="mb-0 fw-bold bg-primary fs-16 shadow_light text-white">{modalData.wbCode ? modalData.wbCode : "N/A"}</CardHeader>
                                <CardBody >
                                    <div className="text-center">
                                        <img src={target} alt="" height="45" />
                                    </div>
                                    <div className="d-flex">
                                        <div className="flex-grow-1 text-center mt-3">
                                            <label>
                                                <h1 className="mb-0 text-success m">{modalData.weight ? modalData.weight : "0"}</h1></label>
                                            <br />
                                            <label className="mb-0">
                                                <h3 className="mb-0 text-primary">{"Weight in Kg"}</h3>
                                            </label>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ padding: "0px 12px 0px 12px" }}>
                        <Col className="text-center shadow_light p-3 rounded">
                            <label>
                                <h6 className="mb-0 text-primary">{"TRUCK NUMBER"}</h6>
                                <h4 className="mb-0 text-success">{modalData.vehicleNumber ? modalData.vehicleNumber : "N/A"}</h4>
                            </label>
                        </Col>
                        <Col className="text-center shadow_light p-3 rounded">
                            <label>
                                <h6 className="mb-0 text-primary">{modalData.movementType === 'OB' ? "DO Number" : "PO Number"}</h6>
                                <h4 className="mb-0 text-success">{modalData.doNumber ? modalData.doNumber : "N/A"}</h4>
                            </label>
                        </Col>
                        <Col className="text-center shadow_light p-3 rounded">
                            <label>
                                <h6 className="mb-0 text-primary">{modalData.movementType === 'OB' ? "DO QTY.(MT)" : "PO QTY.(MT)"}</h6>
                                <h4 className="mb-0 text-success">{modalData.doQty ? modalData.doQty : "N/A"}</h4>
                            </label>
                        </Col>
                        <Col className="text-center shadow_light p-3 rounded">
                            <label>
                                <h6 className="mb-0 text-primary">{"MATERIAL"}</h6>
                                <h4 className="mb-0 text-success">{modalData.material ? modalData.material : "N/A"}</h4>
                            </label>
                        </Col>
                        <Col className="text-center shadow_light p-3 rounded">
                            <label>
                                <h6 className="mb-0 text-primary">{"SEQUENCING"}</h6>
                                <h4 className="mb-0 text-success">{modalData.sequencing ? modalData.sequencing : "N/A"}</h4>
                            </label>
                        </Col>
                    </Row>
                    <Row className="mb-2 pb-2 mt-3" style={{ textAlign: "center", justifyContent: "center" }}>
                        <Col lg={12}>
                            <Card className="shadow_light bg-light" style={{ pointerEvents: "none", height: '90%' }}>
                                <CardHeader className="mb-0 fw-bold bg-primary fs-16 shadow_light text-light ">SAP RESPONSE</CardHeader>
                                <CardBody className="bg-white">

                                    <label className="mb-0">
                                        {modalData.sapResponse &&
                                            <h6 className="mb-0 text-success">{modalData.sapResponse === "F" ? <p style={{ color: "red" }}>{modalData.sapMsg}</p> : <p>{modalData.sapMsg}</p>}</h6>
                                        }
                                    </label>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </ModalBody>
            </Modal>
            <ToastContainer closeButton={false} limit={1} />

        </React.Fragment>
    );
};

export default WeighBridge;
