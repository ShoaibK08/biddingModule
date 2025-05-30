import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import TextArea from "antd/es/input/TextArea";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

const initialValues = {
    emailTo: "",
    emailSubject: "",
    emailBody: "",
    stage: "",
    role: ""
};


const AutoMailer = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [devices, setDevice] = useState([]);
    const [stageData, setStageData] = useState([]);
    const [RoleData, setRoleData] = useState([]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [CurrentID, setClickedRowId] = useState('');
    const [RoleFlag, setRoleFlag] = useState(false);
    const [EmailToFlag, setEmailToFlag] = useState(false);
    const [RoleFlagEdit, setRoleFlagEdit] = useState(true);
    const [EmailToFlagEdit, setEmailToFlagEdit] = useState(true);
    const [Plant_Code, setPlantCode] = useState('');
    const [errorStartDate, setErrorStartDate] = useState(false);
    const [errorEndDate, setErrorEndDate] = useState(false);
    const [ErrorStage, setErrorMovement] = useState(false);
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
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
        getAllData(plantcode);
        getStageData(plantcode);
        getRoleData(plantcode);

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

        axios.get(`http://localhost:8085/autoMailer?plantCode=${plantcode}`, config)
            .then(res => {
                const device = res;
                setDevice(device);
            });
    }

    const getStageData = (plantcode) => {

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/movementType/OB/${plantcode}`, config)
            .then(res => {
                const Stage = res;
                setStageData(Stage);
            })
    }

    const getRoleData = (plantcode) => {

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/roles?plantCode=${plantcode}`, config)
            .then(res => {
                const result = res;
                setRoleData(result);
            });
    }

    const handleInputChangeRadio = (e) => {
        
        const { name, value } = e.target;
        if (value === "RoleRadio") {
            setEmailToFlag(false);
            setRoleFlag(true);
            setValues({
                ...values,
                ["emailTo"]: "",
            });
        }
        else if (value === "EmailToRadio") {
            setRoleFlag(false);
            setEmailToFlag(true);
            setValues({
                ...values,
                ["role"]: "",
            });
        }
    };

    const handleInputChange = (e) => {
        
        const { name, value } = e.target;
        if (name === "role") {
            setEmailToFlag(false);
        }
        else if (name === "emailTo") {
            setRoleFlag(false);
        }
        setValues({
            ...values,
            [name]: value || value.valueAsNumber,
            ["plantCode"]: Plant_Code,
        });
    };

    // Add Data
    const handleCustomerClicks = () => {
        setIsEdit(false);
        toggle();
    };

    const handleCustomerClick = useCallback((arg) => {
        

        setClickedRowId(arg);
        setIsEdit(true);
        setRoleFlagEdit(true);
        setEmailToFlagEdit(true);
        toggle();
        const id = arg;
        axios.get(`http://localhost:8085/autoMailer/${id}`, config)
            .then(res => {
                if (res.role === "") {
                    setRoleFlagEdit(false);
                }
                else if (res.emailTo === "") {
                    setEmailToFlagEdit(false);
                }
                const result = res;
                setValues({
                    ...values,
                    "emailTo": result.emailTo,
                    "emailSubject": result.emailSubject,
                    "emailBody": result.emailBody,
                    "role": result.role,
                    "stage": result.stage,
                    "plantCode": Plant_Code,
                });
            })

    }, [toggle]);

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
                Header: "Email Subject",
                accessor: "emailSubject",
                filterable: false,
            },
            {
                Header: "Email Body",
                accessor: "emailBody",
                filterable: false,
            },
            {
                Header: "Stage",
                accessor: "stage",
                filterable: false,
            },
            {
                Header: "Role",
                accessor: "role",
                filterable: false,
            },
            {
                Header: "Email To",
                accessor: "emailTo",
                filterable: false,
                Cell: (cell) => {
                    return (
                        <div>
                            {cell.value.split(',').map((email, index) => (
                                <div key={index}>{email.trim()}</div>
                            ))}
                        </div>
                    );
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
                        </ul>
                    );
                },
            },
        ],
    );

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
        FileSaver.saveAs(blob, 'Auto_Mailer.xlsx');
    
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

    const handleSubmit = async (e) => {

        console.log(values)
        e.preventDefault();

        try {
            if (isEdit) {
                const res = await axios.put(`http://localhost:8085/autoMailer/${CurrentID}`, values, config)
                console.log(res);
                toast.success("Data Updated Successfully", { autoClose: 3000 });
                toggle();
                getAllData(Plant_Code);
            }
            else {
                const finalEmail = emails.filter(email => email.trim() !== '').join(', ');
                values.emailTo = finalEmail;
                const res = await axios.post(`http://localhost:8085/autoMailer`, values, config)
                console.log(res);
                if (!res.errorMsg) {
                    if((res.message).includes("Email with the same Plant Code or Role already exists")){
                        toast.warning("Data already exist.", { autoClose: 3000 });
                    }
                    else{
                        toast.success(res.message, { autoClose: 3000 });
                        setEmails(['']); // Reset to one empty email field
                        setValues({
                            ...values,
                            "emailTo": "",
                            "emailSubject": "",
                            "emailBody": "",
                            "role": "",
                            "stage": "",
                        });
                    }
                    
                }
                else {
                    toast.error("Data Already Exist.", { autoClose: 3000 });
                }
                getAllData(Plant_Code);
            }
        }
        catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
        }
    };

    const [emails, setEmails] = useState(['']); // Initial state with one email input

    const handleInputChangeE = (index, event) => {
        const newEmails = [...emails];
        newEmails[index] = event.target.value;
        setEmails(newEmails);
    };

    const addEmailField = () => {
        setEmails([...emails, '']); // Add a new empty email input
    };

    const removeEmailField = () => {
        const newEmails = [...emails];
        newEmails.pop(); // Remove email at given index
        setEmails(newEmails);
    };



    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    document.title = "Auto Mailer | EPLMS";
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
                    <BreadCrumb title={"Auto Mailer"} pageTitle="Configuration" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Auto Mailer</h5>
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
                                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                                        <Row className="mt-3 p-2">
                                            <Col lg={12}>
                                                <div className="input-light mb-2">
                                                    <label style={{ fontWeight: "bold" }}>Select Role or Email from below options<span style={{ color: "red" }}>*</span></label>
                                                    <br></br>
                                                    <Input type="radio" name="location_id" value={"RoleRadio"} required onChange={handleInputChangeRadio} /> Role  &nbsp;&nbsp;&nbsp;
                                                    <Input type="radio" name="location_id" value={"EmailToRadio"} required onChange={handleInputChangeRadio} /> Email To  &nbsp;&nbsp;&nbsp;

                                                </div>
                                            </Col>
                                            {RoleFlag &&
                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Role<span style={{ color: "red" }}>*</span></Label>
                                                        <Input
                                                            name="role"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.role}
                                                            onChange={handleInputChange}
                                                            required

                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Role</option>
                                                                {RoleData.map((item, key) => (<option value={item.name} key={key}>{item.name}</option>))}
                                                            </React.Fragment>
                                                        </Input>
                                                    </div>
                                                </Col>
                                            }
                                            {EmailToFlag &&
                                                <Row style={{ display: "-webkit-inline-box" }}>
                                                    {emails.map((email, index) => (
                                                        <Col lg={3} key={index} className="ms-1">
                                                            <Label htmlFor={`email_${index}`} className="form-label">Email To {index + 1}<span style={{ color: "red" }}>*</span>
                                                            </Label>
                                                            <Input
                                                                style={{ margin: "0px 0px 18px 0px" }}
                                                                type="email"
                                                                className="form-control"
                                                                id={`email_${index}`}
                                                                name={`emailTo_${index}`}
                                                                placeholder="Enter Email Id"
                                                                required
                                                                value={email}
                                                                onChange={(e) => handleInputChangeE(index, e)}
                                                            />
                                                        </Col>
                                                    ))}
                                                    <div style={{ display: "inline", margin: "5px 2px 0px -93px" }}>
                                                        <button type="button" onClick={addEmailField} className="btn btn-outline-success btn-light btn-icon waves-effect btn-sm shadow_light" style={{ height: "15px", width: "25px" }}><i class="ri-add-line"></i></button>
                                                        <button type="button" onClick={removeEmailField} className="btn btn-outline-danger btn-light btn-icon waves-effect btn-sm shadow_light ms-3" style={{ height: "15px", width: "25px" }} disabled={emails.length < 2 ? true : false}><i class="ri-subtract-line"></i></button>
                                                    </div>
                                                </Row>
                                            }
                                        </Row>
                                        <Row className="p-2 pt-0">
                                            
                                            <Col lg={3}>
                                                <Label htmlFor="validationDefault03" className="form-label">Email Subject<span style={{ color: "red" }}>*</span></Label>
                                                <Input type="text" required className="form-control"
                                                    id="validationDefault03"
                                                    name="emailSubject"
                                                    placeholder="Enter Email Subject"
                                                    maxlength="100"
                                                    value={values.emailSubject}
                                                    onChange={handleInputChange}
                                                />
                                            </Col>
                                            <Col lg={3}>
                                                <Label htmlFor="validationDefault03" className="form-label">Email Body<span style={{ color: "red" }}>*</span></Label>
                                                <TextArea type="text" required className="form-control" style={{ lineHeight: "1.5" }}
                                                    id="validationDefault03"
                                                    name="emailBody"
                                                    rows={1}
                                                    placeholder="Enter Email Body"
                                                    value={values.emailBody}
                                                    onChange={handleInputChange}
                                                />
                                            </Col>
                                            <Col lg={3}>
                                                <div>
                                                    <Label className="form-label" >Stage</Label>
                                                    <Input
                                                        name="stage"
                                                        type="select"
                                                        className="form-select"
                                                        value={values.stage}
                                                        onChange={handleInputChange}
                                                        //required
                                                    >
                                                        <React.Fragment>
                                                            <option value="" selected>Select Stage</option>
                                                            {stageData.map((item, key) => (<option value={item.locationName} key={key}>{item.locationName}</option>))}
                                                        </React.Fragment>
                                                    </Input>
                                                </div>
                                                {ErrorStage && <p className="mt-2" style={{ color: "red" }}>Please Select Stage</p>}
                                            </Col>
                                            <Col md={3} className="hstack gap-2" style={{ marginTop: "29px", flexDirection: "column", alignItems: "baseline" }}>
                                                <button type="submit" className="btn btn-success" >Submit </button>
                                            </Col>

                                        </Row>
                                    </Form>
                                </CardHeader>
                                <div className="card-body pt-0 mt-3">
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
                                            handleCustomerClick={handleCustomerClicks}
                                            SearchPlaceholder='Search for Email...'
                                            divClass="overflow-auto"
                                            tableClass="width-100"
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
                <ModalHeader className="bg-light p-3" toggle={toggle}>
                    {"Update Details"}
                </ModalHeader>
                <Form className="tablelist-form" onSubmit={handleSubmit}>
                    <ModalBody>
                        <Row className="g-3">
                            <Col lg={4}>
                                <div>
                                    <Label className="form-label" >Stage<span style={{ color: "red" }}>*</span></Label>

                                    <Input
                                        name="stage"
                                        type="select"
                                        className="form-select"
                                        value={values.stage}
                                        onChange={handleInputChange}
                                        //required
                                    >
                                        <option value={""}>{"Select stage"}</option>
                                        {stageData.map((item, key) => (
                                            <option value={item.locationName} key={key}>{item.locationName}</option>)
                                        )}
                                    </Input>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <Label htmlFor="validationDefault03" className="form-label">Email Subject<span style={{ color: "red" }}>*</span></Label>
                                <Input type="text" required className="form-control"
                                    id="validationDefault03"
                                    name="emailSubject"
                                    placeholder="Enter Email Subject"
                                    maxlength="100"
                                    value={values.emailSubject}
                                    onChange={handleInputChange}
                                />
                            </Col>
                            <Col lg={4}>
                                <Label htmlFor="validationDefault03" className="form-label">Email Body<span style={{ color: "red" }}>*</span></Label>
                                <TextArea type="text" required className="form-control" style={{ lineHeight: "1.5" }}
                                    id="validationDefault03"
                                    name="emailBody"
                                    rows={1}
                                    placeholder="Enter Email Body"
                                    value={values.emailBody}
                                    onChange={handleInputChange}
                                />
                            </Col>
                            {RoleFlagEdit &&
                                <Col lg={4}>
                                    <div>
                                        <Label className="form-label" >Role<span style={{ color: "red" }}>*</span></Label>
                                        <Input
                                            name="role"
                                            type="select"
                                            className="form-select"
                                            value={values.role}
                                            onChange={handleInputChange}
                                            required

                                        >
                                            <React.Fragment>
                                                <option value="" selected>Select Role</option>
                                                {RoleData.map((item, key) => (<option value={item.name} key={key}>{item.name}</option>))}
                                            </React.Fragment>
                                        </Input>
                                    </div>
                                </Col>
                            }
                            {EmailToFlagEdit &&
                                <Col lg={4}>
                                    <Label htmlFor="validationDefault03" className="form-label">Email To<span style={{ color: "red" }}>*</span> </Label>
                                    <Input type="text" className="form-control"
                                        id="validationDefault03"
                                        name="emailTo"
                                        placeholder="Enter Email Id"
                                        value={values.emailTo}
                                        title={values.emailTo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            }
                        </Row>
                        <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                            <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                            <button type="submit" className="btn btn-success"> {"Update"} </button>
                        </Col>

                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </Form>
            </Modal>


        </React.Fragment>
    );
};

export default AutoMailer;
