import { Link } from "react-router-dom";
import { Card, CardBody, Col, Row } from "reactstrap";
import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import dateFormat from 'dateformat';
import {
  Container,
  CardHeader,
  Modal,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";

const RelatedQuota = () => {

  const [modalView, setViewModal] = useState(false);

  const toggleView = useCallback(() => {
    if (modalView) {
      setViewModal(false);
    } else {
      setViewModal(true);
    }
  }, [modalView]);
  const [rowData, setModaldata] = useState();
  const product_quantity = [
    { title: "100", year: 1994 },
    { title: "1000", year: 1972 },
    { title: "2000", year: 1974 },
    { title: "3000", year: 2008 },
    { title: "4000", year: 1957 },
    { title: "5000", year: 1957 },
  ];
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop);
  }


  const [input, setInput] = useState([]);

  const onTagsChange = (event, values) => {
    
    setInput(values);
  };
  const handler = () => {
    console.log(input);
  };

  const [Items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  //setting tha initial page
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

  //we need to know if there is more data
  const [HasMore, setHasMore] = useState(true);

  const [lastElementRef] = useInfiniteScroll(
    HasMore ? loadMoreItems : () => { },
    isFetching
  );

  //on initial mount
  useEffect(() => {
    loadMoreItems();
  }, []);

  function loadMoreItems() {
    setIsFetching(true);

    //using axios to access the third party API
    axios({
      method: "GET",
      url: "http://localhost:8043/sapModule/getCustomerQuotaByPagination",
      params: { pageNO: page, pageSize: 4 },
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

  function toTitleCase(str) {
    const titleCase = str
      .toLowerCase()
      .split(' ')
      .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');

    return titleCase;
  }
  return (
    <React.Fragment>

      <Row >
        <Modal id="showViewModal" isOpen={modalView} toggle={toggleView} centered size="lg">
          <ModalHeader className="bg-light p-3" toggle={toggleView}>
            View Quota
          </ModalHeader>
          <ModalBody>
            <Row className="gy-3">
              <div className="col-sm-auto">
                <div className="avatar-lg bg-light rounded p-1">
                  <img
                    src={process.env.PUBLIC_URL + "/subImage/" + rowData?.image[0]}
                    alt=""
                    className="img-fluid d-block"
                  />

                  <h5 className="fs-14 text-truncate mt-4 text-center"><span className="product-price" style={{ color: 'Green' }}> {rowData?.material_name} </span></h5>
                  <h5 className="fs-14 text-truncate mt-4 text-center"><span className="product-price" style={{ color: 'blue' }}> {rowData?.material_code} </span></h5>
                </div>
              </div>
              <div className="col-sm">


                <div className="table-responsive" style={{paddingRight:'15px'}}>
                  <table className="table mb-0">
                    <tbody>
                      <tr>
                        <th scope="row">  Customer ID :{" "} </th>
                        <td>{rowData?.soldtoparty_code}</td>
                        <th scope="row">  Cusomer Name :{" "}</th>
                        <td>{rowData?.firstName}{" "}{rowData?.lastName}</td>
                      </tr>
                      <tr>
                        <th scope="row">  Address :{" "} </th>
                        <td>{rowData?.address}</td>
                        <th scope="row">   Remarks :{" "} </th>
                        <td>{rowData?.quota_remarks}</td>
                      </tr>
                      <tr>
                        <th scope="row">  Allotted Quota :{" "} </th>
                        <td>{rowData?.quota_allotted}</td>
                        <th scope="row">  Pending Quota :{" "} </th>
                        <td>----</td>
                      </tr>
                      <tr>
                        <th scope="row"> From Date : <i className="ri-time-line text-primary me-1 align-bottom"></i>{" "} </th>
                        <td>{dateFormat(rowData?.from_date, "mmmm dS, yyyy")}</td>
                        <th scope="row">  To Date : <i className="ri-time-line text-primary me-1 align-bottom"></i>{" "} </th>
                        <td>{dateFormat(rowData?.to_date, "mmmm dS, yyyy")}</td>
                      </tr>

                    </tbody>
                  </table>
                </div>





              </div>

              {/* <div className="col-sm-auto">
                          <div className="text-lg-end">
                            <p className="text-muted mb-1">Product Code:</p>
                            <h5 className="fs-14"><span id="ticket_price" className="product-price"> M002 </span>
                            </h5>
                          </div>
                        </div> */}
            </Row>
          </ModalBody>
          <ModalFooter className="d-inline">
            <Row className="">
              <Col sm={6}>
                <div className="mb-3">
                  <Label
                    htmlFor="billinginfo-lastName"
                    className="form-label"
                  >
                    Product Quantity
                  </Label>
                  <Autocomplete style={{ marginTop: '-15px' }}
                    multiple
                    freeSolo
                    options={product_quantity}
                    getOptionLabel={option => option.title || option}
                    onChange={onTagsChange}
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
                    value={rowData?.material_uom}
                  //placeholder="Enter last name"
                  />
                </div>
              </Col>

            </Row>
            <Row>
              <Col sm={6}>
                <div className="text-end mb-4">
                  <a
                    className="btn btn-success btn-label right ms-auto"
                    style={{ width: '100%' }}
                    onClick={() => tog_backdrop()}
                  >
                    <i className="ri-arrow-right-line label-icon align-bottom fs-16 ms-2"></i>{" "}
                    Add To Cart
                  </a>
                </div>
              </Col>
              <Col sm={6}>
                <div className="text-end mb-4">
                  <Link
                    to="/place-indent"
                    className="btn btn-warning btn-label right ms-auto"
                    style={{ width: '100%' }}
                  >
                    <i className="ri-arrow-right-line label-icon align-bottom fs-16 ms-2"></i>{" "}
                    Place Indent
                  </Link>
                </div>
              </Col>
            </Row>
          </ModalFooter>
        </Modal>
      </Row>
      {/*Items.map((item, key) => {
           return (
           <Col xl={3} ref={lastElementRef} key={key}>
            <Card className="simple-border-line">
              <CardBody>
              <ul class="list-inline hstack gap-2 mb-0 float-end">
                    <li class="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="View">
                        <a href="#" onClick={() => { toggleView(); }} class="text-primary d-inline-block">
                            <i class="ri-eye-fill fs-16"></i>
                        </a>
                    </li>
                    <li class="list-inline-item edit" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Edit">
                        <a href="#showModal" data-bs-toggle="modal" class="text-primary d-inline-block edit-item-btn">
                            <i class="ri-pencil-fill fs-16"></i>
                        </a>
                    </li>
                    <li class="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Remove">
                        <a class="text-danger d-inline-block remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                            <i class="ri-delete-bin-5-fill fs-16"></i>
                        </a>
                    </li>
      <Row>
        <Modal id="showViewModal" isOpen={modalView} toggle={toggleView} centered >
          <ModalHeader className="bg-light p-3" toggle={toggleView}>
            View Quota
          </ModalHeader>
        </Modal>



        {quotaList.map((item, key) => (
          <Col xl={3} key={key}>
            <div className="mb-1 ribbon-box overflow-hidden card">
              
              <div class="ribbon ribbon-success round-shape" style={{background:`#${item.color}`}}>
                  <span class="trending-ribbon-text"> Code :  </span> {toTitleCase(item.product_name)}
              </div>
              <div style={{ margin: '5px 10px 0 0' }}>
                <ul className="list-inline hstack gap-2 mb-0 float-end">
                  <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="View">
                    <a href="#" onClick={() => { toggleView(); }} className="text-primary d-inline-block">
                      <i className="ri-eye-fill fs-16"></i>
                    </a>
                  </li>
                  <li className="list-inline-item edit" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Edit">
                    <a href="#showModal" data-bs-toggle="modal" className="text-primary d-inline-block edit-item-btn">
                      <i className="ri-pencil-fill fs-16"></i>
                    </a>
                  </li>
                  <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Remove">
                    <a className="text-danger d-inline-block remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                      <i className="ri-delete-bin-5-fill fs-16"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <a className="d-flex align-items-center border-bottom mb-2" id="leadInnerDiscovered23" href="">
                  <div className="flex-shrink-0" style={{marginTop:'-5px'}}>
                    <img src={process.env.PUBLIC_URL+"/subImage/"+item.image[0]} alt="" class="avatar-xs rounded-circle"></img>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="fs-15 mb-1">{item.soldtoparty_code} : {item.firstName}{" "}{item.lastName}</h6>
                    <p className="text-muted mb-1">Address : {item.address}</p>

                  </div>
                </a>
                <div>
                    <p className="text-muted mb-1"><b>From :</b> <i className="ri-time-line text-primary me-1 align-bottom"></i>{" "} {dateFormat(item.from_date, "mmmm dS, yyyy")}</p>
                    <p className="text-muted mb-1"><b>To : </b><i className="ri-time-line text-primary me-1 align-bottom"></i>{" "}{dateFormat(item.to_date, "mmmm dS, yyyy")}</p>
                    <p className="text-muted mb-1"><b>Remarks : </b>{item.quota_remarks}</p>
                    <p className="text-muted mb-1"><b>Allotted Quota : </b>{item.quota_allotted}</p>
                    <p className="text-muted mb-1"><b>Pending Quota : </b>30</p>
                  </div>
              </div>
            </div>
          </Col>

        )} )}
        {isFetching && "data is loading ..."}
*/
      }
      <Row className="row-cols-xxl-4 row-cols-xl-4 row-cols-lg-4 row-cols-md-3 row-cols-2" id="explorecard-list" >
        {Items.map((item, key) => {
          if (Items.length === key + 1) {
            return (
              <div ref={lastElementRef} key={key}>
                <Col class="list-element" key={key} style={{ margin: '7px 0' }}>
                  <div className="mb-1 ribbon-box overflow-hidden card">

                    <div class="ribbon ribbon-success round-shape" style={{ background: `#${item.color}` }}>
                      <span class="trending-ribbon-text"> Code :  </span> {toTitleCase(item.product_name)}
                    </div>
                    <div style={{ margin: '5px 10px 0 0' }}>
                      <ul className="list-inline hstack gap-2 mb-0 float-end">
                        <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="View">
                          <a href="#" onClick={() => { setModaldata(item); toggleView(); }} className="text-primary d-inline-block">
                            <i className="ri-eye-fill fs-16"></i>
                          </a>
                        </li>
                        <li className="list-inline-item edit" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Edit">
                          <a href="#showModal" data-bs-toggle="modal" className="text-primary d-inline-block edit-item-btn">
                            <i className="ri-pencil-fill fs-16"></i>
                          </a>
                        </li>
                        <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Remove">
                          <a className="text-danger d-inline-block remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                            <i className="ri-delete-bin-5-fill fs-16"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="card-body">
                      <a className="d-flex align-items-center border-bottom mb-2" id="leadInnerDiscovered23" href="">
                        <div className="flex-shrink-0" style={{ marginTop: '-5px' }}>
                          <img src={process.env.PUBLIC_URL + "/subImage/" + item.image[0]} alt="" class="avatar-xs rounded-circle"></img>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="fs-15 mb-1"><span style={{ color: 'Green' }}>ID : {item.soldtoparty_code}</span></h6>
                          <h6 className="fs-15 mb-1"><span style={{ color: 'blue', textTransform: 'capitalize' }}>NAME : {item.firstName}{" "}{item.lastName}</span></h6>
                          <p className="text-muted mb-1"><span style={{ color: 'purple', textTransform: 'capitalize' }}>ADDRESS : {item.address}</span></p>

                        </div>
                      </a>
                      <div>
                        <p className="text-muted mb-1 font-ui"><b>From :</b> <i className="ri-time-line text-primary me-1 align-bottom"></i>{" "} {dateFormat(item.from_date, "mmmm dS, yyyy")}</p>
                        <p className="text-muted mb-1 font-ui"><b>To : </b><i className="ri-time-line text-primary me-1 align-bottom"></i>{" "}{dateFormat(item.to_date, "mmmm dS, yyyy")}</p>
                        <p className="text-muted mb-1 font-ui"><b>Remarks : </b>{item.quota_remarks}</p>
                        <p className="text-muted mb-1 font-ui"><b>Allotted Quota : </b>{item.quota_allotted}</p>
                        <p className="text-muted mb-1 font-ui"><b>Pending Quota : </b>30</p>
                      </div>
                    </div>
                  </div>
                </Col>
              </div>
            )
          } else {
            return (
              <Col class="list-element" key={key} style={{ margin: '7px 0' }}>
                <div className="mb-1 ribbon-box overflow-hidden card">

                  <div class="ribbon ribbon-success round-shape" style={{ background: `#${item.color}` }}>
                    <span class="trending-ribbon-text"> Code :  </span> {toTitleCase(item.product_name)}
                  </div>
                  <div style={{ margin: '5px 10px 0 0' }}>
                    <ul className="list-inline hstack gap-2 mb-0 float-end">
                      <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="View">
                        <a href="#" onClick={() => { setModaldata(item); toggleView(); }} className="text-primary d-inline-block">
                          <i className="ri-eye-fill fs-16"></i>
                        </a>
                      </li>
                      <li className="list-inline-item edit" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Edit">
                        <a href="#showModal" data-bs-toggle="modal" className="text-primary d-inline-block edit-item-btn">
                          <i className="ri-pencil-fill fs-16"></i>
                        </a>
                      </li>
                      <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Remove">
                        <a className="text-danger d-inline-block remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                          <i className="ri-delete-bin-5-fill fs-16"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    <a className="d-flex align-items-center border-bottom mb-2" id="leadInnerDiscovered23" href="">
                      <div className="flex-shrink-0" style={{ marginTop: '-5px' }}>
                        <img src={process.env.PUBLIC_URL + "/subImage/" + item.image[0]} alt="" class="avatar-xs rounded-circle"></img>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="fs-15 mb-1"><span style={{ color: 'Green' }}>ID : {item.soldtoparty_code}</span></h6>
                        <h6 className="fs-15 mb-1"><span style={{ color: 'blue', textTransform: 'capitalize' }}>NAME : {item.firstName}{" "}{item.lastName}</span></h6>
                        <p className="text-muted mb-1"><span style={{ color: 'purple', textTransform: 'capitalize' }}>ADDRESS : {item.address}</span></p>

                      </div>
                    </a>
                    <div>
                      <p className="text-muted mb-1 font-ui"><b>From :</b> <i className="ri-time-line text-primary me-1 align-bottom"></i>{" "} {dateFormat(item.from_date, "mmmm dS, yyyy")}</p>
                      <p className="text-muted mb-1 font-ui"><b>To : </b><i className="ri-time-line text-primary me-1 align-bottom"></i>{" "}{dateFormat(item.to_date, "mmmm dS, yyyy")}</p>
                      <p className="text-muted mb-1 font-ui"><b>Remarks : </b>{item.quota_remarks}</p>
                      <p className="text-muted mb-1 font-ui"><b>Allotted Quota : </b>{item.quota_allotted}</p>
                      <p className="text-muted mb-1 font-ui"><b>Pending Quota : </b>30</p>
                    </div>
                  </div>
                </div>
              </Col>
            );
          }
        })}
        {isFetching && <div className="text-center mb-3">
                            <button className="btn btn-link text-success mt-2" id="loadmore">
                                <i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2"></i>
                                Load More
                            </button>
                        </div>}

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
      </Row>
    </React.Fragment>
  );
};

export default RelatedQuota;
