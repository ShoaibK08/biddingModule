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
  getCluster as onGetCluster,
  addNewCluster1 as onAddNewCluster,
  updateCluster1 as onUpdateCluster,
  deleteCustomer1 as onDeleteCustomer,
} from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import dayjs from "dayjs";


const MasterClusters = () => {
  const dispatch = useDispatch();

  const { clusters, isClusterCreated, isClusterSuccess, error } = useSelector((state) => ({
    clusters: state.Master.clusters,
    isClusterCreated: state.Master.isClusterCreated,
    isClusterSuccess: state.Master.isClusterSuccess,
    error: state.Master.error,
  }));

  const [outlineBorderNav, setoutlineBorderNav] = useState("1");
  const outlineBorderNavtoggle = (tab) => {
    if (outlineBorderNav !== tab) {
      setoutlineBorderNav(tab);
    }
  };

  const [isEdit, setIsEdit] = useState(false);
  const [cluster, setCluster] = useState([]);
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
      setCluster(null);
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
      "documentName": "Life Insurance of Cluster (PMJJBY)",
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
  const onClickDelete = (cluster) => {
    setCluster(cluster);
    setDeleteModal(true);
  };

  const ValidationSchema = Yup.object().shape({
    clusterContactPerson: Yup.string().required("Please Enter Cluster Contact Person"),
    clusterContact: Yup.string().required("Please Enter Cluster Contact Number"),
    clusterName: Yup.string().required("Please Enter Full Name"),
    clusterCode: Yup.string().required("Please Enter Cluster Code"),
    clusterType: Yup.string().required("Please Enter Cluster Type"),
    clusterState: Yup.string().required("Please Enter Cluster State"),
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
    if (cluster) {
      dispatch(onDeleteCustomer(cluster._id));
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
      const cluster = arg;
      console.log(cluster)
      setCluster({
        _id: cluster.id,
        clusterCode: cluster.clusterCode,
        clusterName: cluster.clusterName,
        clusterType: cluster.clusterType,
        clusterState: cluster.clusterState,
        clusterContactPerson: cluster.contactPerson,
        clusterContact: cluster.contactNumber,
        status: cluster.status,
      });
  
      setIsEdit(true);
      toggle();
  
  }, [toggle]);


  const handleCustomerClickView = useCallback((arg) => {
    const cluster = arg;
    setCluster({
      _id: cluster.id,
      clusterCode: cluster.clusterCode,
      clusterName: cluster.clusterName,
      clusterType: cluster.clusterType,
      clusterState: cluster.clusterState,
      clusterContactPerson: cluster.contactPerson,
      clusterContact: cluster.contactNumber,
      status: cluster.status,
    });

    setIsEdit(false);
    setViewModal();

});

  
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
    // number.value = null;
    // firstDate.value = null;
    // secondDate.value = null;
    fileDiv.style.display = "block";
    fileDiv.querySelector('.doc_uploded_class').setAttribute('required',true);
    firstSec.style.display = "block";
    viewDoc.style.display = "none";
    changeDoc.style.display = "none";

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


  useEffect(() => {
    if (clusters && !clusters.length) {
      dispatch(onGetCluster());
    }
  }, [dispatch, clusters]);


  useEffect(() => {
    setCluster(clusters);
  }, [clusters]);

  useEffect(() => {
    if (!isEmpty(clusters)) {
      setCluster(clusters);
      setIsEdit(false);
    }
  }, [clusters]);

  // Add Data
  const handleCustomerClicks = () => {
    setCluster("");
    setIsEdit(false);
    toggle();
  };

  // Node API 
  // useEffect(() => {
  //   if (isCustomerCreated) {
  //     setCluster(null);
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

  // Customers Column
  const columns = useMemo(
    () => [
      {
        Header: "Cluster Code",
        accessor: "clusterCode",
        filterable: false,
      },
      {
        Header: "Cluster Name",
        accessor: "clusterName",
        filterable: false,
      },
      {
        Header: "Cluster Type",
        accessor: "clusterType",
        filterable: false,
      },
      {
        Header: "Cluster State",
        accessor: "clusterState",
        filterable: false,
      },      
      {
        Header: "Cluster Phone",
        accessor: "contactNumber",
        filterable: false,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (cell) => {
          switch (cell.value) {
            case "1":
              return <span className="badge text-uppercase badge-soft-success"> Active </span>;
            case "0":
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
              <li className="list-inline-item" title="View">
                <Link
                  to="#"
                  className="text-success d-inline-block view-item-btn"
                  onClick={() => { const clusterNumber = cellProps.row.original; handleCustomerClickView(clusterNumber); }}
                >
                  <i class="ri-eye-fill text-success fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Remove">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => { const customerData = cellProps.row.original.clusterCode; onClickDelete(customerData); }}
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

  document.title = "Clusters | Nayara - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={clusters}
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
          <BreadCrumb title="Clusters" pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Cluster List</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        {isMultiDeleteButton && <button className="btn btn-soft-danger me-1"
                          onClick={() => setDeleteModalMulti(true)}
                        ><i className="ri-delete-bin-2-line"></i></button>}
                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); setupdatedDoc([]); toggle(); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Cluster
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
                  <div className="cluster_tbl">
                      <TableContainer
                        columns={columns}
                        data={clusters}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        isCustomerFilter={false}
                        SearchPlaceholder='Search for cluster, phone, status or something...'
                        style={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
                      />
                  </div>
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Cluster" : "Add Cluster"}
                    </ModalHeader>
                      <ModalBody>
                        
                          <Formik
                              initialValues={{
                                clusterCode: (cluster && cluster.clusterCode) || '',
                                clusterName: (cluster && cluster.clusterName) || '',
                                clusterState: (cluster && cluster.clusterState) || '',
                                clusterType: (cluster && cluster.clusterType) || '',
                                clusterContact: (cluster && cluster.clusterContact) || '',
                                clusterContactPerson: (cluster && cluster.clusterContactPerson) || '',
                              }}
                              validationSchema={ValidationSchema}
                              onSubmit={(values) => {
                                if (isEdit) {
                                  const clusterDataUp = {
                                    id: cluster ? cluster._id : 0,
                                    clusterCode: values.clusterCode,
                                    clusterState: values.clusterState,
                                    clusterType: values.clusterType,
                                    clusterName: values.clusterName,
                                    contactNumber: values.clusterContact,
                                    contactPerson: values.clusterContactPerson,
                                    status: "1"
                                  };
                                  // update cluster
                                  dispatch(onUpdateCluster(clusterDataUp));
                                  toggle();
                                }else{
                                const clusterData = {
                                    "clusterCode": values.clusterCode,
                                    "clusterName": values.clusterName,
                                    "clusterState": values.clusterState,
                                    "clusterType": values.clusterType,
                                    "contactNumber": values.clusterContact,
                                    "contactPerson": values.clusterContactPerson,
                                    "status": "1"
                                  };
                                  dispatch(onAddNewCluster(clusterData));
                                  toggle();
                                }
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
                                    Cluster Code
                                  </Label>
                                  <Field
                                    name="clusterCode"
                                    className="form-control"
                                    placeholder="Enter Cluster Code"
                                    type="text"
                                    readOnly = {!!isEdit ? true : false}
                                    component={CustomInputComponent} 
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    htmlFor="trans1"
                                    className="form-label"
                                  >
                                    Cluster Full Name
                                  </Label>
                                  <Field 
                                    name="clusterName" 
                                    type="text" 
                                    readOnly = {!!isEdit ? true : false}
                                    component={CustomInputComponent} 
                                    placeholder="Enter Cluster Full Name"
                                    />
                                  {/*<Field
                                   // name="firstname_cluster"
                                    className="form-control"
                                    placeholder="Enter cluster First Name"
                                    type="text" 
                                  />*/}
                                  
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    htmlFor="trans2"
                                    className="form-label"
                                  >
                                    Cluster Type
                                  </Label>
                                  <Field
                                    name="clusterType"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter Cluster Type"
                                    type="text" 
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    // htmlFor="customername-field"
                                    className="form-label"
                                  >
                                    Cluster State
                                  </Label>
                                  <Field
                                    name="clusterState"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter Cluster State"
                                    type="text"
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    // htmlFor="customername-field"
                                    className="form-label"
                                  >
                                    Cluster Contact Person
                                  </Label>
                                  <Field
                                    name="clusterContactPerson"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter Cluster Contact Person"
                                    type="text"
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    className="form-label"
                                  >
                                    Cluster Contact Number
                                  </Label>
                                  <Field
                                    name="clusterContact"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter Cluster Contact Number"
                                    type="number"
                                  />
                                </div>
                              </Col>
                            </Row>
                            <div className="hstack gap-2 justify-content-end">
                              <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                              <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Cluster"} </button>
                            </div>                          
                          </Form>
                          </Formik>
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
          <h5 className="text-white fs-20">View Cluster</h5>
        </ModalHeader>
        <ModalBody>
          <div className="product-content mt-0">
            <Nav tabs className="nav-tabs-custom nav-success">
              <NavItem>
                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customActiveTab === "1", })}
                  onClick={() => {
                    toggleCustom("1");
                  }}
                >Cluster
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={customActiveTab} className="border border-top-0 p-4" id="nav-tabContent" >
              <TabPane id="nav-detail" tabId="1" >
                <div className="table-responsive">
                  <table className="table mb-0">
                    <tbody>

                      <tr>
                        <th scope="row" style={{ width: "200px" }}> Cluster Code</th>
                        <td style={{ width: "200px" }}>{(cluster && cluster.clusterCode) || ''}</td>
                        <th scope="row" style={{ width: "200px" }}> Cluster Name</th>
                        <td style={{ width: "200px" }}>{(cluster && cluster.clusterName) || ''}</td>
                      </tr>
                      <tr>
                        
                        <th scope="row" style={{ width: "200px" }}> Contact Person</th>
                        <td style={{ width: "200px" }}>{(cluster && cluster.clusterContactPerson) || ''}</td>
                        <th scope="row" style={{ width: "200px" }}> Contact Number</th>
                        <td style={{ width: "200px" }}>{(cluster && cluster.clusterContact) || ''}</td>
                        
                      </tr>
                      <tr>
                        <th scope="row" style={{ width: "200px" }}> Cluster Type</th>
                        <td style={{ width: "200px" }}>{(cluster && cluster.clusterType) || ''}</td>
                        <th scope="row" style={{ width: "200px" }}> Cluster state</th>
                        <td style={{ width: "200px" }}>{(cluster && cluster.clusterState) || ''}</td>
                      </tr>  

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

export default MasterClusters;
