import React, { useState, useEffect } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
    Container,
    Form,
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    Modal,
    ModalFooter,
    ModalHeader,
    ModalBody,
    Label,
    Input,
} from "reactstrap";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { orderSummary } from "../../common/data/ecommerce";

import {
    addNewRaiseIndent1 as onRaiseIndent,
    getTransporters as onGetTransporters,
} from "../../../src/store/actions";
import PlaceIndentForm from "./PlaceIndentForm";

const PlaceIndent = () => {
    const [isKycVerification, setIsKycVerification] = useState(false);
    const toggleKycVerification = () => setIsKycVerification(!isKycVerification);
    const [customerList, setCustomerList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [customerType, setCustomerType] = useState([]);
    const [shipType, setShipType] = useState('');
    const [payerType, setPayerType] = useState('');
    const [activeTab, setActiveTab] = useState(1);
    const [passedSteps, setPassedSteps] = useState([1]);
    const [selectedFiles, setselectedFiles] = useState([]);
    const [displaySet, setDisplaySet] = useState('block');
    const [radioSet, setRadioSet] = useState('none');
    const [displaySet2, setDisplaySet2] = useState('block');
    const [modal, setModal] = useState(false);
    const [deletemodal, setDeleteModal] = useState(false);

    const toggledeletemodal = () => {
        setDeleteModal(!deletemodal);
    };

    const togglemodal = () => {
        setModal(!modal);
    };

    const { transporters } = useSelector((state) => ({
        transporters: state.Master.transporters,
    }));

    const dispatch = useDispatch();

    function toggleTab(tab) {
        if (activeTab !== tab) {
            var modifiedSteps = [...passedSteps, tab];

            if (tab >= 1 && tab <= 4) {
                setActiveTab(tab);
                setPassedSteps(modifiedSteps);
            }
        }
    }

    const [selectCountry, setselectCountry] = useState(null);

    function handleselectCountry(selectCountry) {
        setselectCountry(selectCountry);
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

    const handleSelectRadio = (event) => {
        var index = event.target.value;
        if (index === "trans") {
            setDisplaySet("none");
            setDisplaySet2("block");
        }
        if (index === "other") {
            setDisplaySet("block");
            setDisplaySet2("none");

        }
        console.log(index);
    };

    function handleAcceptedFiles(files) {
        files.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        );
        setselectedFiles(files);
    }

    const refreshTransporter = () => {
        var select = document.getElementById('transporter_id');
        select.value = '';
    };

    const handleSelectTransporter = (event) => {
        const index = event.target.selectedIndex;
        const optionElement = event.target.childNodes[index];
        const transporter_name = document.getElementById("transporter_name");
        const transporter_code = optionElement.getAttribute('value');
        transporter_name.value = transporter_code;
    };




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
    };

    const [singleProduct, setPosts] = useState([]);
    const [image, setImages] = useState([]);
    const [productQty, setProductQty] = useState([])
    useEffect(() => {
        const Product_ID = localStorage.getItem('ProductID');
        const Product = localStorage.getItem('ProductQuantity');
        //alert(Product.replace(/[^0-9\.]+/g,""));
        setProductQty(Product.replace(/[^0-9\.]+/g, ""));

        axios.get(`http://localhost:8043/sapModule/getMaterialByMaterialCode/${Product_ID}`)
            .then(res => {
                //console.log(res)
                setPosts(res);
                setImages(res.image[0]);

            })
            .catch(err => {
                console.log(err)
            })

    },[]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Place Indent" pageTitle="Nayara energy" />

                    <Row>
                        <Col xl="8">
                            <Card>
                                <CardBody className="checkout-tab">
                                    <PlaceIndentForm></PlaceIndentForm>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card>
                                <CardHeader className="bg-success" style={{ borderRadius: '5px 5px 0px 0px !important' }}>
                                    <div className="d-flex">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-0 text-white" >Order Summary</h5>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="table-responsive table-card">
                                        <table className="table table-borderless align-middle mb-0">
                                            <thead className="table-light text-muted">
                                                <tr>
                                                    <th style={{ width: "90px" }} scope="col">
                                                        Product
                                                    </th>
                                                    <th></th>
                                                    <th scope="col" className="text-end">
                                                        Details
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                
                                                    <React.Fragment>
                                                        <tr>
                                                            <td className="fw-semibold pb-0" colSpan="2">
                                                                <div className="avatar-md bg-light rounded p-1">
                                                                    <img
                                                                        src={process.env.PUBLIC_URL + "/subImage/" + image}
                                                                        alt=""
                                                                        className="img-fluid d-block"
                                                                    />
                                                                </div>
                                                            </td>

                                                            <td className="text-end">{singleProduct.material_name}</td>
                                                        </tr>
                                                    </React.Fragment>
                                                

                                                <tr>
                                                    <td colSpan="2">Product Code :</td>
                                                    <td className="text-end">{singleProduct.material_code}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="2">Product Quantity: </td>
                                                    <td className="text-end">{productQty}&nbsp;{singleProduct.material_uom}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="2">Product Type: </td>
                                                    <td className="text-end">{singleProduct.material_category}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="2">Status: </td>
                                                    <td className="text-end" style={{color:"green"}}>Available</td>
                                                </tr>
                                                <tr className="table-active">
                                                    <th colSpan="2">Seller :</th>
                                                    <td className="text-end">
                                                        <span className="fw-semibold">Nayara Energy</span>
                                                    </td>
                                                </tr>
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            {/* modal Delete Address */}
            <Modal
                isOpen={deletemodal}
                role="dialog"
                autoFocus={true}
                centered
                id="removeItemModal"
                toggle={toggledeletemodal}
            >
                <ModalHeader toggle={() => {
                    setDeleteModal(!deletemodal);
                }}>
                </ModalHeader>
                <ModalBody>
                    <div className="mt-2 text-center">
                        <lord-icon
                            src="https://cdn.lordicon.com/gsqxdxog.json"
                            trigger="loop"
                            colors="primary:#f7b84b,secondary:#f06548"
                            style={{ width: "100px", height: "100px" }}
                        ></lord-icon>
                        <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                            <h4>Are you Sure ?</h4>
                            <p className="text-muted mx-4 mb-0">
                                Are you Sure You want to Remove this Address ?
                            </p>
                        </div>
                    </div>
                    <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                        <button
                            type="button"
                            className="btn w-sm btn-light"
                            onClick={() => {
                                setDeleteModal(!deletemodal);
                            }}
                        >
                            Close
                        </button>
                        <button type="button" className="btn w-sm btn-danger" onClick={() => {
                            setDeleteModal(!deletemodal);
                        }}>
                            Yes, Delete It!
                        </button>
                    </div>
                </ModalBody>
            </Modal>

            {/* modal Add Address */}
            <Modal
                isOpen={modal}
                role="dialog"
                autoFocus={true}
                centered
                id="addAddressModal"
                toggle={togglemodal}
            >
                <ModalHeader
                    toggle={() => {
                        setModal(!modal);
                    }}
                >
                    <h5 className="modal-title" id="addAddressModalLabel">
                        Address
                    </h5>
                </ModalHeader>
                <ModalBody>
                    <div>
                        <div className="mb-3">
                            <Label for="addaddress-Name" className="form-label">
                                Name
                            </Label>
                            <Input
                                type="text"
                                className="form-control"
                                id="addaddress-Name"
                                placeholder="Enter Name"
                            />
                        </div>

                        <div className="mb-3">
                            <Label for="addaddress-textarea" className="form-label">
                                Address
                            </Label>
                            <textarea
                                className="form-control"
                                id="addaddress-textarea"
                                placeholder="Enter Address"
                                rows="2"
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <Label for="addaddress-Name" className="form-label">
                                Phone
                            </Label>
                            <Input
                                type="text"
                                className="form-control"
                                id="addaddress-Name"
                                placeholder="Enter Phone No."
                            />
                        </div>

                        <div className="mb-3">
                            <Label for="state" className="form-label">
                                Address Type
                            </Label>
                            <select className="form-select" id="state" data-plugin="choices">
                                <option value="homeAddress">Home (7am to 10pm)</option>
                                <option value="officeAddress">Office (11am to 7pm)</option>
                            </select>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => {
                            setModal(!modal);
                        }}
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                            setModal(!modal);
                        }}
                    >
                        Save
                    </button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
};

export default PlaceIndent;
