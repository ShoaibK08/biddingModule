import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Modal,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  FormFeedback
} from "reactstrap";

import { Link, useNavigate } from "react-router-dom";
//import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { isEmpty } from "lodash";
import * as moment from "moment";
import RelatedQuota from "./RelatedQuota";
import axios from "axios";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";

import {
 // getQuota1 as onGetTransporters,
  addNewQuota1 as onAddNewQuota,
  updateCustomer1 as onUpdateCustomer,
  deleteCustomer1 as onDeleteCustomer,
  getTeamData as onGetTeamData,
  getCustomers1 as onGetCustomers,
} from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";

const AllQuota = () => {
  const dispatch = useDispatch();

  const history = useNavigate();

  const { quotas, isquotasCreated, isquotasSuccess, error } = useSelector((state) => ({
    quotas: state.Master.quotas,
    isquotasCreated: state.Master.isquotasCreated,
    isquotasSuccess: state.Master.isquotasSuccess,
    error: state.Master.error,
  }));

  const [isEdit, setIsEdit] = useState(false);
  const [quota, setTransporter] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [productList, setProductList] = useState([]);

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
  const onClickDelete = (quota) => {
    setTransporter(quota);
    setDeleteModal(true);
  };
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      //product_name: 'M002',
      to_date_quota: '2023-04-13',
      from_date_quota: '2023-04-13',
      quota_allotted: '',
      pending_quota: '',
      quota_remarks: '',
      //soldtopartyquota: 'CU000091',
    },
    validationSchema: Yup.object({
      quota_allotted: Yup.string().required("Please Enter quota allotted"),
      quota_remarks: Yup.string().required("Please Enter quota remarks"),
      pending_quota: Yup.string().required("Please Enter pending quota"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateCustomer = [
          {
             
              "from_date": values.from_date_quota,
              "product_name": values.product_name,
              "to_date": values.to_date_quota,
              "quota_allotted": parseInt(values.quota_allotted),
              "quota_remarks": values.quota_remarks,
              "pending_quota":"8",
              "prev_quota": "6",
              "soldToPartyCode": values.soldtopartyquota,
              "status": 1
          }
        ];
        // update customer
        dispatch(onUpdateCustomer(updateCustomer));
        validation.resetForm();
      } else {
        //console.log(values.quota_allotted)
        // alert(values.soldtopartyquota);
        const newQuota = [
          {
             
              "from_date": values.from_date_quota,
              "product_name": values.product_name,
              "to_date": values.to_date_quota,
              "pending_quota":"8",
              "prev_quota": "6",
              "quota_allotted": parseInt(values.quota_allotted),
              "quota_remarks": values.quota_remarks,
              "soldToPartyCode": values.soldtopartyquota,
              "status": 1
          }
        ];
        /*
        const newTransporter = {
          _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          transporter_name: values["transporter_name"],
        };*/
        // save new customer
        dispatch(onAddNewQuota(newQuota));

        validation.resetForm();
        //history('/configurations');
        //window.location.reload();


      }
      toggle();
    },
  });

  // Delete Data
  const handleDeleteCustomer = () => {
    if (quota) {
      dispatch(onDeleteCustomer(quota._id));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleCustomerClick = useCallback((arg) => {
    const quota = arg;

    setTransporter({
      _id: quota._id,
      quota_allotted: quota.quota_allotted,
      quota_remarks: quota.quota_remarks,
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);


  useEffect(() => {
    if (quotas && !quotas.length) {
     // dispatch(onGetTransporters());
    }

  }, [dispatch, quotas]);


  useEffect(() => {
    if (customerList && !customerList.length) {
      axios.get("http://localhost:8043/sapModule/sap/getAll")
        .then(res => {
          setCustomerList(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
    if (productList && !productList.length) {
      axios.get("http://localhost:8043/sapModule/getAllMaterial")
        .then(res => {
          setProductList(res);
        })
        .catch(err => {
          console.log(err);
        });
    }

  });

  console.log(customerList)
  console.log(productList)

  useEffect(() => {
    setTransporter(quotas);
  }, [quotas]);

  useEffect(() => {
    if (!isEmpty(quotas)) {
      setTransporter(quotas);
      setIsEdit(false);
    }
  }, [quotas]);

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
        { label: "Select Quota Allotted", value: "" },
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
        { label: "Select Product", value: "" },
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
      dispatch(onDeleteCustomer(element.value));
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
        Header: "Product Code",
        accessor: "product_name",
        filterable: false,
      },
      {
        Header: "From Date",
        accessor: "from_date",
        filterable: false,
        Cell: (cell) => (
          <>
            {handleValidDate(cell.value)}
          </>
        ),
      },
      {
        Header: "To Date",
        accessor: "to_date",
        filterable: false,
        Cell: (cell) => (
          <>
            {handleValidDate(cell.value)}
          </>
        ),
      },
      {
        Header: "User Code",
        accessor: "soldtoparty",
        filterable: false,
      },
      {
        Header: "Quota Allotted",
        accessor: "quota_allotted",
        filterable: false,
      },
      {
        Header: "Quota Remark",
        accessor: "quota_remarks",
        filterable: false,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (cell) => {
          switch (cell.value) {
            case 1:
              return <span className="badge text-uppercase badge-soft-success"> Active </span>;
            case 0:
              return <span className="badge text-uppercase badge-soft-danger"> Deactive </span>;
            default:
              return <span className="badge text-uppercase badge-soft-info"> Deactive </span>;
          }
        }
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Edit">
                <Link
                  to="#"
                  className="text-primary d-inline-block edit-item-btn"
                  onClick={() => { const customerData = cellProps.row.original; handleCustomerClick(customerData); }}
                >

                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Remove">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => { const customerData = cellProps.row.original; onClickDelete(customerData); }}
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

  const dateFormatApi = (e) => {
    let d = e.toString().split(" "),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getFullYear() + '-' + months[d.getMonth()] + ', ' + d.getDate()).toString());
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
  };

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "quotas | Nayara - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={quotas}
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
          <BreadCrumb title="quotas" pageTitle="Master" />
          <Card>
            <CardBody>
              <Row className="g-2">
                <Col className="col-sm-auto ms-auto">
                  <button
                    type="button"
                    className="btn btn-success add-btn"
                    id="create-btn"
                    onClick={() => { setIsEdit(false); toggle(); }}
                  >
                    <i className="ri-add-line align-bottom me-1"></i> Add
                    Quota
                  </button>
                </Col>
              </Row>
              <Modal id="showModal" isOpen={modal} toggle={toggle} centered >
                <ModalHeader className="bg-light p-3" toggle={toggle}>
                  {!!isEdit ? "Edit Quota" : "Add Quota"}
                </ModalHeader>
                <Form className="tablelist-form" onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}>
                  <ModalBody>
                    <input type="hidden" id="id-field" />

                    <div
                      className="mb-3"
                      id="modal-id"
                      style={{ display: "none" }}
                    >
                      <Label htmlFor="id-field1" className="form-label">
                        ID
                      </Label>
                      <Input
                        type="text"
                        id="id-field1"
                        className="form-control"
                        placeholder="ID"
                        readOnly
                      />
                    </div>
                    <Row className="g-3">
                      <Col lg={12}>
                        <div>
                          <Label
                            // htmlFor="customername-field"
                            className="form-label"
                          >
                            Sold To Party
                          </Label>
                          <Input
                            name="soldtopartyquota"
                            type="select"
                            className="form-select"
                            onChange={validation.handleChange}
                            placeholder="Select sold to party"
                          >
                            <React.Fragment >
                              <option value="">select sold to party</option>
                              {customerList.map((item, key) => (<option value={item.customer_code} key={key}>{item.firstname + " " + item.lastname}</option>))}
                            </React.Fragment>
                          </Input>
                        </div>
                      </Col>

                      <Col lg={12}>
                        <div>
                          <Label
                            //htmlFor="customername-field"
                            className="form-label"
                          >
                            Material                          </Label>
                          <Input
                            name="product_name"
                            type="select"
                            className="form-select"
                            onChange={validation.handleChange}
                            placeholder="Select Product"
                          >
                            <React.Fragment>
                              <option value="">select material</option>
                              {productList.map((item, key) => (<option value={item.material_code} key={key}>{item.material_name}</option>))}
                            </React.Fragment>
                          </Input>
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div>
                          <Label
                            className="form-label"
                          >
                            From Date
                          </Label>
                          <Flatpickr
                            name="from_date_quota"
                            className="form-control"
                            placeholder="Enter From Date"
                            options={{
                              altInput: true,
                              altFormat: "d M, Y",
                              dateFormat: "d M, Y",
                            }}
                            onChange={(e) =>
                              dateformate(e)
                            }
                          />
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div>
                          <Label
                            className="form-label"
                          >
                            To Date
                          </Label>
                          <Flatpickr
                            name="to_date_quota"
                            className="form-control"
                            placeholder="Enter To Date"
                            options={{
                              altInput: true,
                              altFormat: "d M, Y",
                              dateFormat: "d M, Y",
                            }}
                            onChange={(e) =>
                              dateformate(e)
                            }

                          />
                        </div>
                      </Col>


                      <Col lg={6}>
                        <div>
                          <Label
                            //htmlFor="customername-field"
                            className="form-label"
                          >
                            Quota Allotted
                          </Label>
                          <Input
                            name="quota_allotted"
                            className="form-control"
                            placeholder="Enter Quota Allotted"
                            type="text"
                            value={validation.values.quota_allotted || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={validation.errors.quota_allotted && validation.touched.quota_allotted ? true : false}
                          />
                        </div>
                      </Col>


                      <Col lg={6}>
                        <div>
                          <Label
                            //htmlFor="customername-field"
                            className="form-label"
                          >
                            Pending Quota
                          </Label>
                          <Input
                            name="pending_quota"
                            className="form-control"
                            placeholder="Enter Pending Quota"
                            type="text"
                            value={validation.values.pending_quota || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={validation.errors.pending_quota && validation.touched.pending_quota ? true : false}
                          />
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div>
                          <Label
                            // htmlFor="customername-field"
                            className="form-label"
                          >
                            Quota Remark
                          </Label>
                          <Input
                            name="quota_remarks"
                            className="form-control"
                            placeholder="Enter Quota Remark"
                            type="text"
                            value={validation.values.quota_remarks || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={validation.errors.quota_remarks && validation.touched.quota_remarks ? true : false}
                          />
                        </div>
                      </Col>


                    </Row>
                  </ModalBody>
                  <ModalFooter>
                    <div className="hstack gap-2 justify-content-end">
                      <button type="button" className="btn btn-light" onClick={toggle}> Close </button>

                      <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Quota"} </button>
                    </div>
                  </ModalFooter>
                </Form>
              </Modal>
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>
          </Card>
          <Row className="g-4 pt-0">
            <br />
            <br />
            <br />
            <br />
            <Col xxl={12} >
              <RelatedQuota />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AllQuota;
