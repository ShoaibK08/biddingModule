import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
//import '../MasterVehicle/Vehicle.css';
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";
import classnames from "classnames";
import { MultiSelect } from "react-multi-select-component";





const UserMapping = () => {

  const plantcodecol = {
    display: 'none'
  };

  // Outline Border Nav Tabs
  const [data, setData] = useState([]);
  const [outlineBorderNav, setoutlineBorderNav] = useState("1");
  const outlineBorderNavtoggle = (tab) => {
    if (outlineBorderNav !== tab) {
      setoutlineBorderNav(tab);
    }

  };

  const [menusubpages, setmenusubpages] = useState([]);
  const [Department, setdeprtment] = useState([]);
  const [RoleDepartment, setroledeprtment] = useState([]);

  const [selected, setSelected] = useState([]);

  const [menua, setsubmenus] = useState([]);

  const [values, setValues] = useState([]);

  const [roledepartment, setroledeprtmentmap] = useState([]);
  const [mapedmenus, setmappedmenus] = useState([]);

  const [id, setClickedRowId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);


  const [inputplantcode, setplantcode] = useState([]);
  const [inputlastname, setlastname] = useState([]);
  const [Plant_Code, setPlantCode] = useState('');
  const [comapny_code, setCompanyCode] = useState('');
  const [latestHeader, setLatestHeader] = useState('');
  const [MainMenu, setMainMenu] = useState([]);
  const [SelectedMainMenu, setSelectedMainMenu] = useState('');

  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    setPlantCode(plantcode);
    sessionStorage.getItem("main_menu_login");
    const obj1 = JSON.parse(sessionStorage.getItem("main_menu_login"));
    let companyCode = obj1.companyCode;
    setCompanyCode(companyCode);
    getAllData();
    getroledepartment(plantcode);
    getsubmenu(plantcode);
    getMainMenu(plantcode);
    getdepartment(plantcode); 
    //  getroldepartmentmapping();
    getuserdata();
  }, []);


  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: process.env.REACT_APP_API_USER_NAME,
      password: process.env.REACT_APP_API_PASSWORD,
    },
  };
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (filteredSelected) => {debugger;
    setSelectedOptions(filteredSelected);

  };
  const disabledOptions = menua.map(option => ({
    ...option,
    disabled: mapedmenus.some(o => o.value === option.value)
  }));


  const getsubmenu = (mainMenu) => {
    // axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/submenus?plantCode=${plantcode}`, config)
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/submenus/mainMenu/${mainMenu}`, config)
      .then(res => {
        const result = res;
        setmenusubpages(result);
        const getmenuname = [];
        for (let i = 0; i < result.length; i++) {

          var abc = { "label": result[i].name, "value": result[i].name }
          var mainmenuname = result[i].mainmenuName;
          getmenuname.push(abc);
        }
        setsubmenus(getmenuname);
      });
  }

  const getMainMenu = (plantcode) => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/main-menu?plantCode=${plantcode}`, config)
      .then(res => {
        const result = res;
        setMainMenu(result);
      });
  }

  const getroledepartment = (plantcode) => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/roles?plantCode=${plantcode}`, config)
      .then(res => {
        const result = res;
        setroledeprtment(result);
      });
  }

  const getuserdata = () => {
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    let lastname = obj.data.last_name;
    setplantcode(plantcode);
    setlastname(lastname);
  }





  const getdepartment = (plantcode) => {
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/departments?plantCode=${plantcode}`, config)
      .then(res => {
        const result = res;
        setdeprtment(result);

      });
  }


  const getAllData = () => {
    ////   axios.get(`http://127.0.0.1:8082/SubMenuRoleDep-mappings`)
    axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/SubMenuRoleDep-mappings`, config)
      .then(res => {
        const result = res;
        setData(result);

      });
  }

  const handleInputChange = (e) => {debugger;
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value
    });

    if(name === "mainmenu"){
      setSelectedMainMenu(value);
      getsubmenu(value);
    }

    var role = document.getElementById("role").value;
    var department = document.getElementById("department").value;
    var main_menu = document.getElementById("mainmenu").value;



    const getmapedmenuname = [];

    if (main_menu !== "") {
      const getroldepartmentmapping = () => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/SubMenuRoleDep-mappings/` + role + '/' + department + '/' + main_menu, config)
          .then(res => {
            const result = res;
            setroledeprtmentmap(result);
            for (let i = 0; i < result.length; i++) {

              var xyz = { "label": result[i].submenu, "value": result[i].submenu, disabled: false }
              getmapedmenuname.push(xyz);
            }
            setmappedmenus(getmapedmenuname);
            // alert("Maped Menu"+JSON.stringify(getmapedmenuname));
            setSelectedOptions(getmapedmenuname);
          });
      }
      getroldepartmentmapping();
    }

    var plnatn = document.getElementById("submenu").value;
    //  alert("Sub Menu = "+plnatn);
  };


  const handleSubmit = async (e) => {debugger;
    e.preventDefault();

    console.log(values);
    let parameter = JSON.stringify(values.role);
    const options = selectedOptions;
    const mapedmenuname = options.map(item => item.value);
    const mapedmenusa = mapedmenus.map(item => item.value);
    var menumaped = JSON.stringify(mapedmenusa);
    var resultArray = mapedmenuname.filter(item => !mapedmenusa.includes(item));
    console.log(resultArray);
    if (resultArray == "") {
      resultArray = mapedmenusa;
    }
    else {
      resultArray = resultArray;
    }
    var role = document.getElementById("role").value;
    var department = document.getElementById("department").value;
    var lastname = document.getElementById("lastname").value;
    var menumapping = { "role": role, "department": department, "subMenuList": mapedmenuname, "plantcode": Plant_Code, "lastname": lastname, "mainmenu": SelectedMainMenu };
    var valuesa = JSON.stringify(menumapping);
    try {
      const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/SubMenuRoleDep-mappings`, valuesa, config)
      console.log(res);
      if (!res.errorMsg) {
        toast.success("Mapped Successfully.", { autoClose: 3000 });
      }
      else {
        toast.error("Menu Mapped Already Exist.", { autoClose: 3000 });
      }
      getAllData();
    }
    catch (e) {
      toast.error("Something went wrong!", { autoClose: 3000 });
    }

  };


  // Delete Data
  const onClickDelete = (id) => {
    setClickedRowId(id);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = async (e) => {
    e.preventDefault();

    try {
      var deleteid = JSON.stringify(id.id);
      // const res = await axios.delete(`http://127.0.0.1:8082/SubMenuRoleDep-mappings/${deleteid}`)
      const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/SubMenuRoleDep-mappings/${deleteid}`, config)
      console.log(res.data);
      getAllData();
      toast.success("Mapped Menu Deleted Successfully", { autoClose: 3000 });
      setDeleteModal(false);
    } catch (e) {
      toast.error("Something went wrong!", { autoClose: 3000 });
      setDeleteModal(false);
    }
  };

  // Customers Column
  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'id',
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        }
      },
      {
        Header: "Role.",
        accessor: "role",
        filterable: false,
      },
      {
        Header: "Department",
        accessor: "department",
        filterable: false,
      },
      {
        Header: "Sub Menu",
        accessor: "submenu",
        filterable: false,
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item" title="Remove">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => { const id = cellProps.row.original; onClickDelete(id); }}>
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
  );




  document.title = "Menu Sub Pages Role Map | EPLMS";
  return (
    <React.Fragment>
      <div className="page-content">

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
          onCloseClick={() => setDeleteModal(false)}
        />


        <Container fluid>
          <BreadCrumb title={latestHeader} pageTitle="Admin" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <div className="card-body pt-4">
                  <Nav pills className="nav-customs nav-danger mb-3 nav nav-pills" style={{ marginLeft: '-8px' }}>
                    <NavItem>
                      <NavLink id="tab1" style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "1", })} onClick={() => { outlineBorderNavtoggle("1"); }}>  Add     </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink id="tab2" style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "2", })} onClick={() => { outlineBorderNavtoggle("2"); }}>   View     </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={outlineBorderNav} className="text-muted">
                    <TabPane tabId="1" id="border-nav-home">
                      <Form className="tablelist-form" name="form_data" id="form_id" onSubmit={handleSubmit}>

                        <Row className="g-3 border border-dashed">



                          <Col lg={3} style={plantcodecol}>
                            <div>
                              <Label className="form-label" >Plant Code </Label>
                              <input type="text" id="plantcode" value={inputplantcode} onChange={handleInputChange} required />
                            </div>
                          </Col>


                          <Col lg={3} style={plantcodecol} >
                            <div>
                              <Label className="form-label" >Last Name </Label>
                              <input type="text" id="lastname" value={inputlastname} onChange={handleInputChange} required />
                            </div>
                          </Col>

                          <Col lg={3} >
                            <div>
                              <Label className="form-label" >Role </Label>
                              <Input
                                name="roleName"
                                type="select"
                                className="form-select"
                                value={values.roleName}
                                //={handleInputChange}
                                id="role"
                                onChange={handleInputChange}
                                required>
                                <option value={""}>{"Select Role"}</option>
                                {RoleDepartment.map((item, key) => (
                                  <option value={item.name} key={key}>{item.name}</option>)
                                )}
                              </Input>
                            </div>
                          </Col>

                          <Col lg={3} >
                            <div>
                              <Label className="form-label" >Department </Label>
                              <Input
                                name="departmentName"
                                type="select"
                                className="form-select"
                                value={values.departmentName}
                                //={handleInputChange}
                                id="department"
                                onChange={handleInputChange}
                                required>
                                <option value={""}>{"Select Department"}</option>
                                {Department.map((item, key) => (
                                  <option value={item.code} key={key}>{item.name}</option>)
                                )}
                              </Input>
                            </div>
                          </Col>

                          <Col lg={3} >
                            <div>
                              <Label className="form-label" >Main menu </Label>
                              <Input
                                name="mainmenu"
                                type="select"
                                className="form-select"
                                value={values.mainmenu}
                                id="mainmenu"
                                onChange={handleInputChange}
                                required>
                                <option value={""}>{"Select Main Menu"}</option>
                                {MainMenu.map((item, key) => (
                                  <option value={item.code} key={key}>{item.name}</option>)
                                )}
                              </Input>
                            </div>
                          </Col>

                          <Col lg={3} >
                            <div>
                              <Label className="form-label" >Menu Sub Pages</Label>
                              <MultiSelect
                                options={menua}
                                value={selectedOptions}
                                onChange={handleSelectChange}
                                labelledBy="Select"
                                id="submenu"
                                name="subMenu"
                                required
                              />
                            </div>
                          </Col>


                          <Col lg={3} >
                            <div>
                              <button type="submit" className="btn btn-success justify-content-end" style={{ marginTop: "28px", width: "auto", marginLeft: "10px" }}><i className="ri-stack-line align-bottom me-1"></i> Submit</button>
                            </div>
                          </Col>
                          <ToastContainer closeButton={false} limit={1} />
                        </Row>
                      </Form>
                    </TabPane>
                  </TabContent>
                  <TabContent activeTab={outlineBorderNav} className="text-muted">
                    <TabPane tabId="2" id="border-nav-home">
                      <Row className="g-3">
                        <div className="card-body pt-0">
                          <div>
                            <TableContainer
                              columns={columns}
                              data={data}
                              isGlobalFilter={true}
                              isAddUserList={false}
                              customPageSize={5}
                              isGlobalSearch={true}
                              className="custom-header-css"
                              SearchPlaceholder='Search for Sub Menu...'
                            />
                          </div>
                          <ToastContainer closeButton={false} limit={1} />
                        </div>
                      </Row>
                    </TabPane>
                  </TabContent>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>



    </React.Fragment>
  );
};

export default UserMapping;
