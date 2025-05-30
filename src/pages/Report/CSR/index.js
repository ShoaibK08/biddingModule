import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import '../CSR/Csr.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import PdfImg from "../../../assets/images/PdfImg.png";
import LoaderNew from "../../../Components/Common/Loader_new";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

const ReportCsr = () => {
  const [devices, setDevice] = useState([]);
  const [latestHeader, setLatestHeader] = useState('');
  const [plantCode, setPlantCode] = useState([]);
  const [unitCode, setUnitCode] = useState([]);
  const [modal, setModal] = useState(false);
  const [repushModal, setRepushModal] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [imageBase64Strings, setBase64Data] = useState([]);
  const [loader, setloader] = useState(false);
  const [ModalViewImage, setModalViewImage] = useState('');
  const [movementData, setMovementData] = useState(null);
  const [repushData, setRepushData] = useState([]);
  const [loadingParameter, setErrorParameter] = useState(false);
  const [loadingParameter1, setErrorParameter1] = useState(false);
  const [userEmail, setuserEmail] = useState('');

  useEffect(() => {
    debugger;
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    let unitcode = obj.data._id;
    setPlantCode(plantcode);
    setUnitCode(plantcode);
    setuserEmail(obj.data.email)
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

  const movementType = [
    {
      options: [
        { label: "Select Movement", value: "" },
        { label: "InBound", value: "IB" },
        { label: "OutBound", value: "OB" },
      ],
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovementData(value);
    getAllDeviceData(plantCode, value);
  };

  const getAllDeviceData = (plantCode, value) => {
    setloader(true);
    axios.get(`${process.env.REACT_APP_LOCAL_URL_REPORTS}/getReport/getCurrentStatusReport/${plantCode}/${value}`, config)
      .then(res => {
        const device = res.Data["#result-set-1"];
        setDevice(device.reverse());
        setloader(false);
      });
  }


  const refreshData = () => {
    getAllDeviceData(plantCode, movementData);
    //toast.success("Data Refreshed Successfully.", { autoClose: 3000 });
  }


  const handleDownload = async (e) => {
    e.preventDefault();
    downloadCSV();
    setIsExportCSV(false)
  };

  const downloadCSV = () => {
    const bl = [];
    let downloadData = movementData === 'IB' ? columnsIB : columnsOB;
    downloadData.forEach((row) => {
      if (row.accessor !== undefined && row.accessor !== 'id') {
        bl.push(row.accessor + "$$$" + row.Header);
      }
    });
    const bla = [];
    devices.forEach((row1) => {
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
    FileSaver.saveAs(blob, 'CSR.xlsx');

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



  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  const toggleRepush = useCallback(() => {
    if (repushModal) {
      setRepushModal(false);
    } else {
      setRepushModal(true);
    }
  }, [repushModal]);

  const toggleView = useCallback(() => {
    if (modalView) {
      setModalView(false);
    } else {
      setModalView(true);
    }
  }, [modalView]);

  const handleCustomerClick = (data, weightType) => {
    setloader(true);
    if (weightType === "TW" || weightType === "GW") {
      const values = {
        "weightType": weightType,
        "plantCode": data.plant_code,
        "vehicleNumber": data.trip_vehicleNumber,
        "igpNumber": data.trip_igpNumber
      };

      axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/transactionalLogs/getWBImages`, values, config)
        .then(res => {
          if (res.status === 404) {
            toast.error(res.data.error, { autoClose: 3000 });
            setloader(false);
          }
          else if (res.includes("No message")) {
            toast.error(res, { autoClose: 3000 });
            setloader(false);
          }
          else if (res.includes("I/O error")) {
            toast.error(res, { autoClose: 3000 });
            setloader(false);
          }
          else {
            setBase64Data(res); // Assuming the response contains base64 data 
            setloader(false);
            toggle();
          }
        })
        .catch(error => {
          toast.error(error, { autoClose: 3000 });
          setloader(false);
        });
    }
  };

  const openRepushModal = (data) => {
    setloader(true);
    //axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/transactionalLogs/getWBImages`, values, config)
    axios.get(`http://localhost:8081/uiInvoicing/vehicleData?plantCode=N205&vehicleNumber=${data}`, config)
      .then(res => {
        if (res && res.length === 0) {
          toast.error('No data found!', { autoClose: 3000 });
          setloader(false);
        }
        else {
          setloader(false);
          setRepushData(res);
          toggleRepush();
        }
      })
      .catch(error => {
        toast.error(error, { autoClose: 3000 });
        setloader(false);
      });
  }

  const handleRepushInvoice = (data) => {
    console.log("Re-pushing data:", data);
    setErrorParameter(true);
    const value = {
      "tripId": data.tripId
    }
    axios.post(`http://localhost:8081/manualInvoiceRequest/requestInvoice`, value, config)
      .then(res => {
        if (res.status === 404) {
          toast.error(res, { autoClose: 3000 });
          setErrorParameter(false);
          toggleRepush();
        }
        else {
          setErrorParameter(false);
          toggleRepush();
          toast.success('Invoice request sent successfully. Data will reflect in sometime..', { autoClose: 3000 });
          refreshData();
        }
      })
      .catch(error => {
        toast.error(error, { autoClose: 3000 });
        setErrorParameter(false);
        toggleRepush();
      });
  }

  const handleRepushInvoicePDF = (data) => {
    debugger;
    console.log("Re-pushing data:", data);
    setErrorParameter1(true);
    const value = {
      "invoiceNumber": data.invNo,
      "companyCode": unitCode,
      "plantCode": plantCode,
      "diNumber": data.diNumber,
      "tripId": data.tripId,
      "pgiNunmber": data.invNo,
      "vehicleNumber": data.vehicleNumber,
      "pgiCreatedDate": data.pgiLocalDate,
    }
    axios.post(`http://localhost:8081/invoice/saveInvoice`, value, config)
      .then(res => {
        if (res.meta.message === "Failed to process request") {
          toast.error(res.meta.message, { autoClose: 3000 });
          setErrorParameter1(false);
          toggleRepush();
        }
        else {
          setErrorParameter1(false);
          toggleRepush();
          toast.success('Request sent successfully. Data will reflect in sometime..', { autoClose: 3000 });
          refreshData();
        }
      })
      .catch(error => {
        toast.error(error, { autoClose: 3000 });
        setErrorParameter1(false);
        toggleRepush();
      });
  }

  const openImageInNewTab = (base64String) => {

    const imageSrc = `data:image/jpeg;base64,${base64String}`; // Update the MIME type if your images are of different types
    setModalViewImage(imageSrc);
    toggleView();
  };





  // Customers Column
  const columnsOB = useMemo(() => {
    const baseColumns = [
      {
        Header: '',
        accessor: 'id',
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        }
      },
      // {
      //   Header: 'Sr No.',
      //   accessor: (_, index) => devices.length - index, // Calculate index in reverse
      //   disableFilters: true,
      // },
      {
        Header: "Trip ID ",
        accessor: "trip_id",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.trip_priority_vehicle) {
            case "1":
              return <label style={{ background: "red", color: "white", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_id}</label>
            case "0":
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_id}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_id}</label>
          }
        }
      },
      {
        Header: "Movement",
        accessor: "mmv_movement_code",
        filterable: false,
      },
      // {
      //   Header: "Rsn No",
      //   accessor: "trip_regSerialNumber",
      //   filterable: false,
      // },
      {
        Header: "Vehicle No",
        accessor: "trip_vehicleNumber",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.trip_priority_vehicle) {
            case "1":
              return <label style={{ background: "red", color: "white", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_vehicleNumber}</label>
            case "0":
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_vehicleNumber}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_vehicleNumber}</label>
          }
        }
      },
      {
        Header: "IGP No.",
        accessor: "trip_igpNumber",
        filterable: false,
      },
      {
        Header: "Vehicle Type",
        accessor: "trip_vehicle_type",
        filterable: false,
      },
      {
        Header: "Transporter Name",
        accessor: "cd_transporter_name",
        filterable: false,
      },
      {
        Header: "Stage Name",
        accessor: "sm_stage_name",
        filterable: false,
      },
      {
        Header: "WeighBridge Code",
        accessor: "sm_stage_code",
        filterable: false,
      },
      {
        Header: "Yard In Date & Time",
        accessor: "trip_yardIn",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.YI) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardIn}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardIn}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardIn}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardIn}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_yardIn}</label>
          }
        }
      },
      {
        Header: "Yard Out Date & Time",
        accessor: "trip_yardOut",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.YO) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardOut}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardOut}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardOut}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardOut}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_yardOut}</label>
          }
        }
      },
      {
        Header: "Inner YardIN",
        accessor: "trip_inneryardIn",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.YI_IN) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardIn}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardIn}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardIn}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardIn}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_inneryardIn}</label>
          }
        }
      },
      {
        Header: "Inner YardOut",
        accessor: "trip_inneryardOut",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.YO_IN) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardOut}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardOut}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardOut}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardOut}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_inneryardOut}</label>
          }
        }
      },
      {
        Header: "Additional Yard",
        accessor: "trip_additionalYard",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.AD_YD) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_additionalYard}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_additionalYard}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_additionalYard}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_additionalYard}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_additionalYard}</label>
          }
        }
      },
      {
        Header: "Gate In Date & Time",
        accessor: "trip_gateIn",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.GI) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_gateIn}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_gateIn}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_gateIn}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_gateIn}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_gateIn}</label>
          }
        }
      },
      {
        Header: "Tare Weight ",
        accessor: "trip_tareweight",
        filterable: false,
      },
      {
        Header: "Tare Weight Date & Time",
        accessor: "trip_tareweight_time",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.T_W) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_tareweight_time}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_tareweight_time}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_tareweight_time}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_tareweight_time}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_tareweight_time}</label>
          }
        }
      }, {
        Header: "Gross Weight",
        accessor: "trip_grossWeight",
        filterable: false,
      },
      {
        Header: "Gross Weight Date & Time",
        accessor: "trip_grossWeight_time",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.G_W) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_grossWeight_time}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_grossWeight_time}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_grossWeight_time}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_grossWeight_time}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_grossWeight_time}</label>
          }
        }
      },
      {
        Header: "Net Weight",
        accessor: "trip_netweight",
        filterable: false,
      },
      {
        Header: "Packing In Date & Time",
        accessor: "trip_packingIn",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.PI) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_packingIn}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_packingIn}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_packingIn}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_packingIn}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_packingIn}</label>
          }
        }
      },
      {
        Header: "Packing Out Date & Time",
        accessor: "trip_packingOut",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.PO) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_packingOut}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_packingOut}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_packingOut}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_packingOut}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_packingOut}</label>
          }
        }
      },
      {
        Header: "SAP Tare Weight",
        accessor: "trip_sap_tareweight",
        filterable: false,
      },

      // {
      //   Header: "Challan Tare Weight",
      //   accessor: "cd_challan_tareweight",
      //   filterable: false,
      // },
      // {
      //   Header: "Challan Gross Weight",
      //   accessor: "cd_challan_grossweight",
      //   filterable: false,
      // },

      {
        Header: "Tag Number",
        accessor: "tag_tag_id",
        filterable: false,
      },
      {
        Header: "DI Number",
        accessor: "cd_di_number",
        filterable: false,
      },
      {
        Header: "DI Qty.",
        accessor: "cd_diqty",
        filterable: false,
      },
      {
        Header: "PGI No.",
        accessor: "cd_pgi_number",
        filterable: false,
      },
      {
        Header: "PGI Date & Time",
        accessor: "cd_pgi_datetime",
        filterable: false,
      },
      {
        Header: "PGI Qty.",
        accessor: "cd_pgi_qty",
        filterable: false,
      },
      // {
      //   Header: "No. Of Bags",
      //   accessor: "cd_noofbags",
      //   filterable: false,
      // },
      {
        Header: "Material Name",
        accessor: "mm_material_name",
        filterable: false,
      },
      {
        Header: "Material Code",
        accessor: "mm_material_code",
        filterable: false,
      },
      {
        Header: "Material Type",
        accessor: "mm_materialtypes_code",
        filterable: false,
      },
      {
        Header: "Order Type",
        accessor: "cd_order_type",
        filterable: false,
      },
      {
        Header: "Body Type",
        accessor: "trip_vehiclebody_type",
        filterable: false,
      },
      {
        Header: "Plant Name",
        accessor: "plant_name",
        filterable: false,
      },
      {
        Header: "Unit Code",
        accessor: "cd_unitCode",
        filterable: false,
      },
      {
        Header: "Trip Status",
        accessor: "trip_status",
        Cell: (cell) => {

          switch (cell.value) {
            case "A":
              return <span className="badge text-uppercase badge-soft-success"> Active </span>;
            case "D":
              return <span className="badge text-uppercase badge-soft-danger"> Deactive </span>;
            default:
              return <span className="badge text-uppercase badge-soft-info"> Active </span>;
          }
        }
      },
      {
        Header: "LR Pdf",
        Cell: (cellProps) => {
          const pdfData = cellProps.row.original.cd_lr_pdf;
          if (!pdfData) {
            return <span className="badge text-uppercase badge-soft-warning">No Data</span>;
          } else if (pdfData.includes("PDF Disable")) {
            return <span className="badge text-uppercase badge-soft-danger">Not Enabled</span>;
          } else {
            const urls = pdfData.split(',').map(url => url.trim());
            return (
              <ul className="list-inline hstack gap-2 mb-0">
                {urls.map((url, index) => (
                  <li key={index} className="list-inline-item edit" title="View PDF">
                    <Link
                      to="#"
                      className="text-primary d-inline-block edit-item-btn"
                      onClick={() => viewDocumentData(url)}
                    >
                      <img src={PdfImg} alt="" height="25" />
                    </Link>
                  </li>
                ))}
              </ul>
            );
          }
        },
      },
      {
        Header: "IGP Pdf",
        Cell: (cellProps) => {
          const pdfData = cellProps.row.original.trip_igp_pdf;
          if (!pdfData) {
            return <span className="badge text-uppercase badge-soft-warning">No Data</span>;
          } else if (pdfData.includes("PDF Disable")) {
            return <span className="badge text-uppercase badge-soft-danger">Not Enabled</span>;
          } else {
            const urls = pdfData.split(',').map(url => url.trim());
            return (
              <ul className="list-inline hstack gap-2 mb-0">
                {urls.map((url, index) => (
                  <li key={index} className="list-inline-item edit" title="View PDF">
                    <Link
                      to="#"
                      className="text-primary d-inline-block edit-item-btn"
                      onClick={() => viewDocumentData(url)}
                    >
                      <img src={PdfImg} alt="" height="25" />
                    </Link>
                  </li>
                ))}
              </ul>
            );
          }
        },
      },
      // {
      //   Header: "Invoicing ",
      //   Cell: (cellProps) => {
      //     return (
      //       cellProps.row.original.cd_invoice_pdf ?
      //         <ul className="list-inline hstack gap-2 mb-0">
      //           <li className="list-inline-item edit" title="View PDF">
      //             <Link
      //               to="#"
      //               className="text-primary d-inline-block edit-item-btn"
      //               onClick={() => { const url = cellProps.row.original.cd_invoice_pdf; viewDocumentData(url); }}
      //             >
      //               <img src={PdfImg} alt="" height="25" />
      //             </Link>
      //           </li>
      //         </ul>
      //         :
      //         <span className="badge text-uppercase badge-soft-danger"> No Data </span>


      //     );
      //   },
      // },
      // {
      //   Header: "Invoicing Pdf",
      //   Cell: (cellProps) => {
      //     return (
      //       cellProps.row.original.inbound_invoiceDirectory ?
      //         <ul className="list-inline hstack gap-2 mb-0">
      //           <li className="list-inline-item edit" title="View PDF">
      //             <Link
      //               to="#"
      //               className="text-primary d-inline-block edit-item-btn"
      //               onClick={() => { const url = cellProps.row.original.inbound_invoiceDirectory; viewDocumentData(url); }}
      //             >
      //               <img src={PdfImg} alt="" height="25" />
      //             </Link>
      //           </li>
      //         </ul>
      //         :
      //         <span className="badge text-uppercase badge-soft-danger"> No Data </span>


      //     );
      //   },
      // },
      {
        Header: "Invoicing Pdf",
        Cell: (cellProps) => {
          const pdfData = cellProps.row.original.cd_invoice_pdf;
          if (!pdfData) {
            return <span className="badge text-uppercase badge-soft-warning">No Data</span>;
          } else if (pdfData.includes("PDF Disable")) {
            return <span className="badge text-uppercase badge-soft-danger">Not Enabled</span>;
          } else {
            const urls = pdfData.split(',').map(url => url.trim());
            return (
              <ul className="list-inline hstack gap-2 mb-0">
                {urls.map((url, index) => (
                  <li key={index} className="list-inline-item edit" title="View PDF">
                    <Link
                      to="#"
                      className="text-primary d-inline-block edit-item-btn"
                      onClick={() => viewDocumentData(url)}
                    >
                      <img src={PdfImg} alt="" height="25" />
                    </Link>
                  </li>
                ))}
              </ul>
            );
          }
        },
      },
      {
        Header: "TW Image",
        Cell: (cellProps) => {
          return (
            cellProps.row.original.trip_tareweight ?
              <ul className="list-inline hstack gap-2 mb-0">
                <li className="list-inline-item" title="View Image">
                  <Link
                    to="#"
                    onClick={() => { const data = cellProps.row.original; handleCustomerClick(data, "TW"); }}
                    className="text-primary d-inline-block edit-item-btn" title="View Image" style={{ margin: '-3px 0px -3px 0px' }} >
                    <i className="ri-image-fill align-middle text-success" style={{ fontSize: "25px" }}></i>
                  </Link>
                </li>
              </ul> :
              <span className="badge text-uppercase badge-soft-danger"> No Data </span>
          );
        },
      },
      {
        Header: "GW Image",
        Cell: (cellProps) => {
          return (
            cellProps.row.original.trip_grossWeight ?
              <ul className="list-inline hstack gap-2 mb-0">
                <li className="list-inline-item edit" title="View Image">
                  <Link
                    to="#"
                    onClick={() => { const data = cellProps.row.original; handleCustomerClick(data, "GW"); }}
                    className="text-primary d-inline-block edit-item-btn" title="View Image" style={{ margin: '-3px 0px -3px 0px' }} >
                    <i className="ri-image-fill align-middle text-success" style={{ fontSize: "25px" }}></i>
                  </Link>
                </li>
              </ul> :
              <span className="badge text-uppercase badge-soft-danger"> No Data </span>
          );
        },
      }
    ];

    // Add "Invoice" column only if plantCode is "N205" and userEmail matches
    if (plantCode === "N205" && userEmail === "shubham.gupta@amzbizsol.in") {
      baseColumns.push({
        Header: "Invoice",
        Cell: (cellProps) => {
          const { sm_stage_name, cd_pgi_number, cd_invoice_pdf, trip_vehicleNumber } = cellProps.row.original;

          // Check if 'GW' is not included in sm_stage_name
          const isGWNotAvailable = !sm_stage_name.includes("GW");

          // Check if both PGI number and Invoice PDF are available
          const isAllDataAvailable = cd_pgi_number && cd_invoice_pdf;

          return (
            <button
              className="badge text-uppercase badge-soft-primary btn btn-sm border border-primary"
              title={isGWNotAvailable || isAllDataAvailable ? "" : "Click to generate invoice"}
              disabled={isGWNotAvailable || isAllDataAvailable}
              onClick={!isGWNotAvailable && !isAllDataAvailable ? () => openRepushModal(trip_vehicleNumber) : undefined}
            >
              Re-Push
            </button>
          );
        },
      });
    }

    return baseColumns;
  }, [plantCode]);

  const columnsIB = useMemo(
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
      //   Header: 'Sr No.',
      //   accessor: (_, index) => devices.length - index, // Calculate index in reverse
      //   disableFilters: true,
      // },
      {
        Header: "Trip ID ",
        accessor: "trip_id",
        filterable: false,
      },
      {
        Header: "Movement",
        accessor: "mmv_movement_code",
        filterable: false,
      },
      // {
      //   Header: "Rsn No",
      //   accessor: "trip_regSerialNumber",
      //   filterable: false,
      // },
      {
        Header: "Vehicle No",
        accessor: "trip_vehicleNumber",
        filterable: false,
      },
      {
        Header: "IGP No.",
        accessor: "trip_igpNumber",
        filterable: false,
      },
      {
        Header: "Vehicle Type",
        accessor: "trip_vehicle_type",
        filterable: false,
      },
      {
        Header: "Transporter Name",
        accessor: "cd_transporter_name",
        filterable: false,
      },
      {
        Header: "Stage Name",
        accessor: "sm_stage_name",
        filterable: false,
      },
      {
        Header: "WeighBridge Code",
        accessor: "sm_stage_code",
        filterable: false,
      },
      {
        Header: "Yard In Date & Time",
        accessor: "trip_yardIn",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.YI) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardIn}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardIn}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardIn}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardIn}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_yardIn}</label>
          }
        }
      },
      {
        Header: "Yard Out Date & Time",
        accessor: "trip_yardOut",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.YO) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardOut}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardOut}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardOut}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_yardOut}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_yardOut}</label>
          }
        }
      },
      {
        Header: "Inner YardIN",
        accessor: "trip_inneryardIn",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.YI_IN) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardIn}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardIn}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardIn}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardIn}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_inneryardIn}</label>
          }
        }
      },
      {
        Header: "Inner YardOut",
        accessor: "trip_inneryardOut",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.YO_IN) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardOut}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardOut}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardOut}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_inneryardOut}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_inneryardOut}</label>
          }
        }
      },
      {
        Header: "Additional Yard",
        accessor: "trip_additionalYard",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.AD_YD) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_additionalYard}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_additionalYard}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_additionalYard}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_additionalYard}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_additionalYard}</label>
          }
        }
      },
      {
        Header: "Gate In Date & Time",
        accessor: "trip_gateIn",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.GI) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_gateIn}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_gateIn}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_gateIn}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_gateIn}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_gateIn}</label>
          }
        }
      },
      {
        Header: "Gross Weight",
        accessor: "trip_grossWeight",
        filterable: false,
      },
      {
        Header: "Gross Weight Date & Time",
        accessor: "trip_grossWeight_time",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.G_W) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_grossWeight_time}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_grossWeight_time}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_grossWeight_time}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_grossWeight_time}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_grossWeight_time}</label>
          }
        }
      },
      {
        Header: "Tare Weight ",
        accessor: "trip_tareweight",
        filterable: false,
      },
      {
        Header: "Tare Weight Date & Time",
        accessor: "trip_tareweight_time",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.T_W) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_tareweight_time}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_tareweight_time}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_tareweight_time}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_tareweight_time}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_tareweight_time}</label>
          }
        }
      },
      {
        Header: "Net Weight",
        accessor: "trip_netweight",
        filterable: false,
      },
      {
        Header: "Unloading In Date & Time",
        accessor: "trip_unloadingIn",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.UI) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_unloadingIn}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_unloadingIn}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_unloadingIn}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_unloadingIn}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_unloadingIn}</label>
          }
        }
      },
      {
        Header: "Unloading Out Date & Time",
        accessor: "trip_unloadingOut",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.UO) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_unloadingOut}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_unloadingOut}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_unloadingOut}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_unloadingOut}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_unloadingOut}</label>
          }
        }
      },
      {
        Header: "SAP Tare Weight",
        accessor: "trip_sap_tareweight",
        filterable: false,
      },

      // {
      //   Header: "Challan Tare Weight",
      //   accessor: "cd_challan_tareweight",
      //   filterable: false,
      // },
      // {
      //   Header: "Challan Gross Weight",
      //   accessor: "cd_challan_grossweight",
      //   filterable: false,
      // },

      {
        Header: "Tag Number",
        accessor: "tag_tag_id",
        filterable: false,
      },
      {
        Header: "PO Number",
        accessor: "cd_po_number",
        filterable: false,
      },
      {
        Header: "PO Qty.",
        accessor: "cd_poqty",
        filterable: false,
      },
      {
        Header: "PGI No.",
        accessor: "cd_pgi_number",
        filterable: false,
      },
      {
        Header: "PGI Date & Time",
        accessor: "cd_pgi_datetime",
        filterable: false,
      },
      {
        Header: "PGI Qty.",
        accessor: "cd_pgi_qty",
        filterable: false,
      },
      // {
      //   Header: "No. Of Bags",
      //   accessor: "cd_noofbags",
      //   filterable: false,
      // },
      {
        Header: "Material Name",
        accessor: "mm_material_name",
        filterable: false,
      },
      {
        Header: "Material Code",
        accessor: "mm_material_code",
        filterable: false,
      },
      {
        Header: "Material Type",
        accessor: "mm_materialtypes_code",
        filterable: false,
      },
      {
        Header: "Order Type",
        accessor: "cd_order_type",
        filterable: false,
      },
      {
        Header: "Body Type",
        accessor: "trip_vehiclebody_type",
        filterable: false,
      },
      {
        Header: "Plant Name",
        accessor: "plant_name",
        filterable: false,
      },
      {
        Header: "Unit Code",
        accessor: "cd_unitCode",
        filterable: false,
      },
      {
        Header: "Trip Status",
        accessor: "trip_status",
        Cell: (cell) => {

          switch (cell.value) {
            case "A":
              return <span className="badge text-uppercase badge-soft-success"> Active </span>;
            case "D":
              return <span className="badge text-uppercase badge-soft-danger"> Deactive </span>;
            default:
              return <span className="badge text-uppercase badge-soft-info"> Active </span>;
          }
        }
      },
      // {
      //   Header: "LR Pdf",
      //   Cell: (cellProps) => {
      //     const pdfData = cellProps.row.original.cd_lr_pdf;
      //     if (!pdfData) {
      //       return <span className="badge text-uppercase badge-soft-warning">No Data</span>;
      //     } else if (pdfData.includes("PDF Disable")) {
      //       return <span className="badge text-uppercase badge-soft-danger">Not Enabled</span>;
      //     } else {
      //       const urls = pdfData.split(', ');
      //       return (
      //         <ul className="list-inline hstack gap-2 mb-0">
      //           {urls.map((url, index) => (
      //             <li key={index} className="list-inline-item edit" title="View PDF">
      //               <Link
      //                 to="#"
      //                 className="text-primary d-inline-block edit-item-btn"
      //                 onClick={() => viewDocumentData(url)}
      //               >
      //                 <img src={PdfImg} alt="" height="25" />
      //               </Link>
      //             </li>
      //           ))}
      //         </ul>
      //       );
      //     }
      //   },
      // },
      {
        Header: "IGP Pdf",
        Cell: (cellProps) => {
          const pdfData = cellProps.row.original.trip_igp_pdf;
          if (!pdfData) {
            return <span className="badge text-uppercase badge-soft-warning">No Data</span>;
          } else if (pdfData.includes("PDF Disable")) {
            return <span className="badge text-uppercase badge-soft-danger">Not Enabled</span>;
          } else {
            const urls = pdfData.split(', ');
            return (
              <ul className="list-inline hstack gap-2 mb-0">
                {urls.map((url, index) => (
                  <li key={index} className="list-inline-item edit" title="View PDF">
                    <Link
                      to="#"
                      className="text-primary d-inline-block edit-item-btn"
                      onClick={() => viewDocumentData(url)}
                    >
                      <img src={PdfImg} alt="" height="25" />
                    </Link>
                  </li>
                ))}
              </ul>
            );
          }
        },
      },
      {
        Header: "Weighment Slip ",
        Cell: (cellProps) => {
          return (
            cellProps.row.original.cd_weighment_pdf ?
              <ul className="list-inline hstack gap-2 mb-0">
                <li className="list-inline-item edit" title="View PDF">
                  <Link
                    to="#"
                    className="text-primary d-inline-block edit-item-btn"
                    onClick={() => { const url = cellProps.row.original.cd_weighment_pdf; viewDocumentData(url); }}
                  >
                    <img src={PdfImg} alt="" height="25" />
                  </Link>
                </li>
              </ul>
              :
              <span className="badge text-uppercase badge-soft-danger"> No Data </span>


          );
        },
      },
      // {
      //   Header: "Invoicing Pdf",
      //   Cell: (cellProps) => {
      //     return (
      //       cellProps.row.original.inbound_invoiceDirectory ?
      //         <ul className="list-inline hstack gap-2 mb-0">
      //           <li className="list-inline-item edit" title="View PDF">
      //             <Link
      //               to="#"
      //               className="text-primary d-inline-block edit-item-btn"
      //               onClick={() => { const url = cellProps.row.original.inbound_invoiceDirectory; viewDocumentData(url); }}
      //             >
      //               <img src={PdfImg} alt="" height="25" />
      //             </Link>
      //           </li>
      //         </ul>
      //         :
      //         <span className="badge text-uppercase badge-soft-danger"> No Data </span>


      //     );
      //   },
      // },
      // {
      //   Header: "Invoicing Pdf",
      //   Cell: (cellProps) => {
      //     const pdfData = cellProps.row.original.cd_invoice_pdf;
      //     if (!pdfData) {
      //       return <span className="badge text-uppercase badge-soft-warning">No Data</span>;
      //     } else if (pdfData.includes("PDF Disable")) {
      //       return <span className="badge text-uppercase badge-soft-danger">Not Enabled</span>;
      //     } else {
      //       const urls = pdfData.split(', ');
      //       return (
      //         <ul className="list-inline hstack gap-2 mb-0">
      //           {urls.map((url, index) => (
      //             <li key={index} className="list-inline-item edit" title="View PDF">
      //               <Link
      //                 to="#"
      //                 className="text-primary d-inline-block edit-item-btn"
      //                 onClick={() => viewDocumentData(url)}
      //               >
      //                 <img src={PdfImg} alt="" height="25" />
      //               </Link>
      //             </li>
      //           ))}
      //         </ul>
      //       );
      //     }
      //   },
      // },
      {
        Header: "TW Image",
        Cell: (cellProps) => {
          return (
            cellProps.row.original.trip_tareweight ?
              <ul className="list-inline hstack gap-2 mb-0">
                <li className="list-inline-item" title="View Image">
                  <Link
                    to="#"
                    onClick={() => { const data = cellProps.row.original; handleCustomerClick(data, "TW"); }}
                    className="text-primary d-inline-block edit-item-btn" title="View Image" style={{ margin: '-3px 0px -3px 0px' }} >
                    <i className="ri-image-fill align-middle text-success" style={{ fontSize: "25px" }}></i>
                  </Link>
                </li>
              </ul> :
              <span className="badge text-uppercase badge-soft-danger"> No Data </span>
          );
        },
      },
      {
        Header: "GW Image",
        Cell: (cellProps) => {
          return (
            cellProps.row.original.trip_grossWeight ?
              <ul className="list-inline hstack gap-2 mb-0">
                <li className="list-inline-item edit" title="View Image">
                  <Link
                    to="#"
                    onClick={() => { const data = cellProps.row.original; handleCustomerClick(data, "GW"); }}
                    className="text-primary d-inline-block edit-item-btn" title="View Image" style={{ margin: '-3px 0px -3px 0px' }} >
                    <i className="ri-image-fill align-middle text-success" style={{ fontSize: "25px" }}></i>
                  </Link>
                </li>
              </ul> :
              <span className="badge text-uppercase badge-soft-danger"> No Data </span>
          );
        },
      },
    ],
  );

  const viewDocumentData = (docURL) => {
    const searchTerm = ".pdf";
    const indexOfInvoice = docURL.indexOf(searchTerm);

    if (indexOfInvoice !== -1) {

      //const docURLRemoveInnitialPath = docURL.replace('/home/azureuser/eplms-ui/eplmsui/public/', '')
      // alert(docURLRemoveInnitialPath)
      if (docURL) {
        window.open(docURL);
        //window.open(process.env.PUBLIC_URL + docURLRemoveInnitialPath);
      }
      else {
        toast.error("PDF URL not found or incomplete.", { autoClose: 3000 });
      }
    }
    else {
      toast.error("PDF URL not found or incomplete.", { autoClose: 3000 });
    }
  }




  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "CSR | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          onDownloadClick={handleDownload}
          data={devices}
        />
        <Container fluid>
          <BreadCrumb title={latestHeader} pageTitle="Reports" />
          <Row>
            <Col lg={12}>

              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">CSR Reports</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto d-flex">
                      <div>
                        <button type="button" className="btn btn-info" title="Download" onClick={() => setIsExportCSV(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                        </button>
                      </div>
                      <div>
                        <button type="button" className="btn btn-info ms-2" title="Refresh Data" onClick={() => refreshData()}>
                          <i className="ri-refresh-line align-bottom me-1"></i>{" "}
                        </button>
                      </div>
                    </div>
                    {/* <div className="col-sm-auto">
                      <div>

                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); setValues(initialValues); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add Sub Menu
                        </button>{" "}

                      </div>
                    </div> */}
                  </Row>

                  <Row>
                    {/* <Col lg={3} className="mt-4" >
                    <div>
                      <Label
                        className="form-label"
                      >
                        Master Plant<span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        name="transporter_id"
                        type="select"
                        className="form-select"
                        id="transporter_id"
                        onChange={handleInputChange}
                        placeholder="Select Transporter Code"
                      >
                        <React.Fragment>
                          <option value="">Select Plant Name</option>
                          {Plant.map((item, key) => (<option value={item.plantCode} key={key}>{item.plantName}</option>))}
                        </React.Fragment>
                      </Input>
                    </div>
                  </Col> */}

                    {/* <Col lg={3} className="mt-4" >
                    <div>
                      <Label
                        className="form-label"
                      >
                        Movement<span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        name="transporter_id"
                        type="select"
                        className="form-select"
                        id="transporter_id"
                        // onClick={}
                        placeholder="Select Transporter Code"
                      >
                        <React.Fragment>
                          <option value="">Select Movement</option>
                          {Plant.map((item, key) => (<option value={item.plantCode} key={key}>{item.plantName}</option>))}
                        </React.Fragment>
                      </Input>
                    </div>
                    {transporterError && <p style={{ color: "red" }}>Please select mandatory fields</p>}
                  </Col> */}

                  </Row>
                </CardHeader>



                <div className="card-body pt-0 mt-3">

                  <Col md={3} className="mb-4">
                    <Label htmlFor="validationDefault03" className="form-label fw-bold">Movement Type<span style={{ color: "red" }}>*</span></Label>
                    <Input
                      name="movement"
                      type="select"
                      className="form-select"
                      //value={values.movement}
                      onChange={handleInputChange}
                      required
                    >
                      {movementType.map((item, key) => (
                        <React.Fragment key={key}>

                          {/* <option value={item.value}>{item.label}</option> */}
                          {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                        </React.Fragment>
                      ))}
                    </Input>
                  </Col>
                  {movementData === 'IB' ? (
                    <div>
                      {loader && <LoaderNew></LoaderNew>}
                      <TableContainer
                        trClass={"CSR_PMR_CLASS"}
                        columns={columnsIB}
                        data={devices}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css"
                        //isCustomerFilter={true}
                        SearchPlaceholder='Search for Vehicle No or something...'
                        divClass="overflow-auto"
                        tableClass="width-500"
                      />
                    </div>
                  ) : (
                    <div>
                      {loader && <LoaderNew></LoaderNew>}
                      <TableContainer
                        trClass={"CSR_PMR_CLASS"}
                        columns={columnsOB}
                        data={devices}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css"
                        //isCustomerFilter={true}
                        SearchPlaceholder='Search for Vehicle No or something...'
                        divClass="overflow-auto"
                        tableClass="width-500"
                      />
                    </div>
                  )}



                  {/* <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Sub Menu" : "Add Sub Menu"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                      <ModalBody>
                        <Row className="g-3">
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Name</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault03"
                              name="name"
                              placeholder="Enter Name"
                              value={values.name}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Main Menu Name</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="mainmenuName"
                              placeholder="Enter Main Menu Name"
                              value={values.mainmenuName}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Display Order</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="displayOrder"
                              placeholder="Enter Display Order"
                              value={values.displayOrder}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Icon</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="icon"
                              placeholder="Enter Icon"
                              value={values.icon}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Company Code</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="companyCode"
                              placeholder="Enter Company Code"
                              value={values.companyCode}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Plant Code</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="plantCode"
                              placeholder="Enter Plant Code"
                              value={values.plantCode}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col lg={4}>
                            <div>
                              <Label className="form-label" >Status</Label>
                              <Input
                                name="status"
                                type="select"
                                className="form-select"
                                value={values.status}
                                onChange={handleInputChange}
                                required
                              >
                                {status.map((item, key) => (
                                  <React.Fragment key={key}>
                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                  </React.Fragment>
                                ))}
                              </Input>
                            </div>
                          </Col>
                        </Row>
                        <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                            <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                            <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Sub Menu"} </button>
                          </Col>

                      </ModalBody>
                      <ModalFooter>
                      </ModalFooter>
                    </Form>
                  </Modal> */}
                  <ToastContainer closeButton={false} limit={1} />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          {"All Images"}
        </ModalHeader>
        <ModalBody>
          <div className="p-4 border mt-0 rounded text-center"  >
            <Row>
              {imageBase64Strings && imageBase64Strings.length > 0 ? (
                imageBase64Strings.map((base64String, index) => (
                  <Col key={index}>
                    <Card className="explore-box card-animate border">
                      <CardBody>
                        <div className="d-flex align-items-center mb-3">
                          <img src={`data:image/jpeg;base64,${base64String}`} alt="" className="avatar-xs rounded-circle" />
                          <div className="ms-2 flex-grow-1">
                            <Link to="#"><h6 className="mb-0 fs-15">{`Image - ${index + 1}`}</h6></Link>
                            <p className="mb-0 text-muted fs-13">{"Tare Weight"}</p>
                          </div>
                        </div>
                        <div className="explore-place-bid-img overflow-hidden rounded">
                          <img src={`data:image/jpeg;base64,${base64String}`} alt="" className="img-fluid border rounded" />
                          <div className="bg-overlay"></div>
                          <div className="place-bid-btn">
                            <Link to="#" className="btn btn-success" onClick={() => openImageInNewTab(base64String)}><i className="ri-eye-fill align-bottom me-1" ></i> View</Link>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))
              ) : (
                <div>No data to display</div>
              )}
            </Row>
          </div>
        </ModalBody>
      </Modal>

      <Modal id="showModal" isOpen={modalView} toggle={toggleView} centered size="lg">
        <ModalHeader className="bg-light p-3" toggle={toggleView}></ModalHeader>
        <ModalBody >
          <div className="mt-0 rounded text-center"  >
            <Row>
              <img src={ModalViewImage} alt="" className="img-fluid border rounded" />
            </Row>
          </div>
        </ModalBody>
      </Modal>

      <Modal id="showModal" isOpen={repushModal} toggle={toggleRepush} centered size="lg">
        <ModalHeader className="bg-light p-3" toggle={toggleRepush}>
          Invoice Details
        </ModalHeader>
        <ModalBody>
          <div className="rounded">
            {/* Common Data Display */}
            <Row className="justify-content-center">
              <Col md={12}>
                <table className="table table-bordered table-hover plant360 mb-3">
                  <tbody>
                    <tr style={{ background: "#f3f6f9" }}>
                      <td><strong>Vehicle Number</strong></td>
                      <td>{repushData[0]?.vehicleNumber || "N/A"}</td>
                      <td><strong>Trip ID</strong></td>
                      <td>{repushData[0]?.tripId || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>

            {/* Mapped Data Display */}
            {repushData.map((data, index) => (
              <div key={index} className="mb-4">
                <Row className="justify-content-center">
                  <Col md={12}>
                    <table className="table table-bordered table-hover plant360">
                      <thead className="table-light">
                        <tr>
                          <th>DI Number</th>
                          <th>Invoice Number</th>
                          <th>Invoice Status</th>
                          <th>IRN Number</th>
                          <th>IRN Request</th>
                          <th>E-Way Bill</th>
                          <th>E-Way Bill Req.</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{data.diNumber || "N/A"}</td>
                          <td>{data.invNo || "N/A"}</td>
                          <td>{data.invStatus || "N/A"}</td>
                          <td>{data.irnNo || "N/A"}</td>
                          <td>{data.irnReq || "N/A"}</td>
                          <td>{data.ewayBill || "N/A"}</td>
                          <td>{data.ewayBillReq || "N/A"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>

                {/* Buttons for Each Object */}
                <Row className="mt-2">
                  <Col className="text-end">
                    <button className="btn btn-success btn-sm me-2" disabled={data.invNo || loadingParameter ? true : false} onClick={() => handleRepushInvoice(data)}>
                      {loadingParameter ? (
                        <>
                          <Spinner size="sm" className="me-2 visible" />Loading...
                        </>
                      ) : (
                        <>
                          <i className="ri-stack-line align-bottom me-1"></i>
                          {'Retry Inv No.'}
                        </>
                      )}
                    </button>
                    <button className="btn btn-success btn-sm me-2" disabled={!data.invNo || loadingParameter1 ? true : false} onClick={() => handleRepushInvoicePDF(data)}>
                      {loadingParameter1 ? (
                        <>
                          <Spinner size="sm" className="me-2 visible" />Loading...
                        </>
                      ) : (
                        <>
                          <i className="ri-stack-line align-bottom me-1"></i>
                          {'Retry Inv PDF'}
                        </>
                      )}
                    </button>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </ModalBody>

      </Modal>



    </React.Fragment>
  );
};

export default ReportCsr;
