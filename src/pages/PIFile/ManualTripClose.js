import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner } from "reactstrap";

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
import LoaderNew from "../../Components/Common/Loader_new";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";


const initialValues = {
    input: "",
    movement: "",
};

const ManualTripClose = () => {
    const [customers, setCustomer] = useState([]);
    const [stageData, setStageData] = useState([]);
    const [movementData, setMovementData] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalMulti, setDeleteModalMulti] = useState(false);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [Plant_Code, setPlantCode] = useState('');
    const [latestHeader, setLatestHeader] = useState('');
    const [ErrorInput, setErrorInput] = useState(false);
    const [ErrorInput1, setErrorInput1] = useState(false);
    const [errorParameter, setErrorParameter] = useState(false);

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
        getMovementData(plantcode);
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
        customers.forEach((row1) => {
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
        FileSaver.saveAs(blob, 'Trip-Close.xlsx');
    
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

    // Update Data
    const handleCustomerClick = useCallback((arg) => {
        const customer = arg;

        setCustomer({
            _id: customer._id,
            customer: customer.customer,
            email: customer.email,
            phone: customer.phone,
            date: customer.date,
            status: customer.status
        });
        toggle();
    }, [toggle]);

    // Checked All
    const checkedAllCheckBox = useCallback(() => {
        debugger;
        debugger;
        const checkall = document.getElementById("checkBoxAll");
        const ele = document.querySelectorAll(".customerCheckBox");

        if (checkall.checked) {
            ele.forEach((ele) => {
                ele.checked = true;
            });
        } else {
            ele.forEach((ele) => {
                ele.checked = false;
            });
        }
        selectSingleCheckBox();
    }, []);


    // Customers Column
    const columns = useMemo(
        () => [
            {
                Header: <input type="checkbox" className="form-check-input" id="checkBoxAll" onClick={() => checkedAllCheckBox()} />,
                Cell: (cellProps) => {
                    return <input type="checkbox" className="customerCheckBox form-check-input" value={cellProps.row.original.vehicleNumber} onChange={() => selectSingleCheckBox()} />;
                },
                id: '#',
            },
            {
                Header: '',
                accessor: 'id',
                hiddenColumns: true,
                Cell: (cell) => {
                    return <input type="hidden" value={cell.value} />;
                }
            },
            {
                Header: "Vehicle No",
                accessor: "vehicleNumber",
                filterable: true,
            },
            {
                Header: "Trip",
                accessor: "tripId",
                filterable: true,
            },
            {
                Header: "Material Name",
                accessor: "material",
                filterable: true,
            },
            {
                Header: "Movement",
                accessor: "movementCode",
                Cell: (cellProps) => {
                    return cellProps.row.original.movementCode === "IB" ? "InBound" : "OutBound"
                },
            },
            {
                Header: "Stage",
                accessor: "current_stage",
                filterable: true,
            },
            {
                Header: "Time",
                accessor: "current_stage_time",
                filterable: true,
            },
        ],
        [handleCustomerClick, checkedAllCheckBox]
    );

    const status = [
        {
            options: [
                { label: "Select Stage", value: "" },
                { label: "GW", value: "GW" },
                { label: "PGI", value: "pgi" },
            ],
        },
    ];

    const getMovementData = (plantCode) => {debugger;
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/plants?plantCode=${plantCode}`, config)
            .then(res => {
                if(res.length !== 0){
                    const blnk = [];
                    if(res[0].movementCheckIB === "Y"){
                        blnk.push("InBound","OutBound");
                    }else{
                        blnk.push("OutBound"); 
                    }
                    setMovementData(blnk);
                }else{
                    setMovementData([]);
                }
               // res.pop();
            });
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        //alert(value);
        if(value === ""){
            setValues({
                ...values,
                [name]: "",
                ["plantCode"]: Plant_Code,
            });
            setStageData([]);
        }else{
            if(value === 'OutBound'){
                axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/movementType/OB/${Plant_Code}`, config)
            .then(res => {
                res.pop();
                setStageData(res);
            });
            }
            if(value === 'InBound'){
                axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/movementType/IB/${Plant_Code}`, config)
            .then(res => {
                res.pop();
                setStageData(res);
            });
            }
            setValues({
                ...values,
                [name]: value,
                ["plantCode"]: Plant_Code,
            });
        }
        
        setCustomer([]);
    };

    const getAllDeviceData = async (e) => {
        const in_put = values.input;
        const movement = values.movement !== "" ? (values.movement === "InBound" ? "IB" : "OB") : "";
        if (in_put === "") {
            setErrorInput(true);
            setErrorInput1(false);
        }else if (movement === "") {
            setErrorInput1(true);
            setErrorInput(false);
        }
        else {
            setErrorParameter(true);
            setErrorInput(false);
            setErrorInput1(false);
            const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/manualTripClose/getActiveTrip?plantCode=${Plant_Code}&input=${in_put}&movement=${movement}`, config)
                .then(res => {
                    if (res.msg) {
                        setCustomer([]);
                        toast.error("No Data Found.", { autoClose: 3000 });
                        setErrorParameter(false);
                    }
                    else {
                        setErrorParameter(false);
                        setCustomer(res);
                    }
                });
        }
    }

    const [cancelModal, setCancelModal] = useState(false);
    const [Remarks, setRemarks] = useState('');
    const [disabled1, setDisabled1] = useState(true);
    const openRemarksModal = () => {
        setCancelModal(!cancelModal);
    };

    const handleCancelRemarks = (event) => {

        //var data = event.target.value;
        if (event.target.value === "") {
            setDisabled1(true);
            setRemarks("");
        }
        else {
            setDisabled1(false);
            setRemarks(event.target.value);

        }
    };

    // Delete Multiple
    const [selectedCheckBox, setselectedCheckBox] = useState([]);
    const [CloseTripButton, setCloseTripButton] = useState(false);

    const openRemarks = () => {
        openRemarksModal();
    };

    const selectSingleCheckBox = () => {
        debugger;
        const ele = document.querySelectorAll(".customerCheckBox:checked");
        ele.length > 0 ? setCloseTripButton(true) : setCloseTripButton(false);
        setselectedCheckBox(ele);
    };

    const closeTripFunction = async () => {
        debugger;

        try {
            const arr = [];
            selectedCheckBox.forEach((element) => {
                arr.push(element.value);
                setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
            });
            console.log(arr);
            const obj = JSON.parse(sessionStorage.getItem("authUser"));
            let userId = obj.data._id;
            const data = { "plantCode": Plant_Code, "vehicleNo": arr, "remarks": Remarks, "userId": userId};
            console.log(data);
            setErrorParameter(true);
            await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/manualTripClose/trip`, data, config)
                .then(res => {
                    if ((res.msg).includes("Trip successfully")) {
                        toast.success(res.msg, { autoClose: 3000 });
                        setRemarks('');
                        const checkall = document.getElementById("checkBoxAll");
                        const ele = document.querySelectorAll(".customerCheckBox");
                        setCloseTripButton(false);
                        checkall.checked = false;
                        ele.forEach((ele) => {
                            ele.checked = false;
                        });
                        getAllDeviceData();
                        setErrorParameter(false);
                    }
                    else {
                        toast.error(res.msg, { autoClose: 3000 });
                        setErrorParameter(false);
                    }
                })
        } catch (e) {
            toast.error(e, { autoClose: 3000 });
            setErrorParameter(false);
        }
        openRemarksModal();
    };



    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);


    document.title = "Manual Trip Close | EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    onDownloadClick={handleDownload}
                    data={customers}
                />
                <Container fluid>
                    <BreadCrumb title={"Manual Trip Close"} pageTitle="Configuration" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Trip Details</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>

                                                {CloseTripButton && <button className="btn btn-danger waves-effect waves-light me-3" onClick={() => openRemarks()}>Close Trip</button>}
                                                <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                </button>
                                            </div>
                                        </div>
                                    </Row>

                                    <Row className="mt-4 p-2">
                                        <Col lg={3}>
                                            <div>
                                                <Label className="form-label" >Movement</Label>
                                                <Input
                                                    name="movement"
                                                    type="select"
                                                    className="form-select"
                                                    value={values.movement}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="">{"Select Movement"}</option>
                                                    {movementData && movementData.map((item, key) => (
                                                        <React.Fragment key={key}>
                                                            {<option value={item} >{item}</option>}
                                                        </React.Fragment>
                                                    ))}
                                                </Input>
                                            </div>
                                            {ErrorInput1 && <p className="mt-2" style={{ color: "red" }}>Please Select Movement</p>}
                                        </Col>

                                        <Col lg={3}>
                                            <div>
                                                <Label className="form-label" >Stage</Label>
                                                <Input
                                                    name="input"
                                                    type="select"
                                                    className="form-select"
                                                    value={values.input}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="" >{"Select Stage"}</option>
                                                    {stageData.map((item, key) => (
                                                        <React.Fragment key={key}>
                                                            {<option value={item.locationName} >{item.locationName}</option>}
                                                        </React.Fragment>
                                                    ))}
                                                </Input>
                                            </div>
                                            {ErrorInput && <p className="mt-2" style={{ color: "red" }}>Please Select Stage</p>}
                                        </Col>

                                        <Col lg={3} className="hstack gap-2" style={{ marginTop: "28px", display: "block" }}>
                                            <button type="button" className="btn btn-success" onClick={getAllDeviceData}>{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Searching...</> : "Search"} </button>
                                        </Col>
                                    </Row>




                                </CardHeader>
                                <div className="card-body pt-0 mt-0">
                                    <div>

                                        <TableContainer
                                            columns={columns}
                                            data={customers}
                                            isGlobalFilter={true}
                                            isAddUserList={false}
                                            customPageSize={5}
                                            isGlobalSearch={true}
                                            className="custom-header-css"
                                            //isCustomerFilter={true}
                                            SearchPlaceholder='Search for Vehicle No or something...'
                                            divClass="overflow-auto"
                                        //tableClass="width-200"
                                        />
                                    </div>

                                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
                                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                                            {"Status"}
                                        </ModalHeader>
                                        <ModalBody>

                                        </ModalBody>
                                    </Modal>
                                    <ToastContainer closeButton={false} limit={1} />
                                </div>
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
                }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}><h5 className="text-white fs-20 m-0">Close Trip</h5>
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
                                    value={Remarks}
                                    onChange={handleCancelRemarks}
                                />
                            </div>
                        </Col>
                        <div className="text-center">
                            <button type="button" className="btn btn-danger" onClick={closeTripFunction} disabled={disabled1}>{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Submitting...</> : "Submit"} </button>
                        </div>

                    </Row>
                </ModalBody>
            </Modal>


        </React.Fragment>
    );
};

export default ManualTripClose;
