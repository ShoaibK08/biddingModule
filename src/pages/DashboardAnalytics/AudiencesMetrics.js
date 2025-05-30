import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import CountUp from "react-countup";
import { useSelector, useDispatch } from "react-redux";
import { AudiencesCharts } from './DashboardAnalyticsCharts';
import { getAudiencesMetricsChartsData } from "../../store/dashboardAnalytics/action";
import axios from "axios";

const AudiencesMetrics = () => {

    const dispatch = useDispatch();
    const [code, setCode] = useState('');

    const [chartData, setchartData] = useState([]);
    const [totalLastYear, setTotalNumberOfIndentLastYear] = useState('');
    const [totalCurrentYear, setTotalNumberOfIndentCurrentYear] = useState('');

    // const { audiencesMetricsData } = useSelector(state => ({
    //     audiencesMetricsData: state.DashboardAnalytics.audiencesMetricsData
    // }));

    // useEffect(() => {
    //     setchartData(audiencesMetricsData);
    // }, [audiencesMetricsData]);

    // const onChangeChartPeriod = pType => {
    //     dispatch(getAudiencesMetricsChartsData(pType));
    // };

    // useEffect(() => {
    //     dispatch(getAudiencesMetricsChartsData("all"));
    // }, [dispatch]);

    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let code = obj.data._id;
        setCode(code);
        getfirstGraphData();
    }, []);

    const getfirstGraphData = () => {
        
        axios.get(`${process.env.REACT_APP_LOCAL_URL}/userModule/dashboard/getDashboardDataCountsforGraph`)
            .then(res => {
                const allData = res;

                const map1 = (allData.lastYear).map((x) => x.indentCounts);
                const map2 = (allData.currentYear).map((x) => x.indentCounts);
                let sum = 0;
                let total = 0;
                map1.forEach((num)=>{
                    sum += num
                })
                map2.forEach((num)=>{
                    total += num
                })
                setTotalNumberOfIndentLastYear(sum);
                setTotalNumberOfIndentCurrentYear(total);
                console.log(map1);
                const data = [
                    {
                        "name": "Last Year",
                        "data": map1
                    },
                    {
                        "name": "Current Year",
                        "data": map2
                    }
                ]
                setchartData(data);
            })
    };


    return (
        <React.Fragment>
            <Col xl={6}>
                <Card>
                    <CardHeader className="border-0 align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">No of Indent Placed </h4>
                        {/* <div className="d-flex gap-1">
                            <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => { onChangeChartPeriod("all"); }}>
                                ALL
                            </button>
                            <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => { onChangeChartPeriod("monthly"); }}>
                                1M
                            </button>
                            <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => { onChangeChartPeriod("halfyearly"); }}>
                                6M
                            </button>
                            <button type="button" className="btn btn-soft-primary btn-sm" onClick={() => { onChangeChartPeriod("yearly"); }}>
                                1Y
                            </button>
                        </div> */}
                    </CardHeader>
                    <CardHeader className="p-0 border-0 bg-soft-light">
                        <Row className="g-0 text-center">
                            <Col xs={6} sm={6}>
                                <div className="p-3 border border-dashed border-start-0">
                                    <h5 className="mb-1"><span className="counter-value" data-target="854">
                                        <CountUp
                                            start={0}
                                            end={totalLastYear}
                                            duration={3}
                                        />
                                    </span>
                                    </h5>
                                    <p className="text-muted mb-0">Total Indents Placed Last year.</p>
                                </div>
                            </Col>
                            <Col xs={6} sm={6}>
                                <div className="p-3 border border-dashed border-start-0">
                                    <h5 className="mb-1"><span className="counter-value" data-target="1278">
                                        <CountUp
                                            start={0}
                                            end={totalCurrentYear}
                                            duration={3}
                                            separator=","
                                        />
                                    </span>
                                    </h5>
                                    <p className="text-muted mb-0">Total Indents Placed Current year.</p>
                                </div>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody className="p-0 pb-2">
                        <div>
                            <AudiencesCharts series={chartData} dataColors='["--vz-success", "--vz-primary"]' />
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default AudiencesMetrics;