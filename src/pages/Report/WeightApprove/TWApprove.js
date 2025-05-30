import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, UncontrolledAlert, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Button, Spinner } from "reactstrap";

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

const TWApprove = () => {
    const [Plant_Code, setPlantCode] = useState('');
    const [User_Id, setUserId] = useState('');
    const [devices, setDevice] = useState([]);
    const [loader, setloader] = useState(false);
    const [loadingParameter, setErrorParameter] = useState(false);
    const [CurrentTripId, setCurrentTripId] = useState(null);


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
        debugger;
        setloader(true);
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/TWweightment/failures?plantCode=${plantcode}`, config)
            .then(res => {
                const device = res;
                setDevice(device);
                setloader(false);
            });
    }

    const [ApproveModal, setViewApproveModal] = useState(false);
    const [RejectModal, setViewRejectModal] = useState(false);

    const setApproveModal = () => {
        setViewApproveModal(!ApproveModal);
    };
    const setRejectModal = () => {
        setViewRejectModal(!RejectModal);
    };

    const approveData = async () => {
        debugger;
        const approvePayload = {
            "toleranceRemarks1": document.getElementById("approveRemarks").value,
            "isToleranceFailed": "2",
            "plantCode": Plant_Code,
            "tripId": CurrentTripId,
            "userId": User_Id,
        }
        setErrorParameter(true);
        try {
            await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/TWweightment/Approve`, approvePayload, config)
                .then(res => {
                    if (res.msg === "Approval done") {
                        toast.success("Approved Successfully", { autoClose: 3000 });
                        setApproveModal();
                        getAllDeviceData(Plant_Code);
                        setErrorParameter(false);
                    }
                    else {
                        toast.error(res.msg, { autoClose: 3000 });
                        setApproveModal();
                        setErrorParameter(false);
                    }
                })
        }
        catch (e) {
            toast.error(e, { autoClose: 3000 });
            setApproveModal();
            setErrorParameter(false);
        }

    }

    const rejectData = async () => {
        debugger;
        const rejectPayload = {
            "remarks": document.getElementById("rejectRemarks").value,
            "plantCode": Plant_Code,
            "tripId": CurrentTripId,
            "userId": User_Id,
        }
        setErrorParameter(true);
        try {
            await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/TWweightment/ApproveReject`, rejectPayload, config)
                .then(res => {
                    if (res.msg === "TW Reject Successfully") {
                        toast.success("TW Rejected Successfully", { autoClose: 3000 });
                        setRejectModal();
                        getAllDeviceData(Plant_Code);
                        setErrorParameter(false);
                    }
                    else {
                        toast.error(res.msg, { autoClose: 3000 });
                        setRejectModal();
                        setErrorParameter(false);
                    }
                })
        }
        catch (e) {
            toast.error(e, { autoClose: 3000 });
            setRejectModal();
            setErrorParameter(false);
        }

    }

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
                Cell: (cellProps) => {
                    return (<span style={{ textTransform: "uppercase" }}>{`${cellProps.row.original.vehicleNumber}`}</span>);
                }
            },
            {
                Header: "Trip ID ",
                accessor: "tripId",
                filterable: false,
            },
            {
                Header: "Material",
                accessor: "materialType",
                filterable: false,
            },
            {
                Header: "DI Number",
                accessor: "diNumber",
                filterable: false,
            },
            {
                Header: "DI Qty (MT)",
                accessor: "diQty",
                filterable: false,
            },
            {
                Header: "Tare Weight Failed Time",
                accessor: "weighmentDate",
                filterable: false,
            },
            {
                Header: "Weight Type",
                accessor: "weightType",
                filterable: false,
            },
            {
                Header: "Tare Weight",
                accessor: "tareWeight",
                filterable: false,
            },
            {
                Header: "Action",
                Cell: (cellProps) => {
                    return (
                        <ul className="list-inline hstack gap-2 mb-0">
                            <li class="list-inline-item cursor-pointer" title="Approve">
                                <Link
                                    to="#"
                                    className="text-success d-inline-block view-item-btn"
                                    onClick={() => { const data = cellProps.row.original; setApproveModal(); setCurrentTripId(cellProps.row.original.tripId) }}
                                >

                                    <i className="ri-checkbox-circle-line fs-16 text-success"></i>
                                </Link>
                            </li>
                            <li class="list-inline-item" title="Reject">
                                <Link
                                    to="#"
                                    className="text-success d-inline-block view-item-btn"
                                    onClick={() => { const data = cellProps.row.original; setRejectModal(); setCurrentTripId(cellProps.row.original.tripId)}}
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





    document.title = "Tare Weight Approve | EPLMS";
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
                    <BreadCrumb title={"Tare Weight Approve"} pageTitle="Configuration" />
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
                                        //divClass="overflow-auto"
                                        //tableClass="width-180"
                                        />
                                    </div>


                                    <ToastContainer closeButton={false} limit={1} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Modal isOpen={ApproveModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="md" toggle={setApproveModal}>
                <ModalHeader toggle={() => {
                    setApproveModal(!ApproveModal);
                }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
                    <h5 className="text-white fs-20">Reason For Approve</h5>
                </ModalHeader>
                <ModalBody>
                    <div className="product-content mt-0">
                        <textarea type="text" className="form-control" id="approveRemarks" />

                    </div>
                    <div className="button mb-2 mt-3" style={{ float: 'right' }}>
                        <button className="btn btn-success"
                            onClick={() => { approveData() }}

                        >
                            {loadingParameter ? (
                                <>
                                    <Spinner size="sm" className="me-2 visible" />Loading...
                                </>
                            ) : (
                                <>
                                    <i className="ri-checkbox-circle-line align-bottom me-1"></i>
                                    {'Approve'}
                                </>
                            )}
                        </button>
                    </div>
                </ModalBody>
            </Modal>

            <Modal isOpen={RejectModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="md" toggle={setApproveModal}>
                <ModalHeader toggle={() => {
                    setRejectModal(!ApproveModal);
                }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
                    <h5 className="text-white fs-20">Reason For Reject</h5>
                </ModalHeader>
                <ModalBody>
                    <div className="product-content mt-0">
                        <textarea type="text" className="form-control" id="rejectRemarks" />

                    </div>
                    <div className="button mb-2 mt-3" style={{ float: 'right' }}>
                        <button className="btn btn-warning"
                            onClick={() => { rejectData() }}

                        >
                            {loadingParameter ? (
                                <>
                                    <Spinner size="sm" className="me-2 visible" />Loading...
                                </>
                            ) : (
                                <>
                                    {'Reject'}
                                </>
                            )}
                        </button>
                    </div>


                </ModalBody>
            </Modal>

        </React.Fragment>
    );
};

export default TWApprove;