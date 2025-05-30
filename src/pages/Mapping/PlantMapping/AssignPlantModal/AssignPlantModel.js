






// AssignPlantModal.js
// import React, { useState, useEffect, useMemo } from "react";
// import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
// import { toast } from "react-toastify";
// import TableContainer from "../../../../Components/Common/TableContainer";
// import Loader from "../../../../Components/Common/Loader";

// const AssignPlantModal = ({ 
//   isOpen, 
//   toggle, 
//   currentTransporterCode, 
//   plants, 
//   selectedPlants, 
//   setSelectedPlants,
//   handleAssignPlants,
//   isLoading,
//   getAuthHeaders
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredPlants, setFilteredPlants] = useState(plants);
//   const [assignedPlants, setAssignedPlants] = useState([]);
//   const [isCheckingAssigned, setIsCheckingAssigned] = useState(false);

//   // Fetch already assigned plants when modal opens
//   useEffect(() => {
//     if (isOpen && currentTransporterCode) {
//       fetchAssignedPlants();
//     } else {
//       // Reset assigned plants if not viewing a specific transporter
//       setAssignedPlants([]);
//     }
//   }, [isOpen, currentTransporterCode]);

//   // Fetch plants already assigned to this transporter
//   const fetchAssignedPlants = async () => {
//     if (!currentTransporterCode) return;
    
//     setIsCheckingAssigned(true);
//     try {
//       // Use auth headers from parent component
//       const headers = getAuthHeaders ? getAuthHeaders() : {
//         'Content-Type': 'application/json'
//       };

//       const response = await fetch(`http://localhost:8085/transporterPlantMap/byTransporter?transporterCode=${currentTransporterCode}`, {
//         method: 'GET',
//         headers: headers
//       });

//       if (response.ok) {
//         const result = await response.json();
//         if (result && result.data && Array.isArray(result.data)) {
//           // Extract plant codes from assigned plants
//           const plantCodes = result.data.map(item => item.plantCode);
//           setAssignedPlants(plantCodes);
          
//           // Show notification about already assigned plants
//           if (plantCodes.length > 0) {
//             toast.info(`This transporter already has ${plantCodes.length} plant(s) assigned. These plants are marked with 'Already Assigned' badge and cannot be selected again.`, {
//               position: "top-center",
//               autoClose: 5000,
//             });
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching assigned plants:", error);
//     } finally {
//       setIsCheckingAssigned(false);
//     }
//   };

//   // Filter plants when search term changes
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredPlants(plants);
//     } else {
//       const filtered = plants.filter(plant => 
//         plant.plantCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         plant.plantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (plant.companyCode && plant.companyCode.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredPlants(filtered);
//     }
//   }, [searchTerm, plants]);

//   // Reset filtered plants when plants prop changes
//   useEffect(() => {
//     setFilteredPlants(plants);
//   }, [plants]);

//   // Handle plant checkbox selection
//   const handlePlantCheckboxChange = (id) => {
//     const plant = plants.find(p => p.id === id);
//     if (!plant) return; // Safety check
    
//     // Check if this plant is already assigned to this transporter
//     if (currentTransporterCode && assignedPlants.includes(plant.plantCode)) {
//       toast.error(`Cannot assign: Plant ${plant.plantCode} is already assigned to this transporter.`, {
//         position: "top-center",
//         autoClose: 4000,
//       });
//       return; // Don't allow selection of already assigned plants
//     }
    
//     // Toggle selection
//     setSelectedPlants(prevSelected =>
//       prevSelected.includes(id)
//         ? prevSelected.filter(plantId => plantId !== id)
//         : [...prevSelected, id]
//     );
//   };

//   // Handle select all plants
//   const handlePlantSelectAll = () => {
//     // If selecting all, filter out already assigned plants
//     if (selectedPlants.length !== filteredPlants.length) {
//       const newSelection = filteredPlants
//         .filter(plant => !assignedPlants.includes(plant.plantCode) || !currentTransporterCode)
//         .map(plant => plant.id);
      
//       setSelectedPlants(newSelection);
      
//       // Show notification if some plants were filtered out
//       const totalFiltered = filteredPlants.length - newSelection.length;
//       if (totalFiltered > 0) {
//         toast.info(`${totalFiltered} plants were not selected because they are already assigned to this transporter.`, {
//           position: "top-right",
//           autoClose: 5000,
//         });
//       }
//     } else {
//       // Deselect all
//       setSelectedPlants([]);
//     }
//   };

//   // Check if a plant is already assigned to the current transporter
//   const isPlantAssigned = (plantCode) => {
//     return currentTransporterCode && assignedPlants.includes(plantCode);
//   };

//   // Columns for plant assignment modal
//   const plantColumns = useMemo(
//     () => [
//       {
//         Header: () => (
//           <Input
//             type="checkbox"
//             checked={filteredPlants.length > 0 && selectedPlants.length === filteredPlants.length}
//             onChange={handlePlantSelectAll}
//           />
//         ),
//         accessor: "checkbox",
//         Cell: ({ row }) => (
//           <Input
//             type="checkbox"
//             checked={selectedPlants.includes(row.original.id)}
//             onChange={() => handlePlantCheckboxChange(row.original.id)}
//             disabled={isPlantAssigned(row.original.plantCode)}
//             style={{
//               cursor: isPlantAssigned(row.original.plantCode) ? 'not-allowed' : 'pointer',
//               opacity: isPlantAssigned(row.original.plantCode) ? 0.6 : 1
//             }}
//           />
//         ),
//         disableSortBy: true,
//       },
//       { Header: "Company Code", accessor: "companyCode" },
//       { 
//         Header: "Plant Code", 
//         accessor: "plantCode",
//         Cell: ({ value }) => (
//           <div>
//             {value}
//             {isPlantAssigned(value) && 
//               <span 
//                 className="badge bg-danger ms-1"
//                 title="Already assigned to this transporter"
//                 style={{ fontSize: '11px', padding: '4px 8px' }}
//               >
//                 Already Assigned
//               </span>
//             }
//           </div>
//         )
//       },
//       { Header: "Plant Name", accessor: "plantName" },
//       { Header: "Address", accessor: "address" },
//       { Header: "Contact Person", accessor: "contactPerson" },
//       { Header: "Contact Number", accessor: "contactNumber" },
//     ],
//     [selectedPlants, filteredPlants, assignedPlants, currentTransporterCode]
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
//         Assign Plant {currentTransporterCode ? `- ${currentTransporterCode}` : ''}
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
//               placeholder="Search"
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
//           {isLoading || isCheckingAssigned ? (
//             <div className="text-center my-4">
//               <Loader />
//             </div>
//           ) : (
//             <TableContainer
//               columns={plantColumns}
//               data={filteredPlants}
//               customPageSize={5}
//               pagination={true}
//               className="plant-table"
//               style={{
//                 width: '100%',
//                 borderCollapse: 'collapse'
//               }}
//             />
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
//           onClick={handleAssignPlants}
//           disabled={selectedPlants.length === 0 || isLoading || isCheckingAssigned}
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

// export default AssignPlantModal;





// AssignPlantModal.js
// import React, { useState, useEffect, useMemo } from "react";
// import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
// import { toast } from "react-toastify";
// import TableContainer from "../../../../Components/Common/TableContainer";
// import Loader from "../../../../Components/Common/Loader";

// const AssignPlantModal = ({ 
//   isOpen, 
//   toggle, 
//   currentTransporterCode, 
//   plants, 
//   selectedPlants, 
//   setSelectedPlants,
//   handleAssignPlants,
//   isLoading,
//   getAuthHeaders
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredPlants, setFilteredPlants] = useState(plants);
//   const [assignedPlants, setAssignedPlants] = useState([]);
//   const [isCheckingAssigned, setIsCheckingAssigned] = useState(false);

//   // Fetch already assigned plants when modal opens
//   useEffect(() => {
//     if (isOpen && currentTransporterCode) {
//       fetchAssignedPlants();
//     } else {
//       // Reset assigned plants if not viewing a specific transporter
//       setAssignedPlants([]);
//     }
//   }, [isOpen, currentTransporterCode]);

//   // Fetch plants already assigned to this transporter
//   const fetchAssignedPlants = async () => {
//     if (!currentTransporterCode) return;
    
//     setIsCheckingAssigned(true);
//     try {
//       // Use auth headers from parent component
//       const headers = getAuthHeaders ? getAuthHeaders() : {
//         'Content-Type': 'application/json'
//       };

//       const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterPlantMap/byTransporter?transporterCode=${currentTransporterCode}`, {
//         method: 'GET',
//         headers: headers
//       });

//       if (response.ok) {
//         const result = await response.json();
//         if (result && result.data && Array.isArray(result.data)) {
//           // Extract plant codes from assigned plants
//           const plantCodes = result.data.map(item => item.plantCode);
//           setAssignedPlants(plantCodes);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching assigned plants:", error);
//     } finally {
//       setIsCheckingAssigned(false);
//     }
//   };

//   // Filter plants when search term changes
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredPlants(plants);
//     } else {
//       const filtered = plants.filter(plant => 
//         plant.plantCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         plant.plantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (plant.companyCode && plant.companyCode.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredPlants(filtered);
//     }
//   }, [searchTerm, plants]);

//   // Reset filtered plants when plants prop changes
//   useEffect(() => {
//     setFilteredPlants(plants);
//   }, [plants]);

//   // Handle plant checkbox selection
//   const handlePlantCheckboxChange = (id) => {
//     const plant = plants.find(p => p.id === id);
//     if (!plant) return; // Safety check
    
//     // Check if this plant is already assigned to this transporter
//     if (currentTransporterCode && assignedPlants.includes(plant.plantCode)) {
//       return; // Don't allow selection of already assigned plants
//     }
    
//     // Toggle selection
//     setSelectedPlants(prevSelected =>
//       prevSelected.includes(id)
//         ? prevSelected.filter(plantId => plantId !== id)
//         : [...prevSelected, id]
//     );
//   };

//   // Handle select all plants
//   const handlePlantSelectAll = () => {
//     // If selecting all, filter out already assigned plants
//     if (selectedPlants.length !== filteredPlants.length) {
//       const newSelection = filteredPlants
//         .filter(plant => !assignedPlants.includes(plant.plantCode) || !currentTransporterCode)
//         .map(plant => plant.id);
      
//       setSelectedPlants(newSelection);
//     } else {
//       // Deselect all
//       setSelectedPlants([]);
//     }
//   };

//   // Check if a plant is already assigned to the current transporter
//   const isPlantAssigned = (plantCode) => {
//     return currentTransporterCode && assignedPlants.includes(plantCode);
//   };

//   // Columns for plant assignment modal
//   const plantColumns = useMemo(
//     () => [
//       {
//         Header: () => (
//           <Input
//             type="checkbox"
//             checked={filteredPlants.length > 0 && selectedPlants.length === filteredPlants.length}
//             onChange={handlePlantSelectAll}
//           />
//         ),
//         accessor: "checkbox",
//         Cell: ({ row }) => (
//           <Input
//             type="checkbox"
//             checked={selectedPlants.includes(row.original.id)}
//             onChange={() => handlePlantCheckboxChange(row.original.id)}
//             disabled={isPlantAssigned(row.original.plantCode)}
//             style={{
//               cursor: isPlantAssigned(row.original.plantCode) ? 'not-allowed' : 'pointer',
//               opacity: isPlantAssigned(row.original.plantCode) ? 0.6 : 1
//             }}
//           />
//         ),
//         disableSortBy: true,
//       },
//       { Header: "Company Code", accessor: "companyCode" },
//       { 
//         Header: "Plant Code", 
//         accessor: "plantCode",
//         Cell: ({ value }) => (
//           <div>
//             {value}
//           </div>
//         )
//       },
//       { Header: "Plant Name", accessor: "plantName" },
//       { Header: "Address", accessor: "address" },
//       { Header: "Contact Person", accessor: "contactPerson" },
//       { Header: "Contact Number", accessor: "contactNumber" },
//     ],
//     [selectedPlants, filteredPlants, assignedPlants, currentTransporterCode]
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
//       contentClassName="rounded-4"
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
//         Assign Plant {currentTransporterCode ? `- ${currentTransporterCode}` : ''}
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
//               placeholder="Search"
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
//           {isLoading || isCheckingAssigned ? (
//             <div className="text-center my-4">
//               <Loader />
//             </div>
//           ) : (
//             <TableContainer
//               columns={plantColumns}
//               data={filteredPlants}
//               customPageSize={5}
//               pagination={true}
//               className="plant-table"
//               style={{
//                 width: '100%',
//                 borderCollapse: 'collapse'
//               }}
//             />
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
//           onClick={handleAssignPlants}
//           disabled={selectedPlants.length === 0 || isLoading || isCheckingAssigned}
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

// export default AssignPlantModal;
// AssignPlantModal.js
import React, { useState, useEffect, useMemo } from "react";
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import TableContainer from "../../../../Components/Common/TableContainer";
import Loader from "../../../../Components/Common/Loader";

const AssignPlantModal = ({ 
  isOpen, 
  toggle, 
  currentTransporterCode, 
  plants, 
  selectedPlants, 
  setSelectedPlants,
  handleAssignPlants,
  isLoading,
  getAuthHeaders
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlants, setFilteredPlants] = useState(plants);
  const [assignedPlants, setAssignedPlants] = useState([]);
  const [isCheckingAssigned, setIsCheckingAssigned] = useState(false);
  const [transporterPlants, setTransporterPlants] = useState([]);

  // Fetch already assigned plants when modal opens
  useEffect(() => {
    if (isOpen && currentTransporterCode) {
      fetchAssignedPlants();
    } else {
      // Reset assigned plants if not viewing a specific transporter
      setAssignedPlants([]);
      setTransporterPlants([]);
    }
  }, [isOpen, currentTransporterCode]);

  // Fetch plants already assigned to this transporter
  const fetchAssignedPlants = async () => {
    if (!currentTransporterCode) return;
    
    setIsCheckingAssigned(true);
    try {
      // Use auth headers from parent component
      const headers = getAuthHeaders ? getAuthHeaders() : {
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterPlantMap/byTransporter?transporterCode=${currentTransporterCode}`, {
        method: 'GET',
        headers: headers
      });

      if (response.ok) {
        const result = await response.json();
        if (result && result.data && Array.isArray(result.data)) {
          // Store the full transporter plant data
          setTransporterPlants(result.data);
          
          // Extract plant codes from assigned plants
          const plantCodes = result.data.map(item => item.plantCode);
          setAssignedPlants(plantCodes);
          
          // Find common plants between all plants and transporter plants
          // and pre-select them
          findAndSelectCommonPlants(result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching assigned plants:", error);
    } finally {
      setIsCheckingAssigned(false);
    }
  };

  // Find common plants between all plants and transporter plants, then pre-select them
  const findAndSelectCommonPlants = (transporterPlantsData) => {
    if (!plants || plants.length === 0 || !transporterPlantsData || transporterPlantsData.length === 0) {
      return;
    }

    const commonPlantIds = [];
    
    // Compare plants from both APIs to find common ones
    transporterPlantsData.forEach(transporterPlant => {
      const matchingPlant = plants.find(plant => 
        plant.plantCode === transporterPlant.plantCode &&
        plant.plantName === transporterPlant.plantName &&
        plant.address === transporterPlant.address &&
        plant.contactPerson === transporterPlant.contactPerson &&
        plant.contactNumber === transporterPlant.contactNumber
      );
      
      if (matchingPlant) {
        commonPlantIds.push(matchingPlant.id);
      }
    });

    // Pre-select the common plants
    if (commonPlantIds.length > 0) {
      setSelectedPlants(commonPlantIds);
    }
  };

  // Re-run common plant selection when plants data changes
  useEffect(() => {
    if (plants && plants.length > 0 && transporterPlants.length > 0) {
      findAndSelectCommonPlants(transporterPlants);
    }
  }, [plants]);

  // Filter plants when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPlants(plants);
    } else {
      const filtered = plants.filter(plant => 
        plant.plantCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.plantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plant.companyCode && plant.companyCode.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPlants(filtered);
    }
  }, [searchTerm, plants]);

  // Reset filtered plants when plants prop changes
  useEffect(() => {
    setFilteredPlants(plants);
  }, [plants]);

  // Handle plant checkbox selection
  const handlePlantCheckboxChange = (id) => {
    const plant = plants.find(p => p.id === id);
    if (!plant) return; // Safety check
    
    // Toggle selection
    setSelectedPlants(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(plantId => plantId !== id)
        : [...prevSelected, id]
    );
  };

  // Handle select all plants
  const handlePlantSelectAll = () => {
    // If selecting all, select all filtered plants
    if (selectedPlants.length !== filteredPlants.length) {
      const newSelection = filteredPlants.map(plant => plant.id);
      setSelectedPlants(newSelection);
    } else {
      // Deselect all
      setSelectedPlants([]);
    }
  };


  // Columns for plant assignment modal
  const plantColumns = useMemo(
    () => [
      {
        Header: () => (
          <Input
            type="checkbox"
            checked={filteredPlants.length > 0 && selectedPlants.length === filteredPlants.length}
            onChange={handlePlantSelectAll}
          />
        ),
        accessor: "checkbox",
        Cell: ({ row }) => (
          <Input
            type="checkbox"
            checked={selectedPlants.includes(row.original.id)}
            onChange={() => handlePlantCheckboxChange(row.original.id)}
            style={{
              cursor: 'pointer'
            }}
          />
        ),
        disableSortBy: true,
      },
      { Header: "Company Code", accessor: "companyCode" },
      { 
        Header: "Plant Code", 
        accessor: "plantCode",
      },
      { Header: "Plant Name", accessor: "plantName" },
      { Header: "Address", accessor: "address" },
      { Header: "Contact Person", accessor: "contactPerson" },
      { Header: "Contact Number", accessor: "contactNumber" },
    ],
    [selectedPlants, filteredPlants, transporterPlants]
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
        Assign Plant {currentTransporterCode ? `- ${currentTransporterCode}` : ''}
      </ModalHeader>
      <ModalBody style={{ 
        backgroundColor: '#fff', 
        paddingBottom: 0,
      }}>
        {/* Search Bar */}
        <div className="d-flex justify-content-between align-items-center">
          <div style={{ width: '250px' }}>
            <Input
              type="search"
              placeholder="Search plants..."
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
          {isLoading || isCheckingAssigned ? (
            <div className="text-center my-4">
              <Loader />
            </div>
          ) : (
            <TableContainer
              columns={plantColumns}
              data={filteredPlants}
              customPageSize={5}
              pagination={true}
              className="plant-table"
              style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}
            />
          )}
        </div>
      </ModalBody>
      <ModalFooter
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          borderTop: 'none',
          marginTop: 0,
          paddingTop: 0
        }}
      >
        <div>
          <small className="text-muted">
            {selectedPlants.length} plant(s) selected
          </small>
        </div>
        <Button
          color="primary"
          onClick={handleAssignPlants}
          disabled={selectedPlants.length === 0 || isLoading || isCheckingAssigned}
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

export default AssignPlantModal;