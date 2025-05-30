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
import ViewIndentDiversion from "./viewIndentDiversion";
import ViewRejectedStatus from "./viewRejectedStatus";
import AllocateTTMannual from "./allocateTTMannual";

const useStyles = makeStyles({
    customTextField: {
        "& input::placeholder": {
            fontSize: "0.9rem"
        }
    }
});

const IndentDiversion = () => {
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
            {
                Header: "Name",
                accessor: "payerName",
                filterable: false,
            },
            {
                Header: "Indent Date",
                accessor: "productDate",
                filterable: false,
                Cell: (cell) => {
                    return (cell.value).split("T")[0];
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
                accessor: "soNumber",
                filterable: false,
            },
            {
                Header: "Shipment Type",
                accessor: "shipmentType",
                filterable: false,
            },            
            {
                Header: "Cluster Name",
                accessor: "clusterName",
                filterable: false,
            },            
            {
                Header: "Plant Name",
                accessor: "plantName",
                filterable: false,
            },
            {
                Header: "Action",
                Cell: (cellProps) => {
                    sessionStorage.getItem("authUser");
                    const obj = JSON.parse(sessionStorage.getItem("authUser"));
                    let str = obj.data._id;
                    if (str.includes("AREA")) {
                        return (
                            <ul className="list-inline hstack gap-2 mb-0">
                                <li className="list-inline-item edit" title="View">
                                    <Link
                                        to="#"
                                        className="text-primary d-inline-block edit-item-btn"
                                        onClick={() => { const indentNumber = cellProps.row.original.indentNo; viewSummary(indentNumber); }}
                                    >Edit 
                                    </Link>
                                </li>
                                <li className="list-inline-item edit" title="Approve">
                                    <Link
                                        to="#"
                                        className="text-primary d-inline-block approve-item-btn"
                                        onClick={() => { const indentNumber = cellProps.row.original.indentNo; approveClick(indentNumber); }}
                                    >Approve
                                    </Link>
                                </li>
                                <li className="list-inline-item" title="Reject">
                                    <Link
                                        to="#"
                                        className="text-danger d-inline-block reject-item-btn"
                                        onClick={() => { const indentNumber = cellProps.row.original.indentNo; rejectClick(indentNumber); }}
                                    >Reject
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
                                    >Edit 
                                    </Link>
                                </li>
                            </ul>
                        );
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
                                        <ViewIndentDiversion data={{ singleData }}></ViewIndentDiversion>
                                    </Modal>

                                    {/* <<<<<<<<<<<ZZ<<<<<<<<<<<<<<<<<<<-----------------View Rejected Modal----------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
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

export default IndentDiversion;
