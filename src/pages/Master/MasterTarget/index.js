import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
// import '../MasterUnit/CommonShift.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Flatpickr from "react-flatpickr";
import Loader from "../../../Components/Common/Loader";

const initialValues = {
    id: "",
    plantCode: "",
    target: "",
    targetDate: "",
    status: "A",

};


const MasterTarget = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [devices, setDevice] = useState([]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [CurrentID, setClickedRowId] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [Plant_Code, setPlantCode] = useState('');
    const [latestHeader, setLatestHeader] = useState('');

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
        } else {
            setModal(true);
        }
    }, [modal]);


    useEffect(() => {
        debugger
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
        const HeaderName = localStorage.getItem("HeaderName");
        setLatestHeader(HeaderName);
        getAllDeviceData(plantcode);

    }, []);


    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            username: process.env.REACT_APP_API_USER_NAME,
            password: process.env.REACT_APP_API_PASSWORD,
        }
    };


    const getAllDeviceData = (plantcode) => {
        debugger
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Target?plantCode=${plantcode}`,config)
            .then(res => {
                const device = res;
                setDevice(device);
            });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value || value.valueAsNumber,
            ["plantCode"]: Plant_Code,
        });
    };


    const handleSubmit = async (e) => {

        console.log(values)
        e.preventDefault();
        try {
            if (isEdit) {
                const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/Target/${CurrentID}`, values, config)
                console.log(res);
                toast.success("Target Updated Successfully", { autoClose: 3000 });
                getAllDeviceData(Plant_Code);
            }
            else {
                const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/Target`, values, config)
                console.log(res);
                if (res.message==="Target created successfully") {
                    toast.success("Target Added Successfully.", { autoClose: 3000 });
                    getAllDeviceData(Plant_Code);
                }
                else {
                    toast.error(res.message, { autoClose: 3000 });
                }
                getAllDeviceData(Plant_Code);
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
        debugger

        setClickedRowId(arg);
        setIsEdit(true);
        toggle();
        const id = arg;
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Target/${id}`, config)
            .then(res => {
                const result = res;
                setValues({
                    ...values,
                    "target": result.target,
                    "targetDate": result.targetDate,
                    "status": result.status,
                    "plantCode": Plant_Code,
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
            const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/Target/${CurrentID}`, config)
            console.log(res.data);
            getAllDeviceData(Plant_Code);
            toast.success("Target Deleted Successfully", { autoClose: 3000 });
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
                Header: "Target",
                accessor: "target",
                filterable: false,
            },
            {
                Header: "Target Date",
                accessor: "targetDate",
                filterable: false,
                Cell: ({ row }) => {
                    var date = new Date(row.original.targetDate);
                    if (!date.getFullYear()) {
                        return ("");
                      } else {
                        var day = ('0' + date.getDate()).slice(-2);
                        var month = ('0' + (date.getMonth() + 1)).slice(-2);
                        return (day + '-' + month + '-' + date.getFullYear());
                      }
                  },
            },
            {
                Header: "Plant Code",
                accessor: "plantCode",
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

    document.title = "Target | EPLMS";
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
                    <BreadCrumb title={latestHeader} pageTitle="Master" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Target Details</h5>
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
                                                    <i className="ri-add-line align-bottom me-1"></i> Add Target
                                                </button>{" "}

                                            </div>
                                        </div>
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
                                            handleCustomerClick={handleCustomerClicks}
                                            //isCustomerFilter={true}
                                            SearchPlaceholder='Search for Target or something...'
                                        />
                                    </div>


                                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                                            {!!isEdit ? "Edit Target" : "Add Target"}
                                        </ModalHeader>
                                        <Form className="tablelist-form" onSubmit={handleSubmit}>
                                            <ModalBody>
                                                <Row className="g-3">
                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault01" className="form-label">Target</Label>
                                                        <Input type="number" required  className="form-control"
                                                            name="target"
                                                            id="validationDefault01"
                                                            placeholder="Enter Target"
                                                            //   maxlength="15"
                                                            value={values.target}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault04" className="form-label">Target Date</Label>
                                                        <div className="">
                                                            <Input type="date" required disabled={isEdit ? true : false} className="form-control"
                                                                name="targetDate"
                                                                id="validationDefault01"
                                                                placeholder="Select Target Date"
                                                                //   maxlength="15"
                                                                value={values.targetDate}
                                                                onChange={handleInputChange}
                                                            />
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
                                                </Row>
                                                <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                                                    <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                                                    <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Target"} </button>
                                                </Col>

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

export default MasterTarget;
