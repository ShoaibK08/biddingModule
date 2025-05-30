import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Row, Col, Table } from "reactstrap";

const SSODetailModal = ({ isOpen, toggle, onSelectOrders }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  
  // Sample data - replace with actual data source
  const salesOrders = [
    { id: 1, orderNo: "SO34534", validity: "19Jun", material: "Iron", quantity: "10 Tan" },
    { id: 2, orderNo: "SO93744", validity: "10Jan", material: "Steel", quantity: "20 Tan" },
    { id: 3, orderNo: "SO88345", validity: "15Feb", material: "Titanium", quantity: "15 Tan" },
    { id: 4, orderNo: "SO98234", validity: "25Feb", material: "Steel", quantity: "12 Tan" },
    { id: 5, orderNo: "SO83473", validity: "18Mar", material: "Coal", quantity: "14 Tan" },
    { id: 6, orderNo: "SO76543", validity: "22Apr", material: "Aluminum", quantity: "8 Tan" },
    { id: 7, orderNo: "SO45678", validity: "30May", material: "Copper", quantity: "5 Tan" },
    { id: 8, orderNo: "SO12345", validity: "05Jun", material: "Bronze", quantity: "7 Tan" },
    { id: 9, orderNo: "SO98765", validity: "12Jul", material: "Zinc", quantity: "9 Tan" },
    { id: 10, orderNo: "SO23456", validity: "28Aug", material: "Nickel", quantity: "11 Tan" },
    { id: 11, orderNo: "SO65432", validity: "14Sep", material: "Lead", quantity: "6 Tan" },
    { id: 12, orderNo: "SO87654", validity: "30Oct", material: "Tin", quantity: "3 Tan" },
    { id: 13, orderNo: "SO34567", validity: "17Nov", material: "Silver", quantity: "2 Tan" },
    { id: 14, orderNo: "SO76543", validity: "25Dec", material: "Gold", quantity: "1 Tan" },
    { id: 15, orderNo: "SO98712", validity: "08Jan", material: "Platinum", quantity: "0.5 Tan" },
    { id: 16, orderNo: "SO45678", validity: "14Feb", material: "Brass", quantity: "4 Tan" },
    { id: 17, orderNo: "SO23456", validity: "22Mar", material: "Chromium", quantity: "8 Tan" },
    { id: 18, orderNo: "SO87654", validity: "30Apr", material: "Magnesium", quantity: "7 Tan" },
    { id: 19, orderNo: "SO12345", validity: "15May", material: "Silicon", quantity: "12 Tan" },
    { id: 20, orderNo: "SO56789", validity: "28Jun", material: "Carbon", quantity: "18 Tan" }
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle checkbox selection
  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Filter orders based on search query
  const filteredOrders = salesOrders.filter(order => 
    order.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.validity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.quantity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredOrders.slice(indexOfFirstRecord, indexOfLastRecord);

  // Handle page navigation
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Handle order selection confirmation
  const handleBidQuantity = () => {
    const selectedOrdersData = salesOrders.filter(order => selectedOrders.includes(order.id));
    onSelectOrders(selectedOrdersData);
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        Add Sales Order
      </ModalHeader>
      <ModalBody>
        <Row className="mb-3">
          <Col lg={12}>
            <Input
              type="search"
              className="form-control search"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Col>
        </Row>
        <div className="table-responsive">
          <Table className="table align-middle table-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "50px" }}>
                  <div className="form-check">
                    <Input type="checkbox" className="form-check-input" disabled />
                  </div>
                </th>
                <th>Sales Order No.</th>
                <th>Validity</th>
                <th>Material</th>
                <th>Quantity</th>
                <th>Add Quantity</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="form-check">
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        id={`order-${order.id}`}
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                      />
                    </div>
                  </td>
                  <td>{order.orderNo}</td>
                  <td>{order.validity}</td>
                  <td>{order.material}</td>
                  <td>{order.quantity}</td>
                  <td>
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Enter Qty"
                      disabled={!selectedOrders.includes(order.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>Total Results: {filteredOrders.length}</div>
          <div className="d-flex align-items-center">
            <Button color="light" size="sm" onClick={goToPrevPage} disabled={currentPage === 1}>
              <i className="ri-arrow-left-s-line"></i>
            </Button>
            <span className="mx-2">Page {currentPage} of {totalPages}</span>
            <Input 
              type="text" 
              value={currentPage} 
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (!isNaN(page) && page > 0 && page <= totalPages) {
                  setCurrentPage(page);
                }
              }}
              className="form-control mx-2"
              style={{ width: "60px" }}
            />
            <Button color="light" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
              <i className="ri-arrow-right-s-line"></i>
            </Button>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleBidQuantity} disabled={selectedOrders.length === 0}>
          Bid Quantity
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SSODetailModal;