import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
// import '../MasterTolerance/SubMenu.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";

const initialValues = {
  toleranceType: "",
  className: "",
  materialTypesCode: "",
  plantCode: "",
  companyCode: "",
  minimumAlert: "",
  maximumAlert: "",
  materialMasterCode: "",
  weightType: "TW",
  status: "A",
};


const MasterTolerance = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [devices, setDevice] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [material, setMaterial] = useState([]);
  const [MaterialType, setMaterialType] = useState([]);
  const [Plant_Code, setPlantCode] = useState('');
  const [comapny_code, setCompanyCode] = useState('');
  const [latestHeader, setLatestHeader] = useState('');
  const [ToleranceType, setToleranceType] = useState([]);
  const [UOM, setUOM] = useState('');

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
    getMaterialData(plantcode);
    getMaterialTypeData(plantcode);
    getToleranceType(plantcode);

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

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/tolerance-masters?plantCode=${plantcode}`, config)
      .then(res => {
        const device = res;
        setDevice(device);
      });
  }

  const getMaterialData = (plantcode) => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/materials?plantCode=${plantcode}`, config)
      .then(res => {
        const MaterialData = res;
        if (res.errorMsg) {
          setMaterial([]);
        } else {
          setMaterial(MaterialData);
        }
      })
  }

  const getMaterialTypeData = (plantcode) => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/material-types?plantCode=${plantcode}`, config)
      .then(res => {
        const MaterialTypeData = res;
        if (res.errorMsg) {
          setMaterialType([]);
        } else {
          setMaterialType(MaterialTypeData);
        }
      })
  }

  const getToleranceType = (plantcode) => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/tolerance-masters/getToleranceType`, config)
      .then(res => {
        const ToleranceType = res;
        if (res.errorMsg) {
          setToleranceType([]);
        } else {
          setToleranceType(ToleranceType);
        }
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name==="toleranceType" && value==="Percentage"){
      setUOM("%");
    }
    if(name==="toleranceType" && value==="Range-Weight"){
      setUOM("KG");
    }
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
      ["plantCode"]: Plant_Code,
      ["companyCode"]: comapny_code,
    });
  };


  const handleSubmit = async (e) => {

    console.log(values)
    e.preventDefault();
    try {
      if (isEdit) {
        const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/tolerance-masters/${CurrentID}`, values, config)
        console.log(res);
        toast.success("Tolerance Updated Successfully", { autoClose: 3000 });
        getAllDeviceData(Plant_Code);
      }
      else {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/tolerance-masters`, values, config)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Tolerance Added Successfully.", { autoClose: 3000 });
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
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/tolerance-masters/${id}`, config)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "toleranceType": result.toleranceType,
          "className": result.className,
          "materialTypesCode": result.materialTypesCode,
          "plantCode": Plant_Code,
          "companyCode": comapny_code,
          "minimumAlert": result.minimumAlert,
          "maximumAlert": result.maximumAlert,
          "materialMasterCode": result.materialMasterCode,
          "weightType": result.weightType,
          "status": result.status
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
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/tolerance-masters/${CurrentID}`, config)
      console.log(res.data);
      getAllDeviceData(Plant_Code);
      toast.success("Tolerance Deleted Successfully", { autoClose: 3000 });
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

  const toleranceTypeDD = [
    {
      options: [
        { label: "Select Type", value: "" },
        { label: "Weight", value: "Weight" },
        { label: "Range", value: "Range" },
      ],
    },
  ];

  const weightType = [
    {
      options: [
        { label: "TW", value: "TW" },
        { label: "GW", value: "GW" },
      ],
    },
  ];

  const authorise_approval = [
    {
      options: [
        { label: "Select Approval Type", value: "" },
        { label: "Level-1", value: "1" },
        { label: "Level-2", value: "2" },
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
        Header: "Tolerance Type",
        accessor: "toleranceType",
        filterable: false,
      },
      // {
      //   Header: "Class Name",
      //   accessor: "className",
      //   filterable: false,
      // },
      // {
      //   Header: "Plant Code",
      //   accessor: "plantCode",
      //   filterable: false,
      // },
      {
        Header: "Company Code",
        accessor: "companyCode",
        filterable: false,
      },
      {
        Header: "Min Tolerance",
        accessor: "minimumAlert",
        filterable: false,
      },
      {
        Header: "Max Tolerance",
        accessor: "maximumAlert",
        filterable: false,
      },
      {
        Header: "Material Code",
        accessor: "materialMasterCode",
        filterable: false,
      },
      {
        Header: "Material Type Code",
        accessor: "materialTypesCode",
        filterable: false,
      },
      {
        Header: "Weight Type",
        accessor: "weightType",
        filterable: false,
      },
      {
        Header: "Tolerance Lavel",
        accessor: "toleranceLevel",
        filterable: false,
        Cell: (cell) => {

          switch (cell.value) {
            case 1:
              return <span className="badge text-uppercase badge-soft-success"> Level-1 </span>;
            case 2:
              return <span className="badge text-uppercase badge-soft-danger"> Level-2 </span>;
          }
        }
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

  document.title = "Tolerance-Bag | EPLMS";
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
          <BreadCrumb title={'Tolerance Master Bag'} pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Tolerance Details</h5>
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
                          <i className="ri-add-line align-bottom me-1"></i> Add Tolerance
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
                      divClass="overflow-auto"
                      //tableClass="width-130"
                      handleCustomerClick={handleCustomerClicks}
                      //isCustomerFilter={true}
                      SearchPlaceholder='Search for Material Code or something...'
                    />
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Tolerance" : "Add Tolerance"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                      <ModalBody>
                        <Row className="g-3">
                          {/* <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Tolerance Type</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault03"
                              name="toleranceType"
                              placeholder="Enter Tolerance Type"
                              value={values.toleranceType}
                              onChange={handleInputChange}
                            />
                          </Col> */}
                          <Col lg={4}>
                              <div>
                                <Label className="form-label" >{`Tolerance Type  ${UOM}`}</Label>
                                <Input
                                  name="toleranceType"
                                  type="select"
                                  className="form-select"
                                  value={values.toleranceType}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value={""}>{"Select Tolerance Type"}</option>
                                  {ToleranceType.map((item, key) => (
                                      <option value={item.toleranceType} key={key} data-id={item.uom}>{item.toleranceType}</option>
                                  ))}
                                </Input>
                              </div>
                            </Col>
                          {/* <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Class Name</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="className"
                              placeholder="Enter Class Name"
                              value={values.className}
                              onChange={handleInputChange}
                            />
                          </Col> */}
                          
                          {/* <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Plant Code</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="plantCode"
                              placeholder="Enter Plant Code"
                              value={values.plantCode}
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
                          </Col> */}
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Min Tolerance</Label>
                            <Input type="number" required className="form-control"
                              id="validationDefault04"
                              name="minimumAlert"
                              placeholder="Enter Minimum Alert"
                              value={values.minimumAlert}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Max Tolerance</Label>
                            <Input type="number" required className="form-control"
                              id="validationDefault04"
                              name="maximumAlert"
                              placeholder="Enter Maximum Alert"
                              value={values.maximumAlert}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Material Code</Label>
                            <Input type="select" required className="form-control"
                              id="validationDefault04"
                              name="materialMasterCode"
                              placeholder="Enter Material Master Code"
                              value={values.materialMasterCode}
                              onChange={handleInputChange}
                              disabled = {isEdit ? true : false}
                            >
                              <option value={""}>{"Select Material Code"}</option>
                              {material.map((item, key) => (
                                <option value={item.code} key={key}>{`${item.code}/${item.name}`}</option>
                              ))}
                            </Input>
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Material Type Code</Label>
                            <Input type="select" required className="form-control"
                              id="validationDefault04"
                              name="materialTypesCode"
                              placeholder="Enter Material Type"
                              value={values.materialTypesCode}
                              onChange={handleInputChange}
                              disabled = {isEdit ? true : false}
                            >
                              <option value={""}>{"Select Material Type"}</option>
                              {MaterialType.map((item, key) => (
                                <option value={item.code} key={key}>{`${item.code}/${item.name}`}</option>
                              ))}
                            </Input>
                          </Col>
                          <Col lg={4}>
                              <div>
                                <Label className="form-label" >Weight Type</Label>
                                <Input
                                  name="weightType"
                                  type="select"
                                  className="form-select"
                                  value={values.weightType}
                                  onChange={handleInputChange}
                                  required
                                >
                                  {weightType.map((item, key) => (
                                    <React.Fragment key={key}>
                                      {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                    </React.Fragment>
                                  ))}
                                </Input>
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div>
                                <Label className="form-label" >Tolerance Lavel</Label>
                                <Input
                                  name="toleranceLevel"
                                  type="select"
                                  className="form-select"
                                  value={values.toleranceLevel}
                                  onChange={handleInputChange}
                                  required
                                  disabled={isEdit ? true : false}
                                >
                                  {authorise_approval.map((item, key) => (
                                    <React.Fragment key={key}>
                                      {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                    </React.Fragment>
                                  ))}
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
                        </Row>
                        <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                          <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                          <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Tolerance"} </button>
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

export default MasterTolerance;
