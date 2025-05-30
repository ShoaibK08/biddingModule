


// ViewPlantsModal.js
import React, { useMemo } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Loader from "../../../../Components/Common/Loader";
import TableContainer from "../../../../Components/Common/TableContainer";

const ViewPlantsModal = ({ 
  isOpen, 
  toggle, 
  currentTransporterCode, 
  viewPlantData,
  isLoading
}) => {
  
  // Columns for plants table
  const columns = useMemo(
    () => [
      { Header: "Plant Code", accessor: "plantCode" },
      { Header: "Plant Name", accessor: "plantName" },
      { Header: "Address", accessor: "address" },
      { Header: "Contact Person", accessor: "contactPerson" },
      { Header: "Phone Number", accessor: "contactNumber" },
    ],
    []
  );

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
      centered={true}
      className="custom-modal"
      style={{ 
        maxWidth: '900px', 
        width: '100%' 
      }}
   
    >
      <ModalHeader
        toggle={toggle}
        style={{
          backgroundColor: 'transparent',
          borderBottom: 'none',
          padding: '15px 20px 5px 20px',
          color: '#495057',
          position: 'relative'
        }}
        className="border-0"
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
        Assign Plants - {currentTransporterCode}
      </ModalHeader>
      <ModalBody 
        className="px-3 pt-1 pb-3"
        style={{ 
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden'
        }}
      >
        {isLoading ? (
          <div className="text-center my-4">
            <Loader />
          </div>
        ) : (
          <div>
            {viewPlantData && viewPlantData.length > 0 ? (
              <div style={{ marginTop: '10px' }}>
                <TableContainer
                  columns={columns}
                  data={viewPlantData}
                  isGlobalFilter={true}
                  isAddUserList={false}
                  className="custom-header-css"
                  SearchPlaceholder="Search for plants..."
                  divClass="overflow-auto"
                  tableClass="width-50"
                />
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">No plants found for this transporter</p>
              </div>
            )}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ViewPlantsModal;