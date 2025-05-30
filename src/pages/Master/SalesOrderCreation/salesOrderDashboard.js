import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import '../MasterCommonShift/CommonShift.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Flatpickr from "react-flatpickr";
import Loader from "../../../Components/Common/Loader";
import ReactEcharts from "echarts-for-react";
import getChartColorsArray from "../../../Components/Common/ChartsDynamicColor";


const SalesOrderDashboard = () => {
    const [values, setValues] = useState({});
    const [devices, setDevices] = useState([]);


    const columns = useMemo(
        () => [
            {
                Header: "Sales Order No",
                accessor: "sales_order_no",
            },
            {
                Header: "Customer Name",
                accessor: "customer_name",
            },
            {
                Header: "Order Date",
                accessor: "order_date",
            },
            {
                Header: "Order Status",
                accessor: "order_status",
            },
            {
                Header: "Action",
                accessor: "action",
            },
        ],
        []
    );

    useEffect(() => {
        const fetchData = async () => {
            axios.get("http://localhost:3001/salesOrder")
                .then((response) => {
                    setDevices(response.data);
                });
        };
        fetchData();
    }, []);

    //Gauge Chart
const GaugeChart = ({ dataColors }) => {
    var chartGaugeColors = getChartColorsArray(dataColors);
    var option = {
        tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
        },
        color: chartGaugeColors,
        textStyle: {
            fontFamily: 'Poppins, sans-serif',
        },
        series: [{
            name: 'Pressure',
            type: 'gauge',
            progress: {
                show: true
            },
            detail: {
                valueAnimation: true,
                formatter: '{value}',
                color: '#858d98',
            },
            axisLabel: {
                color: '#858d98',
            },
            data: [{
                title: {
                    color: '#858d98',
                },
                value: 50,
                name: 'SCORE',
            }]
        }]
    };
    return (
        <React.Fragment>
            <ReactEcharts style={{ height: "350px" }} option={option} />
        </React.Fragment>
    )
}

    document.title = "Sales Order Dashboard | EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={'Sales Order'} pageTitle="Dashboard" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Sales Order Details</h5>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <Row className="g-4 p-3">
                                    <Col xl={4}>
                                        <Card style={{borderTopRightRadius: "30px", borderBottomLeftRadius:"30px"}}>
                                            <div className="card-body shadow" style={{borderTopRightRadius: "30px", borderBottomLeftRadius:"30px"}}>
                                                <GaugeChart dataColors='["--vz-primary"]' />
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={columns}
                                            data={devices}
                                            isGlobalFilter={true}
                                            isAddUserList={false}
                                            customPageSize={5}
                                            isGlobalSearch={true}
                                            className="custom-header-css"
                                            //handleCustomerClick={handleCustomerClicks}
                                            //isCustomerFilter={true}
                                            SearchPlaceholder='Search for Commmon Shift Name or something...'
                                        />
                                    </div>
                                    <ToastContainer closeButton={false} limit={1} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>


        </React.Fragment>
    );
};

export default SalesOrderDashboard;
