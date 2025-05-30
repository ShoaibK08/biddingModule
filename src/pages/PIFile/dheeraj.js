import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Button } from "reactstrap";
import axios from "axios";
import CountUp from "react-countup";
import BreadCrumb from '../../Components/Common/BreadCrumb';
import avatar from "../../assets/images/path.png";
import tagmapping from "../../assets/images/tagmapping.png";
import '../TruckMonitoring/truckMonitoring.scss';
import logoDark from "../../assets/images/no_data.png";
import './NehaRoadline.css';

const YourComponent = () => {

  const [status, setStatus] = useState("Connecting to WebSocket server...");
  const [message, setMessage] = useState([]);
  const [plantCode, setPlantCode] = useState(null); // State to hold the plant code

  useEffect(() => {
      // Retrieve the plant code from sessionStorage
      const authUser = JSON.parse(sessionStorage.getItem("authUser"));
      const plantCode = authUser?.data?.plantCode;
      setPlantCode(plantCode);
      
  }, []);



  document.title = "Truck Operation Monitoring Dashboard  | EPLMS";
  return (

      <React.Fragment>
          <div className="page-content">
              <Container fluid>
                  <BreadCrumb title={"Truck Operation Monitoring "} pageTitle="Dashboard" />

                  <div>
                      {/* <h1>WebSocket Vehicle Lookup</h1> */}
                      <p>{status}</p>
                      {/* <pre>{message}</pre> */}
                  </div>

                  <Row>
                      <Col lg={12}>
                          <Card>
                              <CardHeader className="sample-class">
                                  <h4 className="card-title mb-0 shimmer " id="sim_color" style={{ fontWeight: "bold", color: "blue !important" }}>REAL TIME TRUCK OPERATION MONITORING STATUS </h4>
                              </CardHeader>
                          </Card>
                      </Col>
                  </Row>
                  <Row>
                      <Col lg={9}>
                          <Card>
                              <CardBody className="shadow_light rounded d-flex" >
                                  <Col lg={1} md={2} style={{ borderRight: "solid 1px #ccc", width: "90px" }}>
                                      <img src={avatar} alt="" className="avatar-md rounded-circle img-thumbnail shadow" style={{ cursor: "default" }} />

                                  </Col>
                                  <div className="mt-1 ms-4">
                                      <h5 className={"fs-12 badge badge-soft-warning w-100 border blue_color"} style={{ margin: "5px 0px 0px", whiteSpace: "normal" }}>{"This is a Test Status. Please change it before deployment"}</h5>
                                      <h5 className={"fs-12 badge badge-soft-warning w-100 border blue_color"} style={{ margin: "5px 0px 0px", whiteSpace: "normal" }}>{"Test Status"}</h5>
                                  </div>
                              </CardBody>
                          </Card>
                      </Col>
                      <Col lg={3} >
                          <Card className="ribbon-box border shadow-none mb-lg-0">
                              <CardBody className="shadow_light rounded d-flex" style={{ minHeight: "102px" }}>
                                  <div className="ribbon-two ribbon-two-primary"><span>Remark</span></div>
                                  <img src={tagmapping} alt="" className="" style={{ cursor: "default", display: "block", margin: "6px 0 0 25px", height: "60px" }} />
                                  <Row className="" style={{ marginLeft: "-2px", textAlign: "center" }}>
                                      <Col xs={12}>
                                          <div className="text-start">
                                              <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-secure-payment-line me-1"></i></span>{"VEHICLE TAG"}</h5>

                                          </div>
                                      </Col>
                                      <Col xs={12}>
                                          <div>
                                              <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}><span style={{ animation: "blink 1s infinite" }}>{"MAPPED"}</span></h5>

                                          </div>
                                      </Col>
                                  </Row>
                              </CardBody>
                          </Card>
                      </Col>
                  </Row>
                  <Row>
                      <Col lg={12} className="mb-3">
                          <Card className="mt-0 shadow_light ribbon-box border mb-lg-0">
                              <CardHeader className="mb-0 fw-bold bg-primary fs-16 shadow_light text-white" style={{ float: "left" }}>Stage Wise Details</CardHeader>
                              <CardBody className="d-flex" style={{ margin: "0 auto" }}>
                                  <Row className="gx-4"> {/* Added gx-4 for equal spacing */}
                                      {
                                          message && message.length !== 0 ?
                                              message.map((item, key) => (
                                                  <Col lg={4} key={key}>
                                                      <Card className="ribbon-box border shadow-none mb-3">
                                                          <CardBody class="text-muted">
                                                              <span class="ribbon-three ribbon-three-primary rib_bon"><span>{item.stageName}</span></span>
                                                              <Row className="gy-3 mt-2">
                                                                  <Col xs={6}>
                                                                      <div className="text-start">
                                                                          <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-secure-payment-line me-1"></i></span>{"Vehicle No."}</h5>
                                                                          <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-secure-payment-line me-1"></i></span>{"DO Number"}</h5>
                                                                          <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-secure-payment-line me-1"></i></span>{"DO Quantity."}</h5>
                                                                          <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-secure-payment-line me-1"></i></span>{"IGP Number"}</h5>
                                                                          <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-secure-payment-line"></i></span>{"Net Weight"}</h5>
                                                                          <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-secure-payment-line"></i></span>{"Tolerance WT"}</h5>
                                                                          <h5 className="fs-12 badge badge-soft-primary w-100 fw-bold" style={{ margin: "5px 0 0 0" }}><span style={{ lineHeight: "0", fontWeight: "100" }}><i className="ri-secure-payment-line"></i></span>{"Stage Time"}</h5>

                                                                      </div>
                                                                  </Col>
                                                                  <Col xs={6}>
                                                                      <div>
                                                                          <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.vehicleNumber ? item.vehicleNumber : "N/A"}</h5>
                                                                          <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.doNumber ? item.doNumber : "N/A"}</h5>
                                                                          <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.doQuantity ? item.doQuantity : "N/A"}</h5>
                                                                          <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.igpNumber ? item.igpNumber : "N/A"}</h5>
                                                                          <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.netWeight ? item.netWeight : "N/A"}</h5>
                                                                          <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.toleranceWeight ? item.toleranceWeight : "N/A"}</h5>
                                                                          <h5 className={"fs-12 badge badge-soft-success w-100"} style={{ margin: "5px 0 0 0" }}>{item.stageTime ? (item.stageTime).replace("T", " ") : "N/A"}</h5>

                                                                      </div>
                                                                  </Col>
                                                                  <div className="mt-1">
                                                                      <h5 className={"fs-12 badge badge-soft-warning w-100 border"} style={{ margin: "5px 0px 0px", whiteSpace: "normal", textAlign: "start" }}>
                                                                          {`PLMS Status : ${item.message ? item.message : "N/A"}`}
                                                                      </h5>
                                                                      <h5 className={"fs-12 badge badge-soft-warning w-100 border"} style={{ margin: "5px 0px 0px", whiteSpace: "normal", textAlign: "start" }}>{"SAP Status : "}</h5>
                                                                  </div>
                                                              </Row>
                                                          </CardBody>
                                                      </Card>
                                                  </Col>
                                              ))
                                              : <div className="text-center"><img src={logoDark} alt="" height="273" width="400" /></div>
                                      }
                                  </Row>
                              </CardBody>
                          </Card>
                      </Col>
                  </Row>

              </Container>
          </div>
      </React.Fragment>
  )
}

export default YourComponent;
