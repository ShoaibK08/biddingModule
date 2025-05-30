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

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import { useInsertionEffect } from "react";

const TruckDetailReport = () => {
  const dispatch = useDispatch();


  const [isEdit, setIsEdit] = useState(false);
  const [reportIndent, setreportIndent] = useState([]);
  const [indexA, setIndex] = useState(0);
  // Delete customer
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
 // const [TruckDetailReport, setTruckDetailReport] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setreportIndent(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  const customerstatus = [
    {
      options: [
        { label: "Status", value: "Status" },
        { label: "All", value: "All" },
        { label: "Active", value: "Active" },
        { label: "Block", value: "Block" },
      ],
    },
  ];

  const customermocalstatus = [
    {
      options: [
        { label: "Status", value: "Status" },
        { label: "Active", value: "Active" },
        { label: "Block", value: "Block" },
      ],
    },
  ];


  // Delete Data
  const onClickDelete = (reportIndent) => {
    setreportIndent(reportIndent);
    setDeleteModal(true);
  };

  const customerType = [
    {
      options: [   
        { label: " -- Select -- ", value: "" },
        { label: "Transporter", value: "Transporter" },
        { label: "Customer", value: "Customer" },
        { label: "Payer", value: "Payer" },
        { label: "Ship To", value: "Ship To" },
        { label: "Sold To", value: "Sold To" },
      ],
    },
  ];

  // Update Data
  const handleCustomerClick = useCallback((arg) => {
    const reportIndent = arg;

    setreportIndent({
      _id: reportIndent._id,
      indentReportName: reportIndent.indentReportName,
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);

 // alert(TruckDetailReport.length);
/*
  useEffect(() => {
    
    axios.get(`${process.env.REACT_APP_LOCAL_URL}/userModule/users/userData`,{ params:  { "userCode": "cu000010"}} )
    .then(res => {
      console.log(res[0].shiping_type);
    })
    .catch(err => {
      console.log(err);
    });

  });

*/

const TruckDetailReport = [
    {
        "id": 1,
        "vehicle_number": "MP09HH8790",
        "loader_name": "L-1",
        "packer_name": "P-1",
        "product_name": "OPC-43",
        "weight_recorder_tol": "50",
        "spout_no": "1",
        "bag_counter_no": "1",
        "tol": "true"
    }, {
        "id": 1,
        "vehicle_number": "MP09HH8790",
        "loader_name": "L-1",
        "packer_name": "P-1",
        "product_name": "OPC-43",
        "weight_recorder_tol": "48",
        "spout_no": "2",
        "bag_counter_no": "2",
        "tol": "false"
    }, {
        "id": 1,
        "vehicle_number": "MP09HH8790",
        "loader_name": "L-1",
        "packer_name": "P-1",
        "product_name": "OPC-43",
        "weight_recorder_tol": "49.6",
        "spout_no": "3",
        "bag_counter_no": "3",
        "tol": "true"
    }, 
    {
        "id": 1,
        "vehicle_number": "MP09HH8790",
        "loader_name": "L-1",
        "packer_name": "P-1",
        "product_name": "OPC-43",
        "weight_recorder_tol": "50",
        "spout_no": "4",
        "bag_counter_no": "4",
        "tol": "true"
    }, {
        "id": 1,
        "vehicle_number": "MP09HH8790",
        "loader_name": "L-1",
        "packer_name": "P-1",
        "product_name": "OPC-43",
        "weight_recorder_tol": "50",
        "spout_no": "5",
        "bag_counter_no": "5",
        "tol": "true"
    }, {
        "id": 1,
        "vehicle_number": "MP09HH8790",
        "loader_name": "L-1",
        "packer_name": "P-1",
        "product_name": "OPC-43",
        "weight_recorder_tol": "50",
        "spout_no": "6",
        "bag_counter_no": "6",
        "tol": "true"
    }, {
        "id": 1,
        "vehicle_number": "MP09HH8790",
        "loader_name": "L-1",
        "packer_name": "P-1",
        "product_name": "OPC-43",
        "weight_recorder_tol": "50",
        "spout_no": "7",
        "bag_counter_no": "7",
        "tol": "true"
    }, {
        "id": 1,
        "vehicle_number": "MP09HH8790",
        "loader_name": "L-1",
        "packer_name": "P-1",
        "product_name": "OPC-43",
        "weight_recorder_tol": "50",
        "spout_no": "8",
        "bag_counter_no": "8",
        "tol": "true"
    }, {
        "id": 1,
        "vehicle_number": "MP09HH8790",
        "loader_name": "L-1",
        "packer_name": "P-1",
        "product_name": "OPC-43",
        "weight_recorder_tol": "49.5",
        "spout_no": "1",
        "bag_counter_no": "9",
        "tol": "false"
    }, {
        "id": 1,
        "vehicle_number": "MP09HH8790",
        "loader_name": "L-1",
        "packer_name": "P-1",
        "product_name": "OPC-43",
        "weight_recorder_tol": "49.2",
        "spout_no": "2",
        "bag_counter_no": "10",
        "tol": "false"
    },
    

]



/*
  useEffect(() => {
    setreportIndent(TruckDetailReport);
  }, [TruckDetailReport]);
*/
  // Add Data
  const handleCustomerClicks = () => {
    setreportIndent("");
    setIsEdit(false);
    toggle();
  };
  // Delete Multiple

  // Customers Column
  const columns = useMemo(
    () => [
      {
        Header: "Vehicle Number",
        accessor: "vehicle_number",
        filterable: false,
      },
      {
        Header: "Packer",
        accessor: "packer_name",
        filterable: false,
      },
      {
        Header: "Loader",
        accessor: "loader_name",
        filterable: false,
      },
      {
        Header: "Product Name",
        accessor: "product_name",
        filterable: false,
      },
      {
        Header: "Bag Count No.",
        accessor: "bag_counter_no",
        filterable: false,
      },
      {
        Header: "Spout No.",
        accessor: "spout_no",
        filterable: false,
      },
      {
        Header: "Weight Record",
        accessor: "weight_recorder_tol",
        filterable: false,
      },
      {
        Header: "Within Tolerance",
        accessor: "tol",
        Cell: (cell) => {
            if(cell.value === 'true'){
                return <span className="badge text-uppercase badge-soft-success">{cell.value}</span>
            }else{
                return <span className="badge text-uppercase badge-soft-danger">{cell.value}</span>
            }
            
        },
      },
    ],
    [handleCustomerClick]
  );

  
  const handleDownload = async (e) => {
    e.preventDefault();
    downloadCSV();
    //alert("fdf");
    setIsExportCSV(false);
  };

  const downloadCSV = () => {
   // alert("fdf");  
    const header = Object.keys(TruckDetailReport[0]).join(',') + '\n';
    const csv = TruckDetailReport.map((row) => Object.values(row).join(',')).join('\n');
    const csvData = header + csv;
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'table_data.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };


  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Packer Weight Report | Eplms";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          onDownloadClick={handleDownload}
          data={TruckDetailReport}
        />
        <Container fluid>
          <BreadCrumb title="Packer Weight Report" pageTitle="Report" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0">Packer Weight Report</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                          
                        </button>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    <TableContainer
                        columns={columns}
                        data={(TruckDetailReport || [])}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={false}
                        isGlobalFilter={true}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        //isCustomerFilter={true}
                        isReportIndentFilter={false}
                        isOrderFilter={false}
                        SearchPlaceholder='Search for truck detail or something...'
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

export default TruckDetailReport;
