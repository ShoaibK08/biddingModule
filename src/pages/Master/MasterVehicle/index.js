import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../MasterVehicle/Vehicle.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import classnames from "classnames";

const initialValues = {
  id: "",
  registrationNumber: "",
  modelNumber: "",
  manufacturingDate: "",
  description: "",
  status: "",
  vehicleType: "",
  transporter: "",
  noOfWheels: "",
  certifiedCapacity: "",
  pollutionExpiryDate: "",
  fitnessExpiryDate: "",
  insurancePolicyExpiry: "",
  vehicleCapacityMin: "",
  vehicleCapacityMax: "",
  chassisNumber: "",
  imeiNumber: "",
  gpsDeviceNumber: "",
  gpsActivated: "",
  isBackhauling: "",
  insurancePolicyNumber: "",
  companyCode: "",
  plantCode: "",
  loadingType: "",
  registeredState: "",
  rcNumber: "",
  movementType: "",
  taxRenewalDate: "",
  tareWeight: "",
  grossWeight: "",
  createdDate: "",
  receivedDate: ""
};


const MasterVehicle = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [devices, setDevice] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [currentVehicleNumber, setVehicleNumber] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [isAction, setAction] = useState(false);
  const [isAddTrans, setAddTrans] = useState(false);
  const [Plant_Code, setPlantCode] = useState('');
  const [comapny_code, setCompanyCode] = useState('');
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
    if (
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
    else {
      if (outlineBorderNav !== tab) {
        setoutlineBorderNav(tab);
      }
    }
  }

  const checkFirstTabvalue1 = (tab) => {
    if (
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
    else {
      if (outlineBorderNav !== tab) {
        setoutlineBorderNav(tab);
      }
    }
  }

  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    setPlantCode(plantcode);
    sessionStorage.getItem("main_menu_login");
    const obj1 = JSON.parse(sessionStorage.getItem("main_menu_login"));
    let companyCode = obj1.companyCode;
    setCompanyCode(companyCode);
    getAllDeviceData(plantcode);
    getVehicleDocuments(plantcode);

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

  const getAllDeviceData = (plantcode) => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicles?plantCode=${plantcode}`, config)
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
        const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicles/${CurrentID}`, values, config)
        console.log(res);
        toast.success("Vehicle Updated Successfully", { autoClose: 3000 });
        getAllDeviceData();
      }
      else {
        const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicles`, values, config)
        console.log(res);
        if (!res.errorMsg) {
          toast.success("Vehicle Added Successfully.", { autoClose: 3000 });
        }
        else {
          toast.error("Data Already Exist.", { autoClose: 3000 });
        }
        getAllDeviceData();
        setDocumentData([]);
      }
    }
    catch (e) {
      toast.error("Something went wrong!", { autoClose: 3000 });
    }
    toggle();
  };

  const addDocument = async () => {

    const vehicle_number = values.registrationNumber;
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
          json["documentRelatedTo"] = vehicle_number;
          json["base64Document"] = parent1[0].getAttribute('data-base');
          json["documentName"] = (parent1[0].getAttribute('data-base')) ? parent4[0].innerText : null;
          json["documentNumber"] = (parent1[0].getAttribute('data-base')) ? parent[0].value : null;
          json["validFromDate"] = parent2[0].value;
          json["validToDate"] = parent3[0].value;
          json["fileExtension"] = parent1[0].getAttribute('file-extn');
          json["documentURL"] = (parent1[0].getAttribute('data-base')) ? "" : null;
          json["documentType"] = "Vehicle";
          json["status"] = "A";
          json["id"] = parent5[0].value;
          arr.push(json);
        }
      }
      else {
        for (let i = 1; i < musicTypes.length + 1; i++) {
          const parent = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_number");
          const parent2 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass");
          const parent3 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("flatpickerClass1");
          const parent4 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_name");
          const parent5 = document.getElementById("saveVehicleData_" + i).getElementsByClassName("document_ID");
          const json = {};
          json["documentRelatedTo"] = vehicle_number;
          json["base64Document"] = null;
          json["documentName"] = null;
          json["documentNumber"] = null;
          json["validFromDate"] = parent2[0].value;
          json["validToDate"] = parent3[0].value;
          json["fileExtension"] = "";
          json["documentURL"] = null;
          json["documentType"] = "Vehicle";
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
        json["documentRelatedTo"] = vehicle_number;
        json["base64Document"] = parent1[0].getAttribute('data-base');
        json["documentName"] = parent4[0].innerText;
        json["documentNumber"] = parent[0].value;
        json["validFromDate"] = parent2[0].value;
        json["validToDate"] = parent3[0].value;
        json["fileExtension"] = parent1[0].getAttribute('file-extn');
        json["documentURL"] = "";
        json["documentType"] = "Vehicle";
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
    } else {
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
    toggle();
    const id = arg.id;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicles/${id}`, config)
      .then(res => {
        const result = res;
        setValues({
          ...values,
          "id": result.id,
          "registrationNumber": result.registrationNumber,
          "modelNumber": result.modelNumber,
          "manufacturingDate": result.manufacturingDate,
          "description": result.description,
          "status": result.status,
          "vehicleType": result.vehicleType,
          "transporter": result.transporter,
          "noOfWheels": result.noOfWheels,
          "certifiedCapacity": result.certifiedCapacity,
          "pollutionExpiryDate": result.pollutionExpiryDate,
          "fitnessExpiryDate": result.fitnessExpiryDate,
          "insurancePolicyExpiry": result.insurancePolicyExpiry,
          "vehicleCapacityMin": result.vehicleCapacityMin,
          "vehicleCapacityMax": result.vehicleCapacityMax,
          "chassisNumber": result.chassisNumber,
          "imeiNumber": result.imeiNumber,
          "gpsDeviceNumber": result.gpsDeviceNumber,
          "gpsActivated": result.gpsActivated,
          "isBackhauling": result.isBackhauling,
          "insurancePolicyNumber": result.insurancePolicyNumber,
          "companyCode": result.companyCode,
          "plantCode": result.plantCode,
          "loadingType": result.loadingType,
          "registeredState": result.registeredState,
          "rcNumber": result.rcNumber,
          "movementType": result.movementType,
          "taxRenewalDate": result.taxRenewalDate,
          "tareWeight": result.tareWeight,
          "grossWeight": result.grossWeight,
          "createdDate": result.createdDate,
          "receivedDate": result.receivedDate
        });
      })
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/documents/info/${arg.registrationNumber}`, config)
      .then(res => {
        const result = res;
        setDocumentData([]);
        setupdatedDoc(result);
      })

  }, [toggle]);

  // Delete Data
  const onClickDelete = (data) => {
    setClickedRowId(data.id);
    setVehicleNumber(data.registrationNumber);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicles/${CurrentID}`, config)
      const respose = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/documents/delete/${currentVehicleNumber}`, config)
      console.log(res.data);
      console.log(respose);
      getAllDeviceData();
      toast.success("Vehicle Deleted Successfully", { autoClose: 3000 });
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
  const getVehicleDocuments = ((plantcode) => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/document-master-type/type/vehicle?plantCode=${plantcode}`, config)
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
  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const setViewModal = () => {
    setDocumentModal(!documentModal);
  };

  const viewDocument = (data) => {

    const vehicleNumber = data.registrationNumber;
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

  function readFileData(event, id) {


    const isValidFileUploaded = (file) => {
      const validExtensions = ['png', 'jpeg', 'jpg']
      const fileExtension = file.type.split('/')[1]
      return validExtensions.includes(fileExtension)
    }

    const file = event.target.files[0];

    if (isValidFileUploaded(file)) {
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
    else {
      resetInput(id);
      toast.error("Invalid File, Choose only PNG ,JPEG ,PNG", { autoClose: 3000 });

    }






  }

  const resetInput = (id) => {
    const file = document.getElementById(id);
    file.value = null;
  }

  const [flag, setFlag] = useState(true);



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
        fixed: 'left',
      },
      {
        Header: "Model Number",
        accessor: "modelNumber",
        filterable: false,
      },
      {
        Header: "Manufacturing Year",
        accessor: "manufacturingDate",
        Cell: ({ row }) => {
          var date = new Date(row.original.manufacturingDate);
          return (date.getFullYear())
        },
        filterable: false,
      },
      {
        Header: "Vehicle Type",
        accessor: "vehicleType",
        filterable: false,
      },
      {
        Header: "Body Type",
        accessor: "bodyType",
        filterable: false,
      },
      {
        Header: "Transporter",
        accessor: "transporter",
        // Cell: ({ row }) => { var date = new Date(row.original.transporter);
        //   return (( date.getDate()+ '-' +  (date.getMonth() + 1)) + '-' +  date.getFullYear()) },
        filterable: false,
      },
      {
        Header: "No Of Wheels",
        accessor: "noOfWheels",
        filterable: false,
      },
      {
        Header: "Certified Capacity",
        accessor: "certifiedCapacity",
        filterable: false,
      },
      {
        Header: "Pollution Expiry Date",
        accessor: "pollutionExpiryDate",
        Cell: ({ row }) => {
          var date = new Date(row.original.pollutionExpiryDate);
          if (!date.getFullYear()) {
            return ("")
          } else {
            return ((date.getDate() + '-' + (date.getMonth() + 1)) + '-' + date.getFullYear())
          }
        },
        filterable: false,
      },
      {
        Header: "Fitness Expiry Date",
        accessor: "fitnessExpiryDate",
        Cell: ({ row }) => {
          var date = new Date(row.original.fitnessExpiryDate);
          if (!date.getFullYear()) {
            return ("")
          } else {
            return ((date.getDate() + '-' + (date.getMonth() + 1)) + '-' + date.getFullYear())
          }
        },
        filterable: false,
      },
      {
        Header: "Insurance Policy Expiry",
        accessor: "insurancePolicyExpiry",
        Cell: ({ row }) => {
          var date = new Date(row.original.insurancePolicyExpiry);
          if (!date.getFullYear()) {
            return ("")
          } else {
            return ((date.getDate() + '-' + (date.getMonth() + 1)) + '-' + date.getFullYear())
          }
        },
        filterable: false,
      },
      {
        Header: "Min Capacity",
        accessor: "vehicleCapacityMin",
        filterable: false,
      },
      {
        Header: "Max Capacity",
        accessor: "vehicleCapacityMax",
        filterable: false,
      },
      {
        Header: "Chassis Number",
        accessor: "chassisNumber",
        filterable: false,
      },
      {
        Header: "IMEI Number",
        accessor: "imeiNumber",
        filterable: false,
      },
      {
        Header: "GPS Device Number",
        accessor: "gpsDeviceNumber",
        filterable: false,
      },
      {
        Header: "BlackList",
        accessor: "blackList",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
            case "N":
              return <span className="badge text-uppercase badge-soft-success"> No </span>;
            case "Y":
              return <span className="badge text-uppercase badge-soft-danger"> Yes </span>;
          }
        }
      },
      {
        Header: "GPS Activated",
        accessor: "gpsActivated",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
            case "A":
              return <span className="badge text-uppercase badge-soft-success"> Activated </span>;
            case "D":
              return <span className="badge text-uppercase badge-soft-danger"> Deactivated </span>;
            default:
              return <span className="badge text-uppercase badge-soft-info"> Deactivated </span>;
          }
        }
      },
      {
        Header: "Backhauling",
        accessor: "isBackhauling",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
            case "A":
              return <span className="badge text-uppercase badge-soft-success"> Activated </span>;
            case "D":
              return <span className="badge text-uppercase badge-soft-danger"> Deactivated </span>;
            default:
              return <span className="badge text-uppercase badge-soft-info"> Deactivated </span>;
          }
        }
      },
      {
        Header: "Insurance Policy Number",
        accessor: "insurancePolicyNumber",
        Cell: ({ row }) => {
          var date = new Date(row.original.insurancePolicyNumber);
          if (!date.getFullYear()) {
            return ("")
          } else {
            return ((date.getDate() + '-' + (date.getMonth() + 1)) + '-' + date.getFullYear())
          }
        },
        filterable: false,
      },
      {
        Header: "Company Code",
        accessor: "companyCode",
        filterable: false,
      },
      {
        Header: "Plant Code",
        accessor: "plantCode",
        filterable: false,
      },
      {
        Header: "Loading Type",
        accessor: "loadingType",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
            case "A":
              return <span className="badge text-uppercase badge-soft-success"> Automatic </span>;
            case "M":
              return <span className="badge text-uppercase badge-soft-warning"> Manual </span>;
            default:
              return <span className="badge text-uppercase badge-soft-info"> Automatic </span>;
          }
        }
      },
      {
        Header: "Registered State",
        accessor: "registeredState",
        filterable: false,
      },
      {
        Header: "RC Number",
        accessor: "rcNumber",
        filterable: false,
      },
      {
        Header: "Movement Type",
        accessor: "movementType",
        filterable: false,
      },
      {
        Header: "TaxRenewal Date",
        accessor: "taxRenewalDate",
        Cell: ({ row }) => {
          var date = new Date(row.original.taxRenewalDate);
          if (!date.getFullYear()) {
            return ("")
          } else {
            return ((date.getDate() + '-' + (date.getMonth() + 1)) + '-' + date.getFullYear())
          }
        },
        filterable: false,
      },
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
        Header: "Created Date",
        accessor: "createdDate",
        Cell: ({ row }) => {
          var date = new Date(row.original.createdDate);
          if (!date.getFullYear()) {
            return ("")
          } else {
            return ((date.getDate() + '-' + (date.getMonth() + 1)) + '-' + date.getFullYear())
          }
        },
        filterable: false,
      },
      {
        Header: "Received Date",
        accessor: "receivedDate",
        Cell: ({ row }) => {
          var date = new Date(row.original.receivedDate);
          if (!date.getFullYear()) {
            return ("")
          } else {
            return ((date.getDate() + '-' + (date.getMonth() + 1)) + '-' + date.getFullYear())
          }
        },
        filterable: false,
      },
      {
        Header: "Description",
        accessor: "description",
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
      // {
      //   Header: "Action",
      //   Cell: (cellProps) => {
      //     return (
      //       <ul className="list-inline hstack gap-2 mb-0">
      //         <li className="list-inline-item edit" title="Edit">
      //           <Link
      //             to="#"
      //             className="text-primary d-inline-block edit-item-btn"
      //             onClick={() => { const data = cellProps.row.original; handleCustomerClick(data); }}
      //           >

      //             <i className="ri-pencil-fill fs-16"></i>
      //           </Link>
      //         </li>
      //         <li className="list-inline-item" title="Remove">
      //           <Link
      //             to="#"
      //             className="text-danger d-inline-block remove-item-btn"
      //             onClick={() => { const data = cellProps.row.original; onClickDelete(data); }}>
      //             <i className="ri-delete-bin-5-fill fs-16"></i>
      //           </Link>
      //         </li>
      //         <li className="list-inline-item" title="View">
      //             <Link
      //               to="#"
      //               className="text-success d-inline-block view-item-btn"
      //               onClick={() => { const data = cellProps.row.original; viewDocument(data); }}
      //             >
      //               <i class="ri-eye-fill text-success fs-16"></i>
      //             </Link>
      //           </li>
      //       </ul>
      //     );
      //   },
      // },
    ],
  );




  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Vehicle | EPLMS";
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
                        <h5 className="card-title mb-0 bg-light">Vehicle Details</h5>
                      </div>
                    </div>
                    {/* <div className="col-sm-auto">
                      <div>

                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); setAddTrans(true); setAction(false); setValues(initialValues); setFlag(false) }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add Vehicle
                        </button>{" "}

                      </div>
                    </div> */}
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
                        SearchPlaceholder='Search for Vehicle Name or something...'
                        divClass="overflow-auto"
                        tableClass="width-200"
                      />) : (<Loader />)
                    }
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Vehicle" : "Add Vehicle"}
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
                                <Label htmlFor="validationDefault01" className="form-label">Vehicle Number</Label>
                                <Input type="text" required className="form-control"
                                  name="registrationNumber"
                                  id="val1"
                                  placeholder="Enter Vehicle Number"
                                  value={values.registrationNumber}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">Model Number</Label>
                                <Input type="text" required className="form-control"
                                  id="val2"
                                  name="modelNumber"
                                  placeholder="Enter Model Number"
                                  value={values.modelNumber}
                                  onChange={handleInputChange}
                                />
                              </Col>

                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">Manufacturing Date</Label>
                                <Input type="date" required className="form-control"
                                  id="val3"
                                  name="manufacturingDate"
                                  placeholder="Select Manufacturing Date"
                                  value={values.manufacturingDate}
                                  onChange={handleInputChange}
                                />
                              </Col>

                              {/* <Col sm={3}>
                                <div className="">
                                  <Label className="form-label" >Manufacturing Date </Label>
                                  <Flatpickr
                                    className="form-control"
                                    id="val3"
                                    placeholder="Select Manufacturing Date"
                                    value={values.manufacturingDate}
                                    options={{
                                      enableTime: false,
                                      dateFormat: "d-m-Y",
                                    }}
                                    onChange={(selectedDates, dateStr, fp) => { createdDateFunction(selectedDates, dateStr, fp) }}
                                  />
                                </div>
                              </Col> */}
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Vehicle Type</Label>
                                <Input type="text" required className="form-control"
                                  id="val4"
                                  name="vehicleType"
                                  placeholder="Enter Vehicle Type"
                                  value={values.vehicleType}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              {/* <Col sm={3}>
                                <div className="">
                                  <Label className="form-label" >Transporter</Label>
                                  <Flatpickr
                                    className="form-control"
                                    id="val5"
                                    placeholder="Select Transporter"
                                    value={values.transporter}
                                    options={{
                                      enableTime: false,
                                      dateFormat: "d-m-Y",
                                    }}
                                    onChange={(selectedDates, dateStr, fp) => { createdDateFunction1(selectedDates, dateStr, fp) }}
                                  />
                                </div>
                              </Col> */}
                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">Transporter</Label>
                                <Input type="date" required className="form-control"
                                  id="val5"
                                  name="transporter"
                                  placeholder="Select Transporter Date"
                                  value={values.transporter}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">No Of Wheels</Label>
                                <Input type="text" required className="form-control"
                                  id="val6"
                                  name="noOfWheels"
                                  placeholder="Enter No Of Wheels"
                                  value={values.noOfWheels}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Certified Capacity</Label>
                                <Input type="text" required className="form-control"
                                  id="val7"
                                  name="certifiedCapacity"
                                  placeholder="Enter Certified Capacity"
                                  value={values.certifiedCapacity}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              {/* <Col sm={3}>
                                <div className="">
                                  <Label className="form-label" >Pollution Expiry Date</Label>
                                  <Flatpickr
                                    className="form-control"
                                    id="val8"
                                    placeholder="Select Pollution Expiry Date"
                                    value={values.pollutionExpiryDate}
                                    options={{
                                      enableTime: false,
                                      dateFormat: "d-m-Y",
                                    }}
                                    onChange={(selectedDates, dateStr, fp) => { createdDateFunction2(selectedDates, dateStr, fp) }}
                                  />
                                </div>
                              </Col> */}
                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">Pollution Expiry Date</Label>
                                <Input type="date" required className="form-control"
                                  id="val8"
                                  name="pollutionExpiryDate"
                                  placeholder="Select Pollution Expiry Date"
                                  value={values.pollutionExpiryDate}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              {/* <Col sm={3}>
                                <div className="">
                                  <Label className="form-label" >Fitness Expiry Date</Label>
                                  <Flatpickr
                                    className="form-control"
                                    id="val9"
                                    placeholder="Select Fitness Expiry Date"
                                    value={values.fitnessExpiryDate}
                                    options={{
                                      enableTime: false,
                                      dateFormat: "d-m-Y",
                                    }}
                                    onChange={(selectedDates, dateStr, fp) => { createdDateFunction3(selectedDates, dateStr, fp) }}
                                  />
                                </div>
                              </Col> */}
                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">Fitness Expiry Date</Label>
                                <Input type="date" required className="form-control"
                                  id="val9"
                                  name="fitnessExpiryDate"
                                  placeholder="Select Fitness Expiry Date"
                                  value={values.fitnessExpiryDate}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              {/* <Col sm={3}>
                                <div className="">
                                  <Label className="form-label" >Insurance Policy Expiry</Label>
                                  <Flatpickr
                                    className="form-control"
                                    id="val10"
                                    placeholder="Select Insurance Policy Expiry"
                                    value={values.insurancePolicyExpiry}
                                    options={{
                                      enableTime: false,
                                      dateFormat: "d-m-Y",
                                    }}
                                    onChange={(selectedDates, dateStr, fp) => { createdDateFunction4(selectedDates, dateStr, fp) }}
                                  />
                                </div>
                              </Col> */}
                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">Insurance Policy Expiry</Label>
                                <Input type="date" required className="form-control"
                                  id="val10"
                                  name="insurancePolicyExpiry"
                                  placeholder="Select Insurance Policy Expiry"
                                  value={values.insurancePolicyExpiry}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Vehicle Min Capacity</Label>
                                <Input type="number" required className="form-control"
                                  id="val11"
                                  name="vehicleCapacityMin"
                                  placeholder="Enter Vehicle Min Capacity"
                                  value={values.vehicleCapacityMin}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Vehicle Max Capacity</Label>
                                <Input type="number" required className="form-control"
                                  id="val12"
                                  name="vehicleCapacityMax"
                                  placeholder="Enter Vehicle Max Capacity"
                                  value={values.vehicleCapacityMax}
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
                                <Label htmlFor="validationDefault04" className="form-label">Chasis Number</Label>
                                <Input type="text" required className="form-control"
                                  id="val13"
                                  name="chassisNumber"
                                  placeholder="Enter Chassis Number"
                                  value={values.chassisNumber}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">IMEI Number</Label>
                                <Input type="text" required className="form-control"
                                  id="val14"
                                  name="imeiNumber"
                                  placeholder="Enter IMEI Number"
                                  value={values.imeiNumber}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">GPS Device Number</Label>
                                <Input type="text" required className="form-control"
                                  id="val15"
                                  name="gpsDeviceNumber"
                                  placeholder="Enter GPS Device Number"
                                  value={values.gpsDeviceNumber}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >GPS Activated</Label>
                                  <Input
                                    id="val16"
                                    name="gpsActivated"
                                    type="select"
                                    className="form-select"
                                    value={values.gpsActivated}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {gps_Activated.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >Backhauling</Label>
                                  <Input
                                    id="val17"
                                    name="isBackhauling"
                                    type="select"
                                    className="form-select"
                                    value={values.isBackhauling}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {backhauling.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              {/* <Col sm={3}>
                                <div className="">
                                  <Label className="form-label" >Insurance Policy Number</Label>
                                  <Flatpickr
                                    className="form-control"
                                    id="datepicker-publish-input"
                                    placeholder="Select Insurance Policy Number"
                                    value={values.insurancePolicyNumber}
                                    options={{
                                      enableTime: false,
                                      dateFormat: "d-m-Y",
                                    }}
                                    onChange={(selectedDates, dateStr, fp) => { createdDateFunction5(selectedDates, dateStr, fp) }}
                                  />
                                </div>
                              </Col> */}
                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">Insurance Policy Number</Label>
                                <Input type="date" required className="form-control"
                                  id="val18"
                                  name="insurancePolicyNumber"
                                  placeholder="Select Insurance Policy Number"
                                  value={values.insurancePolicyNumber}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Company Code</Label>
                                <Input type="text" required className="form-control"
                                  id="val19"
                                  name="companyCode"
                                  placeholder="Enter Company Code"
                                  value={values.companyCode}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Plant Code</Label>
                                <Input type="text" required className="form-control"
                                  id="val20"
                                  name="plantCode"
                                  placeholder="Enter Plant Code"
                                  value={values.plantCode}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >Loading Type</Label>
                                  <Input
                                    id="val21"
                                    name="loadingType"
                                    type="select"
                                    className="form-select"
                                    value={values.loadingType}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {loadingType.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Registered State</Label>
                                <Input type="text" required className="form-control"
                                  id="val22"
                                  name="registeredState"
                                  placeholder="Enter Registered State"
                                  value={values.registeredState}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">RC Number</Label>
                                <Input type="text" required className="form-control"
                                  id="val23"
                                  name="rcNumber"
                                  placeholder="Enter RC Number"
                                  value={values.rcNumber}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Movement Type</Label>
                                <Input type="text" required className="form-control"
                                  id="val24"
                                  name="movementType"
                                  placeholder="Enter Movement Type"
                                  value={values.movementType}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              {/* <Col sm={3}>
                                <div className="">
                                  <Label className="form-label" >Tax Renewal Date</Label>
                                  <Flatpickr
                                    className="form-control"
                                    id="datepicker-publish-input"
                                    placeholder="Select Tax Renewal Date"
                                    value={values.taxRenewalDate}
                                    options={{
                                      enableTime: false,
                                      dateFormat: "d-m-Y",
                                    }}
                                    onChange={(selectedDates, dateStr, fp) => { createdDateFunction6(selectedDates, dateStr, fp) }}
                                  />
                                </div>
                              </Col> */}
                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">Tax Renewal Date</Label>
                                <Input type="date" required className="form-control"
                                  id="val25"
                                  name="taxRenewalDate"
                                  placeholder="Select Tax Renewal Date"
                                  value={values.taxRenewalDate}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Tare Weight</Label>
                                <Input type="number" required className="form-control"
                                  id="val26"
                                  name="tareWeight"
                                  placeholder="Enter Tare Weight"
                                  value={values.tareWeight}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Gross Weight</Label>
                                <Input type="number" required className="form-control"
                                  id="val27"
                                  name="grossWeight"
                                  placeholder="Enter Gross Weight"
                                  value={values.grossWeight}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              {/* <Col sm={3}>
                                <div className="">
                                  <Label className="form-label" >Created Date</Label>
                                  <Flatpickr
                                    className="form-control"
                                    id="datepicker-publish-input"
                                    placeholder="Select Created Date"
                                    value={values.createdDate}
                                    options={{
                                      enableTime: false,
                                      dateFormat: "d-m-Y",
                                    }}
                                    onChange={(selectedDates, dateStr, fp) => { createdDateFunction7(selectedDates, dateStr, fp) }}
                                  />
                                </div>
                              </Col> */}
                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">Created Date</Label>
                                <Input type="date" required className="form-control"
                                  id="val28"
                                  name="createdDate"
                                  placeholder="Select Created Date"
                                  value={values.createdDate}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              {/* <Col sm={3}>
                                <div className="">
                                  <Label className="form-label" >Received Date</Label>
                                  <Flatpickr
                                    className="form-control"
                                    id="datepicker-publish-input"
                                    placeholder="Select Received Date"
                                    value={values.receivedDate}
                                    options={{
                                      enableTime: false,
                                      dateFormat: "d-m-Y",
                                    }}
                                    onChange={(selectedDates, dateStr, fp) => { createdDateFunction8(selectedDates, dateStr, fp) }}
                                  />
                                </div>
                              </Col> */}
                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">Received Date</Label>
                                <Input type="date" required className="form-control"
                                  id="val29"
                                  name="receivedDate"
                                  placeholder="Select Received Date"
                                  value={values.receivedDate}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Description</Label>
                                <Input type="text" required className="form-control"
                                  id="val30"
                                  name="description"
                                  placeholder="Enter Description"
                                  value={values.description}
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
                                      <Col md={2}><input accept="image/*" type="file" className="doc_uploded_class" id={`${details.id}`} onChange={(event) => { readFileData(event, details.id) }} required style={{ width: "210px" }} />
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
                              <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Vehicle"} </button>
                            </Col>

                          </TabPane>
                        </TabContent>

                      </ModalBody>
                      <ModalFooter>
                      </ModalFooter>
                    </Form>
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

              <TabPane id="nav-speci" tabId="1" >
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

export default MasterVehicle;
