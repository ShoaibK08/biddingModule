import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, UncontrolledAlert, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, Spinner, CardBody, Button } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import '../WeightApprove/WeightApprove.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import LoaderNew from "../../../Components/Common/Loader_new";

const initialValues = {
  start_date: "",
  end_date: "",
  master_plant_id: "",
};


const ReportWeightApprove = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [devices, setDevice] = useState([]);
  const [SubmitLoader, setSubmitLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [Success, setSuccess] = useState(false);
  const [InvalidOTP, setInvalidOTP] = useState(false);
  const [Plant_Code, setPlantCode] = useState('');
  const [User_Id, setUserId] = useState('');
  const [CurrentTripId, setCurrentTripId] = useState(false);
  const [CurrentFlag, setCurrentFlag] = useState(null);
  const [level1ApprovalFlag, setLevel1ApprovalFlag] = useState(null);
  const [getOTPDateTime, setOTPDateTime] = useState("");
  const [Resendloader, setResendloader] = useState(false);
  const [loader, setloader] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  useEffect(() => {
    let timer;
    if (Success) {
      timer = setTimeout(() => setSuccess(false), 5000);
    }
    if (InvalidOTP) {
      timer = setTimeout(() => setInvalidOTP(false), 5000);
    }
    // Cleanup timeout when component unmounts or Success/InvalidOTP changes
    return () => clearTimeout(timer);
  }, [Success, InvalidOTP]);

  useEffect(() => {
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    setPlantCode(obj.data.plantCode);
    setUserId(obj.data._id);
    getAllDeviceData(obj.data.plantCode);
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
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let userId = obj.data._id;

    const data = {
      "plantCode": plantcode,
      "userId": userId
    }
    axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/tolerance-masters/getApprovalForUser`, data, config)
      .then(res => {
        const device = res;
        setDevice(device);
      });
  }


  const [rejectModal, setViewRejectModal] = useState(false);
  const [ApproveModal, setViewApproveModal] = useState(false);

  const setApproveModal = () => {
    setViewApproveModal(!ApproveModal);
  };

  const approveData = async (data) => {

    setSuccess(false); // Success message for OTP Sent
    const tripId = data.id;
    const flag = data.flag;
    const level1_Approval_by = data.level1_Approval_by;
    const OTPDateTime = data.otpDateTime;
    if (level1_Approval_by != "") {
      setCurrentTripId(tripId);
      setCurrentFlag(flag ? flag : "");
      setLevel1ApprovalFlag(level1_Approval_by);
      setApproveModal();
      setOTPDateTime(OTPDateTime);
      startTimer2L(OTPDateTime);
    }
    else {
      setCurrentTripId(tripId);
      setCurrentFlag(flag ? flag : "");
      setLevel1ApprovalFlag(level1_Approval_by);
      // setOTPDateTime(OTPDateTime);
      // const otpPayload = {
      //   "userId": User_Id,
      //   "tripId": tripId,
      //   "plantCode": Plant_Code,
      //   "flag": flag
      // }
      // setloader(true);
      // try {
      //   await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/tolerance-masters/generateOtpForApproval`, otpPayload, config)
      //     .then(res => {
      //       console.log(res);
      //       if (res.msg === "OTP generated successfully") {
      //         startTimer();
      //         setApproveModal();
      //         setloader(false);
      //       }
      //       else {
      //         toast.warning(res.msg, { autoClose: 3000 });
      //         setloader(false);
      //       }
      //     });
      // }
      // catch (e) {
      //   toast.warning(e, { autoClose: 3000 });
      //   setloader(false);
      // }
      setApproveModal();
    }
  };

  const resendOtp = async () => {
    setOTPExpiredMessage(false);
    setSuccess(false);
    setIsTimerActive(false);
    setIsActive(false);
    setInvalidOTP(false);
    clearFields();
    const tripId = CurrentTripId;
    const flag = CurrentFlag;
    const otpPayload = {
      "userId": User_Id,
      "tripId": tripId,
      "plantCode": Plant_Code,
      "flag": flag
    }
    setResendloader(true);
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/tolerance-masters/generateOtpForApproval`, otpPayload, config)
        .then(res => {
          console.log(res);
          if (res.msg === "OTP generated successfully") {
            setResendloader(false);
            startTimer();
            setSuccess(true);
          }
          else if (res.msg === "OTP generated successfully for all second-level emails") {
            setResendloader(false);
            const now = new Date();
            const formattedDate = now.getFullYear() + '-' +
              String(now.getMonth() + 1).padStart(2, '0') + '-' +
              String(now.getDate()).padStart(2, '0') + ' ' +
              String(now.getHours()).padStart(2, '0') + ':' +
              String(now.getMinutes()).padStart(2, '0') + ':' +
              String(now.getSeconds()).padStart(2, '0');
            console.log(formattedDate); // Outputs: 2024-08-12 23:33:52
            setOTPDateTime(formattedDate);
            getAllDeviceData(Plant_Code);
            //startTimer();
            startTimer2L(formattedDate);
            setSuccess(true);
          }
          else {
            toast.warning(res.msg, { autoClose: 3000 });
            setResendloader(false);
            setSuccess(false);
          }
        });
    }
    catch (e) {
      toast.warning(e, { autoClose: 3000 });
      setResendloader(false);
      setSuccess(false);
    }
  }

  const setRejectModal = () => {
    setViewRejectModal(!rejectModal);
  };

  const rejectData = (data) => {
    const tripId = data.id;
    const flag = data.flag;
    setCurrentTripId(tripId);
    setCurrentFlag(flag ? flag : "");
    setRejectModal();
  };

  const RejectVehicle = async () => {
    const rejectedPayload = {
      "toleranceRemarks1": document.getElementById("rejectRemarks").value,
      "isRejection": "1",
      "plantCode": Plant_Code,
      "tripId": CurrentTripId,
      "userId": User_Id,
      "flag": CurrentFlag
    }
    console.log(rejectedPayload);
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/tolerance-masters/Reject`, rejectedPayload, config)
        .then(res => {
          if (res.msg === "Rejected done successfully") {
            toast.success("Rejected Successfully", { autoClose: 3000 });
            setViewRejectModal(false);
            getAllDeviceData(Plant_Code);
          }
          else {
            toast.error(res.msg, { autoClose: 3000 });
            setViewRejectModal(false);
          }

        })
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setViewRejectModal(false);
    }

  }
  const [OTPExpiredMessage, setOTPExpiredMessage] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleTimerEnd(); // Call the new function here
    }

    return () => clearTimeout(timer);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setTimeLeft(7200);
    setIsActive(true);
    setOTPExpiredMessage(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);  // Calculate hours
    const minutes = Math.floor((seconds % 3600) / 60);  // Calculate remaining minutes
    const secs = seconds % 60;  // Calculate remaining seconds
  
    // Return the time in hh:mm:ss format with leading zeros if needed
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTimerEnd = async () => {
    const Payload = {
      "tripId": CurrentTripId,
      "flag": CurrentFlag
    }
    console.log(Payload);
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/tolerance-masters/ClearOtp`, Payload, config)
        .then(res => {
          if (res.msg === "OTP data cleared successfully") {
            setOTPExpiredMessage(true);
          }
          else {
            toast.error(res.msg, { autoClose: 3000 });
          }

        })
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
    }
  };

  //Code for 2nd lavel OTP date and time

  const [timer2L, setTimer2L] = useState(0); // Timer in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isTimerActive && timer2L > 0) {
      interval = setInterval(() => {
        setTimer2L((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer2L === 0 && isTimerActive) {
      clearInterval(interval);
      handleTimerEnd(); // Call the new function here
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timer2L]);

  const startTimer2L = (responseTime) => {
    const currentTime = new Date();
    const resTime = new Date(responseTime);

    if (currentTime.getTime() === resTime.getTime()) {
      setTimer2L(7200); // 7200 seconds = 120 minutes
      setIsTimerActive(true);
    }
    else if (Math.floor((currentTime - resTime) / 1000) < 7200) {
      setTimer2L(7200 - (Math.floor((currentTime - resTime) / 1000)));
      setIsTimerActive(true);
    }
    else {
      setOTPExpiredMessage(true);
    }
  };


  const [emailOtp, setEmailOTP] = useState(Array(6).fill(''));
  const [mobileOtp, setMobileOTP] = useState(Array(6).fill(''));
  const [bagsCount, setBagsCount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = (emailOtp, mobileOtp, bagsCount, remarks) => {
    const allEmailOTPFilled = emailOtp.every(digit => digit !== '');
    const allMobileOTPFilled = mobileOtp.every(digit => digit !== '');
    const isBagsCountFilled = bagsCount !== '';
    const isRemarksFilled = remarks !== '';

    setIsFormValid(allEmailOTPFilled && isBagsCountFilled && isRemarksFilled);
  };

  const handleInputChange = (setter, index, value, nextId, prevId, otpType) => {
    if (/^[0-9]$/.test(value)) {
      setter(prevState => {
        const newState = [...prevState];
        newState[index] = value;
        validateForm(otpType === 'email' ? newState : emailOtp, otpType === 'mobile' ? newState : mobileOtp, bagsCount, remarks);
        return newState;
      });
      if (nextId) {
        const nextElement = document.getElementById(nextId);
        if (nextElement) nextElement.focus();
      }
    } else if (value === '') {
      setter(prevState => {
        const newState = [...prevState];
        newState[index] = value;
        validateForm(otpType === 'email' ? newState : emailOtp, otpType === 'mobile' ? newState : mobileOtp, bagsCount, remarks);
        return newState;
      });
    }
  };

  const handleKeyDown = (setter, index, e, prevId, otpType) => {
    if (e.key === 'Backspace' && !e.target.value) {
      setter(prevState => {
        const newState = [...prevState];
        newState[index] = '';
        validateForm(otpType === 'email' ? newState : emailOtp, otpType === 'mobile' ? newState : mobileOtp, bagsCount, remarks);
        return newState;
      });
      if (prevId) {
        const prevElement = document.getElementById(prevId);
        if (prevElement) prevElement.focus();
      }
    }
  };

  const getSubmittedValues = () => {
    return {
      emailOtp: emailOtp.join('') ? emailOtp.join('') : "0",
      mobileOtp: emailOtp.join('') ? emailOtp.join('') : "0",
      noOfBags: bagsCount,
      toleranceRemarks1: remarks,
      plantCode: Plant_Code
    };
  };

  const handleSubmit = async (e) => {debugger;
    e.preventDefault();
    setInvalidOTP(false);
    setSubmitLoader(true);
    const submittedValues = getSubmittedValues();
    // Adding new fields
    submittedValues.flag = CurrentFlag;
    submittedValues.tripId = CurrentTripId;
    submittedValues.userId = User_Id;

    console.log(submittedValues);
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/tolerance-masters/Approve`, submittedValues, config)
        .then(res => {
          console.log(res);
          if ((res.msg).includes("Invalid")) {
            setInvalidOTP(true);
            setSubmitLoader(false);
          }
          else if(res.msg === "Flag cannot be null"){
            toast.error(res.msg, { autoClose: 3000 });
            setSubmitLoader(false);
          }
          else {
            setApproveModal();
            toast.success(res.msg, { autoClose: 3000 });
            setSubmitLoader(false);
            getAllDeviceData(Plant_Code);
            clearFields();
          }
        });
    }
    catch (e) {
      toast.warning(e, { autoClose: 3000 });
      setSubmitLoader(false);
    }
  };

  const clearFields = () => {
    setEmailOTP(Array(6).fill(''));
    setMobileOTP(Array(6).fill(''));
    setBagsCount('');
    setRemarks('');
    setIsFormValid(false); // Disable the submit button after clearing the fields
  };




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
        Header: "Vehicle No",
        accessor: "vehicleNumber",
        filterable: false,
      },
      {
        Header: "Trip ID ",
        accessor: "tripId",
        filterable: false,
      },
      {
        Header: "Material",
        accessor: "materialCode",
        filterable: false,
      },
      {
        Header: "DI Number",
        accessor: "diNumber",
        filterable: false,
      },
      {
        Header: "DI Qty (MT)",
        accessor: "di_qty",
        filterable: false,
      },
      {
        Header: "No. of Bags",
        accessor: "noOfBags",
        filterable: false,
        // Cell: (cell) => {
        //   return ((cell.value) / 50);
        // }
      },
      {
        Header: "Tolerance Type",
        accessor: "tolerance_type",
        filterable: false,
      },
      {
        Header: "Min/Max Tolerance",
        accessor: "",
        filterable: false,
        Cell: (cellProps) => {
          return (<span>{`${cellProps.row.original.min_alert} / ${cellProps.row.original.max_alert}`}</span>);
        }
      },
      {
        Header: "Tare Weight",
        accessor: "tw",
        filterable: false,
      },
      {
        Header: "Gross Weight",
        accessor: "gw",
        filterable: false,
      },
      {
        Header: "Net Weight",
        accessor: "curr_weight",
        filterable: false,
      },
      {
        Header: "Expected Weight",
        accessor: "",
        filterable: false,
        Cell: (cellProps) => {
          return (<span>{`${cellProps.row.original.min_expect} / ${cellProps.row.original.max_expect}`}</span>);
        }
      },
      {
        Header: "Tolerance Failed Time",
        accessor: "weighmentDate",
        filterable: false,
      },
      {
        Header: "Level-1 Approved By",
        accessor: "level1_Approval_by",
        filterable: false,
      },
      {
        Header: "Level-1 Approval Time",
        accessor: "level1_Approval_time",
        filterable: false,
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          if (cellProps.row.original.approvalAccess === "Approved") {
            return (
              <ul className="list-inline hstack gap-2 mb-0">
                <li class="list-inline-item cursor-pointer" title="Reject">
                  <Link
                    to="#"
                    className="text-success d-inline-block view-item-btn"
                    onClick={() => { const data = cellProps.row.original; rejectData(data); }}
                  >

                    <i className="ri-close-circle-line fs-16 text-danger"></i>
                  </Link>
                </li>
              </ul>
            );
          }
          else {
            return (
              <ul className="list-inline hstack gap-2 mb-0">
                <li class="list-inline-item cursor-pointer" title="Approve">
                  <Link
                    to="#"
                    className="text-success d-inline-block view-item-btn"
                    onClick={() => { const data = cellProps.row.original; approveData(data); }}
                  >

                    <i className="ri-checkbox-circle-line fs-16 text-success"></i>
                  </Link>
                </li>
                <li class="list-inline-item cursor-pointer" title="Reject">
                  <Link
                    to="#"
                    className="text-success d-inline-block view-item-btn"
                    onClick={() => { const data = cellProps.row.original; rejectData(data); }}
                  >

                    <i className="ri-close-circle-line fs-16 text-danger"></i>
                  </Link>
                </li>
              </ul>
            );
          }
        },
      },
    ],
  );

  const handleDownload = async (e) => {
    e.preventDefault();
    downloadCSV();
    setIsExportCSV(false)
  };

  const downloadCSV = () => {
    const header = Object.keys(devices[0]).join(',') + '\n';
    const csv = devices.map((row) => Object.values(row).join(',')).join('\n');
    const csvData = header + csv;
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'WeightApprove.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };


  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Weight Approve | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          onDownloadClick={handleDownload}
          data={devices}
        />
        <Container fluid>
          <BreadCrumb title={"Weight Approve"} pageTitle="Configuration" />
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
                        <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                        </button>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    {loader && <LoaderNew></LoaderNew>}
                    <TableContainer
                      columns={columns}
                      data={devices}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={5}
                      isGlobalSearch={true}
                      className="custom-header-css"
                      //isCustomerFilter={true}
                      SearchPlaceholder='Search for Vehicle No or something...'
                      divClass="overflow-auto"
                      tableClass="width-180"
                    />
                  </div>


                  <ToastContainer closeButton={false} limit={1} />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* <Modal isOpen={ApproveModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="md" toggle={setApproveModal}>
        <ModalHeader toggle={() => {
          setApproveModal(!ApproveModal);
        }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-white fs-20">Reason For Approve</h5>
        </ModalHeader>
        <ModalBody>
          <div className="product-content mt-0">
            <textarea type="text" className="form-control" id="rejectRemarks" />

          </div>
          <div className="button mb-2 mt-3" style={{ float: 'right' }}>
            <button className="btn btn-success"
              onClick={() => { setIsEdit(false); toggle(); ApproveVehicle() }}

            >Submit</button>
          </div>


        </ModalBody>
      </Modal> */}

      <Modal isOpen={ApproveModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="md" toggle={setApproveModal} backdrop={'static'}>
        <Card className="mt-0 mb-0">
          {level1ApprovalFlag === "" || level1ApprovalFlag === null ? (
            <CardBody className="p-4">
              <div className="p-3 border rounded">
                
                <form onSubmit={handleSubmit}>
                  <Row>
                    <h6 style={{margin:"0px 0 14px 0", fontSize:"18px", textAlign:"center"}}>Please enter remarks for approval</h6>
                    <Col className="col-12">
                      <div className="mb-3">
                        <label htmlFor="bagsCount">No. of Bags</label>
                        <input
                          type="text"
                          className="form-control form-control-sm bg-light border-light text-center"
                          id="bagsCount"
                          value={bagsCount}
                          required
                          onChange={(e) => {
                            setBagsCount(e.target.value);
                            validateForm(emailOtp, mobileOtp, e.target.value, remarks);
                          }}
                        />
                      </div>
                    </Col>
                    <Col className="col-12">
                      <div className="mb-3">
                        <label htmlFor="remarks">Remarks</label>
                        <input
                          type="text"
                          className="form-control form-control-sm bg-light border-light text-center"
                          id="remarks"
                          value={remarks}
                          required
                          onChange={(e) => {
                            setRemarks(e.target.value);
                            validateForm(emailOtp, mobileOtp, bagsCount, e.target.value);
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="text-center d-flex row mx-auto justify-content-center">
                    <Col className="col-4">
                      <Button color="success" type="submit" className="w-100">{SubmitLoader ? <><Spinner size="sm" className='me-2 visible'></Spinner></> : "Approve"}</Button>
                    </Col>
                    <Col className="col-4">
                      <Button color="warning" type="button" className="w-100" onClick={setApproveModal}>Close</Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </CardBody>
          ) :
            <CardBody className="p-5">
              <div className="avatar-lg mx-auto">
                <lord-icon
                  src="https://cdn.lordicon.com/rhvddzym.json"
                  trigger="loop"
                  colors="primary:#0ab39c"
                  className="avatar-xl"
                  style={{ width: "120px", height: "100px", marginTop: "-35px" }}
                >
                </lord-icon>
              </div>

              <div className="p-3 border rounded" style={{ marginTop: "-32px" }}>
                <div className="text-muted text-center mb-1 mx-lg-3">
                  <h4 className="">Enter Verification Code</h4>
                </div>
                {getOTPDateTime !== "" && <p className="mt-0 mb-1 text-center">OTP sent on : <b>{getOTPDateTime}</b></p>}
                {OTPExpiredMessage ? (
                  <p className="text-danger text-center mb-1">OTP has been expired. Please resend.</p>
                )
                  :
                  isTimerActive ? (
                    (
                      <p className="text-danger text-center mb-1">
                        Your OTP will expire in <span>
                          <span className="fw-semibold">{formatTime(timer2L)}</span>

                        </span>
                      </p>
                    )
                  ) :
                    isActive ? (
                      (
                        <p className="text-danger text-center mb-1">
                          Your OTP will expire in <span>
                            <span className="fw-semibold">{formatTime(timeLeft)}</span>

                          </span>
                        </p>
                      )
                    ) :
                      (
                        null
                      )
                }


                <form>
                  <Row>
                    <p className="text-muted text-center">
                      Enter 6 digit code for Tolerance approval.
                    </p>
                    {emailOtp.map((digit, index) => (
                      <Col className="col-2" key={`email-digit-${index}`}>
                        <div className="mb-3">
                          <label htmlFor={`email-digit${index + 1}-input`} className="visually-hidden">Digit {index + 1}</label>
                          <input
                            type="text"
                            className="form-control form-control-sm bg-light border-light text-center"
                            maxLength="1"
                            id={`email-digit${index + 1}-input`}
                            value={digit}
                            onInput={(e) => handleInputChange(setEmailOTP, index, e.target.value, `email-digit${index + 2}-input`, `email-digit${index}`, 'email')}
                            onKeyDown={(e) => handleKeyDown(setEmailOTP, index, e, `email-digit${index}`, 'email')}
                          />
                        </div>
                      </Col>
                    ))}
                    {/* <p className="text-muted text-center">
                    Enter 6 digit code sent to <span className="fw-semibold">registered mobile number</span>
                  </p>
                  {mobileOtp.map((digit, index) => (
                    <Col className="col-2" key={`mobile-digit-${index}`}>
                      <div className="mb-3">
                        <label htmlFor={`mobile-digit${index + 1}-input`} className="visually-hidden">Digit {index + 1}</label>
                        <input
                          type="text"
                          className="form-control form-control-sm bg-light border-light text-center"
                          maxLength="1"
                          id={`mobile-digit${index + 1}-input`}
                          value={digit}
                          onInput={(e) => handleInputChange(setMobileOTP, index, e.target.value, `mobile-digit${index + 2}-input`, `mobile-digit${index}`, 'mobile')}
                          onKeyDown={(e) => handleKeyDown(setMobileOTP, index, e, `mobile-digit${index}`, 'mobile')}
                        />
                      </div>
                    </Col>
                  ))} */}
                  </Row>
                  <Row>
                    <Col className="col-6">
                      <div className="mb-3">
                        <label htmlFor="bagsCount">No. of Bags</label>
                        <input
                          type="text"
                          className="form-control form-control-sm bg-light border-light text-center"
                          id="bagsCount"
                          value={bagsCount}
                          onChange={(e) => {
                            setBagsCount(e.target.value);
                            validateForm(emailOtp, mobileOtp, e.target.value, remarks);
                          }}
                        />
                      </div>
                    </Col>
                    <Col className="col-6">
                      <div className="mb-3">
                        <label htmlFor="remarks">Remarks</label>
                        <input
                          type="text"
                          className="form-control form-control-sm bg-light border-light text-center"
                          id="remarks"
                          value={remarks}
                          onChange={(e) => {
                            setRemarks(e.target.value);
                            validateForm(emailOtp, mobileOtp, bagsCount, e.target.value);
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="text-center d-flex row mx-auto justify-content-center">
                    <Col className="col-4">
                      <Button color="success" type="submit" className="w-100" onClick={handleSubmit} disabled={!isFormValid}>{SubmitLoader ? <><Spinner size="sm" className='me-2 visible'></Spinner></> : "Approve"}</Button>
                    </Col>
                    <Col className="col-4">
                      <Button color="warning" type="button" className="w-100" onClick={setApproveModal}>Close</Button>
                    </Col>
                  </Row>
                </form>
              </div>
              <div className="mt-4 text-center">
                <p className="mb-0">Didn't receive a code ? <Link to="#" className="fw-semibold text-primary text-decoration-underline" onClick={resendOtp}>{Resendloader ? <><Spinner size="sm" className='me-2 visible'></Spinner>Loading...</> : "Resend"}</Link></p>
              </div>
              {Success && Success ? (<UncontrolledAlert color="success" className="mt-3 text-center">OTP sent successfully!</UncontrolledAlert>) : null}
              {InvalidOTP && InvalidOTP ? (<UncontrolledAlert color="danger" className="mt-3 text-center">Invalid OTP</UncontrolledAlert>) : null}
            </CardBody>
          }
        </Card>
      </Modal>

      <Modal isOpen={rejectModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="md" toggle={setRejectModal}>
        <ModalHeader toggle={() => {
          setRejectModal(!rejectModal);
        }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-white fs-20">Reason For Reject</h5>
        </ModalHeader>
        <ModalBody>
          <div className="product-content mt-0">
            <textarea type="text" className="form-control" id="rejectRemarks" />

          </div>
          <div className="button mb-2 mt-3" style={{ float: 'right' }}>
            <button className="btn btn-success"
              onClick={() => { toggle(); RejectVehicle() }}

            >Submit</button>
          </div>


        </ModalBody>
      </Modal>


    </React.Fragment>
  );
};

export default ReportWeightApprove;
