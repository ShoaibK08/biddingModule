import React, { useState, useEffect }  from 'react';
import { Line,Bar,Pie,Doughnut,Polar,Radar} from "react-chartjs-2";
import ReactApexChart from "react-apexcharts";
import ReactEcharts from "echarts-for-react";
import getChartColorsArray from "../../../Components/Common/ChartsDynamicColor";
import axios from "axios";

const LineChart = ({dataColors}) => {  
    
    const [code, setCode] = useState('');
    const [month, setMonth] = useState('');
    const [Cancelled, setCancelled] = useState('');
    const [Rejected, setRejected] = useState('');

    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let code = obj.data._id;
        setCode(code);
        getForthGraphData();
    }, []);

    const getForthGraphData = () => {
        
        axios.get(`${process.env.REACT_APP_LOCAL_URL}/userModule/dashboard/getCancelledAndRejectedIndentCountsforGraph`)
            .then(res => {
                const allData = res;

                const monthName = (allData.cancelledIndentCounts).map((x) => x.monthName);
                const cancelledIndentCounts = (allData.cancelledIndentCounts).map((x) => x.cancelledIndentCounts);
                const rejectedIndentCount = (allData.rejectedIndentCount).map((x) => x.rejectedIndentCount);
                
                setMonth(monthName)
                setCancelled(cancelledIndentCounts);
                setRejected(rejectedIndentCount);
                
            })
    };


    var lineChartColor =  getChartColorsArray(dataColors);
    const data= {
        labels: month,
        datasets: [
            {
                label: "Cancelled Indents",
                fill: true,
                lineTension: 0.5,
                backgroundColor: lineChartColor[0],
                borderColor: lineChartColor[1],
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: lineChartColor[1],
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: lineChartColor[1],
                pointHoverBorderColor: "#fff",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: Cancelled
            },
            {
                label: "Rejected Indents",
                fill: true,
                lineTension: 0.5,
                backgroundColor: lineChartColor[2],
                borderColor: lineChartColor[3],
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: lineChartColor[3],
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: lineChartColor[3],
                pointHoverBorderColor: "#eef0f2",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: Rejected
            }
        ]
    }
    const option= {
        x: {
            ticks: {
                font: {
                    family: 'Poppins',
                },
            },
        },
        y: {
            ticks: {
                font: {
                    family: 'Poppins',
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        family: 'Poppins',
                    }
                }
            },
        },
    }
  return (
    <React.Fragment>
      <Line width={723} height={320} data={data} options={option} />
    </React.Fragment>
  )
}

//Bar Chart
const BarChart = ({dataColors}) => {  
    const [code, setCode] = useState('');
    const [month, setMonths] = useState('');
    const [count, setCount] = useState('');

    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let code = obj.data._id;
        setCode(code);
        getthirdGraphData();
    }, []);

    const getthirdGraphData = () => {
        
        axios.get(`${process.env.REACT_APP_LOCAL_URL}/userModule/dashboard/getDeliveredIndentCountsforGraph`)
            .then(res => {
                const allData = res;

                const monthName = (allData).map((x) => x.monthName);
                const deliveredIndentCounts = (allData).map((x) => x.deliveredIndentCounts);
                
                setMonths(monthName);
                setCount(deliveredIndentCounts);
                
            })
    };


    var barChartColor =  getChartColorsArray(dataColors);     
    const data = {
        labels: month,
        datasets: [
            {
                label: "Indents",
                backgroundColor: barChartColor[0],
                borderColor: barChartColor[0],
                borderWidth: 1,
                hoverBackgroundColor: barChartColor[1],
                hoverBorderColor: barChartColor[1],
                data: count
            }
        ]
    }
    const option = {
        x: {
            ticks: {
                font: {
                    family: 'Poppins',
                },
            },
        },
        y: {
            ticks: {
                font: {
                    family: 'Poppins',
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'Poppins',
                    }
                }
            },
        }
    }
  return (
    <React.Fragment>
      <Bar width={723} height={320} data={data} options={option} />
    </React.Fragment>
  )
}

//Basic
const Basic = ({ dataColors }) => {
    const [code, setCode] = useState('');
    const [TopCustomers, setTopCustomers] = useState('');
    const [TopCustomerCount, setTopCustomerCount] = useState('');

    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let code = obj.data._id;
        setCode(code);
        getSecondGraphData();
    }, []);

    const getSecondGraphData = () => {
        
        axios.get(`${process.env.REACT_APP_LOCAL_URL}/userModule/dashboard/getUserGraphData`)
            .then(res => {
                const allData = res;

                const userCode = (allData).map((x) => x.userCode);
                const indentCounts = (allData).map((x) => x.indentCounts);
                
                setTopCustomers(userCode);
                setTopCustomerCount(indentCounts);
                
            })
    };
    var BasicColors = getChartColorsArray(dataColors);
    const series = [{
        data: TopCustomerCount,
        name: 'Indent Placed',
    }];

    const options = {
        chart: {
            toolbar: {
                show: 1,
            }
        },
        plotOptions: {
            bar: {
                horizontal: !0,
            }
        },
        dataLabels: {
            enabled: !1
        },
        colors: BasicColors,
        grid: {
            borderColor: "#f1f1f1",
        },
        xaxis: {
            categories: TopCustomers,
        }
    };

    return (
        <React.Fragment>
            <ReactApexChart
                className="apex-charts"
                options={options}
                series={series}
                type="bar"
                height={368}

            />
        </React.Fragment>
    );
};

// //Pie Chart
// const PieChart = ({dataColors}) => { 
//     var pieChartColors =  getChartColorsArray(dataColors);    
//     const data={
//         labels: [
//             "Desktops",
//             "Tablets"
//         ],
//         datasets: [
//             {
//                 data: [300, 180],
//                 backgroundColor: pieChartColors,
//                 hoverBackgroundColor: pieChartColors,
//                 hoverBorderColor: "#fff"
//             }]
//     },
//     option= {
//         plugins: {
//             legend: {
//                 labels: {
//                     font: {
//                         family: 'Poppins',
//                     }
//                 }
//             },
//         }
//     }
//   return (
//     <React.Fragment>
//       <Pie width={723} height={320} data={data} options={option} />
//     </React.Fragment>
//   )
// }

//Pie Chart
const PieChart = ({ dataColors }) => {
    const [code, setCode] = useState('');
    const [transporterCounts, settransporterCounts] = useState('');
    const [customerCounts, setcustomerCounts] = useState('');
    const [soldToCounts, setsoldToCounts] = useState('');
    const [shipToCounts, setshipToCounts] = useState('');

    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let code = obj.data._id;
        setCode(code);
        getFifthGraphData();
    }, []);

    const getFifthGraphData = () => {
        
        axios.get(`${process.env.REACT_APP_LOCAL_URL}/userModule/dashboard/getPieChartData`)
            .then(res => {
                const allData = res;
                settransporterCounts(allData.transporterCounts);
                setcustomerCounts(allData.customerCounts);
                setsoldToCounts(allData.soldToCounts);
                setshipToCounts(allData.shipToCounts);
                
            })
    };



    var chartPieColors = getChartColorsArray(dataColors);
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: { //The style of the legend text
                color: '#858d98',
            },
        },
        color: chartPieColors,
        series: [{
            name: 'Indent Placed',
            type: 'pie',
            radius: '50%',
            data: [{
                value: parseInt(customerCounts),
                name: 'Customer'
            },
            {
                value: parseInt(soldToCounts),
                name: 'Sold To'
            },
            {
                value: parseInt(shipToCounts),
                name: 'Ship To'
            },
            {
                value: parseInt(transporterCounts),
                name: 'Transporter'
            }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }],
        textStyle: {
            fontFamily: 'Poppins, sans-serif'
        },
    };

    return (
        <React.Fragment>
            <ReactEcharts style={{ height: "350px" }} option={option} />
        </React.Fragment>
    )
}

//Donut Chart
const DonutChart = ({dataColors}) => {  
    var doughnutChartColors =  getChartColorsArray(dataColors);    
    const data = {
        labels: [
            "Desktops",
            "Tablets"
        ],
        datasets: [
            {
                data: [300, 210],
                backgroundColor: doughnutChartColors,
                hoverBackgroundColor: doughnutChartColors,
                hoverBorderColor: "#fff"
            }]
    },
    option = {
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'Poppins',
                    }
                }
            },
        }
    }
  return (
    <React.Fragment>
      <Doughnut width={723} height={320} data={data} options={option} />
    </React.Fragment>
  )
}

//Polar Chart
const PolarChart = ({dataColors}) => {  
    var polarAreaChartColors =  getChartColorsArray(dataColors);    
    const data = {
        labels: [
            "Series 1",
            "Series 2",
            "Series 3",
            "Series 4"
        ],
        datasets: [{
            data: [
                11,
                16,
                7,
                18
            ],
            backgroundColor: polarAreaChartColors,
            label: 'My dataset', // for legend
            hoverBorderColor: "#fff"
        }]
    }
    const option= {
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'Poppins',
                    }
                }
            },
        }
    }
  return (
    <React.Fragment>
      <Polar width={723} height={320} data={data} options={option} />
    </React.Fragment>
  )
}


//Radar Chart
const RadarChart = ({dataColors}) => {   
    var radarChartColors =  getChartColorsArray(dataColors);  
    const data = {
        labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
        datasets: [
            {
                label: "Desktops",
                backgroundColor: radarChartColors[0],
                borderColor: radarChartColors[1], //"#2ab57d",
                pointBackgroundColor: radarChartColors[1], //"#2ab57d",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: radarChartColors[1], //"#2ab57d",
                data: [65, 59, 90, 81, 56, 55, 40]
            },
            {
                label: "Tablets",
                backgroundColor: radarChartColors[2], //"rgba(81, 86, 190, 0.2)",
                borderColor: radarChartColors[3], //"#5156be",
                pointBackgroundColor: radarChartColors[3], //"#5156be",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: radarChartColors[3], //"#5156be",
                data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
    },
    option = {
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'Poppins',
                    }
                }
            },
        }
    }
  return (
    <React.Fragment>
      <Radar width={723} height={320} data={data} options={option} />
    </React.Fragment>
  )
}

export {LineChart,BarChart,PieChart,DonutChart,PolarChart,RadarChart,Basic}