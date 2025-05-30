import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import AllTasksPerformance from './AllTasksPerformance';
import Widgets from './Widgets';
import axios from "axios";
import TATGraphs from './TATGraphs';

const PerformanceReport = () => {
    document.title="Transporter Performance Report | Bid";
    return (
        <React.Fragment>
            <div className="page-content">
            
                <Container fluid>

                    <BreadCrumb title="Transporter Performance Report" pageTitle="Auction" />
                    
                    <Row className="row-color-ff" style={{paddingTop:"14px",marginBottom:"-24px"}}>
                        <h2 className="order-mg">Transporter Performance Report</h2>
                    </Row>
                    <AllTasksPerformance />
                    <TATGraphs />
                </Container>
                <br></br>
            </div>
        </React.Fragment>
    );
};

export default PerformanceReport;