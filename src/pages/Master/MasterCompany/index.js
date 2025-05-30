import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../MasterCompany/Company.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";

const initialValues = {
    companyName: "",
    companyCode: "",
    shortName: "",
    industry: "",
    city: "",
    address: "",
    noOfUnits: "",
    createdDate: "",
    status: "A",
    id: ""
};


const MasterCompany = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [devices, setDevice] = useState([]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [CurrentID, setClickedRowId] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
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
        getAllDeviceData();

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

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/companies`, config)
            .then(res => {
                const device = res;
                setDevice(device);
            });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        var date = new Date();
        const year = date.getFullYear();
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        const hr = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();

        if (dd < 10) { var date = '0' + dd; } else { var date = dd; }
        if (mm < 10) { var month = '0' + mm; } else { var month = mm; }
        if (min < 10) { var minutes = '0' + min; } else { var minutes = min; }
        if (sec < 10) { var seconds = '0' + sec; } else { var seconds = sec; }

        var fulldate = date + '-' + month + '-' + year + ' ' + hr + ':' + minutes + ':' + seconds;
        // alert("fulldate = " + fulldate);

        setValues({
            ...values,
            [name]: value || value.valueAsNumber,
            ['createdDate']: fulldate,
        });
    };



    const handleSubmit = async (e) => {

        console.log(values)
        e.preventDefault();


        try {
            if (isEdit) {
                const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/companies/${CurrentID}`, values, config)
                console.log(res);
                toast.success("Company Updated Successfully", { autoClose: 3000 });
                getAllDeviceData();
            }
            else {
                const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/companies`, values, config)
                console.log(res);
                if (!res.errorMsg) {
                    toast.success("Company Added Successfully.", { autoClose: 3000 });
                }
                else {
                    toast.error("Data Already Exist.", { autoClose: 3000 });
                }
                getAllDeviceData();
            }
        }
        catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
        }
        toggle();

    };



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

        var date = new Date();
        const year = date.getFullYear();
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        const hr = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();

        if (dd < 10) { var date = '0' + dd; } else { var date = dd; }
        if (mm < 10) { var month = '0' + mm; } else { var month = mm; }
        if (min < 10) { var minutes = '0' + min; } else { var minutes = min; }
        if (sec < 10) { var seconds = '0' + sec; } else { var seconds = sec; }

        var fulldate = date + '-' + month + '-' + year + ' ' + hr + ':' + minutes + ':' + seconds;
        //var fulldate ="10-6-2023 11:59:54";
        // alert("fulldate = " + fulldate);
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/companies/${id}`, config)
            .then(res => {
                const result = res;
                setValues({
                    ...values,
                    "companyName": result.companyName,
                    "companyCode": result.companyCode,
                    "shortName": result.shortName,
                    "industry": result.industry,
                    "city": result.city,
                    "address": result.address,
                    "noOfUnits": result.noOfUnits,
                    "createdDate": fulldate,
                    "status": result.status,
                    "id": id
                });
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
            const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/companies/${CurrentID}`, config)
            console.log(res.data);
            if(res.errorMsg){
                toast.error(res.errorMsg, { autoClose: 3000 });
                setDeleteModal(false);
            }
            else{
                getAllDeviceData();
                toast.success("Company Deleted Successfully", { autoClose: 3000 });
                setDeleteModal(false);
            }
            
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
                Header: "Company Name",
                accessor: "companyName",
                filterable: false,
            },
            {
                Header: "Company Code",
                accessor: "companyCode",
                filterable: false,
            },
            {
                Header: "Short Name",
                accessor: "shortName",
                filterable: false,
            },
            {
                Header: "Industry",
                accessor: "industry",
                filterable: false,
            },
            {
                Header: "City",
                accessor: "city",
                filterable: false,
            },
            {
                Header: "Address",
                accessor: "address",
                filterable: false,
            },
            {
                Header: "No Of Units",
                accessor: "noOfUnits",
                filterable: false,
            },
            {
                Header: "Created Date & Time",
                accessor: "createdDate",
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
                        default:
                            return <span className="badge text-uppercase badge-soft-info"> Active </span>;
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

    document.title = "Company | EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={devices}
                />
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteCustomer}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <Container fluid>
                    <BreadCrumb title={'Company'} pageTitle="Master" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Company Details</h5>
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
                                                    <i className="ri-add-line align-bottom me-1"></i> Add Company
                                                </button>{" "}

                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0">
                                    <div>
                                        {devices && devices.length ? (
                                            <TableContainer
                                                columns={columns}
                                                data={devices}
                                                isGlobalFilter={true}
                                                isAddUserList={false}
                                                customPageSize={5}
                                                isGlobalSearch={true}
                                                className="custom-header-css"
                                                handleCustomerClick={handleCustomerClicks}
                                                //isCustomerFilter={true}
                                                SearchPlaceholder='Search for Company Name or something...'
                                            />) : (<Loader />)
                                        }
                                    </div>


                                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                                            {!!isEdit ? "Edit Company" : "Add Company"}
                                        </ModalHeader>
                                        <Form className="tablelist-form" onSubmit={handleSubmit}>
                                            <ModalBody>
                                                <Row className="g-3">
                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault01" className="form-label">Company Name</Label>
                                                        <Input type="text" required className="form-control"
                                                            name="companyName"
                                                            id="validationDefault01"
                                                            placeholder="Enter Company Name"
                                                            maxlength="100"
                                                            value={values.companyName}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault03" className="form-label">Company Code</Label>
                                                        <Input type="text" required className="form-control"
                                                            id="validationDefault03"
                                                            name="companyCode"
                                                            placeholder="Enter Company Code"
                                                            maxlength="15"
                                                            value={values.companyCode}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault04" className="form-label">Short Name</Label>
                                                        <Input type="text" required className="form-control"
                                                            id="validationDefault04"
                                                            name="shortName"
                                                            placeholder="Enter Short Name"
                                                            maxlength="15"
                                                            value={values.shortName}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault04" className="form-label">Industry</Label>
                                                        <Input type="text" required className="form-control"
                                                            id="validationDefault04"
                                                            name="industry"
                                                            placeholder="Enter Industry"
                                                            maxlength="25"
                                                            value={values.industry}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault04" className="form-label">City</Label>
                                                        <Input type="text" required className="form-control"
                                                            id="validationDefault04"
                                                            name="city"
                                                            placeholder="Enter City Name"
                                                            maxlength="25"
                                                            value={values.city}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>

                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault04" className="form-label">No Of Units</Label>
                                                        <Input type="number" required className="form-control"
                                                            id="validationDefault04"
                                                            name="noOfUnits"
                                                            placeholder="Enter No Of Units"
                                                            value={values.noOfUnits}
                                                            onChange={handleInputChange}
                                                        />
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
                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault04" className="form-label">Address</Label>
                                                        <textarea required className="form-control" style={{height:"27px"}}
                                                            id="validationDefault04"
                                                            name="address"
                                                            placeholder="Enter Address"
                                                            value={values.address}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                                                        <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                                                        <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Company"} </button>
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

export default MasterCompany;