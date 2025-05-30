import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import AllTasks from './AllTasks';
import Widgets from './Widgets';
import axios from "axios";

const TaskList = () => {

    const [devices, setDevice] = useState([]);

    useEffect(() => {
        getAllDeviceData();    
    }, []);

    const getAllDeviceData = () => {
        const values = {};
        values["tagId"] = "";
        values["masterLocationId"] = "";
        axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/GateDataController/gateOutDashboardData`,values)
          .then(res => {
            const device = res;
            setDevice(device);
        });
    }
    document.title="Gate Out Dashboard | Velzon - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">
            
                <Container fluid>
                    <BreadCrumb title="Gate Out Dashboard" pageTitle="Dashboard" />
                    <Row>
                        <Widgets />
                    </Row>
                    <AllTasks />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default TaskList;