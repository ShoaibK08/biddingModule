import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback } from "reactstrap";

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

import {
  getUsers as onGetUsers,
  addNewCustomer1 as onAddNewCustomer,
  updateCustomer1 as onUpdateCustomer,
  deleteCustomer1 as onDeleteCustomer,
} from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import axios from "axios";

const MasterUsers = () => {
  const dispatch = useDispatch();

  const { users, isUsersCreated, isUsersSuccess, error } = useSelector((state) => ({
    users: state.Master.users,
    isUsersCreated: state.Master.isUsersCreated,
    isUsersSuccess: state.Master.isUsersSuccess,
    error: state.Master.error,
  }));
  console.log("userData", users)

  const [isEdit, setIsEdit] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [Plant_Code, setPlantCode] = useState('');
  const [comapny_code, setCompanyCode] = useState('');
  const [latestHeader, setLatestHeader] = useState('');

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

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: process.env.REACT_APP_API_USER_NAME,
      password: process.env.REACT_APP_API_PASSWORD,
    },
  };

  const customermocalstatus = [
    {
      options: [
        { label: "Status", value: "" },
        { label: "Active", value: "A" },
        { label: "Deactive", value: "D" },
      ],
    },
  ];

  // Delete Data
  const onClickDelete = (customer) => {
    setCustomer(customer);
    setDeleteModal(true);
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: (customer && customer.id) || '',
      firstname: (customer && customer.firstname) || '',
      lastname: (customer && customer.lastname) || '',
      email: (customer && customer.email) || '',
      mobileNumber: (customer && customer.mobileNumber) || '',
      referenceCode: (customer && customer.referenceCode) || '',
      managerName: (customer && customer.managerName) || '',
      city: (customer && customer.city) || '',
      companyCode: comapny_code,
      plantCode: Plant_Code,
      remarks: (customer && customer.remarks) || '',
      status: (customer && customer.status) || '',
      role  : (customer && customer.role) || '',
      department: (customer && customer.department) || '',
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("Please Enter First Name"),
      lastname: Yup.string().required("Please Enter Last Name"),
      email: Yup.string().required("Please Enter Your Email"),
      mobileNumber: Yup.string().required("Please Enter Your Mobile Number"),
      referenceCode: Yup.string().required("Please Enter Your ReferenceCode"),
      managerName: Yup.string().required("Please Enter Manager Name"),
      city: Yup.string().required("Please Enter Your City"),
      //companyCode: Yup.string().required("Please Enter Your Company Code"),
      remarks: Yup.string().required("Please Enter Your Remarks"),
      role: Yup.string().required("Please Select Role"),
      department: Yup.string().required("Please Select Department"),
      //status: Yup.string().required("Please Select Status")
    }),
    onSubmit: (values) => {

      if (isEdit) {
        const updateCustomer = {
          id: customer ? customer.id : 0,
          firstname: values.firstname,
          lastname: values.lastname,
          email: values.email,
          mobileNumber: values.mobileNumber,
          managerName: values.managerName,
          city: values.city,
          remarks: values.remarks,
          referenceCode: values.referenceCode,
          companyCode: comapny_code,
          plantCode: Plant_Code,
          status: values.status,
          role: values.role,
          department: values.department
        };
        // update customer
        dispatch(onUpdateCustomer(updateCustomer));
        validation.resetForm();
      } else {
        const newCustomer = {
          firstname: values["firstname"],
          lastname: values["lastname"],
          email: values["email"],
          mobileNumber: values["mobileNumber"],
          managerName: values["managerName"],
          city: values["city"],
          remarks: values["remarks"],
          referenceCode: values["referenceCode"],
          companyCode: comapny_code,
          plantCode: Plant_Code,
          status: "A",
          role: values["role"],
          department: values["department"],
        };
        // save new customer
        dispatch(onAddNewCustomer(newCustomer));
        validation.resetForm();
      }
      toggle();
    },
  });

  const handleMobileNumberChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    const isValidMobileNumber = /^\d{0,10}$/.test(inputValue); // Adjusted to allow 10 digits or an empty value

    if (isValidMobileNumber) { // Allow empty input or a valid 10-digit number
      validation.setFieldValue('mobileNumber', inputValue); // Update the formik value
      validation.handleChange(e); // Trigger Formik's handleChange
    }
  };

  const handleDepartmentChange = (e) => {
    const inputValue = e.target.value

    if (inputValue) { // Allow empty input or a valid 10-digit number
      validation.setFieldValue('mobileNumber', inputValue); // Update the formik value
      validation.handleChange(e); // Trigger Formik's handleChange
    getRoleData(Plant_Code, inputValue);
    }
  };

  // Delete Data
  const handleDeleteCustomer = () => {
    if (customer) {
      dispatch(onDeleteCustomer(customer.id));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleCustomerClick = useCallback((arg) => {
    const customer = arg;

    setCustomer({
      id: customer.id,
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      mobileNumber: customer.mobileNumber,
      referenceCode: customer.referenceCode,
      managerName: customer.managerName,
      city: customer.city,
      remarks: customer.remarks,
      companyCode: customer.companyCode,
      status: customer.status,
      role: customer.role,
      department: customer.department
    });
    setRoleData([
      {
          "role": customer.role
      }
  ]);

    setIsEdit(true);
    toggle();
  }, [toggle]);


  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    if (users && !users.length) {
      dispatch(onGetUsers());
    }
  }, [dispatch, users]);


  useEffect(() => {
    setCustomer(users);
  }, [users]);

  useEffect(() => {
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    setPlantCode(plantcode);
    sessionStorage.getItem("main_menu_login");
    const obj1 = JSON.parse(sessionStorage.getItem("main_menu_login"));
    let companyCode = obj1.companyCode;
    setCompanyCode(companyCode);
    getDepartmentData(plantcode);
  }, []);

  useEffect(() => {
    if (!isEmpty(users)) {
      setCustomer(users);
      setIsEdit(false);
    }
  }, [users]);

  // Add Data
  const handleCustomerClicks = () => {
    setCustomer("");
    setIsEdit(false);
    toggle();
  };



  const handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".customerCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteCustomer(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".customerCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  const getRoleData = (plantcode, department) => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/user-master/getRoles?plantCode=${plantcode}&department=${department}`, config)
        .then(res => {
            const result = res.body.data;
            setRoleData(result);
        });
}

const getDepartmentData = (plantcode) => {

  axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/departments?plantCode=${plantcode}`, config)
      .then(res => {
          const result = res;
          setDepartmentData(result);
      });
}

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
        Header: "Email",
        accessor: "email",
        filterable: false,
      },
      {
        Header: "Mobile Number",
        accessor: "mobileNumber",
        filterable: false,
      },
      {
        Header: "Reference Code",
        accessor: "referenceCode",
        filterable: false,
      },
      {
        Header: "Manager Name",
        accessor: "managerName",
        filterable: false,
      },
      {
        Header: "City",
        accessor: "city",
        filterable: false,
      },
      {
        Header: "Remarks",
        accessor: "remarks",
        filterable: false,
      },
      {
        Header: "Company Code",
        accessor: "companyCode",
        filterable: false,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (cell) => {
          switch (cell.value) {
            case "A":
              return <span className="badge text-uppercase badge-soft-success"> {"Active"} </span>;
            case "D":
              return <span className="badge text-uppercase badge-soft-danger"> {"Deactive"} </span>;
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
                  onClick={() => { const customerData = cellProps.row.original; handleCustomerClick(customerData); }}
                >

                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Remove">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => { const customerData = cellProps.row.original; onClickDelete(customerData); }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleCustomerClick, checkedAll]
  );

  const dateFormat = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
  };

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Users";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={users}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
          onCloseClick={() => setDeleteModal(false)}
        />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <BreadCrumb title={latestHeader} pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0">User List</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        {isMultiDeleteButton && <button className="btn btn-soft-danger me-1"
                          onClick={() => setDeleteModalMulti(true)}
                        ><i className="ri-delete-bin-2-line"></i></button>}
                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          User
                        </button>{" "}
                        {/* <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                          Export
                        </button> */}
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    {isUsersSuccess && users.length ? (
                      <TableContainer
                        columns={columns}
                        data={users}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        SearchPlaceholder='Search for User, Email, or something...'
                        divClass="overflow-auto"
                        tableClass="width_user"
                      />
                    ) : (<Loader error={error} />)
                    }
                  </div>
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit User" : "Add User"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}>
                      <ModalBody>
                        <input type="hidden" id="id-field" />

                        <div
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
                        <Col lg={3}>
                            <div>
                              <Label className="form-label" >Department</Label><span style={{ color: "red" }}>*</span>
                              <Input
                                name="department"
                                type="select"
                                className="form-select"
                                validate={{ required: { value: true }, }}
                                onChange={handleDepartmentChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.department || ""}
                                invalid={validation.touched.department && validation.errors.department ? true : false}
                                disabled={isEdit ? true : false}
                              >   
                              {<option value={''}>{"Select Department"}</option>}                           
                                {departmentData.map((item, key) => (
                                  <React.Fragment key={key}>
                                    {<option value={item.code} key={key}>{item.name}</option>}
                                  </React.Fragment>
                                ))}
                              </Input>
                              {validation.touched.department && validation.errors.department ? (
                                  <FormFeedback type="invalid">{validation.errors.department}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        <Col lg={3}>
                            <div>
                              <Label className="form-label" >Role</Label><span style={{ color: "red" }}>*</span>
                              <Input
                                name="role"
                                type="select"
                                className="form-select"
                                validate={{ required: { value: true }, }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.role || ""}
                                invalid={validation.touched.role && validation.errors.role ? true : false}
                                disabled={isEdit ? true : false}
                              >   
                              {<option value={''}>{"Select Role"}</option>}                           
                                {roleData.map((item, key) => (
                                  <React.Fragment key={key}>
                                    {<option value={item.role} key={key}>{item.role}</option>}
                                  </React.Fragment>
                                ))}
                              </Input>
                              {validation.touched.role && validation.errors.role ? (
                                  <FormFeedback type="invalid">{validation.errors.role}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>

                          <Col lg={3}>
                            <div>
                              <Label
                                htmlFor="firstname-field"
                                className="form-label"
                              >
                                First Name
                              </Label><span style={{ color: "red" }}>*</span>
                              <Input
                                name="firstname"
                                id="firstname-field"
                                className="form-control"
                                placeholder="Enter First Name"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.firstname || ""}
                                invalid={
                                  validation.touched.firstname && validation.errors.firstname ? true : false
                                }
                              />
                              {validation.touched.firstname && validation.errors.firstname ? (
                                <FormFeedback type="invalid">{validation.errors.firstname}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>

                          <Col lg={3}>
                            <div>
                              <Label
                                htmlFor="lastname-field"
                                className="form-label"
                              >
                                Last Name
                              </Label><span style={{ color: "red" }}>*</span>
                              <Input
                                name="lastname"
                                id="lastname-field"
                                className="form-control"
                                placeholder="Enter Last Name"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.lastname || ""}
                                invalid={
                                  validation.touched.lastname && validation.errors.lastname ? true : false
                                }
                              />
                              {validation.touched.lastname && validation.errors.lastname ? (
                                <FormFeedback type="invalid">{validation.errors.lastname}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div>
                              <Label htmlFor="email-field" className="form-label">
                                Email
                              </Label><span style={{ color: "red" }}>*</span>
                              <Input
                                name="email"
                                type="email"
                                id="email-field"
                                placeholder="Enter Email"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email || ""}
                                disabled={isEdit ? true : false}
                                invalid={
                                  validation.touched.email && validation.errors.email ? true : false
                                }
                              />
                              {validation.touched.email && validation.errors.email ? (
                                <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div>
                              <Label htmlFor="mobileNumber-field" className="form-label">
                                Mobile Number
                              </Label><span style={{ color: "red" }}>*</span>
                              <Input
                                name="mobileNumber"
                                type="number"
                                id="mobileNumber-field"
                                placeholder="Enter Mobile Number"
                                onChange={handleMobileNumberChange} // Use your custom handler
                                onBlur={validation.handleBlur}
                                value={validation.values.mobileNumber || ""}
                                disabled={isEdit ? true : false}
                                invalid={
                                  validation.touched.mobileNumber && validation.errors.mobileNumber ? true : false
                                }
                              />
                              {validation.touched.mobileNumber && validation.errors.mobileNumber ? (
                                <FormFeedback type="invalid">{validation.errors.mobileNumber}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div>
                              <Label htmlFor="referenceCode-field" className="form-label">
                                Reference Code
                              </Label><span style={{ color: "red" }}>*</span>
                              <Input
                                name="referenceCode"
                                type="text"
                                id="referenceCode-field"
                                placeholder="Enter Reference Code"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.referenceCode || ""}
                                invalid={
                                  validation.touched.referenceCode && validation.errors.referenceCode ? true : false
                                }
                              />
                              {validation.touched.referenceCode && validation.errors.referenceCode ? (
                                <FormFeedback type="invalid">{validation.errors.referenceCode}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div>
                              <Label htmlFor="managerName-field" className="form-label">
                                Manager Name
                              </Label><span style={{ color: "red" }}>*</span>
                              <Input
                                name="managerName"
                                type="text"
                                id="managerName-field"
                                placeholder="Enter Manager Name"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.managerName || ""}
                                invalid={
                                  validation.touched.managerName && validation.errors.managerName ? true : false
                                }
                              />
                              {validation.touched.managerName && validation.errors.managerName ? (
                                <FormFeedback type="invalid">{validation.errors.managerName}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div>
                              <Label htmlFor="city-field" className="form-label">
                                City
                              </Label><span style={{ color: "red" }}>*</span>
                              <Input
                                name="city"
                                type="text"
                                id="city-field"
                                placeholder="Enter city"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.city || ""}
                                invalid={
                                  validation.touched.city && validation.errors.city ? true : false
                                }
                              />
                              {validation.touched.city && validation.errors.city ? (
                                <FormFeedback type="invalid">{validation.errors.city}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div>
                              <Label htmlFor="remarks-field" className="form-label">
                                Remarks
                              </Label><span style={{ color: "red" }}>*</span>
                              <Input
                                name="remarks"
                                type="text"
                                id="remarks-field"
                                placeholder="Enter remarks"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.remarks || ""}
                                invalid={
                                  validation.touched.remarks && validation.errors.remarks ? true : false
                                }
                              />
                              {validation.touched.remarks && validation.errors.remarks ? (
                                <FormFeedback type="invalid">{validation.errors.remarks}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          {/* <Col lg={3}>
                            <div>
                              <Label htmlFor="remarks-field" className="form-label">
                                Company Code
                              </Label><span style={{ color: "red" }}>*</span>
                              <Input
                                name="companyCode"
                                type="text"
                                id="remarks-field"
                                placeholder="Enter companyCode"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.companyCode || ""}
                                invalid={
                                  validation.touched.companyCode && validation.errors.companyCode ? true : false
                                }
                              />
                              {validation.touched.companyCode && validation.errors.companyCode ? (
                                <FormFeedback type="invalid">{validation.errors.companyCode}</FormFeedback>
                              ) : null}
                            </div>
                          </Col> */}
                          {isEdit &&
                            <Col lg={3}>
                              <div>
                                <Label htmlFor="status-field" className="form-label">
                                  Status
                                </Label><span style={{ color: "red" }}>*</span>

                                <Input
                                  name="status"
                                  type="select"
                                  className="form-select"
                                  id="status-field"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={
                                    validation.values.status || ""
                                  }
                                  invalid={validation.touched.status && validation.errors.status ? true : false}
                                >
                                  {customermocalstatus.map((item, key) => (
                                    <React.Fragment key={key}>
                                      {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                    </React.Fragment>
                                  ))}
                                </Input>
                                {validation.touched.status && validation.errors.status ? (
                                  <FormFeedback type="invalid">{validation.errors.status}</FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          }
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button type="button" className="btn btn-light" onClick={() => { setModal(false); }}> Close </button>

                          <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add User"} </button>
                        </div>
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

export default MasterUsers;
