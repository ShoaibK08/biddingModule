import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../MasterStage/Stage.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";

const MasterVehicleTagMap = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [tagMaps, setTagMaps] = useState([]);
  const [locations, setLocations] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState([]);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [Plant_Code, setPlantCode] = useState('');
  const [comapny_code, setCompanyCode] = useState('');
  const [latestHeader, setLatestHeader] = useState('');

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  const [product_quantity, setproduct_quantity] = useState([]);

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
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicles?plantCode=${plantcode}`, config)
      .then(res => {
        const ts = [];
        const tagMap1 = res;
        tagMap1.map(function (value, index) {
          // console.log(value);
          const ts1 = {};
          ts1["title"] = value.registrationNumber;
          ts.push(ts1);
        });
        setproduct_quantity(ts);
      });
    const tsp = [
      {
        "title": "test1",
        "title": "test2",
        "title": "test3",
      }
    ];
    setproduct_quantity(tsp);
    getAllMappingData(plantcode);
    getAllLocationData(plantcode);
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


  console.log(product_quantity);

  const getAllMappingData = (plantcode) => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicle-tag-mappings?plantCode=${plantcode}`, config)
      .then(res => {
        const tagMap = res;
        setTagMaps(tagMap);
      });
  }

  const getAllLocationData = (plantcode) => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicle-tag-mappings/locationforDesktopReader?plantCode=${plantcode}`, config)
      .then(res => {
        const locations = res;
        if(res.errorMsg){
          setLocations([]);
        }else{
          setLocations(locations);
        }
        
      });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
    });
  };

  const [showError, setErrorMsg] = useState(false);
  const [showError1, setError1Msg] = useState(false);

  const [input, setInput] = useState([]);
  const [ProductQuantity, setProductQuantity] = useState([]);
  const [ProductQuantity1, setProductQuantity1] = useState('');
  const [vehicleProperty, setVehicleProperty] = useState(0);
  // const product_quantity = [];
  useEffect(() => {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    if (vehicleProperty === 0) {
      axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicles?plantCode=${plantcode}`, config)
        .then(res => {
          setProductQuantity(res);
          setVehicleProperty(1);
        });
    }
  });

  /*
    const handleSubmit = async (e) => {
      
      console.log(values)
      e.preventDefault();
      try {
        if (isEdit) {
          const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicle-tag-mappings/${CurrentID}`, values)
          console.log(res);
          toast.success("Mapping Updated Successfully", { autoClose: 3000 });
          getAllMappingData();
        }
        else {
          const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicle-tag-mappings`, values)
          console.log(res);
          if (!res.errorMsg) {
            toast.success("Mapping Added Successfully.", { autoClose: 3000 });
          }
          else {
            toast.error("Data Already Exist.", { autoClose: 3000 });
          }
          getAllMappingData();
        }
      }
      catch (e) {
        toast.error("Something went wrong!", { autoClose: 3000 });
      }
      toggle();
    };
  */
  const [tagMappingData, setTagMappingData] = useState('');
  const [disabledSet, setdisabledSet] = useState("none");
  const [disabledSet1, setdisabledSet1] = useState("none");

  const getFetchTagData = () => {
    //e.preventDefault();

    //document.getElementById("tag-id-manual").setAttribute("disabled",false);
    const values1 = {};
    const selectElement = document.querySelector('#locationId');
    const output = selectElement.value;
    values1["code"] = output;
    values1["message"] = "GET";
    document.getElementById("tag-id-manual").value = "test";
    setTagMappingData("test");
    setdisabledSet1("block");
    axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicle-tag-mappings/getCurrentTag`, values1, config)
      .then(res1 => {
        //alert(res1.tagNumber);
        if (res1.tagNumber !== "") {
          document.getElementById("tag-id-manual").value = res1.tagNumber;
          setTagMappingData(res1.tagNumber);
          setdisabledSet1("block");
          // document.getElementById("tag-id-manual").setAttribute("disabled",false);
        }

      });
  };

  // Add Data
  const handleCustomerClicks = () => {
    setIsEdit(false);
    toggle();
  };
  // Update Data
  const handleCustomerClick = useCallback((arg) => {

    setClickedRowId(arg);
    setdisabledSet("block");
    setIsEdit(true);
    toggle();
    const id = arg;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicle-tag-mappings/${id}`, config)
      .then(res => {
        const result = res;
        setProductQuantity1(result.vehicleNumber);
        setValues({
          ...values,
          "vehicleNumber": result.vehicleNumber,
          "tagId": result.tagId,
          "status": result.status,
          "id": id
        });
      })

  }, [toggle]);

  const getCurrentData = () => {
    const selectElement = document.querySelector('#locationId');
    //alert(selectElement)
    if (selectElement === null) {
      setdisabledSet("none");
    } else {
      const output = selectElement.value;
      if (output === "") {
        removeTagId();
        toast.error("Please Select Location", { autoClose: 3000 });
        setdisabledSet("none");
        setProductQuantity1('');
      } else {
        removeTagId();
        setdisabledSet("block");
        setProductQuantity1('');
      }
    }
  };

  const removeTagId = () => {
    document.querySelector("#tag-id-manual").value = "";
    setTagMappingData(undefined);
    setdisabledSet1("none");
    //alert(document.querySelector("#tag-id-manual").value);
    //alert(tagMappingData);
  }
  // Delete Data
  const onClickDelete = (id) => {
    setClickedRowId(id);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicle-tag-mappings/${CurrentID}`, config)
      console.log(res.data);
      getAllMappingData(Plant_Code);
      toast.success("Mapping Deleted Successfully", { autoClose: 3000 });
      setDeleteModal(false);
    } catch (e) {
      toast.error("Something went wrong!", { autoClose: 3000 });
      setDeleteModal(false);
    }
  };
  /*
    
    const product_quantity = [
      { title: "100", year: 1994 },
      { title: "1000", year: 1972 },
      { title: "2000", year: 1974 },
      { title: "3000", year: 2008 },
      { title: "4000", year: 1957 },
      { title: "5000", year: 1957 },
    ];
  */
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      vehicleNumber: (values && values.vehicleNumber) || '',
      tagId: (tagMappingData !== '' ? tagMappingData : values.tagId),
      // vehicleNumber: (ProductQuantity1 !== '' ? ProductQuantity1 : values.vehicleNumber),
      // tagId: (values && values.tagId) || '',
    },
    validationSchema: Yup.object({
      vehicleNumber: Yup.string().required("Please Enter Vehicle Number"),
      tagId: Yup.string().required("Please Enter Tag Id"),
    }),
    onSubmit: (values) => {
      console.log(values);
      if (isEdit) {
        const res = axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicle-tag-mappings/${CurrentID}`, values, config)
        console.log(res);
        toast.success("Mapping Updated Successfully", { autoClose: 3000 });
        validation.resetForm();
        setTimeout(function () { getAllMappingData(Plant_Code); }, 2000);
      }
      else {
        values['status'] = 'A';
        const res = axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicle-tag-mappings`, values, config)
        if (!res.errorMsg) {
          toast.success("Mapping Added Successfully.", { autoClose: 3000 });
          validation.resetForm();
        }
        else {
          toast.error("Data Already Exist.", { autoClose: 3000 });
        }
        validation.resetForm();
        setTimeout(function () { getAllMappingData(Plant_Code); }, 2000);
      }
      toggle();
      setTimeout(function () { getAllMappingData(Plant_Code); }, 2000);
    },
  });

  console.log(locations);

  const onTagsChange = (event, values) => {
    //alert("test");
    console.log("values", values);
    console.log("event", event);
    // alert(values.title);
    if (values) {
      setProductQuantity1(values.title);
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
        Header: "Vehicle Number",
        accessor: "vehicleNumber",
        filterable: false,
      },
      {
        Header: "Tag Id",
        accessor: "tagId",
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
      // {
      //   Header: "Action",
      //   Cell: (cellProps) => {
      //     return (
      //       <ul className="list-inline hstack gap-2 mb-0">
      //         {/* <li className="list-inline-item edit" title="Edit">
      //           <Link
      //             to="#"
      //             className="text-primary d-inline-block edit-item-btn"
      //             onClick={() => { const id = cellProps.row.original.id; handleCustomerClick(id); }}
      //           >

      //             <i className="ri-pencil-fill fs-16"></i>
      //           </Link>
      //         </li> */}
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

  document.title = "Vehicle Tag Mapping | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={tagMaps}
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
                        <h5 className="card-title mb-0 bg-light">Vehicle Tag Mapping Details</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>

                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); getCurrentData(); toggle(); setValues([]); /*setdisabledSet(true);*/ }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add Vehicle Tag Mapping
                        </button>{" "}

                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    {tagMaps && tagMaps.length ? (
                      <TableContainer
                        columns={columns}
                        data={tagMaps}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        //isCustomerFilter={true}
                        SearchPlaceholder='Search for vehicle number,tag or something...'
                      />) : (<Loader />)
                    }
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit" : "Vehicle Tag Mapping"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }} autoComplete="off">
                      <ModalBody>
                        <Row className="g-3">
                          {!!isEdit ? '' :
                            <Col md={4}>
                              <Label htmlFor="validationDefault03" className="form-label"> Select Location  </Label>
                              <Input type="select" className="form-select"
                                name="locationId"
                                onChange={getCurrentData}
                                id="locationId"
                                placeholder="Select Location"
                              >
                                <option value="">Select</option>
                                {locations.map((data, key) => (
                                  <option value={data.id} key={key}>{data.locationName}</option>
                                ))
                                }
                              </Input>
                            </Col>}
                        </Row>
                        <Row className="g-3 mt-3 border border-dashed border-end-0 border-start-0" style={{ "display": (disabledSet === "block") ? "flex" : "none" }}>

                          <Col md={4} style={{ "display": disabledSet }}>
                            <Label htmlFor="validationDefault03" className="form-label">Tag Id
                            </Label>
                            <Input type="text" className="form-control"
                              id="tag-id-manual"
                              name="tagId"
                              placeholder="Enter Tag Id"
                              readOnly={true}
                              validate={{ required: { value: true }, }}
                              onChange={(e, value) => {
                                validation.setFieldValue("tagId", e.target.value)
                              }}
                              onBlur={(e, value) => {
                                validation.setFieldValue("tagId", e.target.value)
                              }}
                              value={validation.values.tagId || ''}
                              invalid={validation.touched.tagId && validation.errors.tagId ? true : false}

                            />
                            {validation.touched.tagId && validation.errors.tagId ? (
                              <FormFeedback type="invalid">{validation.errors.tagId}</FormFeedback>
                            ) : null}
                          </Col>
                          <Col sm={4} style={{ "display": disabledSet1 }}>
                            <div className="mb-3">
                              <Label
                                htmlFor="billinginfo-lastName"
                                className="form-label"
                              >
                                Vehicle Number
                              </Label>
                              <Autocomplete style={{ marginTop: '-15px' }}
                                options={(product_quantity.length > 0) ? product_quantity : []} // part of state that holds Autocomplete options
                                getOptionLabel={(option) => option.title || ''}
                                //value={validation.values.vehicleNumber || ''} // the part of state what holds the user input
                                //onChange={ (_, value) => validation.values.setFieldValue("vehicleNumber", value) }
                                onChange={(e, value) => validation.setFieldValue("vehicleNumber", value?.title || "")}
                                onOpen={validation.handleBlur}//onBlur={ () => validation.values.setTouched({ ["vehicleNumber"]: true }) }
                                disableClearable={false}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    name="vehicleNumber"
                                    id="vehicleNumber"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    placeholder="Select Vehicle"
                                    size="small"
                                    style={{ fontSize: 10 }}
                                    error={Boolean(validation.touched.vehicleNumber && validation.errors.vehicleNumber)}
                                    helperText={validation.touched.vehicleNumber && validation.errors.vehicleNumber}
                                  />
                                )}
                              />
                              {/**<Autocomplete style={{ marginTop: '-15px' }}
                                //multiple
                                // freeSolo
                                options={product_quantity}
                                getOptionLabel={option => option.title || option}
                                onInput={onTagsChange}
                                onChange={onTagsChange}
                                value={(ProductQuantity1 !== '' ? ProductQuantity1 : '')}
                                //onBlur={validation.handleBlur}
                                //value={(ProductQuantity1 !== '' ? ProductQuantity1 : validation.values.vehicleNumber)}
                                disableClearable={false}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Select Vehicle"
                                    margin="normal"                               
                                    name="vehicleNumber"
                                    fullWidth
                                    size="small"
                                    style={{ fontSize: 10 }}
                                  />
                                )}
                              />
                               */}
                            </div>
                          </Col>

                          {!!isEdit ?
                            <Col lg={4} style={{ "display": disabledSet }}>
                              <div>
                                <Label className="form-label">Status</Label>
                                <Input
                                  name="status"
                                  type="select"
                                  className="form-select"
                                  value={values.status}
                                >
                                  {status.map((item, key) => (
                                    <React.Fragment key={key}>
                                      {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                    </React.Fragment>
                                  ))}
                                </Input>
                              </div>
                            </Col>
                            : <Col lg={4}></Col>}
                        </Row>

                      </ModalBody>
                      <ModalFooter>
                        <Col md={6} className="hstack gap-2 justify-content-end">
                          {!!isEdit ? '' : <a class="btn btn-danger" onClick={() => { removeTagId(); }} style={{ "display": disabledSet }}>Clear Tag</a>}
                          {!!isEdit ? '' : <a class="btn btn-warning" onClick={getFetchTagData} style={{ "display": disabledSet }}>Fetch Tag</a>}
                          <button type="submit" className="btn btn-success" style={{ "display": disabledSet }}> {!!isEdit ? "Update" : "Map Tag"} </button>
                          {/* <button type="button" className="btn btn-light" style={{ "display": disabledSet }} onClick={toggle}> Close </button> */}
                        </Col>
                      </ModalFooter>

                    </Form>
                    <ModalFooter>
                      <Col lg={4}>

                      </Col>
                    </ModalFooter>
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

export default MasterVehicleTagMap;
