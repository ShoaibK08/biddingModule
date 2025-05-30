import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Button, Table } from "reactstrap";
import axios from "axios";
import CountUp from "react-countup";
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import TableContainer from "../../../Components/Common/TableContainer";
import "./live.scss";

const LiveYardInDashboard = () => {

    const [Plant_Code, setPlantCode] = useState('');
    const [yardInData, setYardInData] = useState([]);
    const [displayDataYardIN, setDisplayData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [announcementData, setannouncementData] = useState([]);
    const [displayAnnouncementData, setDisplayAnnouncementData] = useState([]);
    const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0); // Used to reset animation
    const [refreshKey1, setRefreshKey1] = useState(0);
    const [currentCountyardInData, setCurrentCountyardInData] = useState(0);
    const [totalCountyardInData, setTotalCountyardInData] = useState(0);
    const [currentCountAnnouncementData, setCurrentCountAnnouncementData] = useState(0);
    const [totalCountAnnouncementData, setTotalCountAnnouncementData] = useState(0);


    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
        getYardinData(plantcode);
        getAnnouncementDetails(plantcode);
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

    const getYardinData = async (plantCode) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/vehiclesYardINDeatils?plantCode=${plantCode}`, config);
            const data = response; // Access the actual data from the response
            if (data) {
                setYardInData(data);
                setTotalCountyardInData(data.length); // Set the total count
                setDisplayData(data.slice(0, 5)); // Initialize with the first 5 items
                setCurrentCountyardInData(5); // Set initial current count to 5
            }
        } catch (error) {
            console.error('Error fetching Packer Data:', error);
        }
    };

    useEffect(() => {
        if (yardInData.length > 0) {
            const interval = setInterval(() => {
                const nextIndex = currentIndex + 5;
                if (nextIndex < yardInData.length) {
                    setCurrentIndex(nextIndex);
                    setDisplayData(yardInData.slice(nextIndex, nextIndex + 5));
                    setCurrentCountyardInData(nextIndex + 5); // Update the current count
                } else {
                    // Refresh the data when all items have been displayed
                    setCurrentIndex(0);
                    setDisplayData(yardInData.slice(0, 5));
                    setCurrentCountyardInData(5); // Reset current count
                    const obj = JSON.parse(sessionStorage.getItem("authUser"));
                    const plantCode = obj?.data?.plantCode;
                    if (plantCode) {
                        getYardinData(plantCode); // Fetch updated data
                    }
                }
                setRefreshKey((prev) => prev + 1); // Update key to reset animation
            }, 7000); // 7 seconds interval

            return () => clearInterval(interval); // Cleanup on unmount
        }
    }, [yardInData, currentIndex]);

    const getAnnouncementDetails = async (plantCode) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getSequencedVehicle?plantCode=${plantCode}`, config);

            if (response) {
                setannouncementData(response);
                setDisplayAnnouncementData(response.slice(0, 5)); // Initialize with the first 4 items
                setTotalCountAnnouncementData(response.length); // Set the total count
                setCurrentCountAnnouncementData(5); // Set initial current count to 5
            }
        } catch (error) {
            console.error('Error fetching Packer Data:', error);
        }
    };

    useEffect(() => {
        if (announcementData.length > 0) {
            const interval = setInterval(() => {
                const nextIndex = currentAnnouncementIndex + 5;
                if (nextIndex < announcementData.length) {
                    setCurrentAnnouncementIndex(nextIndex);
                    setDisplayAnnouncementData(announcementData.slice(nextIndex, nextIndex + 5));
                    setCurrentCountAnnouncementData(nextIndex + 5); // Update the current count
                } else {
                    // Refresh the data when all items have been displayed
                    setCurrentAnnouncementIndex(0);
                    setCurrentCountAnnouncementData(5); // Reset current count
                    setDisplayAnnouncementData(announcementData.slice(0, 5));
                    const obj = JSON.parse(sessionStorage.getItem("authUser"));
                    const plantCode = obj?.data?.plantCode;
                    if (plantCode) {
                        getAnnouncementDetails(plantCode); // Fetch updated data
                    }
                }
                setRefreshKey1((prev) => prev + 1); // Update key to reset animation
            }, 7000); // 7 seconds interval

            return () => clearInterval(interval); // Cleanup on unmount
        }
    }, [announcementData, currentAnnouncementIndex]);

    document.title = "Live YardIN Dashboard | EPLMS";
    return (

        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={"Live YardIN Dashboard"} pageTitle="Dashboard" />

                    <Row style={{ marginTop: "-10px" }}>
                        <Col xl={12} style={{ padding: "0" }}>
                            <Card>
                                <CardHeader className="bg-primary text-center" style={{ position: "relative" }}>
                                    <h4
                                        className="mb-0 fs-20 text-white"
                                        style={{
                                            padding: "3px",
                                            border: "solid 1px",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        Yard IN Details
                                        <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', position: "absolute", right: "30px", top: "15px" }}>
                                            Displaying {Math.min(currentCountyardInData, totalCountyardInData)} of {totalCountyardInData}
                                        </div>
                                    </h4>
                                    {yardInData && yardInData.length > 5 && (
                                        <div
                                            key={refreshKey} // Reset animation on data refresh
                                            style={{
                                                position: "absolute",
                                                bottom: "-5px",
                                                left: "0",
                                                height: "5px",
                                                backgroundColor: "#6fb294",
                                                width: "100%",
                                                animation: "decreaseWidth 7s linear infinite",
                                            }}
                                        ></div>
                                    )}
                                </CardHeader>
                                <CardBody style={{ paddingBottom: "0" }}>
                                    <Table className="bordered hover responsive plant360">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Vehicle Number</th>
                                                <th>DO Number</th>
                                                <th>Transporter</th>
                                                <th>Yard IN Time</th>
                                                <th>City</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayDataYardIN && displayDataYardIN.length !== 0 ? (
                                                displayDataYardIN.map((item, index) => (
                                                    <tr key={index}>
                                                        <td style={{ textTransform: "uppercase" }}>{item.vehicleNumber}</td>
                                                        <td>{item.diNumber}</td>
                                                        <td style={{ textTransform: "uppercase" }}>{item.transporter}</td>
                                                        <td>{item.yardInTime}</td>
                                                        <td style={{ textTransform: "uppercase" }}>{item.cityName}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: "center", fontWeight: "bold" }}>
                                                        No Data Found!
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </CardBody>

                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "-10px" }}>
                        <Col xl={12} style={{ padding: "0" }}>
                            <Card>
                                <CardHeader className="bg-primary text-center" style={{ position: "relative" }}>
                                    <h4
                                        className="mb-0 fs-20 text-white"
                                        style={{
                                            padding: "3px",
                                            border: "solid 1px",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        Announcement Details
                                        <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', position: "absolute", right: "30px", top: "15px" }}>
                                            Displaying {Math.min(currentCountAnnouncementData, totalCountAnnouncementData)} of {totalCountAnnouncementData}
                                        </div>
                                    </h4>
                                    {announcementData && announcementData.length > 5 && (
                                        <div
                                            key={refreshKey} // Reset animation on data refresh
                                            style={{
                                                position: "absolute",
                                                bottom: "-5px",
                                                left: "0",
                                                height: "5px",
                                                backgroundColor: "#6fb294",
                                                width: "100%",
                                                animation: "decreaseWidth 7s linear infinite",
                                            }}
                                        ></div>
                                    )}
                                </CardHeader>
                                <CardBody style={{ paddingBottom: "0" }}>
                                    <Table className="bordered hover responsive plant360">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Vehicle Number</th>
                                                <th>Packer</th>
                                                <th>Loader</th>
                                                <th>DO Number</th>
                                                <th>{'DO Qty(MT)'}</th>
                                                <th>Sequence Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayAnnouncementData && displayAnnouncementData.length !== 0 ? (
                                                displayAnnouncementData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td style={{ textTransform: "uppercase" }}>{item.vehicleNumber}</td>
                                                        <td>{item.plannedPacker}</td>
                                                        <td>{item.plannedTerminal}</td>
                                                        <td>{item.diNumber}</td>
                                                        <td>{item.diQty}</td>
                                                        <td>{item.sequencedDate}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" style={{ textAlign: "center", fontWeight: "bold" }}>
                                                        No Data Found!
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </CardBody>

                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default LiveYardInDashboard