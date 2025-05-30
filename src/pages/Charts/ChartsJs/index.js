import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import TableContainer from "../../../Components/Common/TableContainer";
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { LineChart ,BarChart,PieChart,DonutChart,PolarChart,RadarChart} from './ChartsJs';
import axios from "axios";

const ChartsJs = () => {

    const [devices, setDevice] = useState([]);
    const [devices1, setDevice1] = useState([]);

    useEffect(() => {
        getAllDeviceData();    
        getAllDeviceData1();    
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
    
    const getAllDeviceData1 = () => {
        const values = {};
        values["locationName"] = "";
        axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/GateDataController/gateInDashboardData`,values)
          .then(res => {
            const device1 = res;
            setDevice1(device1);
          });
    }

    const columns = useMemo(
        () => [
          {
            Header: '',
            accessor: 'id',
            hiddenColumns: true,
            Cell: (cell) => {
              return <input type="hidden" value={cell.value} />;
            }
          },      
          {
            Header: "Document Name",
            accessor: "documentRelatedTo",
            filterable: false,
          },
          {
            Header: "Document Type",
            accessor: "documentTypeId",
            filterable: false,
          },
          {
            Header: "Status",
            accessor: "status",
            Cell: (cell) => {
              switch (cell.value) {
                case "A":
                  return <span className="badge text-uppercase badge-soft-success"> Active </span>;
                case "D":
                  return <span className="badge text-uppercase badge-soft-danger"> Deactive </span>;
                default:
                  return <span className="badge text-uppercase badge-soft-info"> Active </span>;
              }
            }
          },
          {
            Header: "Action",
            Cell: (cellProps) => {
              return (
                <ul className="list-inline hstack gap-2 mb-0">
                  <li className="list-inline-item edit" title="Edit">
                    <Link
                      to="#"
                      className="text-primary d-inline-block edit-item-btn"
                      onClick={() => { const id = cellProps.row.original.id; }}
                    >
    
                      <i className="ri-pencil-fill fs-16"></i>
                    </Link>
                  </li>
                  <li className="list-inline-item" title="Remove">
                    <Link
                      to="#"
                      className="text-danger d-inline-block remove-item-btn"
                      onClick={() => { const id = cellProps.row.original.id; }}>
                      <i className="ri-delete-bin-5-fill fs-16"></i>
                    </Link>
                  </li>
                </ul>
              );
            },
          },
        ],
      );
    
    document.title="Charts Js| Velzon - React Admin & Dashboard Template";
    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Charts Js" pageTitle="Charts" />
                
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                            <h3>Gate In Dashbaord</h3>
                            </CardHeader>
                            <div className="card-body pt-0">
                                <div>
                                <TableContainer
                                    columns={columns}
                                    data={devices1}
                                    isGlobalFilter={true}
                                    isAddUserList={false}
                                    customPageSize={5}
                                    isGlobalSearch={true}
                                    className="custom-header-css"
                                    //handleCustomerClick={handleCustomerClicks}
                                    SearchPlaceholder='Search Name or something...'
                                />
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
                
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                            <h3>Gate Out Dashbaord</h3>
                            </CardHeader>
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
                                    SearchPlaceholder='Search Name or something...'
                                />
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

            </Container>

        </div>
    )
}

export default ChartsJs