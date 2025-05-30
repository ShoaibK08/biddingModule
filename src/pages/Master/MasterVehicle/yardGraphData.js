import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
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


const YardGraphData = () => {


    const [loader, setloader] = useState(false);

    const [firstVehicleType, setFirstVehicle] = useState([]);
    const [firstVehicleCount, setFirstVehicleCount] = useState([]);
    const [secondVehicleType, setSecondVehicle] = useState([]);
    const [secondVehicleCount, setSecondVehicleCount] = useState([]);
    const [thirdVehicleType, setThirdVehicle] = useState([]);
    const [thirdVehicleCount, setThirdVehicleCount] = useState([]);
    const [fourthVehicleType, setFourthVehicle] = useState([]);

    useEffect(() => {
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        graphData(plantcode);

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

    const graphData = async (plantcode) => {
        await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/waitingVehicle/${plantcode}`, config)
            .then(res => {
                const allData = res;
                const vehicletype1 = (allData.less4Hours).map((x) => x.vehicleType);
                const vehicleCount1 = (allData.less4Hours).map((x) => x.vehicleCount);
                setFirstVehicle(vehicletype1);
                setFirstVehicleCount(vehicleCount1);

                const vehicletype2 = (allData.fourToEightHour).map((x) => x.vehicleType);
                const vehicleCount2 = (allData.fourToEightHour).map((x) => x.vehicleCount);
                setSecondVehicle(vehicletype2);
                setSecondVehicleCount(vehicleCount2);

                const vehicletype3 = (allData.greaterThen8Hours).map((x) => x.vehicleType);
                const vehicleCount3 = (allData.greaterThen8Hours).map((x) => x.vehicleCount);
                setThirdVehicle(vehicletype3);
                setThirdVehicleCount(vehicleCount3);

                let result = [];

                allData.lessThen24Hours.forEach(function (item) {
                    if (item.vehicleType) {
                        const vehicleCount = (allData.lessThen24Hours).map((x) => x.vehicleCount);
                        result.push({
                            "name": item.vehicleType,
                            "data": vehicleCount
                        });
                        //console.log(JSON.stringify(result));
                        setFourthVehicle(result);
                    }
                });

            })
    };
 
    const RotateLable = ({ dataColors }) => {
        var chartColumnRotateLabelsColors = getChartColorsArray(dataColors);

        const series = [{
            name: 'Number of Vehicles',
            data: firstVehicleCount ? firstVehicleCount : []
        }];
        var options = {
            annotations: {
                points: [{
                    x: '',
                    seriesIndex: 0,
                    label: {
                        borderColor: '#775DD0',
                        offsetY: 0,
                        style: {
                            color: '#fff',
                            background: '#775DD0',
                        },
                        text: '',
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
                    columnWidth: '30%',
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
                categories: firstVehicleType ? firstVehicleType : [],
                tickPlacement: 'on'
            },
            yaxis: {
                title: {
                    text: 'Number of Vehicles',
                },
                labels: {
                    formatter: function (val) {
                        return val.toFixed(0);
                    }
                },
                decimalsInFloat: 0,
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
            name: 'Number of Vehicles',
            data: secondVehicleCount ? secondVehicleCount : [],
        }];
        var options = {
            annotations: {
                points: [{
                    x: '',
                    seriesIndex: 0,
                    label: {

                        borderColor: '#775DD0',
                        offsetY: 0,
                        style: {
                            color: '#fff',
                            background: '#775DD0',
                        },
                        text: '',
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
                    columnWidth: '30%',
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 2
            },
            colors: BasicColors,
            xaxis: {
                labels: {
                    rotate: -45
                },
                categories: secondVehicleType ? secondVehicleType : [],
                tickPlacement: 'on'
            },
            yaxis: {
                title: {
                    text: 'Number of Vehicles',
                },
                labels: {
                    formatter: function (val) {
                        return val.toFixed(0);
                    }
                },
                decimalsInFloat: 0,
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



    const MonochromePie = ({ dataColors }) => {

        var chartMonochromeColors = getChartColorsArray(dataColors);
        // const [thirdVehicleType, setThirdVehicle] = useState('');
        // const [thirdVehicleCount, setThirdVehicleCount] = useState('');

        // useEffect(() => {
        //     const obj = JSON.parse(sessionStorage.getItem("authUser"));
        //     let plantcode = obj.data.plantCode;
        //     thirdGraph(plantcode);
        // }, []);

        // const thirdGraph = (plantcode) => {
        //     axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/waitingVehicle/${plantcode}`, config)
        //         .then(res => {
        //             const allData = res;

        //             const vehicletype = (allData.greaterThen8Hours).map((x) => x.vehicleType);
        //             const vehicleCount = (allData.greaterThen8Hours).map((x) => x.vehicleCount);

        //             setThirdVehicle(vehicletype);
        //             setThirdVehicleCount(vehicleCount);

        //         })
        // };

        const series = thirdVehicleCount ? thirdVehicleCount : []
        var options = {

            chart: {
                height: 300,
                type: 'pie',
            },
            labels: thirdVehicleType ? thirdVehicleType : [],
            theme: {
                monochrome: {
                    enabled: true,
                    color: '#405189',
                    shadeTo: 'light',
                    shadeIntensity: 1
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
                text: "Vehicle Data",
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
                },
            },
            legend: {
                show: true
            },
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

    const Stacked2 = ({ dataColors }) => {
        var chartStackedBar100Colors = getChartColorsArray(dataColors);

        //const series = fourthVehicleType ? fourthVehicleType : [];
        const series =
        [
            {
                name: "D",
                data: [44, 55, 41, 37, 22, 43, 21],
            },
            {
                name: "M",
                data: [53, 32, 33, 52, 13, 43, 32],
            },
            {
                name: "T",
                data: [12, 17, 11, 9, 15, 11, 20],
            },
            {
                name: "M",
                data: [9, 7, 5, 8, 6, 9, 4],
            },
            {
                name: "D",
                data: [25, 12, 19, 32, 25, 24, 10],
            },
            {
                name: "T",
                data: [25, 12, 19, 32, 25, 24, 10],
            }
        ];

        const options = {
            chart: {
                stacked: !0,
                stackType: "100%",
                toolbar: {
                    show: !1,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: !0,
                },
            },
            stroke: {
                width: 1,
                colors: ["#fff"],
            },
            title: {
                text: "Vehicle List",
                style: {
                    fontWeight: 600,
                },
            },
            xaxis: {
                categories: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val;
                    },
                },
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                offsetX: 40,
            },
            colors: chartStackedBar100Colors,
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


    return (
        <React.Fragment>
            <Card className="mt-3 shadow_light">
                {loader && <LoaderNew></LoaderNew>}
                <CardHeader className="bg-light fw-bold">YARD TAT</CardHeader>
                <CardBody>
                    <Row>
                        <Col lg={6}>
                            <Card className="shadow_light">
                                <CardHeader style={{ background: "#c6e3f4" }}>
                                    <h4 className="card-title mb-0">Waiting Vehicles &lt; 4 Hrs</h4>
                                </CardHeader>
                                <CardBody>
                                    <RotateLable dataColors='["--vz-info"]' />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card className="shadow_light">
                                <CardHeader style={{ background: "rgb(147 244 231)" }}>
                                    <h4 className="card-title mb-0">Waiting Vehicles 4-8 Hrs</h4>
                                </CardHeader>
                                <CardBody>
                                    <Basic dataColors='["--vz-success"]' />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card className="shadow_light">
                                <CardHeader style={{ background: "rgb(203 208 226)" }}>
                                    <h4 className="card-title mb-0">Waiting Vehicles &gt; 8 Hrs</h4>
                                </CardHeader>
                                <CardBody>
                                    <MonochromePie dataColors='["--vz-primary"]' />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card className="shadow_light">
                                <CardHeader style={{ background: "rgb(236 185 174)" }}>
                                    <h4 className="card-title mb-0">Waiting Vehicles &gt; 24 Hrs</h4>
                                </CardHeader>
                                <CardBody>
                                    <Stacked2 dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default memo(YardGraphData);
