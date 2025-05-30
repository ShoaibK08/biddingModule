import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import '../TagMapping/TagMapping.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

const initialValues = {
  start_date: "",
  end_date: "",
  master_plant_id: "",
};


const ReportTagMapping = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [devices, setDevice] = useState([]);
  const [plants, setPlants] = useState([]);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [CurrentID, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [dynamicFlag, setDynamicFlag] = useState(1);
  const [Plant_Code, setPlantCode] = useState('');
  const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorEndDate, setErrorEndDate] = useState(false);
  const [errorCompare, setErrorCompare] = useState(false);
  const [latestHeader, setLatestHeader] = useState('');

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    setPlantCode(plantcode);
    //getAllDeviceData();
  }, []);



  const getAllDeviceData = () => {debugger;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: process.env.REACT_APP_API_USER_NAME,
        password: process.env.REACT_APP_API_PASSWORD,
      },
    };
    if (values.start_date === "") {
      setErrorStartDate(true);
    }
    else if (values.end_date === "") {
      setErrorEndDate(true);
    }
    else {
      setErrorStartDate(false);
      setErrorEndDate(false);
      setErrorCompare(false);
      axios.post(`${process.env.REACT_APP_LOCAL_URL_REPORTS}/getReport/activeInactiveTagReport`, values, config)
        .then(res => {
          const device = res["#result-set-1"];
          //const dateTimeArray =  [ 2024, 4, 6, 16, 11, 2];    Date Format Receiving from SAP
          const revisedData = device.map(item => {
            // Convert created_dt array to a formatted date-time string
            const formattedDateTime = `${item.created_dt[0]}-${padZero(item.created_dt[1])}-${padZero(item.created_dt[2])} ` +
              `${padZero(item.created_dt[3])}:${padZero(item.created_dt[4])}`;

            // Parse the request property from JSON string to an object
            //const parsedRequest = JSON.parse(item.request);

            return {
              ...item,
              created_dt: formattedDateTime,
              //request: parsedRequest
            };
          });
          setDevice(revisedData);
        });
    }
  }

      // Function to pad single digit numbers with a leading zero
      function padZero(num) {
        return num.toString().padStart(2, '0');
    }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value || value.valueAsNumber,
    });
  };

  const createdDateFunction = (date, date1, date2) => {

    setValues({
      ...values,
      ['start_date']: date1 + " 00:00:00",
      ["master_plant_id"]: Plant_Code,
    });
    setErrorStartDate(false);
  };

  const createdDateFunction1 = (date, date1, date2) => {

    setValues({
      ...values,
      ['end_date']: date1 + " 23:59:00",
      ["master_plant_id"]: Plant_Code,
    });
    setErrorEndDate(false);
    const startDate = new Date(values.start_date);
    const endDate = new Date(date1 + " 23:59:00");
    if (endDate < startDate) {
      setErrorCompare(true);
    }
    else {
      setErrorCompare(false);
    }
  };




  const master_material_id = [
    {
      options: [
        { label: "Select Status", value: "" },
        { label: "All", value: null },
        { label: "Active", value: "1" },
        { label: "Deactive", value: "0" },
      ],
    },
  ];


  const trip_movement_type_code = [
    {
      options: [
        { label: "Select Movement", value: "" },
        { label: "Dhar Cement Works", value: "In" },
        { label: "Panipat Cement Works", value: "Ob" },
      ],
    },
  ];


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
      // {
      //   Header: "Trip ID ",
      //   accessor: "plant_code",
      //   filterable: false,
      // },
      // {
      //   Header: "R&n No",
      //   accessor: "plant_name",
      //   filterable: false,
      // },
      {
        Header: "Vehicle No",
        accessor: "vehicle_number",
        filterable: false,
      },
      // {
      //   Header: "Vehicle Type",
      //   accessor: "company_name",
      //   filterable: false,
      // },
      // {
      //   Header: "Stage Name",
      //   accessor: "trip_regSerialNumber",
      //   filterable: false,
      // },
      // {
      //   Header: "Yard In Time",
      //   accessor: "trip_yardIn",
      //   filterable: false,
      // },
      // {
      //   Header: "Gate In Time",
      //   accessor: "trip_gateIn",
      //   filterable: false,
      // },
      // {
      //   Header: "Tare Weight",
      //   accessor: "trip_yardOut",
      //   filterable: false,
      // },
      // {
      //   Header: "Challan Tare Weight",
      //   accessor: "trip_gateOut",
      //   filterable: false,
      // },
      // {
      //   Header: "Gross Weight",
      //   accessor: "trip_unloadingIn",
      //   filterable: false,
      // },
      {
        Header: "Tag No.",
        accessor: "tag_id",
        filterable: false,
      },
      {
        Header: "Tag Sr#",
        accessor: "tag_sr",
        filterable: false,
      },
      {
        Header: "Tagging Date",
        accessor: "created_dt",
        filterable: false,
        // Cell: (cellProps) => {
        //        return (<span>{ formatDateTime(cellProps.row.original.created_dt)}</span>)
        // }
      },
      {
        Header: "Plant",
        accessor: "plant_name",
        filterable: false,
      },
      // {
      //   Header: "Net Weight ",
      //   accessor: "trip_grossWeight",
      //   filterable: false,
      // },
      // {
      //   Header: "Challan Net Weight",
      //   accessor: "add",
      //   filterable: false,
      // },
      // {
      //   Header: "Gate Out Time",
      //   accessor: "trip_packingIn",
      //   filterable: false,
      // },
      // {
      //   Header: "Tag Id",
      //   accessor: "trip_driverId1",
      //   filterable: false,
      // },
      // {
      //   Header: "DI Number",
      //   accessor: "trip_vehicleNumber",
      //   filterable: false,
      // },
      // {
      //   Header: "Material",
      //   accessor: "trip_abortedBy",
      //   filterable: false,
      // },
      // {
      //   Header: "Tag Number",
      //   accessor: "trip_driverId",
      //   filterable: false,
      // },
      // {
      //   Header: "Parking in Time",
      //   accessor: "trip_sealNumber",
      //   filterable: false,
      // },
      // {
      //   Header: "Total Challan Quantity",
      //   accessor: "wd_weightType",
      //   filterable: false,
      // },
      // {
      //   Header: "Trip Status",
      //   accessor: "trip_status",
      //   Cell: (cell) => {
      //     ;
      //     switch (cell.value) {
      //       case "A":
      //         return <span className="badge text-uppercase badge-soft-success"> Active </span>;
      //       case "D":
      //         return <span className="badge text-uppercase badge-soft-danger"> Deactive </span>;
      //       default:
      //         return <span className="badge text-uppercase badge-soft-info"> Active </span>;
      //     }
      //   }
      // },
      // {
      //   Header: "Action",
      //   Cell: (cellProps) => {
      //     return (
      //       <ul className="list-inline hstack gap-2 mb-0">
      //         <li className="list-inline-item edit" title="Edit">
      //           <Link
      //             to="#"
      //             className="text-primary d-inline-block edit-item-btn"
      //             onClick={() => { const id = cellProps.row.original.id; handleCustomerClick(id); }}
      //           >

      //             <i className="ri-pencil-fill fs-16"></i>
      //           </Link>
      //         </li>
      //         <li className="list-inline-item" title="Remove">
      //           <Link
      //             to="#"
      //             className="text-danger d-inline-block remove-item-btn"
      //             onClick={() => { const id = cellProps.row.original.id; onClickDelete(id); }}>
      //             <i className="ri-delete-bin-5-fill fs-16"></i>
      //           </Link>
      //         </li>
      //       </ul>
      //     );
      //   },
      // },
    ],
  );

  const handleDownload = async (e) => {
    e.preventDefault();
    downloadCSV();
    setIsExportCSV(false)
  };

  const downloadCSV = () => {
    const bl = [];
    columns.forEach((row) => {
      if (row.accessor !== undefined && row.accessor !== 'id') {
        bl.push(row.accessor + "$$$" + row.Header);
      }
    });
    const bla = [];
    devices.forEach((row1) => {
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
    FileSaver.saveAs(blob, 'TagMapping.xlsx');

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

  document.title = "Tag Mapping | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          onDownloadClick={handleDownload}
          data={devices}
        />
        <Container fluid>
          <BreadCrumb title={latestHeader} pageTitle="Reports" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Tag Mapping Reports</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                        </button>
                      </div>
                    </div>
                    {/* <div className="col-sm-auto">
                      <div>

                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); setValues(initialValues); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add Sub Menu
                        </button>{" "}

                      </div>
                    </div> */}
                  </Row>

                  <Row className="mt-4 p-2">

                    <Col md={3}>
                      <Label htmlFor="validationDefault04" className="form-label">Select Date From<span style={{ color: "red" }}>*</span></Label>
                      <Flatpickr
                        className="form-control"
                        id="datepicker-publish-input"
                        placeholder="Select Start Date"
                        value={values.createdDate}
                        options={{
                          enableTime: false,
                          dateFormat: "Y-m-d",
                          maxDate: "today" // Disable dates after the current date
                        }}
                        onChange={(selectedDates, dateStr, fp) => { createdDateFunction(selectedDates, dateStr, fp) }}
                      />
                      {errorStartDate && <p className="mt-2" style={{ color: "red" }}>Please Select Start Date</p>}
                    </Col>

                    <Col md={3}>
                      <Label htmlFor="validationDefault04" className="form-label">Select Date To<span style={{ color: "red" }}>*</span></Label>
                      <Flatpickr
                        className="form-control"
                        id="datepicker-publish-input"
                        placeholder="Select End Date"
                        value={values.createdDate}
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

                    {/* <Col lg={3}>
                      <div>
                        <Label className="form-label" >Status</Label>
                        <Input
                          name="status"
                          type="select"
                          className="form-select"
                          value={values.status}
                          onChange={handleInputChange}
                          required
                        >
                          {master_material_id.map((item, key) => (
                            <React.Fragment key={key}>
                              {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                            </React.Fragment>
                          ))}
                        </Input>
                      </div>
                    </Col> */}



                    <Col md={3} className="hstack gap-2" style={{ marginTop: "28px", display: "block" }}>
                      <button type="button" className="btn btn-success" onClick={getAllDeviceData} >Search Report</button>
                    </Col>
                  </Row>

                </CardHeader>
                <div className="card-body pt-0 mt-3">
                  <div>

                    <TableContainer
                      columns={columns}
                      data={devices}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={5}
                      isGlobalSearch={true}
                      className="custom-header-css"
                      //isCustomerFilter={true}
                      SearchPlaceholder='Search for Vehicle No or something...'
                    //divClass="overflow-auto"
                    // tableClass="width-200"
                    />
                  </div>


                  {/* <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Sub Menu" : "Add Sub Menu"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={handleSubmit}>
                      <ModalBody>
                        <Row className="g-3">
                          <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Name</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault03"
                              name="name"
                              placeholder="Enter Name"
                              value={values.name}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Main Menu Name</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="mainmenuName"
                              placeholder="Enter Main Menu Name"
                              value={values.mainmenuName}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Display Order</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="displayOrder"
                              placeholder="Enter Display Order"
                              value={values.displayOrder}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Icon</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="icon"
                              placeholder="Enter Icon"
                              value={values.icon}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Company Code</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="companyCode"
                              placeholder="Enter Company Code"
                              value={values.companyCode}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Label htmlFor="validationDefault04" className="form-label">Plant Code</Label>
                            <Input type="text" required className="form-control"
                              id="validationDefault04"
                              name="plantCode"
                              placeholder="Enter Plant Code"
                              value={values.plantCode}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col lg={4}>
                            <div>
                              <Label className="form-label" >Status</Label>
                              <Input
                                name="status"
                                type="select"
                                className="form-select"
                                value={values.status}
                                onChange={handleInputChange}
                                required
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
                        <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                            <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                            <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Sub Menu"} </button>
                          </Col>

                      </ModalBody>
                      <ModalFooter>
                      </ModalFooter>
                    </Form>
                  </Modal> */}
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

export default ReportTagMapping;
