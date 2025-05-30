import React, { useState } from 'react';
import { Card, CardBody, Col, Row, Container, CardHeader } from 'reactstrap';
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import BreadCrumb from '../../Components/Common/BreadCrumb';

// Import React FilePond
import { FilePond,  registerPlugin } from 'react-filepond';
// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const VehicleUpload = () => { 
  const [selectedFiles, setselectedFiles] = useState([]);
  const [files, setFiles] = useState([]);

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
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
  document.title ="Vehicle || OCR";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Vehicle" pageTitle="OCR" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="card-header">
                  <h4 className="card-title mb-0 bg-light shadow_light">Upload Image</h4>
                </CardHeader>
                <CardBody>

                  <p className="text-muted">Please upload image in JPG, JPEG, PNG format only.</p>
                  <Dropzone
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
                  </Dropzone>
                  <div className="list-unstyled mb-0" id="file-previews">
                    {selectedFiles.map((f, i) => {
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
                                  {f.name}
                                </Link>
                                <p className="mb-0">
                                  <strong>{f.formattedSize}</strong>
                                </p>
                              </Col>
                              <Col className='justify-content-end d-flex'>
                              <button type="button" class="btn btn-success btn-label" title="SUBMIT" ><i className="ri-check-double-line label-icon align-middle fs-16 me-2"></i>Submit</button>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VehicleUpload;