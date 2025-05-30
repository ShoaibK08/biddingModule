import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import '../TagMapping/TagMapping.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import avatar1 from "../../../assets/images/users/user-dummy-img.jpg";

const initialValues = {
    start_date: "",
    end_date: "",
    master_plant_id: "",
    trip_movement_type_code: ""
};


const AuditLogs = () => {
    const [devices, setDevice] = useState([]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [Plant_Code, setPlantCode] = useState('');
    const [errorStartDate, setErrorStartDate] = useState(false);
    const [errorEndDate, setErrorEndDate] = useState(false);
    const [errorCompare, setErrorCompare] = useState(false);
    const [errorTwoMonths, setErrorTwoMonths] = useState(false);
    const [latestHeader, setLatestHeader] = useState('');
    const [errorParameter, setErrorParameter] = useState(false);

    useEffect(() => {
        const HeaderName = localStorage.getItem("HeaderName");
        setLatestHeader(HeaderName);
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
    }, []);



    const getAllDeviceData = async () => {
        debugger;
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username: process.env.REACT_APP_API_USER_NAME,
                password: process.env.REACT_APP_API_PASSWORD,
            },
        };
        if (values.start_date === "") {
            setErrorStartDate(true);
        }
        else if (values.end_date === "") {
            setErrorEndDate(true);
        }
        else {
            setErrorStartDate(false);
            setErrorEndDate(false);
            setErrorCompare(false);
            setErrorParameter(true);
            setErrorTwoMonths(false);
            try {
                await axios.post(`${process.env.REACT_APP_LOCAL_URL_REPORTS}/getReport/logReport`, values, config)
                    .then(res => {
                        const device = res["#result-set-1"];

                        setDevice(device);
                        setErrorParameter(false);
                    });
            }
            catch (e) {
                toast.error(e, { autoClose: 3000 });
                setErrorParameter(false);
            }

        }
    }

    const createdDateFunction = (date, date1, date2) => {

        setValues({
            ...values,
            ['start_date']: date1 + " 00:00:00",
            ["master_plant_id"]: Plant_Code,
        });
        setErrorStartDate(false);
        const startDate = new Date(date1 + " 00:00:00");
        const endDate = new Date(values.end_date);
        const millisecondsPerDay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
        const maxDifferenceInMilliseconds = 62 * millisecondsPerDay; // 60 days in milliseconds
        const differenceInMilliseconds = Math.abs(endDate - startDate);
        if (endDate < startDate) {
            setErrorCompare(true);
            setErrorTwoMonths(false);
        }
        else if (differenceInMilliseconds > maxDifferenceInMilliseconds) {
            setErrorTwoMonths(true);
            setErrorCompare(false);
        }
        else {
            setErrorCompare(false);
            setErrorTwoMonths(false);
        }
    };

    const createdDateFunction1 = (date, date1, date2) => {

        setValues({
            ...values,
            ['end_date']: date1 + " 23:59:00",
            ["master_plant_id"]: Plant_Code,
        });
        setErrorEndDate(false);
        const startDate = new Date(values.start_date);
        const endDate = new Date(date1 + " 23:59:00");
        const millisecondsPerDay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
        const maxDifferenceInMilliseconds = 62 * millisecondsPerDay; // 60 days in milliseconds
        const differenceInMilliseconds = Math.abs(endDate - startDate);
        if (endDate < startDate) {
            setErrorCompare(true);
            setErrorTwoMonths(false);
        }
        else if (differenceInMilliseconds > maxDifferenceInMilliseconds) {
            setErrorTwoMonths(true);
            setErrorCompare(false);
        }
        else {
            setErrorCompare(false);
            setErrorTwoMonths(false);
        }
    };


    const [cancelModal, setCancelModal] = useState(false);
    const [userdata, setuserData] = useState({});
    const handleUserClick = (id, name, email, mobile) => {
        console.log(id, name, email, mobile);
        const userdata = {
            "id": id,
            "name": name,
            "email": email,
            "mobile": mobile,
            "plant": Plant_Code,
        }
        setuserData(userdata);
        openRemarksModal();
    };


    const openRemarksModal = () => {
        setCancelModal(!cancelModal);
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
                Header: "Trip ID ",
                accessor: "TripId",
                filterable: false,
            },
            {
                Header: "Vehicle No",
                accessor: "vehicleNumber",
                filterable: false,
            },
            {
                Header: "Material Code",
                accessor: "materialType",
                filterable: false,
            },
            {
                Header: "Location",
                accessor: "Location",
                filterable: false,
            },
            {
                Header: "Transaction Time",
                accessor: "activityTime",
                filterable: false,
            },
            {
                Header: "Transaction type",
                accessor: "activity",
                filterable: false,
            },
            {
                Header: "IGP Number",
                accessor: "igpNumber",
                filterable: false,
            },
            {
                Header: "User ID",
                accessor: "userId",
                filterable: false,
                Cell: (cellProps) => {
                    debugger;
                    return (
                        <ul className="list-inline hstack gap-2 mb-0">
                            <li className="list-inline-item">
                                <span>{cellProps.row.original.userId}</span>
                            </li>
                            <li className="list-inline-item edit" title="User Details">
                                {cellProps.row.original.userId &&
                                    <Link
                                        to="#"
                                        className="text-primary d-inline-block edit-item-btn"
                                        onClick={() => { handleUserClick(cellProps.row.original.userId, cellProps.row.original.username, cellProps.row.original.useremail, cellProps.row.original.usermobile); }}
                                    >

                                        <img className="rounded-circle shadow_light" src={avatar1} alt="Header Avatar" height={25} width={25}/>
                                    </Link>
                                }
                            </li>
                        </ul>
                    );
                },
            },
            {
                Header: "Remarks",
                accessor: "description",
                filterable: false,
            },
            // {
            //     Header: "YardIN",
            //     accessor: "YardIn_stage",
            //     filterable: false,
            // },
            // {
            //     Header: "GateIn",
            //     accessor: "GateIn_stage",
            //     filterable: false,
            // },
            // {
            //     Header: "Tare Weight",
            //     accessor: "tareWeight",
            //     filterable: false,
            // },
            // {
            //     Header: "Packing Out",
            //     accessor: "packingOut",
            //     filterable: false,
            // },
            // {
            //     Header: "Gross Weight",
            //     accessor: "grossWeight",
            //     filterable: false,
            // },
            // {
            //     Header: "Gate Out",
            //     accessor: "gateOut",
            //     filterable: false,
            // },
        ],
    );

    const handleDownload = async (e) => {
        e.preventDefault();
        downloadCSV();
        setIsExportCSV(false)
    };

    const downloadCSV = () => {
        const bl = [];
        columns.forEach((row) => {
            if (row.accessor !== undefined && row.accessor !== 'id') {
                bl.push(row.accessor + "$$$" + row.Header);
            }
        });
        const bla = [];
        devices.forEach((row1) => {
            const blp = {};
            bl.forEach((rows2) => {
                const pl = rows2.split("$$$");
                if (pl[0] === 'status') {
                    blp[pl[1]] = (row1[pl[0]] === 1 ? 'Active' : 'Deactive');
                } else if (pl[0] === 'quantity') {
                    blp[pl[1]] = row1[pl[0]] + " " + row1["unitMeasurement"];
                } else {
                    blp[pl[1]] = row1[pl[0]];
                }
            });
            bla.push(blp);
        });
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        // Convert the data to a worksheet
        const ws = XLSX.utils.json_to_sheet(bla, { header: Object.keys(bla[0]) });
        // Apply styling to the header row
        ws["!cols"] = [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }]; // Example: Set column widths

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Generate an XLSX file
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Convert binary string to Blob
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        // Save the Blob as a file using FileSaver
        FileSaver.saveAs(blob, 'AuditLogs.xlsx');

        // Utility function to convert a string to an ArrayBuffer
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buf;
        }
    };

    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    document.title = "Audit Logs | EPLMS";
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
                    <BreadCrumb title={"Audit Logs"} pageTitle="Reports" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Audit Logs Reports</h5>
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

                                    <Row className="mt-4 p-2">

                                        <Col md={3}>
                                            <Label htmlFor="validationDefault04" className="form-label">Select Date From<span style={{ color: "red" }}>*</span></Label>
                                            <Flatpickr
                                                className="form-control"
                                                id="datepicker-publish-input"
                                                placeholder="Select Start Date"
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
                                            <Label htmlFor="validationDefault04" className="form-label">Select Date To<span style={{ color: "red" }}>*</span></Label>
                                            <Flatpickr
                                                className="form-control"
                                                id="datepicker-publish-input"
                                                placeholder="Select End Date"
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
                                            {errorTwoMonths && <p className="mt-2" style={{ color: "red" }}>Difference between both dates cannot be greater than 60 days.</p>}
                                        </Col>


                                        <Col md={3} className="hstack gap-2" style={{ marginTop: "28px", display: "block" }}>
                                            <button type="button" className="btn btn-success" onClick={getAllDeviceData} disabled={errorTwoMonths || errorCompare || errorEndDate}>{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Searching...</> : "Search Report"}  </button>
                                        </Col>
                                    </Row>

                                </CardHeader>
                                <div className="card-body pt-0 mt-3">
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
                                            SearchPlaceholder='Search for Vehicle No or something...'
                                            divClass="overflow-auto"
                                            tableClass="width-120"
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
                toggle={openRemarksModal}
            >
                <ModalHeader toggle={() => {
                    setCancelModal(!cancelModal);
                }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}><h5 className="text-white fs-20 m-0">User Details</h5>
                </ModalHeader>
                <CardBody className="p-3">
                    <div className="d-flex">
                        <div className="mx-3 align-content-center">
                            <img
                                src={avatar1}
                                alt=""
                                className="avatar-md rounded-circle img-thumbnail"
                            />
                        </div>
                        <div className="flex-grow-1 align-self-center p-3 border border-end-0 border-top-0 border-bottom-0 border-dashed">
                            <div className="text-muted">
                                <h5>{userdata.name}</h5>
                                <p className="mb-0">User Id : {userdata.id}</p>
                                <p className="mb-1">Email Id : {userdata.email}</p>
                                <p className="mb-0">Mobile No : {userdata.mobile}</p>
                                <p className="mb-0">Plant Code : {userdata.plant}</p>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Modal>


        </React.Fragment>
    );
};

export default AuditLogs;
