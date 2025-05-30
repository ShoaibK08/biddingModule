import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { crmWidgets } from "../../../common/data";
import CountUp from "react-countup";

const Widgets = () => {

    const [totalVehicle, setTotalVehicle] = useState(0);
    const [rqCount, setRqCount] = useState(0);
    const [wqCount, setWqCount] = useState(0);
    const [wqClinker, setWqClinker] = useState(0);
    const [rqClinker, setRqClinker] = useState(0);

    useEffect(() => {
        getAllCountForVehicle();
    }, []);

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            username: process.env.REACT_APP_API_USER_NAME,
            password: process.env.REACT_APP_API_PASSWORD,
        },
    };

    const getAllCountForVehicle = () => {

        // alert("df")
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantCode = obj.data.plantCode;
        axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/dashboard/getSequencingCounts?plantCode=${plantCode}`, config)
            .then(res => {
                const countL = res;
                setTotalVehicle(countL.totalVehicleCounts);
                setRqCount(countL.rqcounts);
                setWqCount(countL.wqcounts);
                setWqClinker(countL.wqclinckerCounts);
                setRqClinker(countL.rqclinckerCounts);
            });
    }


    const crmWidgets = [
        {
            id: 1,
            label: "Total Vehicle",
            badge: "ri-arrow-up-circle-line text-success",
            icon: "ri-space-ship-line",
            counter: totalVehicle,
            decimals: 0,
            suffix: "",
            prefix: ""
        },
        {
            id: 2,
            label: "Ready Queue",
            badge: "ri-arrow-up-circle-line text-success",
            icon: "ri-exchange-dollar-line",
            counter: rqCount,
            decimals: 0,
            suffix: "",
            prefix: ""
        },
        {
            id: 3,
            label: "Waiting Queue",
            badge: "ri-arrow-down-circle-line text-danger",
            icon: "ri-pulse-line",
            counter: wqCount,
            decimals: 0,
            suffix: "",
            prefix: ""
        },
        {
            id: 4,
            label: "Ready Queue Clinker",
            badge: "ri-arrow-up-circle-line text-success",
            icon: "ri-trophy-line",
            counter: rqClinker,
            decimals: 0,
            prefix: "",
            separator: ",",
            suffix: ""
        },
        {
            id: 5,
            label: "Waiting Queue Clinker",
            badge: "ri-arrow-down-circle-line text-danger",
            icon: "ri-service-line",
            counter: wqClinker,
            decimals: 0,
            separator: ",",
            suffix: "",
            prefix: ""
        },
    ];


    return (
        <React.Fragment>
            <div className="col-xl-12">
                <div className="card crm-widget">
                    <div className="card-body p-0">
                        <div className="row row-cols-xxl-5 row-cols-md-3 row-cols-1 g-0">
                            {(crmWidgets).map((widget, index) => (
                                <div className="col" key={index}>
                                    <div className="py-4 px-3">
                                        <h5 className="text-muted text-uppercase fs-13">{widget.label}</h5>
                                        <div className="d-flex align-items-center">
                                            {/**<div className="flex-shrink-0">
                                                <i className={widget.icon + " display-6 text-muted"}></i>
                                            </div>*/}
                                            <div className="flex-grow-1 ms-3">
                                                <h2 className="mb-0"><span className="counter-value" data-target="197">
                                                    <CountUp
                                                        start={0}
                                                        prefix={widget.prefix}
                                                        suffix={widget.suffix}
                                                        separator={widget.separator}
                                                        end={widget.counter}
                                                        decimals={widget.decimals}
                                                        duration={4}
                                                    />
                                                </span></h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Widgets;