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
  Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner
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
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

const initialValues = {
  fromDate: "",
  toDate: "",
  plantCode: "",
  queueType: "",
  flag: "OB",
  material: "",
};

const OutBoundSequenceModule = () => {
  const dispatch = useDispatch();
  const [transporter, setTransporter] = useState([]);
  const [material, setMaterial] = useState([]);
  const [latestHeader, setLatestHeader] = useState('');
  const [plantCode, setPlantCode] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorEndDate, setErrorEndDate] = useState(false);
  const [errorCompare, setErrorCompare] = useState(false);
  const [errorParameter, setErrorParameter] = useState(false);

  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantCode = obj.data.plantCode;
    setPlantCode(plantCode);
    getAllTransporterData(plantCode);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
      ["plantCode"]: plantCode,
    });
  };

  const createdDateFunction = (date, date1, date2) => {

    setValues({
      ...values,
      ['fromDate']: date1,
      ["plantCode"]: plantCode,
    });
    setErrorStartDate(false);
  };

  const createdDateFunction1 = (date, date1, date2) => {

    setValues({
      ...values,
      ['toDate']: date1,
      ["plantCode"]: plantCode,
    });
    setErrorEndDate(false);
    setErrorCompare(false);
    const startDate = new Date(values.fromDate);
    const endDate = new Date(date1);
    if (endDate < startDate) {
      setErrorCompare(true);
    }
    else {
      setErrorCompare(false);
    }
  };

  const getAllDeviceData = async (e) => {
    if (values.fromDate === "") {
      setErrorStartDate(true);
    }
    else if (values.toDate === "") {
      setErrorEndDate(true);
    }
    else {
      setErrorStartDate(false);
      setErrorEndDate(false);
      setErrorCompare(false);
      setErrorParameter(true);
      const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllSequencingForMaterialType`, values, config)
        .then(res => {
          const device = res;
          if(device.length < 1){
            toast.error("No data found.", { autoClose: 3000 });
            setErrorParameter(false);
          }
          else if(device.errorMsg){
            toast.error("No data found.", { autoClose: 3000 });
            setErrorParameter(false);
          }
          else{
            setTransporter(device);
            setErrorParameter(false);
          }
          
        });
    }

  }

  const status = [
    {
      options: [
        { label: "Select Queue", value: "" },
        { label: "RQ", value: "RQ" },
        { label: "WQ", value: "WQ" },
        { label: "RQC", value: "RQC" },
      ],
    },
  ];



  const getAllTransporterData = () => {
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantCode = obj.data.plantCode;
    
      axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllSequencingByQueue?queueType=RQ&flag=OB&plantCode=${plantCode}`, config)
        .then(res => {
          const transporter = res;
          if(res.errorMsg){
            setTransporter([]);
          }else{
            setTransporter(transporter);
          }
        });
  }


  // const getAllQueueData = () => {
  //   var x = document.getElementById("queue_id").selectedIndex;
  //   var y = document.getElementById("queue_id").options;

  //   if (y[x].value != "") {
  //     axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllSequencingByQueue?queueType=` + y[x].value + `&flag=ob&plantCode=${plantCode}`, config)
  //       .then(res => {
  //         const transporter = res;
  //         setTransporter(transporter);
  //       });
  //   } else {
  //     axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllSequencingForIBAndOB?flag=OB&plantCode=${plantCode}`, config)
  //       .then(res => {
  //         const transporter = res;
  //         setTransporter(transporter);
  //       });

  //   }

  // }

  const getMaterialData = (plantCode) => {

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
        filterable: false,
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
          return (cell.value === 1 ? "Manual" : "Auto");
        }
        // filterable: false,
      },
      {
        Header: "Queue Type",
        accessor: "queueType",
        filterable: false,
      },
      {
        Header: "Material Code",
        accessor: "material",
        filterable: false,
      },
      {
        Header: "Material",
        accessor: "materialtypes",
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
    const bl = [];
    columns.forEach((row) => {
      if (row.accessor !== undefined && row.accessor !== 'id') {
        bl.push(row.accessor + "$$$" + row.Header);
      }
    });
    const bla = [];
    transporter.forEach((row1) => {
      const blp = {};
      bl.forEach((rows2) => {
        const pl = rows2.split("$$$");
        if (pl[0] === 'status') {
          blp[pl[1]] = (row1[pl[0]] === 1 ? 'Active' : 'Deactive');
        } else if (pl[0] === 'quantity') {
          blp[pl[1]] = row1[pl[0]] + " " + row1["unitMeasurement"];
        } else {
          blp[pl[1]] = row1[pl[0]];
        }
      });
      bla.push(blp);
    });
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Convert the data to a worksheet
    const ws = XLSX.utils.json_to_sheet(bla, { header: Object.keys(bla[0]) });
    // Apply styling to the header row
    ws["!cols"] = [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }]; // Example: Set column widths
    // ws["A1"].s = { // Style for the header cell A1
    //     fill: {
    //         fgColor: { rgb: "FFFF00" } // Yellow background color
    //     },
    //     font: {
    //         bold: true,
    //         color: { rgb: "000000" } // Black font color
    //     }
    // };
    // Add more styling options as needed

    // Add the worksheet to the workbook

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate an XLSX file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Convert binary string to Blob
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    // Save the Blob as a file using FileSaver
    FileSaver.saveAs(blob, 'OBSequence.xlsx');

    // Utility function to convert a string to an ArrayBuffer
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }
  };

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "OutBound Sequence Module | Eplms";
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
          <BreadCrumb title={'OutBound Sequence Report'} pageTitle="Report" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">OutBound Sequence Module List</h5>
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
                  
                  <Row className="mt-4 p-2">

                    <Col lg={3}>
                      <Label htmlFor="validationDefault04" className="form-label">Start Date<span style={{ color: "red" }}>*</span></Label>
                      <Flatpickr
                        className="form-control"
                        id="datepicker-publish-input"
                        placeholder="Select Start Date"
                        value={values.fromDate}
                        options={{
                          enableTime: false,
                          dateFormat: "Y-m-d",
                          maxDate: "today" // Disable dates after the current date
                        }}
                        onChange={(selectedDates, dateStr, fp) => { createdDateFunction(selectedDates, dateStr, fp) }}
                      />
                      {errorStartDate && <p className="mt-2" style={{ color: "red" }}>Please Select Start Date</p>}
                    </Col>

                    <Col lg={3}>
                      <Label htmlFor="validationDefault04" className="form-label">End Date<span style={{ color: "red" }}>*</span></Label>
                      <Flatpickr
                        className="form-control"
                        id="datepicker-publish-input"
                        placeholder="Select End Date"
                        value={values.toDate}
                        options={{
                          enableTime: false,
                          dateFormat: "Y-m-d",
                          maxDate: "today" // Disable dates after the current date
                        }}
                        onChange={(selectedDates, dateStr, fp) => { createdDateFunction1(selectedDates, dateStr, fp) }}
                      />
                      {errorEndDate && <p className="mt-2" style={{ color: "red" }}>Please Select End Date</p>}
                      {errorCompare && <p className="mt-2" style={{ color: "red" }}>End date cannot be less than start date.</p>}
                    </Col>

                    <Col lg={3}>
                        <Label className="form-label" >Queue</Label>
                        <Input
                          name="queueType"
                          id="queue_id"
                          type="select"
                          className="form-select"
                          value={values.queueType}
                          onChange={handleInputChange}
                        >
                          {status.map((item, key) => (
                            <React.Fragment key={key}>
                              {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                            </React.Fragment>
                          ))}
                        </Input>
                    </Col>

                    <Col lg={3}>
                      <div>
                        <Label className="form-label" >Material</Label>
                        <Input
                          name="material"
                          type="select"
                          className="form-select"
                          value={values.material}
                          onChange={handleInputChange}

                        >
                          <React.Fragment>
                            <option value="" selected>Select Material</option>
                            {material.map((item, key) => (<option value={item.code} key={key}>{`${item.name}/${item.code}`}</option>))}
                          </React.Fragment>
                        </Input>
                      </div>
                    </Col>
                    <Col lg={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "25px" }}>
                      <button type="button" className="btn btn-success"  onClick={getAllDeviceData}>{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Searching...</> : "Search"}</button>
                    </Col>
                  </Row>



                  <div className="mt-2">

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
                      SearchPlaceholder='Search for Vehicle No...'
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

export default OutBoundSequenceModule;
