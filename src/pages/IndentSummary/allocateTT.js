import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, CardBody, Collapse } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import * as moment from "moment";
import CountUp from "react-countup";
import FeatherIcon from "feather-icons-react";
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import '../IndentSummary/indentSummary.css';
import TableContainer from "../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../Components/Common/Loader";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import classnames from "classnames";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";


const useStyles = makeStyles({
    customTextField: {
        "& input::placeholder": {
            fontSize: "0.9rem"
        }
    }
});

const AllocateTT = ({ toggle, allData, firstTimeFunction }) => {
    console.log(allData)
    const history = useNavigate();
    const [index, setIndex] = useState("");
    const classes = useStyles();
    const [formValues, setFormValues] = useState([{ lrNumber: "", Vehicle_Capacity: "" }]);
    const [vehicle, setVehicle] = useState([""]);
    const [driver, setDriver] = useState([""]);
    const [cleaner, setCleaner] = useState([""]);
    const [isButton, setButton] = useState(false);
    const [quota, setQuota] = useState([]);
    const [pendingQuota, setPendingQuota] = useState([]);
    const [latestQuantity, setLatestQuantity] = useState(allData.pendingQuantity);


    useEffect(() => {
        getVehicleData();
        getDriverData();
        getCleanerData();
        getQuotaFunction();
        // const close = document.getElementsByClassName(
        //     "MuiAutocomplete-clearIndicator"
        // )[0];
        // close.addEventListener("click", () => {
        //     alert("Add your Own Functionality Here...");
        // });
    }, []);

    const getVehicleData = (() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/TTAllotment/getVehicleDetailsByTransporterCode?transporter=${obj.data._id}&userCode=${allData.indentPlaceBy}`)
            .then(res => {
                const data = res;
                setVehicle(data);
            });
    });

    const getDriverData = (() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/TTAllotment/getDriverCode?transporter=${obj.data._id}`)
            .then(res => {
                const data = res;
                setDriver(data);
            });
    });

    const getCleanerData = (() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/TTAllotment/getCleanerCode?transporter=${obj.data._id}`)
            .then(res => {
                const data = res;
                setCleaner(data);
            });
    });

    const getQuotaFunction = () => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let customerCode = obj.data._id;
        let ProductID = localStorage.getItem("ProductID");
        axios.get(`http://localhost:8043/sapModule/getCustomerQuotabyProductCode?customerCode=${allData.indentPlaceBy}&productCode=${allData.product}`)
            .then(res => {
                setQuota(res.quota_allotted);
                setPendingQuota(res.pending_quota);
            })
            .catch(err => {
                console.log(err)
            })
    }


    const [tableData, setTableData] = useState([]);
    const [formObject, setFormObject] = useState({ vehicleNumber: "", vehicleCapacity: "", quantityAlloted: "", driverCode: "", driverName: "", cleanerCode: "", cleanerName: "", lrNumber: "", lrDate: "", });
    const [UOMCapacity, setUOMCapacity] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [driverName, setDriverName] = useState("");
    const [cleanerName, setCleanerName] = useState("");
    const [values, setValues] = useState([0]);
    const [values1, setValues1] = useState([0]);
    const [values2, setValues2] = useState([0]);
    const [error, setError] = useState(false);
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const onValChange = (event) => {
        const value = (res) => ({
            ...res,
            [event.target.name]: event.target.value,
        });
        setFormObject(value);
    };
    const onTagsChange = (i, values) => {
        if (values) {
            setValues(values);
            const value = (res) => ({
                ...res,
                ["vehicleNumber"]: values.vehicleNumber,
                ["vehicleCapacity"]: values.uomCapacity,
                ["quantityAlloted"]: values.uomCapacity,
            });
            setFormObject(value);
            setUOMCapacity(values.uomCapacity);
            setVehicleNumber(values.vehicleNumber);
            setError("");
            setError1("");
            setError2("");
        }
    }
    const onTagsChange1 = (i, values) => {
        
        if (values) {
            setValues1(values);
            const value = (res) => ({
                ...res,

                ["driverCode"]: values.driver_code,
                ["driverName"]: values.firstname,
            });
            setFormObject(value);
            setDriverName(values.firstname);
            setError("");
            setError1("");
            setError2("");
        }
    }
    const onTagsChange2 = (i, values) => {
        setValues2(values);
        if (values) {
            const value = (res) => ({
                ...res,
                ["cleanerCode"]: values.cleaner_code,
                ["cleanerName"]: values.name,
            });
            setFormObject(value);
            setCleanerName(values.name);
            setError("");
            setError1("");
            setError2("");
        }
    }
    const datefilter = (event) => {
        
        const ISODate = event[0].toISOString();
        //const date = event.toString().split(" ");
        //const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();

        const value = (tableData) => ({
            ...tableData,
            ["lrDate"]: ISODate,
        });
        setFormObject(value);
    };


    const onFormSubmit = (event) => {
        
        event.preventDefault();
        setError(false);
        setError1(false);
        setError2(false);
        const checkVal = !Object.values(formObject).every((res) => res === "");
        //alert(JSON.stringify(formObject));
        var vehicleCapacity = parseInt(formObject.vehicleCapacity);
        var quantity = latestQuantity;
        if (quantity !== 0) {
            // if (LatestVehicleNumber === vehicleNumber) {
            var oldItems = localStorage.getItem('vehicleA') ? JSON.parse(localStorage.getItem('vehicleA')) : [];
            var oldItems1 = localStorage.getItem('driver') ? JSON.parse(localStorage.getItem('driver')) : [];
            var oldItems2 = localStorage.getItem('cleaner') ? JSON.parse(localStorage.getItem('cleaner')) : [];
            if (vehicleNumber) {
                let test = values.vehicleNumber;
                if (driverName) {
                    let test1 = values1.driver_code;
                    if (cleanerName) {
                        let test2 = values2.cleaner_code;
                        if (oldItems.includes(test)) {
                            setError("Duplicate vehicle not allowed.");
                        }
                        else {
                            if (driverName) {
                                if (oldItems1.includes(test1)) {
                                    setError1("Duplicate driver not allowed.");
                                }
                                else {
                                    if (cleanerName) {
                                        if (oldItems2.includes(test2)) {
                                            setError2("Duplicate Cleaner not allowed.");
                                        }
                                        else {
                                            if (quantity === vehicleCapacity || quantity > vehicleCapacity) {
                                                if (checkVal) {
                                                    const dataObj = (data) => [...data, formObject];
                                                    setTableData(dataObj);
                                                    setLatestQuantity(quantity - vehicleCapacity)

                                                    const isEmpty = { vehicleNumber: "", vehicleCapacity: "", quantityAlloted: "", driverCode: "", driverName: "", cleanerCode: "", cleanerName: "", lrNumber: "", lrDate: "", };
                                                    setFormObject(isEmpty);
                                                    setVehicleNumber("")
                                                    setUOMCapacity("");
                                                    setValues(null);
                                                    setValues1(null);
                                                    setValues2(null);
                                                    setDriverName("");
                                                    setCleanerName("");
                                                    setButton(true);
                                                    oldItems.push(test);
                                                    localStorage.setItem('vehicleA', JSON.stringify(oldItems));
                                                    oldItems1.push(test1);
                                                    localStorage.setItem('driver', JSON.stringify(oldItems1));
                                                    oldItems2.push(test2);
                                                    localStorage.setItem('cleaner', JSON.stringify(oldItems2));
                                                    setError("");
                                                    setError1("");
                                                    setError2("");
                                                }
                                            }
                                            else {
                                                setError("Vehicle Capacity Exceeding!");
                                                const isEmpty = { vehicleNumber: "", vehicleCapacity: "", quantityAlloted: "", driver_code: "", driverName: "", cleanerCode: "", cleanerName: "", lrNumber: "", lrDate: "", };
                                                setFormObject(isEmpty);
                                                setVehicleNumber("")
                                                setUOMCapacity("");
                                                setValues(null);
                                                setValues1(null);
                                                setValues2(null);
                                                setDriverName("");
                                                setCleanerName("");
                                                //if (allData.unitMeasurement === "KL") {setButton(false)}
                                            }
                                        }
                                    }
                                    else {
                                        setError2("Please select mandatory fields.");
                                    }
                                }
                            }
                            else {
                                setError1("Please select mandatory fields.");
                            }
                        }
                    }
                    else {
                        setError2("Please select mandatory fields.");
                    }
                }
                else {
                    setError1("Please select mandatory fields.");
                }
            }
            else {
                setError("Please select mandatory fields.");
            }
        }
        else {
            setError("Vehicle Capacity Exceeding!");
        }

    };


    const tableRowRemove = (index, thisCapacity, vehicleNumber, driverCode, cleanerCode) => {
        
        //alert(JSON.stringify(tableData));
        const rows = [...tableData];
        rows.splice(index, 1);
        setTableData(rows);
        setLatestQuantity(latestQuantity + parseInt(thisCapacity));
        var oldItems = localStorage.getItem('vehicleA') === null ? [] : JSON.parse(localStorage.getItem('vehicleA'));
        oldItems = oldItems.filter(e => e !== vehicleNumber);
        localStorage.setItem('vehicleA', JSON.stringify(oldItems));
        var oldItems1 = localStorage.getItem('driver') === null ? [] : JSON.parse(localStorage.getItem('driver'));
        oldItems1 = oldItems1.filter(e => e !== driverCode);
        localStorage.setItem('driver', JSON.stringify(oldItems1));
        var oldItems2 = localStorage.getItem('cleaner') === null ? [] : JSON.parse(localStorage.getItem('cleaner'));
        oldItems2 = oldItems2.filter(e => e !== cleanerCode);
        localStorage.setItem('cleaner', JSON.stringify(oldItems2));
        if (rows.length === 0) {
            setButton(false);
            setError(false);
            setError1(false);
            setError2(false);
        }
    }

    let handleSubmit = async (event) => {
        
        event.preventDefault();
        const latestTdata = [...tableData]
        const finalData = latestTdata.map(v => ({ ...v, "customerCode": allData.indentPlaceBy, "indentNo": allData.indentNo, "materialCode": allData.product, "materialName": allData.mateialName, "quantity": allData.quantity, "transporterCode": allData.transporterId }))

        console.log(finalData)
        try {
            const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/TTAllotment/saveTtAllotment`, finalData)
            console.log(res);
            if (res !== null) {
                toast.success("TT Allocated Successfully", { autoClose: 3000 });
                localStorage.setItem('vehicleA', []);
                localStorage.setItem('driver', []);
                localStorage.setItem('cleaner', []);
                toggle();
                callJBPMFunction();
                firstTimeFunction();
            }
        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
            toggle();
        }
    }

    const callJBPMFunction = (() => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/TTAllotment/getCleanerCode?transporter=${allData.indentNo}`)
            .then(res => {
                console.log("JBPM Approve function successfully executed.");
            });
    });



    return (
        <React.Fragment>

            <Form className="tablelist-form" onSubmit={onFormSubmit}>

                <ModalBody className="pt-1" style={{ paddingBottom: "30px" }}>
                    <div class="ribbon-three ribbon-three1 ribbon-three-success"><span style={{ width: "153px", fontWeight: "bold", marginRight: "10px", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Quantity : {allData.quantity} {allData.unitMeasurement}</span></div>
                    <div class="ribbon-three ribbon-three1 ribbon-three-success"><span style={{ width: "200px", fontWeight: "bold", marginRight: "10px", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", right: "170px" }}>Pending Quantity : {latestQuantity} {allData.unitMeasurement} </span></div>

                    <Row className="g-2 mt-4">
                        <Col sm={3}>
                            <div className="mb-3">
                                <Label style={{ marginBottom: "14px" }}
                                    htmlFor="billinginfo-lastName"
                                    className="form-label"
                                >
                                    Select Vehicle<span style={{ color: "red" }}>*</span>
                                </Label>

                                <Autocomplete
                                    id="combo-box-demo"
                                    name="Vehicle_Number"
                                    disableClearable={true}
                                    options={vehicle}
                                    value={values}
                                    getOptionLabel={(option) => (option.vehicleNumber) ? `${option.vehicleNumber} / ${option.uomCapacity}` : ""}
                                    //getOptionSelected={(option, value) => value.vehicleNumber === option.vehicleNumber }
                                    onOpen={() => {
                                        setIndex(index);
                                    }}
                                    onChange={onTagsChange}
                                    renderInput={(params) => {
                                        return (
                                            <>
                                                <TextField {...params} variant="outlined" placeholder="Select" size="small" />
                                            </>
                                        );
                                    }}
                                    PaperComponent={({ children }) => {
                                        return (
                                            <Paper>
                                                {children}
                                                <Button
                                                    color="primary"
                                                    fullWidth
                                                    sx={{ justifyContent: "flex-start", pl: 2 }}
                                                    onMouseDown={() => {
                                                        console.log("Add new");
                                                        history("/vehicle");
                                                    }}
                                                >
                                                    + Add Vehicle
                                                </Button>
                                            </Paper>
                                        );
                                    }}
                                />
                            </div>
                            <p style={{ color: "red" }}>{error}</p>
                        </Col>
                        <Col lg={3}>
                            <div>
                                <Label
                                    className="form-label"
                                >
                                    Vehicle Capacity
                                </Label>
                                <input type="number" name="Vehicle_Capacity" className="form-control" value={UOMCapacity} readonly disabled />
                            </div>
                        </Col>
                        <Col sm={3}>
                            <div className="mb-3">
                                <Label
                                    style={{ marginBottom: "14px" }}
                                    htmlFor="billinginfo-lastName"
                                    className="form-label"
                                >
                                    Select Driver<span style={{ color: "red" }}>*</span>
                                </Label>

                                <Autocomplete
                                    id="combo-box-demo"
                                    Vehicle_Number
                                    options={driver}
                                    value={values1}
                                    getOptionLabel={(option) => option.driver_code ? option.driver_code : ""}
                                    //getOptionSelected={(option, value) => value.driver_code === option.driver_code }
                                    onChange={onTagsChange1}
                                    renderInput={(params) => {
                                        return (
                                            <>
                                                <TextField {...params} variant="outlined" placeholder="Select" size="small" />
                                            </>
                                        );
                                    }}
                                    PaperComponent={({ children }) => {
                                        return (
                                            <Paper>
                                                {children}
                                                <Button
                                                    color="primary"
                                                    fullWidth
                                                    sx={{ justifyContent: "flex-start", pl: 2 }}
                                                    onMouseDown={() => {
                                                        console.log("Add new");
                                                        history("/driver");
                                                    }}
                                                >
                                                    + Add Driver
                                                </Button>
                                            </Paper>
                                        );
                                    }}
                                />
                            </div>
                            <p style={{ color: "red" }}>{error1}</p>
                        </Col>
                        <Col lg={3}>
                            <div>
                                <Label
                                    className="form-label"
                                >
                                    Driver Name
                                </Label>
                                <input type="text" name="Driver_Name" className="form-control" value={driverName} eadOnly disabled />
                            </div>
                        </Col>

                        <Col sm={3}>
                            <div className="mb-3">
                                <Label
                                    style={{ marginBottom: "14px" }}
                                    htmlFor="billinginfo-lastName"
                                    className="form-label"
                                >
                                    Select Cleaner<span style={{ color: "red" }}>*</span>
                                </Label>

                                <Autocomplete
                                    id="combo-box-demo"
                                    options={cleaner}
                                    value={values2}
                                    getOptionLabel={(option) => option.cleaner_code ? option.cleaner_code : ""}
                                    //getOptionSelected={(option, value) => value.cleaner_code === option.cleaner_code }
                                    onChange={onTagsChange2}
                                    renderInput={(params) => {
                                        return (
                                            <>
                                                <TextField {...params} variant="outlined" placeholder="Select" size="small" />
                                            </>
                                        );
                                    }}
                                    PaperComponent={({ children }) => {
                                        return (
                                            <Paper>
                                                {children}
                                                <Button
                                                    color="primary"
                                                    fullWidth
                                                    sx={{ justifyContent: "flex-start", pl: 2 }}
                                                    onMouseDown={() => {
                                                        console.log("Add new");
                                                        history("/cleaner");
                                                    }}
                                                >
                                                    + Add Cleaner
                                                </Button>
                                            </Paper>
                                        );
                                    }}
                                />
                            </div>
                            <p style={{ color: "red" }}>{error2}</p>
                        </Col>
                        <Col lg={3}>
                            <div>
                                <Label
                                    className="form-label"
                                >
                                    Cleaner Name
                                </Label>
                                <input type="text" name="Cleaner_Name" className="form-control" value={cleanerName} readonly disabled />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div>
                                <Label className="form-label" >LR Number</Label>
                                <input type="number" name="lrNumber" className="form-control" placeholder="Enter LR Number" onChange={onValChange} value={formObject.lrNumber} />
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div>
                                <Label className="form-label">LR Date</Label>
                                <Flatpickr
                                    className="form-control"
                                    options={{
                                        dateFormat: "d M, Y"
                                    }}
                                    returnFormat="iso8601"
                                    placeholder="Select LR Date"
                                    onChange={(e) => datefilter(e)}
                                    name="LR_Date"
                                    value={formObject.lrDate}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row className="mt-2" style={{ alignItems: "end", alignContent: "end", justifyContent: "end" }}>
                        <Col lg={2}><div className="d-grid">
                            <input
                                type="submit"
                                onClick={onFormSubmit}
                                className="btn btn-warning"
                                id={"Add_Vehicle"}
                                value="Add Vehicle"
                            />
                        </div>
                        </Col>
                    </Row>


                    {tableData.length !== 0 &&
                        <table className="table mt-4">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Vehicle Number</th>
                                    <th>Vehicle Capacity</th>
                                    <th>Driver Code</th>
                                    <th>Driver Name</th>
                                    <th>Cleaner Code</th>
                                    <th>Cleaner Name</th>
                                    <th>LR Number</th>
                                    <th>LR Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((data, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data.vehicleNumber}</td>
                                            <td>{data.vehicleCapacity}</td>
                                            <td>{data.driverCode}</td>
                                            <td>{data.driverName}</td>
                                            <td>{data.cleanerCode}</td>
                                            <td>{data.cleanerName}</td>
                                            <td>{data.lrNumber}</td>
                                            <td>{(data.lrDate).split('T')[0]}</td>
                                            <td><button className="btn btn-sm btn-danger" onClick={() => tableRowRemove(index, data.vehicleCapacity, data.vehicleNumber, data.driverCode, data.cleanerCode)}>Delete</button></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    }
                    {isButton &&
                        <Row className="g-2 mt-2" style={{ alignItems: "end", alignContent: "end", justifyContent: "end" }}>

                            <Col lg={2}><div className="d-grid">
                                <input
                                    type="button"
                                    className="btn btn-success"
                                    value="Submit"
                                    onClick={handleSubmit}
                                />
                            </div>
                            </Col>
                        </Row>
                    }
                </ModalBody>

            </Form>

        </React.Fragment>
    )
}

export default AllocateTT;