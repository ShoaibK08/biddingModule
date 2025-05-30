import React, { useState, useEffect, useCallback, useRef } from "react";
import { shoppingCart } from "../../common/data/ecommerce";

//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Row,
  CardHeader,
  UncontrolledAlert,
} from "reactstrap";

const EcommerceCart = () => {
  const [productList, setproductList] = useState(shoppingCart);

  const [charge, setCharge] = useState(0);
  const [tax, setTax] = useState(0);
  const [dis, setDis] = useState(0);
  const [Items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(0);
  const useInfiniteScroll = (callback, isFetching) => {
    //here we use useRef to store a DOM node and the returned object will persist regardless of re-renders
    const observer = useRef();

    //useCallback takes a callback argument and an array dependency list and returns a memoized callback
    //which is guaranteed to have the same reference
    const lastElementRef = useCallback(
        (node) => {
            if (isFetching) return;

            //stop watching targets, you can think of it as a reset
            if (observer.current) observer.current.disconnect();

            //create a new intersection observer and execute the callback incase of an intersecting event
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    callback();
                }
            });

            //if there is a node, let the intersection observer watch that node
            if (node) observer.current.observe(node);
        },
        [callback, isFetching]
    );

    //return reference to the last element
    return [lastElementRef];
};

  const assigned = productList.map((item) => item.total);
  let subTotal = 0;
  for (let i = 0; i < assigned.length; i++) {
    subTotal += Math.round(assigned[i]);
  }

  useEffect(() => {
    let dis = (0.15 * subTotal);
    let tax = (0.125 * subTotal);

    if (subTotal !== 0) {
      setCharge(65);
    } else {
      setCharge(0);
    }
    setTax(dis);
    setDis(tax);
  }, [subTotal]);

  useEffect(() => {
    loadMoreItems();
}, []);

const [HasMore, setHasMore] = useState(true);

const [lastElementRef] = useInfiniteScroll(
    HasMore ? loadMoreItems : () => { },
    isFetching
);

function loadMoreItems() {

    //using axios to access the third party API
    axios({
        method: "GET",
        url: "http://localhost:8043/sapModule/getAllMaterialByPagination",
        params: { pageNO: page, pageSize: 8 },
    })
        .then((res) => {
            console.log(res)
            setItems((prevTitles) => {
                return [...new Set([...prevTitles, ...res.content])];
            });
            setPage((prevPageNumber) => prevPageNumber + 1);

            setHasMore(res.content.length > 0);
            setIsFetching(false);
        })
        .catch((e) => {
            console.log(e);
        });
}

  function removeCartItem(id) {
    var filtered = productList.filter(function (item) {
      return item.id !== id;
    });

    setproductList(filtered);
  }

  function countUP(id, prev_data_attr, itemPrice) {
    setproductList(
      productList.map((p) =>
        p.id === id ? { ...p, data_attr: prev_data_attr + 1, total: (prev_data_attr + 1) * itemPrice } : p
      )
    );
  }

  function countDown(id, prev_data_attr, itemPrice) {
    setproductList(
      productList.map((p) =>
        (p.id === id && p.data_attr > 0) ? { ...p, data_attr: prev_data_attr - 1, total: (prev_data_attr - 1) * itemPrice } : p
      )
    );
  }

  document.title = "Your Cart | Nayara Energy - Cart";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Your Cart" pageTitle="Nayara Energy" />

          <Row className="mb-3">
            <Col xl={8}>
              <Row className="align-items-center gy-3 mb-3">

                <div className=" ribbon-box mt-0 mb-lg-0"><div className="ribbon ribbon-primary ribbon-shape">Total Items : {productList.length}</div></div>

                <div className="d-flex align-end mt-2">
                  <Link
                    to="/apps-nft-explore"
                    className="left ms-auto text-decoration-underline"
                    style={{}}
                  >
                    <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2 "></i>{" "}
                    Back to Material List
                  </Link>
                </div>
              </Row>
              {productList.map((cartItem, key) => (
                <React.Fragment key={cartItem.id}>
                  <Card className="product">
                    <CardBody>
                      <Row className="gy-3">
                        <div className="col-sm-auto">
                          <div className="avatar-lg bg-light rounded p-1">
                            <img
                              src={cartItem.img}
                              alt=""
                              className="img-fluid d-block"
                            />
                          </div>
                        </div>
                        <div className="col-sm">
                          <h5 className="fs-14 text-truncate">
                            <Link
                              to="/ecommerce-product-detail"
                              className="text-dark"
                            >
                              {cartItem.name}
                            </Link>
                          </h5>
                          <ul className="list-inline text-muted">
                            <li className="list-inline-item">
                              Seller :{" "}
                              <span className="fw-medium">
                                "Nayara Energy"
                              </span>
                            </li>
                            <li className="list-inline-item">
                              Date Published :{" "}
                              <span className="fw-medium">"26 Mar, 2023"</span>
                            </li>
                          </ul>

                          <div className="input-step">
                            <button
                              type="button"
                              className="minus"
                              onClick={() => {
                                countDown(cartItem.id, cartItem.data_attr, cartItem.price);
                              }}
                            >
                              –
                            </button>
                            <Input
                              type="text"
                              className="product-quantity"
                              value={cartItem.data_attr}
                              name="demo_vertical"
                              readOnly
                            />
                            <button
                              type="button"
                              className="plus"
                              onClick={() => {
                                countUP(cartItem.id, cartItem.data_attr, cartItem.price);
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="col-sm-auto">
                          <div className="text-lg-end">
                            <p className="text-muted mb-1">Product Code:</p>
                            <h5 className="fs-14"><span id="ticket_price" className="product-price"> M002 </span>
                            </h5>
                          </div>
                        </div>
                      </Row>
                    </CardBody>

                    <div className="card-footer">
                      <div className="row align-items-center gy-3">
                        <div className="col-sm">
                          <div className="d-flex flex-wrap my-n1">
                            <div>
                              <Link
                                to="#"
                                className="d-block text-body p-1 px-2"
                                onClick={() => removeCartItem(cartItem.id)}
                              >
                                <i className="ri-delete-bin-fill text-muted align-bottom me-1"></i>{" "}
                                Remove
                              </Link>
                            </div>
                            {/* <div>
                              <Link
                                to="#"
                                className="d-block text-body p-1 px-2"
                              >
                                <i className="ri-star-fill text-muted align-bottom me-1"></i>{" "}
                                Add Wishlist
                              </Link>
                            </div> */}
                          </div>
                        </div>
                        <div className="col-sm-auto">
                          <div className="d-flex align-items-center gap-2 text-muted">
                            <div>In Stock :</div>
                            <h5 className="fs-14 mb-0"><span className="product-line-price" style={{color:'green'}}>Available</span>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </React.Fragment>
              ))}

              <div className="text-end mb-4">
                <Link
                  to="/place-indent"
                  className="btn btn-success btn-label right ms-auto"
                >
                  <i className="ri-arrow-right-line label-icon align-bottom fs-16 ms-2"></i>{" "}
                  Checkout
                </Link>
              </div>
            </Col>

            <Col xl={4}>
              <div className="sticky-side-div">
                <Card>
                  <CardHeader className="border-bottom-dashed">
                    <h5 className="card-title mb-0">Product Summary</h5>
                  </CardHeader>
                  {/* <CardHeader className="bg-soft-light border-bottom-dashed">
                    <div className="text-center">
                      <h6 className="mb-2">
                        Have a <span className="fw-semibold">promo</span> code ?
                      </h6>
                    </div>
                    <div className="hstack gap-3 px-3 mx-n3">
                      <input
                        className="form-control me-auto"
                        type="text"
                        placeholder="Enter coupon code"
                        aria-label="Add Promo Code here..."
                      />
                      <button type="button" className="btn btn-success w-xs">
                        Apply
                      </button>
                    </div>
                  </CardHeader> */}
                  <CardBody className="pt-2">
                    <div className="table-responsive">
                      <table className="table table-borderless mb-0">
                        <tbody>
                        <tr>
                            <td>Order ID :</td>
                            <td className="text-end" id="cart-subtotal">
                              ORDER-0001
                            </td>
                          </tr>
                          <tr>
                            <td>Product Code :</td>
                            <td className="text-end" id="cart-subtotal">
                              M002
                            </td>
                          </tr>
                          <tr>
                            <td>
                            Material : 
                              <span className="text-muted"></span> :{" "}
                            </td>
                            <td className="text-end" id="cart-discount">
                            Petrol
                            </td>
                          </tr>
                          <tr>
                            <td>Category :</td>
                            <td className="text-end" id="cart-shipping">
                            Petrolium
                            </td>
                          </tr>
                          
                          <tr className="table-active">
                            <th>Seller :</th>
                            <td className="text-end">
                              <span className="fw-semibold" id="cart-total">
                                Nayara Energy
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>

                {/* <UncontrolledAlert color="danger" className="border-dashed">
                  <div className="d-flex align-items-center">
                    <lord-icon
                      src="https://cdn.lordicon.com/nkmsrxys.json"
                      trigger="loop"
                      colors="primary:#121331,secondary:#f06548"
                      style={{ width: "80px", height: "80px" }}
                    ></lord-icon>
                    <div className="ms-2">
                      <h5 className="fs-14 text-danger fw-semibold">
                        {" "}
                        Buying for a loved one?
                      </h5>
                      <p className="text-black mb-1">
                        Gift wrap and personalised message on card, <br />
                        Only for <span className="fw-semibold">$9.99</span> USD
                      </p>
                      <button
                        type="button"
                        className="btn ps-0 btn-sm btn-link text-danger text-uppercase"
                      >
                        Add Gift Wrap
                      </button>
                    </div>
                  </div>
                </UncontrolledAlert> */}
              </div>
            </Col>

            <Col xl={12}>
              <div className="sticky-side-div">
                <Card>
                  <CardHeader className="border-bottom-dashed">
                    <h5 className="card-title mb-0">Simillar Products</h5>
                  </CardHeader>

                  <CardBody className="pt-2">
                    <div className="table-responsive">
                      <table className="table table-borderless mb-0">
                        <tbody>
                          <Row
                            className="row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1"
                            id="explorecard-list" 
                          >
                            {Items.map((item, key) => {
                              
                                return (<Col className="list-element" key={key} style={{width:'20%'}}>
                                  <Card className="explore-box card-animate box_shadow" >
                                    <div className="explore-place-bid-img">
                                      <input type="hidden" className="form-control" id="1" />
                                      <div className="d-none">undefined</div>
                                      <img
                                        src={process.env.PUBLIC_URL + "/subImage/" + item.image[0]}
                                        alt=""
                                        className="card-img-top explore-img img_style"
                                        style={{ height: '150px' }}
                                      />
                                      <div className="bg-overlay"></div>
                                      <div className="place-bid-btn">

                                        <Link to={'/apps-ecommerce-product-details/' + item.material_code} className="btn btn-success">
                                          <i className="ri-auction-fill align-bottom me-1"></i> View
                                        </Link>
                                      </div>
                                    </div>
                                    <CardBody className="borer_dashed">
                                      <h5 className="mb-1">
                                        <Link to="/apps-nft-item-details"><b>Name : </b>{item.material_name}</Link>
                                      </h5>
                                      <p className="text-muted mb-0"><b>Description : </b>{item.material_category}</p>
                                    </CardBody>
                                    <div className="card-footer border-top border-top-dashed box_shadow">
                                      <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 fs-14">

                                          <i className="ri-price-tag-3-fill text-warning align-bottom me-1"></i>
                                          MATERIAL CODE: <span className="fw-medium">{item.material_code}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                </Col>
                                );
                              
                            })}
                          </Row>

                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>

              </div>
            </Col>




          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EcommerceCart;
