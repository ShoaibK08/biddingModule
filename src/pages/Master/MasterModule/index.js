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
import '../MasterModule/Module.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderNew from "../../../Components/Common/Loader_new";

const initialValues = {
  moduleName: "",
  status: "A",
  id: ""
};


const MasterModule = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [modules, setModule] = useState([]);
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
    getAllModuleData();

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

  const getAllModuleData = () => {
    setloader(true);
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/module-master`, config)
      .then(res => {
        const module = res;
        setModule(module);
        setloader(false);
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
        const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/module-master/${CurrentID}`, values, config)
        console.log(res);
        toast.success("Module Updated Successfully", { autoClose: 3000 });
        getAllModuleData();
      }
      else {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/module-master`, values, config)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Module Added Successfully.", { autoClose: 3000 });
        }
        else {
          toast.error("Data Already Exist.", { autoClose: 3000 });
        }
        getAllModuleData();
      }
    }
    catch (e) {
      toast.error("Something went wrong!", { autoClose: 3000 });
    }
    toggle();
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      moduleName: (values && values.moduleName) || '',
      status: (values && values.status) || '',
    },
    validationSchema: Yup.object({
      moduleName: Yup.string().required("Please Enter Module Name"),
      status: Yup.string().required("Please Select Status"),
    }),
    onSubmit: async (values) => {
      try{
        if (isEdit) {
          const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/module-master/${CurrentID}`, values, config)
          console.log(res);
          toast.success("Module Updated Successfully", { autoClose: 3000 });
          getAllModuleData();
          validation.resetForm();
          toggle();
        }
        else {
          await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/module-master`, values, config)
            .then(res => {
              if (!res.errorMsg) {
                toast.success("Module Added Successfully.", { autoClose: 3000 });
                validation.resetForm();
                getAllModuleData();
                toggle();
              }
              else {
                toast.error("Data Already Exist.", { autoClose: 3000 });
              }
              getAllModuleData();
            });
        }
      }
      catch (e) {
        console.log(e);
        toast.error(e, { autoClose: 3000 });
      }
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
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/module-master/${id}`, config)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "moduleName": result.moduleName,
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
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/module-master/${CurrentID}`, config)
      console.log(res.data);
      getAllModuleData();
      toast.success("Module Deleted Successfully", { autoClose: 3000 });
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
        Header: "Module Name",
        accessor: "moduleName",
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

  document.title = "Module | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={modules}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid>
          <BreadCrumb title={'Module'} pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Module Details</h5>
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
                          <i className="ri-add-line align-bottom me-1"></i> Add Module
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
                        data={modules}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        //isCustomerFilter={true}
                        SearchPlaceholder='Search for Module Name or something...'
                      />
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="sm">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Module" : "Add Module"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }} autoComplete="off">
                      <ModalBody>
                        <Row className="g-3">
                          <Col lg={12}>
                            <Label htmlFor="validationDefault03" className="form-label">Module Name</Label>
                            <Input type="text" className="form-control"
                              id="validationDefault03"
                              name="moduleName"
                              maxlength="25"
                              placeholder="Enter Module Name"
                              validate={{ required: { value: true }, }}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.moduleName || ""}
                              invalid={validation.touched.moduleName && validation.errors.moduleName ? true : false}
                              disabled={isEdit}
                            />
                            {validation.touched.moduleName && validation.errors.moduleName ? (
                              <FormFeedback type="invalid">{validation.errors.moduleName}</FormFeedback>
                            ) : null}
                          </Col>
                          {isEdit &&
                            <Col lg={12}>
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
                          <Col md={12} className="hstack gap-2 justify-content-end">
                            <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                            <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Module"} </button>
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

export default MasterModule;
