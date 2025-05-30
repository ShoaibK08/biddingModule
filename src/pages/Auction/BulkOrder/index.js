import React, { useState, useEffect, useMemo } from "react";
import { Form, Input, Label } from "reactstrap";
import { Stepper, Step, StepLabel, StepConnector } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import './BulkOrder.css'; // Import the CSS file
import TransporterViewer from "./TransporterViewer/TransporterViewer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";


// Create a custom connector with withStyles (Material-UI v4 approach)
const GreenConnector = withStyles({
  alternativeLabel: {
    top: 22, // Align with circle center
  },
  active: {
    '& $line': {
      borderColor: '#00A389',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#00A389',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

// Custom StepIcon component for Material-UI v4
const CustomStepIcon = (props) => {
  const { active, completed, icon } = props;

  return (
    <div
      className={`custom-step-icon ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: completed ? '#00A389' : active ? '#4361ee' : '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '16px',
        boxShadow: active || completed ? '0 4px 8px rgba(0,0,0,0.15)' : 'none',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      {completed ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        icon
      )}
    </div>
  );
};

const BulkOrder = ({ bidNo }) => {
  // Define all options and static data first to prevent reference errors

  const steps = [
    'Bid Details',
    'Material and Transporter',
    'Delivery and Allocation',
    'Finish'
  ];

  const locationOptions = [
    "Select",
    "Location A",
    "Location B",
    "Location C",
    "Location D",
    "Gurugram",
    "Mumbai"
  ];



  const autoAllocateToOptions = [
    "Select",
    "Yes",
    "No"
  ];

  const uomOptions = [
    "Select",
    "MT",
    "KM",
  ];

  const multiMaterialOptions = [
    "Select",
    "Yes",
    "No"
  ];

  const [materialOptions, setMaterialOptions] = useState([]);
  useEffect(() => {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    const plantCode = obj?.data?.plantCode;

    const fetchMaterials = async () => {
      try {
        const rawResponse = await axios.get(
          `${process.env.REACT_APP_LOCAL_URL_8082}/materials?plantCode=${plantCode}`,
          config
        );
        console.log("RAW API Response:", rawResponse);

        let materialData = [];

        if (Array.isArray(rawResponse)) {
          materialData = rawResponse;
        } else if (Array.isArray(rawResponse.data)) {
          materialData = rawResponse.data;
        } else if (rawResponse.data && Array.isArray(rawResponse.data.data)) {
          materialData = rawResponse.data.data;
        } else {
          console.warn("Unexpected material response format", rawResponse);
          materialData = [];
        }

        const materialNames = materialData.map(item => item.name);
        console.log("Mapped material names:", materialNames);

        if (!materialNames.length) {
          console.log("No materials found. Setting default values.");
          setMaterialOptions(["Default Material 1", "Default Material 2"]);
        } else {
          setMaterialOptions(materialNames);
        }

      } catch (error) {
        console.error("Error fetching materials:", error);
        setMaterialOptions(["Default Material 1", "Default Material 2"]);
      }
    };

    if (plantCode) {
      fetchMaterials();
    }
  }, []);


  // Initial transporters - will be replaced by API response
  const [transporterOptions, setTransporterOptions] = useState([
    { id: "0916005637", name: "Jaya Roadways" },
    { id: "0916006094", name: "RAJ ENTERPRISE" },
    { id: "0916003431", name: "R & B Transport" },
    { id: "0916005708", name: "Jaya Roadways" },
    { id: "0916005858", name: "Laxmi Roadways" }
  ]);

  const displayToTransporterOptions = [
    'Select',
    'All',
    'Route Based',
    'Plant Based'
  ];

  // Now define state variables
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showTransporterDropdown, setShowTransporterDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectAllTransporters, setSelectAllTransporters] = useState(false);
  const [showTransporterModal, setShowTransporterModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityOptions, setCityOptions] = useState(["Select City"]);
  const [routeParam, setRouteParam] = useState('');
  // Add loading state for transporters
  const [loadingTransporters, setLoadingTransporters] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [citiesData, setCitiesData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [showMaterialDropdown, setShowMaterialDropdown] = useState(false);
  const [materialSearchTerm, setMaterialSearchTerm] = useState("");
  const [showFromLocationDropdown, setShowFromLocationDropdown] = useState(false);
  const [showToLocationDropdown, setShowToLocationDropdown] = useState(false);
  const [fromLocationSearchTerm, setFromLocationSearchTerm] = useState("");
  const [toLocationSearchTerm, setToLocationSearchTerm] = useState("");

  const [routeOptions, setRouteOptions] = useState([]);
  const [showRouteDropdown, setShowRouteDropdown] = useState(false);
  const [routeSearchTerm, setRouteSearchTerm] = useState("");
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [biddingOrderNo, setBiddingOrderNo] = useState("");


  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // Get plantCode from sessionStorage
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        const plantCode = obj?.data?.plantCode || 'N205';

        setLoadingRoutes(true);

        // Use full configuration for debugging
        const axiosConfig = {
          ...config,
          headers: {
            ...config.headers,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },

        };

        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL_URL_8082}/routes?plantCode=${plantCode}`,
          axiosConfig
        );

        console.log("response Route====>>>>>>>>>", response);

        // Initialize route data
        let routeData = ['Select'];

        // Multiple parsing strategies
        const parseStrategies = [
          () => response.data?.data?.map(route => route.routeName),
          () => response.data?.map(route => route.routeName),
          () => response.data?.data?.map(route => route.routeCode),
          () => response.map(route => route.routeName)
        ];

        // Try each parsing strategy
        for (let strategy of parseStrategies) {
          try {
            const parsedRoutes = strategy();
            if (parsedRoutes && parsedRoutes.length > 0) {
              routeData = [...parsedRoutes.filter(r => r)];
              break;
            }
          } catch (strategyError) {
            console.warn("Strategy failed:", strategyError);
          }
        }

        console.log("Final Parsed Routes:", routeData);

        // Update route options
        if (routeData.length > 0) {
          setRouteOptions(routeData);
        } else {
          console.warn("No routes found in the API response");
          setRouteOptions(['Select']);
        }

      } catch (error) {
        console.error("Comprehensive Route Fetch Error:", {
          message: error.message,
          response: error.response,
          request: error.request
        });

        // Set fallback
        setRouteOptions(['Select']);

        // Optional: Toast or error notification
        toast.error("Failed to load routes. Please try again.", {
          position: "top-right",
          autoClose: 3000
        });
      } finally {
        setLoadingRoutes(false);
      }
    };

    fetchRoutes();
  }, []); // No dependencies to run once on mount

  // Existing filteredRoutes logic remains the same
  const filteredRoutes = useMemo(() => {
    if (!routeSearchTerm || routeSearchTerm.trim() === '') {
      return routeOptions;
    }

    const searchTermLower = routeSearchTerm.toLowerCase();
    return routeOptions.filter(route =>
      route && route.toLowerCase().includes(searchTermLower)
    );
  }, [routeOptions, routeSearchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showRouteDropdown && !event.target.closest('.route-dropdown-container')) {
        setShowRouteDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRouteDropdown]);

  const filteredFromLocations = useMemo(() => {
    if (!fromLocationSearchTerm || fromLocationSearchTerm.trim() === '') {
      return citiesData;
    }

    const searchTermLower = fromLocationSearchTerm.toLowerCase();
    return citiesData.filter(city =>
      city && city.toLowerCase().includes(searchTermLower)
    );
  }, [citiesData, fromLocationSearchTerm]);

  const filteredToLocations = useMemo(() => {
    if (!toLocationSearchTerm || toLocationSearchTerm.trim() === '') {
      return citiesData;
    }

    const searchTermLower = toLocationSearchTerm.toLowerCase();
    return citiesData.filter(city =>
      city && city.toLowerCase().includes(searchTermLower)
    );
  }, [citiesData, toLocationSearchTerm]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (showFromLocationDropdown && !event.target.closest('.from-location-dropdown-container')) {
        setShowFromLocationDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFromLocationDropdown]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showToLocationDropdown && !event.target.closest('.to-location-dropdown-container')) {
        setShowToLocationDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToLocationDropdown]);

  const filteredMaterials = useMemo(() => {
    if (!materialSearchTerm || materialSearchTerm.trim() === '') {
      return materialOptions;
    }

    const searchTermLower = materialSearchTerm.toLowerCase();
    return materialOptions.filter(material =>
      material && material.toLowerCase().includes(searchTermLower)
    );
  }, [materialOptions, materialSearchTerm]);

  const filteredCities = useMemo(() => {
    console.log("Search term:", citySearchTerm);
    console.log("Available cities data:", citiesData);

    // When no search term, show all cities
    if (!citySearchTerm || citySearchTerm.trim() === '') {
      return citiesData;
    }

    // Filter with any length search term (no minimum characters required)
    const searchTermLower = citySearchTerm.toLowerCase();
    const filtered = citiesData.filter(city =>
      city && city.toLowerCase().includes(searchTermLower)
    );

    console.log("Filtered results:", filtered);
    return filtered;
  }, [citiesData, citySearchTerm]);




  const [showCityDropdown, setShowCityDropdown] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showCityDropdown && !event.target.closest('.city-dropdown-container')) {
        setShowCityDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCityDropdown]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (showMaterialDropdown && !event.target.closest('.bulk-order-material-selector') &&
        !event.target.closest('.bulk-order-dropdown')) {
        setShowMaterialDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMaterialDropdown]);
  const [values, setValues] = useState({
    // Bid Details
    bidStartingFrom: "",
    bidStartTo: "",
    city: "",
    ceilingAmount: "",
    intervalAmount: "",
    uom: "",
    lastMinutesExtension: "",

    // Material and Transporter
    multiMaterial: "",
    material: "",
    quantity: "",
    extensionQuantity: "",
    displayToTransporter: "",
    selectTransporter: [],

    // Delivery and Allocation
    fromLocation: "",
    toLocation: "",
    route: "",
    autoAllocateTo: "",
    intervalTimeForAllocatingVehicle: "",
    intervalTimeToReachPlant: "",
    gracePeriodToReachPlant: ""
  });

  // Filter transporters based on search term
  const filteredTransporters = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return transporterOptions;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();
    const filtered = transporterOptions.filter(t => {
      // Ensure transporter object exists
      if (!t) return false;

      // Add safe null/undefined checks for all properties
      const name = (t.name || '').toString().toLowerCase();
      const id = (t.id || '').toString();
      const code = (t.code || '').toString();
      const contactPerson = (t.contactPerson || '').toString().toLowerCase();
      const contactNumber = (t.contactNumber || '').toString();

      return name.includes(searchTermLower) ||
        id.includes(searchTermLower) ||
        code.includes(searchTermLower) ||
        contactPerson.includes(searchTermLower) ||
        contactNumber.includes(searchTermLower);
    });

    console.log("Search Results:", {
      searchTerm: searchTermLower,
      total: transporterOptions.length,
      filtered: filtered.length,
      results: filtered
    });

    return filtered;
  }, [transporterOptions, searchTerm]);
  // Update the search term handler to properly handle input
  const handleTransporterSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Ensure dropdown stays open while searching
    if (!showTransporterDropdown) {
      setShowTransporterDropdown(true);
    }
  };

  // const obj = JSON.parse(sessionStorage.getItem("authUser"));
  // let plantcode = obj.data.plantCode;

  // Helper function for authentication headers
  const getAuthHeaders = () => {
    const username = process.env.REACT_APP_API_USER_NAME || 'amazin';
    const password = process.env.REACT_APP_API_PASSWORD || 'TE@M-W@RK';
    const base64Auth = btoa(`${username}:${password}`);

    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${base64Auth}`,
      'Accept': 'application/json'
    };
  };


  const fetchTransportersByFlag = async (flag, filterParam) => {
    setLoadingTransporters(true);
    try {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let plantcode = obj.data.plantCode;

      const apiUrl = `${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/allTransportersByFlag?flag=${flag}&filterParam=${plantcode}`;
      console.log("Fetching transporters from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API response data:", result);

      if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
        // Map the API response fields to match TransporterViewer requirements
        const mappedTransporters = result.data.map(transporter => ({
          id: transporter.code,
          code: transporter.code,
          name: transporter.name.trim(),
          contactPerson: transporter.contactPerson || 'N/A',
          contactNumber: transporter.contactNumber || transporter.phoneNo || 'N/A',
          contactEmail: transporter.contactEmail || 'N/A',
          // Store the complete data for reference
          fullData: transporter
        }));

        console.log("Mapped transporters:", mappedTransporters);
        setTransporterOptions(mappedTransporters);
        setShowTransporterDropdown(true);
      } else {
        setTransporterOptions([]);
      }
    } catch (error) {
      console.error("Error fetching transporters:", error);
      toast.error(`Failed to fetch transporters: ${error.message}`, { autoClose: 3000 });
      setTransporterOptions([]);
    } finally {
      setLoadingTransporters(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the values state
    setValues(prevValues => {
      const newValues = {
        ...prevValues,
        [name]: value === 'Select' ? '' : value
      };

      // Clear the error for this field if it exists
      if (errors[name]) {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
        });
      }

      // Special handling for city field
      if (name === 'city' && value) {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors.city;
          return newErrors;
        });
      }

      // Date validation for Bid Start To
      if (name === 'bidStartTo' && value && values.bidStartingFrom) {
        const startDate = new Date(values.bidStartingFrom);
        const endDate = new Date(value);

        if (endDate <= startDate) {
          setErrors(prevErrors => ({
            ...prevErrors,
            bidStartTo: "Bid Start To must be greater than Bid Starting From"
          }));
        }
      }

      // Date validation for Bid Starting From
      if (name === 'bidStartingFrom' && value && values.bidStartTo) {
        const startDate = new Date(value);
        const endDate = new Date(values.bidStartTo);

        if (endDate <= startDate) {
          setErrors(prevErrors => ({
            ...prevErrors,
            bidStartTo: "Bid Start To must be greater than Bid Starting From"
          }));
        } else {
          // Clear the error if dates are now valid
          setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors.bidStartTo;
            return newErrors;
          });
        }
      }

      // Extension Quantity validation
      if (name === 'extensionQuantity' && value) {
        const extensionQty = parseFloat(value);
        const quantity = parseFloat(values.quantity);

        if (quantity && extensionQty > quantity) {
          setErrors(prevErrors => ({
            ...prevErrors,
            extensionQuantity: "Extension Quantity cannot be greater than Quantity"
          }));
        } else {
          setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors.extensionQuantity;
            return newErrors;
          });
        }
      }

      // Also validate when quantity changes
      if (name === 'quantity' && value) {
        const quantity = parseFloat(value);
        const extensionQty = parseFloat(values.extensionQuantity);

        if (extensionQty && extensionQty > quantity) {
          setErrors(prevErrors => ({
            ...prevErrors,
            extensionQuantity: "Extension Quantity cannot be greater than Quantity"
          }));
        } else {
          setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors.extensionQuantity;
            return newErrors;
          });
        }
      }

      // Handle special case for Display To Transporter dropdown
      if (name === 'displayToTransporter') {
        // Reset selected transporters when changing display mode
        newValues.selectTransporter = [];

        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantCode1 = obj.data.plantCode;

        if (value === 'All') {
          fetchTransportersByFlag('A', plantCode1);
        }
        else if (value === 'Route Based') {
          fetchTransportersByFlag('R', plantCode1);
        }
        else if (value === 'Plant Based') {
          fetchTransportersByFlag('P', plantCode1);
        }
        else if (value === 'Select' || value === '') {
          // Clear the transporter options when 'Select' is chosen
          setTransporterOptions([]);
          setShowTransporterDropdown(false);
        }
      }

      // Update related fields for Route changes
      if (name === 'route' && values.displayToTransporter === 'Route Based') {
        if (value && value !== 'Select') {
          fetchTransportersByFlag('R', value);
        }
      }

      // Update related fields for From Location changes
      if (name === 'fromLocation' && values.displayToTransporter === 'Plant Based') {
        if (value && value !== 'Select') {
          fetchTransportersByFlag('P', value);
        }
      }

      return newValues;
    });
  };


  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    auth: {
      username: process.env.REACT_APP_API_USER_NAME || 'amazin',
      password: process.env.REACT_APP_API_PASSWORD || 'TE@M-W@RK'
    }
  };
  const extractCitiesFromData = (data) => {
    let cities = [];

    // Handle case where data is an array containing objects with cityName
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item && typeof item === 'object') {
          if (item.cityName) {
            cities.push(item.cityName);
          }
        }
      });
    }

    // If we have no cities yet, try to extract from a nested data structure
    if (cities.length === 0 && data) {
      // Check if data has a nested structure with cityName properties
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach(item => {
          if (item && item.cityName) {
            cities.push(item.cityName);
          }
        });
      }
    }

    // Based on your screenshot, the response might contain a special format
    // with cityName in each object of an array
    if (cities.length === 0 && typeof data === 'object') {
      // Try to find cityName in a more nested structure
      if (data.meta && data.data && Array.isArray(data.data)) {
        data.data.forEach(item => {
          if (item && item.cityName) {
            cities.push(item.cityName);
          }
        });
      }
    }

    return cities;
  };

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const rawResponse = await axios.get(
          `${process.env.REACT_APP_LOCAL_URL_8082}/locations/filterLocation/a`,
          config
        );

        console.log("RAW API Response:", rawResponse);

        // If rawResponse is already an array (as seen in logs)
        let locationData = rawResponse;

        // OR, if Axios returns the full object and data is an array directly
        if (Array.isArray(rawResponse)) {
          locationData = rawResponse;
        } else if (Array.isArray(rawResponse.data)) {
          locationData = rawResponse.data;
        } else if (rawResponse.data && Array.isArray(rawResponse.data.data)) {
          locationData = rawResponse.data.data;
        } else {
          console.warn("Unexpected response format", rawResponse);
          locationData = [];
        }

        const cities = locationData.map(item => item.cityName);
        console.log("Mapped city names:", cities);

        if (!cities.length) {
          console.log("Fallback cities used");
          // setCitiesData(["UJJAIN", "INDORE"]);
        } else {
          setCitiesData(cities);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        //  setCitiesData(["UJJAIN", "INDORE"]);
      } finally {
        setLoadingCities(false);
      }
    };


    fetchCities();
  }, []);



  const handleTransporterSelect = (transporter) => {
    console.log("Selecting transporter:", transporter);

    // Check if the transporter is already selected by ID to prevent duplicates
    const isAlreadySelected = values.selectTransporter.some(t => t.id === transporter.id);

    if (!isAlreadySelected) {
      setValues(prevValues => {
        const newSelection = [...prevValues.selectTransporter, {
          id: transporter.id,
          code: transporter.code || transporter.id, // Use code if available, fallback to id
          name: transporter.name || 'N/A',
          contactPerson: transporter.contactPerson || 'N/A',
          contactNumber: transporter.contactNumber || 'N/A',
          // Store the complete data for reference
          fullData: transporter
        }];

        console.log("Updated selection:", newSelection);

        // Clear the selectTransporter error when at least one transporter is selected
        if (newSelection.length > 0) {
          setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectTransporter;
            return newErrors;
          });
        }

        return {
          ...prevValues,
          selectTransporter: newSelection
        };
      });
    } else {
      console.log("Transporter already selected, skipping");
    }
  };
  const handleRemoveTransporter = (transporterId, e) => {
    if (e) e.stopPropagation();
    setValues(prevValues => ({
      ...prevValues,
      selectTransporter: prevValues.selectTransporter.filter(t => t.id !== transporterId)
    }));
  };

  // FIXED: Handle select all transporters properly
  const handleSelectAllTransporters = (e) => {
    const isChecked = e.target.checked;
    setSelectAllTransporters(isChecked);

    if (isChecked) {
      // Get all currently filtered transporters
      const filteredIds = filteredTransporters.map(t => t.id);

      // Keep any previously selected transporters that aren't in the current filter
      const previousSelected = values.selectTransporter.filter(t => !filteredIds.includes(t.id));

      // Create a unique list of transporters to add (avoid duplicates)
      const transportersToAdd = filteredTransporters.filter(t =>
        !previousSelected.some(p => p.id === t.id)
      );

      // Add all filtered transporters
      const newSelection = [...previousSelected, ...transportersToAdd];

      setValues(prevValues => ({
        ...prevValues,
        selectTransporter: newSelection
      }));
    } else {
      // Remove only the filtered transporters from selection
      const filteredIds = filteredTransporters.map(t => t.id);

      setValues(prevValues => ({
        ...prevValues,
        selectTransporter: prevValues.selectTransporter.filter(t => !filteredIds.includes(t.id))
      }));
    }
  };

  // FIXED: Check if all filtered transporters are selected
  const areAllFilteredTransportersSelected = () => {
    if (filteredTransporters.length === 0) return false;

    // Create a set of selected transporter IDs for faster lookup
    const selectedIds = new Set(values.selectTransporter.map(t => t.id));

    // Check if all filtered transporters are in the selected set
    return filteredTransporters.every(t => selectedIds.has(t.id));
  };

  useEffect(() => {
    // This ensures filteredTransporters is always up-to-date with transporterOptions
    console.log("transporterOptions changed:", transporterOptions);

    // Since searchTerm might not have changed, we need to manually update the filtered list
    if (transporterOptions && transporterOptions.length > 0) {
      const newFilteredTransporters = transporterOptions.filter(t => {
        if (!t) return false;

        const name = (t.name || '').toString().toLowerCase();
        const id = (t.id || '').toString();

        return name.includes((searchTerm || '').toLowerCase()) ||
          id.includes(searchTerm || '');
      });

      console.log("New filtered transporters:", newFilteredTransporters);
    }
  }, [transporterOptions, searchTerm]);


  const formatDate = (dateString) => {
    if (!dateString) return "";

    // If the dateString already has the T format
    if (dateString.includes('T')) {
      // Make sure it has seconds for LocalDateTime compatibility
      if (dateString.length === 16) { // Format: "2025-05-09T11:29"
        return dateString + ":00"; // Add seconds: "2025-05-09T11:29:00"
      }
      return dateString;
    }


    // If it's in another format, convert to ISO format with T
    return dateString.replace(' ', 'T') + ":00";
  };
  const timeToMinutes = (timeString) => {
    if (!timeString) return 0;

    // Handle different formats
    let hours = 0;
    let minutes = 0;

    if (timeString.includes(':')) {
      const parts = timeString.split(':');
      if (parts.length >= 2) {
        hours = parseInt(parts[0]) || 0;
        minutes = parseInt(parts[1]) || 0;
      }
    } else {
      // If it's already a number, return it
      const parsed = parseInt(timeString);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }

    return (hours * 60) + minutes;
  };

  // Function to map form values to API payload
  // Function to map form values to API payload

  const mapFormValuesToPayload = () => {
    // Remove duplicates from the selected transporters before creating the biddings
    const uniqueTransporters = [...new Map(values.selectTransporter.map(item => [item.id, item])).values()];

    // Create an array of biddings, one for each selected transporter
    const biddings = uniqueTransporters.map(transporter => {
      // Extract the numeric part from route if possible
      let routeValue = 0;
      if (values.route && values.route !== "Select") {
        const routeMatch = values.route.match(/\d+/);
        if (routeMatch) {
          routeValue = parseFloat(routeMatch[0]);
        }
      }

      // Create the biddingMaster object for this transporter
      const biddingMaster = {
        transporterCode: transporter.id, // Use the transporter ID from selection
        ceilingPrice: parseFloat(values.ceilingAmount) || 0,
        uom: values.uom || "MT",
        bidFrom: formatDate(values.bidStartingFrom),
        bidTo: formatDate(values.bidStartTo),
        lastTimeExtension: timeToMinutes(values.lastMinutesExtension),
        extentionQuantity: parseInt(values.extensionQuantity) || 0,
        bidUnit: 1,
        addOn: "EXTRA_COST",
        intervalAmount: parseFloat(values.intervalAmount) || 0,
        noOfInput: 3,
        intervalAllocate: timeToMinutes(values.intervalTimeForAllocatingVehicle),
        intervalReach: timeToMinutes(values.intervalTimeToReachPlant),
        gracePeriod: timeToMinutes(values.gracePeriodToReachPlant),
        status: "A",
        autoAllocation: values.autoAllocateTo === "Yes" ? 1 : 0,
        bid: 1,
        bidType: "STANDARD",
        biddingOrderNo: bidNo,
        createdDate: new Date().toISOString().split('T')[0],
        route: routeValue,
        multiMaterial: values.multiMaterial === "Yes" ? 1 : 0,
        city: values.city || "",
        material: values.material || "Steel",
        quantity: parseInt(values.quantity) || 0,
        extentionQty: parseInt(values.extensionQuantity) || 0,
        autoAllocationSalesOrder: 1,
        fromLocation: values.fromLocation || "Location A",
        toLocation: values.toLocation || "Location B",
        // Include transporter contact details if needed for API
        transporterName: transporter.name,
        transporterContactPerson: transporter.contactPerson,
        transporterContactNumber: transporter.contactNumber
      };

      return {
        biddingMaster: biddingMaster,
        salesOrders: null
      };
    });

    // Return the bulk payload structure
    return {
      bulk: true,
      biddings: biddings
    };
  };


  const submitFormData = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = mapFormValuesToPayload();
      console.log("Submitting payload:", payload);

      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/bulk`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      // Parse the response JSON regardless of status to get any error messages
      const result = await response.json();
      console.log("API Response:", result);
      setBiddingOrderNo(result[0].data.biddingOrderNo);
      //   console.log("result data 2",result.data.biddingOrderNo);


      if (response.ok) {
        // Check if the result contains a message in meta object
        let successMessage = `Your bid has been ${biddingOrderNo} created successfully!`;


        // First check if it's an array response
        if (Array.isArray(result) && result.length > 0 && result[0].meta) {
          successMessage = result[0].meta.message || successMessage;
        }
        // Then check if it's a direct object with meta
        else if (result.meta && result.meta.message) {
          successMessage = result.meta.message;
        }
        // If result has a direct message property
        else if (result.message) {
          successMessage = result.message;
        }

        // Show success toast with the message from API
        toast.success(successMessage, { stashautoClose: 3000 });

        // Show success modal
        setShowSuccessModal(true);

        // After successful submission, go to Finish step
        setActiveStep(4);
        const refreshEvent = new CustomEvent('refreshBidNumber');
        document.dispatchEvent(refreshEvent);
      } else {
        // Extract error message from the response
        let errorMessage = "Something went wrong!";

        // First check if it's an array response
        if (Array.isArray(result) && result.length > 0 && result[0].meta) {
          errorMessage = result[0].meta.message || errorMessage;
        }
        // Then check if it's a direct object with meta
        else if (result.meta && result.meta.message) {
          errorMessage = result.meta.message;
        }
        // If result has a direct message property
        else if (result.message) {
          errorMessage = result.message;
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(error.message);

      // Dismiss any existing toasts first
      toast.dismiss();

      // Show error toast with the error message
      toast.error(error.message || "Something went wrong!", {
        toastId: 'error-toast', // Add a unique ID to prevent multiple toasts
        style: {
          background: '#fff',
          color: '#000',
          opacity: 1,
        },
        toastClassName: "custom-toast-error",
        autoClose: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Updated handleSubmit with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with values:", values);

    // Add Step 0 validation
    if (activeStep === 0) {
      const validationErrors = {};

      // Only validate required fields
      if (!values.bidStartingFrom) {
        validationErrors.bidStartingFrom = "Please select bid starting date";
      }

      if (!values.bidStartTo) {
        validationErrors.bidStartTo = "Please select bid end date";
      }

      // Add date comparison validation
      if (values.bidStartingFrom && values.bidStartTo) {
        const startDate = new Date(values.bidStartingFrom);
        const endDate = new Date(values.bidStartTo);

        if (endDate <= startDate) {
          validationErrors.bidStartTo = "Bid Start To must be greater than Bid Starting From";
        }
      }

      if (!values.intervalAmount) {
        validationErrors.intervalAmount = "Please enter interval amount";
      }

      if (!values.uom || values.uom === "Select" || values.uom.trim() === "") {
        validationErrors.uom = "Please select UOM";
      }

      if (!values.city || values.city.trim() === "") {
        validationErrors.city = "Please select city";
      }

      // Update the errors state
      setErrors(validationErrors);

      // If there are validation errors, don't proceed
      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      // If validation passes, move to next step
      setActiveStep(prevStep => prevStep + 1);
      return;
    }

    // Step 1 validation
    if (activeStep === 1) {
      const validationErrors = {};

      if (!values.material || values.material === "Select") {
        validationErrors.material = "Please select material";
      }

      if (!values.quantity || values.quantity.trim() === "") {
        validationErrors.quantity = "Please enter quantity";
      } else if (isNaN(values.quantity) || parseFloat(values.quantity) <= 0) {
        validationErrors.quantity = "Please enter a valid quantity greater than 0";
      }

      if (!values.extensionQuantity || values.extensionQuantity.trim() === "") {
        validationErrors.extensionQuantity = "Please enter extension quantity";
      } else if (isNaN(values.extensionQuantity) || parseFloat(values.extensionQuantity) <= 0) {
        validationErrors.extensionQuantity = "Please enter a valid extension quantity greater than 0";
      } else if (parseFloat(values.extensionQuantity) > parseFloat(values.quantity)) {
        validationErrors.extensionQuantity = "Extension Quantity cannot be greater than Quantity";
      }

      if (!values.displayToTransporter || values.displayToTransporter === "Select") {
        validationErrors.displayToTransporter = "Please select display to transporter";
      }

      if (!values.selectTransporter || values.selectTransporter.length === 0) {
        validationErrors.selectTransporter = "Please select at least one transporter";
      }

      // Update the errors state
      setErrors(validationErrors);

      // If there are validation errors, don't proceed
      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      // If validation passes, move to next step
      setActiveStep(prevStep => prevStep + 1);
      return;
    }

    // Step 2 validation
    if (activeStep === 2) {
      const validationErrors = {};

      if (!values.fromLocation || values.fromLocation === "Select") {
        validationErrors.fromLocation = "Please select from location";
      }

      if (!values.toLocation || values.toLocation === "Select") {
        validationErrors.toLocation = "Please select to location";
      }

      if (!values.route || values.route === "Select") {
        validationErrors.route = "Please select route";
      }

      if (!values.intervalTimeForAllocatingVehicle) {
        validationErrors.intervalTimeForAllocatingVehicle = "Please enter interval time for allocating vehicle";
      }

      if (!values.intervalTimeToReachPlant) {
        validationErrors.intervalTimeToReachPlant = "Please enter interval time to reach plant";
      }

      if (!values.gracePeriodToReachPlant) {
        validationErrors.gracePeriodToReachPlant = "Please enter grace period to reach plant";
      }

      // Time format validation using regex
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

      if (values.intervalTimeForAllocatingVehicle && !timeRegex.test(values.intervalTimeForAllocatingVehicle)) {
        validationErrors.intervalTimeForAllocatingVehicle = "Please enter a valid time format (HH:MM)";
      }

      if (values.intervalTimeToReachPlant && !timeRegex.test(values.intervalTimeToReachPlant)) {
        validationErrors.intervalTimeToReachPlant = "Please enter a valid time format (HH:MM)";
      }

      if (values.gracePeriodToReachPlant && !timeRegex.test(values.gracePeriodToReachPlant)) {
        validationErrors.gracePeriodToReachPlant = "Please enter a valid time format (HH:MM)";
      }

      // Update the errors state
      setErrors(validationErrors);

      // If there are validation errors, don't proceed
      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      // If validation passes, move to next step
      setActiveStep(prevStep => prevStep + 1);
      return;
    }

    // If we're at the preview step (3), submit the form
    if (activeStep === 3) {
      await submitFormData();
      return;
    }
  };

  const handleBackPage = () => {
    // Navigate to previous step
    setActiveStep(prevStep => Math.max(prevStep - 1, 0));
  };

  const handleBackToCreateBid = () => {
    // Reset form and go back to first step
    setActiveStep(0);
    setShowSuccessModal(false);
    setValues({
      bidStartingFrom: "",
      bidStartTo: "",
      city: "",
      ceilingAmount: "",
      intervalAmount: "",
      uom: "",
      lastMinutesExtension: "",
      multiMaterial: "",
      material: "",
      quantity: "",
      extensionQuantity: "",
      displayToTransporter: "",
      selectTransporter: [],
      fromLocation: "",
      toLocation: "",
      route: "",
      autoAllocateTo: "",
      intervalTimeForAllocatingVehicle: "",
      intervalTimeToReachPlant: "",
      gracePeriodToReachPlant: ""
    });
    // Clear any validation errors
    setErrors({});
    
    // ADD THIS: Dispatch custom event to refresh bid number
    const refreshEvent = new CustomEvent('refreshBidNumber');
    document.dispatchEvent(refreshEvent);
  };

  // Success Modal
  const SuccessModal = () => (
    <div className="bulk-order-modal-overlay">
      <div className="bulk-order-modal-content2">
        <div className="bulk-order-modal-icon">
          <lord-icon
            src="https://cdn.lordicon.com/lupuorrc.json"
            trigger="loop"
            colors="primary:#0ab39c,secondary:#405189"
            style={{ width: "120px", height: "120px" }}
          ></lord-icon>
        </div>
        <h3 className="bulk-order-modal-title">
          Your <span style={{ color: "blue" }}>{biddingOrderNo} </span> has been created !
        </h3>
        <button
          type="button"
          className="bulk-order-modal-button"
          onClick={handleBackToCreateBid}
        >
          Back to Create Bid
        </button>
      </div>
    </div>
  );


  return (
    <>
      {/* Material UI Stepper with custom connector for green lines */}
      <div className="bulk-order-stepper-container">
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<GreenConnector />}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={activeStep > index}>
              <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <Form onSubmit={handleSubmit}>
        {/* Bid Details Step */}
        {activeStep === 0 && (
          <div className="bulk-order-container">
            {/* First row: 4 fields */}
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Bid Starting From <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="datetime-local"
                    name="bidStartingFrom"
                    value={values.bidStartingFrom}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className="bulk-order-input"
                    style={{
                      color: "#000",
                      border: `1px solid ${errors.bidStartingFrom ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px"
                    }}
                  />
                  {errors.bidStartingFrom && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.bidStartingFrom}
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Bid Start To <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="datetime-local"
                    name="bidStartTo"
                    value={values.bidStartTo}
                    min={new Date().toISOString().slice(0, 16)}
                    onChange={handleInputChange}
                    className="bulk-order-input"
                    style={{
                      color: "#000",
                      border: `1px solid ${errors.bidStartTo ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px"
                    }}
                  />
                  {errors.bidStartTo && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.bidStartTo}
                    </div>
                  )}
                </div>
              </div>


              <div className="bulk-order-form-group city-dropdown-container">
                <Label className="bulk-order-label">
                  City <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <div
                    className="bulk-order-city-selector"
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    style={{
                      height: "42px",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      border: `1px solid ${errors.city ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px",
                      padding: "0.375rem 0.75rem",
                      backgroundColor: "#fff"
                    }}
                  >
                    <span className="bulk-order-city-selector-placeholder" style={{ color: "#000" }}>
                      {values.city || 'Select'}
                    </span>
                    <span style={{ marginLeft: "auto" }}>
                      <i className="ri-arrow-down-s-line" style={{ fontSize: "18px", color: "black" }}></i>
                    </span>
                  </div>

                  {errors.city && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.city}
                    </div>
                  )}

                  {/* City dropdown with search functionality */}
                  {showCityDropdown && (
                    <div className="bulk-order-dropdown" style={{
                      position: "absolute",
                      width: "100%",
                      zIndex: 10,
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      marginTop: "4px",
                      maxHeight: "300px",
                      overflowY: "auto"
                    }}>
                      {/* Search header */}
                      <div className="bulk-order-dropdown-header" style={{
                        padding: "8px",
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #ddd"
                      }}>
                        <input
                          type="text"
                          placeholder="Search"
                          value={citySearchTerm}
                          onChange={(e) => setCitySearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bulk-order-dropdown-search"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            color: "#000",
                            fontSize: "14px"
                          }}
                        />
                      </div>

                      {/* City list items */}
                      {!loadingCities && filteredCities.length > 0 && (
                        <div className="bulk-order-dropdown-content">
                          {filteredCities.map((city, index) => (
                            <div
                              key={index}
                              className="bulk-order-dropdown-item"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "10px 8px",
                                borderBottom: "1px solid #eee",
                                color: "#000",
                                cursor: "pointer"
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setValues(prevValues => ({
                                  ...prevValues,
                                  city: city
                                }));
                                // Clear city error when a city is selected
                                setErrors(prevErrors => {
                                  const newErrors = { ...prevErrors };
                                  delete newErrors.city;
                                  return newErrors;
                                });
                                setCitySearchTerm("");
                                setShowCityDropdown(false);
                              }}
                            >
                              <div style={{
                                flex: 1,
                                fontSize: "14px",
                                paddingLeft: "10px"
                              }}>
                                {city}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Ceiling Amount (MT)
                </Label>
                <Input
                  type="number"
                  placeholder="Add Amount"
                  name="ceilingAmount"
                  step="0.01"
                  min="0"
                  value={values.ceilingAmount}
                  onChange={handleInputChange}
                  className="bulk-order-input"
                  style={{ color: "#000" }}
                />
              </div>
            </div>

            {/* Second row: 3 fields */}
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Interval Amount <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="number"
                    placeholder="Add Amount"
                    name="intervalAmount"
                    value={values.intervalAmount}
                    onChange={handleInputChange}
                    className="bulk-order-input"
                    style={{
                      color: "#000",
                      border: `1px solid ${errors.intervalAmount ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px",
                      backgroundColor: "#fff"
                    }}
                  />
                  {errors.intervalAmount && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500",
                      position: "absolute",
                      width: "100%"
                    }}>
                      {errors.intervalAmount}
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  UOM <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="uom"
                    value={values.uom}
                    onChange={handleInputChange}
                    required
                    className="bulk-order-select"
                    style={{
                      color: "#000",
                      border: `1px solid ${errors.uom ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px"
                    }}
                  >
                    {uomOptions.map((uom, index) => (
                      <option key={index} value={uom} style={{ color: "#000" }}>
                        {uom}
                      </option>
                    ))}
                  </Input>
                  {errors.uom && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.uom}
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Last Minutes Extension
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="time"
                    placeholder=" --:--:--"
                    name="lastMinutesExtension"
                    value={values.lastMinutesExtension}
                    onChange={handleInputChange}

                    className="bulk-order-input black-placeholder"
                    style={{ color: "#000" }}
                  />
                </div>
              </div>
            </div>

            <div className="bulk-order-button-container">
              <button
                type="button"
                className={`bulk-order-button bulk-order-back-button ${activeStep === 0 ? 'disabled' : ''}`}
                onClick={handleBackPage}
                disabled={activeStep === 0}
                style={{ opacity: activeStep === 0 ? "0.6" : "1" }}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="bulk-order-button bulk-order-next-button"
              >
                Save & Next <i className="ri-arrow-right-line ms-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* Material and Transporter Step */}
        {activeStep === 1 && (
          <div className="bulk-order-container">
            {/* First row: 4 fields */}
            <div className="bulk-order-row">
             
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Material <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  {/* Main material selector that shows the current selection */}
                  <div
                    className="bulk-order-material-selector"
                    onClick={() => setShowMaterialDropdown(!showMaterialDropdown)}
                    style={{
                      height: "42px",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      border: `1px solid ${errors.material ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px",
                      padding: "0.375rem 0.75rem",
                      backgroundColor: "#fff",
                      outline: "none"
                    }}
                  >
                    <span className="bulk-order-material-selector-placeholder" style={{ color: "#000" }}>
                      {values.material || 'Select'}
                    </span>
                    <span style={{ marginLeft: "auto" }}>
                      <i className="ri-arrow-down-s-line" style={{ fontSize: "18px", color: "black" }}></i>
                    </span>
                  </div>
                  {errors.material && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.material}
                    </div>
                  )}
                  {/* Material dropdown with search functionality */}
                  {showMaterialDropdown && (
                    <div className="bulk-order-dropdown" style={{
                      position: "absolute",
                      width: "100%",
                      zIndex: 10,
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      marginTop: "4px",
                      maxHeight: "300px",
                      overflowY: "auto"
                    }}>
                      {/* Search header */}
                      <div className="bulk-order-dropdown-header" style={{
                        padding: "8px",
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #ddd"
                      }}>
                        <input
                          type="text"
                          placeholder="Search"
                          value={materialSearchTerm}
                          onChange={(e) => setMaterialSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bulk-order-dropdown-search"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            color: "#000",
                            fontSize: "14px",
                            outline: "none"
                          }}
                        />
                      </div>

                      {/* Material list items */}
                      <div className="bulk-order-dropdown-content">
                        {filteredMaterials.map((material, index) => (
                          <div
                            key={index}
                            className="bulk-order-dropdown-item"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "10px 8px",
                              borderBottom: "1px solid #eee",
                              color: "#000",
                              cursor: "pointer"
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setValues(prevValues => ({
                                ...prevValues,
                                material: material
                              }));
                              // Clear material error when a material is selected
                              setErrors(prevErrors => {
                                const newErrors = { ...prevErrors };
                                delete newErrors.material;
                                return newErrors;
                              });
                              setMaterialSearchTerm("");
                              setShowMaterialDropdown(false);
                            }}
                          >
                            <div style={{
                              flex: 1,
                              fontSize: "14px",
                              paddingLeft: "10px"
                            }}>
                              {material}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>


              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Quantity (MT) <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="text"
                    placeholder="Add Quantity"
                    name="quantity"
                    value={values.quantity}
                    onChange={handleInputChange}

                    className="bulk-order-input"
                    style={{
                      color: "#000",
                      border: `1px solid ${errors.quantity ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px",
                      outline: "none"
                    }}
                  />
                  {errors.quantity && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.quantity}
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Extension Quantity (MT) <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="text"
                    placeholder="Add Quantity"
                    name="extensionQuantity"
                    value={values.extensionQuantity}
                    onChange={handleInputChange}

                    className="bulk-order-input"
                    style={{
                      color: "#000",
                      border: `1px solid ${errors.extensionQuantity ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px",
                      outline: "none"
                    }}
                  />
                  {errors.extensionQuantity && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.extensionQuantity}
                    </div>
                  )}
                </div>
              </div>

 <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Display To Transporter <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="displayToTransporter"
                    value={values.displayToTransporter}
                    onChange={handleInputChange}

                    className="bulk-order-select"
                    style={{
                      color: "#000",
                      border: `1px solid ${errors.displayToTransporter ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px",
                      outline: "none"
                    }}
                  >
                    {displayToTransporterOptions.map((option, index) => (
                      <option
                        key={index}
                        value={option}
                        style={{ color: "#000" }}
                      >
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.displayToTransporter && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.displayToTransporter}
                    </div>
                  )}
                </div>
              </div>


            </div>

            {/* Second row: 2 fields */}
            <div className="bulk-order-row">
             
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Select Transporter <span style={{ color: "red" }}>*</span>
                </Label>
                <div className="form-group-with-viewer">
                  <div className="input-container" style={{ position: "relative" }}>
                    <div
                      className="bulk-order-transporter-selector"
                      onClick={() => setShowTransporterDropdown(!showTransporterDropdown)}
                      style={{
                        minHeight: "38px",
                        width: "100%",
                        color: values.selectTransporter.length > 0 ? "#000" : "#667085",
                        display: "flex",
                        alignItems: "center",
                        border: errors.selectTransporter ? "2px solid #dc3545" : "1px solid #ced4da",
                        borderRadius: "4px",
                        padding: "0.375rem 0.75rem",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        justifyContent: "space-between",
                        outline: "none",
                        transition: "border-color 0.15s ease-in-out"
                      }}
                    >
                      <span style={{ flex: 1 }}>
                        {values.selectTransporter.length > 0
                          ? `${values.selectTransporter.length} Selected`
                          : "Select"}
                      </span>
                      <i className="ri-arrow-down-s-line" style={{ fontSize: "20px", color: "#667085", marginLeft: "8px" }}></i>
                    </div>
                    {errors.selectTransporter && (
                      <div style={{
                        color: "#dc3545",
                        fontSize: "12px",
                        marginTop: "4px",
                        fontWeight: "500",
                        position: "absolute",
                        width: "100%"
                      }}>
                        {errors.selectTransporter}
                      </div>
                    )}
                    {showTransporterDropdown && (
                      <div className="bulk-order-dropdown" style={{
                        position: "absolute",
                        width: "20.8vw",
                        zIndex: 1000,
                        marginTop: "4px",
                        backgroundColor: "#fff",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        maxHeight: "300px",
                        overflowY: "auto"
                      }}>
                        {/* Updated header with proper structure matching SOBasedOrder */}
                        <div className="bulk-order-dropdown-header" style={{
                          padding: "8px",
                          backgroundColor: "#405189",
                          borderBottom: "1px solid #ddd",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "default"
                        }}>
                          <div className="dropdown-controls" style={{
                            display: "flex",
                            alignItems: "center"
                          }}>
                            <div className="checkbox-container" style={{
                              flex: "0 0 40px",
                              display: "flex",
                              justifyContent: "center",
                              marginRight: "10px"
                            }}>
                              <input
                                type="checkbox"
                                checked={areAllFilteredTransportersSelected()}
                                onChange={handleSelectAllTransporters}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  cursor: "pointer",
                                  accentColor: "#fff"
                                }}
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Search"
                              value={searchTerm}
                              onChange={handleTransporterSearch}
                              onClick={(e) => e.stopPropagation()}
                              className="bulk-order-dropdown-search"
                              style={{
                                flex: 1,
                                padding: "8px 12px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                color: "#000",
                                fontSize: "14px",
                                backgroundColor: "#fff"
                              }}
                            />
                          </div>
                        </div>

                        <div className="bulk-order-dropdown-content">
                          {loadingTransporters ? (
                            <div className="so-sales-orders-loading">
                              <i className="ri-loader-4-line spin"></i>
                              <span className="loading-text">Loading transporters...</span>
                            </div>
                          ) : !filteredTransporters || filteredTransporters.length === 0 ? (
                            <div className="so-sales-orders-empty">
                              <i className="ri-inbox-line"></i>
                              <span className="empty-text">
                                {searchTerm ? 'No transporters found matching your search' : 'No transporters found'}
                              </span>
                            </div>
                          ) : (
                            filteredTransporters.map((transporter, index) => {
                              if (!transporter || !transporter.id) {
                                return null;
                              }

                              return (
                                <div
                                  key={`${transporter.id}-${index}`}
                                  className="bulk-order-dropdown-item"
                               //   onClick={() => handleTransporterSelect(transporter)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                    transition: "background-color 0.2s"
                                  }}
                                >
                                  <div className="checkbox-container" style={{
                                    flex: "0 0 40px",
                                    display: "flex",
                                    justifyContent: "center",
                                    marginRight: "10px"
                                  }}>
                                    <input
                                      type="checkbox"
                                      checked={values.selectTransporter.some(t => t.id === transporter.id)}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        if (e.target.checked) {
                                          handleTransporterSelect(transporter);
                                        } else {
                                          handleRemoveTransporter(transporter.id);
                                        }
                                      }}
                                      style={{
                                        width: "16px",
                                        height: "16px",
                                        accentColor: "#405189"
                                      }}
                                    />
                                  </div>
                                  <div className="transporter-id" style={{
                                    flex: "0 0 120px",
                                    paddingRight: "15px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontSize: "14px",
                                    color: "#667085"
                                  }}>
                                    {transporter.id || 'N/A'}
                                  </div>
                                  <div className="transporter-name" style={{
                                    flex: 1,
                                    fontSize: "14px",
                                    color: "#101828"
                                  }}>
                                    {transporter.name || 'N/A'}
                                  </div>
                                </div>
                              );
                            }).filter(Boolean)
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ADD THIS: TransporterViewer component - same as SOBasedOrder */}
                  {values.selectTransporter.length > 0 && (
                    <TransporterViewer
                      selectedTransporters={values.selectTransporter}
                      onRemove={(transporterId) => {
                        handleRemoveTransporter(transporterId, new Event('click'));
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="bulk-order-button-container">
              <button
                type="button"
                className="bulk-order-button bulk-order-back-button"
                onClick={handleBackPage}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="bulk-order-button bulk-order-next-button"
                style={{
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 20px"
                }}
              >
                Save & Next <i className="ri-arrow-right-line ms-1" style={{ marginLeft: "8px" }}></i>
              </button>
            </div>
          </div>
        )}

        {/* Delivery and Allocation Step */}
        {activeStep === 2 && (
          <div className="bulk-order-container">
            {/* First row: 4 fields */}
           

            {/* First row: 4 fields - UPDATED */}
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  From Location <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }} className="from-location-dropdown-container">
                  <div
                    className="bulk-order-location-selector"
                    onClick={() => setShowFromLocationDropdown(!showFromLocationDropdown)}
                    style={{
                      height: "42px",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      border: `2px solid ${errors.fromLocation ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px",
                      padding: "0.375rem 0.75rem",
                      backgroundColor: "#fff",
                    }}
                  >
                    <span className="bulk-order-location-selector-placeholder" style={{ color: "#000" }}>
                      {values.fromLocation || 'Select'}
                    </span>
                    <span style={{ marginLeft: "auto" }}>
                      <i className="ri-arrow-down-s-line" style={{ fontSize: "18px", color: "black" }}></i>
                    </span>
                  </div>
                  {errors.fromLocation && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.fromLocation}
                    </div>
                  )}
                  
                  {/* From Location dropdown with search functionality */}
                  {showFromLocationDropdown && (
                    <div className="bulk-order-dropdown" style={{
                      position: "absolute",
                      width: "100%",
                      zIndex: 10,
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      marginTop: "4px",
                      maxHeight: "300px",
                      overflowY: "auto"
                    }}>
                      {/* Search header */}
                      <div className="bulk-order-dropdown-header" style={{
                        padding: "8px",
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #ddd"
                      }}>
                        <input
                          type="text"
                          placeholder="Search"
                          value={fromLocationSearchTerm}
                          onChange={(e) => setFromLocationSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bulk-order-dropdown-search"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            color: "#000",
                            fontSize: "14px"
                          }}
                        />
                      </div>

                      {/* Loading indicator */}
                      {loadingCities && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#4361ee"
                        }}>
                          <i className="ri-loader-4-line spin" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>Loading locations...</div>
                        </div>
                      )}

                      {/* Empty state */}
                      {!loadingCities && filteredFromLocations.length === 0 && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#666"
                        }}>
                          <i className="ri-inbox-line" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>No locations found</div>
                        </div>
                      )}

                      {/* From Location list items */}
                      {!loadingCities && filteredFromLocations.length > 0 && (
                        <div className="bulk-order-dropdown-content">
                          {filteredFromLocations.map((location, index) => (
                            <div
                              key={index}
                              className="bulk-order-dropdown-item"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "10px 8px",
                                borderBottom: "1px solid #eee",
                                color: "#000",
                                cursor: "pointer"
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setValues(prevValues => ({
                                  ...prevValues,
                                  fromLocation: location
                                }));
                                setFromLocationSearchTerm("");
                                setShowFromLocationDropdown(false);
                                // Clear error if it exists
                                if (errors.fromLocation) {
                                  setErrors(prevErrors => {
                                    const newErrors = { ...prevErrors };
                                    delete newErrors.fromLocation;
                                    return newErrors;
                                  });
                                }
                                // Update transporters if Plant Based is selected
                                if (values.displayToTransporter === 'Plant Based') {
                                  fetchTransportersByFlag('P', location);
                                }
                              }}
                            >
                              <div style={{
                                flex: 1,
                                fontSize: "14px",
                                paddingLeft: "10px"
                              }}>
                                {location}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  To Location <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }} className="to-location-dropdown-container">
                  <div
                    className="bulk-order-location-selector"
                    onClick={() => setShowToLocationDropdown(!showToLocationDropdown)}
                    style={{
                      height: "42px",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      border: `2px solid ${errors.toLocation ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px",
                      padding: "0.375rem 0.75rem",
                      backgroundColor: "#fff",
                    }}
                  >
                    <span className="bulk-order-location-selector-placeholder" style={{ color: "#000" }}>
                      {values.toLocation || 'Select'}
                    </span>
                    <span style={{ marginLeft: "auto" }}>
                      <i className="ri-arrow-down-s-line" style={{ fontSize: "18px", color: "black" }}></i>
                    </span>
                  </div>
                  {errors.toLocation && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.toLocation}
                    </div>
                  )}
                  
                  {/* To Location dropdown with search functionality */}
                  {showToLocationDropdown && (
                    <div className="bulk-order-dropdown" style={{
                      position: "absolute",
                      width: "100%",
                      zIndex: 10,
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      marginTop: "4px",
                      maxHeight: "300px",
                      overflowY: "auto"
                    }}>
                      {/* Search header */}
                      <div className="bulk-order-dropdown-header" style={{
                        padding: "8px",
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #ddd"
                      }}>
                        <input
                          type="text"
                          placeholder="Search"
                          value={toLocationSearchTerm}
                          onChange={(e) => setToLocationSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bulk-order-dropdown-search"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            color: "#000",
                            fontSize: "14px"
                          }}
                        />
                      </div>

                      {/* Loading indicator */}
                      {loadingCities && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#4361ee"
                        }}>
                          <i className="ri-loader-4-line spin" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>Loading locations...</div>
                        </div>
                      )}

                      {/* Empty state */}
                      {!loadingCities && filteredToLocations.length === 0 && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#666"
                        }}>
                          <i className="ri-inbox-line" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>No locations found</div>
                        </div>
                      )}

                      {/* To Location list items */}
                      {!loadingCities && filteredToLocations.length > 0 && (
                        <div className="bulk-order-dropdown-content">
                          {filteredToLocations.map((location, index) => (
                            <div
                              key={index}
                              className="bulk-order-dropdown-item"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "10px 8px",
                                borderBottom: "1px solid #eee",
                                color: "#000",
                                cursor: "pointer"
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setValues(prevValues => ({
                                  ...prevValues,
                                  toLocation: location
                                }));
                                setToLocationSearchTerm("");
                                setShowToLocationDropdown(false);
                                // Clear error if it exists
                                if (errors.toLocation) {
                                  setErrors(prevErrors => {
                                    const newErrors = { ...prevErrors };
                                    delete newErrors.toLocation;
                                    return newErrors;
                                  });
                                }
                              }}
                            >
                              <div style={{
                                flex: 1,
                                fontSize: "14px",
                                paddingLeft: "10px"
                              }}>
                                {location}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group route-dropdown-container">
                <Label className="bulk-order-label">
                  Route <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <div
                    className="bulk-order-route-selector"
                    onClick={() => setShowRouteDropdown(!showRouteDropdown)}
                    style={{
                      height: "42px",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      border: `2px solid ${errors.route ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px",
                      padding: "0.375rem 0.75rem",
                      backgroundColor: "#fff",
                    }}
                  >
                    <span className="bulk-order-route-selector-placeholder" style={{ color: "#000" }}>
                      {values.route || 'Select'}
                    </span>
                    <span style={{ marginLeft: "auto" }}>
                      <i className="ri-arrow-down-s-line" style={{ fontSize: "18px", color: "black" }}></i>
                    </span>
                  </div>
                  {errors.route && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.route}
                    </div>
                  )}
                  
                  {/* Route dropdown with search functionality */}
                  {showRouteDropdown && (
                    <div className="bulk-order-dropdown" style={{
                      position: "absolute",
                      width: "100%",
                      zIndex: 10,
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      marginTop: "4px",
                      maxHeight: "300px",
                      overflowY: "auto"
                    }}>
                      {/* Search header */}
                      <div className="bulk-order-dropdown-header" style={{
                        padding: "8px",
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #ddd"
                      }}>
                        <input
                          type="text"
                          placeholder="Search"
                          value={routeSearchTerm}
                          onChange={(e) => setRouteSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bulk-order-dropdown-search"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            color: "#000",
                            fontSize: "14px"
                          }}
                        />
                      </div>

                      {/* Loading indicator */}
                      {loadingRoutes && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#4361ee"
                        }}>
                          <i className="ri-loader-4-line spin" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>Loading routes...</div>
                        </div>
                      )}

                      {/* Empty state */}
                      {!loadingRoutes && filteredRoutes.length === 0 && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#666"
                        }}>
                          <i className="ri-inbox-line" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>No routes found</div>
                        </div>
                      )}

                      {/* Route list items */}
                      {!loadingRoutes && filteredRoutes.length > 0 && (
                        <div className="bulk-order-dropdown-content">
                          {filteredRoutes.map((route, index) => (
                            <div
                              key={index}
                              className="bulk-order-dropdown-item"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "10px 8px",
                                borderBottom: "1px solid #eee",
                                color: "#000",
                                cursor: "pointer"
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (route !== 'Select') {
                                  setValues(prevValues => ({
                                    ...prevValues,
                                    route: route
                                  }));
                                  // Clear error if it exists
                                  if (errors.route) {
                                    setErrors(prevErrors => {
                                      const newErrors = { ...prevErrors };
                                      delete newErrors.route;
                                      return newErrors;
                                    });
                                  }
                                }
                                setRouteSearchTerm("");
                                setShowRouteDropdown(false);

                                // Update transporters if Route Based is selected
                                if (values.displayToTransporter === 'Route Based') {
                                  fetchTransportersByFlag('R', route);
                                }
                              }}
                            >
                              <div style={{
                                flex: 1,
                                fontSize: "14px",
                                paddingLeft: "10px"
                              }}>
                                {route}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* AUTO ALLOCATE FIELD - MOVED TO FOURTH POSITION */}
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Auto Allocate To L1
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="autoAllocateTo"
                    value={values.autoAllocateTo}
                    onChange={handleInputChange}
                    className="bulk-order-select"
                    style={{ color: "#000" }}
                  >
                    {autoAllocateToOptions.map((option, index) => (
                      <option key={index} value={option} style={{ color: "#000" }}>
                        {option}
                      </option>
                    ))}
                  </Input>
                </div>
              </div>
            </div>
            {/* Second row: 3 fields with TIME inputs - with BLACK placeholder text */}
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Interval time for Allocating Vehicle <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="time"
                    placeholder="--:--:--"
                    name="intervalTimeForAllocatingVehicle"
                    value={values.intervalTimeForAllocatingVehicle}
                    onChange={handleInputChange}
                   
                    className="bulk-order-input black-placeholder"
                    style={{
                      color: "#000",
                      border: `1px solid ${errors.intervalTimeForAllocatingVehicle ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px"
                    }}
                  />
                  {errors.intervalTimeForAllocatingVehicle && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.intervalTimeForAllocatingVehicle}
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Interval time for to reach plant <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="time"
                    placeholder="--:--:--"
                    name="intervalTimeToReachPlant"
                    value={values.intervalTimeToReachPlant}
                    onChange={handleInputChange}
                   
                    className="bulk-order-input black-placeholder"
                    style={{
                      color: "#000",
                      border: `1px solid ${errors.intervalTimeToReachPlant ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px"
                    }}
                  />
                  {errors.intervalTimeToReachPlant && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.intervalTimeToReachPlant}
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Grace Period to reach plant <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="time"
                    placeholder="--:--:--"
                    name="gracePeriodToReachPlant"
                    value={values.gracePeriodToReachPlant}
                    onChange={handleInputChange}
                  
                    className="bulk-order-input black-placeholder"
                    style={{
                      color: "#000",
                      border: `1px solid ${errors.gracePeriodToReachPlant ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px"
                    }}
                  />
                  {errors.gracePeriodToReachPlant && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.gracePeriodToReachPlant}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bulk-order-button-container">
              <button
                type="button"
                className="bulk-order-button bulk-order-back-button"
                onClick={handleBackPage}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="bulk-order-button bulk-order-next-button"
              >
                Save & Next <i className="ri-arrow-right-line ms-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* Preview Step (not in stepper but comes after Delivery and Allocation) */}
        {activeStep === 3 && (
          <div className="bulk-order-container">
            {/* Bid Details Section */}
            <div className="bulk-order-section-title">Bid Details</div>
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Bid Starting From</Label>
                <div className="bulk-order-value-text">{values.bidStartingFrom || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Bid Start To</Label>
                <div className="bulk-order-value-text">{values.bidStartTo || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">City</Label>
                <div className="bulk-order-value-text">{values.city || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Ceiling Amount</Label>
                <div className="bulk-order-value-text">{values.ceilingAmount || "—"}</div>
              </div>
            </div>
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Interval Amount</Label>
                <div className="bulk-order-value-text">{values.intervalAmount || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">UOM</Label>
                <div className="bulk-order-value-text">{values.uom || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Last Minutes Extension</Label>
                <div className="bulk-order-value-text">{values.lastMinutesExtension || "—"}</div>
              </div>
            </div>

            {/* Material and Transporter Section */}
            <div className="bulk-order-section-title">Material and Transporter</div>
            <div className="bulk-order-row">
             
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Material</Label>
                <div className="bulk-order-value-text">{values.material || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Quantity</Label>
                <div className="bulk-order-value-text">{values.quantity || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Extension Quantity</Label>
                <div className="bulk-order-value-text">{values.extensionQuantity || "—"}</div>
              </div>
            </div>
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Display To Transporter</Label>
                <div className="bulk-order-value-text">{values.displayToTransporter || "—"}</div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Select Transporter</Label>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: "8px",
                  paddingBottom: "8px"
                }}>
                  <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "8px",
                    color: "#000"
                  }}>
                    {values.selectTransporter.length > 0 ? (
                      (() => {
                        // Get unique transporters by ID
                        const uniqueTransporters = [...new Map(
                          values.selectTransporter.map(item => [item.id, item])
                        ).values()];

                        // Display just the first few transporters
                        const displayTransporters = uniqueTransporters.slice(0, 2);
                        const remaining = uniqueTransporters.length - displayTransporters.length;

                        return (
                          <>
                            {displayTransporters.map((t, i) => (
                              <span
                                key={i}
                                title={t.name}
                                style={{
                                  backgroundColor: "#405189",
                                  color: "white",
                                  padding: "5px 12px",
                                  borderRadius: "4px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  display: "inline-block"
                                }}
                              >
                                {t.name}
                              </span>
                            ))}

                            {/* Show ellipsis for additional transporters */}
                            {remaining > 0 && (
                              <span
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                  marginLeft: "4px"
                                }}
                              >
                                ...
                              </span>
                            )}
                          </>
                        );
                      })()
                    ) : (
                      "—"
                    )}
                  </div>

                  {/* View Icon */}
                  {values.selectTransporter.length > 0 && (
                    <span
                      onClick={() => setShowTransporterModal(true)}
                      style={{
                        cursor: "pointer",
                        width: "28px",
                        height: "28px",
                        minWidth: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        backgroundColor: "#f8f9fa",
                        marginLeft: "10px"
                      }}
                    >
                      <i className="ri-eye-line" style={{ fontSize: "16px", color: "#4361ee" }}></i>
                    </span>
                  )}
                </div>
              </div>
              {/* Add Modal component that will be shown when viewing transporters from preview */}
            


{showTransporterModal && (
  <div className="bulk-order-modal-overlay" style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  }}>
    <div className="bulk-order-modal-content2" style={{
      backgroundColor: "white",
      borderRadius: "8px",
      width: "90%",
      maxWidth: "800px", // Increased width for more columns
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      maxHeight: "80vh",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Modal Header */}
      <div className="bulk-order-modal-header" style={{
        padding: "16px 20px",
        backgroundColor: "white",
        borderBottom: "1px solid #e9ecef",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "8px 8px 0 0"
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: "18px", 
          fontWeight: "600",
          color: "#333"
        }}>
          Transporter Details
        </h3>
        <button
          onClick={() => setShowTransporterModal(false)}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#666",
            padding: "4px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <i className="ri-close-line"></i>
        </button>
      </div>

      {/* Modal Body */}
      <div className="bulk-order-modal-body3" style={{ 
        padding: "0", 
        flex: 1,
        overflowY: "auto"
      }}>
        {/* Table Header */}
        <div style={{
          display: "flex",
          backgroundColor: "#405189", // Blue header background
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 1
        }}>
          <div style={{
            flex: "0 0 150px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "600",
            borderRight: "1px solid rgba(255,255,255,0.2)"
          }}>
            Transporter Code
          </div>
          <div style={{
            flex: "1",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "600",
            borderRight: "1px solid rgba(255,255,255,0.2)"
          }}>
            Transporter Name
          </div>
          <div style={{
            flex: "0 0 180px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "600",
            borderRight: "1px solid rgba(255,255,255,0.2)"
          }}>
            Contact Person
          </div>
          <div style={{
            flex: "0 0 140px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "600"
          }}>
            Phone No.
          </div>
        </div>

        {/* Table Body */}
        <div className="bulk-order-modal-table-body">
          {[...new Map(values.selectTransporter.map(item => [item.id, item])).values()].map((transporter, index) => (
            <div 
              key={index}
              style={{
                display: "flex",
                borderBottom: "1px solid #e9ecef",
                backgroundColor: "#fff"
              }}
            >
              {/* Transporter Code */}
              <div style={{
                flex: "0 0 150px",
                padding: "12px 16px",
                fontSize: "14px",
                color: "#495057",
                borderRight: "1px solid #e9ecef",
                display: "flex",
                alignItems: "center",
                fontFamily: "monospace",
                fontWeight: "500"
              }}>
                {transporter.code || transporter.id || 'N/A'}
              </div>
              
              {/* Transporter Name */}
              <div style={{
                flex: "1",
                padding: "12px 16px",
                fontSize: "14px",
                color: "#212529",
                borderRight: "1px solid #e9ecef",
                display: "flex",
                alignItems: "center",
                fontWeight: "500"
              }}>
                {transporter.name || 'N/A'}
              </div>
              
              {/* Contact Person */}
              <div style={{
                flex: "0 0 180px",
                padding: "12px 16px",
                fontSize: "14px",
                color: "#495057",
                borderRight: "1px solid #e9ecef",
                display: "flex",
                alignItems: "center"
              }}>
                {transporter.contactPerson || 'N/A'}
              </div>
              
              {/* Phone No */}
              <div style={{
                flex: "0 0 140px",
                padding: "12px 16px",
                fontSize: "14px",
                color: "#495057",
                display: "flex",
                alignItems: "center",
                fontFamily: "monospace"
              }}>
                {transporter.contactNumber || 'N/A'}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {values.selectTransporter.length === 0 && (
          <div style={{
            padding: "40px 20px",
            textAlign: "center",
            color: "#6c757d"
          }}>
            <i className="ri-inbox-line" style={{ fontSize: "48px", marginBottom: "16px" }}></i>
            <div style={{ fontSize: "16px" }}>No transporters selected</div>
          </div>
        )}
      </div>

      {/* Modal Footer with Pagination */}
      <div className="bulk-order-modal-footer" style={{
        padding: "16px 20px",
        borderTop: "1px solid #e9ecef",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        borderRadius: "0 0 8px 8px"
      }}>
        {/* Total Results */}
        <div style={{
          fontSize: "14px",
          color: "#6c757d"
        }}>
          Total Results: {[...new Map(values.selectTransporter.map(item => [item.id, item])).values()].length}
        </div>

        {/* Pagination Controls */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          {/* Previous Button */}
          <button
            style={{
              padding: "6px 8px",
              border: "1px solid #dee2e6",
              backgroundColor: "#fff",
              color: "#6c757d",
              cursor: "not-allowed",
              borderRadius: "4px",
              fontSize: "14px"
            }}
            disabled
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>

          {/* Page Info */}
          <span style={{
            fontSize: "14px",
            color: "#495057",
            margin: "0 8px"
          }}>
            Page 1 of 1
          </span>

          {/* Page Number Input */}
          <input
            type="text"
            value="1"
            readOnly
            style={{
              width: "40px",
              padding: "4px 8px",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              textAlign: "center",
              fontSize: "14px"
            }}
          />

          {/* Next Button */}
          <button
            style={{
              padding: "6px 8px",
              border: "1px solid #dee2e6",
              backgroundColor: "#fff",
              color: "#6c757d",
              cursor: "not-allowed",
              borderRadius: "4px",
              fontSize: "14px"
            }}
            disabled
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => setShowTransporterModal(false)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
            </div>

            {/* Delivery and Allocation Section */}
            <div className="bulk-order-section-title">Delivery and Allocation</div>
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">From Location</Label>
                <div className="bulk-order-value-text">{values.fromLocation || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">To Location</Label>
                <div className="bulk-order-value-text">{values.toLocation || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Route</Label>
                <div className="bulk-order-value-text">{values.route || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Auto Allocate To L1</Label>
                <div className="bulk-order-value-text">{values.autoAllocateTo || "—"}</div>
              </div>
            </div>
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Interval time for Allocating Vehicle</Label>
                <div className="bulk-order-value-text">{values.intervalTimeForAllocatingVehicle || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Interval time to reach plant</Label>
                <div className="bulk-order-value-text">{values.intervalTimeToReachPlant || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Grace Period to reach plant</Label>
                <div className="bulk-order-value-text">{values.gracePeriodToReachPlant || "—"}</div>
              </div>
            </div>

            <div className="bulk-order-button-container">
              <button type="button"
                className="bulk-order-button bulk-order-back-button"
                onClick={handleBackPage}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="bulk-order-button bulk-order-submit-button"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? (
                  <span>
                    <i className="ri-loader-4-line spin me-1"></i> Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Finish Step - This is shown in the stepper as step 4 */}
        {activeStep === 4 && (
          <div className="bulk-order-finish-container">

            <button
              type="button"
              className="bulk-order-finish-button"
              onClick={handleBackToCreateBid}
            >
              Back to Create Bid
            </button>
          </div>
        )}
      </Form>
      <ToastContainer closeButton={false} limit={1}
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{ backgroundColor: "white" }} />
      {/* Show success modal */}
      {showSuccessModal && <SuccessModal />}
    </>
  );
};

export default BulkOrder;   
