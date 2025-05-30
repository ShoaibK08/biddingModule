import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, FormGroup, ModalBody, ModalFooter, ModalHeader, Label, Input, Button, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Collapse, Spinner } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextArea from "antd/es/input/TextArea";
import LoaderNew from "../../../Components/Common/Loader_new";
import Select from "react-select";
import TableContainer from "../../../Components/Common/TableContainer";





const SAPMasterData = () => {
    const [valuesParameterPO, setValuesSetPO] = useState({});
    const [Plant_Code, setPlantCode] = useState('');
    const [UnitCode, setUnitCode] = useState([]);
    const [MaterialData, setMaterialData] = useState([]);
    const [materialType, setMaterialType] = useState([]);
    const [poData, setPOData] = useState([]);

    const [loaderPO, setloaderPO] = useState(false);
    const [loaderSubSource, setloaderSubSource] = useState(false);
    const [loaderTransporter, setloaderTransporter] = useState(false);


    const collapsePO = false;
    const collapseSubSource = true;
    const collapseTransporter = true;

    const [isCollapsePO, setIsCollapsePO] = useState(collapsePO);
    const [iconPO, setIconPO] = useState("las la-angle-down");

    const [isCollapseSubSource, setIsCollapseSubSource] = useState(collapseSubSource);
    const [iconSubSource, setIconSubSource] = useState("las la-angle-up");

    const [isCollapseTransporter, setIsCollapseTransporter] = useState(collapseTransporter);
    const [iconTransporter, setIconTransporter] = useState("las la-angle-up");


    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
        //getParameterData(plantcode);
        getUnitCode(plantcode);
        getMaterialData(plantcode);
        getMaterialType(plantcode);
    }, []);

    const POCollapse = () => {
        //getParameterData(Plant_Code)
        setIsCollapsePO(!isCollapsePO);
        setIsCollapseSubSource(false);
        setIsCollapseTransporter(false);
        setIconPO(state => {
            return state === "las la-angle-down"
                ? "las la-angle-up"
                : "las la-angle-down";
        });
    };

    const SubSourceCollapse = () => {
        //getParameterData(Plant_Code)
        setIsCollapseSubSource(!isCollapseSubSource);
        setIsCollapsePO(false);
        setIsCollapseTransporter(false);
        setIconSubSource(state => {
            return state === "las la-angle-down"
                ? "las la-angle-up"
                : "las la-angle-down";
        });
    };

    const TransporterCollapse = () => {
        //fetchTransporterData(Plant_Code)
        setIsCollapseTransporter(!isCollapseTransporter);
        setIsCollapseSubSource(false);
        setIsCollapsePO(false);
        setIconTransporter(state => {
            return state === "las la-angle-down"
                ? "las la-angle-up"
                : "las la-angle-down";
        });
    };

    useEffect(() => {
        animatePO(!collapsePO);
    }, [collapsePO]);
    const animatePO = collapsePO => {
        setIsCollapsePO(collapsePO);
        setIconPO(state => {
            return state === "las la-angle-down"
                ? "las la-angle-up"
                : "las la-angle-down";
        });
    };
    useEffect(() => {
        animateSubSource(!collapseSubSource);
    }, [collapseSubSource]);
    const animateSubSource = collapseSubSource => {
        setIsCollapseSubSource(collapseSubSource);
        setIconSubSource(state => {
            return state === "las la-angle-down"
                ? "las la-angle-up"
                : "las la-angle-down";
        });
    };
    useEffect(() => {
        animateTransporter(!collapseTransporter);
    }, [collapseTransporter]);
    const animateTransporter = collapseTransporter => {
        setIsCollapseTransporter(collapseTransporter);
        setIconTransporter(state => {
            return state === "las la-angle-down"
                ? "las la-angle-up"
                : "las la-angle-down";
        });
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            username: process.env.REACT_APP_API_USER_NAME,
            password: process.env.REACT_APP_API_PASSWORD,
        },
    };

    const getUnitCode = (plantcode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Unit?plantCode=${plantcode}`, config)
            .then(res => {
                const device = res;
                setUnitCode(device);
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
    const getMaterialType = (plantcode) => {

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/material-types?plantCode=${plantcode}`, config)
          .then(res => {
            const device = res;
            setMaterialType(device);
          });
      }

    const initialFormValues = {
        Plant: '',
        COCode: '',
        materialCode: "",
        MaterialType:""
    };

    const [formValues, setFormValues] = useState(initialFormValues);
    const [errors, setErrors] = useState({});
    const [errorsTransporter, setErrorsTransporter] = useState({});
    const [errorsSubSource, setErrorsSubSource] = useState({});

    const validatePO = () => {
        const newErrors = {};
        if (!formValues.Plant) newErrors.Plant = 'Plant Code is required';
        if (!formValues.materialCode) newErrors.materialCode = 'This Field is required';
        if (!formValues.MaterialType) newErrors.MaterialType = 'This Field is required';
        return newErrors;
    };

    const validateSubSource = () => {
        const newErrors = {};
        if (!formValues.Plant) newErrors.Plant = 'Plant Code is required';
        return newErrors;
    };

    const validateTransporter = () => {
        const newErrors = {};
        if (!formValues.Plant) newErrors.Plant = 'Plant Code is required';
        return newErrors;
    };

    const handleChange = (e) => {
        debugger;
        const { id, value } = e.target;

        let companyCode = "";
        if (id === "Plant") {
            const selectedOption = e.target.options[e.target.selectedIndex];
            companyCode = selectedOption.getAttribute("companyCode"); // Get companyCode from <option>
        }

        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: value,
            ...(id === "Plant" && { COCode: companyCode }) // Only update COCode if Plant is changed
        }));

        if (errors[id]) {
            setErrors((prevErrors) => ({ ...prevErrors, [id]: null }));
        }
        if (errorsSubSource[id]) {
            setErrorsSubSource((prevErrors) => ({ ...prevErrors, [id]: null }));
        }
        if (errorsTransporter[id]) {
            setErrorsTransporter((prevErrors) => ({ ...prevErrors, [id]: null }));
        }
    };


    const handleSubmitPO = async (event) => {
        debugger;
        event.preventDefault();
        const validationErrors = validatePO();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            const data = {
                "COCode": formValues.COCode,
                "Plant": formValues.Plant,
                "MaterialType": "HRAW",
                "record": {
                    "Materialcode": formValues.materialCode
                }
            }

            setloaderPO(true);
            try {
                const res = await axios.post(`http://localhost:8081/purchase-order/fetchPurchaseOrder`, data, config)
                    .then(res => {
                        const data = res;
                        toast.success(data, { autoClose: 3000 });
                        setloaderPO(false);
                    });
            }
            catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloaderPO(false);
            }
        }
    };

    const handleSubmitSubSource = async (event) => {
        debugger;
        event.preventDefault();
        const validationErrors = validateSubSource();
        if (Object.keys(validationErrors).length > 0) {
            setErrorsSubSource(validationErrors);
        } else {
            setErrorsSubSource({});
            const data = {
                "Plant": formValues.Plant
            }

            setloaderSubSource(true);
            try {
                const res = await axios.post(`http://localhost:8081/sourceSubSource/fetchSourceData`, data, config)
                    .then(res => {
                        const data = res;
                        toast.success(data, { autoClose: 3000 });
                        setloaderSubSource(false);
                    });
            }
            catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloaderSubSource(false);
            }
        }

    };

    const handleSubmitTransporter = async (event) => {
        debugger;
        event.preventDefault();


        const validationErrors = validateTransporter();
        if (Object.keys(validationErrors).length > 0) {
            setErrorsTransporter(validationErrors);
        } else {
            setErrorsTransporter({});
            const data = {
                "Company_Code": formValues.COCode
            }

            setloaderTransporter(true);
            try {
                const res = await axios.post(`http://192.168.1.17:8081/transporter/fetchTransporter`, data, config)
                    .then(res => {
                        const data = res;
                        toast.success(data, { autoClose: 3000 });
                        setloaderTransporter(false);
                    });
            }
            catch (e) {
                toast.error(e, { autoClose: 3000 });
                setloaderTransporter(false);
            }
        }

    };

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
                Header: "Sr No.",
                accessor: "",
                filterable: false,
            },
            {
                Header: "Plant Code",
                accessor: "",
                filterable: false,
            },
            {
                Header: "SAP Req",
                accessor: "",
                filterable: false,
            },
            {
                Header: "Response Status",
                accessor: "",
                filterable: false,
            },
            {
                Header: "Time",
                accessor: "",
                filterable: false,
            },
        ],
    );

    // document.title = HeaderName + " || EPLMS";
    document.title = "IB SAP Master Data | EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={'IB SAP Master Data'} pageTitle="Master" />
                    <Row>
                        <Col xxl={12}>
                            <div className="">
                                <h6 className="text-muted text-color-blue bg-primary text-uppercase fw-semibold" onClick={() => POCollapse()} style={{cursor:"pointer"}}>
                                    <span class="margin-left">{"SAP PO DATA"}</span> <i style={{ float: "right" }} className={iconPO} />
                                </h6>
                                <Collapse className="" isOpen={isCollapsePO}>
                                    <Card id="company-overview">
                                        <Form onSubmit={handleSubmitPO}>
                                            <Row className="p-3 g-3 pt-1 mt-2 mb-3">
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <Label for="Plant">Plant/Unit Code</Label><span className="text-danger">*</span>
                                                        <Input
                                                            type="select"
                                                            id="Plant"
                                                            value={formValues.Plant}
                                                            onChange={handleChange}
                                                            invalid={!!errors.Plant}
                                                        >
                                                            <option value="" defaultValue>Select Unit Code</option>
                                                            {UnitCode.map((item, key) => (<option value={item.unitCode} companyCode={item.companyCode} key={key}>{item.unit} / {item.unitCode}</option>))}
                                                        </Input>
                                                        {errors.Plant && <FormFeedback>{errors.Plant}</FormFeedback>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <Label for="COCode">Company Code</Label>
                                                        <Input
                                                            type="text"
                                                            id="COCode"
                                                            placeholder="Company Code"
                                                            value={formValues.COCode}
                                                            onChange={handleChange}
                                                            disabled
                                                        />
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
                                                        <Label for="MaterialType">Material Type</Label><span className="text-danger">*</span>
                                                        <Input
                                                            type="select"
                                                            id="MaterialType"
                                                            value={formValues.MaterialType}
                                                            onChange={handleChange}
                                                            invalid={!!errors.MaterialType}
                                                        >
                                                            <option value="" defaultValue>Select Material Type</option>
                                                            {materialType.map((item, key) => (<option value={item.code} key={key}>{item.code}</option>))}
                                                        </Input>
                                                        {errors.MaterialType && <FormFeedback>{errors.MaterialType}</FormFeedback>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={12}>
                                                    <Button type="submit" className="btn btn-success " style={{ marginTop: "-10px", float:"inline-end" }} disabled={loaderPO}>
                                                        {loaderPO ? <><Spinner size="sm" className='me-2 visible'></Spinner>Loading...</> : "Submit"}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                        <div className="p-3 border rounded" style={{ margin: "-10px 15px 20px 15px" }}>

                                            <TableContainer
                                                columns={columns}
                                                data={poData}
                                                isGlobalFilter={true}
                                                isAddUserList={false}
                                                customPageSize={5}
                                                isGlobalSearch={true}
                                                className="custom-header-css"
                                                SearchPlaceholder='Search...'
                                                tableClass="res_table"
                                            />
                                        </div>
                                    </Card>
                                </Collapse>
                            </div>
                            <div className="">
                                <h6 className="text-muted text-color-blue bg-primary text-uppercase fw-semibold" onClick={() => SubSourceCollapse()} style={{cursor:"pointer"}}>
                                    <span class="margin-left">{"SAP Sub Source"}</span> <i style={{ float: "right" }} className={iconSubSource} />
                                </h6>
                                <Collapse className="" isOpen={isCollapseSubSource}>
                                    <Card id="company-overview">
                                        <Form className="tablelist-form" name="Doc_form" onSubmit={handleSubmitSubSource}>
                                            <Row className="p-3 g-3 pt-1 mt-2 mb-3">
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <Label for="Plant">Plant/Unit Code</Label><span className="text-danger">*</span>
                                                        <Input
                                                            type="select"
                                                            id="Plant"
                                                            value={formValues.Plant}
                                                            onChange={handleChange}
                                                            invalid={!!errorsSubSource.Plant}
                                                        >
                                                            <option value="" defaultValue>Select Unit Code</option>
                                                            {UnitCode.map((item, key) => (<option value={item.unitCode} companyCode={item.companyCode} key={key}>{item.unit} / {item.unitCode}</option>))}
                                                        </Input>
                                                        {errorsSubSource.Plant && <FormFeedback>{errorsSubSource.Plant}</FormFeedback>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <Label for="COCode">Company Code</Label>
                                                        <Input
                                                            type="text"
                                                            id="COCode"
                                                            placeholder="Company Code"
                                                            value={formValues.COCode}
                                                            onChange={handleChange}
                                                            disabled
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <Button type="submit" className="btn btn-success " style={{ marginTop: "28px" }} disabled={loaderSubSource}>
                                                        {loaderSubSource ? <><Spinner size="sm" className='me-2 visible'></Spinner>Loading...</> : "Submit"}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                        <div className="p-3 border rounded" style={{ margin: "-10px 15px 20px 15px" }}>

                                            <TableContainer
                                                columns={columns}
                                                data={poData}
                                                isGlobalFilter={true}
                                                isAddUserList={false}
                                                customPageSize={5}
                                                isGlobalSearch={true}
                                                className="custom-header-css"
                                                SearchPlaceholder='Search...'
                                                tableClass="res_table"
                                            />
                                        </div>
                                    </Card>
                                </Collapse>
                            </div>
                            <div className="">
                                <h6 className="text-muted text-color-blue bg-primary text-uppercase fw-semibold" onClick={() => TransporterCollapse()} style={{cursor:"pointer"}}>
                                    <span class="margin-left">{"SAP Transporter"}</span> <i style={{ float: "right" }} className={iconTransporter} />
                                </h6>
                                <Collapse className="" isOpen={isCollapseTransporter}>
                                    <Card id="company-overview">
                                        <Form className="tablelist-form" name="Doc_form" onSubmit={handleSubmitTransporter}>
                                            <Row className="p-3 g-3 pt-1 mt-2 mb-3">
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <Label for="Plant">Plant/Unit Code</Label><span className="text-danger">*</span>
                                                        <Input
                                                            type="select"
                                                            id="Plant"
                                                            value={formValues.Plant}
                                                            onChange={handleChange}
                                                            invalid={!!errorsTransporter.Plant}
                                                        >
                                                            <option value="" defaultValue>Select Unit Code</option>
                                                            {UnitCode.map((item, key) => (<option value={item.unitCode} companyCode={item.companyCode} key={key}>{item.unit} / {item.unitCode}</option>))}
                                                        </Input>
                                                        {errorsTransporter.Plant && <FormFeedback>{errorsTransporter.Plant}</FormFeedback>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <Label for="COCode">Company Code</Label>
                                                        <Input
                                                            type="text"
                                                            id="COCode"
                                                            placeholder="Company Code"
                                                            value={formValues.COCode}
                                                            onChange={handleChange}
                                                            disabled
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <Button type="submit" className="btn btn-success " style={{ marginTop: "28px" }} disabled={loaderTransporter}>
                                                        {loaderTransporter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Loading...</> : "Submit"}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                        <div className="p-3 border rounded" style={{ margin: "-10px 15px 20px 15px" }}>

                                            <TableContainer
                                                columns={columns}
                                                data={poData}
                                                isGlobalFilter={true}
                                                isAddUserList={false}
                                                customPageSize={5}
                                                isGlobalSearch={true}
                                                className="custom-header-css"
                                                SearchPlaceholder='Search...'
                                                tableClass="res_table"
                                            />
                                        </div>
                                    </Card>
                                </Collapse>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <ToastContainer closeButton={false} limit={1} />
            </div>




        </React.Fragment>
    );
};

export default SAPMasterData;
