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
import ReactEcharts from "echarts-for-react";
import * as echarts from 'echarts/core';
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";


const SalesAndDispatchOB = () => {


    // Outline Border Nav Tabs
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [dispatchSummary, setDispatchSummaryData] = useState({});
    const [PlantMovementSummaryData, setPlantMovementSummaryData] = useState([]);
    const [Yard_Detention, setYard_Detention] = useState([]);
    const [Tat_Trend, setTat_Trend] = useState([]);
    const [PackerData, setPackerData] = useState([]);
    const [LoaderData, setLoaderData] = useState([]);
    const [vehicalCount, setVehicalCount] = useState({});
    const [unplannedCount, setUnPlannedCount] = useState("");
    const [tableCountData, settableCountData] = useState([]);
    const [values, setValues] = useState([]);
    const [plantCode, setPlantCode] = useState([]);
    const [ClickedStageName, setClickedStageName] = useState("");

    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantCode = obj.data.plantCode;
        setPlantCode(plantCode);
        getDispatchSummaryData(plantCode);
        getPlantMovementSummary(plantCode);
        getYard_Detention(plantCode);
        getLoaderData(plantCode);
        getPackerData(plantCode);

        // const scrollDownInterval = setInterval(() => {
        //     window.scrollTo({
        //       top: document.documentElement.scrollTop + 600, // Adjust the value as needed
        //       behavior: 'smooth',
        //     });
        //   }, 10000); // Scroll down every 10 seconds

        //   const scrollUpInterval = setInterval(() => {
        //     window.scrollTo({
        //       top: document.documentElement.scrollTop - 600, // Adjust the value as needed
        //       behavior: 'smooth',
        //     });
        //   }, 20000); // Scroll up every 20 seconds (10 seconds delay + 10 seconds scroll down)

        //   // Clear intervals on component unmount
        //   return () => {
        //     clearInterval(scrollDownInterval);
        //     clearInterval(scrollUpInterval);
        //   };
    }, []);

    const refreshVehicleData = async (e) => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantCode = obj.data.plantCode;
        setPlantCode(plantCode);
        getDispatchSummaryData(plantCode);
        getPlantMovementSummary(plantCode);
        getYard_Detention(plantCode);
        getLoaderData(plantCode);
        getPackerData(plantCode);
        toast.success("Data refreshed successfully.", { autoClose: 3000 });
    }

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
            const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sales-dispatch-dashboard/getDispatchSummaryData/${plantCode}/OB`, config)
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

    const getPlantMovementSummary = async (plantCode) => {

        try {
            const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sales-dispatch-dashboard/getPlantMovementSummaryData/${plantCode}/OB`, config)
                .then(res => {
                    const data = res.message.plantMovement["#result-set-2"];
                    setPlantMovementSummaryData(data);
                    const data1 = res.message.vehicleCountingData;
                    setVehicalCount(data1);
                });
        }
        catch (e) {
            console.log(e);
        }
    }

    const getYard_Detention = async (plantCode) => {

        try {
            const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sales-dispatch-dashboard/getDashboardData/${plantCode}/OB`, config)
                .then(res => {
                    const data = res.message.yardDetention["#result-set-2"];
                    setYard_Detention(data);
                    const data1 = res.message.tatTrendMonthly["#result-set-2"];
                    setTat_Trend(data1 ? data1.slice(0, 5) : []);
                });
        }
        catch (e) {
            console.log(e);
        }

    }

    const getLoaderData = async (plantCode) => {
        try {
            var array1 = [];
            var array2 = [];
            await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sales-dispatch-dashboard/getLoaderData/${plantCode}/OB`, config)
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
            console.log(e);
        }


    }

    const getPackerData = async (plantCode) => {
        try {
            await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sales-dispatch-dashboard/getPackerData/${plantCode}/OB`, config)
                .then(res => {
                    const data = res.message["#result-set-2"];
                    setPackerData(data);
                });
        }
        catch (e) {
            console.log(e);
        }


    }

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

    const stageDetails = LoaderData.map(function (data, idx) {
        return ([
            <Col xl={2} lg={6} sm={6} key={idx} className="mt-2 mb-2">
                <div className="form-check card-radio">

                    <Label className="form-check-label shadow_light" htmlFor="shadow_light" style={{ paddingRight: "1rem", cursor: "unset" }}>
                        <div >
                            <Card className="mb-1 ribbon-box ribbon-fill ribbon-sm shadow_light">
                                <div className={`ribbon  element ${data.packer_loader_status === "A" ? "ribbon-primary" : data.status === "A" ? "ribbon-success" : "ribbon-danger"}`}> <i className="ri-truck-line" ></i> </div>
                                <CardBody style={{ padding: "10px 0px 5px 0", textAlign: "center" }}>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="fs-14 mb-1">{data.name} <span style={{ float: "right", borderLeft: "solid 1px #ccc", marginRight: "10px", paddingLeft: "4px", fontWeight: "bold" }}>{data.vehicle_number ? data.vehicle_number : "0"}</span></h6>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </Label></div>
            </Col>
        ]);
    });

    const [documentModal, setDocumentModal] = useState(false);

    const setViewModal = () => {
        setDocumentModal(!documentModal);
    };

    const formatDate = (inputDate) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = new Date(inputDate).toLocaleDateString('en-US', options);
        return formattedDate;
    };

    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });


    const RotateLable = ({ dataColors }) => {
        var chartColumnDistributedColors = getChartColorsArray(dataColors);
        const series = [{
            name: 'Number Of Vehicles',
            data: Yard_Detention.map(item => item.vehicle_count)
        }];
        var options = {
            // annotations: {
            //     points: [{
            //         x: 'Inflation',
            //         seriesIndex: 0,
            //         label: {
            //             borderColor: '#775DD0',
            //             offsetY: 0,
            //             style: {
            //                 color: '#fff',
            //                 background: '#775DD0',
            //             },
            //             //text: 'Bananas are good',
            //         }
            //     }]
            // },
            // chart: {
            //     height: 250,
            //     type: 'bar',
            //     toolbar: {
            //         show: false,
            //     }
            // },
            // colors: chartColumnDistributedColors,
            // plotOptions: {
            //     bar: {
            //         // borderRadius: 10,
            //         columnWidth: '35%',
            //     }
            // },
            // dataLabels: {
            //     enabled: true,
            //     offsetY: -20,
            //     style: {
            //         fontSize: "12px",
            //         colors: ["#fff"],
            //     },
            // },
            // stroke: {
            //     width: 2
            // },
            chart: {
                height: 350,
                type: 'bar',
                events: {
                    click: function (chart, w, e) {
                    }
                },
                toolbar: {
                    show: false,
                }
            },
            colors: chartColumnDistributedColors,
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    distributed: true,
                }
            },
            dataLabels: {
                enabled: true
            },
            legend: {
                show: false
            },
            xaxis: {
                labels: {
                    rotate: -45
                },
                categories: Yard_Detention.map(item => item.time),
                title: {
                    text: 'Hours',  //To remove series type text
                },
                // tickPlacement: 'on'
            },
            yaxis: {
                title: {
                    text: 'Number Of Vehicles',
                },
            },
        };

        return <ReactApexChart className="apex-charts" series={series} options={options} type="bar" height={250} />;
    };



    const RotateLablea = ({ dataColors }) => {
        var chartColumnRotateLabelsColors = getChartColorsArray(dataColors);
        const series = [{
            name: 'Dispatch Qty (MT)',
            data: PackerData.map(item => item.di_qty),
        }];
        var options = {
            chart: {
                height: 350,
                type: 'bar',
                events: {
                    click: function (chart, w, e) {
                    }
                },
                toolbar: {
                    show: false,
                }
            },
            colors: chartColumnRotateLabelsColors,
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    distributed: true,
                }
            },
            dataLabels: {
                enabled: true
            },
            legend: {
                show: false
            },
            xaxis: {
                labels: {
                    rotate: -45
                },
                categories: PackerData.map(item => item.name),
                title: {
                    text: 'Packer',  //To remove series type text
                },
                // tickPlacement: 'on'
            },
            yaxis: {
                title: {
                    text: 'Dispatch Qty (MT)',
                },
            },
            crosshairs: {
                fill: {
                    type: "gradient",
                    gradient: {
                        colorFrom: "#D8E3F0",
                        colorTo: "#BED1E6",
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    },
                },
            },
            tooltip: {
                enabled: !0,
                offsetY: -35,
            },
        };

        return (
            <ReactApexChart className="apex-charts" options={options} series={series} type="bar" height={250} />
        );
    };


    const Basic = ({ dataColors }) => {
        var BasicColors = getChartColorsArray(dataColors);
        const series = [{
            data: Tat_Trend.map(item => item.vehicle_count),
            name: 'Number Of Vehicles',           //To remove series type text
        }];

        const options = {
            chart: {
                height: 350,
                type: 'bar',
                events: {
                    click: function (chart, w, e) {
                    }
                },
                toolbar: {
                    show: false,                   // To  show download options
                }
            },
            colors: BasicColors,
            plotOptions: {
                bar: {
                    horizontal: !0,
                    columnWidth: '45%',
                    distributed: true,
                }
            },
            dataLabels: {
                enabled: true
            },
            legend: {
                show: false
            },
            xaxis: {
                categories: Tat_Trend.map(item => item.date),
                title: {
                    text: 'No of Vehicles',  //To remove series type text
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
                    height={250}

                />
            </React.Fragment>
        );
    };


    // const HorizontalBarChart = ({ dataColors }) => {
    //     var chartBarLabelRotationColors = getChartColorsArray(dataColors);
    //     var option = {
    //         tooltip: {
    //             trigger: 'axis',
    //             axisPointer: {
    //                 type: 'shadow'
    //             }
    //         },
    //         legend: {
    //             textStyle: { //The style of the legend text
    //                 color: '#858d98',
    //             },
    //         },
    //         grid: {
    //             left: '0%',
    //             right: '4%',
    //             bottom: '0%',
    //             containLabel: true
    //         },
    //         xAxis: {
    //             type: 'value',
    //             boundaryGap: [0, 0.01],
    //             axisLine: {
    //                 lineStyle: {
    //                     color: '#858d98'
    //                 },
    //             },
    //             splitLine: {
    //                 lineStyle: {
    //                     color: "rgba(133, 141, 152, 0.1)"
    //                 }
    //             }
    //         },
    //         yAxis: {
    //             type: 'category',
    //             data: Tat_Trend.map(item => item.date),
    //             axisLine: {
    //                 lineStyle: {
    //                     color: '#858d98'
    //                 },
    //             },
    //             splitLine: {
    //                 lineStyle: {
    //                     color: "rgba(133, 141, 152, 0.1)"
    //                 }
    //             }
    //         },
    //         textStyle: {
    //             fontFamily: 'Poppins, sans-serif'
    //         },
    //         color: chartBarLabelRotationColors,
    //         series: [{
    //             name: 'Avg. Time',
    //             type: 'bar',
    //             data: Tat_Trend.map(item => item.avg_time),
    //         },
    //         {
    //             name: 'No of Vehicle',
    //             type: 'bar',
    //             data: Tat_Trend.map(item => item.vehicle_count),
    //         }
    //         ]
    //     };

    //     return (
    //         <React.Fragment>
    //             <ReactEcharts style={{ height: "250px" }} option={option} />
    //         </React.Fragment>
    //     )
    // }


    const HorizontalBarChart = ({ dataColors }) => {
        const chartOptions = {
            grid: {
                left: '5%',
                right: '10%',
                bottom: '5%',
                containLabel: true,
            },
            legend: {
                data: ['No of Vehicles', 'Avg. Time'],
                textStyle: { color: '#858d98' },
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: { color: '#858d98' },
                },
                splitLine: {
                    lineStyle: { color: 'rgba(133, 141, 152, 0.1)' },
                },
            },
            yAxis: {
                type: 'category',
                data: Tat_Trend.map((item) => item.date),
                axisLine: {
                    lineStyle: { color: '#858d98' },
                },
                axisTick: { show: false },
            },
            series: [
                {
                    name: 'No of Vehicles',
                    type: 'bar',
                    data: Tat_Trend.map((item) => item.vehicle_count),
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{c}', // Display the vehicle count
                        color: '#fff',
                        fontWeight: 'bold',
                    },
                    itemStyle: {
                        color: '#50a353',
                    },
                },
                {
                    name: 'Avg. Time',
                    type: 'bar',
                    data: Tat_Trend.map((item) => item.vehicle_count), // Align to bar positions
                    label: {
                        show: true,
                        position: 'right',
                        formatter: (params) => Tat_Trend[params.dataIndex].avg_time, // Display avg_time
                        color: '#000',
                        fontWeight: 'bold',
                    },
                    barWidth: 0, // Hide bars for this series
                },
            ],
        };

        return (
            <div>
                <ReactEcharts style={{ height: '250px' }} option={chartOptions} />
            </div>
        );
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
            // {
            //     Header: 'Sr No.',
            //     accessor: (_, index) => tableCountData.length - index, // Calculate index in reverse
            //     disableFilters: true,
            // },
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
                Header: "Material",
                accessor: "materialType_code",
                filterable: false,
            },
            {
                Header: "IGP No",
                accessor: "igpNumber",
                filterable: false,
            },
            {
                Header: "Yard IN Date",
                accessor: "yardIn",
                filterable: false,
            },
            {
                Header: "Yard OUT Date",
                accessor: "yardOut",
                filterable: false,
            },
            {
                Header: "Highway Yard Date",
                accessor: "additional_yard",
                filterable: false,
            },
            {
                Header: "Inner YardIN Date",
                accessor: "inner_yard_IN",
                filterable: false,
            },
            {
                Header: "Inner YardOUT Date",
                accessor: "inner_Yard_Out",
                filterable: false,
            },
            {
                Header: "Gate IN Date",
                accessor: "gateIn",
                filterable: false,
            },
            {
                Header: "Tare Weight Date",
                accessor: "tareWeight",
                filterable: false,
            },
            {
                Header: "Gross Weight Date",
                accessor: "grossWeight",
                filterable: false,
            },
            // {
            //     Header: "DI Number",
            //     accessor: "diNumber",
            //     filterable: false,
            // },
            // {
            //     Header: "DI Qty",
            //     accessor: "diQuantity",
            //     filterable: false,
            // },

        ],
    );

    const triggerCountData = async (stageName) => {
        debugger;
        setClickedStageName(stageName);
        try {
            const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sales-dispatch-dashboard/getPlantMovementSummaryData?plant_code=${plantCode}&stage_code=${stageName}&Movement=OB`, config)
                .then(res => {
                    const data = res.message;
                    if (data) {
                        settableCountData(data);
                    }
                    else {
                        settableCountData([]);
                    }

                });
        }
        catch (e) {
            console.log(e);
        }
        setViewModal();
    }

    const handleDownload = async (e) => {
        e.preventDefault();
        downloadCSV();
        setIsExportCSV(false)
    };

    const downloadCSV = () => {
        const bl = [];
        columns.forEach((row) => {
            if (row.accessor !== undefined && row.accessor !== 'id') {
                bl.push(row.accessor + "$$$" + row.Header);
            }
        });
        const bla = [];
        tableCountData.forEach((row1) => {
            const blp = {};
            bl.forEach((rows2) => {
                const pl = rows2.split("$$$");
                if (pl[0] === 'status') {
                    blp[pl[1]] = (row1[pl[0]] === 1 ? 'Active' : 'Deactive');
                } else if (pl[0] === 'quantity') {
                    blp[pl[1]] = row1[pl[0]] + " " + row1["unitMeasurement"];
                } else {
                    blp[pl[1]] = row1[pl[0]];
                }
            });
            bla.push(blp);
        });
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        // Convert the data to a worksheet
        const ws = XLSX.utils.json_to_sheet(bla, { header: Object.keys(bla[0]) });
        // Apply styling to the header row
        ws["!cols"] = [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }]; // Example: Set column widths
        // ws["A1"].s = { // Style for the header cell A1
        //     fill: {
        //         fgColor: { rgb: "FFFF00" } // Yellow background color
        //     },
        //     font: {
        //         bold: true,
        //         color: { rgb: "000000" } // Black font color
        //     }
        // };
        // Add more styling options as needed

        // Add the worksheet to the workbook

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Generate an XLSX file
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Convert binary string to Blob
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        // Save the Blob as a file using FileSaver
        FileSaver.saveAs(blob, `${ClickedStageName}.xlsx`);

        // Utility function to convert a string to an ArrayBuffer
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buf;
        }
    };





    document.title = "Plant 360 Dashboard-OB";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Plant 360 Dashboard-OB" pageTitle="Dashboard" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList  ">
                                <button type="button" title="Refresh" className="btn btn-primary btn-sm btn btn-secondary float-end mt-1" onClick={() => { refreshVehicleData() }} style={{ position: "absolute", right: "17px", top: "7px" }}><i className="ri-refresh-line"></i></button>
                                <div className="card-body" style={{ paddingTop: "50px" }}>
                                    <Row className="g-3">
                                        <Col xl={8}>
                                            <Card id="customerList">

                                                <CardHeader className="mb-0 fw-bold bg-primary fs-16 shadow_light text-white" style={{ float: "left" }}>Dispatch Summary</CardHeader>
                                                <div className=" pt-0">
                                                    <div className="table-responsive">
                                                        <Table className="align-middle table-nowrap table-bordered mb-0" style={{ textAlign: 'center' }}>
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
                                                                    <td>{dispatchSummary && dispatchSummary.monthly_achived_target !== null ? parseFloat(dispatchSummary.monthly_achived_target).toFixed(2) : "0"}</td>
                                                                    <td>{dispatchSummary && dispatchSummary.monthly_balance !== null ? parseFloat(dispatchSummary.monthly_balance).toFixed(2) : "0"}</td>
                                                                    <td>0</td>
                                                                    <td>0</td>
                                                                    <td>0</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>{dispatchSummary ? `Today (${formatDate(dispatchSummary.date)})` : "- -"}</td>
                                                                    <td>{dispatchSummary ? parseFloat(dispatchSummary.today_target).toFixed(2) : "0"}</td>
                                                                    <td>{dispatchSummary && dispatchSummary.today_achieve_target !== null ? parseFloat(dispatchSummary.today_achieve_target).toFixed(2) : "0"}</td>
                                                                    <td>{dispatchSummary && dispatchSummary.today_balance !== null ? parseFloat(dispatchSummary.today_balance).toFixed(2) : "0"}</td>
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
                                            <Card className="shadow_light bg-light" style={{ pointerEvents: "none", height: '90%' }}>
                                                <CardHeader className="mb-0 fw-bold bg-primary fs-16 shadow_light text-white">Current Month TGT</CardHeader>
                                                <CardBody >
                                                    <div className="text-center">
                                                        <img src={target} alt="" height="45" />
                                                    </div>
                                                    <div className="d-flex">
                                                        <div className="flex-grow-1 text-center mt-3">
                                                            <label>
                                                                <h6 className="mb-0 text-primary m">{"Road (OB)"}</h6>
                                                                <h6 className="m-1 ms-0 me-0">{dispatchSummary ? parseFloat(dispatchSummary.monthly_target).toFixed(2) : "0"} MT</h6>
                                                            </label>
                                                            <br />
                                                            <label className="mb-0">
                                                                <h6 className="mb-0 text-primary">{"Road (IB)"}</h6>
                                                                <h6 className="m-1 ms-0 me-0">0 MT</h6>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </CardBody>

                                            </Card>
                                        </Col>
                                        <Col xl={2}>
                                            <Card className="shadow_light bg-light" style={{ pointerEvents: "none", height: '90%' }}>
                                                <CardHeader className="mb-0 fw-bold bg-primary fs-16 shadow_light text-white">Vehicles in plant</CardHeader>
                                                <CardBody style={{ display: "ruby", alignItems: "center", justifyContent: "center" }}>
                                                    <div className="w-100 text-center">
                                                        <lord-icon src="https://cdn.lordicon.com/uetqnvvg.json" trigger="loop" colors="primary:#405189,secondary:#0ab39c" style={{ width: "43px", height: "43px", borderRadius: "50px", background: "aliceblue", zIndex: "9", border: "solid 2px #27c3bc", padding: "2px" }} ></lord-icon>
                                                    </div>
                                                    <div>
                                                        <span style={{ color: "darkgreen", fontSize: "clamp(12px, 4vw, 40px)" }}>{vehicalCount.vehicleCount}</span>
                                                        <span style={{ fontSize: "clamp(12px, 4vw, 32px)" }}>/</span>
                                                        <span style={{ color: "darkslateblue", fontSize: "clamp(12px, 4vw, 22px)" }}>{vehicalCount.totalVehicleCount}</span>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row className="g-3">
                                        <Col xl={12}>

                                            <Card id="customerList">
                                                <CardHeader className="mb-0 fw-bold bg-primary fs-16 shadow_light text-white" style={{ float: "left" }}>Plant Movement Summary</CardHeader>
                                                <div className=" pt-0">
                                                    <div className="table-responsive">
                                                        <Table className="align-middle table-nowrap table-bordered mb-0" style={{ textAlign: 'center' }}>
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Stage</th>
                                                                    {PlantMovementSummaryData.map((item, key) => (
                                                                        <React.Fragment key={key}>
                                                                            <th scope="col">{item.stage}</th>
                                                                        </React.Fragment>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>No. of Vehicle</td>
                                                                    {PlantMovementSummaryData.map((item, key) => (
                                                                        <React.Fragment key={key}>
                                                                            <th scope="col" onClick={() => { triggerCountData(item.stage) }} className="cursor-pointer bg-hover fw-bold text-primary text-decoration-underline">{item.vehicle_count}</th>
                                                                        </React.Fragment>
                                                                    ))}
                                                                </tr>
                                                                <tr>
                                                                    <td>Avg. Detention (HH:MM)</td>
                                                                    {PlantMovementSummaryData.map((item, key) => (
                                                                        <React.Fragment key={key}>
                                                                            <th scope="col">{item.avg_time ? item.avg_time : "- : -"}</th>
                                                                        </React.Fragment>
                                                                    ))}
                                                                </tr>
                                                            </tbody>

                                                        </Table>
                                                    </div>
                                                </div>
                                            </Card>

                                        </Col>
                                        {/* <Col xl={2}>
                                            <Card className="shadow_light bg-light" style={{ pointerEvents: "none", height: '89%' }}>
                                                <CardHeader className="mb-0 fw-bold bg-primary fs-16 shadow_light text-white">Vehicles in plant</CardHeader>
                                                <CardBody style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <div>
                                                        <span style={{ color: "darkgreen", fontSize: "clamp(12px, 4vw, 40px)" }}>{vehicalCount.vehicleCount}</span>
                                                        <span style={{ fontSize: "clamp(12px, 4vw, 32px)" }}>/</span>
                                                        <span style={{ color: "darkslateblue", fontSize: "clamp(12px, 4vw, 32px)" }}>{vehicalCount.totalVehicleCount}</span>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col> */}
                                    </Row>

                                    <Card className="mt-3 shadow_light">
                                        <CardHeader className="bg-primary fw-bold text-uppercase text-white"> Graph Data</CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col lg={4}>
                                                    <Card className="shadow_light">
                                                        <CardHeader style={{ background: "rgb(232 78 78)" }}>
                                                            <h4 className="card-title mb-0 text-capitalize border-light text-white">Yard Detention</h4>
                                                        </CardHeader>
                                                        <CardBody>
                                                            <RotateLable dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger"]' />
                                                        </CardBody>


                                                    </Card>
                                                </Col>
                                                <Col lg={4}>
                                                    <Card className="shadow_light">
                                                        <CardHeader style={{ background: "#4caf50ba" }}>
                                                            <h4 className="card-title mb-0 text-capitalize border-light text-white">TAT Trend / MTD</h4>
                                                        </CardHeader>
                                                        <div className="card-body">
                                                            <HorizontalBarChart dataColors='["--vz-primary", "--vz-success"]' />
                                                        </div>
                                                    </Card>
                                                </Col>
                                                <Col lg={4}>
                                                    <Card className="shadow_light">
                                                        <CardHeader style={{ background: "#009688" }}>
                                                            <h4 className="card-title mb-0 text-capitalize border-light text-white">Packer Utilization</h4>
                                                        </CardHeader>
                                                        <CardBody>
                                                            <RotateLablea dataColors='["--vz-primary", "--vz-success", "--vz-warning","--vz-danger", "--vz-info", "--vz-success", "--vz-primary", "--vz-dark", "--vz-secondary"]' />
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>






                                    <Card className="mt-3 shadow_light">
                                        <CardHeader className="mb-0 fw-bold bg-primary fs-16 shadow_light text-white" style={{ float: "left" }}>Loader Status</CardHeader>
                                        <CardBody>

                                            <Row className="g-3 m-2">
                                                {stageDetails}
                                                <Col xl={2} lg={6} sm={6} className="mt-2 mb-2">
                                                    <div className="form-check card-radio">

                                                        <Label className="form-check-label shadow_light" htmlFor="shadow_light" style={{ paddingRight: "1rem", cursor: "unset" }}>
                                                            <div >
                                                                <Card className="mb-1 ribbon-box ribbon-fill ribbon-sm shadow_light">
                                                                    <div className={`ribbon ribbon-warning element `}> <i className="ri-truck-line" ></i> </div>
                                                                    <CardBody style={{ padding: "10px 0px 5px 0", textAlign: "center" }}>
                                                                        <div className="flex-grow-1 ms-3">
                                                                            <h6 className="fs-14 mb-1">{"Unplanned"} <span style={{ float: "right", borderLeft: "solid 1px #ccc", marginRight: "10px", paddingLeft: "4px", fontWeight: "bold" }}>{unplannedCount}</span></h6>
                                                                        </div>
                                                                    </CardBody>
                                                                </Card>
                                                            </div>
                                                        </Label></div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </div>
                            </Card>
                        </Col>


                    </Row>
                </Container>
            </div>

            <Modal isOpen={documentModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="xl" toggle={setViewModal}>
                <ModalHeader toggle={setViewModal} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
                    <h5 className="text-white fs-20">{`${ClickedStageName} Details`}</h5>
                </ModalHeader>
                <ModalBody>
                    <div className="product-content mt-0">
                        <ExportCSVModal
                            show={isExportCSV}
                            onCloseClick={() => setIsExportCSV(false)}
                            onDownloadClick={handleDownload}
                            data={tableCountData}
                        />
                        {" "}
                        <button style={{ float: "right" }} type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                            <i className="ri-file-download-line align-bottom me-1"></i>
                        </button>
                        <TableContainer
                            columns={columns}
                            data={tableCountData}
                            isGlobalFilter={true}
                            isAddUserList={false}
                            customPageSize={5}
                            isGlobalSearch={true}
                            className="custom-header-css"
                            isCustomerFilter={false}
                            SearchPlaceholder='Search...'
                            divClass="overflow-auto"
                            tableClass="width-150"
                        />
                    </div>
                </ModalBody>
            </Modal>

            <ToastContainer closeButton={false} limit={1} />

        </React.Fragment>
    );
};

export default SalesAndDispatchOB;
