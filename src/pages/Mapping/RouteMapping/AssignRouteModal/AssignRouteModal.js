// // AssignRouteModal.js
// import React, { useState, useEffect, useMemo } from "react";
// import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
// import TableContainer from "../../../../Components/Common/TableContainer";
// import Loader from "../../../../Components/Common/Loader";

// // Updated Assign Route Modal Component with Search Functionality
// const AssignRouteModal = ({ 
//   isOpen, 
//   toggle, 
//   currentTransporterCode, 
//   routes, 
//   selectedRoutes, 
//   setSelectedRoutes,
//   handleAssignRoutes,
//   isLoading
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredRoutes, setFilteredRoutes] = useState(routes);

//   // Filter routes when search term changes or routes update
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredRoutes(routes);
//     } else {
//       const filtered = routes.filter(route => 
//         route.routeCode.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredRoutes(filtered);
//     }
//   }, [searchTerm, routes]);

//   // Handle route checkbox selection
//   const handleRouteCheckboxChange = (id) => {
//     setSelectedRoutes(prevSelected =>
//       prevSelected.includes(id)
//         ? prevSelected.filter(routeId => routeId !== id)
//         : [...prevSelected, id]
//     );
//   };

//   // Handle select all routes
//   const handleRouteSelectAll = () => {
//     setSelectedRoutes(
//       selectedRoutes.length === filteredRoutes.length
//         ? []
//         : filteredRoutes.map(route => route.id)
//     );
//   };

//   // Columns for route assignment modal - updated to match API response
//   const routeColumns = useMemo(
//     () => [
//       {
//         Header: () => (
//           <Input
//             type="checkbox"
//             checked={selectedRoutes.length > 0 && selectedRoutes.length === filteredRoutes.length}
//             onChange={handleRouteSelectAll}
//           />
//         ),
//         accessor: "checkbox",
//         disableHiding: true,
//         Cell: ({ row }) => (
//           <Input
//             type="checkbox"
//             checked={selectedRoutes.includes(row.original.id)}
//             onChange={() => handleRouteCheckboxChange(row.original.id)}
//           />
//         ),
//         disableSortBy: true,
//       },
//       { 
//         Header: "Route Code", 
//         accessor: "routeCode",
//         Cell: ({ value }) => value || "-" 
//       },
//       { 
//         Header: "Departure Location", 
//         accessor: "departureLocation",
//         Cell: ({ value }) => value || "-" // Show dash for empty value
//       },
//       { 
//         Header: "Destination Location", 
//         accessor: "destinationLocation",
//         Cell: ({ value }) => value || "-" // Show dash for empty value
//       },
//       { 
//         Header: "Route Type", 
//         accessor: "routeType",
//         Cell: ({ value }) => value || "-" 
//       },
//       { 
//         Header: "Distance", 
//         accessor: "distance",
//         Cell: ({ value }) => value || "-" 
//       },
//     ],
//     [selectedRoutes, filteredRoutes]
//   );

//   return (
//     <Modal
//       isOpen={isOpen}
//       toggle={toggle}
//       size="lg"
//       className="custom-modal"
//       style={{ 
//         maxWidth: '800px', 
//         width: '100%',
//         borderRadius: "30px" 
//       }}
  
//     >
//       <ModalHeader
//         toggle={toggle}
//         style={{
//           backgroundColor: '#fff',
//           borderBottom: '1px solid #e9ecef',
//           padding: '15px 20px',
//           color: '#495057',
//           position: 'relative'
//         }}
//         close={
//           <button 
//             className="close" 
//             onClick={toggle} 
//             style={{ 
//               position: 'absolute',
//               top: '10px',
//               right: '10px',
//               background: 'none',
//               border: 'none',
//               fontSize: '24px',
//               color: '#000',
//               opacity: 1
//             }}
//           >
//             ×
//           </button>
//         }
//       >
//         Assign Route {currentTransporterCode ? `- ${currentTransporterCode}` : ''}
//       </ModalHeader>
//       <ModalBody style={{ 
//         backgroundColor: '#fff', 
//         paddingBottom: 0,
//         paddingTop: '10px'
//       }}>
//         {/* Search Bar */}
//         <div className="d-flex justify-content-end mb-3">
//           <div style={{ width: '250px' }}>
//             <Input
//               type="search"
//               placeholder="Search by Route Code"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 borderRadius: '4px',
//                 boxShadow: 'none',
//                 border: '1px solid #ced4da'
//               }}
//             />
//           </div>
//         </div>

//         <div style={{
//           borderRadius: '4px',
//           overflow: 'hidden'
//         }}>
//           {isLoading ? (
//             <div className="text-center my-4">
//               <Loader />
//             </div>
//           ) : filteredRoutes.length > 0 ? (
//             <TableContainer
//               columns={routeColumns}
//               data={filteredRoutes}
//               customPageSize={5}
//               pagination={true}
//               className="route-table"
//               style={{
//                 width: '100%',
//                 borderCollapse: 'collapse'
//               }}
//             />
//           ) : (
//             <div className="text-center py-4">
//               <p>No routes found. Please try a different search term.</p>
//             </div>
//           )}
//         </div>
//       </ModalBody>
//       <ModalFooter
//         style={{
//           display: 'flex',
//           justifyContent: 'flex-end',
//           backgroundColor: '#fff',
//           borderTop: 'none',
//           marginTop: 0,
//           paddingTop: 0
//         }}
//       >
//         <Button
//           color="primary"
//           onClick={handleAssignRoutes}
//           disabled={selectedRoutes.length === 0 || isLoading}
//           style={{
//             backgroundColor: '#405189',
//             border: 'none',
//             borderRadius: '4px'
//           }}
//         >
//           Assign
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default AssignRouteModal;
// AssignRouteModal.js
import React, { useState, useEffect, useMemo } from "react";
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import TableContainer from "../../../../Components/Common/TableContainer";
import Loader from "../../../../Components/Common/Loader";

// Updated Assign Route Modal Component with Search Functionality
const AssignRouteModal = ({ 
  isOpen, 
  toggle, 
  currentTransporterCode, 
  routes, 
  selectedRoutes, 
  setSelectedRoutes,
  assignedRoutes = [], // NEW PROP - already assigned route IDs
  handleAssignRoutes,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState(routes);

  // Filter routes when search term changes or routes update
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRoutes(routes);
    } else {
      const filtered = routes.filter(route => 
        route.routeCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoutes(filtered);
    }
  }, [searchTerm, routes]);

  // Handle route checkbox selection
  const handleRouteCheckboxChange = (id) => {
    setSelectedRoutes(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(routeId => routeId !== id)
        : [...prevSelected, id]
    );
  };

  // Handle select all routes
  const handleRouteSelectAll = () => {
    setSelectedRoutes(
      selectedRoutes.length === filteredRoutes.length
        ? []
        : filteredRoutes.map(route => route.id)
    );
  };

  // Check if a route is already assigned
  const isRouteAssigned = (routeId) => {
    return assignedRoutes.includes(routeId);
  };
  const routeColumns = useMemo(
    () => [
      {
        Header: () => (
          <Input
            type="checkbox"
            checked={selectedRoutes.length > 0 && selectedRoutes.length === filteredRoutes.length}
            onChange={handleRouteSelectAll}
          />
        ),
        accessor: "checkbox",
        disableHiding: true,
        Cell: ({ row }) => (
          <Input
            type="checkbox"
            checked={selectedRoutes.includes(row.original.id)}
            onChange={() => handleRouteCheckboxChange(row.original.id)}
          />
        ),
        disableSortBy: true,
      },
      { 
        Header: "Route Code", 
        accessor: "routeCode",
        Cell: ({ value, row }) => {
          const isAssigned = isRouteAssigned(row.original.id);
          return (
            <span>
              {value || "-"}
              {isAssigned}
            </span>
          );
        }
      },
      { 
        Header: "Departure Location", 
        accessor: "departureLocation",
        Cell: ({ value }) => value || "-"
      },
      { 
        Header: "Destination Location", 
        accessor: "destinationLocation",
        Cell: ({ value }) => value || "-"
      },
      { 
        Header: "Route Type", 
        accessor: "routeType",
        Cell: ({ value }) => value || "-" 
      },
      { 
        Header: "Distance", 
        accessor: "distance",
        Cell: ({ value }) => value || "-" 
      },
    ],
    [selectedRoutes, filteredRoutes, assignedRoutes]
  );

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
      className="custom-modal"
      style={{ 
        maxWidth: '800px', 
        width: '100%',
        borderRadius: "30px" 
      }}
  
    >
      <ModalHeader
        toggle={toggle}
        style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e9ecef',
          padding: '15px 20px',
          color: '#495057',
          position: 'relative'
        }}
        close={
          <button 
            className="close" 
            onClick={toggle} 
            style={{ 
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#000',
              opacity: 1
            }}
          >
            ×
          </button>
        }
      >
        Assign Route {currentTransporterCode ? `- ${currentTransporterCode}` : ''}
      </ModalHeader>
      <ModalBody style={{ 
        backgroundColor: '#fff', 
        paddingBottom: 0,
        paddingTop: '10px'
      }}>
        {/* Search Bar */}
        <div className="d-flex justify-content-end mb-3">
          <div style={{ width: '250px' }}>
            <Input
              type="search"
              placeholder="Search by Route Code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '4px',
                boxShadow: 'none',
                border: '1px solid #ced4da'
              }}
            />
          </div>
        </div>

        <div style={{
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          {isLoading ? (
            <div className="text-center my-4">
              <Loader />
            </div>
          ) : filteredRoutes.length > 0 ? (
            <TableContainer
              columns={routeColumns}
              data={filteredRoutes}
              customPageSize={5}
              pagination={true}
              className="route-table"
              style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}
            />
          ) : (
            <div className="text-center py-4">
              <p>No routes found. Please try a different search term.</p>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: '#fff',
          borderTop: 'none',
          marginTop: 0,
          paddingTop: 0
        }}
      >
        <Button
          color="primary"
          onClick={handleAssignRoutes}
          disabled={selectedRoutes.length === 0 || isLoading}
          style={{
            backgroundColor: '#405189',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Assign
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AssignRouteModal;
