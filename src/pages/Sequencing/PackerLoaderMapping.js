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
import Flatpickr from "react-flatpickr";

const initialValues = {
    packerLoaderCode: "",
    materialTypeCode: "",
    packerLoaderParentCode: "",
    packerLoaderChildCode: "",
    status: "A",
};


const PackerLoaderMapping = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [AllData, setAllData] = useState([]);
    const [MaterialData, setMaterialData] = useState([]);
    const [PackerData, setPackerData] = useState([]);
    const [LoaderData, setLoaderData] = useState([]);
    const [CurrentID, setClickedRowId] = useState('');
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [getpackerLoaderParentCode, setpackerLoaderParentCode] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [isUnloading, setUnloading] = useState(true);
    const [currentPacker, setCurrentPacker] = useState('');
    const [currentLoader, setCurrentLoader] = useState('');
    const [currentMaterial, setCurrentMaterial] = useState('');
    const [clickedRowType, setClickedRowType] = useState('');
    const [PlantCode, setPlantCode] = useState([]);
    const [latestHeader, setLatestHeader] = useState('');
    const [MaterialMappedWithPacker, setExistingMaterialMappedWithPacker] = useState('');

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
        let plantCode = obj.data.plantCode;
        setPlantCode(plantCode);
        getAllData(plantCode);
        getMaterialData(plantCode);
        getPackerData(plantCode);
        getLoaderData(plantCode);
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

    const getAllData = async (plantCode) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerProduct/getAllPackerProduct?plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setAllData(data);
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

    const getPackerData = (plantCode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/getPackerDataByTypePandUL?plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setPackerData(data);
            })
    }

    const getLoaderData = (plantCode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/getPackerDataByType?type=L&plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setLoaderData(data);
            })
    }

    const handleInputChange1 = (e) => {
        debugger;

        const { name, value } = e.target;
        setExistingMaterialMappedWithPacker("");
        if (name === "packerLoaderCode" && e.target.selectedOptions[0].attributes[1].value === "UL") {
            setCurrentPacker(value);
            setUnloading(false);
        } else if (name === "packerLoaderCode" && e.target.selectedOptions[0].attributes[1].value === "P") {
            setCurrentPacker(value);
            getPackerMaterialStatus(value);
            setUnloading(true);
        }
    };

    const getPackerMaterialStatus = (packer) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerProduct/getPackerMaterialDataByType?packer=${packer}&plantCode=${PlantCode}`, config)
            .then(res => {
                const data = res;
                if ((res.msg).includes("No material found for packer")) {
                    setExistingMaterialMappedWithPacker("");
                }
                else if ((res.msg).includes("Error retrieving material")) {
                    setExistingMaterialMappedWithPacker("");
                }
                else {
                    const materialNumber = res.msg.match(/\b\d+\b/)[0];
                    setExistingMaterialMappedWithPacker(materialNumber);
                }
            })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "packerLoaderChildCode") {
            setCurrentLoader(value);
        } else if (name === "materialTypeCode") {
            setCurrentMaterial(value);
        }
    };

    const handleEditChange = (e) => {

        const { name, value } = e.target;
        if (isEdit) {
            var test = "";
            if (name === "packerLoaderCode") { test = value }
            setValues({
                ...values,
                [name]: value || value.valueAsNumber,
                ["packerLoaderParentCode"]: test || values.packerLoaderParentCode,
                ["id"]: CurrentID,
                ["plantCode"]: PlantCode,
            });
        } else {
            if (name === "packerLoaderCode") { setpackerLoaderParentCode(value) }
            setValues({
                ...values,
                [name]: value || value.valueAsNumber,
                ["packerLoaderParentCode"]: getpackerLoaderParentCode,
                ["status"]: 1,
                ["plantCode"]: PlantCode,
            });
        }
    }


    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!isUnloading) { // with Unloading Data
            var obj = values;
            Object.assign(obj, { type: "UL" });
            try {
                if (isEdit) {
                    const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/packerProduct/createPackerProduct`, Object.assign(obj, { plantCode: PlantCode }), config)
                    console.log(res);
                    if (res.errorMsg === "Data already exist!") {
                        toast.error("Data Already Exist.", { autoClose: 3000 });
                    }
                    else {
                        toast.success("Data Updated Successfully", { autoClose: 3000 });
                        getAllData(PlantCode);
                    }
                    toggle();
                }
                else {
                    const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/packerProduct/createPackerProduct`, { "packerLoaderCode": currentPacker, "packerLoaderParentCode": currentPacker, "packerLoaderChildCode": '', "materialTypeCode": currentMaterial, "status": "1", "type": "UL", "plantCode": PlantCode }, config)
                    console.log(res);
                    if (!res.errorMsg) {
                        toast.success("Data mapped Successfully.", { autoClose: 3000 });
                    }
                    else {
                        toast.error("Data Already Exist.", { autoClose: 3000 });
                    }
                    getAllData(PlantCode);
                }
            }
            catch (e) {
                toast.error("Something went wrong!", { autoClose: 3000 });
            }
        }
        else {
            var obj = values;
            Object.assign(obj, { type: "P" });
            try {
                if (isEdit) {
                    const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/packerProduct/createPackerProduct`, Object.assign(obj, { plantCode: PlantCode }), config)
                    console.log(res);
                    if (res.errorMsg === "Data already exist!") {
                        toast.error("Data Already Exist.", { autoClose: 3000 });
                    }
                    else {
                        toast.success("Data Updated Successfully", { autoClose: 3000 });
                        getAllData(PlantCode);
                    }
                    toggle();
                }
                else {
                    const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/packerProduct/createPackerProduct`, { "packerLoaderCode": currentPacker, "packerLoaderParentCode": currentPacker, "packerLoaderChildCode": currentLoader, "materialTypeCode": MaterialMappedWithPacker ? MaterialMappedWithPacker: currentMaterial, "status": "1", "type": "P", "plantCode": PlantCode }, config)
                    console.log(res);
                    if (!res.errorMsg) {
                        toast.success("Data mapped Successfully.", { autoClose: 3000 });
                    }
                    else {
                        toast.error(res.errorMsg, { autoClose: 3000 });
                    }
                    getAllData(PlantCode);
                }
            }
            catch (e) {
                toast.error("Something went wrong!", { autoClose: 3000 });
            }
        }
    };



    // Add Data
    const handleCustomerClicks = () => {
        setIsEdit(false);
        toggle();
    };
    // Update Data
    const handleCustomerClick = useCallback((arg) => {


        setClickedRowId(arg.id);
        setClickedRowType(arg.type);
        setIsEdit(true);
        toggle();
        const id = arg.id;
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerProduct/getById/${id}`, config)
            .then(res => {
                const result = res;
                setValues({
                    ...values,
                    "packerLoaderCode": result.packerLoaderCode,
                    "materialTypeCode": result.materialTypeCode,
                    "packerLoaderParentCode": result.packerLoaderCode,
                    "packerLoaderChildCode": result.packerLoaderChildCode,
                    "status": result.status,
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
            const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/packerProduct/deletePackerProduct/${CurrentID}`, config)
            console.log(res.data);
            getAllData(PlantCode);
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
                { label: "Active", value: 1 },
                { label: "Deactive", value: 0 },
            ],
        },
    ];


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
                Header: "Packer Code",
                accessor: "packerLoaderCode",
                filterable: false,
            },
            {
                Header: "Packer ParentCode",
                accessor: "packerLoaderParentCode",
                filterable: false,
            },
            {
                Header: "Loader Code",
                accessor: "packerLoaderChildCode",
                filterable: false,
            },
            {
                Header: "Material Code",
                accessor: "materialTypeCode",
                filterable: false,
            },
            {
                Header: "Material Name",
                accessor: "materialName",
                filterable: false,
            },
            // {
            //     Header: "Status",
            //     accessor: "status",
            //     Cell: (cell) => {
            //         switch (cell.value) {
            //             case 1:
            //                 return <span className="badge text-uppercase badge-soft-success"> Active </span>;
            //             case 0:
            //                 return <span className="badge text-uppercase badge-soft-danger"> Deactive </span>;
            //         }
            //     }
            // },
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




    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    document.title = "Packer Loader Mapping | EPLMS";
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
                    <BreadCrumb title={latestHeader} pageTitle="Sequencing" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm border border-dashed border-end-0 border-start-0 border-top-0 pb-3" >
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Map Packer Loader</h5>
                                            </div>
                                        </div>
                                    </Row>
                                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                                        <Row className="mt-3 row ms-0">
                                            <Col lg={3} className="ps-2">
                                                <div>
                                                    <Label className="form-label" >Packer Name<span style={{ color: "red" }}>*</span></Label>
                                                    <Input
                                                        name="packerLoaderCode"
                                                        type="select"
                                                        className="form-select"
                                                        // value={values.trip_movement_type_code}
                                                        onChange={handleInputChange1}
                                                        required
                                                    >
                                                        <React.Fragment>
                                                            <option value="" selected>Select Packer Name</option>
                                                            {PackerData.map((item, key) => (<option value={item.code} item_type={item.type} key={key}>{item.name}</option>))}
                                                        </React.Fragment>
                                                    </Input>
                                                </div>
                                            </Col>
                                            {isUnloading &&
                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Loader Name<span style={{ color: "red" }}>*</span></Label>
                                                        <Input
                                                            name="packerLoaderChildCode"
                                                            type="select"
                                                            className="form-select"
                                                            // value={values.trip_movement_type_code}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Loader Name</option>
                                                                {LoaderData.map((item, key) => (<option value={item.code} key={key}>{item.name}</option>))}
                                                            </React.Fragment>
                                                        </Input>
                                                    </div>
                                                </Col>
                                            }
                                            {MaterialMappedWithPacker ?
                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Material Name<span style={{ color: "red" }}>*</span></Label>
                                                        <Input
                                                            name="materialTypeCode"
                                                            type="text"
                                                            className="form-select"
                                                            value={MaterialMappedWithPacker}
                                                            disabled
                                                        >
                                                        </Input>
                                                    </div>
                                                </Col>

                                                :
                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Material Name<span style={{ color: "red" }}>*</span></Label>
                                                        <Input
                                                            name="materialTypeCode"
                                                            type="select"
                                                            className="form-select"
                                                            //value={values.trip_movement_type_code}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Material Name</option>
                                                                {MaterialData.map((item, key) => (<option value={item.code} key={key}>{item.name} / {item.code}</option>))}
                                                            </React.Fragment>
                                                        </Input>
                                                    </div>
                                                </Col>
                                            }
                                            <Col md={2} className="hstack gap-2 justify-content-end" style={{ marginTop: "29px" }}>
                                                <button type="submit" className="btn btn-success" onClick={() => { setIsEdit(false) }}><i className="ri-add-line align-bottom me-1"></i>Map Packer Loader</button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardHeader>

                                <div className="card-body pt-0 mt-3">
                                    <h5 className="card-title1 mb-3 pb-3 bg-light" style={{ marginLeft: "1rem !important" }}>Packer Loader Mapping Details</h5>
                                    <div>
                                        <TableContainer
                                            columns={columns}
                                            data={AllData}
                                            isGlobalFilter={true}
                                            isAddUserList={false}
                                            customPageSize={5}
                                            isGlobalSearch={true}
                                            className="custom-header-css"
                                            handleCustomerClick={handleCustomerClicks}
                                            //isCustomerFilter={true}
                                            SearchPlaceholder='Search for Packer Code or something...'
                                        />
                                    </div>
                                    <ToastContainer closeButton={false} limit={1} />
                                </div>
                                <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                                    <ModalHeader className="bg-light p-3" toggle={toggle}>"Edit Packer Loader Mapping" </ModalHeader>
                                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                                        <ModalBody>
                                            <Row className="g-3">
                                                <Col lg={4}>
                                                    <div>
                                                        <Label className="form-label" >Packer Name<span style={{ color: "red" }}>*</span></Label>
                                                        <Input
                                                            name="packerLoaderCode"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.packerLoaderCode}
                                                            onChange={handleEditChange}
                                                            required
                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Packer Name</option>
                                                                {PackerData.map((item, key) => (<option value={item.code} key={key}>{item.name}</option>))}
                                                            </React.Fragment>
                                                        </Input>
                                                    </div>
                                                </Col>
                                                {clickedRowType === 'P' &&
                                                    <Col lg={4}>
                                                        <div>
                                                            <Label className="form-label" >Loader Name<span style={{ color: "red" }}>*</span></Label>
                                                            <Input
                                                                name="packerLoaderChildCode"
                                                                type="select"
                                                                className="form-select"
                                                                value={values.packerLoaderChildCode}
                                                                onChange={handleEditChange}
                                                                required
                                                            >
                                                                <React.Fragment>
                                                                    <option value="" selected>Select Loader Name</option>
                                                                    {LoaderData.map((item, key) => (<option value={item.code} key={key}>{item.name}</option>))}
                                                                </React.Fragment>
                                                            </Input>
                                                        </div>
                                                    </Col>
                                                }
                                                <Col lg={4}>
                                                    <div>
                                                        <Label className="form-label" >Material Name<span style={{ color: "red" }}>*</span></Label>
                                                        <Input
                                                            name="materialTypeCode"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.materialTypeCode}
                                                            onChange={handleEditChange}
                                                            required
                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Material Name</option>
                                                                {MaterialData.map((item, key) => (<option value={item.code} key={key}>{item.name}</option>))}
                                                            </React.Fragment>
                                                        </Input>
                                                    </div>
                                                </Col>
                                                {/* {isEdit &&
                                                        <Col lg={4}>
                                                            <div>
                                                                <Label className="form-label" >Status</Label>
                                                                <Input
                                                                    name="status"
                                                                    type="select"
                                                                    className="form-select"
                                                                    value={values.status}
                                                                    onChange={handleEditChange}
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
                                                    } */}
                                                <Col lg={8} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                                                    <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                                                    <button type="submit" className="btn btn-success">Update</button>
                                                </Col>

                                            </Row>

                                        </ModalBody>
                                        <ModalFooter>
                                        </ModalFooter>
                                    </Form>
                                </Modal>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>


        </React.Fragment>
    );
};

export default PackerLoaderMapping;
