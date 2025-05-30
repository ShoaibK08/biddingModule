import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, Button, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Collapse, Spinner } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import DeleteModal from "../../../BreadCrumbComponents/Common/DeleteModal";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import '../../Sequencing/Sequencing.css';
import logoDark from "../../../assets/images/no_data.png";

import classnames from "classnames";
import CollapsiblePanel from "../../../Components/Common/CollapsiblePanel";
import TextArea from "antd/es/input/TextArea";

const initialValues = {
  vehicleNumberFirst: "",
  vehicleNumber: "",
  gateNumber: "",
  vehicleNumberStage: "",
  remarks: "",
  tare_weight_kg: "",
  gross_weight_kg: ""
};



const BcpDashboard = () => {
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [deleteModal, setDeleteModal] = useState(false);
  const [HeaderName, setHeaderName] = useState("");
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [stageData, setStageData] = useState([]);
  const [checkboxValue, setCheckboxvalue] = useState("");
  const [flag, setFlag] = useState(false);
  const [flag1, setFlag1] = useState(false);
  const [tripFlag, setErrorTrip] = useState(false);
  const [tripFlag_cancel, setErrorTripCancel] = useState(false);
  const [inputFlag, setInputFlag] = useState(true);
  const [selectedStage, setSelectedStage] = useState("");
  const [result, setCurrentresult] = useState({});
  const [cancelFlag, setCancelFlag] = useState(false);
  const [error, setError] = useState(false);
  const [errorFirst, setErrorFirst] = useState(false);
  const [vehicleAllData, setVehicleAllData] = useState({});
  const [FirstContainerFlag, setFirstContainerFlag] = useState(false);
  const [noStageError, setNoSatgeError] = useState(false);
  const [latestHeader, setLatestHeader] = useState('');
  const [errorParameter, setErrorParameter] = useState(false);
  const [errorParameterIGP, setErrorParameterIGP] = useState(false);
  const [PGIModalData, setPGIModalData] = useState([]);



  const collapse = false;
  const collapse1 = true;
  const [isCollapse, setIsCollapse] = useState(collapse);
  const [icon, setIcon] = useState("las la-angle-down");
  const [isCollapse1, setIsCollapse1] = useState(collapse1);
  const [icon1, setIcon1] = useState("las la-angle-up");

  const [PlantCodeNew, setPlantCode1] = useState('');

  const firstCollapse = () => {
    setIsCollapse(!isCollapse);
    setIcon(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
    setIsCollapse1(false);
    setIcon1("las la-angle-down");
    setCancelFlag(false);
    setErrorTrip(false);
  };

  const secondCollapse = () => {
    setIsCollapse1(!isCollapse1);
    setIcon1(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
    setIsCollapse(false);
    setIcon("las la-angle-down");
    setFirstContainerFlag(false);
    removeClass();
  };

  const animate = collapse => {
    setIsCollapse(collapse);
    setIcon(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
  };

  const animate1 = collapse1 => {
    setIsCollapse1(collapse1);
    setIcon1(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
  };

  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    animate(!collapse);
  }, [collapse]);

  useEffect(() => {
    animate1(!collapse1);
  }, [collapse1]);

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: process.env.REACT_APP_API_USER_NAME,
      password: process.env.REACT_APP_API_PASSWORD,
    },
  };

  const status = [
    {
      options: [
        { label: "Select Movement", value: "" },
        { label: "InBound", value: "IB" },
        { label: "OutBound", value: "OB" },
      ],
    },
  ];



  const getVehicleDetails = (e) => {
    e.preventDefault();
    setFirstContainerFlag(false);
    setFlag(false);
    getStageData();
    setSelectedClient('');
    setGrossWeightFlag(flag);
    setSelectedStage('');
    setVehicleAllData({});
    const rem = { remarks: "", tare_weight_kg: "" }
    setValues({ ...values, ...rem });
    console.log(values);
    const stage = values.Sequencing;
    const vehicleNumber = values.vehicleNumberFirst;
    setErrorParameter(true);
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/${vehicleNumber}/${PlantCodeNew}/${stage}`, config)
      .then(res => {
        if (res.msg && res.msg.includes("No Active data")) {
          setErrorFirst(true);
          setFlag1(false);
          setErrorTrip(false);
          setFirstContainerFlag(false);
          setErrorParameter(false);
        }
        else if (res.msg && res.msg.includes("Trip is not found")) {
          setErrorFirst(false);
          setFlag1(false);
          setErrorTrip(true);
          setInputFlag(false);
          setFirstContainerFlag(true);
          setErrorParameter(false);
        }
        else {
          const result1 = res;
          setVehicleAllData(result1)
          setPGIModalData(result1.pgiDetails);
          setErrorFirst(false);
          setErrorTrip(false);
          setFlag1(false);
          setInputFlag(true);
          setFirstContainerFlag(true);
          setErrorParameter(false);

          setTimeout(() => {
            const cur_stg = res.curr_location;
            //const filteredArray = stageData.filter(element => element.name === cur_stg);
            const allElements = document.getElementsByClassName(cur_stg);
            allElements[0].classList.add('yourClassName');
            const icon = document.querySelector('.yourClassName');
            const btn = icon.parentNode.parentNode.parentNode;
            btn.style.background = "#d8fce2";
          }, 1000);

          setInputs(res.pgiDetails.map(detail => ({
            diNumber: detail.diNumber || '',
            pgiNumber: detail.pgiNumber || '',
            pgiDate: detail.pgiDate || ''
          })));
        }
      })
  };

  const removeClass = () => {

    const allElements = document.getElementsByClassName(vehicleAllData.curr_location);
    allElements[0].classList.remove('yourClassName');
  }

  const viewStage = (e) => {

    e.preventDefault();
    const rem = { remarks: "" }
    setValues({ ...values, ...rem });
    const vehicleNumberStage = values.vehicleNumberStage;
    const stage = values.Sequencing;
    setErrorParameter(true);
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/${vehicleNumberStage}/${PlantCodeNew}/${stage}`, config)
      .then(res => {
        if (res.msg && res.msg.includes("No Active data")) {
          setError(true);
          setErrorParameter(false);
        }
        else if (res.msg && res.msg.includes("Trip is not found")) {
          setErrorTripCancel(true);
          setCancelFlag(false);
          setErrorParameter(false);
        }
        else {
          const result = res;
          setCurrentresult(result)
          setCancelFlag(true);
          setError(false);
          setErrorTripCancel(false);
          setErrorParameter(false);
        }

      })

  };

  const cancelStage = (e) => {

    e.preventDefault();
    cancelStageModalFunction();
  };

  const submitCancel = () => {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let userId = obj.data._id;
    const value = {
      "vehicleNumber": values.vehicleNumberStage,
      "locationName": result.curr_location,
      "remarks": "cancel_" + values.remarks,
      "plantCode": PlantCodeNew,
      "userId": userId

    }
    setErrorParameter(true);
    axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp`, value, config)
      .then(res => {
        if (res) {
          toast.success(res.message, { autoClose: 3000 });
          setCancelFlag(false);
          cancelStageModalFunction();
          setErrorParameter(false);
        }
        else {
          toast.error("Failed to cancel.", { autoClose: 3000 });
          setErrorParameter(false);
        }

      })
  }

  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  <DeleteModal
    //   show={deleteModal}
    //   onDeleteClick={handleDeleteCustomer}
    onCloseClick={() => setDeleteModal(false)}
  />
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  useEffect(() => {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    setPlantCode1(plantcode);
    //getHeaderName();
    //getStageData();
  }, []);

  // const getHeaderName = () => {
  //   const main_menu = sessionStorage.getItem("main_menu_login");
  //   const obj = JSON.parse(main_menu).menuItems[34].subMenuMaster.name;
  //   setHeaderName(obj);
  // }

  const getStageData = () => {
    const stage = values.Sequencing;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/movementType/${stage}/${PlantCodeNew}`, config)
      .then(res => {
        const result = res;
        if (res && res.msg) {
          setNoSatgeError(true);
        } else {
          setNoSatgeError(false);
          setStageData(result);
          const filteredArray = result.filter(element => element.name === "GATE-OUT");
          filteredArray.forEach(object => {
            object.color = 'red';
          });
        }

      });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'igpNumber' && value.length > 10) {
      return;
    }
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
    });
  };

  const handleSubmit = async (e) => {

    if (!checkboxValue) {
      setFlag(true);
    }
    else {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let userId = obj.data._id;
      const data = {
        "vehicleNumber": values.vehicleNumberFirst,
        "remarks": values.remarks,
        "stage": selectedStage,
        "plantCode": PlantCodeNew,
        "userId": userId

      }
      setErrorParameter(true);
      axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/updateStage`, data, config)
        .then(res => {
          if (res) {
            if (res.error === "negative") {
              toast.error(res.message, { autoClose: 3000 });
              removeClass();
              //setFirstContainerFlag(false);
              getVehicleDetails(e);
              tog_togFirst();
              setErrorParameter(false);
            }
            else {
              toast.success(res.message, { autoClose: 3000 });
              removeClass();
              //setFirstContainerFlag(false);
              getVehicleDetails(e);
              tog_togFirst();
              setErrorParameter(false);
            }
          }
          else {
            toast.error("Failed to update.", { autoClose: 3000 });
            setErrorParameter(false);
          }
        });
    }

    e.preventDefault();

  }

  const [GWFlag, setGrossWeightFlag] = useState(false);
  const [twDetails, setTWDetails] = useState(false);
  function tareWeightDetails() {
    const vehicleNumber = values.vehicleNumberFirst;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/trip/${vehicleNumber}/${PlantCodeNew}`, config)
      .then(res => {
        if (res) {
          setTWDetails(res);
        }
        else {
          toast.error("Failed to fetch data.", { autoClose: 3000 });
        }
      });
  }

  const stageDetails = stageData.map(function (data, idx) {

    const handleAddress = (event) => {
      setYIValues({});
      var value = event.target.value;
      setSelectedStage(value);
      if (value === vehicleAllData.curr_location) {
        setFlag(true);
      }
      else if (!vehicleAllData.curr_location && inputFlag) {
        setFlag1(true);
      }
      // else if (value === "WB-1 (TW)") {
      //   setGrossWeightFlag(false);
      //   tareWeightDetails();
      //   tareWeightModalFn();
      // }
      else if (value === "YARD-IN") {
        yardInModalFn();
        setErrorTrip(false);
      }
      // else if (value === "WB-1 (GW)") {
      //   setGrossWeightFlag(true);
      //   tareWeightDetails();
      //   tareWeightModalFn();
      // }
      else {
        setFlag(false);
        setFlag1(false);
        tog_togFirst();
      }
      setCheckboxvalue(value)
    };
    return ([
      <Col lg={2} sm={2} key={idx} className="mt-2 mb-2" style={{width:"19.66%" }}>
        <div className="form-check card-radio">
          <Input
            id={data.id}
            name="shippingAddress"
            type="radio"
            className="form-check-input"
            value={data.locationName}
            onClick={handleAddress}
            // disabled={data.locationName <= vehicleAllData.curr_location}
            disabled={!inputFlag ? data.locationName !== "YARD-IN" : idx <= (stageData.findIndex(x => x.locationName === vehicleAllData.curr_location) - 1)}
          />
          <Label
            className="form-check-label shadow_light"
            htmlFor={data.id}
          >
            <div >
              <Card className="mb-1 ribbon-box ribbon-fill ribbon-sm shadow_light">
                <div className={`ribbon ribbon-info element ${data.locationName}`} data-value={data.locationName}> <i className="ri-truck-line" ></i> </div>
                <CardBody style={{ padding: "10px 0px 5px 0", textAlign: "center" }}>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="fs-12 mb-1">{data.locationName}</h6>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Label>
          <i className="text-success ri-arrow-right-line fs-20 fw-bold" id="hide" style={{ position: "absolute", top: "19px", right: "-22px", display: (data.locationName === "GATE-OUT") ? "none" : "block" }}></i>
        </div>
      </Col>
    ]);
  });

  const [YIButton, setButtonYI] = useState(true);
  const [tagDetails, setTagDetails] = useState([]);
  const [plantCode, setPlantCode] = useState('');
  const [modal_togFirst, setmodal_togFirst] = useState(false);
  function tog_togFirst() {
    setmodal_togFirst(!modal_togFirst);
  }

  const [TWModal, setTWModal] = useState(false);
  function tareWeightModalFn() {
    setTWModal(!TWModal);
  }

  const [cancelStageModal, setcancelStageModal] = useState(false);
  function cancelStageModalFunction() {
    setcancelStageModal(!cancelStageModal);
  }

  const [PGIModal, setPGIModal] = useState(false);
  function PGIModalFunction() {
    setPGIModal(!PGIModal);
  }

  const [YIModal, setYIModal] = useState(false);
  function yardInModalFn() {
    const vehicleNumber = values.vehicleNumberFirst;
    setErrorParameter(true);
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/getTagInformation/${vehicleNumber}/${PlantCodeNew}`, config)
      .then(res => {
        if (res && res.length !== 0) {
          setTagDetails(res);
          setPlantCode(res[0].plantCode ? res[0].plantCode : "")
          setErrorParameter(false);
        }
        else {
          toast.error("Tag not mapped with this vehicle.", { autoClose: 3000 });
          setErrorParameter(false);
        }
      });
    setYIModal(!YIModal);
  }

  const [YIvalues, setYIValues] = useState({});
  const handleYIChange = (e) => {
    const { name, value } = e.target;
    if (name === "remarks" && value.length > 0) {
      setButtonYI(false);
    }
    else if (name === "remarks" && value.length === 0) {
      setButtonYI(true);
    }
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let userId = obj.data._id;
    setYIValues({
      ...YIvalues,
      [name]: value || value.valueAsNumber,
      ['vehicleNumber']: values.vehicleNumberFirst,
      ['stage']: "YARD-IN",
      ['plantCode']: PlantCodeNew,
      ["userId"]: userId
    });
  };

  const handleYISubmit = (e) => {

    e.preventDefault();
    console.log(YIvalues);
    setErrorParameter(true);
    if (YIvalues.tagId) {
      axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/updateYardIn`, YIvalues, config)
        .then(res => {
          if (res && (res.message).includes('An error occurred')) {
            toast.error(res.message, { autoClose: 3000 });
            setYIModal(false);
            setErrorTrip(false);
            //setFirstContainerFlag(false);
            getVehicleDetails(e);
            setErrorParameter(false);
          }
          else if (res && (res.message).includes('Unable to create trip')) {
            toast.error(res.message, { autoClose: 3000 });
            setYIModal(false);
            setErrorTrip(false);
            //setFirstContainerFlag(false);
            getVehicleDetails(e);
            setErrorParameter(false);
          }
          else {
            toast.success(res.message, { autoClose: 3000 });
            setYIModal(false);
            setErrorTrip(false);
            //setFirstContainerFlag(false);
            getVehicleDetails(e);
            setErrorParameter(false);
          }
        })
    }
    else {
      toast.error("Tag Id not available.", { autoClose: 3000 });
      setErrorParameter(false);
    }

  }

  const [TWRemarks, setSelectedClient] = useState('');

  function handleTWRemarksChange(event) {
    setSelectedClient(event.target.value);
  }

  const handleTWSubmit = (e) => {

    e.preventDefault();
    if (!GWFlag) {
      const TWvalues = {
        "vehicleNumber": twDetails.vehicleNumber,
        "stage": "WB-1 (TW)",
        "tw": parseFloat(values.tare_weight_kg),
        "remarks": TWRemarks,
        'plantCode': PlantCodeNew,
      }
      console.log(TWvalues);
      setErrorParameter(true);
      axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/updateWeight`, TWvalues, config)
        .then(res => {
          if (res) {
            toast.success(res.message, { autoClose: 3000 });
            setTWModal(false);
            setErrorTrip(false);
            //setFirstContainerFlag(false);
            getVehicleDetails(e);
            setErrorParameter(false);
          }
          else {
            toast.error("Failed to change stage.", { autoClose: 3000 });
            setErrorParameter(false);
          }
        })
    }
    else {
      const GWvalues = {
        "vehicleNumber": twDetails.vehicleNumber,
        "stage": "WB-1 (GW)",
        "gw": parseFloat(values.gross_weight_kg),
        "remarks": TWRemarks,
        'plantCode': PlantCodeNew,
      }
      console.log(GWvalues);
      setErrorParameter(true);
      axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/updateWeight`, GWvalues, config)
        .then(res => {
          if (res) {
            toast.success(res.message, { autoClose: 3000 });
            setTWModal(false);
            setErrorTrip(false);
            //setFirstContainerFlag(false);
            getVehicleDetails(e);
            setErrorParameter(false);
          }
          else {
            toast.error("Failed to change stage.", { autoClose: 3000 });
            setErrorParameter(false);
          }
        })
    }
  }

  const addIGPFunction = async (e) => {
    const data = {
      ['igpNumber']: values.igpNumber,
      ['vehicleNumber']: vehicleAllData.vehiclenumber,
      ['plantCode']: PlantCodeNew,
    }
    console.log(data);
    setErrorParameterIGP(true);
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/update-igp`, data, config)
        .then(res => {
          if (res) {
            toast.success("IGP Number updated successfully.", { autoClose: 3000 });
            getVehicleDetails(e);
            setErrorParameterIGP(false);
          }
          else {
            toast.error("Failed to update.", { autoClose: 3000 });
            setErrorParameterIGP(false);
          }
        })
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setErrorParameterIGP(false);
    }
  }

  const [inputs, setInputs] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (PGIModalData.length > 0) {
      const initialInputs = PGIModalData.map(item => ({
        ...item,
        pgiDate: item.pgiDate ? new Date(item.pgiDate) : new Date()
      }));
      setInputs(initialInputs);
    }
  }, [PGIModalData]);


  const handleInputChange1 = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };
  const handleDateChange = (index, selectedDates) => {
    const newInputs = [...inputs];
    newInputs[index].pgiDate = selectedDates[0];
    setInputs(newInputs);
  };

  const PGISubmitFunction = async (pgiDate, pgiNumber, diNumber, index) => {
    console.log(`Submitting PGI data for index ${index}:`, { pgiDate, pgiNumber, diNumber });
    let formattedDate;

    // Check if the pgiDate is a string
    if (typeof pgiDate === 'string') {
      // Check if the date is in "Wed May 29 2024 18:00:00 GMT+0530 (India Standard Time)" format
      if (pgiDate.includes('GMT')) {
        const dateObj = new Date(pgiDate);
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const seconds = dateObj.getSeconds().toString().padStart(2, '0');
        formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      } else {
        // If it's already in ISO format "2024-05-27T18:44:58"
        formattedDate = pgiDate;
      }
    } else {
      // If pgiDate is already a Date object, convert it to the desired format directly
      const year = pgiDate.getFullYear();
      const month = (pgiDate.getMonth() + 1).toString().padStart(2, '0');
      const day = pgiDate.getDate().toString().padStart(2, '0');
      const hours = pgiDate.getHours().toString().padStart(2, '0');
      const minutes = pgiDate.getMinutes().toString().padStart(2, '0');
      const seconds = pgiDate.getSeconds().toString().padStart(2, '0');
      formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }
    const data = {
      ['pgiDate']: formattedDate,
      ['pgiNumber']: pgiNumber ? pgiNumber : "",
      diNumber,
      ['vehicleNumber']: vehicleAllData.vehiclenumber,
      ['plantCode']: PlantCodeNew,
    }
    console.log(data);
    try {
      await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/updatePgi`, data, config)
        .then(res => {
          if (res) {
            // Set the message for the specific row
            const newMessages = [...messages];
            newMessages[index] = `Submitted Successfully with DI Number: ${diNumber}`;
            setMessages(newMessages);
            setTimeout(() => {
              // Clear the message after 3 seconds
              const updatedMessages = [...messages];
              updatedMessages[index] = '';
              setMessages(updatedMessages);
            }, 3000);
            getfreshData();
          }
          else {
            toast.error("Failed to update.", { autoClose: 3000 });
          }

        })
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
    }
  };

  const getfreshData = () => {
    setFirstContainerFlag(false);
    setFlag(false);
    getStageData();
    setSelectedClient('');
    setGrossWeightFlag(flag);
    setSelectedStage('');
    setVehicleAllData({});
    const rem = { remarks: "", tare_weight_kg: "" }
    setValues({ ...values, ...rem });
    console.log(values);
    const stage = values.Sequencing;
    const vehicleNumber = values.vehicleNumberFirst;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/${vehicleNumber}/${PlantCodeNew}/${stage}`, config)
      .then(res => {
        const result1 = res;
        setVehicleAllData(result1);
        setPGIModalData(result1.pgiDetails);
        setErrorFirst(false);
        setErrorTrip(false);
        setFlag1(false);
        setInputFlag(true);
        setFirstContainerFlag(true);

        setTimeout(() => {
          const cur_stg = res.curr_location;
          //const filteredArray = stageData.filter(element => element.name === cur_stg);
          const allElements = document.getElementsByClassName(cur_stg);
          allElements[0].classList.add('yourClassName');
          const icon = document.querySelector('.yourClassName');
          const btn = icon.parentNode.parentNode.parentNode;
          btn.style.background = "#d8fce2";
        }, 1000);

        setInputs(res.pgiDetails.map(detail => ({
          diNumber: detail.diNumber || '',
          pgiNumber: detail.pgiNumber || '',
          pgiDate: detail.pgiDate || ''
        })));
      })
  };


  // document.title = HeaderName + " || EPLMS";
  document.title = "BCP Dashboard | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title={"BCP Dashboard"} pageTitle="EPLMS" />

          <Row>
            <Col xxl={12}>
              <div className="">
                <h6
                  className="text-muted text-color-blue bg-primary text-uppercase fw-semibold"
                  onClick={() => firstCollapse()}
                >
                  <span className="margin-left">{"RFID BCP"}</span> <i style={{ float: "right" }} className={icon} />
                </h6>
                <Collapse className="" isOpen={isCollapse}>
                  <Card id="company-overview">
                    {vehicleAllData.serialNo && 
                    <div className="bg-light token_css shadow_light">
                      <p className="m-0">Token No : {vehicleAllData.serialNo}</p>
                    </div>
                    }
                    <Form className="tablelist-form" onSubmit={getVehicleDetails} name="Doc_form">
                      <Row className="p-3 pb-4 g-3 pt-1 mt-2 mb-0">
                        <Col md={3}>
                          <Label htmlFor="validationDefault03" className="form-label fw-bold">Movement Type<span style={{ color: "red" }}>*</span></Label>
                          <Input
                            name="Sequencing"
                            type="select"
                            className="form-select"
                            value={values.Sequencing}
                            onChange={handleInputChange}
                            required
                          >
                            {status.map((item, key) => (
                              <React.Fragment key={key}>

                                {/* <option value={item.value}>{item.label}</option> */}
                                {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                              </React.Fragment>
                            ))}
                          </Input>
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Vehicle Number<span style={{ color: "red" }}>*</span></Label>
                          <Input type="text" required className="form-control"
                            id="val13"
                            name="vehicleNumberFirst"
                            placeholder="Enter Vehicle Number"
                            value={values.vehicleNumberFirst}
                            onChange={handleInputChange}
                          />
                        </Col>
                        <Col md={4}>
                          <button type="submit" className="btn btn-success" style={{ marginTop: "29px" }} >{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Loading...</> : "Get Details"}</button>
                          {/* {tripFlag && <button type="button" className="btn btn-warning ms-3" style={{ marginTop: "29px" }} onClick={() => { yardInModalFn(); }}>Yard-In</button>} */}
                        </Col>

                        {errorFirst && <p className="mt-4 mb-0" style={{ color: "red" }}>Vehicle not found!</p>}
                        {flag1 && <p className="mt-3 mb-0" style={{ color: "red" }}>Please enter valid vehicle number</p>}
                        {tripFlag && <p className="mt-4 mb-0" style={{ color: "red", animation: "blink 1s infinite" }}>Trip is not found for this vehicle number. Click on Yard-In for stage Update.</p>}
                      </Row>
                    </Form>
                    {FirstContainerFlag &&
                      <>
                        {inputFlag &&
                          <>
                            <Row className="p-3 g-3 mb-0 pt-1">
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label fw-bold">Current Stage</Label>
                                <Input type="text" disabled className="form-control"
                                  id="val13"
                                  name="currentStageUP"
                                  value={vehicleAllData.curr_location}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              {/* <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label fw-bold">Date & Time</Label>
                                <Input type="text" disabled className="form-control"
                                  id="val14"
                                  name="time"
                                  value={(vehicleAllData.current_location_time).replace('T', ' ')}
                                  onChange={handleInputChange}
                                />
                              </Col> */}
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label fw-bold">Next Stage</Label>
                                <Input type="text" disabled className="form-control"
                                  id="val14"
                                  name="nextStage"
                                  value={vehicleAllData.next_location ? vehicleAllData.next_location : "N/A"}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              {vehicleAllData.igpDetails ? (
                                <>
                                  <Col md={3}>
                                    <Label htmlFor="igpNumber" className="form-label fw-bold">IGP Number</Label>
                                    <Input
                                      type="number"
                                      className="form-control"
                                      id="igpNumber"
                                      name="igpNumber"
                                      value={vehicleAllData.igpDetails.igpNumber || values.igpNumber || ''}
                                      disabled={!!vehicleAllData.igpDetails.igpNumber}
                                      onChange={handleInputChange}
                                    />
                                    {!vehicleAllData.igpDetails.igpNumber && <p className="mt-3 mb-0" style={{ color: "red", animation: "blink 1s infinite" }}>*IGP missing. Please add here..</p>}
                                  </Col>
                                  {!vehicleAllData.igpDetails.igpNumber && (
                                    <Col md={2}>
                                      <button
                                        type="button"
                                        className="btn btn-success"
                                        style={{ marginTop: "29px" }}
                                        onClick={addIGPFunction}
                                        disabled={!values.igpNumber}
                                      >
                                        {errorParameterIGP ? <><Spinner size="sm" className='me-2 visible'></Spinner>Submitting...</> : "Add IGP"}
                                      </button>
                                    </Col>
                                  )}
                                </>
                              ) : null}
                            </Row>
                          </>
                        }
                        {noStageError ? <p className="ms-3" style={{ color: "red" }}>No stages found for this vehicle</p> :
                          <Row className="p-3 pt-0">
                            <p className="mt-0 fw-bold">Please select next stage<span style={{ color: "red" }}>*</span>
                              {vehicleAllData &&
                                vehicleAllData.curr_location?.includes("GW") && (
                                  vehicleAllData.pgiDetails?.some(detail => !detail.pgiNumber || !detail.pgiDate) ? (
                                    <>
                                      <span
                                        className="badge text-uppercase badge-soft-success shadow border border-success cursor-pointer bcp_badge"
                                        style={{ float: "right", margin: "2px 30px 0px 15px" }}
                                        onClick={() => { PGIModalFunction(); }}
                                      >
                                        Add Invoice Details
                                      </span>
                                      <span
                                        className=""
                                        style={{ color: "red", animation: "blink 1s infinite", float: "right", display: "flex" }}
                                      >
                                        Invoice Details Missing
                                        <i className="ri-arrow-right-circle-line ms-1"></i>
                                      </span>
                                    </>
                                  ) : (
                                    <span
                                      className="badge text-uppercase badge-soft-success shadow border border-success cursor-pointer bcp_badge"
                                      style={{ float: "right", margin: "2px 30px 0px 15px" }}
                                      onClick={() => { PGIModalFunction(); }}
                                    >
                                      <i className="ri-eye-line"></i> &nbsp;Invoice Details
                                    </span>
                                  )
                                )
                              }
                            </p>
                            <Row className="pt-0 pb-0 ps-3 pe-3">
                              {stageDetails}
                            </Row>
                            {flag && <p style={{ color: "red" }}>Duplicate Stage</p>}
                          </Row>
                        }
                      </>
                    }
                  </Card>
                </Collapse>
              </div>
            </Col>

            <Col xxl={12}>
              <div className="">
                <h6
                  className="text-muted text-color-blue bg-primary text-uppercase fw-semibold"
                  onClick={() => secondCollapse()}
                >
                  <span className="margin-left">{"Cancel Stage || RFID BCP"}</span> <i style={{ float: "right" }} className={icon1} />
                </h6>
                <Collapse className="" isOpen={isCollapse1}>
                  <Card id="company-overview">
                    <Row className="p-3 g-3 mb-0 pt-1 mt-3">
                      <Form className="tablelist-form d-inline-flex" onSubmit={viewStage} name="Doc_form">
                      <Col md={3}>
                          <Label htmlFor="validationDefault03" className="form-label fw-bold">Movement Type<span style={{ color: "red" }}>*</span></Label>
                          <Input
                            name="Sequencing"
                            type="select"
                            className="form-select"
                            value={values.Sequencing}
                            onChange={handleInputChange}
                            required
                          >
                            {status.map((item, key) => (
                              <React.Fragment key={key}>

                                {/* <option value={item.value}>{item.label}</option> */}
                                {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                              </React.Fragment>
                            ))}
                          </Input>
                        </Col>
                        <Col md={3} className="ms-3">
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Vehicle Number<span style={{ color: "red" }}>*</span></Label>
                          <Input type="text" required className="form-control"
                            id="val13"
                            name="vehicleNumberStage"
                            placeholder="Enter Vehicle Number"
                            value={values.vehicleNumberStage}
                            onChange={handleInputChange}
                          />
                        </Col>
                        <Col md={1} className="ms-3"><button type="submit" className="btn btn-success" style={{ marginTop: "29px" }}>Get Stage</button></Col>
                      </Form>
                      {error && <p className="mt-2" style={{ color: "red" }}>Vehicle not found!</p>}
                      {tripFlag_cancel && <p className="mt-4 mb-0" style={{ color: "red", animation: "blink 1s infinite" }}>Trip is not found for this vehicle number.</p>}

                      {/* cancel stage */}

                      {cancelFlag &&
                        <Form className="tablelist-form d-inline-flex" onSubmit={cancelStage} name="cancel_form">
                          <Col md={3} className="">
                            <Label htmlFor="validationDefault44" className="form-label fw-bold">Current Stage</Label>
                            <Input type="text" disabled className="form-control"
                              id="val13"
                              name="currentStage"
                              value={result.curr_location}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={3} className="ms-3">
                            <Label htmlFor="validationDefault44" className="form-label fw-bold">Previous Stage</Label>
                            <Input type="text" disabled className="form-control"
                              id="val13"
                              name="nextStage"
                              value={result.previous_location}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={3} className="ms-3">
                            <Label htmlFor="validationDefault04" className="form-label fw-bold">Remarks<span style={{ color: "red" }}>*</span></Label>
                            <Input type="text" required className="form-control"
                              id="val13"
                              name="remarks"
                              placeholder="Enter Remarks"
                              value={values.remarks}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={2} className="ms-3"><button type="submit" className="btn btn-danger" style={{ marginTop: "29px" }}>Previous Stage</button></Col>
                        </Form>
                      }
                    </Row>
                  </Card>
                </Collapse>
              </div>
            </Col>
          </Row>
        </Container>
        <ToastContainer closeButton={false} limit={1} />
      </div>

      <Modal isOpen={modal_togFirst} toggle={() => { tog_togFirst(); }} id="firstmodal" centered backdrop={"static"}>
        <ModalHeader toggle={() => { tog_togFirst(); }} className='bg-light p-3 pb-2 pt-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-dark">{selectedStage}</h5>
        </ModalHeader>
        <ModalBody className="text-center p-3 pb-5">
          <lord-icon src="https://cdn.lordicon.com/uetqnvvg.json" trigger="loop" colors="primary:#405189,secondary:#0ab39c" style={{ width: "85px", height: "85px" }} ></lord-icon>
          <div className="pt-3">
            <h4>Do you want to change stage?</h4>
            <Row>
              <h6 className="pt-3">CURRENT STAGE : {vehicleAllData.curr_location}</h6>
              <h6 className="mb-3">SELECTED STAGE : {selectedStage}</h6>
            </Row>
            <Form className="tablelist-form p-3 pb-0 pt-0" onSubmit={handleSubmit}>
              <Row className="g-3 ps-4 mt-2">
                <Col md={8} className="m-0 text-start">
                  <Label htmlFor="validationDefault01" className="form-label fs-16 fw-bold">Remarks<span style={{ color: "red" }}>*</span></Label>
                  <TextArea type="text" required className="form-control"
                    name="remarks"
                    id="validationDefault01"
                    placeholder="Enter Remarks"
                    rows={1}
                    value={values.remarks}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col md={4} className="hstack" style={{ marginTop: "29px" }}>
                  <button type="submit" className="btn btn-success" disabled={errorParameter}>{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Loading...</> : "Change Stage"}</button>
                </Col>
              </Row>
            </Form>
            {/* <Button color="warning" onClick={handleSubmit}>
              Change Stage
            </Button> */}
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={YIModal} toggle={() => { yardInModalFn(); }} id="firstmodal" centered size="lg" >
        {/* <ModalHeader className="modal-title" id="exampleModalToggleLabel" toggle={() => { tareWeightModalFn(); }}>TARE-WEIGHT</ModalHeader> */}
        <ModalHeader toggle={() => { yardInModalFn(); }} className='bg-light p-3 pb-2 pt-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-dark">{"YARD-IN"}</h5>
        </ModalHeader>
        <ModalBody className="text-center">
          <Form className="" onSubmit={handleYISubmit} name="cancel_form">
            <Row className="p-3">
              <Col md={6} className="border border-top-0 border-bottom-0 border-start-0">
                <Row>
                  <h6 className="mb-3">Please Select Tag Id<span style={{ color: "red" }}>*</span></h6>
                </Row>
                {tagDetails.map((item, key) => (
                  <div className="cus_css_rad" key={key}>
                    <label className="custom-radio">
                      {item.tagId ?
                        <>
                          <input type="radio" name="tagId" value={item.tagId} onChange={handleYIChange} required />
                          <span className="custom-radio-button"></span>
                          {item.tagId}
                        </> : <p className="m-0" style={{ color: "red" }}>"No Tags Available"</p>
                      }
                    </label>
                  </div>
                ))}
                <Row>
                  <h6 className="mb-2 mt-2">Remark<span style={{ color: "red" }}>*</span></h6>
                  <textarea className="txt_ar_css" name="remarks" rows={1} cols={40} placeholder="Please enter remark." value={YIvalues.remarks} onChange={handleYIChange} required />
                </Row>
              </Col>
              <Col md={6}>
                <lord-icon src="https://cdn.lordicon.com/uetqnvvg.json" trigger="loop" colors="primary:#405189,secondary:#0ab39c" style={{ width: "85px", height: "85px" }} ></lord-icon>
                <div className="pt-3">
                  <Row>
                    <h6 className="mb-3">SELECTED STAGE : {"YARD-IN"}</h6>
                  </Row>
                  <Button type="submit" color="success" disabled={YIButton || errorParameter} >  {errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Loading...</> : "Change Stage"}</Button>
                  <Button type="button" className="btn btn-light ms-2" onClick={() => { yardInModalFn(); }}>  Close </Button>
                </div>
              </Col>
            </Row>
          </Form>

        </ModalBody>
      </Modal>

      <Modal isOpen={TWModal} toggle={() => { tareWeightModalFn(); }} id="firstmodal" centered size="xl" >
        {/* <ModalHeader className="modal-title" id="exampleModalToggleLabel" toggle={() => { tareWeightModalFn(); }}>TARE-WEIGHT</ModalHeader> */}
        <ModalHeader toggle={() => { tareWeightModalFn(); }} className='bg-light p-3 pb-2 pt-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-dark">{GWFlag ? "GROSS-WEIGHT" : "TARE-WEIGHT"}</h5>
        </ModalHeader>
        {/* <Form className="tablelist-form p-3 pb-0 pt-0" onSubmit={handleSubmit}>
          <Row className="g-3 ps-4 mt-2">
            <Col md={4}>
              <Label htmlFor="validationDefault01" className="form-label fs-16 fw-bold">Please Enter Remarks<span style={{ color: "red" }}>*</span></Label>
              <TextArea type="text" required className="form-control"
                name="remarks"
                id="validationDefault01"
                placeholder="Enter Remarks"
                rows={1}
                value={TWRemarks}
                onChange={handleTWRemarksChange}
              />
            </Col>
            <Col md={2} className="hstack" style={{ marginTop: "45px" }}>
              <button type="submit" className="btn btn-success">Submit</button>
            </Col>
          </Row>
        </Form> */}

        <Form className="tablelist-form" onSubmit={handleTWSubmit}>
          <ModalBody>
            <Row className="g-3 p-3 pb-4 pt-1">
              <Col md={3}>
                <Label htmlFor="validationDefault01" className="form-label">Vehicle Number</Label>
                <Input type="text" className="form-control"
                  name="vehicleNumber"
                  id="validationDefault01"
                  disabled
                  maxlength="100"
                  value={twDetails.vehicleNumber}
                />
              </Col>
              {/* <Col md={3}>
                <Label htmlFor="validationDefault01" className="form-label">Current Stage</Label>
                <Input type="text" className="form-control"
                  name="curr_location"
                  id="validationDefault01"
                  disabled
                  maxlength="100"
                  value={vehicleAllData.curr_location}
                />
              </Col>
              <Col md={3}>
                <Label htmlFor="validationDefault01" className="form-label">Next Stage</Label>
                <Input type="text" className="form-control"
                  name="next_location"
                  id="validationDefault01"
                  disabled
                  maxlength="100"
                  value={vehicleAllData.next_location}
                />
              </Col> */}
              <Col md={3}>
                <Label htmlFor="validationDefault01" className="form-label">Product</Label>
                <Input type="text" className="form-control"
                  name="materialType"
                  id="validationDefault01"
                  disabled
                  maxlength="100"
                  value={twDetails.materialType}
                />
              </Col>
              <Col md={3}>
                <Label htmlFor="validationDefault01" className="form-label">DI Number</Label>
                <Input type="text" className="form-control"
                  name="diNumber"
                  id="validationDefault01"
                  disabled
                  maxlength="100"
                  value={twDetails.diNumber}
                />
              </Col>
              <Col md={3}>
                <Label htmlFor="validationDefault01" className="form-label">{`TW(As per DI)MT`}</Label>
                <Input type="text" className="form-control"
                  name="tare_weight"
                  id="validationDefault01"
                  disabled
                  maxlength="100"
                  value={twDetails.tare_weight}
                />
              </Col>
              <Col md={3}>
                <Label htmlFor="validationDefault01" className="form-label">{`GW(As per DI)MT`}</Label>
                <Input type="text" className="form-control"
                  name="gross_weight"
                  id="validationDefault01"
                  disabled
                  maxlength="100"
                  value={twDetails.gross_weight}
                />
              </Col>
              <Col md={3}>
                <Label htmlFor="validationDefault01" className="form-label">Capacity MT</Label>
                <Input type="text" required className="form-control"
                  name="capacityAmt"
                  id="validationDefault01"
                  disabled
                  maxlength="100"
                  value={twDetails.gross_weight - twDetails.tare_weight}
                />
              </Col>
              {!GWFlag &&
                <>
                  <Col md={3}>
                    <Label htmlFor="validationDefault01" className="form-label">{`Tare Weight(Actual in Kg)`} <span style={{ color: "red" }}>*</span></Label>
                    <Input type="number" required className="form-control"
                      name="tare_weight_kg"
                      id="validationDefault01"
                      placeholder="Enter Tare Weight"
                      maxlength="100"
                      value={values.tare_weight_kg}
                      onChange={handleInputChange}
                    />
                  </Col>

                  <Col md={3}>
                    <Label htmlFor="validationDefault01" className="form-label">Remarks<span style={{ color: "red" }}>*</span></Label>
                    <TextArea type="text" required className="form-control"
                      name="remarks"
                      id="validationDefault01"
                      placeholder="Enter Remarks"
                      rows={1}
                      value={TWRemarks}
                      onChange={handleTWRemarksChange}
                    />
                  </Col>
                </>
              }
              {GWFlag &&
                <>
                  <Col md={3}>
                    <Label htmlFor="validationDefault01" className="form-label">{`Tare Weight(Actual in Kg)`}</Label>
                    <Input type="number" required className="form-control"
                      name="tare_weight_kg"
                      id="validationDefault01"
                      maxlength="100"
                      disabled
                      value={twDetails.tw}
                    />
                  </Col>
                  <Col md={3}>
                    <Label htmlFor="validationDefault01" className="form-label">{`Gross Weight(Actual in Kg)`} <span style={{ color: "red" }}>*</span></Label>
                    <Input type="number" required className="form-control"
                      name="gross_weight_kg"
                      id="validationDefault01"
                      placeholder="Enter Gross Weight"
                      maxlength="100"
                      value={values.gross_weight_kg}
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col md={3}>
                    <Label htmlFor="validationDefault01" className="form-label">{`Net Weight(Kg)`}</Label>
                    <Input type="text" required className="form-control"
                      name="capacityAmt"
                      id="validationDefault01"
                      disabled
                      maxlength="100"
                      value={(twDetails.tw - values.gross_weight_kg) ? (twDetails.tw - values.gross_weight_kg) : 0}
                    />
                  </Col>
                  <Col md={3}>
                    <Label htmlFor="validationDefault01" className="form-label">Remarks<span style={{ color: "red" }}>*</span></Label>
                    <TextArea type="text" required className="form-control"
                      name="remarks"
                      id="validationDefault01"
                      placeholder="Enter Remarks"
                      rows={1}
                      value={TWRemarks}
                      onChange={handleTWRemarksChange}
                    />
                  </Col>
                </>
              }
              {!GWFlag &&
                <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                  <Button type="submit" color="success" disabled={TWRemarks === ''} >  {errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Loading...</> : "Change Stage"}</Button>
                  <Button type="button" className="btn btn-light ms-2" onClick={() => { tareWeightModalFn(); }}>  Close </Button>
                </Col>
              }
              {GWFlag &&
                <Col md={6} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                  <Button type="submit" color="success" disabled={TWRemarks === ''} >  {errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Loading...</> : "Change Stage"}</Button>
                  <Button type="button" className="btn btn-light ms-2" onClick={() => { tareWeightModalFn(); }}>  Close </Button>
                </Col>
              }
            </Row>
          </ModalBody>
        </Form>
      </Modal>

      <Modal isOpen={cancelStageModal} toggle={() => { cancelStageModalFunction(); }} id="firstmodal" centered >
        <ModalHeader toggle={() => { cancelStageModalFunction(); }} className='bg-light p-3 pb-2 pt-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-dark">{"Previous Stage"}</h5>
        </ModalHeader>
        <ModalBody className="text-center p-3 pb-5">
          <lord-icon src="https://cdn.lordicon.com/uetqnvvg.json" trigger="loop" colors="primary:#405189,secondary:#0ab39c" style={{ width: "85px", height: "85px" }} ></lord-icon>
          <div className="pt-3">
            <h4>Do you want to change stage?</h4>
            <Row className="g-3 ps-4 mt-2">

              <Col className="text-center" style={{ marginTop: "29px" }}>
                <Button type="button" className="btn btn-success" onClick={submitCancel} disabled={errorParameter}>{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Loading...</> : "Change Stage"}</Button>
              </Col>
            </Row>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={PGIModal} toggle={() => { PGIModalFunction(); }} id="firstmodal" centered backdrop={"static"} size="lg">
        <ModalHeader toggle={() => { PGIModalFunction(); }} className='bg-light p-3 pb-2 pt-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-dark">{"Add Details"}</h5>
        </ModalHeader>
        <ModalBody className="text-center p-3 pb-5">
          {PGIModalData && PGIModalData.map((detail, index) => (
            <Row className="p-3 g-3 mb-0 pt-1" key={index}>
              <Col md={3}>
                <Label htmlFor={`diNumber-${index}`} className="form-label fw-bold">
                  DO Number {index + 1}
                </Label>
                <Input
                  type="number"
                  className="form-control"
                  id={`diNumber-${index}`}
                  name="diNumber"
                  value={detail.diNumber || inputs[index].diNumber}
                  onChange={(e) => handleInputChange1(index, 'diNumber', e.target.value)}
                  disabled={!!detail.diNumber}
                />
              </Col>
              <Col md={3}>
                <Label htmlFor={`pgiNumber-${index}`} className="form-label fw-bold">
                  PGI Number {index + 1}
                </Label>
                <Input
                  type="number"
                  className="form-control"
                  id={`pgiNumber-${index}`}
                  name="pgiNumber"
                  value={detail.pgiNumber || inputs[index].pgiNumber}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue.length <= 10) { // Replace 5 with the desired maximum length
                      handleInputChange1(index, 'pgiNumber', newValue);
                    }
                  }}
                  disabled={!!detail.pgiNumber}
                />
              </Col>
              {detail.pgiDate ? (
                <Col md={4}>
                  <Label htmlFor={`pgiDate-${index}`} className="form-label fw-bold">
                    PGI Date & Time
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id={`pgiDate-${index}`}
                    name="pgiDate"
                    value={detail.pgiDate.replace("T", " ")}
                    disabled={!!detail.pgiDate}
                  />
                </Col>
              ) : (
                <Col md={4}>
                  <Label htmlFor={`pgiDate-${index}`} className="form-label">PGI Date & Time</Label>
                  <Flatpickr
                    className="form-control"
                    data-enable-time
                    id={`pgiDate-${index}`}
                    placeholder="Select PGI Date"
                    value={detail.pgiDate}
                    options={{
                      enableTime: true,
                      dateFormat: "Y-m-d H:i",
                      maxDate: "today" // Disable dates after the current date
                    }}
                    onChange={(selectedDates) => handleDateChange(index, selectedDates)}
                  />
                </Col>
              )}
              {(!detail.pgiDate || !detail.pgiNumber || !detail.diNumber) && (
                <Col md={2}>
                  <button
                    type="button"
                    className="btn btn-success waves-effect waves-light border border-success"
                    onClick={() => PGISubmitFunction(inputs[index].pgiDate, inputs[index].pgiNumber, inputs[index].diNumber, index)}
                    style={{ marginTop: "29px" }}
                  >
                    Submit
                  </button>
                </Col>
              )}
              {messages[index] && (
                <Row className="mb-0">
                  <Col md={12} className="p-2 pb-0">
                    <div className="alert alert-success p-1 mt-2 mb-0" role="alert">
                      {messages[index]}
                    </div>
                  </Col>
                </Row>
              )}
            </Row>
          ))}
        </ModalBody>
      </Modal>

      {/* <h6 className="pt-3">CURRENT STAGE : {vehicleAllData.curr_location}</h6>
                    <h6 className="mb-3">SELECTED STAGE : {selectedStage}</h6> */}

    </React.Fragment>
  );
};

export default BcpDashboard;
