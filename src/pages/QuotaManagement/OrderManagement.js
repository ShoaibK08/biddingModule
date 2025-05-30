import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row,Card,CardHeader,CardBody,Col } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import AllTasksTransporter from './AllTasksTransporter';
import Widgets from './Widgets';
import axios from "axios";

const OrderManagement = () => {
    document.title="Orders Management | Bid";
    return (
        <React.Fragment>
            <div className="page-content">
            
                <Container fluid>

                    <BreadCrumb title="Orders Management" pageTitle="Auction" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div >
                                                <h5 className="card-title1 mb-0 bg-light">Order Management</h5>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                <AllTasksTransporter />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default OrderManagement;