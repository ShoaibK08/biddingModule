//ViewRoutesModal.jsx
import React, { useMemo } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Loader from "../../../../Components/Common/Loader";
import TableContainer from "../../../../Components/Common/TableContainer";

const ViewRoutesModal = ({ 
  isOpen, 
  toggle, 
  currentTransporterCode, 
  viewRouteData,
  isLoading
}) => {
  
  // Columns for routes table
  const columns = useMemo(
    () => [
      { Header: "Route Code", accessor: "routeCode" },
      { Header: "Departure Location", accessor: "departureLocation" },
      { Header: "Destination Location", accessor: "destinationLocation" },
      { Header: "Route Type", accessor: "routeType" },
      { Header: "Distance", accessor: "distance" },
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
        View Routes - {currentTransporterCode}
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
            {viewRouteData && viewRouteData.length > 0 ? (
              <div style={{ marginTop: '10px' }}>
                <TableContainer
                  columns={columns}
                  data={viewRouteData}
                  isGlobalFilter={true}
                  isAddUserList={false}
                 
             
                  className="custom-header-css"
                  SearchPlaceholder="Search for routes..."
                  divClass="overflow-auto"
                  tableClass="width-50"
                />
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">No routes found for this transporter</p>
              </div>
            )}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ViewRoutesModal;
