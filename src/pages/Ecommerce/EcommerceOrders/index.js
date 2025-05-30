import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  Modal,
  ModalHeader,
  Form,
  ModalBody,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import * as moment from "moment";
import { Link } from "react-router-dom";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { isEmpty } from "lodash";
import Select from "react-select";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

//Import actions
import {
  getOrders as onGetOrders,
  addNewOrder as onAddNewOrder,
  updateOrder as onUpdateOrder,
  deleteOrder as onDeleteOrder,
} from "../../../store/ecommerce/action";

import Loader from "../../../Components/Common/Loader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

const EcommerceOrders = () => {
  const [modal, setModal] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const dispatch = useDispatch();

  const { orders, isOrderCreated, isOrderSuccess, error } = useSelector((state) => ({
    orders: state.Ecommerce.orders,
    isOrderCreated: state.Ecommerce.isOrderCreated,
    isOrderSuccess: state.Ecommerce.isOrderSuccess,
    error: state.Ecommerce.error,
  }));

  const [orderList, setOrderList] = useState([]);
  const [order, setOrder] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);

  const [orderStatus, setorderStatus] = useState([]);
  const [orderPayement, setorderPayement] = useState(null);

  function handleorderStatus(orderstatus) {
      setorderStatus(orderstatus);
  }

  function handleorderPayement(orderPayement) {
      setorderPayement(orderPayement);
  }

  const orderstatus = [
    {
      options: [
        { label: "Status", value: "Status" },
        { label: "All", value: "All" },
        { label: "Pending", value: "Pending" },
        { label: "Inprogress", value: "Inprogress" },
        { label: "Cancelled", value: "Cancelled" },
        { label: "Pickups", value: "Pickups" },
        { label: "Returns", value: "Returns" },
        { label: "Delivered", value: "Delivered" },
      ],
    },
  ];

  const orderpayement = [
    {
      options: [
        { label: "Select Payment", value: "Select Payment" },
        { label: "All", value: "All" },
        { label: "Mastercard", value: "Mastercard" },
        { label: "Paypal", value: "Paypal" },
        { label: "Visa", value: "Visa" },
        { label: "COD", value: "COD" },
      ],
    },
  ];

  const productname = [
    {
      options: [
        { label: "Product", value: "Product" },
        { label: "Puma Tshirt", value: "Puma Tshirt" },
        { label: "Adidas Sneakers", value: "Adidas Sneakers" },
        {
          label: "350 ml Glass Grocery Container",
          value: "350 ml Glass Grocery Container",
        },
        {
          label: "American egale outfitters Shirt",
          value: "American egale outfitters Shirt",
        },
        { label: "Galaxy Watch4", value: "Galaxy Watch4" },
        { label: "Apple iPhone 12", value: "Apple iPhone 12" },
        { label: "Funky Prints T-shirt", value: "Funky Prints T-shirt" },
        {
          label: "USB Flash Drive Personalized with 3D Print",
          value: "USB Flash Drive Personalized with 3D Print",
        },
        {
          label: "Oxford Button-Down Shirt",
          value: "Oxford Button-Down Shirt",
        },
        {
          label: "Classic Short Sleeve Shirt",
          value: "Classic Short Sleeve Shirt",
        },
        {
          label: "Half Sleeve T-Shirts (Blue)",
          value: "Half Sleeve T-Shirts (Blue)",
        },
        { label: "Noise Evolve Smartwatch", value: "Noise Evolve Smartwatch" },
      ],
    },
  ];

  const [isEdit, setIsEdit] = useState(false);
  const [checkDisplay,setCheckDisplay] = useState("none");

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const onClickDelete = (order) => {
    setOrder(order);
    setDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    if (order) {
      dispatch(onDeleteOrder(order._id));
      setDeleteModal(false);
    }
  };

  useEffect(() => {
    setOrderList(orders);
  }, [orders]);

  useEffect(() => {
    if (!isEmpty(orders)) setOrderList(orders);
  }, [orders]);

  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      let filteredOrders = orders;
      if (type !== "all") {
        filteredOrders = orders.filter((order) => order.status === type);
      }
      setOrderList(filteredOrders);
    }
  };
  
  const ActiveDeactiveTab = () => {
    const classNameUse = document.getElementsByClassName("commonThemeClass")[0];
    if(classNameUse.style.display == "none"){
      document.getElementsByClassName("commonThemeClass")[0].style.display = "block";
    }else{
      document.getElementsByClassName("commonThemeClass")[0].style.display = "none";
    }
  };



  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      orderId: (order && order.orderId) || '',
      customer: (order && order.customer) || '',
      product: (order && order.product) || '',
      orderDate: (order && order.orderDate) || '',
      // ordertime: (order && order.ordertime) || '',
      amount: (order && order.amount) || '',
      payment: (order && order.payment) || '',
      status: (order && order.status) || '',
    },
    validationSchema: Yup.object({
      orderId: Yup.string().required("Please Enter order Id"),
      customer: Yup.string().required("Please Enter Customer Name"),
      product: Yup.string().required("Please Enter Product Name"),
      // orderDate: Yup.string().required("Please Enter Order Date"),
      // ordertime: Yup.string().required("Please Enter Order Time"),
      amount: Yup.string().required("Please Enter Total Amount"),
      payment: Yup.string().required("Please Enter Payment Method"),
      status: Yup.string().required("Please Enter Delivery Status")
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateOrder = {
          _id: order ? order._id : 0,
          orderId: values.orderId,
          customer: values.customer,
          product: values.product,
          orderDate: date,
          // ordertime: values.ordertime,
          amount: values.amount,
          payment: values.payment,
          status: values.status
        };
        // update order
        dispatch(onUpdateOrder(updateOrder));
        validation.resetForm();
      } else {
        const newOrder = {
          _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          orderId: values["orderId"],
          customer: values["customer"],
          product: values["product"],
          orderDate: date,
          // ordertime: values["ordertime"],
          amount: values["amount"],
          payment: values["payment"],
          status: values["status"]
        };
        // save new order
        dispatch(onAddNewOrder(newOrder));
        validation.resetForm();
      }
      toggle();
    },
  });

  useEffect(() => {
    if (orders && !orders.length) {
      dispatch(onGetOrders());
    }
  }, [dispatch, orders]);

  useEffect(() => {
    setOrder(orders);
  }, [orders]);

  useEffect(() => {
    if (!isEmpty(orders)) {
      setOrder(orders);
      setIsEdit(false);
    }
  }, [orders]);


  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setOrder(null);
    } else {
      setModal(true);
      setDate(defaultdate());
    }
  }, [modal]);

  const handleOrderClicks = () => {
    setOrder("");
    setIsEdit(false);
    toggle();
  };

  const handleOrderClick = useCallback((arg) => {
    const order = arg;
    setOrder({
      _id: order._id,
      orderId: order.orderId,
      customer: order.customer,
      product: order.product,
      orderDate: order.orderDate,
      ordertime: order.ordertime,
      amount: order.amount,
      payment: order.payment,
      status: order.status
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);

  // Node API 
  // useEffect(() => {
  //   if (isOrderCreated) {
  //     setOrder(null);
  //     dispatch(onGetOrders());
  //   }
  // }, [
  //   dispatch,
  //   isOrderCreated,
  // ]);


  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".orderCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteOrder(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    checkall.checked = false;
    setIsMultiDeleteButton(false);
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".orderCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Column
  const columns = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {
          return <input type="checkbox" className="orderCheckBox form-check-input" value={cellProps.row.original.id} onChange={() => { deleteCheckbox(); }} />;
        },
        id: '#',
      },
      {
        Header: "Material Code",
        accessor: "material_code",
        filterable: false,
        Cell: (cell) => {
          return <Link to={"/apps-ecommerce-product-details/"+cell.value} className="fw-medium link-primary">#{cell.value}</Link>;
        },
      },
      {
        Header: "Material",
        Cell: (product) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="avatar-sm rounded p-1" style={{backgroundColor:'#d3d3d357'}}>
                  <img src={process.env.PUBLIC_URL + "/subImage/" + product.row.original.image[0]}
                    alt=""
                    className="rounded img-avatar-img img-fluid d-block"
                  />
                </div>
              </div>
              <div className="flex-grow-1">
                <h5 className="fs-14 mb-1">
                  <Link
                    to={"/apps-ecommerce-product-details/"+product.row.original.material_code}
                    className="text-dark"
                  >
                    {" "}
                    {product.row.original.material_name}
                  </Link>
                </h5>
                <p className="text-muted mb-0">
                  Category :{" "}
                  <span className="fw-medium">
                    {" "}
                    {product.row.original.material_category}
                  </span>
                </p>
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "Category",
        accessor: "material_category",
        filterable: false,
      },
      {
        Header: "Tax",
        accessor: "vat_gst",
        filterable: false,
      },
      {
        Header: "Published Date",
        accessor: "created_dt",
        Cell: (order) => (
          <>
            {handleValidDate(order.row.original.created_dt)},
            <small className="text-muted"> {handleValidTime(order.row.original.created_dt)}</small>
          </>
        ),
      },
      {
        Header: "Visibility",
        accessor: "visibility",
        Cell: (cell) => {
          switch (cell.value) {
            case 1:
              return <span className="badge text-uppercase bg-danger"> Hidden </span>;
            case 2:
              return <span className="badge text-uppercase bg-success"> Public </span>;
            default:
              return <span className="badge text-uppercase bg-danger"> Hidden </span>;
          }
        }
      },
      {
        Header: 'Published Status',
        accessor: 'status',
        Cell: (cell) => {
          switch (cell.value) {
            case 1:
              return <span className="badge text-uppercase badge-soft-warning"> Draft </span>;
            case 2:
              return <span className="badge text-uppercase badge-soft-danger"> Published </span>;
            case 3:
              return <span className="badge text-uppercase badge-soft-secondary"> Scheduled </span>;
            default:
              return <span className="badge text-uppercase badge-soft-warning"> Draft </span>;
          }
        }
      },

      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item">
                <Link
                  to={"/apps-ecommerce-product-details/"+cellProps.row.original.material_code}
                  className="text-primary d-inline-block"
                >
                  <i className="ri-eye-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item edit">
                <Link
                  to={"/apps-ecommerce-edit-product/"+cellProps.row.original.material_code}
                  className="text-primary d-inline-block edit-item-btn"
                >
                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => {
                    const orderData = cellProps.row.original;
                    onClickDelete(orderData);
                  }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleOrderClick, checkedAll]
  );

  const defaultdate = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let h = (d.getHours() % 12) || 12;
    let ampm = d.getHours() < 12 ? "AM" : "PM";
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear() + ", " + h + ":" + d.getMinutes() + " " + ampm).toString());
  };


  const [date, setDate] = useState(defaultdate());

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

  const handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  const handleValidTime = (time) => {
    const time1 = new Date(time);
    const getHour = time1.getUTCHours();
    const getMin = time1.getUTCMinutes();
    const getTime = `${getHour}:${getMin}`;
    var meridiem = "";
    if (getHour >= 12) {
      meridiem = "PM";
    } else {
      meridiem = "AM";
    }
    const updateTime = moment(getTime, 'hh:mm').format('hh:mm') + " " + meridiem;
    return updateTime;
  };

  document.title = "Material | Velzon - React Admin & Dashboard Template";
  return (
    <div className="page-content">
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={orderList}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <Container fluid>

        <BreadCrumb title="Materials" pageTitle="Ecommerce" />
        <Row>
          <Col lg={12}>
            <Card id="orderList">
              <CardHeader className="card-header border-0">
                <Row className="align-items-center gy-3">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">Explore Material</h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      <Link color="info" to="/apps-nft-explore" className="btn btn-soft-info nav-link btn-icon fs-14 filter-button"><i className="ri-grid-fill"></i></Link>
                      {" "}
                      <Link color="info" to="/apps-ecommerce-orders" className="btn btn-soft-info nav-link  btn-icon active fs-14 filter-button"><i className="ri-list-unordered"></i></Link>
                      {" "}
                      <Link color="info" to="/dashboard-projects" className="btn btn-soft-info nav-link  btn-icon fs-14 filter-button"><i className="mdi mdi-chart-bar"></i></Link>
                      {" "}
                      <Link color="info" to="/apps-calendar" className="btn btn-soft-info nav-link  btn-icon fs-14 filter-button"><i className="mdi mdi-calendar"></i></Link>
                      {" "}
                      <Link
                          to="/apps-ecommerce-add-product"
                          className="btn btn-success"
                      >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Material
                      </Link>{" "}
                      <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                        <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                        Export
                      </button>
                      {" "}
                      {isMultiDeleteButton && <button className="btn btn-soft-danger"
                        onClick={() => setDeleteModalMulti(true)}
                      ><i
                        className="ri-delete-bin-2-line"></i></button>}
                    </div>
                  </div>
                </Row>
              </CardHeader>
              <div className="card-body border border-dashed border-end-0 border-start-0">
                <form>
                    <Row>
                    <div className="col-xxl-5 col-sm-6">
                        <div className="search-box">
                            <input type="text" className="form-control search" placeholder="Search for order ID, customer, order status or something..."/>
                            <i className="ri-search-line search-icon"></i>
                        </div>
                    </div>
                    <Col sm={6} className="col-xxl-2">
                      <div>
                          <Flatpickr
                              className="form-control"
                              id="datepicker-publish-input"
                              placeholder="Select a date range"
                              options={{
                                  altInput: true,
                                  altFormat: "F j, Y",
                                  dateFormat: "d.m.y",
                              }}
                          />
                      </div>
                  </Col>
                  </Row>
                  <br/>
                  <Row>
                  <Col sm={4} className="col-xxl-2">
                      <div>
                          <Select
                              value={orderStatus}
                              onChange={(e) => {
                                  handleorderStatus(e);
                              }}
                              options={orderstatus}
                              name="choices-single-default"
                              id="idStatus"
                          ></Select>
                      </div>
                  </Col>

                  <Col sm={4} className="col-xxl-2">
                      <div>
                          <Select
                              value={orderPayement}
                              onChange={() => {
                                  handleorderPayement();
                              }}
                              options={orderpayement}
                              name="choices-payment-default"
                              id="idPayment"
                          ></Select>
                      </div>
                  </Col>

                  <Col sm={4} className="col-xxl-1">
                      <div>
                          <button type="button" className="btn btn-primary w-100">
                              {" "}
                              <i className="ri-equalizer-fill me-1 align-bottom"></i>
                              Filters
                          </button>
                      </div>
                  </Col>
                    </Row>
                </form>
            </div>
              <CardBody className="pt-0">
                <div>
                  <Nav
                    className="nav-tabs nav-tabs-custom nav-success"
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "1" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("1", "all");
                        }}
                        href="#"
                      >
                        <i className="ri-store-2-fill me-1 align-bottom"></i>{" "}
                        All Material
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "2" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("2", "Delivered");
                        }}
                        href="#"
                      >
                        <i className="ri-checkbox-circle-line me-1 align-bottom"></i>{" "}
                        Published
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "3" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("3", "Pickups");
                        }}
                        href="#"
                      >
                        <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                        Scheduled{" "}
                        <span className="badge bg-danger align-middle ms-1">
                          2
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "5" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("5", "Cancelled");
                        }}
                        href="#"
                      >
                        <i className="ri-close-circle-line me-1 align-bottom"></i>{" "}
                        Draft
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink><span className="buttonForToggle text-end" onClick={() => {
                          ActiveDeactiveTab();
                        }}>Toggle</span></NavLink>
                    </NavItem>
                  </Nav>
                  
                  {isOrderSuccess && orderList.length ? (
                    <TableContainer
                      columns={columns}
                      data={(orderList || [])}
                      isGlobalFilter={false}
                      isAddUserList={false}
                      customPageSize={5}
                      divClass="table-responsive table-card mb-1"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light text-muted"
                      handleOrderClick={handleOrderClicks}
                      isOrderFilter={false}
                      thClass="sort"
                      SearchPlaceholder='Search for order ID, customer, order status or something...'
                    />
                  ) : (<Loader error={error} />)
                  }
                </div>
                <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                  <ModalHeader className="bg-light p-3" toggle={toggle}>
                    {!!isEdit ? "Edit Order" : "Add Order"}
                  </ModalHeader>
                  <Form className="tablelist-form" onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}>
                    <ModalBody>
                      <input type="hidden" id="id-field" />

                      <div className="mb-3">
                        <Label
                          htmlFor="id-field"
                          className="form-label"
                        >
                          Id
                        </Label>
                        <Input
                          name="orderId"
                          id="id-field"
                          className="form-control"
                          placeholder="Enter Order Id"
                          type="text"
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.orderId || ""}
                          invalid={
                            validation.touched.orderId && validation.errors.orderId ? true : false
                          }
                        />
                        {validation.touched.orderId && validation.errors.orderId ? (
                          <FormFeedback type="invalid">{validation.errors.orderId}</FormFeedback>
                        ) : null}

                      </div>

                      <div className="mb-3">
                        <Label
                          htmlFor="customername-field"
                          className="form-label"
                        >
                          Material Code
                        </Label>
                        <Input
                          name="customer"
                          id="customername-field"
                          className="form-control"
                          placeholder="Enter Name"
                          type="text"
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.customer || ""}
                          invalid={
                            validation.touched.customer && validation.errors.customer ? true : false
                          }
                        />
                        {validation.touched.customer && validation.errors.customer ? (
                          <FormFeedback type="invalid">{validation.errors.customer}</FormFeedback>
                        ) : null}

                      </div>

                      <div className="mb-3">
                        <Label
                          htmlFor="productname-field"
                          className="form-label"
                        >
                          Material
                        </Label>

                        <Input
                          name="product"
                          type="select"
                          className="form-select"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={
                            validation.values.product || ""
                          }
                          required>
                          {productname.map((item, key) => (
                            <React.Fragment key={key}>
                              {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                            </React.Fragment>
                          ))}
                        </Input>
                        {validation.touched.product &&
                          validation.errors.product ? (
                          <FormFeedback type="invalid">
                            {validation.errors.product}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label htmlFor="date-field" className="form-label">
                          Published Date
                        </Label>

                        <Flatpickr
                          name="orderDate"
                          className="form-control"
                          id="datepicker-publish-input"
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
                          value={validation.values.orderDate || ""}
                        />

                        {validation.touched.orderDate && validation.errors.orderDate ? (
                          <FormFeedback type="invalid">{validation.errors.orderDate}</FormFeedback>
                        ) : null}
                      </div>
                      <div className="row gy-4 mb-3">
                        <div className="col-md-6">
                          <div>
                            <Label
                              htmlFor="amount-field"
                              className="form-label"
                            >
                              Tax
                            </Label>
                            <Input
                              name="amount"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.amount || ""}
                              invalid={
                                validation.touched.amount && validation.errors.amount ? true : false
                              }
                            />
                            {validation.touched.amount && validation.errors.amount ? (
                              <FormFeedback type="invalid">{validation.errors.amount}</FormFeedback>
                            ) : null}

                          </div>
                        </div>
                        <div className="col-md-6">
                          <div>
                            <Label
                              htmlFor="payment-field"
                              className="form-label"
                            >
                              Visibility
                            </Label>

                            <Input
                              name="payment"
                              type="select"
                              className="form-select"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={
                                validation.values.payment || ""
                              }
                            >
                              {orderpayement.map((item, key) => (
                                <React.Fragment key={key}>
                                  {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                </React.Fragment>
                              ))}
                            </Input>
                            {validation.touched.payment &&
                              validation.errors.payment ? (
                              <FormFeedback type="invalid">
                                {validation.errors.payment}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="delivered-status"
                          className="form-label"
                        >
                          Published Status
                        </Label>

                        <Input
                          name="status"
                          type="select"
                          className="form-select"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={
                            validation.values.status || ""
                          }
                        >
                          {orderstatus.map((item, key) => (
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
                    </ModalBody>
                    <div className="modal-footer">
                      <div className="hstack gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={() => {
                            setModal(false);
                          }}
                        >
                          Close
                        </button>

                        <button type="submit" className="btn btn-success">
                          {!!isEdit
                            ? "Update"
                            : "Add Customer"}
                        </button>
                      </div>
                    </div>
                  </Form>
                </Modal>
                <ToastContainer closeButton={false} limit={1} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceOrders;


