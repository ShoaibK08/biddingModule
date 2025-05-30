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
  documentRelatedTo: "",
  documentTypeId: "",
  status: "A",
  id: ""
};


const MasterDocumentType = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [interfaces, setInterface] = useState([]);
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
    getAllInterfaceData();
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

  const getAllInterfaceData = () => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/document-master-type`, config)
      .then(res => {
        const interface1 = res;
        setInterface(interface1);
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
          const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/document-master-type/${CurrentID}`, values)
          console.log(res);
          toast.success("Interface Updated Successfully", { autoClose: 3000 });
          getAllInterfaceData();
        }
        else {
          const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/document-master-type`, values)
          console.log(res);
          if (!res.errorMsg) {
            toast.success("Interface Added Successfully.", { autoClose: 3000 });
          }
          else {
            toast.error("Data Already Exist.", { autoClose: 3000 });
          }
          getAllInterfaceData();
        }
      }
      catch (e) {
        toast.error("Something went wrong!", { autoClose: 3000 });
      }
      toggle();
    };
  
  */

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
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/document-master-type/${id}`, config)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "documentRelatedTo": result.documentRelatedTo,
          "documentTypeId": result.documentTypeId,
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
      documentTypeId: (values && values.documentTypeId) || '',
      documentRelatedTo: (values && values.documentRelatedTo) || '',
      status: (values && values.status) || '',
    },
    validationSchema: Yup.object({
      documentRelatedTo: Yup.string().required("Please Enter Document Related"),
      documentTypeId: Yup.string().required("Please Select Document Type"),
      status: Yup.string().required("Please Select Status"),
      // description: Yup.string().required("Please Enter Tag Description"),
      // dueDate: Yup.string().required("Please Enter Date"),
      // status: Yup.string().required("Please Enter Status"),
      // priority: Yup.string().required("Please Enter Priority"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        values["plantCode"] = "PLANT123";
        const res = axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/document-master-type/${CurrentID}`, values, config)
        console.log(res);
        toast.success("Document Type Updated Successfully", { autoClose: 3000 });
        validation.resetForm();
        setTimeout(function () { getAllInterfaceData(); }, 2000);
        toggle();
      }
      else {
        values["plantCode"] = "PLANT123";
        axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/document-master-type`, values, config)
          .then(res => {
            if (!res.errorMsg) {
              toast.success("Document Type Added Successfully.", { autoClose: 3000 });
              validation.resetForm();
              setTimeout(function () { getAllInterfaceData(); }, 2000);
              toggle();
            }
            else {
              toast.error("Data Already Exist.", { autoClose: 3000 });
            }

          });
      }

      setTimeout(function () { getAllInterfaceData(); }, 2000);
    },
  });

  const handleDeleteCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/document-master-type/${CurrentID}`, config)
      console.log(res.data);
      getAllInterfaceData();
      toast.success("Document Type Deleted Successfully", { autoClose: 3000 });
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
        Header: "Document Name",
        accessor: "documentRelatedTo",
        filterable: false,
      },
      {
        Header: "Document Type",
        accessor: "documentTypeId",
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

  document.title = "Document Type | EPLMS";
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
                        <h5 className="card-title mb-0 bg-light">Document Type Details</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>

                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); validation.resetForm(); toggle(); setValues(initialValues); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add Document Type
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
                        SearchPlaceholder='Search for Document Type Name or something...'
                      />) : (<Loader />)
                    }
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Document Type" : "Add Document Type"}
                    </ModalHeader>
                    <Form className="tablelist-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }} autoComplete="off">
                      <ModalBody>
                        <Row className="g-3">
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Document Related To</Label>
                            <Input type="text" className="form-control"
                              id="validationDefault03"
                              name="documentRelatedTo"
                              maxlength="25"
                              style={{ textTransform: "capitalize" }}
                              placeholder="Enter Document Related To"
                              validate={{ required: { value: true }, }}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              readOnly={(!!isEdit ? true : false)}
                              value={validation.values.documentRelatedTo || ""}
                              invalid={validation.touched.documentRelatedTo && validation.errors.documentRelatedTo ? true : false}

                            />
                            {validation.touched.documentRelatedTo && validation.errors.documentRelatedTo ? (
                              <FormFeedback type="invalid">{validation.errors.documentRelatedTo}</FormFeedback>
                            ) : null}
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Document Type</Label>
                            <Input type="select" className="form-select"
                              id="validationDefault03"
                              name="documentTypeId"
                              validate={{ required: { value: true }, }}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.documentTypeId || ""}
                              invalid={validation.touched.documentTypeId && validation.errors.documentTypeId ? true : false}

                            >
                              <React.Fragment>
                                <option value="">Select Document Type</option>
                                <option value="driver">Driver</option>
                                <option value="vehicle">Vehicle</option>
                              </React.Fragment>
                            </Input>
                            {validation.touched.documentTypeId && validation.errors.documentTypeId ? (
                              <FormFeedback type="invalid">{validation.errors.documentTypeId}</FormFeedback>
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
                            <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Document Type"} </button>
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

export default MasterDocumentType;
