import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import dayjs from "dayjs";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

import * as Yup from "yup";
import { useFormik,Formik,ErrorMessage, Field,Form } from "formik";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../MasterDriver/MasterDriver.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import classnames from "classnames";

const initialValues = {
  //id: "",
  uniqueId: "",
  driverCode: "",
  firstName: "",
  lastName: "",
  contact:"",
  address: "",
  pincode: "",
  postOffice: "",
  city: "",
  dob:"",
  maritalStatus:"",
  aadhaar: "",
  gender: "",
  email: "",
  licenseNumber: "",
  licenseIssueDate:"",
  licenseExpiryDate: "",
  status:"",
};


const MasterDriver = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [devices, setDevice] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [isAction, setAction] = useState(false);
  const [isAddTrans, setAddTrans] = useState(false);
  const [activeTab, setactiveTab] = useState(1);
  const [driverCodeData,setDriverCodeData] = useState('');
  const [latestHeader, setLatestHeader] = useState('');

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setoutlineBorderNav("1");
    } else {
      setModal(true);
      setoutlineBorderNav("1");
    }
  }, [modal]);

  // Outline Border Nav Tabs
  const [outlineBorderNav, setoutlineBorderNav] = useState("1");
  const outlineBorderNavtoggle = (tab) => {
    if (outlineBorderNav !== tab) {
      setoutlineBorderNav(tab);
    }
  };

  const checkFirstTabvalue = (tab) => {
    /*if (
      document.getElementById("val1").value === "" ||
      document.getElementById("val2").value === "" ||
      document.getElementById("val3").value === "" ||
      document.getElementById("val4").value === "" ||
      document.getElementById("val5").value === "" ||
      document.getElementById("val6").value === "" ||
      document.getElementById("val7").value === "" ||
      document.getElementById("val8").value === "" ||
      document.getElementById("val9").value === "" ||
      document.getElementById("val10").value === "" ||
      document.getElementById("val11").value === "" ||
      document.getElementById("val12").value === ""
    ) {
      return false;
    }
    else {*/
      if (outlineBorderNav !== tab) {
        setoutlineBorderNav(tab);
      }
   // }
  }

  const checkFirstTabvalue1 = (tab) => {
    /*if (
      document.getElementById("val13").value === "" ||
      document.getElementById("val14").value === "" ||
      document.getElementById("val15").value === "" ||
      document.getElementById("val16").value === "" ||
      document.getElementById("val17").value === "" ||
      document.getElementById("val18").value === "" ||
      document.getElementById("val19").value === "" ||
      document.getElementById("val20").value === "" ||
      document.getElementById("val21").value === "" ||
      document.getElementById("val22").value === "" ||
      document.getElementById("val23").value === "" ||
      document.getElementById("val24").value === "" ||
      document.getElementById("val25").value === "" ||
      document.getElementById("val26").value === "" ||
      document.getElementById("val27").value === "" ||
      document.getElementById("val28").value === "" ||
      document.getElementById("val29").value === "" ||
      document.getElementById("val30").value === "" ||
      document.getElementById("val31").value === ""
    ) {
      return false;
    }
    else {*/
      if (outlineBorderNav !== tab) {
        setoutlineBorderNav(tab);
      }
    //}
  }

  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    getAllDeviceData();
    getVehicleDocuments();

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

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/driver-masters`, config)
      .then(res => {
        const device = res;
        setDevice(device);
      });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
    });
  };


  const handleSubmit = async (e) => {
    
    console.log(values)
    e.preventDefault();
    addDocument();
    try {
      if (isEdit) {
        const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/driver-masters/${CurrentID}`, values, config)
        console.log(res);
        toast.success("Driver Updated Successfully", { autoClose: 3000 });
        getAllDeviceData();
      }
      else {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/driver-masters`, values, config)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Driver Added Successfully.", { autoClose: 3000 });
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
    //toggle();
  };

  const addDocument = async () => {
    
    const vehicle_number = values.driverCode;
    //const vehicle_number = "Al1234";
    const musicTypes = document.getElementsByClassName("document_number");
    const arr = [];
    if (isEdit) {
      if (isAction) {
        for (let i = 1; i < musicTypes.length + 1; i++) {
          const parent = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_number");
          const parent1 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("doc_uploded_class");
          const parent2 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass");
          const parent3 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass1");
          const parent4 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_name");
          const parent5 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_ID");
          console.log(parent1[0].getAttribute('data-base'));
          const json = {};
          json["documentRelatedTo"] = sessionStorage.getItem('driver_code_driver');
          json["base64Document"] = parent1[0].getAttribute('data-base');
          json["documentName"] = (parent1[0].getAttribute('data-base')) ? parent4[0].innerText : null;
          json["documentNumber"] = (parent1[0].getAttribute('data-base')) ? parent[0].value : null;
          json["validFromDate"] = parent2[0].value;
          json["validToDate"] = parent3[0].value;
          json["fileExtension"] = parent1[0].getAttribute('file-extn');
          json["documentURL"] = (parent1[0].getAttribute('data-base')) ? "" : null;
          json["documentType"] = "Driver";
          json["status"] = "A";
          json["id"] = parent5[0].value;
          arr.push(json);
        }
      }
      else {
        for (let i = 1; i < musicTypes.length + 1; i++) {
          const parent = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_number");
          const parent1 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("doc_uploded_class");
          const parent2 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass");
          const parent3 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass1");
          const parent4 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_name");
          const parent5 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_ID");
          const json = {};
          json["documentRelatedTo"] = sessionStorage.getItem('driver_code_driver');
          json["base64Document"] = parent1[0].getAttribute('data-base');
          json["documentName"] = (parent1[0].getAttribute('data-base')) ? parent4[0].innerText : null;
          json["documentNumber"] = (parent1[0].getAttribute('data-base')) ? parent[0].value : null;
          json["validFromDate"] = parent2[0].value;
          json["validToDate"] = parent3[0].value;
          json["fileExtension"] = parent1[0].getAttribute('file-extn');
          json["documentURL"] = (parent1[0].getAttribute('data-base')) ? "" : null;
          json["documentType"] = "Driver";
          json["status"] = "A";
          json["id"] = parent5[0].value;
          arr.push(json);
        }
      }
    }
    else {
      for (let i = 1; i < musicTypes.length + 1; i++) {
        const parent = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_number");
        const parent1 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("doc_uploded_class");
        const parent2 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass");
        const parent3 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass1");
        const parent4 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_name");
        const parent5 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_ID");
        console.log(parent1[0].getAttribute('data-base'));
        const json = {};
        json["documentRelatedTo"] = sessionStorage.getItem('driver_code_driver');
          json["base64Document"] = parent1[0].getAttribute('data-base');
          json["documentName"] = (parent1[0].getAttribute('data-base')) ? parent4[0].innerText : null;
          json["documentNumber"] = (parent1[0].getAttribute('data-base')) ? parent[0].value : null;
          json["validFromDate"] = parent2[0].value;
          json["validToDate"] = parent3[0].value;
          json["fileExtension"] = parent1[0].getAttribute('file-extn');
          json["documentURL"] = (parent1[0].getAttribute('data-base')) ? "" : null;
          json["documentType"] = "Driver";
          json["status"] = "A";
        arr.push(json);
      }
    }
    console.log(arr);
    if (isEdit) {
      try {
        const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/documents`, arr, config)
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    }else{
      try {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/documents`, arr, config)
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    }

    

  }



  // Add Data
  const handleCustomerClicks = () => {
    setIsEdit(false);
    toggle();
  };
  // Update Data
  const handleCustomerClick = useCallback((arg) => {
    
    setClickedRowId(arg.id);
    setIsEdit(true);
    setAction(false);
    setAddTrans(false);
    setFlag(true);
    const id = arg.id;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/driver-masters/${id}`, config)
      .then(res => {
        const result = res;
        const dt = (result.licenseExpiryDate).split("-");
        const newDate = (dt[2]+"-"+dt[1]+"-"+dt[0]);

        const dt1 = (result.licenseIssueDate).split("-");
        const newDate1 = (dt1[2]+"-"+dt1[1]+"-"+dt1[0]);

        const dt2 = (result.dob).split("-");
        const newDate2 = (dt2[2]+"-"+dt2[1]+"-"+dt2[0]);
        //alert(result.licenseExpiryDate);
        setValues({
          //...values,
          "id": result.id,
          "uniqueId": result.uniqueId,
          "driverCode": result.driverCode,
          "firstName": result.firstName,
          "lastName": result.lastName,
          "contact" : result.contact,
          "address": result.address,
          "pincode": result.pincode,
          "postOffice": result.postOffice,
          "city": result.city,
          "dob" : newDate2,
          "marital_status": result.maritalStatus,
          "aadhaar": result.aadhaar,
          "gender": result.gender,
          "email": result.email,
          "license_number" : result.licenseNumber,
          "license_issue_date": newDate1,
          "license_expiry_date": newDate,
          "status" : result.status,
        });

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/documents/info/${arg.driverCode}`, config)
        .then(res => {
          const result = res;
          setDocumentData([]);
          setupdatedDoc(result);
        });
        
        toggle();
      })
      

  }, [toggle]);

  // Delete Data
  const onClickDelete = (arg) => {
    setClickedRowId(arg.id);
    setDriverCodeData(arg.driverCode);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/driver-masters/${CurrentID}`, config)
      console.log(res.data);
      getAllDeviceData();
      const res1 = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/documents/delete/${driverCodeData}`, config)
      toast.success("Driver Deleted Successfully", { autoClose: 3000 });
      setDeleteModal(false);
    } catch (e) {
      toast.error("Something went wrong!", { autoClose: 3000 });
      setDeleteModal(false);
    }
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

  const backhauling = [
    {
      options: [
        { label: "Select Status", value: "" },
        { label: "Active", value: "A" },
        { label: "Deactive", value: "D" },
      ],
    },
  ];

  const gps_Activated = [
    {
      options: [
        { label: "Select Status", value: "" },
        { label: "Active", value: "A" },
        { label: "Deactive", value: "D" },
      ],
    },
  ];

  const loadingType = [
    {
      options: [
        { label: "Select Status", value: "" },
        { label: "Automatic", value: "A" },
        { label: "Manual", value: "M" },
      ],
    },
  ];

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
    firstSec.style.display = "block";
    viewDoc.style.display = "none";
    changeDoc.style.display = "none";
    setFlag(false);
    setAction(true);
    fileDiv.querySelector('.doc_uploded_class').setAttribute('required', true);

  }
  const [vehicle_Doc, setVehicleDoc] = useState([]);
  const getVehicleDocuments = (() => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/document-master-type/type/driver`, config)
      .then(res => {
        const result = res;
        console.log(result)
        setVehicleDoc(result);
      });
  });

  const [documentModal, setDocumentModal] = useState(false);
  const [documentData, setDocumentData] = useState([]);
  const [update_Doc, setupdatedDoc] = useState([]);
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [passedSteps, setPassedSteps] = useState([1]);

  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const setViewModal = () => {
    setDocumentModal(!documentModal);
  };

  const viewDocument = (data) => {
    
    const vehicleNumber = data.driverCode;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/documents/info/${vehicleNumber}`, config)
      .then(res => {
        const result = res;
        setDocumentData(result)
      })

    setViewModal();
  };

  const test = documentData.map(function (value, index) {
    
    return ([
      <>
        <tr key={index}>
          <td className="p-1 text-success "><b>{value.documentName}</b></td>
          <td className="p-1 text-end">
            <Link
              to="#"
              className="text-primary d-inline-block edit-item-btn"
              onClick={() => { viewDocumentData(value.documentURL) }}
            ><button type="button" class="btn btn-sm btn-outline-success waves-effect waves-light border-success">View Document</button>
            </Link>
          </td>
        </tr>
      </>
    ]);
  });

  const viewDocumentData = (docURL) => {
    
    const docURLRemoveInnitialPath = docURL.replace(process.env.REACT_APP_DOC_URL, '')
    // alert(docURLRemoveInnitialPath)
    if (docURL) {
      //window.open('file:///C://ui-repo/public/documents/HR72F7397_Vehicle%20Fitness.pdf');
      window.open(process.env.PUBLIC_URL + docURLRemoveInnitialPath);
    }
    else {
      toast.error("Data not found!", { autoClose: 3000 });
    }

  }

  const showPreview = (id) => {
    const file = document.getElementById(id).files[0];
    if (file != undefined) {
      window.open(URL.createObjectURL(file));
    }
  }

  const showPreview1 = (docURL) => {
    const docURLRemoveInnitialPath = docURL.replace(process.env.REACT_APP_DOC_URL, '')
    window.open(process.env.PUBLIC_URL + docURLRemoveInnitialPath);
  }

  function readFileData(event) {

    console.log(event.target.files);
    // event.target
    if (!event.target.files || !event.target.files[0]) return;

    const reader = new FileReader();
    const getextn = event.target.files[0];
    const extn = (getextn.name).split(".")[1];
    event.target.setAttribute('file-extn', `${extn}`);
    reader.onloadend = () => {
      const base64String = reader.result
        .replace('data:', '')
        .replace(/^.+,/, '');

      console.log(base64String);
      event.target.setAttribute('data-base', base64String);
    };
    reader.readAsDataURL(getextn);
  }

  function getIndex(email) {
    return update_Doc.findIndex(obj => obj.docName === email);
  }

  const json = {};
  for (let i = 1; i <= vehicle_Doc.length; i++) {
    //json["document_number"+i] = Yup.string().required("Please Enter document number");
  }
  const ValidationSchema2 = Yup.object().shape(
    json,    
  );

  
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
  
  const ValidationSchema = Yup.object().shape({
    driverCode: Yup.string().required("Please Enter Driver Code"),
    firstName: Yup.string().required("Please Enter First Name"),
    lastName: Yup.string().required("Please Enter Last Name"),
    dob: Yup.string().required("Please Enter Date Of Birth"),
    gender: Yup.string().required("Please Select Gender"),
    email: Yup.string().required("Please Enter Email"),
    contact: Yup.string().required("Please Enter Contact Number"),
  });

  const ValidationSchema1 = Yup.object().shape({
    aadhaar: Yup.string().required("Please Enter Aadhar Number"),
    license_number: Yup.string().required("Please Enter License Number"),
    license_expiry_date: Yup.string().required("Please Enter expiry date"),
    license_issue_date: Yup.string().required("Please Enter license issue date"),
    address: Yup.string().required("Please Enter Address"),
    postOffice: Yup.string().required("Please Enter Postoffice"),
    pincode: Yup.string().required("Please Enter Pincode"),
  });

  const resetInput = (id) => {
    const file = document.getElementById(id);
    file.value = null;
  }

  const [flag, setFlag] = useState(true);

  
  
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
        Header: "Unique Id",
        accessor: "uniqueId",
        filterable: false,
      },
      {
        Header: "Driver Code",
        accessor: "driverCode",
        filterable: false,
      },
      {
        Header: "First Name",
        accessor: "firstName",
        filterable: false,
      },
      {
        Header: "Last Name",
        accessor: "lastName",
        filterable: false,
      },  {
        Header: "Contact",
        accessor: "contact",
        filterable: false,
      },
      {
        Header: "Address",
        accessor: "address",
        filterable: false,
      },
      {
        Header: "Pincode",
        accessor: "pincode",
        filterable: false,
      },
      {
        Header: "Post Office",
        accessor: "postOffice",
        filterable: false,
      },  
      {
        Header: "DOB",
        accessor: "dob",
        filterable: false,
      },
      {
        Header: "Aadhaar",
        accessor: "aadhaar",
        filterable: false,
      },  
      {
        Header: "Email",
        accessor: "email",
        filterable: false,
      },
      {
        Header: "License Number",
        accessor: "licenseNumber",
        filterable: false,
      },
      {
        Header: "License Issue Date",
        accessor: "licenseIssueDate",
        filterable: false,
      },
      {
        Header: "License Expiry Date",
        accessor: "licenseExpiryDate",
        filterable: false,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (cell) => {
          
          switch (cell.value) {
            case "A":
              return <span className="badge text-uppercase badge-soft-success"> Active </span>;
            case "D":
              return <span className="badge text-uppercase badge-soft-danger"> Deactive </span>;
            default:
              return <span className="badge text-uppercase badge-soft-info"> Active </span>;
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
                  onClick={() => { const id = cellProps.row.original; toggleTab(1); handleCustomerClick(id); }}
                >

                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Remove">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => { const id = cellProps.row.original; onClickDelete(id); }}>
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="View">
                  <Link
                    to="#"
                    className="text-success d-inline-block view-item-btn"
                    onClick={() => { const data = cellProps.row.original; viewDocument(data); }}
                  >
                    <i class="ri-eye-fill text-success fs-16"></i>
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

  document.title = "Driver | EPLMS";
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
          <BreadCrumb title={latestHeader} pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Driver Details</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>

                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); setAddTrans(true); setAction(false); setValues(initialValues); setFlag(false) }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add Driver
                        </button>{" "}

                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    {devices && devices.length ? (
                      <TableContainer
                        columns={columns}
                        data={devices}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        //isCustomerFilter={true}
                        SearchPlaceholder='Search for Driver Name or something...'
                        divClass="overflow-auto"
                        tableClass="width-200"
                      />) : (<Loader />)
                    }
                  </div>

                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Driver" : "Add Driver"}
                    </ModalHeader>
                      <ModalBody>
                        <Nav pills className="nav-customs nav-danger mb-3 nav nav-pills">
                          <NavItem>
                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: activeTab === 1, done: (activeTab <= 2 && activeTab >= 0) })} disabled>
                              Basic Informations
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: activeTab === 2, done: activeTab <= 2 && activeTab > 1 })} disabled >
                              Additional Informations
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: activeTab === 3, done: activeTab <= 3 && activeTab > 2 })} disabled >
                              Upload Documents
                            </NavLink>
                          </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab} className="text-muted">
                          <TabPane tabId={1} id="border-nav-home">
                          <Formik
                              initialValues={{
                                contact: (values && values.contact) || '',
                                dob: (values && values.dob) || '',
                                driverCode: (values && values.driverCode) || '',
                                email: (values && values.email) || '',
                                firstName: (values && values.firstName) || '',
                                gender: (values && values.gender) || '',
                                lastName: (values && values.lastName) || '',
                              }}
                              validationSchema={ValidationSchema}
                              onSubmit={(values) => {
                                sessionStorage.setItem('firstname_driver',values.firstName);
                                sessionStorage.setItem('lastname_driver',values.lastName);
                                sessionStorage.setItem('contact_driver',values.contact);
                                sessionStorage.setItem('driver_code_driver',values.driverCode);
                                sessionStorage.setItem('dob_driver',values.dob);
                                sessionStorage.setItem('email_driver',values.email);
                                sessionStorage.setItem('gender_driver',values.gender);
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
                                    Driver Code
                                  </Label>
                                  {!!isEdit ? 
                                  <Field
                                    name="driverCode"
                                    className="form-control"
                                    placeholder="Enter Driver Code"
                                    type="text"
                                    readOnly
                                    component={CustomInputComponent} 
                                    disabled
                                    
                                  />
                                  : 
                                  <Field
                                    name="driverCode"
                                    className="form-control"
                                    placeholder="Enter Driver Code"
                                    type="text"
                                    component={CustomInputComponent} 
                                  />
                                }
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    htmlFor="trans1"
                                    className="form-label"
                                  >
                                    Driver First Name
                                  </Label>
                                  <Field 
                                    name="firstName" 
                                    type="text" 
                                    component={CustomInputComponent} 
                                    placeholder="Enter Driver First Name"
                                    />
                                  {/*<Field
                                   // name="firstname"
                                    className="form-control"
                                    placeholder="Enter Driver First Name"
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
                                    Driver Last Name
                                  </Label>
                                  <Field
                                    name="lastName"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter Driver Last Name"
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
                                    name="contact"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter Contact Number"
                                    type="number"
                                    disabled = {isEdit ? true :false} 
                                    maxLength={'10'}
                                    pattern="[6789][0-9]{9}"
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    // htmlFor="customername-field"
                                    className="form-label"
                                  >
                                    Email ID
                                  </Label>
                                  <Field
                                    name="email"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter Email ID"
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
                                    Date Of Birth
                                  </Label>
                                  <Field
                                    name="dob"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter Date Of Birth"
                                    type="date"
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    // htmlFor="customername-field"
                                    className="form-label"
                                  >
                                    Gender
                                  </Label>
                                  <Field
                                    name="gender"
                                    as="select"
                                    //component={CustomInputComponent} 
                                    className="form-control"
                                    placeholder="Enter Gender"
                                  >
                                    <option value="">-- Select --</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                  </Field>
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
                            address: (values && values.address) || '',
                            aadhaar: (values && values.aadhaar) || '',
                            license_expiry_date: (values && values.license_expiry_date) || '',
                            license_issue_date: (values && values.license_issue_date) || '',
                            license_number: (values && values.license_number) || '',
                            marital_status: (values && values.marital_status) || '',
                            pincode: (values && values.pincode) || '',
                            postOffice: (values && values.postOffice) || '',
                            //uniqueId: (values && values.uniqueId) || '',
                          }}
                          validationSchema={ValidationSchema1}
                          onSubmit={(values) => {
                            sessionStorage.setItem('unique_id_driver',"123");
                            sessionStorage.setItem('status_driver',"A");
                            sessionStorage.setItem('postOffice_driver',values.postOffice);
                            sessionStorage.setItem('pincode_driver',parseInt(values.pincode));
                            sessionStorage.setItem('marital_status_driver',values.marital_status);
                            sessionStorage.setItem('license_number_driver',values.license_number);
                            sessionStorage.setItem('license_issue_date_driver',values.license_issue_date);
                            sessionStorage.setItem('license_expiry_date_driver',values.license_expiry_date);
                            sessionStorage.setItem('adhaar_driver',values.aadhaar);
                            sessionStorage.setItem('address_driver',values.address);
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
                                    Address
                                  </Label>
                                  <Field
                                    name="address"
                                    className="form-control"
                                    placeholder="Enter Address"
                                    component={CustomInputComponent} 
                                    type="text"
                                    autoComplete="off"

                                  />
                                </div>
                              </Col>
                              
                              <Col lg={3}>
                                <div>
                                  <Label
                                    // htmlFor="customername-field"
                                    className="form-label"
                                  >
                                    License Number
                                  </Label>
                                  <Field
                                    name="license_number"
                                    className="form-control"
                                    component={CustomInputComponent} 
                                    placeholder="Enter License Number"
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
                                    License Issue Date
                                  </Label>
                                  <Field
                                    name="license_issue_date"
                                    id="trans6"
                                    component={CustomInputComponent} 
                                    className="form-control"
                                    placeholder="Enter License Issue Date"
                                    type="date"

                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    // htmlFor="customername-field"
                                    className="form-label"
                                  >
                                    License Expiry Date
                                  </Label>
                                  <Field
                                    name="license_expiry_date"
                                    id="trans6"
                                    component={CustomInputComponent} 
                                    className="form-control"
                                    placeholder="Enter License Expiry Date"
                                    type="date"

                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label
                                    // htmlFor="customername-field"
                                    className="form-label"
                                  >
                                    Marital Status
                                  </Label>
                                  <Field
                                    name="marital_status"
                                    className="form-control"
                                    //component={CustomInputComponent} 
                                    placeholder="Enter Marital Status"
                                    as="select"
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="S">Married</option>
                                      <option value="U">Unmarried</option>
                                    </Field>
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
                                    name="postOffice"
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
                                    name="pincode"
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
                                    name="aadhaar"
                                    className="form-control"
                                    placeholder="Enter Aadhar"
                                    type="text"
                                    component={CustomInputComponent} 

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
                                    name="documentUpload"
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
                                <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Driver"} </button>
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
                        //   alert(sessionStorage.getItem('dob_driver'))
                           addDocument();
                          // alert(sessionStorage.getItem('dob_driver'))
                            try {
                              if (isEdit) {
                                const newDriver= {
                                  "id" : (CurrentID ? CurrentID : null),
                                  "address": sessionStorage.getItem('address_driver'),
                                  "aadhaar": sessionStorage.getItem('adhaar_driver'),
                                  "contact": parseInt(sessionStorage.getItem('contact_driver')),
                                  "dob": dayjs(sessionStorage.getItem('dob_driver')).format("DD-MM-YYYY"),
                                  "driverCode": sessionStorage.getItem('driver_code_driver'),
                                  "email": sessionStorage.getItem('email_driver'),
                                  "firstName": sessionStorage.getItem('firstname_driver'),
                                  "gender": sessionStorage.getItem('gender_driver'),
                                  "lastName": sessionStorage.getItem('lastname_driver'),
                                  "licenseExpiryDate": dayjs(sessionStorage.getItem('license_expiry_date_driver')).format("DD-MM-YYYY"),
                                  "licenseIssueDate": dayjs(sessionStorage.getItem('license_issue_date_driver')).format("DD-MM-YYYY"),
                                  "licenseNumber": sessionStorage.getItem('license_number_driver'),
                                  "maritalStatus": sessionStorage.getItem('marital_status_driver'),
                                  "pincode": parseInt(sessionStorage.getItem('pincode_driver')),
                                  "postOffice": sessionStorage.getItem('postOffice_driver'),
                                  "status": "A",
                                  "uniqueId": sessionStorage.getItem('unique_id_driver'),
                                };
                                const res = axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/driver-masters/${CurrentID}`, newDriver, config)
                                console.log(res);
                                toast.success("Driver Updated Successfully", { autoClose: 3000 });
                                setTimeout(function(){
                                   toggleTab(1);
                                   setModal(false);
                                  },2000);
                                setTimeout(function(){ getAllDeviceData(); },2000);
                              }
                              else {
                                const newDriver= {
                                  "id" : null,
                                  "address": sessionStorage.getItem('address_driver'),
                                  "aadhaar": sessionStorage.getItem('adhaar_driver'),
                                  "contact": parseInt(sessionStorage.getItem('contact_driver')),
                                  "dob": dayjs(sessionStorage.getItem('dob_driver')).format("DD-MM-YYYY"),
                                  "driverCode": sessionStorage.getItem('driver_code_driver'),
                                  "email": sessionStorage.getItem('email_driver'),
                                  "firstName": sessionStorage.getItem('firstname_driver'),
                                  "gender": sessionStorage.getItem('gender_driver'),
                                  "lastName": sessionStorage.getItem('lastname_driver'),
                                  "licenseExpiryDate": dayjs(sessionStorage.getItem('license_expiry_date_driver')).format("DD-MM-YYYY"),
                                  "licenseIssueDate": dayjs(sessionStorage.getItem('license_issue_date_driver')).format("DD-MM-YYYY"),
                                  "licenseNumber": sessionStorage.getItem('license_number_driver'),
                                  "maritalStatus": sessionStorage.getItem('marital_status_driver'),
                                  "pincode": parseInt(sessionStorage.getItem('pincode_driver')),
                                  "postOffice": sessionStorage.getItem('postOffice_driver'),
                                  "status": "A",
                                  "uniqueId": sessionStorage.getItem('unique_id_driver'),
                                };
                                axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/driver-masters`, newDriver, config)
                                .then(res => {
                                //const res = axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/driver-masters`, newDriver)
                                //console.log(res);
                                    if (!res.errorMsg) {
                                      toast.success("Driver Added Successfully.", { autoClose: 3000 });
                                        setTimeout(function(){
                                        // dispatch(onGetDriver());
                                         toggleTab(1);
                                         setModal(false);
                                        },2000);
                                        setTimeout(function(){ getAllDeviceData(); },2000);
                                    }
                                    else {
                                      toast.error(res.errorMsg, { autoClose: 3000 });
                                      setTimeout(function(){
                                        // dispatch(onGetDriver());
                                         toggleTab(1);
                                      },2000);
                                    }                                   
                                  });
                              }
                            }
                            catch (e) {
                              toast.error("Something went wrong!", { autoClose: 3000 });
                            }
                           
                          }}
                        >
                        <Form autoComplete="off" encType="multipart/form-data"> 
                            <Row className="g-3 p-4 pt-0">
                              <Row className="text-center fs-6 text-white p-2 text-bold" style={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px", background: "darkcyan" }}>
                                <Col md={2}>Document Name</Col>
                                <Col md={2}>Document Number</Col>
                                <Col md={2}>From Date</Col>
                                <Col md={2}>To Date</Col>
                                {isAction &&
                                  <>
                                    <Col md={2}>Upload Files</Col>
                                    <Col md={2}>Action</Col>
                                  </>
                                }
                                {!isAction &&
                                  <>
                                    <Col md={4}>Action</Col>
                                  </>
                                }
                              </Row>
                              
                                {(!!isEdit ? update_Doc : vehicle_Doc || []).map((details, index) => (
                                  <Row className="row text-center p-3 pb-0 bg-light" id={`saveVehicleData_${index + 1}`} key={details.id}>
                                    <Input type="hidden" className="document_ID" defaultValue={details.id} />
                                    <Col md={2} className="document_name">{!!isEdit ? details.documentName : details.documentRelatedTo}</Col>
                                    <Col md={2}><input type="text" className="document_number" id={`num${index + 1}`} defaultValue={details.documentNumber} required disabled={flag} /></Col>
                                    
                                    <Col md={2}><input type="date" className="form-control add_calender_css flatpickerClass" id={`firstDate${index + 1}`} name="From_Date" defaultValue={details.validFromDate} disabled={flag} required /></Col>
                                    <Col md={2}><input type="date" className="form-control add_calender_css1 flatpickerClass1" id={`secondDate${index + 1}`} name="To_Date" defaultValue={details.validToDate} disabled={flag} required /></Col>
                                    {isAddTrans &&
                                      <>
                                        <Col md={2}><input accept="image/*" type="file" className="doc_uploded_class" id={`${details.id}`} onChange={(event) => { readFileData(event) }} required style={{ width: "210px" }} />
                                        </Col>
                                        <Col md={2} >
                                          <button type="button" className="btn btn-sm" title="VIEW" onClick={() => showPreview(details.id)}><i className="ri-eye-fill text-success fs-16"></i></button>
                                          <button type="button" className="btn btn-sm ms-1" title="DELETE" onClick={() => resetInput(details.id)}><i className="ri-close-circle-line fs-16 text-danger"></i></button>
                                        </Col>
                                      </>
                                    }
                                    { isEdit &&
                                      <>
                                        <Col md={2} id={`fileDiv${index + 1}`} style={liStyle}><input accept="image/*" type="file" className="doc_uploded_class" id={`${details.id}`} onChange={(event) => { readFileData(event) }} style={{ width: "210px" }} />
                                        </Col>
                                        <Col md={2} id={`firstSec${index + 1}`} style={liStyle}>
                                          <button type="button" className="btn btn-sm" title="VIEW" onClick={() => showPreview(details.id)}><i className="ri-eye-fill text-success fs-16"></i></button>
                                          <button type="button" className="btn btn-sm ms-1" title="DELETE" onClick={() => resetInput(details.id)}><i className="ri-close-circle-line fs-16 text-danger"></i></button>
                                        </Col>

                                        <Col md={2} id={`viewDoc${index + 1}`}><button type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light border-primary w-100" title="View Document" onClick={() => showPreview1(details.documentURL)}>View Document</button> </Col>
                                        <Col md={2} id={`changeDoc${index + 1}`}><button type="button" className="btn btn-sm btn-outline-warning waves-effect waves-light border-warning w-100" title="Change Document" onClick={() => changeBTN(index + 1)}>Change Document</button> </Col>
                                      </>
                                    }
                                  </Row>
                                ))}
                                </Row>    

                            <div className="hstack gap-2 justify-content-right">
                                <button type="button" className="btn btn-success" onClick={() => {
                                    toggleTab(activeTab - 1);
                                  }}> &lt;&lt; Previous</button>
                              </div>
                            <div className="hstack gap-2 justify-content-end">
                              <button type="button" className="btn btn-light" onClick={toggle}> Close </button>

                              <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Driver"} </button>
                            </div>
                          </Form> 
                          </Formik>
                          </TabPane>
                        </TabContent>
                      </ModalBody>
                  </Modal>
                 {/**
                  *  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Driver" : "Add Driver"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={handleSubmit} name="Doc_form">
                      <ModalBody>
                        <Nav pills className="nav-customs nav-danger mb-3 nav nav-pills">
                          <NavItem>
                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "1", })} onClick={() => { outlineBorderNavtoggle("1"); }}>
                              Basic Informations
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "2", })} onClick={() => { outlineBorderNavtoggle("2"); }}>
                              Additional Informations
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "3", })} onClick={() => { outlineBorderNavtoggle("3"); }}>
                              Upload Documents
                            </NavLink>
                          </NavItem>
                        </Nav>
                        <TabContent activeTab={outlineBorderNav} className="text-muted">
                          <TabPane tabId="1" id="border-nav-home">
                            <Row className="g-3">
                            <Col md={3}>
                              <Label htmlFor="validationDefault01" className="form-label">Unique Id</Label>
                              <Input type="text" required className="form-control"
                                name="uniqueId"
                                id="validationDefault01"
                                placeholder="Enter Unique Id"
                                value={values.uniqueId}
                                onChange={handleInputChange}
                              />
                            </Col>
                            <Col md={3}>
                              <Label htmlFor="validationDefault03" className="form-label">Driver Code</Label>
                              <Input type="text" required className="form-control"
                                id="validationDefault02"
                                name="driverCode"
                                placeholder="Enter Driver Code"
                                value={values.driverCode}
                                onChange={handleInputChange}
                              />
                            </Col>
                            <Col md={3}>
                              <Label htmlFor="validationDefault04" className="form-label">First Name</Label>
                              <Input type="text" required className="form-control"
                                id="validationDefault03"
                                name="firstName"
                                placeholder="Enter First Name"
                                value={values.firstName}
                                onChange={handleInputChange}
                              />
                            </Col>
                            <Col md={3}>
                              <Label htmlFor="validationDefault04" className="form-label">Last Name</Label>
                              <Input type="text" required className="form-control"
                                id="validationDefault04"
                                name="lastName"
                                placeholder="Enter Last Name"
                                value={values.lastName}
                                onChange={handleInputChange}
                              />
                            </Col>

                            <Col md={3}>
                              <Label htmlFor="validationDefault01" className="form-label">Contact</Label>
                              <Input type="text" required className="form-control"
                                name="contact"
                                id="validationDefault05"
                                placeholder="Enter Contact"
                                value={values.contact}
                                onChange={handleInputChange}
                              />
                            </Col>
                            <Col md={3}>
                              <Label htmlFor="validationDefault03" className="form-label">DOB</Label>
                              <Input type="text" required className="form-control"
                                id="validationDefault10"
                                name="dob"
                                placeholder="Enter DOB"
                                value={values.dob}
                                onChange={handleInputChange}
                              />
                            </Col>
                            <Col md={3}>
                              <Label htmlFor="validationDefault04" className="form-label">Marital Status</Label>
                              <Input type="text" required className="form-control"
                                id="validationDefault11"
                                name="maritalStatus"
                                placeholder="Enter Marital Status"
                                value={values.maritalStatus}
                                onChange={handleInputChange}
                              />
                            </Col>
                            <Col md={3}>
                              <Label htmlFor="validationDefault01" className="form-label">Gender</Label>
                              <Input type="text" required className="form-control"
                                name="gender"
                                id="validationDefault13"
                                placeholder="Enter Gender"
                                value={values.gender}
                                onChange={handleInputChange}
                              />
                            </Col>
                            <Col md={3}>
                              <Label htmlFor="validationDefault03" className="form-label">Email</Label>
                              <Input type="text" required className="form-control"
                                id="validationDefault14"
                                name="email"
                                placeholder="Enter Email"
                                value={values.email}
                                onChange={handleInputChange}
                              />
                            </Col>
                          
                            </Row>
                            {isEdit ? <div className="hstack gap-2 justify-content-end">
                              <button className="btn btn-success mt-3" type="button" onClick={() => { checkFirstTabvalue("2") }}>Next &gt;&gt;</button>
                            </div>
                              :
                              <div className="hstack gap-2 justify-content-end">
                                <button className="btn btn-success mt-3" onClick={() => { checkFirstTabvalue("2") }}>Next &gt;&gt;</button>
                              </div>}
                          </TabPane>
                        </TabContent>
                        <TabContent activeTab={outlineBorderNav} className="text-muted">
                          <TabPane tabId="2" id="border-nav-home">
                            <Row className="g-3">                              
                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">Address</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault06"
                                  name="address"
                                  placeholder="Enter Address"
                                  value={values.address}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Pincode</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault07"
                                  name="pincode"
                                  placeholder="Enter Pincode"
                                  value={values.pincode}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Post Office</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault08"
                                  name="postOffice"
                                  placeholder="Enter Post Office"
                                  value={values.postOffice}
                                  onChange={handleInputChange}
                                />
                              </Col>

                              <Col md={3}>
                                <Label htmlFor="validationDefault01" className="form-label">City</Label>
                                <Input type="text" required className="form-control"
                                  name="city"
                                  id="validationDefault09"
                                  placeholder="Enter City"
                                  value={values.city}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Aadhaar</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault12"
                                  name="aadhaar"
                                  placeholder="Enter Aadhaar"
                                  value={values.aadhaar}
                                  onChange={handleInputChange}
                                />
                              </Col>

                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">License Number</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault15"
                                  name="licenseNumber"
                                  placeholder="Enter License Number"
                                  value={values.licenseNumber}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">License Issue Date</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault16"
                                  name="licenseIssueDate"
                                  placeholder="Enter License Issue Date"
                                  value={values.licenseIssueDate}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">License Expiry Date</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault17"
                                  name="licenseExpiryDate"
                                  placeholder="Enter License Expiry Date"
                                  value={values.licenseExpiryDate}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >Status</Label>
                                  <Input
                                  id="val31"
                                    name="status"
                                    type="select"
                                    className="form-select"
                                    value={values.status}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {status.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                                <button type="button" className="btn btn-light" onClick={() => { outlineBorderNavtoggle("1"); }}> Back To Basic Informations </button>
                                
                                {isEdit ? <div className="hstack gap-2 justify-content-end">
                              <button className="btn btn-success" type="button" onClick={() => { checkFirstTabvalue1("3") }}>Next &gt;&gt;</button>
                            </div>
                              :
                              <div className="hstack gap-2 justify-content-end">
                                <button className="btn btn-success" onClick={() => { checkFirstTabvalue1("3") }}>Next &gt;&gt;</button>
                              </div>}
                              </Col>

                            </Row>
                          </TabPane>
                        </TabContent>


                        <TabContent activeTab={outlineBorderNav} className="text-muted">
                          <TabPane tabId="3" id="border-nav-home">

                            <Row className="g-3 p-4 pt-0" >
                              <Row className="text-center fs-6 text-white p-2 text-bold" style={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px", background: "darkcyan" }}>

                                <Col md={2}>Document Name</Col>
                                <Col md={2}>Document Number</Col>
                                <Col md={2}>From Date</Col>
                                <Col md={2}>To Date</Col>
                                {isAction &&
                                  <>
                                    <Col md={2}>Upload Files</Col>
                                    <Col md={2}>Action</Col>
                                  </>
                                }
                                {!isAction &&
                                  <>
                                    <Col md={4}>Action</Col>
                                  </>
                                }
                              </Row>
                              {(!!isEdit ? update_Doc : vehicle_Doc || []).map((details, index) => (
                                <Row className="row text-center p-3 pb-0 bg-light" id={`saveVehicleData_${index + 1}`} key={details.id}>
                                  <Input type="hidden" className="document_ID" value={details.id} />
                                  <Col md={2} className="document_name">{!!isEdit ? details.documentName : details.documentRelatedTo}</Col>
                                  <Col md={2}><input type="text" className="document_number" id={`num${index + 1}`} defaultValue={details.documentNumber} required disabled={flag} /></Col>
                                  
                                  <Col md={2}><input type="date" className="form-control add_calender_css flatpickerClass" id={`firstDate${index + 1}`} name="From_Date" value={details.validFromDate} disabled={flag} required /></Col>
                                  <Col md={2}><input type="date" className="form-control add_calender_css1 flatpickerClass1" id={`secondDate${index + 1}`} name="To_Date" value={details.validToDate} disabled={flag} required /></Col>
                                  {isAddTrans &&
                                    <>
                                      <Col md={2}><input accept="image/*" type="file" className="doc_uploded_class" id={`${details.id}`} onChange={(event) => { readFileData(event) }} required style={{ width: "210px" }} />
                                      </Col>
                                      <Col md={2} >
                                        <button type="button" className="btn btn-sm" title="VIEW" onClick={() => showPreview(details.id)}><i className="ri-eye-fill text-success fs-16"></i></button>
                                        <button type="button" className="btn btn-sm ms-1" title="DELETE" onClick={() => resetInput(details.id)}><i className="ri-close-circle-line fs-16 text-danger"></i></button>
                                      </Col>
                                    </>
                                  }
                                  {isEdit &&
                                    <>
                                      <Col md={2} id={`fileDiv${index + 1}`} style={liStyle}><input accept="image/*" type="file" className="doc_uploded_class" id={`${details.id}`} onChange={(event) => { readFileData(event) }} style={{ width: "210px" }} />
                                      </Col>
                                      <Col md={2} id={`firstSec${index + 1}`} style={liStyle}>
                                        <button type="button" className="btn btn-sm" title="VIEW" onClick={() => showPreview(details.id)}><i className="ri-eye-fill text-success fs-16"></i></button>
                                        <button type="button" className="btn btn-sm ms-1" title="DELETE" onClick={() => resetInput(details.id)}><i className="ri-close-circle-line fs-16 text-danger"></i></button>
                                      </Col>

                                      <Col md={2} id={`viewDoc${index + 1}`}><button type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light border-primary w-100" title="View Document" onClick={() => showPreview1(details.documentURL)}>View Document</button> </Col>
                                      <Col md={2} id={`changeDoc${index + 1}`}><button type="button" className="btn btn-sm btn-outline-warning waves-effect waves-light border-warning w-100" title="Change Document" onClick={() => changeBTN(index + 1)}>Change Document</button> </Col>
                                    </>
                                  }
                                </Row>
                              ))}
                            </Row>
                            <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                              <button type="button" className="btn btn-light" onClick={() => { outlineBorderNavtoggle("2"); }}> Back To Additional Informations </button>
                              <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                              <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Driver"} </button>
                            </Col>

                          </TabPane>
                        </TabContent>

                      </ModalBody>
                      <ModalFooter>
                      </ModalFooter>
                    </Form>
                  </Modal> */}
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
          <h5 className="text-white fs-20">Uploaded Documents</h5>
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
            </Nav>
            <TabContent activeTab={customActiveTab} className="border border-top-0 p-4" id="nav-tabContent" >
              
              <TabPane id="nav-speci"  tabId="1" >
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

export default MasterDriver;
