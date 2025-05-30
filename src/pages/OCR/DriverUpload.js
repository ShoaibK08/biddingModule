import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Card, CardBody, Col, Row, Container, CardHeader, Spinner, Modal, ModalHeader, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane, } from 'reactstrap';
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import BreadCrumb from '../../Components/Common/BreadCrumb';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';
// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import LoaderNew from "../../Components/Common/Loader_new";
import macImg from "../../assets/images/mac-img.png";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableContainer from "../../Components/Common/TableContainer";
import classnames from "classnames";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const DriverUpload = () => {
  const [selectedFiles, setselectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [response, setResponse] = useState({});
  const [loader, setloader] = useState(false);
  const [ima_ge, setImage] = useState('');
  const [imageData, setImageData] = useState(null);
  const [Plant, setPlant] = useState([]);
  const [AllDataResponse, setAllDataResponse] = useState([]);
  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);


  useEffect(() => {
    //getAllData();
  }, [])

  const getAllData = async () => {
    setloader(true);
    try {
      const res = await axios.get(`http://192.168.1.125:5000/all_data`)
        .then(data => {
          setAllDataResponse(data.information);
          setloader(false);
        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setloader(false);
    }
  }


  function handleAcceptedFiles(files) {
    debugger;
    setResponse({});
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (files[0] && allowedTypes.includes(files[0].fileType)) {
      setselectedFiles(files);
      setErrorMessage('');
    } else {
      setselectedFiles([]);
      setErrorMessage('Please select a valid image (JPEG, JPG, or PNG)');
    }
  }

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const [outlineBorderNav, setoutlineBorderNav] = useState("1");
  const outlineBorderNavtoggle = (tab) => {
    if (outlineBorderNav !== tab) {
      setoutlineBorderNav(tab);
      if (tab === "2") {
        getAllData();
      }
    }
  };

  const submitFunction = async () => {

    setloader(true);
    setResponse({});
    var formData = new FormData();
    formData.append('image', selectedFiles[0].file);

    try {
      const res = await axios.post(`http://192.168.1.125:5000/extract_info`, formData)
        .then(data => {
          if (data.information === "Please upload the proper Image ") {
            toast.error(data.information, { autoClose: 3000 });
            setloader(false);
            setResponse({});
          }
          else {
            var image = new Image();
            image.src = 'data:image/png;base64,' + data.image_data;
            setImage(image.src);
            console.log(data);
            setResponse(data);
            setloader(false);
            toast.success("Data Fetched Successfully.", { autoClose: 3000 });
          }
        });
    }
    catch (e) {
      toast.error(e, { autoClose: 3000 });
      setloader(false);
    }

  }

  const handleCustomerClick = (image_data) => {

    toggle();
    var image = new Image();
    image.src = 'data:image/png;base64,' + image_data;
    setImageData(image.src);

  }

  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'License No', accessor: 'license_no' },
    { Header: 'Nationality', accessor: 'nationality' },
    { Header: 'Date of Birth', accessor: 'dob' },
    { Header: 'Expiry Date', accessor: 'expiry_date' },
    { Header: 'Issue Date', accessor: 'issue_date' },
    { Header: 'Place of Issue', accessor: 'place_of_issue' },
    {
      Header: "Action",
      Cell: (cellProps) => {
        return (
          <ul className="list-inline gap-2 mb-0">
            <li className="list-inline-item edit">

              <Link
                to="#"
                onClick={() => { const image_data = cellProps.row.original.image_data; handleCustomerClick(image_data); }}
                className="text-primary d-inline-block edit-item-btn" title="View Image" style={{ margin: '0px 20px 10px 0px' }} >
                <i className="ri-image-fill fs-20 align-middle text-success" ></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
    // ... Other column definitions
  ];


  document.title = "Driver || OCR";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Driver" pageTitle="OCR" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <div className="card-body pt-4">
                  <Nav pills className="nav-customs nav-danger mb-0 nav nav-pills">
                    <NavItem>
                      <NavLink id="tab1" style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "1", })} onClick={() => { outlineBorderNavtoggle("1"); }}>  Upload Image     </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink id="tab2" style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "2", })} onClick={() => { outlineBorderNavtoggle("2"); }}>   All Records     </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={outlineBorderNav} className="text-muted">
                    <TabPane tabId="1" id="border-nav-home">
                      <Card className='shadow_light'>
                        <CardBody>
                          <p className="text-muted">Please upload image in JPG, JPEG, PNG format only.</p>
                          {/* <Dropzone
                            onDrop={acceptedFiles => {
                              handleAcceptedFiles(acceptedFiles);
                            }}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div className="dropzone dz-clickable">
                                <div
                                  className="dz-message needsclick"
                                  {...getRootProps()}
                                >
                                  <div className="mb-3">
                                    <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                  </div>
                                  <h4>Drop files here or click to upload.</h4>
                                </div>
                              </div>
                            )}
                          </Dropzone> */}
                          <div className="p-3" style={{border:"2px dashed #ccc", borderRadius:"10px"}}>
                            <div className="mb-3 text-center">
                              <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                            </div>
                            <FilePond
                              files={selectedFiles}
                              onupdatefiles={acceptedFiles => {
                                handleAcceptedFiles(acceptedFiles);
                              }}
                              allowMultiple={false}
                              maxFiles={3}
                              name="files"
                              className="filepond filepond-input-multiple cursor-pointer"
                            />
                            {errorMessage && <p style={{ color: "red", margin: "15px 0 0 0" }}>{errorMessage}</p>}
                          </div>


                          <div className="list-unstyled mb-0" id="file-previews">
                            {selectedFiles.map((f, i) => {debugger;
                              return (
                                <Card
                                  className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                  key={i + "-file"}
                                >
                                  <div className="p-2">
                                    <Row className="align-items-center">

                                      <Col>
                                        <Link
                                          to="#"
                                          className="text-muted font-weight-bold"
                                        >
                                          {f.file.name}
                                        </Link>
                                        <p className="mb-0">
                                          <strong>{f.formattedSize}</strong>
                                        </p>
                                      </Col>
                                      <Col className='justify-content-end d-flex'>
                                        <button type="button" className="btn btn-success btn-label" disabled={loader ? true : false} title="SUBMIT" onClick={() => { submitFunction(); }}><i className="ri-check-double-line label-icon align-middle fs-16 me-2"></i>{loader ? <><Spinner size="sm" className='me-2 visible'></Spinner>Loading...</> : "Submit"}</button>
                                      </Col>
                                    </Row>
                                  </div>

                                </Card>

                              );
                            })}
                          </div>
                        </CardBody>
                      </Card>
                      {response.information &&
                        <Row>
                          <Col lg={12}>
                            <Card className="shadow_light">
                              <CardHeader>
                                <div className="text-center">
                                  <h4 className="card-title mb-0 bg-primary text-white">Driver Details</h4>
                                </div>
                              </CardHeader>

                              <CardBody>
                                <div className="live-preview">
                                  <div>
                                    <Row>
                                      <Col lg={6} >
                                        <div className="p-4 border mt-0 rounded" style={{ minHeight: "350px", maxHeight: "350px" }} >
                                          <Row className="justify-content-center">
                                            <div data-aos="fade-up">
                                              <img src={ima_ge} alt="Driver Image " className="img-fluid" />
                                            </div>
                                          </Row>
                                        </div>
                                      </Col>

                                      <Col lg={6} >
                                        <div className="p-4 pb-0 border mt-0 rounded" style={{ minHeight: "350px", maxHeight: "350px" }} >
                                          <Row className="justify-content-center">
                                            <div data-aos="fade-down">
                                              <div className="table-responsive">
                                                <table className="table table-borderless mb-0">
                                                  <tbody>
                                                    <tr>
                                                      <td>Name :</td>
                                                      <td className="text-end" id="cart-subtotal">{response.information.Name ? response.information.Name : "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td>License_No :</td>
                                                      <td className="text-end" id="cart-subtotal">{response.information.License_No ? response.information.License_No : "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td>Date Of Birth : </td>
                                                      <td className="text-end" id="cart-discount">{response.information.Date_of_Birth ? response.information.Date_of_Birth : "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td>Expiry Date :</td>
                                                      <td className="text-end" id="cart-shipping">{response.information.Expiry_Date ? response.information.Expiry_Date : "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td>Issue Date : </td>
                                                      <td className="text-end" id="cart-tax">{response.information.Issue_Date ? response.information.Issue_Date : "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td>Place of Issue : </td>
                                                      <td className="text-end" id="cart-tax">{response.information.Place_of_Issue ? response.information.Place_of_Issue : "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td>Nationality : </td>
                                                      <td className="text-end" id="cart-tax">{response.information.Nationality ? response.information.Nationality : "N/A"}</td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>

                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      }
                    </TabPane>
                  </TabContent>
                  <TabContent activeTab={outlineBorderNav} className="text-muted">
                    <TabPane tabId="2" id="border-nav-home">

                      <Row>

                        <Col lg={12}>
                          <Card id="customerList" className='shadow_light'>
                            <div className="card-body pt-0 mt-5">
                              <div style={{ textAlign: 'center' }}>
                                {loader && <LoaderNew></LoaderNew>}
                                <TableContainer
                                  columns={columns}
                                  data={AllDataResponse}
                                  isGlobalFilter={true}
                                  // isAddUserList={false}
                                  customPageSize={5}
                                  isGlobalSearch={true}
                                  className="custom-header-css"
                                  // handleCustomerClick={handleCustomerClicks}
                                  //isCustomerFilter={true}
                                  SearchPlaceholder='Search for Name or something...'
                                  divClass="overflow-auto"
                                />
                              </div>
                            </div>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered >
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          {"Image Preview"}
        </ModalHeader>
        <ModalBody>
          <div className="p-4 border mt-0 rounded text-center"  >
            <Row className="justify-content-center">
              <div data-aos="fade-up text-center">
                {imageData && <img src={imageData} alt="NO Data Found!" className="img-fluid" />}
              </div>
            </Row>
          </div>
        </ModalBody>
      </Modal>
      <ToastContainer closeButton={false} limit={1} />
    </React.Fragment>
  );
};

export default DriverUpload;