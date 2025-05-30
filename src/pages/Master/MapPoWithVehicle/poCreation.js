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


const POCreation = () => {
    const [devices, setDevice] = useState([]);
    const [Plant_Code, setPlantCode] = useState('');
    const [latestHeader, setLatestHeader] = useState('');
    const [MaterialData, setMaterialData] = useState([]);
    const [options, setOptions] = useState([]);
    const [vendorCodeError, setVendorCodeError] = useState('');
    const [UnitCode, setUnitCode] = useState([]);
    const [uomList, setUOM] = useState([]);
    const [errorParameter, setErrorParameter] = useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const [storageLocation, setStorageLocation] = useState([]);
    const [qualityGrade, setQualityGrade] = useState([]);
    const [source, setSource] = useState([]);
    const [disabledFields, setDisabledFields] = useState({
        under_delivery_tol: false,
        over_delivery_tol: false
    });


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
        //getStorageLocation(plantcode);
        getQualityGrade(plantcode);
        getSource(plantcode);
        getUOM(plantcode);
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
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poManual/getAllPoData?plantCode=${plantcode}`, config)
            .then(res => {
                const device = res;
                if (device.statusCode === 404) {
                    setDevice([]);
                }
                else {
                    setDevice(device);
                }
            });
    }

    const getMaterialData = (plantCode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/materialIb/getByPlantCode/${plantCode}`, config)
            .then(res => {
                const MaterialData = res;
                if (res.msg && (res.msg).includes('No items')) {
                    setMaterialData([]);
                } else {
                    setMaterialData(MaterialData);
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

    const getUOM = (plantcode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/unit-measurement`, config)
            .then(res => {
                const device = res;
                setUOM(device);
            });
    }

    const getStorageLocation = (plantcode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poManual/getStorageLocation?plantCode=${plantcode}`, config)
            .then(res => {
                const device = res;
                setStorageLocation(device);
            });
    }

    const getQualityGrade = (plantcode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poManual/getQualityGrade?plantCode=${plantcode}`, config)
            .then(res => {
                const device = res;
                setQualityGrade(device);
            });
    }

    const getSource = (plantcode) => {
        // axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poManual/getSourceLocation?plantCode=${plantcode}`, config)
        //     .then(res => {
        //         const device = res;
        //         setSource(device);
        //     });
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sourceMaster/findAllData?plantCode=${plantcode}`, config)
            .then(res => {
                const device = res;
                setSource(device);
            })
    }

    const initialFormValues = {
        poNumber: '',
        poQuantity: '',
        vendorCode: "",
        poValidDate: new Date().toISOString().split('T')[0], // Default to current date,
        materialCode: '',
        uom: "",
        fromPlant: '',
        storagelocation: "",
        po_last_item: "",
        po_document_type: "",
        inco_terms1: "",
        inco_terms2: "",
        under_delivery_tol: "0",
        over_delivery_tol: "0",
        qualityGrade: "",
        remarks: ''
    };

    const [formValues, setFormValues] = useState(initialFormValues);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formValues.vendorCode) newErrors.vendorCode = 'Vendor Number is required';
        if (!formValues.poValidDate) newErrors.poValidDate = 'This Field is required';
        if (!formValues.materialCode) newErrors.materialCode = 'Material Code is required';
        if (!formValues.uom) newErrors.uom = 'UOM is required';
        if (!formValues.poNumber) newErrors.poNumber = 'PO Number is required';
        if (!formValues.poQuantity) newErrors.poQuantity = 'PO Quantity is required';
        if (!formValues.fromPlant) newErrors.fromPlant = 'Unit Code is required';
        return newErrors;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;

        if (id === 'poQuantity') {
            // Allow only digits and a single decimal point
            let numericValuepoNumber = value.replace(/[^0-9.]/g, '');
            // Validate the format: up to five digits before and two digits after the decimal point
            const regex = /^\d{0,5}(\.\d{0,2})?$/;
            if (!regex.test(numericValuepoNumber)) {
                return;
            }
            // Remove leading zeros except for "0."
            if (numericValuepoNumber.startsWith('0') && numericValuepoNumber.length > 1 && numericValuepoNumber[1] !== '.') {
                numericValuepoNumber = numericValuepoNumber.replace(/^0+/, '');
            }
            setFormValues({ ...formValues, [id]: numericValuepoNumber });
            if (errors[id]) {
                setErrors({ ...errors, [id]: null });
            }
            return;
        }

        let updatedValue = value; // Default value

        // Numeric-only fields
        if (['poNumber', 'vendorCode', 'po_last_item'].includes(id)) {
            updatedValue = value.replace(/\D/g, ''); // Allow only numbers
            if ((id === 'poNumber' || id === 'vendorCode') && updatedValue.length > 10) {
                return;
            }
            if (id === 'po_last_item' && updatedValue.length > 5) {
                return;
            }
        }
        // Disable the opposite field when one is entered
        if (id === "under_delivery_tol" && value !== "") {
            setDisabledFields({ under_delivery_tol: false, over_delivery_tol: true });
        } else if (id === "over_delivery_tol" && value !== "") {
            setDisabledFields({ under_delivery_tol: true, over_delivery_tol: false });
        } else {
            setDisabledFields({ under_delivery_tol: false, over_delivery_tol: false });
        }

        // Fields that should accept text input
        if (['fromPlant', 'poValidDate', 'uom', 'storageLocation', 'qualityGrade', 'source', 'inco_terms1', 'inco_terms2'].includes(id)) {
            updatedValue = value; // Allow text input
        }

        setFormValues({ ...formValues, [id]: updatedValue });

        if (errors[id]) {
            setErrors({ ...errors, [id]: null });
        }
    };



    const handleSubmit = (event) => {
        debugger;
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
        debugger;

        //var data = event.target.value;
        if (event.target.value === "") {
            setDisabled1(true);
        }
        else {
            setDisabled1(false);
            setFormValues({ ...formValues, remarks: event.target.value });

        }
    };

    const submitPOCreation = async () => {
        debugger;
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let userID = obj.data._id;

        setErrorParameter(true);

        // Ensure under_delivery_tol and over_delivery_tol are not empty strings
        const updatedFormValues = {
            ...formValues,
            under_delivery_tol: formValues.under_delivery_tol === "" ? "0" : formValues.under_delivery_tol,
            over_delivery_tol: formValues.over_delivery_tol === "" ? "0" : formValues.over_delivery_tol,
            userId: userID
        };

        console.log('Values:', updatedFormValues);
        try {
            await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/poManual/poCreation`, updatedFormValues, config)
                .then(res => {

                    if (res && res === 'sent successfully') {
                        toast.success('PO created successfully', { autoClose: 3000 });
                        setErrorParameter(false);
                        setFormValues(initialFormValues);
                        openRemarksModal();
                        // Delay getFirstTimeData by 2 seconds
                        setTimeout(() => {
                            getFirstTimeData(Plant_Code);
                            window.location.reload();
                        }, 2000);
                    }
                    else {
                        toast.error(res, { autoClose: 3000 });
                        setErrorParameter(false);
                        setFormValues(initialFormValues);
                        openRemarksModal();
                    }
                })
        }
        catch (e) {
            toast.error('PO already exist or unknown error.', { autoClose: 3000 });
            setErrorParameter(false);
            openRemarksModal();
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
                Header: "PO Number",
                accessor: "poNumber",
                filterable: false,
            },
            {
                Header: "Vendor Number",
                accessor: "vendorCode",
                filterable: false,
            },
            {
                Header: "Material Code",
                accessor: "materialCode",
                filterable: false,
            },
            {
                Header: "Material Name",
                accessor: "materialName",
                filterable: false,
            },
            {
                Header: "Validity",
                accessor: "poValidDate",
                filterable: false,
            },
            {
                Header: "Line Item No",
                accessor: "po_last_item",
                filterable: false,
            },
            {
                Header: "Min/Max Delivery Tolerance(%)",
                filterable: false,
                Cell: (cellProps) => {
                    return (
                        <span > {cellProps.row.original.under_delivery_tol ? (`${cellProps.row.original.under_delivery_tol}/${cellProps.row.original.over_delivery_tol}`) : ""} </span>
                    )
                },
            },
            {
                Header: "Incoterm1",
                accessor: "inco_terms1",
                filterable: false,
            },
            {
                Header: "Incoterm2",
                accessor: "inco_terms2",
                filterable: false,
            },
            {
                Header: "UOM",
                accessor: "uom",
                filterable: false,
            },
            {
                Header: "Unit Code",
                accessor: "fromPlant",
                filterable: false,
            },
            {
                Header: "Remarks",
                accessor: "remarks",
                filterable: false,
            },
            {
                Header: "Created By",
                //Header: "Created User Email",
                //accessor: "username",
                filterable: false,
                Cell: (cellProps) => {
                    return (
                        <span > System </span>
                    )
                },
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

    document.title = "PO Creation | EPLMS";
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
                    <BreadCrumb title={"PO Creation"} pageTitle="Dashboard" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Add PO Manually</h5>
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
                                <CardBody className="pb-0">
                                    <Form onSubmit={handleSubmit}>
                                        <Row className="mb-3 p-3 pt-0">
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="poNumber">PO Number</Label><span className="text-danger">*</span>
                                                    <Input
                                                        type="number"
                                                        id="poNumber"
                                                        placeholder="Enter PO Number"
                                                        value={formValues.poNumber}
                                                        maxLength={10}
                                                        onChange={handleChange}
                                                        invalid={!!errors.poNumber}
                                                    />
                                                    {errors.poNumber && <FormFeedback>{errors.poNumber}</FormFeedback>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="poQuantity">PO Quantity</Label><span className="text-danger">*</span>
                                                    <Input
                                                        type="number"
                                                        id="poQuantity"
                                                        placeholder="Enter PO Quantity"
                                                        value={formValues.poQuantity}
                                                        onChange={handleChange}
                                                        invalid={!!errors.poQuantity}
                                                    />
                                                    {errors.poQuantity && <FormFeedback>{errors.poQuantity}</FormFeedback>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="vendorCode">Vendor Number</Label><span className="text-danger">*</span>
                                                    <Input
                                                        type="number"
                                                        id="vendorCode"
                                                        placeholder="Enter Vendor Number"
                                                        maxLength={10}
                                                        value={formValues.vendorCode}
                                                        onChange={handleChange}
                                                        invalid={!!errors.vendorCode}
                                                    />
                                                    {errors.vendorCode && <FormFeedback>{errors.vendorCode}</FormFeedback>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="poValidDate">Validity</Label><span className="text-danger">*</span>
                                                    <Input
                                                        type="date"
                                                        id="poValidDate"
                                                        value={formValues.poValidDate}
                                                        onChange={handleChange}
                                                        invalid={!!errors.poValidDate}
                                                        min={currentDate}
                                                    />
                                                    {errors.poValidDate && <FormFeedback>{errors.poValidDate}</FormFeedback>}
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
                                                    <Label for="uom">UOM</Label><span className="text-danger">*</span>
                                                    <Input
                                                        type="select"
                                                        id="uom"
                                                        value={formValues.uom}
                                                        onChange={handleChange}
                                                        invalid={!!errors.uom}
                                                    >
                                                        <option value="" defaultValue>Select UOM</option>
                                                        {/* <option value="KG">KG</option>
                                                        <option value="TO">MT</option>
                                                        <option value="KL">KL</option> */}
                                                        {uomList.map((item, key) => (<option value={item.code} key={key}>{item.name}</option>))}
                                                    </Input>
                                                    {errors.uom && <FormFeedback>{errors.uom}</FormFeedback>}
                                                </FormGroup>
                                            </Col>
                                            {/* <Col md={3}>
                                                <FormGroup>
                                                    <Label for="storageLocation">Storage Location</Label>
                                                    <Input
                                                        type="select"
                                                        id="storageLocation"
                                                        value={formValues.storageLocation}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="" defaultValue>Select Storage Location</option>
                                                        {storageLocation.map((item, key) => (<option value={item.storage_location} key={key}>{item.storage_location}</option>))}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="qualityGrade">Quality Grade</Label>
                                                    <Input
                                                        type="select"
                                                        id="qualityGrade"
                                                        value={formValues.qualityGrade}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="" defaultValue>Select Quality Grade</option>
                                                        {qualityGrade.map((item, key) => (<option value={item.quality_grade} key={key}>{item.quality_grade}</option>))}
                                                    </Input>
                                                </FormGroup>
                                            </Col> */}
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="fromPlant">Plant/Unit Code</Label><span className="text-danger">*</span>
                                                    <Input
                                                        type="select"
                                                        id="fromPlant"
                                                        value={formValues.fromPlant}
                                                        onChange={handleChange}
                                                        invalid={!!errors.fromPlant}
                                                    >
                                                        <option value="" defaultValue>Select Unit Code</option>
                                                        {UnitCode.map((item, key) => (<option value={item.unitCode} key={key}>{item.unit} / {item.unitCode}</option>))}
                                                    </Input>
                                                    {errors.fromPlant && <FormFeedback>{errors.fromPlant}</FormFeedback>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="storagelocation">Storage Location</Label>
                                                    <Input
                                                        type="select"
                                                        id="storagelocation"
                                                        value={formValues.storagelocation}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="" defaultValue>Select Location</option>
                                                        {source.map((item, key) => (<option value={item.sourceCode} key={key}>{`${item.sourceCode}/${item.sourceName}`}</option>))}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="po_last_item">Last Item Number</Label>
                                                    <Input
                                                        type="number"
                                                        id="po_last_item"
                                                        placeholder="Enter Item Number"
                                                        value={formValues.po_last_item}
                                                        maxLength={5}
                                                        onChange={handleChange}
                                                        invalid={!!errors.po_last_item}
                                                    />
                                                    {errors.po_last_item && <FormFeedback>{errors.po_last_item}</FormFeedback>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="po_document_type">Document Type</Label>
                                                    <Input
                                                        type="text"
                                                        id="po_document_type"
                                                        placeholder="Enter Document Type"
                                                        value={formValues.po_document_type}
                                                        maxLength={4}
                                                        onChange={handleChange}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="inco_terms1">Incoterms1</Label>
                                                    <Input
                                                        type="text"
                                                        id="inco_terms1"
                                                        placeholder="Enter Incoterms1"
                                                        value={formValues.inco_terms1}
                                                        maxLength={3}
                                                        onChange={handleChange}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="inco_terms1">Incoterms2</Label>
                                                    <Input
                                                        type="text"
                                                        id="inco_terms2"
                                                        placeholder="Enter Incoterms2"
                                                        value={formValues.inco_terms2}
                                                        maxLength={28}
                                                        onChange={handleChange}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="under_delivery_tol">{'Min PO Tolerance(%)'}</Label>
                                                    <Input
                                                        type="number"
                                                        id="under_delivery_tol"
                                                        placeholder="Enter Value"
                                                        value={formValues.under_delivery_tol}
                                                        onChange={handleChange}
                                                        disabled={disabledFields.under_delivery_tol}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="over_delivery_tol">{'Max PO Tolerance(%)'}</Label>
                                                    <Input
                                                        type="number"
                                                        id="over_delivery_tol"
                                                        placeholder="Enter Value"
                                                        value={formValues.over_delivery_tol}
                                                        onChange={handleChange}
                                                        disabled={disabledFields.over_delivery_tol}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col md={3}>
                                                <Button type="submit" className="btn btn-success " style={{ marginTop: "28px" }}>Submit</Button>
                                            </Col>
                                        </Row>
                                    </Form>

                                </CardBody>
                                <CardBody className="pt-0">
                                    <div className="shadow_light p-3 rounded" style={{ marginTop: "-17px" }}>

                                        <TableContainer
                                            columns={columns}
                                            data={devices}
                                            isGlobalFilter={true}
                                            isAddUserList={false}
                                            customPageSize={5}
                                            isGlobalSearch={true}
                                            className="custom-header-css"
                                            //isCustomerFilter={true}
                                            SearchPlaceholder='Search for PO Number or something...'
                                            divClass="overflow-auto"
                                            tableClass="width-150"
                                        />
                                    </div>
                                    <ToastContainer closeButton={false} limit={1} />
                                </CardBody>
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
                }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}><h5 className="text-white fs-20 m-0">Add PO</h5>
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
                        </Col>
                        <div className="text-center">
                            <button type="button" className="btn btn-success" onClick={submitPOCreation} disabled={disabled1}>{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Submitting...</> : "Submit"} </button>

                        </div>

                    </Row>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default POCreation;
