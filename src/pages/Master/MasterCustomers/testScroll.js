import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Modal,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input, Nav, NavItem, NavLink, TabContent, TabPane,
} from "reactstrap";
import classnames from "classnames";

import { Link } from "react-router-dom";
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
  getCustomers1 as onGetCustomers,
  addNewCustomer1 as onAddNewCustomer,
  updateCustomer1 as onUpdateCustomer,
  deleteCustomer1 as onDeleteCustomer,
} from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";

import TableContainer from "../../../Components/Common/TableContainer";

import AddCustomer from "./addCustomer";

const TestScroll = () => {
  const dispatch = useDispatch();

  const { customers, isCustomerCreated, isCustomerSuccess, error } = useSelector((state) => ({
    customers: state.Master.customers,
    isCustomerCreated: state.Master.isCustomerCreated,
    isCustomerSuccess: state.Master.isCustomerSuccess,
    error: state.Master.error,
  }));

  const [isEdit, setIsEdit] = useState(false);
  const [customer, setCustomer] = useState([]);

  // Delete customer
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCustomer(null);
    } else {
      setModal(true);
    }
  }, [modal]);
 
  // Outline Border Nav Tabs
  const [outlineBorderNav, setoutlineBorderNav] = useState("1");
  const outlineBorderNavtoggle = (tab) => {
    if (outlineBorderNav !== tab) {
      setoutlineBorderNav(tab);
    }
  };

  const customerstatus = [
    {
      options: [
        { label: "Status", value: "Status" },
        { label: "All", value: "All" },
        { label: "Active", value: "Active" },
        { label: "Block", value: "Block" },
      ],
    },
  ];

  const customerType = [
    {
      options: [
        { label: "Select Customer Type", value: "" },
        { label: "Transporter", value: "Transporter" },
        { label: "Customer", value: "Customer" },
        { label: "Payer", value: "Payer" },
        { label: "Ship To", value: "Ship To" },
        { label: "Sold To", value: "Sold To" },
      ],
    },
  ];

  const customermocalstatus = [
    {
      options: [
        { label: "Select Customer Address", value: "" },
        { label: "House/Building number", value: "House/Building number" },
        { label: "Landmark", value: "Landmark" },
        { label: "Post Office", value: "Post Office" },
        { label: "Pin Code", value: "Pin Code" },
        { label: "Name Of District", value: "Name Of District" },
        { label: "Name Of State", value: "Name Of State" },
      ],
    },
  ];

  // Delete Data
  const onClickDelete = (customer) => {
    setCustomer(customer);
    setDeleteModal(true);
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      customer: (customer && customer.customer) || '',
      customerCode: (customer && customer.customerCode) || '',
      customerType: (customer && customer.customerType) || '',
      email: (customer && customer.email) || '',
      phone: (customer && customer.phone) || '',
      date: (customer && customer.date) || '',
      status: (customer && customer.status) || '',
      status1: (customer && customer.status1) || '',
    },
    validationSchema: Yup.object({
      customer: Yup.string().required("Please Enter Customer Name"),
      customerCode: Yup.string().required("Please Enter Customer Code"),
      house: Yup.string().required("Please Enter House/Building Number"),
      landmark: Yup.string().required("Please Enter Landmark"),
      postoffice: Yup.string().required("Please Enter Postoffice"),
      pincode: Yup.string().required("Please Enter Pincode"),
      district: Yup.string().required("Please Enter District"),
      state: Yup.string().required("Please Enter State"),
      email: Yup.string().required("Please Enter Your Email"),
      phone: Yup.string().required("Please Enter Your Phone"),
      status: Yup.string().required("Please Enter Your Status")
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateCustomer = {
          _id: customer ? customer._id : 0,
          customer: values.customer,
          customerCode: values.customerCode,
          customerType: values.customerType,
          email: values.email,
          phone: values.phone,
          date: date,
          status: values.status,
          status1: values.status1,
        };
        // update customer
        dispatch(onUpdateCustomer(updateCustomer));
        validation.resetForm();
      } else {
        const newCustomer = {
          _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          customer: values["customer"],
          customerCode: values["customerCode"],
          customerType: values["customerType"],
          email: values["email"],
          phone: values["phone"],
          date: date,
          status: values["status"]
        };
        // save new customer
        dispatch(onAddNewCustomer(newCustomer));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Delete Data
  const handleDeleteCustomer = () => {
    if (customer) {
      dispatch(onDeleteCustomer(customer._id));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleCustomerClick = useCallback((arg) => {
    const customer = arg;

    setCustomer({
      _id: customer._id,
      customer: customer.customer,
      customerCode: customer.customerCode,
      customerType: customer.customerType,
      email: customer.email,
      phone: customer.phone,
      date: customer.date,
      status: customer.status,
      status1: customer.status1
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);


  useEffect(() => {
    if (customers && !customers.length) {
      dispatch(onGetCustomers());
    }
  }, [dispatch, customers]);


  useEffect(() => {
    setCustomer(customers);
  }, [customers]);

  useEffect(() => {
    if (!isEmpty(customers)) {
      setCustomer(customers);
      setIsEdit(false);
    }
  }, [customers]);

  // Add Data
  const handleCustomerClicks = () => {
    setCustomer("");
    setIsEdit(false);
    toggle();
  };

  // Node API 
  // useEffect(() => {
  //   if (isCustomerCreated) {
  //     setCustomer(null);
  //     dispatch(onGetCustomers());
  //   }
  // }, [
  //   dispatch,
  //   isCustomerCreated,
  // ]);

  const handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".customerCheckBox");

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
      dispatch(onDeleteCustomer(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".customerCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Customers Column
  const columns = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {
          return <input type="checkbox" className="customerCheckBox form-check-input" value={cellProps.row.original._id} onChange={() => deleteCheckbox()} />;
        },
        id: '#',
      },
      {
        Header: '',
        accessor: 'id',
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        }
      },
      {
        Header: "Customer Code",
        accessor: "customer_code",
        filterable: false,
      },
      {
        Header: "Customer Type",
        accessor: "customer_type",
        filterable: false,
      },
      {
        Header: "Customer Name",
        accessor: "customer",
        filterable: true,
        Cell: ( {row} ) => {return (`${row.original.firstname} ${row.original.lastname}`)}
      },
      {
        Header: "Email",
        accessor: "email",
        filterable: true,
      },
      {
        Header: "Phone",
        accessor: "phone",
        filterable: false,
      },
      {
        Header: "Date",
        accessor: "date",
        filterable: false,
        Cell: (cell) => (
          <>
            {handleValidDate(cell.value)}
          </>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (cell) => {
          switch (cell.value) {
            case 1:
              return <span className="badge text-uppercase badge-soft-success"> Active </span>;
            case 0:
              return <span className="badge text-uppercase badge-soft-danger"> Block </span>;
            default:
              return <span className="badge text-uppercase badge-soft-info"> Block </span>;
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
                  onClick={() => { const customerData = cellProps.row.original; handleCustomerClick(customerData); }}
                >

                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Remove">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => { const customerData = cellProps.row.original; onClickDelete(customerData); }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleCustomerClick, checkedAll]
  );

  const dateFormat = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
  };

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

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
    HasMore ? loadMoreItems : () => {},
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
      url: "http://localhost:8043/sapModule/getAllMaterial",
      params: { pageNO: page, pageSize: 3 },
    })
      .then((res) => {
        console.log(res.content)
        setItems((prevTitles) => {
          return [...new Set([...prevTitles, ...res.content.map((b) => b.material_name)])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(res.length > 0);
        setIsFetching(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div>
      {Items.map((item, index) => {
        if (Items.length === index + 1) {
          return (
            //referencing the last item to be watched by the observer
            <div ref={lastElementRef} key={index}>
              {item} - <b>last</b>
            </div>
          );
        } else {
          return <div key={index}>{item}</div>;
        }
      })}
      {isFetching && <p>Fetching items...</p>}
    </div>
  );

};

export default TestScroll;
