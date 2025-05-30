import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Button } from "reactstrap";
import axios from "axios";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import TableContainer from "../../../Components/Common/TableContainer";
import {
    LineChart, StackedLineChart, AreaChart, StackedAreaChart, StepLineChart, LineYChart, BasicBarChart,
    BarLabelChart, HorizontalBarChart, StackedHorizontalBarChart, PieChart, DoughnutChart, BasicScatterChart,
    CandleStickChart, GraphChart, TreemapChart, SunburstChart, ParallelChart, SankeyChart, FunnelChart, GaugeChart, HeatmapChart
} from './EChartsOb';

import {
    BasicColumn,
    ColumnWithLable,
    StackedColumn,
    StackedColumn1,
    StackedColumn2,
    ColumnMarker,
    RotateLable,
    NagetiveLable,
    RangeColumn,
    DynamicColumn,
    Quarter,
    DistributedColumn,
    ColumnGroupLabels
} from "../../Charts/ApexCharts/ColumnCharts/ColumnCharts";

import {
    Basic,
    CustomDataLabel,
    Stacked,
    Stacked2,
    Negative,
    Markers,
    Reversed,
    Patterned,
    Groupes,
    BarwithImages
} from "../../Charts/ApexCharts/BarCharts/BarCharts";


import {
    BasicLineCharts,
    ZoomableTimeseries,
    LinewithDataLabels,
    LinewithDataLabelsOB,
    DashedLine,
    LinewithAnnotations,
    BrushChart,
    BrushChart1,
    SteplineChart,
    GradientCharts,
    MissingData,
    ChartSyncingLine,
    ChartSyncingLine2,
    ChartSyncingArea
} from "../../Charts/ApexCharts/LineCharts/LineCharts";

// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

const EchartsOb = () => {

    const [isExportCSV, setIsExportCSV] = useState(false);
    const [dataInExcelSheet, setDataInExcelSheet] = useState([]);

    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
        const interval = setInterval(() => {
            if (document.querySelector(".modal") !== null) {
                if (document.querySelector(".modal").classList.contains('show') === true) {
                    getAllCountForVehicle(plantcode);
                }
            } else {
                getAllCountForVehicle(plantcode);
            }
        }, 5000);
        return () => clearInterval(interval);
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

    // Customers Column
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
                Header: "Trip Id",
                accessor: "tripId",
                filterable: false,
            },
            {
                Header: "Vehicle Number",
                accessor: "vehicleNumber",
                filterable: false,
            },
            {
                Header: "Sequence Date",
                accessor: "sequencedDate",
                filterable: false,
            },
            {
                Header: "Sequence Type",
                accessor: "manualSequence",
                Cell: (cell) => {
                    return (cell.value === 0 ? "Manual" : "Auto");
                }
                // filterable: false,
            },
            {
                Header: "Queue Type",
                accessor: "queueType",
                filterable: false,
            },
            {
                Header: "Material Code",
                accessor: "material",
                filterable: false,
            },
            {
                Header: "Material",
                accessor: "materialtypes",
                filterable: false,
            },
            {
                Header: "Plant Code",
                accessor: "plantCode",
                filterable: false,
            },
            {
                Header: "Planned Packer",
                accessor: "plannedPacker",
                filterable: false,
            },
            {
                Header: "Planned Terminal",
                accessor: "plannedTerminal",
                filterable: false,
            },
        ],
        []
    );

    const [totalVehicle, setTotalVehicle] = useState(0);
    const [rqCount, setRqCount] = useState(0);
    const [wqCount, setWqCount] = useState(0);
    const [wqClinker, setWqClinker] = useState(0);
    const [rqClinker, setRqClinker] = useState(0);
    const [totalDataInVehicle, setTotalDataInVehicle] = useState([]);
    const [Plant_Code, setPlantCode] = useState('');
    const [comapny_code, setCompanyCode] = useState('');
    const [latestHeader, setLatestHeader] = useState('');

    useEffect(() => {
        const HeaderName = localStorage.getItem("HeaderName");
        setLatestHeader(HeaderName);
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
        sessionStorage.getItem("main_menu_login");
        const obj1 = JSON.parse(sessionStorage.getItem("main_menu_login"));
        let companyCode = obj1.companyCode;
        setCompanyCode(companyCode);
        getAllCountForVehicle(plantcode);
    }, []);


    const getAllCountForVehicle = (plantcode) => {

        // alert("df")

        axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/dashboard/getSequencingCounts?plantCode=${plantcode}`, config)
            .then(res => {
                const countL = res;
                setTotalVehicle(countL.totalVehicleCounts);
                setRqCount(countL.rqcounts);
                setWqCount(countL.wqcounts);
                setWqClinker(countL.wqclinckerCounts);
                setRqClinker(countL.rqclinckerCounts);
            });
    }


    const crmWidgets = [
        {
            id: 1,
            label: "Total Vehicle",
            badge: "ri-arrow-up-circle-line text-success",
            icon: "ri-space-ship-line",
            counter: totalVehicle,
            iconType: "",
            decimals: 0,
            suffix: "",
            prefix: ""
        },
        {
            id: 2,
            label: "Ready Queue",
            badge: "ri-arrow-up-circle-line text-success",
            icon: "ri-exchange-dollar-line",
            iconType: "RQ",
            counter: rqCount,
            decimals: 0,
            suffix: "",
            prefix: ""
        },
        {
            id: 3,
            label: "Waiting Queue",
            badge: "ri-arrow-down-circle-line text-danger",
            icon: "ri-pulse-line",
            iconType: "WQ",
            counter: wqCount,
            decimals: 0,
            suffix: "",
            prefix: ""
        },
        {
            id: 4,
            label: "Ready Queue Clinker",
            badge: "ri-arrow-up-circle-line text-success",
            icon: "ri-trophy-line",
            iconType: "RQC",
            counter: rqClinker,
            decimals: 0,
            prefix: "",
            separator: ",",
            suffix: ""
        },
        {
            id: 5,
            label: "Waiting Queue Clinker",
            badge: "ri-arrow-down-circle-line text-danger",
            icon: "ri-service-line",
            iconType: "WQC",
            counter: wqClinker,
            decimals: 0,
            separator: ",",
            suffix: "",
            prefix: ""
        },
    ];


    const handleDownload = async (e) => {
        e.preventDefault();
        downloadCSV();
        setIsExportCSV(false)
    };

    const downloadCSV = () => {
        const header = Object.keys(dataInExcelSheet[0]).join(',') + '\n';
        const csv = dataInExcelSheet.map((row) => Object.values(row).join(',')).join('\n');
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

    const addClusterPlantMap = (index, type) => {
        var element = document.getElementById("check_0");
        var element1 = document.getElementById("check_1");
        var element2 = document.getElementById("check_2");
        var element3 = document.getElementById("check_3");
        var element4 = document.getElementById("check_4");
        element.classList.remove("active-class");
        element1.classList.remove("active-class");
        element2.classList.remove("active-class");
        element3.classList.remove("active-class");
        element4.classList.remove("active-class");
        try {
            if (type === '') {
                axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllSequencingForIBAndOB?flag=OB&plantCode=${Plant_Code}`, config).then((res) => {
                    console.log("resa", res);
                    const bl = [];
                    res.map(function (value, index) {
                        const av = {};
                        av["Trip Id"] = value.tripId;
                        av["Vehicle Number"] = value.vehicleNumber;
                        av["Sequence Date"] = value.sequencedDate;
                        av["Sequence Type"] = (value.manualSequence === 0 ? "Manual" : "Auto");
                        av["Queue Type"] = value.queueType;
                        av["Material"] = value.material;
                        av["Plant Code"] = value.plantCode;
                        av["Planned Packer"] = value.plannedPacker;
                        av["Planned Terminal"] = value.plannedTerminal;
                        bl.push(av);
                    });

                    setDataInExcelSheet(bl);

                    setTotalDataInVehicle(res);
                });
            } else {
                axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllSequencingByQueue?queueType=${type}&flag=OB&plantCode=${Plant_Code}`, config).then((res) => {
                    const bl = [];
                    res.map(function (value, index) {
                        const av = {};
                        av["Trip Id"] = value.tripId;
                        av["Vehicle Number"] = value.vehicleNumber;
                        av["Sequence Date"] = value.sequencedDate;
                        av["Sequence Type"] = (value.manualSequence === 0 ? "Manual" : "Auto");
                        av["Queue Type"] = value.queueType;
                        av["Material"] = value.material;
                        av["Plant Code"] = value.plantCode;
                        av["Planned Packer"] = value.plannedPacker;
                        av["Planned Terminal"] = value.plannedTerminal;
                        bl.push(av);
                    });

                    setDataInExcelSheet(bl);
                    setTotalDataInVehicle(res);
                });
            }

            document.getElementById("check_" + index).setAttribute("class", "active-class");

        } catch (e) {
            // toast.error("Something went wrong!", { autoClose: 3000 });
        }
        // console.log("totalDataInVehicle",totalDataInVehicle);
        setViewModal();
    }

    const handleCustomerClicks = () => {

    };

    const reloadPage = () => {
        window.location.reload();
        //alert("fdfd")
    }

    const [documentModal, setDocumentModal] = useState(false);

    const setViewModal = () => {
        setDocumentModal(!documentModal);
    };


    document.title = "Sequence Outbound Dashboard | EPLMS";
    return (

        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={"Sequence Outbound Dashboard"} pageTitle="Dashboard" />

                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader className="sample-class">
                                    <h4 className="card-title mb-0">Real Time Sequence Status </h4>
                                </CardHeader>
                            </Card>
                        </Col>
                        <Col xl={1}></Col>
                    </Row>
                    <Row>
                        <div className="col-xl-12">
                            <div className="card crm-widget">
                                <div className="card-body p-0">
                                    <div className="row row-cols-xxl-5 row-cols-md-3 row-cols-1 g-0">
                                        {(crmWidgets).map((widget, index) => (
                                            <div className="col col-wo" key={index} id={"check_" + index} onClick={() => { addClusterPlantMap(index, widget.iconType); }}>
                                                <div className="py-4 px-3">
                                                    <h5 className="text-muted text-uppercase fs-13">{widget.label}</h5>
                                                    <div className="d-flex align-items-center">
                                                        {/**<div className="flex-shrink-0">
                                                                <i className={widget.icon + " display-6 text-muted"}></i>
                                                            </div>*/}
                                                        <div className="flex-grow-1 ms-3">
                                                            <h2 className="mb-0"><span className="counter-value" data-target="197">
                                                                <CountUp
                                                                    start={0}
                                                                    prefix={widget.prefix}
                                                                    suffix={widget.suffix}
                                                                    separator={widget.separator}
                                                                    end={widget.counter}
                                                                    decimals={widget.decimals}
                                                                    duration={4}
                                                                />
                                                            </span></h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Total Queue</h4>
                                </CardHeader>
                                <CardBody>
                                    <StackedColumn1 dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger"]' />
                                    {/*<Groupes dataColors='["--vz-primary", "--vz-success"]'/>*/}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Total Vehicle</h4>
                                </CardHeader>
                                <CardBody>
                                    <LinewithDataLabelsOB dataColors='["--vz-primary","--vz-success","--vz-warning"]' />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={4}></Col>
                    </Row>

                    {/*<Row>
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Line Chart</h4>
                            </CardHeader>
                            <CardBody>
                                <LineChart dataColors='["--vz-success"]'/>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Stacked Line Chart</h4>
                            </CardHeader>
                            <div className="card-body">
                                <StackedLineChart dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'/>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Area Chart</h4>
                            </CardHeader>
                            <div className="card-body">
                                <AreaChart dataColors='["--vz-success"]'/>
                            </div>
                        </Card>
                    </Col>

                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Stacked Area Chart</h4>
                            </CardHeader>
                            <div className="card-body">
                                <StackedAreaChart dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'/>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Step Line</h4>
                            </CardHeader>
                            <div className="card-body">
                                <StepLineChart dataColors='["--vz-primary", "--vz-success", "--vz-warning"]'/>
                            </div>
                        </Card>
                    </Col>

                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Line Y Category</h4>
                            </CardHeader>
                            <div className="card-body">
                                <LineYChart dataColors='["--vz-success"]'/>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Basic Bar</h4>
                            </CardHeader>
                            <div className="card-body">
                                <BasicBarChart dataColors='["--vz-success"]'/>
                            </div>
                        </Card>
                    </Col>

                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Bar Label</h4>
                            </CardHeader>
                            <div className="card-body">
                                <BarLabelChart dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger"]'/>
                            </div>
                        </Card>
                    </Col>
                </Row>


                <Row>
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Horizontal Bar</h4>
                            </CardHeader>
                            <div className="card-body">
                                <HorizontalBarChart dataColors='["--vz-primary", "--vz-success"]'/>
                            </div>
                        </Card>
                    </Col>

                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Stacked Horizontal Bar</h4>
                            </CardHeader>
                            <div className="card-body">
                                <StackedHorizontalBarChart dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'/>
                            </div>
                        </Card>
                    </Col>
                </Row>
*/}
                    {/**  <Row> */}
                    {/**   <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Pie Charts</h4>
                            </CardHeader>
                            <div className="card-body">
                                <PieChart dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'/>
                            </div>
                        </Card>
                    </Col>
*/}
                    {/** <Col xl={4}>
                        <Card>
                            <div className="card-body">
                                <DoughnutChart dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'/>
                            </div>
                        </Card>
                    </Col>
                    <Col xl={4}>
                        <Card>
                            <div className="card-body">
                                <DoughnutChart dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'/>
                            </div>
                        </Card>
                    </Col>
                    <Col xl={4}>
                        <Card>
                            <div className="card-body">
                                <DoughnutChart dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'/>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row style={{display:"none"}}>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>

                            </CardHeader>
                            <div className="card-body pt-0">
                                <div>
                                <TableContainer
                                    columns={columns}
                                    data={[]}
                                    isGlobalFilter={true}
                                    isAddUserList={false}
                                    customPageSize={5}
                                    isGlobalSearch={true}
                                    className="custom-header-css"
                                    //handleCustomerClick={handleCustomerClicks}
                                    SearchPlaceholder='Search Name or something...'
                                />
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>{/**
{/**
                <Row>
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Basic Scatter Chart</h4>
                            </CardHeader>
                            <div className="card-body">
                                <BasicScatterChart dataColors='["--vz-primary"]'/>
                            </div>
                        </Card>
                    </Col>

                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Candlestick Chart</h4>
                            </CardHeader>
                            <div className="card-body">
                                <CandleStickChart dataColors='["--vz-danger", "--vz-success"]'/>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Graph Chart</h4>
                            </CardHeader>
                            <div className="card-body">
                                <GraphChart dataColors='["--vz-primary"]'/>
                            </div>
                        </Card>
                    </Col>

                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Treemap Chart</h4>
                            </CardHeader>
                            <div className="card-body">
                                <TreemapChart dataColors='["--vz-primary", "--vz-success"]'/>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Sunburst Chart</h4>
                            </CardHeader>
                            <div className="card-body">
                                <SunburstChart dataColors='["--vz-warning", "--vz-success"]'/>
                            </div>
                        </Card>
                    </Col>

                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Parallel Chart</h4>
                            </CardHeader>
                            <div className="card-body">
                                <ParallelChart dataColors='["--vz-success"]'/>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Sankey Chart</h4>
                            </CardHeader>
                            <div className="card-body">
                                <SankeyChart dataColors='["--vz-info", "--vz-success", "--vz-warning", "--vz-danger", "--vz-primary"]'/>
                            </div>
                        </Card>
                    </Col>


                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Funnel Chart</h4>
                            </CardHeader>
                            <div className="card-body">
                                <FunnelChart dataColors='["--vz-info", "--vz-success", "--vz-warning", "--vz-danger", "--vz-primary"]'/>
                            </div>
                        </Card>
                    </Col>
                </Row>


                <Row>
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Gauge Chart</h4>
                            </CardHeader>
                            <div className="card-body">
                                <GaugeChart dataColors='["--vz-primary"]'/>
                            </div>
                        </Card>
                    </Col>

                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Heatmap Chart</h4>
                            </CardHeader>
                            <div className="card-body">
                                <HeatmapChart dataColors='["--vz-primary", "--vz-warning"]'/>
                            </div>
                        </Card>
                    </Col>
                </Row> */}
                </Container>
            </div>
            <Modal isOpen={documentModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="xl" toggle={setViewModal}>
                <ModalHeader toggle={() => {
                    var element = document.getElementById("check_0");
                    var element1 = document.getElementById("check_1");
                    var element2 = document.getElementById("check_2");
                    var element3 = document.getElementById("check_3");
                    var element4 = document.getElementById("check_4");
                    element.classList.remove("active-class");
                    element1.classList.remove("active-class");
                    element2.classList.remove("active-class");
                    element3.classList.remove("active-class");
                    element4.classList.remove("active-class");
                    setViewModal(!documentModal);
                }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
                    <h5 className="text-white fs-20">Sequencing Detail</h5>
                </ModalHeader>
                <ModalBody>
                    <div className="product-content mt-0">
                        <ExportCSVModal
                            show={isExportCSV}
                            onCloseClick={() => setIsExportCSV(false)}
                            onDownloadClick={handleDownload}
                            data={totalDataInVehicle}
                        />
                        {" "}
                        <button style={{ float: "right" }} type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                            <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                        </button>
                        <TableContainer
                            trClass={"ob_table_row"}
                            columns={columns}
                            data={totalDataInVehicle}
                            isGlobalFilter={true}
                            isAddUserList={false}
                            customPageSize={5}
                            isGlobalSearch={true}
                            className="custom-header-css"
                            handleCustomerClick={handleCustomerClicks}
                            isCustomerFilter={false}
                            SearchPlaceholder='Search...'
                            style={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
                        />
                    </div>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export default EchartsOb