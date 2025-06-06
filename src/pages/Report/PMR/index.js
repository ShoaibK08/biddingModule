import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../PMR/Pmr.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
// import { valueContainerCSS } from "react-select/dist/declarations/src/components/containers";

const initialValues = {
  start_date: "",
  end_date: "",
  master_stage_id: "",
  master_plant_id: "",
  trip_movement_type_code: "",
  master_material_id: "",
};


const ReportPmr = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [devices, setDevice] = useState([]);
  const [Movement, setMovement] = useState([]);
  const [Material, setMaterial] = useState([]);
  const [Plant, setPlant] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [dynamicFlag, setDynamicFlag] = useState(1);
  const [Plant_Code, setPlantCode] = useState('');
  const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorEndDate, setErrorEndDate] = useState(false);
  const [errorCompare, setErrorCompare] = useState(false);
  const [errorTwoMonths, setErrorTwoMonths] = useState(false);
  const [latestHeader, setLatestHeader] = useState('');
  const [errorParameter, setErrorParameter] = useState(false);
  const [currentMovement, setCurrentMovement] = useState('OB');

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    setPlantCode(plantcode);
    //getAllDeviceData(plantcode);
    getMovementData(plantcode);
    getMaterialData(plantcode);

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

  const getAllDeviceData = async (e) => {
    if (values.start_date === "") {
      setErrorStartDate(true);
    }
    else if (values.end_date === "") {
      setErrorEndDate(true);
    }
    else {
      setErrorStartDate(false);
      setErrorEndDate(false);
      setErrorCompare(false);
      setErrorParameter(true);
      try {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_REPORTS}/getReport/getPlantMovementReport`, values, config)
          .then(res => {
            const device = res.Data["#result-set-1"];
            setDevice(device);
            setErrorParameter(false);
          });
      }
      catch (e) {
        toast.error(e, { autoClose: 3000 });
        setErrorParameter(false);
      }

    }

  }

  const getMovementData = (plantcode) => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/movements?plantCode=${plantcode}`, config)
      .then(res => {
        const Movement = res;
        setMovement(Movement);
      })
  }

  const getMaterialData = (plantcode) => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/materials?plantCode=${plantcode}`, config)
      .then(res => {
        const Material = res;
        if (res.errorMsg) {
          setMaterial([]);
        } else {
          setMaterial(Material);
        }

      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDevice([]);
    if(value === 'OB'){
      setCurrentMovement('OB');
    }
    if(value === 'IB'){
      setCurrentMovement('IB');
    }
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
      ["master_plant_id"]: Plant_Code,
    });
  };

  const createdDateFunction = (date, date1, date2) => {

    setValues({
      ...values,
      ['start_date']: date1 + " 00:00:00",
      ["master_plant_id"]: Plant_Code,
    });
    setErrorStartDate(false);
    const startDate = new Date(date1 + " 00:00:00");
    const endDate = new Date(values.end_date);
    const millisecondsPerDay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
    const maxDifferenceInMilliseconds = 62 * millisecondsPerDay; // 60 days in milliseconds
    const differenceInMilliseconds = Math.abs(endDate - startDate);
    if (endDate < startDate) {
      setErrorCompare(true);
      setErrorTwoMonths(false);
    }
    else if (differenceInMilliseconds > maxDifferenceInMilliseconds) {
      setErrorTwoMonths(true);
      setErrorCompare(false);
  }
    else {
      setErrorCompare(false);
      setErrorTwoMonths(false);
    }
  };

  const createdDateFunction1 = (date, date1, date2) => {

    setValues({
      ...values,
      ['end_date']: date1 + " 23:59:00",
      ["master_plant_id"]: Plant_Code,
    });
    setErrorEndDate(false);
    const startDate = new Date(values.start_date);
    const endDate = new Date(date1 + " 23:59:00");
    const millisecondsPerDay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
    const maxDifferenceInMilliseconds = 62 * millisecondsPerDay; // 60 days in milliseconds
    const differenceInMilliseconds = Math.abs(endDate - startDate);
    if (endDate < startDate) {
      setErrorCompare(true);
      setErrorTwoMonths(false);
    }
    else if (differenceInMilliseconds > maxDifferenceInMilliseconds) {
      setErrorTwoMonths(true);
      setErrorCompare(false);
  }
    else {
      setErrorCompare(false);
      setErrorTwoMonths(false);
    }
  };

  // Add Data
  const handleCustomerClicks = () => {
    setIsEdit(false);
    toggle();
  };
  // Update Data
  const handleCustomerClick = useCallback((arg) => {

    setClickedRowId(arg);
    setIsEdit(true);
    toggle();
    const id = arg;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/submenus/${id}`, config)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "start_date": result.start_date,
          "end_date": result.end_date,
          "master_stage_id": result.master_stage_id,
          "master_plant_id": result.master_plant_id,
          "trip_movement_type_code": result.trip_movement_type_code,
          "master_material_id": result.master_material_id,
        });
      })

  }, [toggle]);

  // Delete Data
  const onClickDelete = (id) => {
    setClickedRowId(id);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/submenus/${CurrentID}`, config)
      console.log(res.data);
      getAllDeviceData();
      toast.success("Sub Menu Deleted Successfully", { autoClose: 3000 });
      setDeleteModal(false);
    } catch (e) {
      toast.error("Something went wrong!", { autoClose: 3000 });
      setDeleteModal(false);
    }
  };


  const master_material_id = [
    {
      options: [
        { label: "Select Material", value: "" },
        { label: "Active", value: "A" },
        { label: "Deactive", value: "D" },
      ],
    },
  ];


  const trip_movement_type_code = [
    {
      options: [
        { label: "Select Movement", value: "" },
        { label: "InBound", value: "In" },
        { label: "OutBound", value: "Ob" },
      ],
    },
  ];




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
        Header: 'Sr No.',
        accessor: (_, index) => devices.length - index, // Calculate index in reverse
        disableFilters: true,
      },
      {
        Header: "Trip ID ",
        accessor: "trip_id",
        filterable: false,
      },
      {
        Header: "Vehicle No",
        accessor: "trip_vehicleNumber",
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
        Header: "IGP No.",
        accessor: "trip_igpNumber",
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
        Header: "Tare Weight",
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
        Header: currentMovement === 'OB' ? "Packing In Date & Time" : 'Unloading In',
        accessor: currentMovement === 'OB' ? "trip_packingIn" : 'trip_unloadingIn',
        filterable: false,
        Cell: (cellProps) => {
          switch (currentMovement === 'OB' ? cellProps.row.original.PI : cellProps.row.original.UI) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{currentMovement === 'OB' ? cellProps.row.original.trip_packingIn : cellProps.row.original.trip_unloadingIn}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{currentMovement === 'OB' ? cellProps.row.original.trip_packingIn : cellProps.row.original.trip_unloadingIn}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{currentMovement === 'OB' ? cellProps.row.original.trip_packingIn : cellProps.row.original.trip_unloadingIn}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{currentMovement === 'OB' ? cellProps.row.original.trip_packingIn : cellProps.row.original.trip_unloadingIn}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{currentMovement === 'OB' ? cellProps.row.original.trip_packingIn : cellProps.row.original.trip_unloadingIn}</label>
          }
        }
      },
      {
        Header: currentMovement === 'OB' ? "Packing Out Date & Time" : 'Unloading Out',
        accessor: currentMovement === 'OB' ? "trip_packingOut" : 'trip_unloadingOut',
        filterable: false,
        Cell: (cellProps) => {
          switch (currentMovement === 'OB' ? cellProps.row.original.PO : cellProps.row.original.UO) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{currentMovement === 'OB' ? cellProps.row.original.trip_packingOut : cellProps.row.original.trip_unloadingOut}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{currentMovement === 'OB' ? cellProps.row.original.trip_packingOut : cellProps.row.original.trip_unloadingOut}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{currentMovement === 'OB' ? cellProps.row.original.trip_packingOut : cellProps.row.original.trip_unloadingOut}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{currentMovement === 'OB' ? cellProps.row.original.trip_packingOut : cellProps.row.original.trip_unloadingOut}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{currentMovement === 'OB' ? cellProps.row.original.trip_packingOut : cellProps.row.original.trip_unloadingOut}</label>
          }
        }
      },
      {
        Header: "Gate Out Date & Time",
        accessor: "trip_gateOut",
        filterable: false,
        Cell: (cellProps) => {
          switch (cellProps.row.original.GO) {
            case "A":
              return <label style={{ background: "rgb(10 179 156 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_gateOut}</label>
            case "B":
              return <label style={{ background: "rgb(247 184 75 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_gateOut}</label>
            case "S":
              return <label style={{ background: "rgb(64 81 137 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_gateOut}</label>
            case "G":
              return <label style={{ background: "rgb(240 101 72 / 73%)", padding: "5px 10px 5px 10px", margin: "0", borderRadius: "5px" }}>{cellProps.row.original.trip_gateOut}</label>
            default:
              return <label style={{ fontWeight: "normal" }}>{cellProps.row.original.trip_gateOut}</label>
          }
        }
      },
      {
        Header: currentMovement === 'OB' ? "DI Number" : "PO Number",
        accessor: currentMovement === 'OB' ? "cd_di_number" : "cd_po_number",
        filterable: false,
      },
      {
        Header: currentMovement === 'OB' ? "DI Qty." : "PO Qty.",
        accessor: currentMovement === 'OB' ? "cd_diqty" : "cd_poqty",
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
              return <span className="badge text-uppercase badge-soft-danger"> Closed </span>;
            case "D":
              return <span className="badge text-uppercase badge-soft-danger"> Closed </span>;
            default:
              return <span className="badge text-uppercase badge-soft-danger"> Closed </span>;
          }
        }
      },
      // {
      //   Header: "Action",
      //   Cell: (cellProps) => {
      //     return (
      //       <ul className="list-inline hstack gap-2 mb-0">
      //         <li className="list-inline-item edit" title="Edit">
      //           <Link
      //             to="#"
      //             className="text-primary d-inline-block edit-item-btn"
      //             onClick={() => { const id = cellProps.row.original.id; handleCustomerClick(id); }}
      //           >

      //             <i className="ri-pencil-fill fs-16"></i>
      //           </Link>
      //         </li>
      //         <li className="list-inline-item" title="Remove">
      //           <Link
      //             to="#"
      //             className="text-danger d-inline-block remove-item-btn"
      //             onClick={() => { const id = cellProps.row.original.id; onClickDelete(id); }}>
      //             <i className="ri-delete-bin-5-fill fs-16"></i>
      //           </Link>
      //         </li>
      //       </ul>
      //     );
      //   },
      // },
    ],
  );


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
    FileSaver.saveAs(blob, 'PMR.xlsx');

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


  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "PMR | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          onDownloadClick={handleDownload}
          data={devices}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
          onCloseClick={() => setDeleteModal(false)}
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
                        <h5 className="card-title mb-0 bg-light">PMR Reports</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
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

                  <Row className="mt-4 p-2">

                    <Col md={3}>
                      <Label htmlFor="validationDefault04" className="form-label">Start Date<span style={{ color: "red" }}>*</span></Label>
                      <Flatpickr
                        className="form-control"
                        id="datepicker-publish-input"
                        placeholder="Select Start Date"
                        value={values.createdDate}
                        options={{
                          enableTime: false,
                          dateFormat: "Y-m-d",
                          maxDate: "today", // Disable dates after the current date
                        }}
                        onChange={(selectedDates, dateStr, fp) => { createdDateFunction(selectedDates, dateStr, fp) }}
                      />
                      {errorStartDate && <p className="mt-2" style={{ color: "red" }}>Please Select Start Date</p>}
                    </Col>

                    <Col md={3}>
                      <Label htmlFor="validationDefault04" className="form-label">End Date<span style={{ color: "red" }}>*</span></Label>
                      <Flatpickr
                        className="form-control"
                        id="datepicker-publish-input"
                        placeholder="Select End Date"
                        value={values.createdDate}
                        options={{
                          enableTime: false,
                          dateFormat: "Y-m-d",
                          maxDate: "today" // Disable dates after the current date
                        }}
                        onChange={(selectedDates, dateStr, fp) => { createdDateFunction1(selectedDates, dateStr, fp) }}
                      />
                      {errorEndDate && <p className="mt-2" style={{ color: "red" }}>Please Select End Date</p>}
                      {errorCompare && <p className="mt-2" style={{ color: "red" }}>End date cannot be less than start date.</p>}
                      {errorTwoMonths && <p className="mt-2" style={{ color: "red" }}>Difference between both dates cannot be greater than 60 days.</p>}
                    </Col>

                    <Col lg={3}>
                      <div>
                        <Label className="form-label" >Movement</Label>
                        <Input
                          name="trip_movement_type_code"
                          type="select"
                          className="form-select"
                          // value={values.trip_movement_type_code}
                          onChange={handleInputChange}

                        >
                          <React.Fragment>
                            <option value="" selected>Select Movement</option>
                            {Movement.map((item, key) => (<option value={item.code} key={key}>{item.name}</option>))}
                          </React.Fragment>
                        </Input>
                      </div>
                    </Col>

                    <Col lg={3}>
                      <div>
                        <Label className="form-label" >Material</Label>
                        <Input
                          name="master_material_id"
                          type="select"
                          className="form-select"
                          // value={values.master_material_id}
                          onChange={handleInputChange}

                        >
                          <React.Fragment>
                            <option value="" selected>Select Material</option>
                            {Material.map((item, key) => (<option value={item.code} key={key}>{item.name} / {item.code}</option>))}
                          </React.Fragment>
                        </Input>
                      </div>
                    </Col>
                    <Col lg={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "25px"}}>
                      <button type="button" className="btn btn-success" onClick={getAllDeviceData} disabled={errorEndDate || errorCompare || errorTwoMonths}>{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Searching...</> : "Search"}</button>
                    </Col>
                  </Row>




                </CardHeader>
                <div className="card-body pt-0 mt-2">
                  <div>

                    <TableContainer
                      columns={columns}
                      data={devices}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={5}
                      isGlobalSearch={true}
                      className="custom-header-css"
                      handleCustomerClick={handleCustomerClicks}
                      //isCustomerFilter={true}
                      SearchPlaceholder='Search for Vehicle No or something...'
                      divClass="overflow-auto"
                      tableClass="width-400"
                    />
                  </div>


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


    </React.Fragment>
  );
};

export default ReportPmr;
