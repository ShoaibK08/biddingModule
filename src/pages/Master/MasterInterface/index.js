import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";

const initialValues = {
  companyCode: "",
  plantCode: "",
  serviceName: "",
  serviceUrl: "",
  sequenceNumber: "",
  movementCode: "",
  stageCode: "",
  status: "A",
  username: "",
  password: "",
  id: ""
};


const MasterInterface = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [interfaces, setInterface] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [plantCode, setPlantCode] = useState('');
  const [comapnyCode, setCompanyCode] = useState('');
  const [movementType, setMovement] = useState([]);
  const [stageType, setStage] = useState([]);
  const [latestHeader, setLatestHeader] = useState('');

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
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantCode = obj.data.plantCode;
    sessionStorage.getItem("main_menu_login");
    const obj1 = JSON.parse(sessionStorage.getItem("main_menu_login"));
    let companyCode = obj1.companyCode;
    setCompanyCode(companyCode);
    setPlantCode(plantCode);
    getAllInterfaceData(plantCode);
    getMovementType(plantCode);
    getStageType(plantCode);
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

  const getAllInterfaceData = (plantCode) => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/interfaces?plantCode=${plantCode}`, config)
      .then(res => {
        const interface1 = res;
        setInterface(interface1);
      });
  }

  const getMovementType = (plantCode) => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/movements?plantCode=${plantCode}`, config)
      .then(res => {
        const result = res;
        setMovement(result);
      });
  }

  const getStageType = (plantCode) => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/stages?plantCode=${plantCode}`, config)
      .then(res => {
        const result = res;
        setStage(result);
      });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
      ["plantCode"]: plantCode,
      ["companyCode"]: comapnyCode,
    });
  };


  const handleSubmit = async (e) => {

    console.log(values)
    e.preventDefault();
    try {
      if (isEdit) {
        const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/interfaces/${CurrentID}`, values, config)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Interface Updated Successfully.", { autoClose: 3000 });
        }
        else {
          toast.error("Data Already Exist.", { autoClose: 3000 });
        }
        getAllInterfaceData(plantCode);
      }
      else {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/interfaces`, values, config)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Interface Added Successfully.", { autoClose: 3000 });
        }
        else {
          toast.error("Data Already Exist.", { autoClose: 3000 });
        }
        getAllInterfaceData(plantCode);
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
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/interfaces/${id}`, config)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "companyCode": result.companyCode,
          "plantCode": result.plantCode,
          "serviceName": result.serviceName,
          "serviceUrl": result.serviceUrl,
          "sequenceNumber": result.sequenceNumber,
          "movementCode": result.movementCode,
          "stageCode": result.stageCode,
          "username": result.username,
          "password": result.password,
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

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      companyCode: (values && values.companyCode) || '',
      plantCode: (values && values.plantCode) || '',
      sequenceNumber: (values && values.sequenceNumber) || '',
      serviceName: (values && values.serviceName) || '',
      serviceUrl: (values && values.serviceUrl) || '',
      username: (values && values.username) || '',
      password: (values && values.password) || '',
      status: (values && values.status) || '',
      movementCode: (values && values.movementCode) || '',
      stageCode: (values && values.stageCode) || '',
    },
    validationSchema: Yup.object({
      companyCode: Yup.string().required("Please Enter Company Code"),
      plantCode: Yup.string().required("Please Enter Plant Code"),
      sequenceNumber: Yup.string().required("Please Enter Sequence Number"),
      serviceName: Yup.string().required("Please Enter Service Name"),
      serviceUrl: Yup.string().required("Please Enter  Service Url"),
      username: Yup.string().required("Please Enter User Name"),
      password: Yup.string().required("Please Enter Password"),
      status: Yup.string().required("Please Select Status"),
      movementCode: Yup.string().required("Please Select Movement"),
      stageCode: Yup.string().required("Please Select Stage"),
      // status: Yup.string().required("Please Enter Status"),
      // priority: Yup.string().required("Please Enter Priority"),
    }),
    onSubmit: (values) => {
      const data = { ...values, ["plantCode"]: plantCode, ["companyCode"]: comapnyCode };
      console.log(data);
      if (isEdit) {
        const res = axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/interfaces/${CurrentID}`, data, config)
        console.log(res);
        toast.success("Interface Updated Successfully", { autoClose: 3000 });
        validation.resetForm();
        getAllInterfaceData(plantCode);
      }
      else {
        const res = axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/interfaces`, data, config)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Interface Added Successfully.", { autoClose: 3000 });
        }
        else {
          toast.error("Data Already Exist.", { autoClose: 3000 });
        }
        validation.resetForm();
        getAllInterfaceData(plantCode);
      }
      toggle();
      getAllInterfaceData(plantCode);
    },
  });

  const handleDeleteCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/interfaces/${CurrentID}`, config)
      console.log(res.data);
      getAllInterfaceData(plantCode);
      toast.success("Interface Deleted Successfully", { autoClose: 3000 });
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
        Header: "Company Code",
        accessor: "companyCode",
        filterable: false,
      },
      {
        Header: "Plant Code",
        accessor: "plantCode",
        filterable: false,
      },
      {
        Header: "Service Name",
        accessor: "serviceName",
        filterable: false,
      },
      {
        Header: "Service Url",
        accessor: "serviceUrl",
        filterable: false,
      },
      {
        Header: "User Name",
        accessor: "username",
        filterable: false,
      },
      {
        Header: "Password",
        accessor: "password",
        filterable: false,
      },
      {
        Header: "Sequence No.",
        accessor: "sequenceNumber",
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

  document.title = "Interface | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={interfaces}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
          onCloseClick={() => setDeleteModal(false)}
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
                        <h5 className="card-title mb-0 bg-light">Interface Details</h5>
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
                          <i className="ri-add-line align-bottom me-1"></i> Add Interface
                        </button>{" "}

                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    {interfaces && interfaces.length ? (
                      <TableContainer
                        columns={columns}
                        data={interfaces}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        //isCustomerFilter={true}
                        SearchPlaceholder='Search for Interface Name or something...'
                      />) : (<Loader />)
                    }
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Interface" : "Add Interface"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                      <ModalBody>
                        <Row className="g-3">
                          {/* <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Company Code</Label>
                            <Input type="text" className="form-control"
                              id="validationDefault03"
                              name="companyCode"
                              placeholder="Enter Company Code"
                              maxlength="15"
                              validate={{ required: { value: true }, }}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.companyCode || ""}
                              invalid={validation.touched.companyCode && validation.errors.companyCode ? true : false}
                          
                            />
                            {validation.touched.companyCode && validation.errors.companyCode ? (
                                <FormFeedback type="invalid">{validation.errors.companyCode}</FormFeedback>
                            ) : null}
                          </Col> */}
                          {/* <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Plant Code</Label>
                            <Input type="text" className="form-control"
                              id="validationDefault03"
                              name="plantCode"
                              placeholder="Enter PLant Code"
                              maxlength="15"
                              validate={{ required: { value: true }, }}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.plantCode || ""}
                              invalid={validation.touched.plantCode && validation.errors.plantCode ? true : false}
                          
                            />
                            {validation.touched.plantCode && validation.errors.plantCode ? (
                                <FormFeedback type="invalid">{validation.errors.plantCode}</FormFeedback>
                            ) : null}
                          </Col> */}
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Service Name</Label>
                            <Input type="text" className="form-control"
                              id="validationDefault03"
                              name="serviceName"
                              placeholder="Enter Service Name"
                              maxlength="100"
                              validate={{ required: { value: true }, }}
                              onChange={handleInputChange}
                              onBlur={validation.handleBlur}
                              value={values.serviceName || ""}
                              invalid={validation.touched.serviceName && validation.errors.serviceName ? true : false}

                            />
                            {validation.touched.serviceName && validation.errors.serviceName ? (
                              <FormFeedback type="invalid">{validation.errors.serviceName}</FormFeedback>
                            ) : null}
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Service Url</Label>
                            <Input type="text" className="form-control"
                              id="validationDefault03"
                              name="serviceUrl"
                              placeholder="Enter Service Url"
                              maxlength="500"
                              validate={{ required: { value: true }, }}
                              onChange={handleInputChange}
                              onBlur={validation.handleBlur}
                              value={values.serviceUrl || ""}
                              invalid={validation.touched.serviceUrl && validation.errors.serviceUrl ? true : false}

                            />
                            {validation.touched.serviceUrl && validation.errors.serviceUrl ? (
                              <FormFeedback type="invalid">{validation.errors.serviceUrl}</FormFeedback>
                            ) : null}
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Sequence Number</Label>
                            <Input type="number" className="form-control"
                              id="validationDefault03"
                              name="sequenceNumber"
                              placeholder="Enter Sequence Number"

                              validate={{ required: { value: true }, }}
                              onChange={handleInputChange}
                              onBlur={validation.handleBlur}
                              value={values.sequenceNumber || ""}
                              invalid={validation.touched.sequenceNumber && validation.errors.sequenceNumber ? true : false}

                            />
                            {validation.touched.sequenceNumber && validation.errors.sequenceNumber ? (
                              <FormFeedback type="invalid">{validation.errors.sequenceNumber}</FormFeedback>
                            ) : null}
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">User Name</Label>
                            <Input type="text" className="form-control"
                              id="validationDefault03"
                              name="username"

                              placeholder="Enter User Name"
                              validate={{ required: { value: true }, }}
                              onChange={handleInputChange}
                              onBlur={validation.handleBlur}
                              value={values.username || ""}
                              invalid={validation.touched.username && validation.errors.username ? true : false}

                            />
                            {validation.touched.username && validation.errors.username ? (
                              <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                            ) : null}
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Password</Label>
                            <Input type="text" className="form-control"
                              id="validationDefault03"
                              name="password"
                              placeholder="Enter Password"
                              validate={{ required: { value: true }, }}
                              onChange={handleInputChange}
                              onBlur={validation.handleBlur}
                              value={values.password || ""}
                              invalid={validation.touched.password && validation.errors.password ? true : false}

                            />
                            {validation.touched.password && validation.errors.password ? (
                              <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                            ) : null}
                          </Col>
                          {isEdit &&
                            <Col lg={4}>
                              <div>
                                <Label className="form-label" >Status</Label>
                                <Input
                                  name="status"
                                  type="select"
                                  className="form-select"
                                  validate={{ required: { value: true }, }}
                                  onChange={handleInputChange}
                                  onBlur={validation.handleBlur}
                                  value={values.status || ""}
                                  invalid={validation.touched.status && validation.errors.status ? true : false}


                                >
                                  {status.map((item, key) => (
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
                          <Col lg={4}>
                            {/* <div>
                              <Label htmlFor="validationDefault12" className="form-label" >Movement Code</Label>
                              <Input
                                name="movementCode"
                                type="select"
                                className="form-select"
                                value={values.movementCode}
                                onChange={handleInputChange}
                                required
                              >
                                <option value={""}>{"Select Movement"}</option>
                                {movementType.map((item, key) => (
                                  <option value={item.code} key={key}>{item.name}</option>)
                                )}
                              </Input>
                            </div> */}
                            <div>
                              <Label className="form-label" >Movement Code</Label>
                              <Input
                                name="movementCode"
                                type="select"
                                className="form-select"
                                validate={{ required: { value: true }, }}
                                onChange={handleInputChange}
                                onBlur={validation.handleBlur}
                                value={values.movementCode || ""}
                                invalid={validation.touched.movementCode && validation.errors.movementCode ? true : false}


                              >
                                <option value={""}>{"Select Movement"}</option>
                                {movementType.map((item, key) => (
                                  <React.Fragment key={key}>
                                    <option value={item.code} key={key}>{item.name}</option>
                                  </React.Fragment>
                                ))}
                              </Input>
                              {validation.touched.movementCode && validation.errors.movementCode ? (
                                <FormFeedback type="invalid">{validation.errors.movementCode}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={4}>
                            {/* <div>
                              <Label htmlFor="validationDefault13" className="form-label" >Stage Code</Label>
                              <Input
                                name="stageCode"
                                type="select"
                                className="form-select"
                                value={values.stageCode}
                                onChange={handleInputChange}
                                required
                              >
                                <option value={""}>{"Select Stage"}</option>
                                {stageType.map((item, key) => (
                                  <option value={item.code} key={key}>{item.name}</option>)
                                )}
                              </Input>
                            </div> */}
                            <div>
                              <Label className="form-label" >Stage Code</Label>
                              <Input
                                name="stageCode"
                                type="select"
                                className="form-select"
                                validate={{ required: { value: true }, }}
                                onChange={handleInputChange}
                                onBlur={validation.handleBlur}
                                value={values.stageCode || ""}
                                invalid={validation.touched.stageCode && validation.errors.stageCode ? true : false}


                              >
                                <option value={""}>{"Select Stage"}</option>
                                {stageType.map((item, key) => (
                                  <React.Fragment key={key}>
                                    <option value={item.code} key={key}>{item.name}</option>
                                  </React.Fragment>
                                ))}
                              </Input>
                              {validation.touched.stageCode && validation.errors.stageCode ? (
                                <FormFeedback type="invalid">{validation.errors.stageCode}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md={4}></Col>
                          <Col md={4} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                            <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                            <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Interface"} </button>
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

export default MasterInterface;