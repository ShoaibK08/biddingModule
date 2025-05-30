import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./BidCard.css";
import winnerlogo from '../../../../../assets/images/winner.png';
 
const BidCard = ({ bid, handleViewClick, handleHistoryClick, handleSoDetailsClick }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    
    // Function to determine status class
    const getStatusClass = (status) => {
        switch (status) {
            case "Completed":
                return "completed";
            case "Running":
                return "running";
            case "To Be Started":
                return "to-be-started";
            default:
                return "";
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);

        // Formatter for date part
        const dateFormatter = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        // Formatter for time part
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const formattedDate = dateFormatter.format(date);
        const formattedTime = timeFormatter.format(date);

        return `${formattedDate} ${formattedTime}`;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    
    const calculateTimeRemaining = (bidTo) => {
        const endTime = new Date(bidTo);
        const diffMs = endTime - currentTime;

        if (diffMs <= 0) {
            return { time: "00:00", isExpired: true };
        }

        const totalSeconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return {
            time: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
            isExpired: false
        };
    };

    return (
        <div className="bid-card mb-3">
            {/* Header with navy background, status pill, bid info and route info */}
            <div className="bid-header d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <div className={`status-pill ${getStatusClass(bid.status)}`}>{bid.status}</div>
                    <span className="bid-number1 ms-3">Bid No.: {bid.biddingOrderNo}</span>
                    <span className="bid-time ms-3">Bid Start Time: {formatDate(bid.bidFrom)}</span>
                </div>
                <div className="route-label">
                    Route No.: {bid.routeNo}
                </div>
            </div>
 
            {/* Content area */}
            <div className="bid-content">
                {/* Transporter section */}
                <div className="section transporter-section">
                    {bid.status === "Completed" ? (
                        <div className="d-flex flex-column align-items-center p-2">
                            <img
                                src={winnerlogo}
                                alt="Winner"
                                className="mb-1 winner-img"
                            />
                            <div className="text-primary fw-bold fs-5 mt-1 text-center">
                                {bid.transporterName}
                            </div>
                        </div>
                    ) : bid.status === "Running" ? (
                        <div className="text-center">
                            <div className="fw-bold">Rank 1</div>
                            <div>{bid.transporterCode}</div>
                        </div>
                    ) : (
                        <div className="text-center fst-italic">Not Started</div>
                    )}
                </div>
                
                {/* From/To Location section */}
                <div className="section location-section text-center">
                    <div className="info-item">
                        <div className="info-label info-label-bold">From Location</div>
                        <div className="info-value">{bid.fromLocation}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label info-label-bold">To Location</div>
                        <div className="info-value">{bid.toLocation}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label"><span className="info-label-bold">Distance</span> : {bid.distance}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label"><span className="info-label-bold">Time</span> : {bid.lastTimeExtension} Hours</div>
                    </div>
                </div>
 
                {/* Material section */}
                <div className="section material-section text-center">
                    <div className="info-item">
                        <div className="info-label info-label-bold">Material</div>
                        <div className="info-value">{bid.material}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label info-label-bold">Quantity</div>
                        <div className="info-value">{bid.quantity}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label"><span className="info-label-bold">Multiple Order</span> : {bid.multiMaterial == 1 ? "Yes" : "No"}</div>
                    </div>
                </div>
 
                {/* Price section */}
                <div className="section price-section text-center">
                    <div className="info-item">
                        <div className="info-label info-label-bold">Ceiling Price</div>
                        <div className="info-value">{bid.ceilingPrice}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label info-label-bold">Interval Price</div>
                        <div className="info-value">{bid.intervalAmount}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label" >Last Bid : {bid.lastBidAmount || bid.ceilingPrice}</div>
                    </div>
                </div>
 
                {/* City/Line section */}
                <div className="section city-section">
                    <div className="info-item">
                        <div className="info-label info-label-bold">City Name</div>
                        <div className="info-value">{bid.city}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label info-label-bold">Line No.</div>
                        <div className="info-value">{bid.lineNo}</div>
                    </div>
                </div>
 
                {/* Time Remaining section */}
                <div className="section time-section">
                    <div className="bidding-time-circle">
                        {(() => {
                            const { time, isExpired } = calculateTimeRemaining(bid.bidTo);
                            return isExpired ? (
                                <>
                                    <span className="time-label">Time</span>
                                    <span className="time-label">Remaining</span>
                                    <span className="time-value">00:00</span>
                                </>
                            ) : (
                                <>
                                    <span className="time-label">Time</span>
                                    <span className="time-label">Remaining</span>
                                    <span className="time-value">{time}</span>
                                </>
                            );
                        })()}
                    </div>
                </div>
 
                {/* Action Buttons */}
                <div className="section actions-section">
                    <Link
                        to="#"
                        className="view-detail-btn"
                        onClick={() => handleSoDetailsClick(bid.biddingOrderNo)}
                    >
                       VIEW DETAILS
                    </Link>
                    <Link
                        to="#"
                        className={`bid-history-btn ${(bid.status === 'Running' || bid.status === 'To Be Started') ? 'disabled' : ''}`}
                        onClick={() => handleHistoryClick(bid.biddingOrderNo)}
                        style={{
                            pointerEvents: (bid.status === 'Running' || bid.status === 'To Be Started') ? 'none' : 'auto',
                            opacity: (bid.status === 'Running' || bid.status === 'To Be Started') ? 0.6 : 1,
                            cursor: (bid.status === 'Running' || bid.status === 'To Be Started') ? 'not-allowed' : 'pointer',
                            backgroundColor: (bid.status === 'Running' || bid.status === 'To Be Started') ? '#cccccc' : '#4D5499',
                            color: (bid.status === 'Running' || bid.status === 'To Be Started') ? '#666666' : 'white'
                        }}
                    >
                        BID HISTORY
                    </Link>
                </div>
            </div>
        </div>
    );
};
 
export default BidCard;