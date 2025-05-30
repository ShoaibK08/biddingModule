import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//Import Icons
import FeatherIcon from "feather-icons-react";
import axios from "axios";
import Select, { components } from "react-select";

import A1 from '../../../assets/images/A1.png';
import A2 from '../../../assets/images/A2.png';
import A3 from '../../../assets/images/A3.png';
import A4 from '../../../assets/images/A4.png';
import A5 from '../../../assets/images/A5.png';
import A6 from '../../../assets/images/A6.png';
import A7 from '../../../assets/images/A7.png';
import A8 from '../../../assets/images/A8.png';
import A9 from '../../../assets/images/A9.png';

import {
  Card,
  CardBody,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Col
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";
import Flatpickr from "react-flatpickr";
import './SlocMaster.css';
import TableContainer from "../../../Components/Common/TableContainer";
//redux
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import "flatpickr/dist/themes/material_green.css"; // or your preferred theme

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";

//Simple bar
import SimpleBar from "simplebar-react";
import UpcommingEvents from './UpcommingEvents';
import listPlugin from '@fullcalendar/list';


import {
  getEvents as onGetEvents,
  getCategories as onGetCategories,
  addNewEvent as onAddNewEvent,
  deleteEvent as onDeleteEvent,
  updateEvent as onUpdateEvent,
  resetCalendar,
} from "../../../store/actions";

const SlocMaster = () => {
  const dispatch = useDispatch();
  const [event, setEvent] = useState({});
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedNewDay, setSelectedNewDay] = useState(0);
  const [slotDateFrom, setSlotDateFrom] = useState('');
  const [slotDateTo, setSlotDateTo] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [isEditButton, setIsEditButton] = useState(true);
  const [upcommingevents, setUpcommingevents] = useState([]);
  const [plantdata, setPlantData] = useState([]);
  const [materialData, setMaterialData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [transporterdata, setTransporterData] = useState([]);
  const [Plant_Code, setPlantCode] = useState('');
  const [modalSlot, setmodalSlot] = useState(false);
  const [TruckData, setTruckData] = useState([]);
  const [SlotData, setSlotData] = useState([]);
  const [slotModalSize, setslotModalSize] = useState(false);
  const [CommitSlocModal, setCommitSlocModal] = useState(false);
  const [AllocateModal, setAllocateModal] = useState(false);
  const [AllocateData, setAllocateData] = useState([]);

  const { events, categories, isEventUpdated } = useSelector((state) => ({
    events: state.Calendar.events,
    categories: state.Calendar.categories,
    isEventUpdated: state.Calendar.isEventUpdated,
  }));

  useEffect(() => {
    debugger
    getSlotData();
    getallocateData();
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    setPlantCode(plantcode);
    getTransporterData(plantcode);
    getMaterialData(plantcode)
    getStateData()
    getPlantData();

  }, []);

  // const CustomOption = (props) => {
  //   const { data, isSelected } = props;
  //   return (
  //     <components.Option {...props}>
  //       <input
  //         type="checkbox"
  //         className="slotCheckbox"
  //         checked={props.selectProps.selectedValues.includes(data.value)}
  //         onChange={() => props.selectProps.onCheckboxChange(data.value)}
  //         style={{ marginRight: '8px' }}
  //       />
  //       {data.label}
  //     </components.Option>
  //   );
  // };
  // const [selectedRows, setSelectedRows] = useState({});

  const handleSelectAll = (e, rows) => {
    const checked = e.target.checked;
    const newSelectedRows = {};
    if (checked) {
      rows.forEach(row => {
        newSelectedRows[row.original.id] = true;
      });
    }
    setSelectedRows(newSelectedRows);
  };

  const handleRowCheckbox = (id) => {
    setSelectedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  const commitVehicledata = async (e) => {
    debugger;
    e.preventDefault();
    try {
      axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/slotmaster/commitVehicles?id=${event.id}&count=${values.count}`, '', config)
        .then((res) => {
          if (res.status.msg === 'Slot Commited Successfully') {
            toast.success('Vehicle Commit Successfully', { autoClose: 3000 });
            toggle();
          } else {
            toast.error(res.status.msg, { autoClose: 3000 });
            toggle();
          }

        })

    } catch (err) {
      toast.error("Something went wrong!", { autoClose: 3000 });
    }
  }

  const CustomOption = (props) => {
    const { data } = props;
    const isChecked = props.selectProps.selectedValues.includes(data.value);

    return (
      <components.Option {...props}>
        <input
          type="checkbox"
          className="slotCheckbox"
          checked={isChecked}
          onChange={() => props.selectProps.onCheckboxChange(data)}
          style={{ marginRight: '8px' }}
        />
        {data.label}
      </components.Option>
    );
  };

  // const materialN = [
  //   { "id": 81, "material_code": "M0039", "className": "bg-soft-success", "title": "Diesel", "vat_gst": "1", "quota_management": "", "vehicle_type": "", "material_uom": 1.0, "material_desc": "", "vehicle_document": "", "status": 1, "image": ["f560b2b2-4b8a-48a6-a44a-f3de7d5efca2.jpg", "dbd625e7-8ae3-487f-a25d-9716ec1badff.jpg", "f411ddbc-983c-4d4e-920c-ff2a1e8cf68d.jpg"], "category": "Liquid", "visibility": 2, "start": "2023-04-01 13:45:52.713", "modified_dt": null },
  //   { "id": 64, "material_code": "M0023", "className": "bg-soft-success", "title": "Cement", "vat_gst": "1", "quota_management": "", "vehicle_type": "", "material_uom": 1.0, "material_desc": "", "vehicle_document": "", "status": 1, "image": ["f560b2b2-4b8a-48a6-a44a-f3de7d5efca2.jpg", "dbd625e7-8ae3-487f-a25d-9716ec1badff.jpg", "f411ddbc-983c-4d4e-920c-ff2a1e8cf68d.jpg"], "category": "Solid", "visibility": 2, "start": "2023-04-21 13:45:52.713", "modified_dt": null },
  //   { "id": 831, "material_code": "M0039", "className": "bg-soft-success", "title": "Diesel", "vat_gst": "1", "quota_management": "", "vehicle_type": "", "material_uom": 1.0, "material_desc": "", "vehicle_document": "", "status": 1, "image": ["f560b2b2-4b8a-48a6-a44a-f3de7d5efca2.jpg", "dbd625e7-8ae3-487f-a25d-9716ec1badff.jpg", "f411ddbc-983c-4d4e-920c-ff2a1e8cf68d.jpg"], "category": "Liquid", "visibility": 2, "start": "2023-04-01 13:45:52.713", "modified_dt": null },
  //   { "id": 634, "material_code": "M0023", "className": "bg-soft-success", "title": "Cement", "vat_gst": "1", "quota_management": "", "vehicle_type": "", "material_uom": 1.0, "material_desc": "", "vehicle_document": "", "status": 1, "image": ["f560b2b2-4b8a-48a6-a44a-f3de7d5efca2.jpg", "dbd625e7-8ae3-487f-a25d-9716ec1badff.jpg", "f411ddbc-983c-4d4e-920c-ff2a1e8cf68d.jpg"], "category": "Solid", "visibility": 2, "start": "2023-04-21 13:45:52.713", "modified_dt": null },
  //   { "id": 811, "material_code": "M0039", "className": "bg-soft-success", "title": "Diesel", "vat_gst": "1", "quota_management": "", "vehicle_type": "", "material_uom": 1.0, "material_desc": "", "vehicle_document": "", "status": 1, "image": ["f560b2b2-4b8a-48a6-a44a-f3de7d5efca2.jpg", "dbd625e7-8ae3-487f-a25d-9716ec1badff.jpg", "f411ddbc-983c-4d4e-920c-ff2a1e8cf68d.jpg"], "category": "Liquid", "visibility": 2, "start": "2023-04-01 13:45:52.713", "modified_dt": null },
  //   { "id": 644, "material_code": "M0023", "className": "bg-soft-success", "title": "Cement", "vat_gst": "1", "quota_management": "", "vehicle_type": "", "material_uom": 1.0, "material_desc": "", "vehicle_document": "", "status": 1, "image": ["f560b2b2-4b8a-48a6-a44a-f3de7d5efca2.jpg", "dbd625e7-8ae3-487f-a25d-9716ec1badff.jpg", "f411ddbc-983c-4d4e-920c-ff2a1e8cf68d.jpg"], "category": "Solid", "visibility": 2, "start": "2023-04-21 13:45:52.713", "modified_dt": null },

  // ];
  const handleAllocateAction = async () => {
    debugger
    const vehicles = [...selectedRows];
    const data = {
      vehicles,
      slotNumber
    }
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicleslotdetails/allocate`, data, config)
        .then((res) => {
          if (res.status.msg === 'Vehicle Slot Details Saved Successfully') {
            toast.success("Allocated Truck SuccessFully", { autoClose: 3000 });
          } else {
            toast.error(res.status.msg, { autoClose: 3000 });
          }

        })
    } catch (e) {
      toast.error("Something went wrong!", { autoClose: 3000 });
    }
    allocateModal();
    setModal(false);

  };
  const [selectedRows, setSelectedRows] = useState([]);

  const selectAll = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      const filteredRows = AllocateData.map(item => ({
        registrationNumber: item.registrationNumber,
        companyCode: item.companyCode,
        vehicleCapacityMax: item.vehicleCapacityMax,
        certifiedCapacity: item.certifiedCapacity,
        transporterCode: item.transporterCode,
        AssignedCapacity: item.vehicleCapacityMin
      }));
      setSelectedRows(filteredRows);
    } else {
      setSelectedRows([]);
    }
  };


  // Customers Column
  const columns = useMemo(() => [
    {
      id: 's',
      Header: (
        <input
          type="checkbox"
          className="form-check-input"
          checked={selectedRows.length === AllocateData.length}
          onChange={selectAll}
        />
      ),
      Cell: (cellProps) => {
        const rowData = cellProps.row.original;
        const isChecked = selectedRows.some(
          item => item.registrationNumber === rowData.registrationNumber
        );

        const minimalRow = {
          registrationNumber: rowData.registrationNumber,
          companyCode: rowData.companyCode,
          vehicleCapacityMax: rowData.vehicleCapacityMax,
          certifiedCapacity: rowData.certifiedCapacity,
          transporterCode: !rowData.transporterCode ? '' : rowData.transporterCode,
          AssignedCapacity: rowData.vehicleCapacityMin
        };

        return (
          <input
            type="checkbox"
            className="form-check-input"
            checked={isChecked}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRows(prev => [...prev, minimalRow]);
              } else {
                setSelectedRows(prev =>
                  prev.filter(item => item.registrationNumber !== rowData.registrationNumber)
                );
              }
            }}
          />
        );
      }
    },
    {
      Header: '',
      accessor: 'id',
      hiddenColumns: true,
      Cell: (cell) => <input type="hidden" value={cell.value} />
    },
    {
      Header: "Vehicle No.",
      accessor: "registrationNumber",
      filterable: false,
    },
    {
      Header: "Company Code",
      accessor: "companyCode",
      filterable: false,
    },
    {
      Header: "Max. Capacity",
      accessor: "vehicleCapacityMax",
      filterable: false,
    },
    {
      Header: "Available Capacity",
      accessor: "certifiedCapacity",
      filterable: false,
    },
    {
      Header: "Assigned Capacity",
      accessor: "vehicleCapacityMin",
      filterable: false,
    }
  ], [selectedRows, AllocateData]);


  const handleCheckboxChange = (option) => {
    // Check if the option is already selected
    const isAlreadySelected = selectedValues.includes(option.value);

    // Update state using functional form to ensure it's based on the previous state
    setSelectedValues((prevSelectedValues) => {
      let updatedSelectedValues;
      if (isAlreadySelected) {
        // Remove unchecked option
        updatedSelectedValues = prevSelectedValues.filter(val => val !== option.value);
      } else {
        // Add newly checked option
        updatedSelectedValues = [...prevSelectedValues, option.value];
      }

      // Update Formik value
      const transporterNames = updatedSelectedValues.map(val => {
        // Find the full option object based on the value
        const selectedOption = selectedTransporters.find(opt => opt.value === val);
        return selectedOption && selectedOption.label ? selectedOption.label.split(' (')[0] : '';
      });

      validation.setFieldValue("transporterNames", transporterNames);

      // Return updated state value
      return updatedSelectedValues;
    });

    // Update selected transporters state as well
    setSelectedTransporters((prevSelectedTransporters) => {
      let updatedSelectedTransporters;
      if (isAlreadySelected) {
        updatedSelectedTransporters = prevSelectedTransporters.filter(opt => opt.value !== option.value);
      } else {
        updatedSelectedTransporters = [...prevSelectedTransporters, option];
      }
      return updatedSelectedTransporters;
    });
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: process.env.REACT_APP_API_USER_NAME,
      password: process.env.REACT_APP_API_PASSWORD,
    },
  };


  const getPlantData = () => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/plants/getAllPlants`, config)
      .then(res => {
        const result = res;
        setPlantData(result);
      });
  }

  const getallocateData = () => {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let transCode = obj.data.transporterCode;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicles/byTransporter?transporterCode=${transCode}`, config)
      .then(res => {
        const result = res;
        setAllocateData(result);
      });
  }


  const getTransporterData = (plantcode) => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/all?plantCode=${plantcode}`, config)
      .then(res => {
        const result = res;
        setTransporterData(result);
      });
  }

  const getMaterialData = (plantcode) => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/materials?plantCode=${plantcode}`, config)
      .then(res => {
        const result = res;
        setMaterialData(result);
      });
  }
  const getStateData = () => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/locations/states`, config)
      .then(res => {
        const result = res;
        setStateData(result);
      });
  }

  const deleteSlocMasterData = () => {
    debugger
    axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/SlocMaster/delete/${event.id}`, config)
      .then(res => {
        const result = res;
        if (result.status.msg === "SlocMaster Deleted") {
          toast.success("Slot Deleted Successfully", { autoClose: 3000 });
          getSlotData();
        }

      });
  }
  const [OpenModal, setOpenModal] = useState(false);
  const [eventList, seteventList] = useState([]);
  const [eventDate, seteventDate] = useState({});
  const [eventState, seteventState] = useState({});
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };
  const multipleEventData = (eventList, dateStr) => {
    console.log("Events for date", dateStr, eventList);
    const formattedDate = formatDate(dateStr);
    seteventDate(formattedDate);
    seteventList(eventList);
    // setSelectedDateEvents(eventList); // or however you're managing modal data
    setOpenModal(true);
  };




  const submitMultiEvent = async (id) => {
    debugger;
    const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/slotmaster/getSlot/${id}`, config);
    const st_date = res.slotDateFromFormatted;
    const ed_date = res.slotDateToFormatted;

    const selectedTransportersFromRes = transporterdata
      .filter(item => res.transporterNames.includes(item.name.trim()))
      .map(item => ({
        value: item.code,
        label: `${item.name.trim()} (${item.code})`
      }));
    setSelectedTransporters(selectedTransportersFromRes);

    const r_date =
      ed_date == null
        ? str_dt(st_date)
        : str_dt(st_date) + " to " + str_dt(ed_date);
    const er_date =
      ed_date == null
        ? date_r(st_date)
        : date_r(st_date) + " to " + date_r(ed_date);
    setSlotDateFrom(date_r(res.slotDateFromFormatted));
    setSlotDateTo(date_r(res.slotDateToFormatted));
    setSelectedValues(selectedTransportersFromRes.map(item => item.value));
    setEvent({
      id: res.id,
      title: res.title,
      start: res.start,
      end: res.end,
      location: res.location,
      description: res.description,
      defaultDate: er_date,
      slotDateFromFormatted: res.slotDateFromFormatted,
      endTimeFormatted: res.endTimeFormatted,
      startTimeFormatted: res.startTimeFormatted,
      slotDateToFormatted: res.slotDateToFormatted,
      materialName: res.materialName,
      status: res.status,
      plantName: res.plantName,
      noOfTtRq: res.noOfTtRq,
      pendingTruckCount: res.pendingTruckCount,
      materialCode: res.materialCode,
      maxTtCommitTr: res.maxTtCommitTr,
      plantCode: res.plantCode,
      transporterNames: res.transporterNames.join(","),
      remarks: res.remarks,
      startTime: res.startTimeFormatted,
      endTime: res.endTimeFormatted,
      state: res.state,
    });

    setslotModalSize(true);
    // setslotModalSize(false);
    setIsEdit(true);
    //  setIsEdit(false);
    setIsEditButton(true);
    toggle();
  };


  const [values, setValues] = useState([]);
  const [TransporterError, setTransporterError] = useState(false);
  const [SlotError, setSlotError] = useState(false);
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   // Ensure only the changed field is updated and the other fields are preserved
  //   setValues((prevValues) => ({
  //     ...prevValues,
  //     [name]: value || value.valueAsNumber,  // Update the specific field
  //   }));

  //   setEvent((prevEvent) => ({
  //     ...prevEvent,
  //     [name]: value || value.valueAsNumber,  // Update the specific field
  //   }));
  // };

  // Handle input change function
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update time (startTime or endTime)
    if (name === "startTime" || name === "endTime") {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,  // Update only the time-related field
      }));
      setEvent((prevEvent) => ({
        ...prevEvent,
        [name]: value,  // Update only the time-related field
      }));
    } else {
      // Update other fields normally
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value || value.valueAsNumber,  // Update specific field
      }));
      setEvent((prevEvent) => ({
        ...prevEvent,
        [name]: value || value.valueAsNumber,  // Update specific field
      }));
    }
  };
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`; // or `${hours}:${minutes}` if you want no seconds
  };

  function formatDateToYYYYMMDD(dateStr) {
    if (!dateStr) return "";

    const cleaned = dateStr.replace(',', '').trim(); // Remove comma, trim spaces
    const parts = cleaned.split(/\s+/); // split by space(s)

    if (parts.length !== 3) {
      console.error("Unexpected date format:", dateStr);
      return "";
    }

    const [day, monthStr, year] = parts;

    const monthMap = {
      Jan: "01", January: "01",
      Feb: "02", February: "02",
      Mar: "03", March: "03",
      Apr: "04", April: "04",
      May: "05",
      Jun: "06", June: "06",
      Jul: "07", July: "07",
      Aug: "08", August: "08",
      Sep: "09", Sept: "09", September: "09",
      Oct: "10", October: "10",
      Nov: "11", November: "11",
      Dec: "12", December: "12"
    };

    const month = monthMap[monthStr];
    if (!month) {
      console.error("Invalid month string:", monthStr);
      return "";
    }

    const paddedDay = String(parseInt(day)).padStart(2, '0');
    return `${year}-${month}-${paddedDay}`;
  }


  const submitEventData = async (e) => {
    e.preventDefault();
    debugger;

    const id = document.getElementById("update_event_id").value;
    console.log("id_val", id);
    console.log(values);
    const totalData = {
      ...values,
      "startTime": formatTime(values.startTime),
      "endTime": formatTime(values.endTime),
      "transporterCodes": selectedValues,
      "slotDateFrom": formatDateToYYYYMMDD(values.slotDateFrom),
      "slotDateTo": formatDateToYYYYMMDD(values.slotDateTo),
    };

    // Validation for transporter codes
    if (!Array.isArray(selectedValues) || selectedValues.length === 0) {
      setTransporterError(true);
      return;
    } else {
      setTransporterError(false);
    }

    alert(values.slotDateFrom);

    // Validation for slot dates
    // if (values.slotDateFrom === "") {
    //   setSlotError(true);
    //   return;
    // } else {
    //   setSlotError(false);
    // }

    // If there is an existing slot ID, use PUT, otherwise use POST to create
    const url = id ? `${process.env.REACT_APP_LOCAL_URL_8082}/SlocMaster/updateSlot/${id}` : `${process.env.REACT_APP_LOCAL_URL_8082}/SlocMaster/create`;

    const method = id ? 'put' : 'post';

    try {
      const res = await axios({
        method: method,
        url: url,
        data: totalData,
        ...config,
      });

      console.log(res);

      if (res.status === 200 && res.message === 'Slot master created successfully') {
        toast.success("Slot Booked Successfully", { autoClose: 3000 });
        getSlotData();
        //toggle();
      } else if (res.status === 200 && res.message === 'Slot Updated Successfully') {
        toast.success("Slot Updated Successfully", { autoClose: 3000 });
        getSlotData();
      }
    } catch (error) {
      console.error("Error during API request:", error);
      toast.error("Something went wrong. Please try again!", { autoClose: 3000 });
    }
    toggle();
  };

  useEffect(() => {

    setUpcommingevents(events);
    upcommingevents.sort(function (o1, o2) {
      return new Date(o1.start) - new Date(o2.start);
    });

  }, [events, upcommingevents]);

  useEffect(() => {
    if (isEventUpdated) {
      setIsEdit(false);
      setEvent({});
      setTimeout(() => {
        dispatch(resetCalendar("isEventUpdated", false));
      }, 500);
    }
  }, [dispatch, isEventUpdated]);

  /**
   * Handling the modal state
   */
  const toggle = () => {
    debugger
    if (modal) {
      setSelectedTransporters([]);
      if (!slotModalSize) {
        setValues([]);
        setSelectedValues([]);
        setSelectedTransporters([]);
        setTransporterError(false);
        setSlotError(false);
      }
      setslotModalSize(false);
      setModal(false);
      setEvent(null);
      setIsEdit(false);
      setIsEditButton(true);
    } else {
      setModal(true);
    }
  };

  const openModal = () => {
    if (OpenModal) {
      setOpenModal(false);
      // setModal(true);
    } else {
      setOpenModal(true);
      //  setModal(false);
    }
  };

  const allocateModal = () => {
    setSelectedRows([]);
    if (AllocateModal) {
      setAllocateModal(false);
      // setModal(true);
    } else {
      setAllocateModal(true);
      //  setModal(false);
    }
  };

  // const slotModal = () => {
  //   if (modalSlot) {
  //     setmodalSlot(false);
  //     // setModal(true);
  //   } else {
  //     setmodalSlot(true);
  //     fetchTruckData();
  //     //  setModal(false);
  //   }
  // };

  const fetchTruckData = async () => {

    const id_param = document.getElementById("id_param").value;
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/SlocMaster/getSlotTr/${id_param}`, config); // replace with actual API URL
      setTruckData(response.transporter); // adjust if response structure differs
    } catch (error) {
      console.error("Error fetching truck data:", error);
    }
  };
  /**
   * Handling date click on calendar
   */

  const handleDateClick = (arg) => {
    const date = arg["date"];
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const currectDate = new Date();
    const currentHour = currectDate.getHours();
    const currentMin = currectDate.getMinutes();
    const currentSec = currectDate.getSeconds();
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    );

    const modifiedData = { ...arg, date: modifiedDate };

    setSelectedNewDay(date);
    setSelectedDay(modifiedData);
    // toggle();
  };

  const str_dt = function formatDate(date) {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var d = new Date(date),
      month = "" + monthNames[d.getMonth()],
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day + " " + month, year].join(",");
  };

  const date_r = function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  };

  /**
   * Handling click on event on calendar
   */
  const [slotNumber, setSlotNumber] = useState('');
  const handleEventClick = async (arg) => {
    debugger;
    const event = arg.event;
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let transCode = obj.data.transporterCode;

    const event1 = arg.event;
    const slotNumber = event1.extendedProps.slotNumber;
    setSlotNumber(slotNumber);

    const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/slotmaster/getTrSlot/${event.id}`, config);
    const st_date = res.slotDateFromFormatted;
    const ed_date = res.slotDateToFormatted;

    // const selectedTransportersFromRes = transporterdata
    //   .filter(item => res.transporterNames.includes(item.name.trim()))
    //   .map(item => ({
    //     value: item.code,
    //     label: `${item.name.trim()} (${item.code})`
    //   }));
    // setSelectedTransporters(selectedTransportersFromRes);



    const r_date =
      ed_date == null
        ? str_dt(st_date)
        : str_dt(st_date) + " to " + str_dt(ed_date);
    const er_date =
      ed_date == null
        ? date_r(st_date)
        : date_r(st_date) + " to " + date_r(ed_date);
    setSlotDateFrom(date_r(res.slotDateFromFormatted));
    setSlotDateTo(date_r(res.slotDateToFormatted));
    // setSelectedValues(selectedTransportersFromRes.map(item => item.value));
    setEvent({
      id: res.id,
      title: res.title,
      start: res.start,
      end: res.end,
      location: res.location,
      description: res.description,
      defaultDate: er_date,
      slotDateFromFormatted: res.slotDateFromFormatted,
      endTimeFormatted: res.endTimeFormatted,
      startTimeFormatted: res.startTimeFormatted,
      slotDateToFormatted: res.slotDateToFormatted,
      materialName: res.materialName,
      status: res.status,
      plantName: res.plantName,
      noOfTtRq: res.noOfTtRq,
      pendingTruckCount: res.pendingTruckCount,
      materialCode: res.materialCode,
      maxTtCommitTr: res.maxTtCommitTr,
      plantCode: res.plantCode,
      transporterNames: res.transporterNames.join(","),
      remarks: res.remarks,
      startTime: res.startTimeFormatted,
      endTime: res.endTimeFormatted,
      state: res.state,
    });

    setslotModalSize(true);
    setIsEdit(true);
    setIsEditButton(false);
    setCommitSlocModal(false);
    toggle();
  };
  /**
   * On delete event
   */
  const handleDeleteEvent = () => {
    dispatch(onDeleteEvent(event));
    setDeleteModal(false);
    toggle();
  };

  // events validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      //id: (event && event.id) || null,
      defaultDate: (event && event.defaultDate) || "",
      noOfTtRq: (event && event.noOfTtRq) || "",
      materialCode: (event && event.materialCode) || "",
      maxTtCommitTr: (event && event.maxTtCommitTr) || "",
      plantCode: (event && event.plantCode) || "",
      remarks: (event && event.remarks) || "",
      startTime: (event && event.startTimeFormatted) || "",
      endTime: (event && event.endTimeFormatted) || "",
      slotDateFrom: (event && event.slotDateFromFormatted) || "",
      slotDateTo: (event && event.slotDateToFormatted) || "",
      state: (event && event.state) || ""
    },
    validationSchema: Yup.object({
    }),
    onSubmit: (values) => {
      debugger
      console.log(values);
      const totalData = {
        ...values,
        // "startTime": values.startTime,
        // "endTime": values.endTime,
        "transporterCodes": selectedValues,
        // "slotDateFrom": formatDateToYYYYMMDD(values.slotDateFrom),
        "slotDateFrom": slotDateFrom,
        "slotDateTo": slotDateTo,
        // "slotDateTo": formatDateToYYYYMMDD(values.slotDateTo),
      };
      console.log(totalData);
      // Validation for transporter codes
      if (!Array.isArray(selectedValues) || selectedValues.length === 0) {
        setTransporterError(true);
        return;
      } else {
        setTransporterError(false);
      }
      // Validation for slot dates
      if (slotDateFrom === "") {
        setSlotError(true);
        return;
      } else {
        setSlotError(false);
      }

      // If there is an existing slot ID, use PUT, otherwise use POST to create
      const url = event.id ? `${process.env.REACT_APP_LOCAL_URL_8082}/SlocMaster/updateSlot/${event.id}` : `${process.env.REACT_APP_LOCAL_URL_8082}/SlocMaster/create`;

      const method = event.id ? 'put' : 'post';

      try {
        const res = axios({
          method: method,
          url: url,
          data: totalData,
          ...config,
        }).then((res) => {
          if (res.meta.message === 'Slot master created successfully') {
            toast.success("Slot Booked Successfully", { autoClose: 3000 });
            getSlotData();
            //toggle();
          } else if (res.meta.message === 'Slot master updated successfully') {
            toast.success("Slot Updated Successfully", { autoClose: 3000 });
            getSlotData();
          }
        }).catch((error) => {
          console.error("API error:", error);
        });

      } catch (error) {
        console.error("Error during API request:", error);
        toast.error("Something went wrong. Please try again!", { autoClose: 3000 });
      }

      validation.resetForm();

      setSelectedDay(null);
      setSelectedNewDay(null);
      toggle();
    },
  });

  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedTransporters, setSelectedTransporters] = useState([]); // array of full option objects

  useEffect(() => {
    debugger
    if (
      event?.transporterNames?.length > 0 &&
      transporterdata.length > 0 &&
      event?.id // ← Add this condition (you must define it)
    ) {
      const preselected = transporterdata
        .filter(item => event.transporterNames.includes(item.name.trim()))
        .map(item => ({
          value: item.code,
          label: `${item.name.trim()} (${item.code})`,
        }));

      setSelectedTransporters(preselected);
      setSelectedValues(preselected.map(opt => opt.value));
    } else {
      setSelectedTransporters([]);
      setSelectedValues([]);
    }
  }, [transporterdata]);
  // }, [event, transporterdata]);


  // const selectedTransporters = transporterdata
  // .filter(item => validation.values.transporterNames.includes(item.name.trim()))
  // .map(item => ({
  //   value: item.code,
  //   label: `${item.name.trim()} (${item.code})`
  // }));

  const submitOtherEvent = () => {

    setslotModalSize(false);
    document.getElementById("form-event").classList.remove("view-event");

    setIsEditButton(true);
  };

  const onDrop = (event) => {
    const date = event["date"];
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const currectDate = new Date();
    const currentHour = currectDate.getHours();
    const currentMin = currectDate.getMinutes();
    const currentSec = currectDate.getSeconds();
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    );

    const draggedEl = event.draggedEl;
    const draggedElclass = draggedEl.className;
    if (
      draggedEl.classList.contains("external-event") &&
      draggedElclass.indexOf("fc-event-draggable") === -1
    ) {
      const modifiedData = {
        id: Math.floor(Math.random() * 1000),
        title: draggedEl.innerText,
        start: modifiedDate,
        className: draggedEl.className,
      };
      dispatch(onAddNewEvent(modifiedData));
    }
  };

  const getSlotData = () => {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let transCode = obj.data.transporterCode;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/slotmaster/getAllByTransporter?transporterCode=${transCode}`, config)
      .then(res => {
        const result = res;
        setSlotData(result);
      });
  }

  const addOneDay = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0]; // return as YYYY-MM-DD
  };

  const events1 = SlotData.map((item, index) => {
    const day = (index + 1).toString().padStart(2, '0');
    const nextDay = (index + 3).toString().padStart(2, '0'); // spans two dates

    return {
      id: item.id,
      slotNumber: item.slotNumber,
      title: item.plantName,
      state: item.state,
      status: item.status,
      maxTtCommitTr: item.maxTtCommitTr,
      noOfTtRq: item.noOfTtRq,
      // start: `2025-04-${day}`,
      // end: `2025-04-${nextDay}`,
      start: item.slotDateFrom,
      end: addOneDay(item.slotDateTo),
      allDay: true,
      extendedProps: {
        materialId: item.plantName,
      },
    };
  });

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "none",
      borderBottom: state.isFocused ? "2px solid #1890ff" : "1px solid #ccc",
      borderRadius: "0", // removes corner rounding
      boxShadow: "none", // removes default focus shadow
      backgroundColor: "#fff", // optional: your desired background
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#fff',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#bae7ff'
        : state.isFocused
          ? '#e6f7ff'
          : '#fff',
      color: '#000',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#91d5ff',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#000',
    }),
  };

  const InfoRow = ({ iconClass, text }) => (
    <div className="d-flex mb-3">
      <div className="flex-grow-1 d-flex">
        <div className="flex-shrink-0 me-3">
          {/* <i className={`${iconClass} fs-23`}></i> */}
          <img src={iconClass} />
        </div>
        <div className="flex-grow-1">
          <p className="d-block mb-0 text-black" style={{ fontWeight: 500, fontSize: "14px" }}>{text}</p>
        </div>
      </div>
    </div>
  );

  const InfoRowStatus = ({ iconClass, text }) => (
    <div className="d-flex mb-3">
      <div className="flex-grow-1 d-flex">
        <div className="flex-shrink-0 me-3">
          <img src={iconClass} />
        </div>
        <div className="flex-grow-1">
          <span class="new-custom-forbadge" style={{ fontWeight: 500, fontSize: "14px" }}>{text}</span>
        </div>
      </div>
    </div>
  );

  const format = (value, fallback = 'N/A') => {
    return value !== undefined && value !== null && value !== '' ? value : fallback;
  };

  document.title = "Slot Master | EPLMS";
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEvent}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Slot Master" pageTitle="Auction" />
          <Row>
            <Col xs={12}>
              <Row>
                <div className="page-title2">
                  <h6 style={{ color: 'grey' }}>
                    <span>Auction</span>
                    <span style={{ margin: '0 10px' }}>&gt;</span>
                    <span>SLOT Master</span>
                  </h6>
                </div>


                <Col xl={12}>
                  <Card className="card-h-100" style={{ borderRadius: '20px' }}>
                    <CardBody>
                      <div style={{ margin: '0px 0px -33px 0px' }}>
                        <h2 style={{ color: '#000' }}>SLOT Master</h2>
                      </div>
                      {/* <div class="float-end">
                        <Link
                          className="btn btn-success"
                          onClick={toggle}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          New Slot
                        </Link>{" "}
                      </div> */}
                      <br />
                      <br />
                      <div style={{ marginTop: "12px" }}>
                        <FullCalendar
                          plugins={[
                            BootstrapTheme,
                            dayGridPlugin,
                            interactionPlugin
                            //   listPlugin
                          ]}
                          initialView="dayGridMonth"
                          slotDuration={"00:15:00"}
                          handleWindowResize={true}
                          themeSystem="bootstrap"
                          headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,dayGridWeek,dayGridDay",
                          }}
                          events={events1}
                          editable={true}
                          droppable={true}
                          selectable={true}
                          dateClick={handleDateClick}
                          eventClick={handleEventClick}
                          drop={onDrop}
                          dayMaxEvents={2}
                          // moreLinkClick={(info) => {
                          //   multipleEventData();
                          //   // Prevent default popup (optional)
                          //   return "none";
                          // }}
                          moreLinkClick={(info) => {
                            debugger
                            const clickedDateStr = info.date; // e.g., '2025-05-12'
                            const clickedDate = new Date(clickedDateStr);
                            clickedDate.setHours(0, 0, 0, 0); // normalize

                            // Filter only events that occur on the clicked date
                            const eventsForDate = events1.filter(event => {
                              const startDate = new Date(event.start);
                              const endDate = new Date(event.end);

                              // Normalize
                              startDate.setHours(0, 0, 0, 0);
                              endDate.setHours(0, 0, 0, 0);

                              // Check if clicked date is within the range [start, end)
                              return clickedDate >= startDate && clickedDate < endDate;
                            });

                            // Optional: show a warning if no events exist on that day
                            if (eventsForDate.length === 0) {
                              toast.warning("No events on this day.", { autoClose: 3000 });
                              return "none";
                            }
                            multipleEventData(eventsForDate, clickedDateStr); // pass data to your modal/dialog

                            return "none"; // prevent FullCalendar default popup
                          }}
                          eventClassNames={(arg) => {
                            // Example: add a class based on event status or any custom logic
                            const status = arg.event.extendedProps.status; // assuming you have status in event
                            return [
                              "custom-event",                      // default class
                              status === "A" ? "event-status-a" :
                                status === "B" ? "event-status-b" :
                                  "event-status-c"
                            ];
                          }}

                          moreLinkDidMount={(info) => {
                            info.el.innerText = "View All";

                            // Center it using Flexbox styles
                            info.el.style.display = "flex";
                            info.el.style.justifyContent = "center";
                            info.el.style.alignItems = "center";

                            // Style appearance
                            info.el.style.cursor = "pointer";
                            info.el.style.color = "white";
                            info.el.style.backgroundColor = "rgb(20 51 151 / 88%)";
                            info.el.style.borderRadius = "4px";
                            info.el.style.padding = "2px 6px";
                            info.el.style.marginTop = "4px";
                            info.el.style.fontSize = "12px";
                            info.el.style.fontWeight = "bold";
                          }}
                          eventContent={(arg) => {
                            return (
                              <>
                                <span style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  height: '100%',
                                  lineHeight: '12px',
                                }}>
                                  {arg.event.extendedProps.materialId}
                                </span>
                              </>
                            );
                          }}
                        />
                      </div>
                      <ToastContainer closeButton={false} limit={1} />
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <div style={{ clear: "both" }}></div>

              <Modal isOpen={modal} id="event-modal" centered size={slotModalSize ? 'md' : 'lg'} >
                {/* <ModalHeader toggle={toggle} tag="h5" className="p-3 bg-soft-info modal-title">
                  {!!isEdit ? "Edit Slot" : "Add New Slot"}
                </ModalHeader> */}
                {/* {!!isEdit ? "Edit Slot" : "Add New Slot"} */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0px 0px 12px 20px' }}>
                  <h4 className="mt-4 fw-bold" style={{ color: '#000', margin: 0 }}>{slotModalSize ? event?.plantName || '' : event?.id ? 'Update Slot' : 'Add New Slot'}</h4>
                  <button type="button" className="btn-close mt-4 slotCloseModal" onClick={() => toggle()} aria-label="Close"></button>
                </div>



                <hr className="headingnewSlot"></hr>
                <ModalBody>
                  <Form
                    className={
                      !!isEdit
                        ? "needs-validation view-event"
                        : "needs-validation"
                    }
                    //method="post"
                    name="event-form"
                    id="form-event"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >


                    <div className="event-details">
                      <InfoRow iconClass={A1} text={format(event?.transporterNames)} />

                      <InfoRow
                        iconClass={A2}
                        text={
                          <>
                            {format(event?.noOfTtRq)} Truck Required{" / "} {format(event?.pendingTruckCount)} Pending{" "}
                            {/* <i className="ri-eye-fill text-success fs-18 for-truck-css" onClick={slotModal} style={{ lineHeight: 0 }}></i> */}
                          </>
                        }
                      />

                      <InfoRow iconClass={A3} text={`Max. ${format(event?.maxTtCommitTr)} Truck Per Transporter`} />
                      <InfoRow iconClass={A4} text={format(event?.slotDateFromFormatted) + " to " + format(event?.slotDateToFormatted)} />
                      <InfoRow iconClass={A5} text={`${format(event?.startTimeFormatted)} to ${format(event?.endTimeFormatted)}`} />
                      <InfoRow iconClass={A6} text={format(event?.state)} />
                      <InfoRow iconClass={A7} text={format(event?.materialName)} />
                      {/* <InfoRowStatus iconClass={A8} text={format(event?.status)} /> */}
                      <InfoRowStatus
                        iconClass={A8}
                        text={
                          event?.status === 'A'
                            ? 'Assigned'
                            : event?.status === 'B'
                              ? 'Committed'
                              : event?.status === 'C'
                                ? 'Allocated'
                                : format(event?.status)
                        }
                      />

                      <InfoRow iconClass={A9} text={format(event?.remarks)} />
                      <input type="hidden" id="id_param" value={event?.id} />
                    </div>
                    {/* 
                    <div className="hstack gap-2 justify-content-end">
                      {event?.status === 'A' && <button
                        type="submit"
                        className="btn mt-3  custom-blue-button"
                        id="btn-save-event"
                        onClick={() => { setCommitSlocModal(true); setIsEdit(true); setValues([]); setModal(false); }}
                      >
                        Commit SLOC
                      </button>
                      }
                      {event?.status === 'B' && <button
                        type="submit"
                        className="btn mt-3 sm-3 custom-blue-button"
                        id="btn-save-event"
                        onClick={allocateModal}
                      >
                        Allocate Truck
                      </button>}

                    </div> */}

                  </Form>

                  <div className="hstack gap-2 justify-content-end">
                    {event?.status === 'A' && <button
                      type="submit"
                      className="btn mt-3  custom-blue-button"
                      id="btn-save-event"
                      onClick={() => { setCommitSlocModal(true); setIsEdit(true); setValues([]); }}
                    >
                      Commit SLOT
                    </button>
                    }
                    {event?.status === 'B' && <button
                      type="submit"
                      className="btn mt-3 sm-3 custom-blue-button"
                      id="btn-save-event"
                      onClick={allocateModal}
                    >
                      Allocate Truck
                    </button>}

                  </div>
                  <Form>
                    <Row>
                      {CommitSlocModal ?
                        <>
                          <Col lg={12} className="mt-3">
                            <div>
                              <Label className="form-label" >No. of Vehicle Commit</Label><span style={{ color: "red" }}>*</span>
                              <span style={{ float: 'right' }}><Label className="form-label" >No. of Truck Available: </Label>
                              </span>
                              <Input type="number" required className="form-control"
                                name="count"
                                maxlength="15"
                                placeholder="Add No. of Vehcile"
                                value={values.count}
                                onChange={handleInputChange}
                              />
                            </div>
                          </Col>

                          <Row style={{ marginLeft: '13px' }}>
                            <Col lg={12} className="mt-1 text-end">
                              <div>
                                <button
                                  type="submit"
                                  className="btn btn-secondary mt-1"
                                  id="btn-save-event"
                                  onClick={() => { toggle(); }}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="btn btn-success mt-1 ms-2"
                                  id="btn-save-event"
                                  onClick={commitVehicledata}
                                >
                                  Commit
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </>
                        : ""
                      }

                    </Row>
                  </Form>

                </ModalBody>
              </Modal>
            </Col>
          </Row>
        </Container>
      </div >




      <Modal isOpen={OpenModal} id="event-modal" centered size={'md'} >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0px 0px 12px 20px' }}>
          <h4 className="mt-4 fw-bold" style={{ color: '#000', margin: 0 }}>{eventDate}</h4>
          <button type="button" className="btn-close mt-4 slotCloseModal" onClick={() => openModal()} aria-label="Close"></button>
        </div>



        <hr className="headingnewSlot"></hr>
        <ModalBody>
          {
            eventList.map((item, index) => (
              <div key={index} className="card d-flex flex-row shadow-sm border-0" dataid={item.status} style={{ maxWidth: '500px' }}>
                <div style={{
                  backgroundColor: item.status === 'A' ? '#FFBA0C' : item.status === 'B' ? '#0085FF' : "#r0F8704",
                  width: "10px",
                  borderTopLeftRadius: "5px",
                  borderBottomLeftRadius: "5px",
                }}></div>

                <div className="d-flex flex-column justify-content-center align-items-center px-3 text-center" style={{ width: "173px", fontSize: 'large', color: 'black' }}>
                  <small className="fw-semibold">{formatDate(item.start)} - </small>
                  {/* <small className="fw-semibold">{formatDate(item.end)}</small> */}
                  <small className="fw-semibold">
                    {formatDate(new Date(new Date(item.end).setDate(new Date(item.end).getDate() - 1)))}
                  </small>

                </div>

                <div className="border-start px-3 py-2 w-100">
                  <div style={{ display: 'flex' }}>
                    <h6 className="fw-bold mb-2" style={{ color: 'black' }}>{item.title}</h6>
                    <button className="btn btn-success btn-sm" type="button" style={{ marginLeft: 'auto' }} onClick={() => { submitMultiEvent(item.slotNumber); setCommitSlocModal(false); }}>Commit</button>
                  </div>

                  <p className="mb-1"><i className="bi bi-truck"></i> {item.noOfTtRq} Truck Required</p>
                  <p className="mb-1"><i className="bi bi-geo-alt"></i> {item.state}</p>
                  <p className="mb-0"><i className="bi bi-layers"></i>Max. {item.maxTtCommitTr} Truck Per Transporter</p>
                </div>
              </div>
            ))
          }

        </ModalBody>
      </Modal>


      <Modal isOpen={AllocateModal} id="event-modal" centered size={'lg'} >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0px 0px 12px 20px' }}>
          <h4 className="mt-4 fw-bold" style={{ color: '#000', margin: 0 }}>{'Allocate Truck'}</h4>
          <button type="button" className="btn-close mt-4 slotCloseModal" onClick={() => allocateModal()} aria-label="Close"></button>
        </div>


        <ModalBody>
          <div className="card-body pt-0">
            <div>
              <TableContainer
                columns={columns}
                data={AllocateData}
                isGlobalFilter={true}
                isAddUserList={false}
                customPageSize={5}
                isGlobalSearch={true}
                className="custom-header-css"
                SearchPlaceholder='Search for Vehicle No. or something...'
              />
            </div>
            <div className="hstack gap-2 justify-content-end">

              <button
                type="button"
                className="btn btn-success mt-3 sm-3"
                id="btn-save-event"
                onClick={handleAllocateAction}
              >
                Allocate Truck
              </button>
            </div>
            <ToastContainer closeButton={false} limit={1} />
          </div>

        </ModalBody>
      </Modal>



    </React.Fragment >
  );
};

SlocMaster.propTypes = {
  events: PropTypes.any,
  categories: PropTypes.array,
  className: PropTypes.string,
  onGetEvents: PropTypes.func,
  onAddNewEvent: PropTypes.func,
  onUpdateEvent: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onGetCategories: PropTypes.func,
};

export default SlocMaster;
