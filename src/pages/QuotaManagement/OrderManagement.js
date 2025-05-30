import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row } from 'reactstrap';
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
                    
                    <Row className="row-color-ff" style={{paddingTop:"14px"}}>
                        <h2>Orders Management</h2><br></br>
                    </Row>
                    <AllTasksTransporter />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default OrderManagement;