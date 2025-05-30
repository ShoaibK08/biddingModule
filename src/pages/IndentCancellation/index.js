import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, Label, Modal, ModalHeader, ModalBody, Input, } from "reactstrap";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import FeatherIcon from "feather-icons-react";

//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const IndentCancellationPage = () => {
    const dispatch = useDispatch();
    const [allData, setAllData] = useState([]);
    const [code, setCode] = useState('');
    const [totalCancellationData, setTotalCancellationData] = useState('');
    const [totalCencel, setCancelledIndent] = useState([]);
    const [initialCancel, setInitialCancel] = useState([]);
    const [partialCancel, setPartialCancel] = useState([]);
    const [indentNumber, setIndentNumber] = useState('');
    const [status, setIndentStatus] = useState('');
    const [message, setMessage] = useState('');
    const [message1, setMessage1] = useState('');
    const [disabled1, setDisabled1] = useState(true);
    const [disabled, setDisabled] = useState(true);
    const [isAction, setAction] = useState(false);


    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let code = obj.data._id;
        setCode(code);
        getAllCancellationData(code);
    }, []);

    const [cancelModal, setCancelModal] = useState(false);
    const toggleCancelModal = () => {
        setCancelModal(!cancelModal);
    };

    const [rejectModal, setRejectModal] = useState(false);
    const toggleRejectmodal = () => {
        setRejectModal(!rejectModal);
    };

    const getAllCancellationData = (code) => {

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/getAllCancelledIndentByCode?indentPlacedBy=${code}`)
            .then(res => {
                const allData = res;
                setAllData(allData);
                setTotalCancellationData(allData.length);
                const CANCELLED = allData.filter(function (item) {
                    if (item.indentCancelStatus === "CANCELLED") {
                        return true;
                    } else {
                        return false;
                    }
                }).length; // 6
                setCancelledIndent(CANCELLED);
                const INITIALCANCEL = allData.filter(function (item) {
                    if (item.indentCancelStatus === "INITIALCANCEL") {
                        return true;
                    } else {
                        return false;
                    }
                }).length; // 6
                setInitialCancel(INITIALCANCEL);
                const PARTIALCANCEL = allData.filter(function (item) {
                    if (item.indentCancelStatus === "PARTIALCANCEL") {
                        return true;
                    } else {
                        return false;
                    }
                }).length; // 6
                setPartialCancel(PARTIALCANCEL);

            });
    }

    const statusWiseFunction = (status) => {
        axios.get(`http://localhost:8042/indentModule/indent/getAllIndentByIndentCancelStatus?indentCancelStatus=${status}&indentPlacedBy=${code}`)
            .then(res => {
                const allData = res;
                setAllData(allData);
            })
    };

    const cancelClick = async (indentNumber, status) => {
        
        toggleCancelModal();
        setIndentNumber(indentNumber);
        setIndentStatus(status);
        setMessage("");
        setMessage1("");

    }

    const rejectClick = async (indentNumber, status) => {
        toggleRejectmodal();
        setIndentNumber(indentNumber);
        setIndentStatus(status);
        setMessage("");
        setMessage1("");

    }

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

    const handleCancelIndent = async () => {
        
        try {
            if (code.includes("CU")) {
                if (status === "Approved" || status === "TTAllocated" || status === "PartiallyTTAllocated") {
                    const res = await axios.get(`http://localhost:8042/indentModule/indent/cancelIndentAcceptedByPayerForApproved/${indentNumber}/${message1}`)
                    console.log(res.data);
                    getAllCancellationData(code);
                    toast.success("Indent Cancellation Initiated Successfully", { autoClose: 3000 });
                }
                else {
                    if (status === "PartiallyApproved") {
                        const res = await axios.get(`http://localhost:8042/indentModule/indent/indentCancellationRequestAcceptdByPayerInPartiallyApproved/${indentNumber}/${message1}`)
                        console.log(res.data);
                        getAllCancellationData(code);
                        toast.success("Indent Cancellation Initiated Successfully", { autoClose: 3000 });
                    }
                }
            } else {
                const res = await axios.get(`http://localhost:8042/indentModule/indent/cancelIndentAcceptedByAreaManager/${indentNumber}/${message1}`)
                console.log(res.data);
                getAllCancellationData(code);
                toast.success("Indent Cancelled Successfully", { autoClose: 3000 });
            }

        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
        }
        toggleCancelModal();
    };

    const handleClickReject = async () => {
        try {
            if (code.includes("CU")) {
                if (status === "Approved" || status === "TTAllocated" || status === "PartiallyTTAllocated") {
                    const res = await axios.get(`http://localhost:8042/indentModule/indent/indentCancellationRequestRejectedByPayer/${indentNumber}/${message}`)
                    console.log(res.data);
                    getAllCancellationData(code);
                    toast.success("Reject Cancellation  Initiated Successfully", { autoClose: 3000 });
                }
                else {
                    if (status === "PartiallyApproved") {
                        const res = await axios.get(`http://localhost:8042/indentModule/indent/indentCancellationRequestRejectedByPayerInPartiallyApproved/${indentNumber}/${message}`)
                        console.log(res.data);
                        getAllCancellationData(code);
                        toast.success("Indent Cancellation Rejected.", { autoClose: 3000 });
                    }
                }
            } else {
                const res = await axios.get(`http://localhost:8042/indentModule/indent/cancelIndentRejectedByAreaManager/${indentNumber}/${message}`)
                console.log(res.data);
                getAllCancellationData(code);
                toast.success("Indent Cancellation Rejected.", { autoClose: 3000 });
            }
        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
        }
        toggleRejectmodal();
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
                Header: "Indent Number",
                accessor: "indentNo",
            },
            {
                Header: "Indent PlacedBy",
                accessor: "indentPlaceBy",
            },
            {
                Header: "Product",
                accessor: "product",
                filterable: false,
            },
            {
                Header: "Product Name",
                accessor: "mateialName",
                filterable: false,
            },
            {
                Header: "Quantity",
                accessor: "quantity",
                Cell: ({ row }) => { return (`${row.original.quantity}` ? `${row.original.quantity} ${row.original.unitMeasurement}` : "N/A") },
                filterable: false,
            },
            {
                Header: "Shipment Type",
                accessor: "shipmentType",
                filterable: false,
            },
            {
                Header: "Remarks",
                accessor: "indentCancelRemarks",
                filterable: false,
            },
            {
                Header: "Indent Status",
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
                    else {
                        return <span className="badge text-uppercase badge-soft-warning"> Pending </span>;
                    }
                }
            },
            {
                Header: "Cancellation Status",
                accessor: "indentCancelStatus",
                Cell: (row) => {
                    switch (row.row.original.indentCancelStatus) {
                        case "INITIALCANCEL":
                            return <span className="badge text-uppercase badge-soft-success"> INITIAL CANCEL </span>;
                        case "PARTIALCANCEL":
                            return <span className="badge text-uppercase badge-soft-warning"> PARTIAL CANCEL </span>;
                        case "CANCELLED":
                            return <span className="badge text-uppercase badge-soft-danger"> CANCELLED </span>;
                    }
                }
            },
            {
                Header: "Action",
                Cell: (cellProps) => {

                    sessionStorage.getItem("authUser");
                    const obj = JSON.parse(sessionStorage.getItem("authUser"));
                    let str = obj.data._id;
                    if (str.includes("SO")) {
                        return <span className="badge text-uppercase badge-soft-success"> No Action </span>;
                    }

                    if (str.includes("AREA")) {
                        if (cellProps.row.original.indentCancelStatus === "PARTIALCANCEL") {
                            return (
                                <ul className="list-inline hstack gap-2 mb-0">
                                    <li className="list-inline-item edit" title="Approve Cancel">
                                        <Link
                                            to="#"
                                            className="text-primary d-inline-block approve-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; const status = cellProps.row.original.indentStatus; cancelClick(indentNumber, status); }}
                                        ><i className="ri-checkbox-circle-line fs-16 text-success"></i>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item" title="Reject Cancel">
                                        <Link
                                            to="#"
                                            className="text-danger d-inline-block reject-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; const status = cellProps.row.original.indentStatus; rejectClick(indentNumber, status); }}
                                        ><i className="ri-close-circle-line fs-16 text-danger"></i>
                                        </Link>
                                    </li>
                                </ul>
                            )
                        }
                        else {
                            return <span className="badge text-uppercase badge-soft-success"> No Action </span>;
                        }

                    }
                    else if (str.includes("CU")) {
                        
                        if (cellProps.row.original.indentCancelStatus === "INITIALCANCEL") {
                            return (
                                <ul className="list-inline hstack gap-2 mb-0">
                                    <li className="list-inline-item edit" title="Approve Cancel">
                                        <Link
                                            to="#"
                                            className="text-primary d-inline-block approve-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; const status = cellProps.row.original.indentStatus; cancelClick(indentNumber, status); }}
                                        ><i className="ri-checkbox-circle-line fs-16 text-success"></i>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item" title="Reject Cancel">
                                        <Link
                                            to="#"
                                            className="text-danger d-inline-block reject-item-btn"
                                            onClick={() => { const indentNumber = cellProps.row.original.indentNo; const status = cellProps.row.original.indentStatus; rejectClick(indentNumber, status); }}
                                        ><i className="ri-close-circle-line fs-16 text-danger"></i>
                                        </Link>
                                    </li>
                                </ul>
                            )
                        }
                        else {
                            return <span className="badge text-uppercase badge-soft-success"> No Action </span>;
                        }

                    }
                    else if (str.includes("TRAN")) {
                        
                            return <span className="badge text-uppercase badge-soft-success"> No Action </span>;

                    }
                },
            },
        ],
    );


    document.title = "Indent Cancellation || Nayara";
    return (
        <React.Fragment>
            <div className="page-content">

                <Container fluid>
                    <BreadCrumb title="Indent Cancellation" pageTitle="Nayara" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Indent Cancellation List</h5>
                                            </div>
                                        </div>

                                    </Row>

                                    <Row className="mt-4">
                                        <Col md={3}>
                                            <Card className="card-animate shadow" onClick={() => { getAllCancellationData(code); }}>
                                                <CardBody>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <p className="fw-bold mb-0 text-primary">Total Indents</p>
                                                            <h2 className="mt-4 ff-secondary fw-semibold">
                                                                <span className="counter-value">
                                                                    <CountUp
                                                                        start={0}
                                                                        end={totalCancellationData}
                                                                        duration={3}


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

                                        <Col md={3}>
                                            <Card className="card-animate shadow" status="Approved" onClick={() => { statusWiseFunction("INITIALCANCEL"); }}>
                                                <CardBody>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <p className="fw-bold mb-0 text-success">Initial Cancel</p>
                                                            <h2 className="mt-4 ff-secondary fw-semibold">
                                                                <span className="counter-value" data-target="120">
                                                                    <CountUp
                                                                        start={0}
                                                                        end={initialCancel}
                                                                        duration={3}
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

                                        <Col md={3}>
                                            <Card className="card-animate shadow" onClick={() => { statusWiseFunction("PARTIALCANCEL"); }}>
                                                <CardBody>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <p className="fw-bold mb-0 text-warning">Partial Cancel</p>
                                                            <h2 className="mt-4 ff-secondary fw-semibold">
                                                                <span className="counter-value" data-target="3">
                                                                    <CountUp
                                                                        start={0}
                                                                        end={partialCancel}
                                                                        duration={3}
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

                                        <Col md={3}>
                                            <Card className="card-animate shadow" onClick={() => { statusWiseFunction("CANCELLED"); }}>
                                                <CardBody>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <p className="fw-bold mb-0 text-danger">Cancelled Indent</p>
                                                            <h2 className="mt-4 ff-secondary fw-semibold">
                                                                <span className="counter-value" data-target="1600">
                                                                    <CountUp
                                                                        start={0}
                                                                        end={totalCencel}
                                                                        duration={3}
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
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0">
                                    <div>

                                        <TableContainer
                                            columns={columns}
                                            data={allData}
                                            isGlobalFilter={true}
                                            isAddUserList={false}
                                            customPageSize={5}
                                            isGlobalSearch={true}
                                            className="custom-header-css"
                                            SearchPlaceholder='Search for Indents or something...'
                                        />

                                    </div>

                                    <ToastContainer closeButton={false} limit={1} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

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
                }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}><h5 className="text-white fs-20">Reject Cancellation Request</h5>
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
        </React.Fragment >
    );
};

export default IndentCancellationPage;
