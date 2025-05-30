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
import { object } from "yup";


const useStyles = makeStyles({
    customTextField: {
        "& input::placeholder": {
            fontSize: "0.9rem"
        }
    }
});

const AllocateTTMannual = ({ toggle, allData, firstTimeFunction }) => {
    
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
        axios.get(`http://localhost:8043/sapModule/getVehiclesByCustomerCode?customerCode=${allData.indentPlaceBy}&productCode=${allData.product}`)
            .then(res => {
                const data = res;
                setVehicle(data);
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
    const [formObject, setFormObject] = useState({ vehicleNumber: "", vehicleCapacity: "", quantityAlloted: "" });
    const [UOMCapacity, setUOMCapacity] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [values, setValues] = useState([0]);
    const [error, setError] = useState(false);
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
        }
    }

    const onFormSubmit = (event) => {
        
        event.preventDefault();
        setError(false);
        const checkVal = !Object.values(formObject).every((res) => res === "");
        //alert(JSON.stringify(formObject));
        var vehicleCapacity = parseInt(formObject.vehicleCapacity);
        var quantity = latestQuantity;
        if (quantity !== 0) {
            // if (LatestVehicleNumber === vehicleNumber) {
            var oldItems = localStorage.getItem('vehicle') === "" ? [] : JSON.parse(localStorage.getItem('vehicle'));
            let test = values.vehicleNumber;
            if (oldItems.includes(test)) {
                setError("Duplicate vehicle not allowed.");
            }
            else {
                if (checkVal !== false) {
                    if (quantity === vehicleCapacity || quantity > vehicleCapacity) {
                        if (checkVal) {
                            const dataObj = (data) => [...data, formObject];
                            setTableData(dataObj);
                            setLatestQuantity(quantity - vehicleCapacity)

                            const isEmpty = { vehicleNumber: "", vehicleCapacity: "", quantityAlloted: "" };
                            setFormObject(isEmpty);
                            setUOMCapacity("");
                            setValues(null);
                            setButton(true);
                            oldItems.push(test);
                            localStorage.setItem('vehicle', JSON.stringify(oldItems));
                            setError("");
                        }
                    }
                    else {
                        setError("Vehicle Capacity Exceeding!");
                        const isEmpty = { vehicleNumber: "", vehicleCapacity: "", quantityAlloted: "" };
                        setFormObject(isEmpty);
                        setUOMCapacity("");
                        setValues(null);
                        //if (allData.unitMeasurement === "KL") {setButton(false)}
                    }
                }
                else {
                    setError("Please select mandatory fields.");
                }
            }
        }
        else {
            setError("Vehicle Capacity Exceeding!");
        }

    };


    const tableRowRemove = (index, thisCapacity, vehicleNumber) => {
        //alert(JSON.stringify(tableData));
        const rows = [...tableData];
        rows.splice(index, 1);
        setTableData(rows);
        setLatestQuantity(latestQuantity + thisCapacity);
        var oldItems = localStorage.getItem('vehicle') === "" ? [] : JSON.parse(localStorage.getItem('vehicle'));
        oldItems = oldItems.filter(e => e !== vehicleNumber);
        localStorage.setItem('vehicle', JSON.stringify(oldItems));
        if (rows.length === 0) {
            setButton(false);
            setError(false);
        }
    }

    let handleSubmit = async (event) => {
        
        event.preventDefault();
        // let values = {};
        // values["customerCode"] = allData.indentPlaceBy;
        // values["indentNo"] = allData.indentNo;
        // values["materialCode"] = allData.product;
        // values["materialName"] = allData.mateialName;
        // values["quantity"] = allData.pendingQuantity;
        // values["transporterCode"] = allData.transporterId;


        // let employee = {
        //     ...values,
        //     ...formObject

        // };
        // var arr = []
        // arr.push(employee)
        // console.log(arr)
        const latestTdata = [...tableData]
        const finalData = latestTdata.map(v => ({ ...v, "customerCode": allData.indentPlaceBy, "indentNo": allData.indentNo, "materialCode": allData.product, "materialName": allData.mateialName, "quantity": allData.quantity, "transporterCode": allData.transporterId }))

        console.log(finalData)
        try {
            const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/TTAllotment/saveTtAllotment`, finalData)
            console.log(res);
            if (res !== null) {
                toast.success("TT Allocated Successfully", { autoClose: 3000 });
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
                    {/* <div class="ribbon-three ribbon-three1 ribbon-three-success"><span style={{ width: "153px", fontWeight: "bold", marginRight: "10px", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Quantity :  {latestQuantity} {allData.unitMeasurement}</span></div>
                    <div class="ribbon-three ribbon-three1 ribbon-three-success"><span style={{ width: "200px", fontWeight: "bold", marginRight: "10px", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", right: "170px" }}>Pending Quantity :  {allData.pendingQuantity} {allData.unitMeasurement}</span></div> */}

                    <Row className="g-2 mt-4">
                        <Col lg={4}>
                            <div>
                                <Label
                                    className="form-label"
                                >
                                    Material Name
                                </Label>
                                <input className="form-control" value={`${allData.mateialName}`} readonly disabled />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div>
                                <Label
                                    className="form-label"
                                >
                                    Material Code
                                </Label>
                                <input className="form-control" value={`${allData.product}`} readonly disabled />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div>
                                <Label
                                    className="form-label"
                                >
                                    Quantity
                                </Label>
                                <input className="form-control" value={`${allData.quantity} ${allData.unitMeasurement}`} readonly disabled />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div>
                                <Label
                                    className="form-label"
                                >
                                    Pending Quantity
                                </Label>
                                <input className="form-control" value={`${latestQuantity} ${allData.unitMeasurement}`} readonly disabled />
                            </div>
                        </Col>
                        <Col sm={4}>
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

                        <Col lg={4}>
                            <div>
                                <Label
                                    className="form-label"
                                >
                                    Vehicle Capacity
                                </Label>
                                <input type="number" name="Vehicle_Capacity" className="form-control" value={UOMCapacity} readonly disabled />
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
                                            <td><button className="btn btn-sm btn-danger" onClick={() => tableRowRemove(index, data.vehicleCapacity, data.vehicleNumber)}>Delete</button></td>
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

export default AllocateTTMannual;