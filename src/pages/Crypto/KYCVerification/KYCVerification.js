import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Label,
  Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import vertication from "../../../assets/images/verification-img.png";
import classnames from "classnames";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import {
  addNewRaiseIndent1 as onRaiseIndent,
  getTransporters as onGetTransporters,
} from "../../../store/actions";
import PlaceIndentForm from "../../Ecommerce/PlaceIndentForm";
const KYCVerification = () => {
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
      axios.get("http://localhost:8043/sapModule/getProductByCustomer", { params: { "customerCode": "CU000023" } })
        .then(res => {
          setProductList(res);
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (!customerType.length && customerType) {
      axios.get(`${process.env.REACT_APP_LOCAL_URL}/userModule/users/userData`, { params: { "userCode": "CU000023" } })
        .then(res => {
          setCustomerType(res.message[0].soldtoparty);
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
          setPayerType(res.message[0].firstname + " " + res.message[0].lastname);
        })
        .catch(err => {
          console.log(err);
        });
    }

  });

  return (
    <React.Fragment>
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card>
            <CardBody>
              <div className="text-center">
                <Row className="justify-content-center">
                  <Col lg={9}>
                    <h4 className="mt-4 fw-semibold">Raise Indent</h4>
                    <p className="text-muted mt-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..{" "}
                    </p>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={toggleKycVerification}
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Click here to Raise
                        Indent
                      </button>
                    </div>
                  </Col>
                </Row>

                <Row className="justify-content-center mt-5 mb-2">
                  <Col sm={7} xs={8}>
                    <img src={vertication} alt="" className="img-fluid" />
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={isKycVerification}
        toggle={toggleKycVerification}
        centered={true}
        size="lg"
      >
        <ModalHeader
          style={{ color: "#000 !important" }}
          className="p-3 text-uppercase"
          toggle={toggleKycVerification}
        >
          Raise Indent
        </ModalHeader>
        <PlaceIndentForm></PlaceIndentForm>
      </Modal>
    </React.Fragment>
  );
};

export default KYCVerification;
