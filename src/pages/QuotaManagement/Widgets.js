// import React from 'react';
import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardBody, Col, Modal, ModalHeader, ModalBody } from 'reactstrap';
import CountUp from "react-countup";
// import { taskWidgetsBid } from '../../common/data';
import axios from "axios";
import TableContainer from '../../Components/Common/TableContainer';

import { taskWidgetsBid } from '../../common/data';
// import { toast } from 'react-toastify';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Widgets = ({ reloadKey }) => {

    const [taskWidgetsBid1, setTaskWidgetsBid] = useState([]);
    const config = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"
        },
        auth: {
            username: "amazin",
            password: "TE@M-W@RK",
        },
    };
    console.log(config);
    //const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
    useEffect(() => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8085}/orderStatus/counts`, config)
        .then(response => {
        const statusMap = response.reduce((acc, item) => {
            acc[item.truckStatus] = item.cnt;
            return acc;
        }, {});

        const transformedData = {
            assignedTransporter: statusMap['Assigned_Transport'] || 0,
            orderCommitted: statusMap['Order_Committed'] || 0,
            orderFulfilled: statusMap['Truck_Allocated'] || 0,
        };

        const widgets = taskWidgetsBid(transformedData);
        setTaskWidgetsBid(widgets);
        })
        .catch(error => {
        console.error('Error fetching data:', error);
        });
    }, [reloadKey]);


    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transporterAssigned,setTransporterAssigned] = useState([]);
    const [orderCommitted,setOrderCommitted] = useState([]);
    const [orderConfirmed,setOrderConfirmed] = useState([]);
    const [transporterAssignedStatus,setTransporterAssignedStatus] = useState(0);
    const [orderCommittedStatus,setOrderCommittedStatus] = useState(0);
    const [orderConfirmedStatus,setOrderConfirmedStatus] = useState(0);

    const handleCardClick = async (item) => {
    setSelectedCard(item);
    let url = "";
    let method = "get";
    const config = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"
        },
        auth: {
            username: "amazin",
            password: "TE@M-W@RK",
        },
    };

    try {
        if (item.label === "Assigned Transporter") {
        url =  `${process.env.REACT_APP_LOCAL_URL_8085}/api/transporters/getAssignedTransporter`;
        const response = await axios.get(url, config);
        // console.log("Assigned Transporter Data:", response.data);
        if(response.errorMsg){
            toast.error(response.errorMsg);
            return false;
        }
        setTransporterAssignedStatus(1);
        setOrderConfirmedStatus(0);
        setOrderCommittedStatus(0);
        console.log("response",response);
        setTransporterAssigned(response);
        // Do something with response.data (e.g., set state for modal content)

        } else if (item.label === "Order Committed") {
        url = `${process.env.REACT_APP_LOCAL_URL_8085}/salesorder_allocation/committedOrders/2`;
        const response = await axios.get(url, {}, config);
        if(response.errorMsg){
            toast.error(response.errorMsg);
            return false;
        }
        setTransporterAssignedStatus(0);
        setOrderConfirmedStatus(0);
        setOrderCommittedStatus(1);
        setOrderCommitted(response);
        // Do something with response.data

        } else if (item.label === "Order Fulfilled") {
        url = `${process.env.REACT_APP_LOCAL_URL_8085}/salesorder_allocation/committedOrders/3`;
        const response = await axios.get(url, {}, config);
        if(response.errorMsg){
            toast.error(response.errorMsg);
            return false;
        }
        setTransporterAssignedStatus(0);
        setOrderConfirmedStatus(1);
        setOrderCommittedStatus(0);
        setOrderConfirmed(response);
        // Do something with response.data
        }
    } catch (error) {
        console.error("Error loading modal data:", error);
        // toast.error("Failed to load data for " + item.label);
    }
    setIsModalOpen(true);
    };

    const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    };

    const columns1 = useMemo(() => [
      {
        Header: "Transporter Code",
        accessor: "code",
        filterable: false,
      },
      {
        Header: "Transporter Name",
        accessor: "name",
        filterable: false,
      },
      {
        Header: "Location",
        accessor: "city",
        filterable: false,
      },
      {
        Header: "Contact Person",
        accessor: "contactPerson",
        filterable: false,
      },
      {
        Header: "Contact Number",
        accessor: "contactNumber",
        filterable: false,
      },
    ], []);

    const columns2 = useMemo(() => [
      {
        Header: "So Code",
        accessor: "code",
        filterable: false,
      },
      {
        Header: "Transporter Name",
        accessor: "name",
        filterable: false,
      },
      {
        Header: "Location",
        accessor: "city",
        filterable: false,
      },
      {
        Header: "Contact Person",
        accessor: "contactPerson",
        filterable: false,
      },
      {
        Header: "Contact Number",
        accessor: "contactNumber",
        filterable: false,
      },
    ], []);

    return (
        <React.Fragment>
            {taskWidgetsBid1.map((item, key) => (
            <Col xxl={4} sm={6} key={key}>
                <Card className="card-animate" onClick={() => handleCardClick(item)} style={{ cursor: 'pointer' }}>
                <CardBody style={{ background: "#F8F6FF" }}>
                    <div className="d-flex justify-content-between">
                    <div>
                        <p className="fw-medium text-muted mb-0 color-bl">{item.label}</p>
                        <h2 className="mt-4 ff-secondary fw-semibold">
                        <span className="counter-value">
                            <CountUp start={0} end={item.counter} decimal={item.decimals} suffix={item.suffix} duration={3} />
                        </span>
                        </h2>
                    </div>
                    <div>
                        <div className="avatar-sm flex-shrink-0">
                        <span className={"avatar-title rounded fs-4 new-color-cl text-" + item.iconClass}>
                            <img src={item.img} style={{ width: "30px" }} />
                        </span>
                        </div>
                    </div>
                    </div>
                </CardBody>
                </Card>
            </Col>
            ))}

        <Modal
        isOpen={isModalOpen}
        toggle={toggleModal}
        centered
        size="lg"
        className="border-0 for-custom-apply"
        modalClassName='modal fade zoomIn'
        >
        <ModalHeader className="p-3" toggle={toggleModal}>{selectedCard && selectedCard.label}</ModalHeader>
        <ModalBody>
            {
            /*selectedCard && (
            // <div>
            //     <p><strong>Label:</strong> {selectedCard.label}</p>
            //     <p><strong>Value:</strong> {selectedCard.counter}{selectedCard.suffix}</p>
            // </div>
            )*/}
            {transporterAssignedStatus === 1 ? 
            <><TableContainer
                columns={columns1}
                //  data={(taskList || [])}
                data={transporterAssigned}
                isGlobalFilter={true}
                isGlobalSearch={true}
                customPageSize={5}
                className="custom-header-css"
                divClass="table-responsive table-card table-card1 mb-3"
                tableClass="align-middle table-nowrap mb-0"
                theadClass="table-light table-nowrap"
                thClass="table-light"
                SearchPlaceholder='Search for tasks or something...'
            />   
            </> 
            : ""}
            {orderCommittedStatus === 1 ? 
            <><TableContainer
                columns={columns2}
                //  data={(taskList || [])}
                data={orderCommitted}
                isGlobalFilter={true}
                isGlobalSearch={true}
                customPageSize={5}
                className="custom-header-css"
                divClass="table-responsive table-card table-card1 mb-3"
                tableClass="align-middle table-nowrap mb-0"
                theadClass="table-light table-nowrap"
                thClass="table-light"
                SearchPlaceholder='Search for tasks or something...'
            />   
            </> 
            : ""}
            {orderConfirmedStatus === 1 ? 
            <><TableContainer
                columns={columns2}
                //  data={(taskList || [])}
                data={orderConfirmed}
                isGlobalFilter={true}
                isGlobalSearch={true}
                customPageSize={5}
                className="custom-header-css"
                divClass="table-responsive table-card table-card1 mb-3"
                tableClass="align-middle table-nowrap mb-0"
                theadClass="table-light table-nowrap"
                thClass="table-light"
                SearchPlaceholder='Search for tasks or something...'
            />   
            </> 
            : ""}
            
            <ToastContainer closeButton={false} limit={1} />
            
        </ModalBody>
        </Modal>

        </React.Fragment>
    );
};

export default Widgets;