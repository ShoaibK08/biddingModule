import React, { useState } from "react";

//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";

import {
    Container,
    Form,
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Modal,
    ModalFooter,
    ModalHeader,
    ModalBody,
    Label,
    Input,
    DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown
} from "reactstrap";

import Select from "react-select";
import classnames from "classnames";
import { orderSummary } from "../../common/data/ecommerce";
import { Link } from "react-router-dom";

const PlaceIndent = () => {
    document.title = "Checkout | Nayara Energy - Place Indent";

    const [selectedCountry, setselectedCountry] = useState(null);
    const [selectedState, setselectedState] = useState(null);
    const [activeTab, setactiveTab] = useState(1);
    const [passedSteps, setPassedSteps] = useState([1]);
    const [modal, setModal] = useState(false);
    const [deletemodal, setDeleteModal] = useState(false);

    const toggledeletemodal = () => {
        setDeleteModal(!deletemodal);
    };

    const togglemodal = () => {
        setModal(!modal);
    };

    function handleSelectCountry(selectedCountry) {
        setselectedCountry(selectedCountry);
    }

    function handleSelectState(selectedState) {
        setselectedState(selectedState);
    }

    function toggleTab(tab) {
        if (activeTab !== tab) {
            var modifiedSteps = [...passedSteps, tab];

            if (tab >= 1 && tab <= 4) {
                setactiveTab(tab);
                setPassedSteps(modifiedSteps);
            }
        }
    }

    const productState = [
        {
            options: [
                { label: "Select State...", value: "Select State" },
                { label: "Alabama", value: "Alabama" },
                { label: "Alaska", value: "Alaska" },
                { label: "American Samoa", value: "American Samoa" },
                { label: "California", value: "California" },
                { label: "Colorado", value: "Colorado" },
                { label: "District Of Columbia", value: "District Of Columbia" },
                { label: "Florida", value: "Florida" },
                { label: "Georgia", value: "Georgia" },
                { label: "Guam", value: "Guam" },
                { label: "Hawaii", value: "Hawaii" },
                { label: "Idaho", value: "Idaho" },
                { label: "Kansas", value: "Kansas" },
                { label: "Louisiana", value: "Louisiana" },
                { label: "Montana", value: "Montana" },
                { label: "Nevada", value: "Nevada" },
                { label: "New Jersey", value: "New Jersey" },
                { label: "New Mexico", value: "New Mexico" },
                { label: "New York", value: "New York" },
            ],
        },
    ];

    const productCountry = [
        {
            options: [
                { label: "Select Country...", value: "Select Country" },
                { label: "United States", value: "United States" },
            ],
        },
    ];
    const [customerStatus1, setcustomerStatus] = useState(null);

    function handlecustomerStatus(customerStatus) {
        
        setcustomerStatus(customerStatus);
    }
    const customerstatus = [
        {
            options: [
                { label: "Shipment Type 1", value: "Shipment Type 1" },
                { label: "Shipment Type 2", value: "Shipment Type 2" },

            ],
        },
    ];

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Place Indent" pageTitle="Nayara energy" />

                    <Row>
                        <Col xl="8">
                            <Card>
                                <CardBody className="checkout-tab">
                                    <Form action="#">
                                        <div className="step-arrow-nav mt-n3 mx-n3 mb-3">
                                            <Nav
                                                className="nav-pills nav-justified custom-nav"
                                                role="tablist"
                                            >
                                                <NavItem role="presentation">
                                                    <NavLink href="#"
                                                        className={classnames({ active: activeTab === 1, done: (activeTab <= 3 && activeTab >= 0) }, "p-3 fs-15")}
                                                        onClick={() => { toggleTab(1); }}
                                                    >
                                                        <i className="ri-user-2-line fs-16 p-2 bg-soft-primary rounded-circle align-middle me-2"></i>
                                                        Basic Details
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem role="presentation">
                                                    <NavLink href="#"
                                                        className={classnames({ active: activeTab === 2, done: activeTab <= 3 && activeTab > 1 }, "p-3 fs-15")}
                                                        onClick={() => { toggleTab(2); }}
                                                    >
                                                        <i className="ri-truck-line fs-16 p-2 bg-soft-primary rounded-circle align-middle me-2"></i>
                                                        Shipping Info
                                                    </NavLink>
                                                </NavItem>
                                                {/* <NavItem role="presentation">
                          <NavLink href="#"
                            className={classnames({ active: activeTab === 3, done: activeTab <= 4 && activeTab > 2 }, "p-3 fs-15")}
                            onClick={() => { toggleTab(3); }}
                          >
                            <i className="ri-bank-card-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                            Payment Info
                          </NavLink>
                        </NavItem> */}
                                                <NavItem role="presentation">
                                                    <NavLink href="#"
                                                        className={classnames({ active: activeTab === 3, done: activeTab <= 3 && activeTab > 2 }, "p-3 fs-15")}
                                                        onClick={() => { toggleTab(3); }}
                                                    >
                                                        <i className="ri-checkbox-circle-line fs-16 p-2 bg-soft-primary  rounded-circle align-middle me-2"></i>
                                                        Finish
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId={1} id="pills-bill-info">
                                                <div>
                                                    <h5 className="mb-1">Billing Information</h5>
                                                    <p className="text-muted mb-4">
                                                        Please fill all information below
                                                    </p>
                                                </div>

                                                <div>
                                                    <Row>
                                                        <Col sm={6}>
                                                            <div className="mb-3">
                                                                <Label
                                                                    htmlFor="billinginfo-firstName"
                                                                    className="form-label"
                                                                >
                                                                    Product Code
                                                                </Label>
                                                                <Input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="billinginfo-firstName"
                                                                    //placeholder="Enter first name"
                                                                    value="M002"
                                                                />
                                                            </div>
                                                        </Col>

                                                        <Col sm={6}>
                                                            <div className="mb-3">
                                                                <Label
                                                                    htmlFor="billinginfo-lastName"
                                                                    className="form-label"
                                                                >
                                                                    Product Quantity
                                                                </Label>
                                                                <Input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="billinginfo-lastName"
                                                                //placeholder="Enter last name"
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col sm={6}>
                                                            <div className="mb-3">
                                                                <Label
                                                                    htmlFor="billinginfo-email"
                                                                    className="form-label"
                                                                >
                                                                    Shipment Type
                                                                </Label>
                                                                <Input
                                                                    type="email"
                                                                    className="form-control"
                                                                    id="billinginfo-email"
                                                                //placeholder="Enter email"
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <div>
                                                                <Label
                                                                    htmlFor="billinginfo-email"
                                                                    className="form-label"
                                                                >
                                                                    Shipment Type
                                                                </Label>
                                                                <Select
                                                                    value={customerStatus1}
                                                                    onChange={(e) => {
                                                                        handlecustomerStatus(e.value);
                                                                    }}
                                                                    options={customerstatus}
                                                                    name="choices-single-default"
                                                                    id="idStatus"
                                                                ></Select>
                                                            </div>
                                                        </Col>

                                                        {/* <Col sm={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="billinginfo-phone"
                                  className="form-label"
                                >
                                  Phone
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="billinginfo-phone"
                                  placeholder="Enter phone no."
                                />
                              </div>
                            </Col> */}
                                                    </Row>



                                                    <div className="d-flex align-items-start gap-3 mt-3">
                                                        <button
                                                            type="button"
                                                            className="btn btn-success btn-label right ms-auto nexttab"
                                                            onClick={() => {
                                                                toggleTab(activeTab + 1);
                                                            }}
                                                        >
                                                            <i className="ri-truck-line label-icon align-middle fs-16 ms-2"></i>
                                                            Proceed to Shipping
                                                        </button>
                                                    </div>
                                                </div>
                                            </TabPane>

                                            <TabPane tabId={2} id="pills-bill-info">
                                                

                                                <div className="mt-4">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <div className="flex-grow-1">
                                                            <h5 className="fs-15 mb-0">Saved Address</h5>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-success mb-3"
                                                                onClick={togglemodal}
                                                            >
                                                                Update Address
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <Row className="gy-3">
                                                        <Col lg={4} sm={6}>
                                                            <div className="form-check card-radio">
                                                                <Input
                                                                    id="shippingAddress01"
                                                                    name="shippingAddress"
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    defaultChecked
                                                                />
                                                                <Label
                                                                    className="form-check-label"
                                                                    htmlFor="shippingAddress01"
                                                                >
                                                                    <span className="mb-4 fw-bold d-block text-muted text-uppercase">
                                                                        Current Address
                                                                    </span>

                                                                    <span className="fs-15 mb-2 d-block">
                                                                        707 & 708,
                                                                    </span>
                                                                    <span className="fs-15 mb-2 d-block">
                                                                        Supreme Head Quarters
                                                                    </span>
                                                                    <span className="text-muted fw-normal text-wrap mb-1 d-block">
                                                                        Survey No.36/2, Village Baner
                                                                    </span>
                                                                    <span className="text-muted fw-normal d-block">
                                                                        Maharashtra, India
                                                                    </span>
                                                                    <span className="text-muted fw-normal d-block">
                                                                        411 021
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                            <div className="d-flex flex-wrap p-2 py-1 bg-light rounded-bottom border mt-n1">

                                                                <div>
                                                                    <Link
                                                                        to="#"
                                                                        className="d-block text-body p-1 px-2"
                                                                        onClick={toggledeletemodal}
                                                                    >
                                                                        <i className="ri-delete-bin-fill text-muted align-bottom me-1"></i>
                                                                        Remove
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col lg={4} sm={6}>
                                                            <div className="form-check card-radio">
                                                                <Input
                                                                    id="shippingAddress02"
                                                                    name="shippingAddress"
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                />
                                                                <Label
                                                                    className="form-check-label"
                                                                    htmlFor="shippingAddress02"
                                                                >
                                                                    <span className="mb-4 fw-bold d-block text-muted text-uppercase">
                                                                        Client Address
                                                                    </span>

                                                                    <span className="fs-15 mb-2 d-block">
                                                                        616 13-A,
                                                                    </span>
                                                                    <span className="fs-15 mb-2 d-block">
                                                                        Nayara Energy
                                                                    </span>
                                                                    <span className="text-muted fw-normal text-wrap mb-1 d-block">
                                                                        Survey No.36/2, Village Baner
                                                                    </span>
                                                                    <span className="text-muted fw-normal d-block">
                                                                        Maharashtra, India
                                                                    </span>
                                                                    <span className="text-muted fw-normal d-block">
                                                                        411 021
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                            <div className="d-flex flex-wrap p-2 py-1 bg-light rounded-bottom border mt-n1">

                                                                <div>
                                                                    <Link
                                                                        to="#"
                                                                        className="d-block text-body p-1 px-2"
                                                                        onClick={toggledeletemodal}
                                                                    >
                                                                        <i className="ri-delete-bin-fill text-muted align-bottom me-1"></i>
                                                                        Remove
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <div className="mt-4">


                                                        <Row className="g-4">
                                                            <Col lg={6}>

                                                                <h5 className="fs-14 mb-3">Shipping Type</h5>
                                                                <div className="form-check card-radio">
                                                                    <Input
                                                                        id="shippingMethod01"
                                                                        name="shippingMethod"
                                                                        type="radio"
                                                                        className="form-check-input"
                                                                    />
                                                                    <Label
                                                                        className="form-check-label"
                                                                        htmlFor="shippingMethod01"
                                                                    >

                                                                    </Label>
                                                                </div>
                                                            </Col>
                                                            <Col lg={6}>
                                                                <h5 className="fs-14 mb-3">Shipping Method</h5>
                                                                <div className="form-check card-radio">
                                                                    <Input
                                                                        id="shippingMethod01"
                                                                        name="shippingMethod"
                                                                        type="radio"
                                                                        className="form-check-input"
                                                                    />
                                                                    <Label
                                                                        className="form-check-label"
                                                                        htmlFor="shippingMethod01"
                                                                    >

                                                                    </Label>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-start gap-3 mt-4">

                                                    <button
                                                        type="button"
                                                        className="btn btn-success btn-label right ms-auto nexttab"
                                                        onClick={() => {
                                                            toggleTab(activeTab + 1);
                                                        }}
                                                    >
                                                        <i className="ri-bank-card-line label-icon align-middle fs-16 ms-2"></i>
                                                        Place Indent
                                                    </button>
                                                </div>
                                            </TabPane>



                                            <TabPane tabId={3} id="pills-finish">
                                                <div className="text-center py-5">
                                                    <div className="mb-4">
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/lupuorrc.json"
                                                            trigger="loop"
                                                            colors="primary:#0ab39c,secondary:#405189"
                                                            style={{ width: "120px", height: "120px" }}
                                                        ></lord-icon>
                                                    </div>
                                                    <h5>Thank you ! You have successfully placed Indent !</h5>
                                                    <p className="text-muted">
                                                        You will receive an order confirmation email with
                                                        details of your order.
                                                    </p>

                                                    <h3 className="fw-semibold">
                                                        Indent No:{" "}
                                                        <a
                                                            href="apps-ecommerce-order-details"
                                                            className="text-decoration-underline"
                                                        >
                                                            IND-001
                                                        </a>
                                                    </h3>
                                                </div>
                                            </TabPane>
                                        </TabContent>
                                    </Form>
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
                                                {orderSummary.map((product, key) => (
                                                    <React.Fragment key={key}>
                                                        <tr>
                                                            <td className="fw-semibold" colSpan="2">
                                                                <div className="avatar-md bg-light rounded p-1">
                                                                    <img
                                                                        src={product.img}
                                                                        alt=""
                                                                        className="img-fluid d-block"
                                                                    />
                                                                </div>
                                                            </td>

                                                            <td className="text-end">Petrol</td>
                                                        </tr>
                                                    </React.Fragment>
                                                ))}

                                                <tr>
                                                    <td className="fw-semibold" colSpan="2">
                                                        Indent No :
                                                    </td>
                                                    <td className="fw-semibold text-end">IND-001</td>
                                                </tr>

                                                <tr>
                                                    <td colSpan="2">Product ID :</td>
                                                    <td className="text-end">M002</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="2">Product Type: </td>
                                                    <td className="text-end">Petrolium</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="2">Quantity: </td>
                                                    <td className="text-end">-----</td>
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
