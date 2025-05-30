import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
//import '../MasterVehicle/Vehicle.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import LoaderNew from "../../Components/Common/Loader_new";
import Flatpickr from "react-flatpickr";
import classnames from "classnames";
import getChartColorsArray from "../../../Components/Common/ChartsDynamicColor";
import ReactApexChart from "react-apexcharts";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";


const PackerLoaderCharts = () => {
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

    const outlineBorderNavtoggle = (tab) => {
        if (outlineBorderNav !== tab) {
            setoutlineBorderNav(tab);
        }
    };

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
                Header: "Manufacturing Date",
                accessor: "manufacturingDate",
                filterable: false,
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
                Header: "Tare Weight",
                accessor: "tareWeight",
                filterable: false,
            },
            {
                Header: "Gross Weight",
                accessor: "grossWeight",
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

        ],
    );

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


    const BasicPacker1 = ({ dataColors }) => {
        var chartStackedBar100Colors = getChartColorsArray(dataColors);
        const series = [
            {
                name: "Actual Running",
                data: [40, 32, 30, 41, 43, 45, 37],
            },            
            {
                name: "Maintainance",
                data: [20, 17, 11, 21, 23, 25, 27],
            },            
            {
                name: "Down By User",
                data: [19, 17, 25, 20, 22, 24, 26],
            },
            {
                name: "Idle Running",
                data: [14, 15, 11, 14, 16, 14, 12],
            },
        ];
    
        const options = {
            chart: {
                stacked: !0,
                stackType: "100%",
                toolbar: {
                    show: !1,
                },
            },
            yaxis: {
                title: {
                    text: 'Days',
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
                //text: "100% Stacked Bar",
                style: {
                    fontWeight: 600,
                },
            },
            xaxis: {
                categories: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val ;
                    },
                },
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                //offsetX: 40,
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

    const BasicPacker2 = ({ dataColors }) => {
        var chartStackedBar100Colors = getChartColorsArray(dataColors);
        const series = [
            {
                name: "Actual Running",
                data: [40, 32, 30, 41, 43, 45, 37],
            },            
            {
                name: "Maintainance",
                data: [20, 17, 11, 21, 23, 25, 27],
            },            
            {
                name: "Down By User",
                data: [19, 17, 25, 20, 22, 24, 26],
            },
            {
                name: "Idle Running",
                data: [14, 15, 11, 14, 16, 14, 12],
            },
        ];
    
        const options = {
            chart: {
                stacked: !0,
                stackType: "100%",
                toolbar: {
                    show: !1,
                },
            },
            yaxis: {
                title: {
                    text: 'Days',
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
                //text: "100% Stacked Bar",
                style: {
                    fontWeight: 600,
                },
            },
            xaxis: {
                categories: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val ;
                    },
                },
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                //offsetX: 40,
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

    const BasicPacker3 = ({ dataColors }) => {
        var chartStackedBar100Colors = getChartColorsArray(dataColors);
        const series = [
            {
                name: "Actual Running",
                data: [40, 32, 30, 41, 43, 45, 37],
            },            
            {
                name: "Maintainance",
                data: [20, 17, 11, 21, 23, 25, 27],
            },            
            {
                name: "Down By User",
                data: [19, 17, 25, 20, 22, 24, 26],
            },
            {
                name: "Idle Running",
                data: [14, 15, 11, 14, 16, 14, 12],
            },
        ];
    
        const options = {
            chart: {
                stacked: !0,
                stackType: "100%",
                toolbar: {
                    show: !1,
                },
            },
            yaxis: {
                title: {
                    text: 'Days',
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
                //text: "100% Stacked Bar",
                style: {
                    fontWeight: 600,
                },
            },
            xaxis: {
                categories: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val ;
                    },
                },
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                //offsetX: 40,
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

    const BasicPacker4 = ({ dataColors }) => {
        var chartStackedBar100Colors = getChartColorsArray(dataColors);
        const series = [            
            {
                name: "Actual Running",
                data: [40, 32, 30, 41, 43, 45, 37],
            },            
            {
                name: "Maintainance",
                data: [20, 17, 11, 21, 23, 25, 27],
            },            
            {
                name: "Down By User",
                data: [19, 17, 25, 20, 22, 24, 26],
            },
            {
                name: "Idle Running",
                data: [14, 15, 11, 14, 16, 14, 12],
            },
        ];
    
        const options = {
            chart: {
                stacked: !0,
                stackType: "100%",
                toolbar: {
                    show: !1,
                },
            },
            yaxis: {
                title: {
                    text: 'Days',
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
                //text: "100% Stacked Bar",
                style: {
                    fontWeight: 600,
                },
            },
            xaxis: {
                categories: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val ;
                    },
                },
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                //offsetX: 40,
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

    const BasicLoader1 = ({ dataColors }) => {
        var chartStackedBar100Colors = getChartColorsArray(dataColors);
        const series = [            
            {
                name: "Actual Running",
                data: [40, 32, 30, 41, 43, 45, 37],
            },            
            {
                name: "Maintainance",
                data: [20, 17, 11, 21, 23, 25, 27],
            },            
            {
                name: "Down By User",
                data: [19, 17, 25, 20, 22, 24, 26],
            },
            {
                name: "Idle Running",
                data: [14, 15, 11, 14, 16, 14, 12],
            },
        ];
    
        const options = {
            chart: {
                stacked: !0,
                stackType: "100%",
                toolbar: {
                    show: !1,
                },
            },
            yaxis: {
                title: {
                    text: 'Days',
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
                //text: "100% Stacked Bar",
                style: {
                    fontWeight: 600,
                },
            },
            xaxis: {
                categories: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val ;
                    },
                },
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                //offsetX: 40,
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

    const BasicLoader2 = ({ dataColors }) => {
        var chartStackedBar100Colors = getChartColorsArray(dataColors);
        const series = [            
            {
                name: "Actual Running",
                data: [40, 32, 30, 41, 43, 45, 37],
            },            
            {
                name: "Maintainance",
                data: [20, 17, 11, 21, 23, 25, 27],
            },            
            {
                name: "Down By User",
                data: [19, 17, 25, 20, 22, 24, 26],
            },
            {
                name: "Idle Running",
                data: [14, 15, 11, 14, 16, 14, 12],
            },
        ];
    
        const options = {
            chart: {
                stacked: !0,
                stackType: "100%",
                toolbar: {
                    show: !1,
                },
            },
            yaxis: {
                title: {
                    text: 'Days',
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
                //text: "100% Stacked Bar",
                style: {
                    fontWeight: 600,
                },
            },
            xaxis: {
                categories: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val ;
                    },
                },
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                //offsetX: 40,
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

    const BasicLoader3 = ({ dataColors }) => {
        var chartStackedBar100Colors = getChartColorsArray(dataColors);
        const series = [
            {
                name: "Actual Running",
                data: [40, 32, 30, 41, 43, 45, 37],
            },            
            {
                name: "Maintainance",
                data: [20, 17, 11, 21, 23, 25, 27],
            },            
            {
                name: "Down By User",
                data: [19, 17, 25, 20, 22, 24, 26],
            },
            {
                name: "Idle Running",
                data: [14, 15, 11, 14, 16, 14, 12],
            },
        ];
    
        const options = {
            chart: {
                stacked: !0,
                stackType: "100%",
                toolbar: {
                    show: !1,
                },
            },
            yaxis: {
                title: {
                    text: 'Days',
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
                //text: "100% Stacked Bar",
                style: {
                    fontWeight: 600,
                },
            },
            xaxis: {
                categories: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val ;
                    },
                },
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                //offsetX: 40,
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

    const BasicLoader4 = ({ dataColors }) => {
        var chartStackedBar100Colors = getChartColorsArray(dataColors);
        const series = [
            {
                name: "Actual Running",
                data: [40, 32, 30, 41, 43, 45, 37],
            },            
            {
                name: "Maintainance",
                data: [20, 17, 11, 21, 23, 25, 27],
            },            
            {
                name: "Down By User",
                data: [19, 17, 25, 20, 22, 24, 26],
            },
            {
                name: "Idle Running",
                data: [14, 15, 11, 14, 16, 14, 12],
            },
        ];
    
        const options = {
            chart: {
                stacked: !0,
                stackType: "100%",
                toolbar: {
                    show: !1,
                },
            },
            
            yaxis: {
                title: {
                    text: 'Days',
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
                //text: "100% Stacked Bar",
                style: {
                    fontWeight: 600,
                },
            },
            xaxis: {
                categories: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val ;
                    },
                },
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                //offsetX: 40,
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

    const BasicLoaderP1 = ({ dataColors }) => {
        var SteplineChartColors = getChartColorsArray(dataColors);
        const series = [
            {
                data: [30000, 31000, 30000, 31500,30000, 32000, 30500, 30000, 30000, 31000, 31000,30000],
            },
        ];
        const options = {
            stroke: {
                curve: "stepline",
            },
            dataLabels: {
                enabled: !1,
            },
            chart: {
                toolbar: {
                    show: false,
                }
            },
            yaxis: {
                title: {
                    text: 'Electrical Energy Consumption (KW)',
                },
            },
            xaxis: {
                categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug", "Sep", "Oct", "Nov","Dec"],
            },
            title: {
                //text: "Stepline Chart",
                align: "left",
                style: {
                    fontWeight: 500,
                },
            },
            markers: {
                hover: {
                    sizeOffset: 4,
                },
            },
            colors: SteplineChartColors,
        };

        return (
            <React.Fragment>
                <ReactApexChart
                    options={options}
                    series={series}
                    type="line"
                    height={350}
                    className="apex-charts"
                />
            </React.Fragment>
        );
    };

    const BasicLoaderP2 = ({ dataColors }) => {
        var SteplineChartColors = getChartColorsArray(dataColors);
        const series = [
            {
                data: [30000, 31000, 30000, 31500,30000, 32000, 30500, 30000, 30000, 31000, 31000,30000],
            },
        ];
        const options = {
            stroke: {
                curve: "stepline",
            },
            dataLabels: {
                enabled: !1,
            },
            chart: {
                toolbar: {
                    show: false,
                }
            },
            yaxis: {
                title: {
                    text: 'Electrical Energy Consumption (KW)',
                },
            },
            xaxis: {
                categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug", "Sep", "Oct", "Nov","Dec"],
            },
            title: {
                //text: "Stepline Chart",
                align: "left",
                style: {
                    fontWeight: 500,
                },
            },
            markers: {
                hover: {
                    sizeOffset: 4,
                },
            },
            colors: SteplineChartColors,
        };

        return (
            <React.Fragment>
                <ReactApexChart
                    options={options}
                    series={series}
                    type="line"
                    height={350}
                    className="apex-charts"
                />
            </React.Fragment>
        );
    };

    const BasicLoaderP3 = ({ dataColors }) => {
        var SteplineChartColors = getChartColorsArray(dataColors);
        const series = [
            {
                data: [30000, 31000, 30000, 31500,30000, 32000, 30500, 30000, 30000, 31000, 31000,30000],
            },
        ];
        const options = {
            stroke: {
                curve: "stepline",
            },
            dataLabels: {
                enabled: !1,
            },
            chart: {
                toolbar: {
                    show: false,
                }
            },
            yaxis: {
                title: {
                    text: 'Electrical Energy Consumption (KW)',
                },
            },
            xaxis: {
                categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug", "Sep", "Oct", "Nov","Dec"],
            },
            title: {
                //text: "Stepline Chart",
                align: "left",
                style: {
                    fontWeight: 500,
                },
            },
            markers: {
                hover: {
                    sizeOffset: 4,
                },
            },
            colors: SteplineChartColors,
        };

        return (
            <React.Fragment>
                <ReactApexChart
                    options={options}
                    series={series}
                    type="line"
                    height={350}
                    className="apex-charts"
                />
            </React.Fragment>
        );
    };

    const BasicLoaderP4 = ({ dataColors }) => {
        var SteplineChartColors = getChartColorsArray(dataColors);
        const series = [
            {
                data: [30000, 31000, 30000, 31500,30000, 32000, 30500, 30000, 30000, 31000, 31000,30000],
            },
        ];
        const options = {
            stroke: {
                curve: "stepline",
            },
            dataLabels: {
                enabled: !1,
            },
            chart: {
                toolbar: {
                    show: false,
                }
            },
            yaxis: {
                title: {
                    text: 'Electrical Energy Consumption (KW)',
                },
            },
            xaxis: {
                categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug", "Sep", "Oct", "Nov","Dec"],
            },
            title: {
                //text: "Stepline Chart",
                align: "left",
                style: {
                    fontWeight: 500,
                },
            },
            markers: {
                hover: {
                    sizeOffset: 4,
                },
            },
            colors: SteplineChartColors,
        };

        return (
            <React.Fragment>
                <ReactApexChart
                    options={options}
                    series={series}
                    type="line"
                    height={350}
                    className="apex-charts"
                />
            </React.Fragment>
        );
    };

    const BasicLoaderL1 = ({ dataColors }) => {
        var SteplineChartColors = getChartColorsArray(dataColors);
        const series = [
            {
                data: [30000, 31000, 30000, 31500,30000, 32000, 30500, 30000, 30000, 31000, 31000,30000],
            },
        ];
        const options = {
            stroke: {
                curve: "stepline",
            },
            dataLabels: {
                enabled: !1,
            },
            chart: {
                toolbar: {
                    show: false,
                }
            },
            yaxis: {
                title: {
                    text: 'Electrical Energy Consumption (KW)',
                },
            },
            xaxis: {
                categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug", "Sep", "Oct", "Nov","Dec"],
            },
            title: {
                //text: "Stepline Chart",
                align: "left",
                style: {
                    fontWeight: 500,
                },
            },
            markers: {
                hover: {
                    sizeOffset: 4,
                },
            },
            colors: SteplineChartColors,
        };

        return (
            <React.Fragment>
                <ReactApexChart
                    options={options}
                    series={series}
                    type="line"
                    height={350}
                    className="apex-charts"
                />
            </React.Fragment>
        );
    };

    const BasicLoaderL2 = ({ dataColors }) => {
        var SteplineChartColors = getChartColorsArray(dataColors);
        const series = [
            {
                data: [30000, 31000, 30000, 31500,30000, 32000, 30500, 30000, 30000, 31000, 31000,30000],
            },
        ];
        const options = {
            stroke: {
                curve: "stepline",
            },
            dataLabels: {
                enabled: !1,
            },
            chart: {
                toolbar: {
                    show: false,
                }
            },
            yaxis: {
                title: {
                    text: 'Electrical Energy Consumption (KW)',
                },
            },
            xaxis: {
                categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug", "Sep", "Oct", "Nov","Dec"],
            },
            title: {
                //text: "Stepline Chart",
                align: "left",
                style: {
                    fontWeight: 500,
                },
            },
            markers: {
                hover: {
                    sizeOffset: 4,
                },
            },
            colors: SteplineChartColors,
        };

        return (
            <React.Fragment>
                <ReactApexChart
                    options={options}
                    series={series}
                    type="line"
                    height={350}
                    className="apex-charts"
                />
            </React.Fragment>
        );
    };

    const BasicLoaderL3 = ({ dataColors }) => {
        var SteplineChartColors = getChartColorsArray(dataColors);
        const series = [
            {
                data: [30000, 31000, 30000, 31500,30000, 32000, 30500, 30000, 30000, 31000, 31000,30000],
            },
        ];
        const options = {
            stroke: {
                curve: "stepline",
            },
            dataLabels: {
                enabled: !1,
            },
            chart: {
                toolbar: {
                    show: false,
                }
            },
            yaxis: {
                title: {
                    text: 'Electrical Energy Consumption (KW)',
                },
            },
            xaxis: {
                categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug", "Sep", "Oct", "Nov","Dec"],
            },
            title: {
                //text: "Stepline Chart",
                align: "left",
                style: {
                    fontWeight: 500,
                },
            },
            markers: {
                hover: {
                    sizeOffset: 4,
                },
            },
            colors: SteplineChartColors,
        };

        return (
            <React.Fragment>
                <ReactApexChart
                    options={options}
                    series={series}
                    type="line"
                    height={350}
                    className="apex-charts"
                />
            </React.Fragment>
        );
    };

    const BasicLoaderL4 = ({ dataColors }) => {
        var SteplineChartColors = getChartColorsArray(dataColors);
        const series = [
            {
                data: [30000, 31000, 30000, 31500,30000, 32000, 30500, 30000, 30000, 31000, 31000,30000],
            },
        ];
        const options = {
            stroke: {
                curve: "stepline",
            },
            dataLabels: {
                enabled: !1,
            },
            chart: {
                toolbar: {
                    show: false,
                }
            },
            yaxis: {
                title: {
                    text: 'Electrical Energy Consumption (KW)',
                },
            },
            xaxis: {
                categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug", "Sep", "Oct", "Nov","Dec"],
            },
            title: {
                //text: "Stepline Chart",
                align: "left",
                style: {
                    fontWeight: 500,
                },
            },
            markers: {
                hover: {
                    sizeOffset: 4,
                },
            },
            colors: SteplineChartColors,
        };

        return (
            <React.Fragment>
                <ReactApexChart
                    options={options}
                    series={series}
                    type="line"
                    height={350}
                    className="apex-charts"
                />
            </React.Fragment>
        );
    };
    const [values, setValues] = useState([]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value || value.valueAsNumber,
        });

    };

    const status = [
        {
            options: [
                { label: "Jk Cement Panna ", value: "Jk Cement Panna " },
                { label: "Jk Cement Panipat", value: "Jk Cement Panipat" },
                { label: "Havells ", value: "Havells " },
                { label: "Shree Cement", value: "Shree Cement" },
                { label: "Birla Cement", value: "Birla Cement" },
            ],
        },
    ];

    document.title = "Power Consumption | EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Power Consumption" pageTitle="EPLMS" />
                    <Row>
                        <Col lg={12}>
                                        <Card id="customerList">
                                            <div className="card-body pt-4">
                                    
                                            <Col lg={4} className="mb-3">
                                                        <div>
                                                            <Label className="form-label" >Plant Name<span style={{ color: "red" }}>*</span></Label>
                                                            <Input
                                                                name="master_plant_id"
                                                                type="select"
                                                                className="form-select"
                                                                // value={values.trip_movement_type_code}
                                                                onChange={handleInputChange}
                                                                required
                                                            >
                                                                {status.map((item, key) => (
                                                                    <React.Fragment key={key}>
                                                                        <option value="" selected>Select Plant Name</option>
                                                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                    </React.Fragment>
                                                                ))}
                                                            </Input>
                                                        </div>
                                                    </Col>
                                            </div>
                                        </Card>
                                        <Row>
                                        <Col lg={12}>
                                        <Card className="shadow">
                                        <CardHeader className="bg-success-subtle fw-bold card-header text-uppercase">Actual Running Usage</CardHeader>
                                        <Card className="mt-3 shadow_light">
                                            <CardHeader className="bg-light fw-bold">Packer</CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "#c6e3f4" }}>
                                                                    <h4 className="card-title mb-0">Packer - 1</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                    <BasicPacker1 dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'/>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "rgb(147 244 231)" }}>
                                                                    <h4 className="card-title mb-0">Packer - 2</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                    <BasicPacker2 dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "rgb(244 207 147)" }}>
                                                                    <h4 className="card-title mb-0">Packer - 3</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                    <BasicPacker3 dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "rgb(244 157 147)" }}>
                                                                    <h4 className="card-title mb-0">Packer - 4</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                    <BasicPacker4 dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>

                                            <Card className="mt-3 shadow_light">
                                                <CardHeader className="bg-light fw-bold">Loader</CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "#c6e3f4" }}>
                                                                    <h4 className="card-title mb-0">Loader - 1</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                    <BasicLoader1 dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "rgb(147 244 231)" }}>
                                                                    <h4 className="card-title mb-0">Loader - 2</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                    <BasicLoader2 dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "rgb(244 207 147)" }}>
                                                                    <h4 className="card-title mb-0">Loader - 3</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                    <BasicLoader3 dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "rgb(244 157 147)" }}>
                                                                    <h4 className="card-title mb-0">Loader - 4</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                    <BasicLoader4 dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                            </Card>
                                            </Col>
                                            </Row>

                                            <Row>
                                        <Col lg={12}>
                                        <Card className="shadow">
                                        <CardHeader className="bg-success-subtle fw-bold card-header text-uppercase">Power Usage</CardHeader>
                                        <Card className="mt-3 shadow_light">
                                            <CardHeader className="bg-light fw-bold">Packer</CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "#c6e3f4" }}>
                                                                    <h4 className="card-title mb-0">Packer - 1</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                    <BasicLoaderP1 dataColors='["--vz-info"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "rgb(147 244 231)" }}>
                                                                    <h4 className="card-title mb-0">Packer - 2</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                <BasicLoaderP2 dataColors='["--vz-success"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "rgb(244 207 147)" }}>
                                                                    <h4 className="card-title mb-0">Packer - 3</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                    <BasicLoaderP3 dataColors='["--vz-warning"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "rgb(244 157 147)" }}>
                                                                    <h4 className="card-title mb-0">Packer - 4</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                <BasicLoaderP4 dataColors='["--vz-danger"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>

                                            <Card className="mt-3 shadow_light">
                                                <CardHeader className="bg-light fw-bold">Loader</CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "#c6e3f4" }}>
                                                                    <h4 className="card-title mb-0">Loader - 1</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                <BasicLoaderL1 dataColors='["--vz-info"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "rgb(147 244 231)" }}>
                                                                    <h4 className="card-title mb-0">Loader - 2</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                <BasicLoaderL2 dataColors='["--vz-success"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "rgb(244 207 147)" }}>
                                                                    <h4 className="card-title mb-0">Loader - 3</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                <BasicLoaderL3 dataColors='["--vz-warning"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        
                                                        <Col lg={3}>
                                                            <Card className="shadow_light">
                                                                <CardHeader style={{ background: "rgb(244 157 147)"}}>
                                                                    <h4 className="card-title mb-0">Loader - 4</h4>
                                                                </CardHeader>
                                                                <CardBody>
                                                                <BasicLoaderL4 dataColors='["--vz-danger"]' />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                            </Card>
                                            </Col>
                                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
            <ToastContainer closeButton={false} limit={1} />

        </React.Fragment>
    );
};

export default PackerLoaderCharts;
