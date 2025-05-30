import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Table } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../Reportmrp/Pmr.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import cameraPic from "../../../assets/images/bag.jpeg";
// import { valueContainerCSS } from "react-select/dist/declarations/src/components/containers";


const initialValues = {
  start_date: "",
  end_date: "",
  master_stage_id: "",
  master_plant_id: "",
  trip_movement_type_code: "",
  master_material_id: "",
};


const Reportmrp = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [devices, setDevice] = useState([]);
  const [Movement, setMovement] = useState([]);
  const [Material, setMaterial] = useState([]);
  const [Plant, setPlant] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [dynamicFlag, setDynamicFlag] = useState(1);
  const [HeaderName, setHeaderName] = useState("");

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  useEffect(() => {
    getHeaderName();
  }, []);

  const getHeaderName = () => {
    const main_menu = sessionStorage.getItem("main_menu_login");
    const obj = JSON.parse(main_menu).menuItems[8].subMenuMaster.name;
    setHeaderName(obj);
  }

  const [devicesa, setTable] = useState([]);

  const [percentageFlag, setPercentageFlag] = useState(false);
  



  // Customers Column
  const columns = [ // Assuming these are the columns configuration
    { Header: 'Sr No.', accessor: 'sr' },
    { Header: 'Loader', accessor: 'loader' },
    { Header: 'Vehicle No.', accessor: 'vehicleno' },
    { Header: 'Print Command', accessor: 'printcommand' },
    { Header: 'Printer Type', accessor: 'printertype' },
    { Header: 'Print Legibility', accessor: 'dbag' },
    { Header: 'Date Time ', accessor: 'datetime' },
    // ... Other column definitions
  ];




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
    });
  };

  const createdDateFunction = (date, date1, date2) => {

    setValues({
      ...values,
      ['start_date']: date1 + " 00:00:00",
    });
  };

  const createdDateFunction1 = (date, date1, date2) => {

    setValues({
      ...values,
      ['end_date']: date1 + " 00:00:00",
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ddd = " + values);
    let vehicleno = JSON.stringify(values.vehicleno);

    setPercentageFlag(true);
    //alert("vehicleno = "+vehicleno);
    //document.getElementById("vehicleno").innerHTML =vehicleno;

    // let createdDate=JSON.stringify(values.createdDate);



    //alert("createdDate = "+createdDate);

    //var vehicleno = document.getElementById("vehicleno").value;
    //alert("vehicleno = "+vehicleno);
    var imga = <img src={cameraPic} height={50}></img>;
    const devicesa = [ // Static data to be displayed in the table
      { sr: 7, loader: 'Loader 1', vehicleno: 'DL4SCS6083', printcommand: '13 02 01 23', printertype: 'Amazin', dbag: imga, datetime: '09-11-2023 00:00:00' },
      { sr: 6, loader: 'Loader 2', vehicleno: 'DL4SCS6083', printcommand: '13 02 01 12', printertype: 'Amazin', dbag: imga, datetime: '09-11-2023 00:00:00' },
      { sr: 5, loader: 'Loader 3', vehicleno: 'DL4SCS6083', printcommand: '13 02 01 56', printertype: 'Amazin', dbag: imga, datetime: '09-11-2023 00:00:00' },
      { sr: 4, loader: 'Loader 4', vehicleno: 'DL4SCS6083', printcommand: '13 02 01 90', printertype: 'Amazin', dbag: imga, datetime: '09-11-2023 00:00:00' },
      { sr: 3, loader: 'Loader 5', vehicleno: 'DL4SCS6083', printcommand: '13 02 01 23', printertype: 'Amazin', dbag: imga, datetime: '09-11-2023 00:00:00' },
      { sr: 2, loader: 'Loader 6', vehicleno: 'DL4SCS6083', printcommand: '13 02 01 33', printertype: 'Amazin', dbag: imga, datetime: '09-11-2023 00:00:00' },
      { sr: 1, loader: 'Loader 7', vehicleno: 'DL4SCS6083', printcommand: '13 02 01 60', printertype: 'Amazin', dbag: imga, datetime: '09-11-2023 00:00:00' },

      // ... More data objects
    ];
    setTable(devicesa);
    toggle();
  };

  // Add Data
  const handleCustomerClicks = () => {
    setIsEdit(false);
    toggle();
  };
  // Update Data


  // Delete Data



  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "MRP Printer Reports" + " || EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={devices}
        />

        <Container fluid>
          <BreadCrumb title={"MRP Printer Reports"} pageTitle="Reports" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0  bg-success-subtle">MRP Printer Reports</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                          Download
                        </button>
                      </div>
                    </div>
                    { }
                  </Row>
                  <Form className="tablelist-form" name="form_data" id="form_id" onSubmit={handleSubmit}>

                    <Row className="mt-4">
                      <Col lg={3} >
                        <div>
                          <Label className="form-label" >Vehicle No.<span style={{ color: "red" }}>*</span> </Label>
                          <Input type="text" required className="form-control shadow_light"
                            id="validationDefault04"
                            name="vehicleno"
                            placeholder="Enter Vehicle No."
                            value={values.vehicleno}
                            onChange={handleInputChange}

                          />
                        </div>
                      </Col>
                      <Col md={3}>
                        <Label htmlFor="validationDefault04" className="form-label">Start Date<span style={{ color: "red" }}>*</span></Label>
                        <Input type="date" required className="form-control shadow_light"
                          id="validationDefault04"
                          name="startdate"
                          value={values.startdate}
                          onChange={handleInputChange}

                        />
                      </Col>

                      <Col md={3}>
                        <Label htmlFor="validationDefault04" className="form-label">End Date<span style={{ color: "red" }}>*</span></Label>
                        <Input type="date" required className="form-control shadow_light"
                          id="validationDefault04"
                          name="enddate"
                          placeholder="Enter End Date."
                          value={values.enddate}
                          onChange={handleInputChange}
                        />
                      </Col>


                      <Col lg={1} >
                        <div>
                          <button type="submit" className="btn btn-success justify-content-end" style={{ marginTop: "28px", width: "auto", marginLeft: '-4px' }}>   Search</button>
                        </div>
                      </Col>
                      {percentageFlag &&
                        <Col lg={2} >
                          <div style={{ marginTop: "17px", borderRadius: "20px" }} class=" shadow" >
                            <div class="pe-3" style={{ height: '37px', marginTop: '30px', paddingLeft: '14px' }}>
                              <h6 class="mb-2 text-success" style={{ textAlign: 'center', paddingTop: '10px', animation: "blink 1s infinite", fontWeight: "bold", color: "#48d221 !important", }}>99.9 % of Accuracy</h6>

                            </div>
                          </div>
                        </Col>
                      }
                    </Row>
                  </Form>






                </CardHeader>
                <div className="card-body pt-0 mt-5">
                  <div>

                    <TableContainer
                      columns={columns}
                      data={devicesa}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={5}
                      isGlobalSearch={true}
                      className="custom-header-css"
                      handleCustomerClick={handleCustomerClicks}
                      //isCustomerFilter={true}
                      SearchPlaceholder='Search for MRP Printer Reports or something...'
                      divClass="overflow-auto"
                      tableClass="width-10"
                    />
                  </div>
                  { }
                  <ToastContainer closeButton={false} limit={1} />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>







    </React.Fragment>
  );
};

export default Reportmrp;
