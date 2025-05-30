import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../MasterPlants/Plants.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import classnames from "classnames";

const initialValues = {
  companyCode: "",
  plantCode: "",
  plantName: "",
  plantShortName: "",
  city: "",
  address: "",
  noOfSubunits: "",
  latitude: "",
  longitude: "",
  zone: "",
  qr_valid: "0",
  optionalPIPO: "1",
  lrPrinting: "",
  igpPrinting: "",
  previousCheckTw: "",
  toleranceCheckBag: "",
  toleranceCheckBlk: "",
  movementCheckIB: "",
  invoicePrinting: "",
  contactPerson: "",
  contactEmail: "",
  contactNumber: "",
  weighbridges: "",
  loadingpoints: "",
  packers: "",
  sequenceOutbound: "",
  sequenceInbound: "",
  sequenceInternal: "",
  ipAddress: "",
  middlewareIp: "",
  status: "A",
  port: "",
  header: "",
  footer: "",
  level1_Approval: "",
  level2_Approval: "",
  logo: ""
};


const MasterPlants = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [devices, setDevice] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [gerError, setError] = useState('');
  const [Plant_Code, setPlantCode] = useState('');
  const [latestHeader, setLatestHeader] = useState('');
  const [departmentData, setDepartmentData] = useState([]);
  const [loadingParameter, setErrorParameter] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    setPlantCode(plantcode);
    getAllDeviceData(plantcode);
    getDepartmentData(plantcode);

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

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/plants?plantCode=${plantcode}`, config)
      .then(res => {
        const device = res;
        setDevice(device);
      });
  }

  const getDepartmentData = (plantcode) => {

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/departments?plantCode=${plantcode}`, config)
      .then(res => {
        const result = res;
        setDepartmentData(result);
      });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
    });
  };

  const handleInputChange1 = (e) => {

    var fileName = e.target.value;
    var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (ext == "jpeg" || ext == "png" || ext == "PNG" || ext == "JPG" || ext == "JPEG" || ext == "jpg") {
      setError("");
      // const { name, value } = e.target;

      // setValues({
      //   ...values,
      //   [name]: value || value.valueAsNumber,
      // });



      // function readFileData(event) {

      console.log(e.target.files);
      // event.target
      if (!e.target.files || !e.target.files[0]) return;

      const reader = new FileReader();
      const getextn = e.target.files[0];
      const extn = (getextn.name).split(".")[1];
      e.target.setAttribute('file-extn', `${extn}`);
      reader.onloadend = () => {
        const base64String = reader.result
          .replace('data:', '')
          .replace(/^.+,/, '');

        // console.log(base64String);
        e.target.setAttribute('data-base', base64String);


      };
      reader.readAsDataURL(getextn);
      // }

    }
    else {
      setError("* Upload JPEG & PNG Images Only");
      document.getElementById("logoName").value = '';
      return false;
    }


  };

  const liStyle = { display: 'none' }

  const resetIcon = {
    fontSize: 'x-large',
    position: 'absolute',
    top: '30px',
    color: 'mediumblue',
  }
  const resetInput = () => {

    const file = document.getElementsByClassName("doc_uploded_class")[0];
    file.value = null;
  }

  const showPreview = () => {

    const file = document.getElementsByClassName("doc_uploded_class")[0].files[0];
    if (file != undefined) {
      window.open(URL.createObjectURL(file));
    }
  }
  const changeBTN = () => {

    // const number = document.getElementById("num" + index);
    // const firstDate = document.getElementById("firstDate" + index);
    // const secondDate = document.getElementById("secondDate" + index);
    const fileDiv = document.getElementById("fileDiv");
    const firstSec = document.getElementById("firstSec");
    // const viewDoc = document.getElementById("viewDoc");
    const changeDoc = document.getElementById("changeDoc");
    const logoNameDiv = document.getElementById("logoNameDiv");
    // number.value = null;
    // firstDate.value = null;
    // secondDate.value = null;
    fileDiv.style.display = "block";
    firstSec.style.display = "block";
    // viewDoc.style.display = "none";
    changeDoc.style.display = "none";
    logoNameDiv.style.display = "none";
    // setFlag(false);
    // setAction(true);
    fileDiv.querySelector('.doc_uploded_class').setAttribute('required', true);

  }
  const licenseExpiryDate = (date, date1, date2) => {

    setValues({
      ...values,
      ['licenseExpiryDate']: date1,
    });
  };

  const licenseIssueDate = (date, date1, date2) => {

    setValues({
      ...values,
      ['licenseIssueDate']: date1,
    });
  };

  const dateOfBirth = (date, date1, date2) => {
    setValues({
      ...values,
      ['dob']: date1,
    })
  }
  // Outline Border Nav Tabs
  const [outlineBorderNav, setoutlineBorderNav] = useState("1");
  const outlineBorderNavtoggle = (tab) => {
    if (outlineBorderNav !== tab) {
      setoutlineBorderNav(tab);
    }
  };


  const checkFirstTabvalue = (tab) => {

    if (document.getElementById("validationDefault01").value === "" || document.getElementById("validationDefault02").value === "" || document.getElementById("validationDefault03").value === "" || document.getElementById("validationDefault04").value === "" || document.getElementById("validationDefault05").value === "" || document.getElementById("validationDefault06").value === "" || document.getElementById("validationDefault07").value === "" || document.getElementById("validationDefault08").value === "" || document.getElementById("validationDefault09").value === "" || document.getElementById("validationDefault10").value === "") {
      return false;
    }
    else {
      if (outlineBorderNav !== tab) {
        setoutlineBorderNav(tab);
      }
    }
  }

  const handleSubmit = async (e) => {
    debugger;
    setErrorParameter(true);
    // setValues({
    //   ...values,
    //   ["logo"]: document.getElementById("logoName").hasAttribute('data-base'),

    // });
    // console.log(document.getElementById("logoName").hasAttribute('data-base'))

    const box = document.getElementById('logoName');

    // if (box.hasAttribute('data-base')) {
    //   console.log('the id attribute exists');

    // }else{
    //   console.log('the exists');
    // }
    const test1 = {

      "logo": (document.getElementById("logoName")) != null ? (document.getElementById("logoName").getAttribute('data-base')) : (document.getElementById("editImage").getAttribute('data-base')),
      "fileExtension": (document.getElementById("logoName")) != null ? (document.getElementById("logoName").getAttribute('file-extn')) : (document.getElementById("editImage").getAttribute('file-extn'))
    }
    let employee = {
      ...values,
      ...test1
    };

    console.log(employee)
    e.preventDefault();
    let ipaddress = values.ipAddress;
    let middlewareIp = values.middlewareIp;

    if (ipaddress !== "") {
      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        if (middlewareIp !== "") {
          if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(middlewareIp)) {
            try {
              if (isEdit) {
                const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/plants/${CurrentID}`, employee, config);
                console.log(res);
                toast.success("Plants Data Updated Successfully", { autoClose: 3000 });
                setErrorParameter(false);
                getAllDeviceData(Plant_Code);
              } else {
                const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/plants`, employee, config);
                console.log(res);
                if (!res.errorMsg) {
                  toast.success("Plants Data Added Successfully.", { autoClose: 3000 });
                } else {
                  toast.error("Data Already Exist.", { autoClose: 3000 });
                }
                getAllDeviceData(Plant_Code);
                setErrorParameter(false);
              }
            } catch (e) {
              toast.error("Something went wrong!", { autoClose: 3000 });
              setErrorParameter(false);
            }
            toggle();
          } else {
            alert("Middleware IP Address is not Valid");
          }
        } else {
          alert("Please Enter Middleware IP Address");
        }
      } else {
        alert("IP Address is not Valid");
      }
    } else {
      alert("Please Enter IP Address");
    }
  };



  // Add Data
  const handleCustomerClicks = () => {
    setIsEdit(false);
    toggle();
  };
  // Update Data
  const handleCustomerClick = useCallback((arg) => {
    debugger;

    setClickedRowId(arg);
    setError("");
    setIsEdit(true);
    toggle();
    const id = arg;
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/plants/${id}`, config)
      .then(res => {
        const result = res;
        var imgName = result.logo.substring(result.logo.lastIndexOf('\\') + 1);

        setValues({
          ...values,
          "companyCode": result.companyCode,
          "plantCode": result.plantCode,
          "plantName": result.plantName,
          "plantShortName": result.plantShortName,
          "city": result.city,
          "address": result.address,
          "noOfSubunits": result.noOfSubunits,
          "latitude": result.latitude,
          "longitude": result.longitude,
          "zone": result.zone,
          "qr_valid": result.qr_valid,
          "optionalPIPO": result.optionalPIPO,
          "lrPrinting": result.lrPrinting,
          "igpPrinting": result.igpPrinting,
          "invoicePrinting": result.invoicePrinting,
          "toleranceCheckBag": result.toleranceCheckBag,
          "toleranceCheckBlk": result.toleranceCheckBlk,
          "movementCheckIB": result.movementCheckIB,
          "previousCheckTw": result.previousCheckTw,
          "contactPerson": result.contactPerson,
          "contactEmail": result.contactEmail,
          "contactNumber": result.contactNumber,
          "weighbridges": result.weighbridges,
          "loadingpoints": result.loadingpoints,
          "packers": result.packers,
          "sequenceOutbound": result.sequenceOutbound,
          "sequenceInbound": parseInt(result.sequenceInbound),
          "sequenceInternal": parseInt(result.sequenceInternal),
          "ipAddress": result.ipAddress,
          "middlewareIp": result.middlewareIp,
          "port": result.port,
          "status": result.status,
          "header": result.header,
          "footer": result.footer,
          "level1_Approval": result.level1_Approval,
          "level2_Approval": result.level2_Approval,
          "logo": imgName,
        });
      })

  }, [toggle]);

  // Delete Data
  const onClickDelete = (id) => {
    setClickedRowId(id);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/plants/${CurrentID}`, config)
      console.log(res.data);
      getAllDeviceData(Plant_Code);
      toast.success("Plants Data Deleted Successfully", { autoClose: 3000 });
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

  const qrValidation = [
    {
      options: [
        //{ label: "Select QR Validation", value: "" },
        { label: "No", value: "0" },
        { label: "Yes", value: "1" },
      ],
    },
  ];

  const packingPlant = [
    {
      options: [
        //{ label: "Select Packing Plant", value: "" },
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
    },
  ];
  const lr_printing = [
    {
      options: [
        { label: "Select LR Printing", value: "" },
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
    },
  ];
  const igp_printing = [
    {
      options: [
        { label: "Select IGP Printing", value: "" },
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
    },
  ];

  const invoice_Printing = [
    {
      options: [
        { label: "Select Invoice Printing", value: "" },
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
    },
  ];

  const tolerance_Printing = [
    {
      options: [
        { label: "Select Tolerance Check", value: "" },
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
    },
  ];

  const movementsIB = [
    {
      options: [
        { label: "Select Movement", value: "" },
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" },
      ],
    },
  ];

  const lastTWCheck = [
    {
      options: [
        { label: "Select", value: "" },
        { label: "Enable", value: "1" },
        { label: "Disable", value: "0" },
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
        Header: "Plant Name",
        accessor: "plantName",
        filterable: false,
      },
      {
        Header: "Plant Short Name",
        accessor: "plantShortName",
        filterable: false,
      }, {
        Header: "City",
        accessor: "city",
        filterable: false,
      },
      {
        Header: "Address",
        accessor: "address",
        filterable: false,
      },
      {
        Header: "No Of Subunits",
        accessor: "noOfSubunits",
        filterable: false,
      },
      {
        Header: "Latitude",
        accessor: "latitude",
        filterable: false,
      }, {
        Header: "Longitude",
        accessor: "longitude",
        filterable: false,
      },
      {
        Header: "Zone",
        accessor: "zone",
        filterable: false,
      },
      {
        Header: "QR Validation",
        accessor: "qr_valid",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
            case 1:
              return <span className="badge text-uppercase badge-soft-success"> Yes </span>;
            case 0:
              return <span className="badge text-uppercase badge-soft-danger"> No </span>;
          }
        }
      },
      {
        Header: "Packing Plant",
        accessor: "optionalPIPO",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
            case "1":
              return <span className="badge text-uppercase badge-soft-success"> Yes </span>;
            case "0":
              return <span className="badge text-uppercase badge-soft-danger"> No </span>;
          }
        }
      },
      {
        Header: "LR Printing",
        accessor: "lrPrinting",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
            case "1":
              return <span className="badge text-uppercase badge-soft-success"> Yes </span>;
            case "0":
              return <span className="badge text-uppercase badge-soft-danger"> No </span>;
          }
        }
      },
      {
        Header: "IGP Printing",
        accessor: "igpPrinting",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
            case "1":
              return <span className="badge text-uppercase badge-soft-success"> Yes </span>;
            case "0":
              return <span className="badge text-uppercase badge-soft-danger"> No </span>;
          }
        }
      },
      {
        Header: "Invoice Printing",
        accessor: "invoicePrinting",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
            case "1":
              return <span className="badge text-uppercase badge-soft-success"> Yes </span>;
            case "0":
              return <span className="badge text-uppercase badge-soft-danger"> No </span>;
          }
        }
      },
      {
        Header: "Tolerance Check Bag",
        accessor: "toleranceCheckBag",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
            case "1":
              return <span className="badge text-uppercase badge-soft-success"> Yes </span>;
            case "0":
              return <span className="badge text-uppercase badge-soft-danger"> No </span>;
          }
        }
      },
      {
        Header: "Tolerance Check Bulker",
        accessor: "toleranceCheckBlk",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
            case "1":
              return <span className="badge text-uppercase badge-soft-success"> Yes </span>;
            case "0":
              return <span className="badge text-uppercase badge-soft-danger"> No </span>;
          }
        }
      },
      {
        Header: "Movement IB",
        accessor: "movementCheckIB",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
            case "Y":
              return <span className="badge text-uppercase badge-soft-success"> Yes </span>;
            case "N":
              return <span className="badge text-uppercase badge-soft-danger"> No </span>;
          }
        }
      },
      {
        Header: "Last TW Check",
        accessor: "previousCheckTw",
        filterable: false,
        Cell: (cell) => {
          switch (cell.value) {
            case "1":
              return <span className="badge text-uppercase badge-soft-success"> Enable </span>;
            case "0":
              return <span className="badge text-uppercase badge-soft-danger"> Disable </span>;
          }
        }
      },
      {
        Header: "Contact Person",
        accessor: "contactPerson",
        filterable: false,
      },
      {
        Header: "Contact Email",
        accessor: "contactEmail",
        filterable: false,
      }, {
        Header: "Contact Number",
        accessor: "contactNumber",
        filterable: false,
      },
      {
        Header: "Weighbridges",
        accessor: "weighbridges",
        filterable: false,
      },
      {
        Header: "Loading Points",
        accessor: "loadingpoints",
        filterable: false,
      },
      {
        Header: "Packers",
        accessor: "packers",
        filterable: false,
      },
      {
        Header: "Sequence Outbound",
        accessor: "sequenceOutbound",
        filterable: false,
      },
      {
        Header: "Sequence Inbound",
        accessor: "sequenceInbound",
        filterable: false,
      },
      {
        Header: "Sequence Internal",
        accessor: "sequenceInternal",
        filterable: false,
      },
      {
        Header: "IP Address",
        accessor: "ipAddress",
        filterable: false,
      },
      {
        Header: "Middleware IP",
        accessor: "middlewareIp",
        filterable: false,
      },
      {
        Header: "level-1 Approval",
        accessor: "level1_Approval",
        filterable: false,
      },
      {
        Header: "level-2 Approval",
        accessor: "level2_Approval",
        filterable: false,
      },
      {
        Header: "Port",
        accessor: "port",
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
                  onClick={() => { const id = cellProps.row.original.id; handleCustomerClick(id); outlineBorderNavtoggle("1"); }}
                >

                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Remove">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => { const id = cellProps.row.original.id; onClickDelete(id); }}>
                  <i className="ri-delete-bin-5-fill fs-16"></i>
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

  document.title = "Plant Master | EPLMS";
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
          <BreadCrumb title={'Plant Master'} pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Plant Details</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>

                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); setValues(initialValues); outlineBorderNavtoggle("1"); setError(""); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add Plant
                        </button>{" "}

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
                      customPageSize={5}
                      isGlobalSearch={true}
                      className="custom-header-css"
                      handleCustomerClick={handleCustomerClicks}
                      //isCustomerFilter={true}
                      SearchPlaceholder='Search for Plant Name or something...'
                      divClass="overflow-auto"
                      tableClass="width-200"
                    />
                  </div>


                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Plant" : "Add Plant"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                      <ModalBody>
                        <Nav pills className="nav-customs nav-danger mb-3 nav nav-pills" style={{ marginLeft: "5px" }}>
                          <NavItem>
                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "1", })} onClick={() => { outlineBorderNavtoggle("1"); }} >
                              Basic Informations
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "2", })} onClick={() => { outlineBorderNavtoggle("2"); }} >
                              Additional Informations
                            </NavLink>
                          </NavItem>
                        </Nav>
                        <TabContent activeTab={outlineBorderNav} className="text-muted">
                          <TabPane tabId="1" id="border-nav-home">
                            <Row className="g-3" style={{ paddingBottom: "65px" }}>
                              <Col md={3}>
                                <Label htmlFor="validationDefault01" className="form-label">Company Code</Label>
                                <Input type="text" required className="form-control"
                                  name="companyCode"
                                  id="validationDefault01"
                                  placeholder="Enter Company Code"
                                  maxlength="15"
                                  value={values.companyCode}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">Plant Code</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault02"
                                  name="plantCode"
                                  placeholder="Enter Plant Code"
                                  maxlength="15"
                                  value={values.plantCode}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Plant Name</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault03"
                                  name="plantName"
                                  placeholder="Enter Plant Name"
                                  maxlength="225"
                                  value={values.plantName}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Plant Short Name</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault04"
                                  name="plantShortName"
                                  maxlength="15"
                                  placeholder="Enter Plant Short Name"
                                  value={values.plantShortName}
                                  onChange={handleInputChange}
                                />
                              </Col>

                              <Col md={3}>
                                <Label htmlFor="validationDefault01" className="form-label">City</Label>
                                <Input type="text" required className="form-control"
                                  name="city"
                                  id="validationDefault05"
                                  placeholder="Enter City"
                                  maxlength="25"
                                  value={values.city}
                                  onChange={handleInputChange}
                                />
                              </Col>
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
                                <Label htmlFor="validationDefault04" className="form-label">No Of Subunits</Label>
                                <Input type="number" required className="form-control"
                                  id="validationDefault07"
                                  name="noOfSubunits"
                                  placeholder="Enter No Of Subunits"
                                  value={values.noOfSubunits}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Latitude</Label>
                                <Input type="number" required className="form-control"
                                  id="validationDefault08"
                                  name="latitude"
                                  placeholder="Enter Latitude"
                                  value={values.latitude}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault01" className="form-label">Longitude</Label>
                                <Input type="number" required className="form-control"
                                  name="longitude"
                                  id="validationDefault09"
                                  placeholder="Enter Longitude"
                                  value={values.longitude}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault01" className="form-label">Zone</Label>
                                <Input type="text" required className="form-control"
                                  name="zone"
                                  id="validationDefault10"
                                  placeholder="Enter Zone"
                                  maxlength="15"
                                  value={values.zone}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >QR Validation</Label>
                                  <Input
                                    name="qr_valid"
                                    type="select"
                                    className="form-select"
                                    value={values.qr_valid}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {qrValidation.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >Packing Plant</Label>
                                  <Input
                                    name="optionalPIPO"
                                    type="select"
                                    className="form-select"
                                    value={values.optionalPIPO}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {packingPlant.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >LR Printing</Label>
                                  <Input
                                    name="lrPrinting"
                                    type="select"
                                    className="form-select"
                                    value={values.lrPrinting}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {lr_printing.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >IGP Printing</Label>
                                  <Input
                                    name="igpPrinting"
                                    type="select"
                                    className="form-select"
                                    value={values.igpPrinting}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {igp_printing.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >Invoice Printing</Label>
                                  <Input
                                    name="invoicePrinting"
                                    type="select"
                                    className="form-select"
                                    value={values.invoicePrinting}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {invoice_Printing.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >Tolerance Check Bag</Label>
                                  <Input
                                    name="toleranceCheckBag"
                                    type="select"
                                    className="form-select"
                                    value={values.toleranceCheckBag}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {tolerance_Printing.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >Tolerance Check Bulker</Label>
                                  <Input
                                    name="toleranceCheckBlk"
                                    type="select"
                                    className="form-select"
                                    value={values.toleranceCheckBlk}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {tolerance_Printing.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >Movement IB</Label>
                                  <Input
                                    name="movementCheckIB"
                                    type="select"
                                    className="form-select"
                                    value={values.movementCheckIB}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {movementsIB.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label">Last TW Check</Label>
                                  <Input
                                    name="previousCheckTw"
                                    type="select"
                                    className="form-select"
                                    value={values.previousCheckTw}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    {lastTWCheck.map((item, key) => (
                                      <React.Fragment key={key}>
                                        {item.options.map((option, optionKey) => (
                                          <option value={option.value} key={optionKey}>{option.label}</option>
                                        ))}
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>

                            </Row>
                            {isEdit ? <div className="hstack gap-2 justify-content-end" style={{ marginTop: "-38px" }}>
                              <button className="btn btn-success" type="button" onClick={() => { checkFirstTabvalue("2") }}>Next &gt;&gt;</button>
                            </div>
                              :
                              <div className="hstack gap-2 justify-content-end" style={{ marginTop: "-38px" }}>
                                <button className="btn btn-success" onClick={() => { checkFirstTabvalue("2") }}>Next &gt;&gt;</button>
                              </div>}
                          </TabPane>
                        </TabContent>
                        <TabContent activeTab={outlineBorderNav} className="text-muted">
                          <TabPane tabId="2" id="border-nav-home">
                            <Row className="g-3">
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Contact Person</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault11"
                                  name="contactPerson"
                                  placeholder="Enter Contact Person"
                                  maxlength="100"
                                  value={values.contactPerson}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Contact Email</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault12"
                                  name="contactEmail"
                                  placeholder="Enter Contact Email"
                                  maxlength="100"
                                  value={values.contactEmail}
                                  onChange={handleInputChange}
                                />
                              </Col>

                              <Col md={3}>
                                <Label htmlFor="validationDefault01" className="form-label">Contact Number</Label>
                                <Input type="tel" required className="form-control"
                                  name="contactNumber"
                                  id="validationDefault13"
                                  placeholder="Enter Contact Number"
                                  maxLength={"10"}
                                  value={values.contactNumber}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault03" className="form-label">Weighbridges</Label>
                                <Input type="numnber" required className="form-control"
                                  id="validationDefault14"
                                  name="weighbridges"
                                  placeholder="Enter Weighbridges"
                                  value={values.weighbridges}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Loading Points</Label>
                                <Input type="number" required className="form-control"
                                  id="validationDefault15"
                                  name="loadingpoints"
                                  placeholder="Enter Loading Points"
                                  value={values.loadingpoints}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Packers</Label>
                                <Input type="number" required className="form-control"
                                  id="validationDefault15"
                                  name="packers"
                                  placeholder="Enter Packers"
                                  value={values.packers}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Sequence Outbound</Label>
                                <Input type="number" required className="form-control"
                                  id="validationDefault15"
                                  name="sequenceOutbound"
                                  placeholder="Enter Sequence Outbound"
                                  maxlength="15"
                                  value={values.sequenceOutbound}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Sequence Inbound</Label>
                                <Input type="number" required className="form-control"
                                  id="validationDefault15"
                                  name="sequenceInbound"
                                  placeholder="Enter Sequence Inbound"
                                  value={values.sequenceInbound}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Sequence Internal</Label>
                                <Input type="number" required className="form-control"
                                  id="validationDefault15"
                                  name="sequenceInternal"
                                  placeholder="Enter Sequence Internal"
                                  value={values.sequenceInternal}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault44" className="form-label">Middleware IP</Label>
                                <Input type="text" required className="form-control ipddd"
                                  id="validationDefault15"
                                  name="middlewareIp"
                                  placeholder="Enter Middleware Ip"

                                  value={values.middlewareIp}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault44" className="form-label">IP Address</Label>
                                <Input type="text" required className="form-control ipddd"
                                  id="validationDefault15"
                                  name="ipAddress"
                                  placeholder="Enter Ip Address"

                                  value={values.ipAddress}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault04" className="form-label">Port</Label>
                                <Input type="text" required className="form-control"
                                  id="validationDefault15"
                                  name="port"
                                  placeholder="Enter Port"
                                  maxlength="6"
                                  value={values.port}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault01" className="form-label">Header Name</Label>
                                <Input type="text" required className="form-control"
                                  name="header"
                                  id="validationDefault11"
                                  placeholder="Enter Header Name"
                                  value={values.header}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault01" className="form-label">Footer Name</Label>
                                <Input type="text" required className="form-control"
                                  name="footer"
                                  id="validationDefault12"
                                  placeholder="Enter Footer Name"
                                  value={values.footer}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              {/* <Col md={3}>
                                <Label htmlFor="validationDefault01" className="form-label">Level-1 Approval</Label>
                                <Input type="text" required className="form-control"
                                  name="level1_Approval"
                                  id="validationDefault12"
                                  placeholder="Enter Email"
                                  value={values.level1_Approval}
                                  onChange={handleInputChange}
                                />
                              </Col> */}
                              <Col lg={3}>
                                <div>
                                  <Label className="form-label" >Level-1 Approval Department</Label>
                                  <Input
                                    name="level1_Approval"
                                    type="select"
                                    className="form-select"
                                    value={values.level1_Approval}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    <option value={""}>{"Select Department"}</option>
                                    {departmentData.map((item, key) => (
                                      <React.Fragment key={key}>
                                        <option value={item.name} key={key}>{item.name}</option>
                                      </React.Fragment>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="validationDefault01" className="form-label">Level-2 Approval</Label>
                                <Input type="text" required className="form-control"
                                  name="level2_Approval"
                                  id="validationDefault12"
                                  placeholder="Enter Email With Comma Separated"
                                  value={values.level2_Approval}
                                  onChange={handleInputChange}
                                />
                              </Col>
                              {isEdit &&
                                <Col lg={3}>
                                  <div>
                                    <Label className="form-label" >Status</Label>
                                    <Input
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
                              }
                              {!isEdit &&
                                <Col md={3}>
                                  <Label htmlFor="validationDefault01" className="form-label">Logo</Label>
                                  <Input type="file" className="form-control"
                                    name="logo"
                                    id="logoName"
                                    placeholder="Upload Logo"
                                    onChange={handleInputChange1}
                                  />
                                  <span style={{ color: "red" }}>{gerError}</span>
                                </Col>
                              }
                              {isEdit &&
                                <>
                                  <Col lg={3} id="fileDiv" style={liStyle}><input accept="image/*" id="editImage" type="file" className="form-control doc_uploded_class" onChange={handleInputChange1} style={{ marginTop: "30px" }} />
                                  </Col>
                                  <Col md={3} className="mt-5" id="firstSec" style={liStyle}>
                                    <button type="button" id="viewInputCross" className="btn btn-sm" title="VIEW" onClick={() => showPreview()}><i className="ri-eye-fill text-success fs-16" style={{ marginTop: "40px" }}></i></button>
                                    <button type="button" id="resetInputCross" className="btn btn-sm ms-1" title="DELETE" onClick={() => resetInput()}><i className="ri-close-circle-line fs-16 text-danger" style={{ marginTop: "40px" }}></i></button>
                                  </Col>

                                  {/* <Col md={3} id="viewDoc"><button type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light border-primary w-100" title="View Document" style={{marginTop:"40px"}}>View Document</button> </Col> */}


                                  <Col md={3}>
                                    <div id="logoNameDiv">
                                      <Label htmlFor="validationDefault01" className="form-label">Logo</Label>
                                      <input type="text" className="form-control" readonly name="fileName" value={values.logo} /> </div></Col>
                                  <Col md={3} id="changeDoc">
                                    <i class="ri-refresh-line" onClick={() => changeBTN()} style={resetIcon}></i>
                                    {/* <button type="button" className="btn btn-sm btn-outline-warning waves-effect waves-light border-warning w-100" title="Change Document" style={{ marginTop: "40px" }} onClick={() => changeBTN()}>Change Document</button>  */}

                                  </Col>
                                </>
                              }
                            </Row>

                            <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "0px" }}>
                              <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                              {loadingParameter ? (
                                <>
                                  <Spinner size="sm" className="me-2 visible" />
                                  Loading...
                                </>
                              ) : (
                                <>
                                  <button type="submit" className="btn btn-success" disabled={loadingParameter ? true : false}> {!!isEdit ? "Update" : "Add Plant"} </button>
                                </>
                              )}

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


    </React.Fragment>
  );
};

export default MasterPlants;
