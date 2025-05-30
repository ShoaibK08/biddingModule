import React, { useEffect } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback, Button } from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// action
import { registerUser, apiError, resetRegisterFlag } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

//import images 
import logoLight from "../../assets/images/Logo_dark.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

const UserDropdownScreen = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [value, setValue] = React.useState('');

    const handleChange = (event) => {

        setValue(event.target.value);

    };

    let handleSubmit = (e) => {
        
        e.preventDefault();
        let Uvalue = value;
        if(Uvalue === "Customer Self / Representative"){
            navigate("/addCustomerFirst");
        }
        else{
            alert("in progress")
        }
    }

    const customerType = [
        {
            options: [
                { label: "--Select--", value: "" },
                { label: "Customer Self / Representative", value: "Customer Self / Representative" },
                { label: "Customer HO / Common Office", value: "Customer HO / Common Office" },
                { label: "Sales Person", value: "Sales Person" },
                { label: "Trader", value: "Trader" },
                { label: "Transporter", value: "Transporter" },
            ],
        },
    ];

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            email: '',
            first_name: '',
            password: '',
            confirm_password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your Email"),
            first_name: Yup.string().required("Please Enter Your Username"),
            password: Yup.string().required("Please Enter Your Password"),
            confirm_password: Yup.string().when("password", {
                is: val => (val && val.length > 0 ? true : false),
                then: Yup.string().oneOf(
                    [Yup.ref("password")],
                    "Confirm Password Isn't Match"
                )
            })
        }),
        onSubmit: (values) => {
            dispatch(registerUser(values));
        }
    });

    const { error, registrationError, success } = useSelector(state => ({
        registrationError: state.Account.registrationError,
        success: state.Account.success,
        error: state.Account.error
    }));

    useEffect(() => {
        dispatch(apiError(""));
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            setTimeout(() => history("/login"), 3000);
        }

        setTimeout(() => {
            dispatch(resetRegisterFlag());
        }, 3000);

    }, [dispatch, success, error, history]);

    document.title = "Select User | Nayara - Energy";

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">

                                    <CardBody className="p-4" style={{ boxShadow: "-0 4px 4px 4px rgb(2 15 102 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)" }}>
                                        <div className="text-center" style={{ marginTop: "-25px" }}>
                                            <div>
                                                <Link to="/" className="d-inline-block auth-logo">
                                                    <img src={logoLight} alt="" height="200" />
                                                </Link>
                                            </div>
                                            <h5 className="text-primary">New User Registration</h5>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                className="needs-validation" action="#">

                                                {success && success ? (
                                                    <>
                                                        {toast("Your Redirect To Login Page...", { position: "top-right", hideProgressBar: false, className: 'bg-success text-white', progress: undefined, toastId: "" })}
                                                        <ToastContainer autoClose={2000} limit={1} />
                                                        <Alert color="success">
                                                            Register User Successfully and Your Redirect To Login Page...
                                                        </Alert>
                                                    </>
                                                ) : null}

                                                {error && error ? (
                                                    <Alert color="danger"><div>
                                                        {/* {registrationError} */}
                                                        Email has been Register Before, Please Use Another Email Address... </div></Alert>
                                                ) : null}

                                                    <div className="mb-4" >
                                                        <Label
                                                            htmlFor="customername-field"
                                                            className="form-label"
                                                        >
                                                            Select User Type
                                                        </Label>
                                                        <Input
                                                            name="status1"
                                                            type="select"
                                                            className="form-select"
                                                            id="status-field"
                                                            onChange={handleChange}
                                                            //onBlur={handleBlur}
                                                            placeholder="Select Customer Type"
                                                            value={ value || "" }
                                                        >
                                                            {customerType.map((item, key) => (
                                                                <React.Fragment key={key}>
                                                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                </React.Fragment>
                                                            ))}
                                                        </Input>
                                                    </div>

                                                <div className="mb-4 ">
                                                    <p className="mb-0 fs-12 text-muted fst-italic"> Nayara Energy 
                                                        <Link to="#" className="text-primary text-decoration-underline fst-normal fw-medium"> Terms of Use</Link></p>
                                                </div>

                                                <div className="mt-4">
                                                    <button className="btn btn-success w-100" type="submit" onClick={handleSubmit}>Submit</button>
                                                </div>

                                                <div className="mt-4 text-center">
                                                    <div className="signin-other-title">
                                                        <h5 className="fs-13 mb-4 title text-muted">Create account with</h5>
                                                    </div>

                                                    <div>
                                                        <button type="button" className="btn btn-primary btn-icon waves-effect waves-light"><i className="ri-facebook-fill fs-16"></i></button>{" "}
                                                        <button type="button" className="btn btn-danger btn-icon waves-effect waves-light"><i className="ri-google-fill fs-16"></i></button>{" "}
                                                        <button type="button" className="btn btn-dark btn-icon waves-effect waves-light"><i className="ri-github-fill fs-16"></i></button>{" "}
                                                        <button type="button" className="btn btn-info btn-icon waves-effect waves-light"><i className="ri-twitter-fill fs-16"></i></button>
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-4 text-center">
                                    <p className="mb-0">Already have an account ? <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                    <p className="mb-0"><Link to="/forgot-password" className="fw-semibold text-primary text-decoration-underline"> Forget Password </Link> </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth> 
        </React.Fragment>
    );
};

export default UserDropdownScreen;