import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, CardBody } from "reactstrap";
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
import logoDark from "../../../assets/images/Illustration.png";

const initialValues = {
    transporter: "",
    plant: "",
    status: "A",
};

const BiddingCreation = () => {
    const [formData, setFormData] = useState({
        startBidTime: '',
        endBidTime: '',
        origin: '',
        destination: '',
        material: '',
        quantity: '',
        bidType: 'Reversal Bidding',
        ceilingAmount: '',
        transporter: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted Data:', formData);
    };


    document.title = "Bidding Creation | EPLMS";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={'Bidding Creation'} pageTitle="Master" />
                    <Row>
                        <Col lg={12}>
                            <Card id="mappingList">
                                {/* <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <h5 className="card-title mb-0 bg-light">Create Bid</h5>
                                        </div>
                                    </Row>
                                </CardHeader> */}
                                <CardBody style={{ background: "#2E4FBD", borderRadius: "10px" }}>
                                    <Row className="">
                                        <Col lg={6} className="d-flex flex-column justify-content-end align-items-center">
                                            <h2 className="text-white mb-5">CREATE BID</h2>
                                            <img src={logoDark} alt="" height="325" />
                                        </Col>

                                        <Col lg={6}>
                                            <Card style={{ borderTopLeftRadius: "30px", borderBottomLeftRadius: "30px" }}>
                                                <CardBody className="" style={{ padding: "27px 35px 20px 35px" }}>
                                                    <h2>BID No :- 1234</h2>
                                                    <form onSubmit={handleSubmit}>
                                                        <Row className="g-3">
                                                            <Col lg={6}>
                                                                <Label className="form-label">Start Bid Time</Label>
                                                                <Input type="date" name="startBidTime" value={formData.startBidTime} onChange={handleChange} />
                                                            </Col>
                                                            <Col lg={6}>
                                                                <Label className="form-label">End Bid Time</Label>
                                                                <Input type="date" name="endBidTime" value={formData.endBidTime} onChange={handleChange} />
                                                            </Col>
                                                            <Col lg={6}>
                                                                <Label className="form-label">Origin</Label>
                                                                <Input type="select" name="origin" value={formData.origin} onChange={handleChange}>
                                                                    <option value="">Select</option>
                                                                    <option value="Location A">Location A</option>
                                                                    <option value="Location B">Location B</option>
                                                                </Input>
                                                            </Col>
                                                            <Col lg={6}>
                                                                <Label className="form-label">Destination</Label>
                                                                <Input type="select" name="destination" value={formData.destination} onChange={handleChange}>
                                                                    <option value="">Select</option>
                                                                    <option value="Location X">Location X</option>
                                                                    <option value="Location Y">Location Y</option>
                                                                </Input>
                                                            </Col>
                                                            <Col lg={6}>
                                                                <Label className="form-label">Material</Label>
                                                                <Input type="text" name="material" placeholder="Enter Material" value={formData.material} onChange={handleChange} />
                                                            </Col>
                                                            <Col lg={6}>
                                                                <Label className="form-label">Quantity</Label>
                                                                <Input type="number" name="quantity" placeholder="Enter Quantity" value={formData.quantity} onChange={handleChange} />
                                                            </Col>
                                                            <Col lg={6}>
                                                                <Label className="form-label">Bid Type</Label>
                                                                <Input type="select" name="bidType" value={formData.bidType} onChange={handleChange}>
                                                                    <option value="Reversal Bidding">Reversal Bidding</option>
                                                                    <option value="Forward Bidding">Forward Bidding</option>
                                                                </Input>
                                                            </Col>
                                                            <Col lg={6}>
                                                                <Label className="form-label">Ceiling Amount</Label>
                                                                <Input type="number" name="ceilingAmount" placeholder="Enter Amount" value={formData.ceilingAmount} onChange={handleChange} />
                                                            </Col>
                                                        </Row>
                                                        <div className="mt-3" style={{ display: "flex", justifyContent: "end" }}>
                                                            <button type="submit" className="btn btn-primary btn-label waves-effect waves-light"><i className="ri-user-smile-line label-icon align-middle fs-16 me-2"></i> Submit</button>
                                                        </div>
                                                    </form>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default BiddingCreation;