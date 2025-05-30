import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Button, Modal, Form, FormGroup, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner, CardFooter } from "reactstrap";
import Select from 'react-select';

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from '@material-ui/core';
//import '../PackingYardVisiblity/index.css'


const ParkingYardVisiblity = () => {

    const initialValues = {
        stage: "",
        header: "",
        display: ""

    };

    const [devices, setDevice] = useState([]);
    const [Plant_Code, setPlantCode] = useState('');
    const [latestHeader, setLatestHeader] = useState('');
    const [displayOption, setDisplayOption] = useState([]);
    const [StageData, setStageData] = useState([]);
    const [LedData, setLedData] = useState([]);
    const [errorParameter, setErrorParameter] = useState(false);
    const [currentStage, setCurrentStage] = useState(null);
    const [values, setValues] = useState({});
    const [displayStyle, setDisplayStyle] = useState(false);
    const [checkboxVal, setIsChecked] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedOptions1, setSelectedOptions1] = useState([]);
    const [maxLength, setMaxLength] = useState(30);  // Initial max length value
    const [minLength, setMinLength] = useState(3);  // Default minimum length is 3

    useEffect(() => {
        const HeaderName = localStorage.getItem("HeaderName");
        setLatestHeader(HeaderName);
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = (obj !== null ? obj.data.plantCode : null);
        setPlantCode(plantcode);
        getStageData(plantcode);
        getAllData(plantcode, "ALL");

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


    const getStageData = (plantcode) => {

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/movementType/${'OB'}/${plantcode}`, config)
            .then(res => {
                const device = res;
                setStageData(device);
            }).catch((e) => {
                console.log("something went wrong");
            });
    }

    const getDisplayOption = (plantcode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/devices/display/${plantcode}`, config)
            .then(res => {
                const response = res;
                const options = response.map(item => ({
                    value: item.name,
                    label: item.name
                }));
                setDisplayOption(options);
            }).catch((e) => {
                console.log("something went wrong");
            });
    }

    const getLedData = (plantcode) => {

        const data = {
            "plantCode": plantcode,
            "locationName": values.stage,
        }

        if (values.stage === '0') {
            setLedData([]);
            return false;
        }
        axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/devices/search`, data, config)
            .then(res => {
                const device = res;
                setLedData(device);
            }).catch((e) => {
                console.log("something went wrong");
            });
    }

    const getAllData = (plantcode, flag) => {

        const data = {
            "plantCode": plantcode,
            "flag": flag
        }

        axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/devices/plantCode`, data, config)
            .then(res => {
                const device = res;
                setDevice(device);
                console.log(device);
            }).catch((e) => {
                console.log("something went wrong");
            });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value || value.valueAsNumber,
            //["status"]: "A",
            ["plantCode"]: Plant_Code,
        });

        if (name === 'led' && value!=='0') {
            const attribute = e.target.selectedOptions[0].getAttribute('attr');
            if (attribute === '01') {
                setDisplayStyle(false);
                setIsChecked(false);
            }
            else {
                setDisplayStyle(true);
                getDisplayOption(Plant_Code);
            }
        }
        if (name === 'stage') {
            setCurrentStage(value);
            getAllData(Plant_Code, value);
        }
    };

    useEffect(() => {
        if (values.stage) {
            getLedData(Plant_Code); // Ensure plantCode is set properly
        }
    }, [values.stage]);


    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            header: selectedOptions.map(option => option.label).join(',') || '',
            //header: selectedOptions1.map(option => option.label).join(' ') || '',
        },
        validationSchema: Yup.object({
            header: displayStyle
                ? Yup.string()
                    .min(minLength, `Minimum length is ${minLength} characters`)
                    .max(maxLength, `Maximum length is ${maxLength} characters`)
                    .required('This field is required')
                : Yup.string()
        }),
        onSubmit: (values) => {
            setErrorParameter(true);
            console.log(values);
            const led_select = document.getElementById("led_dropdown");
            const led_val = led_select.selectedOptions[0].value;
            const data = {
                "id": parseInt(led_val) ,
                "isHeader": checkboxVal,
                "header": selectedOptions.map(option => option.label) || [],
            }
            console.log(data);
            axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/devices/update`, data, config)
            .then(res => {
                getAllData(Plant_Code, currentStage);
                toast.success(res.msg, { autoClose: 3000 });
                // setValues({
                //     ...values,
                //     ["plantCode"]: "",
                //     ["stage"]: "",
                //     ["led"]: "",

                // });
                setSelectedOptions([]);
                setDisplayOption([]);
                setDisplayStyle(false);
                setErrorParameter(false);
                setIsChecked(false);

            }).catch((e) => {
                toast.error(e, { autoClose: 3000 });
                setErrorParameter(false);
            });
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const select = document.getElementById("led_dropdown");
        select.selectedOptions[0].getAttribute('data-length');

    };


    const handleChange = (selected) => {
        setSelectedOptions(selected);
    };

    const handleAddOption = (option) => {
        if (!selectedOptions.some(selected => selected.value === option.value)) {
            setSelectedOptions([...selectedOptions, option]);
        }
    };


    const isSelected = (option) => {
        return selectedOptions.some(selected => selected.value === option.value);
    };

    // const options1 = [
    //     { value: 'Header 1', label: 'Header 1' },
    //     { value: 'Header 2', label: 'Header 2' },
    //     { value: 'Header 3', label: 'Header 3' },
    //     { value: 'Header 4', label: 'Header 4' },
    //     { value: 'Header 5', label: 'Header 5' },
    //     { value: 'Header 6', label: 'Header 6' },
    // ];

    // const handleChange1 = (selected) => {
    //     setSelectedOptions1(selected);
    // };

    // const handleAddOption1 = (option) => {
    //     if (!selectedOptions1.some(selected => selected.value === option.value)) {
    //         setSelectedOptions1([...selectedOptions1, option]);
    //     }
    // };


    // const isSelected1 = (option) => {
    //     return selectedOptions1.some(selected => selected.value === option.value);
    // };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    }


    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    document.title = "Parking Yard Visibility | EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={"Parking Yard Visibility"} pageTitle="Master" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0 custom-card-header mb-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-primary text-white">Configure Parking Yard Visibility</h5>
                                            </div>
                                        </div>
                                    </Row>
                                    <Form onSubmit={(e) => {
                                        e.preventDefault();
                                        validation.handleSubmit();
                                        return false;
                                    }}>

                                        <Row style={{ paddingBottom: "0px", paddingLeft: "15px", paddingTop: "15px" }}>
                                            <Col lg={3} style={{ display: `${displayStyle ? 'block' : 'none'}` }}>
                                                <div>
                                                    <Label className="form-label" >
                                                        <Input
                                                            name="header_check"
                                                            type="checkbox"
                                                            checked={checkboxVal}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                        {" "} Select Header</Label>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3 p-3">
                                            <Col lg={3}>
                                                <div>
                                                    <Label className="form-label" >Location Name</Label>
                                                    <Input
                                                        name="stage"
                                                        type="select"
                                                        className="form-select"
                                                        value={values.stage}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value={'ALL'}>ALL Locations</option>
                                                        {StageData.map((item, index) => (
                                                            <React.Fragment key={index}>
                                                                <option value={item.locationName} key={index}>{item.locationName}</option>
                                                            </React.Fragment>
                                                        ))}
                                                    </Input>
                                                </div>
                                            </Col>


                                            <Col md={3}>
                                                <div>
                                                    <Label className="form-label" >LED Name</Label>
                                                    <Input
                                                        name="led"
                                                        type="select"
                                                        className="form-select"
                                                        id="led_dropdown"
                                                        value={values.led}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value={'0'}>--Select--</option>
                                                        {LedData.map((item, index) => (
                                                            <React.Fragment key={index}>
                                                                <option attr={item.commandFormat} data-length={"10"} value={item.id} key={index}>{item.deviceType}</option>
                                                            </React.Fragment>
                                                        ))}
                                                    </Input>
                                                </div>
                                            </Col>


                                            <Col md={3} style={{ display: `${displayStyle ? 'block' : 'none'}` }}>
                                                {/* <Col md={3}> */}
                                                <div>
                                                    <Label className="form-label" >Display Items</Label>
                                                    <Select
                                                        id="diaplay_fld"
                                                        options={displayOption}
                                                        isMulti
                                                        value={selectedOptions}
                                                        onChange={handleChange}
                                                        closeMenuOnSelect={false}
                                                        hideSelectedOptions={false}
                                                        components={{
                                                            Option: ({ innerRef, innerProps, data }) => (
                                                                <div
                                                                    ref={innerRef}
                                                                    {...innerProps}
                                                                    style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        padding: '5px',
                                                                        backgroundColor: isSelected(data) ? '#d4edda' : 'white',  // Highlight if selected
                                                                        color: isSelected(data) ? '#155724' : 'black',             // Darker text when selected
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    <span>{data.label}</span>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleAddOption(data);
                                                                        }}
                                                                        className="plus-button"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            )
                                                        }}

                                                    />
                                                </div>
                                            </Col>

                                            <Col md={3} style={{ display: `${displayStyle ? 'block' : 'none'}` }}>
                                                <div>
                                                    <Label className="form-label" >Display</Label>
                                                    <Input
                                                        name="display"
                                                        type="text"
                                                        //readOnly
                                                        id="display_field"
                                                        disabled
                                                        className="form-control"
                                                        placeholder="No Data"
                                                        value={selectedOptions.map(option => option.label).join(',')}
                                                        //onChange={handleInputChange}
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        invalid={
                                                            validation.touched.header && validation.errors.header ? true : false
                                                        }
                                                    />
                                                    {validation.touched.header && validation.errors.header ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.header}</div></FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col>
                                            {/* <Col md={3} style={{ display: `${displayStyle1 && displayStyle ? 'block' : 'none'}`, marginTop: "10px" }}>
                                                <div>
                                                    <Label className="form-label" >Header Items</Label>
                                                    <Select
                                                        options={options1}
                                                        isMulti
                                                        value={selectedOptions1}
                                                        onChange={handleChange1}
                                                        closeMenuOnSelect={false}
                                                        hideSelectedOptions={false}
                                                        components={{
                                                            Option: ({ innerRef, innerProps, data }) => (
                                                                <div
                                                                    ref={innerRef}
                                                                    {...innerProps}
                                                                    style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        padding: '5px',
                                                                        backgroundColor: isSelected1(data) ? '#d4edda' : 'white',  // Highlight if selected
                                                                        color: isSelected1(data) ? '#155724' : 'black',             // Darker text when selected
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    <span>{data.label}</span>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleAddOption1(data);
                                                                        }}
                                                                        className="plus-button"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            )
                                                        }}
                                                    />
                                                </div>
                                            </Col> */}
                                            {/* <Col md={3} style={{ display: `${displayStyle1 && displayStyle ? 'block' : 'none'}`, marginTop: "10px" }}>
                                                <div>
                                                    <Label className="form-label" >Header</Label>
                                                    <Input
                                                        name="header"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Header"
                                                        value={selectedOptions1.map(option => option.label).join(' ')}
                                                        //onChange={handleInputChange}
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        invalid={
                                                            validation.touched.header && validation.errors.header ? true : false
                                                        }
                                                    />
                                                    {validation.touched.header && validation.errors.header ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.header}</div></FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Col> */}

                                            <Col md={3}>
                                                <Button type="submit" className="btn btn-success " style={{ display: `${displayStyle ? 'block' : 'none'}`, marginTop: "29px" }}>{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Loading...</> : "Update"}</Button>
                                            </Col>
                                        </Row>
                                    </Form>



                                </CardHeader>

                                {/* <Card> */}
                                {/* <div className="card-body pt-3 custom-card-header">
                                    <div> */}

                                {/* <TableContainer
                                            columns={columns}
                                            data={devices}
                                            isGlobalFilter={true}
                                            isAddUserList={false}
                                            customPageSize={5}
                                            isGlobalSearch={true}
                                            className="custom-header-css"
                                            //isCustomerFilter={true}
                                            SearchPlaceholder='Search for Vehicle No or something...'
                                            divClass="overflow-auto"
                                        /> */}
                                {/* </div> */}
                                <ToastContainer closeButton={false} limit={1} />
                                {/* </div> */}
                                {/* </Card> */}
                            </Card>
                            <Row>
                                <Col lg={12}>
                                    <Card id="customerList">
                                        <CardHeader className="border-0">
                                            <Row className="g-4 align-items-center">
                                                <div className="col-sm">
                                                    <div>
                                                        <h5 className="card-title mb-0 bg-primary text-white">LED Details</h5>
                                                    </div>
                                                </div>

                                            </Row>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                {
                                                    devices.length !== 0 ? devices.map((value, index) => {
                                                        return (
                                                            <Col md={3} key={index}>
                                                                <Card className="ribbon-box right" style={{ boxShadow: "0px 1px 1px 2px rgba(56, 65, 74, 0.15)" }}>
                                                                <div class="ribbon-two ribbon-two-success"><span className="fs-11">{value.connectionType}</span></div>
                                                                    <CardBody className="bg-light pb-2" style={{ borderTop: "solid 5px cadetblue", borderRadius: "5px" }}>
                                                                        <div className="d-flex align-items-center mb-1">
                                                                            <div className="flex-shrink-0">
                                                                                <p className="text-muted mb-0">LED Name:</p>
                                                                            </div>
                                                                            <div className="flex-grow-1 ms-2">
                                                                                <h6 className="mb-0">{value.deviceName}</h6>
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex align-items-center mb-1">
                                                                            <div className="flex-shrink-0">
                                                                                <p className="text-muted mb-0">Location Name:</p>
                                                                            </div>
                                                                            <div className="flex-grow-1 ms-2">
                                                                                <h6 className="mb-0">{value.locationName}</h6>
                                                                            </div>
                                                                        </div>
                                                                        <div class="d-flex align-items-center mb-1">
                                                                            <div className="flex-shrink-0">
                                                                                <p className="text-muted mb-0">IP Address:</p>
                                                                            </div>
                                                                            <div className="flex-grow-1 ms-2">
                                                                                <h6 className="mb-0">{value.ipAddress}</h6>
                                                                            </div>
                                                                        </div>
                                                                        <div class="d-flex align-items-center mb-1">
                                                                            <div className="flex-shrink-0">
                                                                                <p className="text-muted mb-0">Header:</p>
                                                                            </div>
                                                                            <div className="flex-grow-1 ms-2">
                                                                                <h6 className="mb-0">{value.header ? "Yes" : "No"}</h6>
                                                                            </div>
                                                                        </div>
                                                                    </CardBody>
                                                                    <CardFooter style={{padding:"5px 0px 0px 15px"}}>
                                                                    <div class="d-flex align-items-center mb-2">
                                                                            <div className="flex-shrink-0">
                                                                                <p className="text-muted mb-0">Display Text:</p>
                                                                            </div>
                                                                            <div className="flex-grow-1 ms-2">
                                                                                <h6 className="mb-0 fs-12 fw-bold" style={{width:"75%", overflow:"hidden", textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={value.displayText}>{value.displayText}</h6>
                                                                            </div>
                                                                        </div>
                                                                    </CardFooter>
                                                                </Card>
                                                            </Col>
                                                        )
                                                    }) : <div>No Data Found</div>
                                                }
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                                {/* <div class="col-xl-3">
                                        <div class="card">
                                            <div class="card-body">
                                                <ul class="list-unstyled mb-0 vstack gap-3">
                                                    <li>
                                                        <div class="d-flex align-items-center">
                                                            <div class="flex-shrink-0">
                                                                <img src="assets/images/users/avatar-3.jpg" alt="" class="avatar-sm rounded" />
                                                            </div>
                                                            <div class="flex-grow-1 ms-3">
                                                                <h6 class="fs-14 mb-1">Joseph Parkers</h6>
                                                                <p class="text-muted mb-0">Customer</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li><i class="ri-mail-line me-2 align-middle text-muted fs-16"></i>josephparker@gmail.com</li>
                                                    <li><i class="ri-phone-line me-2 align-middle text-muted fs-16"></i>+(256) 245451 441</li>
                                                </ul>
                                            </div>
                                        </div>
                                        
                                    </div> */}
                            </Row>

                        </Col>
                    </Row>
                </Container>
            </div>

        </React.Fragment>
    );
};

export default ParkingYardVisiblity;
