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

  // Fetch already assigned plants when modal opens
  useEffect(() => {
    if (isOpen && currentTransporterCode) {
      fetchAssignedPlants();
    } else {
      // Reset assigned plants if not viewing a specific transporter
      setAssignedPlants([]);
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
          // Extract plant codes from assigned plants
          const plantCodes = result.data.map(item => item.plantCode);
          setAssignedPlants(plantCodes);
        }
      }
    } catch (error) {
      console.error("Error fetching assigned plants:", error);
    } finally {
      setIsCheckingAssigned(false);
    }
  };

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
    
    // Check if this plant is already assigned to this transporter
    if (currentTransporterCode && assignedPlants.includes(plant.plantCode)) {
      return; // Don't allow selection of already assigned plants
    }
    
    // Toggle selection
    setSelectedPlants(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(plantId => plantId !== id)
        : [...prevSelected, id]
    );
  };

  // Handle select all plants
  const handlePlantSelectAll = () => {
    // If selecting all, filter out already assigned plants
    if (selectedPlants.length !== filteredPlants.length) {
      const newSelection = filteredPlants
        .filter(plant => !assignedPlants.includes(plant.plantCode) || !currentTransporterCode)
        .map(plant => plant.id);
      
      setSelectedPlants(newSelection);
    } else {
      // Deselect all
      setSelectedPlants([]);
    }
  };

  // Check if a plant is already assigned to the current transporter
  const isPlantAssigned = (plantCode) => {
    return currentTransporterCode && assignedPlants.includes(plantCode);
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
            disabled={isPlantAssigned(row.original.plantCode)}
            style={{
              cursor: isPlantAssigned(row.original.plantCode) ? 'not-allowed' : 'pointer',
              opacity: isPlantAssigned(row.original.plantCode) ? 0.6 : 1
            }}
          />
        ),
        disableSortBy: true,
      },
      { Header: "Company Code", accessor: "companyCode" },
      { 
        Header: "Plant Code", 
        accessor: "plantCode",
        Cell: ({ value }) => (
          <div>
            {value}
          </div>
        )
      },
      { Header: "Plant Name", accessor: "plantName" },
      { Header: "Address", accessor: "address" },
      { Header: "Contact Person", accessor: "contactPerson" },
      { Header: "Contact Number", accessor: "contactNumber" },
    ],
    [selectedPlants, filteredPlants, assignedPlants, currentTransporterCode]
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
      contentClassName="rounded-4"
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
        paddingTop: '10px'
      }}>
        {/* Search Bar */}
        <div className="d-flex justify-content-end mb-3">
          <div style={{ width: '250px' }}>
            <Input
              type="search"
              placeholder="Search"
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
          justifyContent: 'flex-end',
          backgroundColor: '#fff',
          borderTop: 'none',
          marginTop: 0,
          paddingTop: 0
        }}
      >
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