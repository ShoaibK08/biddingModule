import React, { useState,useEffect } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Input,
  Label,
  FormFeedback,
  Form,
} from "reactstrap";

// Redux
import { useDispatch } from "react-redux";
import { addNewProduct as onAddNewProduct, updateProduct as onUpdateProduct } from "../../../store/ecommerce/action";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import classnames from "classnames";
import Dropzone from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
//formik
import { useFormik } from "formik";
import * as Yup from "yup";

// Import React FilePond
import { registerPlugin } from "react-filepond";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

//Import actions
import {
  getLeads as onGetLeads,
  getTodos as onGetTodos,
} from "../../../store/actions";

import { useSelector } from "react-redux";
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EcommerceAddProduct = (props) => {

  document.title = "Update Material | Nayara";
  
  const history = useNavigate();
  const dispatch = useDispatch();
  
  const { leads,todos } = useSelector((state) => ({
    leads: state.Crm.leads,
    todos: state.Todos.todos,
  }));

  useEffect(() => {
    if (leads && !leads.length) {
      dispatch(onGetLeads());
      console.log("set effect 1");
    }
  }, [dispatch, leads]);

  
  useEffect(() => {
    if (todos && !todos.length) {
      dispatch(onGetTodos());
    }
  }, [dispatch, todos]);

  console.log(todos)
  


  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const [selectedFiles, setselectedFiles] = useState([]);
  const [selectedGroup, setselectedGroup] = useState(null);
  const [selectedCover, setselectedCover] = useState(null);
  const [selectedStatus, setselectedStatus] = useState(null);
  const [selectedVisibility, setselectedVisibility] = useState(null);
  const [selectedMulti, setselectedMulti] = useState([]);
    
  let rows = [];
  const handleMulti = (event) => {
    
    var index = event.target.selectedIndex;
    var optionElement = event.target.childNodes[index]
    var tag = optionElement.getAttribute('tagval');
    var option =  optionElement.getAttribute('tagcolor');
    rows = <div className="class-single-color" style={{ backgroundColor: '#'+option}}>{tag} <span className="class-span-color">x</span></div>;
   // console.log(rows)
   setselectedMulti([...selectedMulti,rows]);
  } 


  console.log(selectedMulti);
  


  function handleAcceptedFiles(files) {
    console.log("file upload",files);
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    //setselectedFiles(...files);
    setselectedFiles(prev => [...prev, ...files]);
  }

  function handleSelectGroup(selectedGroup) {
    setselectedGroup(selectedGroup);
  }

  function handleSelectStatus(selectedStatus) {
    setselectedStatus(selectedStatus);
  }

  function handleSelectVisibility(selectedVisibility) {
    setselectedVisibility(selectedVisibility);
  }

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
/*
  const productCategory = [
    {
      options: [
        { label: "All", value: "All" },
        { label: "Appliances", value: "Kitchen Storage & Containers" },
        { label: "Fashion", value: "Clothes" },
        { label: "Electronics", value: "Electronics" },
        { label: "Grocery", value: "Grocery" },
        { label: "Home & Furniture", value: "Furniture" },
        { label: "Kids", value: "Kids" },
        { label: "Mobiles", value: "Mobiles" },
      ],
    },
  ];
*/
  const dateFormat = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let h = (d.getHours() % 12) || 12;
    let ampm = d.getHours() < 12 ? "AM" : "PM";
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear() + ", " + h + ":" + d.getMinutes() + " " + ampm).toString());
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const dateString = e.toString().split(" ");
    let time = dateString[4];
    let H = +time.substr(0, 2);
    let h = (H % 12) || 12;
    h = (h <= 9) ? h = ("0" + h) : h;
    let ampm = H < 12 ? "AM" : "PM";
    time = h + time.substr(2, 3) + " " + ampm;

    const date = dateString[2] + " " + dateString[1] + ", " + dateString[3];
    const orderDate = (date + ", " + time).toString();
    setDate(orderDate);
  };

  const productStatus = [
    {
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Scheduled", value: "scheduled" },
      ],
    },
  ];

  const productVisibility = [
    {
      options: [
        { label: "Hidden", value: "Hidden" },
        { label: "Public", value: "Public" },
      ],
    },
  ];

  const fileSelectedHandler = event => {
    //console.log(event.target.files[0])
    setselectedCover(event.target.files[0]);
  }

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      material_name: "",
      price: "",
      stock: "",
      orders: "",
      category: "",
      publishedDate: "",
      status: "",
      rating: 4.5,
      manufacturer_name: "",
      manufacturer_brand: "",
      product_discount: "",
      meta_title: "",
      meta_keyword: "",
      product_tags: "",
    },
    validationSchema: Yup.object({
      material_name: Yup.string().required("Please Enter a Material Name"),
      material_code: Yup.string().required("Please Enter a Material Code"),
      /*price: Yup.string().required("Please Enter a Product Price"),
      stock: Yup.string().required("Please Enter a Product stock"),
      orders: Yup.string().required("Please Enter a Product orders"),
      category: Yup.string().required("Please Enter a Product category"),
      status: Yup.string().required("Please Enter a Product status"),
      manufacturer_name: Yup.string().required("Please Enter a Manufacturer Name"),
      manufacturer_brand: Yup.string().required("Please Enter a Manufacturer Brand"),
      product_discount: Yup.string().required("Please Enter a Product Discount"),
      meta_title: Yup.string().required("Please Enter a Meta Title"),
      meta_keyword: Yup.string().required("Please Enter a Meta Keyword"),
      product_tags: Yup.string().required("Please Enter a Product Tags"),*/
    }),
    onSubmit: (values) => {
      const newProduct = {
        _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
        material_name: values.material_name,
       /* price: values.price,
        stock: values.stock,
        orders: values.orders,
        category: values.category,
        publishedDate: date,
        status: values.status,
        rating: 4.5,*/
      };

      console.log("cover img ",selectedFiles);
      console.log("cover img 1",selectedCover);

      

      const formData = new FormData();
      for (const selectedFile of Object.keys(selectedFiles)) {
        formData.append('materialImages', selectedFiles[selectedFile])
      }
      //formData.append('materialImages', selectedCover);
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
     // formData.append('materialSubImage', selectedFiles);
      
      // save new product
      dispatch(onUpdateProduct(formData));
      
      history("/apps-nft-explore");
      validation.resetForm();
    }
  });

  
  const params = useParams();
  
  const [singleProduct, setPosts] = useState([])
  
  useEffect(()=> {
      axios.get(`http://localhost:8043/sapModule/getMaterialByMaterialCode/${params._id}`)
      .then(res => {
          //console.log(res)
          setPosts(res);

          
      })
      .catch(err =>{
          console.log(err)
      })
  }, [params._id])

  const removeFile = (f) => () => {
    console.log('removeFile...')
    selectedFiles.splice(selectedFiles.indexOf(f), 1)
    console.log(selectedFiles)
  }
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Update Material" pageTitle="Ecommerce" />

        <Row>
          <Col lg={8}>
            <Form 
              encType="multipart/form-data"
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}>
              <Card>
                <CardBody>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="product-title-input">
                      Material Name <span style={{color:"red"}}>*</span>
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="product-title-input"
                      placeholder="Enter material name"
                      name="material_name"
                      value={validation.values.material_name || singleProduct.material_name}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={validation.errors.material_name && validation.touched.material_name ? true : false}
                    />
                    {validation.errors.material_name && validation.touched.material_name ? (
                      <FormFeedback type="invalid">{validation.errors.material_name}</FormFeedback>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="product-title-input">
                      Material Code 
                    </Label>
                    <Input
                      type="text"
                      className="form-control" readOnly
                      id="product-title-input"
                      placeholder="Enter material code"
                      name="material_code"
                      value={validation.values.material_code || singleProduct.material_code}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={validation.errors.material_code && validation.touched.material_code ? true : false}
                    />
                    {validation.errors.material_code && validation.touched.material_code ? (
                      <FormFeedback type="invalid">{validation.errors.material_code}</FormFeedback>
                    ) : null}
                  </div>
                  <div>
                    <Label>Material Description</Label>

                    <CKEditor
                      editor={ClassicEditor}
                      data={singleProduct.material_desc}
                      onReady={(editor) => {
                        // You can store the "editor" and use when it is needed.
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Material Gallery</h5>
                </CardHeader>
                <CardBody>
                  <div className="mb-4">
                   <h5 className="fs-14 mb-1">Material Gallery</h5>
                    <p className="text-muted">Add Material Gallery Images.</p>

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
                                <button data-dz-remove="" class="btn btn-sm btn-danger" onClick={removeFile(f)}>Delete</button>
                                </Col>
                              </Row>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </CardBody>
              </Card>
              

              <Card>
                <CardHeader>
                  <Nav className="nav-tabs-custom card-header-tabs border-bottom-0">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "1",
                        })}
                        onClick={() => {
                          toggleCustom("1");
                        }}
                      >
                        General Info
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "2",
                        })}
                        onClick={() => {
                          toggleCustom("2");
                        }}
                      >
                        Vehicle Info
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>

                <CardBody>
                  <TabContent activeTab={customActiveTab}>
                    <TabPane id="addproduct-general-info" tabId="1">
                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="manufacturer-name-input"
                            >
                              Tax
                            </label>
                            <Input
                              type="text"
                              className="form-control"
                              id="manufacturer-name-input"
                              name="manufacturer_name"
                              placeholder="Enter Tax"
                              value={validation.values.manufacturer_name || singleProduct.vat_gst}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={validation.errors.manufacturer_name && validation.touched.manufacturer_name ? true : false}
                            />
                            {validation.errors.manufacturer_name && validation.touched.manufacturer_name ? (
                              <FormFeedback type="invalid">{validation.errors.manufacturer_name}</FormFeedback>
                            ) : null}
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
                            <Input
                              type="text"
                              className="form-control"
                              id="manufacturer-brand-input"
                              name="manufacturer_brand"
                              placeholder="Enter Quota Management"
                              value={validation.values.manufacturer_brand || singleProduct.quota_management}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={validation.errors.manufacturer_brand && validation.touched.manufacturer_brand ? true : false}
                            />
                            {validation.errors.manufacturer_brand && validation.touched.manufacturer_brand ? (
                              <FormFeedback type="invalid">{validation.errors.manufacturer_brand}</FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane id="addproduct-metadata" tabId="2">
                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="meta-title-input"
                            >
                              Vehicle Type
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Enter vehicle type"
                              id="meta-title-input"
                              name="meta_title"
                              value={validation.values.meta_title ||  singleProduct.vehicle_type}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={validation.errors.meta_title && validation.touched.meta_title ? true : false}
                            />
                            {validation.errors.meta_title && validation.touched.meta_title ? (
                              <FormFeedback type="invalid">{validation.errors.meta_title}</FormFeedback>
                            ) : null}
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
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Enter Doc"
                              id="meta-keywords-input"
                              name="meta_keyword"
                              value={validation.values.meta_keyword || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={validation.errors.meta_keyword && validation.touched.meta_keyword ? true : false}
                            />
                            {validation.errors.meta_keyword && validation.touched.meta_keyword ? (
                              <FormFeedback type="invalid">{validation.errors.meta_keyword}</FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                      </Row>

                      <div>
                        <Label
                          className="form-label"
                          htmlFor="meta-description-input"
                        >
                          Material UOM
                        </Label>
                        <textarea
                          className="form-control"
                          id="meta-description-input"
                          placeholder="Enter material UOM"
                          name="meta_description"
                          rows="3"
                        ></textarea>
                      </div>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>

              <div className="text-end mb-3">
                <button type="submit" className="btn btn-success w-sm">
                Add Material
                </button>
              </div>
            </Form>
          </Col>

          <Col lg={4}>
          <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Publish</h5>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <Label
                    htmlFor="choices-publish-status-input"
                    className="form-label"
                  >
                    Status <span style={{color:"red"}}>*</span>
                  </Label>
                  <Input
                    name="status"
                    type="select"
                    classNamePrefix="select2-selection form-select"
                    id="choices-publish-status-input"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={
                      validation.values.status ||  singleProduct.status
                    }
                  >
                    {productStatus.map((item, key) => (
                      <React.Fragment key={key}>
                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                      </React.Fragment>
                    ))}
                  </Input>
                  {validation.touched.status &&
                    validation.errors.status ? (
                    <FormFeedback type="invalid">
                      {validation.errors.status}
                    </FormFeedback>
                  ) : null}
                </div>

                <div>
                  <Label
                    htmlFor="choices-publish-visibility-input"
                    className="form-label"
                  >
                    Visibility <span style={{color:"red"}}>*</span>
                  </Label>

                  <Select
                    value={selectedVisibility || singleProduct.visibility}
                    onChange={() => {
                      handleSelectVisibility();
                    }}
                    options={productVisibility}
                    name="choices-publish-visibility-input"
                    classNamePrefix="select2-selection form-select"
                  />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Publish Schedule</h5>
              </CardHeader>

              <CardBody>
                <div>
                  <label
                    htmlFor="datepicker-publish-input"
                    className="form-label"
                  >
                    Publish Date & Time <span style={{color:"red"}}>*</span>
                  </label>
                  <Flatpickr
                    name="publishedDate"
                    id="publishedDate-field"
                    className="form-control"
                    placeholder="Select a date"
                    options={{
                      enableTime: true,
                      altInput: true,
                      altFormat: "d M, Y, G:i K",
                      dateFormat: "d M, Y, G:i K",
                    }}
                    onChange={(e) =>
                      dateformate(e)
                    }
                    value={validation.values.publishedDate || singleProduct.created_dt}
                  />
                  {validation.touched.publishedDate && validation.errors.publishedDate ? (
                    <FormFeedback type="invalid">{validation.errors.publishedDate}</FormFeedback>
                  ) : null}
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Product Categories</h5>
              </CardHeader>
              <CardBody>
                <p className="text-muted mb-2">
                  {" "}
                  <Link to="/add-product-category" className="float-end text-decoration-underline">
                    Add New
                  </Link>
                  Select product category <span style={{color:"red"}}>*</span>
                </p>
                <Input
                  name="category"
                  type="select"
                  className="form-select"
                  id="category-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={
                    validation.values.category || singleProduct.material_category
                  }
                >                  
                    <React.Fragment>
                      {leads.map((item, key) => (<option value={item.id} key={key}>{item.material_category}</option>))}
                    </React.Fragment>
                </Input>
                {validation.touched.category &&
                  validation.errors.category ? (
                  <FormFeedback type="invalid">
                    {validation.errors.category}
                  </FormFeedback>
                ) : null}
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
              {" "}
                  <Link to="/apps-todo" className="float-end text-decoration-underline">
                    Add New
                  </Link>
                <h5 className="card-title mb-0">Product Tags</h5>
              </CardHeader>
              <CardBody>
                <div className="hstack gap-3 align-items-start">
                  <div className="flex-grow-1">
                    {selectedMulti}
                    <select name="product_tag" class="select2-selection form-select"                                                          
                        onChange={handleMulti}
                    >{todos.map((item, key) => (<option tagcolor={item.color} tagval={item.tagName} value={item.id} key={key}>{item.tagName}</option>))}
                    </select>

                    {validation.errors.product_tags && validation.touched.product_tags ? (
                      <FormFeedback type="invalid">{validation.errors.product_tags}</FormFeedback>
                    ) : null}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceAddProduct;
