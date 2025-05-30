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
} from "reactstrap";

//Simple bar
import SimpleBar from "simplebar-react";

import BreadCrumb from "../../../Components/Common/BreadCrumb";

import product1 from "../../../assets/images/products/img-1.png";
import product6 from "../../../assets/images/products/img-6.png";
import product8 from "../../../assets/images/products/img-8.png";

import { productDetailsWidgets, reviews } from "../../../common/data/ecommerce";

import { Swiper, SwiperSlide } from "swiper/react";
import classnames from "classnames";
import { useParams } from "react-router-dom";
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
          {props.review.subitem && (
            <React.Fragment>
              <div className="d-flex flex-grow-1 gap-2 mb-3">
                {props.review.subitem.map((subItem, key) => (
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
              <h5 className="fs-14 mb-0">{props.review.name}</h5>
            </div>

            <div className="flex-shrink-0">
              <p className="text-muted fs-13 mb-0">{props.review.date}</p>
            </div>
          </div>
        </div>
      </li>
    </React.Fragment>
  );
};

const PricingWidgetList = (props) => {
  return (
    <React.Fragment>
      <Col lg={3} sm={6}>
        <div className="p-2 border border-dashed rounded">
          <div className="d-flex align-items-center">
            <div className="avatar-sm me-2">
              <div className="avatar-title rounded bg-transparent text-success fs-24">
                <i className={props.pricingDetails.icon}></i>
              </div>
            </div>
            <div className="flex-grow-1">
              <p className="text-muted mb-1">{props.pricingDetails.label} :</p>
              <h5 className="mb-0">{props.pricingDetails.labelDetail}</h5>
            </div>
          </div>
        </div>
      </Col>
    </React.Fragment>
  );
};

function EcommerceProductDetail(props) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [ttop, setttop] = useState(false);

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
  console.log("product id ",params._id);
  
  const [singleProduct, setPosts] = useState([])
    
  const rows = [];
  const rows1 = [];

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

  if(singleProduct.length != 0){
  for (const selectedFile of Object.keys(singleProduct.image)) {
    //console.log(singleProduct.image[selectedFile])
    rows.push(
      <SwiperSlide>
      <img
        src={process.env.PUBLIC_URL+"/subImage/"+singleProduct.image[selectedFile]}
        alt=""
        //style="height:300px !important;"
        className="img-fluid d-block"
      />
      </SwiperSlide>);

      
      rows1.push(<SwiperSlide className="rounded">
      <div className="nav-slide-item">
        <img
          src={process.env.PUBLIC_URL+"/subImage/"+singleProduct.image[selectedFile]}
          alt=""
          //style="height:66px !important;"
          className="img-fluid d-block rounded simpleClass1"
        />
      </div>
    </SwiperSlide>);
  }
  }

document.title ="Product Details | Nayara";
  return (
    <div className="page-content">
      <Container fluid>        
        <BreadCrumb title="Product Details" pageTitle="Ecommerce" />

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
                    </div>
                  </Col>

                  <Col xl={8}>
                    <div className="mt-xl-0 mt-5">
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <h4>{singleProduct.material_name}</h4>
                        </div>
                        <div className="flex-shrink-0">
                          <div>
                            <Tooltip
                              placement="top"
                              isOpen={ttop}
                              target="TooltipTop"
                              toggle={() => {
                                setttop(!ttop);
                              }}
                            >
                              Edit
                            </Tooltip>
                            <Link to="/apps-ecommerce-edit-product/12"
                             // href="apps-ecommerce-add-product"
                              id="TooltipTop"
                              className="btn btn-light"
                            >
                              <i className="ri-pencil-fill align-bottom"></i>
                            </Link>
                          </div>
                        </div>
                      </div>

                     

                      <div className="mt-4 text-muted">
                        <h5 className="fs-14">Description :</h5>
                        <p>
                          {singleProduct.material_desc}
                        </p>
                      </div>

                      <div className="mt-4 text-muted">
                        <h5 className="fs-14">Category :</h5>
                        <p>
                          {singleProduct.material_category}
                        </p>
                      </div>

                      <div className="mt-4 text-muted">
                        <h5 className="fs-14">Tags :</h5>
                        <p>
                          {singleProduct.material_category}
                        </p>
                      </div>

                      <div className="product-content mt-5">
                        <h5 className="fs-14 mb-3">Material Description :</h5>
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
                              Specification
                            </NavLink>
                          </NavItem>
                        </Nav>

                        <TabContent
                        activeTab={customActiveTab}
                          className="border border-top-0 p-4"
                          id="nav-tabContent"
                        >
                          <TabPane
                            id="nav-speci"
                            tabId="1"
                          >
                            <div className="table-responsive">
                              <table className="table mb-0">
                                <tbody>
                                  <tr>
                                    <th scope="row" style={{ width: "200px" }}>
                                      Material Code
                                    </th>
                                    <td>{singleProduct.material_code}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Vehicle Type</th>
                                    <td>{singleProduct.vehicle_type}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Material UOM</th>
                                    <td>{singleProduct.material_uom}</td>
                                  </tr>
                                </tbody>
                              </table>
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
      </Container>
    </div>
  );
}

export default EcommerceProductDetail;