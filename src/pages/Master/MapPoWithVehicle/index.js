import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, CardBody, Input, Nav, NavItem, NavLink, TabContent, TabPane, Button, Collapse, Table, Spinner } from "reactstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { toast, ToastContainer } from 'react-toastify';
import TableContainer from "../../../Components/Common/TableContainer";
import classnames from "classnames";
import logoDark from "../../../assets/images/no_data.png";
import Loader from "../../../Components/Common/Loader_new";

const MapPOWithVehicle = () => {
    // State to hold form values
    const [values, setValues] = useState({
        po_lineitem: "",         // Default initial values
        material_code: "",
        transporter_name: "",
        transporter_code: "",
        total_qty: "",
        challan_qty: "",
        challan_number: "",
        challan_dt: "",
        challan_TW: "",
        challan_GW: "",
        lorry_RN: "",
        Supplier_OrderNo: "",
        driver_name: "",
        eway_no: "",
        eway_dt: "",
        slip_umber: "",
        empty_vehicle: "",
        src_location: "",
        lr_date: "",
        supplier_TW: "",
        supplier_GW: "",
        gate_no: 1,
        mode_of_delivery: "",
        nature_item: "",
        party_type: "",
        vehicle_type: "",
        weighment: true,
        sub_transporter: "",
        mis_transporter: "",
        cleaner_name: "",
        license_number: "",
        no_of_packs: "",
        no_of_other_packes: "",
        storageLocation: "",
        src_location: "",
        src_location_text: "",
        sub_src_location: "",
        sub_src_location_text: "",
        trip_risk: "",
        unloadingMode: ""
    });

    // State to manage selected values and options
    const [Plant_Code, setPlantCode] = useState('');
    const [deliveryModeData, setDeliveryModeData] = useState([]);
    const [natureOfItemData, setNatureOfItemData] = useState([]);
    const [partyTypeData, setPartyTypeData] = useState([]);
    const [sourceLocationData, setSourceLocationData] = useState([]);
    const [subSourceLocationData, setSubSourceLocationData] = useState([]);
    const [tripRiskData, setTripRiskData] = useState([]);
    const [unlaodingModeData, setUnlaodingModeData] = useState([]);
    const [subtransporter, setSubtransporter] = useState([]);
    const [storageLocation, setStorageLocation] = useState([]);

    const [po_number, setPoNumber] = useState(null);
    const [currentLineitem, setCurrentLineitem] = useState(null);
    const [currentChallanQty, setCurrentChallanQty] = useState(null);
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicle_type, setVehicleType] = useState('');
    const [tranporterCode, setTransporterCode] = useState('');
    const [poError, setPoError] = useState(false);
    const [poErrorText, setPoErrorText] = useState("");
    const [lineItemError, setLineItemError] = useState(false);
    const [duplicateEntry, setDuplicateEntry] = useState("");
    const [vehicleError, setVehicleError] = useState(false);
    const [vehicleTypeNoDataError, setVehicleTypeNoDataError] = useState(false);
    const [transporterError, setTransporterError] = useState(false);
    const [tableData, setTableData] = useState([]);
    const today = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format
    const [options, setOptions] = useState([]);
    const [mappedData, setMappedData] = useState([]);
    const [poNumberData, setDataOnTheBasisOfPONumber] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);


    const [vehicleOptions, setVehicleOptions] = useState([]);
    const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
    const [vehicleListFetching, setVehicleListFetching] = useState(false);
    const [vehicleTypeFetching, setvehicleTypeFetching] = useState(false);
    const [transporterOptions, setTransporterOptions] = useState([]);
    const [transporterFetching, setTransporterListFetching] = useState(false);
    const [poListFetching, setPOListFetching] = useState(false);
    const [poDetailsSection, setPODetailsSection] = useState(false);
    const [lineItemList, setLineItemList] = useState([]);
    const [loadingParameter, setErrorParameter] = useState(false);
    const [challanError, setChallanError] = useState(false);
    const [ChallanQtyError, setChallanQtyError] = useState(false);
    const [modeOfDeliveryError, setModeOfDeliveryError] = useState(false);
    const [transporterCodeError, setTransporterCodeError] = useState(false);
    const [vehicleTypeError, setVehicleTypeError] = useState(false);
    const [checkBoxMsg, setcheckBoxMsg] = useState(false);
    const [outlineBorderNav, setoutlineBorderNav] = useState("1");
    const challanQtyRef = useRef(null); // Create a ref for the input field
    const outlineBorderNavtoggle = (tab) => {
        if (outlineBorderNav !== tab) {
            setoutlineBorderNav(tab);
        }
    };
    const [loader, setloader] = useState(false);
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
            //getSourceLocationList(plantcode);

            getDeliveryModeList(plantcode);
            getNatureOfItemList(plantcode);
            getPartyTypeList(plantcode);
            getSourceLocationList(plantcode);
            getSubSourceLocationList(plantcode);
            getTripRiskList(plantcode);
            getUnloadingMode(plantcode);
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

    const [modal, setModal] = useState(false);
    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
        } else {
            setModal(true);
        }
    }, [modal]);

    const [viewDataById, setViewDataById] = useState([]);
    const handleCustomerClick = useCallback((arg) => {
        debugger

        // setClickedRowId(arg);
        // setIsEdit(true);
        toggle();
        const id = arg;
        setloader(true);
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poScreen/poById/${id}`, config)
            .then(res => {
                const result = res;
                setViewDataById(result);
                setloader(false);
            })

    }, [toggle]);


    const getAllMappedData = (plantcode) => {

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poScreen/poMap?plantCode=${plantcode}`, config)
            .then(res => {
                setMappedData(res);
            });
    }

    const getDeliveryModeList = (plantCode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/DeliveryMode/getAllDeliveryMode?plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                if (data.errorMsg) {
                    setDeliveryModeData([]);
                }
                else {
                    setDeliveryModeData(data);
                }

            })
    }
    const getNatureOfItemList = (plantCode) => {
        debugger;
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/natureOfItems/getByUnitCode/${plantCode}`, config)
            .then(res => {
                if (!res) {
                    setNatureOfItemData([]);
                    return;
                }
    
                const data = res; // Ensure we are working with the response data
    
                if (data.errorMsg) {
                    setNatureOfItemData([]);
                } 
                else if (data.msg && data.msg.includes("No items found with unitCode")) {
                    setNatureOfItemData([]);
                } 
                else {
                    setNatureOfItemData(data);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setNatureOfItemData([]); // Handle API failure gracefully
            });
    };
    
    const getPartyTypeList = (plantCode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/party-type-master/all?plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;

                if (data.errorMsg) {
                    setPartyTypeData([]);
                }
                else {
                    setPartyTypeData(data);
                }
            })
    }

    const getSourceLocationList = (plantCode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sourceMaster/findAllData?plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setSourceLocationData(data);
            })
    }

    const getSubSourceLocationList = (plantCode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/subSourceMaster/findAllData?plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                setSubSourceLocationData(data);
            })
    }

    const getTripRiskList = (plantCode) => {

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/tripRiskMaster/all?plantCode=${plantCode}`, config)
            .then(res => {
                const data = res;
                if (data.errorMsg) {
                    setTripRiskData([]);
                }
                else {
                    setTripRiskData(data);
                }
            })
    }
    const getUnloadingMode = (plantCode) => {

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/unloadingMode/getByPlantCode/${plantCode}`, config)
            .then(res => {
                const data = res;
                if (data.errorMsg) {
                    setUnlaodingModeData([]);
                }
                else {
                    setUnlaodingModeData(data);
                }
            })
    }


    const getStorageLocation = (material) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poManual/getStorageLocation?materialCode=${material}&plantCode=${Plant_Code}`, config)
            .then(res => {
                const device = res;
                if (res && res.message === 'Storage Location data not found') {
                    setStorageLocation([]);
                }
                else {
                    setStorageLocation(device);
                }

            });
    }


    const handlePOAutocompleteChange = (_, value) => {

        setPoNumber(value || null);
        setPoError(false);
        setIsDisabled(false);
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
        setLineItemList([]);
        setValues({
            ...values,
            "po_lineitem": "",
        });
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poScreen/poLineItem?plantCode=${Plant_Code}&poNumber=${po_number}`, config)
            .then(res => {
                setLineItemList(res);
            });
    }

    const handleLineItemChange = (e) => {

        setDataOnTheBasisOfPONumber(null);
        const { name, value, type } = e.target;
        setValues({
            ...values,
            [name]: value || value.valueAsNumber,
        });
        setValues({
            ...values,
            "mode_of_delivery": "",
            "vehicle_type": "",
        });
        if (value !== "") {
            setCurrentLineitem(value);
            setLineItemError(false);
            axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poScreen/poDetails?plantCode=${Plant_Code}&poNumber=${po_number.value}&poLineItem=${value}`, config)
                .then(res => {
                    setDataOnTheBasisOfPONumber(res);
                    setPODetailsSection(true);
                    setoutlineBorderNav("2");
                    setSubtransporter(res.subTransporters ? res.subTransporters : []);
                    toast.success("Data fetched successfully. Please review PO Details below.", { autoClose: 3000 });
                    //Disable add button if response date is in the past
                    if (res.poValidDate) {
                        const currentDate = new Date();
                        const formattedResponseDate = new Date(res.poValidDate); // Convert response date to Date object
                    
                        // Extract only the date part (YYYY-MM-DD) for comparison
                        const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                        const responseDateOnly = new Date(formattedResponseDate.getFullYear(), formattedResponseDate.getMonth(), formattedResponseDate.getDate());
                    
                        // Compare dates without time
                        if (responseDateOnly < currentDateOnly) {
                            setIsDisabled(true); // Disable button if response date is in the past
                        } else {
                            setIsDisabled(false);
                        }
                    }
                    
                    if (res && res.material_code) {
                        getStorageLocation(res.material_code);
                    }
                });
        }
        else {
            setLineItemError(true);
        }

    };

    const handleVehilceAutocompleteChange = (_, value) => {
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

    const handleVehicletypeAutocompleteChange = (_, newValue) => {
        setVehicleType(newValue);
        setVehicleTypeNoDataError(false);
        setVehicleTypeError(false);
        if (newValue) {
            setValues((prevValues) => ({
                ...prevValues,
                vehicle_type: newValue.vehicleType,
            }));
        }
    };

    const handleVehicletypeChange = async (event, value) => {
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
        if (sanitizedValue && sanitizedValue.length >= 3) {
            setvehicleTypeFetching(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/vehicleType/all?unitCode=${Plant_Code}&vehicleType=${sanitizedValue}`, config);
                setVehicleTypeOptions(response || []);
                if(response.errorMsg === 'Data not found for {id}'){
                    setVehicleTypeNoDataError(true);
                    setVehicleTypeOptions([]);
                }
                else{

                    setVehicleTypeOptions(response || []);
                }
            } catch (error) {
                console.error("Error fetching vehicle type options", error);
            }
            setvehicleTypeFetching(false);
        } else {
            // Clear options if input is cleared
            setVehicleTypeOptions([]);
            setvehicleTypeFetching(false);
        }
    };

    const handleTransporterAutocompleteChange = (event, newValue) => {
        debugger;
        setTransporterCode(newValue);
        setTransporterError(false);
        setTransporterCodeError(false);

        if (newValue) {
            setValues((prevValues) => ({
                ...prevValues,
                transporter_code: newValue.vendorCode,
                transporter_name: newValue.vendorName
            }));
        }
    };

    const handleTransporterChange = async (event, value) => {
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
        if (sanitizedValue && sanitizedValue.length >= 3) {
            setTransporterListFetching(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/poManual/vendorCode?plantCode=${Plant_Code}&vendorCode=${sanitizedValue}`, config);
                if(response.message === 'Vendor data not found'){
                    setTransporterError(true);
                    setTransporterOptions([]);
                }
                else{

                    setTransporterOptions(response || []);
                }
            } catch (error) {
                console.error("Error fetching data..", error);
            }
            setTransporterListFetching(false);
        } else {
            // Clear options if input is cleared
            setTransporterOptions([]);
            setTransporterListFetching(false);
        }
    };


    const handleDelete = (index) => {
        const updatedData = tableData.filter((_, i) => i !== index);
        setTableData(updatedData);

        // Check if the updated tableData is empty
        if (updatedData.length === 0) {
            setoutlineBorderNav("2");
        }
    };

    const handleSelectRow = (index) => {
        const updatedData = [...tableData];
        updatedData[index].selected = !updatedData[index].selected;
        setTableData(updatedData);
    };

    const handleSubmit = async () => {

        const selectedData = tableData.filter((item) => item.selected);
        if (selectedData.length === 0) {
            setcheckBoxMsg(true)
            return;
        } else {
            setcheckBoxMsg(false)
        }
        //console.log("Selected Table Data:", selectedData);
        setErrorParameter(true);
        const updatedData = selectedData.map(({ subTransporters, ...rest }) => rest);
        console.log("Updated and Final Data:", updatedData);
        try {
            const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/poScreen/submitPo`, updatedData, config)
            console.log(res.data);
            if (res.errorMsg) {
                toast.error(res.errorMsg, { autoClose: 3000 });
                setErrorParameter(false);
            }
            else if (res.message && (res.message).includes("already mapped")) {
                toast.error(res.message, { autoClose: 3000 });
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
                setPODetailsSection(false);
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
        let hasError = false;
    
        // Validate PO Number
        if (!po_number) {
            setPoError(true);
            setPoErrorText("PO Number Required!");
            hasError = true;
        } else {
            setPoError(false);
            setPoErrorText("");
        }
    
        // Validate Vehicle Number
        if (!vehicleNumber) {
            setVehicleError(true);
            hasError = true;
        } else {
            setVehicleError(false);
        }
    
        // Validate Line Item
        if (!currentLineitem || currentLineitem === "") {
            setLineItemError(true);
            hasError = true;
        } else {
            setLineItemError(false);
        }
    
        // Validate Challan Quantity
        if (values.challan_qty === 0 || values.challan_qty === "" || values.challan_qty === undefined) {
            setChallanQtyError(true);
            hasError = true;
        } else {
            setChallanQtyError(false);
        }
    
        // Validate Mode of Delivery
        if (!values.mode_of_delivery) {
            setModeOfDeliveryError(true);
            hasError = true;
        } else {
            setModeOfDeliveryError(false);
        }
    
        // Validate Vehicle Type
        if (!values.vehicle_type) {
            setVehicleTypeError(true);
            hasError = true;
        } else {
            setVehicleTypeError(false);
        }
    
        // Validate Transporter Code
        if (!values.transporter_code) {
            setTransporterCodeError(true);
            hasError = true;
        } else {
            setTransporterCodeError(false);
        }
    
        // If any error exists, scroll and stop execution
        if (hasError) {
            window.scrollBy({ top: 300, behavior: "smooth" });
            return;
        } else {
            window.scrollBy({ top: 0, behavior: "smooth" });
        }
    
        // Check for Duplicates
        const isDuplicate = tableData.some(
            (data) =>
                data.po_number === po_number?.value &&
                data.lineItem === currentLineitem &&
                data.vehicleNumber === vehicleNumber?.registration_number
        );
    
        if (isDuplicate) {
            setDuplicateEntry("Duplicate Entry.");
            return;
        }
    
        // Validate Challan Quantity against PO Quantity
        if (parseInt(values.challan_qty) > values.po_qty) {
            toast.error("Challan Qty should not be greater than PO Qty.", { autoClose: 3000 });
            setChallanError(true);
            challanQtyRef.current.focus();
            window.scrollBy({ top: 300, behavior: "smooth" });
            return;
        }
    
        // Add Data to Table if All Inputs are Valid
        if (po_number && vehicleNumber) {
            const obj = JSON.parse(sessionStorage.getItem("authUser"));
            const userId = obj.data._id;
    
            setTableData([
                ...tableData,
                {
                    ...values,
                    po_number: po_number.value,
                    lineItem: currentLineitem,
                    challan_qty: currentChallanQty,
                    vehicleNumber: vehicleNumber.registration_number,
                    selected: false,
                    userId: userId,
                }
            ]);
    
            outlineBorderNavtoggle("3");
    
            // Clear inputs and errors
            setVehicleNumber('');
            setPoError(false);
            setVehicleError(false);
            setLineItemError(false);
            setChallanQtyError(false);
            setModeOfDeliveryError(false);
            setVehicleTypeError(false);
            setTransporterCodeError(false);
        }
    };
    


    // Use effect to update state when props.data changes
    useEffect(() => {
        if (poNumberData) {
            setValues({
                ...Object.keys(values).reduce((acc, key) => {
                    acc[key] = ''; // Reset all keys to an empty string (or null if preferred)
                    return acc;
                }, {}),
                ...poNumberData,
            });
        }
    }, [poNumberData]);

    // Handle input change
    const handleInputChange = (e) => {

        setChallanError(false);
        const { name, value, type } = e.target;

        // Handle specific validations
        const regex = /^[A-Za-z ]*$/;
        if (name === "driver_name" && !regex.test(value)) {
            return; // Do not update if validation fails
        }
        if (name === "cleaner_name" && !regex.test(value)) {
            return; // Do not update if validation fails
        }
        // if (name === "driver_number" && value.length > 10) {
        //     return; // Prevent further execution if length exceeds 10
        // }
        if (name === "challan_qty") {
            setChallanQtyError(false);
            if (value > values.remaining_qty) {
                setChallanError(true);
                setIsDisabled(true);
            } else {
                setChallanError(false);
                setCurrentChallanQty(value);
                setIsDisabled(false);
            }
        }
        if (name === "mode_of_delivery") {
            setModeOfDeliveryError(false);
        }
        if (name === "vehicle_type") {
            setVehicleTypeError(false);
        }

        // Handle dropdown for src_location
        if (name === "src_location") {
            const selectedItem = sourceLocationData.find((item) => item.sourceCode === value);
            setValues((prevValues) => ({
                ...prevValues,
                [name]: value,
                src_location_text: selectedItem ? selectedItem.sourceName : "",
            }));
            return; // Exit after handling src_location
        }
        if (name === "sub_src_location") {
            const selectedItem = subSourceLocationData.find((item) => item.subSourceCode === value);
            setValues((prevValues) => ({
                ...prevValues,
                [name]: value,
                sub_src_location_text: selectedItem ? selectedItem.subSource : "",
            }));
            return; // Exit after handling src_location
        }

        // General case for updating input values
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value || value.valueAsNumber,
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
            // {
            //     Header: "Status",
            //     accessor: "status",
            //     Cell: (cell) => {

            //         switch (cell.value) {
            //             case "A":
            //                 return <span className="badge text-uppercase badge-soft-success"> Active </span>;
            //             case "D":
            //                 return <span className="badge text-uppercase badge-soft-danger"> Deactive </span>;
            //         }
            //     }
            // },
            {
                Header: "Action",
                Cell: (cellProps) => {
                    return (
                        <ul className="list-inline hstack gap-2 mb-0">
                            <li className="list-inline-item edit" title="View Details">
                                <Link
                                    to="#"
                                    className="text-primary d-inline-block edit-item-btn"
                                    onClick={() => { const id = cellProps.row.original.id; handleCustomerClick(id); }}
                                >

                                    <i className="ri-eye-fill fs-16"></i>
                                </Link>
                            </li>
                        </ul>
                    );
                },
            },
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
                { label: "YES", value: true },
                { label: "NO", value: false },
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
                                            <Label for="po_number" className="form-label">PO Number</Label><span className="text-danger">*</span>
                                            <Autocomplete
                                                id="po_number"
                                                freeSolo
                                                options={options}
                                                getOptionLabel={(option) => option?.label || ''} // Handle undefined option gracefully
                                                value={po_number} // Ensure value is handled properly
                                                onChange={handlePOAutocompleteChange}
                                                onInputChange={handlePOChange}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Enter at least 3 digits..."
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
                                            {duplicateEntry && <p className="mt-1 mb-0" style={{ color: "red", position: "relative", width: "max-content" }}>{"Duplicate entry. This PO No. and Vehicle No. already added in the table with same Line Item Number "}</p>}
                                            {isDisabled && <p className="mt-1 mb-0" style={{ color: "red", position: "relative", width: "max-content" }}>{"PO is expired. You can't add data for this PO."}</p>}
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
                                            <Label for="vehicleNumber" className="form-label">Vehicle Number</Label><span className="text-danger">*</span>
                                            <Autocomplete
                                                id="vehicleNumber"
                                                freeSolo
                                                options={vehicleOptions}
                                                getOptionLabel={(option) => option.registration_number || option}
                                                value={vehicleNumber || ''} // Ensure value is not undefined
                                                onChange={handleVehilceAutocompleteChange}
                                                onInputChange={handleVehicleChange}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Enter at least 3 digits..."
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
                                                disabled={isDisabled}
                                            >
                                                <i className="ri-add-line align-bottom me-1"></i> Add Data
                                            </button>
                                        </Col>

                                    </Row>
                                </CardBody>
                                <CardBody className="pt-4 border">
                                    <Nav pills className="nav-customs nav-danger mb-0 nav nav-pills">
                                        <NavItem>
                                            <NavLink id="tab1" style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "1", })} onClick={() => { outlineBorderNavtoggle("1"); }}>  PO Mapped Data     </NavLink>
                                        </NavItem>
                                        {poDetailsSection && poNumberData !== undefined ? (
                                            <NavItem>
                                                <NavLink id="tab2" style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "2", })} onClick={() => { outlineBorderNavtoggle("2"); }}>   PO Details    </NavLink>
                                            </NavItem>
                                        ) : null}
                                        {tableData.length > 0 ? (
                                            <NavItem>
                                                <NavLink id="tab2" style={{ cursor: "pointer" }} className={classnames({ active: outlineBorderNav === "3", })} onClick={() => { outlineBorderNavtoggle("3"); }}>   Manual Mapping    </NavLink>
                                            </NavItem>
                                        ) : null}

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

                                            <Row className="g-3">
                                                <Col md={3}>
                                                    <Label className="form-label">Vendor Number</Label>
                                                    <Input type="text" className="form-control"
                                                        name="vendor_code"
                                                        value={values.vendor_code || ""}
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
                                                    <Label className="form-label">{'Min PO Tolerance(%)'}</Label>
                                                    <Input type="text" className="form-control"
                                                        name="under_delivery_value"
                                                        value={values.under_delivery_tol || ""}
                                                        onChange={handleInputChange}
                                                        disabled
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <Label className="form-label">{'Max PO Tolerance(%)'}</Label>
                                                    <Input type="text" className="form-control"
                                                        name="over_delivery_value"
                                                        value={values.over_delivery_tol || ""}
                                                        onChange={handleInputChange}
                                                        disabled
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <Label className="form-label">Challan Quantity</Label><span style={{ color: "red" }}>*</span>
                                                    <Input type="number" className="form-control"
                                                        name="challan_qty"
                                                        placeholder="Enter Challan Quantity"
                                                        value={values.challan_qty}
                                                        onChange={handleInputChange}
                                                        ref={challanQtyRef} // Attach the ref to the input
                                                    />
                                                    {challanError && <p style={{ color: "red" }}>Must be less than Remaining Qty.</p>}
                                                    {ChallanQtyError && <p style={{ color: "red" }}>Please Enter Challan Quantity.</p>}
                                                </Col>
                                                <Col md={3}>
                                                    <Label for="transporter_code" className="form-label">Transporter Code</Label><span className="text-danger">*</span>
                                                    <Autocomplete
                                                        id="transporter_code"
                                                        freeSolo
                                                        options={transporterOptions}
                                                        getOptionLabel={(option) => option.vendorCode || option}
                                                        value={tranporterCode || ''} // Ensure value is not undefined
                                                        onChange={handleTransporterAutocompleteChange}
                                                        onInputChange={handleTransporterChange}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                placeholder="Enter at least 3 digits..."
                                                                variant="outlined"
                                                                error={transporterError}
                                                                helperText={transporterError ? "No data found!" : ""}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    style: { height: '40px', marginTop: "0" }, // Add height here
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    {transporterFetching && <p className="mt-1 mb-0" style={{ color: "green", animation: "blink 1s infinite" }}>{"Please wait..."}</p>}
                                                    {transporterCodeError && <p style={{ color: "red" }}>Select Transporter Code.</p>}
                                                </Col>
                                                <Col md={3}>
                                                    <Label className="form-label">Transporter Name</Label>
                                                    <Input type="text" className="form-control"
                                                        name="transporter_name"
                                                        placeholder="Enter Transporter Name"
                                                        value={values.transporter_name || ""}
                                                        onChange={handleInputChange}
                                                        disabled
                                                    />
                                                </Col>
                                                {/* <Col md={3}>
                                                    <Label className="form-label">Transporter Number</Label><span style={{ color: "red" }}>*</span>
                                                    <Input type="number" className="form-control"
                                                        name="transporter_number"
                                                        placeholder="Enter Transporter Number"
                                                        value={values.transporter_number}
                                                        onChange={handleInputChange}
                                                        maxlength="10"
                                                    />
                                                </Col> */}
                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Mode of Delivery</Label><span style={{ color: "red" }}>*</span>
                                                        <Input
                                                            name="mode_of_delivery"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.mode_of_delivery}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Mode of Delivery</option>
                                                                {deliveryModeData.map((item, key) => (<option value={item.delivery_mode} key={key}>{item.delivery_mode}</option>))}
                                                            </React.Fragment>
                                                        </Input>
                                                        {modeOfDeliveryError && <p style={{ color: "red" }}>Select Mode of Delivery.</p>}
                                                    </div>
                                                </Col>
                                                {/* <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Vehicle Type</Label><span style={{ color: "red" }}>*</span>
                                                        <Input
                                                            name="vehicle_type"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.vehicle_type}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Vehicle Type</option>
                                                                {vehicleTypeData.map((item, key) => (<option value={item.vehicleTypeCode} key={key}>{item.vehicleType}</option>))}
                                                            </React.Fragment>
                                                        </Input>
                                                        {vehicleTypeError && <p style={{ color: "red" }}>Select Vehicle Type.</p>}
                                                    </div>
                                                </Col> */}
                                                <Col md={3}>
                                                    <Label for="vehicle_type" className="form-label">Vehicle Type</Label><span className="text-danger">*</span>
                                                    <Autocomplete
                                                        id="vehicle_type"
                                                        freeSolo
                                                        options={vehicleTypeOptions}
                                                        getOptionLabel={(option) => option.vehicleType || option}
                                                        value={vehicle_type || ''} // Ensure value is not undefined
                                                        onChange={handleVehicletypeAutocompleteChange}
                                                        onInputChange={handleVehicletypeChange}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                placeholder="Enter at least 3 digits..."
                                                                variant="outlined"
                                                                error={vehicleTypeNoDataError}
                                                                helperText={vehicleTypeNoDataError ? "No data found!" : ""}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    style: { height: '40px', marginTop: "0" }, // Add height here
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    {vehicleTypeFetching && <p className="mt-1 mb-0" style={{ color: "green", animation: "blink 1s infinite" }}>{"Please wait..."}</p>}
                                                    {vehicleTypeError && <p style={{ color: "red" }}>Select vehicle type.</p>}
                                                </Col>
                                                <Col md={3}>
                                                    <Label className="form-label">Validity</Label>
                                                    <Input type="text" className="form-control"
                                                        name="poValidDate"
                                                        value={values.poValidDate}
                                                        disabled
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <Label className="form-label" >Is Weighment Reqd.</Label>
                                                    <Input
                                                        name="weighment"
                                                        type="select"
                                                        className="form-select"
                                                        value={values.weighment}
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
                                                    <Label className="form-label">Total Quantity</Label>
                                                    <Input type="number" className="form-control"
                                                        name="total_qty"
                                                        placeholder="Enter Total Quantity"
                                                        value={values.total_qty}
                                                        onChange={handleInputChange}
                                                    />
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
                                                        name="challan_dt"
                                                        placeholder="Select Challan Date"
                                                        value={values.challan_dt}
                                                        onChange={handleInputChange}
                                                    // max={today}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <Label className="form-label">Challan TW</Label>
                                                    <Input type="number" className="form-control"
                                                        name="challan_TW"
                                                        placeholder="Enter Challan TW"
                                                        value={values.challan_TW}
                                                        onChange={handleInputChange}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <Label className="form-label">Challan GW</Label>
                                                    <Input type="number" className="form-control"
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
                                                    <Label className="form-label">Cleaner Name</Label>
                                                    <Input type="text" className="form-control"
                                                        name="cleaner_name"
                                                        placeholder="Enter Cleaner Name"
                                                        value={values.cleaner_name}
                                                        onChange={handleInputChange}
                                                        maxlength="30"
                                                    />
                                                </Col>
                                                {/* <Col md={3}>
                                                    <Label className="form-label">Driver Number</Label>
                                                    <Input type="number" className="form-control"
                                                        name="driver_number"
                                                        placeholder="Enter Driver Number"
                                                        value={values.driver_number}
                                                        onChange={handleInputChange}
                                                        maxlength="10"
                                                    />
                                                </Col> */}
                                                <Col md={3}>
                                                    <Label className="form-label">EWAY Bill Number</Label>
                                                    <Input type="text" className="form-control"
                                                        name="eway_no"
                                                        placeholder="Enter Invoice Number"
                                                        value={values.eway_no}
                                                        onChange={handleInputChange}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <Label className="form-label">EWAY Bill Date</Label>
                                                    <Input type="date" className="form-control"
                                                        name="eway_dt"
                                                        placeholder="Enter Invoice Date"
                                                        value={values.eway_dt}
                                                        onChange={handleInputChange}
                                                    //max={today}
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
                                                {/* <Col md={3}>
                                                    <Label className="form-label">RY Slip Date</Label>
                                                    <Input type="date" className="form-control"
                                                        name="slip_date"
                                                        placeholder="Select RY Slip Date"
                                                        value={values.slip_date}
                                                        onChange={handleInputChange}
                                                    //max={today}
                                                    />
                                                </Col> */}
                                                {/* <Col md={3}>
                                                    <Label className="form-label">RY Weight</Label>
                                                    <Input type="number" className="form-control"
                                                        name="ry_weight"
                                                        placeholder="Select RY Weight"
                                                        value={values.ry_weight}
                                                        onChange={handleInputChange}
                                                    />
                                                </Col> */}
                                                <Col md={3}>
                                                    <Label className="form-label">Reason For Empty Truck</Label>
                                                    <Input type="text" className="form-control"
                                                        name="empty_vehicle"
                                                        placeholder="Reason For Empty Truck"
                                                        value={values.empty_vehicle}
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
                                                    // max={today}
                                                    />
                                                </Col>
                                                {/* <Col md={3}>
                                                    <Label className="form-label">Net Weight</Label>
                                                    <Input type="number" className="form-control"
                                                        name="net_weight"
                                                        placeholder="Enter Net Weight"
                                                        value={values.net_weight}
                                                        onChange={handleInputChange}
                                                    />
                                                </Col> */}
                                                {/* <Col md={3}>
                                                    <Label className="form-label">Supplier TW</Label>
                                                    <Input type="number" className="form-control"
                                                        name="supplier_TW"
                                                        placeholder="Enter Supplier TW"
                                                        value={values.supplier_TW}
                                                        onChange={handleInputChange}
                                                    />
                                                </Col> */}
                                                <Col md={3}>
                                                    <Label className="form-label">Supplier GW</Label>
                                                    <Input type="number" className="form-control"
                                                        name="supplier_GW"
                                                        placeholder="Enter Supplier GW"
                                                        value={values.supplier_GW}
                                                        onChange={handleInputChange}
                                                    />
                                                </Col>
                                                {/* <Col md={3}>
                                                    <Label className="form-label">Outbound Delivery No</Label>
                                                    <Input type="text" className="form-control"
                                                        name="OB_DelNo"
                                                        placeholder="Enter Outbound Delivery No"
                                                        value={values.OB_DelNo}
                                                        onChange={handleInputChange}
                                                    />
                                                </Col> */}

                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Nature of Item</Label>
                                                        <Input
                                                            name="nature_item"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.nature_item}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Nature of Item</option>
                                                                {natureOfItemData.map((item, key) => (<option value={item.natureItem} key={key}>{item.natureItem}</option>))}
                                                            </React.Fragment>
                                                        </Input>
                                                    </div>
                                                </Col>
                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Party Type</Label>
                                                        <Input
                                                            name="party_type"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.party_type}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Party Type</option>
                                                                {partyTypeData.map((item, key) => (<option value={item.partyTypeCode} key={key}>{item.partyType}</option>))}
                                                            </React.Fragment>
                                                        </Input>
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <Label className="form-label">IN Gate No</Label>
                                                    <Input type="number" className="form-control"
                                                        name="gate_no"
                                                        value={1}
                                                        onChange={handleInputChange}
                                                    />
                                                </Col>
                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Sub Transporter</Label>
                                                        <Input
                                                            name="sub_transporter"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.sub_transporter}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Sub Transporter</option>
                                                                {subtransporter.map((item, key) => (<option value={item.childTransporter} key={key}>{item.childTransporter}</option>))}
                                                            </React.Fragment>
                                                        </Input>
                                                    </div>
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
                                                {/* <Col md={3}>
                                                    <Label className="form-label">Backload slip number</Label>
                                                    <Input type="text" className="form-control"
                                                        name="backload_slip_no"
                                                        placeholder="Enter Backload slip number"
                                                        value={values.backload_slip_no}
                                                        onChange={handleInputChange}
                                                        maxlength="10"
                                                    />
                                                </Col> */}
                                                <Col md={3}>
                                                    <Label for="storageLocation">Storage Location</Label>
                                                    <Input
                                                        type="select"
                                                        name="storageLocation"
                                                        id="storageLocation"
                                                        value={values.storageLocation}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="" defaultValue>Select Storage Location</option>
                                                        {storageLocation.map((item, key) => (<option value={item.storage_location} key={key}>{item.storage_location}</option>))}
                                                    </Input>
                                                </Col>
                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Source Location</Label>
                                                        <Input
                                                            name="src_location"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.src_location}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Source Location</option>
                                                                {sourceLocationData.map((item, key) => (<option value={item.sourceCode} key={key}>{`${item.sourceCode}/${item.sourceName}`}</option>))}
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
                                                        disabled
                                                    />
                                                </Col>
                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Sub Source Location</Label>
                                                        <Input
                                                            name="sub_src_location"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.sub_src_location}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Sub Source Location</option>
                                                                {subSourceLocationData.map((item, key) => (<option value={item.subSourceCode} key={key}>{`${item.subSourceCode}/${item.subSource}`}</option>))}
                                                            </React.Fragment>
                                                        </Input>
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <Label className="form-label">Sub Source Location Text</Label>
                                                    <Input type="text" className="form-control"
                                                        name="sub_src_location_text"
                                                        placeholder="Enter Source Location Text"
                                                        value={values.sub_src_location_text}
                                                        onChange={handleInputChange}
                                                        maxlength="60"
                                                        disabled
                                                    />
                                                </Col>
                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Trip Risk</Label>
                                                        <Input
                                                            name="trip_risk"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.trip_risk}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Trip Risk</option>
                                                                {tripRiskData && tripRiskData.map((item, key) => (<option value={item.tripRiskCode} key={key}>{item.tripRisk}</option>))}
                                                            </React.Fragment>
                                                        </Input>
                                                    </div>
                                                </Col>
                                                <Col lg={3}>
                                                    <div>
                                                        <Label className="form-label" >Unloading Mode</Label>
                                                        <Input
                                                            name="unloadingMode"
                                                            type="select"
                                                            className="form-select"
                                                            value={values.unloadingMode}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <React.Fragment>
                                                                <option value="" selected>Select Unloading Mode</option>
                                                                {unlaodingModeData && unlaodingModeData.map((item, key) => (<option value={item.unloading_code} key={key}>{item.unloading_mode}</option>))}
                                                            </React.Fragment>
                                                        </Input>
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <Label className="form-label">Incoterm1</Label>
                                                    <Input type="text" className="form-control"
                                                        name="inco_terms1"
                                                        value={values.inco_terms1}
                                                        onChange={handleInputChange}
                                                        disabled
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <Label className="form-label">Incoterm2</Label>
                                                    <Input type="text" className="form-control"
                                                        name="inco_terms2"
                                                        value={values.inco_terms2}
                                                        onChange={handleInputChange}
                                                        disabled
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
                                        </TabPane>
                                    </TabContent>
                                    <TabContent activeTab={outlineBorderNav} className="text-muted border">
                                        <TabPane tabId="3" id="border-nav-home" className="p-3">
                                            {tableData.length > 0 ? (
                                                <Table bordered className="mt-3 text-center">
                                                    <thead>
                                                        <tr>
                                                            <th>Select</th>
                                                            <th>PO Number</th>
                                                            <th>Line Item</th>
                                                            <th>Challan Qty.</th>
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
                                                                <td>{item.lineItem}</td>
                                                                <td>{item.challan_qty}</td>
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
                                            {checkBoxMsg && <p className="mt-1 mb-0" style={{ color: "red", position: "relative", width: "max-content" }}>{"Please select at least one checkbox before Map Vehicle"}</p>}
                                            {tableData.length > 0 && (
                                                <Button color="success" className="mt-0" onClick={handleSubmit} disabled={loadingParameter ? true : false}>
                                                    {loadingParameter ? (
                                                        <>
                                                            <Spinner size="sm" className="me-2 visible" />Loading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="ri-stack-line align-bottom me-1"></i>
                                                            {'Map PO with Vehicle'}
                                                        </>
                                                    )}
                                                </Button>
                                            )}

                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="xl">
                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                            PO Details &nbsp;&nbsp;&nbsp; {loader && <>
                                <Spinner size="sm" className="me-2 visible" />
                                Loading...
                            </>}
                        </ModalHeader>
                        <Form className="tablelist-form">
                            <ModalBody>

                                <Row className="g-3">
                                    <Col md={3}>
                                        <Label className="form-label">PO Number</Label>
                                        <Input type="text" className="form-control"
                                            name="po_number"
                                            value={viewDataById.poNumber || ""}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">PO Quantity</Label>
                                        <Input type="text" className="form-control"
                                            name="po_qty"
                                            placeholder="Enter PO Quantity"
                                            value={viewDataById.po_qty || ""}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">Vehicle Number</Label>
                                        <Input type="text" className="form-control"
                                            name="vehicleNumber"
                                            value={viewDataById.vehicleNumber || ""}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">Line Item No.</Label>
                                        <Input type="text" className="form-control"
                                            name="polineItemNumber"
                                            value={viewDataById.polineItemNumber || ""}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col>
                                    {/* <Col md={3}>
                                        <Label className="form-label">Remaining Quantity</Label>
                                        <Input type="text" className="form-control"
                                            name="po_qty"
                                            value={viewDataById.remaining_qty || ""}
                                            onChange={handleInputChange}
                                            disabled
                                            placeholder="Enter Remaining Quantity"
                                        />
                                    </Col> */}
                                    <Col md={3}>
                                        <Label className="form-label">Material</Label>
                                        <Input type="text" className="form-control"
                                            name="materialCode"
                                            placeholder="Enter Material Code"
                                            value={viewDataById.materialCode || ""}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col>
                                    {/* <Col md={3}>
                                        <Label className="form-label">Transporter Name</Label>
                                        <Input type="text" className="form-control"
                                            name="transporter_name"
                                            placeholder="Enter Transporter Name"
                                            value={viewDataById.transporter_name || ""}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col> */}
                                    <Col md={3}>
                                        <Label className="form-label">Transporter Code</Label>
                                        <Input type="text" className="form-control"
                                            name="transporterCode"
                                            placeholder="Enter Transporter Code"
                                            value={viewDataById.transporterCode}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col>
                                    {/* <Col md={3}>
                                        <Label className="form-label">Transporter Number</Label>
                                        <Input type="number" className="form-control"
                                            name="transporter_number"
                                            placeholder="Enter Transporter Number"
                                            value={viewDataById.transporter_number}
                                            onChange={handleInputChange}
                                            maxlength="10"
                                            disabled
                                        />
                                    </Col> */}
                                    {/* <Col md={3}>
                                        <Label className="form-label">Total Quantity</Label>
                                        <Input type="number" className="form-control"
                                            name="total_qty"
                                            placeholder="Enter Total Quantity"
                                            value={viewDataById.total_qty}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col> */}
                                    {/* <Col md={3}>
                                        <Label className="form-label">Challan Quantity</Label>
                                        <Input type="number" className="form-control"
                                            name="challanQty"
                                            placeholder="Enter Challan Quantity"
                                            value={viewDataById.challanQty}
                                            onChange={handleInputChange}
                                            ref={challanQtyRef} // Attach the ref to the input
                                            disabled
                                        />
                                    </Col> */}
                                    <Col md={3}>
                                        <Label className="form-label">Challan Number</Label>
                                        <Input type="text" className="form-control"
                                            name="challanNumber"
                                            placeholder="Enter Challan Number"
                                            value={viewDataById.challanNumber}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col>
                                    {/* <Col md={3}>
                                        <Label className="form-label">Challan Date</Label>
                                        <Input type="text" className="form-control"
                                            name="challan_date"
                                            placeholder="Select Challan Date"
                                            value={viewDataById.challan_date}
                                            onChange={handleInputChange}
                                            max={today}
                                            disabled
                                        />
                                    </Col> */}
                                    <Col md={3}>
                                        <Label className="form-label">Challan TW</Label>
                                        <Input type="number" className="form-control"
                                            name="challanTareWeight"
                                            placeholder="Enter Challan TW"
                                            value={viewDataById.challanTareWeight}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">Challan GW</Label>
                                        <Input type="number" className="form-control"
                                            name="challanGrossWeight"
                                            placeholder="Enter Challan GW"
                                            value={viewDataById.challanGrossWeight}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col>
                                    {/* <Col md={3}>
                                        <Label className="form-label">Lorry Receipt No</Label>
                                        <Input type="text" className="form-control"
                                            name="lorry_RN"
                                            placeholder="Lorry Receipt No"
                                            value={viewDataById.lorry_RN}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col> */}
                                    {/* <Col md={3}>
                                        <Label className="form-label">Supplier Order No</Label>
                                        <Input type="text" className="form-control"
                                            name="Supplier_OrderNo"
                                            placeholder="Enter Supplier Order Number"
                                            value={values.Supplier_OrderNo}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col> */}
                                    {/* <Col md={3}>
                                        <Label className="form-label">Driver Name</Label>
                                        <Input type="text" className="form-control"
                                            name="driver_name"
                                            placeholder="Enter Driver Name"
                                            value={viewDataById.driver_name}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">Driver Number</Label>
                                        <Input type="number" className="form-control"
                                            name="driver_number"
                                            placeholder="Enter Driver Number"
                                            value={viewDataById.driver_number}
                                            onChange={handleInputChange}
                                            maxlength="10"
                                            disabled
                                        />
                                    </Col> */}
                                    {/* <Col md={3}>
                                        <Label className="form-label">Invoice Number</Label>
                                        <Input type="text" className="form-control"
                                            name="invoice_number"
                                            placeholder="Enter Invoice Number"
                                            value={viewDataById.invoice_number}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">Invoice Date</Label>
                                        <Input type="text" className="form-control"
                                            name="invoice_date"
                                            placeholder="Enter Invoice Date"
                                            value={viewDataById.invoice_date}
                                            onChange={handleInputChange}
                                            max={today}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">RY Slip Number</Label>
                                        <Input type="text" className="form-control"
                                            name="slip_umber"
                                            placeholder="Enter RY Slip Number"
                                            value={viewDataById.slip_umber}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">RY Slip Date</Label>
                                        <Input type="date" className="form-control"
                                            name="slip_date"
                                            placeholder="Select RY Slip Date"
                                            value={viewDataById.slip_date}
                                            onChange={handleInputChange}
                                            max={today}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">RY Weight</Label>
                                        <Input type="number" className="form-control"
                                            name="ry_weight"
                                            placeholder="Select RY Weight"
                                            value={viewDataById.ry_weight}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col> */}
                                    {/* <Col md={3}>
                                        <Label className="form-label">Reason For Empty Truck</Label>
                                        <Input type="text" className="form-control"
                                            name="remarks"
                                            placeholder="Reason For Empty Truck"
                                            value={viewDataById.remarks}
                                            onChange={handleInputChange}
                                            maxlength="60"
                                            disabled
                                        />
                                    </Col>

                                    <Col md={3}>
                                        <Label className="form-label">LR Date</Label>
                                        <Input type="text" className="form-control"
                                            name="lr_date"
                                            placeholder="Select LR Date"
                                            value={viewDataById.lr_date}
                                            onChange={handleInputChange}
                                            max={today}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">Net Weight</Label>
                                        <Input type="number" className="form-control"
                                            name="net_weight"
                                            placeholder="Enter Net Weight"
                                            value={viewDataById.net_weight}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col> */}
                                    {/* <Col md={3}>
                                        <Label className="form-label">Supplier TW</Label>
                                        <Input type="number" className="form-control"
                                            name="supplierTareWeight"
                                            placeholder="Enter Supplier TW"
                                            value={viewDataById.supplierTareWeight}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col> */}
                                    {/* <Col md={3}>
                                        <Label className="form-label">Supplier GW</Label>
                                        <Input type="number" className="form-control"
                                            name="supplierGrossWeight"
                                            placeholder="Enter Supplier GW"
                                            value={viewDataById.supplierGrossWeight}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col> */}
                                    {/* <Col md={3}>
                                        <Label className="form-label">Outbound Delivery No</Label>
                                        <Input type="text" className="form-control"
                                            name="OB_DelNo"
                                            placeholder="Enter Outbound Delivery No"
                                            value={viewDataById.OB_DelNo}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </Col> */}
                                    <Col md={3}>
                                        <Label className="form-label">Mode of Delivery</Label>
                                        <Input type="text" className="form-control"
                                            name="mode_of_delivery"
                                            placeholder="Enter Mode of Delivery"
                                            value={viewDataById.mode_of_delivery}
                                            onChange={handleInputChange}
                                            maxlength="15"
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">Nature of Item</Label>
                                        <Input type="text" className="form-control"
                                            name="nature_item"
                                            placeholder="Enter Nature of Item"
                                            value={viewDataById.nature_item}
                                            onChange={handleInputChange}
                                            maxlength="25"
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">Party Type</Label>
                                        <Input type="text" className="form-control"
                                            name="party_type"
                                            placeholder="Enter Party Type"
                                            value={viewDataById.party_type}
                                            onChange={handleInputChange}
                                            maxlength="20"
                                            disabled
                                        />
                                    </Col>
                                    {/* <Col md={3}>
                                        <Label className="form-label" >Is Weighment Reqd.</Label>
                                        <Input
                                            name="is_weighment"
                                            type="text"
                                            className="form-control"
                                            value={viewDataById.is_weighment}
                                            onChange={handleInputChange}
                                            required
                                            disabled
                                            placeholder="Enter Is Weighment Reqd."
                                        ></Input>
                                    </Col> */}
                                    <Col md={3}>
                                        <Label className="form-label">Vehicle Type</Label>
                                        <Input type="text" className="form-control"
                                            name="vehicle_type"
                                            placeholder="Enter Vehicle Type"
                                            value={viewDataById.vehicle_type}
                                            onChange={handleInputChange}
                                            maxlength="20"
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">IN Gate No</Label>
                                        <Input type="text" className="form-control"
                                            name="gate_no"
                                            placeholder="Enter In Gate No"
                                            value={viewDataById.gate_no}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">Sub Transporter</Label>
                                        <Input type="text" className="form-control"
                                            name="sub_transporter"
                                            placeholder="Enter Sub Transporter"
                                            value={viewDataById.sub_transporter}
                                            onChange={handleInputChange}
                                            maxlength="35"
                                            disabled
                                        />
                                    </Col>
                                    {/* <Col md={3}>
                                        <Label className="form-label">Miscellaneous Transporter</Label>
                                        <Input type="text" className="form-control"
                                            name="mis_transporter"
                                            placeholder="Enter Miscellaneous Transporter"
                                            value={viewDataById.mis_transporter}
                                            onChange={handleInputChange}
                                            maxlength="20"
                                            disabled
                                        />
                                    </Col> */}
                                    <Col md={3}>
                                        <Label className="form-label">Cleaner Name</Label>
                                        <Input type="text" className="form-control"
                                            name="cleaner_name"
                                            placeholder="Enter Cleaner Name"
                                            value={viewDataById.cleaner_name}
                                            onChange={handleInputChange}
                                            maxlength="30"
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">Licence Number</Label>
                                        <Input type="text" className="form-control"
                                            name="license_number"
                                            placeholder="Enter Licence Number"
                                            value={viewDataById.license_number}
                                            onChange={handleInputChange}
                                            maxlength="25"
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">No of Packs</Label>
                                        <Input type="text" className="form-control"
                                            name="no_of_packs"
                                            placeholder="Enter No of Packs"
                                            value={viewDataById.no_of_packs}
                                            onChange={handleInputChange}
                                            maxlength="30"
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">No of other party packs</Label>
                                        <Input type="text" className="form-control"
                                            name="no_of_other_packes"
                                            placeholder="Enter No of other party packs"
                                            value={viewDataById.no_of_other_packes}
                                            onChange={handleInputChange}
                                            maxlength="30"
                                            disabled
                                        />
                                    </Col>
                                    {/* <Col md={3}>
                                        <Label className="form-label">Backload slip number</Label>
                                        <Input type="text" className="form-control"
                                            name="backload_slip_no"
                                            placeholder="Enter Backload slip number"
                                            value={viewDataById.backload_slip_no}
                                            onChange={handleInputChange}
                                            maxlength="10"
                                            disabled
                                        />
                                    </Col> */}
                                    <Col lg={3}>
                                        <div>
                                            <Label className="form-label" >Unloading Point/Source Location</Label>
                                            <Input
                                                name="src_location"
                                                type="text"
                                                className="form-control"
                                                value={viewDataById.src_location}
                                                onChange={handleInputChange}
                                                required
                                                disabled
                                            >
                                            </Input>
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label">Source Location Text</Label>
                                        <Input type="text" className="form-control"
                                            name="src_location_text"
                                            placeholder="Enter Source Location Text"
                                            value={viewDataById.src_location_text}
                                            onChange={handleInputChange}
                                            maxlength="60"
                                            disabled
                                        />
                                    </Col>




                                </Row>
                            </ModalBody>
                            <ModalFooter>
                            </ModalFooter>
                        </Form>
                    </Modal>
                    <ToastContainer closeButton={false} limit={1} />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default MapPOWithVehicle;
