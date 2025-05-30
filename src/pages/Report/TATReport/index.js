import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import '../Tolerance/Tolerance.css';
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
    trip_movement_type_code: "",
};


const TATReport = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [devices, setDevice] = useState([]);
    const [stageData, setStageData] = useState([]);
    const [Movement, setMovement] = useState([]);
    const [Material, setMaterial] = useState([]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [CurrentID, setClickedRowId] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [dynamicFlag, setDynamicFlag] = useState(1);
    const [Plant_Code, setPlantCode] = useState('');
    const [errorStartDate, setErrorStartDate] = useState(false);
    const [errorEndDate, setErrorEndDate] = useState(false);
    const [errorCompare, setErrorCompare] = useState(false);
    const [ErrorMovement, setErrorMovement] = useState(false);
    const [latestHeader, setLatestHeader] = useState('');

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
        getMovementData(plantcode);

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

    const getAllDeviceData = () => {
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
        else if (values.trip_movement_type_code === "") {
            setErrorMovement(true);
        }
        else {
            setErrorStartDate(false);
            setErrorEndDate(false);
            setErrorMovement(false);
            setErrorCompare(false);
            axios.post(`${process.env.REACT_APP_LOCAL_URL_REPORTS}/getReport/tatReport`, values, config)
                .then(res => {
                    const device = res["#result-set-1"];
                    setDevice(device);
                });
        }
    }

    const getMovementData = (plantcode) => {

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/movements?plantCode=${plantcode}`, config)
            .then(res => {
                const Movement = res;
                setMovement(Movement);
            })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value || value.valueAsNumber,
        });
    };

    const createdDateFunction = (date, date1, date2) => {

        setValues({
            ...values,
            ['start_date']: date1 + " 00:00:00",
            ["master_plant_id"]: Plant_Code,
        });
        setErrorStartDate(false);
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
        if (endDate < startDate) {
            setErrorCompare(true);
        }
        else{
            setErrorCompare(false);
        }
    };

    const sumTimes = (times) => {
        let totalSeconds = times.reduce((acc, time) => {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            return acc + (hours * 3600) + (minutes * 60) + seconds;
        }, 0);
    
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
    
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
                Header: "Trip Count",
                accessor: "Trip_CNT",
                filterable: false,
            },
            {
                Header: "Date",
                accessor: "date1",
                filterable: false,
            },
            {
                Header: "YI-GI",
                accessor: "YI_GI",
                filterable: false,
            },
            {
              Header: "GI-TW",
              accessor: "GI_TW",
              filterable: false,
            },
            {
              Header: "TW-PI",
              accessor: "TW_PI",
              filterable: false,
            },
            {
                Header: "PI-PO",
                accessor: "PI_PO",
                filterable: false,
            },
            {
                Header: "PO-GW",
                accessor: "PO_GW",
                filterable: false,
            },
            {
                Header: "GW-GO",
                accessor: "GW_GO",
                filterable: false,
            },
            {
                Header: "Total Time",
                accessor: "totalSum",
                Cell: ({ row }) => {
                    const times = [
                        row.original.YI_GI,
                        row.original.GI_TW,
                        row.original.TW_PI,
                        row.original.PI_PO,
                        row.original.PO_GW,
                        row.original.GW_GO
                    ];
                    return sumTimes(times);
                },
                filterable: false,
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
        FileSaver.saveAs(blob, 'TATReport.xlsx');
      
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

    document.title = "TAT Reports | EPLMS";
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
                    <BreadCrumb title={"TAT Reports"} pageTitle="Reports" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">TAT Reports</h5>
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
                                            <Label htmlFor="validationDefault04" className="form-label">Start Date<span style={{ color: "red" }}>*</span></Label>
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
                                            <Label htmlFor="validationDefault04" className="form-label">End Date<span style={{ color: "red" }}>*</span></Label>
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

                                        <Col lg={3}>
                                            <div>
                                                <Label className="form-label" >Movement<span style={{ color: "red" }}>*</span></Label>
                                                <Input
                                                    name="trip_movement_type_code"
                                                    type="select"
                                                    className="form-select"
                                                    // value={values.trip_movement_type_code}
                                                    onChange={handleInputChange}

                                                >
                                                    <React.Fragment>
                                                        <option value="" selected>Select Movement</option>
                                                        {Movement.map((item, key) => (<option value={item.code} key={key}>{item.name}</option>))}
                                                    </React.Fragment>
                                                </Input>
                                            </div>
                                            {ErrorMovement && <p className="mt-2" style={{ color: "red" }}>Please Select Movement Type</p>}
                                        </Col>

                                        <Col md={3} className="hstack gap-2" style={{ marginTop: "28px", flexDirection:"column", alignItems:"baseline" }}>
                                            <button type="button" className="btn btn-success" onClick={getAllDeviceData} >Submit </button>
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
                                            SearchPlaceholder='Search for Trip Count...'
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


        </React.Fragment>
    );
};

export default TATReport;
