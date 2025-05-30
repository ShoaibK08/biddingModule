import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Modal,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  FormFeedback
} from "reactstrap";

import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { isEmpty } from "lodash";
import * as moment from "moment";
import axios from "axios";
// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";

import {
  addNewScheduleReportIndent1 as onAddNewScheduleReportIndent,
} from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import { useInsertionEffect } from "react";

const ReportCancelIndent = () => {
  const dispatch = useDispatch();

  const { reportScheduleIndents, isreportScheduleIndentsCreated, isreportScheduleIndentsSuccess, error } = useSelector((state) => ({
    reportScheduleIndents: state.Report.reportScheduleIndents,
    isreportScheduleIndentsCreated: state.Report.isreportScheduleIndentsCreated,
    isreportScheduleIndentsSuccess: state.Report.isreportScheduleIndentsSuccess,
    error: state.Report.error,
  }));

  const [reportCancelIndent, setreportCancelIndent] = useState([]);
  const [indexA, setIndex] = useState(0);

  const handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  // Customers Column
  const columns = useMemo(
    () => [
      // {
      //   Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
      //   Cell: (cellProps) => {
      //     return <input type="checkbox" className="customerCheckBox form-check-input" value={cellProps.row.original._id} onChange={() => deleteCheckbox()} />;
      //   },
      //   id: '#',
      // },
      {
        Header: "Indent Number",
        accessor: "indent_no",
        filterable: false,
      },
      {
        Header: "Material Name",
        accessor: "material_name",
        filterable: false,
      },
      {
        Header: "Payer Name",
        accessor: "payer_name",
        filterable: false,
      },
      {
        Header: "Plant Code",
        accessor: "plant_code",
        filterable: false,
      },
      {
        Header: "Ship to Party",
        accessor: "ship_to_party",
        filterable: false,
      },
      {
        Header: "Sold to Party",
        accessor: "sold_to_party",
        filterable: false,
      },
      {
        Header: "Indent Placed By",
        accessor: "indent_place_by",
        filterable: false,
      },
      {
        Header: "Indent Status",
        accessor: "indent_status",
        filterable: false,
      },
      {
        Header: "Indent Creation Date",
        accessor: "indent_creation",
        Cell: ({ row }) => { return (`${moment(new Date(row.original.indent_creation)).format("DD MMM Y")}`) },
        
      },
      {
        Header: "Indent Schedule Date",
        accessor: "indent_final_submission",
        Cell: ({ row }) => { return (`${moment(new Date(row.original.final_submission_date)).format("DD MMM Y")}`) },
      },
      // {
      //   Header: "Action",
      //   Cell: (cellProps) => {
      //     return (
      //       <ul className="list-inline hstack gap-2 mb-0">
      //         <li className="list-inline-item edit" title="Edit">
      //           <Link
      //             to="#"
      //             className="text-primary d-inline-block edit-item-btn"
      //             onClick={() => { const customerData = cellProps.row.original; handleCustomerClick(customerData); }}
      //           >

      //             <i className="ri-pencil-fill fs-16"></i>
      //           </Link>
      //         </li>
      //         <li className="list-inline-item" title="Remove">
      //           <Link
      //             to="#"
      //             className="text-danger d-inline-block remove-item-btn"
      //             onClick={() => { const customerData = cellProps.row.original; onClickDelete(customerData); }}
      //           >
      //             <i className="ri-delete-bin-5-fill fs-16"></i>
      //           </Link>
      //         </li>
      //       </ul>
      //     );
      //   },
      // },
    ],
    []
  );

  const dateFormat = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
    
    if(document.getElementById("toDate").value != '' && document.getElementById("fromDate").value != ''){
      setIndex(0);
      var json = {
        "endDate": document.getElementById("toDate").value,
       // "indentStatus": "string",
        "startDate":  document.getElementById("fromDate").value,
        // "transporterCode": "string"
        };
      dispatch(onAddNewScheduleReportIndent(json));
      setIndex(1);
    }
    
  };

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Schedule Indents | Nayara - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={reportScheduleIndents}
        />
        <Container fluid>
          <BreadCrumb title="Schedule Indents" pageTitle="Report" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Schedule Indent List</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                    <div className="col-sm-auto">
                      <div>
                        <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                          Download
                        </button>
                      </div>
                    </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                  <Row className="g-3">
                        <Col lg={4}>
                            <Flatpickr
                              name="indentReportName"
                              className="form-control"
                              placeholder="Enter From Date"
                              type="text"
                              id="fromDate"
                              options={{
                                altInput: true,
                                altFormat: "d M, Y",
                                dateFormat: "Y-m-d",
                              }}
                              onChange={(e) =>
                                dateformate(e)
                              }
                              
                            />
                            </Col>
                            <Col lg={4}>
                            <Flatpickr
                              name="indentReportName"
                              className="form-control"
                              placeholder="Enter To Date"
                              type="text"
                              id="toDate"
                              options={{
                                altInput: true,
                                altFormat: "d M, Y",
                                dateFormat: "Y-m-d",
                              }}
                              onChange={(e) =>
                                dateformate(e)
                              }
                            />
                    </Col></Row>
                      <TableContainer
                        columns={columns}
                        data={(reportScheduleIndents || [])}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={false}
                        isGlobalFilter={false}
                        className="custom-header-css"
                      //  handleCustomerClick={handleCustomerClicks}
                        //isCustomerFilter={true}
                        isReportIndentFilter={true}
                        isOrderFilter={false}
                        SearchPlaceholder='Search for report Indent, email, phone, status or something...'
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

export default ReportCancelIndent;
