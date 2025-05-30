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
import './SlotMaster.css';
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

const SlotMaster = () => {
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
  const [MaxTrErrorMsg, setMaxTrErrorMsg] = useState(false);


  const { events, categories, isEventUpdated } = useSelector((state) => ({
    events: state.Calendar.events,
    categories: state.Calendar.categories,
    isEventUpdated: state.Calendar.isEventUpdated,
  }));

  useEffect(() => {
    debugger
    getSlotData();
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


  // const handleCheckboxChange = (value) => {
  //   setSelectedValues((prev) =>
  //     prev.includes(value)
  //       ? prev.filter((v) => v !== value)
  //       : [...prev, value]
  //   );
  // };

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

  const deleteSlotMasterData = () => {
    debugger
    const slotNumber = event.slotNumber;
    axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/slotmaster/deleteBySlotNumber?slotNumber=${slotNumber}`, config)
      .then(res => {
        const result = res;
        if (result.status.msg === "SlotMaster Deleted Successfully") {
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
    const convertTo24HourFormat = (timeStr) => {
      const date = new Date(`1970-01-01T${timeStr}`);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}:00`;
    };
    setSlotDateFrom(date_r(res.slotDateFromFormatted));
    setSlotDateTo(date_r(res.slotDateToFormatted));
    setSelectedValues(selectedTransportersFromRes.map(item => item.value));
    setEvent({
      id: res.id,
      slotNumber: res.slotNumber,
      title: res.title,
      start: res.start,
      end: res.end,
      location: res.location,
      description: res.description,
      // defaultDate: er_date,
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
      startTime: convertTo24HourFormat(res.startTimeFormatted),
      endTime: convertTo24HourFormat(res.endTimeFormatted),
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
  const handleInputChange = (e) => {debugger
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

  // const submitEventData = async (e) => {
  //   e.preventDefault();
  //   debugger;
  //   const totalData = {
  //     ...values,
  //     "transporterCodes": selectedValues,
  //     "slotDateFrom": slotDateFrom,
  //     "slotDateTo": slotDateTo,
  //   }
  //   if (!Array.isArray(selectedValues) || selectedValues.length === 0) {
  //     setTransporterError(true);
  //     return;
  //   } else {
  //     setTransporterError(false);
  //   }

  //   if (slotDateFrom === "") {
  //     setSlotError(true);
  //     return;
  //   } else {
  //     setSlotError(false);
  //   }

  //   const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/slotmaster/create`, totalData, config)
  //   if (res.status.msg === 'SlotMaster Created Successfully') {
  //     toast.success("Slot Booked Successfully", { autoClose: 3000 });
  //     getSlotData();
  //     toggle();
  //   }

  // }
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
    const url = id ? `${process.env.REACT_APP_LOCAL_URL_8082}/slotmaster/updateSlot/${id}` : `${process.env.REACT_APP_LOCAL_URL_8082}/slotmaster/create`;

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
    if (modal) {
      setSelectedTransporters([]);
      setSlotDateFrom('');
      setSlotDateTo('');
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

  const slotModal = () => {
    if (modalSlot) {
      setmodalSlot(false);
      // setModal(true);
    } else {
      setmodalSlot(true);
      fetchTruckData();
      //  setModal(false);
    }
  };

  const fetchTruckData = async () => {

    const id_param = document.getElementById("id_param").value;
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/slotmaster/getSlotTr/${id_param}`, config); // replace with actual API URL
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
  const handleEventClick = async (arg) => {
    debugger;
    const event = arg.event;
    const slotNumber = event.extendedProps.slotNumber;

    const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/slotmaster/getSlot/${slotNumber}`, config);
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
    const convertTo24HourFormat = (timeStr) => {
      const date = new Date(`1970-01-01T${timeStr}`);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}:00`;
    };

    setSlotDateFrom(date_r(res.slotDateFromFormatted));
    setSlotDateTo(date_r(res.slotDateToFormatted));
    setSelectedValues(selectedTransportersFromRes.map(item => item.value));
    setEvent({
      id: res.id,
      slotNumber: res.slotNumber,
      title: res.title,
      start: res.start,
      end: res.end,
      location: res.location,
      description: res.description,
      // defaultDate: er_date,/
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
      startTime: convertTo24HourFormat(res.startTimeFormatted),
      endTime: convertTo24HourFormat(res.endTimeFormatted),
      state: res.state,
    });

    setslotModalSize(true);
    setIsEdit(true);
    setIsEditButton(false);
    toggle();
  };
  /**
   * On delete event
   */
  const handleDeleteEvent = () => {
    dispatch(onDeleteEvent(event));
    deleteSlotMasterData();
    setDeleteModal(false);
    setOpenModal(false);
    toggle();
  };

  // events validation
  const convertTo24HourFormat = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return "";

    const [time, modifier] = timeStr.trim().split(" ");
    if (!time || !modifier) return "";

    let [hours, minutes] = time.split(":");
    if (!hours || !minutes) return "";

    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    } else if (modifier.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed

    enableReinitialize: true,
    initialValues: {
      //id: (event && event.id) || null,
      // defaultDate: (event && event.defaultDate) || "",
      noOfTtRq: (event && event.noOfTtRq) || "",
      materialCode: (event && event.materialCode) || "",
      maxTtCommitTr: (event && event.maxTtCommitTr) || "",
      plantCode: (event && event.plantCode) || "",
      remarks: (event && event.remarks) || "",
      startTime: convertTo24HourFormat(event && event.startTimeFormatted) || "",
      endTime: convertTo24HourFormat(event && event.endTimeFormatted) || "",
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
      const url = event.id ? `${process.env.REACT_APP_LOCAL_URL_8082}/slotmaster/updateSlot/${event.slotNumber}` : `${process.env.REACT_APP_LOCAL_URL_8082}/slotmaster/create`;

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
      setOpenModal(false);

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

    // document
    //   .getElementById("event-title")
    //   .classList.replace("d-none", "d-block");
    // document
    //   .getElementById("event-category")
    //   .classList.replace("d-none", "d-block");
    // document
    //   .getElementById("event-start-date")
    //   .parentNode.classList.remove("d-none");
    // document
    //   .getElementById("event-start-date")
    //   .classList.replace("d-none", "d-block");
    // document
    //   .getElementById("event-location")
    //   .classList.replace("d-none", "d-block");
    // document
    //   .getElementById("event-description")
    //   .classList.replace("d-none", "d-block");
    // document
    //   .getElementById("event-description1")
    //   .classList.replace("d-none", "d-block");
    // document
    //   .getElementById("event-start-date-tag")
    //   .classList.replace("d-block", "d-none");
    // document
    //   .getElementById("event-location-tag")
    //   .classList.replace("d-block", "d-none");
    // document
    //   .getElementById("event-description-tag")
    //   .classList.replace("d-block", "d-none");

    setIsEditButton(true);
  };

  /**
   * On category darg event
   */
  //   const onDrag = (event) => {
  //     event.preventDefault();
  //   };

  /**
   * On calendar drop event
   */


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
        Header: "",
        accessor: "expander", // For expand/collapse icon
        disableSortBy: true,
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? (
              <i className="ri-arrow-down-s-fill" ></i>
            ) : (
              <i className="ri-arrow-right-s-fill"></i>
            )}
          </span>
        ),
      },
      {
        Header: "Transporter Code",
        accessor: "transporterCode",
        filterable: false,
      },
      {
        Header: "Transporter Name",
        accessor: "transporterName",
        filterable: false,
      },
      {
        Header: "Contact Person",
        accessor: "contactPerson",
        filterable: false,
      },
      {
        Header: "No. of Truck Committed",
        accessor: "maxNoTtComm",
        filterable: false,
      },
    ],
    []
  );





  // Customers Column
  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: '',
  //       accessor: 'id',
  //       hiddenColumns: true,
  //       Cell: (cell) => {
  //         return <input type="hidden" value={cell.value} />;
  //       }
  //     },
  //     {
  //       Header: "Transporter Code",
  //       accessor: "code",
  //       filterable: false,
  //     },
  //     {
  //       Header: "Transporter Name",
  //       accessor: "name",
  //       filterable: false,
  //     }, {
  //       Header: "Contact Person",
  //       accessor: "code1",
  //       filterable: false,
  //     },
  //     {
  //       Header: "No of Truck Committed",
  //       accessor: "name1",
  //       filterable: false,
  //     },
  //     {
  //       Header: "View",
  //       Cell: (cellProps) => {
  //         return (
  //           <ul className="list-inline hstack gap-2 mb-0">
  //             <li className="list-inline-item edit" title="View">
  //               <Link
  //                 to="#"
  //                 className="text-primary d-inline-block edit-item-btn"
  //                 onClick={() => { }}
  //               ><i className="ri-eye-fill fs-23"></i>
  //               </Link>
  //             </li>
  //           </ul>
  //         );
  //       }
  //     }

  //   ],
  // );



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
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/slotmaster/getAllSlots`, config)
      .then(res => {
        const result = res;
        setSlotData(result);
      });
  }

  const addOneDay = (dateStr) => {debugger
    const date = new Date(dateStr);
    // date.setDate(date.getDate());
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
      // end: item.slotDateTo,
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
                      <div class="float-end">
                        <Link
                          //   to="/apps-ecommerce-add-product"
                          className="btn btn-success"
                          onClick={() => { toggle(); setSelectedTransporters([]); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          New Slot
                        </Link>{" "}
                      </div>
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
                              return clickedDate >= startDate && clickedDate <= endDate;
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
                            <i className="ri-eye-fill text-success fs-18 for-truck-css" onClick={slotModal} style={{ lineHeight: 0 }}></i>
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
                      <input type="hidden" id="id_param" value={event?.slotNumber} />
                    </div>

                    <Row className="event-details1">
                      {/* <Col xs={12}>
                        <div className="mb-3">
                          <Label className="form-label">Type</Label>
                          <Input
                            className={
                              !!isEdit
                                ? "form-select d-none"
                                : "form-select d-block"
                            }
                            name="category"
                            id="event-category"
                            type="select"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.category || ""}
                          >
                            <option value="bg-soft-danger">Danger</option>
                            <option value="bg-soft-success">Success</option>
                            <option value="bg-soft-primary">Primary</option>
                            <option value="bg-soft-info">Info</option>
                            <option value="bg-soft-dark">Dark</option>
                            <option value="bg-soft-warning">Warning</option>
                          </Input>
                          {validation.touched.category &&
                            validation.errors.category ? (
                            <FormFeedback type="invalid">
                              {validation.errors.category}
                            </FormFeedback>
                          ) : null}

                        </div>
                      </Col> */}
                      <Col lg={4}>
                        <div>
                          <Label className="form-label fw-bold" style={{ fontSize: 'medium' }} >Depot SLOT</Label><span style={{ color: "red" }}>*</span>
                          <Input
                            name="plantCode"
                            type="select"
                            className="form-select slotmasterCss"
                            value={validation.values.plantCode || ""}
                            onChange={handleInputChange}
                            required
                          >
                            <option value=""> -- Select Depot -- </option>
                            {plantdata.map((item, key) => (
                              <option value={item.plantCode} key={key}>{item.plantName}</option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                      <Col lg={8}>
                        <div className="transporterSlection" >
                          <Label className="form-label fw-bold" style={{ fontSize: 'medium' }}  >Transporter</Label><span style={{ color: "red" }}>*</span>

                          <Select className="slotmasterCss"
                            options={transporterdata.map(item => ({
                              value: item.code,
                              label: `${item.name.trim()} (${item.code})`,
                            }))}
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            isMulti
                            styles={customStyles}
                            value={selectedTransporters} // ← pre-checked options
                            components={{ Option: CustomOption }}
                            selectedValues={selectedValues} // custom prop
                            onCheckboxChange={handleCheckboxChange} // custom handler
                            onChange={(selectedOptions, actionMeta) => {debugger
                              // Only handle REMOVE action to support "X" button
                              if (actionMeta.action === "remove-value" || actionMeta.action === "pop-value" || actionMeta.action === "clear") {
                                const safeSelected = selectedOptions || [];
                                setSelectedTransporters(safeSelected);
                                setSelectedValues(safeSelected.map(opt => opt.value));
                                validation.setFieldValue(
                                  "transporterNames",
                                  safeSelected.map(opt => opt.label.split(' (')[0])
                                );
                              }
                            }}

                          />
                          <span style={{ color: "red", animation: "blink 1s infinite" }}>{TransporterError ? "Select Aleast one Transporter" : ""}</span>
                        </div>
                      </Col>
                      <Col lg={4} className="mt-3">
                        <div>
                          <Label className="form-label fw-bold" style={{ fontSize: 'medium' }}  >Material</Label><span style={{ color: "red" }}>*</span>
                          <Input
                            name="materialCode"
                            type="select"
                            className="form-select slotmasterCss"
                            value={validation.values.materialCode || ""}
                            onChange={handleInputChange}
                            required
                          >
                            <option value=""> -- Select Material -- </option>
                            {materialData.map((item, key) => (
                              <option value={item.code} key={key}>{item.name}</option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                      <Col lg={4} className="mt-3">
                        <div>
                          <Label className="form-label fw-bold" style={{ fontSize: 'medium' }}  >State</Label><span style={{ color: "red" }}>*</span>
                          <Input
                            name="state"
                            type="select"
                            className="form-select slotmasterCss"
                            value={validation.values.state || ""}
                            onChange={handleInputChange}
                            required
                          >
                            <option value=""> -- Select State -- </option>
                            {stateData.map((item, key) => (
                              <option value={item.stateName} key={key}>{item.stateName}</option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                      <Col lg={4} className="mt-3">
                        <div>
                          <Label className="form-label fw-bold" style={{ fontSize: 'medium' }}  >No. of Truck Required</Label><span style={{ color: "red" }}>*</span>
                          <Input type="number" required className="form-control slotmasterCss"
                            name="noOfTtRq"
                            maxlength="15"
                            placeholder="Add Truck"
                            value={validation.values.noOfTtRq}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                      <Col lg={4} className="mt-3">
                        <div>
                          <Label className="form-label fw-bold" style={{ fontSize: 'medium' }}  >Max. Truck Commit by TR</Label>
                          <Input type="number"  className="form-control slotmasterCss"
                            name="maxTtCommitTr"
                            maxlength="15"
                            placeholder="Add Truck"
                            value={validation.values.maxTtCommitTr}
                            // onChange={handleInputChange}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (value <= validation.values.noOfTtRq || e.target.value === '') {
                                handleInputChange(e);
                                setMaxTrErrorMsg(false);
                              } else {
                                setMaxTrErrorMsg(true);
                              }
                            }}
                          />
                          {MaxTrErrorMsg && <span style={{ color: "red" }}>Max. Truck should be less than Total no. Truck Required</span>}

                        </div>
                      </Col>
                      <Col xs={4} className="mt-3">
                        <div className="mb-3 ">
                          <Label className="fw-bold" style={{ fontSize: 'medium' }} >Slot Date</Label><span style={{ color: "red" }}>*</span>
                          <div
                            className="input-group"
                          >
                            <Flatpickr
                              className="form-control slotmasterCss"
                              id="event-start-date"
                              // name="defaultDate"
                              placeholder="Select Date"
                              // value={validation.values.defaultDate || ""}
                              value={
                                slotDateFrom && slotDateTo
                                  ? [new Date(slotDateFrom), new Date(slotDateTo)]
                                  : []
                              }
                              options={{
                                mode: "range",
                                dateFormat: "Y-m-d",
                                minDate: "today",
                              }}
                              // onChange={(date) => {
                              //   setSelectedNewDay(date);
                              // }}
                              onChange={(date) => {
                                if (date && date.length > 0) {
                                  const formatDate = (d) => {
                                    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
                                  };

                                  const startDate = formatDate(date[0]);
                                  const endDate = date[1] ? formatDate(date[1]) : null;


                                  setSlotDateFrom(startDate);
                                  setSlotDateTo(endDate);
                                }
                              }}

                            />
                            {/* <span className="input-group-text">
                              <i className="ri-calendar-event-line"></i>
                            </span> */}

                          </div>
                          <span style={{ color: "red", animation: "blink 1s infinite" }}>{SlotError ? "Choose Slot Date" : ""}</span>

                        </div>
                      </Col>
                      <Col md={4} className="mt-3">
                        <Label htmlFor="validationDefault04" style={{ fontSize: 'medium' }} className="form-label fw-bold">Start Time</Label>
                        <div className="">
                          <Flatpickr
                            className="form-control slotmasterCss"
                            name="startTime"
                            options={{
                              enableTime: true,
                              noCalendar: true,
                              dateFormat: "h:i K", // 12-hour with AM/PM
                              time_24hr: true,
                              enableSeconds: false,
                            }}
                            value={validation.values.startTime}
                            // onChange={(date) => {
                            //   validation.setFieldValue("startTime", formatTime(date[0]));
                            //   handleInputChange({
                            //     target: {
                            //       name: 'startTime',
                            //       value: date[0], // Send the selected date (time) to the input change handler
                            //     },
                            //   });
                            // }}
                            onChange={(date) => {
                              const formattedTime = formatTime(date[0]);
                              validation.setFieldValue("startTime", formattedTime);
                            }}
                          />

                        </div>
                      </Col>
                      <Col md={4} className="">
                        <Label htmlFor="validationDefault04" style={{ fontSize: 'medium' }} className="form-label fw-bold">End Time</Label>
                        <div className="">
                          <Flatpickr
                            className="form-control slotmasterCss"
                            name="endTime"
                            options={{
                              enableTime: true,
                              noCalendar: true,
                              dateFormat: "h:i K", // 12-hour with AM/PM
                              time_24hr: true,
                              enableSeconds: false
                            }}
                            value={validation.values.endTime}
                            // onChange={(date) => {
                            //   validation.setFieldValue("endTime", formatTime(date[0]));
                            //   handleInputChange({
                            //     target: {
                            //       name: 'endTime',
                            //       value: date[0], // Send the selected date (time) to the input change handler
                            //     },
                            //   });
                            // }}
                            onChange={(date) => {
                              const formattedTime = formatTime(date[0]);
                              validation.setFieldValue("endTime", formattedTime);
                            }}
                          />
                        </div>
                      </Col>
                      <Col lg={4} className="">
                        <div>
                          <Label className="form-label fw-bold" style={{ fontSize: 'medium' }}  >Remarks</Label><span style={{ color: "red" }}>*</span>
                          <Input type="text" required className="form-control slotmasterCss"
                            name="remarks"
                            maxlength="150"
                            placeholder="Enter Remarks"
                            value={validation.values.remarks}
                            title={validation.values.remarks}
                            onChange={validation.handleChange}
                          />
                        </div>
                      </Col>
                      <Input type="hidden" id="update_event_id" value={validation.values.slotNumber} />
                      {/* <Col xs={12}>
                        <div className="mb-3">
                          <Label 
                           className={
                            !!isEdit
                              ? "form-label d-none"
                              : "form-label d-block"
                          }
                           id="event-description1"
                          >Description</Label>
                          <textarea
                            className={
                              !!isEdit
                                ? "form-control d-none"
                                : "form-control d-block"
                            }
                            id="event-description"
                            name="description"
                            placeholder="Enter a description"
                            rows="3"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.description || "No Description"}
                          // invalid={
                          //   validation.touched.description &&
                          //   validation.errors.description
                          //     ? true
                          //     : false
                          // }
                          ></textarea>
                          {validation.touched.description &&
                            validation.errors.description ? (
                            <FormFeedback type="invalid">
                              {validation.errors.description}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col> */}
                    </Row>
                    {event?.status === 'B' ? '' :

                      <div className="hstack gap-4 justify-content-end">
                        <div className="hstack gap-4 justify-content-end event-details">
                          <button
                            type="button"
                            className="btn btn-soft-danger"
                            id="btn-delete-event"
                            style={{ fontWeight: 'bold' }}
                            onClick={() => { setDeleteModal(true); }}
                          >
                            Delete
                          </button>
                        </div>
                        <button
                          type="button"
                          className="btn btn-soft-success event-details"
                          id="btn-delete-event"
                          style={{ fontWeight: 'bold' }}

                          onClick={(e) => {
                            e.preventDefault();
                            submitOtherEvent();
                            return false;
                          }}
                        >
                          {/* <i className="ri-close-line align-bottom"></i> */}
                          Edit
                        </button>

                      </div>

                    }

                    <div className="hstack gap-4 justify-content-end event-details1">
                      <button
                        type="button"
                        className="btn btn-success mt-3 text-black"
                        id="btn-save-event"
                        style={{ background: '#80808052' }}
                        onClick={() => { toggle(); }}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn btn-success mt-3"
                        id="btn-save-event"
                        style={{ background: '#1511a2f0' }}
                      // onClick={submitEventData}
                      >
                        {!!isEdit ? "Edit Event" : "Submit"}
                      </button>

                    </div>

                  </Form>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        </Container>
      </div >

      <Modal id="showModal" isOpen={modalSlot} toggle={slotModal} centered size="lg">
        <ModalHeader className="bg-light p-3" toggle={slotModal}>Edit Details </ModalHeader>
        {/* <Form className="tablelist-form" onSubmit={handleSubmit}> */}
        <ModalBody>

          <div className="card-body pt-0">
            <div>

              <TableContainer
                columns={columns}
                data={TruckData}
                isGlobalFilter={true}
                isAddUserList={false}
                customPageSize={5}
                useExpanded={true} // Optional: if your component is configurabl
                isGlobalSearch={true}
                className="custom-header-css"
                SearchPlaceholder='Search for Transporter Name or something...'
              />
            </div>
            {/* <ToastContainer closeButton={false} limit={1} /> */}
          </div>
        </ModalBody>
        {/* <ModalFooter> */}
        {/* </ModalFooter> */}
        {/* </Form> */}
      </Modal>


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
                  // backgroundColor: "rgb(10 179 156)",
                  backgroundColor: item.status === 'A' ? "#FF9F2D" : item.status === 'B' ? '#0085FF' : '#0F8704',
                  width: "10px",
                  borderTopLeftRadius: "5px",
                  borderBottomLeftRadius: "5px",
                }}></div>

                <div className="d-flex flex-column justify-content-center align-items-center px-3 text-center" style={{ width: "173px", fontSize: 'large', color: 'black' }}>
                  <small className="fw-semibold">{formatDate(item.start)} - </small>
                  {/* <small className="fw-semibold">{formatDate(item.end)}</small> */}
                  <small className="fw-semibold">
                    {formatDate(new Date(item.end).setDate(new Date(item.end).getDate() - 1))}
                  </small>
                   
                </div>

                <div className="border-start px-3 py-2 w-100">
                  <div style={{ display: 'flex' }}>
                    <h6 className="fw-bold mb-2" style={{ color: 'black' }}>{item.title}</h6>
                    <button className="btn btn-success btn-sm" type="button" style={{ marginLeft: 'auto' }} onClick={() => submitMultiEvent(item.slotNumber)}>Edit</button>
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


    </React.Fragment >
  );
};

SlotMaster.propTypes = {
  events: PropTypes.any,
  categories: PropTypes.array,
  className: PropTypes.string,
  onGetEvents: PropTypes.func,
  onAddNewEvent: PropTypes.func,
  onUpdateEvent: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onGetCategories: PropTypes.func,
};

export default SlotMaster;
