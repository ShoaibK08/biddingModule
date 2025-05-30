import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import TableContainer from "../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import '../Sequencing/Sequencing.css';
import logoDark from "../../assets/images/no_data.png";
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";
import { Pagination, Navigation, Scrollbar, EffectFade, EffectCreative, Mousewheel, EffectFlip, EffectCoverflow, Autoplay } from "swiper";
import { Divider } from "antd";
import { getVehicle } from "../../store/actions";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const initialValues = {
    packerLoaderCode: "",
    materialTypeCode: "",
    packerLoaderParentCode: "",
    packerLoaderChildCode: "",
    status: "",
};

const filterInnitailValues = {
    priority: "",
    district: "",
    channel: "",
    aging: "",
    vehicleType: "",
    plantCode: ""
};



const SequencingPage = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [AllSequencedVehicle, setAllSequencedVehicle] = useState([]);
    const [flag, setFlag] = useState(false);
    const [VehicleData, setVehicleData] = useState([]);
    const [PackerData, setPackerData] = useState([]);
    const [LoaderData, setLoaderData] = useState([]);
    const [CurrentID, setClickedRowId] = useState('');
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [filterValues, setFilterValues] = useState(filterInnitailValues);
    const [changemsg, setChangemsg] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedOption1, setSelectedOption1] = useState("");
    const [currentPackerCode, setPackerCode] = useState("");
    const [currentLoaderCode, setLoaderCode] = useState("");
    const [currentMaterialCode, setMaterialCode] = useState("");
    const [currentMaterialName, setMaterialName] = useState("");
    const [currentTripId, setTripId] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [QueueSize, setQueueSize] = useState("");
    const [CurrentQueueCount, setcurrentQueueCount] = useState("");
    const [dropCount, setDropCount] = useState("0");
    const [HeaderName, setHeaderName] = useState("");
    const [plantCode, setPlantCode] = useState([]);
    const [latestHeader, setLatestHeader] = useState('');
    const [comapny_code, setCompanyCode] = useState('');
    const [errorParameter, setErrorParameter] = useState(false);
    const [errorParameter1, setErrorParameter1] = useState(false);
    const [channelList, setChannelList] = useState([]);
    const [vehicleTypeList, setVehicleTypeList] = useState([]);
    const [filterError, setFilterError] = useState(false);
    //For District Autocomplete-------

    // const [district, setDistrict] = useState('');
    // const [districtError, setDistrictError] = useState(false);
    // const [districtOptions, setDistrictOptions] = useState([]);
    // const [districtListFetching, setDistrictListFetching] = useState(false);

    //For normal district input--------

    const [district, setDistrict] = useState([]);


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
        let plantCode = obj.data.plantCode;
        setPlantCode(plantCode);
        sessionStorage.getItem("main_menu_login");
        const obj1 = JSON.parse(sessionStorage.getItem("main_menu_login"));
        let companyCode = obj1.companyCode;
        setCompanyCode(companyCode);
        getPackerData(plantCode);
        //getAllSequencedVehicle();
        //getHeaderName();
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

    // const getHeaderName = () => {
    //     const main_menu = sessionStorage.getItem("main_menu_login");
    //     const obj = JSON.parse(main_menu).menuItems[34].subMenuMaster.name;
    //     setHeaderName(obj);
    // }


    // const handleAutocompleteChange = (_, value) => {
    //     debugger;
    //     setDistrict(value);
    //     setDistrictError(false);
    //     setFilterError(false);
    //     setFilterValues({
    //         ...filterValues,
    //         ["district"]: value.districtName,
    //     });
    // };

    // const handleDistrictChange = async (event, value) => {
    //     debugger;
    //     const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
    //     if (sanitizedValue && sanitizedValue.length >= 3) {
    //         setDistrictListFetching(true);
    //         try {
    //             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/location/${sanitizedValue}`, config);
    //             if (response.msg === "Eplms master data not found") {
    //                 setDistrictOptions([]);
    //                 setDistrictError(true);
    //             }
    //             else {
    //                 setDistrictOptions(response);
    //                 setDistrictError(false);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching district options", error);
    //         }
    //         setDistrictListFetching(false);
    //     } else {
    //         // Clear options if input is cleared
    //         setDistrictOptions([]);
    //         setDistrictListFetching(false);
    //     }
    // };

    const getDistrictList = async (movement,material,plantCode) => {
        debugger;
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllDistrictFromProduct?sequencingType=${movement}&product=${material}&plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setDistrict(data);
            });
    }

    const getChannelList = async (movement,material,plantCode) => {
        debugger;
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllchannelFromProduct?sequencingType=${movement}&product=${material}&plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setChannelList(data);
            });
    }

    const getVehicleTypeList = async (movement,material,plantCode) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllVehicleTypeFromProduct?sequencingType=${movement}&product=${material}&plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setVehicleTypeList(data);
            });
    }

    const refreshUnsequencedVehicleList = async () => {
        getAllSequencedVehicle(currentMaterialCode);
        setFilterValues({
            ...filterValues,
            ["district"]: "",
            ["plantCode"]: "",
            ["priority"]: "",
            ["district"]: "",
            ["channel"]: "",
            ["aging"]: "",
            ["vehicleType"]: "",
        });
        //setDistrict();
    }

    const getPackerData = async (plantCode) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerProduct/getAllPackerProductOnSequencing?type=P&plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setPackerData(data);
            });
    }
    const selectedPacker = (e, data) => {


        const id = data.id;
        const packerCode = data.packerLoaderCode;
        const status = data.status;
        setVehicleData([]);
        setSelectedOption1("")
        // Find all elements with class name "table_class"
        var tableElements = document.querySelectorAll('.bbb');

        // Iterate through each table element
        tableElements.forEach(function (tableElement) {
            // Find all nested <tr> elements
            var trElements = tableElement.querySelectorAll('tr');
            // Iterate through each <tr> element and remove the class name
            trElements.forEach(function (trElement) {
                trElement.classList.remove('new-class-name');

            });

            for (var i = 0; i < trElements.length; i++) {
                var row = trElements[i];
                // Find radio inputs inside the current row
                var radioInputs = row.querySelectorAll('input[type="radio"]');

                // Loop through each radio input
                for (var j = 0; j < radioInputs.length; j++) {
                    var radio = radioInputs[j];
                    // Check if radio is checked
                    if (radio.checked) {
                        // Uncheck the radio button
                        radio.checked = false;
                        return;
                    }
                }
            }
        });

        if (status === 0) {
            toast.error("Status is Deactive. Please select Active Packer", { autoClose: 3000 });
        } else {
            axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/getLoaderDataByPackerCode?packerCode=${packerCode}&plantCode=${plantCode}`, config)
                .then(res => {
                    const data = res;
                    if (data[0] == null) {
                        setLoaderData([]);
                        setChangemsg(true);
                    } else {
                        setLoaderData(data);
                    }
                })
            setSelectedOption(id);
            setPackerCode(packerCode);
            setMaterialCode(data.materialTypeCode);
            setMaterialName(data.materialName);
            //setFilteredUsers(AllSequencedVehicle);
            getAllSequencedVehicle(data.materialTypeCode);
            getChannelList("OB", data.materialTypeCode, plantCode);
            getDistrictList("OB", data.materialTypeCode, plantCode); 
            getVehicleTypeList("OB", data.materialTypeCode, plantCode);
            setFlag(false);

            // Dheeraj || Code for row background change 
            const element = e.target.parentElement.parentElement.parentElement;
            const clsName = "new-class-name";
            removeClassFromSiblings(element, clsName);
            const check = e.target.value;
            if (check === "on") {
                const final = e.target.parentElement.parentElement;
                final.classList.add("new-class-name");
            }
        }
    }

    function removeClassFromSiblings(parentElement, className) {
        const siblings = Array.from(parentElement.children);

        siblings.forEach((sibling) => {
            sibling.classList.remove(className);
        });
    }

    const selectedLoader = (e, data) => {
        const id = data.id;
        const LoaderCode = data.code;
        setQueueSize(data.queueSize);
        setcurrentQueueCount(data.currentQueueCount);
        setDropCount("0");
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/getAllVehicleQueue?loaderCode=${LoaderCode}&plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setVehicleData(data);
                setFlag(true);
            })
        setSelectedOption1(id)
        setLoaderCode(LoaderCode);
        const element = e.target.parentElement.parentElement.parentElement;
        const clsName = "new-class-name";
        removeClassFromSiblings(element, clsName);
        const check = e.target.value;
        if (check === "on") {
            const final = e.target.parentElement.parentElement;
            final.classList.add("new-class-name");
        }
    }

    const getAllSequencedVehicle = async (product) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllConsignmentVehicles?sequencingType=OB&product=${product}&plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setAllSequencedVehicle(data);
                setFilteredUsers(data);
            });
    }

    const handleInputChange = (e) => {
        setFilterError(false);
        const { name, value } = e.target;
        setFilterValues({
            ...filterValues,
            [name]: value,
        });
    };

    const handleFilter = async (event) => {
        debugger;
        console.log(filterValues);
        const allFieldsEmpty = Object.entries(filterValues).every(([, value]) => value === null || value === "");

        if (allFieldsEmpty) {
            setFilterError(true); // Show error message
            return; // Stop function execution
        }
        else {
            setFilterError(false);
            // const value = event.target.value;
            // let arr = AllSequencedVehicle.filter((item) => {
            //     return (
            //         item.vehicleNumber
            //             .toLocaleLowerCase()
            //             .indexOf(value.toLocaleLowerCase()) > -1
            //     );
            // });
            // setFilteredUsers(arr);

            const updatedObj = {
                ...filterValues,
                plantCode: plantCode,
                flag: "OB",
                priority: filterValues.priority ? filterValues.priority : "0",
                material: currentMaterialCode
            };
            setErrorParameter1(true);
            try {
                const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllSequencingFilter`, updatedObj, config)
                if (res.errorMsg === "Data not found!") {
                    toast.error(res.errorMsg, { autoClose: 3000 });
                    setErrorParameter1(false);
                    setFilteredUsers([]);
                }
                else {
                    toast.success("Data Fetched successfully.", { autoClose: 3000 });
                    setFilteredUsers(res);
                    setErrorParameter1(false);
                }
            }
            catch (e) {
                toast.error("Something went wrong!", { autoClose: 3000 });
                setErrorParameter1(false);
            }
            toggle();
        }

    };

    const submitVehicle = async (e) => {

        e.preventDefault();
        var arr = [];
        var finalarr = [];
        filteredUsers.forEach((t) => {
            if (t.status === "new") {
                arr.push({ "vehicleNo": t.vehicleNumber, "tripId": t.tripId, "code": currentLoaderCode, "packerCode": currentPackerCode, "material": currentMaterialCode, "plantCode": plantCode, "companyCode": comapny_code })
            }
            else {
                finalarr.push({ "vehicleNumber": t.vehicleNumber, "tripId": t.tripId, "status": t.status, "plantCode": plantCode, "companyCode": comapny_code })
            }
        })
        console.log(arr);
        console.log(finalarr);
        if (arr.length < 1) {
            toast.error("Please select vehicle.", { autoClose: 3000 });
        } else {
            console.log(arr);
            // const data = {
            //     "vehicleNo": arr[0].vehicleNo,
            //     "tripId": arr[0].tripId,
            //     "code": currentLoaderCode,
            //     "packerCode": currentPackerCode,
            //     "material": currentMaterialCode
            // }

            try {
                setErrorParameter(true);
                const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/manualSequencing`, arr, config)
                console.log(res);
                if (res.errorMsg === "Queue Limit Exceed!") {
                    toast.error(res.errorMsg, { autoClose: 3000 });
                    setErrorParameter(false);
                }
                else if (res.errorMsg === "Vehicle_Already_SEQUENCED") {
                    toast.error(res.errorMsg, { autoClose: 3000 });
                    setErrorParameter(false);
                }
                else if (res.errorMsg === "Vehicle_Already_In_Queue") {
                    toast.error(res.errorMsg, { autoClose: 3000 });
                    setErrorParameter(false);
                }
                else {
                    toast.success("Vehicle added successfully.", { autoClose: 3000 });
                    getPackerDataAfterSubmit();
                    getLoaderDataAfterSubmit();
                    getAllSequencedVehicle(currentMaterialCode);
                    setFilteredUsers(finalarr);
                    setcurrentQueueCount(CurrentQueueCount + dropCount);
                    setDropCount("0");
                    setErrorParameter(false);
                }
            }
            catch (e) {
                toast.error("Something went wrong!", { autoClose: 3000 });
                setErrorParameter(false);
            }
        }
    };

    const getPackerDataAfterSubmit = async (e) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/getLoaderDataByPackerCode?packerCode=${currentPackerCode}&plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setLoaderData(data);
            });
    }

    const getLoaderDataAfterSubmit = async (e) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/getAllVehicleQueue?loaderCode=${currentLoaderCode}&plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setVehicleData(data);
            });
    }

    // Add Data
    const handleCustomerClicks = () => {
        setIsEdit(false);
        toggle();
    };
    // Update Data
    const handleCustomerClick = useCallback((arg) => {

        setClickedRowId(arg);
        setIsEdit(true);
        toggle();
        const id = arg;
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerProduct/getById/${id}?plantCode=${plantCode}`, config)
            .then(res => {
                const result = res;
                setValues({
                    ...values,
                    "packerLoaderCode": result.packerLoaderCode,
                    "materialTypeCode": result.materialTypeCode,
                    "packerLoaderParentCode": result.packerLoaderCode,
                    "packerLoaderChildCode": result.packerLoaderChildCode,
                    "status": result.status,
                });
            })
    }, [toggle]);

    // Delete Data
    const onClickDelete = (id) => {
        setClickedRowId(id);
        setDeleteModal(true);
    };

    const handleDeleteCustomer = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/packerProduct/deletePackerProduct/${CurrentID}`, config)
            console.log(res.data);
            //getAllData();
            toast.success("Data Deleted Successfully", { autoClose: 3000 });
            setDeleteModal(false);
        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
            setDeleteModal(false);
        }
    };
    const columns = useMemo(
        () => [
            {
                Header: 'Select',
                Cell: (cellProps) => {
                    return <input type="radio" className="customerCheckBox form-check-input" name="Radio_check" onChange={(event) => selectedPacker(event, cellProps.row.original)} checked={selectedOption === cellProps.row.original.id} />;
                },
                id: '#',
            },
            {
                Header: '',
                accessor: 'id',
                hiddenColumns: true,
                Cell: (cell) => {
                    return <input type="hidden" value={cell.value} />;
                }
            },
            {
                Header: "Packer",
                accessor: "packerLoaderCode",
                filterable: false,
            },
            // {
            //     Header: "Plant Code",
            //     accessor: "",
            //     filterable: false,
            //     Cell: () => { return <span className="text-center">{plantCode}</span>; }
            // },
            // {
            //     Header: "Packer Type",
            //     accessor: "",
            //     filterable: false,
            //     Cell: () => { return <span className="text-center">Manual</span>; }
            // },
            // {
            //     Header: "Running Material",
            //     accessor: "materialTypeCode",
            //     filterable: false,
            // },
            {
                Header: "Material Name",
                accessor: "materialName",
                filterable: false,
                Cell: (cellProps) => {
                    return <div style={{overflow:"hidden",width:"90%", height:"20px"}} title={`${cellProps.row.original.materialtypes}-${cellProps.row.original.materialName}`}>{`${cellProps.row.original.materialtypes}-${cellProps.row.original.materialName}`}</div>;
                  }
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: (cell) => {
                    switch (cell.value) {
                        case 1:
                            return <div className="text-center"><div class="circle"></div></div>;
                        case 0:
                            return <div className="text-center"><div class="circle1"></div></div>;
                    }
                }
            },
        ],
    );

    const loader_columns = useMemo(
        () => [
            {
                Header: 'Select',
                Cell: (cellProps) => {
                    return <input type="radio" className="form-check-input" name="Radio_check1" onChange={(event) => selectedLoader(event, cellProps.row.original)} checked={selectedOption1 === cellProps.row.original.id} />;
                },
                id: '#',
            },
            {
                Header: '',
                accessor: 'id',
                hiddenColumns: true,
                Cell: (cell) => {
                    return <input type="hidden" value={cell.value} />;
                }
            },
            {
                Header: "Loader",
                accessor: "code",
                filterable: false,
            },
            {
                Header: "Queue Size",
                accessor: "queueSize",
                filterable: false,
            },

            {
                Header: "Current Count",
                accessor: "currentQueueCount",
                filterable: false,
            },
        ],
    );

    //Drag and Drop Functionality

    const onDragStart = (event, id, tripId) => {
        event.dataTransfer.setData("vehicleNum", id);
    };

    //fetches the card id and based on that update the status/category of that card in tasks state

    const onDrop = (event, old) => {

        var countArr = [];
        var test = document.getElementById('new_card').querySelectorAll('h5');
        if (old === "old") {
            let id = event.dataTransfer.getData("vehicleNum"); //Jisko Le kar aaye hai...
            let newTasks = filteredUsers.filter((task) => {
                if (task.vehicleNumber == id) {
                    task.status = old;
                }
                return task;
            });
            setFilteredUsers([...newTasks]);
            newTasks.forEach((t) => {
                if (t.status === "new") {
                    countArr.push({ "vehicleNo": t.vehicleNumber })
                }
            })
            setDropCount(countArr.length);
        }
        else {

            if (test.length + CurrentQueueCount > QueueSize || test.length + CurrentQueueCount === QueueSize) {
                toast.error("Queue Limit Exceeding.", { autoClose: 3000 });
            } else {
                let id = event.dataTransfer.getData("vehicleNum"); //Jisko Le kar aaye hai...
                let newTasks = filteredUsers.filter((task) => {
                    if (task.vehicleNumber == id) {
                        task.status = old;            // Changing old status to new
                    }
                    return task;
                });
                setFilteredUsers([...newTasks]);
                newTasks.forEach((t) => {
                    if (t.status === "new") {
                        countArr.push({ "vehicleNo": t.vehicleNumber })
                    }
                })
                setDropCount(countArr.length);
            }
        }
    };
    const getTask = () => {
        const tasksToRender = {
            old: [],
            new: []
        };

        //this div is the task card which is 'draggable' and calls onDragStart method
        //when we drag it
        filteredUsers.map((t) => {
            tasksToRender[t.status].push(
                <div
                    className="border d-flex m-1 rounded new_card_value"
                    key={t.status}
                    draggable
                    onDragStart={(e) => onDragStart(e, t.vehicleNumber, t.tripId)}
                >
                    <Col xl={2} lg={2} sm={2} className="border-end-dashed border-end text-center pt-1">
                        <lord-icon
                            src="https://cdn.lordicon.com/uetqnvvg.json"
                            trigger="loop"
                            colors="primary:#405189,secondary:#0ab39c"
                            style={{ width: "25px", height: "25px" }}
                        ></lord-icon>
                    </Col>
                    <Col xl={10} lg={10} className="bg-light cursor-pointer custom_hover w_100">
                        <h5 className="fs-16 mt-2 ps-3">{t.vehicleNumber}</h5>
                    </Col>
                </div>
            );
        });

        return tasksToRender;
    };

    const priority_list = [
        {
            options: [
                { label: "Select Priority", value: "" },
                { label: "Yes", value: "1" },
                { label: "No", value: "0" },
            ],
        },
    ];

    const aging_list = [
        {
            options: [
                { label: "Select Aging", value: "" },
                { label: "Less than Four hours", value: "0-4" },
                { label: "Four to Eight hours", value: "4-8" },
                { label: "Eight to Twelve hours", value: "8-12" },
                { label: "More than Twelve hours", value: "12" },
            ],
        },
    ];


    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    document.title = "Sequencing OB || EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={""}
                />
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteCustomer}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <Container fluid>
                    <BreadCrumb title={latestHeader} pageTitle="EPLMS" />
                    <Row className="g-3">
                        <Col xl={6}>
                            <Card className="shadow_light">
                                <CardHeader className="bg-light">
                                    <div className="d-flex">
                                        <h5 className="flex-grow-1 mb-0 fs-16">
                                            <i className="ri-file-copy-line me-1 mt-3" style={{ top: "2px", position: "relative" }}></i>
                                            Terminal Details
                                        </h5>
                                    </div>
                                </CardHeader>
                                <CardBody style={{ padding: "0px 10px", textAlign: "center", minHeight: "230px" }}>

                                    <TableContainer
                                        columns={columns}
                                        data={PackerData}
                                        isAddUserList={false}
                                        customPageSize={15}
                                        className="custom-header-css"
                                        handleCustomerClick={handleCustomerClicks}
                                        tableClass={"text-center border-end-dashed border-end border-start-dashed border-start aaa plant360"}
                                        divClass="test"
                                    />

                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={6}>
                            <Card className="shadow_light">
                                <CardHeader className="bg-light">
                                    <div className="d-flex">
                                        <h5 className="flex-grow-1 mb-0 fs-16">
                                            <i className="ri-luggage-cart-line me-1 mt-3" style={{ top: "2px", position: "relative" }}></i>
                                            Loader Details
                                        </h5>
                                    </div>
                                </CardHeader>
                                <CardBody style={{ padding: "0px 10px", textAlign: "center", minHeight: "230px"  }}>
                                    {LoaderData && LoaderData.length ? (
                                        <TableContainer
                                            columns={loader_columns}
                                            data={LoaderData}
                                            isAddUserList={false}
                                            customPageSize={15}
                                            className="custom-header-css"
                                            handleCustomerClick={handleCustomerClicks}
                                            tableClass={"text-center border-end-dashed border-end border-start-dashed border-start bbb plant360"}
                                            divClass="test"
                                        />) : (<><img src={logoDark} alt="" height="225" />{changemsg ? <p style={{ position: "inherit", marginTop: "-37px", color: "red", fontWeight: "800" }}>Status of this Loader is Deactive. Please select another Packer.</p> : <p style={{ position: "inherit", marginTop: "-37px", color: "#0291ff", fontWeight: "800" }}>Please select packer form Packer Details</p>}</>)
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    {flag &&
                        <>
                            <Col lg={12}>
                                <Card className="shadow_light">
                                    <CardHeader className="bg-light">
                                        <h5 className=" mb-0 fs-16 "><i className="ri-truck-line me-1 mt-3" style={{ top: "2px", position: "relative" }}></i>Active Loader List - <span style={{ color: "green" }}>{currentLoaderCode}</span></h5>
                                    </CardHeader>
                                    <CardBody>
                                        <Swiper
                                            slidesPerView={1}
                                            spaceBetween={3}
                                            navigation={{
                                                nextEl: ".swiper-button-next",
                                                prevEl: ".swiper-button-prev"
                                            }}
                                            pagination={{
                                                el: '.swiper-pagination',
                                                clickable: true,
                                            }}
                                            breakpoints={{
                                                400: {
                                                    slidesPerView: 1,
                                                    spaceBetween: 40,
                                                },
                                                600: {
                                                    slidesPerView: 2,
                                                    spaceBetween: 40,
                                                },
                                                768: {
                                                    slidesPerView: 3,
                                                    spaceBetween: 40,
                                                },
                                                1024: {
                                                    slidesPerView: 3,
                                                    spaceBetween: 20,
                                                },
                                            }}

                                            loop={false}
                                            modules={[Pagination]}
                                            className="mySwiper swiper responsive-swiper rounded gallery-light pb-4"
                                        >
                                            <div className="swiper-wrapper">
                                                {VehicleData && VehicleData.length ? (VehicleData.map((item, key) => (
                                                    <SwiperSlide key={key}>
                                                        <div className="gallery-box card">
                                                            <div className="box-content">
                                                                <div className="d-flex align-items-center border-bottom-dashed border-bottom shadow_light rounded" style={{ background: "aliceblue" }}>
                                                                    <Col xl={1} className="border-end-dashed border-end text-center pt-1" style={{ width: "50px" }}>
                                                                        <lord-icon src="https://cdn.lordicon.com/uetqnvvg.json" trigger="loop" colors="primary:#405189,secondary:#0ab39c" style={{ width: "25px", height: "25px" }} ></lord-icon>
                                                                    </Col>
                                                                    <Col xl={2} style={{ width: "150px" }}><h5 className="fs-16 mt-2 ps-3" >{item.vehicleNo}</h5></Col>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                ))) : (<div className="gallery-box card">
                                                    <div className="box-content">
                                                        <div className="d-flex align-items-center border-bottom-dashed border-bottom shadow_light rounded  mt-2">
                                                            <Col xl={1} className="border-end-dashed border-end text-center pt-1" style={{ width: "50px" }}>
                                                                <lord-icon src="https://cdn.lordicon.com/uetqnvvg.json" trigger="loop" colors="primary:#405189,secondary:#0ab39c" style={{ width: "25px", height: "25px" }} ></lord-icon>
                                                            </Col>
                                                            <Col className="p-1"><h5 className="fs-16 mt-2 ps-3 pe-3" >{"No Vehicle found. Please select vehicle from Unsequenced Vehicle list."}</h5></Col>

                                                        </div>
                                                    </div>
                                                </div>)}
                                            </div>
                                            <div className="swiper-pagination swiper-pagination-dark"></div>
                                            <div class="swiper-button-prev"></div>
                                            <div class="swiper-button-next"></div>
                                        </Swiper>
                                    </CardBody>
                                </Card>
                            </Col>


                            <Row>
                                <Col xl={5}>
                                    <Card className="shadow_light">
                                        <CardHeader className="bg-light">
                                            <div className="d-flex">
                                                <h5 className="flex-grow-1 mb-0 fs-16" >
                                                    <i className="ri-truck-line me-1 mt-3" style={{ top: "2px", position: "relative" }}></i>
                                                    Unsequenced Vehicle
                                                </h5>
                                                {/* <input type="text" placeholder="Search Vehicle" className="border rounded search_css" onChange={handleFilter}></input> */}
                                                <span className="filter_seq" title="Filter Data" style={{ border: "solid 1px #ccc", position: 'absolute', right: '45px', padding: "0 3px 0 3px", borderRadius: "3px", cursor: "pointer" }} onClick={() => toggle()}><i className="ri-filter-3-line fs-20"></i></span>
                                                <span className="filter_seq" title="Reset Data" style={{ border: "solid 1px #ccc", position: 'absolute', right: '10px', padding: "0 3px 0 3px", borderRadius: "3px", cursor: "pointer" }} onClick={() => refreshUnsequencedVehicleList()}><i className="ri-refresh-line fs-20"></i></span>

                                            </div>
                                            <div className="d-flex align-items-center">
                                                <i
                                                    className="ri-stack-line me-2"
                                                    style={{ top: "2px", position: "relative" }}
                                                ></i>
                                                <span
                                                    className="m-0 fw-bold"
                                                    title={currentMaterialName}
                                                    style={{ whiteSpace: "nowrap" }}
                                                >
                                                    Material: <label className="unseq_css">{currentMaterialName}</label>
                                                </span>
                                            </div>

                                        </CardHeader>
                                        <CardBody style={{ padding: "15px", height: "300px", maxHeight: "300px", overflowY: "auto" }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, "old")}>
                                            {getTask().old}
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xl={2} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                    <div style={{ display: "grid", textAlign: "center", marginBottom: "20px" }}>
                                        <i className="bx bx-transfer-alt text-success" style={{ fontSize: "5rem" }}></i>
                                        <button className="btn btn-success" onClick={submitVehicle} disabled={errorParameter}>{errorParameter ? <><Spinner size="sm" className='me-2 visible'></Spinner>Submitting...</> : "Submit"}</button>
                                    </div>
                                </Col>
                                <Col xl={5}>
                                    <Card className="shadow_light">
                                        <CardHeader className="bg-light">
                                            <div className="d-flex">
                                                <h5 className=" flex-grow-1 mb-0 fs-16">
                                                    <i className="ri-truck-line me-1 mt-3" style={{ top: "2px", position: "relative" }}></i>
                                                    Selected Vehicle list
                                                </h5>
                                            </div>
                                            <div className="float-start fw-bold">
                                                <span style={{ float: "right", marginRight: "5px", color: "green", marginLeft: "10px" }}>Count - <span style={{ color: "#0b2f6f" }}>{dropCount} </span></span>
                                                <span style={{ float: "right", marginRight: "5px", color: "green", marginLeft: "10px" }}>Current - <span style={{ color: "#0b2f6f" }}>{CurrentQueueCount} </span></span>
                                                <span style={{ float: "right", marginRight: "5px", color: "green" }}>Queue Size - <span style={{ color: "red" }}>{QueueSize} </span></span>
                                            </div>
                                        </CardHeader>
                                        <CardBody id="new_card" style={{ padding: "15px", height: "300px", maxHeight: "300px", overflowY: "auto" }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, "new")}>
                                            {getTask().new}
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    }
                </Container>
                <ToastContainer closeButton={false} limit={1} />
            </div>
            <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                <ModalHeader className="bg-light p-3" toggle={toggle}>
                    {'Search By'}
                </ModalHeader>
                <ModalBody className="pb-5">
                    <Row className="g-3">
                        {filterError && <p style={{ color: "red" }}>Please select at least one field</p>}
                        <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">District Name</Label>
                            <Input
                                name="district"
                                type="select"
                                className="form-select"
                                value={filterValues.district}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={""}>{"Select District Name"}</option>
                                {district.map((item, key) => (
                                    <React.Fragment key={key}>

                                        <option value={item.district}>{item.district}</option>
                                    </React.Fragment>
                                ))}
                            </Input>
                        </Col>
                        {/* <Col md={4}>
                            <Label for="district" className="form-label">District Name</Label>
                            <Autocomplete
                                id="district"
                                freeSolo
                                options={districtOptions}
                                getOptionLabel={(option) => option.districtName || option}
                                value={district || ''} // Ensure value is not undefined
                                onChange={handleAutocompleteChange}
                                onInputChange={handleDistrictChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Enter at least 3 letters..."
                                        variant="outlined"
                                        error={districtError}
                                        helperText={districtError ? "No Data Found!" : ""}
                                        InputProps={{
                                            ...params.InputProps,
                                            style: { height: '40px', marginTop: '0px' }, // Add height here
                                        }}
                                    />
                                )}
                            />
                            {districtListFetching && <p className="mt-1 mb-0" style={{ color: "green", animation: "blink 1s infinite" }}>{"Please wait. Data fetching..."}</p>}
                        </Col> */}
                        <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Channel</Label>
                            <Input
                                name="channel"
                                type="select"
                                className="form-select"
                                value={filterValues.channel}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={""}>{"Select channel"}</option>
                                {channelList.map((item, key) => (
                                    <React.Fragment key={key}>

                                        <option value={item.actual_distribution_channel}>{item.actual_distribution_channel}</option>
                                    </React.Fragment>
                                ))}
                            </Input>
                        </Col>
                        <Col md={4}>
                            <Label htmlFor="validationDefault03" className="form-label">Vehicle Type</Label>
                            <Input
                                name="vehicleType"
                                type="select"
                                className="form-select"
                                value={filterValues.vehicleType}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={""}>{"Select Vehicle Type"}</option>
                                {vehicleTypeList.map((item, key) => (
                                    <React.Fragment key={key}>

                                        <option value={item.vehicle_type}>{item.vehicle_type}</option>
                                    </React.Fragment>
                                ))}
                            </Input>
                        </Col>
                        <Col lg={4}>
                            <div>
                                <Label className="form-label" >Priority</Label>
                                <Input
                                    name="priority"
                                    type="select"
                                    className="form-select"
                                    value={filterValues.priority}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {priority_list.map((item, key) => (
                                        <React.Fragment key={key}>
                                            {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                        </React.Fragment>
                                    ))}
                                </Input>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div>
                                <Label className="form-label" >Yard Aging</Label>
                                <Input
                                    name="aging"
                                    type="select"
                                    className="form-select"
                                    value={filterValues.aging}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {aging_list.map((item, key) => (
                                        <React.Fragment key={key}>
                                            {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                        </React.Fragment>
                                    ))}
                                </Input>
                            </div>
                        </Col>
                        <Col md={4}>
                            <button className="btn btn-success" style={{ marginTop: "29px" }} onClick={() => handleFilter()} disabled={errorParameter1}>{errorParameter1 ? <><Spinner size="sm" className='me-2 visible'></Spinner>Loading...</> : "Submit"}</button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default SequencingPage;
