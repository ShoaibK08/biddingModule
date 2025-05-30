import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../MasterCommonShift/CommonShift.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Flatpickr from "react-flatpickr";
import Loader from "../../../Components/Common/Loader";

const initialValues = {
    code: "",
    fromTime: "",
    toTime: "",
    status: "",
   
};


const MasterCommonShift = () => {
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
  

  const createdDateFunction = (date, date1, date2) => {
    setValues({
      ...values,
      ['fromTime']: date1,
    });
  };
  const createdDateFunction1 = (date, date1, date2) => {
    setValues({
      ...values,
      ['toTime']: date1,
    });
  };
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

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/common-shifts`, config)
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
        const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/common-shifts/${CurrentID}`, values, config)
        console.log(res);
        toast.success("Common Shift Updated Successfully", { autoClose: 3000 });
        getAllDeviceData();
      }
      else {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/common-shifts`, values, config)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Common Shift Added Successfully.", { autoClose: 3000 });
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
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/common-shifts/${id}`, config)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "code": result.code,
          "fromTime": result.fromTime,
          "toTime": result.toTime,
          "status": result.status,
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
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/common-shifts/${CurrentID}`, config)
      console.log(res.data);
      getAllDeviceData();
      toast.success("Common Shift Deleted Successfully", { autoClose: 3000 });
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
        Header: "Code",
        accessor: "code",
        filterable: false,
      },
      {
        Header: "From Time",
        accessor: "fromTime",
        filterable: false,
      },
      {
        Header: "To Time",
        accessor: "toTime",
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

  document.title = "Common Shift | EPLMS";
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
          <BreadCrumb title={'Common Shift'} pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Common Shift Details</h5>
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
                          <i className="ri-add-line align-bottom me-1"></i> Add Common Shift
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
                      SearchPlaceholder='Search for Commmon Shift Name or something...'
                    />
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Common Shift" : "Add Common Shift"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                      <ModalBody>
                        <Row className="g-3">
                          <Col md={4}>
                            <Label htmlFor="validationDefault01" className="form-label">Code</Label>
                            <Input type="text" required disabled = {isEdit ? true :false}  className="form-control"
                              name="code"
                              id="validationDefault01"
                              placeholder="Enter Code"
                              maxlength="15"
                              value={values.code}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                                <Label htmlFor="validationDefault04" className="form-label">From Time</Label>
                                <div className="">
                                <Input type="time" required
                                    className="form-control"
                                    id="datepicker-publish-input"
                                    placeholder="Select From Time"
                                    step="2"
                                    name="fromTime"
                                    value={values.fromTime}
                                    options={{
                                      enableTime: true,
                                      dateFormat: "H:M:S",
                                      noCalendar: true,
                                      time_24hr: true,
                                    }}
                                    onChange={handleInputChange} 
                                  //  onChange={(selectedDates, dateStr, fp) => { createdDateFunction(selectedDates, dateStr, fp) }}
                                  />
                                </div>
                              </Col>
                          <Col md={4}>
                                <Label htmlFor="validationDefault04" className="form-label">To Time</Label>
                                <div className="">
                                  <Input type="time" required
                                    className="form-control"
                                    id="datepicker-publish-input"
                                    placeholder="Select To Time"
                                    name="toTime"
                                    step="2"
                                    value={values.toTime}
                                    options={{
                                      enableTime: true,
                                      dateFormat: "H:M:S",
                                      noCalendar: true,
                                      time_24hr: true,
                                    }}
                                    onChange={handleInputChange}
                                    //onChange={(selectedDates, dateStr, fp) => { createdDateFunction1(selectedDates, dateStr, fp) }}
                                  />
                                </div>
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
                            <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Common Shift"} </button>
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

export default MasterCommonShift;
