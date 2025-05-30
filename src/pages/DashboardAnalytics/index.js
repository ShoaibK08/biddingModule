import React from 'react';
import { Col, Container, Row,Card, CardBody, CardHeader } from 'reactstrap';
import { LineChart ,BarChart,PieChart,DonutChart,PolarChart,RadarChart,Basic} from '../Charts/ChartsJs/ChartsJs';

//import Components
import UpgradeAccountNotise from './UpgradeAccountNotise';
import UsersByDevice from './UsersByDevice';
import Widget from './Widget';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import AudiencesMetrics from './AudiencesMetrics';
import AudiencesSessions from './AudiencesSessions';
import LiveUsers from './LiveUsers';
import TopReferrals from './TopReferrals';
import TopPages from './TopPages';


const DashboardAnalytics = () => {
document.title="Dashboard | Analytics";
    return (
        <React.Fragment>
            <div className="page-content">
            <Container fluid>
                    <BreadCrumb title="Analytics" pageTitle="Dashboards" />
                        <Col >
                            <Widget />
                        </Col>

                    <Row>
                        <AudiencesMetrics />
                        <Col lg={6}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Top 20 customers in last one week</h4>
                                </CardHeader>
                                <CardBody>
                                    <Basic dataColors='["--vz-success"]'/>
                                </CardBody>
                            </Card>
                        </Col>
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Delivered Indents</h4>
                            </CardHeader>
                            <CardBody>
                                <BarChart dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/>
                            </CardBody>
                        </Card>
                    </Col>
               
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Cancelled Indents and Rejected Indents</h4>
                            </CardHeader>
                            <CardBody>
                                <LineChart dataColors='["--vz-primary-rgb, 0.2", "--vz-primary", "--vz-success-rgb, 0.2", "--vz-success"]'/>
                            </CardBody>
                        </Card>
                    </Col>
                    
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">All Customers</h4>
                            </CardHeader>
                            <div className="card-body">
                                <PieChart dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'/>
                            </div>
                        </Card>
                    </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default DashboardAnalytics;