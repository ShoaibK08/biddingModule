import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import CountUp from "react-countup";
import { useSelector, useDispatch } from "react-redux";
import { ProjectsOverviewCharts } from './DashboardProjectCharts';
import { getProjectChartsData } from '../../store/dashboardProject/action';
import { Link } from "react-router-dom";

const ProjectsOverview = () => {
    const dispatch = useDispatch();

    const [chartData, setchartData] = useState([]);

    const { projectData } = useSelector(state => ({
        projectData: state.DashboardProject.projectData
    }));

    useEffect(() => {
        setchartData(projectData);
    }, [projectData]);

    const onChangeChartPeriod = pType => {
        dispatch(getProjectChartsData(pType));
    };

    useEffect(() => {
        dispatch(getProjectChartsData("all"));
    }, [dispatch]);

    console.log(chartData)

    const chartDataN = [
        {
            "name": "Number of Materials",
            "type": "bar",
            "data": [
                34,
                65,
                46,
                68,
                49,
                61,
                42,
                44,
                78,
                52,
                63,
                67
            ]
        },
        {
            "name": "Draft Material",
            "type": "bar",
            "data": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                2,
                4,
                5
            ]
        },
        {
            "name": "Active Materials",
            "type": "bar",
            "data": [
                8,
                12,
                7,
                17,
                21,
                11,
                5,
                9,
                7,
                29,
                12,
                35
            ]
        },
        {
            "name": "Published Materials",
            "type": "bar",
            "data": [
                8,
                12,
                7,
                17,
                21,
                11,
                5,
                9,
                7,
                29,
                12,
                35
            ]
        }
    ];

    return (
        <React.Fragment>
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardHeader className="border-0 align-items-center d-flex">
                            <h4 className="card-title mb-0 flex-grow-1">Explore Material</h4>
                            <div className="d-flex gap-1">
                                <Link color="info" to="/apps-nft-explore" className="btn btn-soft-info nav-link btn-icon fs-14 filter-button"><i className="ri-grid-fill"></i></Link>
                                {" "}
                                <Link color="info" to="/apps-ecommerce-orders" className="btn btn-soft-info nav-link  btn-icon fs-14 filter-button"><i className="ri-list-unordered"></i></Link>
                                {" "}
                                <Link color="info" to="/dashboard-projects" className="btn btn-soft-info nav-link  btn-icon fs-14 filter-button active"><i className="mdi mdi-chart-bar"></i></Link>
                                {" "}
                                <Link color="info" to="/apps-calendar" className="btn btn-soft-info nav-link  btn-icon fs-14 filter-button"><i className="mdi mdi-calendar"></i></Link>
                                {" "}
                                <Link
                                    to="/apps-ecommerce-add-product"
                                    className="btn btn-success"
                                >
                                    <i className="ri-add-line align-bottom me-1"></i> Add
                                    Material
                                </Link>{" "}
                            </div>
                        </CardHeader>

                        <CardHeader className="p-0 border-0 bg-soft-light">
                            <Row className="g-0 text-center">
                                <Col sm={3}>
                                    <div className="p-3 border border-dashed border-start-0">
                                        <h5 className="mb-1"><span className="counter-value" data-target="9851">
                                            <CountUp
                                                start={0}
                                                end={9851}
                                                separator={","}
                                                duration={4}
                                            />
                                        </span></h5>
                                        <p className="text-muted mb-0">Number of Material</p>
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="p-3 border border-dashed border-start-0">
                                        <h5 className="mb-1"><span className="counter-value">
                                            <CountUp
                                                start={0}
                                                end={1026}
                                                separator={","}
                                                duration={4}
                                            />
                                        </span></h5>
                                        <p className="text-muted mb-0">Published Materials</p>
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="p-3 border border-dashed border-start-0">
                                        <h5 className="mb-1"><span className="counter-value">
                                            <CountUp
                                                start={0}
                                                end={40}
                                                separator={","}
                                                duration={4}
                                            />
                                        </span></h5>
                                        <p className="text-muted mb-0">Draft Materials</p>
                                    </div>
                                </Col>
                                
                                <Col sm={3}>
                                    <div className="p-3 border border-dashed border-start-0">
                                        <h5 className="mb-1"><span className="counter-value">
                                            <CountUp
                                                start={0}
                                                end={60}
                                                separator={","}
                                                duration={4}
                                            />
                                        </span></h5>
                                        <p className="text-muted mb-0">Scheduled Materials</p>
                                    </div>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody className="p-0 pb-2">
                            <div>
                                <div dir="ltr" className="apex-charts">
                                    <ProjectsOverviewCharts series={chartDataN} dataColors='["--vz-primary", "--vz-danger", "--vz-success","--vz-warning"]' />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ProjectsOverview;