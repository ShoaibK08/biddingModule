//route type api is integrated in the add route and edit route 
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";


// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";

const initialValues = {
    routeCode: "",
    routeName: "",
    routeDescription: "",
    departureLocation: "",
    destinationLocation: "",
    routeType: "",
    transporterGroup: "",
    deliveryTime: "",
    shippingCondition: "",
    routeCriteria: "",
    intermediateStops: "",
    distance: "",
    transportationCost: "",
    carrier: "",
    routeSelection: "",
    transportationZone: "",
    shippingPoint: "",
    plantCode: "",
    status: "A",
};

const MasterRoute = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [routes, setRoutes] = useState([]); // Will store API data
    const [loading, setLoading] = useState(true); // Loading state
    const [modal, setModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [viewData, setViewData] = useState({});
    const [values, setValues] = useState(initialValues);
    const [CurrentID, setClickedRowId] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [latestHeader, setLatestHeader] = useState('');
    const [Plant_Code, setPlantCode] = useState('');
    const [routeCode, setRouteCode] = useState(null);
const [originalValues, setOriginalValues] = useState({}); // Original API data store karne ke liye
const [hasChanges, setHasChanges] = useState(false); // Track karne ke liye ki user ne changes kiye hain
const [routeTypes, setRouteTypes] = useState([]); // For storing route types from API
const [routeTypesLoading, setRouteTypesLoading] = useState(false);
const [fieldErrors, setFieldErrors] = useState({});
    // Validation functions

   // Helper function to check for leading spaces - Fixed
const hasLeadingSpace = (text) => {
    if (!text || typeof text !== 'string') return false;
    return text !== text.trimStart();
};

// Helper function to check for emojis - Fixed
const containsEmoji = (text) => {
    if (!text || typeof text !== 'string') return false;
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    return emojiRegex.test(text);
};

// Updated validation functions
const validateRouteName = (name) => {
    if (!name || typeof name !== 'string') return true; // Allow empty initially
    if (containsEmoji(name)) return false;
    if (hasLeadingSpace(name)) return false;
    const nameRegex = /^[A-Za-z0-9\s-]+$/;
    return nameRegex.test(name.trim());
};

const validateDestination = (destination) => {
    if (!destination || typeof destination !== 'string') return true;
    if (containsEmoji(destination)) return false;
    if (hasLeadingSpace(destination)) return false;
    const destRegex = /^[A-Za-z\s,.-]+$/;
    return destRegex.test(destination.trim());
};

const validateShippingType = (type) => {
    if (!type || typeof type !== 'string') return true;
    if (containsEmoji(type)) return false;
    if (hasLeadingSpace(type)) return false;
    const typeRegex = /^[A-Za-z0-9\s-/]+$/;
    return typeRegex.test(type.trim());
};

const validateIntermediateStops = (stops) => {
    if (!stops || typeof stops !== 'string') return true;
    if (containsEmoji(stops)) return false;
    if (hasLeadingSpace(stops)) return false;
    const stopsRegex = /^[A-Za-z0-9\s,.-]+$/;
    return stopsRegex.test(stops.trim());
};

const validateDistance = (distance) => {
    if (!distance) return true;
    const distanceStr = String(distance);
    if (containsEmoji(distanceStr)) return false;
    if (hasLeadingSpace(distanceStr)) return false;
    const distanceRegex = /^\d+(\.\d{1,2})?$/;
    return distanceRegex.test(distanceStr.trim());
};

const validateCost = (cost) => {
    if (!cost) return true;
    const costStr = String(cost);
    if (containsEmoji(costStr)) return false;
    if (hasLeadingSpace(costStr)) return false;
    const costRegex = /^\d+(\.\d{1,2})?$/;
    return costRegex.test(costStr.trim());
};

const validateCarrier = (carrier) => {
    if (!carrier || typeof carrier !== 'string') return true;
    if (containsEmoji(carrier)) return false;
    if (hasLeadingSpace(carrier)) return false;
    const carrierRegex = /^[A-Za-z0-9\s&.-]+$/;
    return carrierRegex.test(carrier.trim());
};

const validateTransportationZone = (zone) => {
    if (!zone || typeof zone !== 'string') return true;
    if (containsEmoji(zone)) return false;
    if (hasLeadingSpace(zone)) return false;
    const zoneRegex = /^[A-Za-z0-9\s-]+$/;
    return zoneRegex.test(zone.trim());
};

const validateShippingPoint = (point) => {
    if (!point || typeof point !== 'string') return true;
    if (containsEmoji(point)) return false;
    if (hasLeadingSpace(point)) return false;
    const pointRegex = /^[A-Za-z0-9\s,.-]+$/;
    return pointRegex.test(point.trim());
};


    const validateAllFields = () => {
    const fieldsToValidate = [
        { name: 'routeName', value: values.routeName, validator: validateRouteName },
        { name: 'routeDestination', value: values.routeDestination, validator: validateDestination },
        { name: 'shippingType', value: values.shippingType, validator: validateShippingType },
        { name: 'intermediateStops', value: values.intermediateStops, validator: validateIntermediateStops },
        { name: 'routeDistance', value: values.routeDistance, validator: validateDistance },
        { name: 'transportationCost', value: values.transportationCost, validator: validateCost },
        { name: 'carrier', value: values.carrier, validator: validateCarrier },
        { name: 'transportationZone', value: values.transportationZone, validator: validateTransportationZone },
        { name: 'shippingPoint', value: values.shippingPoint, validator: validateShippingPoint }
    ];

    let hasErrors = false;
    const newErrors = {};

    for (let field of fieldsToValidate) {
        // Only validate if field has a value and validator exists
        if (field.value && field.validator && !field.validator(field.value)) {
            newErrors[field.name] = getValidationMessage(field.name, field.value);
            hasErrors = true;
        }
    }

    setFieldErrors(newErrors);
    return !hasErrors;
};



   const toggle = useCallback(() => {
    if (modal) {
        setModal(false);
        setHasChanges(false); // Reset changes state when closing modal
        setFieldErrors({}); // Clear any field errors
        setOriginalValues({}); // Clear original values
    } else {
        setModal(true);
    }
}, [modal]);

    const toggleView = useCallback(() => {
        if (viewModal) {
            setViewModal(false);
        } else {
            setViewModal(true);
        }
    }, [viewModal]);

    useEffect(() => {
        const HeaderName = localStorage.getItem("HeaderName");
        setLatestHeader(HeaderName);
    }, []);

const fetchRouteTypes = async () => {
    setRouteTypesLoading(true);
    try {
        console.log("Fetching route types from API");
        
        const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routeType/getAll`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Basic QW1hemluOlRFQE0tV0BSSw==',
                'Connection': 'keep-alive',
                'DNT': '1'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Route Types API Response:", data);

        if (data && data.dto && Array.isArray(data.dto)) {
            // Filter only active route types
            const activeRouteTypes = data.dto.filter(item => item.status === 'A');
            setRouteTypes(activeRouteTypes);
            
            if (data.meta && data.meta.message) {
                console.log(data.meta.message);
            }
        } else {
            console.warn("Unexpected route types API response format:", data);
            setRouteTypes([]);
            toast.error("Received unexpected data format from Route Types API", { autoClose: 3000 });
        }
    } catch (error) {
        console.error("Error fetching route types:", error);
        setRouteTypes([]);
        toast.error(`Failed to fetch route types: ${error.message}`, { autoClose: 3000 });
    } finally {
        setRouteTypesLoading(false);
    }
};


useEffect(() => {
    try {
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
        getAllRouteData(plantcode);
        
        // Fetch route types when component mounts
        fetchRouteTypes();
    } catch (error) {
        console.error("Error setting plant code:", error);
        setPlantCode("PL002"); // Fallback
        getAllRouteData("PL002");
        
        // Still fetch route types even if plant code fails
        fetchRouteTypes();
    }
}, []);


    const getAllRouteData = async (plantCode) => {
        setLoading(true);
        try {
            console.log("Fetching routes for plant code:", plantCode);

            // Make direct fetch call to ensure we get raw response
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes?plantCode=${plantCode}`, {
                //const response = await fetch(`http://localhost:8085/routes?plantCode=${plantCode}`, { 
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw=='
                }
            });

            // Check if response is OK
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse JSON response
            const data = await response.json();
            console.log("API Response data:", data);

            // Handle the data based on its structure
            if (Array.isArray(data)) {
                console.log("API returned an array with", data.length, "items");
                setRoutes(data);
                // toast.success("Routes fetched successfully", { autoClose: 3000 });
            }
            else if (data && data.data && Array.isArray(data.data)) {
                console.log("API returned structured data with", data.data.length, "items");
                setRoutes(data.data);

                if (data.meta && data.meta.message) {
                    // toast.success(data.meta.message, { autoClose: 3000 });
                } else {
                    //  toast.success("Routes fetched successfully", { autoClose: 3000 });
                }
            }
            else {
                console.warn("Unexpected API response format:", data);
                setRoutes([]);
                toast.error("Received unexpected data format from API", { autoClose: 3000 });
            }
        } catch (error) {
            console.error("Error fetching routes:", error);
            setRoutes([]);
            toast.error(`Failed to fetch routes: ${error.message}`, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

  








    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            username: process.env.REACT_APP_API_USER_NAME,
            password: process.env.REACT_APP_API_PASSWORD,
        },
    };

 const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Ensure value is a string before processing
    const stringValue = value ? String(value) : '';

    // Prevent emoji input and leading spaces
    if (stringValue) {
        if (containsEmoji(stringValue)) {
            // Set error message for emoji
            setFieldErrors(prev => ({
                ...prev,
                [name]: "Emojis are not allowed in this field."
            }));
            return; // Don't update state if emoji is detected
        }

        // Prevent leading space by trimming start - only if it's a string
        const processedValue = stringValue.trimStart();

        // Update state
        const newValues = {
            ...values,
            [name]: processedValue,
            ['plantCode']: Plant_Code,
        };
        setValues(newValues);

        // Check if any changes made (only in edit mode)
        if (isEdit) {
            checkForChanges(newValues);
        }

        // Validate field in real-time
        const validator = getValidatorForField(name);
        if (validator) {
            validateField(name, processedValue, validator);
        }
    } else {
        // Handle non-string values (like numbers, dates, etc.)
        const newValues = {
            ...values,
            [name]: value,
            ['plantCode']: Plant_Code,
        };
        setValues(newValues);

        // Check if any changes made (only in edit mode)
        if (isEdit) {
            checkForChanges(newValues);
        }
    }
};

// Add new function to check for changes
const checkForChanges = (currentValues) => {
    let changesDetected = false;
    
    // Compare all form fields with original values
    const fieldsToCheck = [
        'routeName', 'routeDestination', 'routeType', 'transportationType', 
        'deliveryDate', 'shippingType', 'routeDetermination', 'intermediateStops',
        'routeDistance', 'transportationCost', 'carrier', 'routeSelection',
        'transportationZone', 'shippingPoint', 'status'
    ];

    for (let field of fieldsToCheck) {
        // Handle date field specially
        if (field === 'deliveryDate') {
            const originalDate = originalValues[field] ? new Date(originalValues[field]).toISOString().slice(0, 16) : "";
            const currentDate = currentValues[field] ? new Date(currentValues[field]).toISOString().slice(0, 16) : "";
            if (originalDate !== currentDate) {
                changesDetected = true;
                break;
            }
        } else {
            // For other fields, direct comparison
            if ((originalValues[field] || "") !== (currentValues[field] || "")) {
                changesDetected = true;
                break;
            }
        }
    }
    
    setHasChanges(changesDetected);
};


    const getValidatorForField = (fieldName) => {
        const validators = {
            'routeName': validateRouteName,
            'routeDestination': validateDestination,
            'shippingType': validateShippingType,
            'intermediateStops': validateIntermediateStops,
            'routeDistance': validateDistance,
            'transportationCost': validateCost,
            'carrier': validateCarrier,
            'transportationZone': validateTransportationZone,
            'shippingPoint': validateShippingPoint
        };
        return validators[fieldName];
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form values:", values);

    // Validate all fields before submission
    if (!validateAllFields()) {
        return; // Stop submission if validation fails
    }

    try {
        if (isEdit) {
            // Update existing route
            console.log("Updating route with routeCode:=================>>>>>>>>", routeCode);
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/${routeCode}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw==',
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Update response:", data);

            if (data && data.meta && data.meta.message) {
                toast.success(data.meta.message, { autoClose: 3000 });
            } else {
                toast.success("Route Updated Successfully", { autoClose: 3000 });
            }
        } else {
            // Create new route - remove routeCode from values for new creation
            const { routeCode, ...newRouteValues } = values;
            console.log("Creating new route");
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw==',
                },
                body: JSON.stringify(newRouteValues)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Create response:", data);

            if (data && data.meta && data.meta.message) {
                toast.success(data.meta.message, { autoClose: 3000 });
            } else {
                toast.success("Route Added Successfully", { autoClose: 3000 });
            }
        }

        // Clear field errors on successful submission
        setFieldErrors({});
        setHasChanges(false); // Reset changes state after successful submission
        setOriginalValues({}); // Clear original values

        // Refresh the data after submission
        getAllRouteData(Plant_Code);

        // Close the modal
        toggle();
    } catch (error) {
        console.error("API error:", error);
        toast.error(`Operation failed: ${error.message}`, { autoClose: 3000 });
    }
};


    // Enhanced key press handler to prevent leading spaces and emojis
 const handleKeyPress = (e) => {
    const inputValue = e.target.value || '';
    const key = e.key;
    const fieldName = e.target.name;

    // Prevent space if it's the first character
    if (key === ' ' && inputValue.length === 0) {
        e.preventDefault();
        setFieldErrors(prev => ({
            ...prev,
            [fieldName]: "Leading spaces are not allowed."
        }));
        return;
    }

    // Check for emoji input
    if (containsEmoji(key)) {
        e.preventDefault();
        setFieldErrors(prev => ({
            ...prev,
            [fieldName]: "Emojis are not allowed in this field."
        }));
        return;
    }
};

    // Enhanced paste handler to prevent emoji and leading space paste
 const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text') || '';
    const fieldName = e.target.name;

    if (containsEmoji(pastedText)) {
        e.preventDefault();
        setFieldErrors(prev => ({
            ...prev,
            [fieldName]: "Cannot paste text containing emojis."
        }));
        return;
    }

    if (hasLeadingSpace(pastedText)) {
        e.preventDefault();
        // Allow paste but trim leading spaces
        const trimmedText = pastedText.trimStart();
        e.target.value = trimmedText;

        // Trigger onChange manually
        const syntheticEvent = {
            target: {
                name: fieldName,
                value: trimmedText
            }
        };
        handleInputChange(syntheticEvent);
    }
};
    // Updated error message function
    const getValidationMessage = (fieldName, value) => {
        if (containsEmoji(value)) {
            return "Emojis are not allowed in this field.";
        }
        if (hasLeadingSpace(value)) {
            return "Leading spaces are not allowed.";
        }

        switch (fieldName) {
            case 'routeDestination':
                return "Invalid destination. Only letters, spaces, commas, dots and hyphens are allowed.";
            case 'shippingType':
                return "Invalid shipping type. Only letters, numbers, spaces, hyphens and slashes are allowed.";
            case 'intermediateStops':
                return "Invalid stops format. Only letters, numbers, spaces, commas, dots and hyphens are allowed.";
            case 'routeDistance':
                return "Distance must be a valid number (e.g., 25 or 25.50).";
            case 'transportationCost':
                return "Cost must be a valid amount (e.g., 1500 or 1500.50).";
            case 'carrier':
                return "Invalid carrier name. Only letters, numbers, spaces, &, dots and hyphens are allowed.";
            case 'transportationZone':
                return "Invalid zone format. Only letters, numbers, spaces and hyphens are allowed.";
            case 'shippingPoint':
                return "Invalid shipping point. Only letters, numbers, spaces, commas, dots and hyphens are allowed.";
            default:
                return "Invalid input format.";
        }
    };

    const validateField = (fieldName, value, validator) => {
        if (value && !validator(value)) {
            const errorMessage = getValidationMessage(fieldName, value);
            setFieldErrors(prev => ({
                ...prev,
                [fieldName]: errorMessage
            }));
            return false;
        } else {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
            return true;
        }
    };


    // Add Data
    const handleCustomerClicks = () => {
        setIsEdit(false);
        toggle();
    };



    // 4. Update the handleCustomerClick to fetch the current data before editing
   const handleCustomerClick = useCallback(async (id) => {
    setClickedRowId(id);
    setIsEdit(true);
    setHasChanges(false); // Reset changes state

    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/id/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw=='
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Route details for editing:", data);

        const routeData = data.data || data;

        const formData = {
            routeCode: routeData.routeCode || "",
            routeName: routeData.routeName || "",
            plantCode: routeData.plantCode || Plant_Code,
            routeDestination: routeData.routeDestination || "",
            routeType: routeData.routeType || "",
            transportationType: routeData.transportationType || "",
            deliveryDate: routeData.deliveryDate || "",
            shippingType: routeData.shippingType || "",
            routeDetermination: routeData.routeDetermination || "",
            intermediateStops: routeData.intermediateStops || "",
            routeDistance: routeData.routeDistance || "",
            transportationCost: routeData.transportationCost || "",
            carrier: routeData.carrier || "",
            routeSelection: routeData.routeSelection || "",
            transportationZone: routeData.transportationZone || "",
            shippingPoint: routeData.shippingPoint || "",
            status: routeData.status || "A",
        };

        // Store original values for comparison
        setOriginalValues(formData);
        setValues(formData);
        setRouteCode(data.data.routeCode);

        if (data.meta && data.meta.message) {
            // toast.success(data.meta.message, { autoClose: 3000 });
        }

        toggle();
    } catch (error) {
        console.error("Error fetching route details for editing:", error);
        toast.error(`Failed to fetch route details: ${error.message}`, { autoClose: 3000 });
    }
}, [toggle, Plant_Code]);


    // 3. Update your handleViewClick function to fetch detailed information
    const handleViewClick = useCallback(async (id) => {
        try {
            console.log("Fetching details for route ID:", id);
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/id/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw=='
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();


            console.log("Route details:", data);

            // Check response structure - use the data property if available
            if (data && data.data) {
                setViewData(data.data);

                // Show success message if available
                if (data.meta && data.meta.message) {
                    //   toast.success(data.meta.message, { autoClose: 3000 });
                }
            } else {
                // Fallback if response is not wrapped in data property
                setViewData(data);
            }

            setViewModal(true);
        } catch (error) {
            console.error("Error fetching route details:", error);
            toast.error(`Failed to fetch route details: ${error.message}`, { autoClose: 3000 });
        }
    }, []);

    // Delete Data
    const onClickDelete = (id) => {
        setClickedRowId(id);
        setDeleteModal(true);
    };


    // 2. Replace your handleDeleteCustomer function with this:
    const handleDeleteCustomer = async (e) => {
        e.preventDefault();

        try {
            console.log("Deleting route with ID:", CurrentID);
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/${CurrentID}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw==',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Check if there's a response body
            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
                console.log("Delete response:", data);

                // Use success message from API if available
                if (data && data.meta && data.meta.message) {
                    toast.success(data.meta.message, { autoClose: 3000 });
                } else {
                    toast.success("Route Deleted Successfully", { autoClose: 3000 });
                }
            } else {
                console.log("Delete successful (no response body)");
                toast.success("Route Deleted Successfully", { autoClose: 3000 });
            }

            setDeleteModal(false);

            // Refresh data after deletion
            getAllRouteData(Plant_Code);
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(`Failed to delete route: ${error.message}`, { autoClose: 3000 });
            setDeleteModal(false);
        }
    };


    const status = [
        {
            options: [
                { label: "Select Status", value: "" },
                { label: "Active", value: "A" },
                { label: "Deactive", value: "D" },
            ],
        },
    ];

    // const routeTypes = [
    //     {
    //         options: [
    //             { label: "Select Type", value: "" },
    //             { label: "Type A", value: "Type A" },
    //             { label: "Type B", value: "Type B" },
    //             { label: "Type C", value: "Type C" },
    //         ],
    //     },
    // ];

    const transportationTypes = [
        {
            options: [
                { label: "Select Type", value: "" },
                { label: "Truck", value: "Truck" },
                { label: "Rail", value: "Rail" },
                { label: "Plane", value: "Plane" },
                { label: "Ship", value: "Ship" },
            ],
        },
    ];

    const routeDeterminations = [
        {
            options: [
                { label: "Select Determination", value: "" },
                { label: "Auto", value: "Auto" },
                { label: "Manual", value: "Manual" },
            ],
        },
    ];

    const routeSelections = [
        {
            options: [
                { label: "Select Selection", value: "" },
                { label: "Auto", value: "Auto" },
                { label: "Manual", value: "Manual" },
            ],
        },
    ];

    // Add this custom style to your component
    const CustomHeaderStyle = `
  .text-nowrap-headers th {
    white-space: nowrap !important;
  }
`;

    // Add these additional styles to your ModalStyles
    const ModalStyles = `
  /* Reduced vertical spacing between input fields */
  .compact-modal .form-label {
    margin-bottom: 2px;
  }
  
  .compact-modal .mb-2 {
    margin-bottom: 0.5rem !important;
  }
  
  /* Further reduce spacing for view modal */
  .compact-modal .mb-1 {
    margin-bottom: 0.25rem !important;
  }
  
  /* Gap between modal header and input fields */
  .compact-modal .modal-body {
    padding-top: 1rem;
  }
  
  /* Make form fields more compact in height */
  .compact-modal .form-control,
  .compact-modal .form-select {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    min-height: 32px;
  }
  
  /* For View Modal */
  .compact-modal .form-control-sm {
    padding-top: 0.15rem;
    padding-bottom: 0.15rem;
    min-height: 24px;
  }
  
  /* Reduce spacing between rows */
  .compact-modal .g-2 {
    --bs-gutter-y: 0.3rem;
  }
  
  /* Optimize spacing for the Edit Modal */
  .compact-modal .g-3 {
    --bs-gutter-y: 0.75rem;
  }
  
  /* Even more compact label in view modal */
  .compact-modal .fw-semibold.mb-1 {
    margin-bottom: 0 !important;
    font-size: 0.85rem;
  }
  
  /* Reduce padding in the form-control-sm elements */
  .compact-modal .form-control-sm.py-1 {
    padding-top: 0.1rem !important;
    padding-bottom: 0.1rem !important;
  }
`;

    // Routes Column - Updated to match API response fields
    const columns = useMemo(
        () => [
            {
                Header: "Route Code",
                accessor: "routeCode",
                filterable: false,
            },
            {
                Header: "Route Name",
                accessor: "routeName",
                filterable: false,
            },
            {
                Header: "Plant Code",
                accessor: "plantCode",
                filterable: false,
            },
            {
                Header: "Route Destination",
                accessor: "routeDestination",
                filterable: false,
            },
            {
                Header: "Route Type",
                accessor: "routeType",
                filterable: false,
            },
            {
                Header: "Transportation Type",
                accessor: "transportationType",
                filterable: false,
            },
            {
                Header: "Status",
                accessor: "status",
                filterable: false,
                Cell: (cellProps) => {
                    return (
                        <span className={cellProps.value === "A" ? "text-success" : "text-danger"}>
                            {cellProps.value === "A" ? "Active" : "Deactive"}
                        </span>
                    );
                }
            },
            {
                Header: "Action",
                Cell: (cellProps) => {
                    return (
                        <ul className="list-inline hstack  mb-0">
                            <li className="list-inline-item edit" title="Edit">
                                <Link
                                    to="#"
                                    className="text-primary d-inline-block edit-item-btn"
                                    onClick={() => { const id = cellProps.row.original.id; handleCustomerClick(id); }}
                                >
                                    <i className="ri-pencil-fill fs-16"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item view" title="View">
                                <Link
                                    to="#"
                                    className="text-info d-inline-block"
                                    onClick={() => { const id = cellProps.row.original.id; handleViewClick(id); }}
                                >
                                    <i className="ri-eye-line fs-16"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item" title="Remove">
                                <Link
                                    to="#"
                                    className="text-danger d-inline-block remove-item-btn"
                                    onClick={() => { const id = cellProps.row.original.id; onClickDelete(id); }}>
                                    <i className="ri-delete-bin-5-fill fs-16"></i>
                                </Link>
                            </li>
                        </ul>
                    );
                },
            },
        ],
        []
    );

    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    document.title = "Route Master | EPLMS";
    return (
        <React.Fragment>
            <style>{CustomHeaderStyle}</style>
            <style>{ModalStyles}</style>

            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={routes}
                />
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteCustomer}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <Container fluid>
                    <BreadCrumb title={"Route"} pageTitle="Master" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title1 mb-0 bg-light">Route Master </h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-success add-btn"
                                                    id="create-btn"
                                                    onClick={() => { setIsEdit(false); toggle(); setValues(initialValues); }}
                                                >
                                                    <i className="ri-add-line align-bottom me-1"></i> Add New Route
                                                </button>{" "}
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0">
                                    <div>
                                        {loading ? (
                                            <Loader />
                                        ) : routes && routes.length ? (
                                            <TableContainer
                                                columns={columns}
                                                data={routes}
                                                isGlobalFilter={true}
                                                isAddUserList={false}
                                                customPageSize={5}
                                                isGlobalSearch={true}
                                                className="custom-header-css"
                                                theadClass="text-nowrap-headers"
                                                handleCustomerClick={handleCustomerClicks}
                                                SearchPlaceholder='Search for Route Name or something...'
                                                divClass="overflow-auto"
                                                tableClass="width-50"
                                            />
                                        ) : (
                                            <div className="text-center">No routes found</div>
                                        )}
                                    </div>

                                    {/* Edit/Add Modal with improved spacing and validations */}
                                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                                            {!!isEdit ? "Edit Route" : "Add Route"}
                                        </ModalHeader>
                                        <Form className="tablelist-form" onSubmit={handleSubmit}>
                                            <ModalBody style={{ padding: '1.5rem 1rem 0.5rem' }}>
                                                <Row style={{ margin: '-0.35rem -0.5rem' }}>
                                                    {/* Route Code only shown in Edit mode */}
                                                    {isEdit && (
                                                        <Col md={4} style={{ padding: '0.15rem 0.5rem' }}>
                                                            <Label htmlFor="routeCode" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                                Route Code
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                name="routeCode"
                                                                id="routeCode"
                                                                placeholder="Enter Route Code"
                                                                maxLength="15"
                                                                value={values.routeCode}
                                                                onChange={handleInputChange}
                                                                disabled={true}
                                                                style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                            />
                                                        </Col>
                                                    )}

                                                    {/* Route Name Field - With Field Error */}
                                                    {isEdit && (
                                                        <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                            <Label htmlFor="routeName" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                                Route Name<span style={{ color: "red" }}>*</span>
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                required
                                                                className={`form-control ${fieldErrors.routeName ? 'is-invalid' : ''}`}
                                                                name="routeName"
                                                                id="routeName"
                                                                placeholder="Enter Route Name"
                                                                maxLength="100"
                                                                value={values.routeName}
                                                                onChange={handleInputChange}
                                                                onKeyPress={handleKeyPress}
                                                                onPaste={handlePaste}
                                                                style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                            />
                                                            {fieldErrors.routeName && (
                                                                <div className="invalid-feedback d-block" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                                    <i className="ri-error-warning-line me-1"></i>
                                                                    {fieldErrors.routeName}
                                                                </div>
                                                            )}
                                                        </Col>
                                                    )}

                                                    {/* Route Destination Field - With Field Error */}
                                                    <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                        <Label htmlFor="routeDestination" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                            Route Destination<span style={{ color: "red" }}>*</span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            required
                                                            className={`form-control ${fieldErrors.routeDestination ? 'is-invalid' : ''}`}
                                                            name="routeDestination"
                                                            id="routeDestination"
                                                            placeholder="Enter Route Destination"
                                                            value={values.routeDestination}
                                                            onChange={handleInputChange}
                                                            onKeyPress={handleKeyPress}
                                                            onPaste={handlePaste}
                                                            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                        />
                                                        {fieldErrors.routeDestination && (
                                                            <div className="invalid-feedback d-block" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                                <i className="ri-error-warning-line me-1"></i>
                                                                {fieldErrors.routeDestination}
                                                            </div>
                                                        )}
                                                    </Col>

                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
    <Label htmlFor="routeType" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
        Route Type<span style={{ color: "red" }}>*</span>
    </Label>
    <Input
        name="routeType"
        type="select"
        className="form-select"
        id="routeType"
        value={values.routeType}
        onChange={handleInputChange}
        required
        disabled={routeTypesLoading}
        style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
    >
        <option value="">
            {routeTypesLoading ? "Loading Route Types..." : "Select Type"}
        </option>
        {routeTypes.map((item) => (
            <option value={item.routeType} key={item.id}>
                {item.routeType}
            </option>
        ))}
    </Input>
    {routeTypesLoading && (
        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            <i className="ri-loader-2-line"></i> Loading route types...
        </small>
    )}
</Col>

                                                    <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                        <Label htmlFor="transportationType" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                            Transportation Type<span style={{ color: "red" }}>*</span>
                                                        </Label>
                                                        <Input
                                                            name="transportationType"
                                                            type="select"
                                                            className="form-select"
                                                            id="transportationType"
                                                            value={values.transportationType}
                                                            onChange={handleInputChange}
                                                            required
                                                            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                        >
                                                            {transportationTypes.map((item, key) => (
                                                                <React.Fragment key={key}>
                                                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                </React.Fragment>
                                                            ))}
                                                        </Input>
                                                    </Col>

                                                    <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                        <Label htmlFor="deliveryDate" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                            Delivery Date<span style={{ color: "red" }}>*</span>
                                                        </Label>
                                                        <Input
                                                            type="datetime-local"
                                                            required
                                                            className="form-control"
                                                            name="deliveryDate"
                                                            id="deliveryDate"
                                                       min={new Date().toISOString().slice(0, 16)}
                                                            value={values.deliveryDate ? new Date(values.deliveryDate).toISOString().slice(0, 16) : ""}
                                                            onChange={handleInputChange}
                                                            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                        />
                                                    </Col>

                                                    {/* Shipping Type Field - With Field Error */}
                                                    <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                        <Label htmlFor="shippingType" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                            Shipping Type<span style={{ color: "red" }}>*</span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            required
                                                            className={`form-control ${fieldErrors.shippingType ? 'is-invalid' : ''}`}
                                                            name="shippingType"
                                                            id="shippingType"
                                                            placeholder="Enter Shipping Type"
                                                            value={values.shippingType}
                                                            onChange={handleInputChange}
                                                            onKeyPress={handleKeyPress}
                                                            onPaste={handlePaste}
                                                            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                        />
                                                        {fieldErrors.shippingType && (
                                                            <div className="invalid-feedback d-block" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                                <i className="ri-error-warning-line me-1"></i>
                                                                {fieldErrors.shippingType}
                                                            </div>
                                                        )}
                                                    </Col>

                                                    <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                        <Label htmlFor="routeDetermination" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                            Route Determination<span style={{ color: "red" }}>*</span>
                                                        </Label>
                                                        <Input
                                                            name="routeDetermination"
                                                            type="select"
                                                            className="form-select"
                                                            id="routeDetermination"
                                                            value={values.routeDetermination}
                                                            onChange={handleInputChange}
                                                            required
                                                            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                        >
                                                            {routeDeterminations.map((item, key) => (
                                                                <React.Fragment key={key}>
                                                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                </React.Fragment>
                                                            ))}
                                                        </Input>
                                                    </Col>

                                                    {/* Intermediate Stops Field - With Field Error */}
                                                    <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                        <Label htmlFor="intermediateStops" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                            Intermediate Stops<span style={{ color: "red" }}>*</span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            required
                                                            className={`form-control ${fieldErrors.intermediateStops ? 'is-invalid' : ''}`}
                                                            name="intermediateStops"
                                                            id="intermediateStops"
                                                            placeholder="Enter Intermediate Stops"
                                                            value={values.intermediateStops}
                                                            onChange={handleInputChange}
                                                            onKeyPress={handleKeyPress}
                                                            onPaste={handlePaste}
                                                            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                        />
                                                        {fieldErrors.intermediateStops && (
                                                            <div className="invalid-feedback d-block" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                                <i className="ri-error-warning-line me-1"></i>
                                                                {fieldErrors.intermediateStops}
                                                            </div>
                                                        )}
                                                    </Col>

                                                    {/* Route Distance Field - With Field Error */}
                                                    <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                        <Label htmlFor="routeDistance" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                            Route Distance<span style={{ color: "red" }}>*</span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            required
                                                            className={`form-control ${fieldErrors.routeDistance ? 'is-invalid' : ''}`}
                                                            name="routeDistance"
                                                            id="routeDistance"
                                                            placeholder="Enter Route Distance"
                                                            value={values.routeDistance}
                                                            onChange={handleInputChange}
                                                            onKeyPress={handleKeyPress}
                                                            onPaste={handlePaste}
                                                            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                        />
                                                        {fieldErrors.routeDistance && (
                                                            <div className="invalid-feedback d-block" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                                <i className="ri-error-warning-line me-1"></i>
                                                                {fieldErrors.routeDistance}
                                                            </div>
                                                        )}
                                                    </Col>

                                                    {/* Transportation Cost Field - With Field Error */}
                                                    <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                        <Label htmlFor="transportationCost" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                            Transportation Cost<span style={{ color: "red" }}>*</span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            required
                                                            className={`form-control ${fieldErrors.transportationCost ? 'is-invalid' : ''}`}
                                                            name="transportationCost"
                                                            id="transportationCost"
                                                            placeholder="Enter Transportation Cost"
                                                            value={values.transportationCost}
                                                            onChange={handleInputChange}
                                                            onKeyPress={handleKeyPress}
                                                            onPaste={handlePaste}
                                                            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                        />
                                                        {fieldErrors.transportationCost && (
                                                            <div className="invalid-feedback d-block" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                                <i className="ri-error-warning-line me-1"></i>
                                                                {fieldErrors.transportationCost}
                                                            </div>
                                                        )}
                                                    </Col>

                                                    {/* Carrier Field - With Field Error */}
                                                    <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                        <Label htmlFor="carrier" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                            Carrier<span style={{ color: "red" }}>*</span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            required
                                                            className={`form-control ${fieldErrors.carrier ? 'is-invalid' : ''}`}
                                                            name="carrier"
                                                            id="carrier"
                                                            placeholder="Enter Carrier"
                                                            value={values.carrier}
                                                            onChange={handleInputChange}
                                                            onKeyPress={handleKeyPress}
                                                            onPaste={handlePaste}
                                                            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                        />
                                                        {fieldErrors.carrier && (
                                                            <div className="invalid-feedback d-block" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                                <i className="ri-error-warning-line me-1"></i>
                                                                {fieldErrors.carrier}
                                                            </div>
                                                        )}
                                                    </Col>

                                                    <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                        <Label htmlFor="routeSelection" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                            Route Selection<span style={{ color: "red" }}>*</span>
                                                        </Label>
                                                        <Input
                                                            name="routeSelection"
                                                            type="select"
                                                            className="form-select"
                                                            id="routeSelection"
                                                            value={values.routeSelection}
                                                            onChange={handleInputChange}
                                                            required
                                                            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                        >
                                                            {routeSelections.map((item, key) => (
                                                                <React.Fragment key={key}>
                                                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                </React.Fragment>
                                                            ))}
                                                        </Input>
                                                    </Col>

                                                    {/* Transportation Zone Field - With Field Error */}
                                                    <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                        <Label htmlFor="transportationZone" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                            Transportation Zone<span style={{ color: "red" }}>*</span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            required
                                                            className={`form-control ${fieldErrors.transportationZone ? 'is-invalid' : ''}`}
                                                            name="transportationZone"
                                                            id="transportationZone"
                                                            placeholder="Enter Transportation Zone"
                                                            value={values.transportationZone}
                                                            onChange={handleInputChange}
                                                            onKeyPress={handleKeyPress}
                                                            onPaste={handlePaste}
                                                            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                        />
                                                        {fieldErrors.transportationZone && (
                                                            <div className="invalid-feedback d-block" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                                <i className="ri-error-warning-line me-1"></i>
                                                                {fieldErrors.transportationZone}
                                                            </div>
                                                        )}
                                                    </Col>

                                                    {/* Shipping Point Field - With Field Error */}
                                                    <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                        <Label htmlFor="shippingPoint" className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                            Shipping Point<span style={{ color: "red" }}>*</span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            required
                                                            className={`form-control ${fieldErrors.shippingPoint ? 'is-invalid' : ''}`}
                                                            name="shippingPoint"
                                                            id="shippingPoint"
                                                            placeholder="Enter Shipping Point"
                                                            value={values.shippingPoint}
                                                            onChange={handleInputChange}
                                                            onKeyPress={handleKeyPress}
                                                            onPaste={handlePaste}
                                                            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                        />
                                                        {fieldErrors.shippingPoint && (
                                                            <div className="invalid-feedback d-block" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                                <i className="ri-error-warning-line me-1"></i>
                                                                {fieldErrors.shippingPoint}
                                                            </div>
                                                        )}
                                                    </Col>

                                                    {isEdit && (
                                                        <Col lg={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                            <Label className="form-label" style={{ marginBottom: '0', fontSize: '0.85rem' }}>
                                                                Status<span style={{ color: "red" }}>*</span>
                                                            </Label>
                                                            <Input
                                                                name="status"
                                                                type="select"
                                                                className="form-select"
                                                                value={values.status}
                                                                onChange={handleInputChange}
                                                                required
                                                                style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', minHeight: '32px' }}
                                                            >
                                                                {status.map((item, key) => (
                                                                    <React.Fragment key={key}>
                                                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                    </React.Fragment>
                                                                ))}
                                                            </Input>
                                                        </Col>
                                                    )}
                                                </Row>
                                                <Row>
                                                    <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: '30px' }}>
                                                        <button type="button" className="btn btn-light" onClick={toggle}> Cancel  </button>
<button 
    type="submit" 
    className="btn btn-primary"
    disabled={isEdit && !hasChanges} // Disable in edit mode if no changes
> 
    {!!isEdit ? "Update " : "Submit"} 
</button>
                                                    </Col>
                                                </Row>
                                            </ModalBody>
                                        </Form>
                                    </Modal>

                                    {/* View Modal */}
                                    <Modal id="viewModal" isOpen={viewModal} toggle={toggleView} centered size="lg">
                                        <ModalHeader className="bg-light p-2" toggle={toggleView}>
                                            Route Details
                                        </ModalHeader>
                                        <ModalBody style={{ padding: '1.5rem 1rem 0.5rem' }}>
                                            <Row style={{ marginTop: '-0.25rem', marginBottom: '-0.25rem' }}>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Route Code</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.routeCode}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Route Name</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.routeName}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Plant Code</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.plantCode}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Route Destination</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.routeDestination}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Route Type</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.routeType}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Transportation Type</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.transportationType}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Delivery Date</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>
                                                            {viewData.deliveryDate ? new Date(viewData.deliveryDate).toLocaleString() : ""}
                                                        </p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Shipping Type</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.shippingType}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Route Determination</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.routeDetermination}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Intermediate Stops</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.intermediateStops}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Route Distance</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.routeDistance}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Transportation Cost</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.transportationCost}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Carrier</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.carrier}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Route Selection</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.routeSelection}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Transportation Zone</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.transportationZone}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Shipping Point</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>{viewData.shippingPoint}</p>
                                                    </div>
                                                </Col>
                                                <Col md={4} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                                                    <div>
                                                        <Label className="form-label fw-semibold" style={{ marginBottom: '0', fontSize: '0.85rem' }}>Status</Label>
                                                        <p className="form-control form-control-sm bg-light" style={{ marginBottom: '0', paddingTop: '0.15rem', paddingBottom: '0.15rem', minHeight: '28px' }}>
                                                            {viewData.status === 'A' ? 'Active' : viewData.status === 'D' ? 'Deactive' : viewData.status}
                                                        </p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </ModalBody>
                                        <ModalFooter style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                                            <button type="button" className="btn btn-light" onClick={toggleView}>Close</button>
                                        </ModalFooter>
                                    </Modal>
                                    <ToastContainer
                                        position="top-right"
                                        autoClose={3000}
                                        hideProgressBar={false}
                                        closeOnClick
                                        rtl={false}
                                        pauseOnFocusLoss
                                        draggable
                                        pauseOnHover
                                        theme="light"

                                        toastStyle={{ backgroundColor: "white" }}
                                    />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default MasterRoute;