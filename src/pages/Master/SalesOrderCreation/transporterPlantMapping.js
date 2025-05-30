import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Select from "react-select";

const initialValues = {
    transporter: "",
    plant: "",
    status: "A",
};

const TransporterPlantMapping = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [mappings, setMappings] = useState([
        { id: 1, transporter: "Balaji Logistics", plant: "Sindri,Nalagarh", status: "A" },
        { id: 2, transporter: "Sheevam Transport", plant: "Panvel,Tikariya", status: "D" },
        { id: 3, transporter: "Global Movers", plant: "Tikariya", status: "A" },
        { id: 4, transporter: "Fast Freight", plant: "Nalagarh", status: "D" },
        { id: 5, transporter: "Swift Trans", plant: "Rajkot", status: "A" },
    ]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [currentID, setCurrentID] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [latestHeader, setLatestHeader] = useState('');

    const toggle = useCallback(() => {
        setModal(!modal);
    }, [modal]);

    useEffect(() => {
        const headerName = localStorage.getItem("HeaderName");
        setLatestHeader(headerName);
        getAllMappings();
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

    const getAllMappings = () => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/transporter-plant-mappings`, config)
            .then(res => {
                setMappings(res.data);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/transporter-plant-mappings/${currentID}`, values, config);
                toast.success("Mapping Updated Successfully", { autoClose: 3000 });
            } else {
                await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/transporter-plant-mappings`, values, config);
                toast.success("Mapping Added Successfully", { autoClose: 3000 });
            }
            getAllMappings();
            toggle();
        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
        }
    };

    const handleAddClick = () => {
        setIsEdit(false);
        setValues(initialValues);
        toggle();
    };

    const handleEditClick = useCallback((id) => {
        setCurrentID(id);
        setIsEdit(true);
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/transporter-plant-mappings/${id}`, config)
            .then(res => {
                setValues(res.data);
                toggle();
            });
    }, [toggle]);

    const handleDeleteClick = (id) => {
        setCurrentID(id);
        setDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/transporter-plant-mappings/${currentID}`, config);
            toast.success("Mapping Deleted Successfully", { autoClose: 3000 });
            getAllMappings();
            setDeleteModal(false);
        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
            setDeleteModal(false);
        }
    };

    const transporterData = [
        {
            options: [
                { label: "Select Transporter", value: "" },
                { label: "AILSINGHANI TRANSPORT PVT LTD", value: "AILSINGHANI TRANSPORT PVT LTD" },
                { label: "WESTERN INDIA LOGISTICS", value: "WESTERN INDIA LOGISTICS" },
                { label: "VRAJ CEMENT CARRIER LLP", value: "VRAJ CEMENT CARRIER LLP" },
                { label: "SHREE BALAJI BULK CARRIERS", value: "SHREE BALAJI BULK CARRIERS" },
                { label: "RAJ ENTERPRISE", value: "RAJ ENTERPRISE" },
                { label: "R AND B TRANSPORT", value: "R AND B TRANSPORT" },
                { label: "PRAKASH SUPPLY CHAIN SOLUTIONS LLP", value: "PRAKASH SUPPLY CHAIN SOLUTIONS LLP" },
                { label: "PARDEEP INFRA SOLUTIONS", value: "PARDEEP INFRA SOLUTIONS" },
                { label: "NEHA ROADLINE", value: "NEHA ROADLINE" },
                { label: "MAHALAXMI LOGISTICS SOLUTION", value: "MAHALAXMI LOGISTICS SOLUTION" },
                { label: "M2 VENTURES", value: "M2 VENTURES" },
                { label: "KVS ENTERPRISES", value: "KVS ENTERPRISES" },
                { label: "GANESHA BULK CARRIERS LLP", value: "GANESHA BULK CARRIERS LLP" },
                { label: "DARYANI VENTURES PVT LTD", value: "DARYANI VENTURES PVT LTD" },
                { label: "BHAGAT ROADWAYS", value: "BHAGAT ROADWAYS" },
                { label: "BALAJI BULK MOVERS", value: "BALAJI BULK MOVERS" },
                { label: "ARIHANT BULK CARRIER", value: "ARIHANT BULK CARRIER" }
            ]
        }
    ];

    const plantData = [
        {
            options: [
                { label: "Select Plants", value: "" },
                { label: "Sindri", value: "Sindri" },
                { label: "Panvel", value: "Panvel" },
                { label: "Tikariya", value: "Tikariya" },
                { label: "Nalagarh", value: "Nalagarh" },
                { label: "Rajkot", value: "Rajkot" },
            ],
        },
    ];

    const plantOptions = plantData.flatMap(item => item.options).filter(opt => opt.value !== "");

    const columns = useMemo(() => [
        {
            Header: "Transporter",
            accessor: "transporter",
        },
        {
            Header: "Plant Name",
            accessor: "plant",
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ value }) => (
                <span className={`badge text-uppercase badge-soft-${value === "A" ? "success" : "danger"}`}>
                    {value === "A" ? "Active" : "Deactive"}
                </span>
            ),
        },
        {
            Header: "Action",
            Cell: ({ row }) => (
                <ul className="list-inline hstack gap-2 mb-0">
                    <li className="list-inline-item edit" title="Edit">
                        <Link to="#" className="text-primary d-inline-block edit-item-btn" onClick={() => handleEditClick(row.original.id)}>
                            <i className="ri-pencil-fill fs-16"></i>
                        </Link>
                    </li>
                    <li className="list-inline-item" title="Remove">
                        <Link to="#" className="text-danger d-inline-block remove-item-btn" onClick={() => handleDeleteClick(row.original.id)}>
                            <i className="ri-delete-bin-5-fill fs-16"></i>
                        </Link>
                    </li>
                </ul>
            ),
        },
    ], [handleEditClick]);

    document.title = "Transporter Plant Mapping | EPLMS";

    return (
        <React.Fragment>
            <div className="page-content">
                <ExportCSVModal show={false} onCloseClick={() => { }} data={mappings} />
                <DeleteModal show={deleteModal} onDeleteClick={handleDelete} onCloseClick={() => setDeleteModal(false)} />
                <Container fluid>
                    <BreadCrumb title={'Transporter Plant Mapping'} pageTitle="Master" />
                    <Row>
                        <Col lg={12}>
                            <Card id="mappingList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <h5 className="card-title mb-0 bg-light">Mapping Details</h5>
                                        </div>
                                        <div className="col-sm-auto">
                                            <button type="button" className="btn btn-success add-btn" onClick={handleAddClick}>
                                                <i className="ri-add-line align-bottom me-1"></i> Add Mapping
                                            </button>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0">

                                    <TableContainer
                                        columns={columns}
                                        data={mappings}
                                        isGlobalFilter={true}
                                        isAddUserList={false}
                                        customPageSize={5}
                                        isGlobalSearch={true}
                                        className="custom-header-css"
                                        SearchPlaceholder='Search...'
                                        tableClass="res_table"
                                    />
                                    <Modal isOpen={modal} toggle={toggle} centered size="lg">
                                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                                            {isEdit ? "Edit Mapping" : "Add Mapping"}
                                        </ModalHeader>
                                        <Form onSubmit={handleSubmit}>
                                            <ModalBody>
                                                <Row className="g-3">
                                                    <Col lg={6}>
                                                        <div>
                                                            <Label className="form-label" >Transporter</Label>
                                                            <Input
                                                                name="transporter"
                                                                type="select"
                                                                className="form-select"
                                                                value={values.transporter}
                                                                onChange={handleInputChange}
                                                                required
                                                            >
                                                                {transporterData.map((item, key) => (
                                                                    <React.Fragment key={key}>
                                                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                    </React.Fragment>
                                                                ))}
                                                            </Input>
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div>
                                                            <Label className="form-label">Plant Name</Label>
                                                            <Select
                                                                name="plant"
                                                                options={plantOptions}
                                                                isMulti // Enables multi-select
                                                                classNamePrefix="react-select"
                                                                value={plantOptions.filter(option => values.plant?.includes(option.value))}
                                                                onChange={selectedOptions =>
                                                                    handleInputChange({ target: { name: "plant", value: selectedOptions.map(opt => opt.value) } })
                                                                }
                                                                styles={{
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: "#ffffff", // Set background to white
                                                                    }),
                                                                    menu: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: "#ffffff", // Ensure dropdown menu is white
                                                                    }),
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                    {isEdit && (
                                                        <Col md={6}>
                                                            <Label htmlFor="status" className="form-label">Status</Label>
                                                            <Input type="select" required className="form-select" name="status" id="status" value={values.status} onChange={handleInputChange}>
                                                                <option value="A">Active</option>
                                                                <option value="D">Deactive</option>
                                                            </Input>
                                                        </Col>
                                                    )}
                                                </Row>
                                                <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                                                    <button type="button" className="btn btn-light" onClick={toggle}>Close</button>
                                                    <button type="submit" className="btn btn-success">{isEdit ? "Update" : "Add Mapping"}</button>
                                                </Col>
                                            </ModalBody>
                                            <ModalFooter />
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

export default TransporterPlantMapping;