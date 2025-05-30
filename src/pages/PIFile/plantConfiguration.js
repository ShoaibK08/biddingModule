import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, Button, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Collapse, Spinner } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextArea from "antd/es/input/TextArea";
import LoaderNew from "../../Components/Common/Loader_new";


const PlantConfiguration = () => {
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState({});
  const [valuesSetParameter, setValuesSetParameter] = useState({});
  const [valuesTimeParameter, setValuesTimeParameter] = useState({});
  const [commonConfiguration, setValuesCommonConfiguration] = useState({});
  const [valuesTW, setValuesTW] = useState({});
  const [masterStageName, setMasterStageName] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [tripFlag, setErrorTrip] = useState(false);
  const [cancelFlag, setCancelFlag] = useState(false);
  const [error, setError] = useState(false);
  const [latestHeader, setLatestHeader] = useState('');
  const [Plant_Code, setPlantCode] = useState('');

  const [errorParameter, setErrorParameter] = useState(false);
  const [loader, setloader] = useState(false);


  const collapse = false;
  const collapse1 = true;
  const collapse2 = true;
  const collapse3 = true;
  const collapse4 = true;
  const collapse5 = true;
  const [isCollapse, setIsCollapse] = useState(collapse);
  const [icon, setIcon] = useState("las la-angle-down");
  const [isCollapse1, setIsCollapse1] = useState(collapse1);
  const [icon1, setIcon1] = useState("las la-angle-up");
  const [isCollapse2, setIsCollapse2] = useState(collapse2);
  const [icon2, setIcon2] = useState("las la-angle-up");
  const [isCollapse3, setIsCollapse3] = useState(collapse3);
  const [icon3, setIcon3] = useState("las la-angle-up");
  const [isCollapse4, setIsCollapse4] = useState(collapse4);
  const [icon4, setIcon4] = useState("las la-angle-up");
  const [isCollapse5, setIsCollapse5] = useState(collapse5);
  const [icon5, setIcon5] = useState("las la-angle-up");

  const firstCollapse = () => {
    getParameterData(Plant_Code)
    setIsCollapse(!isCollapse);
    setIcon(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
    setIsCollapse1(false);
    setIsCollapse2(false);
    setIsCollapse3(false);
    setIcon1("las la-angle-down");
    setCancelFlag(false);
    setErrorTrip(false);
  };

  const secondCollapse = () => {
    getIdealParameterData();
    setIsCollapse1(!isCollapse1);
    setIcon1(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
    setIsCollapse(false);
    setIsCollapse2(false);
    setIsCollapse3(false);
    setIcon("las la-angle-down");
  };

  const thirdCollapse = () => {
    getTimeParameterData();
    setIsCollapse2(!isCollapse2);
    setIcon2(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
    setIsCollapse(false);
    setIsCollapse1(false);
    setIsCollapse3(false);
    setIcon("las la-angle-down");
  };


  const forthCollapse = () => {
    getCurrentMonthData();
    setIsCollapse3(!isCollapse3);
    setIcon3(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
    setIsCollapse(false);
    setIsCollapse1(false);
    setIsCollapse2(false);
    setIcon("las la-angle-down");
  };
  const animate = collapse => {
    setIsCollapse(collapse);
    setIcon(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
  };

  const fifthCollapse = () => {
    getIGPStageData();
    setIsCollapse4(!isCollapse4);
    setIcon4(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
    setIsCollapse(false);
    setIsCollapse1(false);
    setIsCollapse2(false);
    setIsCollapse3(false);
    setIcon("las la-angle-down");
  };

  const sixthCollapse = () => {
    getTWConfigData();
    setIsCollapse5(!isCollapse5);
    setIcon5(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
    setIsCollapse(false);
    setIsCollapse1(false);
    setIsCollapse2(false);
    setIsCollapse3(false);
    setIsCollapse4(false);
    setIcon("las la-angle-down");
  };

  const animate1 = collapse1 => {
    setIsCollapse1(collapse1);
    setIcon1(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
  };

  const animate2 = collapse2 => {
    setIsCollapse2(collapse2);
    setIcon2(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
  };

  const animate3 = collapse3 => {
    setIsCollapse3(collapse3);
    setIcon3(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
  };

  const animate4 = collapse4 => {
    setIsCollapse4(collapse4);
    setIcon4(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
  };

  const animate5 = collapse5 => {
    setIsCollapse5(collapse5);
    setIcon5(state => {
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

  useEffect(() => {
    animate2(!collapse2);
  }, [collapse2]);

  useEffect(() => {
    animate3(!collapse3);
  }, [collapse3]);

  useEffect(() => {
    animate4(!collapse4);
  }, [collapse4]);

  useEffect(() => {
    animate5(!collapse5);
  }, [collapse5]);

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: process.env.REACT_APP_API_USER_NAME,
      password: process.env.REACT_APP_API_PASSWORD,
    },
  };


  const monthList = [
    {
      options: [
        { label: "Select Month", value: "" },
        { label: "January", value: "January" },
        { label: "February", value: "February" },
        { label: "March", value: "March" },
        { label: "April", value: "April" },
        { label: "May", value: "May" },
        { label: "June", value: "June" },
        { label: "July", value: "July" },
        { label: "August", value: "August" },
        { label: "September", value: "September" },
        { label: "October", value: "October" },
        { label: "November", value: "November" },
        { label: "December", value: "December" },
      ],
    },
  ];

  const materialList = [
    {
      options: [
        { label: "Select Material", value: "" },
        { label: "Material1", value: "Material1" },
        { label: "Material2", value: "Material2" },
        { label: "Material3", value: "Material3" },
        { label: "Material4", value: "Material4" },
        { label: "Material5", value: "Material5" },
      ],
    },
  ];

  const mandatorySeq = [
    {
      options: [
        { label: "--Select--", value: "" },
        { label: "YES", value: "Y" },
        { label: "NO", value: "N" },

      ],
    },
  ];
  const docuCheck = [
    {
      options: [
        { label: "--Select--", value: "" },
        { label: "YES", value: "1" },
        { label: "NO", value: "0" },

      ],
    },
  ];

  const lastWeightCount = [
    {
      options: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },

      ],
    },
  ];


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

  const handleInputChangeSetParameter = (e) => {
    const { name, value } = e.target;
    setValuesSetParameter({
      ...valuesSetParameter,
      [name]: value || value.valueAsNumber,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
    });
  };

  const handleInputChangeTimeParameter = (e) => {
    debugger;
    const { name, value } = e.target;
    setValuesTimeParameter({
      ...valuesTimeParameter,
      [name]: value || value.valueAsNumber,
    });
  };

  const handleCommonConfigurationChange = (e) => {
    debugger;
    const { name, value } = e.target;
    setValuesCommonConfiguration({
      ...commonConfiguration,
      [name]: value || value.valueAsNumber,
    });
  };

  const handleTWChange = (e) => {
    debugger;
    const { name, value } = e.target;
    setValuesTW({
      ...valuesTW,
      [name]: value || value.valueAsNumber,
    });
  };

  useEffect(() => {
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    setPlantCode(plantcode);
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    getParameterData(plantcode);
    getStageData(plantcode);
  }, []);

  const getParameterData = async (plantcode) => {
    debugger;
    try {
      const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Parameter/${plantcode}`, config)
        .then(res => {
          console.log(res[0])
          const parameter = res[0];
          setValuesSetParameter({
            ...valuesSetParameter, ...parameter
          });
          console.log(valuesSetParameter);
        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
    }

  }

  const updateParameterData = async (e) => {
    console.log(valuesSetParameter)
    e.preventDefault();
    setErrorParameter(true);
    try {
      const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/Parameter/${Plant_Code}`, valuesSetParameter, config)
        .then(res => {
          console.log(res);
          if ((res.msg).includes("Error updating")) {
            toast.error("Connection refused", { autoClose: 3000 });
            getParameterData(Plant_Code);
            setErrorParameter(false);
          }
          else {
            toast.success("Parameter Updated Successfully", { autoClose: 3000 });
            getParameterData(Plant_Code);
            setErrorParameter(false);
          }
        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setErrorParameter(false);
    }

  }

  const getIdealParameterData = async () => {
    setloader(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Parameter/idealParamter/${Plant_Code}`, config)
        .then(res => {
          console.log(res[0])
          const parameter = res[0];
          setValues({
            ...values, ...parameter
          });
          console.log(values);
          setloader(false);
        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setloader(false);
    }

  }

  const updateIdealParameterData = async (e) => {
    console.log(values)
    e.preventDefault();
    setErrorParameter(true);
    try {
      const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/Parameter/idealParamter/${Plant_Code}`, values, config)
        .then(res => {
          console.log(res);
          if ((res.msg).includes("Error updating Ideal parameters")) {
            toast.error(res.msg, { autoClose: 3000 });
          }
          else {
            toast.success("Parameter Updated Successfully", { autoClose: 3000 });
            getIdealParameterData(Plant_Code);
            setErrorParameter(false);
          }

        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setErrorParameter(false);
    }

  }

  const getTimeParameterData = async () => {
    setloader(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Parameter/timeParamter/${Plant_Code}`, config)
        .then(res => {
          console.log(res[0])
          const parameter = res[0];
          setValuesTimeParameter({
            ...valuesTimeParameter, ...parameter
          });
          console.log(valuesTimeParameter);
          setloader(false);
        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setloader(false);
    }

  }

  const updateTimeParameterData = async (e) => {
    console.log(valuesTimeParameter)
    e.preventDefault();
    setErrorParameter(true);
    try {
      const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/Parameter/timeParamter/${Plant_Code}`, valuesTimeParameter, config)
        .then(res => {
          console.log(res);
          toast.success("Parameter Updated Successfully", { autoClose: 3000 });
          getTimeParameterData(Plant_Code);
          setErrorParameter(false);
        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setErrorParameter(false);
    }

  }



  const [isActive, setActive] = useState(false);

  const handleToggle = () => {
    setActive(!isActive);
  };

  const today = new Date();

  // Extract day, month, and year
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Note: Months are zero-based
  const year = today.getFullYear();

  // Format the date as "DD-MM-YYYY"
  const formattedDate = `${day}-${month}-${year}`;
  //const formattedDate1 = `${year}-${month}-${day}`;
  const formattedDate1 = `${year}-${month}-${day}`;
  const monthInLetter = today.toLocaleString('default', { month: 'long' });


  const submitInwardMaterialTarget = async (e) => {
    console.log(values);
    const data =
    {
      "plantCode": Plant_Code,
      "target": values.quantity,
      "targetDate": formattedDate1,
      "status": "A"
    }

    e.preventDefault();
    setErrorParameter(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/Target`, data, config)
        .then(res => {
          console.log(res);
          toast.success(res.message, { autoClose: 3000 });
          setValues({});
          setErrorParameter(false);
          getCurrentMonthData();
        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setErrorParameter(false);
    }

  }

  const getCurrentMonthData = async () => {
    setloader(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sales-dispatch-dashboard/getDispatchSummaryData/${Plant_Code}`, config)
        .then(res => {
          console.log(res)
          const data = res.message["#result-set-2"][0];
          setValues({
            ...values,
            ['quantity']: data.monthly_target,
        });
          setloader(false);
        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setloader(false);
    }
  }

  const getIGPStageData = async () => {
    setloader(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Parameter/igp/${Plant_Code}`, config)
        .then(res => {
          setValuesCommonConfiguration({
            ...commonConfiguration, ...res
          });
          setloader(false);
        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setloader(false);
    }

  }

  const getStageData = (plantCode) => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/movementType/OB/${plantCode}`, config)
      .then(res => {
        const response = res;
        const stageNames = response.map(item => ({
          stageName: item.locationName,
        }));
        setMasterStageName(stageNames);
      })
      .catch(error => {
        console.error("Error fetching stage data:", error);
      });
  };

  const submitCommonConfiguration = async (e) => {
    debugger;
    console.log(values);
    const data =
    {
      "value": commonConfiguration.value
    }

    e.preventDefault();
    setErrorParameter(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/Parameter/igpPrint/${Plant_Code}`, data, config)
        .then(res => {
          console.log(res);
          toast.success(res.msg, { autoClose: 3000 });
          getIGPStageData();
          setErrorParameter(false);
        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setErrorParameter(false);
    }
  }

  const getTWConfigData = async () => {
    setloader(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/common-constants/values?plantCode=${Plant_Code}`, config)
        .then(res => {
          setValuesTW({
            ...valuesTW, ...res
          });
          setloader(false);
        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setloader(false);
    }

  }

  const submitTWData = async (e) => {
    debugger;
    console.log(values);
    const data =
    {
      "tw_max": valuesTW.tw_max,
      "tw_Check": valuesTW.tw_Check,
      "tw_min": valuesTW.tw_min,
    }

    e.preventDefault();
    setErrorParameter(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/common-constants/updateConstants?plantCode=${Plant_Code}`, data, config)
        .then(res => {
          console.log(res);
          toast.success(res.msg, { autoClose: 3000 });
          getTWConfigData();
          setErrorParameter(false);
        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setErrorParameter(false);
    }
  }

  // document.title = HeaderName + " || EPLMS";
  document.title = "Plant Configuration | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title={latestHeader} pageTitle="EPLMS" />
          <Row>
            <Col xxl={12}>
              <div className="">
                <h6 className="text-muted text-color-blue bg-primary text-uppercase fw-semibold" onClick={() => firstCollapse()} >
                  <span class="margin-left">{"SET PARAMETER"}</span> <i style={{ float: "right" }} className={icon} />
                </h6>
                <Collapse className="" isOpen={isCollapse}>
                  <Card id="company-overview">
                    <Form className="tablelist-form" name="Doc_form" onSubmit={updateParameterData}>
                      <Row className="p-3 g-3 pt-1 mt-2 mb-3">
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Yard Buffer<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="y_B"
                            placeholder="Enter Yard Buffer"
                            value={valuesSetParameter.y_B}
                            onChange={handleInputChangeSetParameter}
                          />
                        </Col>
                        {/* <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Yard-In-Gate-CheckIn<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="y_G_C"
                            placeholder="Enter Yard-In-Gate-CheckIn"
                            value={valuesSetParameter.y_G_C}
                            onChange={handleInputChangeSetParameter}
                          />
                        </Col> */}
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Gate-CheckIn-Plant<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="g_C_GW"
                            placeholder="Enter Gate-CheckIn-WB Gross Wt"
                            value={valuesSetParameter.g_C_GW}
                            onChange={handleInputChangeSetParameter}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">PackingIn -PackingOut<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="time_difference"
                            placeholder="Enter Differnce PackingIn -PackingOut"
                            value={valuesSetParameter.time_difference}
                            onChange={handleInputChangeSetParameter}
                          />
                        </Col>

                        <Col lg={3}>
                          <Label className="form-label" >Mandatory Sequence<span style={{ color: "red" }}>*</span></Label>
                          <Input
                            id="val21"
                            name="mandatory_sequence"
                            type="select"
                            className="form-select"
                            value={valuesSetParameter.mandatory_sequence}
                            onChange={handleInputChangeSetParameter}
                            required
                          >
                            {mandatorySeq.map((item, key) => (
                              <React.Fragment key={key}>
                                {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                              </React.Fragment>
                            ))}
                          </Input>
                        </Col>
                        <Col lg={3}>
                          <Label className="form-label" >Document Check<span style={{ color: "red" }}>*</span></Label>
                          <Input
                            id="val21"
                            name="doc_CHECK"
                            type="select"
                            className="form-select"
                            value={valuesSetParameter.doc_CHECK}
                            onChange={handleInputChangeSetParameter}
                            required
                          >
                            {docuCheck.map((item, key) => (
                              <React.Fragment key={key}>
                                {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                              </React.Fragment>
                            ))}
                          </Input>
                        </Col>
                        {/* <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">WB Gross Wt-Unload In<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="gw_UW"
                            placeholder="Enter WB Gross Wt-Unload In"
                            value={valuesSetParameter.gw_UW}
                            onChange={handleInputChangeSetParameter}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Unload In-WB Tare Wt<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="uw_TW"
                            placeholder="Enter Unload In-WB Tare Wt"
                            value={valuesSetParameter.uw_TW}
                            onChange={handleInputChangeSetParameter}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">WB Tare Wt-Gate-Out<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="tw_GO"
                            placeholder="Enter WB Tare Wt-Gate-Out"
                            value={valuesSetParameter.tw_GO}
                            onChange={handleInputChangeSetParameter}
                          />
                        </Col> */}
                        <Col md={6}>
                          <Button disabled={errorParameter} color="primary" className="btn btn-success" type="submit" style={{ marginTop: "28px" }}>
                            {errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Updating...</> : "Update Parameter"}
                          </Button>
                          {/* <button type="button" className="btn btn-warning ms-3" style={{ marginTop: "29px" }} >Pause</button>
                          <button type="button" className="btn btn-success ms-3" style={{ marginTop: "29px" }} disabled>Resume</button> */}
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                </Collapse>
              </div>
            </Col>

            <Col xxl={12}>
              <div className="">
                <h6 className="text-muted text-color-blue bg-primary text-uppercase fw-semibold" onClick={() => secondCollapse()}   >
                  <span class="margin-left">{"IDEAL PARAMETER"}</span> <i style={{ float: "right" }} className={icon1} />
                </h6>
                <Collapse className="" isOpen={isCollapse1}>
                  <Card id="company-overview">
                    <Form className="tablelist-form" name="Doc_form" onSubmit={updateIdealParameterData}>
                      <Row className="p-3 g-3 pt-1 mt-2 mb-3">
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Yard In<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="i_YI"
                            placeholder="Enter Yard In"
                            value={values.i_YI}
                            onChange={handleInputChange}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Yard-Out<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="i_YO"
                            placeholder="Enter Yard-Out"
                            value={values.i_YO}
                            onChange={handleInputChange}
                          />
                        </Col>
                        {/* <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Staging Yard In<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="i_S_YI"
                            placeholder="Enter Staging Yard In"
                            value={values.i_S_YI}
                            onChange={handleInputChange}
                          />
                        </Col> */}
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Gate-In<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="i_GI"
                            placeholder="Enter Gate-In"
                            value={values.i_GI}
                            onChange={handleInputChange}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">WB Gross Wt<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="i_WB_GW"
                            placeholder="Enter WB Gross Wt"
                            value={values.i_WB_GW}
                            onChange={handleInputChange}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Unload-In<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="i_UI"
                            placeholder="Enter Unload-In"
                            value={values.i_UI}
                            onChange={handleInputChange}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">WB Tare Wt<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="i_WB_TW"
                            placeholder="Enter WB Tare Wt"
                            value={values.i_WB_TW}
                            onChange={handleInputChange}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Gate Out<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="i_GO"
                            placeholder="Enter Gate Out"
                            value={values.i_GO}
                            onChange={handleInputChange}
                          />
                        </Col>
                        <Col md={12} className="text-end">
                          <Button disabled={errorParameter} color="primary" className="btn btn-success" type="submit" style={{ marginTop: "28px" }}>
                            {errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Updating...</> : "Update Parameter"}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                </Collapse>
              </div>
              {loader && <LoaderNew></LoaderNew>}
            </Col>

            <Col xxl={12}>
              <div className="">
                <h6 className="text-muted text-color-blue bg-primary text-uppercase fw-semibold" onClick={() => thirdCollapse()}   >
                  <span class="margin-left">{"TIME PARAMETER"}</span> <i style={{ float: "right" }} className={icon2} />
                </h6>
                <Collapse className="" isOpen={isCollapse2}>
                  <Card id="company-overview">
                    <Form className="tablelist-form" name="Doc_form" onSubmit={updateTimeParameterData}>
                      <Row className="p-3 g-3 pt-1 mt-2 mb-3">
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">{'Secruity Dashboard'}<span style={{ color: "red" }}>*</span> <br />{'(Add value in minutes)'}</Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="t_SD_N"
                            placeholder=""
                            value={valuesTimeParameter.t_SD_N}
                            onChange={handleInputChangeTimeParameter}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">{'GATE-IN Dashboard'}<span style={{ color: "red" }}>*</span> <br />{'(Add value in minutes)'}</Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="t_SD_R"
                            placeholder=""
                            value={valuesTimeParameter.t_SD_R}
                            onChange={handleInputChangeTimeParameter}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold" style={{ display: "inline-flex" }}>{'Trips To Abort'}<br />{'(Add value in Hours)'}<span style={{ color: "red", margin: "0 10px 0px -17px" }}>*</span>
                            {/* <div className={`toggle-switch ${isActive ? 'active' : 'inactive'}`} onClick={handleToggle}>
                              <div className="switch-container">
                                <div className={`switch ${isActive ? 'on' : 'off'}`}>
                                  <div className="slider"></div>
                                </div>
                              </div>
                              <label className="m-0 text-muted">{isActive ? <span style={{ color: "green" }}>Active</span> : <span style={{ color: "red" }}>Inactive</span>}</label>
                            </div> */}
                            <div className="ms-2">
                              <Input
                                type="radio"
                                name="description"
                                className="ms-1"
                                value="Time Trip Abort - N"
                                onChange={(e) => handleInputChangeTimeParameter(e)} // Pass the value to the handler
                                checked={valuesTimeParameter.description === "Time Trip Abort - N"} // Check this if the description is "Time Trip Abort - N"
                              />
                              <label className="m-0 ms-1">Email</label>
                              <br />
                              <Input
                                type="radio"
                                name="description"
                                className="ms-1"
                                value="Time Trip Abort - Y"
                                onChange={(e) => handleInputChangeTimeParameter(e)} // Pass the value to the handler
                                checked={valuesTimeParameter.description === "Time Trip Abort - Y"} // Check this if the description is "Time Trip Abort - Y"
                              />
                              <label className="m-0 ms-1">Trip Close</label>
                            </div>


                          </Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="t_T_A"
                            placeholder=""
                            value={valuesTimeParameter.t_T_A}
                            onChange={handleInputChangeTimeParameter}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold" >{'New trip'}<span style={{ color: "red" }}>*</span> <br />{'(Add value in minutes)'}
                          </Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="t_T_N"
                            placeholder=""
                            value={valuesTimeParameter.t_T_N}
                            onChange={handleInputChangeTimeParameter}
                          />
                        </Col>
                        {/* <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Yard From ETL<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="t_Y_F_ETL"
                            placeholder=""
                            value={valuesTimeParameter.t_Y_F_ETL}
                            onChange={handleInputChangeTimeParameter}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Yard To ETL<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="t_Y_T_ETL"
                            placeholder=""
                            value={valuesTimeParameter.t_Y_T_ETL}
                            onChange={handleInputChangeTimeParameter}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Staging From ETL<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="t_S_F_ETL"
                            placeholder=""
                            value={valuesTimeParameter.t_S_F_ETL}
                            onChange={handleInputChangeTimeParameter}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">Staging To ETL<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="t_S_T_ETL"
                            placeholder=""
                            value={valuesTimeParameter.t_S_T_ETL}
                            onChange={handleInputChangeTimeParameter}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">{'Minimum Time For GW/TW (Min.)'}<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="t_GW_TW"
                            placeholder=""
                            value={valuesTimeParameter.t_GW_TW}
                            onChange={handleInputChangeTimeParameter}
                          />
                        </Col> */}
                        <Col md={12} className="text-end">
                          <Button disabled={errorParameter} color="primary" className="btn btn-success" type="submit" style={{ marginTop: "28px" }}>
                            {errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Updating...</> : "Update Parameter"}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                </Collapse>
              </div>
              {loader && <LoaderNew></LoaderNew>}
            </Col>

            <Col xxl={12}>
              <div className="">
                <h6 className="text-muted text-color-blue bg-primary text-uppercase fw-semibold" onClick={() => forthCollapse()}   >
                  <span class="margin-left">{"OUTWARD MATERIAL TARGET"}</span> <i style={{ float: "right" }} className={icon3} />
                </h6>
                <Collapse className="" isOpen={isCollapse3}>
                  <Card id="company-overview">
                    <Form className="tablelist-form" name="Doc_form" onSubmit={submitInwardMaterialTarget}>
                      <Row className="p-3 g-3 pt-1 mt-2 mb-3">
                        {/* <Col lg={3}>
                          <div>
                            <Label className="form-label" >Month</Label>
                            <Input
                              id="val21"
                              name="month"
                              type="select"
                              className="form-select"
                              value={values.month}
                              onChange={handleInputChange}
                              required
                            >
                              {monthList.map((item, key) => (
                                <React.Fragment key={key}>
                                  {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                </React.Fragment>
                              ))}
                            </Input>
                          </div>
                        </Col>
                        <Col lg={3}>
                          <div>
                            <Label className="form-label" >Material Type</Label>
                            <Input
                              id="val21"
                              name="materialType"
                              type="select"
                              className="form-select"
                              value={values.materialType}
                              onChange={handleInputChange}
                              required
                            >
                              {materialList.map((item, key) => (
                                <React.Fragment key={key}>
                                  {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                </React.Fragment>
                              ))}
                            </Input>
                          </div>
                        </Col> */}
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">{'Current Month'}</Label>
                          <Input type="text" className="form-control" disabled
                            id="val13"
                            name="targetDate"
                            value={monthInLetter}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="validationDefault04" className="form-label fw-bold">{'Quantity (MT)'}<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="val13"
                            name="quantity"
                            placeholder="Enter Quantity"
                            value={values.quantity}
                            onChange={handleInputChange}
                          />
                        </Col>
                        <Col md={3} >
                          {/* <button type="submit" className="btn btn-success" style={{ marginTop: "29px" }}>Submit</button>
                          <button type="submit" className="btn btn-success ms-3" style={{ marginTop: "29px" }}>Update</button> */}
                          <Button disabled={errorParameter} color="primary" className="btn btn-success" type="submit" style={{ marginTop: "28px" }}>
                            {errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Submitting...</> : "Submit"}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                </Collapse>
              </div>
            </Col>

            <Col xxl={12}>
              <div className="">
                <h6 className="text-muted text-color-blue bg-primary text-uppercase fw-semibold" onClick={() => fifthCollapse()}   >
                  <span class="margin-left">{"COMMON CONFIGURATIONS"}</span> <i style={{ float: "right" }} className={icon4} />
                </h6>
                <Collapse className="" isOpen={isCollapse4}>
                  <Card id="company-overview">
                    <Form className="tablelist-form" name="Doc_form" onSubmit={submitCommonConfiguration}>
                      <Row className="p-3 g-3 pt-1 mt-2 mb-3">

                        <Col lg={3}>
                          <Label className="form-label" >IGP Stage<span style={{ color: "red" }}>*</span></Label>
                          <Input
                            id="val21"
                            name="value"
                            type="select"
                            className="form-select"
                            value={commonConfiguration.value}
                            onChange={handleCommonConfigurationChange}
                            required
                          >
                            <option value={""}>{"--Select Stage--"}</option>
                            {masterStageName.map((item, key) => (
                              <React.Fragment key={key}>
                                <option value={item.stageName}>{item.stageName}</option>
                              </React.Fragment>
                            ))}
                          </Input>
                        </Col>
                        <Col md={3} >
                          <Button disabled={errorParameter} color="primary" className="btn btn-success" type="submit" style={{ marginTop: "28px" }}>
                            {errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Submitting...</> : "Submit"}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                </Collapse>
              </div>
            </Col>
            <Col xxl={12}>
              <div className="">
                <h6 className="text-muted text-color-blue bg-primary text-uppercase fw-semibold" onClick={() => sixthCollapse()}   >
                  <span class="margin-left">{"LAST TW CONFIGURATIONS"}</span> <i style={{ float: "right" }} className={icon5} />
                </h6>
                <Collapse className="" isOpen={isCollapse5}>
                  <Card id="company-overview">
                    <Form className="tablelist-form" name="Doc_form" onSubmit={submitTWData}>
                      <Row className="p-3 g-3 pt-1 mt-2 mb-3">
                        <Col md={3}>
                          <Label htmlFor="minTW" className="form-label fw-bold">{'TW Min Weight(%)'}<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="minTW"
                            name="tw_min"
                            placeholder="Enter TW Min Weight"
                            value={valuesTW.tw_min}
                            step="any"    //Set step to allow decimals -->
                            onChange={handleTWChange}
                          />
                        </Col>
                        <Col md={3}>
                          <Label htmlFor="maxTW" className="form-label fw-bold">{'TW Max Weight(%)'}<span style={{ color: "red" }}>*</span></Label>
                          <Input type="number" required className="form-control"
                            id="maxTW"
                            name="tw_max"
                            placeholder="Enter TW Max Weight"
                            value={valuesTW.tw_max}
                            step="any"    //Set step to allow decimals -->
                            onChange={handleTWChange}
                          />
                        </Col>
                        <Col lg={3}>
                          <Label htmlFor="TWCount" className="form-label fw-bold">Last Weight Count<span style={{ color: "red" }}>*</span></Label>
                          <Input
                            id="TWCount"
                            name="tw_Check"
                            type="select"
                            className="form-select"
                            value={valuesTW.tw_Check}
                            onChange={handleTWChange}
                            required
                          >
                            <option value={""}>{"--Select Last Weight Count--"}</option>
                            {lastWeightCount.map((item, key) => (
                              <React.Fragment key={key}>
                                {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                              </React.Fragment>
                            ))}
                          </Input>
                        </Col>
                        <Col md={3} >
                          <Button disabled={errorParameter} color="primary" className="btn btn-success" type="submit" style={{ marginTop: "28px" }}>
                            {errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Submitting...</> : "Submit"}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                </Collapse>
              </div>
            </Col>
          </Row>
        </Container>
        <ToastContainer closeButton={false} limit={1} />
      </div>




    </React.Fragment>
  );
};

export default PlantConfiguration;
