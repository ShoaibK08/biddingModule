import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
//import '../ApprovalScreen/Roles.css';
import TableContainer from "../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../Components/Common/Loader";
import classnames from "classnames";

const initialValues = {
  id: "",
  plantCode: "",
  companyCode: "",
  movementCode: "",
  materialType: "",
  vehicleNumber: "",
  mapPlantStageLocation: "",
  yardIn: "",
  tareWeight: "",
  grossWeight: "",
  packingIn: "",
  packingOut: "",
  unloadingIn: "",
  unloadingOut: "",
  yardOut: "",
  abortedTime: "",
  sealNumber: "",
  tripId: "",
  driverId: "",
  abortedRemarks: "",
  abortedBy: "",
  status: "",
  regSerialNumber: "",
  tripCreationType: "",
  documentApproval: "",
};


const ApprovalScreen = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [devices, setDevice] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [documentModal, setDocumentModal] = useState(false);
  const [rejectModal, setViewRejectModal] = useState(false);
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [documentData, setDocumentData] = useState([]);
  const [vehicleNo, setVehicleNo] = useState('');

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);


  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const setViewModal = () => {
    setDocumentModal(!documentModal);
  };

  const setRejectModal = () => {
    setViewRejectModal(!rejectModal);
  };

  useEffect(() => {
    getAllDeviceData();

  }, []);

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: process.env.REACT_APP_API_USER_NAME,
      password: process.env.REACT_APP_API_PASSWORD,
    },
  };

  const getAllDeviceData = () => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/approvalScreen`, config)
      .then(res => {
        const device = res;
        setDevice(device);
      });
  }

  const test = documentData.map(function (value, index) {

    return ([
      <>
        <tr key={index}>
          <td className="p-1"><b>{value.documentName}</b></td>
          <td className="p-1 "><b>{value.validToDate}</b></td>
          <td className="p-1 text-end" style={{ letterSpacing: '22px' }}>

            <Link
              to="#"
              className="text-primary d-inline-block approve-item-btn" title="View Document"
              onClick={() => { viewDocumentData(value.documentURL) }}
            > <i className="ri-eye-fill text-success fs-16"></i>
            </Link>
            {/* <Link
              to="#"
              className="text-primary d-inline-block approve-item-btn" title='Approve Document'
            // onClick={() => { const indentNumber = cellProps.row.original.indentNo; approveClick(indentNumber); }}
            ><i className="ri-checkbox-circle-line fs-16 text-success"></i>
            </Link>
            <Link
              to="#"
              className="text-danger d-inline-block reject-item-btn" title='Reject Document'
            // onClick={() => { const indentNumber = cellProps.row.original.indentNo; rejectClick(indentNumber); }}
            ><i className="ri-close-circle-line fs-16 text-danger"></i>
            </Link> */}
          </td>
          {/* <td className="p-1 text-end">
          
          </td>
          <td className="p-1 text-end">
          
          </td> */}
        </tr>
      </>
    ]);
  });

  const viewDocumentData = (docURL) => {
    
    const docURLRemoveInnitialPath = docURL.replace(process.env.REACT_APP_DOC_URL, '')
    // alert(docURLRemoveInnitialPath)
    if (docURL) {
      // window.open('file:///C:/eplmsui/public/documents/20231009/20231009140825_Aadhar.png');
      window.open(process.env.PUBLIC_URL + docURLRemoveInnitialPath);
    }
    else {
      toast.error("Data not found!", { autoClose: 3000 });
    }

  }


  const viewDocument = (data) => {

    const vehicleNumber = data.registrationNumber;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/GetApprovalScreen/${vehicleNumber}`, config)
      .then(res => {
        const result = res;
        setDocumentData(result)
      })

    setViewModal();
  };

  const approveDocument = (data) => {
    const email1 = JSON.parse(sessionStorage.getItem('authUser'));
    const emailNew1 = email1.data.email
    const vehicleNumber = data.registrationNumber;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/approval/verify/${vehicleNumber}/${emailNew1}`, config)
    .then(res =>{ 
      if (res.message =="Approved successfully"){
        toast.success("Approve Successfully", { autoClose: 3000 });
      }
      else{
        toast.error(res.message, { autoClose: 3000 });
      }

    })



  };

  const rejectDocument = (data) => {
    setVehicleNo(data.registrationNumber);
    setRejectModal();
  };
 const RejectVehicle =() => {
  
  var email = JSON.parse(sessionStorage.getItem('authUser'));
  var emailNew = email.data.email
  var remarks = document.getElementById("rejectRemarks").value;
  axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/yard-in/approval/cancel/${vehicleNo}/${emailNew}?remark=${remarks}`, config)
  .then(res =>{ 
    if (res.message =="Approvel denied!"){
      toast.success("Reject Successfully", { autoClose: 3000 });
    }
    else{
      toast.error(res.message, { autoClose: 3000 });
    }

  })
  setViewRejectModal(false)
 }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
    });
  };

  // Outline Border Nav Tabs
  const [outlineBorderNav, setoutlineBorderNav] = useState("1");
  const outlineBorderNavtoggle = (tab) => {
    if (outlineBorderNav !== tab) {
      setoutlineBorderNav(tab);
    }
  };



  const checkFirstTabvalue = (tab) => {
    
    if (document.getElementById("validationDefault01").value === "" || document.getElementById("validationDefault03").value === "" || document.getElementById("validationDefault04").value === "") {
      return false;
    }
    else {
      if (outlineBorderNav !== tab) {
        setoutlineBorderNav(tab);
      }
    }
  }

  const handleSubmit = async (e) => {

    console.log(values)
    e.preventDefault();
    try {
      if (isEdit) {
        const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/roles/${CurrentID}`, values, config)
        console.log(res);
        toast.success("Roles Updated Successfully", { autoClose: 3000 });
        getAllDeviceData();
      }
      else {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/roles`, values, config)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Roles Added Successfully.", { autoClose: 3000 });
        }
        else {
          toast.error("Data Already Exist.", { autoClose: 3000 });
        }
        getAllDeviceData();
      }
    }
    catch (e) {
      toast.error("Something went wrong!", { autoClose: 3000 });
    }
    toggle();
  };



  // Add Data
  const handleCustomerClicks = () => {
    setIsEdit(false);
    toggle();
  };


  // Delete Data
  const onClickDelete = (id) => {
    setClickedRowId(id);
    setViewModal();
  };

  const handleDeleteCustomer = () => {
    
    // alert("sdf")
    // try {
    //   const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/roles/${CurrentID}`)
    //   console.log(res.data);
    //   getAllDeviceData();
    //   toast.success("Roles Deleted Successfully", { autoClose: 3000 });
    //   setDeleteModal(false);
    // } catch (e) {
    //   toast.error("Something went wrong!", { autoClose: 3000 });
    //   setDeleteModal(false);
    // }
  };


  const status = [
    {
      options: [
        { label: "Select Status", value: "" },
        { label: "Active", value: "A" },
        { label: "Deactive", value: "D" },
      ],
    },
  ];



  // Customers Column
  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'id',
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        }
      },
      {
        Header: "Vehicle Number",
        accessor: "registrationNumber",
        filterable: false,
      },
      {
        Header: "Plant Code",
        accessor: "plantCode",
        filterable: false,
      },
      // {
      //   Header: "Company Code",
      //   accessor: "companyCode",
      //   filterable: false,
      // },
      {
        Header: "Movement Code",
        accessor: "movementType",
        filterable: false,
      },

      {
        Header: "Vehicle Type",
        accessor: "vehicleType",
        filterable: false,
      },
      {
        Header: "Maximum Capacity",
        accessor: "vehicleCapacityMax",
        filterable: false,
      },
      // {
      //   Header: "YardIn Time",
      //   accessor: "",
      //   filterable: false,
      // },
      {
        Header: "Tare Weight",
        accessor: "tareWeight",
        filterable: false,
      },

      {
        Header: "Gross Weight",
        accessor: "grossWeight",
        filterable: false,
      },
      {
        Header: "Trip Id",
        accessor: "tripId",
        filterable: false,
      },

      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item" title="View">
                <Link
                  to="#"
                  className="text-success d-inline-block view-item-btn"
                  onClick={() => { const data = cellProps.row.original; viewDocument(data); }}
                >
                  <i className="ri-eye-fill text-success fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Approve">
                <Link
                  to="#"
                  className="text-success d-inline-block view-item-btn"
                  onClick={() => { const data = cellProps.row.original; approveDocument(data); }}
                >

                  <i className="ri-checkbox-circle-line fs-16 text-success"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Reject">
                <Link
                  to="#"
                  className="text-success d-inline-block view-item-btn"
                  onClick={() => { const data = cellProps.row.original; rejectDocument(data); }}
                >

                  <i className="ri-close-circle-line fs-16 text-danger"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
  );



  // Customers Column
  const columns1 = useMemo(
    () => [
      {
        Header: '',
        accessor: 'id',
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        }
      },
      // {
      //   Header: "Vehicle No.",
      //   accessor: "plantCode",
      //   filterable: false,
      // },
      {
        Header: "Document Name",
        accessor: "",
        filterable: false,
      },
      // {
      //   Header: "Stage",
      //   accessor: "companyCode",
      //   filterable: false,
      // },
      // {
      //   Header: "Stage Time",
      //   accessor: "movementCode",
      //   filterable: false,
      // },
      // {
      //   Header: "Expiry Date",
      //   accessor: "",
      //   filterable: false,
      // },

      {
        Header: "View",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item" title="View">
                <Link
                  to="#"
                  className="text-success d-inline-block view-item-btn"
                  onClick={() => { const data = cellProps.row.original; viewDocument(data); }}
                >
                  <i className="ri-eye-fill text-success fs-16"></i>

                </Link>
              </li>


            </ul>
          );
        },
      },
    ],
  );





  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Approval | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={devices}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid>
          <BreadCrumb title="Approval" pageTitle="Document" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Vehicle Details</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>

                        {/* <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); setValues(initialValues); outlineBorderNavtoggle("1"); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add Trip
                        </button>{" "} */}

                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>

                    <TableContainer
                      columns={columns}
                      data={devices}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={10}
                      isGlobalSearch={true}
                      className="custom-header-css"
                      handleCustomerClick={handleCustomerClicks}
                      //isCustomerFilter={true}
                      SearchPlaceholder='Search for Trip Name or something...'
                    />
                  </div>


                  <ToastContainer closeButton={false} limit={1} />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>



      <Modal isOpen={documentModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="md" toggle={setViewModal}>
        <ModalHeader toggle={() => {
          setViewModal(!documentModal);
        }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-white fs-20">Document Details</h5>
        </ModalHeader>
        <ModalBody>
          <div className="product-content mt-0">
            <Nav tabs className="nav-tabs-custom nav-success">
              <NavItem>
                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customActiveTab === "1", })}
                  onClick={() => {
                    toggleCustom("1");
                  }}
                >Documents List
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink style={{ cursor: "pointer",marginLeft: "49px" }} className={classnames({ active: customActiveTab === "1", })}
                  onClick={() => {
                    toggleCustom("1");
                  }}
                >validity Date
                </NavLink>
              </NavItem>

               <NavItem>
                <NavLink style={{ cursor: "pointer",marginLeft: "72px" }} className={classnames({ active: customActiveTab === "1", })}
                  onClick={() => {
                    toggleCustom("1");
                  }}
                >View
                </NavLink>
              </NavItem>


            </Nav>
            <TabContent activeTab={customActiveTab} className="border border-top-0 p-4" id="nav-tabContent" >

              <TabPane id="nav-speci" tabId="1" >
                <div className="table-responsive">
                  <table className="table mb-0">
                    <tbody>
                      {test}
                      {/* Hello */}
                    </tbody>
                  </table>
                </div>
              </TabPane>

            </TabContent>
          </div>

        </ModalBody>
      </Modal>


      <Modal isOpen={rejectModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="md" toggle={setRejectModal}>
        <ModalHeader toggle={() => {
          setRejectModal(!rejectModal);
        }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-white fs-20">Reason For Reject</h5>
        </ModalHeader>
        <ModalBody>
          <div className="product-content mt-0">
            <textarea type="text" className="form-control" id="rejectRemarks"/>

          </div>
          <div className="button mb-2 mt-3" style={{ float: 'right' }}>
            <button className="btn btn-success"
            onClick={() => { setIsEdit(false); toggle(); RejectVehicle()}}
                       
            >Submit</button>
          </div>


        </ModalBody>
      </Modal>

    </React.Fragment>
  );
};

export default ApprovalScreen;
