
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

const OTPScreenPage2 = props => {
  const history = useNavigate();
  const [data, setData] = useState({
    mobileOTP: "123456"
  })

  const { emailOTP, mobileOTP } = data;
  const [emailOTPError, setemailOTPError] = useState(null);
  const [MobileOTPError, setMobileOTPError] = useState(null);
  const [message, setMessage] = useState(null);

  const changeHandler = e => {
    
    setMessage(null);
    setData({ ...data, [e.target.name]: [e.target.value] });
  }

  const submitHandler = e => {
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let emailID = obj.data.email;
    e.preventDefault();
    
    var msgOtp = "123456";
    var emaail = emailID;
    
    if(msgOtp === "" || msgOtp === null || msgOtp === undefined){
      setMobileOTPError("This field can't be blank.");
    }
    else{
      setMobileOTPError(null);
    }
    //dispatch(validateOTP(JSON.stringify(values), props.history));
    axios.post(`${process.env.REACT_APP_LOCAL_URL}/userModule/users/msgOtpVerification`, null, { params: {
      msgOtp,
      emaail
    }})
    .then(response => {
      console.log(response);
      if(response.message === "Invalid OTP"){
        setMessage(response.message);
      }
      else{
        history('/apps-nft-explore');
        const response1 = {
          "status": "success",
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNWQwOTUyNTU3NThiYjM0YWU4YzAyZSIsImlhdCI6MTY3NDE5NjE4OSwiZXhwIjoxNjgxOTcyMTg5fQ.ZGB5LGqIJqpTe3FN8YR--oDLl0g5BUmDnWaWNieo8ts",
          "data": {
              "_id": response.customerId,
              "first_name": response.userData.firstname,
              "last_name": response.userData.lastname,
              "email": response.userData.email,
              "phone": response.userData.contact,
              "password": "$2a$12$OdX.AB8Oiz6PEXohnREMjOtIy8h4/Ha3wPMHVcA/J373tQ0afoco2",
              "role": "admin",
              "confirm_password": "admin",
              "changePasswordAt": "2022-04-18T06:46:23.839Z",
              "skills": [
                  "LARAVEL",
                  "NODE"
              ],
              "__v": 0,
              "Description": "I'm Vikalp",
              "city": response.userData.cities.city,
              "country": "India",
              "designation": "Lead Designer / Developer",
              "joining_date": null,
              "website": "www.velzon.com",
              "zipcode": "90011",
              "passwordtoken": "ca24caf68d9c2a7d570d564473016600ff66ce49218f910d8cabb9a4c2707e0a",
              "passwordtokenexp": "2022-12-22T19:36:39.762Z"
          }
        };
        sessionStorage.setItem("authUser", JSON.stringify(response1));
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
                    OTP has been sent to your registered Mobile number and Email
                  </Alert>
                  {message && message ? (<Alert color="danger"  className="mt-4 mb-0"> {message} </Alert>) : null}
                  <div className="p-2">

                    <form onSubmit={submitHandler}>
                      <div className="mb-4">
                        <Label className="form-label">Mobile OTP</Label>
                        <Input
                          name="mobileOTP"
                          className="form-control"
                          placeholder="Enter Mobile OTP"
                          type="number"
                          onChange={changeHandler}
                          value={mobileOTP}
                          invalid={
                            MobileOTPError && MobileOTPError ? true : false
                          }
                        />
                        {MobileOTPError && MobileOTPError ? (
                          <FormFeedback type="invalid">{MobileOTPError}</FormFeedback>
                        ) : null}
                      </div>
                      <div className="text-center mt-4">
                        <input className="btn btn-success w-100" type="submit" name="submit" value="Submit"/>
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


export default withRouter(OTPScreenPage2);
