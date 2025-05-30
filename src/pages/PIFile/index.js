import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import UiContent from "../../Components/Common/UiContent";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import img6 from "../../assets/images/companies/img-6.png";
import CollapsiblePanel from "../../Components/Common/CollapsiblePanel";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";

const PIFile = () => {
  

  const [documentModal, setDocumentModal] = useState(false);

  const setViewModal = () => {
    setDocumentModal(!documentModal);
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: process.env.REACT_APP_API_USER_NAME,
      password: process.env.REACT_APP_API_PASSWORD,
    },
  };


  const text =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit.Nihil earum illo ipsa velit facilis provident qui eligendi, quia ut magnam tenetur. Accusantium nisi quos delectus in necessitatibus ad. Ducimus, id!";
  const [collapse, setCollapse] = useState(true);
  const [title, setTitle] = useState("Expand All");
  const [icon, setIcon] = useState("las la-angle-up");
  const collapseAll = () => {
    setCollapse(!collapse);
    setIcon(state => {
      return state === "las la-angle-up"
        ? "las la-angle-down"
        : "las la-angle-up";
    });
    setTitle(state => {
      return state === "Expand All" ? "Collapse All" : "Expand All";
    });
  };


  const [totalPiData, setTotalPiData] = useState([]);
  const [textData, setTextData] = useState('');
  const [idData, setIdData] = useState('');
  const [displayTag, setDisplayTag] = useState("none");
  const [HeaderName, setHeaderName] = useState("");
  const [latestHeader, setLatestHeader] = useState('');

  const savePropertiesFile = (id) => {
    if (id !== "") {
      //alert("dfdf")
      const file = new Blob([document.getElementById('properties_file_1').value],
        { type: 'text/plain;charset=utf-8' });
      //const blob = URL.createObjectURL(file);
      const form = new FormData();
      const fileOfBlob = new File([file], id + '.txt', { type: file.type });
      form.append("filePath", id);
      form.append("file", fileOfBlob);
      form.append("message", "changes in properties " + id + " file");
      form.append("author", "vikalp soni<svikalp.1994@gmail.com>");
      axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/bitbucket/bitbucketUpdateFile`, form, config)
        .then(res => {
          //console.log(res);
          toast.success(id + " Properties File Updated Successfully.", { autoClose: 3000 });
          setViewModal(!documentModal);
        });
    }
  }

  const changeTag = (id) => {
    //alert(id);
    setTextData('');
    setIdData('');
    setViewModal();
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/bitbucket/bitbucketReadFile?fileName=${id}`, config)
      .then(res => {
        const countL = res;
        setIdData(id);
        setTextData(res);
      });
  }

  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    getAllPiData();
    getHeaderName();
  }, []);

  const getHeaderName = () => {
    
    const main_menu = sessionStorage.getItem("main_menu_login");
    const obj = JSON.parse(main_menu).menuItems[38].subMenuMaster.name;
    setHeaderName(obj);
}

  const getAllPiData = () => {

    // alert("df")

    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/fileService/getAllFileMaster`, config)
      .then(res => {
        const countL = res;
        setTotalPiData(countL);
      });

  }

  document.title = "Properties" + " || EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid className="container-fluid">
          <BreadCrumb title={latestHeader} pageTitle="Confuguration" />
          <Row className="mb-4">
            <Col xxl={12}><div className=" pi_css">
              <h4 className="card-title1 m-0 ms-0 text-white">LOCAL FILE</h4></div></Col>
          </Row>
          <Row>
            {totalPiData.map((item, key) => (
              (item.flag === "L" ?
                <Col xxl={3} key={key}>
                  <Card id="company-overview">
                    <CardBody className="py-4 px-3 rounded" style={{ border: "3px solid lightblue", fontWeight: "700" }}>
                      <div class="">{item.uniqueId} <i style={{ float: "right" }} class="mdi mdi-grease-pencil" onClick={() => { changeTag(item.uniqueId); }}></i></div>
                    </CardBody>
                  </Card>
                </Col> : "")
            ))}

          </Row>

          <Row className="mb-4">
            <Col xxl={12}><div className="pi_css">
              <h4 className="card-title1 m-0 ms-0 text-white">CENTRAL FILE</h4></div></Col>
          </Row>
          <Row>
            {totalPiData.map((item, key) => (
              (item.flag === "C" ?
                <Col xxl={3} key={key}>
                  <Card id="company-overview">
                    <CardBody className="py-4 px-3 rounded" style={{ border: "3px solid lightblue", fontWeight: "700" }}>
                      <div class="">{item.uniqueId} <i style={{ float: "right" }} class="mdi mdi-grease-pencil" onClick={() => { changeTag(item.uniqueId); }}></i></div>
                    </CardBody>
                  </Card>
                </Col> : "")
            ))}
          </Row>

          {/**<Row>
            <Col xxl={12}>
              
                <CollapsiblePanel title="Weight Bridge" collapse={collapse}>  
                  <Card id="company-overview">
                  <CardBody>
                    <div className="table-responsive table-card table-c1" style={{width:"70% !important"}}>
                      <br></br><Row
                          className="g-0 justify-content-right mb-4"
                          id="pagination-element"
                          style={{width:"40% !important"}}
                        >
                          <Col sm="6">
                            <div className="pagination-block pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
                              <div className="page-item">
                                <NavLink to="" className="button-green page-link" id="page-prev">
                                  Update
                                </NavLink>
                              </div>
                              <span id="page-num" className="pagination"></span>
                              <div className="page-item">
                                <NavLink to="" className="button-red page-link" id="page-next">
                                  Cancel
                                </NavLink>
                              </div>
                            </div>
                          </Col>
                        </Row>
                    </div>
                  </CardBody>
              </Card>
              
              </CollapsiblePanel>
            </Col>
            <Col xxl={12}>
              
            <CollapsiblePanel title="SEP Service" collapse={collapse}> 
              <Card id="company-overview">
                <CardBody>  
                <div className="table-responsive table-card table-c1" style={{width:"70% !important"}}>
                    <br></br><Row
                          className="g-0 justify-content-right mb-4"
                          id="pagination-element"
                          style={{width:"40% !important"}}
                        >
                          <Col sm="6">
                            <div className="pagination-block pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
                              <div className="page-item">
                                <NavLink to="" className="button-green page-link" id="page-prev">
                                  Update
                                </NavLink>
                              </div>
                              <span id="page-num" className="pagination"></span>
                              <div className="page-item">
                                <NavLink to="" className="button-red page-link" id="page-next">
                                  Cancel
                                </NavLink>
                              </div>
                            </div>
                          </Col>
                        </Row>
                  </div>
                </CardBody>
              </Card>              
              </CollapsiblePanel>
            </Col>
          </Row> */}
          <ToastContainer closeButton={false} limit={1} />
        </Container>
      </div>
      <Modal isOpen={documentModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="xl" toggle={setViewModal}>
        <ModalHeader toggle={() => {
          setViewModal(!documentModal);
        }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-white fs-20">Properties File</h5>
        </ModalHeader>
        <ModalBody>
          <Form>
            <div className="product-content mt-0">
              <div id={"get-cmd-1"} className="common-cl-class">
                <label>Properties File</label>
                <textarea className="form-control" name="properties_file" id="properties_file_1" rows="20" defaultValue={textData}></textarea>
                {/** <CKEditor
              editor={ClassicEditor}
              data={textData}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                
              }}
              onChange={ ( event, editor ) => {
                const data = editor.getData();
                console.log( { event, editor, data } );
              }}
            /> */}
                <br></br><Row
                  className="g-0 justify-content-right mb-4"
                  id="pagination-element"
                  style={{ width: "40% !important" }}
                >
                  <Col sm="6">
                    <div className="pagination-block pagination pagination-separated mb-sm-0">
                      <div className="page-item">
                        <NavLink to="" onClick={() => { savePropertiesFile(idData); }} /*onClick={savePropertiesFile(idData)}*/ className="button-green page-link" id="page-prev">
                          Update
                        </NavLink>
                      </div>
                      <span id="page-num" className="pagination"></span>
                      <div className="page-item">
                        <NavLink to="" onClick={() => { setViewModal(!documentModal); }} className="button-red page-link" id="page-next">
                          Cancel
                        </NavLink>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default PIFile;
