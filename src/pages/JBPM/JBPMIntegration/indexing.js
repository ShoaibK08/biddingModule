import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Modal,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  FormFeedback
} from "reactstrap";

import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { isEmpty } from "lodash";
import * as moment from "moment";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";

import {
  getProcessing as onGetProcessing,
} from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";

const MasterJBPMIndexing = () => {
  const dispatch = useDispatch();

  const { processings, isProcessingsCreated, isProcessingsSuccess, error } = useSelector((state) => ({
    processings: state.Master.processings,
    isProcessingsCreated: state.Master.isProcessingsCreated,
    isProcessingsSuccess: state.Master.isProcessingsSuccess,
    error: state.Master.error,
  }));

  const [isEdit, setIsEdit] = useState(false);
  const [transporter, setTransporter] = useState([]);

  // Delete customer
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setTransporter(null);
    } else {
      setModal(true);
    }
  }, [modal]);
/*
  const fleetType = [
    {
      options: [
        { label: "Select fleet type", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
  ];

  const volumeBasedLiquid = [
    {
      options: [
        { label: "Volume based Liquid", value: "" },
        { label: "MS –YES/NO", value: "MS –YES/NO" },
        { label: "HSD –YES/NO", value: "HSD –YES/NO" },
        { label: " LDO", value: " LDO" },
        { label: " HF-HSD", value: " HF-HSD" },
      ],
    },
  ];

  const weightBasedLiquid = [
    {
      options: [
        { label: "Weight based Liquid", value: "" },
        { label: "MOLTEN SULPHUR", value: "MOLTEN SULPHUR" },
        { label: "LPG", value: "LPG" },
        { label: " BITUMEN", value: " BITUMEN" },
        { label: " LIQ NITROGEN", value: " LIQ NITROGEN" },
      ],
    },
  ];

  const weightBasedSolid = [
    {
      options: [
        { label: "Weight based solid", value: "" },
        { label: "PETCOKE", value: "PETCOKE" },
        { label: "SULPHUR", value: "SULPHUR" },
        { label: " FLYASH", value: " FLYASH" },
        { label: " BOTTOM ASH", value: "BOTTOM ASH" },
        { label: " OFF-SPEC SULPHUR", value: " OFF-SPEC SULPHUR" },
        { label: " OFF-SPEC PETCOKE", value: " OFF-SPEC PETCOKE" },
        { label: " CONTAMINATED SULPHUR", value: " CONTAMINATED SULPHUR" },
      ],
    },
  ];
  */
  const customermocalstatus = [
    {
      options: [
        { label: "Select Transporter Address", value: "" },
        { label: "House/Building number", value: "House/Building number" },
        { label: "Landmark", value: "Landmark" },
        { label: "Post Office", value: "Post Office" },
        { label: "Pin Code", value: "Pin Code" },
        { label: "Name Of District", value: "Name Of District" },
        { label: "Name Of State", value: "Name Of State" },
      ],
    },
  ];

  // Delete Data
  const onClickDelete = (transporter) => {
    setTransporter(transporter);
    setDeleteModal(true);
  };

  // Delete Data
  const handleDeleteCustomer = () => {
    if (transporter) {
    //  dispatch(onDeleteCustomer(transporter._id));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleCustomerClick = useCallback((arg) => {
    const transporter = arg;

    setTransporter({
      _id: transporter._id,
      transporter: transporter.firstname,
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);


  useEffect(() => {
    if (processings && !processings.length) {
      dispatch(onGetProcessing());
    }
  }, [dispatch, processings]);


  useEffect(() => {
    setTransporter(processings);
  }, [processings]);

  useEffect(() => {
    if (!isEmpty(processings)) {
      setTransporter(processings);
      setIsEdit(false);
    }
  }, [processings]);

  // Add Data
  const handleCustomerClicks = () => {
    setTransporter("");
    setIsEdit(false);
    toggle();
  };

  // Node API 
  // useEffect(() => {
  //   if (isCustomerCreated) {
  //     setTransporter(null);
  //     dispatch(onGetCustomers());
  //   }
  // }, [
  //   dispatch,
  //   isCustomerCreated,
  // ]);

  const handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  
  const fleetType = [
    {
      options: [
        { label: "Select fleet type", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
  ];

  const volumeBasedLiquid = [
    {
      options: [
        { label: "Volume based Liquid", value: "" },
        { label: "MS –YES/NO", value: "MS –YES/NO" },
        { label: "HSD –YES/NO", value: "HSD –YES/NO" },
        { label: " LDO", value: " LDO" },
        { label: " HF-HSD", value: " HF-HSD" },
      ],
    },
  ];

  const weightBasedLiquid = [
    {
      options: [
        { label: "Weight based Liquid", value: "" },
        { label: "MOLTEN SULPHUR", value: "MOLTEN SULPHUR" },
        { label: "LPG", value: "LPG" },
        { label: " BITUMEN", value: " BITUMEN" },
        { label: " LIQ NITROGEN", value: " LIQ NITROGEN" },
      ],
    },
  ];

  const weightBasedSolid = [
    {
      options: [
        { label: "Weight based solid", value: "" },
        { label: "PETCOKE", value: "PETCOKE" },
        { label: "SULPHUR", value: "SULPHUR" },
        { label: " FLYASH", value: " FLYASH" },
        { label: " BOTTOM ASH", value: "BOTTOM ASH" },
        { label: " OFF-SPEC SULPHUR", value: " OFF-SPEC SULPHUR" },
        { label: " OFF-SPEC PETCOKE", value: " OFF-SPEC PETCOKE" },
        { label: " CONTAMINATED SULPHUR", value: " CONTAMINATED SULPHUR" },
      ],
    },
  ];


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
    //  dispatch(onDeleteCustomer(element.value));
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

  // Customers Column
  const columns = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {
          return <input type="checkbox" className="customerCheckBox form-check-input" value={cellProps.row.original._id} onChange={() => deleteCheckbox()} />;
        },
        id: '#',
      },
      {
        Header: '',
        accessor: 'id',
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        }
      },
      {
        Header: "Indent Id",
        accessor: "processinstanceid",
      },
      {
        Header: "Task Id",
        accessor: "taskid",
        filterable: false,
      },
      {
        Header: "Workstep Name",
        accessor: "workstep_name",
        filterable: false,
      },
      {
        Header: "Owner",
        accessor: "owner",
        filterable: false,
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item">
                <Link
                  to={"/apps-tasks-details/"+cellProps.row.original.taskid}
                  className="text-primary d-inline-block"
                >
                  <i className="ri-eye-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item edit">
                <Link
                  to={"/apps-ecommerce-edit-product/"+cellProps.row.original.material_code}
                  className="text-primary d-inline-block edit-item-btn"
                >
                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => {
                    const orderData = cellProps.row.original;
                    onClickDelete(orderData);
                  }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleCustomerClick, checkedAll]
  );

  const dateFormat = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
  };

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Indexing | Nayara - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={processings}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
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
          <BreadCrumb title="Indexing" pageTitle="Master" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0">Indexing List</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        {isMultiDeleteButton && <button className="btn btn-soft-danger me-1"
                          onClick={() => setDeleteModalMulti(true)}
                        ><i className="ri-delete-bin-2-line"></i></button>}
                        {" "}
                        <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                          Export
                        </button>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    {isProcessingsSuccess && processings.length ? (
                      <TableContainer
                        columns={columns}
                        data={processings}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        isCustomerFilter={true}
                        SearchPlaceholder='Search for process'
                      />
                    ) : (<Loader error={error} />)
                    }
                  </div>
                  <ToastContainer closeButton={false} limit={1} />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MasterJBPMIndexing;
