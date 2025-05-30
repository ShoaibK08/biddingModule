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
import '../MasterStage/Stage.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";

const initialValues = {
  name: "",
  code: "",
  status: "A",
  id: ""
};


const MasterStage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [stages, setStage] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
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
    getAllStageData();

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

  const getAllStageData = () => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/stages`, config)
      .then(res => {
        const stage = res;
        setStage(stage);
      });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
    });
  };

  /*
    const handleSubmit = async (e) => {
      
      console.log(values)
      e.preventDefault();
      try {
        if (isEdit) {
          const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/stages/${CurrentID}`, values)
          console.log(res);
          toast.success("Stage Updated Successfully", { autoClose: 3000 });
          getAllStageData();
        }
        else {
          const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/stages`, values)
          console.log(res);
          if (!res.errorMsg) {
            toast.success("Stage Added Successfully.", { autoClose: 3000 });
          }
          else {
            toast.error("Data Already Exist.", { autoClose: 3000 });
          }
          getAllStageData();
        }
      }
      catch (e) {
        toast.error("Something went wrong!", { autoClose: 3000 });
      }
      toggle();
    };
  
  */

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (values && values.name) || '',
      code: (values && values.code) || '',
      status: (values && values.status) || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
      code: Yup.string().required("Please Enter Code"),
      status: Yup.string().required("Please Select Status"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const res = axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/stages/${CurrentID}`, values, config)
        console.log(res);
        toast.success("Stage Updated Successfully", { autoClose: 3000 });
        setTimeout(function () { getAllStageData(); }, 2000);
        validation.resetForm();
        toggle();
      }
      else {
        axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/stages`, values, config)
          .then(res => {
            console.log("dfdfd", res);
            if (!res.errorMsg) {
              toast.success("Stage Added Successfully.", { autoClose: 3000 });
              setTimeout(function () { getAllStageData(); }, 2000);
              validation.resetForm();
              toggle();
            }
            else {
              toast.error(res.errorMsg, { autoClose: 3000 });
            }
          });
        //const res = axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/stages`, values)

        /*if (!res.errorMsg) {
          toast.success("Stage Added Successfully.", { autoClose: 3000 });
        }
        else {
          toast.error("Data Already Exist.", { autoClose: 3000 });
        }*/
        // validation.resetForm();
        // getAllStageData();
      }

      getAllStageData();
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
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/stages/${id}`, config)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "name": result.name,
          "code": result.code,
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
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/stages/${CurrentID}`, config)
      console.log(res.data);
      getAllStageData();
      toast.success("Stage Deleted Successfully", { autoClose: 3000 });
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
        Header: "Stage Name",
        accessor: "name",
        filterable: false,
      },
      {
        Header: "Stage Code",
        accessor: "code",
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

  document.title = "Stage | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={stages}
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
                        <h5 className="card-title mb-0 bg-light">Stage Details</h5>
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
                          <i className="ri-add-line align-bottom me-1"></i> Add Stage
                        </button>{" "}

                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    {stages && stages.length ? (
                      <TableContainer
                        columns={columns}
                        data={stages}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        //isCustomerFilter={true}
                        SearchPlaceholder='Search for Stage Name or something...'
                      />) : (<Loader />)
                    }
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Stage" : "Add Stage"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }} autoComplete="off">
                      <ModalBody>
                        <Row className="g-3">
                          <Col md={4}>
                            <Label htmlFor="validationDefault01" className="form-label">Stage Code</Label>
                            <Input type="text" className="form-control"
                              name="code"
                              id="validationDefault01"
                              placeholder="Enter Stage Code"
                              maxlength="15"
                              readOnly={!!isEdit ? true : false}
                              validate={{ required: { value: true }, }}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.code || ""}
                              invalid={validation.touched.code && validation.errors.code ? true : false}

                            />
                            {validation.touched.code && validation.errors.code ? (
                              <FormFeedback type="invalid">{validation.errors.code}</FormFeedback>
                            ) : null}
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Stage Name</Label>
                            <Input type="text" className="form-control"
                              id="validationDefault03"
                              name="name"
                              placeholder="Enter Stage Name"
                              maxlength="100"
                              validate={{ required: { value: true }, }}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.name || ""}
                              invalid={validation.touched.name && validation.errors.name ? true : false}

                            />
                            {validation.touched.name && validation.errors.name ? (
                              <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
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
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.status || ""}
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
                          <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                            <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                            <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Stage"} </button>
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

export default MasterStage;
