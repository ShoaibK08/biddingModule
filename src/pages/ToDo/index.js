import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Col, Container, DropdownItem, DropdownMenu, Button, Form, FormFeedback, Input, Modal, ModalBody, ModalHeader, Row, UncontrolledButtonDropdown, UncontrolledCollapse } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import Flatpickr from "react-flatpickr";
import Dragula from 'react-dragula';
import { toast,ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import taskImg from "../../assets/images/task.png";
import DeleteModal from '../../Components/Common/DeleteModal';
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../Components/Common/Loader";
import * as moment from "moment";

//redux
import { useSelector, useDispatch } from 'react-redux';

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

//import action
import {
    getTodos as onGetTodos,
    updateTodo as onupdateTodo,
    deleteTodo as onDeleteTodo,
    addNewTodo as onAddNewTodo,
} from "../../store/actions";

const Status = ({ status }) => {
    switch (status) {
        case "New":
            return <span className="badge badge-soft-info text-uppercase">{status}</span>;
        case "Pending":
            return <span className="badge badge-soft-warning text-uppercase">{status}</span>;
        case "Inprogress":
            return <span className="badge badge-soft-secondary text-uppercase">{status}</span>;
        case "Completed":
            return <span className="badge badge-soft-success text-uppercase">{status}</span>;
        default:
            return <span className="badge badge-soft-success text-uppercase">{status}</span>;
    }
};

const Priority = ({ priority }) => {
    switch (priority) {
        case "High":
            return <span className="badge bg-danger text-uppercase">{priority}</span>;
        case "Medium":
            return <span className="badge bg-warning text-uppercase">{priority}</span>;
        case "Low":
            return <span className="badge bg-success text-uppercase">{priority}</span>;
        default:
            return <span className="badge bg-success text-uppercase">{priority}</span>;
    }
};

const ToDoList = () => {
    document.title = "To Do Lists | Nayara";

    const dispatch = useDispatch();

    const { todos,error } = useSelector((state) => ({
        todos: state.Todos.todos,
        error: state.Todos.error,
    }));
    
    const [deleteModal, setDeleteModal] = useState(false);


    const [taskList, setTaskList] = useState([]);

    // Projects
    const [modalProject, setModalProject] = useState(false);
    // To do Task List
    // To dos
    const [todo, setTodo] = useState(null);
    const [modalTodo, setModalTodo] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (todos && !todos.length) {
          dispatch(onGetTodos());
        }
      }, [dispatch, todos]);

    useEffect(() => {
        setTodo(todos);
        console.log(todos);
    }, [todos]);

    const toggle = useCallback(() => {
        if (modalTodo) {
            setModalTodo(false);
            setTodo(null);
        } else {
            setModalTodo(true);
        }
    }, [modalTodo]);

    // Update To do
    const handleTodoClick = useCallback((arg) => {
        const todo = arg;

        setTodo({
            id: todo.id,
            tagName: todo.tagName,
            description: todo.description,
            color: todo.color,
        });

        setIsEdit(true);
        //toggle();
    }, [toggle]);

    // Add To do
    const handleTodoClicks = () => {
        setTodo("");
        setModalTodo(!modalTodo);
       // setIsEdit(false);
        toggle();
    };

    // Delete To do
    const onClickTodoDelete = (todo) => {
        setTodo(todo);
        setDeleteModal(true);
    };

    const handleDeleteTodo = () => {
        if (todo) {
            dispatch(onDeleteTodo(todo._id));
            setDeleteModal(false);
        }
    };

    // To do Task List validation
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            tagName: (todo && todo.tagName) || '',
            description: (todo && todo.description) || '',
        },
        validationSchema: Yup.object({
            tagName: Yup.string().required("Please Enter Tag Name"),
            description: Yup.string().required("Please Enter Tag Description"),
            // dueDate: Yup.string().required("Please Enter Date"),
            // status: Yup.string().required("Please Enter Status"),
            // priority: Yup.string().required("Please Enter Priority"),
        }),
        onSubmit: (values) => {
            if (isEdit) {
                const updateTodo = {
                    id: todo ? todo._id : 0,
                    tagName: values.tagName,
                    description: values.description,
                };
                // save edit Folder
                dispatch(onupdateTodo(updateTodo));
                validation.resetForm();
            } else {
                const newTodo = {
                   // id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
                    tagName: values.tagName,
                    description: values.description,
                    color: Math.random().toString(16).substr(-6),
                };
                // save new Folder
                dispatch(onAddNewTodo(newTodo));
                validation.resetForm();
            }
           // toggle();
        },
    });
  
  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".customerCheckBox");

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
      dispatch(onDeleteTodo(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".customerCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };
    
  
  const handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  // Customers Column
  const columns = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {
          return <input type="checkbox" className="customerCheckBox form-check-input" value={cellProps.row.original.id} onChange={() => deleteCheckbox()} />;
        },
        id: '#',
      },
      {
        Header: "Tag Color",
        accessor: "color",
        Cell: ( {row} ) => {return <div style={{ backgroundColor : "#"+row.original.color,width :"30px",height : "30px" ,borderRadius:"20px" }}></div> }
      },
      {
        Header: "Tag Name",
        accessor: "tagName",
        filterable: false,
      },
      {
        Header: "Description",
        accessor: "description",
        filterable: false,
      },
      {
        Header: "Create Date",
        accessor: "created_dt",
        filterable: false,
        Cell: (cell) => (
          <>
            {handleValidDate(cell.value)}
          </>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (cell) => {
          switch (cell.value) {
            case 1:
              return <span className="badge text-uppercase badge-soft-success"> Active </span>;
            case 0:
              return <span className="badge text-uppercase badge-soft-danger"> Block </span>;
            default:
              return <span className="badge text-uppercase badge-soft-info"> Block </span>;
          }
        }
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Edit">
                <Button
                  className="btn btn-sm btn-soft-info remove-list"
                  onClick={() => { const item = cellProps.row.original; handleTodoClick(item); }}
                ><i className="ri-pencil-fill fs-16"></i>
                </Button>
              </li>
              <li className="list-inline-item" title="Remove">
                <Button
                  className="btn btn-sm btn-soft-danger remove-list"
                  onClick={() => { const item = cellProps.row.original; onClickTodoDelete(item); }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Button>
              </li>
            </ul>
          );
        },
      },  
    ],
    [handleTodoClick, checkedAll]
  );

  console.log(todos.length)

    return (
        <React.Fragment>
            <ToastContainer closeButton={false} />
            <DeleteModal
                show={deleteModal}
                onDeleteClick={() => handleDeleteTodo()}
                onCloseClick={() => setDeleteModal(false)}
            />
            <div className="page-content">
                <Container fluid>
                {/*
                <div
                    style={{
                        height: "100vh",
                        width: "100vw",
                        backgroundColor: "#" + color,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                    <button
                        style={{
                        padding: "40px",
                        borderRadius: "10px",
                        backgroundImage: 
                "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)",
                        fontSize: "larger",
                        }}
                        onClick={generateColor}
                    >
                        Generate random color
                    </button>
                    </div> */}

                    <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
                        <div className="file-manager-sidebar">
                            
                            <div className="p-4 d-flex flex-column h-100">
                            
                            <Form id="creattask-form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    validation.handleSubmit();
                                    return false;
                                }}
                            >
                                <Row className="mb-4">
                                
                                    <div className="col-sm order-3 order-sm-2 mt-3 mt-sm-0">
                                        <h5 className="fw-semibold mb-0">Add Tag </h5>
                                    </div>
                                </Row>
                                
                                <input type="hidden" id="taskid-input" className="form-control" />
                                <div className="mb-3">
                                    <label htmlFor="task-title-input" className="form-label">Tag Name</label>
                                    <Input type="text" id="task-title-input" className="form-control" placeholder="Enter tag name"
                                        name="tagName"
                                        validate={{ required: { value: true }, }}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.tagName || ""}
                                        invalid={validation.touched.tagName && validation.errors.tagName ? true : false}
                                    />
                                    {validation.touched.tagName && validation.errors.tagName ? (
                                        <FormFeedback type="invalid">{validation.errors.tagName}</FormFeedback>
                                    ) : null}
                                </div>
                                <div className="mb-3 position-relative">
                                    <label htmlFor="task-assign-input" className="form-label">Tag Description To</label>
                                    <textarea type="text" id="task-title-input" className="form-control" placeholder="Enter tag description"
                                        name="description"
                                        validate={{ required: { value: true }, }}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.description || ""}
                                        invalid={validation.touched.description && validation.errors.description ? true : false}
                                    ></textarea>
                                    {validation.touched.description && validation.errors.description ? (
                                        <FormFeedback type="invalid">{validation.errors.description}</FormFeedback>
                                    ) : null}
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-success w-100"><i className="ri-add-line align-bottom"></i> Add Tag</button>
                                </div>
                            </Form>
                            </div>
                        </div>
                        <div className="file-manager-content w-100 p-4 pb-0">
                            <Row className="mb-4">
                                
                                <div className="col-sm order-3 order-sm-2 mt-3 mt-sm-0">
                                    <h5 className="fw-semibold mb-0">Tag List </h5>
                                </div>
                            </Row>

                            <div className="position-relative px-4 mx-n4">

                                <div className="todo-task" id="todo-task">
                                {todos.length ? (
                                    <TableContainer
                                        columns={columns}
                                        data={(todos || [])}
                                        isGlobalFilter={true}
                                        isAddUserList={false}
                                        customPageSize={5}
                                        isGlobalSearch={true}
                                        className="custom-header-css"
                                       // handleTodoClick={handleTodoClick}
                                        isTodoFilter={true}
                                        SearchPlaceholder='Search for tag ...'
                                        style={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
                                    />
                                    ) : (<Loader error={error} />)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <Modal id="createTask" isOpen={modalTodo} toggle={toggle} modalClassName="zoomIn" centered tabIndex="-1">
                <ModalHeader toggle={toggle} className="p-3 bg-soft-success"> {!!isEdit ? "Edit Task" : "Create Task"} </ModalHeader>
                <ModalBody>
                    <div id="task-error-msg" className="alert alert-danger py-2"></div>
                    <Form id="creattask-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                        }}
                    >
                        <input type="hidden" id="taskid-input" className="form-control" />
                        <div className="mb-3">
                            <label htmlFor="task-title-input" className="form-label">Tag Name</label>
                            <Input type="text" id="task-title-input" className="form-control" placeholder="Enter task title"
                                name="task"
                                validate={{ required: { value: true }, }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.task || ""}
                                invalid={validation.touched.task && validation.errors.task ? true : false}
                            />
                            {validation.touched.task && validation.errors.task ? (
                                <FormFeedback type="invalid">{validation.errors.task}</FormFeedback>
                            ) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="task-title-input" className="form-label">Tag Description</label>
                            <Input type="text" id="task-title-input" className="form-control" placeholder="Enter task title"
                                name="task"
                                validate={{ required: { value: true }, }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.task || ""}
                                invalid={validation.touched.task && validation.errors.task ? true : false}
                            />
                            {validation.touched.task && validation.errors.task ? (
                                <FormFeedback type="invalid">{validation.errors.task}</FormFeedback>
                            ) : null}
                        </div>

                        <div className="hstack gap-2 justify-content-end">
                            <button type="button" className="btn btn-ghost-success" onClick={() => setModalTodo(false)}><i className="ri-close-fill align-bottom"></i> Close</button>
                            <button type="submit" className="btn btn-primary" id="addNewTodo">{!!isEdit ? "Save" : "Add Tag"}</button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal >

        </React.Fragment >
    );
};

export default ToDoList;