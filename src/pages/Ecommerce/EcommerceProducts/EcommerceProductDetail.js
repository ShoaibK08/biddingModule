import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Tooltip,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Modal, ModalBody, ModalHeader,
} from "reactstrap";
//import { DefaultModalExample, CenteredModalExample, GridsModalExample, StaticBackdropModalExample, TogglebetweenExample, TooltipModalExample, ScrollableModalExample, VaryingModalExample, OptionalModalExample, FullscreenResponsiveExample, AnimationModalExample, PositionModalExample } from './UiModalCode';
//Simple bar
import SimpleBar from "simplebar-react";
import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import chroma from 'chroma-js';
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import product1 from "../../../assets/images/products/img-1.png";
import product6 from "../../../assets/images/products/img-6.png";
import product8 from "../../../assets/images/products/img-8.png";

import { productDetailsWidgets, reviews } from "../../../common/data/ecommerce";

import { Swiper, SwiperSlide } from "swiper/react";
import classnames from "classnames";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import SwiperCore, { FreeMode, Navigation, Thumbs } from "swiper";
import { Link } from "react-router-dom";

SwiperCore.use([FreeMode, Navigation, Thumbs]);



const ProductReview = (props) => {
  return (
    <React.Fragment>
      <li className="py-2">
        <div className="border border-dashed rounded p-3">
          <div className="d-flex align-items-start mb-3">
            <div className="hstack gap-3">
              <div className="badge rounded-pill bg-success mb-0">
                <i className="mdi mdi-star"></i> {props.review.rating}
              </div>
              <div className="vr"></div>
              <div className="flex-grow-1">
                <p className="text-muted mb-0">{props.review.comment}</p>
              </div>
            </div>
          </div>
          {props.review.subItems && (
            <React.Fragment>
              <div className="d-flex flex-grow-1 gap-2 mb-3">
                {props.review.subItems.map((subItem, key) => (
                  <React.Fragment key={key}>
                    <Link to="#" className="d-block">
                      <img
                        src={subItem.img}
                        alt=""
                        className="avatar-sm rounded object-cover"
                      />
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          )}

          <div className="d-flex align-items-end">
            <div className="flex-grow-1">
              <h5 className="fs-15 mb-0">{props.review.name}</h5>
            </div>

            <div className="flex-shrink-0">
              <p className="text-muted mb-0">{props.review.date}</p>
            </div>
          </div>
        </div>
      </li>
    </React.Fragment>
  );
};



function EcommerceProductDetail(props) {

  document.title = "Product Details | Nayara";
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [ttop, setttop] = useState(false);
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop);
  }

  const [ssize, setssize] = useState(false);
  const [msize, setmsize] = useState(false);
  const [lsize, setlsize] = useState(false);
  const [xlsize, setxlsize] = useState(false);
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const params = useParams()
  console.log("product id ", params._id);

  const [singleProduct, setPosts] = useState([]);
  const [quota, setQuota] = useState([]);
  const [pendingQuota, setPendingQuota] = useState([]);
  const date1 = singleProduct.created_dt;
  const date = typeof date1 === "string" ? date1.split('T')[0] : ""
  const rows = [];
  const rows1 = [];

  const [input, setInput] = useState([]);
  const [ProductQuantity, setProductQuantity] = useState('');

  const onTagsChange = (event, values) => {
    
    setErrorMsg(false);
    setError1Msg(false);
    setInput(values);
    if (values) {
      localStorage.setItem('ProductQuantity', JSON.stringify(values.title));
      setProductQuantity(JSON.stringify(values.title));
    }
    else if(event){
      localStorage.setItem('ProductQuantity', JSON.stringify(event.target.value));
      setProductQuantity(JSON.stringify(event.target.value))
    }
    localStorage.setItem('ProductID', params._id);
  };
  const handler = () => {
    console.log(input);
  };

  const product_quantity = [
    { title: "100", year: 1994 },
    { title: "1000", year: 1972 },
    { title: "2000", year: 1974 },
    { title: "3000", year: 2008 },
    { title: "4000", year: 1957 },
    { title: "5000", year: 1957 },
  ];

  useEffect(() => {
    axios.get(`http://localhost:8043/sapModule/getMaterialByMaterialCode/${params._id}`)
      .then(res => {
        setPosts(res);
      })
      .catch(err => {
        console.log(err)
      })
  }, [params._id])

  useEffect(() => {
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let customerCode = obj.data._id;
    //let ProductID = localStorage.getItem("ProductID");
    axios.get(`http://localhost:8043/sapModule/getCustomerQuotabyProductCode?customerCode=${customerCode}&productCode=${params._id}`)
      .then(res => {
        setQuota(res.quota_allotted);
        setPendingQuota(res.pending_quota);
      })
      .catch(err => {
        console.log(err)
      })
  })

  const htmlNew = [];
  if (singleProduct.length != 0) {
    for (const tags of Object.keys(singleProduct.tag)) {
      const tagName = singleProduct.tag[tags];
      const color = (tagName.color === "black" ? chroma("#000") : chroma(tagName.color));
      htmlNew.push(
        <div
          className=""
          style={{ display: "inline-flex", minWidth: "0", width: "max-content", backgroundColor: color.alpha(0.1).css(), borderRadius: "2px", margin: "2px", boxSizing: "border-box" }}>
          <div className=""
            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", borderRadius: "2px", color: "#" + tagName.color, fontSize: "85%", padding: "3px", paddingLeft: "6px", boxSizing: "border-box" }}>{tagName.tag_name}</div>
        </div>);
      //console.log(singleProduct.tag[tags]);
    }
    for (const selectedFile of Object.keys(singleProduct.image)) {
      //console.log(singleProduct.image[selectedFile])
      rows.push(
        <SwiperSlide>
          <img
            src={process.env.PUBLIC_URL + "/subImage/" + singleProduct.image[selectedFile]}
            alt=""
            //style="height:300px !important;"
            className="img-fluid d-block "
          />
        </SwiperSlide>);


      rows1.push(<SwiperSlide className="rounded">
        <div className="nav-slide-item">
          <img
            src={process.env.PUBLIC_URL + "/subImage/" + singleProduct.image[selectedFile]}
            alt=""
            //style="height:66px !important;"
            className="img-fluid d-block rounded"
          />
        </div>
      </SwiperSlide>);
    }
  }
  const navigate = useNavigate();
  const [showError, setErrorMsg] = useState(false);
  const [showError1, setError1Msg] = useState(false);
  const checkProductQty = () => {
    
    const productQty = ProductQuantity;
    if (productQty === "") {
      //alert("Please select Product Quantity.");
      setErrorMsg(true);
    }
    else if (parseInt(JSON.parse(productQty)) > pendingQuota) {
      //alert("Please select Product Quantity.");
      setError1Msg(true);
    }
    else {
      setTimeout(() => {
        navigate('/place-indent')
      }, 1)
    }
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Product Details" pageTitle="Nayara Energy" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Row className="gx-lg-5">
                  <Col xl={4} md={8} className="mx-auto">
                    <div className="product-img-slider sticky-side-div">
                      <Swiper
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        className="swiper product-thumbnail-slider p-2 rounded bg-light"
                      >
                        <div className="swiper-wrapper">
                          {rows}

                        </div>
                      </Swiper>

                      <div className="product-nav-slider mt-2">
                        <Swiper
                          onSwiper={setThumbsSwiper}
                          slidesPerView={4}
                          freeMode={true}
                          watchSlidesProgress={true}
                          spaceBetween={10}
                          className="swiper product-nav-slider mt-2 overflow-hidden"
                        >
                          <div className="swiper-wrapper">
                            {rows1}
                          </div>
                        </Swiper>
                      </div>
                      <div className="text-end mb-4 mt-4">
                        {/* <a
                          className="btn btn-success btn-label right ms-auto"
                          style={{ width: '100%' }}
                          onClick={() => tog_backdrop()}
                        >
                          <i className="ri-arrow-right-line label-icon align-bottom fs-16 ms-2"></i>{" "}
                          Add To Cart
                        </a> */}
                      </div>
                      <div className="text-end mb-4">
                        <Link
                          //to="/place-indent"
                          className="btn btn-success btn-label right ms-auto"
                          style={{ width: '100%' }}
                          onClick={() => checkProductQty()}
                        >
                          <i className="ri-arrow-right-line label-icon align-bottom fs-16 ms-2"></i>{" "}
                          Place Indent
                        </Link>
                      </div>
                    </div>

                  </Col>

                  <Col xl={8}>
                    <div className="mt-xl-0 mt-5">
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <h4>{singleProduct.material_name}</h4>
                          <div className="hstack gap-3 flex-wrap">
                            <div>
                              <Link to="#" className="text-primary d-block">
                                Nayara Energy
                              </Link>
                            </div>
                            {/* <div className="vr"></div>
                            <div className="text-muted">
                              Seller :{" "}
                              <span className="text-body fw-medium">

                              </span>
                            </div> */}
                            <div className="vr"></div>
                            <div className="text-muted">
                              Published :{" "}
                              <span className="text-body fw-medium">
                                {date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Link
                            to="/apps-nft-explore"
                            className="btn btn-success btn-label left ms-auto"
                            style={{ width: '100%' }}
                          >
                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2 "></i>{" "}
                            Back to Material List
                          </Link>
                        </div>
                      </div>

                      <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
                        {/* <div className="text-muted fs-16">
                          <span className="mdi mdi-star text-warning"></span>
                          <span className="mdi mdi-star text-warning"></span>
                          <span className="mdi mdi-star text-warning"></span>
                          <span className="mdi mdi-star text-warning"></span>
                          <span className="mdi mdi-star text-warning"></span>
                        </div>
                        <div className="text-muted">
                          ( 2.8k Customer Review )
                        </div> */}
                      </div>

                      <Row className="mt-6">
                        <Col lg={6} sm={6}>
                          <div className="p-2 border border-dashed rounded">
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm me-2">
                                <div className="avatar-title rounded bg-transparent text-success fs-24">
                                  <i className="ri-store-2-fill"></i>
                                </div>
                              </div>
                              <div className="flex-grow-2">
                                <p className="text-muted mb-1">Material Code :</p>
                                <h5 className="mb-0">{singleProduct.material_code}</h5>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col lg={6} sm={6}>
                          <div className="p-2 border border-dashed rounded">
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm me-2">
                                <div className="avatar-title rounded bg-transparent text-success fs-24">
                                  <i className="ri-file-copy-2-fill"></i>
                                </div>
                              </div>
                              <div className="flex-grow-2">
                                <p className="text-muted mb-1">No. of Orders :</p>
                                <h5 className="mb-0">N/A</h5>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col></Col>
                      </Row>

                      <Row className="">
                        <Col sm={6}>
                          <div className="mb-3">
                            <Label
                              htmlFor="billinginfo-lastName"
                              className="form-label"
                            >
                              Alloted Quota
                            </Label>
                            <Input style={{ border: 'none', borderBottom: 'solid 1px grey', padding: '6px 10px', borderRadius: '0px' }}
                              type="text"
                              className="form-control"
                              id="billinginfo-lastName"
                              disabled
                              value={quota}
                            //placeholder="Enter last name"
                            />
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="mb-3">
                            <Label
                              htmlFor="billinginfo-lastName"
                              className="form-label"
                            >
                              Pending Quota
                            </Label>
                            <Input style={{ border: 'none', borderBottom: 'solid 1px grey', padding: '6px 10px', borderRadius: '0px' }}
                              type="text"
                              className="form-control"
                              id="billinginfo-lastName"
                              disabled
                              value={pendingQuota}
                            //placeholder="Enter last name"
                            />
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="mb-3">
                            <Label
                              htmlFor="billinginfo-lastName"
                              className="form-label"
                            >
                              Product Quantity<span style={{ color: "red" }}>*</span>
                            </Label>
                            <Autocomplete style={{ marginTop: '-15px' }}
                              //multiple
                              freeSolo
                              options={product_quantity}
                              getOptionLabel={option => option.title || option}
                              onInput={onTagsChange}
                              onChange={onTagsChange}
                              disableClearable={true}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  //variant="standard"
                                  placeholder="Select Quantity or Enter Mannualy"
                                  margin="normal"
                                  fullWidth
                                  style={{ fontSize: 10 }}
                                />
                              )}
                            />
                            {showError && <p className="italic text-red-600" style={{ color: "red" }}>Please Select Product Quantity.</p>}
                            {showError1 && <p className="italic text-red-600" style={{ color: "red" }}>Quantity is Exceeding.</p>}
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="mb-3">
                            <Label
                              htmlFor="billinginfo-lastName"
                              className="form-label"
                            >
                              Unit of Measurement
                            </Label>
                            <Input style={{ border: 'none', borderBottom: 'solid 1px grey', padding: '6px 10px', borderRadius: '0px' }}
                              type="text"
                              className="form-control"
                              id="billinginfo-lastName"
                              disabled
                              value={singleProduct.material_uom}
                            //placeholder="Enter last name"
                            />
                          </div>
                        </Col>
                      </Row>




                      {/* <div className="mt-4 text-muted">
                        <h5 className="fs-15">Description :</h5>
                        <p>
                          Petroleum, also called crude oil, is a fossil fuel. Like coal and natural gas, petroleum was formed from the remains of ancient marine organisms, such as plants, algae, and bacteria.
                        </p>
                      </div>

                      <Row>
                        <Col sm={6}>
                          <div className="mt-3">
                            <h5 className="fs-14">Features :</h5>
                            <ul className="list-unstyled">
                              <li className="py-1">
                                <i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}
                                Ignition quality: cetane number and cetane index.
                              </li>
                              <li className="py-1">
                                <i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}
                                Volatility (distillation temperature)
                              </li>
                              <li className="py-1">
                                <i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}
                                Petrolium
                              </li>
                              <li className="py-1">
                                <i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}
                                CARBON RESIDUE
                              </li>
                            </ul>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="mt-3">
                            <h5 className="fs-15">Services :</h5>
                            <ul className="list-unstyled product-desc-list">
                              <li className="py-1"><i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}Energy Audit</li>
                              <li className="py-1"><i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}Ports Cargo Shipping Service</li>
                              <li className="py-1"><i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}Shipping Service</li>
                              <li className="py-1"><i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}Technology Outsourcing</li>
                            </ul>
                          </div>
                        </Col>
                      </Row> */}

                      <div className="product-content mt-1">
                        <h5 className="fs-15 mb-3">Product Description :</h5>
                        <Nav tabs className="nav-tabs-custom nav-success">
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
                              Product Details
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
                              Specification
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              style={{ cursor: "pointer" }}
                              className={classnames({
                                active: customActiveTab === "3",
                              })}
                              onClick={() => {
                                toggleCustom("3");
                              }}
                            >
                              Services
                            </NavLink>
                          </NavItem>
                        </Nav>

                        <TabContent
                          activeTab={customActiveTab}
                          className="border border-top-0 p-4"
                          id="nav-tabContent"
                        >

                          <TabPane
                            id="nav-detail"
                            tabId="1"
                          >
                            <div>
                              <h5 className="mb-3">
                                {singleProduct.material_name}
                              </h5>
                              <p>Petroleum, also called crude oil, is a fossil fuel. Like coal and natural gas, petroleum was formed from the remains of ancient marine organisms, such as plants, algae, and bacteria.</p>
                              <div>
                                <row className="d-flex">
                                  <Col sm={6}>
                                    <p>Material Category : </p>
                                    <p>Vehicle Type : </p>
                                    <p>Visibility : </p>
                                    <p>Status : </p>
                                  </Col>
                                  <Col sm={6}>
                                    <p>{singleProduct.material_category ? singleProduct.material_category : 'N/A'}</p>
                                    <p>{singleProduct.vehicle_type ? singleProduct.vehicle_type : 'N/A'}</p>
                                    <p>{singleProduct.visibility ? singleProduct.visibility : 'N/A'}</p>
                                    <p style={{ color: 'green' }}>Available</p>
                                  </Col>
                                </row>

                              </div>
                            </div>
                          </TabPane>
                          <TabPane
                            id="nav-speci"
                            tabId="2"
                          >
                            <div className="table-responsive">
                              <table className="table mb-0">
                                <tbody>
                                  <tr>
                                    <th scope="row" style={{ width: "200px" }}>
                                      Category
                                    </th>
                                    <td>{singleProduct.material_category ? singleProduct.material_category : 'N/A'}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" style={{ width: "200px" }}>
                                      Tag
                                    </th>

                                    <td>{htmlNew}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </TabPane>
                          <TabPane
                            id="nav-detail"
                            tabId="3"
                          >
                            <div>
                              <div>
                                <row className="d-flex">
                                  <ul className="list-unstyled product-desc-list">
                                    <li className="py-1"><i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}Energy Audit</li>
                                    <li className="py-1"><i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}Ports Cargo Shipping Service</li>
                                    <li className="py-1"><i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}Shipping Service</li>
                                    <li className="py-1"><i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}Technology Outsourcing</li>
                                  </ul>
                                </row>

                              </div>
                            </div>
                          </TabPane>
                        </TabContent>
                      </div>

                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Static Backdrop Modal */}
        <Modal
          isOpen={modal_backdrop}
          toggle={() => {
            tog_backdrop();
          }}
          backdrop={'static'}
          id="staticBackdrop"
          centered
        >
          <ModalHeader className="modal-title fw-bold" id="staticBackdropLabel" >

          </ModalHeader>
          <ModalBody className="text-center p-5">
            <lord-icon
              src="https://cdn.lordicon.com/lupuorrc.json"
              trigger="loop"
              colors="primary:#121331,secondary:#08a88a"
              style={{ width: "120px", height: "120px" }}>
            </lord-icon>

            <div className="mt-4">
              <h3 className="mb-3">Item! Added to cart successfully!</h3>
              {/* <p className="text-muted mb-4"> The transfer was not successfully received by us. the email of the recipient wasn't correct.</p> */}
              <div className="hstack gap-2 justify-content-center">
                {/* <Link to="#" className="btn btn-link link-secondary fw-medium" onClick={() => setmodal_backdrop(false)}><i className="ri-close-line me-1 align-middle"></i> Close</Link> */}
                <Link to="#" className="btn btn-success" onClick={() => setmodal_backdrop(false)}>Close</Link>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Container>
    </div>
  );
}

export default EcommerceProductDetail;