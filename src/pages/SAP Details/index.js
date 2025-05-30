import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import TableContainer from "../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Flatpickr from "react-flatpickr";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

const initialValues = {
    fromDate: "",
    toDate: "",
    vehicleNumber: "",
    status_flag: "",
};


const SAPDetails = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [devices, setDevice] = useState([]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [CurrentID, setClickedRowId] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [latestHeader, setLatestHeader] = useState('');
    const [plant_code, setPlantCode] = useState([]);
    const [errorParameter, setErrorParameter] = useState(false);
    const today = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format

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
        let plantCode = obj.data.plantCode;
        setPlantCode(plantCode);

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

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: {
            vehicleNumber: (values && values.vehicleNumber) || '',
            fromDate: (values && values.fromDate) || '',
            toDate: (values && values.toDate) || '',
            status_flag: (values && values.status_flag) || '',
            plantcode: plant_code
        },
        validationSchema: Yup.object({
            //vehicleNumber: Yup.string().required("Please Enter Vehicle Number"),
            fromDate: Yup.string().required("Please Select Start Date"),
            toDate: Yup.string().required("Please Select End Date"),
            status_flag: Yup.string().required("Please Select Satus"),
        }),
        onSubmit: (values) => {
            debugger;

            const fromDate = new Date(values.fromDate + " 00:00:00");
            const toDate = new Date(values.toDate + " 23:59:00");

            const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day
            const dateDifferenceInDays = (toDate - fromDate) / oneDay;

            if (toDate < fromDate) {
                toast.error("End Date is smaller than Start Date", { autoClose: 3000 });
            }
            else if (dateDifferenceInDays > 3) {
                toast.error("Date range should not be greater than 3 days.", { autoClose: 3000 });
            } else {
                const data = {
                    "vehicleNumber": values.vehicleNumber,
                    "statusFlag": values.status_flag === "ALL" ? "" : values.status_flag,
                    "fromDate": values.fromDate + " 00:00:00",
                    "toDate": values.toDate + " 23:59:00",
                    "plantcode": plant_code
                }
                setErrorParameter(true);
                axios.post(`${process.env.REACT_APP_LOCAL_URL_SAP}/sapScreen/vehicleDetails`, data, config)
                    .then(res => {
                        if (!res.error) {
                            toast.success("Data Fetched Successfully.", { autoClose: 3000 });
                            const device = res["#result-set-1"];
                            //const dateTimeArray =  [ 2024, 4, 6, 16, 11, 2];    Date Format Receiving from SAP
                            const revisedData = device.map(item => {
                                // Convert date_time array to a formatted date-time string
                                const formattedDateTime = `${item.date_time[0]}-${padZero(item.date_time[1])}-${padZero(item.date_time[2])} ` +
                                    `${padZero(item.date_time[3])}:${padZero(item.date_time[4])}`;

                                // Parse the request property from JSON string to an object
                                const parsedRequest = JSON.parse(item.request);

                                return {
                                    ...item,
                                    date_time: formattedDateTime,
                                    request: parsedRequest
                                };
                            });
                            setDevice(revisedData);
                            setErrorParameter(false);
                        }
                        else {
                            toast.error(res.error, { autoClose: 3000 });
                            setErrorParameter(false);
                        }
                    });
            }

        },
    });

    // Function to pad single digit numbers with a leading zero
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }



    const [Request, setShowJson] = useState({});
    const [Response, setShowJsonResponse] = useState({});
    const [modal_togFirst, setmodal_togFirst] = useState(false);
    const [modal_togFirst1, setmodal_togFirst1] = useState(false);
    const [NotaValidJSON, setNotaValidJSON] = useState(false);

    function tog_togFirst(request) {
        setmodal_togFirst(!modal_togFirst);
        setShowJson(request);
    }
    function tog_togFirst1(response) {
        setmodal_togFirst1(!modal_togFirst1);
        setNotaValidJSON(false);
        try {
            const parsedData = JSON.parse(response);
            setShowJsonResponse(parsedData);
        } catch (e) {
            setShowJsonResponse(response);
            setNotaValidJSON(true);
        }
    }

    //const dateTimeArray =  [ 2024, 4, 6, 16, 11, 2];    Date Format Receiving from SAP


    const SAP_Status = [
        {
            options: [
                { label: "Select Status", value: "" },
                { label: "Success", value: "S" },
                { label: "Failed", value: "F" },
                { label: "All Data", value: "ALL" },
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
                Header: "Vehicle No",
                accessor: "vehicleNumber",
                filterable: false,
            },
            {
                Header: "Movement Type",
                accessor: "movement_type",
                filterable: false,
            },
            {
                Header: "Plant Code",
                accessor: "plant_code",
                filterable: false,
            },
            // {
            //     Header: "Company Code",
            //     accessor: "company_code",
            //     filterable: false,
            // },
            {
                Header: "Direction",
                accessor: "direction",
                filterable: false,
            },
            {
                Header: "Service",
                accessor: "source_table",
                filterable: false,
            },
            {
                Header: "Date & Time",
                accessor: "date_time",
                filterable: false,

            },
            {
                Header: "Status",
                accessor: "status_flag",
                Cell: (cell) => {
                    if (cell.value === "S") {

                        return <span className="badge text-uppercase badge-soft-success"> Success </span>;
                    }
                    else if (cell.value === "F") {

                        return <span className="badge text-uppercase badge-soft-danger"> Failed </span>;
                    }
                }
            },
            {
                Header: "JSON Data",
                accessor: "indentStatus",
                Cell: (cellProps) => {
                    if (cellProps) {
                        return (
                            <>
                                <Link to="#" className="text-success d-inline-block edit-item-btn"
                                    onClick={() => { const request = cellProps.row.original.request; tog_togFirst(request); }}
                                ><button type="button" class="btn btn-sm btn-outline-success waves-effect waves-light border-success" >Request</button>
                                </Link>
                                <Link to="#" className="text-success d-inline-block edit-item-btn ms-2"
                                    onClick={() => { const response = cellProps.row.original.response; tog_togFirst1(response); }}
                                ><button type="button" class="btn btn-sm btn-outline-success waves-effect waves-light border-success" >Response</button>
                                </Link>
                            </>
                        )
                    }
                }
            }
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
        // ws["A1"].s = { // Style for the header cell A1
        //     fill: {
        //         fgColor: { rgb: "FFFF00" } // Yellow background color
        //     },
        //     font: {
        //         bold: true,
        //         color: { rgb: "000000" } // Black font color
        //     }
        // };
        // Add more styling options as needed

        // Add the worksheet to the workbook

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Generate an XLSX file
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Convert binary string to Blob
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        // Save the Blob as a file using FileSaver
        FileSaver.saveAs(blob, 'SAPDetails.xlsx');

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

    document.title = "SAP Details | EPLMS";
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
                    <BreadCrumb title={"SAP Details"} pageTitle="Dashboard" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">SAP Details</h5>
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

                                    <Form className="tablelist-form ps-2"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            validation.handleSubmit();
                                            return false;
                                        }} autoComplete="off">
                                        <Row className="mt-4">
                                            {/* <Col lg={3} className="ms-2">
                                            <div>
                                                <Label className="form-label" >Movement Type<span style={{ color: "red" }}>*</span></Label>
                                                <Input
                                                    name="trip_movement_type_code"
                                                    type="select"
                                                    className="form-select"
                                                    value={values.trip_movement_type_code}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    {trip_movement_type_code.map((item, key) => (
                                                        <React.Fragment key={key}>
                                                            {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                        </React.Fragment>
                                                    ))}
                                                </Input>
                                            </div>
                                        </Col> */}

                                            <Col md={3} >
                                                <Label htmlFor="validationDefault07" className="form-label">
                                                    SAP Status<span style={{ color: "red" }}>*</span>
                                                </Label>
                                                <Input
                                                    name="status_flag"
                                                    type="select"
                                                    className="form-select"
                                                    id="validationDefault07"
                                                    value={validation.values.status_flag || ""}
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    invalid={validation.touched.status_flag && validation.errors.status_flag ? true : false}
                                                >
                                                    {SAP_Status.map((item, key) => (
                                                        <React.Fragment key={key}>
                                                            {item.options.map((option, key) => (
                                                                <option value={option.value} key={key}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </React.Fragment>
                                                    ))}
                                                </Input>
                                                {validation.touched.status_flag && validation.errors.status_flag ? (
                                                    <FormFeedback type="invalid">{validation.errors.status_flag}</FormFeedback>
                                                ) : null}
                                            </Col>

                                            <Col md={3}>
                                                <Label htmlFor="validationDefault03" className="form-label">Start Date<span style={{ color: "red" }}>*</span></Label>
                                                <Input type="date" className="form-control"
                                                    id="validationDefault03"
                                                    name="fromDate"
                                                    maxlength="25"
                                                    placeholder="Select Start Date"
                                                    validate={{ required: { value: true }, }}
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    readOnly={(!!isEdit ? true : false)}
                                                    value={validation.values.fromDate || ""}
                                                    invalid={validation.touched.fromDate && validation.errors.fromDate ? true : false}
                                                    max={today}

                                                />
                                                {validation.touched.fromDate && validation.errors.fromDate ? (
                                                    <FormFeedback type="invalid">{validation.errors.fromDate}</FormFeedback>
                                                ) : null}
                                            </Col>

                                            <Col md={3}>
                                                <Label htmlFor="validationDefault03" className="form-label">End Date<span style={{ color: "red" }}>*</span></Label>
                                                <Input type="date" className="form-control"
                                                    id="validationDefault03"
                                                    name="toDate"
                                                    maxlength="25"
                                                    placeholder="Select End Date"
                                                    validate={{ required: { value: true }, }}
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    readOnly={(!!isEdit ? true : false)}
                                                    value={validation.values.toDate || ""}
                                                    invalid={validation.touched.toDate && validation.errors.toDate ? true : false}
                                                    max={today}

                                                />
                                                {validation.touched.toDate && validation.errors.toDate ? (
                                                    <FormFeedback type="invalid">{validation.errors.toDate}</FormFeedback>
                                                ) : null}
                                            </Col>
                                            <Col md={3}>
                                                <Label htmlFor="validationDefault03" className="form-label">Vehicle Number</Label>
                                                <Input type="text" className="form-control"
                                                    id="validationDefault03"
                                                    name="vehicleNumber"
                                                    maxlength="25"
                                                    placeholder="Enter Vehicle Number"
                                                    validate={{ required: { value: true }, }}
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    readOnly={(!!isEdit ? true : false)}
                                                    value={validation.values.vehicleNumber || ""}
                                                    invalid={validation.touched.vehicleNumber && validation.errors.vehicleNumber ? true : false}

                                                />
                                                {validation.touched.vehicleNumber && validation.errors.vehicleNumber ? (
                                                    <FormFeedback type="invalid">{validation.errors.vehicleNumber}</FormFeedback>
                                                ) : null}
                                            </Col>
                                            <Col md={12} className="hstack gap-2 justify-content-end mt-3" style={{}}>
                                                <button type="submit" className="btn btn-success" >{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Searching...</> : <><i className="ri-search-line align-bottom me-1"></i>Search</>}   </button>
                                            </Col>
                                        </Row>
                                    </Form>



                                </CardHeader>
                                <div className="card-body pt-0 mt-1 p-3">
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
                                            SearchPlaceholder='Search Vehicle Number or something...'
                                            divClass="overflow-auto"
                                        />
                                    </div>

                                    <ToastContainer closeButton={false} limit={1} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>


            <Modal isOpen={modal_togFirst} toggle={() => { tog_togFirst(); }} id="firstmodal" centered size="lg">
                <ModalHeader toggle={() => { tog_togFirst(); }} className='bg-light p-3 pb-2 pt-3 modal-header' style={{ color: "white !important" }}>
                    <h5 className="text-dark">{"Request JSON"}</h5>
                </ModalHeader>
                <ModalBody className="p-3 pb-5" style={{ maxHeight: "600px", overflowY: "auto" }}>

                    <pre>{JSON.stringify({ Request }, null, 4)}</pre>
                </ModalBody>
            </Modal>

            <Modal isOpen={modal_togFirst1} toggle={() => { tog_togFirst1(); }} id="firstmodal" centered size="lg">
                <ModalHeader toggle={() => { tog_togFirst1(); }} className='bg-light p-3 pb-2 pt-3 modal-header' style={{ color: "white !important" }}>
                    <h5 className="text-dark">{"Response Data"}</h5>
                </ModalHeader>
                <ModalBody className="p-3 pb-5" style={{ maxHeight: "600px", overflowY: "auto" }}>
                    {NotaValidJSON ? (
                        <p>{Response}</p>
                    ) :
                        <pre>{JSON.stringify({ Response }, null, 4)}</pre>
                    }

                </ModalBody>
            </Modal>


        </React.Fragment>
    );
};

export default SAPDetails;
