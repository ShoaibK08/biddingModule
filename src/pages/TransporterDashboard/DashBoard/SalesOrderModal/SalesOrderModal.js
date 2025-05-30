import React, { useState, useEffect, useMemo } from "react";
import { Modal, ModalHeader, ModalBody, Row, Col, Input, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

const SalesOrderModal = ({ isOpen, toggle, bidNo }) => {
  const [salesOrderData, setSalesOrderData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Updated columns to match API response
  const columns = useMemo(
    () => [
      {
        Header: "Sales Order No.",
        accessor: "soNumber",
      },
      {
        Header: "Validity",
        accessor: "validity",
      },
      {
        Header: "Material",
        accessor: "material",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Transporter Code",
        accessor: "transporterCode",
      },
      {
        Header: "Plant Code",
        accessor: "plantCode",
      },
      {
        Header: "Status",
        accessor: "status",
      }
    ],
    []
  );

  // Initialize visible columns when columns are ready
  useEffect(() => {
    setVisibleColumns(columns.map(col => col.accessor));
  }, [columns]);

  // Fetch sales order data based on bid number
  useEffect(() => {
    if (bidNo && isOpen) {
      fetchSalesOrderData();
    }
  }, [bidNo, isOpen]);

  const fetchSalesOrderData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Basic authentication setup
      const username = process.env.REACT_APP_API_USER_NAME;
      const password = process.env.REACT_APP_API_PASSWORD;
      const basicAuth = 'Basic ' + btoa(username + ':' + password);
      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/getSoDetails?bidNo=${bidNo}`, {
     // const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/getSoDetails?biddingOrderNo=${bidNo}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': basicAuth
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSalesOrderData(data);
      setFilteredData(data);
      setCurrentPage(1); // Reset to first page when new data loads
    } catch (err) {
      console.error('API Error:', err);
      setError("Failed to fetch sales order data. Please try again.");
      setSalesOrderData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    if (searchText) {
      const filtered = salesOrderData.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredData(filtered);
      setCurrentPage(1); // Reset to first page when filtering
    } else {
      setFilteredData(salesOrderData);
    }
  }, [searchText, salesOrderData]);

  // Toggle dropdown for column visibility
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Toggle column visibility
  const toggleColumnVisibility = (accessor) => {
    if (visibleColumns.includes(accessor)) {
      // Don't hide the last visible column
      if (visibleColumns.length > 1) {
        setVisibleColumns(visibleColumns.filter(col => col !== accessor));
      }
    } else {
      setVisibleColumns([...visibleColumns, accessor]);
    }
  };

  // Get visible columns
  const getVisibleColumns = () => {
    return columns.filter(col => visibleColumns.includes(col.accessor));
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get current page data
  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="sales-order-modal" size="xl">
      <ModalHeader toggle={toggle} className="border-0">
        <div className="modal-title">SO Details: {bidNo}</div>
      </ModalHeader>
      <ModalBody>
        <style jsx>{`
          /* Fixed top controls */
          .controls-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            width: 100%;
          }
          
          /* Scrollable table container */
          .table-container {
            width: 100%;
            overflow-x: auto;
            margin-bottom: 15px;
            border: 1px solid #e9e9ef;
          }
          
          /* Table styles */
          .data-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .data-table th {
            background-color: #f8f9fa;
            font-weight: 600;
            text-align: left;
            padding: 10px;
            border-bottom: 2px solid #e9e9ef;
            white-space: nowrap;
          }
          
          .data-table td {
            padding: 10px;
            border-top: 1px solid #e9e9ef;
            vertical-align: middle;
          }
          
          /* Fixed pagination row */
          .pagination-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
          
          /* Dropdown for column visibility */
          .column-dropdown {
            max-height: 300px;
            overflow-y: auto;
          }
          
          /* Pagination buttons container */
          .pagination-controls {
            display: flex;
            align-items: center;
          }
          
          .page-info {
            margin: 0 10px;
          }
        `}</style>
        
        {/* Fixed Search and Column Controls */}
        <div className="controls-row">
          <div className="search-container">
            <Input
              type="text"
              placeholder="Search SO Details..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ minWidth: "250px" }}
            />
          </div>
          <div className="column-control">
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle color="light" caret>
                Hide Columns
              </DropdownToggle>
              <DropdownMenu right className="column-dropdown">
                {columns.map(column => (
                  <DropdownItem key={column.accessor} toggle={false}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`col-${column.accessor}`}
                        checked={visibleColumns.includes(column.accessor)}
                        onChange={() => toggleColumnVisibility(column.accessor)}
                      />
                      <label className="form-check-label" htmlFor={`col-${column.accessor}`}>
                        {column.Header}
                      </label>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        
        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2">Loading sales order data...</p>
          </div>
        ) : error ? (
          <div className="text-center text-danger py-5">
            <i className="ri-error-warning-line fs-1 mb-3"></i>
            <p>{error}</p>
            <Button color="primary" size="sm" onClick={fetchSalesOrderData}>
              Retry
            </Button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-5">
            <i className="ri-information-line fs-1 mb-3"></i>
            <p>No sales order data found</p>
          </div>
        ) : (
          <>
            {/* Scrollable Table Container */}
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    {getVisibleColumns().map(column => (
                      <th key={column.accessor}>
                        {column.Header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getCurrentItems().map((row, i) => (
                    <tr key={row.id || i}>
                      {getVisibleColumns().map(column => (
                        <td key={`${row.id || i}-${column.accessor}`}>
                          {row[column.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Fixed Pagination Controls */}
            <div className="pagination-row">
              <div>
                Total Results: {filteredData.length}
              </div>
              <div className="pagination-controls">
                <Button 
                  color="secondary" 
                  size="sm" 
                  onClick={goToPrevPage} 
                  disabled={currentPage === 1}
                >
                  &lt;
                </Button>
                <span className="page-info">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button 
                  color="secondary" 
                  size="sm" 
                  onClick={goToNextPage} 
                  disabled={currentPage >= totalPages}
                >
                  &gt;
                </Button>
              </div>
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default SalesOrderModal;






