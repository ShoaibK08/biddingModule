import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import classnames from "classnames";

const initialValues = {
  id: "",
  customerCode: "",
  firstname: "",
  lastname: "",
  fatherName: "",
  aadharNumber: "",
  mobileNumber: "",
  emergencyContactNumber: "",
  emergencyContactPersonName: "",
  relationWithEmergencyContactPerson: "",
  dob: "",
  customerType: "",
  shipingType: "",
  vatGst: "",
  address: "",
  pincode: "",
  postOffice: "",
  city: "",
  plantName: "",
  email: "",
  contact: "",
  status: "",
  approvalFlag: "",
  vehicleMinCapacity: "",
  vehicleMaxCapacity: "",
};


const MasterCustomer = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [devices, setDevice] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
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

  const checkFirstTabvalue = (tab) => {
    if (
      document.getElementById("val1").value === "" ||
      document.getElementById("val2").value === "" ||
      document.getElementById("val3").value === "" ||
      document.getElementById("val4").value === "" ||
      document.getElementById("val5").value === "" ||
      document.getElementById("val6").value === "" ||
      document.getElementById("val7").value === ""
    ) {
      return false;
    }
    else {
      if (outlineBorderNav !== tab) {
        setoutlineBorderNav(tab);
      }
    }
  }


  useEffect(() => {
    getAllDeviceData();

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

  const getAllDeviceData = () => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/customers`, config)
      .then(res => {
        const device = res;
        setDevice(device);
      });
  }

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
      ['dob']: date1,
    });
  };
  const createdDateFunction1 = (date, date1, date2) => {
    setValues({
      ...values,
      ['transporter']: date1,
    });
  };
  const createdDateFunction2 = (date, date1, date2) => {
    setValues({
      ...values,
      ['pollutionExpiryDate']: date1,
    });
  };
  const createdDateFunction3 = (date, date1, date2) => {
    setValues({
      ...values,
      ['fitnessExpiryDate']: date1,
    });
  };
  const createdDateFunction4 = (date, date1, date2) => {
    setValues({
      ...values,
      ['insurancePolicyExpiry']: date1,
    });
  };
  const createdDateFunction5 = (date, date1, date2) => {
    setValues({
      ...values,
      ['insurancePolicyNumber']: date1,
    });
  };
  const createdDateFunction6 = (date, date1, date2) => {
    setValues({
      ...values,
      ['taxRenewalDate']: date1,
    });
  };
  const createdDateFunction7 = (date, date1, date2) => {
    setValues({
      ...values,
      ['createdDate']: date1,
    });
  };
  const createdDateFunction8 = (date, date1, date2) => {
    setValues({
      ...values,
      ['receivedDate']: date1,
    });
  };


  const handleSubmit = async (e) => {
    
    console.log(values)
    e.preventDefault();
    try {
      if (isEdit) {
        const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/customers/${CurrentID}`, values, config)
        console.log(res);
        toast.success("Customers Updated Successfully", { autoClose: 3000 });
        getAllDeviceData();
      }
      else {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/customers`, values, config)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Customers Added Successfully.", { autoClose: 3000 });
        }
        else {
          toast.error("Data Already Exist.", { autoClose: 3000 });
        }
        getAllDeviceData();
      }
    }
    catch (e) {
      toast.error("Something went wrong!", { autoClose: 3000 });
    }
    toggle();
  };



  // Add Data
  const handleCustomerClicks = () => {
    setIsEdit(false);
    toggle();
  };
  // Update Data
  const handleCustomerClick = useCallback((arg) => {
    
    setClickedRowId(arg);
    setIsEdit(true);
    toggle();
    const id = arg;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/customers/${id}`, config)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "id": result.id,
          "customerCode": result.customerCode,
          "firstname": result.firstname,
          "lastname": result.lastname,
          "fatherName": result.fatherName,
          "aadharNumber": result.aadharNumber,
          "mobileNumber": result.mobileNumber,
          "emergencyContactNumber": result.emergencyContactNumber,
          "emergencyContactPersonName": result.emergencyContactPersonName,
          "relationWithEmergencyContactPerson": result.relationWithEmergencyContactPerson,
          "dob": result.dob,
          "customerType": result.customerType,
          "shipingType": result.shipingType,
          "vatGst": result.vatGst,
          "address": result.address,
          "pincode": result.pincode,
          "postOffice": result.postOffice,
          "city": result.city,
          "plantName": result.plantName,
          "email": result.email,
          "contact": result.contact,
          "status": result.status,
          "approvalFlag": result.approvalFlag,
          "vehicleMinCapacity": result.vehicleMinCapacity,
          "registeredState": result.registeredState,
          "vehicleMaxCapacity": result.vehicleMaxCapacity,
        });
      })

  }, [toggle]);

  // Delete Data
  const onClickDelete = (id) => {
    setClickedRowId(id);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/customers/${CurrentID}`, config)
      console.log(res.data);
      getAllDeviceData();
      toast.success("Customer Deleted Successfully", { autoClose: 3000 });
      setDeleteModal(false);
    } catch (e) {
      toast.error("Something went wrong!", { autoClose: 3000 });
      setDeleteModal(false);
    }
  };


  const status = [
    {
      options: [
        { label: "Select Status", value: "" },
        { label: "Active", value: "A" },
        { label: "Deactive", value: "D" },
      ],
    },
  ];

  const Approval_Flag = [
    {
      options: [
        { label: "Select Approval Flag", value: "" },
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
    },
  ];

  const gps_Activated = [
    {
      options: [
        { label: "Select Status", value: "" },
        { label: "Active", value: "A" },
        { label: "Deactive", value: "D" },
      ],
    },
  ];

  const loadingType = [
    {
      options: [
        { label: "Select Status", value: "" },
        { label: "Automatic", value: "A" },
        { label: "Manual", value: "M" },
      ],
    },
  ];



  // Customers Column
  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'id',
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        }
      },
      {
        Header: "Customer Code",
        accessor: "customerCode",
        fixed: 'left',
      },
      {
        Header: "First Name",
        accessor: "firstname",
        filterable: false,
      },
      {
        Header: "Last Name",
        accessor: "lastname",
        filterable: false,
      },
      {
        Header: "Father Name",
        accessor: "fatherName",
        filterable: false,
      },
      {
        Header: "Aadhar Number",
        accessor: "aadharNumber",
        filterable: false,
      },
      {
        Header: "Mobile Number",
        accessor: "mobileNumber",
        filterable: false,
      },
      {
        Header: "Emergency Contact Number",
        accessor: "emergencyContactNumber",
        filterable: false,
      },
      {
        Header: "Emergency Contact Person Name",
        accessor: "emergencyContactPersonName",
        filterable: false,
      },
      {
        Header: "Relation With Emergency Contact Person",
        accessor: "relationWithEmergencyContactPerson",
        filterable: false,
      },
      {
        Header: "Dob",
        accessor: "dob",
        filterable: false,
      },
      {
        Header: "Customer Type",
        accessor: "customerType",
        filterable: false,
      },
      {
        Header: "Shiping Type",
        accessor: "shipingType",
        filterable: false,
      },
      {
        Header: "Vat Gst",
        accessor: "vatGst",
        filterable: false,
      },
      {
        Header: "Address",
        accessor: "address",
        filterable: false,
      },
      {
        Header: "Pin code",
        accessor: "pincode",
        filterable: false,
      },
      {
        Header: "Post Office",
        accessor: "postOffice",
        filterable: false,
      },
      {
        Header: "City",
        accessor: "city",
        filterable: false,
      },
      {
        Header: "Plant Name",
        accessor: "plantName",
        filterable: false,
      },
      {
        Header: "Email",
        accessor: "email",
        filterable: false,
      },
      {
        Header: "Contact",
        accessor: "contact",
        filterable: false,
      },
      {
        Header: "Approval Flag",
        accessor: "approvalFlag",
        filterable: false,
      },
      {
        Header: "Vehicle Min Capacity",
        accessor: "vehicleMinCapacity",
        filterable: false,
      },
      {
        Header: "Vehicle Max Capacity",
        accessor: "vehicleMaxCapacity",
        filterable: false,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (cell) => {
          switch (cell.value) {
            case "A":
              return <span className="badge text-uppercase badge-soft-success"> Active </span>;
            case "D":
              return <span className="badge text-uppercase badge-soft-danger"> Deactive </span>;
            default:
              return <span className="badge text-uppercase badge-soft-info"> Active </span>;
          }
        }
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Edit">
                <Link
                  to="#"
                  className="text-primary d-inline-block edit-item-btn"
                  onClick={() => { const id = cellProps.row.original.id; handleCustomerClick(id); }}
                >

                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Remove">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => { const id = cellProps.row.original.id; onClickDelete(id); }}>
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
  );




  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Customer | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={devices}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid>
          <BreadCrumb title="Customer" pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Customer Details</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>

                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); setValues(initialValues); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add Customer
                        </button>{" "}

                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    {devices && devices.length ? (
                      <TableContainer
                        columns={columns}
                        data={devices}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        //isCustomerFilter={true}
                        SearchPlaceholder='Search for Customer Name or something...'
                        divClass="overflow-auto"
                        tableClass="width-200"
                      />) : (<Loader />)
                    }
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Customer" : "Add Customer"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                      <ModalBody>
                        <Nav pills className="nav-customs nav-danger mb-3 nav nav-pills">
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
                        <TabContent activeTab={outlineBorderNav} className="text-muted">
                          <TabPane tabId="1" id="border-nav-home">
                            <Row className="g-3">
                              <Col md={3}>
                                <Label htmlFor="validationDefault01" className="form-label">Customer Code</Label>
                                <Input type="text" required className="form-control"
                                  name="customerCode"
                                  id="val1"
                                  placeholder="Enter Customer Code"
                                  value={values.customerCode}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">First Name</Label>
                                <Input type="text" required className="form-control"
                                  id="val2"
                                  name="firstname"
                                  placeholder="Enter First Name"
                                  value={values.firstname}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Last Name</Label>
                                <Input type="text" required className="form-control"
                                  id="val3"
                                  name="lastname"
                                  placeholder="Enter Last Name"
                                  value={values.lastname}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Father Name</Label>
                                <Input type="text" required className="form-control"
                                  id="val4"
                                  name="fatherName"
                                  placeholder="Enter Father Name"
                                  value={values.fatherName}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Aadhar Number</Label>
                                <Input type="text" required className="form-control"
                                  id="val5"
                                  name="aadharNumber"
                                  placeholder="Enter Aadhar Number"
                                  value={values.aadharNumber}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Mobile Number</Label>
                                <Input type="number" required className="form-control"
                                  id="val6"
                                  name="mobileNumber"
                                  placeholder="Enter Mobile Number"
                                  value={values.mobileNumber}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Emergency Contact Number</Label>
                                <Input type="number" required className="form-control"
                                  id="val7"
                                  name="emergencyContactNumber"
                                  placeholder="Enter Emergency Contact Number"
                                  value={values.emergencyContactNumber}
                                  onChange={handleInputChange}
                                />
                              </Col>
                            </Row>
                            {isEdit ? <div className="hstack gap-2 justify-content-end">
                              <button className="btn btn-success mt-3" type="button" onClick={() => { checkFirstTabvalue("2") }}>Next &gt;&gt;</button>
                            </div>
                              :
                              <div className="hstack gap-2 justify-content-end">
                                <button className="btn btn-success mt-3" onClick={() => { checkFirstTabvalue("2") }}>Next &gt;&gt;</button>
                              </div>}
                          </TabPane>
                        </TabContent>
                        <TabContent activeTab={outlineBorderNav} className="text-muted">
                          <TabPane tabId="2" id="border-nav-home">
                            <Row className="g-3">
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Emergency Contact Person Name</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault04"
                                  name="emergencyContactPersonName"
                                  placeholder="Enter Emergency Contact Person Name"
                                  value={values.emergencyContactPersonName}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Relation</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault04"
                                  name="relationWithEmergencyContactPerson"
                                  placeholder="Enter Relation With Emergency Contact Person"
                                  value={values.relationWithEmergencyContactPerson}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Dob</Label>
                                <div className="">
                                  <Flatpickr
                                    className="form-control"
                                    id="datepicker-publish-input"
                                    placeholder="Select Created Date"
                                    value={values.dob}
                                    options={{
                                      enableTime: false,
                                      dateFormat: "d-m-Y",
                                    }}
                                    onChange={(selectedDates, dateStr, fp) => { createdDateFunction(selectedDates, dateStr, fp) }}
                                  />
                                </div>
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Customer Type</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault04"
                                  name="customerType"
                                  placeholder="Enter Customer Type"
                                  value={values.customerType}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Shiping Type</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault04"
                                  name="shipingType"
                                  placeholder="Enter Shiping Type"
                                  value={values.shipingType}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Vat Gst</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault04"
                                  name="vatGst"
                                  placeholder="Enter Vat Gst"
                                  value={values.vatGst}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Address</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault04"
                                  name="address"
                                  placeholder="Enter Address"
                                  value={values.address}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Pin Code</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault04"
                                  name="pincode"
                                  placeholder="Enter Pin Code"
                                  value={values.pincode}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Post Office</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault04"
                                  name="postOffice"
                                  placeholder="Enter Post Office"
                                  value={values.postOffice}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">City</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault04"
                                  name="city"
                                  placeholder="Enter City"
                                  value={values.city}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Plant Name</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault04"
                                  name="plantName"
                                  placeholder="Enter Plant Name"
                                  value={values.plantName}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Email</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault04"
                                  name="email"
                                  placeholder="Enter Email"
                                  value={values.email}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Contact</Label>
                                <Input type="number" required className="form-control"
                                  id="validationDefault04"
                                  name="contact"
                                  placeholder="Enter Contact"
                                  value={values.contact}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Approval Flag</Label>
                                <Input type="number" required className="form-control"
                                  id="validationDefault04"
                                  name="approvalFlag"
                                  placeholder="Enter Approval Flag"
                                  value={values.approvalFlag}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >Approval Flag</Label>
                                  <Input
                                    name="approvalFlag"
                                    type="select"
                                    className="form-select"
                                    value={values.approvalFlag}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {Approval_Flag.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Vehicle Min Capacity</Label>
                                <Input type="number" required className="form-control"
                                  id="validationDefault04"
                                  name="vehicleMinCapacity"
                                  placeholder="Enter Vehicle Min Capacity"
                                  value={values.vehicleMinCapacity}
                                  onChange={handleInputChange}
                                />
                              </Col>

                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Vehicle Max Capacity</Label>
                                <Input type="number" required className="form-control"
                                  id="validationDefault04"
                                  name="vehicleMaxCapacity"
                                  placeholder="Enter Vehicle Max Capacity"
                                  value={values.vehicleMaxCapacity}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >Status</Label>
                                  <Input
                                    name="status"
                                    type="select"
                                    className="form-select"
                                    value={values.status}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {status.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                                <button type="button" className="btn btn-light" onClick={() => { outlineBorderNavtoggle("1"); }}> Back To Basic details </button>
                                <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                                <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Customer"} </button>
                              </Col>

                            </Row>
                          </TabPane>
                        </TabContent>

                      </ModalBody>
                      <ModalFooter>
                      </ModalFooter>
                    </Form>
                  </Modal>
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

export default MasterCustomer;
