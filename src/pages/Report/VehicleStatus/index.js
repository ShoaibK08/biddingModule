import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../VehicleStatus/Pmr.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
// import { valueContainerCSS } from "react-select/dist/declarations/src/components/containers";

const initialValues = {
  start_date: "",
  end_date: "",
  master_stage_id: "",
  master_plant_id: "",
  trip_movement_type_code: "",
  master_material_id: "",
};


const VehicleStatus = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [devices, setDevice] = useState([]);
  const [Movement, setMovement] = useState([]);
  const [Material, setMaterial] = useState([]);
  const [Plant, setPlant] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [dynamicFlag, setDynamicFlag] = useState(1);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  useEffect(() => {
    getAllDeviceData();
    getMovementData();
    getMaterialData();
    getPlantData();

  }, []);

  const getAllDeviceData = async (e) => {
    if(dynamicFlag === 1){
      axios.get(`http://15.207.143.240/api/queries/7/results.json?api_key=VL0pkpxPNVD1yV5LDt4qllprawEG1TmPNh6UGWCr`)
      .then(res => {
        console.log(res);
        //const device = res.Data["#result-set-1"];
        //setDevice(device);
      });
    }else{
    const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_REPORTS}/getReport/getPlantMovementReport`,values)
      .then(res => {
        const device = res.Data["#result-set-1"];
        setDevice(device);
      });
    }
  }

  const getMovementData = () => {
    
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/movements`)
      .then(res => {
        const Movement = res;
        setMovement(Movement);
      })
  }

  const getMaterialData = () => {
    
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/materials`)
      .then(res => {
        const Material = res;
        setMaterial(Material);
      })
  }

  const getPlantData = () => {
    
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/plants`)
      .then(res => {
        const plant = res;
        setPlant(plant);
      })
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
    });
  };

  const createdDateFunction = (date, date1, date2) => {
    
    setValues({
      ...values,
      ['start_date']: date1+" 00:00:00",
    });
  };

  const createdDateFunction1 = (date, date1, date2) => {
    
    setValues({
      ...values,
      ['end_date']: date1+" 23:59:00",
    });
  };


  const handleSubmit = async (e) => {
    
    console.log(values)
    e.preventDefault();
    try {
      if (isEdit) {
        const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/submenus/${CurrentID}`, values)
        console.log(res);
        toast.success("Sub Menu Updated Successfully", { autoClose: 3000 });
        getAllDeviceData();
      }
      else {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/submenus`, values)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Sub Menu Added Successfully.", { autoClose: 3000 });
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
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/submenus/${id}`)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "start_date": result.start_date,
          "end_date": result.end_date,
          "master_stage_id": result.master_stage_id,
          "master_plant_id": result.master_plant_id,
          "trip_movement_type_code": result.trip_movement_type_code,
          "master_material_id": result.master_material_id,
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
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/submenus/${CurrentID}`)
      console.log(res.data);
      getAllDeviceData();
      toast.success("Sub Menu Deleted Successfully", { autoClose: 3000 });
      setDeleteModal(false);
    } catch (e) {
      toast.error("Something went wrong!", { autoClose: 3000 });
      setDeleteModal(false);
    }
  };


  const master_material_id = [
    {
      options: [
        { label: "Select Material", value: "" },
        { label: "Active", value: "A" },
        { label: "Deactive", value: "D" },
      ],
    },
  ];


  const trip_movement_type_code = [
    {
      options: [
        { label: "Select Movement", value: "" },
        { label: "InBound", value: "In" },
        { label: "OutBound", value: "Ob" },
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
      // {
      //   Header: "Trip ID ",
      //   accessor: "plant_code",
      //   filterable: false,
      // },
      {
        Header: "S.No.",
        accessor: "trip_regSerialNumber",
        filterable: false,
      },
      {
        Header: "Order/DI Number",
        accessor: "trip_vehicleNumber",
        filterable: false,
      },
      {
        Header: "DI Qty",
        accessor: "trip_vehicle_type",
        filterable: false,
      },
      // {
      //   Header: "Stage Name",
      //   accessor: "trip_regSerialNumber",
      //   filterable: false,
      // },
      {
        Header: "MRP",
        accessor: "trip_yardIn",
        filterable: false,
      },
      {
        Header: "Product Code",
        accessor: "trip_yardInq",
        filterable: false,
      },
      // {
      //   Header: "Action",
      //   Cell: (cellProps) => {
      //     return (
      //       <ul className="list-inline hstack gap-2 mb-0">
      //         <li className="list-inline-item edit" title="Edit">
      //           <Link
      //             to="#"
      //             className="text-primary d-inline-block edit-item-btn"
      //             onClick={() => { const id = cellProps.row.original.id; handleCustomerClick(id); }}
      //           >

      //             <i className="ri-pencil-fill fs-16"></i>
      //           </Link>
      //         </li>
      //         <li className="list-inline-item" title="Remove">
      //           <Link
      //             to="#"
      //             className="text-danger d-inline-block remove-item-btn"
      //             onClick={() => { const id = cellProps.row.original.id; onClickDelete(id); }}>
      //             <i className="ri-delete-bin-5-fill fs-16"></i>
      //           </Link>
      //         </li>
      //       </ul>
      //     );
      //   },
      // },
    ],
  );




  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Vehicle Status | EPLMS";
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
          <BreadCrumb title="Vehicle Status" pageTitle="Reports" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Vehicle Status</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                          Download
                        </button>
                      </div>
                    </div>
                    {/* <div className="col-sm-auto">
                      <div>

                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); setValues(initialValues); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add Sub Menu
                        </button>{" "}

                      </div>
                    </div> */}
                  </Row>

                  <Row className="mt-4">

                  
                    <Col lg={3}>
                      <div>
                        <Label className="form-label" >Vehicle<span style={{ color: "red" }}>*</span></Label>
                        <Input
                          name="trip_movement_type_code"
                          type="select"
                          className="form-select"
                          // value={values.trip_movement_type_code}
                          onChange={handleInputChange}
                          
                        >
                         <React.Fragment>
                          <option value=""selected>Select Vehicle</option>
                          {Movement.map((item, key) => (<option value={item.code} key={key}>{item.name}</option>))}
                        </React.Fragment>
                        </Input>
                      </div>
                    </Col>

                    <Col md={1} className="hstack gap-2 justify-content-end" style={{ marginTop: "27px" }}>
                            <button type="button" className="btn btn-success" onClick={getAllDeviceData} >Search </button>
                          </Col>
                  </Row>

                  


                </CardHeader>
                <div className="card-body pt-0 mt-5">
                    <h5>TRIP STATUS</h5>
                  <div>
                  <div id="multi-step-form-container">
                    <ul class="form-stepper form-stepper-horizontal text-center mx-auto pl-0">
                       
                        <li class="form-stepper-active text-center form-stepper-list" step="1">
                            <a class="">
                                <span class="form-stepper-circle">
                                    <span>1</span>
                                </span>
                                <div class="label"></div>
                            </a>
                        </li>
                        <li class="form-stepper-unfinished text-center form-stepper-list" step="2">
                            <a class="">
                                <span class="form-stepper-circle text-muted">
                                    <span>2</span>
                                </span>
                                <div class="label text-muted"></div>
                            </a>
                        </li>
                        <li class="form-stepper-unfinished text-center form-stepper-list" step="3">
                            <a class="">
                                <span class="form-stepper-circle text-muted">
                                    <span>3</span>
                                </span>
                                <div class="label text-muted"></div>
                            </a>
                        </li>
                        <li class="form-stepper-unfinished text-center form-stepper-list" step="4">
                            <a class="">
                                <span class="form-stepper-circle text-muted">
                                    <span>4</span>
                                </span>
                                <div class="label text-muted"></div>
                            </a>
                        </li>
                        <li class="form-stepper-unfinished text-center form-stepper-list" step="5">
                            <a class="">
                                <span class="form-stepper-circle text-muted">
                                    <span>5</span>
                                </span>
                                <div class="label text-muted"></div>
                            </a>
                        </li>
                        <li class="form-stepper-unfinished text-center form-stepper-list" step="6">
                            <a class="">
                                <span class="form-stepper-circle text-muted">
                                    <span>6</span>
                                </span>
                                <div class="label text-muted"></div>
                            </a>
                        </li>
                        <li class="form-stepper-unfinished text-center form-stepper-list" step="7">
                            <a class="">
                                <span class="form-stepper-circle text-muted">
                                    <span>7</span>
                                </span>
                                <div class="label text-muted"></div>
                            </a>
                        </li>
                        <li class="form-stepper-unfinished text-center form-stepper-list" step="8">
                            <a class="">
                                <span class="form-stepper-circle text-muted">
                                    <span>8</span>
                                </span>
                                <div class="label text-muted"></div>
                            </a>
                        </li>
                    </ul>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0 mt-5">
                    <h5>VEHICLE INFO</h5>
                  <div>

                  </div>
                </div>
                <div className="card-body pt-0 mt-5">
                    <h5>ORDER DETAILS</h5>
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
                      SearchPlaceholder='Search...'
                      divClass="overflow-auto"
                    />
                  </div>


                  {/* <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Sub Menu" : "Add Sub Menu"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                      <ModalBody>
                        <Row className="g-3">
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Name</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault03"
                              name="name"
                              placeholder="Enter Name"
                              value={values.name}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Main Menu Name</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="mainmenuName"
                              placeholder="Enter Main Menu Name"
                              value={values.mainmenuName}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Display Order</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="displayOrder"
                              placeholder="Enter Display Order"
                              value={values.displayOrder}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Icon</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="icon"
                              placeholder="Enter Icon"
                              value={values.icon}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Company Code</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="companyCode"
                              placeholder="Enter Company Code"
                              value={values.companyCode}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Plant Code</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="plantCode"
                              placeholder="Enter Plant Code"
                              value={values.plantCode}
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
                            <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Sub Menu"} </button>
                          </Col>

                      </ModalBody>
                      <ModalFooter>
                      </ModalFooter>
                    </Form>
                  </Modal> */}
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

export default VehicleStatus;
