import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../MasterDriver/MasterDriver.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";

const initialValues = {
  uniqueId: "",
  driverCode: "",
  firstName: "",
  lastName: "",
  contact:"",
  address: "",
  pincode: "",
  postOffice: "",
  city: "",
  dob:"",
  maritalStatus:"",
  aadhaar: "",
  gender: "",
  email: "",
  licenseNumber: "",
  licenseIssueDate:"",
  licenseExpiryDate: "",
  status:"",
};


const MasterDriver = () => {
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

  useEffect(() => {
    getAllDeviceData();

  }, []);

  const getAllDeviceData = () => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/driver-masters`)
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


  const handleSubmit = async (e) => {
    
    console.log(values)
    e.preventDefault();
    try {
      if (isEdit) {
        const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/driver-masters/${CurrentID}`, values)
        console.log(res);
        toast.success("Driver Data Updated Successfully", { autoClose: 3000 });
        getAllDeviceData();
      }
      else {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/driver-masters`, values)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Driver Data Added Successfully.", { autoClose: 3000 });
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
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/driver-masters/${id}`)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "uniqueId": result.uniqueId,
          "driverCode": result.driverCode,
          "firstName": result.firstName,
          "lastName": result.lastName,
          "contact" : result.contact,
          "address": result.address,
          "pincode": result.pincode,
          "postOffice": result.postOffice,
          "city": result.city,
          "dob" : result.dob,
          "maritalStatus": result.maritalStatus,
          "aadhaar": result.aadhaar,
          "gender": result.gender,
          "email": result.email,
          "licenseNumber" : result.licenseNumber,
          "licenseIssueDate": result.licenseIssueDate,
          "licenseExpiryDate": result.licenseExpiryDate,
          "status" : result.status,
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
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/driver-masters/${CurrentID}`)
      console.log(res.data);
      getAllDeviceData();
      toast.success("Driver Data Deleted Successfully", { autoClose: 3000 });
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
        Header: "Unique Id",
        accessor: "uniqueId",
        filterable: false,
      },
      {
        Header: "Driver Code",
        accessor: "driverCode",
        filterable: false,
      },
      {
        Header: "First Name",
        accessor: "firstName",
        filterable: false,
      },
      {
        Header: "Last Name",
        accessor: "lastName",
        filterable: false,
      },  {
        Header: "Contact",
        accessor: "contact",
        filterable: false,
      },
      {
        Header: "Address",
        accessor: "address",
        filterable: false,
      },
      {
        Header: "Pincode",
        accessor: "pincode",
        filterable: false,
      },
      {
        Header: "Post Office",
        accessor: "postOffice",
        filterable: false,
      },  {
        Header: "City",
        accessor: "city",
        filterable: false,
      },
      {
        Header: "DOB",
        accessor: "dob",
        filterable: false,
      },
      {
        Header: "Marital Status",
        accessor: "maritalStatus",
        filterable: false,
      },
      {
        Header: "Aadhaar",
        accessor: "aadhaar",
        filterable: false,
      },  {
        Header: "Gender",
        accessor: "gender",
        filterable: false,
      },
      {
        Header: "Email",
        accessor: "email",
        filterable: false,
      },
      {
        Header: "License Number",
        accessor: "licenseNumber",
        filterable: false,
      },
      {
        Header: "License Issue Date",
        accessor: "licenseIssueDate",
        filterable: false,
      },
      {
        Header: "License Expiry Date",
        accessor: "licenseExpiryDate",
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

  document.title = "Driver Master | EPLMS";
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
          <BreadCrumb title="Driver" pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0">Driver Details</h5>
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
                          <i className="ri-add-line align-bottom me-1"></i> Add Driver 
                        </button>{" "}

                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>

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
                      SearchPlaceholder='Search for Driver Name or something...'
                      divClass="overflow-auto"
                    />
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Driver" : "Add Driver"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                      <ModalBody>
                        <Row className="g-3">
                          <Col md={4}>
                            <Label htmlFor="validationDefault01" className="form-label">Unique Id</Label>
                            <Input type="text" required className="form-control"
                              name="uniqueId"
                              id="validationDefault01"
                              placeholder="Enter Unique Id"
                              value={values.uniqueId}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Driver Code</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault02"
                              name="driverCode"
                              placeholder="Enter Driver Code"
                              value={values.driverCode}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">First Name</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault03"
                              name="firstName"
                              placeholder="Enter First Name"
                              value={values.firstName}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Last Name</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="lastName"
                              placeholder="Enter Last Name"
                              value={values.lastName}
                              onChange={handleInputChange}
                            />
                          </Col>

                          <Col md={4}>
                            <Label htmlFor="validationDefault01" className="form-label">Contact</Label>
                            <Input type="text" required className="form-control"
                              name="contact"
                              id="validationDefault05"
                              placeholder="Enter Contact"
                              value={values.contact}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Address</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault06"
                              name="address"
                              placeholder="Enter Address"
                              value={values.address}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Pincode</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault07"
                              name="pincode"
                              placeholder="Enter Pincode"
                              value={values.pincode}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Post Office</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault08"
                              name="postOffice"
                              placeholder="Enter Post Office"
                              value={values.postOffice}
                              onChange={handleInputChange}
                            />
                          </Col>

                          <Col md={4}>
                            <Label htmlFor="validationDefault01" className="form-label">City</Label>
                            <Input type="text" required className="form-control"
                              name="city"
                              id="validationDefault09"
                              placeholder="Enter City"
                              value={values.city}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">DOB</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault10"
                              name="dob"
                              placeholder="Enter DOB"
                              value={values.dob}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Marital Status</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault11"
                              name="maritalStatus"
                              placeholder="Enter Marital Status"
                              value={values.maritalStatus}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Aadhaar</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault12"
                              name="aadhaar"
                              placeholder="Enter Aadhaar"
                              value={values.aadhaar}
                              onChange={handleInputChange}
                            />
                          </Col>

                          <Col md={4}>
                            <Label htmlFor="validationDefault01" className="form-label">Gender</Label>
                            <Input type="text" required className="form-control"
                              name="gender"
                              id="validationDefault13"
                              placeholder="Enter Gender"
                              value={values.gender}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Email</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault14"
                              name="email"
                              placeholder="Enter Email"
                              value={values.email}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">License Number</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault15"
                              name="licenseNumber"
                              placeholder="Enter License Number"
                              value={values.licenseNumber}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">License Issue Date</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault16"
                              name="licenseIssueDate"
                              placeholder="Enter License Issue Date"
                              value={values.licenseIssueDate}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">License Expiry Date</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault17"
                              name="licenseExpiryDate"
                              placeholder="Enter License Expiry Date"
                              value={values.licenseExpiryDate}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col lg={4}>
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
                        </Row>
                        <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                            <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                            <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Materials"} </button>
                          </Col>

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

export default MasterDriver;
