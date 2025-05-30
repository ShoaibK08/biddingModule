import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Row,Col, Container, Modal, ModalBody, ModalHeader} from 'reactstrap';
import ParticlesAuth from "../ParticlesAuth";
import { useState } from 'react';


//import images
import logoLight from "../../../assets/images/Logo_dark.png";
import avatar1 from "../../../assets/images/users/user-dummy-img.jpg";




const BasicLockScreen = (props) => {
    const navigate = useNavigate();

    const [modal_center, setmodal_center] = useState(false);
    const [userdata, setUserData] = useState({});

    useEffect(()=>{
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        setUserData(obj.data);
    },[]);

    function tog_center() {
        setmodal_center(!modal_center);
    }
    let [password, setPassword] = useState('');

    let handleSubmit = (e) => {
        
        e.preventDefault();
        const obj = JSON.parse(sessionStorage.getItem("main_menu_login"));
        const prePassword = obj.password;
        let passwordVal = password;
        if(passwordVal === prePassword){
            navigate(-1);
        }
        else{
            setmodal_center(true);
        }
    }

    let handleChange = (e) => {
        let value = e.target.value;
        console.log(value);
        setPassword(value);
    }

    document.title = "Lock Screen | EPLMS";
    return (
        <React.Fragment>
            <div className="auth-page-content">
                  <div className="auth-page-wrapper">
                    <ParticlesAuth>
                        <div className="auth-page-content">
                            <Container>
                                <Row className="justify-content-center">
                                <Col md={8} lg={5} xl={5}>
                                        <Card className="mt-4">
                                            <CardBody className="p-4">
                                                <div className="text-center">
                                                <div style={{ padding: "2vh" }}>
                                                        <Link to="/" className="d-inline-block auth-logo">
                                                            <img src={logoLight} alt="" style={{height:"14vh"}}/>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <h5 className="text-primary" style={{ fontWeight: "bold", marginTop: "-10px" }}>Lock Screen</h5>
                                                    <p className="text-muted">Enter your password to unlock the screen!</p>
                                                </div>
                                                <div className="user-thumb text-center">
                                                    <img src={avatar1} className="rounded-circle img-thumbnail avatar-lg" alt="thumbnail" />
                                                    <h5 className="font-size-15 mt-3">{userdata.first_name}</h5>
                                                </div>
                                                <div className="p-2 mt-2">
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="mb-2">
                                                            <label className="form-label" htmlFor="userpassword">Password</label>
                                                            <input type="password" className="form-control" id="userpassword" placeholder="Enter password" required onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-2 mt-4">
                                                            <Button color="success" className="w-100" type="submit" >Unlock</Button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </CardBody>
                                        </Card>
                                        <div className="mt-4 text-center">
                                            <p className="mb-0">Not you ? return <Link to="/Login" className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                        </div>
                                    </Col>





                                    <Modal isOpen={modal_center}  toggle={() => { tog_center(); }} centered >
                                        <ModalHeader className="modal-title" />

                                        <ModalBody className="text-center p-5">
                                            <lord-icon src="https://cdn.lordicon.com/hrqwmuhr.json"
                                                trigger="loop" colors="primary:#121331,secondary:#08a88a" style={{ width: "120px", height: "120px" }}>
                                            </lord-icon>
                                            <div className="mt-4">
                                                <h4 className="mb-3">Oops something went wrong!</h4>
                                                <p className="text-muted mb-4"> The password you have entered is incorrect.</p>
                                                <div className="hstack gap-2 justify-content-center">
                                                    {/* <Button color="light" onClick={() => setmodal_center(false)}>Close</Button> */}
                                                    <Link to="#" className="btn btn-danger" onClick={() => setmodal_center(false)}>Try Again</Link>
                                                </div>
                                            </div>
                                        </ModalBody>
                                    </Modal>

                                </Row>
                            </Container>
                        </div>
                    </ParticlesAuth>
                </div>
            </div>
        </React.Fragment>
    );
};

export default BasicLockScreen;