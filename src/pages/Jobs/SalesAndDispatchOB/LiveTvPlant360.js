import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown, Table } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
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
import target from "../../../assets/images/companies/img-1.png";
import logoDark from "../../../assets/images/no_data.png";
import ReactEcharts from "echarts-for-react";
import * as echarts from 'echarts/core';



const LiveTV360 = () => {


    // Outline Border Nav Tabs
    const [dispatchSummary, setDispatchSummaryData] = useState({});
    const [PackerData, setPackerData] = useState([]);
    const [LoaderData, setLoaderData] = useState([]);
    const [unplannedCount, setUnPlannedCount] = useState("");
    const [announcementData, setannouncementData] = useState([]);
    const [plantCode, setPlantCode] = useState([]);
    const [packerQueueData, setPackerQueueData] = useState([]);

    const [displayData, setDisplayData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayAnnouncementData, setDisplayAnnouncementData] = useState([]);
    const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
    const [displayPackerQueueData, setDisplayPackerQueueData] = useState([]);
    const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
    const [currentCountPackerQueueData, setCurrentCountPackerQueueData] = useState(0);
    const [totalCountPackerQueueData, setTotalCountPackerQueueData] = useState(0);
    const [currentCountPackerUtilizationData, setCurrentCountPackerUtilizationData] = useState(0);
    const [totalCountPackerUtilizationData, setTotalCountPackerUtilizationData] = useState(0);
    const [currentCountRejectedData, setCurrentCountRejectedData] = useState(0);
    const [totalCountRejectedData, setTotalCountRejectedData] = useState(0);

    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantCode = obj.data.plantCode;
        setPlantCode(plantCode);
        getDispatchSummaryData(plantCode);
        getLoaderData(plantCode);
        getPackerQueue(plantCode);
        getPackerUtilizationData(plantCode);
        getAnnouncementDetails(plantCode);
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

    const getDispatchSummaryData = async (plantCode) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sales-dispatch-dashboard/getDispatchSummaryData/${plantCode}`, config)
                .then(res => {
                    const data = res.message["#result-set-2"][0];
                    if (data) {
                        setDispatchSummaryData(data);
                    } else {
                        setDispatchSummaryData(false);
                    }
                });
        }
        catch (e) {
            console.log(e);
        }
    }

    const getLoaderData = async (plantCode) => {
        debugger;
        try {
            var array1 = [];
            var array2 = [];
            await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sales-dispatch-dashboard/getLoaderData/${plantCode}`, config)
                .then(res => {
                    const data1 = res.message.loader["#result-set-2"];
                    array2 = data1
                    console.log("loader" + JSON.stringify(data1));
                    const data3 = res.message.unplannedDto.unplannedCount
                    setUnPlannedCount(data3);
                });
            await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/getPackerDataByType?type=L&plantCode=${plantCode}`, config)
                .then(res => {
                    const data = res;
                    console.log("loaderMaster" + JSON.stringify(data));
                    array1 = data
                })
            const resultArray = updateFirstArray(array1, array2);
            console.log("final" + JSON.stringify(resultArray));
            setLoaderData(resultArray);
            console.log(resultArray)
        }
        catch (e) {
            setLoaderData([]);
            console.log(e);
        }
    }

    const getPackerQueue = async (plantCode) => {
        debugger;
        try {
            const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getDataAfterPI?plantCode=${plantCode}`, config)
                .then(res => {
                    const data = res;
                    if (data) {
                        setPackerQueueData(data);
                        setDisplayPackerQueueData(data.slice(0, 6)); // Initialize with the first 6 items
                        setTotalCountPackerQueueData(data.length); // Set the total count
                        setCurrentCountPackerQueueData(6); // Set initial current count to 6
                    } else {
                        setPackerQueueData([]);
                        setDisplayPackerQueueData([]);
                    }
                });
        }
        catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        if (packerQueueData.length > 0) {
            const interval = setInterval(() => {
                const nextIndex = currentQueueIndex + 6;
                if (nextIndex < packerQueueData.length) {
                    setCurrentQueueIndex(nextIndex);
                    setDisplayPackerQueueData(packerQueueData.slice(nextIndex, nextIndex + 6));
                    setCurrentCountPackerQueueData(nextIndex + 6); // Update the current count
                } else {
                    // Refresh the data when all items are shown
                    setCurrentQueueIndex(0);
                    setDisplayPackerQueueData(packerQueueData.slice(0, 6));
                    setCurrentCountPackerQueueData(6); // Update the current count
                    const obj = JSON.parse(sessionStorage.getItem("authUser"));
                    const plantCode = obj?.data?.plantCode;
                    if (plantCode) {
                        getPackerQueue(plantCode); // Fetch updated data
                    }
                }
            }, 5000); // 3 seconds interval

            return () => clearInterval(interval); // Cleanup on unmount
        }
    }, [packerQueueData, currentQueueIndex]);

    const getPackerUtilizationData = async (plantCode) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sales-dispatch-dashboard/getPackerData/${plantCode}`, config);
            const data = response.message["#result-set-2"];
            if (data) {
                setPackerData(data);
                setDisplayData(data.slice(0, 6)); // Initialize with the first 6 items
                setTotalCountPackerUtilizationData(data.length); // Set the total count
                setCurrentCountPackerUtilizationData(6); // Set initial current count to 6
            }
        } catch (error) {
            console.error('Error fetching Packer Data:', error);
        }
    };
    useEffect(() => {
        if (PackerData.length > 0) {
            const interval = setInterval(() => {
                const nextIndex = currentIndex + 6;
                if (nextIndex < PackerData.length) {
                    setCurrentIndex(nextIndex);
                    setDisplayData(PackerData.slice(nextIndex, nextIndex + 6));
                    setCurrentCountPackerUtilizationData(nextIndex + 6); // Update the current count
                } else {
                    // Refresh the data when all items have been displayed
                    setCurrentIndex(0);
                    setDisplayData(PackerData.slice(0, 6));
                    setCurrentCountPackerUtilizationData(6); // Update the current count
                    const obj = JSON.parse(sessionStorage.getItem("authUser"));
                    const plantCode = obj?.data?.plantCode;
                    if (plantCode) {
                        getPackerUtilizationData(plantCode); // Fetch updated data
                    }
                }
            }, 15000); // 3 seconds interval

            return () => clearInterval(interval); // Cleanup on unmount
        }
    }, [PackerData, currentIndex]);


    const updateFirstArray = (firstArray, secondArray) => {
        const updatedArray = firstArray.map((item) => {
            const matchingItem = secondArray.find(
                (secondItem) => secondItem.name === item.name
            );

            if (matchingItem) {
                // If there's a match, update the item with vehicle_number and packer_loader_status
                return {
                    ...item,
                    vehicle_number: matchingItem.vehicle_count,
                    packer_loader_status: matchingItem.loader_status,
                };
            }

            // If no match, return the original item
            return item;
        });

        return (updatedArray);
    };

    const liveLoaderDetails = (
        <>
            {LoaderData.length > 9
                ? LoaderData.map((data, idx) => (
                    <div key={idx} className="shadow" style={{ backgroundColor: 'aliceblue', padding: '3px 9px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', border: "solid 1px cadetblue" }} >
                        <span style={{ color: '#1f2937', fontWeight: '500' }} > {data.code} </span>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: data.packer_loader_status === "A" ? '#16a34a' : '#ccc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500' }}>
                            {data.vehicle_number ? data.vehicle_number : "0"}
                        </div>
                    </div>
                ))
                : LoaderData.map((data, idx) => (
                    <Col key={idx} className="shadow" style={{ backgroundColor: 'aliceblue', padding: '3px 9px', borderRadius: '6px', display: 'flex', alignItems: 'center', placeContent: 'space-around', border: "solid 1px cadetblue" }}>
                        <span style={{ color: '#1f2937', fontWeight: '500', }}>{data.code}</span>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: data.packer_loader_status === "A" ? '#16a34a' : '#ccc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500', }}>
                            {data.vehicle_number ? data.vehicle_number : "0"}
                        </div>
                    </Col>
                ))}
        </>
    );


    const formatDate = (inputDate) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = new Date(inputDate).toLocaleDateString('en-US', options);
        return formattedDate;
    };

    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });


    const getAnnouncementDetails = async (plantCode) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/gwFailed?plantCode=${plantCode}`, config);

            if (response) {
                setannouncementData(response);
                setDisplayAnnouncementData(response.slice(0, 4)); // Initialize with the first 4 items
                setTotalCountRejectedData(response.length); // Set the total count
                setCurrentCountRejectedData(4); // Set initial current count to 6
            }
        } catch (error) {
            console.error('Error fetching Packer Data:', error);
        }
    };

    useEffect(() => {
        if (announcementData.length > 0) {
            const interval = setInterval(() => {
                const nextIndex = currentAnnouncementIndex + 4;
                if (nextIndex < announcementData.length) {
                    setCurrentAnnouncementIndex(nextIndex);
                    setDisplayAnnouncementData(announcementData.slice(nextIndex, nextIndex + 4));
                    setCurrentCountRejectedData(nextIndex + 4); // Update the current count
                } else {
                    // Refresh the data when all items have been displayed
                    setCurrentAnnouncementIndex(0);
                    setDisplayAnnouncementData(announcementData.slice(0, 4));
                    setCurrentCountRejectedData(4);
                    const obj = JSON.parse(sessionStorage.getItem("authUser"));
                    const plantCode = obj?.data?.plantCode;
                    if (plantCode) {
                        getAnnouncementDetails(plantCode); // Fetch updated data
                    }
                }
            }, 20000); // 3 seconds interval

            return () => clearInterval(interval); // Cleanup on unmount
        }
    }, [announcementData, currentAnnouncementIndex]);



    document.title = "Live Dashboard";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Live Dashboard" pageTitle="Live" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList  ">
                                <div className="card-body">
                                    <div style={{ width: '100%', margin: '0px 0px 16px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', }}>
                                            <div className="shadow" style={{ backgroundColor: '#3b4b8c', color: 'white', padding: '10px 10px 5px 10px', borderRadius: '6px' }}>
                                                <h2 className="text-white fs-16" style={{ fontWeight: '900', }}>Loaders:</h2>
                                            </div>
                                            {liveLoaderDetails}
                                            {/* {LoaderData && LoaderData.length === 0 ? (
                                                <div className="shadow" style={{ backgroundColor: 'aliceblue', padding: '3px 10px 3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '12px', border: "solid 1px cadetblue", width: "130px" }}>
                                                    <span style={{ color: '#1f2937', fontWeight: '500', }}>{'Unplanned'}</span>
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f97316', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500', }}>
                                                        {unplannedCount}
                                                    </div>
                                                </div>

                                            ) : (
                                                LoaderData.length > 10 ? (
                                                    <div className="shadow" style={{ backgroundColor: 'aliceblue', padding: '3px 10px 3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '12px', border: "solid 1px cadetblue" }}>
                                                        <span style={{ color: '#1f2937', fontWeight: '500', }}>{'Unplanned'}</span>
                                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f97316', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500', }}>
                                                            {unplannedCount}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Col className="shadow" style={{ backgroundColor: 'aliceblue', padding: '3px 10px 3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', placeContent: 'space-around', border: "solid 1px cadetblue" }}>
                                                        <span style={{ color: '#1f2937', fontWeight: '500', }}>{'Unplanned'}</span>
                                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f97316', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500', }}>
                                                            {unplannedCount}
                                                        </div>
                                                    </Col>
                                                )
                                            )} */}
                                            <div className="shadow" style={{ backgroundColor: 'aliceblue', padding: '3px 10px 3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '12px', border: "solid 1px cadetblue", width: "130px" }}>
                                                <span style={{ color: '#1f2937', fontWeight: '500', }}>{'Unplanned'}</span>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f97316', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500', }}>
                                                    {unplannedCount}
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                    <Row className="g-3">
                                        <Col xl={10}>
                                            <Card id="customerList">

                                                <CardHeader className="mb-0 fw-bold bg-primary fs-16 shadow_light text-white" style={{ float: "left" }}>Dispatch Summary</CardHeader>
                                                <div className=" pt-0">
                                                    <div className="table-responsive">
                                                        <Table className="align-middle table-nowrap table-bordered mb-0 plant360" style={{ textAlign: 'center' }}>
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col" rowSpan={2}>Period</th>
                                                                    <th scope="col" colSpan={3}>Road - QTY(MT) OB</th>
                                                                    <th scope="col" colSpan={3}>Road - QTY(MT) IB</th>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="col">Target</th>
                                                                    <th scope="col">Achieved</th>
                                                                    <th scope="col">Balance</th>
                                                                    <th scope="col">Target</th>
                                                                    <th scope="col">Achieved</th>
                                                                    <th scope="col">Balance</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>{dispatchSummary ? `MTD (${month})` : "- -"}</td>
                                                                    <td>{dispatchSummary ? parseFloat(dispatchSummary.monthly_target).toFixed(2) : "0"}</td>
                                                                    <td>{dispatchSummary ? parseFloat(dispatchSummary.monthly_achived_target).toFixed(2) : "0"}</td>
                                                                    <td>{dispatchSummary ? parseFloat(dispatchSummary.monthly_balance).toFixed(2) : "0"}</td>
                                                                    <td>0</td>
                                                                    <td>0</td>
                                                                    <td>0</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>{dispatchSummary ? `Today (${formatDate(dispatchSummary.date)})` : "- -"}</td>
                                                                    <td>{dispatchSummary ? parseFloat(dispatchSummary.today_target).toFixed(2) : "0"}</td>
                                                                    <td>{dispatchSummary ? parseFloat(dispatchSummary.today_achieve_target).toFixed(2) : "0"}</td>
                                                                    <td>{dispatchSummary ? parseFloat(dispatchSummary.today_balance).toFixed(2) : "0"}</td>
                                                                    <td>0</td>
                                                                    <td>0</td>
                                                                    <td>0</td>
                                                                </tr>
                                                            </tbody>

                                                        </Table>
                                                    </div>
                                                </div>

                                            </Card>


                                        </Col>
                                        <Col xl={2} >
                                            <Card className="shadow_light bg-light" style={{ pointerEvents: "none", height: '88%' }}>
                                                <CardHeader className="mb-0 fw-bold bg-primary fs-16 shadow_light text-white">Current Month TGT</CardHeader>
                                                <CardBody >
                                                    <div className="text-center">
                                                        <img src={target} alt="" height="30" />
                                                    </div>
                                                    <div className="d-flex">
                                                        <div className="flex-grow-1 text-center mt-3">
                                                            <label>
                                                                <h6 className="mb-0 text-primary m">{"OB"} : {dispatchSummary ? parseFloat(dispatchSummary.monthly_target).toFixed(2) : "0"} MT</h6>
                                                            </label>
                                                            <br />
                                                            <label className="mb-0">
                                                                <h6 className="mb-0 text-primary">{"IB"} : 0 MT</h6>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </CardBody>

                                            </Card>
                                        </Col>
                                    </Row>
                                    <div style={{ width: '100%', maxWidth: '1200px', margin: '-5px 0px 23px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', }}>
                                            <div className="shadow" style={{ backgroundColor: '#3b4b8c', color: 'white', padding: '10px 7px 5px 7px', borderRadius: '6px' }}>
                                                <h2 className="text-white fs-16" style={{ fontWeight: '900', }}>{`Packer Queue : (${Math.min(currentCountPackerQueueData, totalCountPackerQueueData)}/${totalCountPackerQueueData})`}</h2>
                                            </div>
                                            {displayPackerQueueData.length > 0 ? (
                                                displayPackerQueueData.map((item, index) => (
                                                    <Card className="mb-1 ribbon-box ribbon-fill ribbon-sm shadow_light" key={index}>
                                                        <div className="ribbon element ribbon-success" style={{ margin: "4px 3px 0px 7px", fontSize: "medium" }}>{item.loaderNo}</div>
                                                        <CardBody style={{ padding: "10px 25px 5px", textAlign: "center", border: "solid 1px #0ab39c", borderRadius: "5px" }}>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6 className="fs-14 mb-1" style={{ textTransform: "uppercase" }}>{item.vehicleNumber}</h6>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                ))
                                            ) : (
                                                <Card className="mb-1 ribbon-box ribbon-fill ribbon-sm shadow_light">
                                                    <CardBody style={{ padding: "10px 15px 5px", textAlign: "center" }}>
                                                        <div className="flex-grow-1 ms-3">
                                                            <h6 className="fs-14 mb-1">{'No Data'}</h6>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            )}

                                        </div>
                                    </div>
                                    <Row className="g-3">
                                        {/* Packer Utilization Section */}
                                        <Col lg={4} sm={12} className="mt-2 mb-2">
                                            <Card className="shadow_light">
                                                <CardHeader className="fw-bold bg-primary fs-16 text-white">
                                                    {'Packer Utilization (MT)'}
                                                    <span style={{ float: "right" }}>{`Showing : ${Math.min(currentCountPackerUtilizationData, totalCountPackerUtilizationData)}/${totalCountPackerUtilizationData}`}</span>
                                                </CardHeader>
                                                <CardBody className="p-3" style={{ minHeight: "194px", maxHeight: '195px' }}>
                                                    <Row className="g-2">
                                                        {
                                                            displayData && displayData.length !== 0 ?
                                                                displayData.map((packer, index) => (
                                                                    <Col xs={6} key={index}>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                justifyContent: 'space-between',
                                                                                alignItems: 'center',
                                                                                padding: '8px 12px',
                                                                                borderRadius: '6px',
                                                                                backgroundColor: '#f8f9fa',
                                                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                                            }}
                                                                        >
                                                                            <span style={{ fontWeight: '500' }}>{packer.name}</span>
                                                                            <span
                                                                                style={{
                                                                                    backgroundColor: '#dbeafe',
                                                                                    color: '#2563eb',
                                                                                    padding: '4px 8px',
                                                                                    borderRadius: '4px',
                                                                                    fontWeight: '500',
                                                                                }}
                                                                            >
                                                                                {packer.di_qty}
                                                                            </span>
                                                                        </div>
                                                                    </Col>
                                                                ))
                                                                : <div className="text-center"><img src={logoDark} alt="" height="180" width="250" /></div>
                                                        }
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                        {/* GW Rejected Vehicles Section */}
                                        <Col lg={8} sm={12} className="mt-2 mb-2">
                                            <Card className="shadow_light">
                                                <CardHeader className="fw-bold bg-primary fs-16 text-white">
                                                    {'GW Rejected Vehicles'}
                                                    <span style={{ float: "right" }}>{`Showing : ${Math.min(currentCountRejectedData, totalCountRejectedData)}/${totalCountRejectedData}`}</span>
                                                </CardHeader>
                                                <CardBody className="p-3" style={{ minHeight: "194px", maxHeight: '195px' }}>
                                                    <table className="table table-striped table-bordered mb-0 plant360">
                                                        <thead>
                                                            <tr>
                                                                <th>Vehicle Number</th>
                                                                <th>Packer</th>
                                                                <th>Loader</th>
                                                                <th>GW Rejected Time</th>
                                                                <th>Age After TW</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {displayAnnouncementData.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td style={{ textTransform: "uppercase" }}>{item.vehicleNumber}</td>
                                                                    <td>{item.packer}</td>
                                                                    <td>{item.loader}</td>
                                                                    <td>{item.weighmentDate}</td>
                                                                    <td>{item.age_after_TW}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

                                </div>
                            </Card>
                        </Col>


                    </Row>
                </Container>
            </div>

            <ToastContainer closeButton={false} limit={1} />

        </React.Fragment>
    );
};

export default LiveTV360;
