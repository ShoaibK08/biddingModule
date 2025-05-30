import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

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

const initialValues = {
    start_date: "",
    end_date: "",
    status: "",
};


const DODetails = () => {
    const [devices, setDevice] = useState([]);
    const [values, setValues] = useState(initialValues);
    const [Plant_Code, setPlantCode] = useState('');
    const [errorStartDate, setErrorStartDate] = useState(false);
    const [errorEndDate, setErrorEndDate] = useState(false);
    const [errorCompare, setErrorCompare] = useState(false);
    const [tendaysCompare, setTendaysCompare] = useState(false);
    const [latestHeader, setLatestHeader] = useState('');


    useEffect(() => {
        const HeaderName = localStorage.getItem("HeaderName");
        setLatestHeader(HeaderName);
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
        getFirstTimeData(plantcode);

    }, []);

    const getFirstTimeData = (plantcode) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username: process.env.REACT_APP_API_USER_NAME,
                password: process.env.REACT_APP_API_PASSWORD,
            },
        };
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/consignments?fromDate=&toDate=&status=A&plantCode=${plantcode}`, config)
            .then(res => {
                const device = res;
                setDevice(device);
            });
    }

    const getAllDeviceData = () => {
        console.log(values);
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
            setTendaysCompare(false);

            axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/consignments?fromDate=${values.start_date}&toDate=${values.end_date}&status=${values.status ? values.status : "A"}&plantCode=${Plant_Code}`, config)
                .then(res => {
                    const device = res;
                    setDevice(device);
                });
        }
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
            ['start_date']: date1,
            ["plantCode"]: Plant_Code,
        });
        setErrorStartDate(false);
        setErrorEndDate(false);
        setErrorCompare(false);
        const startDate = new Date(date1);
        const endDate = new Date(values.end_date);
        const differenceInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        if (endDate < startDate) {
            setErrorCompare(true);
        }
        else if (differenceInDays > 10) {
            setTendaysCompare(true);
        }
    };

    const createdDateFunction1 = (date, date1, date2) => {
        debugger;

        setValues({
            ...values,
            ['end_date']: date1,
            ["plantCode"]: Plant_Code,
        });
        setErrorEndDate(false);
        const startDate = new Date(values.start_date);
        const endDate = new Date(date1);
        const differenceInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        if (endDate < startDate) {
            setErrorCompare(true);
        }
        else if (differenceInDays > 10) {
            setTendaysCompare(true);
        }
        else {
            setErrorCompare(false);
            setTendaysCompare(false);
        }
    };

    const status = [
        {
            options: [
                { label: "Select Status", value: "" },
                { label: "Active", value: "A" },
                { label: "Deactive", value: "C" },
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
                Header: "DO No",
                accessor: "diNumber",
                filterable: false,
            },
            {
                Header: "DO Qty",
                accessor: "diQty",
                filterable: false,
            },
            {
                Header: "Trip Id",
                accessor: "tripId",
                filterable: false,
            },
            {
                Header: "MRP",
                accessor: "mrp",
                filterable: false,
                Cell: (cell) => {
                    return (cell.value === "NULL" ? "0" : cell.value);
                }
            },
            {
                Header: "DO Creation Date",
                accessor: "consignmentDate",
                filterable: false,
                Cell: (cell) => {
                    return ((cell.value).replace("T", " "));
                }
            },
            {
                Header: "Unit Code",
                accessor: "unitcode",
                filterable: false,
            },
            // {
            //     Header: "Material Name",
            //     accessor: "trip_tareweight",
            //     filterable: false,
            // },
            {
                Header: "Material Code",
                accessor: "materialCode",
                filterable: false,
            },
            {
                Header: "IDoc",
                accessor: "idocNo",
                filterable: false,
            },
            // {
            //   Header: "Trip Status",
            //   accessor: "trip_status",
            //   Cell: (cell) => {
            //     
            //     switch (cell.value) {
            //       case "A":
            //         return <span className="badge text-uppercase badge-soft-success"> Active </span>;
            //       case "D":
            //         return <span className="badge text-uppercase badge-soft-danger"> Deactive </span>;
            //       default:
            //         return <span className="badge text-uppercase badge-soft-info"> Active </span>;
            //     }
            //   }
            // },
            //   {
            //     Header: "Action",
            //     Cell: (cellProps) => {
            //       return (
            //         <ul className="list-inline hstack gap-2 mb-0">
            //           <li class="list-inline-item" title="Approve">
            //             <Link
            //               to="#"
            //               className="text-success d-inline-block view-item-btn"
            //               onClick={() => { const data = cellProps.row.original; approveData(data); }}
            //             >

            //               <i className="ri-checkbox-circle-line fs-16 text-success"></i>
            //             </Link>
            //           </li>
            //           <li class="list-inline-item" title="Reject">
            //             <Link
            //               to="#"
            //               className="text-success d-inline-block view-item-btn"
            //               onClick={() => { const data = cellProps.row.original; rejectData(data); }}
            //             >

            //               <i className="ri-close-circle-line fs-16 text-danger"></i>
            //             </Link>
            //           </li>
            //         </ul>
            //       );
            //     },
            //   },
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
        a.download = 'DODetails.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };


    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    document.title = "DO Details | EPLMS";
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
                    <BreadCrumb title={"DO Details"} pageTitle="Dashboard" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">DO Details</h5>
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
                                            {tendaysCompare && <p className="mt-2" style={{ color: "red" }}>Difference between start date and end date is greater than 10 days.</p>}
                                        </Col>
                                        <Col lg={3}>
                                            <div>
                                                <Label className="form-label" >Status</Label>
                                                <Input
                                                    name="status"
                                                    type="select"
                                                    className="form-select"
                                                    value={values.status}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    {status.map((item, key) => (
                                                        <React.Fragment key={key}>
                                                            {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                        </React.Fragment>
                                                    ))}
                                                </Input>
                                            </div>
                                        </Col>

                                        <Col md={1} className="hstack gap-2 justify-content-end" style={{ marginTop: "29px", display: "block" }}>
                                            <button type="button" className="btn btn-success" onClick={getAllDeviceData} >Search </button>
                                        </Col>
                                    </Row>



                                </CardHeader>
                                <div className="card-body pt-0">
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

export default DODetails;
