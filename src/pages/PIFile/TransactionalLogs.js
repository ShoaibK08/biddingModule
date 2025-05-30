import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import TableContainer from "../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import LoaderNew from "../../Components/Common/Loader_new";


const initialValues = {
    startDate: "",
    endDate: "",
};

const TransactionalLogs = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [devices, setDevice] = useState([]);
    const [Movement, setMovement] = useState([]);
    const [Material, setMaterial] = useState([]);
    const [Plant, setPlant] = useState([]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [svgResponse, setResponse] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [dynamicFlag, setDynamicFlag] = useState(1);
    const [Plant_Code, setPlantCode] = useState('');
    const [errorStartDate, setErrorStartDate] = useState(false);
    const [errorEndDate, setErrorEndDate] = useState(false);
    const [errorCompare, setErrorCompare] = useState(false);
    const [latestHeader, setLatestHeader] = useState('');
    const [loader, setloader] = useState(false);
    const [errorParameter, setErrorParameter] = useState(false);

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
        //getAllDeviceData(plantcode);

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

    const getAllDeviceData = async (e) => {
        
        const startDate = new Date(values.startDate);
        const endDate = new Date(values.endDate);

        if (values.startDate === "") {
            setErrorStartDate(true);
        }
        else if (values.endDate === "") {
            setErrorEndDate(true);
        }

        else if (endDate < startDate) {
            toast.error("End date cannot be less than start date.", { autoClose: 3000 });
        }
        else {
            setErrorStartDate(false);
            setErrorEndDate(false);
            setErrorCompare(false);
            setErrorParameter(true);
            const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/transactionalLogs/getTransactionalLogsList`, values, config)
                .then(res => {
                    const device = res;
                    if (device.includes("No message consumed")) {
                        setDevice([]);
                        setErrorParameter(false);
                        toast.error("No message consumed.", { autoClose: 3000 });
                    }
                    else if (!Array.isArray(device)) {
                        toast.error("Response Undefined.", { autoClose: 3000 });
                        setErrorParameter(false);
                        setDevice([]);
                    }
                    else if (device.length === 0) {
                        setDevice([]);
                        setErrorParameter(false);
                        toast.error("No message consumed.", { autoClose: 3000 });
                    }
                    else {
                        setDevice(device);
                        setErrorParameter(false);
                    }
                });
        }

    }

    const viewSummary = (InstanceId) => {
        setloader(true);
        setResponse("");
        const data = { "processID": InstanceId, "plantCode": Plant_Code }
        axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/transactionalLogs/getProcessInstanceId`, data, config)
            .then(res => {
                const result = res;
                setResponse(result)
                setloader(false);
            })
        setModal(true);
        toggle();
    };

    const createdDateFunction = (date, date1, date2) => {

        setValues({
            ...values,
            ['startDate']: date1 + " 00:00:00",
            ["plantCode"]: Plant_Code,
            ["processInstanceId"]: "",
        });
        setErrorStartDate(false);
    };

    const createdDateFunction1 = (date, date1, date2) => {

        setValues({
            ...values,
            ['endDate']: date1 + " 23:59:00",
            ["plantCode"]: Plant_Code,
            ["processInstanceId"]: "",
        });
        setErrorEndDate(false);
        const startDate = new Date(values.startDate);
        const endDate = new Date(date1 + " 23:59:00");
        if (endDate < startDate) {
            setErrorCompare(true);
        }
        else{
            setErrorCompare(false);
        }
    };

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
        a.download = 'Transactional_Logs.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
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
                Header: "Process Name",
                accessor: "processName",
                filterable: false,
            },
            {
                Header: "Instance Id",
                accessor: "processInstanceId",
                filterable: false,
            },
            {
                Header: "Description",
                accessor: "processInstanceDescription",
                filterable: false,
            },
            {
                Header: "Vehicle Number",
                accessor: "vehicle_number",
                filterable: false,
            },
            {
                Header: "Tag Id",
                accessor: "tag_id",
                filterable: false,
            },
            {
                Header: "Start Date & Time",
                accessor: "start_date",
                filterable: false,
                Cell: (cell) => {
                    return (cell.value ? (((cell.value).replace("T", " ")).split(".")[0]) : "--/--");
                }
            },
            {
                Header: "End Date & Time",
                accessor: "end_date",
                filterable: false,
                Cell: (cell) => {
                    return (cell.value ? (((cell.value).replace("T", " ")).split(".")[0]) : "--/--");
                }
            },
            {
                Header: "Status",
                //accessor: "trip_status",
                Cell: (cellProps) => {
                    return <button type="button" class="btn btn-sm btn-outline-primary waves-effect waves-light border-primary" onClick={() => { const InstanceId = cellProps.row.original.processInstanceId; viewSummary(InstanceId); }}><i className="ri-eye-fill"></i></button>;
                }
            },
        ],
    );




    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);


    const [zoomLevel, setZoomLevel] = useState(1);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleZoomIn = () => {
        setZoomLevel((prevZoom) => prevZoom + 0.2);
    };

    const handleZoomOut = () => {
        setZoomLevel((prevZoom) => Math.max(0.2, prevZoom - 0.2));
    };

    const handleMouseDown = (e) => {
        setDragStart({ x: e.clientX, y: e.clientY });
        setDragging(true);
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;

            setPosition((prevPosition) => ({
                x: prevPosition.x + deltaX / zoomLevel,
                y: prevPosition.y + deltaY / zoomLevel,
            }));

            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    document.title = "Transactional Logs | EPLMS";
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
                    <BreadCrumb title={"Transactional Logs"} pageTitle="Configuration" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Transactional Logs Details</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    </Row>

                                    <Row className="mt-4 p-2">

                                        <Col md={3}>
                                            <Label htmlFor="validationDefault04" className="form-label">Start Date<span style={{ color: "red" }}>*</span></Label>
                                            <Flatpickr
                                                className="form-control"
                                                id="datepicker-publish-input"
                                                placeholder="Select Created Date"
                                                value={values.createdDate}
                                                options={{
                                                    enableTime: false,
                                                    dateFormat: "Y-m-d",
                                                    maxDate: "today" // Disable dates after the current date
                                                }}
                                                onChange={(selectedDates, dateStr, fp) => { createdDateFunction(selectedDates, dateStr, fp) }}
                                            />
                                            {errorStartDate && <p className="mt-2" style={{ color: "red" }}>Please Select Start Date</p>}
                                        </Col>

                                        <Col md={3}>
                                            <Label htmlFor="validationDefault04" className="form-label">End Date<span style={{ color: "red" }}>*</span></Label>
                                            <Flatpickr
                                                className="form-control"
                                                id="datepicker-publish-input"
                                                placeholder="Select Created Date"
                                                value={values.createdDate}
                                                options={{
                                                    enableTime: false,
                                                    dateFormat: "Y-m-d",
                                                    maxDate: "today" // Disable dates after the current date
                                                }}
                                                onChange={(selectedDates, dateStr, fp) => { createdDateFunction1(selectedDates, dateStr, fp) }}
                                            />
                                            {errorEndDate && <p className="mt-2" style={{ color: "red" }}>Please Select End Date</p>}
                                            {errorCompare && <p className="mt-2" style={{ color: "red" }}>End date cannot be less than start date.</p>}
                                        </Col>

                                        <Col lg={3} className="hstack gap-2" style={{ marginTop: "27px",display:"block" }}>
                                            <button type="button" className="btn btn-success" onClick={getAllDeviceData} >{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Searching...</> : "Search"} </button>
                                        </Col>
                                    </Row>




                                </CardHeader>
                                <div className="card-body pt-0 mt-0">
                                    <div>

                                        <TableContainer
                                            columns={columns}
                                            data={devices}
                                            isGlobalFilter={true}
                                            isAddUserList={false}
                                            customPageSize={5}
                                            isGlobalSearch={true}
                                            className="custom-header-css"
                                            //isCustomerFilter={true}
                                            SearchPlaceholder='Search for Process Name or something...'
                                            divClass="overflow-auto"
                                        //tableClass="width-200"
                                        />
                                    </div>


                                    {/* <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
                                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                                            {"Status"}
                                        </ModalHeader>
                                        <ModalBody>
                                            <Row className="g-3 d-flex justify-content-center mx-2 mt-2 ">
                                                {loader && <Loader></Loader>}
                                                <div style={{ marginTop: svgResponse === "No message consumed" ? "0px" : "-50px" }} dangerouslySetInnerHTML={{ __html: svgResponse }} />
                                            </Row>
                                        </ModalBody>

                                    </Modal> */}

                                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl" onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp} >
                                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                                            {"Status"}
                                        </ModalHeader>
                                        <ModalBody style={{ overflow: "hidden", background: "#d7e3ed", cursor: "grab" }}>
                                            <Row className="g-3 d-flex justify-content-center mx-2 mt-2 svg-container" style={{
                                                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`
                                            }} onMouseDown={handleMouseDown}>
                                                {loader && <Loader></Loader>}

                                                <div style={{ marginTop: svgResponse.includes("No message consumed") ? "0px" : "-50px" }} dangerouslySetInnerHTML={{ __html: svgResponse }} />
                                            </Row>
                                        </ModalBody>
                                        <ModalFooter className="p-2">
                                            <button type="button" class="btn btn-sm btn-outline-success waves-effect waves-light border-success shadow" onClick={handleZoomIn}><i className="ri-add-fill"></i></button>
                                            <button type="button" class="btn btn-sm btn-outline-warning waves-effect waves-light border-warning shadow" onClick={handleZoomOut}><i className="ri-subtract-fill"></i></button>
                                        </ModalFooter>

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

export default TransactionalLogs;
