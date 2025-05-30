import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import AllTasksReports from './AllTasksReports';
import Widgets from './Widgets';
import axios from "axios";

const tatReport = () => {
    document.title="Outbound TAT Report | Bid";
    return (
        <React.Fragment>
            <div className="page-content">
            
                <Container fluid>

                    <BreadCrumb title="Outbound TAT Report" pageTitle="Auction" />
                    
                    <Row className="row-color-ff" style={{paddingTop:"14px",marginBottom:"-24px"}}>
                        <h2 className="order-mg">Outbound TAT Report</h2>
                    </Row>
                    <AllTasksReports />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default tatReport;