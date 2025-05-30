import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Modal,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  FormFeedback
} from "reactstrap";

import { Link,useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { isEmpty } from "lodash";
import * as moment from "moment";
import axios from "axios";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";

import {
  addNewRaiseIndent1 as onRaiseIndent,
  getTransporters as onGetTransporters,
  updateCustomer1 as onUpdateCustomer,
} from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";

const MasterJBPMRaiseIndex = () => {
  const dispatch = useDispatch();
  const history = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const [raiseIndent, setTransporter] = useState([]);

  const [modal, setModal] = useState(false);

  
  const [customerList, setCustomerList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [customerType, setCustomerType] = useState([]);
  const [shipType, setShipType] = useState('');
  const [payerType, setPayerType] = useState('');
  const [displaySet, setDisplaySet] = useState('block');
  const [radioSet, setRadioSet] = useState('none');
  const [displaySet2, setDisplaySet2] = useState('block');

  
  const { transporters } = useSelector((state) => ({
    transporters: state.Master.transporters,
  }));

  
  
  const dateFormat = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
  };

  const dateFormatApi = (e) => {
    let d = e.toString().split(" "),
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getFullYear() + '-' + months[d.getMonth()] + ', ' + d.getDate()).toString());
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
  };

  useEffect(() => {
    if (transporters && !transporters.length) {
      dispatch(onGetTransporters());
    }
  }, [dispatch, transporters]);

  useEffect(() => {
    if (customerList && !customerList.length) {
    axios.get("http://localhost:8043/sapModule/sap/getAll")
    .then(res => {
      setCustomerList(res);
    })
    .catch(err => {
      console.log(err);
    });
  }

  if (productList && !productList.length) {
    axios.get("http://localhost:8043/sapModule/getProductByCustomer",{ params:  { "customerCode": "CU000091"}})
    .then(res => {
      setProductList(res);
    })
    .catch(err => {
      console.log(err);
    });
  }

  if(!customerType.length && customerType){
    axios.get(`${process.env.REACT_APP_LOCAL_URL}/userModule/users/userData`,{ params:  { "userCode": "CU000091"}} )
    .then(res => {
      setCustomerType(res.message[0].soldtoparty);
      setShipType(res.message[0].shiping_type);
      if(res.message[0].shiping_type === 'XMI'){
        setRadioSet('block');
        setDisplaySet('none');
        setDisplaySet2('none');
      }
      if(res.message[0].shiping_type === 'DEO'){
        setDisplaySet('none');
        setDisplaySet2('none');
        setRadioSet('none');
      }
      setPayerType(res.message[0].firstname+" "+res.message[0].lastname);
    })
    .catch(err => {
      console.log(err);
    });
  }
    
  });

  const refreshTransporter = () => {
    var select = document.getElementById('transporter_id');
    select.value= '';
  };
  
  const handleSelectTransporter = (event) =>{
    const index = event.target.selectedIndex;
    const optionElement = event.target.childNodes[index];
    const transporter_name = document.getElementById("transporter_name");
    const transporter_code = optionElement.getAttribute('value');
    transporter_name.value = transporter_code;
  };
  
  const handleSelectRadio = (event) =>{
    var index = event.target.value;
    if(index === "trans"){
      setDisplaySet("none");
      setDisplaySet2("block");
    }
    if(index === "other"){
      setDisplaySet("block");
      setDisplaySet2("none");
      
    }
    console.log(index);
  };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setTransporter(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      material_name_indent: "",
      sold_to_party: "",
      unit_of_measurement: "",
      shipment_type: "",
    },
    validationSchema: Yup.object({
      material_name_indent: Yup.string().required("please select material"),
      sold_to_party: Yup.string().required("please select sold to party"),
      unit_of_measurement: Yup.string().required("please enter unit of measurement"),
      shipment_type: Yup.string().required("please enter shipment type"),
    }),
    onSubmit: (values) => {
        console.log("submit")
        const newIndent = 
            {
              "product":  values['material_name_indent'],
              "customer_code" : values['sold_to_party'],
              "indentStatus" : "statusOfIndent",
              "customerType" : "CustomerType",
              "unitMeasurement" : "90",
              "vehicleNumber" : "mh12PA8138"
            };
        dispatch(onRaiseIndent(newIndent));
        window.location.href = "/indexing";
        validation.resetForm();
    }
  });

  document.title = "Raise Indent | Nayara - React Admin & Dashboard Template";
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Raise Indent" pageTitle="JBPM" />

        <Row>
          <Col lg={12}>
            <Form 
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}>
              <Card>
                <CardBody>
                <Row className="g-3">
                  <Col lg={3}>
                  <div>
                      <Label
                        className="form-label"
                        htmlFor="date-material"
                      >
                        Material Required Date <span style={{color:"red"}}></span>                           
                      </Label>
                      <Flatpickr
                        name="product_required_date"
                        className="form-control"
                        id="date-material"
                        placeholder="Enter Product Required Date"
                        options={{
                          altInput: true,
                          altFormat: "d M, Y",
                          dateFormat: "d M, Y",
                        }}
                        onChange={(e) =>
                          dateformate(e)
                        }
                        
                      />
                    </div>
                  </Col>
                  <Col lg={3}>
                  <div>
                      <Label
                        className="form-label"
                      >
                        Payer Name  <span style={{color:"red"}}>*</span>                            
                      </Label>
                      <Input
                        name="payer_name"
                        className="form-control"
                        placeholder="Enter Payer Name"
                        type="text"
                        value={payerType}
                        
                      />
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div>
                      <Label
                        // htmlFor="customername-field"
                        className="form-label"
                      >
                        Sold To Party <span style={{color:"red"}}>*</span>
                      </Label>
                      <Input
                        name="sold_to_party"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        placeholder="Select sold to party"
                        invalid={validation.errors.sold_to_party && validation.touched.sold_to_party ? true : false}
                      >                            
                          <React.Fragment >
                            <option value="">select sold to party</option>
                            {customerType.map((item, key) => (<option value={item.customer_code} key={key}>{item.firstname+" "+item.lastname}</option>))}
                          </React.Fragment>                            
                      </Input>
                      {validation.errors.sold_to_party && validation.touched.sold_to_party ? (
                        <FormFeedback type="invalid">{validation.errors.sold_to_party}</FormFeedback>
                      ) : null}
                    </div>
                    </Col>

                    <Col lg={3}>
                    <div>
                      <Label
                        //htmlFor="customername-field"
                        className="form-label"
                      >
                        Material <span style={{color:"red"}}>*</span>                       </Label>
                      <Input
                        name="material_name_indent"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        placeholder="Select Product"
                        invalid={validation.errors.material_name_indent && validation.touched.material_name_indent ? true : false}
                      >
                          <React.Fragment>
                          <option value="">select material</option>
                            {productList.map((item, key) => (<option value={item.material_code} key={key}>{item.material_name}</option>))}
                          </React.Fragment>
                      </Input>
                      {validation.errors.material_name_indent && validation.touched.material_name_indent ? (
                        <FormFeedback type="invalid">{validation.errors.material_name_indent}</FormFeedback>
                      ) : null}
                    </div>
                    </Col>
                    <Col lg={3}>
                  <div>
                      <Label
                        className="form-label"
                      >
                        Ship To Party <span style={{color:"red"}}>*</span>                         
                      </Label>
                      <Input
                        name="ship_to_party"
                        className="form-control"
                        placeholder="Enter Shipment Type"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={shipType}
                       
                      />
                    </div>
                  </Col>
                    
                  <Col lg={3}>
                  <div>
                      <Label
                        className="form-label"
                      >
                        Shipment Type <span style={{color:"red"}}>*</span>                           
                      </Label>
                      <Input
                        name="shipment_type"
                        className="form-control"
                        placeholder="Enter Shipment Type"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={validation.errors.shipment_type && validation.touched.shipment_type ? true : false}
                        type="text"

                        
                        
                      />
                      {validation.errors.shipment_type && validation.touched.shipment_type ? (
                        <FormFeedback type="invalid">{validation.errors.shipment_type}</FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={3}>
                  <div>
                      <Label
                        className="form-label"
                      >
                        Unit Of Measurement <span style={{color:"red"}}>*</span>                          
                      </Label>
                      <Input
                        name="unit_of_measurement"
                        className="form-control"
                        placeholder="Enter Unit Of Measurement"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={validation.errors.unit_of_measurement && validation.touched.unit_of_measurement ? true : false}
                        type="text"
                        
                      />
                      {validation.errors.unit_of_measurement && validation.touched.unit_of_measurement ? (
                        <FormFeedback type="invalid">{validation.errors.unit_of_measurement}</FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={3} style={{display:radioSet}}>
                  <div>
                      <Label
                        className="form-label"
                      >
                      <Input
                        name="trans_radio"
                        type="radio"
                        value="trans"
                        onClick={handleSelectRadio}
                      /> Transporter  
                      <Input
                        name="trans_radio"
                        type="radio"
                        value="other"
                        onClick={handleSelectRadio}
                      /> Other 
                      </Label>
                    </div>
                  </Col>
                  <Col lg={3} style={{display:displaySet}}>
                  <div>
                      <Label
                        className="form-label"
                      >
                        Vehicle No                             
                      </Label>
                      <Input
                        name="vehicle_no"
                        className="form-control"
                        placeholder="Enter Vehicle Number"
                        type="text"
                        
                      />
                    </div>
                  </Col>
                  <Col lg={3} style={{display:displaySet2}}>
                  <div>
                      <Label
                        className="form-label"
                      >
                        Transporter ID                            
                      </Label>
                      <Input
                        name="transporter_id"
                        type="select"
                        className="form-select"
                        id="transporter_id"
                        onChange={handleSelectTransporter}
                        placeholder="Select Transporter Code"
                      >
                          <React.Fragment>
                          <option value="">select transporter code</option>
                            {transporters.map((item, key) => (<option data-code={item.transporter_code} value={item.firstname+" "+item.lastname} key={key}>{item.transporter_code} - {item.firstname+" "+item.lastname}</option>))}
                          </React.Fragment>
                      </Input>
                    </div>
                  </Col>
                  <Col lg={3} style={{display:displaySet2}}>
                  <div>
                      <Label
                        className="form-label"
                      >
                        Transporter Name                            
                      </Label>
                      <Input
                        name="transporter_name"
                        className="form-control"
                        placeholder="Enter Transporter Name"
                        type="text"   
                        onKeyUp={refreshTransporter}
                        id="transporter_name"                     
                      />
                    </div>
                  </Col>
                  <Col lg={3} style={{display:displaySet}}>
                  <div>
                      <Label
                        className="form-label"
                      >
                        LR Number                         
                      </Label>
                      <Input
                        name="lr_number"
                        className="form-control"
                        placeholder="Enter LR Number"
                        type="text"
                        
                      />
                    </div>
                  </Col>
                  <Col lg={3} style={{display:displaySet}}>
                  <div>
                      <Label
                        className="form-label"
                      >
                        LR Date                         
                      </Label>
                      <Flatpickr
                        name="lr_date"
                        className="form-control"
                        placeholder="Enter LR Date"
                        type="text"
                        options={{
                          altInput: true,
                          altFormat: "d M, Y",
                          dateFormat: "d M, Y",
                        }}
                        onChange={(e) =>
                          dateformate(e)
                        }
                        
                      />
                    </div>
                  </Col>
                  <Col lg={3} style={{display:displaySet}}>
                  <div>
                      <Label
                        className="form-label"
                      >
                        TT Calibrated Capacity                         
                      </Label>
                      <Input
                        name="tt_calibrated_capacity"
                        className="form-control"
                        placeholder="Enter TT Calibrated Capacity"
                        type="text"
                        
                      />
                    </div>
                  </Col>
                  </Row>
                </CardBody>
              </Card>
              
              <div className="text-end mb-3">
                <button type="submit" className="btn btn-success w-sm">
                Raise Indent
                </button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MasterJBPMRaiseIndex;
