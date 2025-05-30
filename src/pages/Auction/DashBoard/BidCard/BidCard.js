
// BidCard.js
// import React, { useState, useEffect } from "react";
// import { Card, CardBody, Col, Row } from "reactstrap";
// import './BidCard.css';

// const BidCard = () => {
//   const [minimalBids, setMinimalBids] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   // Update current time every second for live timer
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000); // Update every second

//     return () => {
//       clearInterval(timer);
//     };
//   }, []);

//   // Fetch minimal bids data from API
//   useEffect(() => {
//     const fetchMinimalBids = async () => {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/getMinimalBids`, {
//           method: 'GET',
//           headers: {
//             'accept': 'application/json',
//             'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw=='
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         if (data && data.data) {
//           // Take the first 6 entries without filtering
//           const bidsToShow = data.data.slice(0, 6);
//           setMinimalBids(bidsToShow);
//         }
//         setIsLoading(false);
//       } catch (err) {
//         console.error("Error fetching minimal bids:", err);
//         setError("Failed to load bids. Please try again later.");
//         setIsLoading(false);
//       }
//     };

//     fetchMinimalBids();
//   }, []);

//   // Calculate time difference between bidFrom and bidTo (keeping original for reference)
//   const calculateTimeDifference = (bidFrom, bidTo) => {
//     if (!bidFrom || !bidTo) return "00:00";
    
//     const startTime = new Date(bidFrom);
//     const endTime = new Date(bidTo);
    
//     // Calculate the difference in milliseconds
//     const diffMs = endTime - startTime;
    
//     // If invalid dates or end date is before start date
//     if (isNaN(diffMs) || diffMs <= 0) {
//       return "00:00";
//     }
    
//     const diffDays = Math.floor(diffMs / 86400000); // days
//     const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
//     const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
    
//     // Format based on the time difference
//     if (diffDays > 0) {
//       return `${diffDays}d :${diffHrs}h`;
//     } else {
//       return `${String(diffHrs).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}`;
//     }
//   };

//   // Calculate time remaining from current time to bid end time (for live timer)
//   const calculateTimeRemaining = (bidTo) => {
//     if (!bidTo) return "00:00";
    
//     const endTime = new Date(bidTo);
    
//     // Calculate the difference in milliseconds
//     const diffMs = endTime - currentTime;
    
//     // If the bid has ended
//     if (isNaN(diffMs) || diffMs <= 0) {
//       return "Expired";
//     }
    
//     const diffDays = Math.floor(diffMs / 86400000); // days
//     const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
//     const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
//     const diffSecs = Math.floor((((diffMs % 86400000) % 3600000) % 60000) / 1000); // seconds
    
//     // Format based on the time difference
//     if (diffDays > 0) {
//       return `${diffDays}d :${diffHrs}h`;
//     } else if (diffHrs > 0) {
//       return `${String(diffHrs).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}`;
//     } else {
//       // Show minutes and seconds when less than an hour
//       return `${String(diffMins).padStart(2, '0')}:${String(diffSecs).padStart(2, '0')}`;
//     }
//   };

//   // Render individual bid card
//   const renderBidCard = (bid, index) => {
//     // Use "-----" if no bid number is available or it's empty
//     const displayBidNo = bid.biddingOrderNo && bid.biddingOrderNo.trim() !== "" 
//       ? bid.biddingOrderNo 
//       : "-----";
    
//     // Calculate the time remaining (use live timer)
//     const timeValue = calculateTimeRemaining(bid.bidTo);
    
//     return (
//       <Col key={index} md={2} sm={4} xs={6} className="mb-3">
//         <Card className="bidding-card">
//           <div className="bidding-number">
//             Bid No. : {displayBidNo}
//           </div>
//           <CardBody className="bidding-card-body">
//             <div className="bidding-time-circle">
//               <div className="bidding-time-label">Time</div>
//               <div className="bidding-time-label">Remaining</div>
//               <div className="bidding-time-value">{timeValue}</div>
//             </div>
//           </CardBody>
//         </Card>
//       </Col>
//     );
//   };

//   if (isLoading) {
//     return (
//       <Row className="bidding-cards-container">
//         <Col xs={12} className="text-center">
//           <div className="p-3">Loading bid cards...</div>
//         </Col>
//       </Row>
//     );
//   }

//   if (error) {
//     return (
//       <Row className="bidding-cards-container">
//         <Col xs={12} className="text-center">
//           <div className="p-3 text-danger">{error}</div>
//         </Col>
//       </Row>
//     );
//   }

//   // If no data from API, show a message or empty state
//   if (!minimalBids || minimalBids.length === 0) {
//     return (
//       <Row className="bidding-cards-container">
//         <Col xs={12} className="text-center">
//           <div className="p-3">No bids available at this time.</div>
//         </Col>
//       </Row>
//     );
//   }

//   return (
//     <Row className="bidding-cards-container">
//       {minimalBids.map((bid, index) => renderBidCard(bid, index))}
//     </Row>
//   );
// }

// export default BidCard;



// BidCard.js   
// Is code me wahi bids dikhai jaa rahi hai jo 30 minutes se kam hai 
import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import './BidCard.css';

const BidCard = () => {
  const [minimalBids, setMinimalBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for live timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Fetch minimal bids data from API
  useEffect(() => {
    const fetchMinimalBids = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/getMinimalBids`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw=='
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.data) {
          // Filter bids to show only those with less than 30 minutes remaining
          const bidsToShow = data.data.filter(bid => {
            if (!bid.bidTo) return false;
            
            const endTime = new Date(bid.bidTo);
            const currentTime = new Date();
            const diffMs = endTime - currentTime;
            
            // Only show bids with less than 30 minutes (1800000 milliseconds) remaining
            return diffMs > 0 && diffMs <= 1800000;
          }).slice(0, 6); // Take up to 6 filtered bids
          
          setMinimalBids(bidsToShow);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching minimal bids:", err);
        setError("Failed to load bids. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchMinimalBids();
  }, []);

  // Calculate time remaining in minutes:seconds format
  const calculateTimeRemaining = (bidTo) => {
    if (!bidTo) return { time: "00:00", isExpired: true };
    
    const endTime = new Date(bidTo);
    
    // Calculate the difference in milliseconds
    const diffMs = endTime - currentTime;
    
    // If the bid has ended
    if (isNaN(diffMs) || diffMs <= 0) {
      return { time: "00:00", isExpired: true };
    }
    
    // Convert everything to total seconds
    const totalSeconds = Math.floor(diffMs / 1000);
    
    // Convert total seconds to minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    // Format as mm:ss
    return {
      time: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      isExpired: false
    };
  };

  // Render individual bid card
  const renderBidCard = (bid, index) => {
    // Use "-----" if no bid number is available or it's empty
    const displayBidNo = bid.biddingOrderNo && bid.biddingOrderNo.trim() !== "" 
      ? bid.biddingOrderNo 
      : "-----";
    
    // Calculate the time remaining (use live timer)
    const { time: timeValue, isExpired } = calculateTimeRemaining(bid.bidTo);
    
    return (
      <Col key={index} md={2} sm={4} xs={6} className="mb-2 px-1">
        <Card className="bidding-card">
          <div className="bidding-number">
            Bid No. : {displayBidNo}
          </div>
          <CardBody className="bidding-card-body">
            <div className="bidding-time-circle">
              {isExpired ? (
                <div className="bidding-expired-message">Time Remaining</div>
              ) : (
                <>
                  <div className="bidding-time-label">Time</div>
                  <div className="bidding-time-label">Remaining</div>
                  <div className="bidding-time-value">{timeValue}</div>
                </>
              )}
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  };

  if (isLoading) {
    return (
      <Row className="bidding-cards-container">
        <Col xs={12} className="text-center">
          <div className="p-3">Loading bid cards...</div>
        </Col>
      </Row>
    );
  }

  if (error) {
    return (
      <Row className="bidding-cards-container">
        <Col xs={12} className="text-center">
          <div className="p-3 text-danger">{error}</div>
        </Col>
      </Row>
    );
  }

  // If no data from API, show a message or empty state
  if (!minimalBids || minimalBids.length === 0) {
    return (
      <Row className="bidding-cards-container">
        <Col xs={12} className="text-center">
          <div className="p-3">No bids closing within 30 minutes.</div>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="bidding-cards-container">
      {minimalBids.map((bid, index) => renderBidCard(bid, index))}
    </Row>
  );
}

export default BidCard;




// BidCard.js
//is code me se saari bids show hongi 
// import React, { useState, useEffect } from "react";
// import { Card, CardBody, Col, Row } from "reactstrap";
// import './BidCard.css';

// const BidCard = () => {
//   const [minimalBids, setMinimalBids] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   // Update current time every second for live timer
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000); // Update every second

//     return () => {
//       clearInterval(timer);
//     };
//   }, []);

//   // Fetch minimal bids data from API
//   useEffect(() => {
//     const fetchMinimalBids = async () => {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/getMinimalBids`, {
//           method: 'GET',
//           headers: {
//             'accept': 'application/json',
//             'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw=='
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         if (data && data.data) {
//           // Show all bids from API without any slice
//           setMinimalBids(data.data);
//         }
//         setIsLoading(false);
//       } catch (err) {
//         console.error("Error fetching minimal bids:", err);
//         setError("Failed to load bids. Please try again later.");
//         setIsLoading(false);
//       }
//     };

//     fetchMinimalBids();
//   }, []);

//   // Calculate time remaining in minutes:seconds format
//   const calculateTimeRemaining = (bidTo) => {
//     if (!bidTo) return { time: "00:00", isExpired: true };
    
//     const endTime = new Date(bidTo);
    
//     // Calculate the difference in milliseconds
//     const diffMs = endTime - currentTime;
    
//     // If the bid has ended
//     if (isNaN(diffMs) || diffMs <= 0) {
//       return { time: "00:00", isExpired: true };
//     }
    
//     // Convert everything to total seconds
//     const totalSeconds = Math.floor(diffMs / 1000);
    
//     // Convert total seconds to minutes and remaining seconds
//     const minutes = Math.floor(totalSeconds / 60);
//     const seconds = totalSeconds % 60;
    
//     // Format as mm:ss
//     return {
//       time: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
//       isExpired: false
//     };
//   };

//   // Render individual bid card
//   const renderBidCard = (bid, index) => {
//     // Use "-----" if no bid number is available or it's empty
//     const displayBidNo = bid.biddingOrderNo && bid.biddingOrderNo.trim() !== "" 
//       ? bid.biddingOrderNo 
//       : "-----";
    
//     // Calculate the time remaining (use live timer)
//     const { time: timeValue, isExpired } = calculateTimeRemaining(bid.bidTo);
    
//     return (
//       <Col key={index} md={2} sm={4} xs={6} className="mb-2 px-1">
//         <Card className="bidding-card">
//           <div className="bidding-number">
//             Bid No. : {displayBidNo}
//           </div>
//           <CardBody className="bidding-card-body">
//             <div className="bidding-time-circle">
//               {isExpired ? (
//                 <div className="bidding-expired-message">Bid Expired</div>
//               ) : (
//                 <>
//                   <div className="bidding-time-label">Time</div>
//                   <div className="bidding-time-label">Remaining</div>
//                   <div className="bidding-time-value">{timeValue}</div>
//                 </>
//               )}
//             </div>
//           </CardBody>
//         </Card>
//       </Col>
//     );
//   };

//   if (isLoading) {
//     return (
//       <Row className="bidding-cards-container">
//         <Col xs={12} className="text-center">
//           <div className="p-3">Loading bid cards...</div>
//         </Col>
//       </Row>
//     );
//   }

//   if (error) {
//     return (
//       <Row className="bidding-cards-container">
//         <Col xs={12} className="text-center">
//           <div className="p-3 text-danger">{error}</div>
//         </Col>
//       </Row>
//     );
//   }

//   // If no data from API, show a message or empty state
//   if (!minimalBids || minimalBids.length === 0) {
//     return (
//       <Row className="bidding-cards-container">
//         <Col xs={12} className="text-center">
//           <div className="p-3">No bids available at this time.</div>
//         </Col>
//       </Row>
//     );
//   }

//   return (
//     <Row className="bidding-cards-container">
//       {minimalBids.map((bid, index) => renderBidCard(bid, index))}
//     </Row>
//   );
// }

// export default BidCard;
