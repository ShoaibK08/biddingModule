import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, Offcanvas, OffcanvasBody, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, Spinner } from "reactstrap";

import Ai_Icon from "../assets/images/firloBot.png";
import Ai_Chat from "../assets/images/firloChat.png";
import user_img from "../assets/images/users/user-dummy-img.jpg";
import bg_pattern from "../assets/images/landing/bg-pattern.png";
import axios from "axios";
import './ChatBot.scss';

const AiChat = () => {

    const ref = useRef(null);
    const messagesEndRef = useRef(null);

    //OffCanvas  
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [disabledSend, setDisabledSend] = useState(false);
    //const [transcript, setTranscript] = useState('');
    // const recognition = new window.webkitSpeechRecognition();

    // var voice = "";
    // recognition.onresult = (event) => {
    //     const last = event.results.length - 1;
    //     const text = event.results[last][0].transcript;
    //     voice = text;
    //     setTranscript(text);
    //   };

    //   const startListening = () => {
    //     recognition.start();
    //     setTimeout(() => {
    //       recognition.stop();
    //       setIsOpen(false);
    //       handleSendMessageVoice(voice);
    //     }, 10000); // Stop listening after 10 seconds
    //   };

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleModalSize = () => {
        setIsExpanded(prevState => !prevState);
    };

    useEffect(() => {
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        setUserName(obj.data.first_name);

    }, [])


    const [transcript, setTranscript] = useState('');
    let recognition;

    const initializeRecognition = () => {
        if ('SpeechRecognition' in window) {
            // Standard
            recognition = new window.SpeechRecognition();
        } else if ('webkitSpeechRecognition' in window) {
            // WebKit
            recognition = new window.webkitSpeechRecognition();
        } else {
            console.error('Speech recognition not supported in this browser.');
            return;
        }

        recognition.onresult = handleRecognitionResult;
    };

    var voice = "";
    const handleRecognitionResult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript;
        voice = text;
        setTranscript(text);
    };

    const startListening = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setTranscript(null);
        if (!recognition) {
            initializeRecognition();
        }

        recognition.start();

        setTimeout(() => {
            recognition.stop();
            setIsOpen(false);
            //handleSendMessageVoice(voice);
            setInputText(voice);
        }, 7000); // Stop listening after 10 seconds
    };

    const toggleOffCanvas = () => {
        setIsOpen(!isOpen);
    };

    // Function to scroll to the bottom
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const [cameraModal, setCameraModal] = useState(false);
    const setViewModalCamera = () => {
        setCameraModal(!cameraModal);
    };
    const openModalCamera = () => {
        setViewModalCamera();
    }
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');


    //Commenting code as this is directly calling api after text received.

    // const handleSendMessageVoice = async (voice) => {
    //     if (voice.trim() !== '') {
    //         var plsWait = <p className='m-0' style={{ animation: "blink 1s infinite" }}>Please wait...</p>
    //         setMessages([...messages, { text: voice, sender: 'User', finalText: plsWait, triggerDateTime: getFormattedDateTime() }]);
    //         setTranscript('');
    //         const values = {
    //             ["question"]: voice
    //         }
    //         scrollToBottom();
    //         try {
    //             const res = await axios.post(`http://localhost:8080/http://192.168.0.27:5000/chat`, values);

    //             setMessages([...messages, { text: voice, sender: 'User', finalText: res.reply, responseDateTimeDate: getFormattedDateTime(), triggerDateTime: getFormattedDateTime() }]);
    //             scrollToBottom();
    //         }
    //         catch (e) {
    //             setMessages([...messages, { text: voice, sender: 'User', finalText: e, responseDateTimeDate: getFormattedDateTime(), triggerDateTime: getFormattedDateTime() }]);
    //             scrollToBottom();
    //         }


    //     }
    // };

    const getFormattedDateTime = () => {
        const date = new Date();

        // Get day of the month
        const day = date.getDate();

        // Get month abbreviation
        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();

        // Get hours and minutes
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');

        // Format as 12-hour time
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format, handle midnight

        // Combine into desired format
        //return `${day} ${month} AT ${hours}:${minutes} ${ampm}`;
        return `${hours}:${minutes} ${ampm}`;
    };

    const handleSendMessage = async (e) => {debugger;
        e.preventDefault();
        setDisabledSend(true);
        // var plsWait = <p className='pls-wait-loader m-0' style={{ animation: "blink 1s infinite" }}>Please wait...</p>
        var plsWait = (
            <div className="d-flex align-items-center">
                <Spinner size="sm" className="me-2 visible" animation="border" role="status" />
                <span>Loading...</span>
            </div>
        );

        if (inputText.trim() !== '') {
            setMessages([...messages, { text: inputText, sender: 'User', finalText: plsWait, triggerDateTime: getFormattedDateTime() }]);
            setInputText('');
            const values = {
                ["question"]: inputText
            }
            scrollToBottom();

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Commented code for dynamic data>>>>>>>>>>>>>>>>>>>>>


            try {
                const res = await axios.post(`http://192.168.1.10:5000/chat`, values);
                console.log(res);
                setMessages([...messages, { text: inputText, sender: 'User', finalText: res, responseDateTimeDate: getFormattedDateTime(), triggerDateTime: getFormattedDateTime() }]);
                scrollToBottom();
                setDisabledSend(false);
            }
            catch (e) {
                setMessages([...messages, { text: inputText, sender: 'User', finalText: e, responseDateTimeDate: getFormattedDateTime(), triggerDateTime: getFormattedDateTime() }]);
                scrollToBottom();
                setDisabledSend(false);
            }


            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Static Data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

            // setMessages([...messages, { text: inputText, sender: 'User', finalText: "06-03-2024 10:15:28", currentDate : getFormattedDateTime()}]);
            // scrollToBottom();


        }
    };

    // State to track like and dislike status
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    // Function to handle like click
    const handleLikeClick = () => {
        setIsLiked((prevLiked) => !prevLiked); // Toggle like
        if (isDisliked) setIsDisliked(false);  // Unset dislike if it's set
        //alert("like is clicked");
    };

    // Function to handle dislike click
    const handleDislikeClick = () => {
        setIsDisliked((prevDisliked) => !prevDisliked); // Toggle dislike
        if (isLiked) setIsLiked(false);  // Unset like if it's set
        //alert("Dislike is clicked");
    };

    const handleRefresh = () => {
        // You can add your refresh logic here (e.g., clearing chat, resetting the state, etc.)
        console.log("Refreshing...");
        // Add your logic to reset or refresh the state if needed.
        setMessages([]);
        console.log("Chat refreshed.");
        // Optionally, reset scroll position to top
        if (ref.current) {
            ref.current.scrollTop = 0; // Reset the scroll position
        }

    };


    return (
        <React.Fragment>
            <div className="customizer-setting d-none d-md-block point" style={{ cursor: "pointer" }} title='CHAT WITH FIRLO AI CHATBOT'>
                <img style={{ marginTop: "-4px", borderRadius: "50%", boxShadow: "rgb(204, 219, 232) 0px 0px 5px 5px inset, rgba(255, 255, 255, 0.5) 3px 2px 8px 6px inset", border: "solid 1px #0ab39c" }} src={Ai_Icon} alt="" height="50" onClick={() => { openModalCamera() }}></img>

            </div>

            <Modal
                isOpen={cameraModal}
                role="dialog"
                autoFocus={true}
                bottom
                id="removeItemModal"
                size={isExpanded ? "lg" : "sm"}
                toggle={setViewModalCamera}
                style={{
                    position: "fixed",
                    right: isExpanded ? "20px" : "23px",
                    bottom: isExpanded ? "0" : "70px",
                    width: isExpanded ? "50%" : "auto",
                    height: isExpanded ? "95%" : "auto",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
                }}
            >
                <ModalHeader
                    className="bg-success p-2 fs-12 modal-header text-dark"
                    style={{
                        borderBottom: "1px solid #ddd",
                        borderRadius: "5px 5px 0 0"
                    }}
                >
                    <h5 className="fs-16 m-0" id="hd_color" style={{ float: "left" }}>
                        <img style={{ marginTop: "-4px" }} src={Ai_Icon} alt="" height="40" />
                        FIRLO AI
                    </h5>
                    <button
                        style={{ padding: "3px 13px", backgroundColor: "#0ab39c", color: "#fff", border: "none", cursor: "pointer", position:"absolute",right:"20px" }} onClick={handleRefresh} title="Refresh Chat" >
                        <i className="ri-refresh-line"></i>
                    </button>
                    <i
                        className={`${isExpanded ? "ri-subtract-line" : "ri-arrow-right-up-line"} fs-20 position-absolute top-0 end-0 m-2 text-white`}
                        style={{ cursor: "pointer" }}
                        onClick={toggleModalSize}
                    ></i>
                </ModalHeader>
                <div className="chatbot-container" style={{ backgroundColor: "#f9f9f9" }}>
                    <div className={`chatbot-messages ${isExpanded ? 'chatbot-messages-expanded' : ''} custom-scroll`}  ref={ref}>
                        {messages && messages.length === 0 ? (
                            <div style={{ alignSelf: "flex-start", textAlign: "start" }}>
                                <label style={{ fontSize: "0.75rem", color: "#333", margin: "0", lineHeight: "0" }}>
                                    <span style={{ display: "flex", alignItems: "center", whiteSpace: "break-spaces" }}>
                                        <img style={{ marginRight: "5px" }} src={Ai_Chat} alt="" height="20" /> FIRLO BOT
                                    </span>
                                </label>
                                <div className="ai-message shadow" style={{ textAlign: "start", backgroundColor: "#09b59d", width: "max-content", color: "white", marginBottom: "8px" }}>
                                    {"Welcome!"}
                                </div>
                                <div className="ai-message shadow" style={{ textAlign: "start", backgroundColor: "#09b59d", width: "max-content", color: "white" }}>
                                    {"How can I help you?"}
                                </div>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div key={index} className="message-wrapper" style={{ display: "flex", flexDirection: "column" }}>
                                    {/* User's Message */}
                                    <div style={{ alignSelf: "flex-end", textAlign: "end", marginBottom: "5px" }}>
                                        <label style={{ fontSize: "0.75rem", marginTop: "15px", marginLeft: "5px" }}>
                                            <span>{userName} <img className="shadow" style={{ marginTop: "-9px", borderRadius: "50%", marginLeft: "5px" }} src={user_img} alt="" height="25" /></span>
                                        </label>
                                        <div className="user-message shadow">
                                            {message.text}
                                            <p className="m-0" style={{ fontSize: "10px", opacity: "0.6" }}>{message.triggerDateTime}</p>
                                        </div>
                                    </div>

                                    {/* System's Message */}
                                    <div style={{ alignSelf: "flex-start" }}>
                                        <label style={{ fontSize: "0.75rem" }}>
                                            <span><img style={{ marginTop: "-8px", marginRight: "5px" }} src={Ai_Chat} alt="" height="20" /> FIRLO BOT</span>
                                        </label>
                                        <div className="ai-message shadow" style={{ textAlign: "start", backgroundColor: "rgb(238 245 245)" }}>
                                            {message.finalText}
                                            <p className="text-muted m-0" style={{ left: "33px", fontSize: "10px", opacity: "0.6", textAlign: "end", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                                {message.responseDateTimeDate && (
                                                    <span style={{ display: "flex", alignItems: "center" }}>
                                                        <i
                                                            className={isLiked ? "ri-thumb-up-fill iconI" : "ri-thumb-up-line iconI"}
                                                            style={{ margin: "0 2px 0 0", fontSize: "15px", color: "darkblue", cursor: "pointer" }}
                                                            onClick={handleLikeClick}
                                                        ></i>
                                                        <i
                                                            className={isDisliked ? "ri-thumb-down-fill iconI" : "ri-thumb-down-line iconI"}
                                                            style={{ margin: "0 8px", fontSize: "15px", color: "brown", cursor: "pointer" }}
                                                            onClick={handleDislikeClick}
                                                        ></i>
                                                    </span>
                                                )}
                                                <span>{message.responseDateTimeDate}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {/* Dummy div to mark the end of messages */}
                        <div ref={messagesEndRef} style={{ marginBottom: "180px" }}></div>
                    </div>

                    <div className="chatbot-input" style={{ marginTop: "5px", padding: "0 5px", marginBottom: "5px" }}>
                        <Form className="tablelist-form" onSubmit={handleSendMessage} style={{ display: "flex", alignItems: "center", position: "relative" }}>
                            <textarea placeholder="Ask here..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                style={{ width: isExpanded ? "-webkit-fill-available" : "16rem", padding: "8px 27px 0 15px", borderRadius: "6px", border: "1px solid #ddd", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", outline: "none", height: "40px", minHeight: "40px", maxHeight: "100px" }}
                                className="custom-scrolltext"></textarea>
                            <Link to="#" className="btn btn-link link-success btn-md position-absolute" onClick={(event) => { toggleOffCanvas(); startListening(event) }} style={{ right: "53px", fontSize: "18px", width: "15px", height: "15px" }}>
                                <i className="ri-mic-fill" style={{ position: "absolute", marginTop: "-13px", marginLeft: "-8px", fontSize: "18px" }}></i>
                            </Link>
                            <button type="submit" className="btn btn-success" style={{ borderRadius: "50%", padding: "10px 15px", marginLeft: "5px" }} disabled={disabledSend ? true : false}>
                                <i className="ri-send-plane-2-fill" style={{ lineHeight: "normal", margin: "0 0 0 -2px" }} ></i>
                            </button>
                        </Form>
                    </div>
                </div>
            </Modal>

            <Offcanvas isOpen={isOpen} direction="top" toggle={toggleOffCanvas} tabIndex="-1" style={{ maxHeight: "40%", backgroundColor: "#f9f9f9", color: "#000", padding: "20px", borderRadius: "12px", boxShadow: "rgb(204, 219, 232) 0px 0px 6px 3px inset, rgba(255, 255, 255, 0.5) 0px 6px 6px 1px inset" }}>
                <OffcanvasBody>
                    <button type="button" onClick={() => setIsOpen(false)} className="btn-close text-reset float-end fs-10" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                        <div className="search-voice" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="ri-mic-fill align-middle" style={{ fontSize: "2rem" }}></i>
                            <span className="voice-wave" style={{ backgroundColor: "#09b59d" }}></span>
                            <span className="voice-wave" style={{ backgroundColor: "#09b59d" }}></span>
                            <span className="voice-wave" style={{ backgroundColor: "#09b59d" }}></span>
                        </div>
                        <h4>{transcript ? transcript : "Talk to me, what can I do for you?"}</h4>
                    </div>
                </OffcanvasBody>
            </Offcanvas>
        </React.Fragment>
    );

};

export default AiChat;