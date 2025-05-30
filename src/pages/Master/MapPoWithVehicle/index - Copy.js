import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Label, CardBody, Input, Nav, NavItem, NavLink, TabContent, TabPane, Button, Collapse, Table, Spinner } from "reactstrap";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { toast, ToastContainer } from 'react-toastify';
import TableContainer from "../../../Components/Common/TableContainer";
import classnames from "classnames";
import logoDark from "../../../assets/images/no_data.png";

const MapPOWithVehicle = () => {
    // State to hold form values
    const [values, setValues] = useState({
        po_lineitem: "",         // Default initial values
        material_code: "",
        transporter_name: "",
        transporter_code: "",
        transporter_number: "",
        total_qty: "",
        challan_qty: "",
        challan_number: "",
        challan_date: "",
        challan_TW: "",
        challan_GW: "",
        lorry_RN: "",
        Supplier_OrderNo: "",
        driver_name: "",
        driver_number: "",
        invoice_number: "",
        invoice_date: "",
        slip_umber: "",
        slip_date: "",
        ry_weight: "",
        remarks: "",
        src_location: "",
        lr_date: "",
        net_weight: "",
        supplier_TW: "",
        supplier_GW: "",
        OB_DelNo: "",
        mode_of_delivery:"",
        nature_item:"",
        party_type:"",
        vehicle_type:"",
        is_weighment:"",
        gate_no:"",
        sub_transporter:"",
        mis_transporter:"",
        cleaner_name:"",
        license_number:"",
        no_of_packs:"",
        no_of_other_packes:"",
        backload_slip_no:"",
        src_location:"",
        src_location_text:""
    });

    // State to manage selected values and options
    const [Plant_Code, setPlantCode] = useState('');

    const [po_number, setPoNumber] = useState(null);
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [poError, setPoError] = useState(false);
    const [poErrorText, setPoErrorText] = useState("");
    const [lineItemError, setLineItemError] = useState(false);
    const [duplicateEntry, setDuplicateEntry] = useState("");
    const [vehicleError, setVehicleError] = useState(false);
    const [tableData, setTableData] = useState([]);
    const today = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format
    const [options, setOptions] = useState([]);
    const [mappedData, setMappedData] = useState([]);
    const [poNumberData, setDataOnTheBasisOfPONumber] = useState(null);
    const [unloadingData, setUnloadingData] = useState([]);

    const [vehicleOptions, setVehicleOptions] = useState([]);
    const [vehicleListFetching, setVehicleListFetching] = useState(false);
    const [poListFetching, setPOListFetching] = useState(false);
    const [poDetailsSection, setPODetailsSection] = useState(false);
    const [lineItemList, setLineItemList] = useState([]);
    const [loadingParameter, setErrorParameter] = useState(false);
    const [challanError, setChallanError] = useState(false);
    const [outlineBorderNav, setoutlineBorderNav] = useState("1");
    const challanQtyRef = useRef(null); // Create a ref for the input field
    const outlineBorderNavtoggle = (tab) => {
        if (outlineBorderNav !== tab) {
            setoutlineBorderNav(tab);
        }
    };

    const collapse = true;
    const [isCollapse, setIsCollapse] = useState(collapse);
    const [icon, setIcon] = useState("las la-angle-down");
    const firstCollapse = () => {
        setIsCollapse(!isCollapse);
        setIcon(state => {
            return state === "las la-angle-down"
                ? "las la-angle-up"
                : "las la-angle-down";
        });
    };

    useEffect(() => {
        const authUser = sessionStorage.getItem("authUser");
        if (authUser) {
            const obj = JSON.parse(authUser);
            const plantcode = obj.data.plantCode;
            setPlantCode(plantcode);
            getAllMappedData(plantcode);
            getUnloadingList(plantcode);
        }
    }, []); // Empty dependency array means this will run once when the component mounts

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            username: process.env.REACT_APP_API_USER_NAME,
            password: process.env.REACT_APP_API_PASSWORD,
        },
    };


    const getAllMappedData = (plantcode) => {

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poScreen/poMap?plantCode=${plantcode}`, config)
            .then(res => {
                setMappedData(res);
            });
    }

    const getUnloadingList = (plantCode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/packerLoader/getPackerDataByType?type=UL&plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setUnloadingData(data);
            })
    }

    const handleSelectChange = (_, value) => {
        setPoNumber(value || null);
        setPoError(false);
        getDataOnTheBasisOfPONumber(value.value);
    };

    const handlePOChange = async (event, value) => {
        setDuplicateEntry(false);
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
        if (sanitizedValue && sanitizedValue.length >= 3) {
            setPOListFetching(true);
            setPoError(false);
            try {
                const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poScreen/poNum?plantCode=${Plant_Code}&poNumber=${sanitizedValue}`, config);
                setOptions(response.map(item => ({
                    label: item.po_number, // Assuming `po_number` is the label
                    value: item.po_number, // Assuming `po_number` is the value
                })));
                if ((response.length != 0)) {
                    setPoError(false);
                }
                else {
                    setPoError(true);
                    setPoErrorText("PO Number not found!");
                }
            } catch (error) {
                console.error("Error fetching options", error);
            }
            setPOListFetching(false);
        } else {
            // Clear options if input is cleared
            setOptions([]);
            setPOListFetching(false);
        }
    };

    const getDataOnTheBasisOfPONumber = (po_number) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poScreen/poLineItem?plantCode=${Plant_Code}&poNumber=${po_number}`, config)
            .then(res => {
                setLineItemList(res);
            });
    }

    const handleLineItemChange = (e) => {
        debugger;
        const { name, value, type } = e.target;
        setValues({
            ...values,
            [name]: value || value.valueAsNumber,
        });
        if (value !== "") {
            setLineItemError(false);
            axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poScreen/poDetails?plantCode=${Plant_Code}&poNumber=${po_number.value}&poLineItem=${value}`, config)
                .then(res => {
                    setDataOnTheBasisOfPONumber(res);
                    setPODetailsSection(true);
                    toast.success("Data fetched successfully. Please review PO Details.", { autoClose: 3000 });
                });
        }
        else {
            setLineItemError(true);
        }

    };

    const handleAutocompleteChange = (_, value) => {
        setVehicleNumber(value);
        setVehicleError(false);
    };

    const handleVehicleChange = async (event, value) => {
        setDuplicateEntry(false);
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
        if (sanitizedValue && sanitizedValue.length >= 3) {
            setVehicleListFetching(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poScreen/vehicleInfo?plantCode=${Plant_Code}&vehicleNumber=${sanitizedValue}`, config);
                setVehicleOptions(response || []);
            } catch (error) {
                console.error("Error fetching vehicle options", error);
            }
            setVehicleListFetching(false);
        } else {
            // Clear options if input is cleared
            setVehicleOptions([]);
            setVehicleListFetching(false);
        }
    };


    const handleDelete = (index) => {
        setTableData(tableData.filter((_, i) => i !== index));
    };

    const handleSelectRow = (index) => {
        const updatedData = [...tableData];
        updatedData[index].selected = !updatedData[index].selected;
        setTableData(updatedData);
    };

    const handleSubmit = async () => {debugger;
        setErrorParameter(true);
        const selectedData = tableData.filter((item) => item.selected);
        console.log("Selected Table Data:", selectedData);
        try {
            const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/poScreen/submitPo`, selectedData, config)
            console.log(res.data);
            if (res.errorMsg) {
                toast.error(res.errorMsg, { autoClose: 3000 });
                setErrorParameter(false);
            }
            else {
                getAllMappedData(Plant_Code);
                toast.success("PO Mapped With Vehicle Successfully", { autoClose: 3000 });
                setErrorParameter(false);
                outlineBorderNavtoggle("1");
                setTableData([]);
                setPoNumber('');
                setValues({
                    ...values,
                    ["po_lineitem"]: "",
                });
            }

        } catch (e) {
            toast.error("The PO quantity must not exceed the remaining quantity. Please lower the value of Challan Qty.", { autoClose: 3000 });
            outlineBorderNavtoggle("1");
            setPODetailsSection(true);
            setErrorParameter(false);
            setTableData([]);
        }
    };

    const handleAddData = () => {
        // Validate inputs
        if (!po_number) setPoError(true);
        if (!po_number) setPoErrorText("PO Number required!");
        if (!vehicleNumber) setVehicleError(true);
        if (lineItemError) setLineItemError(true);
        // Check for duplicates
        const isDuplicate = tableData.some(
            (data) =>
                data.po_number === po_number?.value ||
                data.vehicleNumber === vehicleNumber?.registration_number
        );

        if (isDuplicate) {
            // Show duplicate entry error
            setDuplicateEntry("Duplicate entry.");
            return; // Stop further execution
        }
        if (values.challan_qty > values.po_qty) {
            toast.error("Challan Qty should not be greater than PO Qty.", { autoClose: 3000 });
            setChallanError(true);
            challanQtyRef.current.focus(); // Focus on the input field
            window.scrollBy({ top: 300, behavior: "smooth" }); // Scroll down 200px
            return; // Stop further execution
        }

        // If both inputs are valid and no duplicate, add data to table
        if (po_number && vehicleNumber) {
            const obj = JSON.parse(sessionStorage.getItem("authUser"));
            let userId = obj.data._id;
            setTableData([
                ...tableData, // Spread the existing table data
                {
                    ...values, // Spread the values object
                    po_number: po_number.value, // Add specific fields
                    vehicleNumber: vehicleNumber.registration_number,
                    selected: false, // Add or override other fields as needed
                    userId: userId
                }
            ]);
            outlineBorderNavtoggle("2");
            setPODetailsSection(false);
            // Clear inputs and errors
            //setPoNumber('');
            setVehicleNumber('');
            setPoError(false);
            setVehicleError(false);
        }
    };

    // Use effect to update state when props.data changes
    useEffect(() => {
        if (poNumberData) {
            setValues({
                ...values,
                ...poNumberData
            });  // Update state when props.data changes
        }
    }, [poNumberData]);

    // Handle input change
    const handleInputChange = (e) => {
        debugger;
        const { name, value, type } = e.target;
    
        // Handle specific validations
        if (name === "transporter_number" && value.length > 10) {
            return; // Prevent further execution if length exceeds 10
        }
        if (name === "driver_number" && value.length > 10) {
            return; // Prevent further execution if length exceeds 10
        }
        if (name === "challan_qty") {
            if (value > values.po_qty) {
                setChallanError(true);
            } else {
                setChallanError(false);
            }
        }
    
        // Handle dropdown for src_location
        if (name === "src_location") {
            const selectedItem = unloadingData.find((item) => item.code === value);
            setValues((prevValues) => ({
                ...prevValues,
                [name]: value,
                src_location_text: selectedItem ? selectedItem.text : "",
            }));
            return; // Exit after handling src_location
        }
    
        // General case for updating input values
        setValues((prevValues) => ({
            ...prevValues,
            [name]: type === "number" ? Number(value) : value,
        }));
    };
    

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
                Header: "Vehicle No.",
                accessor: "vehicleNumber",
                filterable: false,
            },
            {
                Header: "PO Number",
                accessor: "poNumber",
                filterable: false,
            },
            {
                Header: "Material Name",
                accessor: "materialName",
                filterable: false,
            },
            {
                Header: "Material Code",
                accessor: "materialCode",
                filterable: false,
            },
            {
                Header: "PO Qty.",
                accessor: "po_qty",
                filterable: false,
            },
            // {
            //     Header: "Net Weight",
            //     accessor: "materialWeight",
            //     filterable: false,
            // },
            {
                Header: "Transporter Name",
                accessor: "transporterName",
                filterable: false,
            },
            // {
            //     Header: "Transporter",
            //     accessor: "transporterCode",
            //     filterable: false,
            // },
            {
                Header: "Status",
                accessor: "status",
                Cell: (cell) => {

                    switch (cell.value) {
                        case "A":
                            return <span className="badge text-uppercase badge-soft-success"> Active </span>;
                        case "D":
                            return <span className="badge text-uppercase badge-soft-danger"> Deactive </span>;
                    }
                }
            }
        ],
    );

    const lineItem = [
        {
            options: [
                { label: "Select Line Item No", value: "" },
                { label: "10", value: "10" },
                { label: "20", value: "20" },
                { label: "30", value: "30" },
                { label: "40", value: "40" },
                { label: "50", value: "50" },
                { label: "60", value: "60" },
                { label: "70", value: "70" },
                { label: "80", value: "80" },
                { label: "90", value: "90" },
            ],
        },
    ];

    const unlodaingPoint = [
        {
            options: [
                { label: "Select Unloading Point", value: "" },
                { label: "YARD IN", value: "YARD IN" },
                { label: "GATE IN", value: "GATE IN" },
                { label: "PACKING IN", value: "PACKING IN" },
                { label: "GROSS WEIGHT", value: "GROSS WEIGHT" }

            ],
        },
    ];

    const weighmentRequired = [
        {
            options: [
                { label: "TRUE", value: "TRUE" },
                { label: "FALSE", value: "FALSE" },
            ],
        },
    ];




    document.title = "Map PO with Vehicle | EPLMS";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={"Map PO with Vehicle"} pageTitle="Master" />
                    <Row>
                        <Col lg={12}>
                            <Card className="mb-0">
                                <CardBody className="p-2 border">
                                    <Row className="mb-0 p-3">
                                        <Col lg={3}>
                                            <Label for="po_number" className="form-label">PO Number</Label><span className="text-danger">*</span>&nbsp;<span className="text-muted" >{"(Enter at least 3 digits)"}</span>
                                            <Autocomplete
                                                id="po_number"
                                                freeSolo
                                                options={options}
                                                getOptionLabel={(option) => option?.label || ''} // Handle undefined option gracefully
                                                value={po_number} // Ensure value is handled properly
                                                onChange={handleSelectChange}
                                                onInputChange={handlePOChange}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Search PO number"
                                                        variant="outlined"
                                                        error={poError}
                                                        helperText={poError ? poErrorText : ""}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            style: { height: '40px' }, // Add height here
                                                        }}
                                                    />
                                                )}
                                            />
                                            {poListFetching && <p className="mt-1 mb-0" style={{ color: "green", animation: "blink 1s infinite" }}>{"Please wait. PO data fetching..."}</p>}
                                            {duplicateEntry && <p className="mt-1 mb-0" style={{ color: "red", position: "relative", width: "max-content" }}>{"Duplicate entry. Please check either PO Number or Vehicle Number is duplicate. "}</p>}
                                        </Col>
                                        <Col md={3}>
                                            <Label className="form-label">Line-Item Number</Label><span className="text-danger">*</span>
                                            <Input
                                                name="po_lineitem"
                                                type="select"
                                                className={`form-select ${lineItemError ? "is-invalid" : ""}`} // Add conditional error class
                                                value={values.po_lineitem || ""}
                                                onChange={handleLineItemChange}
                                                required
                                                style={{ marginTop: "5px", height: "41px" }}
                                            >
                                                <option value={""}>{"--Select Line Item No--"}</option>
                                                {lineItemList.map((item, key) => (
                                                    <React.Fragment key={key}>
                                                        <option value={item.po_lineitem} key={key}>{item.po_lineitem}</option>
                                                    </React.Fragment>
                                                ))}
                                            </Input>
                                            {lineItemError && (
                                                <div className="invalid-feedback" style={{ marginLeft: "10px" }}>Line-Item Number is required.</div> // Display error message
                                            )}
                                        </Col>
                                        <Col md={3}>
                                            <Label for="vehicleNumber" className="form-label">Vehicle Number</Label><span className="text-danger">*</span>&nbsp;<span className="text-muted" >{"(Enter at least 3 digits)"}</span>
                                            <Autocomplete
                                                id="vehicleNumber"
                                                freeSolo
                                                options={vehicleOptions}
                                                getOptionLabel={(option) => option.registration_number || option}
                                                value={vehicleNumber || ''} // Ensure value is not undefined
                                                onChange={handleAutocompleteChange}
                                                onInputChange={handleVehicleChange}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Search Vehicle Number..."
                                                        variant="outlined"
                                                        error={vehicleError}
                                                        helperText={vehicleError ? "Vehicle number is required!" : ""}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            style: { height: '40px' }, // Add height here
                                                        }}
                                                    />
                                                )}
                                            />
                                            {vehicleListFetching && <p className="mt-1 mb-0" style={{ color: "green", animation: "blink 1s infinite" }}>{"Please wait. Vehicle data fetching..."}</p>}
                                        </Col>
                                        <Col md={3} className="">
                                            <button
                                                type="button"
                                                className="btn btn-success add-btn"
                                                id="create-btn"
                                                style={{ marginTop: "34px" }}
                                                onClick={handleAddData}
                                            >
                                                <i className="ri-add-line align-bottom me-1"></i> Add Data
                                            </button>
                                        </Col>

                                    </Row>
                                </CardBody>
                                <CardBody className="pt-4 border">
                                    <Nav pills className="nav-customs nav-danger mb-0 nav nav-pills">
                                        <NavItem>
                                            <NavLink id="tab1" style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "1", })} onClick={() => { outlineBorderNavtoggle("1"); }}>  Mapped Data     </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink id="tab2" style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "2", })} onClick={() => { outlineBorderNavtoggle("2"); }}>   Manual Mapping Data    </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <TabContent activeTab={outlineBorderNav} className="text-muted border">
                                        <TabPane tabId="1" id="border-nav-home" className="p-3">
                                            <div>

                                                <TableContainer
                                                    columns={columns}
                                                    data={mappedData}
                                                    isGlobalFilter={true}
                                                    isAddUserList={false}
                                                    customPageSize={5}
                                                    isGlobalSearch={true}
                                                    className="custom-header-css"
                                                    SearchPlaceholder='Search...'
                                                    tableClass="res_table"
                                                />
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                    <TabContent activeTab={outlineBorderNav} className="text-muted border">
                                        <TabPane tabId="2" id="border-nav-home" className="p-3">
                                            {tableData.length > 0 ? (
                                                <Table bordered className="mt-3 text-center">
                                                    <thead>
                                                        <tr>
                                                            <th>Select</th>
                                                            <th>PO Number</th>
                                                            <th>Vehicle Number</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {tableData.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={item.selected || false}
                                                                        onChange={() => handleSelectRow(index)}
                                                                    />
                                                                </td>
                                                                <td>{item.po_number}</td>
                                                                <td>{item.vehicleNumber}</td>
                                                                <td>
                                                                    <Button color="danger" className="btn-sm" onClick={() => handleDelete(index)}>
                                                                        Delete
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            ) :
                                                <div className="text-center"><img src={logoDark} alt="" height="273" width="400" /></div>
                                            }

                                            {/* Submit Button */}
                                            {tableData.length > 0 && (
                                                <Button color="success" className="mt-0" onClick={handleSubmit}>
                                                    {loadingParameter ? (
                                                        <>
                                                            <Spinner size="sm" className="me-2 visible" />
                                                            Loading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="ri-stack-line align-bottom me-1"></i>
                                                            {'Map Vehicle'}
                                                        </>
                                                    )}
                                                </Button>
                                            )}

                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>

                            {poDetailsSection && poNumberData !== undefined ? (
                                <div className="">
                                    <h6 className="text-muted text-color-blue bg-primary text-uppercase fw-semibold" onClick={() => firstCollapse()}   >
                                        <span class="margin-left">{`PO DETAILS ${poNumberData && poNumberData ? '|| ' + poNumberData.po_number + '|| ' + poNumberData.company_code : ""}`}</span> <i style={{ float: "right" }} className={icon} />
                                    </h6>
                                    <Collapse className="" isOpen={isCollapse}>
                                        <Card className="mt-0 mb-2">
                                            <CardBody>
                                                <Row className="g-3">
                                                    {/* <Col lg={3}>
                                                        <div>
                                                            <Label className="form-label" >Line-Item Number</Label>
                                                            <Input
                                                                name="po_lineitem"
                                                                type="select"
                                                                className="form-select"
                                                                value={values.po_lineitem || ""}
                                                                onChange={handleInputChange}
                                                                required
                                                            >
                                                                <option value={""}>{"--Select Line Item No--"}</option>
                                                                {lineItemList.map((item, key) => (
                                                                    <React.Fragment key={key}>
                                                                        {<option value={item.line_item} key={key}>{item.line_item}</option>}
                                                                    </React.Fragment>
                                                                ))}
                                                            </Input>
                                                        </div>
                                                    </Col> */}
                                                    <Col md={3}>
                                                        <Label className="form-label">PO Quantity</Label>
                                                        <Input type="text" className="form-control"
                                                            name="po_qty"
                                                            placeholder="Enter PO Quantity"
                                                            value={values.po_qty || ""}
                                                            onChange={handleInputChange}
                                                            disabled
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Remaining Quantity</Label>
                                                        <Input type="text" className="form-control"
                                                            name="po_qty"
                                                            value={values.remaining_qty || ""}
                                                            onChange={handleInputChange}
                                                            disabled
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Material</Label>
                                                        <Input type="text" className="form-control"
                                                            name="material_code"
                                                            placeholder="Enter Material Code"
                                                            value={values.material_code || ""}
                                                            onChange={handleInputChange}
                                                            disabled
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Transporter Name</Label>
                                                        <Input type="text" className="form-control"
                                                            name="transporter_name"
                                                            placeholder="Enter Transporter Name"
                                                            value={values.transporter_name || ""}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Transporter Code</Label>
                                                        <Input type="text" className="form-control"
                                                            name="transporter_code"
                                                            placeholder="Enter Transporter Code"
                                                            value={values.transporter_code}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Transporter Number</Label>
                                                        <Input type="number" className="form-control"
                                                            name="transporter_number"
                                                            placeholder="Enter Transporter Number"
                                                            value={values.transporter_number}
                                                            onChange={handleInputChange}
                                                            maxlength="10"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Total Quantity</Label>
                                                        <Input type="text" className="form-control"
                                                            name="total_qty"
                                                            placeholder="Enter Total Quantity"
                                                            value={values.total_qty}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Challan Quantity</Label>
                                                        <Input type="text" className="form-control"
                                                            name="challan_qty"
                                                            placeholder="Enter Challan Quantity"
                                                            value={values.challan_qty}
                                                            onChange={handleInputChange}
                                                            ref={challanQtyRef} // Attach the ref to the input
                                                        />
                                                        {challanError && <p style={{ color: "red" }}>Challan Qty should less than PO Qty.</p>}
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Challan Number</Label>
                                                        <Input type="text" className="form-control"
                                                            name="challan_number"
                                                            placeholder="Enter Challan Number"
                                                            value={values.challan_number}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Challan Date</Label>
                                                        <Input type="date" className="form-control"
                                                            name="challan_date"
                                                            placeholder="Select Challan Date"
                                                            value={values.challan_date}
                                                            onChange={handleInputChange}
                                                            max={today}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Challan TW</Label>
                                                        <Input type="text" className="form-control"
                                                            name="challan_TW"
                                                            placeholder="Enter Challan TW"
                                                            value={values.challan_TW}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Challan GW</Label>
                                                        <Input type="text" className="form-control"
                                                            name="challan_GW"
                                                            placeholder="Enter Challan GW"
                                                            value={values.challan_GW}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Lorry Receipt No</Label>
                                                        <Input type="text" className="form-control"
                                                            name="lorry_RN"
                                                            placeholder="Lorry Receipt No"
                                                            value={values.lorry_RN}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Supplier Order No</Label>
                                                        <Input type="text" className="form-control"
                                                            name="Supplier_OrderNo"
                                                            placeholder="Enter Supplier Order Number"
                                                            value={values.Supplier_OrderNo}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Driver Name</Label>
                                                        <Input type="text" className="form-control"
                                                            name="driver_name"
                                                            placeholder="Enter Driver Name"
                                                            value={values.driver_name}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Driver Number</Label>
                                                        <Input type="number" className="form-control"
                                                            name="driver_number"
                                                            placeholder="Enter Driver Number"
                                                            value={values.driver_number}
                                                            onChange={handleInputChange}
                                                            maxlength="10"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Invoice Number</Label>
                                                        <Input type="text" className="form-control"
                                                            name="invoice_number"
                                                            placeholder="Enter Invoice Number"
                                                            value={values.invoice_number}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Invoice Date</Label>
                                                        <Input type="date" className="form-control"
                                                            name="invoice_date"
                                                            placeholder="Enter Invoice Date"
                                                            value={values.invoice_date}
                                                            onChange={handleInputChange}
                                                            max={today}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">RY Slip Number</Label>
                                                        <Input type="text" className="form-control"
                                                            name="slip_umber"
                                                            placeholder="Enter RY Slip Number"
                                                            value={values.slip_umber}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">RY Slip Date</Label>
                                                        <Input type="date" className="form-control"
                                                            name="slip_date"
                                                            placeholder="Select RY Slip Date"
                                                            value={values.slip_date}
                                                            onChange={handleInputChange}
                                                            max={today}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">RY Weight</Label>
                                                        <Input type="number" className="form-control"
                                                            name="ry_weight"
                                                            placeholder="Select RY Weight"
                                                            value={values.ry_weight}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Reason For Empty Truck</Label>
                                                        <Input type="text" className="form-control"
                                                            name="remarks"
                                                            placeholder="Reason For Empty Truck"
                                                            value={values.remarks}
                                                            onChange={handleInputChange}
                                                            maxlength="60"
                                                        />
                                                    </Col>
                                                    
                                                    <Col md={3}>
                                                        <Label className="form-label">LR Date</Label>
                                                        <Input type="date" className="form-control"
                                                            name="lr_date"
                                                            placeholder="Select LR Date"
                                                            value={values.lr_date}
                                                            onChange={handleInputChange}
                                                            max={today}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Net Weight</Label>
                                                        <Input type="text" className="form-control"
                                                            name="net_weight"
                                                            placeholder="Enter Net Weight"
                                                            value={values.net_weight}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Supplier TW</Label>
                                                        <Input type="text" className="form-control"
                                                            name="supplier_TW"
                                                            placeholder="Enter Supplier TW"
                                                            value={values.supplier_TW}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Supplier GW</Label>
                                                        <Input type="text" className="form-control"
                                                            name="supplier_GW"
                                                            placeholder="Enter Supplier GW"
                                                            value={values.supplier_GW}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Outbound Delivery No</Label>
                                                        <Input type="text" className="form-control"
                                                            name="OB_DelNo"
                                                            placeholder="Enter Outbound Delivery No"
                                                            value={values.OB_DelNo}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Mode of Delivery</Label>
                                                        <Input type="text" className="form-control"
                                                            name="mode_of_delivery"
                                                            placeholder="Enter Mode of Delivery"
                                                            value={values.mode_of_delivery}
                                                            onChange={handleInputChange}
                                                            maxlength="15"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Nature of Item</Label>
                                                        <Input type="text" className="form-control"
                                                            name="nature_item"
                                                            placeholder="Enter Nature of Item"
                                                            value={values.nature_item}
                                                            onChange={handleInputChange}
                                                            maxlength="25"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Party Type</Label>
                                                        <Input type="text" className="form-control"
                                                            name="party_type"
                                                            placeholder="Enter Party Type"
                                                            value={values.party_type}
                                                            onChange={handleInputChange}
                                                            maxlength="20"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label" >Is Weighment Reqd.</Label>
                                                        <Input
                                                            name="is_weighment"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.is_weighment}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            {weighmentRequired.map((item, key) => (
                                                                <React.Fragment key={key}>
                                                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                </React.Fragment>
                                                            ))}
                                                        </Input>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Vehicle Type</Label>
                                                        <Input type="text" className="form-control"
                                                            name="vehicle_type"
                                                            placeholder="Enter Vehicle Type"
                                                            value={values.vehicle_type}
                                                            onChange={handleInputChange}
                                                            maxlength="20"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">IN Gate No</Label>
                                                        <Input type="text" className="form-control"
                                                            name="gate_no"
                                                            placeholder="Enter In Gate No"
                                                            value={values.gate_no}
                                                            onChange={handleInputChange}
                                                            maxlength="2"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Sub Transporter</Label>
                                                        <Input type="text" className="form-control"
                                                            name="sub_transporter"
                                                            placeholder="Enter Sub Transporter"
                                                            value={values.sub_transporter}
                                                            onChange={handleInputChange}
                                                            maxlength="35"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Miscellaneous Transporter</Label>
                                                        <Input type="text" className="form-control"
                                                            name="mis_transporter"
                                                            placeholder="Enter Miscellaneous Transporter"
                                                            value={values.mis_transporter}
                                                            onChange={handleInputChange}
                                                            maxlength="20"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Cleaner Name</Label>
                                                        <Input type="text" className="form-control"
                                                            name="cleaner_name"
                                                            placeholder="Enter Cleaner Name"
                                                            value={values.cleaner_name}
                                                            onChange={handleInputChange}
                                                            maxlength="30"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Licence Number</Label>
                                                        <Input type="text" className="form-control"
                                                            name="license_number"
                                                            placeholder="Enter Licence Number"
                                                            value={values.license_number}
                                                            onChange={handleInputChange}
                                                            maxlength="25"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">No of Packs</Label>
                                                        <Input type="text" className="form-control"
                                                            name="no_of_packs"
                                                            placeholder="Enter No of Packs"
                                                            value={values.no_of_packs}
                                                            onChange={handleInputChange}
                                                            maxlength="30"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">No of other party packs</Label>
                                                        <Input type="text" className="form-control"
                                                            name="no_of_other_packes"
                                                            placeholder="Enter No of other party packs"
                                                            value={values.no_of_other_packes}
                                                            onChange={handleInputChange}
                                                            maxlength="30"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Backload slip number</Label>
                                                        <Input type="text" className="form-control"
                                                            name="backload_slip_no"
                                                            placeholder="Enter Backload slip number"
                                                            value={values.backload_slip_no}
                                                            onChange={handleInputChange}
                                                            maxlength="10"
                                                        />
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div>
                                                            <Label className="form-label" >Unloading Point/Source Location</Label>
                                                            <Input
                                                                name="src_location"
                                                                type="select"
                                                                className="form-select"
                                                                value={values.src_location}
                                                                onChange={handleInputChange}
                                                                required
                                                            >
                                                                <React.Fragment>
                                                                    <option value="" selected>Select Unloading Point</option>
                                                                    {unloadingData.map((item, key) => (<option value={item.code} key={key}>{item.name}</option>))}
                                                                </React.Fragment>
                                                            </Input>
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Source Location Text</Label>
                                                        <Input type="text" className="form-control"
                                                            name="src_location_text"
                                                            placeholder="Enter Source Location Text"
                                                            value={values.src_location_text}
                                                            onChange={handleInputChange}
                                                            maxlength="60"
                                                        />
                                                    </Col>
                                                    {/* <Col md={3}>
                                                        <Label className="form-label">Sub Source Location</Label>
                                                        <Input type="text" className="form-control"
                                                            name="sub_src_location"
                                                            placeholder="Enter Sub Source Location"
                                                            value={values.sub_src_location}
                                                            onChange={handleInputChange}
                                                            maxlength="4"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Label className="form-label">Sub Source Location Text</Label>
                                                        <Input type="text" className="form-control"
                                                            name="sub_src_locationText"
                                                            placeholder="Enter Sub Source Location Text"
                                                            value={values.sub_src_locationText}
                                                            onChange={handleInputChange}
                                                            maxlength="60"
                                                        />
                                                    </Col> */}

                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                </div>
                            )
                                :
                                null
                            }




                        </Col>
                    </Row>
                    <ToastContainer closeButton={false} limit={1} />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default MapPOWithVehicle;
