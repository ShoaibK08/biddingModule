import React, { useState,useEffect } from "react";
import Select,{components} from "react-select";
//Import Breadcrumb
import chroma from 'chroma-js';
import BreadCrumb from "../../Components/Common/BreadCrumb";

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Label,
  Input,
} from "reactstrap";

import classnames from "classnames";
import Dropzone from "react-dropzone";
import { orderSummary } from "../../common/data/ecommerce";
import { Link } from "react-router-dom";
import { registerPlugin } from "react-filepond";
import { useFormik,Formik,ErrorMessage, Field, Form } from "formik";
import * as yup from "yup";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { useDispatch,useSelector } from "react-redux";
import { addNewProduct as onAddNewProduct, updateProduct as onUpdateProduct } from "../../store/ecommerce/action";

//Import actions
import {
  getLeads as onGetLeads,
  getTodos as onGetTodos,
} from "../../store/actions";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EcommerceCheckout = () => {
  const [selectedCountry, setselectedCountry] = useState(null);
  const [selectedState, setselectedState] = useState(null);
  const [activeTab, setactiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);
  const [modal, setModal] = useState(false);
  const [selectedFiles, setselectedFiles] = useState([]);
  const [deletemodal, setDeleteModal] = useState(false);
  const [selectedVisibility, setselectedVisibility] = useState(null);
  const [selectedStatus, setselectedStatus] = useState(null);
  const [selectedCover, setselectedCover] = useState(null);

  const dispatch = useDispatch();
  
  const { leads,todos } = useSelector((state) => ({
    leads: state.Crm.leads,
    todos: state.Todos.todos,
  }));

  const toggledeletemodal = () => {
    setDeleteModal(!deletemodal);
  };

  const togglemodal = () => {
    setModal(!modal);
  };

  function handleSelectCountry(selectedCountry) {
    setselectedCountry(selectedCountry);
  }

  function handleSelectState(selectedState) {
    setselectedState(selectedState);
  }

  const productVisibility = [
    {
      options: [
        { label: "Hidden", value: 1 },
        { label: "Public", value: 2 },
      ],
    },
  ];
  
  useEffect(() => {
    if (leads && !leads.length) {
      dispatch(onGetLeads());
    }
  }, [dispatch, leads]);

  useEffect(() => {
    if (todos && !todos.length) {
      dispatch(onGetTodos());
    }
  }, [dispatch, todos]);

  
  /**
   * Formats the size
   */
  
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }


  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    //setselectedFiles(...files);
    setselectedFiles(prev => [...prev, ...files]);
  }

  
  const handleSelectVisibility = (visible) => {
   // console.log(visible.value)
    setselectedVisibility(visible.value);
  }

  const handleStatus = (status) => {
    setselectedStatus(status.value);
  }

  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];

      if (tab >= 1 && tab <= 4) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }

  
const options = [
  { value: "Abe", label: "Abe", customAbbreviation: "A" ,color : "pink" },
  { value: "John", label: "John", customAbbreviation: "J" ,color : "orange"},
  { value: "Dustin", label: "Dustin", customAbbreviation: "D" ,color : "red"},
  { value: "Dustin1", label: "Dustin", customAbbreviation: "D" ,color : "yellow"},
  { value: "Dustin2", label: "Dustin", customAbbreviation: "D" ,color : "blue"},
  { value: "Dustin3", label: "Dustin", customAbbreviation: "D" ,color : "purple"},
  { value: "Dustin4", label: "Dustin", customAbbreviation: "D" ,color : "green"},
  { value: "Dustin5", label: "Dustin", customAbbreviation: "D" ,color : "cyan"},
];

const colourStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : color.alpha(0.3).css()
          : undefined,
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
};

const removeFile = (f) => () => {
  const s = selectedFiles.filter((item, index) => index !== f);
  setselectedFiles(s);
}

  const [tag, setTag] = useState([]);
  const [assignTag, setAssignTag] = useState([]);

  const handlestag = (tags) => {
    setTag(tags);
    const assigned = tags.map((item) => item.value);
    setAssignTag(assigned);
  };

  const optionList = [];
  for (const todo of Object.keys(todos)) {
   // console.log(todos)
    const emp ={};
    emp['value'] = todos[todo]._id;
    emp['label'] = todos[todo].tagName;
    emp['color'] = todos[todo].color === 'black' ? "#000" : "#"+todos[todo].color;
    optionList.push(emp);
  }

 // console.log(optionList)
  
  const productStatus = [
    {
      options: [
        { label: "Draft", value: 1 },
        { label: "Published", value: 2 },
        { label: "Scheduled", value: 3 },
      ],
    },
  ];

  /*
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      material_name: "",
      material_code: ""
    },
    validationSchema: Yup.object({
      material_name: Yup.string().required("Please Enter a Material Name"),
      material_code: Yup.string().required("Please Enter a Material Code"),
    }),
    onSubmit: (values) => {
      const newProduct = {
        _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
        material_name: values.material_name,
      };

      console.log("cover img ",selectedFiles);
      console.log("cover img 1",selectedCover);

      

      const formData = new FormData();
      for (const selectedFile of Object.keys(selectedFiles)) {
        formData.append('materialImages', selectedFiles[selectedFile])
      }
      formData.append('material_name', values.material_name);
      formData.append('material_code', values.material_code);
      formData.append('vat_gst', 1);
      formData.append('quota_management', values.material_name);
      formData.append('material_uom', 1);
      formData.append('material_desc', values.material_name);
      formData.append('status', 2);
      formData.append('vehicle_type', values.material_name);
      formData.append('vehicle_document', values.material_name);
      formData.append('visibility', 2);
      formData.append('material_category', 'solid');
      formData.append('tagId', 2);      
      // save new product
      dispatch(onAddNewProduct(formData));
      validation.resetForm();
    }
  });
*/


  const renderError = (message) => (
    <p className="italic text-red-600" style={{color:"red"}}>{message}</p>
  );

  const productCountry = [
    {
      options: [
        { label: "Select Country...", value: "Select Country" },
        { label: "United States", value: "United States" },
      ],
    },
  ];

  const ValidationSchema = yup.object().shape({
    material_name: yup.string().required("Please Enter a Material Name"),
    material_code: yup.string().required("Please Enter a Material Code"),
  });

  const ValidationSchema1 = yup.object().shape({
    tax_name: yup.string().required("Please Enter a Tax Name"),
    quota_management: yup.string().required("Please Enter a Quota Management"),
    material_doc: yup.string().required("Please Enter a Material Doc"),
    unit_of_measurement: yup.string().required("Please Enter a Unit Of Measurement"),
    vehicle_type: yup.string().required("Please Enter a Vehicle type"),
    //category_id: yup.string().required("Please Enter a Vehicle type"),
  });

  document.title = "Material | Nayara - React Admin & Dashboard Template";

  const formData = [];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Add Material" pageTitle="Master" />

          <Row> 
            <Col xl="12">
              <Card>
                <CardBody className="checkout-tab">
                    <div className="step-arrow-nav mt-n3 mx-n3 mb-3">
                      <Nav
                        className="nav-pills nav-justified custom-nav"
                        role="tablist"
                      >
                        <NavItem role="presentation">
                          <NavLink href="#"
                            className={classnames({ active: activeTab === 1, done: (activeTab <= 4 && activeTab >= 0) }, "p-3 fs-15")}
                          >
                            <i className="ri-user-2-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                            Basic Info
                          </NavLink>
                        </NavItem>
                        <NavItem role="presentation">
                          <NavLink href="#"
                            className={classnames({ active: activeTab === 2, done: activeTab <= 4 && activeTab > 1 }, "p-3 fs-15")}
                          >
                            <i className="ri-truck-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                            Documents
                          </NavLink>
                        </NavItem>
                        <NavItem role="presentation">
                          <NavLink href="#"
                            className={classnames({ active: activeTab === 3, done: activeTab <= 4 && activeTab > 2 }, "p-3 fs-15")}
                          >
                            <i className="ri-bank-card-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                            Other Info
                          </NavLink>
                        </NavItem>
                        <NavItem role="presentation">
                          <NavLink href="#"
                            className={classnames({ active: activeTab === 4, done: activeTab <= 4 && activeTab > 3 }, "p-3 fs-15")}
                          >
                            <i className="ri-checkbox-circle-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                            Finish
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>

                    <TabContent activeTab={activeTab}>
                      <TabPane tabId={1} id="pills-bill-info">
                        <div>
                          <h5 className="mb-1">Basic Information</h5>
                          <p className="text-muted mb-4">
                            Please fill all information below
                          </p>
                        </div>
                        <Formik
                          initialValues={{
                            material_name: "",
                            material_code: "",
                          }}
                          validationSchema={ValidationSchema}
                          onSubmit={(values) => {
                            
                            //alert("dfff")
                           // alert(selectedStatus)
                          //  const data = { ...formData, ...values };
                           sessionStorage.setItem('material_name',values.material_name);
                           sessionStorage.setItem('material_code',values.material_code);
                           sessionStorage.setItem('status',selectedStatus);
                           sessionStorage.setItem('visibility',selectedVisibility);
                          // console.log(sessionStorage.getItem('material_name'));
                            toggleTab(2);
                          }}
                        >
                          <Form autoComplete="off">
                        <div>
                          <Row>
                            <Col sm={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="billinginfo-firstName"
                                  className="form-label"
                                >
                                  Material Name
                                </Label>
                                <Field
                                  type="text"
                                  className="form-control"
                                  name="material_name"
                                  id="billinginfo-firstName"
                                  placeholder="Enter material name"
                                />
                                <ErrorMessage name="material_name" render={renderError} />
                              </div>
                              
                            </Col>

                            <Col sm={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="billinginfo-lastName"
                                  className="form-label"
                                >
                                  Material Code
                                </Label>
                                <Field
                                  type="text"
                                  className="form-control"
                                  id="billinginfo-lastName"
                                  name="material_code"
                                  placeholder="Enter material code"
                                />
                                <ErrorMessage name="material_code" render={renderError} />
                              </div>
                              
                            </Col>
                            <Col sm={6}>

                              <div className="mb-3">
                              <Label
                                htmlFor="choices-publish-status-input"
                                className="form-label"
                              >
                                Status
                              </Label>
                              <Select
                                name="status"
                                classNamePrefix="select2-selection form-select"
                                id="choices-publish-status-input"
                                //value={selectedStatus}
                                onChange={handleStatus}
                                options={productStatus}
                              />
                            </div>
                          </Col>
                          <Col >
                        <div>
                          <Label
                            htmlFor="choices-publish-visibility-input"
                            className="form-label"
                          >
                            Visibility
                          </Label>

                          <Select
                            //value={selectedVisibility}
                            onChange={handleSelectVisibility}
                            options={productVisibility}
                            name="visibility"
                            classNamePrefix="select2-selection form-select"
                          />
                        </div>

                        </Col>
                        </Row>

                          <div className="d-flex align-items-start gap-3 mt-3">
                            <button
                              type="submit"
                              className="btn btn-primary add-new-css btn-label right ms-auto nexttab"
                            >
                              <i className="ri-truck-line label-icon align-middle fs-16 ms-2"></i>
                              Proceed to Document Info
                            </button>
                          </div>
                        </div>
                        </Form>
                        </Formik>
                      </TabPane>

                      <TabPane tabId={2}>
                        <div>
                          <h5 className="mb-1">Document Information</h5>
                          <p className="text-muted mb-4">
                            Please fill all information below
                          </p>
                        </div>
                        
                        <div className="mb-4">
                        
                              <Dropzone
                                onDrop={(acceptedFiles) => {
                                  handleAcceptedFiles(acceptedFiles);
                                }}
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <div className="dropzone dz-clickable">
                                    <div
                                      className="dz-message needsclick"
                                      {...getRootProps()}
                                    >
                                      <div className="mb-3">
                                        <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                      </div>
                                      <h5>Drop files here or click to upload.</h5>
                                    </div>
                                  </div>
                                )}
                              </Dropzone>
                              <div className="list-unstyled mb-0" id="dropzone-preview">
                                {selectedFiles.map((f, i) => {
                                  return (
                                    <Card
                                      className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                      key={i + "-file"}
                                    >
                                      <div className="p-2">
                                          <Row className="align-items-center">
                                            <Col className="col-auto">
                                              <img
                                                data-dz-thumbnail=""
                                                height="80"
                                                className="avatar-sm rounded bg-light"
                                                alt={f.name}
                                                src={f.preview}
                                              />
                                            </Col>
                                            <Col>
                                              <Link
                                                to="#"
                                                className="text-muted font-weight-bold"
                                              >
                                                {f.name}
                                              </Link>
                                              <p className="mb-0">
                                                <strong>{f.formattedSize}</strong>
                                              </p>
                                            </Col>
                                            <Col className="text-end">
                                            <button data-dz-remove="" className="btn btn-sm btn-danger" onClick={removeFile(i)}>Delete</button>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Card>
                                    );
                                  })}
                                </div>
                              </div>


                              <div className="d-flex align-items-start gap-3 mt-4">
                                <button
                                  type="button"
                                  className="btn btn-light btn-label previestab"
                                  onClick={() => {
                                    toggleTab(activeTab - 1);
                                  }}
                                >
                                  <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                                  Back to Basic Info
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary add-new-css btn-label right ms-auto nexttab"
                                  onClick={() => {
                                    toggleTab(activeTab + 1);
                                  }}
                                >
                                  <i className="ri-bank-card-line label-icon align-middle fs-16 ms-2"></i>
                                  Continue to Other Info
                                </button>
                              </div>
                          
                      </TabPane>

                      <TabPane tabId={3}>
                      <Formik
                          initialValues={{
                            tax_name: "",
                            vehicle_type: "",
                            quota_management: "",
                            material_doc: "",
                            unit_of_measurement: "",
                            category_id: "",
                          }}
                          validationSchema={ValidationSchema1}
                          onSubmit={(values) => {
                           // console.log(values)
                            //alert("dfff")
                           // const data = { ...formData, ...values };
                            const formData1 = new FormData();
                            for (const selectedFile of Object.keys(selectedFiles)) {
                              formData1.append('materialImages', selectedFiles[selectedFile])
                            }
                            formData1.append('material_name', sessionStorage.getItem('material_name'));
                            formData1.append('material_code', sessionStorage.getItem('material_code'));
                            formData1.append('material_desc',"test");
                            formData1.append('vat_gst', values.tax_name);
                            formData1.append('quota_management', values.quota_management);
                            formData1.append('material_uom', values.unit_of_measurement);
                            formData1.append('status', parseInt(selectedStatus));
                            formData1.append('vehicle_type',values.vehicle_type);
                            formData1.append('vehicle_document', values.material_doc);
                            formData1.append('visibility',parseInt(selectedVisibility));
                            formData1.append('material_category', values.category_id);
                           // console.log(assignTag.join(","))
                            formData1.append('tag_number', assignTag.join(","));    
                            
                            const dispatchData = dispatch(onAddNewProduct(formData1));

                            document.getElementById("materialCodeData").innerHTML = sessionStorage.getItem('material_code');
                         //   document.getElementById("materialCodeData").setAttribute("href","apps-ecommerce-product-details/"+sessionStorage.getItem('material_code'));
                            // console.log(dispatchData);
                            //toggleTab(activeTab + 1);  
                           // setFormData(data);
                           toggleTab(4);
                          }}
                        >
                        <Form encType="multipart/form-data" method="post" autoComplete="off"> 
                        <div>
                          <h5 className="mb-1">Other Information</h5>
                          <p className="text-muted mb-4">
                            Please select and enter your other information
                          </p>
                        </div>
                        <Row>
                          <Col sm={6}>
                            <p className="text-muted mb-2">
                              {" "}
                              <Link to="/add-product-category" className="float-end text-decoration-underline">
                                Add New
                              </Link>
                              Select material category
                            </p>



                            <Field
                              as="select"
                              name="category_id"
                              className="form-select select2-selection"
                              id="category-field"
                            >   
                                  <option disabled value="">Select Category</option>
                                  {leads.map((item, key) => (<option value={item.id} key={key}>{item.material_category}</option>))}
                               
                            </Field>
                            </Col>

                            <Col sm={6}>
                            <p className="text-muted mb-2">
                              {" "}
                              <Link to="/add-todo" className="float-end text-decoration-underline">
                                Add New
                              </Link>
                              Select material tags
                            </p>
                            <Select
                                closeMenuOnSelect={false}
                                defaultValue={optionList[0]}
                                isMulti={true}
                                onChange={handlestag}
                                //components={{ MultiValueRemove }}
                               // formatOptionLabel={formatOptionLabel}
                                styles={colourStyles}
                                options={optionList}
                            ></Select>
                            {/* 
                            <Input
                              name="tags"
                              type="select"
                              className="form-select select2-selection"
                              id="category-field"
                            >                  
                                <React.Fragment>
                                  {todos.map((item, key) => (<option value={item.id} key={key}>{item.tagName}</option>))}
                                </React.Fragment>
                            </Input>*/}
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <label
                                  className="form-label"
                                  htmlFor="manufacturer-name-input"
                                >
                                  Tax
                                </label>
                                <Field
                                  type="text"
                                  className="form-control"
                                  id="manufacturer-name-input"
                                  name="tax_name"
                                  placeholder="Enter Tax"
                                />
                                 <ErrorMessage name="tax_name" render={renderError} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <label
                                  className="form-label"
                                  htmlFor="manufacturer-brand-input"
                                >
                                  Quota Management
                                </label>
                                <Field
                                  type="text"
                                  className="form-control"
                                  id="manufacturer-brand-input"
                                  name="quota_management"
                                  placeholder="Enter Quota Management"
                                />
                                 <ErrorMessage name="quota_management" render={renderError} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="meta-title-input"
                                >
                                  Vehicle Type
                                </Label>
                                <Field
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter vehicle type"
                                  id="meta-title-input"
                                  name="vehicle_type"
                                />
                                 <ErrorMessage name="vehicle_type" render={renderError} />
                              </div>
                            </Col>

                            <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="meta-keywords-input"
                                >
                                  Mandatory Doc For Vehicle
                                </Label>
                                <Field
                                  type="file"
                                  className="form-control"
                                  placeholder="Enter Doc"
                                  id="meta-keywords-input"
                                  name="material_doc"
                          />
                           <ErrorMessage name="material_doc" render={renderError} />
                        </div>
                      </Col>
                      <Col lg={6}>
                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="meta-title-input"
                                >
                                  Unit Of Measurement
                                </Label>
                                <Field
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Unit Of Measurement"
                                  id="meta-title-input"
                                  name="unit_of_measurement"
                                />
                                 <ErrorMessage name="unit_of_measurement" render={renderError} />
                              </div>
                            </Col>
                        </Row>
                        
                        <div className="d-flex align-items-start gap-3 mt-4">
                          <button
                            type="button"
                            className="btn btn-light btn-label previestab"
                            onClick={() => {
                              toggleTab(activeTab - 1);
                            }}
                          >
                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                            Back to Document Info
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary add-new-css btn-label right ms-auto nexttab"
                          >
                            <i className="ri-shopping-basket-line label-icon align-middle fs-16 ms-2"></i>
                            Proceed Material
                          </button>
                        </div>
                          </Form>
                          </Formik>
                      </TabPane>

                      <TabPane tabId={4} id="pills-finish">
                        <div className="text-center py-5">
                          <div className="mb-4">
                            <lord-icon
                              src="https://cdn.lordicon.com/lupuorrc.json"
                              trigger="loop"
                              colors="primary:#0ab39c,secondary:#405189"
                              style={{ width: "120px", height: "120px" }}
                            ></lord-icon>
                          </div>
                          <h5>Thank you ! Your Material added Successfully !</h5>
                          <p className="text-muted">
                            Your material added successfully,Now you can add customer from quota.
                          </p>

                          <h3 className="fw-semibold">
                            Material Code:{" "}
                            <a
                              href="apps-ecommerce-product-details"
                              className="text-decoration-underline"
                              id="materialCodeData"
                            >
                              
                            </a>
                          </h3>
                        </div>
                      </TabPane>
                    </TabContent>
                </CardBody>
              </Card>
            </Col>
{/*
            <Col xl={4}>
              <Card>
                <CardHeader>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-0">Order Summary</h5>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card">
                    <table className="table table-borderless align-middle mb-0">
                      <thead className="table-light text-muted">
                        <tr>
                          <th style={{ width: "90px" }} scope="col">
                            Product
                          </th>
                          <th scope="col">Product Info</th>
                          <th scope="col" className="text-end">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderSummary.map((product, key) => (
                          <React.Fragment key={key}>
                            <tr>
                              <td>
                                <div className="avatar-md bg-light rounded p-1">
                                  <img
                                    src={product.img}
                                    alt=""
                                    className="img-fluid d-block"
                                  />
                                </div>
                              </td>
                              <td>
                                <h5 className="fs-14">
                                  <Link
                                    to="/apps-ecommerce-product-details"
                                    className="text-dark"
                                  >
                                    {product.name}
                                  </Link>
                                </h5>
                                <p className="text-muted mb-0">
                                  $ {product.price} x {product.quantity}
                                </p>
                              </td>
                              <td className="text-end">$ {product.total}</td>
                            </tr>
                          </React.Fragment>
                        ))}

                        <tr>
                          <td className="fw-semibold" colSpan="2">
                            Sub Total :
                          </td>
                          <td className="fw-semibold text-end">$ 359.96</td>
                        </tr>
                        <tr>
                          <td colSpan="2">
                            Discount{" "}
                            <span className="text-muted">(VELZON15)</span>:{" "}
                          </td>
                          <td className="text-end">- $ 50.00</td>
                        </tr>
                        <tr>
                          <td colSpan="2">Shipping Charge :</td>
                          <td className="text-end">$ 24.99</td>
                        </tr>
                        <tr>
                          <td colSpan="2">Estimated Tax (12%): </td>
                          <td className="text-end">$ 18.20</td>
                        </tr>
                        <tr className="table-active">
                          <th colSpan="2">Total (USD) :</th>
                          <td className="text-end">
                            <span className="fw-semibold">$353.15</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col> */}
          </Row>
        </Container>
      </div>
      {/* modal Delete Address */}
    </React.Fragment>
  );
};

export default EcommerceCheckout;
