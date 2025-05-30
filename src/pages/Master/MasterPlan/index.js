import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import * as Yup from "yup";
import { useFormik } from "formik";
//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../MasterPlan/Plan.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderNew from "../../../Components/Common/Loader_new";

const initialValues = {
  planName: "",
  hardwareSupport: "",
  softwareSupport: "",
  support24x7: "",
  remarks: "",
  status: "A",
  id: ""
};


const MasterPlan = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [plans, setPlan] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [latestHeader, setLatestHeader] = useState('');
   const [loader, setloader] = useState(false);


  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    getAllPlanData();

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

  const getAllPlanData = () => {
    setloader(true);
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/plan-master`, config)
      .then(res => {
        const plan = res;
          setPlan(plan);
          setloader(false);
        })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
    });
  };


  /*const handleSubmit = async (e) => {
    
    console.log(values)
    e.preventDefault();
    try {
      if (isEdit) {
        const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/plan-master/${CurrentID}`, values)
        console.log(res);
        toast.success("Plan Updated Successfully", { autoClose: 3000 });
        getAllPlanData();
      }
      else {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/plan-master`, values)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Plan Added Successfully.", { autoClose: 3000 });
        }
        else {
          toast.error("Data Already Exist.", { autoClose: 3000 });
        }
        getAllPlanData();
      }
    }
    catch (e) {
      toast.error("Something went wrong!", { autoClose: 3000 });
    }
    toggle();
  };*/

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      planName: (values && values.planName) || '',
      hardwareSupport: (values && values.hardwareSupport) || '',
      softwareSupport: (values && values.softwareSupport) || '',
      support24x7: (values && values.support24x7) || '',
      isAutoInvoicing: (values && values.isAutoInvoicing) || '',
      noOfUsers: (values && values.noOfUsers) || '',
      validity: (values && values.validity) || '',
      remarks: (values && values.remarks) || '',
      status: (values && values.status) || '',
    },
    validationSchema: Yup.object({
      planName: Yup.string().required("Please Enter Plant Name"),
      hardwareSupport: Yup.string().required("Hardware Support is required"),
      softwareSupport: Yup.string().required("Software Support is required"),
      support24x7: Yup.string().required("Support 24x7 is required"),
      isAutoInvoicing: Yup.string().required("Please Select Auto Invoicing"),
      noOfUsers: Yup.string().required("Please Enter No Of Users"),
      validity: Yup.string().required("Please Enter Validity"),
      status: isEdit ? Yup.string().required("Status is required") : Yup.string(),
      remarks: Yup.string().required("Remarks are required"),
      // description: Yup.string().required("Please Enter Tag Description"),
      // dueDate: Yup.string().required("Please Enter Date"),
      // status: Yup.string().required("Please Enter Status"),
      // priority: Yup.string().required("Please Enter Priority"),
    }),
    onSubmit: async (values) => {
      try{
        if (isEdit) {
          const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/plan-master/${CurrentID}`, values, config)
          console.log(res);
          toast.success("Plan Updated Successfully", { autoClose: 3000 });
          validation.resetForm();
          getAllPlanData();
        }
        else {
          const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/plan-master`, values, config)
          console.log(res);
          if (!res.errorMsg) {
            toast.success("Plan Added Successfully.", { autoClose: 3000 });
          }
          else {
            toast.error("Data Already Exist.", { autoClose: 3000 });
          }
          validation.resetForm();
          getAllPlanData();
        }
      }
      catch (e) {
        toast.error(e, { autoClose: 3000 });
      }
      
      toggle();
      getAllPlanData();
    },
  });



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
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/plan-master/${id}`, config)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "planName": result.planName,
          "hardwareSupport": result.hardwareSupport,
          "softwareSupport": result.softwareSupport,
          "support24x7": result.support24x7,
          "isAutoInvoicing": result.isAutoInvoicing,
          "noOfUsers": result.noOfUsers,
          "validity": result.validity,
          "remarks": result.remarks,
          "status": result.status,
          "id": id
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
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/plan-master/${CurrentID}`, config)
      console.log(res.data);
      getAllPlanData();
      toast.success("Plan Deleted Successfully", { autoClose: 3000 });
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

  const hardwareSupport = [
    {
      options: [
        { label: "Select hardwareSupport", value: "" },
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
    },
  ];

  const softwareSupport = [
    {
      options: [
        { label: "Select softwareSupport", value: "" },
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
    },
  ];

  const support24x7 = [
    {
      options: [
        { label: "Select support24x7", value: "" },
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
    },
  ];

  const autoInvoicing = [
    {
      options: [
        { label: "Select Invoicing", value: "" },
        { label: "Yes", value: 1 },
        { label: "No", value: 0 },
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
        Header: "Plan Name",
        accessor: "planName",
        filterable: false,
      },
      {
        Header: "Hardware Support",
        accessor: "hardwareSupport",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
              case "1":
                  return <span className="badge text-uppercase badge-soft-success"> Yes </span>;
              case "0":
                  return <span className="badge text-uppercase badge-soft-danger"> No </span>;
          }
      }
      },
      {
        Header: "Software Support",
        accessor: "softwareSupport",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
              case "1":
                  return <span className="badge text-uppercase badge-soft-success"> Yes </span>;
              case "0":
                  return <span className="badge text-uppercase badge-soft-danger"> No </span>;
          }
      }
      },
      {
        Header: "Support 24*7",
        accessor: "support24x7",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
              case "1":
                  return <span className="badge text-uppercase badge-soft-success"> Yes </span>;
              case "0":
                  return <span className="badge text-uppercase badge-soft-danger"> No </span>;
          }
      }
      },
      {
        Header: "Auto Invoicing",
        accessor: "isAutoInvoicing",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
              case 1:
                  return <span className="badge text-uppercase badge-soft-success"> Yes </span>;
              case 0:
                  return <span className="badge text-uppercase badge-soft-danger"> No </span>;
          }
      }
      },
      {
        Header: "No. Of Users",
        accessor: "noOfUsers",
        filterable: false,
      },
      {
        Header: "Validity",
        accessor: "validity",
        filterable: false,
      },
      {
        Header: "Remark",
        accessor: "remarks",
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

  document.title = "Plan Mater | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={plans}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid>
          <BreadCrumb title={'Plan Master'} pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Plan Details</h5>
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
                          <i className="ri-add-line align-bottom me-1"></i> Add Plan
                        </button>{" "}

                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                  {loader && <LoaderNew></LoaderNew>}
                      <TableContainer
                        columns={columns}
                        data={plans}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        SearchPlaceholder='Search for Plan Name or something...'
                        divClass="overflow-auto"
                      tableClass="width-120"
                      />
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Plan" : "Add Plan"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }} autoComplete="off">
                      <ModalBody>
                        <Row className="g-3">
                          <Col md={4}>
                            <Label htmlFor="planName" className="form-label">Plan Name <span style={{ color: "red" }}>*</span></Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="planName"
                              name="planName"
                              placeholder="Enter Plan Name"
                              maxLength={25}  // Corrected maxLength
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.planName || ""}
                              invalid={!!(validation.touched.planName && validation.errors.planName)} // Simplified
                            />
                            {validation.touched.planName && validation.errors.planName && (
                              <FormFeedback>{validation.errors.planName}</FormFeedback>
                            )}
                          </Col>

                          <Col md={4}>
                            <div>
                              <Label htmlFor="hardwareSupport" className="form-label">Hardware Support <span style={{ color: "red" }}>*</span></Label>
                              <Input
                                type="select"
                                className="form-select"
                                id="hardwareSupport"
                                name="hardwareSupport"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.hardwareSupport || ""}
                                invalid={!!(validation.touched.hardwareSupport && validation.errors.hardwareSupport)} // Simplified
                              >
                                {hardwareSupport.map((group, groupIndex) => (
                                  <React.Fragment key={groupIndex}>
                                    {group.options.map((item) => (
                                      <option value={item.value} key={item.value}>{item.label}</option> // Key uses item.value
                                    ))}
                                  </React.Fragment>
                                ))}
                              </Input>
                              {validation.touched.hardwareSupport && validation.errors.hardwareSupport && (
                                <FormFeedback>{validation.errors.hardwareSupport}</FormFeedback>
                              )}
                            </div>
                          </Col>

                          <Col md={4}>
                            <div>
                              <Label htmlFor="softwareSupport" className="form-label">Software Support <span style={{ color: "red" }}>*</span></Label>
                              <Input
                                type="select"
                                className="form-select"
                                id="softwareSupport"
                                name="softwareSupport"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.softwareSupport || ""}
                                invalid={!!(validation.touched.softwareSupport && validation.errors.softwareSupport)}
                              >
                                {softwareSupport.map((group, groupIndex) => (
                                  <React.Fragment key={groupIndex}>
                                    {group.options.map((item) => (
                                      <option value={item.value} key={item.value}>{item.label}</option>
                                    ))}
                                  </React.Fragment>
                                ))}
                              </Input>
                              {validation.touched.softwareSupport && validation.errors.softwareSupport && (
                                <FormFeedback>{validation.errors.softwareSupport}</FormFeedback>
                              )}
                            </div>
                          </Col>

                          <Col md={4}>
                            <div>
                              <Label htmlFor="support24x7" className="form-label">Support 24x7 <span style={{ color: "red" }}>*</span></Label>
                              <Input
                                type="select"
                                className="form-select"
                                id="support24x7"
                                name="support24x7"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.support24x7 || ""}
                                invalid={!!(validation.touched.support24x7 && validation.errors.support24x7)}
                              >
                                {support24x7.map((group, groupIndex) => (
                                  <React.Fragment key={groupIndex}>
                                    {group.options.map((item) => (
                                      <option value={item.value} key={item.value}>{item.label}</option>
                                    ))}
                                  </React.Fragment>
                                ))}
                              </Input>
                              {validation.touched.support24x7 && validation.errors.support24x7 && (
                                <FormFeedback>{validation.errors.support24x7}</FormFeedback>
                              )}
                            </div>
                          </Col>
                          <Col md={4}>
                            <div>
                              <Label htmlFor="isAutoInvoicing" className="form-label">Auto Invoicing <span style={{ color: "red" }}>*</span></Label>
                              <Input
                                type="select"
                                className="form-select"
                                id="isAutoInvoicing"
                                name="isAutoInvoicing"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.isAutoInvoicing || ""}
                                invalid={!!(validation.touched.isAutoInvoicing && validation.errors.isAutoInvoicing)}
                              >
                                {autoInvoicing.map((group, groupIndex) => (
                                  <React.Fragment key={groupIndex}>
                                    {group.options.map((item) => (
                                      <option value={item.value} key={item.value}>{item.label}</option>
                                    ))}
                                  </React.Fragment>
                                ))}
                              </Input>
                              {validation.touched.isAutoInvoicing && validation.errors.isAutoInvoicing && (
                                <FormFeedback>{validation.errors.isAutoInvoicing}</FormFeedback>
                              )}
                            </div>
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="noOfUsers" className="form-label">No. Of Users <span style={{ color: "red" }}>*</span></Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="noOfUsers"
                              name="noOfUsers"
                              placeholder="Enter Plan Name"
                              maxLength={25}  // Corrected maxLength
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.noOfUsers || ""}
                              invalid={!!(validation.touched.noOfUsers && validation.errors.noOfUsers)} // Simplified
                            />
                            {validation.touched.noOfUsers && validation.errors.noOfUsers && (
                              <FormFeedback>{validation.errors.noOfUsers}</FormFeedback>
                            )}
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validity" className="form-label">
                              Validity <span style={{ color: "red" }}>*</span>
                            </Label>
                            <input
                              type="date"
                              className={`form-control ${validation.touched.validity && validation.errors.validity ? "is-invalid" : ""}`}
                              id="validity"
                              name="validity"
                              min={new Date().toISOString().split("T")[0]} // Restricts selection to today or before
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.validity || ""}
                            />
                            {validation.touched.validity && validation.errors.validity && (
                              <div className="invalid-feedback d-block">{validation.errors.validity}</div>
                            )}
                          </Col>
                          {isEdit && (
                            <Col lg={4}>
                              <div>
                                <Label className="form-label">Status <span style={{ color: "red" }}>*</span></Label>
                                <Input
                                  type="select"
                                  className="form-select"
                                  name="status"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.status || ""}
                                  invalid={!!(validation.touched.status && validation.errors.status)}
                                >
                                  {status.map((group, groupIndex) => (
                                    <React.Fragment key={groupIndex}>
                                      {group.options.map((item) => (
                                        <option value={item.value} key={item.value}>{item.label}</option>
                                      ))}
                                    </React.Fragment>
                                  ))}
                                </Input>
                                {validation.touched.status && validation.errors.status && (
                                  <FormFeedback>{validation.errors.status}</FormFeedback>
                                )}
                              </div>
                            </Col>
                          )}

                          <Col md={4}>
                            <Label htmlFor="remarks" className="form-label">Remarks <span style={{ color: "red" }}>*</span></Label>
                            <textarea
                              className={`form-control ${validation.touched.remarks && validation.errors.remarks ? "is-invalid" : ""}`}
                              style={{ height: "27px" }}
                              id="remarks"
                              name="remarks"
                              placeholder="Enter Remarks"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.remarks || ""}
                            />
                            {validation.touched.remarks && validation.errors.remarks && (
                              <div className="invalid-feedback">{validation.errors.remarks}</div>
                            )}
                          </Col>

                          <Col md={8}></Col>
                          <Col md={4} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                            <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                            <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Plan"} </button>
                          </Col>

                        </Row>

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

export default MasterPlan;
