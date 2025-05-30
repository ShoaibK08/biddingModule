import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import CountUp from "react-countup";
import axios from "axios";

//Import Icons
import FeatherIcon from "feather-icons-react";




const Widget = () => {

    const [code, setCode] = useState('');
    const [totalCount, setTotalCount] = useState('');
    const [liveCount, setLiveCount] = useState('');
    const [cancelCount, setCancelCount] = useState('');
    const [executedCount, setExecutedCount] = useState('');

    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let code = obj.data._id;
        setCode(code);
        getAllCountData();
    }, []);
    
    
    const getAllCountData = () => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL}/userModule/dashboard/getDashboardDataCounts`)
            .then(res => {
                const allData = res;
                setTotalCount(allData.totalIndentCounts);
                setLiveCount(allData.liveIndentCounts);
                setCancelCount(allData.cancelIndentCounts);
                setExecutedCount(allData.executedIndentCounts);
            })
    };


    return (
        <React.Fragment>
            <Row>
                <Col md={3}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="fw-medium text-muted mb-0">Total Indents</p>
                                    <h2 className="mt-4 ff-secondary fw-semibold">
                                        <span className="counter-value">
                                            <CountUp
                                             start={0}
                                             end={totalCount}
                                             duration={4}
                                               
                                                
                                            /></span></h2>
                                    <p className="mb-0 text-muted"><span className="badge bg-light text-success mb-0">Nayara Energy Limited</span></p>
                                </div>
                                <div>
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className="avatar-title bg-soft-info rounded-circle fs-2">
                                            <FeatherIcon
                                                icon="file-text"
                                                className="text-info"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="fw-medium text-muted mb-0">Live Indents</p>
                                    <h2 className="mt-4 ff-secondary fw-semibold">
                                        <span className="counter-value" data-target="3">
                                            <CountUp
                                                start={0}
                                                end={liveCount}
                                                duration={1}
                                            />
                                        </span></h2>
                                        <p className="mb-0 text-muted"><span className="badge bg-light text-success mb-0">Nayara Energy Limited</span></p>
                                </div>
                                <div>
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className="avatar-title bg-soft-info rounded-circle fs-2">
                                            <FeatherIcon
                                                icon="file-text"
                                                className="text-info"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="fw-medium text-muted mb-0">Cancel Indents</p>
                                    <h2 className="mt-4 ff-secondary fw-semibold">
                                        <span className="counter-value" data-target="1600">
                                            <CountUp
                                                start={0}
                                                end={cancelCount}
                                                duration={4}
                                            />
                                        </span></h2>
                                        <p className="mb-0 text-muted"><span className="badge bg-light text-success mb-0">Nayara Energy Limited</span></p>
                                </div>
                                <div>
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className="avatar-title bg-soft-info rounded-circle fs-2">
                                            <FeatherIcon
                                                icon="file-text"
                                                className="text-info"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="fw-medium text-muted mb-0">Executed Indents</p>
                                    <h2 className="mt-4 ff-secondary fw-semibold">
                                        <span className="counter-value" data-target="120">
                                            <CountUp
                                                start={0}
                                                end={executedCount}
                                                duration={4}
                                            />
                                        </span></h2>
                                        <p className="mb-0 text-muted"><span className="badge bg-light text-success mb-0">Nayara Energy Limited</span></p>
                                </div>
                                <div>
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className="avatar-title bg-soft-info rounded-circle fs-2">
                                            <FeatherIcon
                                                icon="file-text"
                                                className="text-info"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Widget;