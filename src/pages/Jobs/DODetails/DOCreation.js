import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Button, Modal, Form, FormGroup, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner } from "reactstrap";

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
import * as Yup from "yup";
import { useFormik } from "formik";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from '@material-ui/core';


const DOCreation = () => {
    const [devices, setDevice] = useState([]);
    const [Plant_Code, setPlantCode] = useState('');
    const [latestHeader, setLatestHeader] = useState('');
    const [MaterialData, setMaterialData] = useState([]);
    const [options, setOptions] = useState([]);
    const [vehicleListFetching, setVehicleListFetching] = useState(false);
    const [UnitCode, setUnitCode] = useState([]);
    const [errorParameter, setErrorParameter] = useState(false);


    useEffect(() => {
        const HeaderName = localStorage.getItem("HeaderName");
        setLatestHeader(HeaderName);
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
        getFirstTimeData(plantcode);
        getMaterialData(plantcode);
        getUnitCode(plantcode);

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

    const getFirstTimeData = (plantcode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/manualDoCreation?plantCode=${plantcode}`, config)
            .then(res => {
                const device = res;
                setDevice(device);
            });
    }

    const getMaterialData = (plantCode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/materials?plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                if (res.errorMsg) {
                    setMaterialData([]);
                } else {
                    setMaterialData(data);
                }

            })
    }

    const getUnitCode = (plantcode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Unit?plantCode=${plantcode}`, config)
            .then(res => {
                const device = res;
                setUnitCode(device);
            });
    }

    const initialFormValues = {
        doNumber: '',
        doQty: '',
        materialCode: '',
        plant: '',
        mrp: '',
        vehicleNo: null,
        plantCode: '',
        remarks:''
    };

    const [formValues, setFormValues] = useState(initialFormValues);
    const [errors, setErrors] = useState({});

    const plants = [
        { id: 1, name: 'vehicleNo 1' },
        { id: 2, name: 'vehicleNo 2' },
        { id: 3, name: 'vehicleNo 3' }
    ];

    const validate = () => {
        const newErrors = {};
        if (!formValues.doNumber) newErrors.doNumber = 'DO Number is required';
        if (!formValues.doQty) newErrors.doQty = 'DO Quantity is required';
        if (!formValues.materialCode) newErrors.materialCode = 'Material Code is required';
        if (!formValues.plant) newErrors.plant = 'Plant is required';
        if (!formValues.vehicleNo) newErrors.vehicleNo = 'Vehicle Number is required';
        return newErrors;
    };

    const handleChange = (e) => {debugger;
        const { id, value } = e.target;
        
        if (id === 'doQty') {
            // Allow only digits and a single decimal point
            let numericValueDONumber = value.replace(/[^0-9.]/g, '');

            // Validate the format: up to two digits before and two digits after the decimal point
            const regex = /^\d{0,2}(\.\d{0,2})?$/;

            if (!regex.test(numericValueDONumber)) {
                return;
            }

            // Remove leading zeros except for the case of "0."
            if (numericValueDONumber.startsWith('0') && numericValueDONumber.length > 1 && numericValueDONumber[1] !== '.') {
                numericValueDONumber = numericValueDONumber.replace(/^0+/, '');
            }

            setFormValues({ ...formValues, [id]: numericValueDONumber });

            if (errors[id]) {
                setErrors({ ...errors, [id]: null });
            }

            return;
        }

        // Allow only digits
        var numericValue = value.replace(/\D/g, '');
        //let numericValueDONumber = value.replace(/[^0-9.]/g, '');
        // Limit the length of doNumber to 10 characters
        if (id === 'doNumber' && numericValue.length > 10) {
            return;
        }
        if (id === 'plant') {
            numericValue = value;
        }
        setFormValues({ ...formValues, [id]: numericValue });

        if (errors[id]) {
            setErrors({ ...errors, [id]: null });
        }
    };

    const handleAutocompleteChange = (event, newValue) => {
        setFormValues({ ...formValues, vehicleNo: newValue.registration_number, plantCode: Plant_Code });
        if (errors.vehicleNo) {
            setErrors({ ...errors, vehicleNo: null });
        }
    };
    const handleInputChange = async (event, value) => {
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
        if (sanitizedValue && sanitizedValue.length >= 3) {
            setVehicleListFetching(true);
            await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicleStatus/vehicleInfo?plantCode=${Plant_Code}&vehicleNumber=${sanitizedValue}`, config)
                .then(res => {
                    setOptions(res);
                    setVehicleListFetching(false);
                })
        } else {
            // Clear options if input is cleared
            setOptions([]);
            setVehicleListFetching(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            openRemarksModal();
            setFormValues({ ...formValues, remarks: "" });
            setDOCloseMessage(false);
            setDisabled1(true);
        }
    };

    const [cancelModal, setCancelModal] = useState(false);
    const [disabled1, setDisabled1] = useState(true);
    const [DOCloseMessage, setDOCloseMessage] = useState(false);
    const openRemarksModal = () => {
        setCancelModal(!cancelModal);
    };

    const handleChangeRemarks = (event) => {

        //var data = event.target.value;
        if (event.target.value === "") {
            setDisabled1(true);
        }
        else {
            setDisabled1(false);
            setFormValues({ ...formValues, remarks: event.target.value });

        }
    };

    const submitDOCreation = async () => {
        debugger;
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let userEmail = obj.data.email;
        setErrorParameter(true);
        const data = { ...formValues, ["userName"]: userEmail }
        console.log('Values:', data);
        try {
            await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/manualDoCreation`, data, config)
                .then(res => {
                    if (res.httpStatus === "success") {
                        toast.success(res.response, { autoClose: 3000 });
                        getFirstTimeData(Plant_Code);
                        setErrorParameter(false);
                        setFormValues(initialFormValues);
                        openRemarksModal();
                    }
                    else if (res.httpStatus === "allow") {
                        setErrorParameter(false);
                        setDOCloseMessage(true);
                    }
                    else {
                        toast.error(res.response, { autoClose: 3000 });
                        setErrorParameter(false);
                        setFormValues(initialFormValues);
                        openRemarksModal();
                    }
                })
        }
        catch (e) {
            toast.error(e, { autoClose: 3000 });
            setErrorParameter(false);
            openRemarksModal();
        }
    };

    const freeDoNumber = async () => {
        debugger;
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let userEmail = obj.data.email;

        const data = {
            ["doNumber"]: formValues.doNumber,
            ["plantCode"]: Plant_Code,
            ["remarks"]: formValues.remarks,
            ["userName"]: userEmail,
        }
        console.log(data);
        setErrorParameter(true);
        try {
            await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/manualDoCreation`, data, config)
                .then(res => {
                    if (res.httpStatus === "success") {
                        toast.success(res.response, { autoClose: 3000 });
                        getFirstTimeData(Plant_Code);
                        setErrorParameter(false);
                        setFormValues(initialFormValues);
                    }
                    else {
                        toast.error(res.response, { autoClose: 3000 });
                        setErrorParameter(false);
                        setFormValues(initialFormValues);
                    }
                })
        }
        catch (e) {
            toast.error(e, { autoClose: 3000 });
            setErrorParameter(false);
        }
        openRemarksModal();

    }




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
                    if (cell.value) {
                        return ((cell.value).replace("T", " "));
                    }
                    else {
                        return ("");
                    }

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
                Header: "Remarks",
                accessor: "remarks",
                filterable: false,
            },
            {
                Header: "Created Date",
                accessor: "manualCreatedDate",
                filterable: false,
                Cell: (cell) => {
                    if (cell.value) {
                        return ((cell.value).replace("T", " "));
                    }
                    else {
                        return ("");
                    }

                }
            },
            {
                Header: "Created User Email",
                accessor: "username",
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

    document.title = "DO Creation | EPLMS";
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
                    <BreadCrumb title={"DO Creation"} pageTitle="Dashboard" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Add DO Manually</h5>
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

                                    <Form onSubmit={handleSubmit}>
                                        <Row className="mb-3 p-3">
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="doNumber">DO Number</Label><span className="text-danger">*</span>
                                                    <Input
                                                        type="number"
                                                        id="doNumber"
                                                        placeholder="Please enter DO Number"
                                                        value={formValues.doNumber}
                                                        maxLength={10}
                                                        onChange={handleChange}
                                                        invalid={!!errors.doNumber}
                                                    />
                                                    {errors.doNumber && <FormFeedback>{errors.doNumber}</FormFeedback>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="doQty">DO Quantity</Label><span className="text-danger">*</span>
                                                    <Input
                                                        type="number"
                                                        id="doQty"
                                                        placeholder="Please enter DO Quantity"
                                                        value={formValues.doQty}
                                                        onChange={handleChange}
                                                        invalid={!!errors.doQty}
                                                    />
                                                    {errors.doQty && <FormFeedback>{errors.doQty}</FormFeedback>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="vehicleNo">Vehicle Number</Label><span className="text-danger">*</span>&nbsp;<span className="text-muted" style={{ animation: "blink 2s infinite" }}>{"(Enter atleast 3 digit)"}</span>
                                                    {/* <Autocomplete
                                                        id="vehicleNo"
                                                        options={plants}
                                                        getOptionLabel={(option) => (option && option.name) || ''}
                                                        value={formValues.vehicleNo}
                                                        onChange={handleAutocompleteChange}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="outlined"
                                                                placeholder="Select Vehicle Number"
                                                                error={!!errors.vehicleNo}
                                                                helperText={errors.vehicleNo}
                                                            />
                                                        )}
                                                    /> */}
                                                    <Autocomplete
                                                        style={{ marginTop: '-15px' }}
                                                        freeSolo
                                                        id="vehicleNo"
                                                        options={options}
                                                        getOptionLabel={option => option.registration_number || option}
                                                        value={formValues.vehicleNo}
                                                        onChange={handleAutocompleteChange}
                                                        onInputChange={handleInputChange}
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                placeholder="Search Vehicle Number..."
                                                                margin="normal"
                                                                variant="outlined"
                                                                fullWidth
                                                                error={!!errors.vehicleNo}
                                                                helperText={errors.vehicleNo}
                                                            />
                                                        )}
                                                    />
                                                    {vehicleListFetching && <p className="mt-1 mb-0" style={{ color: "Green", animation: "blink 1s infinite" }}>Please wait. Vehicle data fetching...</p>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="materialCode">Material Code</Label><span className="text-danger">*</span>
                                                    <Input
                                                        type="select"
                                                        id="materialCode"
                                                        value={formValues.materialCode}
                                                        onChange={handleChange}
                                                        invalid={!!errors.materialCode}
                                                    >
                                                        <option value="" defaultValue>Select Material Name</option>
                                                        {MaterialData.map((item, key) => (<option value={item.code} key={key}>{item.name} / {item.code}</option>))}
                                                    </Input>
                                                    {errors.materialCode && <FormFeedback>{errors.materialCode}</FormFeedback>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="plant">Plant/Unit Code</Label><span className="text-danger">*</span>
                                                    <Input
                                                        type="select"
                                                        id="plant"
                                                        value={formValues.plant}
                                                        onChange={handleChange}
                                                        invalid={!!errors.plant}
                                                    >
                                                        <option value="" defaultValue>Select Plant Code</option>
                                                        {UnitCode.map((item, key) => (<option value={item.unitCode} key={key}>{item.unit} / {item.unitCode}</option>))}
                                                    </Input>
                                                    {errors.plant && <FormFeedback>{errors.plant}</FormFeedback>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="mrp">MRP</Label>
                                                    <Input
                                                        type="number"
                                                        id="mrp"
                                                        placeholder="Please enter MRP"
                                                        value={formValues.mrp}
                                                        onChange={handleChange}
                                                        invalid={!!errors.mrp}
                                                    />
                                                    {errors.mrp && <FormFeedback>{errors.mrp}</FormFeedback>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <Button type="submit" className="btn btn-success " style={{ marginTop: "28px" }}>Submit</Button>
                                            </Col>
                                        </Row>
                                    </Form>



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
                                            tableClass="width-150"
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
                }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}><h5 className="text-white fs-20 m-0">Add DO</h5>
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
                                    value={formValues.remarks}
                                    onChange={handleChangeRemarks}
                                />
                            </div>
                            {DOCloseMessage &&
                                <div>
                                    <h6 className="mt-3 text-danger">This DO Number is already mapped. Do you want to free</h6>
                                </div>
                            }
                        </Col>
                        <div className="text-center">
                            {DOCloseMessage ? (
                                <>
                                    <button type="button" className="btn btn-success" onClick={freeDoNumber} > {errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Submitting...</> : "Yes"} </button>
                                    <button type="button" className="btn btn-warning ms-3" onClick={openRemarksModal} > No </button>
                                </>
                            ) :
                                <button type="button" className="btn btn-success" onClick={submitDOCreation} disabled={disabled1}>{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Submitting...</> : "Submit"} </button>
                            }
                        </div>

                    </Row>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default DOCreation;
