import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TableContainer from '../../Components/Common/TableContainer';
import DeleteModal from "../../Components/Common/DeleteModal";
import { Col, Modal, ModalBody, Row, Label, Input, Button, ModalHeader, FormFeedback, Form } from 'reactstrap';

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


const AllTasksPerformance = () => {
  const dispatch = useDispatch();

//   const { taskList, isTaskCreated, isTaskSuccess, error } = useSelector((state) => ({
//     taskList: state.Tasks.taskList,
//     isTaskCreated: state.Tasks.isTaskCreated,
//     isTaskSuccess: state.Tasks.isTaskSuccess,
//     error: state.Tasks.error,
//   }));


  const [isEdit, setIsEdit] = useState(false);
  const [task, setTask] = useState([]);
  const [TaskList, setTaskList] = useState([]);

  // Delete Task
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);

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

  const toggleModal = useCallback(() => {
    if (modal1) {
      setModal1(false);
    } else {
      setModal1(true);
    }
  }, [modal1]);

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

  const handleCancelClick = useCallback((arg) => {
    toggleCancelModal();
  }, [toggleCancelModal]);
  // Update Data
  const handleCustomerClick = useCallback((arg) => {
    toggleEditModal();
  }, [toggleEditModal]);

  // Add Data
  const handleTaskClicks = () => {
    setTask("");
    setIsEdit(false);
    toggle();
  };

//   useEffect(() => {
//     if (!isEmpty(TaskList)) setTaskList(TaskList);
//   }, [TaskList]);

//   useEffect(() => {
//     if (taskList && !taskList.length) {
//       dispatch(getTaskList());
//     }
//   }, [dispatch, taskList]);


//   useEffect(() => {
//     setTaskList(taskList);
//   }, [taskList]);

//   useEffect(() => {
//     if (!isEmpty(taskList)) {
//       setTaskList(taskList);
//       setIsEdit(false);
//     }
//   }, [taskList]);

  // Node API 
  // useEffect(() => {
  //   if (isTaskCreated) {
  //     setTask(null);
  //     dispatch(getTaskList());
  //   }
  // }, [
  //   dispatch,
  //   isTaskCreated,
  // ]);

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".taskCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(deleteTask(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".taskCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  
  const columnsTruck = useMemo(
    () => [
      {
        Header: "Vehicle No",
        accessor: "taskId",
        filterable: false,
        Cell: (cellProps) => {
          return <OrdersId {...cellProps} />;
        },
      },
      {
        Header: "Chassis Number",
        accessor: "transporter_name",
        filterable: false,
        Cell: (cellProps) => {
          return <Project {...cellProps} />;
        },
      },
      {
        Header: "Truck Max Capacity",
        accessor: "location",
        filterable: false,
        Cell: (cellProps) => {
          return <Project {...cellProps} />;
        },
      },
      {
        Header: "Unladen bed Capacity",
        accessor: "contact_person",
        filterable: false,
        Cell: (cellProps) => {
          return <Project {...cellProps} />;
        },
      },
      {
        Header: "Status",
        accessor: "contact_number",
        filterable: false,
        Cell: (cellProps) => {
          return <Priority {...cellProps} />;
        },
      },
    ],
    []
    );
  
  const columns1 = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" />,
        Cell: (cellProps) => {
          return <input type="checkbox" className="taskCheckBox form-check-input" />;
        },
        id: '#',
      },
      {
        Header: "Transporter Code",
        accessor: "taskId",
        filterable: false,
        Cell: (cellProps) => {
          return <OrdersId {...cellProps} />;
        },
      },
      {
        Header: "Transporter Name",
        accessor: "transporter_name",
        filterable: false,
        Cell: (cellProps) => {
          return <Project {...cellProps} />;
        },
      },
      {
        Header: "Location",
        accessor: "location",
        filterable: false,
        Cell: (cellProps) => {
          return <Project {...cellProps} />;
        },
      },
      {
        Header: "Contact Person",
        accessor: "contact_person",
        filterable: false,
        Cell: (cellProps) => {
          return <Project {...cellProps} />;
        },
      },
      {
        Header: "Contact Number",
        accessor: "contact_number",
        filterable: false,
        Cell: (cellProps) => {
          return <Project {...cellProps} />;
        },
      },
    ],
    []
    );

    

  const columns = useMemo(
    () => [
      {
        Header: "Transporter Name",
        accessor: "so_number",
        filterable: false,
      },
      {
        Header: "Assigned",
        accessor: "so_item",
        filterable: false,
        // Cell: (cellProps) => {
        //   return <Project {...cellProps} />;
        // },
      },
      {
        Header: "Committed",
        accessor: "task4",
        filterable: false,
      },
      {
        Header: "Truck Allocated",
        accessor: "project12",
        filterable: false,
      },
      {
        Header: "LR Created",
        accessor: "project11",
        filterable: false,
      },
      {
        Header: "No. Of Order Rejected",
        accessor: "project10",
        filterable: false,
      },
      {
        Header: "System Revoked",
        accessor: "project9",
        filterable: false,
      },
      {
        Header: "Logistics Revoked",
        accessor: "project8",
        filterable: false,
      },
      {
        Header: "Canceled",
        accessor: "project7",
        filterable: false,
      },
      {
        Header: "Not Allowed Orders",
        accessor: "project6",
        filterable: false,
      },
      {
        Header: "Not In Queue",
        accessor: "project2",
        filterable: false,
      },
      {
        Header: "DI Delete",
        accessor: "project1",
        filterable: false,
      },
      {
        Header: "Count Of Delayed Vehicles",
        accessor: "status",
        filterable: false,
      },
      {
        Header: "Allocated vs Actual (Dispatch Quantity)",
        accessor: "task1",
        filterable: false,
      },
      {
        Header: "Created Date",
        accessor: "task12",
        filterable: false,
      },
    ],
    [handleCustomerClick, checkedAll]
  );


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
    // axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/GateDataController/gateOutDashboardData`,values)
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

console.log("COLUMNS", columns2);
console.log("DATA", [{ soNumber: "SO1234" }]);

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

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTask}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <div className="row row-color-ff" style={{padding: "18px"}}>
        
      <Row className="g-3">
        <Col sm={3} style={{paddingLeft:"0px"}}>
            <div>
            <label>From Date</label>
            <Flatpickr
                className="form-control"
                id="datepicker-publish-input"
                placeholder="Select From Date"
                //value={filterDate}
                options={{
                    altInput: true,
                    altFormat: "F j, Y",
                    dateFormat: "m-d-y",
                    //defaultDate: filterDate, 
                    // onDayCreate: (dObj, dStr, fp, dayElem) => {
                    //     // Example: Highlight enabled dates with a specific background color
                    //     if (!dayElem.classList.contains('flatpickr-disabled')) {
                    //         dayElem.style.backgroundColor = '#ADD8E6';  // Light green for enabled dates
                    //     }
                    // },
                }}
                //onChange={(selectedDates) => handleStartDateChange1(selectedDates)}
                //ref={fromDateRef}  // Attach the ref to the "From Date" picker
            />
            </div>
        </Col>

        <Col sm={3}>
            <div>
            <label>To Date</label>
            <Flatpickr
                className="form-control"
                id="datepicker-publish-input-1"
                placeholder="Select To Date"
                //value={filterDate1}
                options={{
                    altInput: true,
                    altFormat: "F j, Y",
                    dateFormat: "m-d-y",
                    // onDayCreate: (dObj, dStr, fp, dayElem) => {
                    //     // Example: Highlight enabled dates with a specific background color
                    //     if (!dayElem.classList.contains('flatpickr-disabled')) {
                    //         dayElem.style.backgroundColor = '#ADD8E6';  // Light blue for enabled dates
                    //     }
                    // },
                    // These options will be dynamically set in handleStartDateChange
                }}
                //onChange={(selectedDates) => handleEndDateChange(selectedDates)}
                //ref={toDateRef}  // Attach the ref to the "To Date" picker
            />
            </div>
        </Col>
        <Col sm={3}>
            <label>Transporter</label>
            <select className='form-control'>
                <option value="">Select Transporter</option>
            </select>
        </Col>
        <Col sm={3}>
                <Button style={{marginTop:"29px"}} className='btn btn-success'>Submit</Button>
        </Col>
    </Row>
        <Col lg={12}>
          <div className="" id="tasksList">
            <div className="border-0">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="d-flex flex-wrap gap-2" style={{marginBottom: "10px"}}>
                    {isMultiDeleteButton && <button className="btn btn-soft-danger" onClick={() => setDeleteModalMulti(true)}><i className="ri-delete-bin-2-line"></i></button>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="">
            <TableContainer
                  columns={columns}
                  data={[]}
                //   isAddUserList={false}
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light table-nowrap"
                  thClass="table-light color-blue-bg text-muted"
                  handleTaskClick={handleCustomerClick}
                  SearchPlaceholder='Search for orders or something...'
                  className="custom-header-css"
                 // handleTodoClick={handleTodoClick}
                  style={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
                />
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
        className="border-0"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-soft-info" toggle={toggle}>
          {"Assign Transporter"}
        </ModalHeader>
        <Form className="tablelist-form" onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}>
          <ModalBody className="modal-body">
            <TableContainer
                columns={columns1}
              //  data={(taskList || [])}
                data={[]}
                isGlobalFilter={false}
                isAddUserList={false}
                customPageSize={8}
                className="custom-header-css"
                divClass="table-responsive table-card mb-3"
                tableClass="align-middle table-nowrap mb-0"
                theadClass="table-light table-nowrap"
                thClass="table-light color-blue-bg text-muted"
                handleTaskClick={handleTaskClicks}
                isTaskListFilter={true}
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
              <button type="submit" className="btn color-blue-bg" id="add-btn">{"Assign Transporter"}</button>
            </div>
          </div>
        </Form>
      </Modal>

      <Modal
        isOpen={modalEdit}
        toggle={toggleEditModal}
        centered
        size="lg"
        className="border-0"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-soft-info" toggle={toggleEditModal}>
          {"Edit Transporter"}
        </ModalHeader>
          <ModalBody className="modal-body">
            <TableContainer
                columns={columns1}
              //  data={(taskList || [])}
                data={[]}
                isGlobalFilter={false}
                isAddUserList={false}
                customPageSize={8}
                className="custom-header-css"
                divClass="table-responsive table-card mb-3"
                tableClass="align-middle table-nowrap mb-0"
                theadClass="table-light table-nowrap"
                thClass="table-light color-blue-bg text-muted"
                isTaskListFilter={true}
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
              <button type="submit" className="btn color-blue-bg" id="add-btn">{"Edit Transporter"}</button>
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
                <textarea class="form-control" row={7} placeholder='Enter Remark'></textarea>
            </div>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <button type="submit" className="btn color-blue-bg" id="add-btn">{"Cancel Order"}</button>
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
        <Form className="tablelist-form" onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}>
          <ModalBody className="modal-body">
            <TableContainer
                columns={columnsTruck}
              //  data={(taskList || [])}
                data={[]}
                isGlobalFilter={false}
                isAddUserList={false}
                customPageSize={8}
                className="custom-header-css"
                divClass="table-responsive table-card mb-3"
                tableClass="align-middle table-nowrap mb-0"
                theadClass="table-light table-nowrap"
                thClass="table-light color-blue-bg text-muted"
               // handleTaskClick={handleTaskClicks}
                isTaskListFilter={true}
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
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default AllTasksPerformance;