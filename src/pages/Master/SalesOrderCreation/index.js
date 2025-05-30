import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../MasterMovement/Movement.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

const initialValues = {
    code: "",
    name: "",
    firstWeight: "",
    status: "A",
};


const SalesOrderCreation = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [devices, setDevice] = useState([
        {
            id: 175517,
            sales_order_number: 91902268,
            //sales_order_item_no: null,
            validity_startDate: "09-12-2024 00:00",
            validity_endDate: "09-12-2024 00:00",
            company_code: "IN10",
            plant_code: "N212",
            status: "A",
            order_quantity: 100,
            remaining_qty: null,
            order_type: "ZN11",
            blockedSoInd: "B",
            cityDesc: "RANIA_KND",
            countyDesc: "KANPUR DEHAT",
            creationDate: "09-12-2024 18:46",
            creationTime: "IS",
            distributionChannel: null,
            docdate: "",
            idoc_num: "369865505",
            inco_Terms: "BG",
            matGr1: "PPC",
            matGr2: "BG",
            material_code: "ACC Cement PPC-PP Bags-50Kgs - NFR",
            reason_for_rejection: null,
            record_status: null,
            region_desc: null,
            route_code: "N22772",
            route_desc: "Tikaria-RANIA_KND",
            sales_doc_number: 2082403273,
            sales_document_type: "ZN11",
            sales_organization: "N101",
            ship_to_city_code: "U631",
            ship_to_county_code: 747,
            ship_to_party: 9111455906,
            ship_to_party_name: "TATA PROJECTS LTD",
            ship_to_region: "UP",
            so_status: "DTL",
            sold_to_party: 9116005885,
            sold_to_party_name: "TATA PROJECTS LTD",
            sold_to_sales_office: "ZNG4",
            transporter_code: 916000659,
            transporter_name: "CUSTOMER OWN TRANSPORT",
            web_order_no: null,
            division: "CM"
        },
        {
            id: 175777,
            sales_order_number: 91902269,
            //sales_order_item_no: null,
            validity_startDate: "09-12-2024 00:00",
            validity_endDate: "09-12-2024 00:00",
            company_code: "IN10",
            plant_code: "N212",
            status: "A",
            order_quantity: 100,
            remaining_qty: null,
            order_type: "ZN11",
            blockedSoInd: "D",
            cityDesc: "RANIA_KND",
            countyDesc: "KANPUR DEHAT",
            creationDate: "09-12-2024 22:10",
            creationTime: "IS",
            distributionChannel: null,
            docdate: "",
            idoc_num: "369865505",
            inco_Terms: "BG",
            matGr1: "PPC",
            matGr2: "BG",
            material_code: "ACC Cement PPC-PP Bags-50Kgs - NFR",
            reason_for_rejection: null,
            record_status: null,
            region_desc: null,
            route_code: "N22772",
            route_desc: "Tikaria-RANIA_KND",
            sales_doc_number: 2082403273,
            sales_document_type: "ZN11",
            sales_organization: "N101",
            ship_to_city_code: "U631",
            ship_to_county_code: 747,
            ship_to_party: 9111455906,
            ship_to_party_name: "TATA PROJECTS LTD",
            ship_to_region: "UP",
            so_status: "DTL",
            sold_to_party: 9116005885,
            sold_to_party_name: "TATA PROJECTS LTD",
            sold_to_sales_office: "ZNG4",
            transporter_code: 916000659,
            transporter_name: "CUSTOMER OWN TRANSPORT",
            web_order_no: null,
            division: "CM"
        },
        {
            id: 176068,
            sales_order_number: 91902270,
            //sales_order_item_no: null,
            validity_startDate: "10-12-2024 00:00",
            validity_endDate: "10-12-2024 00:00",
            company_code: "IN10",
            plant_code: "N212",
            status: "A",
            order_quantity: 100,
            remaining_qty: null,
            order_type: "ZN11",
            blockedSoInd: "B",
            cityDesc: "GONDA_GON_271001",
            countyDesc: "GONDA",
            creationDate: "10-12-2024 11:17",
            creationTime: "IS",
            distributionChannel: null,
            docdate: "",
            idoc_num: "369865505",
            inco_Terms: "BG",
            matGr1: "PPC",
            matGr2: "BG",
            material_code: "ACC Cement PPC-PP Bags-50Kgs - NFR",
            reason_for_rejection: null,
            record_status: null,
            region_desc: null,
            route_code: "NKAZ7A",
            route_desc: "Tikaria-GONDA_271001",
            sales_doc_number: 2082405377,
            sales_document_type: "ZN11",
            sales_organization: "N101",
            ship_to_city_code: "UWVG",
            ship_to_county_code: 738,
            ship_to_party: 9111453313,
            ship_to_party_name: "TATA PROJECTS LTD",
            ship_to_region: "UP",
            so_status: "DTL",
            sold_to_party: 9116005885,
            sold_to_party_name: "TATA PROJECTS LTD",
            sold_to_sales_office: "ZNG4",
            transporter_code: 916000659,
            transporter_name: "CUSTOMER OWN TRANSPORT",
            web_order_no: null,
            division: "CM"
        },
        {
            id: 184878,
            sales_order_number: 91901971,
            //sales_order_item_no: null,
            validity_startDate: "14-12-2024 00:00",
            validity_endDate: "14-12-2024 00:00",
            company_code: "IN20",
            plant_code: "NT36",
            status: "A",
            order_quantity: 92,
            remaining_qty: null,
            order_type: "ZN11",
            blockedSoInd: "A",
            cityDesc: "SITAPUR_SIT_261001",
            countyDesc: "SITAPUR",
            creationDate: "14-12-2024 18:10",
            creationTime: "IS",
            distributionChannel: null,
            docdate: "",
            idoc_num: "369865505",
            inco_Terms: "BG",
            matGr1: "PSC",
            matGr2: "BG",
            material_code: "PSC-PSC CONCRETE +",
            reason_for_rejection: null,
            record_status: null,
            region_desc: null,
            route_code: "NKBEXC",
            route_desc: "GAURIGANJ-SITAPUR_SIT_261001",
            sales_doc_number: 2082441829,
            sales_document_type: "ZN11",
            sales_organization: "N101",
            ship_to_city_code: "UWYM",
            ship_to_county_code: 775,
            ship_to_party: 9111426025,
            ship_to_party_name: "SITAPUR AGARWAL COMPANY",
            ship_to_region: "UP",
            so_status: "DTL",
            sold_to_party: 9116005456,
            sold_to_party_name: "AGARWAL COMPANY",
            sold_to_sales_office: "ZNG1",
            transporter_code: null,
            transporter_name: null,
            web_order_no: null,
            division: "CM"
        },
        {
            id: 192260,
            sales_order_number: 91901972,
            //sales_order_item_no: null,
            validity_startDate: "19-12-2024 00:00",
            validity_endDate: "19-12-2024 00:00",
            company_code: "IN20",
            plant_code: "NT36",
            status: "A",
            order_quantity: 29,
            remaining_qty: null,
            order_type: "ZN11",
            blockedSoInd: "A",
            cityDesc: "SITAPUR_SIT_261001",
            countyDesc: "SITAPUR",
            creationDate: "19-12-2024 12:23",
            creationTime: "IS",
            distributionChannel: null,
            docdate: "",
            idoc_num: "369865505",
            inco_Terms: "BG",
            matGr1: "PPC",
            matGr2: "BG",
            material_code: "COMP-CC NFR",
            reason_for_rejection: "P7",
            record_status: null,
            region_desc: null,
            route_code: "NKBEXC",
            route_desc: "GAURIGANJ-SITAPUR_SIT_261001",
            sales_doc_number: 2082412282,
            sales_document_type: "ZN11",
            sales_organization: "N101",
            ship_to_city_code: "UWYM",
            ship_to_county_code: 775,
            ship_to_party: 9111426025,
            ship_to_party_name: "SITAPUR AGARWAL COMPANY",
            ship_to_region: "UP",
            so_status: "DTL",
            sold_to_party: 9116005456,
            sold_to_party_name: "AGARWAL COMPANY",
            sold_to_sales_office: "ZNG1",
            transporter_code: null,
            transporter_name: null,
            web_order_no: null,
            division: "CM"
        }
    ]
    );
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [CurrentID, setClickedRowId] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [latestHeader, setLatestHeader] = useState('');
    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

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

    const columns = useMemo(() => [
        {
            Header: '',
            accessor: 'id',
            hiddenColumns: true,
            Cell: (cell) => <input type="hidden" value={cell.value} />,
        },
        { Header: "Sales Order Number", accessor: "sales_order_number", filterable: false },
        //{ Header: "Sales Order Item No", accessor: "sales_order_item_no", filterable: false },
        { Header: "Validity Start Date", accessor: "validity_startDate", filterable: false },
        { Header: "Validity End Date", accessor: "validity_endDate", filterable: false },
        { Header: "Company Code", accessor: "company_code", filterable: false },
        { Header: "Plant Code", accessor: "plant_code", filterable: false },
        { Header: "Status", accessor: "status", filterable: false },
        { Header: "Order Quantity", accessor: "order_quanitty", filterable: false },
        { Header: "Remaining Qty", accessor: "remaining_qty", filterable: false },
        { Header: "Order Type", accessor: "order_type", filterable: false },
        { Header: "Blocked SO Ind", accessor: "blockedSoInd", filterable: false },
        { Header: "City Description", accessor: "cityDesc", filterable: false },
        { Header: "County Description", accessor: "countyDesc", filterable: false },
        { Header: "Creation Date", accessor: "creationDate", filterable: false },
        { Header: "Creation Time", accessor: "creationTime", filterable: false },
        { Header: "Distribution Channel", accessor: "distributionChannel", filterable: false },
        { Header: "Doc Date", accessor: "docdate", filterable: false },
        { Header: "IDOC Number", accessor: "idoc_num", filterable: false },
        { Header: "Inco Terms", accessor: "inco_Terms", filterable: false },
        { Header: "Material Group 1", accessor: "matGr1", filterable: false },
        { Header: "Material Group 2", accessor: "matGr2", filterable: false },
        //{ Header: "Material Price Group", accessor: "mat_price_group", filterable: false },
        { Header: "Material Code", accessor: "material_code", filterable: false },
        { Header: "Material Description", accessor: "material_desc", filterable: false },
        { Header: "Reason for Rejection", accessor: "reason_for_rejection", filterable: false },
        { Header: "Record Status", accessor: "record_status", filterable: false },
        { Header: "Region Description", accessor: "region_desc", filterable: false },
        { Header: "Route Code", accessor: "route_code", filterable: false },
        { Header: "Route Description", accessor: "route_desc", filterable: false },
        { Header: "Sales Doc Number", accessor: "sales_doc_number", filterable: false },
        { Header: "Sales Document Type", accessor: "sales_document_type", filterable: false },
        { Header: "Sales Organization", accessor: "sales_organization", filterable: false },
        { Header: "Ship to City Code", accessor: "ship_to_city_code", filterable: false },
        { Header: "Ship to County Code", accessor: "ship_to_county_code", filterable: false },
        { Header: "Ship to Party", accessor: "ship_to_party", filterable: false },
        { Header: "Ship to Party Name", accessor: "ship_to_party_name", filterable: false },
        { Header: "Ship to Region", accessor: "ship_to_region", filterable: false },
        { Header: "SO Status", accessor: "so_status", filterable: false },
        { Header: "Sold to Party", accessor: "sold_to_party", filterable: false },
        { Header: "Sold to Party Name", accessor: "sold_to_party_name", filterable: false },
        { Header: "Sold to Sales Office", accessor: "sold_to_sales_office", filterable: false },
        { Header: "Transporter Code", accessor: "transporter_code", filterable: false },
        { Header: "Transporter Name", accessor: "transporter_name", filterable: false },
        { Header: "Web Order No", accessor: "web_order_no", filterable: false },
        { Header: "Division", accessor: "division", filterable: false },
    ], []);



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

        // axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/movements`, config)
        //   .then(res => {
        //     const device = res;
        //     setDevice(device);
        //   });
        console.log("Get All Device Data");
    };

    if (!devices) {
        return <Loader />;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value || value.valueAsNumber,
        });
    };


    const handleSubmit = async (e) => {

        console.log(values)
        e.preventDefault();
        try {
            if (isEdit) {
                const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/movements/${CurrentID}`, values, config)
                console.log(res);
                toast.success("Movement Updated Successfully", { autoClose: 3000 });
                getAllDeviceData();
            }
            else {
                const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/movements`, values, config)
                console.log(res);
                if (!res.errorMsg) {
                    toast.success("Movement Added Successfully.", { autoClose: 3000 });
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


    // Delete Data
    const onClickDelete = (id) => {
        setClickedRowId(id);
        setDeleteModal(true);
    };

    const handleDeleteCustomer = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/movements/${CurrentID}`, config)
            console.log(res.data);
            getAllDeviceData();
            toast.success("Movement Deleted Successfully", { autoClose: 3000 });
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

    const handleDownload = async (e) => {
        e.preventDefault();
        downloadCSV();
        setIsExportCSV(false)
    };

    const downloadCSV = () => {
        const bl = [];
        columns.forEach((row) => {
            if (row.accessor !== undefined && row.accessor !== 'id') {
                bl.push(row.accessor + "$$$" + row.Header);
            }
        });
        const bla = [];
        devices.forEach((row1) => {
            const blp = {};
            bl.forEach((rows2) => {
                const pl = rows2.split("$$$");
                if (pl[0] === 'status') {
                    blp[pl[1]] = (row1[pl[0]] === 1 ? 'Active' : 'Deactive');
                } else if (pl[0] === 'quantity') {
                    blp[pl[1]] = row1[pl[0]] + " " + row1["unitMeasurement"];
                } else {
                    blp[pl[1]] = row1[pl[0]];
                }
            });
            bla.push(blp);
        });
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        // Convert the data to a worksheet
        const ws = XLSX.utils.json_to_sheet(bla, { header: Object.keys(bla[0]) });
        // Apply styling to the header row
        ws["!cols"] = [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }]; // Example: Set column widths
        // ws["A1"].s = { // Style for the header cell A1
        //     fill: {
        //         fgColor: { rgb: "FFFF00" } // Yellow background color
        //     },
        //     font: {
        //         bold: true,
        //         color: { rgb: "000000" } // Black font color
        //     }
        // };
        // Add more styling options as needed

        // Add the worksheet to the workbook

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Generate an XLSX file
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Convert binary string to Blob
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        // Save the Blob as a file using FileSaver
        FileSaver.saveAs(blob, 'SalesOrder.xlsx');

        // Utility function to convert a string to an ArrayBuffer
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buf;
        }
    };


    document.title = "Sales Order Creation | EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    onDownloadClick={handleDownload}
                    data={devices}
                />
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteCustomer}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <Container fluid>
                    <BreadCrumb title={'Sales Order Creation'} pageTitle="Master" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Sales Order Details</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto" style={{ marginRight: "15px" }}>
                                            <div>
                                                <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                </button>
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
                                            SearchPlaceholder='Search for Sales Order or something...'
                                            divClass="overflow-auto"
                                            tableClass="width-500"
                                        />
                                    </div>


                                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                                            {!!isEdit ? "Edit Sales Order" : "Add Sales Order"}
                                        </ModalHeader>
                                        <Form className="tablelist-form" onSubmit={handleSubmit}>
                                            <ModalBody>
                                                <Row className="g-3">
                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault01" className="form-label">Code</Label>
                                                        <Input type="text" required className="form-control"
                                                            name="code"
                                                            id="validationDefault01"
                                                            placeholder="Enter Code"
                                                            maxlength="15"
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
                                                            maxlength="100"
                                                            value={values.name}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="validationDefault04" className="form-label">First Weight</Label>
                                                        <Input type="number" required className="form-control"
                                                            id="validationDefault04"
                                                            name="firstWeight"
                                                            placeholder="Enter First Weight"
                                                            value={values.firstWeight}
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
                                                </Row>
                                                <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                                                    <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                                                    <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Sales Order"} </button>
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

export default SalesOrderCreation;
