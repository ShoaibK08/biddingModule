import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Modal,
  //Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  FormFeedback,
  Nav, NavItem, NavLink, TabContent, TabPane, CardBody
} from "reactstrap";

import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { isEmpty } from "lodash";
import * as moment from "moment";
import classnames from "classnames";
import axios from "axios";
// Formik
import * as Yup from "yup";
import { useFormik,Formik,ErrorMessage, Field, Form } from "formik";

// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";

import {
  getCleaner as onGetCleaner,
  addNewCleaner1 as onAddNewCleaner,
  updateCustomer1 as onUpdateCustomer,
  deleteCustomer1 as onDeleteCustomer,
} from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import dayjs from "dayjs";


const MasterCleaner = () => {
  const dispatch = useDispatch();

  const { cleaners, isCleanerCreated, isCleanerSuccess, error } = useSelector((state) => ({
    cleaners: state.Master.cleaners,
    isCleanerCreated: state.Master.isCleanerCreated,
    isCleanerSuccess: state.Master.isCleanerSuccess,
    error: state.Master.error,
  }));

  const [outlineBorderNav, setoutlineBorderNav] = useState("1");
  const outlineBorderNavtoggle = (tab) => {
    if (outlineBorderNav !== tab) {
      setoutlineBorderNav(tab);
    }
  };
  const [isAction, setAction] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [cleaner, setCustomer] = useState([]);
  const [activeTab, setactiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);
  const [update_Doc, setupdatedDoc] = useState([]);

  //alert(update_Doc.length)

  // Delete customer
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);
  const [transporterID, setTransporterID] = useState("");

  const toggle = useCallback(() => {
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let transporterID = obj.data._id;
    setTransporterID(transporterID);
    toggleTab(1);
  
    if (modal) {
      setModal(false);
      setCustomer(null);
    } else {
      setModal(true);
    }
  }, [modal]);


  const showPreview = (id) => {
    const file = document.getElementById(id).files[0];
    if (file != undefined) {
      window.open(URL.createObjectURL(file));
    }
  }

  const showPreview1 = (docURL) => {
    const docURLRemoveInnitialPath = docURL.replace('C://ui-repo/public', '')
    window.open(process.env.PUBLIC_URL + docURLRemoveInnitialPath);
  }

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

  const customermocalstatus = [
    {
      "id": 1,
      "documentName": "Medical fitness certificate",
      "status": 1
    },
    {
      "id": 2,
      "documentName": "Police Verification",
      "status": 1
    },
    {
      "id": 3,
      "documentName": "Birth date for Min & Max age validation",
      "status": 1
    },
    {
      "id": 4,
      "documentName": "Life Insurance of Cleaner (PMJJBY)",
      "status": 1
    },
    {
      "id": 5,
      "documentName": "Healthh Insurance Pradhan mantri Jan Arogya Yojana (PMJAY)",
      "status": 1
    },
    {
      "id": 6,
      "documentName": "Insurance for Accidental death and Disability (PMSBY)",
      "status": 1
    },
    {
      "id": 7,
      "documentName": "TT crew training as per OISD 154",
      "status": 1
    },
    {
      "id": 8,
      "documentName": "Basic safety cum induction training",
      "status": 1
    },
    {
      "id": 9,
      "documentName": "Behaviour based training for TT crew",
      "status": 1
    }
  ];

  // Delete Data
  const onClickDelete = (cleaner) => {
    setCustomer(cleaner);
    setDeleteModal(true);
  };

  const ValidationSchema = Yup.object().shape({
    cleaner_code_cleaner: Yup.string().required("Please Enter Cleaner Code"),
    firstname_cleaner: Yup.string().required("Please Enter Full Name"),
    //lastname_cleaner: Yup.string().required("Please Enter Last Name"),
    contact_cleaner: Yup.string().required("Please Enter Contact Number"),
    dob_cleaner: Yup.string().required("Please Enter Date Of Birth"),
  });

  const ValidationSchema1 = Yup.object().shape({
    adhaar_cleaner: Yup.string().required("Please Enter Aadhar Number"),
    address_cleaner: Yup.string().required("Please Enter Address"),
    postOffice_cleaner: Yup.string().required("Please Enter Postoffice"),
    pincode_cleaner: Yup.string().required("Please Enter Pincode"),
  });

  const json = {};
  for (let i = 1; i <= customermocalstatus.length; i++) {
    //json["document_number"+i] = Yup.string().required("Please Enter document number");
  }
  const ValidationSchema2 = Yup.object().shape(
    json,    
  );

  
  const resetInput = (id) => {
    const file = document.getElementById(id);
    file.value = null;
  }


  // Delete Data
  const handleDeleteCustomer = () => {
    if (cleaner) {
      dispatch(onDeleteCustomer(cleaner._id));
      setDeleteModal(false);
    }
  };

  function getIndex(email) {
    return update_Doc.findIndex(obj => obj.docName === email);
  }
    
  function readFileData(event) {
    
    console.log(event.target.files);
    // event.target
    if (!event.target.files || !event.target.files[0]) return;

    const reader = new FileReader();
    const getextn = event.target.files[0];
   // alert(getextn.name.match(/\.[0-9a-z]+$/i));
   // const extn = (getextn.name).split(".")[1];
    const extn = getextn.name.match(/\.[0-9a-z]+$/i);
    event.target.setAttribute('file-extn', `${extn}`);

    // FR.addEventListener("load", function (evt) {
    //   // alert(evt.target.result)
    //   event.target.setAttribute('data-base', evt.target.result);
    //   //  document.querySelector("#img").src         = evt.target.result;
    //   //  document.querySelector("#b64").textContent = evt.target.result;
    // });

    // FR.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      // Use a regex to remove data url part
      const base64String = reader.result
        .replace('data:', '')
        .replace(/^.+,/, '');

      console.log(base64String);
      event.target.setAttribute('data-base', base64String);
      // Logs wL2dvYWwgbW9yZ...
    };
    reader.readAsDataURL(getextn);
  }
  // Update Data
  const handleCustomerClick = useCallback((arg) => {
    //const cleaner = arg;
    //console.log(cleaner);
    setAction(false);
    const cleanerCode = arg;
    axios.get(`http://localhost:8043/sapModule/getCleanerDocumentsByCleanerCode?code=${cleanerCode}`)
      .then(res => {
        const result = res;
        const summaryData = result.summary;
        setupdatedDoc(result.documents);
       // document.querySelector("#cleaner_code_cleaner").required = true;
        setCustomer({
          _id: summaryData.id,
          firstname_cleaner: summaryData.name,
          fathername_cleaner: summaryData.fatherName,
          contact_cleaner: summaryData.mobileNumber,
          cleaner_code_cleaner: summaryData.cleanerCode,
          status: summaryData.status,
          dob_cleaner: dayjs(summaryData.dateOfBirth).format("YYYY-MM-DD"),
          pincode_cleaner: summaryData.pinCode,
          postOffice_cleaner: summaryData.postOffice,
          address_cleaner: summaryData.currentAddress,
          adhaar_cleaner: summaryData.aadharNumber,
        });
        setIsEdit(true);
      //  document.getElementById("cleaner_code_cleaner").setAttribute("readOnly");
        toggle();
      });
  
  }, [toggle]);

  
  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];

      if (tab >= 1 && tab <= 3) {
       // alert(tab)
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }

  const liStyle = { display: 'none' }
  const changeBTN = (index) => {
    
    // const number = document.getElementById("num" + index);
    // const firstDate = document.getElementById("firstDate" + index);
    // const secondDate = document.getElementById("secondDate" + index);
    const fileDiv = document.getElementById("fileDiv" + index);
    const firstSec = document.getElementById("firstSec" + index);
    const viewDoc = document.getElementById("viewDoc" + index);
    const changeDoc = document.getElementById("changeDoc" + index);
    const inpDocNum = document.getElementById("inpDocNum" + index);
    const flatpickerClass = document.getElementById("flatpickerClass" + index);
    const flatpickerClass1 = document.getElementById("flatpickerClass1" + index);
    // number.value = null;
    // firstDate.value = null;
    // secondDate.value = null;
    fileDiv.style.display = "block";
    fileDiv.querySelector('.doc_uploded_class').setAttribute('required',true);
    inpDocNum.removeAttribute("readOnly");
    flatpickerClass1.classList.remove("removal-class");
    flatpickerClass.classList.remove("removal-class");
    firstSec.style.display = "block";
    viewDoc.style.display = "none";
    changeDoc.style.display = "none";
    setAction(true);
  }
  const [documentModal, setDocumentModal] = useState(false);
  const [summaryData, setSummaryData] = useState({});
  const [documentData, setDocumentData] = useState([]);
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const addDocument = async () => {
    const arr = [];
    if (isEdit) {
      if (isAction) {
        for (let i = 1; i <= customermocalstatus.length; i++) {
          const parent = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_number");
          const parent1 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("doc_uploded_class");
          const parent2 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass");
          const parent3 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass1");
          const parent4 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_name");
          console.log(parent1[0].getAttribute('data-base'));
          const json = {};
          json["code"] = sessionStorage.getItem('cleaner_code_cleaner');
          json["base64Image"] = parent1[0].getAttribute('data-base');
          json["documentId"] = parent4[0].getAttribute('data-id');
          json["documentName"] = parent4[0].innerText;
          json["documentNumber"] = parent[0].value;
          json["fromDate"] = parent2[0].value;
          json["toDate"] = parent3[0].value;
          json["filExtension"] = parent1[0].getAttribute('file-extn');
          arr.push(json);
        }
      }
      else {
        for (let i = 1; i <= customermocalstatus.length; i++) {
          const parent = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_number");
          const parent2 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass");
          const parent3 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass1");
          const parent4 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_name");
          const json = {};
          json["code"] = sessionStorage.getItem('cleaner_code_cleaner');
          json["base64Image"] = "";
          json["documentId"] = parent4[0].getAttribute('data-id');
          json["documentName"] = parent4[0].innerText;
          json["documentNumber"] = parent[0].value;
          json["fromDate"] = parent2[0].value;
          json["toDate"] = parent3[0].value;
          json["filExtension"] = "";
          arr.push(json);
        }
      }
    }
    else {
      for (let i = 1; i <= customermocalstatus.length; i++) {
        const parent = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_number");
        const parent1 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("doc_uploded_class");
        const parent2 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass");
        const parent3 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass1");
        const parent4 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_name");
        console.log(parent1[0].getAttribute('data-base'));
        const json = {};
        json["code"] = sessionStorage.getItem('cleaner_code_cleaner');
        json["base64Image"] = parent1[0].getAttribute('data-base');
        json["documentId"] = parent4[0].getAttribute('data-id');
        json["documentName"] = parent4[0].innerText;
        json["documentNumber"] = parent[0].value;
        json["fromDate"] = parent2[0].value;
        json["toDate"] = parent3[0].value;
        json["filExtension"] = parent1[0].getAttribute('file-extn');
        arr.push(json);
      }
    }

    //console.log(arr);
    
    try {
      
      const res = await axios.post('http://localhost:8043/sapModule/addDocuments', arr)
      
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }

  }

  useEffect(() => {
    if (cleaners && !cleaners.length) {
      dispatch(onGetCleaner());
    }
  }, [dispatch, cleaners]);


  useEffect(() => {
    setCustomer(cleaners);
  }, [cleaners]);

  useEffect(() => {
    if (!isEmpty(cleaners)) {
      setCustomer(cleaners);
      setIsEdit(false);
    }
  }, [cleaners]);

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

  const renderError = (message) => (
    <p className="italic text-red-600" style={{color:"red"}}>{message}</p>
  );

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

  
  const setViewModal = () => {
    setDocumentModal(!documentModal);
  };

  const viewDocument = (data) => {
    
    const cleanerNumber = data;
    axios.get(`http://localhost:8043/sapModule/getCleanerDocumentsByCleanerCode?code=${cleanerNumber}`)
      .then(res => {
        const result = res;
        setSummaryData(result.summary)
        setDocumentData(result.documents)
      })

    setViewModal();
  };

  const test = documentData.map(function (value, index) {
    
    return ([
      <>
        <tr key={index}>
          <td className="p-1 text-success "><b>{value.docName}</b></td>
          <td className="p-1 text-end">
            <Link
              to="#"
              className="text-primary d-inline-block edit-item-btn"
              onClick={() => { viewDocumentData(value.docUrl) }}
            ><button type="button" class="btn btn-sm btn-outline-success waves-effect waves-light border-success">View Document</button>
            </Link>
          </td>
        </tr>
      </>
    ]);
  });

  const viewDocumentData = (docURL) => {
    
    const docURLRemoveInnitialPath = docURL.replace('C://ui-repo/public', '')
    // alert(docURLRemoveInnitialPath)
    if (docURL) {
      //window.open('file:///C://ui-repo/public/documents/HR72F7397_Vehicle%20Fitness.pdf');
      window.open(process.env.PUBLIC_URL + docURLRemoveInnitialPath);
    }
    else {
      toast.error("Data not found!", { autoClose: 3000 });
    }

  }


  // Customers Column
  const columns = useMemo(
    () => [
      
      {
        Header: "Cleaner Code",
        accessor: "cleanerCode",
        filterable: false,
      },
      {
        Header: "Cleaner Name",
        accessor: "name",
        filterable: false,
      },
      {
        Header: "Phone",
        accessor: "mobileNumber",
        filterable: false,
      },
      {
        Header: "Address",
        accessor: "currentAddress",
        filterable: false,
      },      
      {
        Header: "Transporter Code",
        accessor: "transporterCode",
        filterable: false,
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
                  onClick={() => { const customerData = cellProps.row.original.cleanerCode; handleCustomerClick(customerData); }}
                >

                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>              
              <li className="list-inline-item" title="View">
                <Link
                  to="#"
                  className="text-success d-inline-block view-item-btn"
                  onClick={() => { const cleanerNumber = cellProps.row.original.cleanerCode; viewDocument(cleanerNumber); }}
                >
                  <i class="ri-eye-fill text-success fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Remove">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => { const customerData = cellProps.row.original.cleanerCode; onClickDelete(customerData); }}
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

  
  const CustomInputComponent = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
  }) => (
    <div>
      <input {...field} {...props} className={(touched[field.name] &&
        errors[field.name]) ? "is-invalid form-control" : "form-control"}/>{touched[field.name] &&
        errors[field.name] && <div type="invalid" class="invalid-feedback">{errors[field.name]}</div>}
      
    </div>
  );

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Cleaners | Nayara - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={cleaners}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
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
          <BreadCrumb title="Cleaners" pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Cleaner List</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        
                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); setupdatedDoc([]); toggle(); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Cleaner
                        </button>{" "}
                        <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                          Export
                        </button>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div className="cleaner_tbl">
                    {isCleanerSuccess && cleaners.length ? (
                      <TableContainer
                        columns={columns}
                        data={cleaners}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        isCustomerFilter={false}
                        SearchPlaceholder='Search for cleaner, phone, status or something...'
                        style={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
                      />
                    ) : (<Loader error={error} />)
                    }
                  </div>
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Cleaner" : "Add Cleaner"}
                    </ModalHeader>
                      <ModalBody>

                        <Nav pills className="nav-customs nav-danger mb-3 nav nav-pills">
                          <NavItem>
                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: activeTab === 1, done: (activeTab <= 2 && activeTab >= 0) }, "p-3 fs-15")} disabled>
                              Basic Informations
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: activeTab === 2, done: activeTab <= 2 && activeTab > 1 }, "p-3 fs-15")} disabled >
                              Additional Informations
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: activeTab === 3, done: activeTab <= 3 && activeTab > 2 }, "p-3 fs-15")} disabled >
                              Upload Documents
                            </NavLink>
                          </NavItem>
                        </Nav>

                        <TabContent activeTab={activeTab} className="text-muted">
                          <TabPane tabId={1} id="border-nav-home">
                          <Formik
                              initialValues={{
                                contact_cleaner: (cleaner && cleaner.contact_cleaner) || '',
                                dob_cleaner: (cleaner && cleaner.dob_cleaner) || '',
                                cleaner_code_cleaner: (cleaner && cleaner.cleaner_code_cleaner) || '',
                                firstname_cleaner: (cleaner && cleaner.firstname_cleaner) || '',
                                fathername_cleaner: (cleaner && cleaner.fathername_cleaner) || '',
                              }}
                              validationSchema={ValidationSchema}
                              onSubmit={(values) => {
                                sessionStorage.setItem('firstname_cleaner',values.firstname_cleaner);
                                sessionStorage.setItem('fathername_cleaner',values.fathername_cleaner);
                                sessionStorage.setItem('contact_cleaner',values.contact_cleaner);
                                sessionStorage.setItem('cleaner_code_cleaner',values.cleaner_code_cleaner);
                                sessionStorage.setItem('dob_cleaner',values.dob_cleaner);
                                toggleTab(2);
                              }}
                            >
                              <Form autoComplete="off">

                            <Row className="g-3">
                           
  
  
                            <Col lg={3}>
                                <div>
                                  <Label
                                    htmlFor="trans1"
                                    className="form-label"
                                  >
                                    Cleaner Code
                                  </Label>{!!isEdit ? 
                                  <>
                                  <Field
                                    name="cleaner_code_cleaner"
                                    className="form-control"
                                    placeholder="Enter Cleaner Code"
                                    type="text"
                                    readOnly={true}
                                    id="cleaner_code_cleaner"
                                    component={CustomInputComponent} 
                                  />
                                  </> : 
                                  <>
                                  <Field
                                  name="cleaner_code_cleaner"
                                  className="form-control"
                                  placeholder="Enter Cleaner Code"
                                  type="text"
                                  id="cleaner_code_cleaner"
                                  component={CustomInputComponent} 
                                />
                                </>
                                }
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    htmlFor="trans1"
                                    className="form-label"
                                  >
                                    Cleaner Full Name
                                  </Label>
                                  <Field 
                                    name="firstname_cleaner" 
                                    type="text" 
                                    component={CustomInputComponent} 
                                    placeholder="Enter Cleaner Full Name"
                                    />
                                  {/*<Field
                                   // name="firstname_cleaner"
                                    className="form-control"
                                    placeholder="Enter cleaner First Name"
                                    type="text" 
                                  />*/}
                                  
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    // htmlFor="customername-field"
                                    className="form-label"
                                  >
                                    Cleaner Father Name
                                  </Label>
                                  <Field
                                    name="fathername_cleaner"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter Father Name"
                                    type="text"
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    className="form-label"
                                  >
                                    Contact Number
                                  </Label>
                                  <Field
                                    name="contact_cleaner"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter Contact Number"
                                    type="number"
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    // htmlFor="customername-field"
                                    className="form-label"
                                  >
                                    Date Of Birth
                                  </Label>
                                  <Field
                                    name="dob_cleaner"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter Date Of Birth"
                                    type="date"
                                  />
                                </div>
                              </Col>
                            </Row>
                            <div className="hstack gap-2 justify-content-end">
                              <button type="submit" className="btn btn-success" >Next &gt;&gt;</button>
                            </div>                            
                          </Form>
                          </Formik>
                          </TabPane>
                          <TabPane tabId={2} id="border-nav-home">
                          <Formik
                          initialValues={{
                            address_cleaner: (cleaner && cleaner.address_cleaner) || '',
                            adhaar_cleaner: (cleaner && cleaner.adhaar_cleaner) || '',
                            pincode_cleaner: (cleaner && cleaner.pincode_cleaner) || '',
                            postOffice_cleaner: (cleaner && cleaner.postOffice_cleaner) || '',
                            transporterCode_cleaner: transporterID,
                            unique_id_cleaner: (cleaner && cleaner.unique_id_cleaner) || '',
                           // category_id: "",
                          }}
                          validationSchema={ValidationSchema1}
                          onSubmit={(values) => {
                            sessionStorage.setItem('unique_id_cleaner',values.unique_id_cleaner);
                            sessionStorage.setItem('transporterCode_cleaner',transporterID);
                            sessionStorage.setItem('status_cleaner',1);
                            sessionStorage.setItem('postOffice_cleaner',values.postOffice_cleaner);
                            sessionStorage.setItem('pincode_cleaner',parseInt(values.pincode_cleaner));
                            sessionStorage.setItem('marital_status_cleaner',values.marital_status_cleaner);
                            sessionStorage.setItem('license_number_cleaner',values.license_number_cleaner);
                            sessionStorage.setItem('license_issue_date_cleaner',values.license_issue_date_cleaner);
                            sessionStorage.setItem('license_expiry_date_cleaner',values.license_expiry_date_cleaner);
                            sessionStorage.setItem('adhaar_cleaner',values.adhaar_cleaner);
                            sessionStorage.setItem('address_cleaner',values.address_cleaner);
                            toggleTab(3);
                           // setModal(false);
                          }}
                        >
                        <Form autoComplete="off"> 
                            <Row className="g-3">
                              <Col lg={3}>
                                <div>
                                  <Label
                                    // htmlFor="customername-field"
                                    className="form-label"
                                  >
                                    House/Building Number
                                  </Label>
                                  <Field
                                    name="address_cleaner"
                                    className="form-control"
                                    placeholder="Enter House/Building"
                                    component={CustomInputComponent} 
                                    type="text"
                                    autoComplete="off"

                                  />
                                </div>
                              </Col>
                              
                              <Col lg={3}>
                                <div>
                                  <Label
                                    //htmlFor="status-field" 
                                    className="form-label">
                                    Post Office
                                  </Label>
                                  <Field
                                    name="postOffice_cleaner"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter Post Office"
                                    type="text"

                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    //htmlFor="status-field" 
                                    className="form-label">
                                    Pincode
                                  </Label>
                                  <Field
                                    name="pincode_cleaner"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter Pincode"
                                    type="number"
                                    maxLength={6}

                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    // htmlFor="customername-field"
                                    className="form-label"
                                  >
                                    Aadhar
                                  </Label>
                                  <Field
                                    name="adhaar_cleaner"
                                    className="form-control"
                                    placeholder="Enter Aadhar"
                                    type="text"
                                    component={CustomInputComponent} 

                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    //htmlFor="status-field" 
                                    className="form-label">
                                    Transporter Code
                                  </Label>
                                  <Field
                                    name="transporterCode_cleaner"
                                    className="form-control"
                                   // component={CustomInputComponent} 
                                    placeholder="Enter Transporter Code"
                                    type="text"
                                    defaultValue={transporterID}   
                                    readOnly                          
                                  />
                                </div>
                              </Col>
                              
                             {/**
                              * 
                              * <Col lg={3}>
                                <div>
                                  <Label
                                    //htmlFor="status-field" 
                                    className="form-label">
                                    Document Upload
                                  </Label>
                                  <Field
                                    name="documentUpload_cleaner"
                                    className="form-control"
                                    //placeholder="Enter Transporter Code"
                                    type="file"
                                    //defaultValue="TRANS004"                             
                                  />
                                </div>
                              </Col>
                              */} 
                              <div className="hstack gap-2 justify-content-right">
                                <button type="button" className="btn btn-success" onClick={() => {
                                    toggleTab(activeTab - 1);
                                  }}> &lt;&lt; Previous</button>
                              </div>
                              <div className="hstack gap-2 justify-content-end">
                                <button type="submit" className="btn btn-success" >Next &gt;&gt; </button>
                              </div>  
                              {/**
                              <div className="hstack gap-2 justify-content-end mt-4">
                                <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                                <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add cleaner"} </button>
                              </div>
                               */}
                            </Row>
                      </Form>
                            </Formik>
                          </TabPane>
                          <TabPane tabId={3} id="border-nav-home">
                          <Formik
                          initialValues={{
                            //document_number1: "",
                            //doc_uploded_class: "",
                          }}
                          validationSchema={ValidationSchema2}
                          onSubmit={(values) => {     
                            const newCleaner = {
                              "id" : (cleaner && cleaner._id ? cleaner._id : null),
                              "aadharNumber": sessionStorage.getItem('adhaar_cleaner'),
                              "cleanerCode": sessionStorage.getItem('cleaner_code_cleaner'),
                              "currentAddress": sessionStorage.getItem('address_cleaner'),
                              "dateOfBirth": sessionStorage.getItem('dob_cleaner'),
                              "district": "string",
                              "documentPath": "string",
                              "emergencyContactNumber": parseInt(sessionStorage.getItem('contact_cleaner')),
                              "emergencyContactPersonName": "string",
                              "fatherName": sessionStorage.getItem('fathername_cleaner'),
                              //"id": 0,
                              "landMark": "string",
                              "mobileNumber": parseInt(sessionStorage.getItem('contact_cleaner')),
                              "name": sessionStorage.getItem('firstname_cleaner'),
                              "pinCode": sessionStorage.getItem('pincode_cleaner'),
                              "place": "string",
                              "policeStation": "string",
                              "postOffice": sessionStorage.getItem('postOffice_cleaner'),
                              "relationWithEmergencyContactPerson": "string",
                              "state": "string",
                              "status": 1,
                              "transporterCode": sessionStorage.getItem('transporterCode_cleaner'),
                            };

                            const dispatchData = dispatch(onAddNewCleaner(newCleaner));
                           // const dispatchData = dispatch(onAddNewcleaner(newcleaner));
                            
                           // if (cleaners && !cleaners.length) {
                            //console.log(dispatch(onGetCleaner()));
                           // }
                           setTimeout(function(){
                            addDocument();
                            dispatch(onGetCleaner());
                            toggleTab(1);
                            setModal(false);
                           },2000);
                          
                          }}
                        >
                        <Form autoComplete="off" encType="multipart/form-data"> 
                            <Row className="g-3 p-4 pt-0">
                              <Row className="text-center fs-6 text-white p-2 text-bold" style={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px", background: "darkcyan" }}>

                                <Col md={2}>Document Name</Col>
                                <Col md={2}>Document Number</Col>
                                <Col md={2}>From Date</Col>
                                <Col md={2}>To Date</Col>
                                <Col md={2}>Upload Files</Col>
                                <Col md={2}>Action</Col>
                              </Row>
                              { 
                              customermocalstatus.map((value, index) => ( 
                                <Row className="row text-center p-3 pb-0 bg-light" id={"saveVehicleData_"+value.id} key={value.id}>                                
                                  
                                  {(isEdit == true && update_Doc.length !== 0 && getIndex(value.documentName) !== -1) ? 
                                      <>
                                        <Col md={2} data-id={value.id} className="document_name">{value.documentName}</Col>
                                        <Col md={2}><input type="text" id={`inpDocNum${value.id}`} readOnly className="document_number form-control" name={"document_number"+value.id} defaultValue={ update_Doc.length !== 0 && getIndex(value.documentName) !== -1 ? update_Doc[getIndex(value.documentName)].documentNo : '' } required /></Col>
                                        <Col md={2}>
                                          <div>
                                            <Flatpickr
                                              className="form-control flatpickerClass removal-class"
                                              options={{
                                                dateFormat: "Y-m-d",
                                                minDate: "today",
                                                enableTime:false
                                              }}
                                              readOnly
                                              //returnFormat="iso8601"
                                              id={`flatpickerClass${value.id}`}
                                              required
                                              placeholder="From Date"
                                              name={"From_Date_"+value.id} defaultValue={ update_Doc.length !== 0 && getIndex(value.documentName) !== -1 ? update_Doc[getIndex(value.documentName)].fromDate :  '' }

                                            />
                                          </div>
                                        </Col>
                                        <Col md={2}>
                                          <div>
                                            <Flatpickr
                                              className="form-control flatpickerClass1 removal-class"
                                              options={{
                                                dateFormat: "Y-m-d",
                                                minDate: "today",
                                                enableTime:false
                                              }}
                                              //returnFormat="iso8601"
                                              id={`flatpickerClass1${value.id}`}
                                              placeholder="To Date"
                                              required
                                              name={"To_Date_"+value.id} defaultValue={ update_Doc.length !== 0 && getIndex(value.documentName) !== -1 ? update_Doc[getIndex(value.documentName)].toDate :  '' }

                                            />
                                          </div>
                                        </Col>
                                        <Col md={2} id={`fileDiv${value.id}`} style={{display:'none'}}><input accept="image/*" type="file" className="doc_uploded_class" name={"doc_uploded_class_"+value.id} id={"set_state_"+value.id} onChange={(event) => { readFileData(event) }} style={{ width: "210px" }} />
                                        </Col>
                                        <Col md={2} id={`firstSec${value.id}`} style={{display:'none'}}>
                                          <button type="button" className="btn btn-sm" title="VIEW" onClick={() => showPreview("set_state_"+value.id)}><i className="ri-eye-fill text-success fs-16"></i></button>
                                          <button type="button" className="btn btn-sm ms-1" title="DELETE" onClick={() => resetInput("set_state_"+value.id)}><i className="ri-close-circle-line fs-16 text-danger"></i></button>
                                        </Col>

                                        <Col md={2} id={`viewDoc${value.id}`}><button type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light border-primary w-100" title="View Document" onClick={() => showPreview1(update_Doc.length !== 0 && getIndex(value.documentName) !== -1 ? update_Doc[getIndex(value.documentName)].docUrl :  '' )}>View Document</button> </Col>
                                        <Col md={2} id={`changeDoc${value.id}`}><button type="button" className="btn btn-sm btn-outline-warning waves-effect waves-light border-warning w-100" title="Change Document" onClick={() => changeBTN(value.id)}>Change Document</button> </Col>
                                      </> : 
                                      <>
                                        <Col md={2} data-id={value.id} className="document_name">{value.documentName}</Col>
                                          <Col md={2}><input type="text" className="document_number form-control" name={"document_number"+value.id} defaultValue={ update_Doc.length !== 0 && getIndex(value.documentName) !== -1 ? update_Doc[getIndex(value.documentName)].documentNo : '' } required /></Col>
                                          <Col md={2}>
                                            <div>
                                              <Flatpickr
                                                className="form-control flatpickerClass"
                                                options={{
                                                  dateFormat: "Y-m-d",
                                                  minDate: "today",
                                                enableTime:false
                                                }}
                                                //returnFormat="iso8601"
                                                placeholder="From Date"
                                                required
                                                name={"From_Date_"+value.id} defaultValue={ update_Doc.length !== 0 && getIndex(value.documentName) !== -1 ? update_Doc[getIndex(value.documentName)].fromDate :  '' }

                                              />
                                            </div>
                                          </Col>
                                          <Col md={2}>
                                            <div>
                                              <Flatpickr
                                                className="form-control flatpickerClass1"
                                                options={{
                                                  dateFormat: "Y-m-d",
                                                  minDate: "today",
                                                  enableTime:false
                                                }}
                                                //returnFormat="iso8601"
                                                placeholder="To Date"
                                                
                                                required
                                                name={"To_Date_"+value.id} defaultValue={ update_Doc.length !== 0 && getIndex(value.documentName) !== -1 ? update_Doc[getIndex(value.documentName)].toDate :  '' }

                                              />
                                            </div>
                                          </Col>
                                          <Col md={2}><input accept="image/*" required name={"doc_uploded_class_"+value.id} type="file" class="doc_uploded_class" id={"set_state_"+value.id} onChange={(event) => {
                                            readFileData(event);
                                          }}  />
                                          </Col>
                                          <Col md={2}>
                                            <button type="button" class="btn btn-sm" title="VIEW" onClick={() => showPreview("set_state_"+value.id)}><i className="ri-eye-fill text-success fs-16"></i></button>
                                            <button type="button" class="btn btn-sm ms-1" title="DELETE" onClick={() => resetInput("set_state_"+value.id)}><i className="ri-close-circle-line fs-16 text-danger"></i></button>
                                          </Col>
                                      </>
                                      }
                                </Row>                              
                              ))
                              }
                            </Row>  

                            <div className="hstack gap-2 justify-content-right">
                                <button type="button" className="btn btn-success" onClick={() => {
                                    toggleTab(activeTab - 1);
                                  }}> &lt;&lt; Previous</button>
                              </div>
                            <div className="hstack gap-2 justify-content-end">
                              <button type="button" className="btn btn-light" onClick={toggle}> Close </button>

                              <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Cleaner"} </button>
                            </div>
                          </Form> 
                          </Formik>
                          </TabPane>
                        </TabContent>
                      </ModalBody>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal isOpen={documentModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="lg" toggle={setViewModal}>
        <ModalHeader toggle={() => {
          setViewModal(!documentModal);
        }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-white fs-20">View Summary</h5>
        </ModalHeader>
        <ModalBody>
          <div className="product-content mt-0">
            <Nav tabs className="nav-tabs-custom nav-success">
              <NavItem>
                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customActiveTab === "1", })}
                  onClick={() => {
                    toggleCustom("1");
                  }}
                >Summary
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customActiveTab === "2", })}
                  onClick={() => {
                    toggleCustom("2");
                  }}
                > Documents
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={customActiveTab} className="border border-top-0 p-4" id="nav-tabContent" >
              <TabPane id="nav-detail" tabId="1" >
                <div className="table-responsive">
                  <table className="table mb-0">
                    <tbody>

                      <tr>
                        <th scope="row" style={{ width: "200px" }}> Cleaner Number</th>
                        <td style={{ width: "200px" }}>{summaryData.cleanerCode}</td>
                        <th scope="row" style={{ width: "200px" }}> Cleaner Name</th>
                        <td style={{ width: "200px" }}>{summaryData.name}</td>
                      </tr>
                      <tr>
                        <th scope="row" style={{ width: "200px" }}> Contact Number</th>
                        <td style={{ width: "200px" }}>{summaryData.mobileNumber}</td>
                        <th scope="row" style={{ width: "200px" }}> Emergency Contact Number</th>
                        <td style={{ width: "200px" }}>{summaryData.emergencyContactNumber}</td>
                        
                      </tr>
                      <tr>
                        <th scope="row" style={{ width: "200px" }}> Transporter Code</th>
                        <td style={{ width: "200px" }}>{summaryData.transporterCode}</td>
                        <th scope="row" style={{ width: "200px" }}> Address</th>
                        <td style={{ width: "200px" }}>{summaryData.currentAddress}</td>
                      </tr>                      
                      <tr>
                        <th scope="row" style={{ width: "200px" }}> Adhaar</th>
                        <td style={{ width: "200px" }}>{summaryData.aadharNumber}</td>
                        <th scope="row" style={{ width: "200px" }}> Date Of Birth</th>
                        <td style={{ width: "200px" }}>{summaryData.dateOfBirth !== null ? dayjs(summaryData.dateOfBirth).format("DD-MM-YYYY") : '-'}</td>
                      </tr>
                                           
                      <tr>
                        <th scope="row" style={{ width: "200px" }}> Post Office</th>
                        <td style={{ width: "200px" }}>{summaryData.postOffice}</td>
                        <th scope="row" style={{ width: "200px" }}> Pin Code</th>
                        <td style={{ width: "200px" }}>{summaryData.pinCode}</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </TabPane>
              <TabPane
                id="nav-speci"
                tabId="2"
              >
                <div className="table-responsive">
                  <table className="table mb-0">
                    <tbody>
                      {test}
                    </tbody>
                  </table>
                </div>
              </TabPane>
            </TabContent>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default MasterCleaner;
