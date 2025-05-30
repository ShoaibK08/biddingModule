import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Input,
  ModalHeader,
  ModalBody,
  Label,
  ModalFooter,
  Modal,
  Form,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormFeedback,
} from "reactstrap";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import * as moment from "moment";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { isEmpty } from "lodash";

// Import Images
import dummyImg from "../../../assets/images/users/user-dummy-img.jpg";

//Import actions
import {
  getLeads as onGetLeads,
  addNewLead as onAddNewLead,
  updateLead as onUpdateLead,
  deleteLead as onDeleteLead,
} from "../../../store/actions";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import CrmFilter from "./CrmFilter";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "../../../Components/Common/Loader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CrmLeads = () => {
  const dispatch = useDispatch();

  const { leads, isLeadCreated, isLeadsSuccess, error } = useSelector((state) => ({
    leads: state.Crm.leads,
    isLeadCreated: state.Crm.isLeadCreated,
    isLeadsSuccess: state.Crm.isLeadsSuccess,
    error: state.Crm.error,
  }));

  useEffect(() => {
    if (leads && !leads.length) {
      dispatch(onGetLeads());
    }
  }, [dispatch, leads]);

  useEffect(() => {
    setLead(leads);
  }, [leads]);

  useEffect(() => {
    if (!isEmpty(leads)) {
      setLead(leads);
      setIsEdit(false);
      console.log(leads);
      console.log("set effect 2");
    }
  }, [leads]);

  const [isEdit, setIsEdit] = useState(false);
  const [lead, setLead] = useState([]);

  //delete lead
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const [isInfoDetails, setIsInfoDetails] = useState(false);

  const [tag, setTag] = useState([]);
  const [assignTag, setAssignTag] = useState([]);

  const handlestag = (tags) => {
    setTag(tags);
    const assigned = tags.map((item) => item.value);
    setAssignTag(assigned);
  };

  const tags = [
    { label: "Exiting", value: "Exiting" },
    { label: "Lead", value: "Lead" },
    { label: "Long-term", value: "Long-term" },
    { label: "Partner", value: "Partner" }
  ];

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setLead(null);
    } else {
      setModal(true);
      setDate(defaultdate());
      setTag([]);
      setAssignTag([]);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteLead = () => {
    if (lead) {
      dispatch(onDeleteLead(lead._id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (lead) => {
    setLead(lead);
    setDeleteModal(true);
  };

  // Add Data
  const handleLeadClicks = () => {
    setLead("");
    setIsEdit(false);
    toggle();
  };

  const toggleInfo = () => {
    setIsInfoDetails(!isInfoDetails);
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      // img: (lead && lead.img) || '',
      categoryName: (lead && lead.material_category) || '',
      description: (lead && lead._description) || '',
    },
    validationSchema: Yup.object({
      categoryName: Yup.string().required("Please Enter Category Name"),
      description: Yup.string().required("Please Enter Category Description"),
      // date: Yup.string().required("Please Enter Date"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateLead = {
          id: lead ? lead.id : 0,
          // img: values.img,
          material_category: values.categoryName,
          description: values.description,
        };
        // update Company
        dispatch(onUpdateLead(updateLead));
        validation.resetForm();
      } else {
        const newLead = {
          //_id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          // img: values["img"],
          material_category: values["categoryName"],
          description: values["description"],
        };
        // save new Lead
        dispatch(onAddNewLead(newLead));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Update Data
  const handleLeadClick = useCallback((arg) => {
    const lead = arg;
   // alert(lead.material_category)
    setLead({
      id: lead._id,
      // img: lead.img,
      material_category: lead.material_category,
      _description: lead._description,
      created_dt: lead.created_dt,
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);

  // Node API 
  // useEffect(() => {
  //   if (isLeadCreated) {
  //     setLead(null);
  //     dispatch(onGetLeads());
  //   }
  // }, [
  //   dispatch,
  //   isLeadCreated,
  // ]);

  const handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".leadsCheckBox");

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
      dispatch(onDeleteLead(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".leadsCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Column
  const columns = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {
          return <input type="checkbox" className="leadsCheckBox form-check-input" value={cellProps.row.original._id} onChange={() => deleteCheckbox()} />;
        },
        id: '#',
      },
      {
        Header: "Category Name",
        accessor: "material_category",
        filterable: false,
      },
      {
        Header: "Category Description",
        accessor: "_description",
        filterable: false,
        sortable:true,
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
              <li className="list-inline-item" title="Edit">
                <Link className="btn btn-sm btn-soft-info remove-list btn btn-secondary" to="#"
                  onClick={() => { const LeadData = cellProps.row.original; handleLeadClick(LeadData); }}
                >
                  <i className="ri-pencil-fill  fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Delete">
                <Link
                  className="btn btn-sm btn-soft-danger remove-list btn btn-secondary"
                  onClick={() => { const LeadData = cellProps.row.original; onClickDelete(LeadData); }}
                  to="#"
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleLeadClick, checkedAll]
  );

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

  document.title = "Leads | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteLead}
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

        <Container fluid>
          <BreadCrumb title="Catergory" pageTitle="Material" />
          <Row>
            <Col lg={12}>
              <Card id="leadsList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    
                    <div className="col-sm-auto ms-auto">
                      <div className="hstack gap-2">
                        {isMultiDeleteButton && <button className="btn btn-soft-danger"
                          onClick={() => setDeleteModalMulti(true)}
                        ><i className="ri-delete-bin-2-line"></i></button>}
                        
                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Category
                        </button>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {leads.length ? (
                      <TableContainer
                        columns={columns}
                        data={(leads || [])}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-0"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light table-new-category"
                        handleLeadClick={handleLeadClicks}
                        isLeadsFilter={false}
                        thClass="sort"
                        SearchPlaceholder='Search for Category'
                      />
                    ) : (<Loader error={error} />)
                    }

                  </div>

                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Category" : "Add Category"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}>
                      <ModalBody>
                        <Input type="hidden" id="id-field" />
                        <Row className="g-3">
                          <Col lg={12}>
                            <div>
                              <Label
                                className="form-label"
                              >
                                Category Name
                              </Label>
                              <Input
                                name="categoryName"
                                className="form-control"
                                placeholder="Enter Category Name"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.categoryName || ""}
                                invalid={
                                  validation.touched.categoryName && validation.errors.categoryName ? true : false
                                }
                              />
                              {validation.touched.categoryName && validation.errors.categoryName ? (
                                <FormFeedback type="invalid">{validation.errors.categoryName}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                className="form-label"
                              >
                                Category Description
                              </Label>
                              <Input
                                name="description"
                                className="form-control"
                                placeholder="Enter Description"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.description || ""}
                                invalid={
                                  validation.touched.description && validation.errors.description ? true : false
                                }
                              />
                              {validation.touched.description && validation.errors.description ? (
                                <FormFeedback type="invalid">{validation.errors.description}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button type="button" className="btn btn-light" onClick={() => { setModal(false); }} > Close </button>
                          <button type="submit" className="btn btn-success" id="add-btn"> {!!isEdit ? "Update Category" : "Add Category"} </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <CrmFilter
        show={isInfoDetails}
        onCloseClick={() => setIsInfoDetails(false)}
      />
    </React.Fragment >
  );
};

export default CrmLeads;