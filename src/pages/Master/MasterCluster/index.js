import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import './Cluster.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";

const initialValues = {
  clusterName: "",
  clusterCode: "",
  clusterType: "",
  clusterState: "",
  contactPerson: "",
  contactNumber: "",
  remarks: "",
  approvalNeeded: "",
  status: "A",
  plantCode: "",
  companyCode: "",
  id: ""
};


const MasterCluster = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [devices, setDevice] = useState([]);
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

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/clusters`, config)
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
        const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/clusters/${CurrentID}`, values, config)
        console.log(res.data);
        toast.success("Cluster Updated Successfully", { autoClose: 3000 });
        getAllDeviceData();
      }
      else {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/clusters`, values, config)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Cluster Added Successfully.", { autoClose: 3000 });
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
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/clusters/${id}`, config)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "clusterCode": result.clusterCode,
          "clusterName": result.clusterName,
          "clusterType": result.clusterType,
          "clusterState": result.clusterState,
          "contactPerson": result.contactPerson,
          "contactNumber": result.contactNumber,
          "remarks": result.remarks,
          "approvalNeeded": result.approvalNeeded,
          "status": result.status,
          "plantCode": result.plantCode,
          "companyCode": result.companyCode,
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
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/clusters/${CurrentID}`, config)
      console.log(res.data);
      getAllDeviceData();
      toast.success("Cluster Deleted Successfully", { autoClose: 3000 });
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
        { label: "Approved", value: "A" },
        { label: "Rejected", value: "R" },
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
        Header: "Cluster Name",
        accessor: "clusterName",
        filterable: false,
      },
      {
        Header: "Cluster Code",
        accessor: "clusterCode",
        filterable: false,
      },
      {
        Header: "Cluster Type",
        accessor: "clusterType",
        filterable: false,
      },
      {
        Header: "Cluster State",
        accessor: "clusterState",
        filterable: false,
      },
      {
        Header: "Contact Person",
        accessor: "contactPerson",
        filterable: false,
      },
      {
        Header: "Contact Number",
        accessor: "contactNumber",
        filterable: false,
      },
      {
        Header: "Plant Code",
        accessor: "plantCode",
        filterable: false,
      },
      {
        Header: "Company Code",
        accessor: "companyCode",
        filterable: false,
      },
      {
        Header: "Remarks",
        accessor: "remarks",
        filterable: false,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (cell) => {
          switch (cell.value) {
            case "A":
              return <span className="badge text-uppercase badge-soft-success"> Approved </span>;
            case "R":
              return <span className="badge text-uppercase badge-soft-danger"> Rejected </span>;
            default:
              return <span className="badge text-uppercase badge-soft-info"> Approved </span>;
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

  document.title = "Cluster | EPLMS";
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
          <BreadCrumb title={latestHeader} pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Cluster Details</h5>
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
                          <i className="ri-add-line align-bottom me-1"></i> Add Cluster
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
                      SearchPlaceholder='Search for Cluster Name or something...'
                    />
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Cluster" : "Add Cluster"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                      <ModalBody>
                        <Row className="g-3">
                          <Col md={3}>
                            <Label htmlFor="validationDefault01" className="form-label">Cluster Name</Label>
                            <Input type="text" required className="form-control"
                              name="clusterName"
                              id="validationDefault01"
                              placeholder="Enter Cluster Name"
                              value={values.clusterName}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={3}>
                            <Label htmlFor="validationDefault03" className="form-label">Cluster Code</Label>
                            <Input type="text" required disabled={isEdit ? true : false} className="form-control"
                              id="validationDefault03"
                              name="clusterCode"
                              placeholder="Enter Cluster Code"
                              value={values.clusterCode}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={3}>
                            <Label htmlFor="validationDefault04" className="form-label">Cluster Type</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="clusterType"
                              placeholder="Enter Cluster Type"
                              value={values.clusterType}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={3}>
                            <Label htmlFor="validationDefault04" className="form-label">Cluster State</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="clusterState"
                              placeholder="Enter Cluster State"
                              value={values.clusterState}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={3}>
                            <Label htmlFor="validationDefault01" className="form-label">Contact Person</Label>
                            <Input type="text" required className="form-control"
                              name="contactPerson"
                              id="validationDefault01"
                              placeholder="Enter Contact Person"
                              value={values.contactPerson}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={3}>
                            <Label htmlFor="validationDefault03" className="form-label">Contact Number</Label>
                            <Input type="tel" required className="form-control"
                              id="validationDefault03"
                              name="contactNumber"
                              placeholder="Enter Contact Number"
                              value={values.contactNumber}
                              onChange={handleInputChange}
                              maxLength={'10'}
                              pattern="[6789][0-9]{9}"
                            />
                          </Col>
                          <Col md={3}>
                            <Label htmlFor="validationDefault04" className="form-label">Plant Code</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="plantCode"
                              placeholder="Enter Plant Code"
                              value={values.plantCode}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={3}>
                            <Label htmlFor="validationDefault04" className="form-label">Company Code</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="companyCode"
                              placeholder="Enter Company Code"
                              value={values.companyCode}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={3}>
                            <Label htmlFor="validationDefault04" className="form-label">Remarks</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="remarks"
                              placeholder="Enter Remarks"
                              value={values.remarks}
                              onChange={handleInputChange}
                            />
                          </Col>
                          {isEdit &&
                            <Col md={3}>
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
                          }
                          <Col md={6} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                            <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                            <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Cluster"} </button>
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

export default MasterCluster;
