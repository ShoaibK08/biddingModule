import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, CardHeader, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader } from "reactstrap";
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import axios from "axios"; // For API calls
import BreadCrumb from '../../Components/Common/BreadCrumb';
import '../TruckMonitoring/truckMonitoring.scss';
import logoDark from "../../assets/images/no_data.png";
import fullscreen from "../../assets/images/fullscreen.jpg";
import stop from "../../assets/images/stop.png";
import truck from "../../assets/images/truck.jpeg";
//import images
import avatar2 from "../../assets/images/users/avatar-2.jpg";

const SmartLoaderVision = () => {
    const [activeTab, setActiveTab] = useState(0); // Manage active tab
    const [tabData, setTabData] = useState({}); // Store data for each tab
    const [plantCode, setPlantCode] = useState(null);
    const [bulkerList, setBulkerList] = useState([]);
    const [isFetching, setIsFetching] = useState(true); // State to control whether to keep fetching
    const intervalRef = useRef(null); // To store the interval ID
    const [currentWBCode, setCurrentWBCode] = useState(null);
    const [chuteData, setChuteData] = useState(null);
    const [anprImage, setANPRImage] = useState(null);



    useEffect(() => {
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantCode = obj.data.plantCode;
        setPlantCode(plantCode);
        getLoaderListData(plantCode);
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

    const getLoaderListData = async (plantCode) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/blkDashbord/wbcode?plantCode=${plantCode}`, config);
            const bulkerList = res; // Assuming res.data is the array
            setBulkerList(bulkerList);

            if (bulkerList.length > 0) {
                const locationCode = bulkerList[0].locationCode;
                // Now use the locationCode to make another axios request
                startFetchingAdditionalData(locationCode, plantCode);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Function to call another axios request with the locationCode
    const getAdditionalData = async (locationCode, plantCode) => {

        try {
            const additionalDataRes = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/blkDashbord/${plantCode}/${locationCode}`, config);
            console.log("Additional Data:", additionalDataRes[0]);
            setTabData(additionalDataRes[0]);
            setANPRImage(additionalDataRes[0].anprImage);
        } catch (error) {
            console.error("Error fetching additional data:", error);
        }
        //for chute data
        try {
            const formData = new FormData();
            formData.append('wbCode', locationCode); // Replace with dynamic value as needed

            const chuteRes = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/rcvimg`, formData, config);

            console.log("Chute Data:", chuteRes);
            setChuteData(chuteRes);
        } catch (error) {
            console.error("Error fetching additional data:", error);
        }

    };

    // Function to start fetching data every 3 seconds
    const startFetchingAdditionalData = (locationCode, plantCode) => {
        // Call the function immediately for the first time
        getAdditionalData(locationCode, plantCode);

        if (intervalRef.current) {
            clearInterval(intervalRef.current); // Clear any existing interval
        }

        // Set up the interval for subsequent calls
        intervalRef.current = setInterval(() => {
            if (isFetching) {
                getAdditionalData(locationCode, plantCode);
            }
        }, 2000); // Fetch every 3 seconds
    };

    // Function to stop fetching data
    const stopFetching = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsFetching(false);
    };

    useEffect(() => {
        // Cleanup interval when component unmounts
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Function to toggle active tab
    const toggleTab = (tabId, currentWB) => {
        if (activeTab !== tabId) {
            stopFetching();
            setActiveTab(tabId);
            setCurrentWBCode(currentWB);
            fetchANPRDataBasedSelectedLoaderTab(currentWB);
        }
    };

    // Function to make axios call based on currentWB
    const fetchANPRDataBasedSelectedLoaderTab = (currentWB) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/blkDashbord/${plantCode}/${currentWB}`, config)
            .then(response => {
                setTabData(response[0]);
                setANPRImage(response[0].anprImage);
            })
            .catch(error => {
                setTabData(null);
                setANPRImage(null);
                //console.error('Error fetching data for WB:', currentWB, error);
            });

        const formData = new FormData();
        formData.append('wbCode', currentWB); // Replace with dynamic value as needed
        axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/rcvimg`, formData, config)
            .then(response => {
                console.log("Chute Data:", response);
                setChuteData(response);
            })
            .catch(error => {
                setChuteData(null);
                //console.error('Error fetching data for chute:', currentWB, error);
            });
    };

    // useEffect to run the axios call every 3 seconds when tab changes
    useEffect(() => {
        let intervalId;

        if (currentWBCode) {
            // Make initial call immediately on tab change
            fetchANPRDataBasedSelectedLoaderTab(currentWBCode);

            // Set up interval to fetch data every 3 seconds
            intervalId = setInterval(() => {
                fetchANPRDataBasedSelectedLoaderTab(currentWBCode);
            }, 2000);
        }

        // Cleanup interval when tab changes or component unmounts
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [currentWBCode]); // Re-run when currentWBCode changes

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const [modal_fullscreen, setmodal_fullscreen] = useState(false);
    function tog_fullscreen() {
        setmodal_fullscreen(!modal_fullscreen);
    }

    const [modal_fullscreenChute, setmodal_fullscreenChute] = useState(false);
    function tog_fullscreenChute() {
        setmodal_fullscreenChute(!modal_fullscreenChute);
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={"Smart Loader Vision"} pageTitle="Dashboard" />

                    <Row>
                        <Col lg={12}>
                            <Card className="ribbon-box border shadow-none right mb-lg-0" id="customerList">
                                <div className="card-body pt-4">
                                    <div class="ribbon ribbon-info round-shape" style={{ marginTop: "10px" }}>LIVE WEIGHT : {tabData ? tabData.weight : "0"} KG</div>
                                    <Nav pills className="nav-customs nav-danger mb-0">
                                        {bulkerList.map((tab, index) => (
                                            <NavItem key={index}>
                                                <NavLink
                                                    className={classnames({ active: activeTab === index })}
                                                    onClick={() => toggleTab(index, tab.locationCode)}
                                                >
                                                    {tab.locationCode}
                                                </NavLink>
                                            </NavItem>
                                        ))}
                                    </Nav>
                                    <TabContent activeTab={activeTab} className="text-muted">
                                        {bulkerList.map((tab, index) => (
                                            <TabPane key={index} tabId={index}>
                                                <Card className="shadow_light">
                                                    <CardBody className="p-3">
                                                        {/* <h5>Static Container for {tab.label}</h5>
                                                    <p>Data for {tab.label}: {tabData[tab.id] ? tabData[tab.id].dataField : "Loading..."}</p> */}

                                                        <table className="table table-bordered custom-table text-center shadow_light">
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ borderTopLeftRadius: "5px" }}>IGP No.</th>
                                                                    <th>Tare Weight</th>
                                                                    <th>Gross Weight</th>
                                                                    <th>Material</th>
                                                                    <th>DO Number</th>
                                                                    <th>DO Qty(MT)</th>
                                                                    <th>SAP Response</th>
                                                                    <th style={{ borderTopRightRadius: "5px" }}>SAP Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>{tabData && tabData.igpNumber ? tabData.igpNumber : "N/A"}</td>
                                                                    <td>{tabData && tabData.tw ? tabData.tw : "N/A"}</td>
                                                                    <td>{tabData && tabData.weight ? tabData.weight : "N/A"}</td>
                                                                    <td>{tabData && tabData.materialName ? tabData.materialName : "N/A"}</td>
                                                                    <td>{tabData && tabData.doNumber ? tabData.doNumber : "N/A"}</td>
                                                                    <td>{tabData && tabData.doQty ? tabData.doQty : "N/A"}</td>
                                                                    <td>{tabData && tabData.sapResponse ? tabData.sapResponse : "N/A"}</td>
                                                                    <td>{tabData && tabData.remarks ? tabData.remarks : "N/A"}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <Row className="g-3">
                                                            <Col xxl={4} xl={4} lg={4} sm={12} className="project-card">
                                                                <Card className="shadow" style={{ height: '400px', minHeight: "400px" }}>
                                                                    <CardHeader className="text-uppercase bg-primary text-light text-center fw-bold fs-18">Vehicle Number : {tabData && tabData.vehicleNumber ? tabData.vehicleNumber : "N/A"}</CardHeader>
                                                                    <CardBody style={{ padding: '10px', height: '20vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                        {tabData && tabData.anprImage && !tabData.anprImage.includes("{\n") ? (
                                                                            <>
                                                                                <img
                                                                                    src={`data:image/jpeg;base64,${tabData.anprImage}`}
                                                                                    alt="Image"
                                                                                    style={{ aspectRatio: '1/1', padding: '12px 0 12px 0', width: '-webkit-fill-available' }}
                                                                                />
                                                                                <div className="full_screen" style={{ position: "absolute", right: "30px", bottom: "25px" }} onClick={tog_fullscreen}>
                                                                                    <img src={fullscreen} alt="" style={{ width: "35px", borderRadius: "50%" }} />
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div className="text-center"><img src={logoDark} alt="" height="auto" style={{ width: "20rem" }} /></div>

                                                                            </>
                                                                        )}


                                                                    </CardBody>

                                                                </Card>
                                                            </Col>

                                                            <Col xxl={8} xl={8} lg={8} sm={12} className="project-card">
                                                                <Card className=" shadow" style={{ height: "400px" }}>
                                                                    {chuteData && chuteData.vehicle_direction === "*B#CHUTEDOK#" ? (
                                                                        <CardHeader className="text-uppercase bg-primary text-light text-center fw-bold fs-18">Vehicle aligned successfully. Please stop.</CardHeader>
                                                                    ) : (
                                                                        <CardHeader className="text-uppercase bg-primary text-light text-center fw-bold fs-18">{chuteData && chuteData.vehicle_direction ? chuteData.vehicle_direction : "--"} {chuteData && chuteData.distance ? chuteData.distance : "--"}</CardHeader>
                                                                    )}

                                                                    <CardBody style={{ padding: '10px', height: '20vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                                        onMouseEnter={handleMouseEnter}
                                                                        onMouseLeave={handleMouseLeave}
                                                                    >
                                                                        {chuteData ? (
                                                                            <>
                                                                                {chuteData.vehicle_direction === "*B#CHUTEDOK#" && (
                                                                                    <div className="stop" style={{ position: "absolute", right: "10px", top: "57px", transition: "opacity 0.5s ease-in-out, visibility 0.5s ease-in-out" }}>
                                                                                        <img src={stop} className="shadow" alt="" style={{ width: "85px", borderRadius: "50%", animation: "blink 1s infinite" }} />
                                                                                    </div>
                                                                                )}
                                                                                <img
                                                                                    src={`data:image/jpeg;base64,${chuteData.imgBase64}`}
                                                                                    alt="Image"
                                                                                    style={{ maxWidth: '100%', maxHeight: '100%', width: '-webkit-fill-available' }}
                                                                                />
                                                                                {chuteData.vehicle_direction === "Move Straight" && (
                                                                                    <ul id="up_ul">
                                                                                        <li id="up_li" className="shadow">
                                                                                            <div class="arrowup m1"><pre> </pre></div>
                                                                                            <div class="arrowup m2"><pre> </pre></div>
                                                                                            <div class="arrowup m3"><pre> </pre></div>
                                                                                        </li>
                                                                                    </ul>
                                                                                )}
                                                                                {chuteData.vehicle_direction === "Move Backward" && (
                                                                                    <ul id="down_ul">
                                                                                        <li id="down_li" className="shadow">
                                                                                            <div class="arrowdown m1"><pre> </pre></div>
                                                                                            <div class="arrowdown m2"><pre> </pre></div>
                                                                                            <div class="arrowdown m3"><pre> </pre></div>
                                                                                        </li>
                                                                                    </ul>
                                                                                )}
                                                                                {chuteData.vehicle_direction === "Move Left" && (
                                                                                    <ul id="left_ul">
                                                                                        <li id="left_li" className="shadow">
                                                                                            <div class="arrowleft m1"><pre> </pre></div>
                                                                                            <div class="arrowleft m2"><pre> </pre></div>
                                                                                            <div class="arrowleft m3"><pre> </pre></div>
                                                                                        </li>
                                                                                    </ul>
                                                                                )}
                                                                                {chuteData.vehicle_direction === "Move Right" && (
                                                                                    <ul id="right_ul">
                                                                                        <li id="right_li" className="shadow">
                                                                                            <div class="arrowright m1"><pre> </pre></div>
                                                                                            <div class="arrowright m2"><pre> </pre></div>
                                                                                            <div class="arrowright m3"><pre> </pre></div>
                                                                                        </li>
                                                                                    </ul>
                                                                                )}
                                                                                {isHovered && (
                                                                                    <div className="full_screen" style={{ position: "absolute", right: "30px", bottom: "25px", transition: "opacity 0.5s ease-in-out, visibility 0.5s ease-in-out" }} onClick={tog_fullscreenChute}>
                                                                                        <img src={fullscreen} className="shadow" alt="" style={{ width: "35px", borderRadius: "50%" }} />
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <div className="text-center"><img src={logoDark} alt="" height="auto" style={{ width: "20rem" }} /></div>
                                                                        )}
                                                                    </CardBody>

                                                                </Card>
                                                            </Col>

                                                        </Row>

                                                    </CardBody>
                                                </Card>

                                            </TabPane>
                                        ))}
                                    </TabContent>

                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>


            {/* Full Screen Modal */}
            <Modal size="xl" isOpen={modal_fullscreen} toggle={() => { tog_fullscreen(); }} className="modal-fullscreen" id="exampleModalFullscreen" style={{ padding: "50px 200px", borderRadius: "10px" }} backdrop={"static"}>
                <ModalHeader className="modal-title bg-light rounded" id="exampleModalFullscreenLabel" toggle={() => { tog_fullscreen(); }} style={{ padding: "10px 15px 10px 20px" }}>
                    Vehicle Image
                </ModalHeader>
                <ModalBody>
                    <img src={`data:image/jpeg;base64,${anprImage}`} alt="Image"
                        style={{ maxWidth: '100%', maxHeight: '100%', width: '-webkit-fill-available' }}
                    />
                </ModalBody>
            </Modal>

            {/* Full Screen Modal */}
            <Modal size="xl" isOpen={modal_fullscreenChute} toggle={() => { tog_fullscreenChute(); }} className="modal-fullscreen" id="exampleModalFullscreen" backdrop={"static"}>
                <ModalHeader className="modal-title bg-light rounded" id="exampleModalFullscreenLabel" toggle={() => { tog_fullscreenChute(); }} style={{ padding: "10px 15px 10px 20px" }}>
                    Loader Feed
                </ModalHeader>
                <ModalBody>
                    <Card className=" shadow" >
                        {chuteData && chuteData.vehicle_direction === "*B#CHUTEDOK#" ? (
                            <CardHeader className="text-uppercase bg-primary text-light text-center fw-bold fs-18">Vehicle aligned successfully. Please stop.</CardHeader>
                        ) : (
                            <CardHeader className="text-uppercase bg-primary text-light text-center fw-bold fs-18">{chuteData && chuteData.vehicle_direction ? chuteData.vehicle_direction : "--"} {chuteData && chuteData.distance ? chuteData.distance : "--"}</CardHeader>
                        )}

                        <CardBody style={{ padding: '10px', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {chuteData ? (
                                <>
                                    {chuteData.vehicle_direction === "*B#CHUTEDOK#" && (
                                        <div className="stop" style={{ position: "absolute", right: "10px", top: "57px", transition: "opacity 0.5s ease-in-out, visibility 0.5s ease-in-out" }}>
                                            <img src={stop} className="shadow" alt="" style={{ width: "85px", borderRadius: "50%", animation: "blink 1s infinite" }} />
                                        </div>
                                    )}
                                    <img
                                        src={`data:image/jpeg;base64,${chuteData.imgBase64}`}
                                        alt="Image"
                                        style={{ maxWidth: '100%', maxHeight: '100%', width: '-webkit-fill-available' }}
                                    />
                                    {chuteData.vehicle_direction === "Move Straight" && (
                                        <ul id="up_ul">
                                            <li id="up_li" className="shadow">
                                                <div class="arrowup m1"><pre> </pre></div>
                                                <div class="arrowup m2"><pre> </pre></div>
                                                <div class="arrowup m3"><pre> </pre></div>
                                            </li>
                                        </ul>
                                    )}
                                    {chuteData.vehicle_direction === "Move Backward" && (
                                        <ul id="down_ul">
                                            <li id="down_li" className="shadow">
                                                <div class="arrowdown m1"><pre> </pre></div>
                                                <div class="arrowdown m2"><pre> </pre></div>
                                                <div class="arrowdown m3"><pre> </pre></div>
                                            </li>
                                        </ul>
                                    )}
                                    {isHovered && (
                                        <div className="full_screen" style={{ position: "absolute", right: "30px", bottom: "25px", transition: "opacity 0.5s ease-in-out, visibility 0.5s ease-in-out" }} onClick={tog_fullscreenChute}>
                                            <img src={fullscreen} className="shadow" alt="" style={{ width: "35px", borderRadius: "50%" }} />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center"><img src={logoDark} alt="" height="auto" style={{ width: "20rem" }} /></div>
                            )}
                        </CardBody>

                    </Card>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
}

export default SmartLoaderVision;
