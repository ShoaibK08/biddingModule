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
  FormFeedback,
  Nav, NavItem, NavLink, TabContent, TabPane, CardBody
} from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { isEmpty } from "lodash";
import * as moment from "moment";
import CountUp from "react-countup";
import FeatherIcon from "feather-icons-react";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";

import {
  addNewTransporter1 as onAddNewTransporter,
  deleteCustomer1 as onDeleteCustomer,
} from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import axios from "axios";
import { useRowSelect } from "react-table";



const initialValues = {
  firstname: "",
  lastname: "",
  contact: "",
  contact_2: "",
  email: "",
  email_2: "",
  address: "",
  city: "",
  landmark: "",
  post_office: "",
  pincode: "",
  district: "",
  state: "",
  plant_name: "",
  type_fleet: "",
  volumeBasedLiquid: "",
  weightBasedLiquid: "",
  weightBasedSolids: "",
};

const SequenceModule = () => {
  const dispatch = useDispatch();
  const [transporter, setTransporter] = useState([]);
  const [material, setMaterial] = useState([]);
  const [queue, setQueue] = useState([]);
  const [latestHeader, setLatestHeader] = useState('');
  const [plantCode, setPlantCode] = useState([]);
  const status = [
    {
      options: [
        { label: "Select Queue", value: "" },
        { label: "RQ", value: "rq" },
        { label: "WQ", value: "wq" },
        { label: "RQC", value: "rqc" },
      ],
    },
  ];

  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantCode = obj.data.plantCode;
    setPlantCode(plantCode);
    getAllTransporterData();
    getMaterialData(plantCode);
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

  const getAllTransporterData = () => {
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantCode = obj.data.plantCode;
    var x = document.getElementById("material_id").selectedIndex;
    var y = document.getElementById("material_id").options;
    if(y[x].value !== ""){
      axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllSequencingForMaterialType?material=`+y[x].value+`&flag=ib&plantCode=${plantCode}`, config)
      .then(res => {
        const transporter = res;
        setTransporter(transporter);
      });
    }
    else{
      axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllSequencingForIBAndOB?flag=IB&plantCode=${plantCode}`, config)
      .then(res => {
        const transporter = res;
        setTransporter(transporter);
      });
    }
  }
  

  const getAllQueueData = () => {
    var x = document.getElementById("queue_id").selectedIndex;
    var y = document.getElementById("queue_id").options;

    if(y[x].value != ""){
      axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllSequencingByQueue?queueType=`+y[x].value+`&flag=IB&plantCode=${plantCode}`, config)
      .then(res => {
        const transporter = res;
        setTransporter(transporter);
      });
    }else{
      axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllSequencingForIBAndOB?flag=IB&plantCode=${plantCode}`, config)
      .then(res => {
        const transporter = res;
        setTransporter(transporter);
      });

    }

  }

  const getMaterialData = (plantCode) =>{

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/materials?plantCode=${plantCode}`, config)
    .then(res => {
      const MaterialData = res;
      if (res.errorMsg) {
        setMaterial([]);
      } else {
        setMaterial(MaterialData);
      }
    })
  }

  // Customers Column
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
        Header: "Trip Id",
        accessor: "tripId",
        filterable:false,
      },
      {
        Header: "Vehicle Number",
        accessor: "vehicleNumber",
        filterable: false,
      },
      {
        Header: "Sequence Date",
        accessor: "sequencedDate",
        filterable: false,
      },
      {
        Header: "Sequence Type",
        accessor: "manualSequence",
        Cell: (cell) => {
            return (cell.value === 0 ? "Manual" : "Auto");
        }
       // filterable: false,
      },
      {
        Header: "Queue Type",
        accessor: "queueType",
        filterable: false,
      },
      {
        Header: "Material",
        accessor: "material",
        filterable: false,
      },
      {
        Header: "Plant Code",
        accessor: "plantCode",
        filterable: false,
      },
      {
        Header: "Planned Packer",
        accessor: "plannedPacker",
        filterable: false,
      },
      {
        Header: "Planned Terminal",
        accessor: "plannedTerminal",
        filterable: false,
      },
    ],
    []
  );

  const handleDownload = async (e) => {
    e.preventDefault();
    downloadCSV();
    setIsExportCSV(false);
  };

  const downloadCSV = () => {
    const header = Object.keys(transporter[0]).join(',') + '\n';
    const csv = transporter.map((row) => Object.values(row).join(',')).join('\n');
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

  document.title = "InBound Sequence Module | Eplms";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          onDownloadClick={handleDownload}
          data={transporter}
        />
        
        <Container fluid>
          <BreadCrumb title={latestHeader} pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0">InBound Sequence Module List</h5>
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
                <Row>                    
                  <Col lg={3} className="mt-3 mb-3">
                      <div>
                        <Label className="form-label" >Material</Label>
                        <Input
                          name="material_id"
                          id="material_id"
                          type="select"
                          className="form-select"
                          onChange={getAllTransporterData}                            
                        >
                           <option value={""}>{"Select Material Type"}</option>
                                {material.map((item,key) => (
                                    <option value={item.code} key={key}>{item.name}</option>
                                ))}
                        </Input>
                      </div>
                    </Col>

                    <Col lg={3} className="mt-3 mb-3">
                      <div>
                        <Label className="form-label" >Queue</Label>
                        <Input
                          name="queue_id"
                          id="queue_id"
                          type="select"
                          className="form-select"
                          onChange={getAllQueueData}                            
                        >
                              {status.map((item, key) => (
                                  <React.Fragment key={key}>
                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                  </React.Fragment>
                                ))}
                        </Input>
                      </div>
                    </Col>
                  </Row>
                  <div>

                    <TableContainer
                      trClass={"test-color-change"}
                      columns={columns}
                      data={transporter}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={5}
                      isGlobalSearch={true}
                      className="custom-header-css"
                      handleCustomerClick={""}
                      //isCustomerFilter={true}
                      SearchPlaceholder='Search...'
                    />
                  </div>
                  <ToastContainer closeButton={false} limit={1} />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

    </React.Fragment >
  );
};

export default SequenceModule;
