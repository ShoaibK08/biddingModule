import React, { useState, useEffect } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Container,
    Form,
    Row,
    Col,
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
    UncontrolledAlert
} from "reactstrap";
import classnames from "classnames";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import {
    addNewRaiseIndent1 as onRaiseIndent,
    getTransporters as onGetTransporters,
} from "../../../src/store/actions";

const PlaceIndentForm = () => {
    const [isKycVerification, setIsKycVerification] = useState(false);
    const toggleKycVerification = () => setIsKycVerification(!isKycVerification);
    const [customerList, setCustomerList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [customerType, setShipToParty] = useState([]);
    const [setSoldToDropdownList, setSoldToDropdown] = useState([]);
    const [customerTypeShipTo, setSoldToParty] = useState([]);
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

    const [singleProduct, setPosts] = useState([]);
    const [productQty, setProductQty] = useState([]);
    const [soldToCode, setSoldToCode] = useState(false);
    const [dateBlank, setdateError] = useState(false);
    const [SoldToError, setSoldToError] = useState(false);

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

    function toggleTab(tab, date) {
        
        if (materialRequiredDate && tab === 2) {
            if (activeTab !== tab) {
                var modifiedSteps = [...passedSteps, tab];

                if (tab >= 1 && tab <= 4) {
                    setActiveTab(tab);
                    setPassedSteps(modifiedSteps);
                    setdateError(false);
                }
            }
        }
        else if (soldToCode && soldToPartyAddress && tab === 3) {
            if (activeTab !== tab) {
                var modifiedSteps = [...passedSteps, tab];

                if (tab >= 1 && tab <= 4) {
                    setActiveTab(tab);
                    setPassedSteps(modifiedSteps);
                    setSoldToError(false);
                }
            }
        }
        else if (materialRequiredDate && tab === 1) {
            if (activeTab !== tab) {
                var modifiedSteps = [...passedSteps, tab];

                if (tab >= 1 && tab <= 4) {
                    setActiveTab(tab);
                    setPassedSteps(modifiedSteps);
                    setdateError(false);
                }
            }
        }

        else {
            if (tab === 2) { setdateError(true); }
            if (tab === 3) { setSoldToError(true); }


        }


    }

    const [selectCountry, setselectCountry] = useState(null);
    const [transporterRadio, setTransporterRadio] = useState("");

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
        setErrorRadio(false);
        var index = event.target.value;
        if (index === "trans") {
            setDisplaySet("none");
            setDisplaySet2("block");
        }
        if (index === "other") {
            setDisplaySet("block");
            setDisplaySet2("none");

        }
        setTransporterRadio(event.target.value);
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
        setTransporter(transporter_code);
        setTransporterID(optionElement.dataset.code);
        setTransporterError(false);
    };

    const country = [
        {
            options: [
                { label: "Select country", value: "Select country" },
                { label: "Argentina", value: "Argentina" },
                { label: "Belgium", value: "Belgium" },
                { label: "Brazil", value: "Brazil" },
                { label: "Colombia", value: "Colombia" },
                { label: "Denmark", value: "Denmark" },
                { label: "France", value: "France" },
                { label: "Germany", value: "Germany" },
                { label: "Mexico", value: "Mexico" },
                { label: "Russia", value: "Russia" },
                { label: "Spain", value: "Spain" },
                { label: "Syria", value: "Syria" },
                { label: "United Kingdom", value: "United Kingdom" },
                {
                    label: "United States of America",
                    value: "United States of America",
                },
            ],
        },
    ];


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

    useEffect(() => {
        if (transporters && !transporters.length) {
            dispatch(onGetTransporters());
        }
    }, [dispatch, transporters]);

    useEffect(() => {
        const Product_ID = localStorage.getItem('ProductID');
        const Product = localStorage.getItem('ProductQuantity');
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        //alert(Product.replace(/[^0-9\.]+/g,""));
        setProductQty(Product.replace(/[^0-9\.]+/g, ""));

        axios.get(`http://localhost:8043/sapModule/getMaterialByMaterialCode/${Product_ID}`)
            .then(res => {
                //console.log(res)
                setPosts(res);

            })
            .catch(err => {
                console.log(err)
            })
        if (customerList && !customerList.length) {
            axios.get("http://localhost:8043/sapModule/sap/getAll")
                .then(res => {
                    setCustomerList(res);
                })
                .catch(err => {
                    console.log(err);
                });
        }

        if (productList && !productList.length) {
            
            axios.get("http://localhost:8043/sapModule/getProductByCustomer", { params: { "customerCode": `${obj.data._id}` } })
                .then(res => {
                    setProductList(res);
                })
                .catch(err => {
                    console.log(err);
                });
        }

        if (!customerType.length && customerType) {
            
            sessionStorage.getItem("authUser");
            const obj = JSON.parse(sessionStorage.getItem("authUser"));
            let str = obj.data._id;

            axios.get(`${process.env.REACT_APP_LOCAL_URL}/userModule/users/userData`, { params: { "userCode": `${obj.data._id}` } })
                .then(res => {
                    if (str.includes("CU")) {
                        setSoldToParty(res.message[0].soldtoparty[0]);
                        setShipToParty(res.message[0].soldtoparty[0].shiptoParty[0]);
                        setPayerType((res.message[0].payerName) ? (res.message[0].payerName) : (res.message[0].firstname + " " + res.message[0].lastname));
                        console.log(res.message[0].soldtoparty);
                        setSoldToDropdown(res.message);
                    }
                    if (str.includes("SO")) {
                        setSoldToParty(res.message[0]);
                        setShipToParty(res.message[0].shiptoParty[0]);
                        setPayerType((res.message[0].payerName) ? (res.message[0].payerName) : (res.message[0].firstname + " " + res.message[0].lastname));
                        setSoldToDropdown(res.message);
                    }
                    //alert(JSON.stringify(res.message[0]));
                    setShipType(res.message[0].shiping_type);
                    if (res.message[0].shiping_type === 'XMI') {
                        setRadioSet('block');
                        setDisplaySet('none');
                        setDisplaySet2('none');
                    }
                    if (res.message[0].shiping_type === 'DEO') {
                        setDisplaySet('none');
                        setDisplaySet2('none');
                        setRadioSet('none');
                    }

                    //alert(customerType);
                })
                .catch(err => {
                    console.log(err);
                });
        }

    }, []);

    const [getSTPList, setshipToPartyList] = useState([]);
    const [getFalse, setFalse] = useState(false);
    const [ShipToPartyOnRadioSelect, setShipToPartyOnRadioSelect] = useState("");

    const handleInputChange = (e) => {
        
        const { name, value } = e.target;
        setSoldToCode(value);
        axios.get(`${process.env.REACT_APP_LOCAL_URL}/userModule/users/getShiptopartyBySoldtopartyCode?soldtopartyCode=${value}`)
            .then(res => {
                console.log(res);
                setshipToPartyList(res);
                setFalse(true);
                setSoldToError(false);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const renObjData = getSTPList.map(function (data, idx) {
        
        const handleAddress = (event) => {
            var index = event.target.value;
            if (index === "customer") {
                setCusomer(true);
                setSoldToPartyaddress(false);
                setSoldToError(false);
            }
            if (index === "soldToParty") {
                setSoldToPartyaddress(true);
                setCusomer(false);
                setSoldToError(false);
                setShipToPartyOnRadioSelect(data.shiptoparty_code);

            }
            //alert(index);
        };
        return ([
            <Col lg={4} sm={6} key={idx} className="mt-2 mb-2">
                <div className="form-check card-radio">
                    <Input
                        id={data.id}
                        name="shippingAddress"
                        type="radio"
                        className="form-check-input"
                        value="soldToParty"
                        onClick={handleAddress}
                    />
                    <Label
                        className="form-check-label shadow"
                        htmlFor={data.id}
                    >
                        <span className="mb-1 fw-bold d-block text-muted text-uppercase">
                            {data.firstname + " " + data.lastname}
                        </span>
                        <span className="fs-15 mb-1 d-block">
                            Plant Name : {data.plant_name}
                        </span>
                        <span className="text-muted fw-normal d-block">
                            City : {data.city}
                        </span>
                        <span className="text-muted fw-normal d-block">
                            Mobile Number : {data.contact}
                        </span>
                    </Label>
                </div>
            </Col>
        ]);
    });

    const test = setSoldToDropdownList.map(function (value, index) {
        
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let str = obj.data._id;
        if (str.includes("SO")) {
            return ([
                <>
                    <Input
                        name="weightBasedLiquid"
                        type="select"
                        className="form-select"
                        key={index}
                        //value={values.company}
                        onChange={handleInputChange}
                    >
                        <option disabled selected={true}>Select Sold To Party</option>
                        <option value={value.soldtoparty_code} >{`${value.firstname} / ${value.soldtoparty_code}`}</option>

                    </Input>
                </>
            ]);
        }
        else if (str.includes("CU")) {
            return ([
                <>
                    <Input
                        name="weightBasedLiquid"
                        type="select"
                        className="form-select"
                        key={index}
                        //value={values.company}
                        onChange={handleInputChange}
                    >
                        <option disabled selected value="">Select Sold To Party</option>
                        {Object.entries(value.soldtoparty).map(([firstname, data]) => (
                            <option value={data.soldtoparty_code} key={firstname}>{`${data.firstname} / ${data.soldtoparty_code}`}</option>
                        ))}
                    </Input>
                </>
            ]);
        }


    });

    const [materialRequiredDate, setMaterialReqDate] = React.useState("");
    const [LRDate, setLRDtae] = React.useState("");
    const [vehicleNumber, setVehicleNumber] = React.useState("");
    const [LRNumber, setLrNumber] = React.useState("");
    const [capacity, setCapacity] = React.useState("");
    const [transporter, setTransporter] = React.useState("");
    const [transporterID, setTransporterID] = React.useState("");
    const [customerAddress, setCusomer] = React.useState(false);
    const [soldToPartyAddress, setSoldToPartyaddress] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState("");
    const [alertFlag, setAlert] = React.useState(false);
    const [finalFlag, setFinal] = React.useState(false);
    const [indentNumber, setIndentNumber] = React.useState(false);
    const [radioError, setErrorRadio] = useState(false);
    const [transporterError, setTransporterError] = useState(false);
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const [error3, setError3] = useState(false);
    const [error4, setError4] = useState(false);



    // const PlaceIndent = () => {
    //     
    //     var arr = [];
    //     if (customerAddress) {
    //         var values = {};
    //         values["customerType"] = customerType.customer_type;
    //         values["indentPlaceBy"] = customerType.customer_code;
    //         values["lrDate"] = LRDate;
    //         values["lrNumber"] = LRNumber;
    //         values["payerName"] = customerType.firstname;
    //         values["product"] = singleProduct.material_code;
    //         values["productDate"] = materialRequiredDate;
    //         values["shipToParty"] = "";
    //         values["shipmentType"] = customerType.shiping_type;
    //         values["soldToParty"] = "";
    //         values["status"] = customerType.status;
    //         values["ttCalibratedCapacity"] = capacity;
    //         values["unitMeasurement"] = productQty;
    //         values["vehicleNumber"] = vehicleNumber;
    //         values["transporterId"] = transporterID;
    //         values["transpoterName"] = transporter;

    //         arr.push(values);
    //     }
    //     else if (soldToPartyAddress) {
    //         var values = {};
    //         values["customerType"] = customerTypeShipTo.customer_type;
    //         values["indentPlaceBy"] = customerTypeShipTo.customer_code;
    //         values["lrDate"] = LRDate;
    //         values["lrNumber"] = LRNumber;
    //         values["payerName"] = customerTypeShipTo.firstname;
    //         values["product"] = singleProduct.material_code;
    //         values["productDate"] = materialRequiredDate;
    //         values["shipToParty"] = "";
    //         values["shipmentType"] = customerTypeShipTo.shiping_type;
    //         values["soldToParty"] = customerTypeShipTo.soldtoparty_code;
    //         values["status"] = customerTypeShipTo.status;
    //         values["ttCalibratedCapacity"] = parseInt(capacity);
    //         values["unitMeasurement"] = "";
    //         values["quantity"] = parseInt(productQty);
    //         values["vehicleNumber"] = vehicleNumber;
    //         values["transporterId"] = transporterID;
    //         values["transpoterName"] = transporter;

    //         arr.push(values);
    //     }

    //     //alert(JSON.stringify(arr));

    //     var authOptions = {
    //         method: 'post',
    //         url: `${process.env.REACT_APP_LOCAL_URL_8042}/indentModule/indent/placeMultipleIndent`,
    //         data: arr,
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         json: true
    //     };
    //     axios(authOptions)
    //         .then((response) => {
    //             console.log(response);
    //             if (response[0].msg === "UOM is greater then vehicle capacity") {
    //                 setErrorMsg(response[0].msg);
    //                 setAlert(true);
    //             }
    //             else if (response[0].msg === "Vehicle is not registered") {
    //                 setErrorMsg(response[0].msg);
    //                 setAlert(true);
    //             }
    //             else {
    //                 setFinal(true);
    //                 setIndentNumber(response[0].data.indentNo);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             setErrorMsg("Somthing went wrong!");
    //             setAlert(true);
    //         })



    // }


    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Place Indent through JBPM>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    const PlaceIndent = () => {
        
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let customerCode = obj.data._id;

        if (transporterRadio === "trans") {
            if (transporter) {
                if (customerAddress) {
                    var values = {};
                    values["customerType"] = customerType.customer_type;
                    values["indentPlaceBy"] = customerCode;
                    values["lrDate"] = LRDate;
                    values["lrNumber"] = LRNumber;
                    values["payerName"] = customerType.firstname;
                    values["product"] = singleProduct.material_code;
                    values["productDate"] = materialRequiredDate;
                    values["shipToParty"] = "";
                    values["shipmentType"] = shipType;
                    values["soldToParty"] = "";
                    values["status"] = customerType.status;
                    values["ttCalibratedCapacity"] = capacity;
                    values["unitMeasurement"] = singleProduct.material_uom;
                    values["vehicleNumber"] = vehicleNumber;
                    values["transporterId"] = transporterID;
                    values["transpoterName"] = transporter;
                }
                else if (soldToPartyAddress) {
                    var values = {};
                    values["customerType"] = customerTypeShipTo.customer_type;
                    values["indentPlaceBy"] = customerCode;
                    values["lrDate"] = LRDate;
                    values["lrNumber"] = LRNumber;
                    values["payerName"] = customerTypeShipTo.firstname;
                    values["product"] = singleProduct.material_code;
                    values["productDate"] = materialRequiredDate;
                    values["shipToParty"] = ShipToPartyOnRadioSelect;
                    values["shipmentType"] = shipType;
                    values["soldToParty"] = customerTypeShipTo.soldtoparty_code;
                    values["status"] = customerTypeShipTo.status;
                    values["ttCalibratedCapacity"] = parseInt(capacity);
                    values["unitMeasurement"] = singleProduct.material_uom;
                    values["quantity"] = parseInt(productQty);
                    values["vehicleNumber"] = vehicleNumber;
                    values["transporterId"] = transporterID;
                    values["transpoterName"] = transporter;

                }

                var Object1 = {
                    "workflowRequest": values,
                    "approvalFlag": "N"
                }

                console.log(JSON.stringify(Object1));
                //alert(JSON.stringify(arr));
                if (shipType === "XMI") {
                    var authOptions = {
                        method: 'post',
                        url: 'http://localhost:8090/rest/server/containers/NayaraBusinessProcesses-kjar-2.0.3/processes/XMIProcess/instances',
                        data: JSON.stringify(Object1),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        json: true
                    };
                }
                else {
                    var authOptions = {
                        method: 'post',
                        url: 'http://localhost:8090/rest/server/containers/NayaraBusinessProcesses-kjar-2.0.3/processes/DeliveredProcess/instances',
                        data: JSON.stringify(Object1),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        json: true
                    };
                }

                axios(authOptions)
                    .then((response) => {
                        console.log(response);
                        if (response) {
                            setFinal(true);
                            setIndentNumber(response);
                            //callAnotherFunction();
                        }
                        else {
                            setErrorMsg("Something went worng!");
                            setAlert(true);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        setErrorMsg("Something went wrong!");
                        setAlert(true);
                    })

            }
            else {
                setTransporterError(true);
            }
        }
        else if (transporterRadio === "other") {
            if (vehicleNumber) {
                if (LRNumber) {
                    if (LRDate) {
                        if (capacity) {
                            if (customerAddress) {
                                var values = {};
                                values["customerType"] = customerType.customer_type;
                                values["indentPlaceBy"] = customerCode;
                                values["lrDate"] = LRDate;
                                values["lrNumber"] = LRNumber;
                                values["payerName"] = customerType.firstname;
                                values["product"] = singleProduct.material_code;
                                values["productDate"] = materialRequiredDate;
                                values["shipToParty"] = "";
                                values["shipmentType"] = shipType;
                                values["soldToParty"] = "";
                                values["status"] = customerType.status;
                                values["ttCalibratedCapacity"] = capacity;
                                values["unitMeasurement"] = singleProduct.material_uom;
                                values["vehicleNumber"] = vehicleNumber;
                                values["transporterId"] = transporterID;
                                values["transpoterName"] = transporter;
                            }
                            else if (soldToPartyAddress) {
                                var values = {};
                                values["customerType"] = customerTypeShipTo.customer_type;
                                values["indentPlaceBy"] = customerCode;
                                values["lrDate"] = LRDate;
                                values["lrNumber"] = LRNumber;
                                values["payerName"] = customerTypeShipTo.firstname;
                                values["product"] = singleProduct.material_code;
                                values["productDate"] = materialRequiredDate;
                                values["shipToParty"] = ShipToPartyOnRadioSelect;
                                values["shipmentType"] = shipType;
                                values["soldToParty"] = customerTypeShipTo.soldtoparty_code;
                                values["status"] = customerTypeShipTo.status;
                                values["ttCalibratedCapacity"] = parseInt(capacity);
                                values["unitMeasurement"] = singleProduct.material_uom;
                                values["quantity"] = parseInt(productQty);
                                values["vehicleNumber"] = vehicleNumber;
                                values["transporterId"] = transporterID;
                                values["transpoterName"] = transporter;

                            }

                            var Object1 = {
                                "workflowRequest": values,
                                "approvalFlag": "N"
                            }

                            console.log(JSON.stringify(Object1));
                            //alert(JSON.stringify(arr));
                            if (shipType === "XMI") {
                                var authOptions = {
                                    method: 'post',
                                    url: 'http://localhost:8090/rest/server/containers/NayaraBusinessProcesses-kjar-2.0.3/processes/XMIProcess/instances',
                                    data: JSON.stringify(Object1),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    json: true
                                };
                            }
                            else {
                                var authOptions = {
                                    method: 'post',
                                    url: 'http://localhost:8090/rest/server/containers/NayaraBusinessProcesses-kjar-2.0.3/processes/DeliveredProcess/instances',
                                    data: JSON.stringify(Object1),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    json: true
                                };
                            }

                            axios(authOptions)
                                .then((response) => {
                                    console.log(response);
                                    if (response) {
                                        setFinal(true);
                                        setIndentNumber(response);
                                        //callAnotherFunction();
                                    }
                                    else {
                                        setErrorMsg("Something went worng!");
                                        setAlert(true);
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                    setErrorMsg("Somthing went wrong!");
                                    setAlert(true);
                                })
                        }
                        else {
                            setError4(true);
                        }
                    }
                    else {
                        setError3(true);
                    }
                }
                else {
                    setError2(true);
                }
            }
            else {
                setError1(true);
            }
        }
        else {
            setErrorRadio(true);
        }
    }


    return (
        <React.Fragment>
            <form action="#" className="checkout-tab">
                <ModalBody className="p-0">
                    <div className="step-arrow-nav">
                        <Nav
                            className="nav-pills nav-justified custom-nav"
                            role="tablist"
                        >
                            <NavItem>
                                <NavLink
                                    href="#"
                                    className={classnames({ active: activeTab === 1, done: (activeTab <= 4 && activeTab >= 0) }, "p-3")}
                                    onClick={() => {
                                        toggleTab(1);
                                    }}
                                >
                                    Basic Info
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    href="#"
                                    className={classnames({ active: activeTab === 2, done: activeTab <= 4 && activeTab > 1 }, "p-3")}
                                    onClick={() => {
                                        toggleTab(2);
                                    }}
                                >
                                    Shipping Details
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    href="#"
                                    className={classnames({ active: activeTab === 3, done: activeTab <= 4 && activeTab > 2 }, "p-3")}
                                    onClick={() => {
                                        toggleTab(3);
                                    }}
                                >
                                    Shipment Detail
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </div>
                </ModalBody>
                <div className="modal-body">
                    <UncontrolledAlert color="danger" className="mb-0 mt-3" isOpen={alertFlag} toggle={() => setAlert(false)}>
                        <strong>{errorMsg}</strong>
                    </UncontrolledAlert>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId={1}>
                            <Row className="g-3 mt-2">
                                <Col lg={6}>
                                    <div>
                                        <Label for="firstName" className="form-label">
                                            Payer Name
                                        </Label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            placeholder="Enter your payer"
                                            value={payerType}
                                            disabled
                                        />
                                    </div>
                                </Col>

                                <Col lg={6}>
                                    <div>
                                        <Label for="country-select" className="form-label">
                                            Material
                                        </Label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            disabled
                                            value={singleProduct.material_name}
                                        />
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div>
                                        <Label className="form-label">
                                            Product Quantity
                                        </Label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            disabled
                                            value={productQty}
                                        />
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div>
                                        <Label className="form-label">
                                            Unit Of Measurement
                                        </Label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            disabled
                                            value={singleProduct.material_uom}
                                        />
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div>
                                        <Label for="dateofBirth" className="form-label">
                                            Material required date<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Flatpickr
                                            className="form-control"
                                            id="materialRequiredDate"
                                            options={{
                                                enableTime: false,
                                                dateFormat: "d-m-y",
                                            }}
                                            placeholder="Enter your material required date"

                                            onChange={(selectedDates, dateStr, fp) => {
                                                
                                                if (selectedDates.length) {
                                                    const ISODate = selectedDates[0].toISOString();
                                                    console.log("Hello", ISODate);
                                                    setMaterialReqDate(dateStr);
                                                    setdateError(false);
                                                }
                                                else {
                                                    setMaterialReqDate("");
                                                }
                                            }}
                                        />
                                        {dateBlank && <p style={{ color: "red" }}>Please select material required date.</p>}
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="d-flex align-items-start gap-3 mt-0">
                                        <button
                                            onClick={() => {
                                                toggleTab(activeTab + 1);
                                            }}
                                            type="button"
                                            className="btn btn-success btn-label right ms-auto nexttab"
                                        >
                                            <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>{" "}
                                            Next Step
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tabId={2}>
                            <Row className="g-3 mt-2">
                                <Col lg={6}>
                                    <div>
                                        <Label className="form-label"> Sold To Party<span style={{ color: "red" }}>*</span> &nbsp; {SoldToError && <span style={{ color: "red", marginTop: "5px" }}>Please select mandatory fields.</span>} </Label>
                                        {test}
                                    </div>
                                </Col>
                                <Row style={{ maxHeight: "337px", overflowY: "auto" }}>
                                    {getFalse && <p className="mt-2 mb-0"><b>Please Choose Ship To Party Address<span style={{ color: "red" }}>*</span></b></p>}
                                    {renObjData}
                                </Row>
                                {/* <Col lg={4} sm={6}>
                                    <div className="form-check card-radio">
                                        <Input
                                            id="shippingAddress01"
                                            name="shippingAddress"
                                            type="radio"
                                            className="form-check-input"
                                            //defaultChecked
                                            value="customer"
                                            onClick={handleAddress}

                                        />
                                        <Label
                                            className="form-check-label shadow"
                                            htmlFor="shippingAddress01"
                                        >
                                            <span className="mb-1 fw-bold d-block text-muted text-uppercase">
                                            {customerTypeShipTo.firstname + " " + customerTypeShipTo.lastname}
                                            </span>
                                            <span className="fs-15 mb-1 d-block">
                                                Plant Name : {customerTypeShipTo.plant_name}
                                            </span>
                                            <span className="text-muted fw-normal d-block">
                                                City : {customerTypeShipTo.city}
                                            </span>
                                            <span className="text-muted fw-normal d-block">
                                                Mobile Number : {customerTypeShipTo.contact}
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
                                </Col> */}

                                <Col lg={12}>
                                    <div className="hstack align-items-start gap-3 mt-4">
                                        <button
                                            onClick={() => {
                                                toggleTab(activeTab - 1);
                                            }}
                                            type="button"
                                            className="btn btn-light btn-label previestab"
                                            data-previous="pills-bill-info-tab"
                                        >
                                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                                            Back to Basic Info
                                        </button>
                                        <button
                                            onClick={() => {
                                                toggleTab(activeTab + 1);
                                            }}
                                            type="button"
                                            className="btn btn-success btn-label right ms-auto nexttab"
                                            data-nexttab="pills-payment-tab"
                                        >
                                            <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                                            Next Step
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tabId={3}>
                            <Row className="g-3 mt-2">
                                <Col lg={6}>
                                    <div>
                                        <Label
                                            className="form-label"
                                        >
                                            Shipment Type <span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            name="shipment_type"
                                            className="form-control"
                                            placeholder="Enter Shipment Type"
                                            value={shipType}
                                            type="text"
                                            disabled
                                        />
                                    </div>
                                </Col>
                                {shipType === "XMI" &&
                                    <>
                                        <Col lg={6} className="radio_css">
                                            <p style={{ marginTop: "-28px", fontWeight: "500", marginLeft: "-8px" }}>Please Choose One <span style={{ color: "red" }}>*</span></p>
                                            <Label
                                                className="form-label"
                                            >
                                                <Input
                                                    name="trans_radio"
                                                    type="radio"
                                                    value="trans"
                                                    onClick={handleSelectRadio}
                                                /> Transporter
                                                &nbsp;&nbsp;
                                                <Input
                                                    name="trans_radio"
                                                    type="radio"
                                                    value="other"
                                                    onClick={handleSelectRadio}
                                                /> Other
                                            </Label>
                                            {radioError && <p style={{ color: "red" }}>Please select mandatory fields</p>}
                                        </Col>

                                        <Col lg={6} style={{ display: displaySet }}>
                                            <div>
                                                <Label
                                                    className="form-label"
                                                >
                                                    Vehicle No<span style={{ color: "red" }}>*</span>
                                                </Label>
                                                <Input
                                                    name="vehicle_no"
                                                    className="form-control"
                                                    placeholder="Enter Vehicle Number"
                                                    type="text"
                                                    onChange={(event) => { setVehicleNumber(event.target.value); setError1(false) }}

                                                />
                                            </div>
                                            {error1 && <p style={{ color: "red" }}>Please select mandatory fields</p>}
                                        </Col>
                                        <Col lg={6} style={{ display: displaySet2 }}>
                                            <div>
                                                <Label
                                                    className="form-label"
                                                >
                                                    Transporter ID<span style={{ color: "red" }}>*</span>
                                                </Label>
                                                <Input
                                                    name="transporter_id"
                                                    type="select"
                                                    className="form-select"
                                                    id="transporter_id"
                                                    onChange={handleSelectTransporter}
                                                    placeholder="Select Transporter Code"
                                                >
                                                    <React.Fragment>
                                                        <option value="">Select Transporter Code</option>
                                                        {transporters.map((item, key) => (<option data-code={item.transporter_code} value={item.firstname + " " + item.lastname} key={key}>{item.transporter_code} - {item.firstname + " " + item.lastname}</option>))}
                                                    </React.Fragment>
                                                </Input>
                                            </div>
                                            {transporterError && <p style={{ color: "red" }}>Please select mandatory fields</p>}
                                        </Col>
                                        <Col lg={6} style={{ display: displaySet2 }}>
                                            <div>
                                                <Label
                                                    className="form-label"
                                                >
                                                    Transporter Name<span style={{ color: "red" }}>*</span>
                                                </Label>
                                                <Input
                                                    name="transporter_name"
                                                    className="form-control"
                                                    placeholder="Enter Transporter Name"
                                                    type="text"
                                                    onKeyUp={refreshTransporter}
                                                    id="transporter_name"
                                                />
                                            </div>
                                        </Col>
                                        <Col lg={6} style={{ display: displaySet }}>
                                            <div>
                                                <Label
                                                    className="form-label"
                                                >
                                                    LR Number<span style={{ color: "red" }}>*</span>
                                                </Label>
                                                <Input
                                                    name="lr_number"
                                                    className="form-control"
                                                    placeholder="Enter LR Number"
                                                    type="text"
                                                    onChange={(event) => { setLrNumber(event.target.value); setError2(false) }}

                                                />
                                            </div>
                                            {error2 && <p style={{ color: "red" }}>Please select mandatory fields</p>}
                                        </Col>
                                        <Col lg={6} style={{ display: displaySet }}>
                                            <div>
                                                <Label
                                                    className="form-label"
                                                >
                                                    LR Date<span style={{ color: "red" }}>*</span>
                                                </Label>
                                                <Flatpickr
                                                    name="lr_date"
                                                    className="form-control"
                                                    placeholder="Enter LR Date"
                                                    type="text"
                                                    options={{
                                                        enableTime: false,
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    onChange={(selectedDates, dateStr, fp) => {
                                                        if (!selectedDates.length) return;
                                                        const ISODate = selectedDates[0].toISOString();
                                                        console.log("Hello", ISODate);
                                                        setLRDtae(ISODate);
                                                        setError3(false)
                                                    }}

                                                />
                                            </div>
                                            {error3 && <p style={{ color: "red" }}>Please select mandatory fields</p>}
                                        </Col>
                                        <Col lg={6} style={{ display: displaySet }}>
                                            <div>
                                                <Label
                                                    className="form-label"
                                                >
                                                    TT Calibrated Capacity<span style={{ color: "red" }}>*</span>
                                                </Label>
                                                <Input
                                                    name="tt_calibrated_capacity"
                                                    className="form-control"
                                                    placeholder="Enter TT Calibrated Capacity"
                                                    type="text"
                                                    onChange={(event) => { setCapacity(event.target.value); setError4(false) }}

                                                />
                                            </div>
                                            {error4 && <p style={{ color: "red" }}>Please select mandatory fields</p>}
                                        </Col>
                                    </>
                                }
                            </Row>

                            <div className=" mt-4">
                                <button
                                    onClick={() => {
                                        toggleTab(activeTab - 1);
                                    }}
                                    type="button"
                                    className="btn btn-light btn-label previestab"
                                    data-previous="pills-bill-address-tab"
                                >
                                    <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                                    Back to Shipping Details
                                </button>

                                <button
                                    onClick={() => {
                                        PlaceIndent();
                                    }}
                                    type="button"
                                    className="btn btn-success btn-label right nexttab"
                                    data-nexttab="pills-finish-tab"
                                    style={{ float: "right", marginLeft: "10px" }}
                                >
                                    <i className="ri-save-line label-icon align-middle fs-16 ms-2"></i>
                                    Submit
                                </button>
                                <Link to="/transporter-master" className="btn btn-success btn-label right ms-auto nexttab" style={{ display: displaySet2, float: "right", width: "max-content" }}><i className="ri-add-line label-icon align-middle fs-16 ms-2"></i>Add Transporter</Link>
                            </div>
                        </TabPane>
                    </TabContent>
                </div>
            </form>
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

            {/* Static Backdrop Modal */}
            <Modal
                isOpen={finalFlag}
                toggle={() => {
                    setFinal();
                }}
                backdrop={'static'}
                id="staticBackdrop"
                centered
            >
                <ModalHeader className="modal-title fw-bold" id="staticBackdropLabel" >

                </ModalHeader>
                <ModalBody className="text-center p-5">
                    <lord-icon
                        src="https://cdn.lordicon.com/lupuorrc.json"
                        trigger="loop"
                        colors="primary:#121331,secondary:#08a88a"
                        style={{ width: "120px", height: "120px" }}>
                    </lord-icon>

                    <div className="mt-4">
                        <h3 className="mb-3 text-success">Indent number generated.</h3>
                        <h5 className="mb-3 text-success">Waiting for final approval!</h5>
                        <p className="text-muted mb-4"> Notification has been sent on registered Email ID.</p>
                        <h3 className="fw-semibold">Indent Number: <a href="#" className="text-decoration-underline">{indentNumber}</a></h3>
                        <div className="hstack gap-2 justify-content-center">
                            {/* <Link to="#" className="btn btn-link link-secondary fw-medium" onClick={() => setmodal_backdrop(false)}><i className="ri-close-line me-1 align-middle"></i> Close</Link> */}
                            <Link to="/apps-nft-explore" className="btn btn-success mt-3" onClick={() => setFinal(false)}>Close</Link>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </React.Fragment >
    );
};

export default PlaceIndentForm;
