import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Button, PopoverHeader, PopoverBody, Popover } from "reactstrap";
import axios from "axios";
import CountUp from "react-countup";
import BreadCrumb from '../../Components/Common/BreadCrumb';
import avatar from "../../assets/images/path.png";
import tagmapping from "../../assets/images/tagmapping.png";
import '../TruckMonitoring/truckMonitoring.scss';
import logoDark from "../../assets/images/no_data.png";

const TruckMonitoring = () => {

    const [status, setStatus] = useState("Connecting to WebSocket server...");
    const [message, setMessage] = useState([]);
    const [masterStageName, setMasterStageName] = useState([]);
    const [currentStageName, setCurrentStageName] = useState("ALL");
    const [plantCode, setPlantCode] = useState(null); // State to hold the plant code
    const masterStageNameRef = useRef([]); // Use ref to access masterStageName in ws.onmessage
    const currentStageNameRef = useRef("ALL");

    useEffect(() => {
        // Retrieve the plant code from sessionStorage
        const authUser = JSON.parse(sessionStorage.getItem("authUser"));
        const plantCode = authUser?.data?.plantCode;
        setPlantCode(plantCode);

        if (plantCode) {
            getStageData(plantCode); // Call only on the first load

            // Establish WebSocket connection
            const ws = new WebSocket("ws://localhost:6767/vehicle");

            // On WebSocket connection open
            ws.onopen = () => {
                setStatus("Connected to WebSocket server.");
                console.log("WebSocket connection opened.");
                console.log("Sending plantCode:", plantCode);
                ws.send(plantCode); // Send plantCode to server
            };

            // On receiving a message from the WebSocket server
            ws.onmessage = (event) => {
                debugger; // Open console to see live data in console
                const jsonArray = JSON.parse(event.data);
                //console.log(jsonArray);
                if (jsonArray.error) {
                    setMessage([]);
                } else {
                    // Use the masterStageNameRef to get the current masterStageName value
                    // const modifiedStageNames = masterStageNameRef.current.map((stage) => {
                    //     const matchingJson = jsonArray.find(item => item.stageName === stage.stageName);
                    //     return matchingJson ? { ...stage, ...matchingJson } : stage;
                    // });

                    const modifiedStageNames = masterStageNameRef.current.map((stage) => {
                        const matchingJson = jsonArray.find(item => {
                            if (item.stageName.includes("TW") && stage.stageName.includes("TW")) {
                                return true;
                            }
                            if (item.stageName.includes("GW") && stage.stageName.includes("GW")) {
                                return true;
                            }
                            return item.stageName === stage.stageName;
                        });
                        return matchingJson ? { ...stage, ...matchingJson } : stage;
                    });




                    if (currentStageNameRef.current === "ALL") {
                        setMessage(modifiedStageNames);
                    }
                    else {
                        const result = modifiedStageNames.filter(stage => stage.stageName === currentStageNameRef.current);
                        setMessage(result);
                    }
                }
                ws.send(plantCode); // Send plantCode to server again
            };

            // On WebSocket connection close
            ws.onclose = () => {
                setStatus("Connection closed.");
                setMessage([]);
                console.log("WebSocket connection closed.");
            };

            // On WebSocket error
            ws.onerror = (error) => {
                setStatus("WebSocket error.");
                console.error("WebSocket error occurred:", error);
            };

            // Cleanup the WebSocket connection when the component is unmounted
            return () => {
                ws.close();
            };
        } else {
            setStatus("Error: Plant code not found.");
            console.error("Plant code not found in sessionStorage.");
        }
    }, []);

    const handleChange = (e) => {
        const stage = e.target.value;
        //alert(stage);
        setCurrentStageName(stage);
        currentStageNameRef.current = stage; // Update the ref to hold the current stage names selected with Dropdown
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
        },
        auth: {
            username: process.env.REACT_APP_API_USER_NAME,
            password: process.env.REACT_APP_API_PASSWORD,
        },
    };

    const getStageData = (plantCode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/movementType/OB/${plantCode}`, config)
            .then(res => {
                const response = res;
                const stageNames = response.map(item => ({
                    stageName: item.locationName,
                }));
                console.log(stageNames);
                setMasterStageName(stageNames);
                masterStageNameRef.current = stageNames; // Update the ref to hold the current stage names
            })
            .catch(error => {
                console.error("Error fetching stage data:", error);
            });
    };

    //Code to open Pop-over elements

    const [popoverOpen, setPopoverOpen] = useState({});
    const popoverRef = useRef(null);
    const [popoverOpen1, setPopoverOpen1] = useState({});
    const popoverRef1 = useRef(null);

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

    const togglePopover1 = (key) => {
        setPopoverOpen1((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const handleClickOutside1 = (event) => {
        if (popoverRef1.current && !popoverRef1.current.contains(event.target)) {
            setPopoverOpen1(false);
        }
    };

    useEffect(() => {
        if (popoverOpen1) {
            document.addEventListener('click', handleClickOutside1);
        } else {
            document.removeEventListener('click', handleClickOutside1);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside1);
        };
    }, [popoverOpen1]);

    //Code to open Pop-over elements end



    document.title = "Truck Operation Monitoring Dashboard  | EPLMS";
    return (

        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={"Truck Operation Monitoring "} pageTitle="Dashboard" />

                    <div>
                        {/* <h1>WebSocket Vehicle Lookup</h1> */}
                        {/* <p>{status}</p> */}
                        {/* <pre>{message}</pre> */}
                    </div>
                    {
                        message && message.length !== 0 ?
                            (
                                <Row>
                                    <Col lg={12}>
                                        <Card>
                                            <CardHeader className="sample-class">
                                                <h4 className="card-title mb-0 shimmer" id="sim_color" style={{ fontWeight: "bold", color: "blue !important" }}>REAL TIME TRUCK OPERATION MONITORING STATUS </h4>
                                            </CardHeader>
                                        </Card>
                                    </Col>
                                </Row>
                            )
                            :
                            (
                                <Row>
                                    <Col lg={12}>
                                        <Card>
                                            <CardHeader className="sample-class">
                                                <h4 className="card-title mb-0 " id="sim_color_notgettingWSData" style={{ fontWeight: "bold", color: "blue !important" }}>REAL TIME TRUCK OPERATION MONITORING STATUS </h4>
                                            </CardHeader>
                                        </Card>
                                    </Col>
                                </Row>
                            )
                    }

                    <Row>
                        <Col lg={12} className="mb-3">
                            <Card className="mt-0 shadow_light ribbon-box border mb-lg-0">
                                <CardHeader className="mb-0 fw-bold bg-primary fs-16 shadow_light text-white" style={{ float: "left" }}>STAGE WISE DETAILS
                                    <select class="form-select rounded-pill mb-3 stageDD" aria-label="Stage" onChange={handleChange}>
                                        <option value="ALL" selected>ALL STAGES</option>
                                        {masterStageName && masterStageName.map((item, index) => (
                                            <option value={item.stageName} key={index}>{item.stageName}</option>
                                        ))}
                                    </select>
                                </CardHeader>
                                <CardBody className="d-flex" style={{ margin: "0 auto" }}>
                                    <Row className="gx-4"> {/* Added gx-4 for equal spacing */}
                                        {
                                            message && message.length !== 0 ?
                                                message.map((item, key) => (
                                                    <Col lg={4} key={key}>
                                                        <Card className="ribbon-box border shadow mb-3">
                                                            <CardBody class="text-muted">
                                                                <span className="ribbon-three ribbon-three-primary rib_bon">
                                                                    <span>
                                                                        {item.stageName.includes("TW")
                                                                            ? "WB-(TW)"
                                                                            : item.stageName.includes("GW")
                                                                                ? "WB-(GW)"
                                                                                : item.stageName}
                                                                    </span>
                                                                </span>
                                                                <Row className="gy-3 mt-2">
                                                                    <Col xs={4} className="px-1">
                                                                        <div className="text-start">
                                                                            <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className=""></i></span>{"Vehicle No."}</h5>
                                                                            <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className=""></i></span>{"Tag ID"}</h5>
                                                                            <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className=""></i></span>{"DO Number"}</h5>
                                                                            <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className=""></i></span>{"DO Quantity."}</h5>
                                                                            <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className=""></i></span>{"IGP Number"}</h5>
                                                                            <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className=""></i></span>{"Net Weight"}</h5>
                                                                            <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className=""></i></span>{"Tolerance WT"}</h5>
                                                                            <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className=""></i></span>{"Stage Time"}</h5>

                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={8} className="px-1">
                                                                        <div>
                                                                            <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.vehicleNumber ? item.vehicleNumber : "N/A"}</h5>
                                                                            <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.tagId ? item.tagId : "N/A"}</h5>
                                                                            <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 -5px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.doNumber}>{item.doNumber ? item.doNumber : "N/A"}</h5>
                                                                            <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 -5px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.doQuantity}>{item.doQuantity ? item.doQuantity : "N/A"}</h5>
                                                                            <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.igpNumber ? item.igpNumber : "N/A"}</h5>
                                                                            <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.netWeight ? item.netWeight : "N/A"}</h5>
                                                                            <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.toleranceWeight ? item.toleranceWeight : "N/A"}</h5>
                                                                            <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.stageTime ? (item.stageTime).replace("T", " ") : "N/A"}</h5>

                                                                        </div>
                                                                    </Col>
                                                                    <div className="mt-1 px-1">
                                                                        <h5 className={"fs-12 badge badge-soft-primary w-100 border"} style={{ margin: "5px 0px 0px", whiteSpace: "normal", textAlign: "start" }} id={`PopoverTop-${key}`} onClick={() => togglePopover(key)}><p className={`${item.randomData === "S" ? "text-success m-0 _custom" : item.randomData === "F" ? "text-danger m-0 _custom" : "m-0 _custom"}`}>{`PLMS Status : ${item.message ? item.message : "N/A"}`}</p><span style={{ position: "absolute", right: "18px", marginTop: "-13px" }}><i className="ri-eye-line align-middle ms-2"></i></span> </h5>
                                                                        <Popover placement="top" isOpen={popoverOpen[key]} target={`PopoverTop-${key}`} toggle={() => togglePopover(key)} innerRef={popoverRef}>
                                                                            <PopoverHeader className="bg-light">EPLMS Status</PopoverHeader>
                                                                            <PopoverBody>{item.message ? item.message : "N/A"}</PopoverBody>
                                                                        </Popover>
                                                                        <h5 className={"fs-12 badge badge-soft-primary w-100 border"} style={{ margin: "5px 0px 0px", whiteSpace: "normal", textAlign: "start" }} id={`PopoverTop1-${key}`} onClick={() => togglePopover1(key)}><p className={`${item.sapStatus === "S" ? "text-success m-0 _custom" : item.sapStatus === "F" ? "text-danger m-0 _custom" : "m-0 _custom"}`}>{`SAP Status : ${item.sapResponse ? item.sapResponse : "N/A"}`}</p><span style={{ position: "absolute", right: "18px", marginTop: "-13px" }}><i className="ri-eye-line align-middle ms-2"></i></span></h5>
                                                                        <Popover placement="top" isOpen={popoverOpen1[key]} target={`PopoverTop1-${key}`} toggle={() => togglePopover1(key)} innerRef={popoverRef1}                                                                           >
                                                                            <PopoverHeader className="bg-light">SAP Status</PopoverHeader>
                                                                            <PopoverBody>{item.sapResponse ? item.sapResponse : "N/A"}</PopoverBody>
                                                                        </Popover>
                                                                    </div>
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                ))
                                                : <div className="text-center"><img src={logoDark} alt="" height="273" width="400" /></div>
                                        }
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    )
}

export default TruckMonitoring