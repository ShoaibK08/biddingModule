import React, { useState } from 'react';
import './TransporterViewer.css';

const TransporterViewer = ({ selectedTransporters = [], onRemove = null }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Toggle the popup visibility
  const togglePopup = () => {
    setShowPopup(!showPopup);
    // Reset to first page when opening modal
    if (!showPopup) {
      setCurrentPage(1);
    }
  };

  // Handle remove transporter from the list
  const handleRemoveTransporter = (transporterId) => {
    if (onRemove) {
      onRemove(transporterId);
    }
  };

  // Group transporters by name to handle duplicates
  const groupedTransporters = {};
  selectedTransporters.forEach(transporter => {
    if (!groupedTransporters[transporter.name]) {
      groupedTransporters[transporter.name] = [];
    }
    groupedTransporters[transporter.name].push(transporter);
  });

  // Create a deduplicated display list - just take the first occurrence of each name
  const uniqueDisplayTransporters = Object.keys(groupedTransporters).map(name => {
    return groupedTransporters[name][0];
  });

  // Pagination calculations
  const totalItems = uniqueDisplayTransporters.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get current page items
  const currentPageTransporters = uniqueDisplayTransporters.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Prevent double-click issues
  const handlePrevClick = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      {/* View Icon Button */}
      <div className="transporter-view-icon" onClick={togglePopup}>
        <i className="ri-eye-line"></i>
      </div>

      {/* Popup Modal to show all selected transporters */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content1">
            <div className="modal-header">
              <h4>Transporter Details</h4>
              <button className="modal-close-btn" onClick={togglePopup}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="modal-body">
              {uniqueDisplayTransporters.length === 0 ? (
                <div className="no-transporters">
                  No transporters selected
                </div>
              ) : (
                <div>
                  {/* Table display of transporters */}
                  <table className="transporters-table">
                    <thead>
                      <tr>
                        <th className="th-transporter-code">Transporter Code</th>
                        <th className="th-transporter-name">Transporter Name</th>
                        <th className="th-contact-person">Contact Person</th>
                        <th className="th-phone-no">Phone No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPageTransporters.map((transporter) => (
                        <tr key={transporter.id || transporter.code}>
                          <td className="td-transporter-code">
                            {transporter.code || transporter.id}
                          </td>
                          <td>
                            {transporter.name ? transporter.name.trim() : ''}
                          </td>
                          <td>
                            {transporter.contactPerson ||
                              transporter.contact_person ||
                              transporter.fullData?.contactPerson ||
                              'N/A'}
                          </td>
                          <td>
                            {transporter.contactNumber ||
                              transporter.contact_number ||
                              transporter.fullData?.contactNumber ||
                              transporter.phoneNo ||
                              transporter.phone ||
                              'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  <div className="pagination-container">
                    {/* Total Results */}
                    <div className="total-results">
                      Total Results : {totalItems}
                    </div>

                    {/* Pagination buttons */}
                    <div className="pagination-controls">
                      {/* Previous button */}
                      <button
                        className="pagination-btn"
                        onClick={handlePrevClick}
                        disabled={currentPage === 1}
                        type="button"
                      >
                        <i className="ri-arrow-left-s-line"></i>
                      </button>

                      {/* Page info */}
                      <span className="page-info">
                        Page {currentPage} of {Math.max(totalPages, 1)}
                      </span>

                      {/* Page input */}
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={currentPage}
                        className="page-input"
                        onChange={(e) => {
                          const page = parseInt(e.target.value);
                          if (!isNaN(page) && page >= 1 && page <= totalPages) {
                            setCurrentPage(page);
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const page = parseInt(e.target.value);
                            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                              setCurrentPage(page);
                            }
                          }
                        }}
                      />

                      {/* Next button */}
                      <button
                        className="pagination-btn"
                        onClick={handleNextClick}
                        disabled={currentPage === totalPages || totalPages === 0}
                        type="button"
                      >
                        <i className="ri-arrow-right-s-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={togglePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransporterViewer;