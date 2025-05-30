
import React, { useState } from 'react';
import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form } from "reactstrap";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// import images
// import profile from "../../assets/images/bg.png";
import logoLight from "../../assets/images/Logo_dark.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

import withRouter from "../../Components/Common/withRouter";

const OTPScreenPage = props => {
  const history = useNavigate();
  const [data, setData] = useState({
    emailOTP: ""
  })

  const { emailOTP, mobileOTP } = data;
  const [emailOTPError, setemailOTPError] = useState(null);
  const [MobileOTPError, setMobileOTPError] = useState(null);
  const [message, setMessage] = useState(null);

  const changeHandler = e => {
    setMessage(null);
    setData({ ...data, [e.target.name]: [e.target.value] });
  }

  const submitHandler = (event) => {
    
    event.preventDefault();
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let emailID = obj.data.email;

    var emailOtp = (data.emailOTP).toString();
    //var emailOtp = "123456";
    var email = emailID;
    if (emailOtp === "" || emailOtp === null || emailOtp === undefined) {
      setemailOTPError("This field can't be blank.");
    }
    else {
      setemailOTPError("");
    }
    //dispatch(validateOTP(JSON.stringify(values), props.history));
    axios.post(`${process.env.REACT_APP_LOCAL_URL}/userModule/users/otpVerification`, null, {
      params: {
        emailOtp,
        email
      }
    })
      .then(res => {
        if (res.message === "Invalid OTP") {
          setMessage(res.message);
        }
        else {
          history('/otp-screen-mobile');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  document.title = "OTP | Nayara - Energy";
  return (
    <ParticlesAuth>
      <div className="auth-page-content">

        <Container>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">

                <CardBody className="p-4" style={{ boxShadow: "-0 4px 4px 4px rgb(2 15 102 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)" }}>
                  <div className="text-center " style={{ marginTop: "-25px" }}>
                    <div>
                      <Link to="/" className="d-inline-block auth-logo">
                        <img src={logoLight} alt="" height="200" />
                      </Link>
                    </div>

                    <lord-icon
                      src="https://cdn.lordicon.com/rhvddzym.json"
                      trigger="loop"
                      colors="primary:#0ab39c"
                      className="avatar-xl"
                      style={{ width: "120px", height: "100px", marginTop: "-35px" }}
                    >
                    </lord-icon>

                  </div>

                  <Alert className="alert-borderless alert-warning text-center mb-2 mx-2" role="alert">
                    OTP has been sent to your registered Email Address
                  </Alert>
                  {message && message ? (<Alert color="danger" className="mt-4 mb-0"> {message} </Alert>) : null}
                  <div className="p-2">

                    <form onSubmit={submitHandler}>

                      <div className="mb-4">
                        <Label className="form-label">Email OTP</Label>
                        <Input
                          name="emailOTP"
                          className="form-control"
                          placeholder="Enter email OTP"
                          type="number"
                          onChange={changeHandler}
                          value={emailOTP}
                          invalid={
                            emailOTPError && emailOTPError ? true : false
                          }
                        />
                        {emailOTPError && emailOTPError ? (
                          <FormFeedback type="invalid">{emailOTPError}</FormFeedback>
                        ) : null}
                      </div>
                      <div className="text-center mt-4">
                        <input className="btn btn-success w-100" type="submit" name="submit" value="Submit" />
                      </div>
                    </form>

                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">Back to Login Page<Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Click here </Link> </p>
              </div>

            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};


export default withRouter(OTPScreenPage);
