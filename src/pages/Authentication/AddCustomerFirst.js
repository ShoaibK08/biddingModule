
import React, { useState, useCallback } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Modal,
    Form,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Label,
    Input, Nav, NavItem, NavLink, TabContent, TabPane, CardBody
} from "reactstrap";
import classnames from "classnames";
import {
    getCustomers1 as onGetCustomers,
    addNewCustomer1 as onAddNewCustomer,
    updateCustomer1 as onUpdateCustomer,
    deleteCustomer1 as onDeleteCustomer,
} from "../../store/actions";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// action
import { registerUser, apiError, resetRegisterFlag } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';

import { Link, useNavigate } from "react-router-dom";

//import images 
import logoLight from "../../assets/images/Logo_dark.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

const AddCustomerFirst = () => {
    const history = useNavigate();

    const dispatch = useDispatch();

    const [isEdit, setIsEdit] = useState(false);
    const [customer, setCustomer] = useState([]);

    const [modal, setModal] = useState(true);

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
            setCustomer(null);
        } else {
            setModal(true);
        }
    }, [modal]);

    // Outline Border Nav Tabs
    const [outlineBorderNav, setoutlineBorderNav] = useState("1");
    const outlineBorderNavtoggle = (tab) => {
        if (outlineBorderNav !== tab) {
            setoutlineBorderNav(tab);
        }
    };

    const customerType = [
        {
            options: [
                { label: "Select Customer Type", value: "" },
                { label: "Transporter", value: "Transporter" },
                { label: "Customer", value: "Customer" },
                { label: "Payer", value: "Payer" },
                { label: "Ship To", value: "Ship To" },
                { label: "Sold To", value: "Sold To" },
            ],
        },
    ];
    // validation
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            customer: (customer && customer.customer) || '',
            customerCode: (customer && customer.customerCode) || '',
            customerType: (customer && customer.customerType) || '',
            email: (customer && customer.email) || '',
            phone: (customer && customer.phone) || '',
            date: (customer && customer.date) || '',
            status: (customer && customer.status) || '',
            status1: (customer && customer.status1) || '',
        },
        validationSchema: Yup.object({
            customer: Yup.string().required("Please Enter Customer Name"),
            customerCode: Yup.string().required("Please Enter Customer Code"),
            house: Yup.string().required("Please Enter House/Building Number"),
            landmark: Yup.string().required("Please Enter Landmark"),
            postoffice: Yup.string().required("Please Enter Postoffice"),
            pincode: Yup.string().required("Please Enter Pincode"),
            district: Yup.string().required("Please Enter District"),
            state: Yup.string().required("Please Enter State"),
            email: Yup.string().required("Please Enter Your Email"),
            phone: Yup.string().required("Please Enter Your Phone"),
            status: Yup.string().required("Please Enter Your Status")
        }),
        onSubmit: (values) => {
            if (isEdit) {
                const updateCustomer = {
                    _id: customer ? customer._id : 0,
                    customer: values.customer,
                    customerCode: values.customerCode,
                    customerType: values.customerType,
                    email: values.email,
                    phone: values.phone,
                    //date: date,
                    status: values.status,
                    status1: values.status1,
                };
                // update customer
                dispatch(onUpdateCustomer(updateCustomer));
                validation.resetForm();
            } else {
                const newCustomer = {
                    _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
                    customer: values["customer"],
                    customerCode: values["customerCode"],
                    customerType: values["customerType"],
                    email: values["email"],
                    phone: values["phone"],
                    //date: date,
                    status: values["status"]
                };
                // save new customer
                dispatch(onAddNewCustomer(newCustomer));
                validation.resetForm();
            }
            toggle();
        },
    });



    document.title = "Customer Self / Representative | Nayara - Energy";

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container style={{marginTop:"60px"}}>

                        <Row className="justify-content-center">
                            <Col md={8} lg={12} xl={12}>
                                <Card className="mt-4">
                                <CardHeader className="bg-success p-3" style={{fontWeight:"600", color:"#fff", fontSize:"initial"}}>"Customer Self / Representative Registration"  </CardHeader>
                                    <CardBody className="p-4" style={{ boxShadow: "-0 4px 4px 4px rgb(2 15 102 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)" }}>
                                        
                                        <div className="p-2 ">
                                        
                                            <Card id="showModal" centered size="xl" >
                                            
                                                    <ModalBody className="ribbon-box">
                                                        

                                                        <Nav pills className="nav-customs nav-danger nav nav-pills" >
                                                            <NavItem>
                                                                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "1", })} onClick={() => { outlineBorderNavtoggle("1"); }} >
                                                                    Basic Informations
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "2", })} onClick={() => { outlineBorderNavtoggle("2"); }} >
                                                                    Additional Informations
                                                                </NavLink>
                                                            </NavItem>
                                                        </Nav>

                                                        <TabContent activeTab={outlineBorderNav} className="text-muted" style={{ border: "solid 1px", padding: "20px" }}>
                                                            <TabPane tabId="1" id="border-nav-home">
                                                                <Row className="g-3">

                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label
                                                                                htmlFor="customername-field"
                                                                                className="form-label"
                                                                            >
                                                                                Customer Code
                                                                            </Label>
                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter Customer Code"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.customerCode || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label
                                                                                htmlFor="customername-field"
                                                                                className="form-label"
                                                                            >
                                                                                Customer Type
                                                                            </Label>
                                                                            <Input
                                                                                name="status1"
                                                                                type="select"
                                                                                className="form-select"
                                                                                id="status-field"
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                placeholder="Select Customer Type"
                                                                                value={
                                                                                    validation.values.customerType || ""
                                                                                }
                                                                            >
                                                                                {customerType.map((item, key) => (
                                                                                    <React.Fragment key={key}>
                                                                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </Input>
                                                                        </div>
                                                                    </Col>
                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label
                                                                                htmlFor="customername-field"
                                                                                className="form-label"
                                                                            >
                                                                                Customer Name
                                                                            </Label>
                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter Customer Name"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.customer || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label
                                                                                htmlFor="customername-field"
                                                                                className="form-label"
                                                                            >
                                                                                Contact Number
                                                                            </Label>
                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter Contact Number"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.phone || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>

                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label htmlFor="email-field" className="form-label">
                                                                                Email Address
                                                                            </Label>
                                                                            <Input
                                                                                name="email"
                                                                                type="email"
                                                                                id="email-field"
                                                                                placeholder="Enter Email Address"
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.email || ""}

                                                                            />

                                                                        </div>
                                                                    </Col>


                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label htmlFor="status-field" className="form-label">
                                                                                House/Building
                                                                            </Label>

                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter House/Bulding"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.house || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>

                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label htmlFor="status-field" className="form-label">
                                                                                Landmark
                                                                            </Label>

                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter Landmark"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.Landmark || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>

                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label htmlFor="status-field" className="form-label">
                                                                                Post Office
                                                                            </Label>

                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter Post Office"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.postOffice || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>

                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label htmlFor="status-field" className="form-label">
                                                                                Pincode
                                                                            </Label>

                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter Pincode"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.Pincode || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>

                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label htmlFor="status-field" className="form-label">
                                                                                District
                                                                            </Label>

                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter District"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.District || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>

                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label htmlFor="status-field" className="form-label">
                                                                                State
                                                                            </Label>

                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter State"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.State || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                    <Col lg={3}>
                                                                        <div className="wrapAni">
                                                                            <button className="buttonAni" onClick={() => { outlineBorderNavtoggle("2"); }}>Next &gt;&gt;</button>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </TabPane>

                                                            <TabPane tabId="2" id="border-nav-profile">
                                                                <Row className="g-3">
                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label
                                                                                htmlFor="customername-field"
                                                                                className="form-label"
                                                                            >
                                                                                Sales Officer Name
                                                                            </Label>
                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter Sales Officer Name"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.customer || ""}

                                                                            />

                                                                        </div>

                                                                    </Col>

                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label
                                                                                htmlFor="customername-field"
                                                                                className="form-label"
                                                                            >
                                                                                Sales Employee Number
                                                                            </Label>
                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter Sales Employee Number"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.phone || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>

                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label
                                                                                htmlFor="customername-field"
                                                                                className="form-label"
                                                                            >
                                                                                Area Manager Name
                                                                            </Label>
                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter Area Manager Name"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.customer || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>

                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label
                                                                                htmlFor="customername-field"
                                                                                className="form-label"
                                                                            >
                                                                                Area Employee Number
                                                                            </Label>
                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter Area Employee Number"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.phone || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>


                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label
                                                                                htmlFor="customername-field"
                                                                                className="form-label"
                                                                            >
                                                                                Product Lead / Head Name
                                                                            </Label>
                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter Product Lead / Head Name"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.customer || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>

                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label
                                                                                htmlFor="customername-field"
                                                                                className="form-label"
                                                                            >
                                                                                Product Employee Number
                                                                            </Label>
                                                                            <Input
                                                                                name="customer"
                                                                                id="customername-field"
                                                                                className="form-control"
                                                                                placeholder="Enter Product Employee Number"
                                                                                type="text"
                                                                                validate={{
                                                                                    required: { value: true },
                                                                                }}
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.phone || ""}

                                                                            />
                                                                        </div>
                                                                    </Col>

                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label htmlFor="phone-field" className="form-label">
                                                                                Additional input
                                                                            </Label>
                                                                            <Input
                                                                                name="phone"
                                                                                type="text"
                                                                                id="phone-field"
                                                                                placeholder="Enter Additional input 1"
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.address || ""}

                                                                            />

                                                                        </div>
                                                                    </Col>


                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label htmlFor="phone-field" className="form-label">
                                                                                Purchase Order Number
                                                                            </Label>
                                                                            <Input
                                                                                name="phone"
                                                                                type="text"
                                                                                id="phone-field"
                                                                                placeholder="Enter Purchase Order Number"
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.phone || ""}

                                                                            />

                                                                        </div>
                                                                    </Col>
                                                                    <Col lg={3}>
                                                                        <div>
                                                                            <Label htmlFor="phone-field" className="form-label">
                                                                                Transport Mode
                                                                            </Label>
                                                                            <Input
                                                                                name="phone"
                                                                                type="text"
                                                                                id="phone-field"
                                                                                placeholder="Enter Transport Mode"
                                                                                onChange={validation.handleChange}
                                                                                onBlur={validation.handleBlur}
                                                                                value={validation.values.mode || ""}

                                                                            />

                                                                        </div>
                                                                    </Col>
                                                                    <Col lg={12}>
                                                                        <Label htmlFor="phone-field" className="form-label">
                                                                            Is this customer eligible for placing indent for more than one sold-to-party (Placing indent for HO/common office)

                                                                        </Label>
                                                                        <Input
                                                                            type="radio"
                                                                            name="site_name"
                                                                            value={validation.values.phone}
                                                                        /> Yes
                                                                        <Input
                                                                            type="radio"
                                                                            name="site_name"
                                                                            value={validation.values.phone}
                                                                        /> No
                                                                    </Col>

                                                                    <div className="hstack gap-2 justify-content-end">

                                                                        <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Customer"} </button>
                                                                    </div>
                                                                </Row>
                                                            </TabPane>
                                                        </TabContent>
                                                    </ModalBody>
                                            </Card>

                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-4 text-center">
                                    <p className="mb-0">Already have an account ? <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                    <p className="mb-0"><Link to="/forget" className="fw-semibold text-primary text-decoration-underline"> Forget Password </Link> </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default AddCustomerFirst;
