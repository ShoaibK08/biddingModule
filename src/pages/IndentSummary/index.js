import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, CardBody, Collapse, Nav,
    NavItem,
    NavLink,
} from "reactstrap";

import { Link, useParams } from "react-router-dom";
import * as moment from "moment";
import CountUp from "react-countup";
import FeatherIcon from "feather-icons-react";
import { Switch } from "@material-ui/core";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

import '../IndentSummary/indentSummary.css';
import TableContainer from "../../Components/Common/TableContainer";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../Components/Common/Loader";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import classnames from "classnames";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AllocateTT from "./allocateTT";
import ViewIndentStatus from "./viewIndentStatus";
import ViewRejectedStatus from "./viewRejectedStatus";
import AllocateTTMannual from "./allocateTTMannual";

const useStyles = makeStyles({
    customTextField: {
        "& input::placeholder": {
            fontSize: "0.9rem"
        }
    }
});

const IndentSummary = () => {
    const classes = useStyles();
    const [col1, setcol1] = useState(true)
    const [col3, setcol3] = useState(true)

    function togglecol1() {
        setcol1(!col1)
    }
    function togglecol3() {
        setcol3(!col3)
    }

    const [indentData, setAllData] = useState([]);
    const [totalIndents, setTotalIndents] = useState([]);
    const [totalPendingIndents, setPendingIndents] = useState([]);
    const [totalTTAllocatedIndents, setTTAllocatedIndents] = useState([]);
    const [totalPartiallyApprovedIndents, setPartiallyApprovedIndents] = useState([]);
    const [totalRejectedIndents, setRejectedIndents] = useState([]);
    const [totalApprovedIndents, setApprovedIndents] = useState([]);
    const [singleData, setSingleData] = useState([]);
    const [Image, setImage] = useState([]);
    const [userID, setUserID] = useState([]);

    const [rejectModal, setRejectModal] = useState(false);
    const toggleRejectmodal = () => {
        setRejectModal(!rejectModal);
    };

    const [cancelModal, setCancelModal] = useState(false);
    const toggleCancelModal = () => {
        setCancelModal(!cancelModal);
    };


    useEffect(() => {
        firstTimeFunction();
        //alert(JSON.stringify(process.env.REACT_APP_LOCAL_URL_8042));
    }, []);


    const firstTimeFunction = () => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        setUserID(obj.data._id)
        let str = obj.data._id;
        if (str.includes("TRAN")) {
            axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/getIndentByTransporterCode?transporterCode=${obj.data._id}`)
                .then(res => {
                    const indentData = res;
                    setAllData(indentData);
                    setTotalIndents(indentData.length);

                    const pending = indentData.filter(function (item) {
                        if (item.indentStatus === "Pending") {
                            return true;
                        } else {
                            return false;
                        }
                    }).length; // 6
                    setPendingIndents(pending);
                    const ttAllocated = indentData.filter(function (item) {
                        if (item.indentStatus === "TTAllocated") {
                            return true;
                        } else {
                            return false;
                        }
                    }).length; // 6
                    setTTAllocatedIndents(ttAllocated);
                    const partiallyApproved = indentData.filter(function (item) {
                        if (item.indentStatus === "PartiallyApproved") {
                            return true;
                        } else {
                            return false;
                        }
                    }).length; // 6
                    setPartiallyApprovedIndents(partiallyApproved);
                    const rejected = indentData.filter(function (item) {
                        if (item.indentStatus === "Rejected") {
                            return true;
                        } else {
                            return false;
                        }
                    }).length; // 6
                    setRejectedIndents(rejected);
                    const approved = indentData.filter(function (item) {
                        if (item.indentStatus === "Approved") {
                            return true;
                        } else {
                            return false;
                        }
                    }).length; // 6
                    setApprovedIndents(approved);
                });
        }
        else {
            axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/getIndentByCustomerCode?indentPlacedBy=${obj.data._id}`)
                .then(res => {
                    const indentData = res;
                    setAllData(indentData);
                    setTotalIndents(indentData.length);

                    const pending = indentData.filter(function (item) {
                        if (item.indentStatus === "Pending") {
                            return true;
                        } else {
                            return false;
                        }
                    }).length; // 6
                    setPendingIndents(pending);
                    const partiallyApproved = indentData.filter(function (item) {
                        if (item.indentStatus === "PartiallyApproved") {
                            return true;
                        } else {
                            return false;
                        }
                    }).length; // 6
                    setPartiallyApprovedIndents(partiallyApproved);
                    const rejected = indentData.filter(function (item) {
                        if (item.indentStatus === "Rejected") {
                            return true;
                        } else {
                            return false;
                        }
                    }).length; // 6
                    setRejectedIndents(rejected);
                    const approved = indentData.filter(function (item) {
                        if (item.indentStatus === "Approved") {
                            return true;
                        } else {
                            return false;
                        }
                    }).length; // 6
                    setApprovedIndents(approved);
                });
        }
    }


    const allIndentFunction = (() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        setUserID(obj.data._id)
        let str = obj.data._id;
        if (str.includes("TRAN")) {
            axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/getIndentByIndentStatus?indentStatus=Approved&indentPlacedBy=${obj.data._id}`)
                .then(res => {
                    const indentData = res;
                    setAllData(indentData);
                    setTotalIndents(indentData.length);
                });
        }
        else {
            axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/getIndentByCustomerCode?indentPlacedBy=${obj.data._id}`)
                .then(res => {
                    const indentData = res;
                    setAllData(indentData);
                    setTotalIndents(indentData.length);
                });
        }
    });



    const [viewModal, setViewModal] = useState(false);

    // Delete customer
    const [deleteModal, setDeleteModal] = useState(false);

    const [modal, setModal] = useState(false);
    const [RejectedSummary, setRejectedSummary] = useState(false);
    const [modalTT, setTTModal] = useState(false);
    const [modalTTMannual, setTTModalMannual] = useState(false);
    const [allData, setAllDataOnSelectedIndent] = useState("");
    const [quantity, setquantity] = useState("");

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
        } else {
            setModal(true);
        }
    }, [modal]);

    const toggleRejectedSummary = useCallback(() => {
        if (RejectedSummary) {
            setRejectedSummary(false);
        } else {
            setRejectedSummary(true);
        }
    }, [RejectedSummary]);

    const toggleTTModal = useCallback(() => {
        if (modalTT) {
            setTTModal(false);
        } else {
            setTTModal(true);
        }
    }, [modalTT]);

    const toggleTTModalMannual = useCallback(() => {
        localStorage.setItem('vehicle', []);
        if (modalTTMannual) {
            setTTModalMannual(false);
        } else {
            setTTModalMannual(true);
        }
    }, [modalTTMannual]);



    // Delete Data
    const onClickDelete = (vehicle) => {
        setDeleteModal(true);
    };


    // Add Data
    const handleCustomerClicks = () => {
        //setIsEdit(false);
        toggle();
    };

    const handleChange = (event, indent) => {
        
        if (event.target.checked) {
            //alert("checked", indent);
            axios.post(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/setIndentPriority?flag=1&indentNumber=${indent}`)
                .then(res => {
                    if (res.message === "Success") {
                        toast.success("Priority for this indent set successfully!.", { autoClose: 3000 });
                    }
                    else {
                        toast.error("Something went wrong!", { autoClose: 3000 });
                    }
                })
        }
        else {
            axios.post(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/setIndentPriority?flag=0&indentNumber=${indent}`)
                .then(res => {
                    if (res.message === "Success") {
                        toast.success("Priority for this indent unset successfully!.", { autoClose: 3000 });
                    }
                    else {
                        toast.error("Something went wrong!", { autoClose: 3000 });
                    }
                })
        }
    }

    const viewSummary = (indentNumber) => {
        
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/getIndentByIndentNo?indentNo=${indentNumber}`)
            .then(res => {
                const result = res;
                setSingleData(result);
                setImage((result.material_image).split(',')[0]);
            })
        setViewModal(true);
        toggle();
    };

    const viewRejectedSummary = (indentNumber) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/getIndentByIndentNo?indentNo=${indentNumber}`)
            .then(res => {
                const result = res;
                setSingleData(result);
                setImage((result.material_image).split(',')[0]);
            })
        toggleRejectedSummary();
    };

    const statusWiseFunction = (status) => {

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/getIndentByIndentStatus?indentStatus=${status}&indentPlacedBy=${userID}`)
            .then(res => {
                const indentData = res;
                setAllData(indentData);
                //setTotalIndents(indentData.length);
            })

    };

    const allocateTT = (data) => {
        console.log(JSON.stringify(data))
        let allData = JSON.parse(data);
        setAllDataOnSelectedIndent(allData);
        setquantity(`${JSON.parse(data).quantity} ${JSON.parse(data).unitMeasurement}`);
        toggleTTModal();
    };

    const allocateTTMannual = (data) => {
        console.log(JSON.stringify(data))
        let allData = JSON.parse(data);
        setAllDataOnSelectedIndent(allData);
        setquantity(`${JSON.parse(data).quantity} ${JSON.parse(data).unitMeasurement}`);
        toggleTTModalMannual();
    };

    const params = useParams();
    const [input, setInput] = useState([]);

    const onTagsChange = (event, values) => {
        setInput(values);
        if (values.title) {
            localStorage.setItem('ProductQuantity', JSON.stringify(values.title));
        }
        else {
            localStorage.setItem('ProductQuantity', JSON.stringify(values));
        }
        localStorage.setItem('ProductID', params._id);
    };

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



    const deleteCheckbox = () => {
        const ele = document.querySelectorAll(".customerCheckBox:checked");
        ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
        setSelectedCheckBoxDelete(ele);
    };


    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>JBPM Function for Approve nad Reject>>>>>>>>>>>>>>>>>>.

    // const approveClick = async (indentNumber) => {

    //     try {
    //         sessionStorage.getItem("authUser");
    //         const obj = JSON.parse(sessionStorage.getItem("authUser"));
    //         let str = obj.data._id;
    //         if (str.includes("CU")) {
    //             const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/indentAccepted/` + indentNumber)
    //             console.log(res.data);
    //             firstTimeFunction();
    //             toast.success("Indent Approved Successfully.", { autoClose: 3000 });
    //         }
    //         else {
    //             const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/indentAcceptedByAreaManager/` + indentNumber)
    //             console.log(res.data);
    //             firstTimeFunction();
    //             toast.success("Indent Approved Successfully.", { autoClose: 3000 });
    //         }
    //     } catch (e) {
    //         toast.error("Something went wrong!", { autoClose: 3000 });
    //     }

    // }

    const approveClick = async (indentNumber) => {

        try {
            const res = await axios.get('http://localhost:8097/humantask/processinstanceid/approved/' + indentNumber)
            console.log(res.data);
            firstTimeFunction();
            toast.success("Indent Approved Successfully.", { autoClose: 3000 });
        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
        }

    }

    const [message, setMessage] = useState('');
    const [indentNumber, setIndentNumber] = useState('');
    const [status, setIndentStatus] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [message1, setMessage1] = useState('');
    const [disabled1, setDisabled1] = useState(true);

    const handleChangeReject = (event) => {
        
        //var data = event.target.value;
        if (event.target.value === "") {
            setDisabled(true);
            setMessage("");
        }
        else {
            setDisabled(false);
            setMessage(event.target.value);
        }
    };

    const handleCancelRemarks = (event) => {
        
        //var data = event.target.value;
        if (event.target.value === "") {
            setDisabled1(true);
            setMessage1("");
        }
        else {
            setDisabled1(false);
            setMessage1(event.target.value);
        }
    };

    // const handleClickReject = async () => {
    //     try {
    //         sessionStorage.getItem("authUser");
    //         const obj = JSON.parse(sessionStorage.getItem("authUser"));
    //         let str = obj.data._id;
    //         if (str.includes("CU")) {
    //             const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/indentRejected/${indentNumber}/${message}`)
    //             console.log(res.data);
    //             firstTimeFunction();
    //             toast.success("Indent Rejected Successfully", { autoClose: 3000 });
    //         }
    //         else {
    //             const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/indentRejectedByAreaManager/${indentNumber}/${message}`)
    //             console.log(res.data);
    //             firstTimeFunction();
    //             toast.success("Indent Rejected Successfully", { autoClose: 3000 });
    //         }
    //     } catch (e) {
    //         toast.error("Something went wrong!", { autoClose: 3000 });
    //     }
    //     toggleRejectmodal();
    // };

    const handleClickReject = async () => {
        try {

            const res = await axios.get(`http://localhost:8097/humantask/processinstanceid/rejected/${indentNumber}/${message}`)
            console.log(res.data);
            firstTimeFunction();
            toast.success("Indent Rejected Successfully", { autoClose: 3000 });
        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
        }
        toggleRejectmodal();
    };

    const handleCancelIndent = async () => {
        
        try {

            const res = await axios.get(`http://localhost:8042/indentModule/indent/cancelIndent?indentNo=${indentNumber}&cancelReason=${message1}`)
            console.log(res.data);
            if(res === "Already Cancelled"){
                toast.error("Indent Cancellation All Ready Initiated!", { autoClose: 3000 });
                toggleCancelModal();
            }else{
                firstTimeFunction();
                if (status === "Pending") {
                    toast.success("Indent Cancelled Successfully", { autoClose: 3000 });
                } else {
                    toast.success("Indent Cancellation Initiated Successfully", { autoClose: 3000 });
                }
            }

        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
        }
        toggleCancelModal();
    };

    const rejectClick = async (indentNumber) => {
        toggleRejectmodal();
        setIndentNumber(indentNumber);
        setMessage("");
        setMessage1("");

    }

    const cancelClick = async (indentNumber, status) => {
        
        toggleCancelModal();
        setIndentNumber(indentNumber);
        setIndentStatus(status);
        setMessage("");
        setMessage1("");

    }

    // Table Column
    const columns = useMemo(
        () => [
            // {
            //     Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
            //     Cell: (cellProps) => {
            //         return <input type="checkbox" className="customerCheckBox form-check-input" value={cellProps.row.original._id} onChange={() => deleteCheckbox()} />;
            //     },
            //     id: '#',
            // },
            {
                Header: "Indent No.",
                accessor: "indentNo",
                filterable: false,
            },
            {
                Header: "Product Code",
                accessor: "product",
                filterable: false,
            },
            // {
            //     Header: "Name",
            //     accessor: "payerName",
            //     filterable: false,
            // },
            {
                Header: "Indent Date & Time",
                accessor: "indentCreationDate",
                filterable: false,
                Cell: (cell) => {
                    return ((cell.value).replace("T"," ")).split(".")[0];
                }
            },
            {
                Header: "Placed By",
                accessor: "indentPlaceBy",
                filterable: false,
            },
            {
                Header: "Transporter ID",
                accessor: "transporterId",
                filterable: false,
            },
            {
                Header: "Quantity",
                accessor: d => `${d.quantity} ${d.unitMeasurement}`,
                filterable: false,
            },
            {
                Header: "SO Number",
                accessor: d => d.soNumber ? d.soNumber : "-",
                filterable: false,
            },
            {
                Header: "Shipment Type",
                accessor: "shipmentType",
                filterable: false,
            },
            {
                Header: "Remarks",
                accessor: d => d.rejectRemarks ? d.rejectRemarks : "-",
                filterable: false,
            },
            {
                Header: "Status",
                accessor: "indentStatus",
                Cell: (cell) => {
                    if (cell.value === "Approved") {

                        return <span className="badge text-uppercase badge-soft-success"> Approved </span>;
                    }
                    else if (cell.value === "Rejected") {

                        return <span className="badge text-uppercase badge-soft-danger"> Rejected </span>;
                    }
                    else if (cell.value === "PartiallyApproved") {

                        return <span className="badge text-uppercase badge-soft-primary"> Partially Approved </span>;
                    }
                    else if (cell.value === "TTAllocated") {

                        return <span className="badge text-uppercase badge-soft-primary"> TT Allocated </span>;
                    }
                    else if (cell.value === "PartiallyTTAllocated") {

                        return <span className="badge text-uppercase badge-soft-primary"> Partially TT Allocated </span>;
                    }
                    if (cell.value === "Executed") {
                        return <span className="badge text-uppercase badge-soft-success"> Executed </span>;
                    }
                    else {
                        return <span className="badge text-uppercase badge-soft-warning"> Pending </span>;
                    }
                }
            },
            {
                Header: "Action",
                Cell: (cellProps) => {
                    sessionStorage.getItem("authUser");
                    const obj = JSON.parse(sessionStorage.getItem("authUser"));
                    let str = obj.data._id;
                    if (str.includes("TRAN")) {
                        if (cellProps.row.original.indentStatus === "TTAllocated") {
                            return (
                                <ul className="list-inline hstack gap-2 mb-0">
                                    <li className="list-inline-item edit" title="View">
                                        <Link
                                            to="#"
                                            className="text-primary d-inline-block edit-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; viewSummary(indentNumber); }}
                                        ><button type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light border-primary">View Status</button>
                                        </Link>
                                    </li>
                                </ul>
                            );
                        }
                        else {
                            return (
                                <ul className="list-inline hstack gap-2 mb-0">
                                    <li className="list-inline-item edit" title="View">
                                        <Link
                                            to="#"
                                            className="text-primary d-inline-block edit-item-btn"
                                            onClick={() => { const data = `${JSON.stringify(cellProps.row.original)}`; allocateTT(data); }}
                                        ><button type="button" className="btn btn-sm btn-outline-success waves-effect waves-light border-success">Allocate TT</button>
                                        </Link>
                                    </li>
                                </ul>
                            );
                        }

                    }
                    else if (str.includes("AREA")) {
                        if (cellProps.row.original.indentStatus === "PartiallyApproved") {
                            return (
                                <ul className="list-inline hstack gap-2 mb-0">
                                    <li className="list-inline-item edit" title="Approve">
                                        <Link
                                            to="#"
                                            className="text-primary d-inline-block approve-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; approveClick(indentNumber); }}
                                        ><i className="ri-checkbox-circle-line fs-16 text-success"></i>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item" title="Reject">
                                        <Link
                                            to="#"
                                            className="text-danger d-inline-block reject-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; rejectClick(indentNumber); }}
                                        ><i className="ri-close-circle-line fs-16 text-danger"></i>
                                        </Link>
                                    </li>
                                </ul>
                            )
                        }
                        else if (cellProps.row.original.indentStatus === "Pending") {
                            return <span className="badge text-uppercase badge-soft-success"> No Action </span>;
                        }
                        else if (cellProps.row.original.indentStatus === "Rejected") {
                            return (
                                <ul className="list-inline hstack gap-2 mb-0">
                                    {/* <li className="list-inline-item edit" title="Approve">
                                        <Link
                                            to="#"
                                            className="text-primary d-inline-block approve-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; approveClick(indentNumber); }}
                                        ><i className="ri-checkbox-circle-line fs-16 text-success"></i>
                                        </Link>
                                    </li> */}
                                    <li className="list-inline-item" title="View Status">
                                        <Link
                                            to="#"
                                            className="text-primary d-inline-block edit-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; viewRejectedSummary(indentNumber); }}
                                        >

                                            <i className="ri-eye-fill fs-16"></i>
                                        </Link>
                                    </li>
                                </ul>
                            )
                        }
                        else if (cellProps.row.original.indentStatus === "Approved") {
                            if (cellProps.row.original.shipmentType === "DEO") {
                                if (cellProps.row.original.allocationFlag === "A") {
                                    return (
                                        <>
                                            <span className="form-check form-switch form-switch-success mb-3">
                                                Priority &nbsp;<input className="form-check-input" type="checkbox" role="switch" onClick={(e) => { const indentNumber = cellProps.row.original.indentNo; handleChange(e, indentNumber); }} />
                                            </span>
                                        </>
                                    )
                                }
                                if (cellProps.row.original.allocationFlag === "M") {
                                    return (
                                        <Link
                                            to="#" className="text-success d-inline-block edit-item-btn"
                                            onClick={() => { const data = `${JSON.stringify(cellProps.row.original)}`; allocateTTMannual(data); }}
                                        > <i className="ri-truck-line fs-16"></i>
                                        </Link>
                                    )
                                }
                            }
                            if (cellProps.row.original.shipmentType === "XMI") {
                                return (
                                    <li className="list-inline-item edit" title="View">
                                        <Link
                                            to="#"
                                            className="text-primary d-inline-block edit-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; viewSummary(indentNumber); }}
                                        >

                                            <i className="ri-eye-fill fs-16"></i>
                                        </Link>
                                    </li>
                                )
                            }
                        }
                        else if (cellProps.row.original.indentStatus === "PartiallyTTAllocated") {
                            if (cellProps.row.original.shipmentType === "DEO") {
                                if (cellProps.row.original.allocationFlag === "A") {
                                    return (
                                        <>
                                            <span className="form-check form-switch form-switch-success mb-3">
                                                Priority &nbsp;<input className="form-check-input" type="checkbox" role="switch" onClick={(e) => { const indentNumber = cellProps.row.original.indentNo; handleChange(e, indentNumber); }} />
                                            </span>
                                        </>
                                    )
                                }
                                if (cellProps.row.original.allocationFlag === "M") {
                                    return (
                                        <Link
                                            to="#" className="text-success d-inline-block edit-item-btn"
                                            onClick={() => { const data = `${JSON.stringify(cellProps.row.original)}`; allocateTTMannual(data); }}
                                        > <i className="ri-truck-line fs-16"></i>
                                        </Link>
                                    )
                                }
                            }
                        }
                        else {
                            return (
                                <ul className="list-inline hstack gap-2 mb-0">
                                    <li className="list-inline-item edit" title="View">
                                        <Link
                                            to="#"
                                            className="text-primary d-inline-block edit-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; viewSummary(indentNumber); }}
                                        >

                                            <i className="ri-eye-fill fs-16"></i>
                                        </Link>
                                    </li>
                                    {/* <li className="list-inline-item" title="Remove">
                                        <Link
                                            to="#"
                                            className="text-danger d-inline-block remove-item-btn"
                                        >
                                            <i className="ri-delete-bin-5-fill fs-16"></i>
                                        </Link>
                                    </li> */}
                                </ul>
                            );
                        }
                    }
                    else if (str.includes("CU")) {
                        if (cellProps.row.original.indentStatus === "Pending") {
                            return (
                                <ul className="list-inline hstack gap-2 mb-0">
                                    <li className="list-inline-item edit" title="Approve">
                                        <Link
                                            to="#"
                                            className="text-primary d-inline-block approve-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; approveClick(indentNumber); }}
                                        ><i className="ri-checkbox-circle-line fs-16 text-success"></i>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item" title="Reject">
                                        <Link
                                            to="#"
                                            className="text-danger d-inline-block reject-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; rejectClick(indentNumber); }}
                                        ><i className="ri-close-circle-line fs-16 text-danger"></i>
                                        </Link>
                                    </li>
                                </ul>
                            )
                        }
                        else if (cellProps.row.original.indentStatus === "TTAllocated") {
                            if ((cellProps.row.original.indentPlaceBy).includes("SO")) {
                                return (
                                    <ul className="list-inline hstack gap-2 mb-0">
                                        <li className="list-inline-item edit" title="View">
                                            <Link
                                                to="#"
                                                className="text-primary d-inline-block edit-item-btn"
                                                onClick={() => { const indentNumber = cellProps.row.original.indentNo; viewSummary(indentNumber); }}
                                            ><i className="ri-eye-fill fs-16"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                )
                            }
                            else {
                                return (
                                    <ul className="list-inline hstack gap-2 mb-0">
                                        <li className="list-inline-item edit" title="View">
                                            <Link
                                                to="#"
                                                className="text-primary d-inline-block edit-item-btn"
                                                onClick={() => { const indentNumber = cellProps.row.original.indentNo; viewSummary(indentNumber); }}
                                            ><i className="ri-eye-fill fs-16"></i>
                                            </Link>
                                        </li>
                                        <li className="list-inline-item" title="Cancel Indent">
                                            <Link
                                                to="#"
                                                className="text-danger d-inline-block remove-item-btn"
                                                onClick={() => { const indentNumber = cellProps.row.original.indentNo; const status = cellProps.row.original.indentStatus; cancelClick(indentNumber, status); }}
                                            >
                                                <i className="mdi mdi-truck-remove" style={{ fontSize: "medium" }}></i>
                                            </Link>
                                        </li>
                                    </ul>
                                )
                            }
                        }
                        else if (cellProps.row.original.indentStatus === "PartiallyTTAllocated") {
                            if ((cellProps.row.original.indentPlaceBy).includes("SO")) {
                                return (
                                    <ul className="list-inline hstack gap-2 mb-0">
                                        <li className="list-inline-item edit" title="View">
                                            <Link
                                                to="#"
                                                className="text-primary d-inline-block edit-item-btn"
                                                onClick={() => { const indentNumber = cellProps.row.original.indentNo; viewSummary(indentNumber); }}
                                            ><i className="ri-eye-fill fs-16"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                )
                            }
                            else {
                                return (
                                    <ul className="list-inline hstack gap-2 mb-0">
                                        <li className="list-inline-item edit" title="View">
                                            <Link
                                                to="#"
                                                className="text-primary d-inline-block edit-item-btn"
                                                onClick={() => { const indentNumber = cellProps.row.original.indentNo; viewSummary(indentNumber); }}
                                            ><i className="ri-eye-fill fs-16"></i>
                                            </Link>
                                        </li>
                                        <li className="list-inline-item" title="Cancel Indent">
                                            <Link
                                                to="#"
                                                className="text-danger d-inline-block remove-item-btn"
                                                onClick={() => { const indentNumber = cellProps.row.original.indentNo; const status = cellProps.row.original.indentStatus; cancelClick(indentNumber, status); }}
                                            >
                                                <i className="mdi mdi-truck-remove" style={{ fontSize: "medium" }}></i>
                                            </Link>
                                        </li>
                                    </ul>
                                )
                            }
                        }
                        else if (cellProps.row.original.indentStatus === "Approved") {
                            if ((cellProps.row.original.indentPlaceBy).includes("SO")) {
                                return (
                                    <ul className="list-inline hstack gap-2 mb-0">
                                        <li className="list-inline-item edit" title="View">
                                            <Link
                                                to="#"
                                                className="text-primary d-inline-block edit-item-btn"
                                                onClick={() => { const indentNumber = cellProps.row.original.indentNo; viewSummary(indentNumber); }}
                                            ><i className="ri-eye-fill fs-16"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                )
                            }
                            else {
                                return (
                                    <ul className="list-inline hstack gap-2 mb-0">
                                        <li className="list-inline-item edit" title="View">
                                            <Link
                                                to="#"
                                                className="text-primary d-inline-block edit-item-btn"
                                                onClick={() => { const indentNumber = cellProps.row.original.indentNo; viewSummary(indentNumber); }}
                                            ><i className="ri-eye-fill fs-16"></i>
                                            </Link>
                                        </li>
                                        <li className="list-inline-item" title="Cancel Indent">
                                            <Link
                                                to="#"
                                                className="text-danger d-inline-block remove-item-btn"
                                                onClick={() => { const indentNumber = cellProps.row.original.indentNo; const status = cellProps.row.original.indentStatus; cancelClick(indentNumber, status); }}
                                            >
                                                <i className="mdi mdi-truck-remove" style={{ fontSize: "medium" }}></i>
                                            </Link>
                                        </li>
                                    </ul>
                                )
                            }
                        }
                        else {
                            return <span className="badge text-uppercase badge-soft-success"> No Action </span>;
                        }
                    }
                    else {
                        if (cellProps.row.original.indentStatus === "Executed") {
                            return (
                                <ul className="list-inline hstack gap-2 mb-0">
                                    <li className="list-inline-item edit" title="View">
                                        <Link
                                            to="#"
                                            className="text-primary d-inline-block edit-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; viewSummary(indentNumber); }}
                                        >

                                            <i className="ri-eye-fill fs-16"></i>
                                        </Link>
                                    </li>
                                </ul>
                            );
                        }
                        else {
                            return (
                                <ul className="list-inline hstack gap-2 mb-0">
                                    <li className="list-inline-item edit" title="View">
                                        <Link
                                            to="#"
                                            className="text-primary d-inline-block edit-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; viewSummary(indentNumber); }}
                                        >

                                            <i className="ri-eye-fill fs-16"></i>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item" title="Cancel Indent">
                                        <Link
                                            to="#"
                                            className="text-danger d-inline-block remove-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; const status = cellProps.row.original.indentStatus; cancelClick(indentNumber, status); }}
                                        >
                                            <i className="mdi mdi-truck-remove" style={{ fontSize: "medium" }}></i>
                                        </Link>
                                    </li>
                                </ul>
                            );
                        }
                    }

                },
            },
        ],
        []
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

    document.title = "Indent Summary";
    return (
        <React.Fragment>
            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={"Functionality is in progress!"}
                />

                <Container fluid>
                    <BreadCrumb title="Indent Summary" pageTitle="Nayara Energy" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Indent Category</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </button>
                                            </div>
                                        </div>
                                    </Row>
                                    <Row className="mt-4">
                                        {(userID.includes("CU")) &&
                                            <Col md={3}>
                                                <Card className="card-animate shadow" onClick={() => { allIndentFunction(); }}>
                                                    <CardBody>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                <p className="fw-bold mb-0 text-primary">Total Indents</p>
                                                                <h2 className="mt-4 ff-secondary fw-semibold">
                                                                    <span className="counter-value">
                                                                        <CountUp
                                                                            start={0}
                                                                            end={totalIndents}
                                                                            duration={4}


                                                                        /></span></h2>
                                                                <p className="mb-0 text-muted"><span className="badge bg-light text-success mb-0">
                                                                    <i className="ri-arrow-up-line align-middle"></i> 6.24 %
                                                                </span> vs. previous month</p>
                                                            </div>
                                                            <div>
                                                                <div className="avatar-sm flex-shrink-0">
                                                                    <span className="avatar-title rounded-circle fs-2 bg-primary">
                                                                        <FeatherIcon
                                                                            icon="file-text"
                                                                            className="text-light"
                                                                        />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        }
                                        {(userID.includes("TR")) &&
                                            <Col md={3}>
                                                <Card className="card-animate shadow" onClick={() => { statusWiseFunction("TTAllocated"); }}>
                                                    <CardBody>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                <p className="fw-bold mb-0 text-primary">TT Allocated Indents</p>
                                                                <h2 className="mt-4 ff-secondary fw-semibold">
                                                                    <span className="counter-value">
                                                                        <CountUp
                                                                            start={0}
                                                                            end={totalTTAllocatedIndents}
                                                                            duration={4}


                                                                        /></span></h2>
                                                                <p className="mb-0 text-muted"><span className="badge bg-light text-success mb-0">
                                                                    <i className="ri-arrow-up-line align-middle"></i> 6.24 %
                                                                </span> vs. previous month</p>
                                                            </div>
                                                            <div>
                                                                <div className="avatar-sm flex-shrink-0">
                                                                    <span className="avatar-title rounded-circle fs-2 bg-primary">
                                                                        <FeatherIcon
                                                                            icon="file-text"
                                                                            className="text-light"
                                                                        />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        }

                                        <Col md={3}>
                                            <Card className="card-animate shadow" onClick={() => { statusWiseFunction("Pending"); }}>
                                                <CardBody>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <p className="fw-bold mb-0 text-warning">Pending Indents</p>
                                                            <h2 className="mt-4 ff-secondary fw-semibold">
                                                                <span className="counter-value" data-target="3">
                                                                    <CountUp
                                                                        start={0}
                                                                        end={totalPendingIndents}
                                                                        duration={1}
                                                                    />
                                                                </span></h2>
                                                            <p className="mb-0 text-muted"><span className="badge bg-light text-danger mb-0">
                                                                <i className="ri-arrow-down-line align-middle"></i> 0.00 %
                                                            </span> vs. previous month</p>
                                                        </div>
                                                        <div>
                                                            <div className="avatar-sm flex-shrink-0">
                                                                <span className="avatar-title  rounded-circle fs-2 bg-warning">
                                                                    <FeatherIcon
                                                                        icon="file-text"
                                                                        className="text-light"
                                                                    />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                        {userID.includes("AREA") &&
                                            <Col md={3}>
                                                <Card className="card-animate shadow" onClick={() => { statusWiseFunction("PartiallyApproved"); }}>
                                                    <CardBody>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                <p className="fw-bold mb-0 text-primary">Partially Approved Indents</p>
                                                                <h2 className="mt-4 ff-secondary fw-semibold">
                                                                    <span className="counter-value" data-target="3">
                                                                        <CountUp
                                                                            start={0}
                                                                            end={totalPartiallyApprovedIndents}
                                                                            duration={1}
                                                                        />
                                                                    </span></h2>
                                                                <p className="mb-0 text-muted"><span className="badge bg-light text-danger mb-0">
                                                                    <i className="ri-arrow-down-line align-middle"></i> 0.00 %
                                                                </span> vs. previous month</p>
                                                            </div>
                                                            <div>
                                                                <div className="avatar-sm flex-shrink-0">
                                                                    <span className="avatar-title  rounded-circle fs-2 bg-primary">
                                                                        <FeatherIcon
                                                                            icon="file-text"
                                                                            className="text-light"
                                                                        />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        }

                                        <Col md={3}>
                                            <Card className="card-animate shadow" onClick={() => { statusWiseFunction("Rejected"); }}>
                                                <CardBody>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <p className="fw-bold mb-0 text-danger">Rejected Indents</p>
                                                            <h2 className="mt-4 ff-secondary fw-semibold">
                                                                <span className="counter-value" data-target="1600">
                                                                    <CountUp
                                                                        start={0}
                                                                        end={totalRejectedIndents}
                                                                        duration={1}
                                                                    />
                                                                </span></h2>
                                                            <p className="mb-0 text-muted"><span className="badge bg-light text-success mb-0">
                                                                <i className="ri-arrow-up-line align-middle"></i> 0.00 %
                                                            </span> vs. previous month</p>
                                                        </div>
                                                        <div>
                                                            <div className="avatar-sm flex-shrink-0">
                                                                <span className="avatar-title  rounded-circle fs-2 bg-danger">
                                                                    <FeatherIcon
                                                                        icon="file-text"
                                                                        className="text-light"
                                                                    />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                        <Col md={3}>
                                            <Card className="card-animate shadow" status="Approved" onClick={() => { statusWiseFunction("Approved"); }}>
                                                <CardBody>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <p className="fw-bold mb-0 text-success">Approved Indents</p>
                                                            <h2 className="mt-4 ff-secondary fw-semibold">
                                                                <span className="counter-value" data-target="120">
                                                                    <CountUp
                                                                        start={0}
                                                                        end={totalApprovedIndents}
                                                                        duration={1}
                                                                    />
                                                                </span></h2>
                                                            <p className="mb-0 text-muted"><span className="badge bg-light text-success mb-0">
                                                                <i className="ri-arrow-up-line align-middle"></i> 7.05 %
                                                            </span> vs. previous month</p>
                                                        </div>
                                                        <div>
                                                            <div className="avatar-sm flex-shrink-0">
                                                                <span className="avatar-title rounded-circle fs-2 bg-success">
                                                                    <FeatherIcon
                                                                        icon="file-text"
                                                                        className="text-light"
                                                                    />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0">
                                    <div>

                                        {indentData ? (
                                            <TableContainer
                                                columns={columns}
                                                data={indentData}
                                                isGlobalFilter={true}
                                                isAddUserList={false}
                                                customPageSize={5}
                                                isGlobalSearch={true}
                                                className="custom-header-css"
                                                handleCustomerClick={handleCustomerClicks}
                                                SearchPlaceholder='Search for Indent Number or Something...'
                                            />
                                        ) : (<Loader error={"No data found!"} />)
                                        }
                                    </div>

                                    {/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-----------------View Status Modal----------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
                                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                                        <ModalHeader className="bg-light p-3" toggle={toggle}>{"Indent Status"}</ModalHeader>
                                        <ViewIndentStatus data={{ singleData }}></ViewIndentStatus>
                                    </Modal>

                                    {/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-----------------View Rejected Modal----------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
                                    <Modal id="showModal" isOpen={RejectedSummary} toggle={toggleRejectedSummary} centered size="lg">
                                        <ModalHeader className="bg-light p-3" toggle={toggleRejectedSummary}>{"Rejected Indent Status"}</ModalHeader>
                                        <ViewRejectedStatus data={{ singleData }}></ViewRejectedStatus>
                                    </Modal>

                                    {/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-----------------TT Alocation Modal----------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

                                    <Modal id="showModal" isOpen={modalTT} toggle={toggleTTModal} centered size="xl" className="ribbon-box right">
                                        <ModalHeader className="bg-light p-3" toggle={toggleTTModal}>{`Allocate TT - Indent no : ${allData.indentNo}`}</ModalHeader>

                                        <AllocateTT toggle={toggleTTModal} allData={allData} firstTimeFunction={firstTimeFunction}></AllocateTT>
                                    </Modal>
                                    <ToastContainer closeButton={false} limit={1} />

                                    {/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-----------------Mannual TT Alocation Modal----------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

                                    <Modal id="showModal" isOpen={modalTTMannual} toggle={toggleTTModalMannual} centered size="lg" className="ribbon-box right">
                                        <ModalHeader className="bg-light p-3" toggle={toggleTTModalMannual}>{`Allocate TT Manually - Indent no : ${allData.indentNo}`}</ModalHeader>

                                        <AllocateTTMannual toggle={toggleTTModalMannual} allData={allData} firstTimeFunction={firstTimeFunction}></AllocateTTMannual>
                                    </Modal>
                                    <ToastContainer closeButton={false} limit={1} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Modal
                isOpen={rejectModal}
                role="dialog"
                autoFocus={true}
                centered
                id="removeItemModal"
                toggle={toggleRejectmodal}
            >
                <ModalHeader toggle={() => {
                    setRejectModal(!rejectModal);
                }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}><h5 className="text-white fs-20">Remarks</h5>
                </ModalHeader>
                <ModalBody>
                    <Row className="g-3">
                        <Col lg={12}>
                            <div>
                                <Label
                                    htmlFor="trans1"
                                    className="form-label"
                                >
                                    Please provide remarks.
                                </Label>
                                <Input
                                    name="firstname"
                                    id="trans1"
                                    className="form-control"
                                    placeholder="Enter Remarks..."
                                    type="text" required
                                    value={message}
                                    onChange={handleChangeReject}
                                />
                            </div>
                        </Col>
                        <div className="text-center">
                            <button type="button" className="btn btn-warning" onClick={handleClickReject} disabled={disabled}> Submit & Reject </button>
                        </div>

                    </Row>
                </ModalBody>
            </Modal>

            <Modal
                isOpen={cancelModal}
                role="dialog"
                autoFocus={true}
                centered
                id="removeItemModal"
                toggle={toggleCancelModal}
            >
                <ModalHeader toggle={() => {
                    setCancelModal(!cancelModal);
                }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}><h5 className="text-white fs-20">Cancel Indent</h5>
                </ModalHeader>
                <ModalBody>
                    <Row className="g-3">
                        <Col lg={12}>
                            <div>
                                <Label
                                    htmlFor="trans1"
                                    className="form-label"
                                >
                                    Please provide remarks.
                                </Label>
                                <Input
                                    name="firstname"
                                    id="trans1"
                                    className="form-control"
                                    placeholder="Enter Remarks..."
                                    type="text" required
                                    value={message1}
                                    onChange={handleCancelRemarks}
                                />
                            </div>
                        </Col>
                        <div className="text-center">
                            <button type="button" className="btn btn-warning" onClick={handleCancelIndent} disabled={disabled1}> Cancel Indent </button>
                        </div>

                    </Row>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export default IndentSummary;
