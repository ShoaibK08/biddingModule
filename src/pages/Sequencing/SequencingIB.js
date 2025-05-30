import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

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

const initialValues = {
    packerLoaderCode: "",
    materialTypeCode: "",
    packerLoaderParentCode: "",
    packerLoaderChildCode: "",
    status: "",
};



const SequencingIBPage = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [AllSequencedVehicle, setAllSequencedVehicle] = useState([]);
    const [flag, setFlag] = useState(false);
    const [VehicleData, setVehicleData] = useState([]);
    const [PackerData, setPackerData] = useState([]);
    const [CurrentID, setClickedRowId] = useState('');
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [changemsg, setChangemsg] = useState(false);
    const [dropCount, setDropCount] = useState("0");
    const [selectedOption, setSelectedOption] = useState("");
    const [QueueSize, setQueueSize] = useState("");
    const [CurrentQueueCount, setcurrentQueueCount] = useState("");
    const [currentPackerCode, setPackerCode] = useState("");
    const [currentLoaderCode, setLoaderCode] = useState("");
    const [currentMaterialCode, setMaterialCode] = useState("");
    const [currentVehicleNumber, setVehicleNumber] = useState("");
    const [currentTripId, setTripId] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [HeaderName, setHeaderName] = useState("");
    const [plantCode, setPlantCode] = useState([]);
    const [comapny_code, setCompanyCode] = useState('');

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
        } else {
            setModal(true);
        }
    }, [modal]);

    useEffect(() => {
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
    //     const obj = JSON.parse(main_menu).menuItems[33].subMenuMaster.name;
    //     setHeaderName(obj);
    // }

    const getPackerData = async (plantCode) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerProduct/getAllPackerProductOnSequencing?type=UL&plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setPackerData(data);
            });
    }
    const selectedPacker = (e, data) => {

        const id = data.id;
        const packerCode = data.packerLoaderCode;
        const materialCode = data.materialTypeCode;
        const status = data.status;
        setQueueSize(data.queueSize);
        setcurrentQueueCount(data.currentQueueCount);
        setDropCount("0");
        if (status === 0) {
            toast.error("Status is Deactive. Select Active Unloading Point", { autoClose: 3000 });
        } else {
            axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/getAllVehicleQueue?loaderCode=${packerCode}&plantCode=${plantCode}`, config)
                .then(res => {
                    const data = res;
                    if (data[0] !== null) {
                        setVehicleData(data);
                        setSelectedOption(id);
                        setPackerCode(packerCode);
                        setMaterialCode(materialCode);
                        //setFilteredUsers(AllSequencedVehicle);
                        getAllSequencedVehicle(materialCode);
                        setFlag(true);
                    } else {
                        //toast.error("No data found for this Unloading Point.", { autoClose: 3000 });
                        setSelectedOption(id);
                        setPackerCode(packerCode);
                        setMaterialCode(materialCode);
                        //setFilteredUsers(AllSequencedVehicle);
                        getAllSequencedVehicle(materialCode);
                        setFlag(true);
                    }
                })
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
        //getAllSequencedVehicle(materialCode);
    }

    function removeClassFromSiblings(parentElement, className) {
        const siblings = Array.from(parentElement.children);

        siblings.forEach((sibling) => {
            sibling.classList.remove(className);
        });
    }


    const getAllSequencedVehicle = async (materialCode) => {

        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/getAllConsignmentVehicles?sequencingType=IB&product=${materialCode}&plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setAllSequencedVehicle(data);
                setFilteredUsers(data);
            });
    }

    const handleFilter = (event) => {

        const value = event.target.value;
        let arr = AllSequencedVehicle.filter((item) => {
            return (
                item.vehicleNumber
                    .toLocaleLowerCase()
                    .indexOf(value.toLocaleLowerCase()) > -1
            );
        });
        setFilteredUsers(arr);
    };

    const submitVehicle = async (e) => {

        e.preventDefault();
        var arr = [];
        var finalarr = [];
        filteredUsers.forEach((t) => {
            if (t.status === "new") {
                arr.push({ "vehicleNo": t.vehicleNumber, "tripId": t.tripId, "code": currentPackerCode, "packerCode": null, "material": currentMaterialCode, "plantCode": plantCode, "companyCode": comapny_code })
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
            try {

                const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_SEQUENCING}/sequencing/manualSequencing`, arr, config)
                console.log(res);
                if (res.errorMsg === "Queue Limit Exceed!") {
                    toast.error(res.errorMsg, { autoClose: 3000 });
                }
                else if (res.errorMsg === "Vehicle_Already_SEQUENCED") {
                    toast.error(res.errorMsg, { autoClose: 3000 });
                }
                else if (res.errorMsg === "Vehicle_Already_In_Queue") {
                    toast.error(res.errorMsg, { autoClose: 3000 });
                }
                else {
                    toast.success("Vehicle added successfully.", { autoClose: 3000 });
                    getPackerData(plantCode);
                    getPackerDataAfterSubmit();
                    getAllSequencedVehicle();
                    setFilteredUsers(finalarr)
                    setcurrentQueueCount(CurrentQueueCount + dropCount);
                    setDropCount("0");
                }
            }
            catch (e) {
                toast.error("Something went wrong!", { autoClose: 3000 });
            }
        }
    };

    const getPackerDataAfterSubmit = async (e) => {
        const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/getAllVehicleQueue?loaderCode=${currentPackerCode}&plantCode=${plantCode}`, config)
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
                Header: "Unloading Point",
                accessor: "packerLoaderCode",
                filterable: false,
            },
            {
                Header: "Queue Size",
                accessor: "queueSize",
                filterable: false,
            },
            {
                Header: "Allotted Vehicle",
                accessor: "currentQueueCount",
                filterable: false,
            },

            {
                Header: "Running Material",
                accessor: "materialTypeCode",
                filterable: false,
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


    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    document.title = "Manual Sequencing IB || EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">

                <Container fluid>
                    <BreadCrumb title={"Manual Sequencing IB"} pageTitle="EPLMS" />
                    <Row>
                        <Col xl={12}>
                            <Card className="shadow_light">
                                <CardHeader className="bg-light">
                                    <div className="d-flex">
                                        <h5 className="flex-grow-1 mb-0 fs-16">
                                            <i className="ri-file-copy-line me-1 mt-3" style={{ top: "2px", position: "relative" }}></i>
                                            Unloading Point Details
                                        </h5>
                                    </div>
                                </CardHeader>
                                <CardBody style={{ padding: "0px 10px", textAlign: "center" }}>
                                   
                                        <TableContainer
                                            columns={columns}
                                            data={PackerData}
                                            isAddUserList={false}
                                            customPageSize={15}
                                            className="custom-header-css"
                                            handleCustomerClick={handleCustomerClicks}
                                            tableClass={"text-center border-end-dashed border-end border-start-dashed border-start"}
                                            manualTR={false}
                                            divClass="test"
                                        />
                                    
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    {flag &&
                        <>
                            <Col lg={12}>
                                <Card className="shadow_light">
                                    <CardHeader className="bg-light">
                                        <h5 className=" mb-0 fs-16 "><i className="ri-truck-line me-1 mt-3" style={{ top: "2px", position: "relative" }}></i>Active Loader List - <span style={{ color: "green" }}>{currentPackerCode}</span></h5>
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
                                                            <Col className="p-1"><h5 className="fs-16 mt-2 ps-3" >{"No Vehicle found. Please select vehicle from Unsequenced Vehicle list."}</h5></Col>

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
                                                <h5 className=" flex-grow-1 mb-0 fs-16">
                                                    <i className="ri-truck-line me-1 mt-3" style={{ top: "2px", position: "relative" }}></i>
                                                    Unsequenced Vehicle - <span style={{ color: "green" }}>{currentMaterialCode}</span>
                                                </h5>
                                                <input type="text" placeholder="Search Vehicle" className="border rounded search_css" onChange={handleFilter}></input>
                                            </div>
                                        </CardHeader>
                                        <CardBody style={{ padding: "15px", height: "250px", maxHeight: "250px", overflowY: "auto" }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, "old")}>
                                            {getTask().old}
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xl={2} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                    <div style={{ display: "grid", textAlign: "center", marginBottom: "20px" }}>
                                        <i className="bx bx-transfer-alt text-success" style={{ fontSize: "5rem" }}></i>
                                        <button className="btn btn-success" onClick={submitVehicle}>Submit</button>
                                    </div>
                                </Col>
                                <Col xl={5}>
                                    <Card className="shadow_light">
                                        <CardHeader className="bg-light">
                                            <div className="d-flex">
                                                <h5 className=" flex-grow-1 mb-0 fs-16">
                                                    <i className="ri-truck-line me-1 mt-3" style={{ top: "2px", position: "relative" }}></i>
                                                    Selected Vehicle
                                                    {/* <span style={{ float: "right", marginRight: "5px", color: "green", marginLeft: "10px" }}>Count - <span style={{ color: "#0b2f6f" }}>{dropCount} </span></span>
                                                    <span style={{ float: "right", marginRight: "5px", color: "green", marginLeft: "10px" }}>Pre Count - <span style={{ color: "brown" }}>{CurrentQueueCount} </span></span>
                                                    <span style={{ float: "right", marginRight: "5px", color: "green" }}>Size - <span style={{ color: "red" }}>{QueueSize} </span></span> */}
                                                    <button className="btn-info btn-label rounded-pill fs-13 ms-2" style={{ border: "solid 1px #ccc", background: "aquamarine", cursor: "unset" }}><span className="label-icon align-middle rounded-pill fs-16 me-2 fw-bold" style={{ backgroundColor: "#f7b84b66" }}>{dropCount}</span>Unsequenced</button>
                                                    <button className="btn-info btn-label rounded-pill fs-13 ms-2" style={{ border: "solid 1px #ccc", background: "lavenderblush", cursor: "unset" }}><span className="label-icon align-middle rounded-pill fs-16 me-2 fw-bold" style={{ backgroundColor: "#f7b84b66" }}>{CurrentQueueCount}</span>Allotted</button>
                                                    <button className="btn-info btn-label rounded-pill fs-13 ms-2" style={{ border: "solid 1px #ccc", background: "palegreen", cursor: "unset" }}><span className="label-icon align-middle rounded-pill fs-16 me-2 fw-bold" style={{ backgroundColor: "#f7b84b66" }}>{QueueSize}</span>Size</button>

                                                </h5>
                                            </div>
                                        </CardHeader>
                                        <CardBody id="new_card" style={{ padding: "15px", height: "250px", maxHeight: "250px", overflowY: "auto" }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, "new")}>
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
        </React.Fragment>
    );
};

export default SequencingIBPage;
