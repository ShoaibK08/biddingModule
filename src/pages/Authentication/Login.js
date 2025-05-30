
import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner, UncontrolledAlert } from 'reactstrap';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import axios from "axios";
//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Social Media Imports
import { GoogleLogin } from "react-google-login";
// import TwitterLogin from "react-twitter-auth"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
// actions
import { loginUser, socialLogin, resetLoginFlag } from "../../store/actions";

import logoDark from "../../assets/images/Logo_dark.png";
//Import config
import { facebook, google } from "../../config";

import withRouter from '../../Components/Common/withRouter';
import { userForgetPassword, changeLayout, changeLayoutMode } from "../../store/actions";

import ThemeDropdown from '../../Components/Common/themeDropdown';



const Login = (props) => {
    const dispatch = useDispatch();
    const { user, errorMsg, loading, error, layoutType, layoutModeType, } = useSelector(state => ({
        user: state.Account.user,
        errorMsg: state.Login.errorMsg,
        loading: state.Login.loading,
        error: state.Login.error,
        layoutType: state.Layout.layoutType,
        layoutModeType: state.Layout.layoutModeType,
    }));

    //Code for Theme
    const onChangeLayoutMode = (value) => {
        
        if (changeLayoutMode) {
            dispatch(changeLayoutMode(value));
        }
    };

    const [randomText, setRandomText] = useState('');
    const [userLogin, setUserLogin] = useState([]);
    const [passwordShow, setPasswordShow] = useState(false);
    const [invalid_captcha, setInvalidCaptcha] = useState(false);

    useEffect(() => {
        generateRandomText();
            const interval = setInterval(() => {
                generateRandomText();
            }, 60000);
            return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        if (user && user) {
            setUserLogin({
                email: user.user.email,
                password: user.user.confirm_password,
                captcha: user.user.captcha
            });
        }
        if (layoutType || layoutModeType) {
            dispatch(changeLayoutMode(layoutModeType));
            dispatch(changeLayout(layoutType));
        }

    }, [user, layoutType, layoutModeType,]);

    const generateRandomText = () => {
        const text = Math.random().toString(36).substring(7); // Generate a random alphanumeric string
        setRandomText(text);
    };

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            email: "",
            password: '',
            captcha: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your Email"),
            password: Yup.string().required("Please Enter Your Password"),
            captcha: Yup.string().required("Please Enter Captcha"),
        }),
        onSubmit: (values) => {
            
            const captch_val = values.captcha;
            if (captch_val === randomText) {
                dispatch(loginUser(values, props.router.navigate));
            }
            else {
                setInvalidCaptcha(true);
            }
        }
    });

    const handleCaptcha = () => {
        setInvalidCaptcha(false);
    }


    // const loginUser = () => {
    //     var postData = {
    //         email: "vikalpsoni.adt@gmail.com",
    //         password: "admin"
    //       };

    //       let axiosConfig = {
    //         headers: {
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             "Access-Control-Allow-Origin": "*",
    //         }
    //       };

    //       axios.post('http://127.0.0.1:8041/masterModule/users/login', JSON.stringify(postData), axiosConfig)
    //       .then((res) => {
    //         console.log("RESPONSE RECEIVED: ", res);
    //       })
    //       .catch((err) => {
    //         console.log("AXIOS ERROR: ", err);
    //       })
    //   }

    const raiseInvoiceClicked = () => {
        const url = 'www.google.com';
        window.open(url, '_blank');
    }




    const signIn = (res, type) => {
        if (type === "google" && res) {
            const postData = {
                name: res.profileObj.name,
                email: res.profileObj.email,
                token: res.tokenObj.access_token,
                idToken: res.tokenId,
            };
            dispatch(socialLogin(postData, props.router.navigate, type));
        } else if (type === "facebook" && res) {
            const postData = {
                name: res.name,
                email: res.email,
                token: res.accessToken,
                idToken: res.tokenId,
            };
            dispatch(socialLogin(postData, props.router.navigate, type));
        }
    };

    const { resetError, resetSuccessMsg } = useSelector(state => ({
        resetError: state.ForgetPassword.resetError,
        resetSuccessMsg: state.ForgetPassword.resetSuccessMsg,
    }));

    const checkUser = (event) => {
        var email = event.target.value;
        // axios.post(`${process.env.REACT_APP_LOCAL_URL}/userModule/users/checkUser?email=` + email)
        //     .then((res) => {
        //         console.log("RESPONSE RECEIVED: ", res.message);
        //     })
        //     .catch((err) => {
        //         console.log("AXIOS ERROR: ", err);
        //     })
        console.log(email);
    }

    //handleGoogleLoginResponse
    // const googleResponse = response => {
    //     signIn(response, "google");
    // };

    //handleTwitterLoginResponse
    // const twitterResponse = e => {}

    //handleFacebookLoginResponse
    const facebookResponse = response => {
        signIn(response, "facebook");
    };

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                dispatch(resetLoginFlag());
            }, 3000);
        }
    }, [dispatch, error]);




    document.title = "Basic SignIn | EPLMS";
    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        {/* <ThemeDropdown layoutMode={layoutModeType}
                            onChangeLayoutMode={onChangeLayoutMode} /> */}
                        <Row className="justify-content-center">
                            <Col md={8} lg={5} xl={5}>
                                <Card className="mt-4 login_Card mb-0">
                                    <CardBody className="p-4" style={{ boxShadow: "-0 4px 4px 4px rgb(2 15 102 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)", borderRadius: "5px" }}>
                                        <div className="text-center">
                                            <div style={{ padding: "2vh" }}>
                                                <Link to="/" className="d-inline-block auth-logo">
                                                    <img src={logoDark} alt="" style={{height:"14vh"}}/>
                                                </Link>
                                            </div>
                                            <h5 className="textbold" style={{ margin: "0.5vh", color: "#002873" }}>First Logistic Management System.</h5>
                                        </div>
                                        {errorMsg && errorMsg ? (<UncontrolledAlert color="danger" className="mt-4 mb-0"> {errorMsg} </UncontrolledAlert>) : null}

                                        <div className="p-2">
                                            {resetError && resetError ? (
                                                <Alert color="danger" style={{ marginTop: "13px" }}>
                                                    {resetError}
                                                </Alert>
                                            ) : null}
                                            {resetSuccessMsg ? (
                                                <Alert color="success" style={{ marginTop: "13px" }}>
                                                    {resetSuccessMsg}
                                                </Alert>
                                            ) : null}
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                action="#">

                                                <div className="mb-2">
                                                    <Label htmlFor="email" className="form-label">Email</Label>
                                                    <Input
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter email"
                                                        type="email"
                                                        onKeyUp={checkUser}
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.email || ""}
                                                        invalid={
                                                            validation.touched.email && validation.errors.email ? true : false
                                                        }
                                                    />
                                                    {validation.touched.email && validation.errors.email ? (
                                                        <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="float-end">
                                                    <Link to="/forgot-password" className="text-muted">Forgot password?</Link>&nbsp;&nbsp;
                                                    {/* <Link to="/reset-password" className="text-muted">Reset password?</Link>&nbsp;&nbsp; */}
                                                </div>
                                                <Label className="form-label" htmlFor="password-input">Password</Label>
                                                <div className="position-relative auth-pass-inputgroup mb-2">
                                                    <Input
                                                        name="password"
                                                        value={validation.values.password || ""}
                                                        type={passwordShow ? "text" : "password"}
                                                        className="form-control pe-5"
                                                        placeholder="Enter Password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        invalid={
                                                            validation.touched.password && validation.errors.password ? true : false
                                                        }
                                                    />
                                                    {validation.touched.password && validation.errors.password ? (
                                                        <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                    ) : null}
                                                    <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon" onClick={() => setPasswordShow(!passwordShow)}>
                                                        <i className="ri-eye-fill align-middle"></i>
                                                    </button>
                                                </div>
                                                <Label className="form-label" htmlFor="password-input">Captcha</Label>
                                                <div className="position-relative auth-pass-inputgroup mb-2">
                                                    <Row className="g-3">
                                                        <Col lg={6}>
                                                            <Input
                                                                name="captcha"
                                                                className="form-control pe-5"
                                                                placeholder="Enter Captcha"
                                                                onChange={validation.handleChange}
                                                                onClick={handleCaptcha}
                                                                invalid={
                                                                    validation.touched.captcha && validation.errors.captcha ? true : false
                                                                }
                                                            />
                                                            {validation.touched.captcha && validation.errors.captcha ? (
                                                                <FormFeedback type="invalid">{validation.errors.captcha}</FormFeedback>
                                                            ) : null}
                                                            {invalid_captcha && <p style={{ color: "red" }}>Invalid Captcha</p>}
                                                        </Col>
                                                        <Col lg={6}>
                                                            <div className="form-control pe-2 fs-20 fw-bold text-primary" style={{ height: "40px", lineHeight:"1", userSelect:"none" }}>{randomText}</div>
                                                            <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon" onClick={generateRandomText} style={{ marginRight: "8px" }}>
                                                                <i className="ri-refresh-fill align-middle"></i>
                                                            </button>
                                                        </Col>
                                                    </Row>
                                                </div>

                                                <div className="mt-3">
                                                    <Button disabled={error ? null : loading ? true : false} color="primary" className="btn btn-primary w-100" type="submit">
                                                        {error ? null : loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                                                        Sign In
                                                    </Button>
                                                </div>

                                                <div className="mt-3 text-center">
                                                    <div className="signin-other-title">
                                                        <h5 className="fs-13 mb-3 title">Follow us on</h5>
                                                    </div>
                                                    <div>
                                                        {/* <FacebookLogin
                                                            appId={facebook.APP_ID}
                                                            autoLoad={false}
                                                            callback={facebookResponse}
                                                            render={renderProps => (
                                                                <Button color="primary"
                                                                    className="btn-icon me-1"
                                                                    onClick={renderProps.onClick}
                                                                >
                                                                    <i className="ri-facebook-fill fs-16" />
                                                                </Button>
                                                            )}
                                                        /> */}
                                                        {/* <GoogleLogin
                                                            clientId={
                                                                google.CLIENT_ID ? google.CLIENT_ID : ""
                                                            }
                                                            render={renderProps => (
                                                                <Button color="danger"
                                                                    to="#"
                                                                    className="btn-icon me-1"
                                                                    onClick={renderProps.onClick}
                                                                >
                                                                    <i className="ri-google-fill fs-16" />
                                                                </Button>
                                                            )}
                                                            onSuccess={googleResponse}
                                                            onFailure={(error) => {
                                                            }}
                                                        /> */}
                                                        <a className="btn-icon me-1" target="_blank" rel="noreferrer" href='https://www.facebook.com/AmazinAutomationSolution/' style={{ background: "#405189", borderRadius: "4px", color: "#fff" }}><i className="ri-facebook-fill fs-16"></i></a>
                                                        <a className="btn-icon me-1" target="_blank" rel="noreferrer" href='https://in.linkedin.com/company/amazin1453211' style={{ background: "#004182", borderRadius: "4px", color: "#fff" }}><i className="ri-linkedin-fill fs-16"></i></a>
                                                        {/* <a className="btn-icon me-1" target="_blank" rel="noreferrer" href='https://www.youtube.com/channel/UCfqpuV-blFQaKMRTMm7eHJg/videos' style={{ background: "red", borderRadius: "4px", color: "#fff" }}><i className="ri-youtube-fill fs-16"></i></a> */}

                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>

                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>

        </React.Fragment>
    );
};

export default withRouter(Login); 