import React, { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import CountUp from "react-countup";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from "dayjs";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Row,
  Table,
  Modal, ModalBody, ModalHeader
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import img6 from "../../../assets/images/companies/img-6.png";
import { jobCompanies } from "../../../common/data/appsJobs";
import Widgets from './Widgets';
import Loader from "../../../Components/Common/Loader";
import CollapsiblePanel from "../../../Components/Common/CollapsiblePanel";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import TableContainer from "../../../Components/Common/TableContainer";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

const CompaniesList = () => {
  document.title = "Gate In Dashboard | EPLMS";

  const [isExportCSV, setIsExportCSV] = useState(false);
  const [vehicleWaitingForGateInCounts, setVehicleWaitingForGateInCounts] = useState(0);
  const [vehicleGateInLastOneHourCounts, setVehicleGateInLastOneHourCounts] = useState(0);
  const [totalVehicleInsidePlantCounts, setTotalVehicleInsidePlantCounts] = useState(0);
  const [allStageByCode, setAllStageByCode] = useState([]);
  const [allVehicleDetail, setAllVehicleDetail] = useState([]);
  const [allVehicleDetail1, setAllVehicleDetail1] = useState([]);
  const [variable, setVariable] = useState(true);
  const [getStageCode, setStageCode] = useState("");
  const [latestData, setLatestData] = useState([]);
  const [cardHeader, setCardHeader] = useState('');
  const [plantCode, setPlantCode] = useState('');
  const [latestHeader, setLatestHeader] = useState('');
  const [CurrentDate, setCurrentDate] = useState('');
  const [FitnessExpiryDate, setFitnessExpiryDate] = useState('');
  const [PollutionExpiryDate, setPollutionExpiryDate] = useState('');
  const [InsuranceExpiryDate, setInsuranceExpiryDate] = useState('');
  const [DOData, setDOData] = useState([]);
  const [loader, setloader] = useState(false);
  const [loaderYard, setloaderYard] = useState(false);




  useEffect(() => {

    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    var date = new Date();
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantCode = obj.data.plantCode;
    setPlantCode(plantCode);

    getAllDeviceData();
    getAllStageByCode();

  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (getStageCode) {
        getAllDeviceData();
        getDataFromStageLocation(getStageCode);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [getStageCode]);


  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: process.env.REACT_APP_API_USER_NAME,
      password: process.env.REACT_APP_API_PASSWORD,
    },
  };

  const getAllDeviceData = async (e) => {
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;

    const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/gateInDashboard/getGateInDashboardCounts?plantCode=${plantcode}`, config)
      .then(res => {
        setTotalVehicleInsidePlantCounts(res.totalVehicleInsidePlantCounts);
        setVehicleGateInLastOneHourCounts(res.vehicleGateInLastOneHourCounts);
        setVehicleWaitingForGateInCounts(res.vehicleWaitingForGateInCounts);
      });
  }

  const getAllStageByCode = async (e) => {
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantCode = obj.data.plantCode;

    const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/stages/getAllStagesByCode?plantCode=${plantCode}`, config)
      .then(res => {
        console.log("res", res);
        setAllStageByCode(res);
      });
  }

  const acceptRejectVehicleData = async (vehNo, status, stageCode) => {


    const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/gateInDashboard/allowRejectForGateIn?vehicleNo=${vehNo}&flag=${status}&stageCode=${stageCode}&plantCode=${plantCode}`, config)
      .then(res => {
        //console.log(res.meta.message);
        //setTimeout(function(){
        if (res.errorMsg) {
          toast.error(res.errorMsg, { autoClose: 3000 });
        }
        else {
          if (res.meta.message === "VEHICLE_ALREADY_GATEIN") {
            toast.error("Vehicle Already Gate In", { autoClose: 3000 });
          }
          if (res.meta.message === "Vehicle GateIn Successfully") {
            toast.success("Vehicle Accepted Successfully", { autoClose: 3000 });
          }
          if (res.meta.message === "Vehicle Rejected Successfully") {
            if (status === 'A') {
              toast.success("Vehicle Accepted Successfully", { autoClose: 3000 });
            }
            if (status === 'R') {
              toast.success("Vehicle Rejected Successfully", { autoClose: 3000 });
            }
          }
          setCollapse(true);
        }

        // },1000);

      });
  }

  //Clear Hashmap
  const refreshVehicleData = async (e) => {
    const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/gateInDashboard/refreshHashMap`, config)
      .then(res => {
        const data = res;
        if (data) {
          toast.success("Data refreshed successfully.", { autoClose: 3000 });
          getDataFromStageLocation(getStageCode);

        }
        else {
          toast.error("Getting error while refreshing.", { autoClose: 3000 });
        }
      });
  }


  const [timeDifference, setTimeDifference] = useState(null);
  const [securityValue, setsecurityValue] = useState(null);

  const getDataFromStageLocation = async (code) => {

    setStageCode(code);
    const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/gateInDashboard/getTripDataByTagId?stageId=${code}&plantCode=${plantCode}`, config)
      .then(res => {
        setAllVehicleDetail1(res);
        setsecurityValue(res.securityValue);
        setDOData(res.consignmentForGI);

        const yardInDateString = res.yardIn;

        if (yardInDateString) {
          // Split the date string
          const dateParts = yardInDateString.match(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}:\d{2}:\d{2})$/);

          if (!dateParts) {
            console.error('Invalid date format');
          } else {
            const [, day, month, year, time] = dateParts;

            // Ensure that the values are numbers
            const numericDay = parseInt(day, 10);
            const numericMonth = parseInt(month, 10) - 1; // Adjust month to 0-based index
            const numericYear = parseInt(year, 10);

            // Parse the date string and create a Date object
            const yardInDate = new Date(numericYear, numericMonth, numericDay, ...time.split(":"));

            const currentDate = new Date();

            // Calculate the time difference in minutes considering the IST offset
            const istOffsetMinutes = -330; // UTC+5:30
            const differenceInMinutes = Math.floor((yardInDate.getTime() - currentDate.getTime() - currentDate.getTimezoneOffset() * 60 * 1000 + istOffsetMinutes * 60 * 1000) / (60 * 1000));

            console.log((differenceInMinutes * -1) - 1)

            const totalMinutes = (differenceInMinutes * -1) - res.securityValue;
            const totalMinutesAll = (differenceInMinutes * -1);

            // Calculate hours and minutes
            const cur_hours = Math.floor(totalMinutes / 60);
            const cur_minutes = totalMinutes % 60;
            const all_minutes = totalMinutesAll;
            setTimeDifference({
              cur_hours,
              cur_minutes,
              all_minutes
            });
          }
        }


        // Assuming res.fitnessExpiryDate is a string in the format "YYYY-MM-DD"
        const todaysDate = dayjs().startOf('day'); // Get today's date at the start of the day
        const fitnessExp_Date = dayjs(res.fitnessExpiryDate); // Parse the fitness expiry date
        const pollutionExp_Date = dayjs(res.pollutionExpiryDate);
        const insuranceExp_Date = dayjs(res.insuranceExpiryDate);

        setCurrentDate(todaysDate);
        setFitnessExpiryDate(fitnessExp_Date);
        setPollutionExpiryDate(pollutionExp_Date);
        setInsuranceExpiryDate(insuranceExp_Date);

        console.log(todaysDate.format("DD-MM-YYYY")); // Log today's date
        console.log(fitnessExp_Date.format("DD-MM-YYYY")); // Log fitness expiry date

        if (todaysDate.isAfter(fitnessExp_Date) || res.documentApproval === "Y") {
          setVariable(true);
        } else {
          setVariable(false);
        }
        if (res.vehicleNumber === undefined) {
          //toast.error("No Data Found", { autoClose: 3000 });
          // const res1 = axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getSequencingDetailsByVehicleNo?vehicleNo=${res.vehicleNumber}`)
          //   .then(res1 => {
          //     setAllVehicleDetail(res1);
          //   });
          setCollapse(false);
        } else {
          const res1 = axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getSequencingDetailsByVehicleNo?vehicleNo=${res.vehicleNumber}&plantCode=${plantCode}`, config)
            .then(res1 => {
              console.log("res 1", res1);
              setAllVehicleDetail(res1);
              setCollapse(false);
            });
        }

        //}        
      });
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
    latestData.forEach((row1) => {
      const blp = {};
      bl.forEach((rows2) => {
        const pl = rows2.split("$$$");
        if (pl[0] === 'status') {
          blp[pl[1]] = (row1[pl[0]] === 1 ? 'Active' : 'Deactive');
        } else if (pl[0] === 'quantity') {
          blp[pl[1]] = row1[pl[0]] + " " + row1["unitMeasurement"];
        }
        else if (pl[0] === 'yardIn' && row1[pl[0]].includes('T')) {
          blp[pl[1]] = row1[pl[0]].replace('T', ' ');
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
    const fileNames = {
      "1": 'vehicle_inside_plant.xlsx',
      "2": 'vehicle_gateIN_lastHour.xlsx',
      "3": 'vehicle_waiting_gateIN.xlsx',
    };
    fileNames[ModalNumber] && FileSaver.saveAs(blob, fileNames[ModalNumber]);

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
        Header: "Token Number",
        accessor: "tokenNumber",
        filterable: false,
      },
      {
        Header: "Vehicle Number",
        accessor: "vehicleNumber",
        filterable: false,
      },
      {
        Header: "IGP",
        accessor: "igpNumber",
        filterable: false,
      },
      {
        Header: "DO Number",
        accessor: "doNumber",
        filterable: false,
      },
      {
        Header: "GateIn Time",
        accessor: "gateIn",
        filterable: false,
        Cell: (cellProps) => {
          return (
            <span >{cellProps.row.original.gateIn && (cellProps.row.original.gateIn).includes("T") ? (cellProps.row.original.gateIn).replace("T", " ") : cellProps.row.original.gateIn}</span>
          );
        },
      },
      {
        Header: "Material Code",
        accessor: "materialType",
        filterable: false,
      },
      {
        Header: "Material Name",
        accessor: "materialTypeCode",
        filterable: false,
      },
      {
        Header: "Plant Code",
        accessor: "plantCode",
        filterable: false,
      },
      {
        Header: "Unit Code",
        accessor: "unitCode",
        filterable: false,
      },
      // {
      //   Header: "Company Code",
      //   accessor: "companyCode",
      //   filterable: false,
      // },
      // {
      //   Header: "Material Type",
      //   accessor: "materialType",
      //   filterable: false,
      // },
      // {
      //   Header: "Location",
      //   accessor: "mapPlantStageLocation",
      //   filterable: false,
      // },
      // {
      //   Header: "Yard In",
      //   accessor: "yardIn",
      //   Cell: (cellProps) => {
      //     return (
      //       <span >{(cellProps.row.original.yardIn).includes("T") ? (cellProps.row.original.yardIn).split("T")[0] : cellProps.row.original.yardIn}</span>
      //     );
      //   },
      // },
      // {
      //   Header: "Plant Code",
      //   accessor: "plantCode",
      //   filterable: false,
      // },
      // {
      //   Header: "Seal Number",
      //   accessor: "sealNumber",
      //   filterable: false,
      // },
      // {
      //   Header: "Trip Id",
      //   accessor: "tripId",
      //   filterable: false,
      // },
      // {
      //   Header: "Driver Id",
      //   accessor: "driverId",
      //   filterable: false,
      // },
    ],
  );


  const columnsDO = useMemo(
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
        Header: "DO Number",
        accessor: "diNumber",
        filterable: false,
      },
      {
        Header: "DO Qty.",
        accessor: "di_qty",
        filterable: false,
      },
      {
        Header: "DO Creation Date",
        accessor: "consignmentDate",
        filterable: false,
      },
      {
        Header: "Material Name",
        accessor: "material_Name",
        filterable: false,
      },
      {
        Header: "Material Code",
        accessor: "materialCode",
        filterable: false,
      },
      {
        Header: "IGP Number",
        accessor: "igpNumber",
        filterable: false,
      },
      {
        Header: "Transporter Name",
        accessor: "transporter_Name",
        filterable: false,
      },
    ],
  );

  const [documentModal, setDocumentModal] = useState(false);
  const [ModalNumber, setModalNumber] = useState(false);

  const setViewModal = () => {
    setDocumentModal(!documentModal);
  };

  const openModal = (data) => {
    if (data === "Total Vehicle Inside Plant") {
      getTotalVehicleInsidePlant();
      setCardHeader(data);
      setModalNumber("1");
    }
    else if (data === "Vehicle Gate In Last One Hour") {
      getTotalVehicleGateInLastOneHour();
      setCardHeader(data);
      setModalNumber("2");
    }
    else if (data === "Vehicles Waiting For Gate In") {
      getTotalVehicleWaitingForGatIn();
      setCardHeader(data);
      setModalNumber("3");
    }

    setViewModal();
  }

  const getTotalVehicleInsidePlant = async (e) => {
    setLatestData([]);
    setloader(true);
    const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/gateInDashboard/totalVehicle?plantCode=${plantCode}`, config)
      .then(res => {
        const data = res;
        setLatestData(data);
        setloader(false);
      });
  }

  const getTotalVehicleGateInLastOneHour = async (e) => {
    setLatestData([]);
    setloader(true);
    const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/gateInDashboard/totalVehicleLastOneHour?plantCode=${plantCode}`, config)
      .then(res => {
        const data = res;
        setLatestData(data);
        setloader(false);
      });
  }

  const getTotalVehicleWaitingForGatIn = async (e) => {
    setLatestData([]);
    setloader(true);
    const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/gateInDashboard/vehicleWaitingForGateIn?plantCode=${plantCode}`, config)
      .then(res => {
        const data = res;
        setLatestData(data);
        setloader(false);
      });
  }

  //Refresh card data
  const refreshData = async (cardHeader) => {
    if (cardHeader === "Total Vehicle Inside Plant") {
      setloaderYard(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/gateInDashboard/totalVehicle?plantCode=${plantCode}`, config)
          .then(res => {
            const data = res;
            setLatestData(data);
            setloaderYard(false);
          });
      } catch (e) {
        toast.error(e, { autoClose: 3000 });
        setloaderYard(false); // Ensure loader is stopped even if there is an error
      }
    }
    if (cardHeader === "Vehicle Gate In Last One Hour") {
      setloaderYard(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/gateInDashboard/totalVehicleLastOneHour?plantCode=${plantCode}`, config)
          .then(res => {
            const data = res;
            setLatestData(data);
            setloaderYard(false);
      });
    } catch (e) {
      toast.error(e, { autoClose: 3000 });
      setloaderYard(false); // Ensure loader is stopped even if there is an error
    }
  }
  if (cardHeader === "Vehicles Waiting For Gate In") {
    setloaderYard(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/gateInDashboard/vehicleWaitingForGateIn?plantCode=${plantCode}`, config)
      .then(res => {
        const data = res;
        setLatestData(data);
        setloaderYard(false);
      });
    } catch (e) {
      toast.error(e, { autoClose: 3000 });
      setloaderYard(false); // Ensure loader is stopped even if there is an error
    }
  }
}

const taskWidgets1 = [
  {
    id: 1,
    label: "Total Vehicle Inside Plant",
    counter: totalVehicleInsidePlantCounts,
    badge: "ri-arrow-up-line",
    badgeClass: "text-success",
    percentage: "17.32 %",
    icon: "ri-ticket-2-line",
    iconClass: "success",
    decimals: 1,
    prefix: "",
    suffix: "",
  },
  {
    id: 2,
    label: "Vehicle Gate In Last One Hour",
    counter: vehicleGateInLastOneHourCounts,
    badge: "ri-arrow-down-line",
    badgeClass: "text-warning",
    percentage: "",
    icon: "ri-ticket-2-line",
    iconClass: "warning",
    decimals: 1,
    prefix: "",
    suffix: "",
  },

  {
    id: 2,
    label: "Vehicles Waiting For Gate In",
    counter: vehicleWaitingForGateInCounts,
    badge: "ri-arrow-up-line",
    badgeClass: "text-info",
    percentage: "0.87 %",
    icon: "ri-ticket-2-line",
    iconClass: "info",
    decimals: 1,
    prefix: "",
    suffix: "",
  },
];


const text =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit.Nihil earum illo ipsa velit facilis provident qui eligendi, quia ut magnam tenetur. Accusantium nisi quos delectus in necessitatibus ad. Ducimus, id!";
const [collapse, setCollapse] = useState(true);
const [title, setTitle] = useState("Expand All");
const [icon, setIcon] = useState("las la-angle-up");
const collapseAll = () => {
  setCollapse(!collapse);
  setIcon(state => {
    return state === "las la-angle-up"
      ? "las la-angle-down"
      : "las la-angle-up";
  });
  setTitle(state => {
    return state === "Expand All" ? "Collapse All" : "Expand All";
  });
};


return (
  <React.Fragment>
    <div className="page-content">
      <Container fluid className="container-fluid">
        <BreadCrumb title={latestHeader} pageTitle="Dashboard" />
        <Row>
          {taskWidgets1.map((item, key) => (
            <Col xxl={4} sm={4} key={key}>
              <Card className="card-animate">
                <CardBody className="shadow rounded hover_css" onClick={() => { openModal(item.label) }}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="fw-bold text-muted mb-0">{item.label}</p>
                      <h2 className="mt-4 ff-secondary fw-semibold">
                        <span className={item.badgeClass + " counter-value"}>
                          <CountUp
                            start={0}
                            end={item.counter}
                            decimal={item.decimals}
                            suffix={item.suffix}
                            duration={3}
                          />
                        </span>
                      </h2>
                    </div>
                    <div>
                      <div className="avatar-sm flex-shrink-0">
                        <span className={"avatar-title rounded-circle fs-4 bg-soft-" + item.iconClass + " text-" + item.iconClass}>
                          <i className={item.icon}></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
          <Col xxl={12}>
            <Card>
              <CardBody className="shadow_light rounded">
                <Form>
                  <Row className="">

                    {/*<Col xxl={5} sm={6}>
                        <div className="search-box">
                          <Input
                            type="text"
                            className="form-control search bg-light border-light"
                            id="searchCompany"
                            placeholder="Search for company, industry type..."
                          />
                          <i className="ri-search-line search-icon"></i>
                        </div>
                      </Col>

                      <Col xxl={3} sm={6}>
                        <Flatpickr
                          className="form-control"
                          id="datepicker-publish-input"
                          placeholder="Select a date"
                          options={{
                            altInput: true,
                            altFormat: "F j, Y",
                            mode: "multiple",
                            dateFormat: "d.m.y",
                          }}
                        />
                      </Col>*/}

                    <Col xxl={5} sm={6}>
                      <div className="input-light">
                        <label>Select Gate In</label>
                        <br></br>
                        {allStageByCode.map((item, key) => (
                          <>
                            <Input type="radio" name="location_id" defaultValue={item.code} key={key} onClick={() => { getDataFromStageLocation(item.code) }} /> {item.name} &nbsp;&nbsp;&nbsp;
                          </>
                        ))}
                      </div>
                    </Col>

                    <Col xxl={2} sm={4}>

                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
            <CollapsiblePanel title="Vehicle Detail" collapse={collapse}>
              <Card id="company-overview">
                <CardBody>
                  {allVehicleDetail1.vehicleNumber === undefined ? "No Vehicle Data Found" :
                    <>
                      <div className="table-responsive table-card" style={{ width: "90%", float: "left" }}>
                        <Table className="table-borderless mb-4" >
                          <tbody>
                            <tr>
                              <td className="fw-semibold">Vehicle Number</td>
                              <td className="overview-industryType">
                                {allVehicleDetail1.vehicleNumber}
                              </td>
                              <td className="overview-industryType">
                                <p className="m-0" style={{ fontWeight: "bold" }}>
                                  &nbsp;&nbsp;&nbsp;Vehicle reporting time: <span style={{ animation: "blink 1s infinite", color: "green" }}>{`${securityValue} minutes`}</span>
                                </p>
                              </td>
                            </tr><tr>
                              <td className="fw-semibold">Vehicle Tag</td>
                              <td className="overview-industryType">
                                {allVehicleDetail1.tagId}
                              </td>
                              <td className="overview-industryType">
                                {(timeDifference.all_minutes > securityValue) && (
                                  <p className="m-0" style={{ color: "red", fontWeight: "bold" }}><span>*</span>&nbsp;
                                    Vehicle reported with delay: {timeDifference.cur_hours} hours, {timeDifference.cur_minutes} minutes
                                  </p>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-semibold">Driver Name</td>
                              <td className="overview-company_location">
                                {allVehicleDetail1.driverName ? allVehicleDetail1.driverName : "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-semibold">Quantity</td>
                              <td className="overview-employee">{allVehicleDetail1.quantity}</td>
                            </tr>
                            {/* <tr>
                                <td className="fw-semibold">Is Number Plate Visible ?</td>
                                <td className="overview-vacancy">
                                  <button
                                    type="button"
                                    className="toggle-button-custom"
                                  >
                                    <i className="bx bx-check align-bottom"></i>

                                  </button></td>
                              </tr> */}
                            <tr>
                              <td className="fw-semibold">Pollution Expiry Date</td>
                              <td className="overview-email" style={{ fontWeight: "bold", color: (CurrentDate.isAfter(PollutionExpiryDate) ? "red" : "green") }}>{PollutionExpiryDate.format("DD-MM-YYYY")}
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-semibold">Insurance Expiry Date</td>
                              <td className="overview-email" style={{ fontWeight: "bold", color: (CurrentDate.isAfter(InsuranceExpiryDate) ? "red" : "green") }}>{InsuranceExpiryDate.format("DD-MM-YYYY")}
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-semibold">Fitness Expiry Date</td>
                              <td className="overview-email" style={{ fontWeight: "bold", color: (CurrentDate.isAfter(FitnessExpiryDate) ? "red" : "green") }}>{FitnessExpiryDate.format("DD-MM-YYYY")}
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-semibold">Loading Type</td>
                              <td className="overview-since">{allVehicleDetail1.loadingType === 'A' ? 'Auto' : "Manual"}</td>
                            </tr>
                            {/* <tr>
                              <td className="fw-semibold">Material</td>
                              <td className="overview-since">{allVehicleDetail.materialName}</td>
                            </tr> */}
                            <tr>
                              <td className="fw-semibold">Movement</td>
                              <td className="overview-since">{allVehicleDetail1.movement === "OB" ? "Outbound" : "Inbound"}</td>
                            </tr>
                          </tbody>
                        </Table>
                        {/* 
                          <Row
                            className="g-0 justify-content-right mb-4"
                            id="pagination-element"
                            style={{ width: "40% !important" }}
                          >
                            <Col sm="6">
                              <div className="pagination-block pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">

                                <div className="page-item">
                                  <NavLink to="" style={{ pointerEvents: (variable === true ? "none" : "cursor") }} aria-disabled={variable} onClick={() => { acceptRejectVehicleData(allVehicleDetail1.vehicleNumber, 'A', getStageCode); }} className={`page-link ${variable ? "button-green-light" : "button-green"}`} id="page-prev">
                                    Allow
                                  </NavLink>
                                </div>
                                <span id="page-num" className="pagination"></span>
                                <div className="page-item">
                                  <NavLink to="" onClick={() => { acceptRejectVehicleData(allVehicleDetail1.vehicleNumber, 'R', getStageCode); }} className="button-red page-link" id="page-next">
                                    Reject
                                  </NavLink>
                                </div>
                              </div>
                            </Col>
                          </Row> */}
                      </div>
                      {/* <div className="page-item">
                          <NavLink to="" className="page-link button-green" onClick={() => { refreshVehicleData(allVehicleDetail1.locationId) }}>
                            Refresh
                          </NavLink>
                        </div> */}
                      <button type="button" title="Refresh" className="btn btn-success btn-sm btn btn-secondary float-end" onClick={() => { refreshVehicleData(allVehicleDetail1.locationId) }}><i className="ri-refresh-line"></i></button>
                    </>
                  }
                </CardBody>
              </Card>

            </CollapsiblePanel>
          </Col>
          <Col xxl={12}>

            <CollapsiblePanel title="DO Details" collapse={collapse}>
              <Card id="company-overview">
                <CardBody>
                  {/* {allVehicleDetail1.driverName === undefined ? "No Driver Data Found" :
                      <div className="table-responsive table-card table-c2" style={{ width: "70% !important" }}>
                        <Table className="table table-borderless mb-4">
                          <tbody>
                            <tr>
                              <td className="fw-semibold">Name</td>
                              <td className="overview-industryType">
                                {allVehicleDetail1.driverName}
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-semibold">Driver Id</td>
                              <td className="overview-company_location">
                                {allVehicleDetail1.driverId}
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-semibold">Idoc No.</td>
                              <td className="overview-employee">{allVehicleDetail1.idocNo}</td>
                            </tr>
                            <tr>
                              <td className="fw-semibold">Plant Code</td>
                              <td className="overview-vacancy">{allVehicleDetail1.plantCode}</td>
                            </tr>
                            <tr>
                              <td className="fw-semibold">Mobile No</td>
                              <td className="overview-vacancy">{allVehicleDetail1.mobileNo}</td>
                            </tr>
                            <tr>
                              <td className="fw-semibold">License No.</td>
                              <td className="overview-vacancy">{allVehicleDetail1.licenseNo}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    } */}
                  <Row className="px-2">
                    <Col lg={12} className="bg-light p-3">
                      <div className="card-body p-0 m-0">
                        <div className="shadow m-0 p-3" style={{ borderRadius: "6px" }}>
                          {DOData && DOData.length ? (
                            <TableContainer
                              columns={columnsDO}
                              data={(DOData || [])}
                              isGlobalFilter={true}
                              isAddUserList={false}
                              customPageSize={5}
                              isGlobalSearch={true}
                              className="custom-header-css"
                              //isCustomerFilter={true}
                              SearchPlaceholder='Search for Order Type...'
                              divClass="overflow-auto"
                            />
                          ) : (<span>No Data.</span>)
                          }
                        </div>
                        <ToastContainer closeButton={false} limit={1} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </CollapsiblePanel>
          </Col>
          <Col xxl={12}>

            <CollapsiblePanel title="Material & Loading/Un-Loading Info" collapse={collapse}>
              <Card id="company-overview">
                <CardBody>
                  {allVehicleDetail1.vehicleNumber === undefined ? "No Material & Loading/Un-Loading Info Found" :
                    <div className="table-responsive table-card table-c3" style={{ width: "70% !important" }}>
                      <Table className="table table-borderless mb-4">
                        <tbody>
                          <tr>
                            <td className="fw-semibold">Material Name/Code</td>
                            <td className="overview-industryType">
                              {allVehicleDetail.material}
                            </td>
                          </tr>
                          {allVehicleDetail1.movement === "OB" ?
                            <><tr>
                              <td className="fw-semibold">Planned Packer</td>
                              <td className="overview-industryType">
                                {allVehicleDetail.plannedPacker}
                              </td>
                            </tr>
                              <tr>
                                <td className="fw-semibold">Planned Terminal</td>
                                <td className="overview-industryType">
                                  {allVehicleDetail.plannedTerminal}
                                </td>
                              </tr></>
                            : ""}
                          <tr>
                            <td className="fw-semibold">Queue Type</td>
                            <td className="overview-industryType">
                              {allVehicleDetail.queueType}
                            </td>
                          </tr>
                          {allVehicleDetail1.movement === "IB" ?
                            <>
                              <tr>
                                <td className="fw-semibold">Loading Point</td>
                                <td className="overview-company_location">
                                  {allVehicleDetail.loadingPoint}
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-semibold">Un-Loading Point</td>
                                <td className="overview-employee">{allVehicleDetail.unLoadingPoint}</td>
                              </tr></>
                            : ""}
                          {/* <tr>
                              <td className="fw-semibold">Grade</td>
                              <td className="overview-vacancy">{allVehicleDetail.grade}</td>
                            </tr>
                            <tr>
                              <td className="fw-semibold">Announcement</td>
                              <td className="overview-vacancy"><button
                                type="button"
                                className="toggle-button-custom"
                              >
                                <i className="bx bx-check align-bottom"></i>

                              </button></td>
                            </tr> */}
                        </tbody>
                      </Table>
                    </div>
                  }
                </CardBody>
              </Card>
            </CollapsiblePanel>
          </Col>
        </Row>
        <ToastContainer closeButton={false} limit={1} />
      </Container>
    </div>

    <Modal isOpen={documentModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="xl" toggle={setViewModal}>
      <ModalHeader toggle={setViewModal} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
        <h5 className="text-white fs-20">{cardHeader}</h5>
      </ModalHeader>
      <ModalBody>
        {!loader ? (
          <div className="product-content mt-0">
            <ExportCSVModal
              show={isExportCSV}
              onCloseClick={() => setIsExportCSV(false)}
              onDownloadClick={handleDownload}
              data={latestData}
            />
            {" "}
            <button style={{ float: "right" }} type="button" className="btn btn-info ms-3" title="Refresh Data" onClick={() => refreshData(cardHeader)}>
              <i className="ri-refresh-line align-bottom me-1"></i>{" "}
            </button>
            <button style={{ float: "right" }} type="button" className="btn btn-info" title="Download Data" onClick={() => setIsExportCSV(true)}>
              <i className="ri-file-download-line align-bottom me-1"></i>
            </button>
            {loaderYard && <span style={{ color: "green", animation: "blink 1s infinite", position: 'absolute', right: '59px', top: '60px' }}>Fetching latest data...</span>}
            <TableContainer
              columns={columns}
              data={latestData}
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
        ) :
          <Loader></Loader>
        }
      </ModalBody>
    </Modal>
  </React.Fragment>
);
};

export default CompaniesList;
