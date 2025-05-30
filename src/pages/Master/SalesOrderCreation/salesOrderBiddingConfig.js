import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, Button, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Collapse, Spinner } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextArea from "antd/es/input/TextArea";
import LoaderNew from "../../../Components/Common/Loader_new";
import Select from "react-select";


const initialValues = {
    plant:"",
    no_of_attempt: "2",
    bidding_time: "15",
    vehicle_to_report_at_yardin: "120",
    bidding_status: "1",
    plant_code: "",
    created_by: "",
    created_on: "",
    updated_by: "",
    updated_on: "",
    status: "",
    id: "",
};


const SalesOrderBiddingConfig = () => {
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState({});
    const [valuesSetParameter, setValuesSetParameter] = useState(initialValues);
    const [Plant_Code, setPlantCode] = useState('');

    const [errorParameter, setErrorParameter] = useState(false);
    const [loader, setloader] = useState(false);


    const collapse = false;
    const [isCollapse, setIsCollapse] = useState(collapse);
    const [icon, setIcon] = useState("las la-angle-down");

    const firstCollapse = () => {
        //getParameterData(Plant_Code)
        setIsCollapse(!isCollapse);
        setIcon(state => {
            return state === "las la-angle-down"
                ? "las la-angle-up"
                : "las la-angle-down";
        });
    };

    useEffect(() => {
        animate(!collapse);
    }, [collapse]);
    const animate = collapse => {
        setIsCollapse(collapse);
        setIcon(state => {
            return state === "las la-angle-down"
                ? "las la-angle-up"
                : "las la-angle-down";
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

    const biddingStatus = [
        {
            options: [
                { label: "--Select--", value: "" },
                { label: "Active", value: "1" },
                { label: "Deactive", value: "0" },

            ],
        },
    ];

    const plantData = [
        {
            options: [
                { label: "Select Plants", value: "" },
                { label: "Sindri", value: "Sindri" },
                { label: "Panvel", value: "Panvel" },
                { label: "Tikariya", value: "Tikariya" },
                { label: "Nalagarh", value: "Nalagarh" },
                { label: "Rajpura", value: "Rajpura" },
                { label: "Marwar", value: "Marwar" },
            ],
        },
    ];

    const plantOptions = plantData.flatMap(item => item.options).filter(opt => opt.value !== "");

    const handleInputChangeSetParameter = (e) => {
        const { name, value } = e.target;
        setValuesSetParameter({
            ...valuesSetParameter,
            [name]: value,
        });
    };

    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
        //getParameterData(plantcode);
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
        // setErrorParameter(true);
        // try {
        //   const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/Parameter/${Plant_Code}`, valuesSetParameter, config)
        //     .then(res => {
        //       console.log(res);
        //       if ((res.msg).includes("Error updating")) {
        //         toast.error("Connection refused", { autoClose: 3000 });
        //         getParameterData(Plant_Code);
        //         setErrorParameter(false);
        //       }
        //       else {
        //         toast.success("Parameter Updated Successfully", { autoClose: 3000 });
        //         getParameterData(Plant_Code);
        //         setErrorParameter(false);
        //       }
        //     });
        // }
        // catch (e) {
        //   toast.error(e, { autoClose: 3000 });
        //   setErrorParameter(false);
        // }
        toast.success("Parameter Updated Successfully", { autoClose: 3000 });
    }


    const [isActive, setActive] = useState(false);

    const handleToggle = () => {
        setActive(!isActive);
    };


    // document.title = HeaderName + " || EPLMS";
    document.title = "Bidding Configuration | EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={'S/O Bidding Configuration'} pageTitle="Configuration" />
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
                                                    <Label htmlFor="validationDefault04" className="form-label fw-bold">No. Of Attempt<span style={{ color: "red" }}>*</span></Label>
                                                    <Input type="number" required className="form-control"
                                                        id="val13"
                                                        name="no_of_attempt"
                                                        placeholder="Enter No. Of Attempt"
                                                        value={valuesSetParameter.no_of_attempt}
                                                        onChange={handleInputChangeSetParameter}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <Label htmlFor="validationDefault04" className="form-label fw-bold">Bidding Time<span style={{ color: "red" }}>*</span></Label>
                                                    <Input type="number" required className="form-control"
                                                        id="val13"
                                                        name="bidding_time"
                                                        placeholder="Enter Bidding Time"
                                                        value={valuesSetParameter.bidding_time}
                                                        onChange={handleInputChangeSetParameter}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <Label htmlFor="validationDefault04" className="form-label fw-bold">Vehicle to Report At YardIN<span style={{ color: "red" }}>*</span></Label>
                                                    <Input type="number" required className="form-control"
                                                        id="val13"
                                                        name="vehicle_to_report_at_yardin"
                                                        placeholder="Enter specific time in minutes"
                                                        value={valuesSetParameter.vehicle_to_report_at_yardin}
                                                        onChange={handleInputChangeSetParameter}
                                                    />
                                                </Col>
                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label">Plant Name</Label>
                                                        <Select
                                                            name="plant"
                                                            options={plantOptions}
                                                            isMulti // Enables multi-select
                                                            classNamePrefix="react-select"
                                                            value={plantOptions.filter(option => valuesSetParameter.plant?.includes(option.value))}
                                                            onChange={selectedOptions =>
                                                                handleInputChangeSetParameter({ target: { name: "plant", value: selectedOptions.map(opt => opt.value) } })
                                                            }
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: "#ffffff", // Set background to white
                                                                }),
                                                                menu: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: "#ffffff", // Ensure dropdown menu is white
                                                                }),
                                                            }}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col lg={3}>
                                                    <Label className="form-label" >Bidding Status<span style={{ color: "red" }}>*</span></Label>
                                                    <Input
                                                        id="val21"
                                                        name="bidding_status"
                                                        type="select"
                                                        className="form-select"
                                                        value={valuesSetParameter.bidding_status}
                                                        onChange={handleInputChangeSetParameter}
                                                        required
                                                    >
                                                        {biddingStatus.map((item, key) => (
                                                            <React.Fragment key={key}>
                                                                {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                            </React.Fragment>
                                                        ))}
                                                    </Input>
                                                </Col>
                                                <Col lg={9}>
                                                    <Button disabled={errorParameter} color="primary" className="btn btn-success" type="submit" style={{ marginTop: "28px", float: "inline-end" }}>
                                                        {errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Updating...</> : "Update Parameter"}
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

export default SalesOrderBiddingConfig;
