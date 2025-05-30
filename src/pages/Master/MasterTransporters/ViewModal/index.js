import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Label } from "reactstrap";

const ViewModal = ({ isOpen, toggle, viewData }) => {
    return (
        <Modal id="viewModal" isOpen={isOpen} toggle={toggle} centered size="lg">
            <ModalHeader className="bg-light p-3" toggle={toggle}>
                Transporter Details
            </ModalHeader>
            <ModalBody className="p-3">
                <div>
                    {/* ROW 1: Code, Name, Address */}
                    <Row className="g-2 mb-2">
                        {/* <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Transporter Code</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.code}</p>
                        </Col> */}
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Transporter Name</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.name}</p>
                        </Col>
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Address</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.address}</p>
                        </Col>
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Contact Person</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.contactPerson}</p>
                        </Col>
                    </Row>

                    {/* ROW 2: Contact Person, Phone, Email */}
                    <Row className="g-2 mb-2">

                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Phone No.</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.contactNumber}</p>
                        </Col>
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Email ID</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.contactEmail}</p>
                        </Col>

                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Mode Of Transport</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.modeTransport}</p>
                        </Col>
                    </Row>

                    {/* ROW 3: Mean, Mode, Price */}
                    <Row className="g-2 mb-2">

                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Price (Per KM)</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.priceKm}</p>
                        </Col>
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Term Of Payment</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.termPayment}</p>
                        </Col>
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Tax Information</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.taxInfo}</p>
                        </Col>
                    </Row>

                    {/* ROW 4: Term, Tax, Region */}
                    <Row className="g-2 mb-2">

                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Region/Location</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.regionLocation}</p>
                        </Col>
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Service Level Agreement</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.serviceLevelAgreement}</p>
                        </Col>
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">GST No.</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.gstnNo}</p>
                        </Col>
                    </Row>

                    {/* ROW 5: SLA, GST, PAN */}
                    <Row className="g-2 mb-2">

                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">PAN No.</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.panNo}</p>
                        </Col>
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Allowed for Bidding</Label>
                            <p className="form-control form-control-sm bg-light mb-0">
                                {viewData.allowedBidding === true ? 'Yes' : 'No'}
                            </p>
                        </Col>
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Status</Label>
                            <p className="form-control form-control-sm bg-light mb-0">
                                {viewData.status === 'A' ? 'Active' :
                                    viewData.status === 'D' ? 'Deactive' :
                                        viewData.status}
                            </p>
                        </Col>
                    </Row>

                    {/* ROW 6: Bidding, Status, Rating */}
                    <Row className="g-2 mb-2">

                        {/* <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Owner Email</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.ownerEmail}</p>
                        </Col>
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Owner Person</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.ownerPerson}</p>
                        </Col>
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Owner Number</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{viewData.ownerNumber}</p>
                        </Col> */}
                    </Row>

                    {/* Additional owner information if needed */}
                    {(viewData.ownerPerson || viewData.ownerNumber || viewData.ownerEmail) && (
                        <Row className="g-2 mb-2">


                            <Col md={4}>
                                <Label className="form-label mb-0 fw-semibold">Rating</Label>
                                <div className="mt-1">
                                    {/* Star Rating Display */}
                                    <div className="rating-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} className="star me-1">
                                                <i className={`ri-star-${parseInt(viewData.transporterRating || 1) >= star ? 'fill' : 'line'} text-warning fs-16`}></i>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Col>

                        </Row>
                    )}
                </div>
            </ModalBody>
            <ModalFooter>
                <button
                    type="button"
                    onClick={toggle}
                    style={{
                        backgroundColor: '#EEECEC',  // dark grey
                        color: '#212529',
                        fontWeight: 'bold',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px'
                    }}
                >
                    Cancel
                </button>


            </ModalFooter>
        </Modal>
    );
};

export default ViewModal;

