import React, { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import CountUp from "react-countup";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from "dayjs";
import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Form,
    Input,
    Row,
    Table,
    Modal, ModalBody, ModalHeader, Label, UncontrolledPopover, PopoverHeader, PopoverBody, UncontrolledTooltip,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CollapsiblePanel from "../../../Components/Common/CollapsiblePanel";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import TableContainer from "../../../Components/Common/TableContainer";
import Select from "react-select";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, FreeMode, Navigation, Thumbs } from "swiper";
import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import zIndex from "@material-ui/core/styles/zIndex";
import avatar from "../../../assets/images/path.png";

const VehicleLiveStatus = () => {
    SwiperCore.use([FreeMode, Navigation, Thumbs]);
    const [thumbsSwiper] = useState(null);

    document.title = "Vehicle Status | EPLMS";

    const [isExportCSV, setIsExportCSV] = useState(false);
    const [vehicleListFetching, setVehicleListFetching] = useState(false);
    const [devices, setDevice] = useState([]);
    const [selectedOption, SetSelectedOption] = useState("");
    const [FirstCollpse, setFirstCollpse] = useState(false);
    const [latestData, setLatestData] = useState([]);
    const [cardHeader, setCardHeader] = useState('');
    const [plantCode, setPlantCode] = useState('');
    const [noStageError, setNoSatgeError] = useState(false);
    const [stageData, setStageData] = useState([]);
    const [tagData, setTagData] = useState([]);
    const [updatedStageData, setUpdatedStageData] = useState([]);
    const [vehicleNotFound, setVehicleNotFound] = useState(false);
    const [tripFlag, setErrorTrip] = useState(false);
    const [gateOutMsg, setGateOutMsg] = useState(false);
    const [vehicleCurrentData, setVehicleCurrentData] = useState({});
    const [VehicleBasicDetails, setVehicleBasicDetails] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [NoData, setNoData] = useState(false);
    const [options, setOptions] = useState([]);

    const togglePopover = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantCode = obj.data.plantCode;
        setPlantCode(plantCode);
        getStageData(plantCode);
    }, []);


    const handleInputChange = async (event, value) => {
        debugger;
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
        if (sanitizedValue && sanitizedValue.length >= 3) {
            setVehicleListFetching(true);
            await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicleStatus/vehicleInfo?plantCode=${plantCode}&vehicleNumber=${sanitizedValue}`, config)
                .then(res => {
                    setOptions(res);
                    setVehicleListFetching(false);
                })
        } else {
            // Clear options if input is cleared
            setOptions([]);
            setVehicleListFetching(false);
        }
    };

    const onVehicleNumberChange = (event, values) => {
        debugger;
        if (values && values.registration_number) {
            SetSelectedOption(values.registration_number);
            setFirstCollpse(true);
            setGateOutMsg(false);
            getVehicleCurrentStage(values.registration_number);
            getVehicleBasicDetails(values.registration_number);
        }
        else {
            setNoData(false);
            setGateOutMsg(false);
            setErrorTrip(false);
            setVehicleNotFound(false);
        }
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

    const getStageData = (plantCode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/movementType/OB/${plantCode}`, config)
            .then(res => {
                const result = res;
                if (res && res.msg) {
                    setNoSatgeError(true);
                } else {
                    setNoSatgeError(false);
                    result.pop();
                    setStageData(result);
                }
            });
    }

    const getVehicleCurrentStage = (vehicleNumber) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/Bcp/${vehicleNumber}/${plantCode}`, config)
            .then(res => {
                if (res.msg && res.msg.includes("No Active data")) {
                    setVehicleNotFound(true);
                    setErrorTrip(false);
                    setDevice([]);
                    setTagData([]);
                }
                else if (res.msg && res.msg.includes("Trip is not found")) {
                    setVehicleNotFound(false);
                    setErrorTrip(true);
                    setDevice([]);
                    setTagData([]);
                }
                else {
                    const result1 = res;
                    setVehicleCurrentData(result1)
                    setVehicleNotFound(false);
                    setErrorTrip(false);
                    setTimeout(() => {
                        const cur_stg = res.curr_location;
                        //const filteredArray = stageData.filter(element => element.name === cur_stg);
                        const allElements = document.getElementsByClassName(cur_stg);
                        allElements[0].classList.add('glow');
                        const icon = document.querySelector('.glow');
                        const btn = icon.parentNode.parentNode.children[0];
                        btn.classList.add('showTruck');
                    }, 1000);
                }
            });
    }

    const getVehicleBasicDetails = async (vehNo) => {
        debugger;
        try {
            await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicleStatus?plantCode=${plantCode}&vehicleNo=${vehNo}`, config)
                .then(res => {
                    if (res.msg) {
                        setVehicleBasicDetails({});
                        setDevice([]);
                        setTagData([]);
                        setNoData(false);
                        setErrorTrip(true);
                    }
                    else {
                        setNoData(true);
                        setVehicleBasicDetails(res);
                        if (res.gateOut) {
                            setGateOutMsg(true);
                            setErrorTrip(false);
                        }
                        setDevice((res.vehicleInfo) ? res.vehicleInfo : []);
                        setTagData(res.tagList);
                        const updatedStageData = stageData.map((item, index) => {
                            if (item.locationName === "YARD-IN" && res.yardIn) {
                                return {
                                    ...item,
                                    time: res.yardIn
                                };
                            }
                            else if (item.locationName === "GATE-IN" && res.gateIn) {
                                return {
                                    ...item,
                                    time: res.gateIn
                                };
                            }
                            else if (item.locationName === "WB-(TW)" && res.tareWeight) {
                                return {
                                    ...item,
                                    time: res.tareWeight
                                };
                            }
                            else if (item.locationName === "PACKING-IN" && res.packingIn) {
                                return {
                                    ...item,
                                    time: res.packingIn
                                };
                            }
                            else if (item.locationName === "PACKING-OUT" && res.packingOut) {
                                return {
                                    ...item,
                                    time: res.packingOut
                                };
                            }
                            else if (item.locationName === "WB-(GW)" && res.grossWeight) {
                                return {
                                    ...item,
                                    time: res.grossWeight
                                };
                            }
                            // else if (item.locationName === "GATE-OUT" && res.gateOut) {
                            //     return {
                            //         ...item,
                            //         time: res.gateOut
                            //     };
                            // }
                            return item; // return the original item if no modification is needed
                        });
                        setUpdatedStageData(updatedStageData);
                    }

                })
        }
        catch (e) {
            console.log(e);
        }
    }

    const columns = useMemo(
        () => [
            {
                Header: '',
                accessor: 'id',
                hiddenColumns: true,
                Cell: (cell) => {
                    return <input type="hidden" value={cell.value} />;
                }
            },
            {
                Header: "Order Type",
                accessor: "orderType",
                filterable: false,
            },
            {
                Header: "DI Number",
                accessor: "diNumber",
                filterable: false,
            },
            {
                Header: "DI qty",
                accessor: "di_qty",
                filterable: false,
            },
            {
                Header: "DI Creation Date",
                accessor: "consignmentDate",
                filterable: false,
            },
            {
                Header: "Material Name",
                accessor: "materialName",
                filterable: false,
            },
            {
                Header: "Material Code",
                accessor: "materialCode",
                filterable: false,
            },
            {
                Header: "Unit Code",
                accessor: "unitCode",
                filterable: false,
            },
            {
                Header: "MRP",
                accessor: "mrp",
                filterable: false,
                Cell: (cell) => {
                    return <span>{cell.value ? cell.value : "0"}</span>;
                }
            },
        ],
    );

    const [documentModal, setDocumentModal] = useState(false);

    const setViewModal = () => {
        setDocumentModal(!documentModal);
    };
    const handleDownload = async (e) => {
        e.preventDefault();
        downloadCSV();
        setIsExportCSV(false)
    };

    const downloadCSV = () => {
        const header = Object.keys(latestData[0]).join(',') + '\n';
        const csv = latestData.map((row) => Object.values(row).join(',')).join('\n');
        const csvData = header + csv;
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'table_data.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    function getColorClass(index, locationCode) {
        let foundGIIndex = -1; // Initialize variable to track index of first "GI"

        // Loop through the stageData array to find the index of the first "GI"
        stageData.forEach((item, i) => {
            if (item.locationName === vehicleCurrentData.curr_location && foundGIIndex === -1) {
                foundGIIndex = i; // Store the index of the first "GI"
            }
        });

        // Apply different background color based on the index
        if (index < foundGIIndex) {
            return "bg-success"; // Apply bg-danger className before encountering "GI"
        } else if (index === foundGIIndex) {
            return "bg-warning"; // Apply bg-success className at the index of "GI"
        } else {
            return "bg-danger"; // Apply bg-warning className after encountering "GI"
        }
    }

    const [collapse, setCollapse] = useState(false);



    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={"Vehicle Status"} pageTitle="Dashboard" />
                    <Row>

                        <Col xxl={12}>
                            <Card>
                                <CardBody className="shadow_light rounded d-flex" >
                                    <Col lg={1} md={2} style={{ borderRight: "solid 1px #ccc" }}>
                                        <img src={avatar} alt="" className="avatar-md rounded-circle img-thumbnail shadow" style={{ margin: "14px 0px 0px 5px", cursor: "default" }} />
                                    </Col>

                                    <Col lg={3} md={5} className="ps-3 mt-2">
                                        <div className="mb-3">
                                            <Label htmlFor="choices-single-no-sorting" className="form-label fs-16 text-primary fw-bold">
                                                Vehicle Number
                                            </Label>
                                            <Autocomplete
                                                style={{ marginTop: '-15px' }}
                                                freeSolo
                                                options={options}
                                                getOptionLabel={option => option.registration_number || option}
                                                onChange={onVehicleNumberChange}
                                                onInputChange={handleInputChange}
                                                renderInput={params => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Search Vehicle Number..."
                                                        margin="normal"
                                                        fullWidth
                                                        style={{ fontSize: 10 }}
                                                    />
                                                )}
                                            />
                                        </div>
                                        {vehicleListFetching && <p className="mt-1 mb-0" style={{ color: "Green", animation: "blink 1s infinite" }}>Please wait. Vehicle data fetching...</p>}
                                        {noStageError && <p className="mt-1 mb-0" style={{ color: "red" }}>No stages found for this vehicle</p>}
                                        {vehicleNotFound && <p className="mt-1 mb-0" style={{ color: "red" }}>Vehicle not found!</p>}
                                        {/* {tripFlag && <p className="mt-1 mb-0" style={{ color: "red", animation: "blink 1s infinite" }}>Trip is not found for this vehicle number.</p>}
                                        {gateOutMsg && <p className="mt-1 mb-0" style={{ color: "Green", animation: "blink 1s infinite" }}>Gate Out is done for this vehicle.</p>} */}
                                        {gateOutMsg ? <p className="mt-1 mb-0" style={{ color: "Green", animation: "blink 1s infinite" }}>Gate Out is done for this vehicle.</p> : tripFlag ? <p className="mt-1 mb-0" style={{ color: "red", animation: "blink 1s infinite" }}>Trip is not found for this vehicle number.</p> : ""}

                                    </Col>

                                </CardBody>
                            </Card>
                            <CollapsiblePanel title="Vehicle Detail" collapse={collapse}><Card id="company-overview ">
                                <CardBody>
                                    {FirstCollpse && NoData ? <>
                                        <Row className="px-2">
                                            <Col lg={12} className="bg-light p-3 ribbon-box">
                                                <div className="ribbon ribbon-primary round-shape">Trip Status</div>
                                                <div>
                                                    <div className="horizontal-timeline my-3">
                                                        <Swiper className="timelineSlider"
                                                            navigation={true}
                                                            thumbs={{ swiper: thumbsSwiper }}
                                                            slidesPerView={5}
                                                        >
                                                            <div className="swiper-wrapper">
                                                                {updatedStageData.map((item, index) => (


                                                                    <SwiperSlide className="tire" key={index}>
                                                                        <div className="card pt-2 border-0 item-box text-center">
                                                                            <div className="truck" style={{ display: "none" }}><lord-icon src="https://cdn.lordicon.com/uetqnvvg.json" trigger="loop" colors="primary:#405189,secondary:#0ab39c" style={{ width: "30px", height: "30px", borderRadius: "50px", background: "aliceblue", zIndex: "9", border: "solid 2px #27c3bc", padding: "2px" }} ></lord-icon></div>
                                                                            <div className="timeline-content p-3 shadow_light" style={{ borderRadius: "60px" }}>
                                                                                <div>
                                                                                    <h6 className="mb-0">{item.time ? <span className="text-success">{item.time}</span> : <span className="text-warning">Stage not yet completed</span>}</h6>
                                                                                </div>
                                                                            </div>
                                                                            {/* <div className={`time`}>
                                                                                <span className={`badge bg-warning fs-14 ${item.locationName}`}>{item.stageCode}</span>
                                                                                </div> */}
                                                                            {gateOutMsg ? <div className={`time`}>
                                                                                <span className={`badge fs-11 bg-danger`}>
                                                                                    {item.locationName}
                                                                                </span>
                                                                            </div> :
                                                                                <div className={`time`}>
                                                                                    <span className={`badge fs-11 ${getColorClass(index, item.locationName)} ${item.locationName}`}>
                                                                                        {item.locationName}
                                                                                    </span>
                                                                                </div>
                                                                            }

                                                                        </div>
                                                                    </SwiperSlide>
                                                                ))}


                                                            </div>
                                                        </Swiper>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                        : "No Vehicle Data Found"
                                    }
                                </CardBody>
                            </Card>
                            </CollapsiblePanel>
                        </Col>
                        <Col xxl={12}>

                            <CollapsiblePanel title="Vehicle Informations" collapse={collapse}>
                                <Card id="company-overview">
                                    <CardBody>
                                        {FirstCollpse && NoData ?
                                            <>
                                                <Row className="px-2">
                                                    <Col lg={12} className="bg-light p-3">
                                                        <Table className="table-responsive styled-table shadow m-0" >
                                                            <tr>
                                                                <th style={{ borderRadius: "6px" }}>Vehicle No : </th>
                                                                <td>{VehicleBasicDetails.registration_number}</td>
                                                                <th>Trip Id : </th>
                                                                <td>{VehicleBasicDetails.tripId}</td>
                                                                <th>Capacity : </th>
                                                                <td>{VehicleBasicDetails.vehicle_capacity_max ? VehicleBasicDetails.vehicle_capacity_max : "0"}</td>
                                                                <th>Tag Number : </th>
                                                                {tagData != null ? (
                                                                    <>
                                                                        <td className="p-0">
                                                                            <span>
                                                                                Available&nbsp;&nbsp;&nbsp;
                                                                                <i
                                                                                    className="ri-eye-fill text-success fs-16"
                                                                                    id="PopoverDismissible"
                                                                                    onClick={togglePopover}
                                                                                    style={{ position: "relative", top: "3px" }}
                                                                                ></i>
                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            <UncontrolledPopover
                                                                                placement="left"
                                                                                target="PopoverDismissible"
                                                                                isOpen={isOpen}
                                                                                trigger="legacy"
                                                                                toggle={togglePopover}
                                                                            >
                                                                                <PopoverHeader>Tag Details</PopoverHeader>
                                                                                <PopoverBody>
                                                                                    {tagData && tagData.map((item, index) => (
                                                                                        <div key={index}>
                                                                                            <p>
                                                                                                <i className="ri-bookmark-3-fill align-bottom"></i>
                                                                                                &nbsp;&nbsp;&nbsp;{item.tagId}
                                                                                            </p>
                                                                                        </div>
                                                                                    ))}
                                                                                </PopoverBody>
                                                                            </UncontrolledPopover>
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <td className="p-0">
                                                                        <span>Not Available</span>
                                                                    </td>
                                                                )}

                                                            </tr>
                                                            <tr className="mt-2">
                                                                <th style={{ borderRadius: "6px" }}>Vehicle Type : </th>
                                                                <td>{VehicleBasicDetails.vehicle_type}</td>
                                                                <th>Movement : </th>
                                                                <td>{VehicleBasicDetails.movement_type}</td>
                                                                <th>Blacklist : </th>
                                                                <td>{VehicleBasicDetails.black_list === "N" ? "No" : "Yes"}</td>
                                                                <th>IGP Number : </th>
                                                                <td>{VehicleBasicDetails.igpNumber}</td>
                                                            </tr>
                                                        </Table>
                                                    </Col>
                                                </Row>
                                            </>
                                            : "No data Found!"
                                        }
                                    </CardBody>
                                </Card>
                            </CollapsiblePanel>
                        </Col>
                        <Col xxl={12}>

                            <CollapsiblePanel title="Order Details" collapse={collapse}>
                                <Card id="company-overview">
                                    <CardBody>
                                        {FirstCollpse && NoData ?
                                            <>
                                                <Row className="px-2">
                                                    <Col lg={12} className="bg-light p-3">
                                                        <div className="card-body p-0 m-0">
                                                            <div className="shadow m-0 p-3" style={{ borderRadius: "6px" }}>
                                                                {devices.length ? (
                                                                    <TableContainer
                                                                        columns={columns}
                                                                        data={(devices || [])}
                                                                        isGlobalFilter={true}
                                                                        isAddUserList={false}
                                                                        customPageSize={5}
                                                                        isGlobalSearch={true}
                                                                        className="custom-header-css"
                                                                        //isCustomerFilter={true}
                                                                        SearchPlaceholder='Search for Order Type...'
                                                                        divClass="overflow-auto"
                                                                    />
                                                                ) : (<span>No Data.</span>)
                                                                }
                                                            </div>
                                                            <ToastContainer closeButton={false} limit={1} />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </>
                                            : "No data Found!"
                                        }
                                    </CardBody>
                                </Card>
                            </CollapsiblePanel>
                        </Col>
                    </Row>
                    <ToastContainer closeButton={false} limit={1} />
                </Container>
            </div>

            <Modal isOpen={documentModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="xl" toggle={setViewModal}>
                <ModalHeader toggle={setViewModal} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
                    <h5 className="text-white fs-20">{cardHeader}</h5>
                </ModalHeader>
                <ModalBody>
                    <div className="product-content mt-0">
                        <ExportCSVModal
                            show={isExportCSV}
                            onCloseClick={() => setIsExportCSV(false)}
                            onDownloadClick={handleDownload}
                            data={latestData}
                        />
                        {" "}
                        <button style={{ float: "right" }} type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                            <i className="ri-file-download-line align-bottom me-1"></i>
                        </button>
                        <TableContainer
                            columns={columns}
                            data={latestData}
                            isGlobalFilter={true}
                            isAddUserList={false}
                            customPageSize={5}
                            isGlobalSearch={true}
                            className="custom-header-css"
                            isCustomerFilter={false}
                            SearchPlaceholder='Search...'
                            style={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
                        />
                    </div>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default VehicleLiveStatus;
