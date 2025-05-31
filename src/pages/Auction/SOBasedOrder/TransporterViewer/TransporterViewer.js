// import React, { useState } from 'react';
// import './TransporterViewer.css';
// const TransporterViewer = ({ selectedTransporters = [], onRemove = null }) => {
//   const [showPopup, setShowPopup] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Toggle the popup visibility
//   const togglePopup = () => {
//     setShowPopup(!showPopup);
//     // Reset to first page when opening modal
//     if (!showPopup) {
//       setCurrentPage(1);
//     }
//   };

//   // Handle remove transporter from the list
//   const handleRemoveTransporter = (transporterId) => {
//     if (onRemove) {
//       onRemove(transporterId);
//     }
//   };

//   // Group transporters by name to handle duplicates
//   const groupedTransporters = {};
//   selectedTransporters.forEach(transporter => {
//     if (!groupedTransporters[transporter.name]) {
//       groupedTransporters[transporter.name] = [];
//     }
//     groupedTransporters[transporter.name].push(transporter);
//   });

//   // Create a deduplicated display list - just take the first occurrence of each name
//   const uniqueDisplayTransporters = Object.keys(groupedTransporters).map(name => {
//     return groupedTransporters[name][0];
//   });

//   // Pagination calculations
//   const totalItems = uniqueDisplayTransporters.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;

//   // Get current page items
//   const currentPageTransporters = uniqueDisplayTransporters.slice(startIndex, endIndex);

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   // Prevent double-click issues
//   const handlePrevClick = (e) => {
//     e.preventDefault();
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextClick = (e) => {
//     e.preventDefault();
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };



//   return (
//     <>
   
      
//       {/* View Icon Button */}
//       <div className="transporter-view-icon" onClick={togglePopup}>
//         <i className="ri-eye-line"></i>
//       </div>

//       {/* Popup Modal to show all selected transporters */}
//       {showPopup && (
//         <div className="modal-overlay">
//           <div className="modal-content1">
//             <div className="modal-header">
//               <h4>Transporter Details</h4>
//               <button className="modal-close-btn" onClick={togglePopup}>
//                 <i className="ri-close-line"></i>
//               </button>
//             </div>

//             <div className="modal-body">
//               {uniqueDisplayTransporters.length === 0 ? (
//                 <div className="no-transporters">
//                   No transporters selected
//                 </div>
//               ) : (
//                 <div>
//                   {/* Table display of transporters */}
//                   <table className="transporters-table">
//                     <thead>
//                       <tr>
//                         <th className="th-transporter-code">Transporter Code</th>
//                         <th className="th-transporter-name">Transporter Name</th>
//                         <th className="th-contact-person">Contact Person</th>
//                         <th className="th-phone-no">Phone No.</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {currentPageTransporters.map((transporter) => (
//                         <tr key={transporter.id || transporter.code}>
//                           <td className="td-transporter-code">
//                             {transporter.code || transporter.id}
//                           </td>
//                           <td>
//                             {transporter.name ? transporter.name.trim() : ''}
//                           </td>
//                           <td>
//                             {transporter.contactPerson ||
//                               transporter.contact_person ||
//                               transporter.fullData?.contactPerson ||
//                               'N/A'}
//                           </td>
//                           <td>
//                             {transporter.contactNumber ||
//                               transporter.contact_number ||
//                               transporter.fullData?.contactNumber ||
//                               transporter.phoneNo ||
//                               transporter.phone ||
//                               'N/A'}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>

//                   {/* Pagination Controls */}
//                   <div className="pagination-container">
//                     {/* Total Results */}
//                     <div className="total-results">
//                       Total Results : {totalItems}
//                     </div>

//                     {/* Pagination buttons */}
//                     <div className="pagination-controls">
//                       {/* Previous button */}
//                       <button
//                         className="pagination-btn"
//                         onClick={handlePrevClick}
//                         disabled={currentPage === 1}
//                         type="button"
//                       >
//                         <i className="ri-arrow-left-s-line"></i>
//                       </button>

//                       {/* Page info */}
//                       <span className="page-info">
//                         Page {currentPage} of {Math.max(totalPages, 1)}
//                       </span>

//                       {/* Page input */}
//                       <input
//                         type="number"
//                         min="1"
//                         max={totalPages}
//                         value={currentPage}
//                         className="page-input"
//                         onChange={(e) => {
//                           const page = parseInt(e.target.value);
//                           if (!isNaN(page) && page >= 1 && page <= totalPages) {
//                             setCurrentPage(page);
//                           }
//                         }}
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter') {
//                             const page = parseInt(e.target.value);
//                             if (!isNaN(page) && page >= 1 && page <= totalPages) {
//                               setCurrentPage(page);
//                             }
//                           }
//                         }}
//                       />

//                       {/* Next button */}
//                       <button
//                         className="pagination-btn"
//                         onClick={handleNextClick}
//                         disabled={currentPage === totalPages || totalPages === 0}
//                         type="button"
//                       >
//                         <i className="ri-arrow-right-s-line"></i>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="modal-footer">
//               <button className="cancel-btn" onClick={togglePopup}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
// export default TransporterViewer;



import React, { useState } from 'react';
import './TransporterViewer.css';

const TransporterViewer = ({ selectedTransporters = [], onRemove = null }) => {
  const [showModal, setShowModal] = useState(false);

  // Deduplicate transporters based on ID
  const uniqueTransporters = [...new Map(selectedTransporters.map(item => [item.id, item])).values()];

  return (
    <>
      {/* View Button */}
      <div
        onClick={() => setShowModal(true)}
        style={{
          width: "28px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #ced4da",
          borderRadius: "4px",
          backgroundColor: "#f8f9fa",
          cursor: "pointer",
          marginLeft: "10px"
        }}
      >
        <i className="ri-eye-line" style={{ fontSize: "16px", color: "#4361ee" }}></i>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "800px",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "16px 20px",
              backgroundColor: "#405189",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "8px 8px 0 0"
            }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "white" }}>
                Transporter Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "white"
                }}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            {/* Table Header */}
            <div style={{
              display: "flex",
              backgroundColor: "#f8f9fa",
              borderBottom: "2px solid #dee2e6"
            }}>
              <div style={{ flex: "0 0 50px", padding: "12px" }}>
                <input
                  type="checkbox"
                  checked={uniqueTransporters.length > 0}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      uniqueTransporters.forEach(t => onRemove(t.id));
                    }
                  }}
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                    accentColor: "#405189"
                  }}
                />
              </div>
              <div style={{ flex: "0 0 150px", padding: "12px", fontWeight: "600" }}>
                Transporter Code
              </div>
              <div style={{ flex: "1", padding: "12px", fontWeight: "600" }}>
                Transporter Name
              </div>
              <div style={{ flex: "0 0 180px", padding: "12px", fontWeight: "600" }}>
                Contact Person
              </div>
              <div style={{ flex: "0 0 140px", padding: "12px", fontWeight: "600" }}>
                Phone No.
              </div>
            </div>

            {/* Table Body */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {uniqueTransporters.map((transporter, index) => (
                <div key={index} style={{
                  display: "flex",
                  borderBottom: "1px solid #dee2e6",
                  backgroundColor: "#fff"
                }}>
                  <div style={{ flex: "0 0 50px", padding: "12px" }}>
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => onRemove(transporter.id)}
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                        accentColor: "#405189"
                      }}
                    />
                  </div>
                  <div style={{ flex: "0 0 150px", padding: "12px", color: "#495057" }}>
                    {transporter.code || transporter.id || 'N/A'}
                  </div>
                  <div style={{ flex: "1", padding: "12px", color: "#212529" }}>
                    {transporter.name || 'N/A'}
                  </div>
                  <div style={{ flex: "0 0 180px", padding: "12px", color: "#495057" }}>
                    {transporter.contactPerson || 'N/A'}
                  </div>
                  <div style={{ flex: "0 0 140px", padding: "12px", color: "#495057" }}>
                    {transporter.contactNumber || 'N/A'}
                  </div>
                </div>
              ))}

              {uniqueTransporters.length === 0 && (
                <div style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#6c757d"
                }}>
                  <i className="ri-inbox-line" style={{ fontSize: "48px", marginBottom: "16px" }}></i>
                  <div style={{ fontSize: "16px" }}>No transporters selected</div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "16px 20px",
              borderTop: "1px solid #dee2e6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f8f9fa",
              borderRadius: "0 0 8px 8px"
            }}>
              <div style={{ fontSize: "14px", color: "#6c757d" }}>
                Total Selected: {uniqueTransporters.length}
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#405189",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransporterViewer;



