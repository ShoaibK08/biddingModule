import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import TableContainer from '../../Components/Common/TableContainer';
import DeleteModal from "../../Components/Common/DeleteModal";
import { Col, Modal, ModalBody, Row, Label, Input, Button, ModalHeader, FormFeedback, Form, Nav, NavItem, NavLink } from 'reactstrap';
import axios from "axios";
// Import Scroll Bar - SimpleBar
import SimpleBar from 'simplebar-react';

//Import Flatepicker
import Flatpickr from "react-flatpickr";

//redux
import { useSelector, useDispatch } from "react-redux";

import {
  getTaskList,
  addNewTask,
  updateTask,
  deleteTask,
} from "../../store/actions";

import {
  OrdersId,
  Project,
  CreateBy,
  DueDate,
  Status,
  Priority
} from "./TaskListCol";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { isEmpty } from "lodash";
import { Link } from 'react-router-dom';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../Components/Common/Loader";

const Assigned = [
  { id: 1, imgId: "anna-adame", img: "avatar-1.jpg", name: "Anna Adame" },
  { id: 2, imgId: "frank-hook", img: "avatar-3.jpg", name: "Frank Hook" },
  { id: 3, imgId: "alexis-clarke", img: "avatar-6.jpg", name: "Alexis Clarke" },
  { id: 4, imgId: "herbert-stokes", img: "avatar-2.jpg", name: "Herbert Stokes" },
  { id: 5, imgId: "michael-morris", img: "avatar-7.jpg", name: "Michael Morris" },
  { id: 6, imgId: "nancy-martino", img: "avatar-5.jpg", name: "Nancy Martino" },
  { id: 7, imgId: "thomas-taylor", img: "avatar-8.jpg", name: "Thomas Taylor" },
  { id: 8, imgId: "tonya-noble", img: "avatar-10.jpg", name: "Tonya Noble" },
];


const AllTasksTransporter = () => {
  const dispatch = useDispatch();
  const config = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"
    },
    auth: {
        username: "amazin",
        password: "TE@M-W@RK",
    },
  };

  const [isEdit, setIsEdit] = useState(false);
  const [task, setTask] = useState([]);
  const [TaskList, setTaskList] = useState([]);

  // Delete Task
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [selectedSO1, setSelectedSO1] = useState(null);
  const [transporterCode, setTransporterCode] = useState(null);
  const [truckDetails, setTruckDetails] = useState([]);
  const [truckDetailsForSoAndTrans, setTruckDetailsForSoAndTrans] = useState([]);

  const [modalEdit, setModalEdit] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [modalCommit, setModalCommit] = useState(false);

  //for pagination

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page
  const [totalPages, setTotalPages] = useState(1);
  const [load, setLoad] = useState(0);
  const [data, setData] = useState([]);
  const [setStatus, statusWise] = useState("total");

  const [soNumber, setSoNumber] = useState(null);
  const [selectedCodes, setSelectedCodes] = useState([]);

  const [selectedSO, setSelectedSO] = useState(null);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [cancelRemark, setCancelRemark] = useState("");
  const [modalAction, setModalAction] = useState(""); // "commit" or "reject"
  const [modalVisible, setModalVisible] = useState(false);
  const [soTotalQty, setSOTotalQty] = useState(0);

  const [selectedTruckIds, setSelectedTruckIds] = useState([]);
  const [initialTruckIds, setInitialTruckIds] = useState([]);

  const handleCommitRejectClick = useCallback((order, action) => {
    setSelectedSO(order?.soNumber);
    setSelectedTransporter(order?.transporterCode);
    setCancelRemark(""); // reset remarks
    setModalAction(action); // 'commit' or 'reject'
    setModalVisible(true);
  }, []);

  const toggle = useCallback((code = null,soNumber = null,qty) => {
    //alert(qty);
    if (modal) {
      setTask(null);
      setSelectedSO1("");
      setTransporterCode(null);
      setSOTotalQty(0);
      setModal(false);
    } else {
      if (code) 
      setSelectedSO1(soNumber);
      setTransporterCode(code);
      fetchTruckDetails(code); // call API
      setSOTotalQty(qty);
      setModal(true);
    }
  }, [modal]);

  const toggleEditModal = useCallback(
    async (code = null,soNumber = null,qty) => {
      //alert(qty);
      // If modal is closed, we're about to OPEN it
      if (!modalEdit) {
        setSelectedSO1(soNumber);
        setTransporterCode(code);
        setSOTotalQty(qty);
        await fetchTruckDetails(code);
        try {
          // Fetch the already-allocated truck IDs for this SO
          const response = await axios.get(
            `${process.env.REACT_APP_LOCAL_URL_8085}/truckAllocation/getBySoNumberAndTransporter?soNumber=${soNumber}&transporterCode=${code}`,config
          );

          console.log(response);
          const prevIds = response.map((truck) => truck.vehicleNo);

          // assume your endpoint returns { truckIds: [ ... ] }
          setSelectedTruckIds(prevIds || []);
          setInitialTruckIds(prevIds);        // ← store the “previous” list

        } catch (err) {
          console.error("Failed to load allocated trucks:", err);
          setSelectedTruckIds([]);       
          setInitialTruckIds([]);
          // setTransporterCode(null);
          // setSOTotalQty(0);
        }
        setModalEdit(true);
      } else {
        // We're closing the modal
        setModalEdit(false);
        setSelectedSO1(null);
        setSelectedTruckIds([]);        
        setInitialTruckIds([]);
        setTransporterCode(null);
        setSOTotalQty(0);
      }
    },
    [modalEdit]
  );

  const toggleModal = useCallback((code = null,soNumber = null,qty) => {
    if (modal1) {
      setModal1(false);
      setSOTotalQty(qty);
      setTruckDetailsForSoAndTrans([]);

    } else {
      if (code && soNumber) {
        setSOTotalQty(qty);
        fetchTruckDetailsBySoAndTransporter(code,soNumber); // call API
      }
      setModal1(true);
    }
  }, [modal1]);

  const fetchTruckDetails = async (code) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL_URL_8085}/vehicles/getVehicle/${code}`,
        config
      );

      console.log(response);
  
      if (response.length > 0) {
        setTruckDetails(response);
      } else {
        setTruckDetails([]);
        console.warn("No truck data found");
      }
    } catch (err) {
      console.error("Error fetching truck details:", err);
      setTruckDetails([]);
    }
  };  

  const fetchTruckDetailsBySoAndTransporter = async (code,soNumber) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL_URL_8085}/truckAllocation/getBySoNumberAndTransporter?soNumber=${soNumber}&transporterCode=${code}`,
        config
      );

      console.log(response);
  
      if (response.length > 0) {
        setTruckDetailsForSoAndTrans(response);
      } else {
        setTruckDetailsForSoAndTrans([]);
        console.warn("No truck data found");
      }
    } catch (err) {
      console.error("Error fetching truck details:", err);
      setTruckDetailsForSoAndTrans([]);
    }
  };  

  // Add Data
  const handleTaskClicks = () => {
    setTask("");
    setIsEdit(false);
    toggle();
  };

  const submitEditTruck = async () => {
    if (!selectedSO1) {
      alert("SO Number missing");
      return;
    }

    console.log("truckdetails",truckDetails);
     // 1️⃣ Sum “previous” capacity (raw)
    const prevRaw = truckDetails
    .filter(truck => initialTruckIds.includes(truck.registrationNumber))
    .reduce((sum, t) => sum + parseFloat(t.vehicleCapacityMax || 0), 0);
    // Round to 3 decimals
    const prevCapacity = Number(prevRaw.toFixed(3));

    console.log(prevRaw);

    // 2️⃣ Sum “current” capacity (raw)
    const currRaw = truckDetails
    .filter(truck => selectedTruckIds.includes(truck.registrationNumber))
    .reduce((sum, t) => sum + parseFloat(t.vehicleCapacityMax || 0), 0);
    // Round to 3 decimals
    const currCapacity = Number(currRaw.toFixed(3));

    console.log(currCapacity);
    console.log(selectedTruckIds);
    console.log(selectedTruckIds);

      // selectedTruckIds is already pre-populated
    // const payload = {
    //   soNumber: selectedSO1,
    //   truckIds: selectedTruckIds,
    //   previousCapacity: prevCapacity,
    //   currentCapacity: currCapacity,
    // };

    if (soTotalQty < currCapacity) {
      toast.error(
        `Cannot allocate: total truck capacity (${soTotalQty}) ` +
        `is less than required (${currCapacity}).`
      );
      return false;
    }

    const payload = {
      "soNumber": selectedSO1,
      "vehicleNo": selectedTruckIds,
      "transporterCode": transporterCode,
      "newlyAllocatedQuantity": currCapacity,
      "previouslyAllocatedQuantity": prevCapacity,
      "orderStatus": "truckallocated",
      "createdBy": "user01",
      "plantCode": "N205"
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_LOCAL_URL_8085}/truckAllocation`,
        payload,
        config
      );

      if(!res.errorMsg){
        toast.success("Truck allocated successfully");
        fetchData(1, itemsPerPage, "total");
        setSelectedTruckIds([]);
        setInitialTruckIds([]);
        setModalEdit(false);
      }else{
        toast.error("Truck Allocation Failed");
        setSelectedTruckIds([]);
        setInitialTruckIds([]);
        setModalEdit(false);
      }
      // optionally refresh your table here
    } catch (err) {
      console.error(err);
      alert("Failed to update truck allocation");
      setSelectedTruckIds([]);
      setInitialTruckIds([]);
      setModalEdit(false);
    }
  };

  const columnsTruckEdit = useMemo(() => [
    {
      // Select-All checkbox in header
      Header: (
        <input
          type="checkbox"
          id="checkBoxAll"
          className="form-check-input"
          checked={
            truckDetails.length > 0 &&
            truckDetails.every(row => selectedTruckIds.includes(row.registrationNumber))
          }
          onChange={(e) => {
            const allIds = truckDetails.map(row => row.registrationNumber);
            if (e.target.checked) {
              setSelectedTruckIds(allIds);
            } else {
              setSelectedTruckIds([]);
            }
          }}
        />
      ),
      id: 'checkbox',
      disableSortBy: true,
      Cell: ({ row }) => {
        const id = row.original.registrationNumber;
        console.log(selectedTruckIds);
        return (
          <input
            type="checkbox"
            className="form-check-input"
            checked={selectedTruckIds.includes(id)}
            onChange={() => {
              setSelectedTruckIds(prev =>
                prev.includes(id)
                  ? prev.filter(x => x !== id)
                  : [...prev, id]
              );
            }}
          />
        );
      },
    },
    {
      Header: "Vehicle No",
      accessor: "registrationNumber",
      filterable: false,
    },
    {
      Header: "Chassis Number",
      accessor: "chassisNumber",
      filterable: false,
    },
    {
      Header: "Truck Max Capacity",
      accessor: "vehicleCapacityMax",
      filterable: false,
    },
    {
      Header: "Unladen bed Capacity",
      accessor: "tareWeight",
      filterable: false,
    },
    {
      Header: "Status",
      accessor: "status",
      filterable: false,
      Cell: (cellProps) => {
        return <Status {...cellProps} />;
      },
    },
  ], [truckDetails, selectedTruckIds]);  

  const columnsTruck = useMemo(() => [
    {
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <input
          type="checkbox"
          className='form-check-input'
          onChange={(e) => {
            const checked = e.target.checked;
            const allIds = truckDetails.map((row) => row.registrationNumber);
            setSelectedTruckIds(checked ? allIds : []);
          }}
          checked={
            truckDetails.length > 0 && selectedTruckIds.length === truckDetails.length
          }
          indeterminate={
            selectedTruckIds.length > 0 &&
            selectedTruckIds.length < truckDetails.length
          }
        />
      ),
      accessor: "select",
      disableSortBy: true,
      Cell: ({ row }) => {
        const id = row.original.registrationNumber;
        return (
          <input
            type="checkbox"
            className='form-check-input'
            checked={selectedTruckIds.includes(id)}
            onChange={(e) => {
              const checked = e.target.checked;
              setSelectedTruckIds((prev) =>
                checked ? [...prev, id] : prev.filter((x) => x !== id)
              );
            }}
          />
        );
      },
    },
    {
      Header: "Vehicle No",
      accessor: "registrationNumber",
      filterable: false,
    },
    {
      Header: "Chassis Number",
      accessor: "chassisNumber",
      filterable: false,
    },
    {
      Header: "Truck Max Capacity",
      accessor: "vehicleCapacityMax",
      filterable: false,
    },
    {
      Header: "Unladen bed Capacity",
      accessor: "tareWeight",
      filterable: false,
    },
    {
      Header: "Status",
      accessor: "status",
      filterable: false,
      Cell: (cellProps) => {
        return <Status {...cellProps} />;
      },
    },
  ], [truckDetails, selectedTruckIds]);  
  
  const columnsTruckView = useMemo(
    () => [
      {
        Header: "Vehicle No",
        accessor: "vehicleNo",
        filterable: false,
      },
      {
        Header: "Chassis Number",
        accessor: "chassisNumber",
        filterable: false,
      },
      {
        Header: "Truck Max Capacity",
        accessor: "vehicleCapacityMax",
        filterable: false,
      },
      {
        Header: "Unladen bed Capacity",
        accessor: "tareWeight",
        filterable: false,
      },
      {
        Header: "Status",
        accessor: "status",
        filterable: false,
        Cell: (cellProps) => {
          return <Status {...cellProps} />;
        },
      },
    ],
    []
  );

  const allocateTruckDetail = async () => {
    if (!selectedSO1 || selectedTruckIds.length === 0) {
      alert("Please select a truck and ensure SO number is available.");
      return;
    }

    // Sum with parseFloat, then format to (say) 3 decimal places:
    const totalQuantityRaw = truckDetails
    .filter(truck => selectedTruckIds.includes(truck.registrationNumber))
    .reduce((sum, truck) => sum + parseFloat(truck.vehicleCapacityMax || 0), 0);

    // Format for display (e.g., 3 decimal places)
    const totalQuantity = Number(totalQuantityRaw.toFixed(3));

    console.log(totalQuantity); // e.g. 12.345

    if (soTotalQty < totalQuantity) {
      toast.error(
        `Cannot allocate: total truck capacity (${soTotalQty}) ` +
        `is less than required (${totalQuantity}).`
      );
      return false;
    }

    const payload = {
      "soNumber": selectedSO1,
      "vehicleNo": selectedTruckIds,
      "transporterCode": transporterCode,
      "newlyAllocatedQuantity": totalQuantity,
      //"previouslyAllocatedQuantity": 60,
      "orderStatus": "truckallocated",
      "createdBy": "user01",
      "plantCode": "N205"
    };
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8085}/truckAllocation`,payload,config);
  
      if (!response.errorMsg) {
        toast.success("Truck allocated successfully!");
        setSelectedTruckIds([]);
        fetchData(1, itemsPerPage, "total");
      } else {
        toast.error("Truck Allocation Failed");
        setSelectedTruckIds([]);
        fetchData(1, itemsPerPage, "total");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");      
      setSelectedTruckIds([]);
      fetchData(1, itemsPerPage, "total");
    }
    toggle();
  };  

  useEffect(() => {
    if (load === 0) {
      fetchData(1, itemsPerPage, "total");
    }
    // fetchData(currentPage,itemsPerPage,"total");
  }); // Fetch data whenever page or itemsPerPage change

  const fetchData = async (currentPage, itemsPerPage, status, string) => {
    //setLoading(true);
    try {
      const string1 = document.getElementById("search-bar-0").value;
      
      if (string1 !== "") {
        const payload = {
          //"transporterCode":916001837,
          "transporterCode":sessionStorage.getItem("authUser") ? JSON.parse(sessionStorage.getItem("authUser")).data.login : null,
          "search":string1,
          "page":(currentPage - 1),
          "size":itemsPerPage
        };
        const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8085}/orderManagement/filter`,payload,config);
        const ab = response;
        const { items, totalItems } = ab.content;
        setData(ab.content);
        setTotalPages(ab.totalElements);
      } else {
        const payload = {
          "transporterCode":sessionStorage.getItem("authUser") ? JSON.parse(sessionStorage.getItem("authUser")).data.login : null,
          // "transporterId":sessionStorage.getItem("authUser") ? JSON.parse(sessionStorage.getItem("authUser")).data._id : null,
          "page":(currentPage - 1),
          "size":itemsPerPage
        };
        const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8085}/orderManagement/filter`,payload,config);
        const ab = response;
        const { items, totalItems } = ab.content;
        setData(ab.content);
        setTotalPages(ab.totalElements);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // setLoading(false);
      setLoad(1);
    }
  };

  const handlePageChange = (pageNumber) => {
    debugger
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      if (setStatus === "total") {
        fetchData(pageNumber, itemsPerPage, "total");
      }
    }
  };

  const handleItemsPerPageChange = (e) => {
    const itemsPerPage = parseInt(e.target.value);
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    if (setStatus === "total") {
      fetchData(currentPage, itemsPerPage, "total");
    }
  };

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Function to handle clicks outside of the dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false); // Close the dropdown if clicking outside
    }
  };

  // Add event listener to detect clicks outside the component
  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const onSort = (key, direction) => {
    // Your custom sorting logic, if needed
  };

  //const CustomTableComponent = ({ data = [], onSort }) => {
  const [visibleColumns, setVisibleColumns] = useState({
    checkbox: true,
    soNumber: true,
    soItem: true,
    orderQuantity: true,
    allocatedQty: true,
    availableQty: true,
    cityDesc: true,
    material: true,
    shipToParty: true,
    shipToPartyName: true,
    dateTimeReachYard: true,
    vehicleDetails: true,
    orderPriority: true,
    soStatus: true,
    cancelOrder: true,
    transporterDetail: true,
  });

  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    setSortedData(sortableData);
  }, [data, sortConfig]);

  const toggleColumn = (column) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  const toggleAllColumns = (visible) => {
    const newVisibleColumns = Object.keys(visibleColumns).reduce((acc, column) => {
      acc[column] = visible;
      return acc;
    }, {});
    setVisibleColumns(newVisibleColumns);
  };

  const getAllSearchFilter = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    if (setStatus === "total") {
      fetchData(currentPage, itemsPerPage, "total", e.target.value);
    }
  }

  const handleColumnSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = null;  // No sorting applied
      key = null;  // Reset sorting key
    }
    setSortConfig({ key, direction });
    //if (onSort) onSort(key, direction);
  };

  const submitCommitReject = async () => {
    if (!cancelRemark.trim()) {
      alert("Please enter a remark.");
      return;
    }
  
    const payload = {
      transporterCode: selectedTransporter, // Replace with dynamic value if needed
      soNumber: selectedSO,
      orderStatus: modalAction,
      remarks: cancelRemark,
    };
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8085}/orderManagement/update`, payload,config);
  
      if (!response.errorMsg) {
        toast.success(`${modalAction === "committed" ? "Order committed" : "Order rejected"} successfully.`);
        fetchData(1, itemsPerPage, "total");
        setModalVisible(false);
        // optionally refresh your order list
      } else {
        toast.error(response.errorMsg);
        fetchData(1, itemsPerPage, "total");
        setModalVisible(false);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };  

  return (
    <React.Fragment>
      <div className="row row-color-ff">
        <Col lg={12}>
          <div className="" id="tasksList">
            <div className="border-0">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="d-flex flex-wrap gap-2" style={{marginBottom: "14px"}}>
                    {/* <button className="btn btn-success add-btn me-1 for-new-css-1" onClick={() => { setIsEdit(false); toggle(); }}><i className="ri-add-line align-bottom me-1"></i> Assign Transporter</button> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="" style={{ padding: "7px 3px 2px 0px" }}>
                <div style={{ float: "left", width: "7%" }}>
                  <select name="selectField" className="form-select" style={{ width: "94%" }} value={itemsPerPage} onChange={handleItemsPerPageChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block" style={{ width: "40%" }}>
                  <input id="search-bar-0" type="text" name="searchField" onInput={(e) => { getAllSearchFilter(e); }} class="form-control search" placeholder="Search for so number or something..." /><i class="bx bx-search-alt search-icon"></i>
                </div>
                {/* <button className="btn btn-success add-btn me-1 for-new-css-1" onClick={() => { setIsEdit(false); toggle(); }}><i className="ri-add-line align-bottom me-1"></i> Assign Transporter</button> */}
              </div>
            <div className="table-responsive">
              <section ref={dropdownRef}>
                <div>
                  <Nav className="nav-tabs nav-tabs-custom nav-success tog_con" role="tablist" style={{ border: "solid 1px lightgray", borderRadius: "4px", position: "absolute", top: "21px", right: "13px" }}>
                    <NavItem>
                      <NavLink>
                        <span className="buttonForToggle text-end" onClick={() => setOpen(!open)}>
                          <i className="ri-menu-2-line" />
                        </span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>

                {open && (
                  <div className="commonThemeClass" style={{ right: "20px", left: "unset", top: "94px", borderRadius: "5px" }}>
                    <span className="form-check form-switch form-switch-success mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        onChange={(e) => toggleAllColumns(e.target.checked)}
                        checked={Object.values(visibleColumns).every(Boolean)}
                      />
                      Toggle All
                    </span>
                    {Object.keys(visibleColumns).map(column => (
                      <span key={column} className="form-check form-switch form-switch-success mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={visibleColumns[column]}
                          onChange={() => toggleColumn(column)}
                        />
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                      </span>
                    ))}
                  </div>
                )}

                <table className="table table-responsive table-nowrap">
                  <thead>
                    <tr>
                      {visibleColumns.soNumber && <th  class="color-blue-bg">SO Number</th>}
                      {visibleColumns.material && <th class="color-blue-bg">Material</th>}
                      {visibleColumns.orderQuantity && <th class="color-blue-bg">Total Quantity</th>}
                      {visibleColumns.availableQty && <th class="color-blue-bg">Available Quantity</th>}
                      {visibleColumns.cityDesc && <th class="color-blue-bg">City Desc</th>}
                      {visibleColumns.orderPriority && <th class="color-blue-bg">Order Priority</th>}
                      {visibleColumns.soStatus && <th class="color-blue-bg">SO Status</th>}
                      {visibleColumns.cancelOrder && <th class="color-blue-bg">Order Commitment</th>}
                      {visibleColumns.transporterDetail && <th class="color-blue-bg">Truck Details</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={index}>
                          {visibleColumns.soNumber && <td>{item.soNumber}</td>}
                          {visibleColumns.material && <td>{item.material}</td>}
                          {visibleColumns.orderQuantity && <td>{item.totalQuantity + " MT"}</td>}
                          {visibleColumns.availableQty && <td>{item.availableQuantity + " MT"}</td>}
                          {visibleColumns.cityDesc && <td>{item.city}</td>}
                          {visibleColumns.orderPriority && <td>{item.priorityStatus === 1 ? "Yes" : "No"}</td>}
                          {visibleColumns.soStatus && <td>
                            <Priority data={item.soStatus} />
                          </td>}
                          {visibleColumns.cancelOrder && (
                          <td>
                            <button
                              className="btn color-blue-bg"
                              style={{ padding: "5px" }}
                              onClick={() => handleCommitRejectClick(item, "committed")}
                              disabled={item.soStatus === 2 || item.soStatus === 4 || item.soStatus === 3}
                            >
                              Commit
                            </button>{" "}
                            <button
                              className="btn btn-danger"
                              style={{ padding: "5px" }}
                              onClick={() => handleCommitRejectClick(item, "rejected")}
                              disabled={item.soStatus === 2 || item.soStatus === 4 || item.soStatus === 3}
                            >
                              Reject
                            </button>
                          </td>
                        )}
                          {visibleColumns.transporterDetail && (
                            // <td>
                            //   <a href="#" onClick={() => toggle() }>
                            //     <button className="btn color-blue-bg" style={{ padding: "5px", border: "1px solid #405189" }}>Edit Truck</button>
                            //   </a>{" "}
                            //   <a href="#" onClick={() => handleCustomerClick(item)}>
                            //     <button className="btn color-blue-bg" style={{ padding: "5px", border: "1px solid #405189" }}>Allocate Truck</button>
                            //   </a>{" "}
                            //   <a href="#" onClick={() => toggleModal(item.soNumber)}>
                            //     <i className="ri-eye-fill color-g align-bottom me-2 fs-22 text-muted"></i>
                            //   </a>
                            // </td>
                              <td>
                                {/* Show Edit Truck and View Icon ONLY if status is 'truckallocated' */}
                                {item.soStatus === 3 && (
                                  <>
                                    <button
                                      className="btn color-blue-bg"
                                      style={{ padding: "5px", border: "1px solid #405189" }}
                                      onClick={() => toggleEditModal(item.transporterCode,item.soNumber,item.availableQuantity)}
                                    >
                                      Edit Truck
                                    </button>{" "}
                                    <a href="#" onClick={() => toggleModal(item.transporterCode,item.soNumber,item.availableQuantity)}>
                                      <i className="ri-eye-fill color-g align-bottom me-2 fs-22 text-muted"></i>
                                    </a>
                                  </>
                                )}
                            
                                {/* Show Allocate Truck ONLY if status is NOT 'truckallocated' */}
                                {item.soStatus !== 3 && (
                                  <button
                                    className="btn color-blue-bg"
                                    style={{ padding: "5px", border: "1px solid #405189" }}
                                    onClick={() => toggle(item.transporterCode,item.soNumber,item.availableQuantity)}
                                  >
                                    Allocate Truck
                                  </button>
                                )}
                              </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="16" style={{ textAlign: "center" }}>No Data Found</td>
                      </tr>
                    )}
                  </tbody>
                </table>

              </section>
            </div>
            <div class="justify-content-md-end justify-content-center align-items-center p-2 row">
              <div class="col-md-auto col">
                <div class="d-flex gap-1">
                  <button type="button" class="btn btn-primary" onClick={(e) => { handlePageChange((currentPage - 1)) }} disabled={currentPage === 1}>&lt;</button>
                </div>
              </div>
              <div class="col-md-auto d-none d-md-block col">Page <strong>{currentPage} of {totalPages}</strong></div>
              <div class="col-md-auto col">
                <input min="1" max={totalPages} value={currentPage} type="number" class="form-control" style={{ width: "70px" }} onChange={(e) => handlePageChange(parseInt(e.target.value))} />
              </div>
              <div class="col-md-auto col">
                <div class="d-flex gap-1">
                  <button type="button" onClick={() => { handlePageChange((currentPage + 1)) }} disabled={currentPage === totalPages} class="btn btn-primary">&gt;</button>
                </div>
              </div>
            </div>
              <ToastContainer closeButton={false} limit={1} />
            </div>
          </div>
        </Col>
      </div>
      
      <Modal
        isOpen={modalEdit}
        toggle={toggleEditModal}
        centered
        size="lg"
        className="border-0 for-custom-apply"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-soft-info" toggle={toggleEditModal}>
          {"Edit Truck - "} <span>{selectedSO1}</span>
        </ModalHeader>
          <ModalBody className="modal-body">
            <p style={{fontEeight: 600,fontSize: "20px"}}>So Total Quantity : <span id="totalQty">{soTotalQty + " MT"}</span></p>
            <TableContainer
                columns={columnsTruckEdit}
              //  data={(taskList || [])}
                data={truckDetails}
                isGlobalFilter={true}
                isGlobalSearch={true}
                customPageSize={5}
                className="custom-header-css"
                divClass="table-responsive table-card table-card1 mb-3"
                tableClass="align-middle table-nowrap mb-0"
                theadClass="table-light table-nowrap"
                thClass="table-light color-blue-bg text-muted"
                SearchPlaceholder='Search for tasks or something...'
            />
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  setModalEdit(false);
                }}
                className="btn-light"
              >Close</Button>
              <button type="button" className="btn color-blue-bg" id="add-btn" onClick={() => { submitEditTruck(); }}>{"Edit Truck"}</button>
            </div>
          </div>
      </Modal> 
      
      <Modal
        isOpen={modalVisible}
        toggle={() => setModalVisible(false)}
        centered
        size="md"
        className="border-0"
        modalClassName="modal fade zoomIn"
      >
        <ModalHeader className="p-3 bg-soft-info" toggle={() => setModalVisible(false)}>
          {modalAction === "committed" ? "Commit Order" : "Reject Order"}
        </ModalHeader>
        <ModalBody className="modal-body">
          <div className="form-group">
            <label>Add Remark <span style={{ color: "red" }}>*</span></label>
            <textarea
              className="form-control"
              rows={7}
              placeholder="Enter Remark"
              value={cancelRemark}
              onChange={(e) => setCancelRemark(e.target.value)}
            />
          </div>
        </ModalBody>
        <div className="modal-footer">
          <div className="hstack gap-2 justify-content-end">
            <button
              type="submit"
              className="btn color-blue-bg"
              onClick={submitCommitReject}
            >
              {modalAction === "committed" ? "Commit Order" : "Reject Order"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modal}
        toggle={toggle}
        centered
        size="lg"
        className="border-0 for-custom-apply"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-soft-info" toggle={toggle}>
          {"Allocate Truck - "} <span>{selectedSO1}</span>
        </ModalHeader>
          <ModalBody className="modal-body">
            <p style={{fontEeight: 600,fontSize: "20px"}}>So Total Quantity : <span id="totalQty">{soTotalQty + " MT"}</span></p>
            <TableContainer
                columns={columnsTruck}
              //  data={(taskList || [])}
                data={truckDetails}
                isGlobalFilter={true}
                isGlobalSearch={true}
                customPageSize={5}
                className="custom-header-css"
                divClass="table-responsive table-card table-card1 mb-3"
                tableClass="align-middle table-nowrap mb-0"
                theadClass="table-light table-nowrap"
                thClass="table-light color-blue-bg text-muted"
                handleTaskClick={handleTaskClicks}
                SearchPlaceholder='Search for tasks or something...'
            />
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  setModal(false);
                }}
                className="btn-light"
              >Close</Button>
              <button type="submit" className="btn color-blue-bg" id="add-btn" onClick={() => { 
                allocateTruckDetail();
              }}>{"Allocate Truck"}</button>
            </div>
          </div>
      </Modal>

      <Modal
        isOpen={modal1}
        toggle={toggleModal}
        centered
        size="lg"
        className="border-0 for-custom-apply"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-soft-info" toggle={toggleModal}>
          {"Truck Details"}
        </ModalHeader>
          <ModalBody className="modal-body">
            <p style={{fontEeight: 600,fontSize: "20px"}}>So Total Quantity : <span id="totalQty">{soTotalQty + " MT"}</span></p>
            <TableContainer
                columns={columnsTruckView}
                data={truckDetailsForSoAndTrans}
                isGlobalFilter={true}
                isGlobalSearch={true}
                customPageSize={5}
                className="custom-header-css"
                divClass="table-responsive table-card table-card1 mb-3"
                tableClass="align-middle table-nowrap mb-0"
                theadClass="table-light table-nowrap"
                thClass="table-light color-blue-bg text-muted"
               // handleTaskClick={handleTaskClicks}
                SearchPlaceholder='Search for tasks or something...'
            />
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  setModal1(false);
                }}
                className="btn-light"
              >Close</Button>
            </div>
          </div>
      </Modal>
    </React.Fragment>
  );
};

export default AllTasksTransporter;