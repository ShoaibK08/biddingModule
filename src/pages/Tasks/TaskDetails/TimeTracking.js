import React,{ useState, useEffect } from 'react';
import {  Input, Card, CardBody, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link,useParams } from 'react-router-dom';
import axios from "axios";

const TimeTracking = () => {
     

    return (
        <React.Fragment>
            <Card className="mb-3">
                <CardBody>
                    <div className="table-card">
                        <table className="table mb-0">
                            <tbody>
                                <tr>
                                    <td className="fw-medium">Tasks No</td>
                                    <td>#12</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Indent No.</td>
                                    <td>22</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Material</td>
                                    <td>test</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Customer Name</td>
                                    <td>test</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Customer Type</td>
                                    <td>test</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Unit Of Measurement</td>
                                    <td>test</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Vehicle Number</td>
                                    <td>test</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Status</td>
                                    <td><span className="badge badge-soft-secondary">Inprogress</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div><br/><br/><br/>
                    <div className="mb-2 hstack gap-2 justify-content-center">
                        <button className="btn btn-danger btn-sm"><i className="ri-stop-circle-line align-bottom me-1"></i> Reject</button>
                        <button className="btn btn-success btn-sm"><i className="ri-play-circle-line align-bottom me-1"></i> Complete</button>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default TimeTracking;