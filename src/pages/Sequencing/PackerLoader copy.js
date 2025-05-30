import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

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

const initialValues = {
    id: "",
    code: "",
    name: "",
    locationCode: "",
    plantCode: "",
    tripId: "",
    type: "",
    vehicleQueue: "",
    queueSize: "",
    currentQueueCount: "",
    isAuto: "",
    status: "A",
};


const PackerLoader = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [packerLoader, setPackerLoader] = useState([]);
    const [PlantCode, setPlantCode] = useState([]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [CurrentID, setClickedRowId] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [LoaderActive, setLoaderActive] = useState(false);
    const [UnloadingActive, setUnloadingActive] = useState(false);
    const [currentQueCount, setCurrentQueCount] = useState('');
    const [currentQueSize, setCurrentQueSize] = useState('');
    const [PlantStage, setPlantStage] = useState([]);
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
        //getPlantCode();
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
        getAllPackerLoader(plantcode);
        getPlantStageLocation(plantcode);

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

    const getAllPackerLoader = (plantcode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/getAllPackerLoader?plantCode=${plantcode}`, config)
            .then(res => {
                const data = res;
                setPackerLoader(data);
            });
    }

    // const getPlantCode = () => {
    //     axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/plants`, config)
    //         .then(res => {
    //             const result = res;
    //             setPlantCode(result);
    //         });
    // }

    const getPlantStageLocation = (plantcode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/plant-stage-locations/getLocationPlantWise/${plantcode}`, config)
            .then(res => {
                const result = res;
                setPlantStage(result);
            });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "type" && value === "L" || value === "UL") {
            setLoaderActive(true);
        }
        else if (name === "type" && value === "P") {
            setLoaderActive(false);
        }
        if (isEdit) {
            if (name === "queueSize") {
                setCurrentQueSize(value);
            }
            setValues({
                ...values,
                [name]: value || value.valueAsNumber,
                ["id"]: CurrentID,
                ["plantCode"]: PlantCode,
            });
        }
        else {
            setValues({
                ...values,
                [name]: value || value.valueAsNumber,
                ["status"]: "A",
                ["tripId"]: "",
                ["vehicleQueue"]: null,
                ["plantCode"]: PlantCode,
            });
        }
    };

    const handleSubmit = async (e) => {

        console.log(values)
        e.preventDefault();
        try {
            if (isEdit) {
                var que_sz = "";
                if (currentQueSize === "") {
                    que_sz = values.queueSize;
                } else {
                    que_sz = currentQueSize;
                }
                if (que_sz < currentQueCount) {
                    toast.error("Queue Size can't be less than Current Queue Count.", { autoClose: 3000 });
                } else {
                    const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/createPackerLoader`, values, config)
                    console.log(res);
                    if(res.errorMsg){
                        toast.error(res.errorMsg, { autoClose: 3000 });
                    }else{
                        toast.success("Data Updated Successfully", { autoClose: 3000 });
                        getAllPackerLoader(PlantCode);
                    }
                    
                }

            }
            else {
                const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/createPackerLoader`, values, config)
                console.log(res);
                if (!res.errorMsg) {
                    toast.success("Data Added Successfully.", { autoClose: 3000 });
                }
                else {
                    toast.error("Data Already Exist.", { autoClose: 3000 });
                }
                getAllPackerLoader(PlantCode);
            }
        }
        catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
        }
        toggle();
    }


    // Add Data
    const handleCustomerClicks = () => {
        setIsEdit(false);
        toggle();
    };
    // Update Data
    const handleCustomerClick = useCallback((arg) => {


        setClickedRowId(arg);
        setIsEdit(true);
        toggle();
        const id = arg;
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/getById/${id}`, config)
            .then(res => {
                const result = res;
                setValues({
                    ...values,
                    "code": result.code,
                    "name": result.name,
                    "locationCode": result.locationCode,
                    "plantCode": result.plantCode,
                    "tripId": result.tripId,
                    "type": result.type,
                    "vehicleQueue": result.vehicleQueue,
                    "queueSize": result.queueSize,
                    "currentQueueCount": result.currentQueueCount,
                    "isAuto": result.isAuto,
                    "status": result.status,
                    "id": id
                });
                setCurrentQueCount(result.currentQueueCount);
                if (result.type === "L" || result.type === "UL") {
                    setLoaderActive(true);
                }
                else if (result.type === "P") {
                    setLoaderActive(false);
                }
            })

    }, [toggle]);

    // Delete Data
    const onClickDelete = (id) => {
        setClickedRowId(id);
        setDeleteModal(true);
    };

    const handleDeleteCustomer = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/deletePackerLoader/${CurrentID}`, config)
            console.log(res.data);
            getAllPackerLoader(PlantCode);
            toast.success("Data Deleted Successfully", { autoClose: 3000 });
            setDeleteModal(false);
        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
            setDeleteModal(false);
        }
    };


    const status = [
        {
            options: [
                { label: "Select Status", value: "" },
                { label: "Active", value: "A" },
                { label: "Deactive", value: "D" },
            ],
        },
    ];

    const type = [
        {
            options: [
                { label: "Select Type", value: "" },
                { label: "Loader", value: "L" },
                { label: "Packer", value: "P" },
                //{ label: "Unloading", value: "UL" },
            ],
        },
    ];

    const isAuto = [
        {
            options: [
                { label: "Select isAuto", value: "" },
                { label: "Automatic", value: "1" },
                { label: "Manual", value: "0" },
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
                Header: "Code",
                accessor: "code",
                filterable: false,
            },
            {
                Header: "Name",
                accessor: "name",
                filterable: false,
            },
            {
                Header: "Location Code",
                accessor: "locationCode",
                filterable: false,
            },
            {
                Header: "Plant Code",
                Cell: (cellProps) => {
                    return (
                        <p>{PlantCode}</p>
                    );
                },
            },
            {
                Header: "Type",
                accessor: "type",
                Cell: (cell) => {
                    switch (cell.value) {
                        case "L":
                            return <span className="badge text-uppercase badge-soft-warning"> Loader </span>;
                        case "P":
                            return <span className="badge text-uppercase badge-soft-primary"> Packer </span>;
                        case "UL":
                            return <span className="badge text-uppercase badge-soft-success"> Unloading </span>;
                    }
                },
                filterable: false,
            },
            {
                Header: "Queue Size",
                accessor: "queueSize",
                filterable: false,
            },
            {
                Header: "Current Queue Count",
                accessor: "currentQueueCount",
                filterable: false,
            },
            {
                Header: "isAuto",
                accessor: "isAuto",
                Cell: (cell) => {
                    switch (cell.value) {
                        case 1:
                            return <span className="badge text-uppercase badge-soft-success"> Automatic </span>;
                        case 0:
                            return <span className="badge text-uppercase badge-soft-warning"> Manual </span>;
                    }
                },
                filterable: false,
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: (cell) => {
                    switch (cell.value) {
                        case "A":
                            return <span className="badge text-uppercase badge-soft-success"> Active </span>;
                        case "D":
                            return <span className="badge text-uppercase badge-soft-danger"> Deactive </span>;
                    }
                }
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
                                    onClick={() => { const id = cellProps.row.original.id; handleCustomerClick(id); }}
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

    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    document.title = "Packer Loader | EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={""}
                />
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteCustomer}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <Container fluid>
                    <BreadCrumb title={latestHeader} pageTitle="Master" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Packer Loader Details</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>

                                                <button
                                                    type="button"
                                                    className="btn btn-success add-btn"
                                                    id="create-btn"
                                                    onClick={() => { setIsEdit(false); toggle(); setValues(initialValues); }}
                                                >
                                                    <i className="ri-add-line align-bottom me-1"></i> Add Packer Loader
                                                </button>{" "}

                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0">
                                    <div>
                                        {packerLoader && packerLoader.length ? (
                                            <TableContainer
                                                columns={columns}
                                                data={packerLoader}
                                                isGlobalFilter={true}
                                                isAddUserList={false}
                                                customPageSize={5}
                                                isGlobalSearch={true}
                                                className="custom-header-css"
                                                handleCustomerClick={handleCustomerClicks}
                                                //isCustomerFilter={true}
                                                SearchPlaceholder='Search for Code, Name or something...'
                                            />) : (<Loader />)
                                        }
                                    </div>


                                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                                            {!!isEdit ? "Edit Packer Loader" : "Add Packer Loader"}
                                        </ModalHeader>
                                        <Form className="tablelist-form" onSubmit={handleSubmit}>
                                            <ModalBody>
                                                <Row className="g-3">
                                                    <Col lg={4}>
                                                        <div>
                                                            <Label className="form-label" >Type</Label>
                                                            <Input
                                                                name="type"
                                                                type="select"
                                                                className="form-select"
                                                                value={values.type}
                                                                onChange={handleInputChange}
                                                                required
                                                                disabled={isEdit ? true : false}
                                                            >
                                                                {type.map((item, key) => (
                                                                    <React.Fragment key={key}>
                                                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                    </React.Fragment>
                                                                ))}
                                                            </Input>
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault01" className="form-label">Code</Label>
                                                        <Input type="text" required className="form-control"
                                                            name="code"
                                                            id="validationDefault01"
                                                            placeholder="Enter Code"
                                                            value={values.code}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault03" className="form-label">Name</Label>
                                                        <Input type="text" required className="form-control"
                                                            id="validationDefault03"
                                                            name="name"
                                                            placeholder="Enter Name"
                                                            value={values.name}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault03" className="form-label">Location Code</Label>
                                                        {/* <Input type="text" required className="form-control"
                                                            id="validationDefault03"
                                                            name="locationCode"
                                                            placeholder="Enter location Code"
                                                            value={values.locationCode}
                                                            onChange={handleInputChange}
                                                        /> */}
                                                        <Input
                                                            name="locationCode"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.locationCode}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <option value={""}>{"Select Location"}</option>
                                                            {PlantStage.map((item, key) => (
                                                                <option value={item.locationName} key={key}>{item.locationName}</option>)
                                                            )}
                                                        </Input>
                                                    </Col>
                                                    {/* <Col lg={4}>
                                                        <div>
                                                            <Label className="form-label" >Plant Code</Label>
                                                            <Input
                                                                name="plantCode"
                                                                type="select"
                                                                className="form-select"
                                                                value={values.plantCode}
                                                                onChange={handleInputChange}
                                                                disabled={isEdit ? true : false}
                                                                required
                                                            >
                                                                <option value={""}>{"Select Plant Code"}</option>
                                                                {PlantCode.map((item, key) => (
                                                                    <option value={item.plantCode} key={key}>{item.plantName}</option>)
                                                                )}
                                                            </Input>
                                                        </div>
                                                    </Col> */}

                                                    {LoaderActive &&
                                                        <Col md={4}>
                                                            <Label htmlFor="validationDefault04" className="form-label">Queue Size</Label>
                                                            <Input type="number" required className="form-control"
                                                                id="validationDefault04"
                                                                name="queueSize"
                                                                placeholder="Enter Queue Size"
                                                                value={values.queueSize}
                                                                onChange={handleInputChange}
                                                            />
                                                        </Col>
                                                    }
                                                    <Col lg={4}>
                                                        <div>
                                                            <Label className="form-label" >isAuto</Label>
                                                            <Input
                                                                name="isAuto"
                                                                type="select"
                                                                className="form-select"
                                                                value={values.isAuto}
                                                                onChange={handleInputChange}
                                                                required
                                                            >
                                                                {isAuto.map((item, key) => (
                                                                    <React.Fragment key={key}>
                                                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                    </React.Fragment>
                                                                ))}
                                                            </Input>
                                                        </div>
                                                    </Col>
                                                    {isEdit &&
                                                        <Col lg={4}>
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
                                                    }
                                                    <Col md={isEdit ? 4 : 8} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                                                        <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                                                        <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Packer Loader"} </button>
                                                    </Col>

                                                </Row>

                                            </ModalBody>
                                            <ModalFooter>
                                            </ModalFooter>
                                        </Form>
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

export default PackerLoader;
