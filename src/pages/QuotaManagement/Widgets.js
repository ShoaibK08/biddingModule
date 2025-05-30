// import React from 'react';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Modal, ModalHeader, ModalBody } from 'reactstrap';
import CountUp from "react-countup";
// import { taskWidgetsBid } from '../../common/data';
import axios from "axios";

import { taskWidgetsBid } from '../../common/data';


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

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8085}/orderManagement/count`, config)
        .then(response => {
            console.log(response);
            const widgets = taskWidgetsBid(response);
            setTaskWidgetsBid(widgets); // Update UI with API data
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [reloadKey]);

    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = (item) => {
    setSelectedCard(item);
    setIsModalOpen(true);
    };

    const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    };

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
        size="md"
        className="border-0"
        >
        <ModalHeader toggle={toggleModal}>Card Details</ModalHeader>
        <ModalBody>
            {selectedCard && (
            <div>
                <p><strong>Label:</strong> {selectedCard.label}</p>
                <p><strong>Value:</strong> {selectedCard.counter}{selectedCard.suffix}</p>
                {/* Add more details as needed */}
            </div>
            )}
        </ModalBody>
        </Modal>

        </React.Fragment>
    );
};

export default Widgets;