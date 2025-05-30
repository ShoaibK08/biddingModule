import React, { useState, useCallback } from "react";
import { Row, Col, ModalBody, Label, Input, Nav, NavItem, NavLink, TabContent, TabPane,} from "reactstrap";
import classnames from "classnames";
import * as moment from "moment";

import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  getVehicle as onGetCustomers,
  addNewVehicle1 as onAddNewVehicle,
  updateCustomer1 as onUpdateCustomer,
  deleteCustomer1 as onDeleteCustomer,
} from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';

export default function AddVehicle() {
    const dispatch = useDispatch();

    const [isEdit, setIsEdit] = useState(false);
    const [transporter, setTransporter] = useState([]);
  
    const [modal, setModal] = useState(false);
  
    const toggle = useCallback(() => {
      if (modal) {
        setModal(false);
        setTransporter(null);
      } else {
        setModal(true);
      }
    }, [modal]);

    const fleetType = [
        {
          options: [
            { label: "Select fleet type", value: "" },
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ],
        },
      ];
    
      const volumeBasedLiquid = [
        {
          options: [
            { label: "Volume based Liquid", value: "" },
            { label: "MS –YES/NO", value: "MS –YES/NO" },
            { label: "HSD –YES/NO", value: "HSD –YES/NO" },
            { label: " LDO", value: " LDO" },
            { label: " HF-HSD", value: " HF-HSD" },
          ],
        },
      ];
    
      const weightBasedLiquid = [
        {
          options: [
            { label: "Weight based Liquid", value: "" },
            { label: "MOLTEN SULPHUR", value: "MOLTEN SULPHUR" },
            { label: "LPG", value: "LPG" },
            { label: " BITUMEN", value: " BITUMEN" },
            { label: " LIQ NITROGEN", value: " LIQ NITROGEN" },
          ],
        },
      ];
    
      const weightBasedSolid = [
        {
          options: [
            { label: "Weight based solid", value: "" },
            { label: "PETCOKE", value: "PETCOKE" },
            { label: "SULPHUR", value: "SULPHUR" },
            { label: " FLYASH", value: " FLYASH" },
            { label: " BOTTOM ASH", value: "BOTTOM ASH" },
            { label: " OFF-SPEC SULPHUR", value: " OFF-SPEC SULPHUR" },
            { label: " OFF-SPEC PETCOKE", value: " OFF-SPEC PETCOKE" },
            { label: " CONTAMINATED SULPHUR", value: " CONTAMINATED SULPHUR" },
          ],
        },
      ];

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
          vehicle_number: '',
        },
        validationSchema: Yup.object({
          vehicle_number: Yup.string().required("Please Enter vehicle number"),
          
        }),
        onSubmit: (values) => {
            console.log("test");
            if (isEdit) {
              const updateVehicle = {
                _id: transporter ? transporter._id : 0,
                transporter_name: values.transporter_name,
              };
              // update customer
              dispatch(onUpdateCustomer(updateVehicle));
              validation.resetForm();
            } else {
                alert("dffd");
              const addVehicle = {
                _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
                transporter_name: values["transporter_name"],
              };
              // save new customer
              dispatch(onAddNewVehicle(addVehicle));
              validation.resetForm();
            }
            toggle();
          },
      });

    
    return (
        <ModalBody>
                        <input type="hidden" id="id-field" />

                        <div
                          className="mb-3"
                          id="modal-id"
                          style={{ display: "none" }}
                        >
                          <Label htmlFor="id-field1" className="form-label">
                            ID
                          </Label>
                          <Input
                            type="text"
                            id="id-field1"
                            className="form-control"
                            placeholder="ID"
                            readOnly
                          />
                        </div>
                        <Row className="g-3">
                        <Col md={3}>
                        <Label htmlFor="validationDefault01" className="form-label">VEHICLE NUMBER</Label>
                        <Input type="text" className="form-control" name="vehicle_number" id="validationDefault01" defaultValue="Mark" required />
                        </Col>
                        <Col md={3}>
                        <Label htmlFor="validationDefault02" className="form-label">MODEL NUMBER</Label>
                        <Input type="text" className="form-control" id="validationDefault02" defaultValue="Otto" required />
                        </Col>
                        <Col md={3}>
                        <Label htmlFor="validationDefault04" className="form-label">VEHICLE TU TYPE</Label>
                        <select className="form-select" id="validationDefault04" required>
                            <option disabled defaultValue="">Choose...</option>
                            <option>Truck WT 20 TON</option>
                            <option>Truck WT 30 TON</option>
                            <option>Truck WT 40 TON</option>
                        </select>
                        </Col>
                        <Col md={3}>
                        <Label htmlFor="validationDefault02" className="form-label">TRANSPORT UNIT(UNLADEN WT.)</Label>
                        <Input type="text" className="form-control" id="validationDefault02" defaultValue="Otto" required />
                        </Col>
                        <Col md={3}>
                        <Label htmlFor="validationDefault03" className="form-label">MAX WT. FOR TRANSPORT UNIT</Label>
                        <Input type="text" className="form-control" id="validationDefault03" required />
                        </Col>
                        <Col md={3}>
                        <Label htmlFor="validationDefault02" className="form-label">COMPARTMENT MAX WEIGHT</Label>
                        <Input type="text" className="form-control" id="validationDefault02" defaultValue="Otto" required />
                        </Col>
                        <Col md={3}>
                        <Label htmlFor="validationDefault04" className="form-label">VEHICLE TYPE</Label>
                        <select className="form-select" id="validationDefault04" required>
                            <option disabled defaultValue="">Choose...</option>
                            <option>Container Truck</option>
                        </select>
                        </Col>
                        <Col md={3}>
                        <Label htmlFor="validationDefault04" className="form-label">MODE OF TRANSPORT</Label>
                        <select className="form-select" id="validationDefault04" required>
                            <option disabled defaultValue="">Choose...</option>
                            <option>By Road</option>
                        </select>
                        </Col>
                        <Col md={3}>
                        <Label htmlFor="validationDefault05" className="form-label">CHASSIS NUMBER</Label>
                        <Input type="text" className="form-control" id="validationDefault05" required />
                        </Col>
                        
                        <Col lg={3}>
                            <div>
                            <Label className="form-label">YEAR OF MANUFACTURING</Label>
                            <Flatpickr
                                className="form-control"
                                options={{
                                dateFormat: "d M, Y"
                                }}
                            />
                            </div>
                        </Col>
                        
                        <div className="hstack gap-2 justify-content-end">
                            <button type="button" className="btn btn-light" onClick={toggle}> Close </button>

                            <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Vehicle"} </button>
                        </div>
                        </Row>
                      </ModalBody>
                      
                      
    );
}

/*
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, InputGroup, Col, Card, CardHeader, Button, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, CardBody } from "reactstrap";
import "./Vehicle.css";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { isEmpty } from "lodash";
import * as moment from "moment";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";

const MasterVehicle = () => {
  const dispatch = useDispatch();

  const { vehicles, isVehiclesCreated, isVehiclesSuccess, error } = useSelector((state) => ({
    vehicles: state.Master.vehicles,
    isVehiclesCreated: state.Master.isVehiclesCreated,
    isVehiclesSuccess: state.Master.isVehiclesSuccess,
    error: state.Master.error,
  }));

  const [isEdit, setIsEdit] = useState(false);
  const [customer, setCustomer] = useState([]);

  // Delete customer
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCustomer(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  const customerstatus = [
    {
      options: [
        { label: "Status", value: "Status" },
        { label: "All", value: "All" },
        { label: "Active", value: "Active" },
        { label: "Block", value: "Block" },
      ],
    },
  ];

  // Delete Data
  const onClickDelete = (customer) => {
    setCustomer(customer);
    setDeleteModal(true);
  };

  useEffect(() => {
    setCustomer(vehicles);
  }, [vehicles]);

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Vehicles | Nayara - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">

        <Container fluid>
          <BreadCrumb title="VEHICLE STATUS" pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="search_div">
                <CardHeader className="border-0">
                  <Row className="inside ">
                    <Col xxl={3} md={6}>
                      <h2 align="right " className="green "> Vehicle Search</h2>
                    </Col>
                    <Col xxl={6} md={6}>
                      <div>
                        <Input type="text" className="form-control rounded-pill" id="exampleInputrounded" placeholder="Vehicle No. Last four digit.. " />
                      </div>
                    </Col>
                    <Col xxl={2} md={2}>
                      <Button color="success" className="btn-label right rounded-pill"> <i className="ri-search-line label-icon align-middle rounded-pill fs-16 ms-2"></i> Search </Button>
                    </Col>
                  </Row>
                </CardHeader>

              </Card>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="bg-light p-3 card-header"><h5 className="modal-title" style={{ color: "#fff" }}>DETAILS OF VEHICLE</h5></CardHeader>
                <CardBody>
                  <form className="row g-3">
                    <Col md={3}>
                      <Label htmlFor="validationDefault01" className="form-label">VEHICLE NUMBER</Label>
                      <Input type="text" className="form-control" id="validationDefault01" defaultValue="Mark" required />
                    </Col>
                    <Col md={3}>
                      <Label htmlFor="validationDefault02" className="form-label">MODEL NUMBER</Label>
                      <Input type="text" className="form-control" id="validationDefault02" defaultValue="Otto" required />
                    </Col>
                    <Col md={3}>
                      <Label htmlFor="validationDefault04" className="form-label">VEHICLE TU TYPE</Label>
                      <select className="form-select" id="validationDefault04" required>
                        <option disabled defaultValue="">Choose...</option>
                        <option>Truck WT 20 TON</option>
                        <option>Truck WT 30 TON</option>
                        <option>Truck WT 40 TON</option>
                      </select>
                    </Col>
                    <Col md={3}>
                      <Label htmlFor="validationDefault02" className="form-label">TRANSPORT UNIT(UNLADEN WT.)</Label>
                      <Input type="text" className="form-control" id="validationDefault02" defaultValue="Otto" required />
                    </Col>
                    <Col md={3}>
                      <Label htmlFor="validationDefault03" className="form-label">MAX WT. FOR TRANSPORT UNIT</Label>
                      <Input type="text" className="form-control" id="validationDefault03" required />
                    </Col>
                    <Col md={3}>
                      <Label htmlFor="validationDefault02" className="form-label">COMPARTMENT MAX WEIGHT</Label>
                      <Input type="text" className="form-control" id="validationDefault02" defaultValue="Otto" required />
                    </Col>
                    <Col md={3}>
                      <Label htmlFor="validationDefault04" className="form-label">VEHICLE TYPE</Label>
                      <select className="form-select" id="validationDefault04" required>
                        <option disabled defaultValue="">Choose...</option>
                        <option>Container Truck</option>
                      </select>
                    </Col>
                    <Col md={3}>
                      <Label htmlFor="validationDefault04" className="form-label">MODE OF TRANSPORT</Label>
                      <select className="form-select" id="validationDefault04" required>
                        <option disabled defaultValue="">Choose...</option>
                        <option>By Road</option>
                      </select>
                    </Col>
                    <Col md={3}>
                      <Label htmlFor="validationDefault05" className="form-label">CHASSIS NUMBER</Label>
                      <Input type="text" className="form-control" id="validationDefault05" required />
                    </Col>
                    
                      <Col lg={3}>
                        <div>
                          <Label className="form-label">YEAR OF MANUFACTURING</Label>
                          <Flatpickr
                            className="form-control"
                            options={{
                              dateFormat: "d M, Y"
                            }}
                          />
                        </div>
                      </Col>
                    
                    <Col xs={6} style={{marginTop:"42px"}}>
                      <button className="btn btn-primary align-right" type="submit">Submit form</button>
                    </Col>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MasterVehicle;
*/