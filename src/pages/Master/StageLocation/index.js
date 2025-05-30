import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../MasterMaterial/MasterMaterial.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderNew from "../../../Components/Common/Loader_new";


const initialValues = {
    plantCode: "",
    materialCode: "",
    movementCode: "",
    isSkip: "",
    status: "",
    port: "",
    weight: "",
    tripid: "",
    remarks: "",
    category: "",
    capacity: "",
    isAuto: "",
    isWorking: "",
    currentCount: "",
    totalCount: "",
    group: "",
    displayName: "",
    sequenceNumber: "",
    stageCode: "",
    twCheck: "",
    locationName: ""
};


const StageLocation = () => {
    const [data, setData] = useState([]);
    const [stagedata, setStageData] = useState([]);
    const [plantdata, setPlantData] = useState([]);
    const [values, setValues] = useState(initialValues);
    const [Plant_Code, setPlantCode] = useState('');
    const [modal, setModal] = useState(false);
    const [comapny_code, setCompanyCode] = useState('');
    const [latestHeader, setLatestHeader] = useState('');
    const [twCheckFlag, settwCheckFlag] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loader, setloader] = useState(false);
    const [loadingParameter, setErrorParameter] = useState(false);
    const [loadingParameter1, setErrorParameter1] = useState(false);

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
        sessionStorage.getItem("main_menu_login");
        const obj1 = JSON.parse(sessionStorage.getItem("main_menu_login"));
        let companyCode = obj1.companyCode;
        setCompanyCode(companyCode);
        getAllData(plantcode);
        getStageData();
        getPlantData(plantcode);
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

    const getAllData = (plantcode) => {
        setloader(true);
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/plant-stage-locations?plantCode=${plantcode}`, config)
            .then(res => {
                const result = res;
                setData(result);
                setloader(false);
            });
    }
    const getStageData = () => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/stages`, config)
            .then(res => {
                const result = res;
                setStageData(result);
            });
    }
    const getPlantData = (plantcode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/plants?plantCode=${plantcode}`, config)
            .then(res => {
                const result = res;
                setPlantData(result);
            });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Prepare the updated values object
        const updatedValues = {
            ...values,
            [name]: value,
        };

        // Handle plantCode and stageCode logic for displayName
        if (name === 'plantCode' || name === 'stageCode') {
            const plantName = plantdata.find(item => item.plantCode === (name === 'plantCode' ? value : values.plantCode))?.plantName || '';
            const stageName = stagedata.find(item => item.code === (name === 'stageCode' ? value : values.stageCode))?.name || '';
            updatedValues.displayName = `${plantName} - ${stageName}`;
        }

        // Handle TW-specific logic for stageCode
        if (name === 'stageCode') {
            if (value === 'TW') {
                settwCheckFlag(true);
            } else {
                settwCheckFlag(false);
                updatedValues.twCheck = ""; // Reset twCheck to an empty string
            }
        }

        // Update the state
        setValues(updatedValues);
    };



    const handleSubmit = async (e) => {
        debugger;
        console.log(values);
        e.preventDefault();
        try {
            if (isEdit) {
                setErrorParameter1(true);
                const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/plant-stage-locations/${CurrentID}`, values, config)
                console.log(res);
                toast.success("Data Updated Successfully", { autoClose: 3000 });
                getAllData(Plant_Code);
                setErrorParameter1(false);
                toggle();
            }
            else {
                setErrorParameter(true);
                const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/plant-stage-locations`, values, config)
                console.log(res);
                if (!res.errorMsg) {
                    toast.success("Mapped Successfully.", { autoClose: 3000 });
                    setErrorParameter(false);
                }
                else {
                    toast.error("Data Already Exist.", { autoClose: 3000 });
                }
                getAllData(Plant_Code);
                document.forms["form_id"].reset();
            }
        }
        catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
            setErrorParameter(false);
            setErrorParameter1(false);
        }
    };

    const handleCustomerClick = useCallback((arg) => {
        setIsEdit(true);
        toggle();
        setloader(true);
        const id = arg.id;
        setClickedRowId(id);
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/plant-stage-locations/${id}`, config)
            .then(res => {
                const result = res;
                setloader(false);
                if (result.stageCode === "TW") {
                    settwCheckFlag(true);
                }
                else {
                    settwCheckFlag(false);
                }
                setValues({
                    ...values,
                    "plantCode": result.plantCode,
                    "materialCode": "",
                    "movementCode": "",
                    "isSkip": "",
                    "status": "",
                    "port": "",
                    "weight": "",
                    "tripid": "",
                    "remarks": "",
                    "category": "",
                    "capacity": "",
                    "isAuto": "",
                    "isWorking": "",
                    "currentCount": "",
                    "totalCount": "",
                    "group": "",
                    "displayName": result.displayName,
                    "sequenceNumber": result.sequenceNumber,
                    "stageCode": result.stageCode,
                    "twCheck": result.twCheck,
                    "locationName": result.locationName
                });
            })
    }, [toggle]);

    const twCheckOption = [
        {
            options: [
                { label: "Select", value: "" },
                { label: "Yes", value: "Y" },
                { label: "No", value: "N" },
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
                Header: "Plant Name",
                accessor: "plantCode",
                filterable: false,
            },
            {
                Header: "Stage Name",
                accessor: "stageCode",
                filterable: false,
            },
            {
                Header: "TW Check",
                accessor: "twCheck",
                filterable: false,
                Cell: (cell) => {
                    switch (cell.value) {
                        case "Y":
                            return <span className="badge text-uppercase badge-soft-success"> Yes </span>;
                        case "N":
                            return <span className="badge text-uppercase badge-soft-danger"> No </span>;
                        default:
                            return <span className="badge text-uppercase badge-soft-danger"> No </span>;
                    }
                }
            },
            {
                Header: "Location Name",
                accessor: "locationName",
                filterable: false,
            },
            {
                Header: "Display Name",
                accessor: "displayName",
                filterable: false,
            },
            {
                Header: "Movement",
                accessor: "movementCode",
                filterable: false,
            },
            {
                Header: "Sequence No.",
                accessor: "sequenceNumber",
                filterable: false,
            },
            {
                Header: "Action",
                Cell: (cellProps) => {
                    return (
                        <ul className="list-inline hstack gap-2 mb-0">
                            <li className="list-inline-item edit" title="Edit">
                                <Link
                                    to="#"
                                    className="text-primary d-inline-block edit-item-btn"
                                    onClick={() => { const data = cellProps.row.original; handleCustomerClick(data); }}
                                >

                                    <i className="ri-pencil-fill fs-16"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item" title="Remove">
                                <Link
                                    to="#"
                                    className="text-danger d-inline-block remove-item-btn"
                                    onClick={() => { const id = cellProps.row.original.id; onClickDelete(id); }}>
                                    <i className="ri-delete-bin-5-fill fs-16"></i>
                                </Link>
                            </li>
                        </ul>
                    );
                },
            },
        ],
    );

    const [CurrentID, setClickedRowId] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);

    // Delete Data
    const onClickDelete = (id) => {
        setClickedRowId(id);
        setDeleteModal(true);
    };

    const handleDeleteCustomer = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/plant-stage-locations/${CurrentID}`, config)
            console.log(res.data);
            getAllData(Plant_Code);
            toast.success("Data Deleted Successfully", { autoClose: 3000 });
            setDeleteModal(false);
        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
            setDeleteModal(false);
        }
    };




    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    document.title = "Plant Stage Location | EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={[]}
                />
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteCustomer}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <Container fluid>
                    <BreadCrumb title={'Plant Stage Location'} pageTitle="Master" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border border-dashed border-end-0 border-top-0 border-start-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Plant Stage Location Mapping</h5>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <Row className="g-4 align-items-center" style={{ padding: "20px" }}>
                                    <Form className="tablelist-form" name="form_data" id="form_id" onSubmit={handleSubmit}>
                                        <Row className="g-3">
                                            <Col lg={3}>
                                                <div>
                                                    <Label className="form-label" >Plant Name</Label><span style={{ color: "red" }}>*</span>
                                                    <Input
                                                        name="plantCode"
                                                        type="select"
                                                        className="form-select"
                                                        value={values.plantCode}
                                                        onChange={handleInputChange}
                                                        required
                                                    >
                                                        <option value=""> -- Select Plant -- </option>
                                                        {plantdata.map((item, key) => (
                                                            <option value={item.plantCode} key={key}>{item.plantName}</option>
                                                        ))}
                                                    </Input>
                                                </div>
                                            </Col>
                                            <Col lg={3}>
                                                <div>
                                                    <Label className="form-label" >Stage Name</Label><span style={{ color: "red" }}>*</span>
                                                    <Input
                                                        name="stageCode"
                                                        type="select"
                                                        maxlength="15"
                                                        className="form-select"
                                                        value={values.stageCode}
                                                        onChange={handleInputChange}
                                                        required
                                                    >
                                                        <option value=""> -- Select Stage -- </option>
                                                        {stagedata.map((item, key) => (
                                                            <option value={item.code} key={key}>{item.name}</option>
                                                        ))}
                                                    </Input>
                                                </div>
                                            </Col>
                                            {twCheckFlag ? (
                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Tare Weight Check</Label><span style={{ color: "red" }}>*</span>
                                                        <Input
                                                            name="twCheck"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.twCheck}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            {twCheckOption.map((item, key) => (
                                                                <React.Fragment key={key}>
                                                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                </React.Fragment>
                                                            ))}
                                                        </Input>
                                                    </div>
                                                </Col>
                                            ) : (
                                                null
                                            )}

                                            <Col lg={3}>
                                                <div>
                                                    <Label className="form-label" >Location Name</Label><span style={{ color: "red" }}>*</span>
                                                    <Input type="text" required className="form-control"
                                                        name="locationName"
                                                        maxlength="15"
                                                        placeholder="Location Name"
                                                        value={values.locationName}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </Col>
                                            <Col lg={3}>
                                                <div>
                                                    <Label className="form-label" >Sequence No.</Label><span style={{ color: "red" }}>*</span>
                                                    <Input type="number" required className="form-control"
                                                        name="sequenceNumber"
                                                        maxlength="3"
                                                        placeholder="Sequence No."
                                                        value={values.sequenceNumber}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </Col>
                                            <Col lg={3}>
                                                <Label htmlFor="validationDefault01" className="form-label">Display Name</Label>
                                                <Input type="text" required readonly disabled className="form-control"
                                                    name="displayName"
                                                    placeholder="Dispaly Name"
                                                    value={values.displayName}
                                                // onChange={handleInputChange}
                                                />
                                            </Col>
                                            <Col lg={3}>
                                                <button
                                                    type="submit"
                                                    className="btn btn-success justify-content-start"
                                                    style={{ float: "left", marginTop: "28px" }}
                                                    onClick={() => setIsEdit(false)}
                                                >
                                                    <i className="ri-stack-line align-bottom me-1"></i>
                                                    {loadingParameter ? (
                                                        <>
                                                            <Spinner size="sm" className="me-2 visible" />Loading...
                                                        </>
                                                    ) : (
                                                        <>Submit</>
                                                    )}
                                                </button>
                                            </Col>


                                        </Row>

                                    </Form>
                                </Row>
                                <div className="card-body pt-0">
                                    <div>
                                        {loader && <LoaderNew></LoaderNew>}
                                        <TableContainer
                                            columns={columns}
                                            data={data}
                                            isGlobalFilter={true}
                                            isAddUserList={false}
                                            customPageSize={5}
                                            isGlobalSearch={true}
                                            className="custom-header-css"
                                            SearchPlaceholder='Search for Stage Location or something...'
                                        />
                                    </div>
                                    <ToastContainer closeButton={false} limit={1} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                <ModalHeader className="bg-light p-3" toggle={toggle}>Edit Details </ModalHeader>
                <Form className="tablelist-form" onSubmit={handleSubmit}>
                    <ModalBody>
                        <Row className="g-3">
                            <Col lg={4}>
                                <div>
                                    <Label className="form-label" >Plant Name</Label>
                                    <Input
                                        name="plantCode"
                                        type="select"
                                        id="Plant_Name"
                                        className="form-select"
                                        value={values.plantCode}
                                        onChange={handleInputChange}
                                        required
                                        disabled
                                    >
                                        <option value=""> -- Select Plant -- </option>
                                        {plantdata.map((item, key) => (
                                            <option value={item.plantCode} key={key}>{item.plantName}</option>
                                        ))}
                                    </Input>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div>
                                    <Label className="form-label" >Stage Name</Label>
                                    <Input
                                        name="stageCode"
                                        type="select"
                                        id="Stage_Name"
                                        maxlength="15"
                                        className="form-select"
                                        value={values.stageCode}
                                        onChange={handleInputChange}
                                        required
                                        disabled
                                    >
                                        <option value=""> -- Select Stage -- </option>
                                        {stagedata.map((item, key) => (
                                            <option value={item.code} key={key}>{item.name}</option>
                                        ))}
                                    </Input>
                                </div>
                            </Col>
                            {twCheckFlag ? (
                                <Col lg={4}>
                                    <div>
                                        <Label className="form-label" >Tare Weight Check</Label>
                                        <Input
                                            name="twCheck"
                                            type="select"
                                            className="form-select"
                                            value={values.twCheck}
                                            onChange={handleInputChange}
                                            required
                                            disabled
                                        >
                                            {twCheckOption.map((item, key) => (
                                                <React.Fragment key={key}>
                                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                </React.Fragment>
                                            ))}
                                        </Input>
                                    </div>
                                </Col>
                            ) : (
                                null
                            )}

                            <Col lg={4}>
                                <div>
                                    <Label className="form-label" >Location Name</Label>
                                    <Input type="text" required className="form-control"
                                        name="locationName"
                                        id="Location_Name"
                                        maxlength="15"
                                        placeholder="Location Name"
                                        value={values.locationName}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div>
                                    <Label className="form-label" >Sequence No.</Label>
                                    <Input type="number" required className="form-control"
                                        name="sequenceNumber"
                                        maxlength="3"
                                        placeholder="Sequence No."
                                        value={values.sequenceNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </Col>
                            {/* <Col lg={4}>
                                <Label htmlFor="validationDefault01" className="form-label">Display Name</Label>
                                <Input type="text" required readonly disabled className="form-control"
                                    name="displayName"
                                    id="display_Name"
                                    placeholder="Dispaly Name"
                                    value={values.displayName}
                                />
                            </Col> */}

                            <Col lg={4} className="hstack gap-2 justify-content-start" style={{ marginTop: "44px" }}>
                                <button type="submit" className="btn btn-success">{loadingParameter1 ? (
                                    <>
                                        <Spinner size="sm" className="me-2 visible" />Loading...
                                    </>
                                ) : (
                                    <>
                                        {'Update'}
                                    </>
                                )}</button>
                            </Col>

                        </Row>

                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </Form>
            </Modal>

        </React.Fragment>
    );
};

export default StageLocation;
