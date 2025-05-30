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


const AllTasks = ({ onTasksUpdated }) => {
  const dispatch = useDispatch();

//   const { taskList, isTaskCreated, isTaskSuccess, error } = useSelector((state) => ({
//     taskList: state.Tasks.taskList,
//     isTaskCreated: state.Tasks.isTaskCreated,
//     isTaskSuccess: state.Tasks.isTaskSuccess,
//     error: state.Tasks.error,
//   }));

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
  const [truckDetails, setTruckDetails] = useState([]);

  const [modalEdit, setModalEdit] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);

  //for pagination

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page
  const [totalPages, setTotalPages] = useState(1);
  const [load, setLoad] = useState(0);
  const [data, setData] = useState([]);
  const [setStatus, statusWise] = useState("total");

  const [soNumber, setSoNumber] = useState(null);
  const [selectedCodes, setSelectedCodes] = useState([]);

  const [cancelRemark, setCancelRemark] = useState("");
  const [selectedSO, setSelectedSO] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setTask(null);
    } else {
      setModal(true);
      setDate(defaultdate());
    }
  }, [modal]);

  const toggleEditModal = useCallback(() => {
    if (modalEdit) {
      setModalEdit(false);
    } else {
      setModalEdit(true);
    }
  }, [modalEdit]);

  const toggleCancelModal = useCallback(() => {
    if (modalCancel) {
      setModalCancel(false);
    } else {
      setModalCancel(true);
    }
  }, [modalCancel]);

  const toggleModal = useCallback((soNumber = null) => {
    if (modal1) {
      setModal1(false);
      setSelectedSO1(null);
      setTruckDetails([]);
    } else {
      if (soNumber) {
        setSelectedSO1(soNumber);
        fetchTruckDetails(soNumber); // call API
      }
      setModal1(true);
    }
  }, [modal1]);

  const fetchTruckDetails = async (soNumber) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL_URL_8085}/truckAllocation/getBySoNumberAndTransporter?soNumber=${soNumber}`,
        config
      );
  
      if (response) {
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
  
  // Delete Data
  const onClickDelete = (task) => {
    setTask(task);
    setDeleteModal(true);
  };

//   useEffect(() => {
//     let taskList = [{
//         "so_number":"12456",
//         "_id":1
//     }];
//     setTaskList(taskList);
//     console.log(TaskList);
//   },[]);

  // Delete Data
  const handleDeleteTask = () => {
    if (task) {
      dispatch(deleteTask(task._id));
      setDeleteModal(false);
    }
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      taskId: (task && task.taskId) || '',
      project: (task && task.project) || '',
      task: (task && task.task) || '',
      creater: (task && task.creater) || '',
      dueDate: (task && task.dueDate) || '',
      status: (task && task.status) || 'New',
      priority: (task && task.priority) || 'High',
      subItem: (task && task.subItem) || [],
    },
    validationSchema: Yup.object({
      taskId: Yup.string().required("Please Enter Task Id"),
      project: Yup.string().required("Please Enter Project Name"),
      task: Yup.string().required("Please Enter Your Task"),
      creater: Yup.string().required("Please Enter Creater Name"),
      // dueDate: Yup.string().required("Please Enter Due Date"),
      status: Yup.string().required("Please Enter Status"),
      priority: Yup.string().required("Please Enter Priority"),
      subItem: Yup.array().required("Please Enter")
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedTask = {
          _id: task ? task._id : 0,
          taskId: values.taskId,
          project: values.project,
          task: values.task,
          creater: values.creater,
          dueDate: date,
          status: values.status,
          priority: values.priority,
          subItem: values.subItem,
        };
        // update customer
        dispatch(updateTask(updatedTask));
        validation.resetForm();
      } else {
        const newTask = {
          _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          taskId: values["taskId"],
          project: values["project"],
          task: values["task"],
          creater: values["creater"],
          dueDate: date,
          status: values["status"],
          priority: values["priority"],
          subItem: values["subItem"],
        };
        // save new customer
        dispatch(addNewTask(newTask));
        validation.resetForm();
      }
      toggle();
    },
  });

  const handleCancelClick = useCallback((order) => {
    setSelectedSO(order?.orderNumber);
    setCancelRemark(""); // clear remark input
    toggleCancelModal();
  }, [toggleCancelModal]);

  // Update Data

  const handleCustomerClick = useCallback(async (arg) => {
    try {
      const config = {
        // headers: {
        //     'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"
        // },
        auth: {
            username: "amazin",
            password: "TE@M-W@RK",
        },
      };
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8085}/orderManagement/getTransporterBySoNumer/${arg.orderNumber}`,config);

      console.log(response);
  
      const assignedTransporters = response.map(t => t.transporterCode);
      setSelectedTransporterCodes1(assignedTransporters);
      setSoNumber(arg.orderNumber);
      setModalEdit(true);
    } catch (error) {
      console.error('Error fetching transporter data:', error);
    }
    toggleEditModal();
  }, [toggleEditModal]);

  // Add Data
  const handleTaskClicks = () => {
    setTask("");
    setIsEdit(false);
    toggle();
  };
  
  const columnsTruck = useMemo(
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

  const [selectedOrderIds, setSelectedOrderIds] = useState([]); // from SO table
  const [selectedTransporterCodes, setSelectedTransporterCodes] = useState([]);
  const [selectedTransporterCodes1, setSelectedTransporterCodes1] = useState([]);
    
  const [transporters, setTransporters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransporters = async () => {
      const config = {
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"
          },
          auth: {
              username: "amazin",
              password: "TE@M-W@RK",
          },
      };
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8085}/api/transporters/all?plantCode=N205`, config);
        console.log(response);
        setTransporters(response);
      } catch (err) {
        setError('Error: ' + err.message);
      }
    };

    fetchTransporters();
  }, []);

  const isAllSelected = transporters.length > 0 && transporters.every(item =>
    selectedTransporterCodes.includes(item.code)
  );

  const handleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all
      setSelectedTransporterCodes(prev =>
        prev.filter(code => !transporters.map(item => item.code).includes(code))
      );
    } else {
      // Select all visible rows
      const newCodes = transporters
        .map(item => item.code)
        .filter(code => !selectedTransporterCodes.includes(code));

      setSelectedTransporterCodes(prev => [...prev, ...newCodes]);
    }
  };

  const handleSingleCheck = (code) => {
    if (selectedTransporterCodes.includes(code)) {
      setSelectedTransporterCodes(prev => prev.filter(c => c !== code));
    } else {
      setSelectedTransporterCodes(prev => [...prev, code]);
    }
  };

  const columns1 = useMemo(() => [
    {
    Header: (
      <input
        type="checkbox"
        id="checkBoxAll"
        className="form-check-input"
        checked={isAllSelected}
        onChange={handleSelectAll}
      />
    ),
    id: 'checkbox',
    Cell: ({ row }) => {
      const code = row.original.code;
      return (
        <input
          type="checkbox"
          className="form-check-input taskCheckBox"
          checked={selectedTransporterCodes.includes(code)}
          onChange={() => handleSingleCheck(code)}
        />
      );
    },
  },
  {
    Header: "Transporter Code",
    accessor: "code",
    filterable: false,
  },
  {
    Header: "Transporter Name",
    accessor: "name",
    filterable: false,
  },
  {
    Header: "Location",
    accessor: "city",
    filterable: false,
  },
  {
    Header: "Contact Person",
    accessor: "contactPerson",
    filterable: false,
  },
  {
    Header: "Contact Number",
    accessor: "contactNumber",
    filterable: false,
  },
], [transporters, selectedTransporterCodes]);

const columns_edit = useMemo(() => [
  {
    Header: (
      <input
        type="checkbox"
        id="checkBoxAll"
        className="form-check-input"
        checked={transporters.length > 0 && transporters.every(t => selectedTransporterCodes1.includes(t.code))}
        onChange={(e) => {
          const allCodes = transporters.map(t => t.code);
          if (e.target.checked) {
            setSelectedTransporterCodes1(allCodes);
          } else {
            setSelectedTransporterCodes1([]);
          }
        }}
      />
    ),
    id: 'checkbox',
    Cell: ({ row }) => {
      const code = row.original.code;
      return (
        <input
          type="checkbox"
          className="form-check-input"
          checked={selectedTransporterCodes1.includes(code)}
          onChange={() => {
            if (selectedTransporterCodes1.includes(code)) {
              setSelectedTransporterCodes1(prev => prev.filter(c => c !== code));
            } else {
              setSelectedTransporterCodes1(prev => [...prev, code]);
            }
          }}
        />
      );
    },
  },
  {
    Header: "Transporter Code",
    accessor: "code",
    filterable: false,
  },
  {
    Header: "Transporter Name",
    accessor: "name",
    filterable: false,
  },
  {
    Header: "Location",
    accessor: "city",
    filterable: false,
  },
  {
    Header: "Contact Person",
    accessor: "contactPerson",
    filterable: false,
  },
  {
    Header: "Contact Number",
    accessor: "contactNumber",
    filterable: false,
  },
], [transporters, selectedTransporterCodes1]);

  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
  //       Cell: (cellProps) => {
  //         return <input type="checkbox" className="taskCheckBox form-check-input" value={cellProps.row.original._id} />;
  //       },
  //       id: '#',
  //     },
  //     {
  //       Header: "SO Number",
  //       accessor: "so_number",
  //       filterable: false,
  //     },
  //     {
  //       Header: "SO Item",
  //       accessor: "so_item",
  //       filterable: false,
  //       // Cell: (cellProps) => {
  //       //   return <Project {...cellProps} />;
  //       // },
  //     },
  //     {
  //       Header: "Order Quantity",
  //       accessor: "task4",
  //       filterable: false,
  //     },
  //     {
  //       Header: "Allocated Qty",
  //       accessor: "project12",
  //       filterable: false,
  //     },
  //     {
  //       Header: "Available Qty.",
  //       accessor: "project11",
  //       filterable: false,
  //     },
  //     {
  //       Header: "City Desc",
  //       accessor: "project10",
  //       filterable: false,
  //     },
  //     {
  //       Header: "Material",
  //       accessor: "project9",
  //       filterable: false,
  //     },
  //     {
  //       Header: "Ship To Party",
  //       accessor: "project8",
  //       filterable: false,
  //     },
  //     {
  //       Header: "Ship To Party Name",
  //       accessor: "project7",
  //       filterable: false,
  //     },
  //     {
  //       Header: "Date/Time to Reach Yard",
  //       accessor: "project6",
  //       filterable: false,
  //     },
  //     {
  //       Header: "Vehicle Details",
  //       accessor: "project2",
  //       filterable: false,
  //       Cell: (cellProps) => {
  //           return <React.Fragment>
  //               <Link to="#" onClick={() => { toggleModal(); }}>
  //                   <i className="ri-eye-fill color-g align-bottom me-2 fs-22 text-muted" style={{color: "rgba(10, 179, 156,1) !important"}}></i>
  //               </Link>
  //           </React.Fragment>;
  //       },
  //     },
  //     {
  //       Header: "Order Priority",
  //       accessor: "project1",
  //       filterable: false,
  //       Cell: (cellProps) => {
  //           return <input type="checkbox" className="taskCheckBox form-check-input" value={cellProps.row.original._id} onChange={() => deleteCheckbox()} />;
  //         },
  //     },
  //     {
  //       Header: "SO Status",
  //       accessor: "status",
  //       filterable: false,
  //       Cell: (cellProps) => {
  //         return <Priority {...cellProps} />;
  //       },
  //     },
  //     {
  //       Header: "Cancel Order",
  //       accessor: "task1",
  //       filterable: false,
  //       Cell: (cellProps) => {
  //         return <React.Fragment>
  //                   <Link to="#" onClick={() => { const taskData = cellProps.row.original; handleCancelClick(taskData); }}>
  //                     <Button className='btn btn-danger' style={{padding:"5px"}}>Cancel</Button>
  //                   </Link>
  //               </React.Fragment>;
  //       },
  //     },
  //     {
  //       Header: "Transporter Detail",
  //       accessor: "task2",
  //       filterable: false,
  //       Cell: (cellProps) => {
  //         return <React.Fragment>
  //                   <Link to="#" onClick={() => { const taskData = cellProps.row.original; handleCustomerClick(taskData); }}>
  //                     <Button className='btn color-blue-bg p-10' style={{padding:"5px",border:"1px solid #405189"}}>Edit Transporter</Button>
  //                   </Link>
  //               </React.Fragment>;
  //       },
  //     }
  //   ],
  //   [handleCustomerClick, checkedAll]
  // );

   const [devices, setDevice] = useState([]);

    useEffect(() => {
        getAllDeviceData();    
    }, []);

    const columns2 = [
    { Header: "SO Number", accessor: "soNumber" }
    ];
    

const getAllDeviceData = () => {
    // const values = {};
    // values["tagId"] = "";
    // values["masterLocationId"] = "";
    // axios.post(`${process.env.REACT_APP_LOCAL_URL_8085}/GateDataController/gateOutDashboardData`,values)
    //     .then(res => {
        //const device = res;
        
        const data = [
            {
            _id: "1",
            so_number: "SO-12345",
            so_item: "Item-001",
            task4: "500", // Order Quantity
            project12: "450", // Allocated Qty
            project11: "50",  // Available Qty
            project10: "Delhi", // City Desc
            project9: "Steel Bars", // Material
            project8: "Party001", // Ship To Party
            project7: "ABC Enterprises", // Ship To Party Name
            project6: "2025-05-01 14:00", // Date/Time to Reach Yard
            project2: "MH12AB1234 - Tata Ace", // Vehicle Details
            project1: "High", // Order Priority
            status: "Pending", // SO Status
            task1: "Yes", // Cancel Order
            task2: "XYZ Transport Co." // Transporter Detail
            },
            {
            _id: "2",
            so_number: "SO-12346",
            so_item: "Item-002",
            task4: "300",
            project12: "300",
            project11: "0",
            project10: "Mumbai",
            project9: "Cement Bags",
            project8: "Party002",
            project7: "XYZ Traders",
            project6: "2025-05-02 10:00",
            project2: "MH14CD5678 - Ashok Leyland",
            project1: "Medium",
            status: "Completed",
            task1: "No",
            task2: "PQR Logistics"
            }
        ];
        setDevice(data);
   // });
  }

  const defaultdate = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
  };

  const [date, setDate] = useState(defaultdate());

  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
  };

  // for pagination

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
          "search":string1,
          "page":(currentPage - 1),
          "size":itemsPerPage
        };
        const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8085}/salesorder_allocation/filter`,payload,config);
        const ab = response;
        // const ab = {
        //   "totalElements": 3,
        //   "content": [
        //       {
        //           "soStatus": "Processing",
        //           "companyCode": "1000",
        //           "plant": "N205",
        //           "salesOrganization": "SO01",
        //           "distributionChannel": "10",
        //           "division": "01",
        //           "shipToRegion": "NY",
        //           "regionDesc": "North-East",
        //           "salesDocumentType": "OR",
        //           "salesDocNumber": "SD12345",
        //           "webOrderNo": "WEB12345",
        //           "orderNumber": "SO12345",
        //           "soldToParty": "SOLD001",
        //           "soldToPartyName": "Sold To Ltd.",
        //           "shipToParty": "SHIP001",
        //           "shipToPartyName": "Ship To Inc.",
        //           "soldToSalesOffice": "SOFF001",
        //           "shipToCountyCode": "NYCNTY001",
        //           "countyDesc": "New York County",
        //           "shipToCityCode": "NYC001",
        //           "cityDesc": "New York",
        //           "blockedSoInd": "N",
        //           "incoTerms": "CIF",
        //           "materialCode": "MAT001",
        //           "materialDesc": "Widget A",
        //           "matGr1": "MG1",
        //           "matGr2": "MG2",
        //           "matPriceGroup": "MPG1",
        //           "routeCode": "RC01",
        //           "routeDesc": "North-East Route",
        //           "transporterCode": "T001",
        //           "transporterName": "TransportX",
        //           "orderQuantity": "100",
        //           "docDate": "2025-04-24",
        //           "reasonForRejection": null,
        //           "creationDate": "2025-04-25",
        //           "creationTime": "2025-04-25T08:30:00",
        //           "idocNum": "IDOC123",
        //           "assignedStatus": 1
        //       },
        //       {
        //           "soStatus": "Confirmed",
        //           "companyCode": "1000",
        //           "plant": "N205",
        //           "salesOrganization": "SO01",
        //           "distributionChannel": "20",
        //           "division": "02",
        //           "shipToRegion": "IL",
        //           "regionDesc": "Mid-West",
        //           "salesDocumentType": "ZR",
        //           "salesDocNumber": "SD12346",
        //           "webOrderNo": "WEB12346",
        //           "orderNumber": "SO12346",
        //           "soldToParty": "SOLD002",
        //           "soldToPartyName": "Customer ABC",
        //           "shipToParty": "SHIP002",
        //           "shipToPartyName": "Another Ship To",
        //           "soldToSalesOffice": "SOFF002",
        //           "shipToCountyCode": "COOK001",
        //           "countyDesc": "Cook County",
        //           "shipToCityCode": "CHI001",
        //           "cityDesc": "Chicago",
        //           "blockedSoInd": "N",
        //           "incoTerms": "FOB",
        //           "materialCode": "MAT002",
        //           "materialDesc": "Widget B",
        //           "matGr1": "MG3",
        //           "matGr2": "MG4",
        //           "matPriceGroup": "MPG2",
        //           "routeCode": "RC02",
        //           "routeDesc": "Mid-West Route",
        //           "transporterCode": "T002",
        //           "transporterName": "TransportY",
        //           "orderQuantity": "200",
        //           "docDate": "2025-04-25",
        //           "reasonForRejection": null,
        //           "creationDate": "2025-04-26",
        //           "creationTime": "2025-04-26T10:45:00",
        //           "idocNum": "IDOC124",
        //           "assignedStatus": 1
        //       },
        //       {
        //           "soStatus": "Blocked",
        //           "companyCode": "2000",
        //           "plant": "N305",
        //           "salesOrganization": "SO02",
        //           "distributionChannel": "30",
        //           "division": "03",
        //           "shipToRegion": "CA",
        //           "regionDesc": "West",
        //           "salesDocumentType": "OR",
        //           "salesDocNumber": "SD12347",
        //           "webOrderNo": "WEB12347",
        //           "orderNumber": "SO12347",
        //           "soldToParty": "SOLD003",
        //           "soldToPartyName": "Big Buyer Inc.",
        //           "shipToParty": "SHIP003",
        //           "shipToPartyName": "LA Distributors",
        //           "soldToSalesOffice": "SOFF003",
        //           "shipToCountyCode": "LA001",
        //           "countyDesc": "LA County",
        //           "shipToCityCode": "LA001",
        //           "cityDesc": "Los Angeles",
        //           "blockedSoInd": "Y",
        //           "incoTerms": "CIF",
        //           "materialCode": "MAT003",
        //           "materialDesc": "Gadget X",
        //           "matGr1": "MG5",
        //           "matGr2": "MG6",
        //           "matPriceGroup": "MPG3",
        //           "routeCode": "RC03",
        //           "routeDesc": "West Coast Route",
        //           "transporterCode": "T003",
        //           "transporterName": "TransportZ",
        //           "orderQuantity": "150",
        //           "docDate": "2025-04-26",
        //           "reasonForRejection": "Out of stock",
        //           "creationDate": "2025-04-27",
        //           "creationTime": "2025-04-27T11:15:00",
        //           "idocNum": "IDOC125",
        //           "assignedStatus": 0
        //       }
        //   ]
        // };
        // const { items, totalItems } = ab.data.content;
        const { items, totalItems } = ab.content;
        setData(ab.content);
        setTotalPages(ab.totalElements);
      } else {
        const payload = {
          "page":(currentPage - 1),
          "size":itemsPerPage
        };
        const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8085}/salesorder_allocation/filter`,payload,config);
        const ab = response;
        // const ab = {
        //   "totalElements": 3,
        //   "content": [
        //       {
        //           "soStatus": "Processing",
        //           "companyCode": "1000",
        //           "plant": "N205",
        //           "salesOrganization": "SO01",
        //           "distributionChannel": "10",
        //           "division": "01",
        //           "shipToRegion": "NY",
        //           "regionDesc": "North-East",
        //           "salesDocumentType": "OR",
        //           "salesDocNumber": "SD12345",
        //           "webOrderNo": "WEB12345",
        //           "orderNumber": "SO12345",
        //           "soldToParty": "SOLD001",
        //           "soldToPartyName": "Sold To Ltd.",
        //           "shipToParty": "SHIP001",
        //           "shipToPartyName": "Ship To Inc.",
        //           "soldToSalesOffice": "SOFF001",
        //           "shipToCountyCode": "NYCNTY001",
        //           "countyDesc": "New York County",
        //           "shipToCityCode": "NYC001",
        //           "cityDesc": "New York",
        //           "blockedSoInd": "N",
        //           "incoTerms": "CIF",
        //           "materialCode": "MAT001",
        //           "materialDesc": "Widget A",
        //           "matGr1": "MG1",
        //           "matGr2": "MG2",
        //           "matPriceGroup": "MPG1",
        //           "routeCode": "RC01",
        //           "routeDesc": "North-East Route",
        //           "transporterCode": "T001",
        //           "transporterName": "TransportX",
        //           "orderQuantity": "100",
        //           "docDate": "2025-04-24",
        //           "reasonForRejection": null,
        //           "creationDate": "2025-04-25",
        //           "creationTime": "2025-04-25T08:30:00",
        //           "idocNum": "IDOC123",
        //           "assignedStatus": 1
        //       },
        //       {
        //           "soStatus": "Confirmed",
        //           "companyCode": "1000",
        //           "plant": "N205",
        //           "salesOrganization": "SO01",
        //           "distributionChannel": "20",
        //           "division": "02",
        //           "shipToRegion": "IL",
        //           "regionDesc": "Mid-West",
        //           "salesDocumentType": "ZR",
        //           "salesDocNumber": "SD12346",
        //           "webOrderNo": "WEB12346",
        //           "orderNumber": "SO12346",
        //           "soldToParty": "SOLD002",
        //           "soldToPartyName": "Customer ABC",
        //           "shipToParty": "SHIP002",
        //           "shipToPartyName": "Another Ship To",
        //           "soldToSalesOffice": "SOFF002",
        //           "shipToCountyCode": "COOK001",
        //           "countyDesc": "Cook County",
        //           "shipToCityCode": "CHI001",
        //           "cityDesc": "Chicago",
        //           "blockedSoInd": "N",
        //           "incoTerms": "FOB",
        //           "materialCode": "MAT002",
        //           "materialDesc": "Widget B",
        //           "matGr1": "MG3",
        //           "matGr2": "MG4",
        //           "matPriceGroup": "MPG2",
        //           "routeCode": "RC02",
        //           "routeDesc": "Mid-West Route",
        //           "transporterCode": "T002",
        //           "transporterName": "TransportY",
        //           "orderQuantity": "200",
        //           "docDate": "2025-04-25",
        //           "reasonForRejection": null,
        //           "creationDate": "2025-04-26",
        //           "creationTime": "2025-04-26T10:45:00",
        //           "idocNum": "IDOC124",
        //           "assignedStatus": 1
        //       },
        //       {
        //           "soStatus": "Blocked",
        //           "companyCode": "2000",
        //           "plant": "N305",
        //           "salesOrganization": "SO02",
        //           "distributionChannel": "30",
        //           "division": "03",
        //           "shipToRegion": "CA",
        //           "regionDesc": "West",
        //           "salesDocumentType": "OR",
        //           "salesDocNumber": "SD12347",
        //           "webOrderNo": "WEB12347",
        //           "orderNumber": "SO12347",
        //           "soldToParty": "SOLD003",
        //           "soldToPartyName": "Big Buyer Inc.",
        //           "shipToParty": "SHIP003",
        //           "shipToPartyName": "LA Distributors",
        //           "soldToSalesOffice": "SOFF003",
        //           "shipToCountyCode": "LA001",
        //           "countyDesc": "LA County",
        //           "shipToCityCode": "LA001",
        //           "cityDesc": "Los Angeles",
        //           "blockedSoInd": "Y",
        //           "incoTerms": "CIF",
        //           "materialCode": "MAT003",
        //           "materialDesc": "Gadget X",
        //           "matGr1": "MG5",
        //           "matGr2": "MG6",
        //           "matPriceGroup": "MPG3",
        //           "routeCode": "RC03",
        //           "routeDesc": "West Coast Route",
        //           "transporterCode": "T003",
        //           "transporterName": "TransportZ",
        //           "orderQuantity": "150",
        //           "docDate": "2025-04-26",
        //           "reasonForRejection": "Out of stock",
        //           "creationDate": "2025-04-27",
        //           "creationTime": "2025-04-27T11:15:00",
        //           "idocNum": "IDOC125",
        //           "assignedStatus": 0
        //       }
        //   ]
        // };
        const { items, totalItems } = ab.content;
        setData(ab.content);
        setTotalPages(ab.totalElements);
        onTasksUpdated();
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

  const statusMap = {
    assigned: "badge-soft-success",
    committed: "badge-soft-warning",
    truckallocated: "badge-soft-info",
    rejected: "badge-soft-danger",
    cancelled: "badge-soft-secondary",
    notassigned: "badge-soft-dark"
  };
  
  const renderStatusBadge = (item) => {
    const className = statusMap[item] || "badge-soft-light";
    return <span className={`badge text-uppercase ${className}`}>{item}</span>;
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

  const assignTransporterSubmit = async () => {
    console.log("Selected Transporter Codes:", selectedTransporterCodes);
    console.log("Selected Sales Order Codes:", selectedOrderIds);
  
    const payload = {
      soNumber: selectedOrderIds, // e.g., ["SO12345", "SO12346"]
      transporterCode: selectedTransporterCodes, // e.g., ["916001837", "916003852"]
      // orderPriority: true,
      createdBy: "Robert", // Make dynamic if needed
      plantCode: "N205"    // Make dynamic if needed
    };
  
    const config = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"
        },
        auth: {
            username: "amazin",
            password: "TE@M-W@RK",
        },
    };

    if(selectedTransporterCodes.length > 0){
      try {
        const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8085}/orderManagement`, payload, config);
        console.log("API Response:", response);
        if(!response.errorMsg){
          toast.success("Transporter Assigned Successfully!");
          fetchData(1, itemsPerPage, "total");
        }else{
          toast.error("Something went wrong !!");
        }
        
        setSelectedTransporterCodes([]);
        setSelectedOrderIds([]);
        toggle();
      } catch (error) {
        console.error("Error assigning transporter:", error);
        toast.error("Failed to assign transporter. Please try again.");
        
        setSelectedTransporterCodes([]);
        setSelectedOrderIds([]);
        toggle();
      }
    }else{
      toast.error("Select one transporter atleast.");
      
      setSelectedTransporterCodes([]);
      setSelectedOrderIds([]);
      toggle();
    }
  };  

  const submitEditTransporter = () => {
    
    const soNumbers = [soNumber];
    const payload = {
      soNumber: soNumbers, // e.g., ["SO12345", "SO12346"]
      transporterCode: selectedTransporterCodes1,      
      createdBy: "user01", // Make dynamic if needed
      plantCode: "N205"    // Make dynamic if needed
    };
  
    const config = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"
        },
        auth: {
            username: "amazin",
            password: "TE@M-W@RK",
        },
    };
    
    if(selectedTransporterCodes1.length > 0){
      try {
        const response = axios.post(`${process.env.REACT_APP_LOCAL_URL_8085}/orderManagement`, payload, config);
        if(!response.errorMsg){
          toast.success("Transporter Updated Successfully!");
          setSelectedTransporterCodes1([]);
          setSoNumber(null);
          fetchData(1, itemsPerPage, "total");
        }else{
          setSelectedTransporterCodes1([]);
          setSoNumber(null);
          toast.error("Something went wrong !!");
        }
      } catch (error) {
        setSelectedTransporterCodes1([]);
        setSoNumber(null);
        console.error("Error assigning transporter:", error);
        toast.error("Failed to assign transporter. Please try again.");
      }
    }else{
      setSelectedTransporterCodes1([]);
      setSoNumber(null);
      toast.error("Select one transporter atleast.");
    }

    toggleEditModal();
  }

  const handlePriorityToggle = async (soNumber, isChecked) => {
    const orderPriority = isChecked ? "1" : "0"; // convert to string as API expects
    
    const config = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"
      },
      auth: {
          username: "amazin",
          password: "TE@M-W@RK",
      },
    };
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LOCAL_URL_8085}/orderPriority`,
        {
          "soNumber":soNumber,
          "priorityCheck":orderPriority,
        },config
      );
  
      if (!response.errorMsg) {
        toast.success("Order priority updated successfully");
        fetchData(1, itemsPerPage, "total");
        // Optional: Refresh data or update local state if needed
      } else {
        toast.error("Failed to update order priority");
      }
    } catch (error) {
      toast.error("Error updating order priority:", error);
    }
  };  

  const submitCancelOrder = async () => {
    //alert("dffg");
    if (!cancelRemark || !selectedSO) {
      //alert("hello");
      toast.error("Please enter remark and so number");
      return false;
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LOCAL_URL_8085}/salesorder_allocation/cancelSalesOrder`,
        {
          soNumber: selectedSO,
          remarks: cancelRemark,
          orderStatus: "cancelled",
          userId: sessionStorage.getItem("authUser") ? JSON.parse(sessionStorage.getItem("authUser")).data._id : null,
        },config
      );
  
      if (!response.erroMsg) {
        toast.success("Order cancelled successfully");
        toggleCancelModal();
        fetchData(1, itemsPerPage, "total");
        // Optionally refresh data
      } else {
        toast.error("Cancel failed");
      }
    } catch (error) {
      toast.error("Error cancelling order:"+ error);
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
                <button className="btn btn-success add-btn me-1 for-new-css-1" onClick={() => { 
                  if(selectedOrderIds.length > 0){ 
                  setIsEdit(false); toggle();
                 }else{
                  toast.error("Please select atleast one SO Number");
                 } }}><i className="ri-add-line align-bottom me-1"></i> Assign Transporter</button>
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
                      {visibleColumns.checkbox && (
                        <th class="color-blue-bg">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            onChange={(e) => {
                              if (e.target.checked) {
                                const eligibleIds = data
                                  .filter(d => d.assignedStatus !== 1) // Exclude already assigned
                                  .map(d => d.orderNumber);
                                const newIds = eligibleIds.filter(id => !selectedOrderIds.includes(id));
                                setSelectedOrderIds(prev => [...prev, ...newIds]);
                              } else {
                                const allPageIds = data
                                  .filter(d => d.assignedStatus !== 1) // Only unassigned rows
                                  .map(d => d.orderNumber);
                                setSelectedOrderIds(prev => prev.filter(id => !allPageIds.includes(id)));
                              }
                            }}
                          />
                        </th>
                      )}
                      {visibleColumns.soNumber && <th  class="color-blue-bg">SO Number</th>}
                      {visibleColumns.soItem && <th class="color-blue-bg">SO Item</th>}
                      {visibleColumns.orderQuantity && <th class="color-blue-bg">Order Quantity</th>}
                      {visibleColumns.allocatedQty && <th class="color-blue-bg">Allocated Qty</th>}
                      {visibleColumns.availableQty && <th class="color-blue-bg">Available Qty.</th>}
                      {visibleColumns.cityDesc && <th class="color-blue-bg">City Desc</th>}
                      {visibleColumns.material && <th class="color-blue-bg">Material</th>}
                      {visibleColumns.shipToParty && <th class="color-blue-bg">Ship To Party</th>}
                      {visibleColumns.shipToPartyName && <th class="color-blue-bg">Ship To Party Name</th>}
                      {visibleColumns.dateTimeReachYard && <th class="color-blue-bg">Date/Time to Reach Yard</th>}
                      {visibleColumns.vehicleDetails && <th class="color-blue-bg">Vehicle Details</th>}
                      {visibleColumns.orderPriority && <th class="color-blue-bg">Order Priority</th>}
                      {visibleColumns.soStatus && <th class="color-blue-bg">SO Status</th>}
                      {visibleColumns.cancelOrder && <th class="color-blue-bg">Cancel Order</th>}
                      {visibleColumns.transporterDetail && <th class="color-blue-bg">Transporter Detail</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={index}>
                          {visibleColumns.checkbox && (
                            <td>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                disabled={item.assignedStatus === 1}
                                checked={
                                  item.assignedStatus === 1
                                    ? true // Always checked if already assigned
                                    : selectedOrderIds.includes(item.orderNumber) // Else, controlled by state
                                }
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const id = item.orderNumber;
                            
                                  if (checked) {
                                    setSelectedOrderIds(prev => [...prev, id]);
                                  } else {
                                    setSelectedOrderIds(prev => prev.filter(x => x !== id));
                                  }
                                }}
                              />
                            </td>                          
                          )}
                          {visibleColumns.soNumber && <td>{item.orderNumber}</td>}
                          {visibleColumns.soItem && <td>{item.so_item}</td>}
                          {visibleColumns.orderQuantity && <td>{item.orderQuantity}</td>}
                          {visibleColumns.allocatedQty && <td>{item.project12}</td>}
                          {visibleColumns.availableQty && <td>{item.project11}</td>}
                          {visibleColumns.cityDesc && <td>{item.cityDesc}</td>}
                          {visibleColumns.material && <td>{item.materialCode}</td>}
                          {visibleColumns.shipToParty && <td>{item.shipToParty}</td>}
                          {visibleColumns.shipToPartyName && <td>{item.shipToPartyName}</td>}
                          {visibleColumns.dateTimeReachYard && <td>{item.creationTime}</td>}
                          {visibleColumns.vehicleDetails && (
                            <td>
                              <a
                                href="#"
                                onClick={() => {
                                  if (item.soStatus === 3) {
                                    toggleModal(item.orderNumber);
                                  }
                                }}
                                style={{
                                  pointerEvents: item.soStatus === 3 ? "auto" : "none",
                                  opacity: item.soStatus === 3 ? 1 : 0.5,
                                }}
                              >
                                <i className="ri-eye-fill color-g align-bottom me-2 fs-22 text-muted"></i>
                              </a>
                            </td>
                          )}
                          {visibleColumns.orderPriority && (
                            <td>
                              <input type="checkbox" name="orderPriority" 
                              checked={
                                item.priorityStatus === 1
                                  ? true // Always checked if already assigned
                                  : selectedIds.includes(item.orderNumber) // Else, use state
                              }
                              className="form-check-input"
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const id = item.orderNumber;

                                setSelectedIds((prev) =>
                                  checked
                                    ? [...prev, id]            // Add if checked
                                    : prev.filter((x) => x !== id) // Remove if unchecked
                                );
                                handlePriorityToggle(item.orderNumber, e.target.checked)
                              }} />
                            </td>
                          )}
                          {visibleColumns.soStatus && <td>
                            <Priority data={item.soStatus} />
                            {/* {renderStatusBadge(item.soStatus)} */}
                          </td>}
                          {visibleColumns.cancelOrder && (
                            <td>
                              <button
                                className="btn btn-danger"
                                style={{ padding: "5px" }}
                                disabled={
                                  ![1, 0].includes(item.soStatus)
                                }
                                onClick={() => handleCancelClick(item)}
                              >
                                Cancel
                              </button>
                            </td>
                          )}
                          {visibleColumns.transporterDetail && (
                            <td>
                              <button
                                className="btn color-blue-bg"
                                style={{
                                  padding: "5px",
                                  border: "1px solid #405189",
                                }}
                                disabled={item.soStatus !== 1}
                                onClick={() => handleCustomerClick(item)}
                              >
                                Edit Transporter
                              </button>
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
        isOpen={modal}
        toggle={toggle}
        centered
        size="lg"
        className="border-0 for-custom-apply"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-soft-info" toggle={toggle}>
          {"Assign Transporter"}
        </ModalHeader>
          <ModalBody className="modal-body">
            <TableContainer
                columns={columns1}
              //  data={(taskList || [])}
                data={transporters}
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
              <button type="button" onClick={() => 
                 {
                  assignTransporterSubmit();
                }} className="btn color-blue-bg" id="add-btn">{"Assign Transporter"}</button>
            </div>
          </div>
      </Modal>

      <Modal
        isOpen={modalEdit}
        toggle={toggleEditModal}
        centered
        size="lg"
        className="border-0 for-custom-apply"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-soft-info" toggle={toggleEditModal}>
          {"Edit Transporter"}
        </ModalHeader>
          <ModalBody className="modal-body">
            <TableContainer
                columns={columns_edit}
              //  data={(taskList || [])}
                data={transporters}
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
              <button type="button" className="btn color-blue-bg" onClick={() => { submitEditTransporter(); }} id="add-btn">{"Edit Transporter"}</button>
            </div>
          </div>
      </Modal> 

      <Modal
        isOpen={modalCancel}
        toggle={toggleCancelModal}
        centered
        size="md"
        className="border-0"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-soft-info" toggle={toggleCancelModal}>
          {"Cancel Order"}
        </ModalHeader>
          <ModalBody className="modal-body">
            <div class="form-group">
                <label>Add Remark <span style={{color:"red"}}>*</span></label>
                <textarea class="form-control" row={7} value={cancelRemark} 
                  onChange={(e) => setCancelRemark(e.target.value)} placeholder='Enter Remark'></textarea>
            </div>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <button type="submit" className="btn color-blue-bg" onClick={() => { submitCancelOrder(); }} id="add-btn">{"Cancel Order"}</button>
            </div>
          </div>
      </Modal>        

      <Modal
        isOpen={modal1}
        toggle={toggleModal}
        centered
        size="lg"
        className="border-0"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-soft-info" toggle={toggleModal}>
          {"Truck Details"}
        </ModalHeader>
          <ModalBody className="modal-body">
            <TableContainer
                columns={columnsTruck}
                data={truckDetails}
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

export default AllTasks;