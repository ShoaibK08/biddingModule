import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../MasterDevice/Device.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";

const initialValues = {
  deviceName: "",
  deviceType: "",
  ipAddress: "",
  port: "",
  connectionType: "",
  locationName: "",
  remarks: "",
  status: "A",
  id: ""
};


const MasterDevice = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [devices, setDevice] = useState([]);
  const [PlantStage, setPlantStage] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [deviceError, setDeviceError] = useState(false);
  const [Plant_Code, setPlantCode] = useState('');
  const [comapny_code, setCompanyCode] = useState('');
  const [deviceType, setDeviceType] = useState([]);
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
    let plantcode = obj.data.plantCode;
    setPlantCode(plantcode);
    sessionStorage.getItem("main_menu_login");
    const obj1 = JSON.parse(sessionStorage.getItem("main_menu_login"));
    let companyCode = obj1.companyCode;
    setCompanyCode(companyCode);
    getAllDeviceData(plantcode);
    getPlantStageLocation(plantcode);
    getDeviceType(plantcode);
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

  const getAllDeviceData = (plantcode) => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/devices?plantCode=${plantcode}`, config)
      .then(res => {
        const device = res;
        setDevice(device);
      });
  }

    const getPlantStageLocation = (plantcode) => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/plant-stage-locations/getLocationPlantWise/${plantcode}`, config)
      .then(res => {
        const result = res;
        setPlantStage(result);
      });
  }

  const getDeviceType = (plantcode) => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/device-type?plantCode=${plantcode}`, config)
      .then(res => {
        const result = res;
        setDeviceType(result);
      });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
      //["status"]: "A",
      ["plantCode"]: Plant_Code,
    });
  };

  const handleSubmit = async (e) => {
    
    console.log(values)
    e.preventDefault();
    let ipaddress = values.ipAddress;
    console.log("Result = " + ipaddress);

    if (ipaddress !== "") {

      var ipadd = ipaddress;

      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        try {
          if (isEdit) {
            const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/devices/${CurrentID}`, values, config)
            console.log(res);
            toast.success("Device Updated Successfully", { autoClose: 3000 });
            getAllDeviceData(Plant_Code);
          }
          else {
            const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/devices`, values, config)
            console.log(res);
            if (!res.errorMsg) {
              toast.success("Device Added Successfully.", { autoClose: 3000 });
            }
            else {
              toast.error("Data Already Exist.", { autoClose: 3000 });
            }
            getAllDeviceData(Plant_Code);
          }
        }
        catch (e) {
          toast.error("Something went wrong!", { autoClose: 3000 });
        }
        toggle();
      }
      else {
        alert("IpAddress is not Valid= ");
      }

    }
    else {
      alert("Please Enter IpAddress");
    }
  }


  function devicemastervalidate() {
    
    let devicename = values.deviceName;
    console.log("Result = " + devicename);
    //let devicename = value.deviceName;
    alert("Device Name is " + devicename);
    let formIsValid = true;
    let errors = {};
    if (devicename === "") {
      formIsValid = false;
      alert("Please Enter Device Name");
      setDeviceError(true);
    }


  }
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
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/devices/${id}`, config)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "deviceName": result.deviceName,
          "deviceType": result.deviceType,
          "locationName": result.locationName,
          "status": result.status,
          "ipAddress": result.ipAddress,
          "port": result.port,
          "suffix":result.suffix,
          "prefix":result.prefix,
          "connectionType": result.connectionType,
          "remarks": result.remarks,
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
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/devices/${CurrentID}`, config)
      console.log(res.data);
      getAllDeviceData(Plant_Code);
      toast.success("Device Deleted Successfully", { autoClose: 3000 });
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

  const connType = [
    {
      options: [
        { label: "Select Status", value: "" },
        { label: "CLIENT", value: "CLIENT" },
        { label: "SERVER", value: "SERVER" },
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
        Header: "Device Name",
        accessor: "deviceName",
        filterable: false,
      },
      {
        Header: "Device Type",
        accessor: "deviceType",
        filterable: false,
      },
      {
        Header: "IP Addresss",
        accessor: "ipAddress",
        filterable: false,
      },
      {
          Header: "Prefix",
          accessor: "prefix",
          filterable: false,
      },
      {
          Header: "Suffix",
          accessor: "suffix",
          filterable: false,
      },
      {
        Header: "Port",
        accessor: "port",
        filterable: false,
      },
      {
        Header: "Connection Type",
        accessor: "connectionType",
        filterable: false,
      },
      {
        Header: "Location Code",
        accessor: "locationName",
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

  document.title = "Device | EPLMS";
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
                        <h5 className="card-title mb-0 bg-light">Device Details</h5>
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
                          <i className="ri-add-line align-bottom me-1"></i> Add Device
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
                        SearchPlaceholder='Search for Device Name or something...'
                        divClass="overflow-auto"
                        tableClass="width-120"
                      />) : (<Loader />)
                    }
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Device" : "Add Device"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                      <ModalBody>
                        <Row className="g-3">
                          <Col md={4}>
                            <Label htmlFor="validationDefault01" className="form-label">Device Name</Label>
                            <Input type="text" required className="form-control"
                              name="deviceName"
                              id="validationDefault01"
                              placeholder="Enter Device Name"
                              value={values.deviceName}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Device Type</Label>
                            {/* <Input type="text" required className="form-control"
                              id="validationDefault03"
                              name="deviceType"
                              placeholder="Enter Device type"
                              value={values.deviceType}
                              onChange={handleInputChange}
                            /> */}
                            <Input
                              name="deviceType"
                              type="select"
                              className="form-select"
                              value={values.deviceType}
                              onChange={handleInputChange}
                              required
                            >
                              <option value={""}>{"Select Device Type"}</option>
                              {deviceType.map((item, key) => (
                                <React.Fragment key={key}>
                                  
                                  <option value={item.deviceType}>{item.deviceType}</option>
                                </React.Fragment>
                              ))}
                            </Input>
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">IP Address</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="ipAddress"
                              placeholder="Enter IP Address"
                              value={values.ipAddress}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Port Number</Label>
                            <Input type="number" required className="form-control"
                              id="validationDefault04"
                              name="port"
                              placeholder="Enter Port Number"
                              value={values.port}
                              onChange={handleInputChange}
                            />
                          </Col>
                          {/* <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Connection Type</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="connectionType"
                              placeholder="Enter Connection Type"
                              value={values.connectionType}
                              onChange={handleInputChange}
                            />
                          </Col> */}
                          <Col lg={4}>
                              <div>
                                <Label className="form-label" >Connection Type</Label>
                                <Input
                                  name="connectionType"
                                  type="select"
                                  className="form-select"
                                  value={values.connectionType}
                                  onChange={handleInputChange}
                                  required
                                >
                                  {connType.map((item, key) => (
                                    <React.Fragment key={key}>
                                      {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                    </React.Fragment>
                                  ))}
                                </Input>
                              </div>
                            </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Prefix</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="prefix"
                              placeholder="Enter Prefix"
                              value={values.prefix}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Suffix</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="suffix"
                              placeholder="Enter Suffix"
                              value={values.suffix}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col lg={4}>
                              <div>
                                <Label className="form-label" >Location Code</Label>
                                <Input
                                  name="locationName"
                                  type="select"
                                  className="form-select"
                                  value={values.locationName}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value={""}>{"Select Location"}</option>
                                  {PlantStage.map((item, key) => (
                                      <option value={item.locationName} key={key}>{item.locationName}</option>)
                                  )}
                                </Input>
                              </div>
                            </Col>
                          {isEdit &&
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
                          }
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Remarks</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="remarks"
                              placeholder="Enter remarks"
                              value={values.remarks}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={isEdit ? 8 : 12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                            <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                            <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Device"} </button>
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

export default MasterDevice;
