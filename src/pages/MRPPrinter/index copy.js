import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Table } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
//import '../MasterVehicle/Vehicle.css';
import TableContainer from "../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import classnames from "classnames";
import { MultiSelect } from "react-multi-select-component";
import cameraPic from "../../assets/images/camera.png";
import singlecameraPic from "../../assets/images/single.png";
import allcameraPic from "../../assets/images/allcamera.png";
import nocameraPic from "../../assets/images/nocameraactive.png";
import '../MRPPrinter/mrp.css';
//const MrpPrinter = () => {
const TableComponent = () => {
  // Sample data for the table


  const openModalCamera = () => {
    setViewModalCamera();
  }

  const setViewModalCamera = () => {
    setCameraModal(!cameraModal);
  };

  const openModalCameraa = () => {
    setViewModalCameraa();
  }

  const setViewModalCameraa = () => {
    setCameraModala(!cameraModala);
  };
  // Outline Border Nav Tabs
  const [data, setData] = useState([]);
  const [outlineBorderNav, setoutlineBorderNav] = useState("1");
  const outlineBorderNavtoggle = (tab) => {
    if (outlineBorderNav !== tab) {
      setoutlineBorderNav(tab);
    }

  };

  const [values, setValues] = useState([]);
  const [roledepartment, setroledeprtmentmap] = useState([]);
  const [mapedmenus, setmappedmenus] = useState([]);
  const [id, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [inputplantcode, setplantcode] = useState([]);
  const [inputlastname, setlastname] = useState([]);
  const [cameraModal, setCameraModal] = useState(false);
  const [cameraModala, setCameraModala] = useState(false);
  const [HeaderName, setHeaderName] = useState("");
  const [LoaderData, setLoaderData] = useState([]);
  const [errorAuto, setErrorAuto] = useState(false);

  useEffect(() => {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantCode = obj.data.plantCode;
    getuserdata();
    getHeaderName();
    getLoaderData(plantCode);
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

  const getHeaderName = () => {
    const main_menu = sessionStorage.getItem("main_menu_login");
    const obj = JSON.parse(main_menu).menuItems[2].subMenuMaster.name;
    setHeaderName(obj);
  }

  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleSelectChange = (filteredSelected) => {
    setSelectedOptions(filteredSelected);

  };

  const getLoaderData = (plantCode) => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/getPackerDataByType?type=L&plantCode=${plantCode}`, config)
      .then(res => {
        const data = res;
        setLoaderData(data);
      })
  }



  const getuserdata = () => {
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    let lastname = obj.data.last_name;
    //alert("Plant Code="+plantcode+"lastname = "+lastname);
    setplantcode(plantcode);
    setlastname(lastname);
    //document.getElementById("plantcode").value=plantcode;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value

    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("ddd = " + values);
    let packerCode = JSON.stringify(values.packerCode);
    document.getElementById("dia").innerHTML = packerCode;

    let loader = JSON.stringify(values.loader);
    document.getElementById("loader").innerHTML = loader;

    let vehicleno = JSON.stringify(values.vehicleno);
    document.getElementById("vehicleno").innerHTML = vehicleno;

    let printcommand = JSON.stringify(values.di);
    document.getElementById("printcommand").innerHTML = printcommand;

    let flyash = JSON.stringify(values.flyash);
    document.getElementById("flyash").innerHTML = flyash;

    //const storedData = JSON.parse(localStorage.getItem('formData'));



    //const options = JSON.stringify(selectedOptions); 
    const options = selectedOptions;
    const mapedmenuname = options.map(item => item.value);
    //console.log(valueNames);
    // alert("mapedmenuname = "+mapedmenuname+"mapedmenuname = "+mapedmenuname.length);
    var subMenuList = JSON.stringify(mapedmenuname);
    //  alert("subMenuList = "+subMenuList);

    const mapedmenusa = mapedmenus.map(item => item.value);
    var menumaped = JSON.stringify(mapedmenusa);

    var resultArray = mapedmenuname.filter(item => !mapedmenusa.includes(item));

    console.log(resultArray);

    //alert("resultArray = "+resultArray);
  };


  const handleSubmitauto = async (e) => {
    debugger;
    e.preventDefault();

    // let loaderCode = JSON.stringify(values.loaderCode);
    // await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/devices/bag/${JSON.parse(loaderCode)}`, config)
    //   .then(res => {
    //     if (res === "Active vehicle not found") {
    //       setErrorAuto(true);
    //     } else {
    //       setErrorAuto(false);
          document.getElementById("vehicleauto").innerHTML = "BP06H9338";
          document.getElementById("recentCommand").innerHTML = "N/A";
          document.getElementById("productCode").innerHTML = "PPC";
          document.getElementById("loaderauto").innerHTML = "Loader-1";
          document.getElementById("packerauto").innerHTML = "Packer-1";
        }

      //})
  //};

  document.title = "MRP ASSIGN MANUAL" + " || EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title={"MRP ASSIGN MANUAL"} pageTitle="Dashboard" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <div className="card-body pt-4">
                  <Nav pills className="nav-customs nav-danger mb-3 nav nav-pills">
                    <NavItem>
                      <NavLink id="tab1" style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "1", })} onClick={() => { outlineBorderNavtoggle("1"); }}>  Auto     </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink id="tab2" style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "2", })} onClick={() => { outlineBorderNavtoggle("2"); }}>   Manual     </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={outlineBorderNav} className="text-muted">
                    <TabPane tabId="1" id="border-nav-home">
                      <Form className="tablelist-form" name="form_data" id="form_id" onSubmit={handleSubmitauto}>

                        <Row className="g-3 border border-dashed" style={{ margin: "-17px 0 0 0", paddingBottom: "20px" }}>


                          <Col lg={3}>
                            <div>
                              <Label className="form-label" >Loader Name<span style={{ color: "red" }}>*</span></Label>
                              <Input
                                name="loaderCode"
                                type="select"
                                className="form-select"
                                value={values.loaderCode}
                                onChange={handleInputChange}
                                required
                              >
                                <React.Fragment>
                                  <option value="" selected>Select Loader Name</option>
                                  {LoaderData.map((item, key) => (<option value={item.name} key={key}>{item.name}</option>))}
                                </React.Fragment>
                              </Input>
                            </div>
                          </Col>


                          <Col lg={3} >
                            <div>
                              <button type="submit" className="btn btn-success justify-content-end" style={{ marginTop: "28px", width: "auto", marginLeft: "10px" }}><i className="ri-search-line"></i>&nbsp;&nbsp;<span>Search</span></button>
                            </div>
                          </Col>
                          {errorAuto && <p className="mb-0" style={{color:"red"}}>{"No Active Vehicle Found!"}</p>}
                        </Row>
                        
                      </Form>

                      <Row>
                        <Col lg={12}>
                          <Card id="customerList" className="mt-3 shadow_light">
                            <div className="card-body pt-4">

                              <TabContent activeTab={outlineBorderNav} className="text-muted">
                                <TabPane tabId="1" id="border-nav-home">
                                  <Row className="g-3">

                                    <Col xxl={6} sm={6} className="project-card">
                                      <Card className="card-height-100 shadow_light">
                                        <CardBody >
                                          <div className="d-flex flex-column h-100">
                                            <div className="mt-n3 mx-n3 bg-success-subtle rounded-top" style={{ padding: "8px 5px 8px 17px" }}>
                                              <div className="d-flex">
                                                <div className="flex-grow-1">
                                                  {/* <h5 className="text-primary m-0">{"Packer-1 Radial"} <button type="button" title="Refresh" className="btn bg-success btn-sm btn float-end text-white" style={{ margin: "-4px 0 -3px 0px" }} onClick={() => { openModalCamera() }}><i class="ri-vidicon-2-line"></i></button></h5> */}
                                                  <h5 className="text-primary m-0">{"Vehicle Details"}
                                                  </h5>
                                                </div>
                                              </div>
                                            </div>

                                            <Row className="gy-3">
                                              <Col xs={4}>
                                                <div>
                                                  <h5 className="fs-16 mb-3 mt-2">{"Vehicle Number"}</h5>
                                                  <h5 className="fs-16 mb-3 mt-2">{"Recent Command"}</h5>
                                                  <h5 className="fs-16 mb-3 mt-2">{"Product Code"}</h5>
                                                  <h5 className="fs-16 mb-3 mt-2">{"Loader"}</h5>
                                                  <h5 className="fs-16 mb-3 mt-2">{"Packer"}</h5>
                                                </div>
                                              </Col>
                                              <Col xs={4} className="text-center">
                                                <div>
                                                  <p className="text-muted mb-3 mt-2">-</p>
                                                  <p className="text-muted mb-3 mt-2">-</p>
                                                  <p className="text-muted mb-3 mt-2">-</p>
                                                  <p className="text-muted mb-3 mt-2">-</p>
                                                  <p className="text-muted mb-3 mt-2">-</p>
                                                </div>
                                              </Col>
                                              <Col xs={4} className="text-center">
                                                <div>
                                                  <p className="text-muted mb-3 mt-2" id="vehicleauto"></p>
                                                  <p className="text-muted mb-3 mt-2" id="recentCommand"></p>
                                                  <p className="text-muted mb-3 mt-2" id="productCode"></p>
                                                  <p className="text-muted mb-3 mt-2" id="loaderauto"></p>
                                                  <p className="text-muted mb-3 mt-2" id="packerauto"></p>
                                                </div>
                                              </Col>
                                            </Row>

                                            <div className="mt-auto">
                                              <div className="d-flex mb-2">
                                                <div className="flex-shrink-0">
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </CardBody>

                                      </Card>
                                    </Col>

                                    <Col xxl={6} sm={6} className="project-card">
                                      <Card className=" shadow_light">
                                        <CardBody >
                                          <div className="d-flex flex-column">
                                            <div className="mt-n3 mx-n3 bg-success-subtle rounded-top" style={{ padding: "8px 5px 8px 17px" }}>
                                              <div className="d-flex">
                                                <div className="flex-grow-1">
                                                  {/* <h5 className="text-primary m-0">{"Packer-1 Radial"} <button type="button" title="Refresh" className="btn bg-success btn-sm btn float-end text-white" style={{ margin: "-4px 0 -3px 0px" }} onClick={() => { openModalCamera() }}><i class="ri-vidicon-2-line"></i></button></h5> */}
                                                  <h5 className="text-primary m-0">{"Camera View"}
                                                  </h5>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </CardBody>

                                        <Row className=" d-inline-flex text-center">
                                          <div className="bg-transparent p-2" style={{ height: '204px' }}>

                                            <Col xxl={6} sm={6} style={{ float: 'inline-end' }}>
                                              <button class="round-button button_custom" onClick={() => { openModalCamera() }}>
                                                <div class="round-button-circle singleimg">

                                                </div>
                                              </button>
                                              <h6 onClick={() => { openModalCamera() }} style={{ cursor: 'pointer' }}>Single Camera View</h6>
                                            </Col>


                                            <Col xxl={6} sm={6}>
                                              <button class="round-button button_custom" onClick={() => { openModalCameraa() }}>
                                                <div class="round-button-circle allimg">
                                                </div>

                                              </button>
                                              <h6 onClick={() => { openModalCamera() }} style={{ cursor: 'pointer' }}>All Camera View</h6>
                                            </Col>

                                          </div>
                                        </Row>

                                      </Card>
                                    </Col>

                                  </Row>
                                </TabPane>
                              </TabContent>
                            </div>
                          </Card>
                        </Col>

                      </Row>
                    </TabPane>
                  </TabContent>
                  <TabContent activeTab={outlineBorderNav} className="text-muted">
                    <TabPane tabId="2" id="border-nav-home">
                      <Form className="tablelist-form" name="form_data" id="form_id" onSubmit={handleSubmit}>

                        <Row className="g-3">
                          <Col lg={3} >
                            <div>
                              <Label className="form-label" >DI No. </Label>
                              <Input type="text" required className="form-control shadow_light"
                                id="validationDefault04"
                                name="di"
                                placeholder="Enter DI No."
                                value={values.di}
                                onChange={handleInputChange}
                              />
                            </div>
                          </Col>

                          <Col lg={3}>
                            <div>
                              <Label className="form-label" >Loader Name<span style={{ color: "red" }}>*</span></Label>
                              <Input
                                name="loaderCode"
                                type="select"
                                className="form-select"
                                value={values.loaderCode}
                                onChange={handleInputChange}
                                required
                              >
                                <React.Fragment>
                                  <option value="" selected>Select Loader Name</option>
                                  {LoaderData.map((item, key) => (<option value={item.code} key={key}>{item.name}</option>))}
                                </React.Fragment>
                              </Input>
                            </div>
                          </Col>

                          <Col lg={3} >
                            <div>
                              <Label className="form-label" >Vehicle No. </Label>
                              <Input type="text" required className="form-control shadow_light"
                                id="validationDefault04"
                                name="vehicleno"
                                placeholder="Enter Vehicle No."
                                value={values.vehicleno}
                                onChange={handleInputChange}
                              />
                            </div>
                          </Col>


                          <Col lg={3} >
                            <div>
                              <Label className="form-label" >Print Command</Label>
                              <Input type="text" required className="form-control shadow_light"
                                id="validationDefault04"
                                name="printcommand"
                                placeholder="Enter Print Command"
                                value={values.printcommand}
                                onChange={handleInputChange}
                              />
                            </div>
                          </Col>

                          <Col lg={3} >
                            <div>
                              <Label className="form-label" >FlyAsh %</Label>
                              <Input type="text" required className="form-control shadow_light"
                                id="validationDefault04"
                                name="flyash"
                                placeholder="Enter FlyAsh %"
                                value={values.flyash}
                                onChange={handleInputChange}
                              />
                            </div>
                          </Col>

                          <Col lg={3} >
                            <div>
                              <button type="submit" className="btn btn-success justify-content-end" style={{ marginTop: "28px", width: "auto", marginLeft: "10px" }}><i className="ri-stack-line align-bottom me-1"></i>   Submit</button>
                            </div>
                          </Col>
                          <ToastContainer closeButton={false} limit={1} />
                        </Row>
                      </Form>

                      <br />

                      <Row>
                        <Col lg={12}>
                          <Card id="customerList">
                            <div className=" pt-4">

                              <div className="table-responsive">

                                <Table className="align-middle table-nowrap mb-0">
                                  <thead>
                                    <tr>
                                      <th scope="col">DI No.</th>
                                      <th scope="col">Loader</th>
                                      <th scope="col">Vehicle No.</th>
                                      <th scope="col">Print Command</th>
                                      <th scope="col">FlyAsh %</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td id="dia"></td>
                                      <td id="loader"></td>
                                      <td id="vehicleno"></td>
                                      <td id="printcommand"></td>
                                      <td id="flyash"></td>
                                    </tr>

                                  </tbody>
                                </Table>


                              </div>

                            </div>

                          </Card>
                        </Col>
                      </Row>

                    </TabPane>
                  </TabContent>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>


      </div>



      <Modal isOpen={cameraModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="xl" toggle={setViewModalCamera}>
        <ModalHeader toggle={setViewModalCamera} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-white fs-20 m-0"><img style={{ marginTop: "-4px" }} src={cameraPic} alt="" height="30" /> &nbsp;&nbsp;&nbsp;{"Single Camera View"}</h5>
        </ModalHeader>
        <ModalBody>
          <div className="product-content mt-0">
            <video controls autoPlay width="100%">
              <source src={"/video/bag_counter_video.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </ModalBody>
      </Modal>


      <Modal isOpen={cameraModala} role="dialoga" autoFocus={true} centered id="removeItemModal" size="xl" toggle={setViewModalCameraa}>
        <ModalHeader toggle={setViewModalCameraa} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-white fs-20 m-0"><img style={{ marginTop: "-4px" }} src={cameraPic} alt="" height="30" /> &nbsp;&nbsp;&nbsp;{"All Camera View"}</h5>
        </ModalHeader>
        <ModalBody>
          <div className="product-content mt-0">


            <div className="py-3">
              <Row className="gy-3">

                <Col xs={4}>
                  <div>
                    <div className="product-content mt-0">
                      <video controls autoPlay width="100%">
                        <source src={"/video/bag_counter_video.mp4"} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </Col>

                <Col xs={4}>
                  <div>
                    <div className="product-content mt-0">
                      <video controls autoPlay width="100%">
                        <source src={"/video/bag_counter_video.mp4"} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </Col>



                <Col xs={4}>
                  <div>
                    <div className="product-content mt-0">
                      <video controls autoPlay width="100%">
                        <source src={"/video/bag_counter_video.mp4"} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </Col>


                <Col xs={4}>
                  <div>
                    <div className="product-content mt-0">
                      <video controls autoPlay width="100%">
                        <source src={"/video/bag_counter_video.mp4"} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </Col>

                <Col xs={4}>
                  <div>
                    <div className="product-content mt-0">
                      <video controls autoPlay width="100%">
                        <source src={"/video/bag_counter_video.mp4"} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </Col>

                <Col xs={4}>
                  <div>
                    <div className="product-content mt-0">
                      <video controls autoPlay width="100%">
                        <source src={"/video/bag_counter_video.mp4"} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </Col>


                <Col xs={4}>
                  <div>
                    <div className="product-content mt-0">
                      <video controls autoPlay width="100%">
                        <source src={"/video/bag_counter_video.mp4"} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </Col>


                <Col xs={4}>
                  <div>
                    <div className="product-content mt-0">
                      <video controls autoPlay width="100%">
                        <source src={"/video/bag_counter_video.mp4"} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </Col>

                <Col xs={4}>
                  <div>
                    <div className="product-content mt-0">
                      <video controls autoPlay width="100%">
                        <source src={"/video/bag_counter_video.mp4"} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </Col>



              </Row>
            </div>


          </div>
        </ModalBody>
      </Modal>



    </React.Fragment>
  );
};

export default TableComponent;
