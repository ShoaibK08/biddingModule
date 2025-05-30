import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

const initialValues = {
    start_date: "",
    end_date: "",
    master_plant_id: "",
};


const ReportTareWeight = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [devices, setDevice] = useState([]);
    const [plants, setPlants] = useState([]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dynamicFlag, setDynamicFlag] = useState(1);
    const [Plant_Code, setPlantCode] = useState('');
    const [errorStartDate, setErrorStartDate] = useState(false);
    const [errorEndDate, setErrorEndDate] = useState(false);
    const [errorCompare, setErrorCompare] = useState(false);
    const [latestHeader, setLatestHeader] = useState('');
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
        //getAllDeviceData();
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
        if (startDate === "") {
            setErrorStartDate(true);
        }
        else if (endDate === "") {
            setErrorEndDate(true);
        }
        else {
            setErrorStartDate(false);
            setErrorEndDate(false);
            setErrorCompare(false);
            setErrorParameter(true);
            try {
                await axios.get(`${process.env.REACT_APP_LOCAL_URL_REPORTS}/TWweightment/search?entryTime=${startDate}&exitTime=${endDate}&status=A&plantCode=${Plant_Code}`, config)
                    .then(res => {
                        if (res.data === "") {
                            setDevice([]);
                            setErrorParameter(false);
                            toast.error('No data found!', { autoClose: 3000 });
                        } else {
                            setDevice(res);
                            setErrorParameter(false);
                        }

                    });
            }
            catch (error) {
                console.log(error);
                toast.error(error, { autoClose: 3000 });
                setDevice([]);
                setErrorParameter(false);
            }
        }
    };

    const createdDateFunction = (date, date1, date2) => {

        // setValues({
        //   ...values,
        //   ['start_date']: date1 + " 00:00:00",
        //   ["master_plant_id"]: Plant_Code,
        // });
        setStartDate(date1 + " 00:00:00");
        setErrorStartDate(false);
    };

    const createdDateFunction1 = (date, date1, date2) => {

        // setValues({
        //   ...values,
        //   ['end_date']: date1 + " 23:59:00",
        //   ["master_plant_id"]: Plant_Code,
        // });
        setEndDate(date1 + " 23:59:00");
        setErrorEndDate(false);
        const startDate = new Date(values.start_date);
        const endDate = new Date(date1 + " 23:59:00");
        if (endDate < startDate) {
            setErrorCompare(true);
        }
        else {
            setErrorCompare(false);
        }
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
              accessor: "tripId",
              filterable: false,
            },
            {
                Header: "Vehicle No",
                accessor: "vehicleNumber",
                filterable: false,
            },
            {
                Header: "Weight Type",
                accessor: "weightType",
                filterable: false,
            },
            {
                Header: "Tare Weight",
                accessor: "weight",
                filterable: false,
            },
            {
                Header: "Approved/Rejected By",
                accessor: "level1ApprovalBy",
                filterable: false,
            },
            {
                Header: "Date & Time",
                accessor: "weighmentDate",
                filterable: false,
            },
            {
                Header: "Remarks",
                accessor: "toleranceRemarks1",
                filterable: false,
            },
            {
                Header: "Status",
                accessor: "isToleranceFailed",
                Cell: (cell) => {
        
                  switch (cell.value) {
                    case 2:
                      return <span className="badge text-uppercase badge-soft-success"> Approved </span>;
                    case 3:
                      return <span className="badge text-uppercase badge-soft-danger"> Rejected </span>;
                    default:
                      return <span className="badge text-uppercase badge-soft-info"> Active </span>;
                  }
                }
              },
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
        FileSaver.saveAs(blob, 'TareWeight.xlsx');

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

    document.title = "Tare Weight | EPLMS";
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
                    <BreadCrumb title={'Tare Weight'} pageTitle="Reports" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Tare Weight Approve/Reject Details</h5>
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
                                        </Col>
                                        <Col md={3} className="hstack gap-2" style={{ marginTop: "28px", display: "block" }}>
                                            <button type="button" className="btn btn-success" onClick={getAllDeviceData} >
                                                {loadingParameter ? (
                                                        <>
                                                            <Spinner size="sm" className="me-2 visible" />Loading...
                                                        </>
                                                    ) : (
                                                        <>Search Report</>
                                                    )}</button>
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
                                        //divClass="overflow-auto"
                                        // tableClass="width-200"
                                        />
                                    </div>
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

export default ReportTareWeight;
