import PropTypes from "prop-types";
import React from "react";
import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { useParams, useNavigate, Link } from "react-router-dom";
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userResetPassword } from "../../store/actions";

// import images
// import profile from "../../assets/images/bg.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

import withRouter from "../../Components/Common/withRouter";
import logoDark from "../../assets/images/Logo_dark.png";

const ChangePasswordPage = props => {
  const dispatch = useDispatch();
  const param = useParams();

  const history = useNavigate();
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Please Enter Your Old Password"),
      newPassword: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .matches(RegExp('(.*[a-z].*)'), 'At least lowercase letter')
            .matches(RegExp('(.*[A-Z].*)'), 'At least uppercase letter')
            .matches(RegExp('(.*[0-9].*)'), 'At least one number')
            .matches(RegExp('(?=.*[ -\/:-@\[-\`{-~]{1,})'), 'At least one special character')
            .required("This field is required"),
      confirmPassword: Yup.string().required("Please Enter Confirm Password").oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    }),
    onSubmit: (values) => {
      
      // alert("forget password submit");
      console.log(values);
      sessionStorage.getItem("authUser");
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let emailID = obj.data.email;
      
      const value = {...values, ["email"]: emailID,}
      console.log(value);
      dispatch(userResetPassword(value, props.router.navigate));
      //history('/login');
      // window.location.href = 'login';
    }
  });

  const { resetError, resetSuccessMsg } = useSelector(state => ({
    resetError: state.ForgetPassword.resetError,
    resetSuccessMsg: state.ForgetPassword.resetSuccessMsg,
  }));


  document.title = "Change Password | EPLMS";
  return (
    <ParticlesAuth>
      <div className="auth-page-content">

        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">

                <CardBody className="p-4" style={{ boxShadow: "-0 4px 4px 4px rgb(2 15 102 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)" }}>
                  <div className="text-center " style={{ marginTop: "-25px" }}>
                    <div style={{ padding: "40px" }}>
                      <Link to="/" className="d-inline-block auth-logo">
                        <img src={logoDark} alt="" height="100" />
                      </Link>
                    </div>
                    <h5 className="text-primary">Change Password</h5>
                  </div>

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
                    >
                      <div className="mb-4">
                        <Label className="form-label">Old Password</Label>
                        <Input
                          name="oldPassword"
                          className="form-control"
                          placeholder="Enter Old Password"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.oldPassword}
                          invalid={
                            validation.touched.oldPassword && validation.errors.oldPassword ? true : false
                          }
                        />
                        {validation.touched.oldPassword && validation.errors.oldPassword ? (
                          <FormFeedback type="invalid"><div>{validation.errors.oldPassword}</div></FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-4">
                        <Label className="form-label">New Password</Label>
                        <Input
                          name="newPassword"
                          className="form-control"
                          placeholder="Enter new password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.newPassword || ""}
                          invalid={
                            validation.touched.newPassword && validation.errors.newPassword ? true : false
                          }
                        />
                        {validation.touched.newPassword && validation.errors.newPassword ? (
                          <FormFeedback type="invalid"><div>{validation.errors.newPassword}</div></FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-4">
                        <Label className="form-label">Confirm Password</Label>
                        <Input
                          name="confirmPassword"
                          className="form-control"
                          placeholder="Enter confirm password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.confirmPassword || ""}
                          invalid={
                            validation.touched.confirmPassword && validation.errors.confirmPassword ? true : false
                          }
                        />
                        {validation.touched.confirmPassword && validation.errors.confirmPassword ? (
                          <FormFeedback type="invalid"><div>{validation.errors.confirmPassword}</div></FormFeedback>
                        ) : null}
                      </div>

                      <div className="text-center mt-4">
                        <button className="btn btn-success w-100" type="submit">Change Password</button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">Wait, I remember my password... <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Click here </Link> </p>
              </div>

            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

ChangePasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ChangePasswordPage);
