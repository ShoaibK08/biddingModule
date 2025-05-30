import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Button, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import '../CSR/Csr.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import PdfImg from "../../../assets/images/PdfImg.png";
import LoaderNew from "../../../Components/Common/Loader_new";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

const PGI_InvoicingReport = () => {
  const [devices, setDevice] = useState([]);
  const [latestHeader, setLatestHeader] = useState('');
  const [plantCode, setPlantCode] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [imageBase64Strings, setBase64Data] = useState([]);
  const [loader, setLoader] = useState(false);
  const [ModalViewImage, setModalViewImage] = useState('');

  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    setPlantCode(plantcode);
    getAllDeviceData(plantcode);
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
  const getAllDeviceData = async (plantcode) => {
    setLoader(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_REPORTS}/Bcp/pgi/${plantcode}`, config);
      setDevice(res);
      setLoader(false);
      return true;
    } catch (e) {
      toast.error(e.message, { autoClose: 3000 });
      setLoader(false);
      return false;
    }
  }

  const refreshData = async () => {
    const success = await getAllDeviceData(plantCode);
    if (success) {
      toast.success("Data Refreshed Successfully.", { autoClose: 3000 });
    }
  }


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
    FileSaver.saveAs(blob, 'Invoicing_Details.xlsx');

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


  const [modal_togFirst, setmodal_togFirst] = useState(false);
  const pdfUrl = "https://plmscements.firlo.io/eplms-documents/invoice/20240902113609609_MH04GC0109.pdf";

  function tog_togFirst() {
    setmodal_togFirst(!modal_togFirst);
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
        Header: "Trip ID ",
        accessor: "tripId",
        filterable: false,
      },
      {
        Header: "Vehicle No",
        accessor: "vehicleNumber",
        filterable: false,
      },
      {
        Header: "DO Number",
        accessor: "diNumber",
        filterable: false,
      },
      {
        Header: "DO Qty",
        accessor: "diQty",
        filterable: false,
      },
      {
        Header: "DO Creation Date",
        accessor: "consignmentDate",
        filterable: false,
        Cell: (cell) => {
          if (cell.value) {
            return ((cell.value).replace("T", " "));
          }
          else {
            return ("");
          }

        }
      },
      {
        Header: "PGI Number",
        accessor: "pgiNumber",
        filterable: false,
      },
      {
        Header: "PGI Date & Time",
        accessor: "pgiLocalDate",
        filterable: false,
        Cell: (cell) => {
          if (cell.value) {
            return ((cell.value).replace("T", " "));
          }
          else {
            return ("N/A");
          }

        }
      },
      {
        Header: "Material Name",
        accessor: "materialName",
        filterable: false,
      },
      {
        Header: "Material Code",
        accessor: "materialCode",
        filterable: false,
      },
      {
        Header: "Unit Code",
        accessor: "unitcode",
        filterable: false,
      },
      {
        Header: "IDOC Number",
        accessor: "idocNo",
        filterable: false,
      },
      {
        Header: "Manual Invoice print",
        accessor: "",
        Cell: (cellProps) => {
          if (cellProps) {
            return (
              <>
                {/* <Link to="#" className="text-success d-inline-block edit-item-btn"><button type="button" class="btn btn-sm btn-outline-success waves-effect waves-light border-success" >Sap Request for PDF</button></Link> */}
                {cellProps.row.original &&
                  <Link to="#" className="text-success d-inline-block edit-item-btn ms-2"
                    onClick={() => { tog_togFirst() }}>
                    <button type="button" class="btn btn-sm btn-outline-success waves-effect waves-light border-success" >Re-Print Invoice</button></Link>
                }
              </>
            )
          }
        }
      }
    ],
  );


  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Invoicing | EPLMS";
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
          <BreadCrumb title={"Invoicing"} pageTitle="Reports" />
          <Row>
            <Col lg={12}>

              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 bg-light">Invoicing Detail Reports</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto d-flex">
                      <div>
                        <button type="button" className="btn btn-info" title="Download" onClick={() => setIsExportCSV(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                        </button>
                      </div>
                      <div>
                        <button type="button" className="btn btn-info ms-2" title="Refresh Data" onClick={() => refreshData()}>
                          <i className="ri-refresh-line align-bottom me-1"></i>{" "}
                        </button>
                      </div>
                    </div>

                  </Row>
                </CardHeader>



                <div className="card-body pt-0 mt-3">

                  <div>
                    {loader && <LoaderNew></LoaderNew>}
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
                      divClass="overflow-auto"
                      tableClass="width-180"
                    />
                  </div>
                  <ToastContainer closeButton={false} limit={1} />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal isOpen={modal_togFirst} toggle={() => { tog_togFirst(); }} id="firstmodal" centered size="lg">
        <ModalHeader toggle={() => { tog_togFirst(); }} className='bg-light p-3 pb-2 pt-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-dark">{"PDF Details"}</h5>
        </ModalHeader>
        <ModalBody className="p-3">

          <iframe
            src={pdfUrl}
            style={{ width: '100%', height: '500px' }}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default PGI_InvoicingReport;
