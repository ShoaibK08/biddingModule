import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, CardBody, Collapse } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import '../IndentSummary/indentSummary.css';
import 'react-toastify/dist/ReactToastify.css';
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import axios from "axios";
const useStyles = makeStyles({
    customTextField: {
        "& input::placeholder": {
            fontSize: "0.9rem"
        }
    }
});

const ViewIndentDiversion = (data) => {
    console.log(JSON.stringify(data))
    const [isTransporter, setTransporterSession] = useState(false)
    const [isCustomerwithDEOSession, setCustomerwithDEOSession] = useState(false)
    const [isSoldTOSession, setSoldTOSession] = useState(false)
    const [isAreaManagerSession, setAreaManagerSession] = useState(false)
    const [isCustomerSession, setCustomerSession] = useState(false)
    const [date, setDate] = useState('')
    const [indentNumber, setIndentNumber] = useState('')
    const [indentPlaceBy, setindentPlaceBy] = useState('')
    const [TTDetails, setTTDetails] = useState([]);
    const [TTDetailsBlank, setTTDetailsBlank] = useState("");

    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let str = obj.data._id;
        if (str.includes("TRAN")) {
            setTransporterSession(true)
        }
        else {
            setTransporterSession(false)
        }
        if (str.includes("CU") && data.data.singleData.shipmentType === "DEO") {
            setCustomerwithDEOSession(true)
        }
        else {
            setCustomerwithDEOSession(false)
        }
        if (str.includes("CU") && data.data.singleData.shipmentType !== "DEO") {
            setCustomerSession(true)
        }
        else {
            setCustomerSession(false)
        }
        if (str.includes("SO")) {
            setSoldTOSession(true)
        }
        else {
            setSoldTOSession(false)
        }
        if (str.includes("AREA")) {
            setAreaManagerSession(true)
        }
        else {
            setAreaManagerSession(false)
        }
        if (data && (data.data.singleData).length !== 0) {
            const date = (data.data.singleData.productDate).split("T")[0];
            setDate(date)
            setIndentNumber(data.data.singleData.indentNo)
            setindentPlaceBy(data.data.singleData.indentPlaceBy)
        }
        getTTDetails();
    })

    const getTTDetails = async () => {
        
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/TTAllotment/getDetailsByIndentNoAndCustomerCode?indentNo=${indentNumber}&customerCode=${indentPlaceBy}`);
            const TTDetails = response;

            if (TTDetails.length === 0) {
                setTTDetailsBlank("");
                setTTDetails("");
            } else {
                setTTDetails(TTDetails);
                setTTDetailsBlank("1");
            }
            console.log(TTDetails)
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <React.Fragment>
            <ModalBody className="ribbon-box border shadow-none right mb-lg-0">
                {isTransporter && < h4 className="text-success mb-4"><b>Vehicle Details</b></h4>}
                {isCustomerwithDEOSession && < h4 className="text-success mb-4"><b>Vehicle Details</b></h4>}
                <div class="ribbon ribbon-info round-shape">Indent Qunatity : {data.data.singleData.quantity} {data.data.singleData.unitMeasurement}</div>

                {isTransporter &&
                    <Row >
                        {(TTDetails || []).map((details, key) => (
                            <Col xxl={4} lg={4} key={key}>

                                <Card className="pricing-box ribbon-box left shadow" >
                                    <div className="ribbon-two ribbon-two-success"><span className="fs-10">{details.vehicleNumber}</span></div>
                                    <CardBody className="bg-light m-2 p-2" style={{ fontSize: "12px" }}>

                                        <table >
                                            <tr>
                                                <th>Material Name121 :</th>
                                                <td>{details.material_name}</td>
                                            </tr>
                                            <tr>
                                                <th>Material Code :</th>
                                                <td>{details.material_code}</td>
                                            </tr>
                                            <tr>
                                                <th>Material Quantity :</th>
                                                <td>{details.quantity}</td>
                                            </tr>
                                            <tr>
                                                <th>Driver Code :</th>
                                                <td>{details.driverCode}</td>
                                            </tr>
                                            <tr>
                                                <th>Cleaner Code :</th>
                                                <td>{details.cleanercode}</td>
                                            </tr>

                                        </table>

                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                }

                {isCustomerwithDEOSession && TTDetails &&

                    <Row >
                        {
                            (TTDetails || []).map((details, key) => (
                                <Col xxl={4} lg={4} key={key}>

                                    <Card className="pricing-box ribbon-box left shadow" >
                                        <div className="ribbon-two ribbon-two-success"><span className="fs-10">{details.vehicleNumber}</span></div>
                                        <CardBody className="bg-light m-2 p-2" style={{ fontSize: "12px" }}>

                                            <table >
                                                <tr>
                                                    <th>Material Name12 :</th>
                                                    <td>{details.material_name}</td>
                                                </tr>
                                                <tr>
                                                    <th>Material Code :</th>
                                                    <td>{details.material_code}</td>
                                                </tr>
                                                <tr>
                                                    <th>Material Quantity :</th>
                                                    <td>{details.quantity}</td>
                                                </tr>
                                                <tr>
                                                    <th>Driver Code :</th>
                                                    <td>{details.driverCode}</td>
                                                </tr>
                                                <tr>
                                                    <th>Cleaner Code :</th>
                                                    <td>{details.cleanercode}</td>
                                                </tr>

                                            </table>

                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                    </Row>
                }

                {isCustomerwithDEOSession && !TTDetailsBlank &&

                    <Row >
                        < div className="table-responsive">
                        <table className="table mb-0 mt-4">
                            <tbody>

                                <tr>
                                    <th scope="row" > No Data Found!</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    </Row>
                }

                {isSoldTOSession &&
                    < div className="table-responsive">
                        <table className="table mb-0 mt-4">
                            <tbody>

                                <tr>
                                    <th scope="row" style={{ width: "200px" }}> Material Name123</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.mateialName}</td>
                                    <th scope="row" style={{ width: "200px" }}> Indent Number</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.indentNo}</td>
                                </tr>
                                <tr>
                                    <th scope="row" style={{ width: "200px" }}> Shipment Type</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.shipmentType}</td>
                                    <th scope="row" style={{ width: "200px" }}> Cancellation Status</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.indentCancelStatus}</td>
                                </tr>
                                <tr>
                                    <th scope="row" style={{ width: "200px" }}> Indent Status</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.indentStatus}</td>
                                    <th scope="row" style={{ width: "200px" }}> Indent Placed By</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.indentPlaceBy}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                }

                {isAreaManagerSession &&
                    < div className="table-responsive">
                        <table className="table mb-0 mt-4">
                            <tbody>

                                <tr>
                                    <th scope="row" style={{ width: "200px" }}> Material Name1234</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.mateialName}</td>
                                    <th scope="row" style={{ width: "200px" }}> Indent Number</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.indentNo}</td>
                                </tr>
                                <tr>
                                    <th scope="row" style={{ width: "200px" }}> Shipment Type</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.shipmentType}</td>
                                    <th scope="row" style={{ width: "200px" }}> Unit of Measurement</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.unitMeasurement}</td>
                                </tr>
                                <tr>
                                    <th scope="row" style={{ width: "200px" }}> Indent Status</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.indentStatus}</td>
                                    <th scope="row" style={{ width: "200px" }}> Indent Placed By</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.indentPlaceBy}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                }

                {isCustomerSession &&
                    < div className="table-responsive">
                        <table className="table mb-0 mt-4">
                            <tbody>

                                <tr>
                                    <th scope="row" style={{ width: "200px" }}> Material Name</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.mateialName}</td>
                                    <th scope="row" style={{ width: "200px" }}> Indent Number</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.indentNo}</td>
                                </tr>
                                <tr>
                                    <th scope="row" style={{ width: "200px" }}> Shipment Type</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.shipmentType}</td>
                                    <th scope="row" style={{ width: "200px" }}> Unit of Measurement</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.unitMeasurement}</td>
                                </tr>
                                <tr>
                                    <th scope="row" style={{ width: "200px" }}> Indent Status</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.indentStatus}</td>
                                    <th scope="row" style={{ width: "200px" }}> Indent Placed By</th>
                                    <td style={{ width: "200px" }}>{data.data.singleData.indentPlaceBy}</td>
                                </tr>
                                <tr>
                                    <th scope="row" style={{ width: "200px" }}> Cluster</th>
                                    <td style={{ width: "200px" }}>
                                        <select class="form-control">
                                            <option>-- Select --</option>
                                        </select>
                                    </td>
                                    <th scope="row" style={{ width: "200px" }}> Plant</th>
                                    <td style={{ width: "200px" }}> 
                                        <select class="form-control">
                                            <option>-- Select --</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table><br></br>
                        <button type="button" className="btn btn-primary">
                            Add Diversion
                        </button>
                    </div>
                }

            </ModalBody>
        </React.Fragment >
    )
}

export default ViewIndentDiversion;