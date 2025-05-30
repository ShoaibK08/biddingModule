import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Form, Input, Label } from "reactstrap";
import { Stepper, Step, StepLabel, StepConnector } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import './SOBasedOrder.css'; // Make sure to create this CSS file
import TransporterViewer from "./TransporterViewer/TransporterViewer";// Import the TransporterViewer component
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

// Alternative CustomStepIcon with forced inline styles
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

const SOBasedOrder = ({ bidNo }) => {
  // State declarations first
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showTransporterDropdown, setShowTransporterDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectAllTransporters, setSelectAllTransporters] = useState(false);
  const [showTransporterModal, setShowTransporterModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [loadingSalesOrders, setLoadingSalesOrders] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [biddingOrderNo, setBiddingOrderNo] = useState("");
  const [salesOrdersError, setSalesOrdersError] = useState(null);
  const [transporterSearchTerm, setTransporterSearchTerm] = useState("");
  const [loadingTransporters, setLoadingTransporters] = useState(false);
  const [totalSalesOrders, setTotalSalesOrders] = useState(0);

  // Constants
  const ordersPerPage = 10; // Number of orders to display per page

  // Helper function to get selected order details
  const getSelectedOrderDetails = (orderNo) => {
    const orderDetails = salesOrders.find(order => order.orderNo === orderNo);
    if (!orderDetails) return null;

    return {
      orderNo: orderDetails.orderNo,
      quantity: orderDetails.quantity,
      material: orderDetails.material,
      validity: orderDetails.validity,
      originalData: orderDetails
    };
  };

  // Add states for transporter selection
  const [transporterOptions, setTransporterOptions] = useState([
    { id: "0916005637", name: "Jaya Roadways" },
    { id: "0916003431", name: "R & B Transport" },
    { id: "0916006094", name: "RAJ ENTERPRISE" },
    { id: "0916005708", name: "Jaya Transport Services" },
    { id: "0916005858", name: "Laxmi Roadways" }
  ]);

  const [values, setValues] = useState({
    // SO Details
    bidStartingFrom: "",
    bidStartTo: "",
    ceilingAmount: "",
    intervalAmount: "",
    uom: "",
    lastMinutesExtension: "",

    // Material and Transporter
    extensionQuantity: "",
    displayToTransporter: "",
    selectTransporter: [], // Changed to array for multiple selection

    // Delivery and Allocation
    autoAllocateTo: "",
    intervalTimeForAllocatingVehicle: "",
    intervalTimeToReachPlant: "",
    gracePeriodToReachPlant: ""
  });

  // Helper function for authentication headers
  const getAuthHeaders = () => {
    const username = 'Amazin';
    const password = 'TE@M-W@RK';
    const base64Auth = btoa(`${username}:${password}`);

    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${base64Auth}`,
      'Accept': 'application/json'
    };
  };

  // Add debounced search for better performance
  const debouncedTransporterSearch = useMemo(
    () => {
      const timeoutId = setTimeout(() => {
        // This will trigger the filteredTransporters recalculation
      }, 300);
      return () => clearTimeout(timeoutId);
    },
    [transporterSearchTerm]
  );

  // NEW: Function to fetch sales orders from API
  const fetchSalesOrders = async () => {
    setLoadingSalesOrders(true);
    setSalesOrdersError(null);

    try {
      // Get authentication data from session
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let plantCode = obj?.data?.plantCode || '';

      // Create API URL with optional filters
      //  const apiUrl = `${process.env.REACT_APP_LOCAL_URL_8082}/salesorder_allocation?plant=${plantCode}&page=${currentPage}&limit=${ordersPerPage}&search=${searchTerm}`;
      //  const apiUrl = `${process.env.REACT_APP_LOCAL_URL_8082}/salesorder_allocation?plant=${plantCode}&page=${currentPage}&limit=${ordersPerPage}&search=${searchTerm}`;
      const apiUrl = `http://10.6.0.5:8081/salesorder_allocation?plant=${plantCode}&page=${currentPage}&limit=${ordersPerPage}&search=${searchTerm}`;
      console.log("Fetching sales orders from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Sales orders API response:", result);

      if (result && result.data && Array.isArray(result.data)) {
        // Map API response to the format expected by the component
        const mappedOrders = result.data.map(order => {
          // Format creation date if available
          let formattedDate = "N/A";
          if (order.creationDate && Array.isArray(order.creationDate) && order.creationDate.length === 3) {
            const [year, month, day] = order.creationDate;
            formattedDate = `${day}${getMonthAbbreviation(month)}`;
          }

          return {
            orderNo: order.orderNumber || order.salesDocNumber,
            validity: formattedDate,
            material: order.materialDesc || order.materialCode,
            quantity: `${order.orderQuantity || "0"} ${order.incoTerms || ""}`,
            status: order.soStatus,
            // Store the original data for later use
            originalData: order
          };
        });

        // Update state with mapped orders
        setSalesOrders(mappedOrders);
        setTotalSalesOrders(result.meta?.total || mappedOrders.length);
        setTotalPages(Math.ceil((result.meta?.total || mappedOrders.length) / ordersPerPage));

        // Log success
        console.log("Mapped sales orders:", mappedOrders);
      } else {
        // Handle empty or invalid response
        setSalesOrders([]);
        toast.info("No sales orders found", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      setSalesOrdersError(error.message);
      toast.error(`Failed to fetch sales orders: ${error.message}`, { autoClose: 3000 });
    } finally {
      setLoadingSalesOrders(false);
    }
  };

  // Helper function to get month abbreviation
  const getMonthAbbreviation = (monthNumber) => {
    const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthAbbreviations[monthNumber - 1] || '';
  };

  // Function to fetch transporters
  const fetchTransporters = async () => {
    setLoadingTransporters(true);
    try {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let plantCode = obj.data.plantCode;

      const apiUrl = `${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/allTransportersByFlag?flag=A&filterParam=${plantCode}`;


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

      // Check if result has the expected structure with data array
      if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
        // Map the API response fields
        const mappedTransporters = result.data.map(transporter => ({
          id: transporter.code,
          code: transporter.code,
          name: transporter.name.trim(),
          contactPerson: transporter.contactPerson,
          contactNumber: transporter.contactNumber,
          contactEmail: transporter.contactEmail,
          // Store the complete data for reference
          fullData: transporter
        }));

        console.log("Mapped transporters:", mappedTransporters);

        // Update the state
        setTransporterOptions(mappedTransporters);


      } else {
        toast.info("No transporters found", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error fetching transporters:", error);
      toast.error(`Failed to fetch transporters: ${error.message}`, { autoClose: 3000 });
    } finally {
      setLoadingTransporters(false);
    }
  };

  // Updated handleInputChange to also fetch transporters
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'extensionQuantity' && value.length > 20) {
      return; // Don't allow input longer than 20 digits
    }
    if (name === 'ceilingAmount' && value.length > 10) {
      return;
    }
    if (name === 'intervalAmount' && value.length > 10) {
      return;
    }

    // Update the value first
    setValues(prevValues => ({
      ...prevValues,
      [name]: value === 'Select' ? '' : value
    }));

    // Clear the error for this field if it exists
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
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

    // Handle special case for Display To Transporter dropdown
    if (name === 'displayToTransporter') {
      // Reset selected transporters when changing display mode
      setValues(prevValues => ({
        ...prevValues,
        selectTransporter: []
      }));

      if (value === 'All') {
        fetchTransporters();
      }
    }
  };

  const handleBackPage = () => {
    // Navigate to previous step
    setActiveStep(prevStep => Math.max(prevStep - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with values:", values);
    console.log("Selected Sales Orders:", selectedOrders);

    // Initialize validation errors object
    const validationErrors = {};

    // Step 0 validation
    if (activeStep === 0) {
      if (!values.bidStartingFrom) {
        validationErrors.bidStartingFrom = "Please select bid starting date";
      }

      if (!values.bidStartTo) {
        validationErrors.bidStartTo = "Please select bid end date";
      }

      if (!values.lastMinutesExtension) {
        validationErrors.lastMinutesExtension = "Please enter last minutes extension";
      }

      // Add date comparison validation
      if (values.bidStartingFrom && values.bidStartTo) {
        const startDate = new Date(values.bidStartingFrom);
        const endDate = new Date(values.bidStartTo);

        if (endDate <= startDate) {
          validationErrors.bidStartTo = "Bid Start To must be greater than Bid Starting From";
        }
      }

      if (!values.intervalAmount || values.intervalAmount.trim() === "") {
        validationErrors.intervalAmount = "Please enter interval amount";
      } else if (isNaN(values.intervalAmount) || parseFloat(values.intervalAmount) <= 0) {
        validationErrors.intervalAmount = "Please enter a valid interval amount greater than 0";
      }

      if (!values.uom || values.uom === "Select") {
        validationErrors.uom = "Please select UOM";
      }

      if (values.ceilingAmount && (isNaN(values.ceilingAmount) || parseFloat(values.ceilingAmount) <= 0)) {
        validationErrors.ceilingAmount = "Please enter a valid ceiling amount greater than 0";
      }
    }

    // Step 1 validation (Material and Transporter)
    else if (activeStep === 1) {
      if (!values.extensionQuantity || values.extensionQuantity.trim() === "") {
        validationErrors.extensionQuantity = "Please enter extension quantity";
      } else if (isNaN(values.extensionQuantity) || parseFloat(values.extensionQuantity) <= 0) {
        validationErrors.extensionQuantity = "Please enter a valid extension quantity greater than 0";
      }

      if (!values.displayToTransporter || values.displayToTransporter === "Select") {
        validationErrors.displayToTransporter = "Please select display option";
      }

      if (!values.selectTransporter || values.selectTransporter.length === 0) {
        validationErrors.selectTransporter = "Please select at least one transporter";
      }
    }

    // Step 2 validation (Delivery and Allocation)
    else if (activeStep === 2) {
      if (!values.autoAllocateTo || values.autoAllocateTo === "Select") {
        validationErrors.autoAllocateTo = "Please select auto allocate option";
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
    }

    // Update the errors state
    setErrors(validationErrors);

    // If there are validation errors, don't proceed
    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation errors:", validationErrors);
      return;
    }

    // If validation passes
    if (activeStep === 2) {
      // Go to Preview (which is not in the stepper)
      setActiveStep(3);
    } else if (activeStep === 3) {
      // If we're at Preview, submit to API
      setIsSubmitting(true);

      try {
        // Format dates for API with correct formats for each field
        const formatDateForAPI = (dateString) => {
          if (!dateString) return null;
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');

          return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };

        const formatDateOnlyForAPI = (dateString) => {
          if (!dateString) return null;
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const formatValidityDateForAPI = (dateString) => {
          if (!dateString) return null;
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');

          return `${day}-${month}-${year} ${hours}:${minutes}`;
        };

        // Convert time to minutes for API
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

        // Get unique transporters (remove duplicates by ID)
        const uniqueTransporters = [...new Map(
          values.selectTransporter.map(item => [item.id, item])
        ).values()];

        // Find selected order details from the salesOrders array
        const getSelectedOrderDetails = (orderNo) => {
          return salesOrders.find(order => order.orderNo === orderNo);
        };

        // Create a bid objects array for all selected transporters
        const biddingObjects = uniqueTransporters.map(transporter => {
          // Prepare the sales orders data for this transporter
          const formattedSalesOrders = selectedOrders.map(orderNo => {
            const orderDetails = getSelectedOrderDetails(orderNo);
            const originalOrder = orderDetails?.originalData || {};

            // Format validity as "DD-MM-YYYY HH:MM" per API requirements
            const today = new Date();
            const validityStr = formatValidityDateForAPI(today);

            const quantityStr = orderDetails?.quantity || "0";
            const quantityNum = parseInt(quantityStr.toString().replace(/\D/g, '')) || 0;

            return {
              soNumber: orderDetails?.orderNo || orderNo,
              validity: validityStr, // Now using DD-MM-YYYY HH:MM format
              material: originalOrder.materialCode || orderDetails?.material || '',
              quantity: quantityNum,
              transporterCode: transporter.id,
              plantCode: originalOrder.plant || "PLANT01",
              biddingOrderNo: bidNo,
              status: "A"
            };
          });

          // Return a complete bidding object for each transporter
          return {
            biddingMaster: {
              transporterCode: transporter.id,
              ceilingPrice: parseFloat(values.ceilingAmount) || 0,
              uom: values.uom,
              bidFrom: formatDateForAPI(values.bidStartingFrom),
              bidTo: formatDateForAPI(values.bidStartTo),
              lastTimeExtension: timeToMinutes(values.lastMinutesExtension),
              extentionQuantity: parseInt(values.extensionQuantity) || 0,
              bidUnit: 1,
              addOn: "Not Required", // Changed to match API request
              intervalAmount: parseFloat(values.intervalAmount) || 0,
              noOfInput: selectedOrders.length,
              intervalAllocate: timeToMinutes(values.intervalTimeForAllocatingVehicle),
              intervalReach: timeToMinutes(values.intervalTimeToReachPlant),
              gracePeriod: timeToMinutes(values.gracePeriodToReachPlant),
              status: "A",
              autoAllocation: values.autoAllocateTo === "Yes" ? 1 : 0,
              bid: 1,
              bidType: "ONLINE",
              biddingOrderNo: bidNo,
              createdDate: formatDateOnlyForAPI(new Date()), // Now using YYYY-MM-DD format
              route: 100.0, // Set to 100.0 as in the example
              multiMaterial: 1,
              city: "Mumbai",
              material: formattedSalesOrders[0]?.material || "Steel", // Default to Steel if no material
              quantity: formattedSalesOrders.reduce((total, order) => total + order.quantity, 0),
              extentionQty: parseInt(values.extensionQuantity) || 0,
              autoAllocationSalesOrder: values.autoAllocateTo === "Yes" ? 1 : 0,
              fromLocation: "PlantA",
              toLocation: "PlantB"
            },
            salesOrders: formattedSalesOrders
          };
        });


        const apiData = {
          bulk: false,
          biddings: biddingObjects
        };

        // Enhanced logging for debugging
        console.log("API Request Data:", JSON.stringify(apiData, null, 2));
        console.log("Date format being tested for validity:", formatDateOnlyForAPI(new Date()));
        console.log("Date format being tested for bid dates:", formatDateForAPI(new Date()));

        // API call with enhanced error handling
        const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/bulk`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(apiData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          console.error("Response Status:", response.status);
          console.error("Response Headers:", Object.fromEntries([...response.headers.entries()]));
          throw new Error(`API responded with status: ${response.status}, message: ${errorText}`);
        }

        const result = await response.json();
        console.log("API Success Response:", result);
        setBiddingOrderNo(result[0]?.data?.biddingOrderNo);

        // Show success toast notification
        toast.success("Your SO based bid has been created successfully!", {

          autoClose: 3000,
          toastId: 'bid-success-toast',
          position: "top-right",
          className: "bg-light"
        });
        document.dispatchEvent(new CustomEvent('refreshBidNumber'));

        // After successful submission, go to Finish
        setActiveStep(4);
        // Show success modal
        setShowSuccessModal(true);


        // After successful submission, reset form and go back to first step

      } catch (error) {
        console.error("API Error Details:", error);
        setSubmitError(error.message);
        // Show error toast notification
        toast.error("Something went wrong!", {
          toastId: 'error-toast',
          position: "top-right",
          autoClose: 4000,
          className: "bg-error color-error"
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // For other steps, just go to next step if validation passed
      setActiveStep(prevStep => Math.min(prevStep + 1, steps.length));
    }
  };
  // Handle order selection
  const handleOrderSelect = (orderNo) => {
    if (selectedOrders.includes(orderNo)) {
      setSelectedOrders(selectedOrders.filter(item => item !== orderNo));
    } else {
      setSelectedOrders([...selectedOrders, orderNo]);
    }

    // Clear sales order error when selecting orders
    if (errors.salesOrders) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors.salesOrders;
        return newErrors;
      });
    }
  };

  // Handle pagination for sales orders
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Fetch sales orders when page, search term, or component mounts
  useEffect(() => {
    fetchSalesOrders();
  }, [currentPage, searchTerm]);

  // Fetch transporters on mount
  useEffect(() => {
    console.log("SOBAsed useEffect bidNo:", bidNo);
    document.title = "SO Based Order | EPLMS";

    // Automatically fetch transporters when the component mounts
    fetchTransporters();
  }, []);

  const steps = [
    'Bid Details',
    'Material and Transporter',
    'Delivery and Allocation',
    'Finish'
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

  const displayToTransporterOptions = [
    "Select",
    "Yes",
    "No"
  ];

  // Filter sales orders based on search term - this is now handled by API
  const filteredOrders = useMemo(() => {
    return salesOrders;
  }, [salesOrders]);

  // Use memo to improve performance when filtering transporters
  // Use memo to improve performance when filtering transporters
  const filteredTransporters = useMemo(() => {
    if (!transporterSearchTerm || transporterSearchTerm.trim() === '') {
      return transporterOptions;
    }

    const searchTermLower = transporterSearchTerm.toLowerCase().trim();
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
  }, [transporterOptions, transporterSearchTerm]);

  // Update the search term handler to properly handle input
  const handleTransporterSearchChange = (e) => {
    const value = e.target.value;
    setTransporterSearchTerm(value);
    // Ensure dropdown stays open while searching
    if (!showTransporterDropdown) {
      setShowTransporterDropdown(true);
    }
  };

  // Function to reset the form and go back to the first step
  const handleBackToCreateBid = () => {
    // Reset form and go back to first step
    setActiveStep(0);
    setShowSuccessModal(false);
    setValues({
      bidStartingFrom: "",
      bidStartTo: "",
      ceilingAmount: "",
      intervalAmount: "",
      uom: "",
      lastMinutesExtension: "",
      extensionQuantity: "",
      displayToTransporter: "",
      selectTransporter: [], // Reset to empty array
      autoAllocateTo: "",
      intervalTimeForAllocatingVehicle: "",
      intervalTimeToReachPlant: "",
      gracePeriodToReachPlant: ""
    });
    setSelectedOrders([]);
    setErrors({});
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="so-based-order-modal-overlay">
      <div className="so-based-order-modal-content">
        <div className="so-based-order-modal-icon">
          <lord-icon
            src="https://cdn.lordicon.com/lupuorrc.json"
            trigger="loop"
            colors="primary:#0ab39c,secondary:#405189"
            style={{ width: "120px", height: "120px" }}
          ></lord-icon>
        </div>
        <h3 className="so-based-order-modal-title">
          Your SO Based <span className="color-primary"> {biddingOrderNo}</span>  has been created!
        </h3>
        <button
          type="button"
          className="so-based-order-modal-button"
          onClick={handleBackToCreateBid}
        >
          Back to Create Bid
        </button>
      </div>
    </div>
  );

  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen);
  };

  // Transporter selection functions
  const handleTransporterSelect = (transporter) => {
    // Check if the transporter is already selected by ID
    if (!values.selectTransporter.some(t => t.id === transporter.id)) {
      setValues(prevValues => ({
        ...prevValues,
        selectTransporter: [...prevValues.selectTransporter, transporter,
        {
          id: transporter.id,
          code: transporter.code,
          name: transporter.name,
          contactPerson: transporter.contactPerson,
          contactNumber: transporter.contactNumber,
          contactEmail: transporter.contactEmail,
          fullData: transporter.fullData || transporter
        }
        ]
      }));
    }

    // Clear transporter error when selecting transporters
    if (errors.selectTransporter) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors.selectTransporter;
        return newErrors;
      });
    }
  };

  const handleRemoveTransporter = (transporterId, e) => {
    if (e) e.stopPropagation();
    setValues(prevValues => ({
      ...prevValues,
      selectTransporter: prevValues.selectTransporter.filter(t => t.id !== transporterId)
    }));
  };
  const selectedTransporterCount = useMemo(() => {
    const uniqueTransporters = new Set(values.selectTransporter.map(t => t.id));
    return uniqueTransporters.size;
  }, [values.selectTransporter]);

  // Create a Set for O(1) lookup instead of O(n) array.some()
  const selectedTransporterIds = useMemo(() => {
    return new Set(values.selectTransporter.map(t => t.id));
  }, [values.selectTransporter]);

  // Optimize transporter selection handlers
  const handleTransporterToggle = useCallback((transporter, e) => {
    e.stopPropagation();

    const isSelected = selectedTransporterIds.has(transporter.id);
    if (!isSelected) {
      handleTransporterSelect(transporter);
    } else {
      handleRemoveTransporter(transporter.id, e);
    }
  }, [selectedTransporterIds, handleTransporterSelect, handleRemoveTransporter]);

  const handleCheckboxChange = useCallback((transporter, e) => {
    e.stopPropagation();

    if (e.target.checked) {
      handleTransporterSelect(transporter);
    } else {
      handleRemoveTransporter(transporter.id, e);
    }
  }, [handleTransporterSelect, handleRemoveTransporter]);

  // Handle select all transporters properly
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
      // Remove only the filtered transporters from selection
      const filteredIds = filteredTransporters.map(t => t.id);

      setValues(prevValues => ({
        ...prevValues,
        selectTransporter: prevValues.selectTransporter.filter(t => !filteredIds.includes(t.id))
      }));
    }

    // Clear transporter error if we now have selections
    if (errors.selectTransporter) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors.selectTransporter;
        return newErrors;
      });
    }
  };

  // Check if all filtered transporters are selected
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

    // Since transporterSearchTerm might not have changed, we need to manually update the filtered list
    if (transporterOptions && transporterOptions.length > 0) {
      const newFilteredTransporters = transporterOptions.filter(t => {
        if (!t) return false;

        const name = (t.name || '').toString().toLowerCase();
        const id = (t.id || '').toString();

        return name.includes((transporterSearchTerm || '').toLowerCase()) ||
          id.includes(transporterSearchTerm || '');
      });

      console.log("New filtered transporters:", newFilteredTransporters);
    }
  }, [transporterOptions, transporterSearchTerm]);
  // Update useEffect to correctly set the selectAll state
  useEffect(() => {
    const allSelected = areAllFilteredTransportersSelected();
    setSelectAllTransporters(allSelected);
  }, [transporterSearchTerm, values.selectTransporter]);

  // Function to handle sales order search with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Reset to first page when searching
    setCurrentPage(1);
  };

  return (
    <>
      {/* Material UI Stepper with custom connector for green lines */}
      <div className="so-based-order-stepper-container">
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
          <div className="so-based-order-container">
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Bid Starting From <span className="color-error">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    name="bidStartingFrom"
                    value={values.bidStartingFrom}
                    onChange={handleInputChange}
                 
                    // Add min attribute to prevent selection of past dates
                    min={new Date().toISOString().slice(0, 16)}
                    className={`so-based-order-input date-input-min ${errors.bidStartingFrom ? "is-invalid" : ""}`}
                  />
                  {errors.bidStartingFrom && (
                    <div className="invalid-feedback">
                      {errors.bidStartingFrom}
                    </div>
                  )}
                </div>
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Bid Start To<span className="color-error">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    name="bidStartTo"
                    value={values.bidStartTo}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className={`so-based-order-input date-input-min ${errors.bidStartTo ? "is-invalid" : ""}`}
                  />
                  {errors.bidStartTo && (
                    <div className="invalid-feedback">
                      {errors.bidStartTo}
                    </div>
                  )}
                </div>
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Ceiling Amount(MT)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Add Amount"
                  name="ceilingAmount"
                  value={values.ceilingAmount}
                  onChange={handleInputChange}
                  className="so-based-order-input"
                />
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Interval Amount <span className="color-error">*</span>
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Add Amount"
                  name="intervalAmount"
                  value={values.intervalAmount}
                  onChange={handleInputChange}
                  className={`so-based-order-input ${errors.intervalAmount ? "is-invalid" : ""}`}
                />
                {errors.intervalAmount && (
                  <div className="invalid-feedback">
                    {errors.intervalAmount}
                  </div>
                )}
              </div>
            </div>

            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  UOM<span className="color-error">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="select"
                    name="uom"
                    value={values.uom}
                    onChange={handleInputChange}
                    className={`so-based-order-select ${errors.uom ? "is-invalid" : ""}`}
                  >
                    {uomOptions.map((uom, index) => (
                      <option key={index} value={uom}>
                        {uom}
                      </option>
                    ))}
                  </Input>
                  {errors.uom && (
                    <div className="invalid-feedback">
                      {errors.uom}
                    </div>
                  )}
                </div>
              </div>

              {/* Updated Last Minutes Extension field */}
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Last Minutes Extension <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="time"
                    placeholder="--:--:--"
                    name="lastMinutesExtension"
                    value={values.lastMinutesExtension}
                    onChange={handleInputChange}
                    className="so-based-order-input black-placeholder"
                    style={{
                      color: "#000",
                      border: `1px solid ${errors.lastMinutesExtension ? "#dc3545" : "#ced4da"}`,
                      borderRadius: "4px"
                    }}
                  />
                  {errors.lastMinutesExtension && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      marginTop: "4px",
                      fontWeight: "500"
                    }}>
                      {errors.lastMinutesExtension}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="so-based-order-button-container">
              <button
                type="button"
                className={`so-based-order-button so-based-order-back-button ${activeStep === 0 ? 'disabled' : ''}`}
                onClick={handleBackPage}
                disabled={activeStep === 0}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="so-based-order-button so-based-order-next-button"
              >
                Save & Next <i className="ri-arrow-right-line ms-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* Material and Transporter Step with Improved Accordion Table */}
        {activeStep === 1 && (
          <div className="so-based-order-container">
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Extension Quantity (MT) <span className="color-error">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                
                  length={20}
                  placeholder="Add Quantity"
                  name="extensionQuantity"
                  value={values.extensionQuantity}
                  onChange={handleInputChange}
                  className={`so-based-order-input ${errors.extensionQuantity ? "is-invalid" : ""}`}
                />
                {errors.extensionQuantity && (
                  <div className="invalid-feedback">
                    {errors.extensionQuantity}
                  </div>
                )}
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Display To Transporter <span className="color-error">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="select"
                    required
                    name="displayToTransporter"
                    value={values.displayToTransporter}
                    onChange={handleInputChange}
                    className={`so-based-order-select ${errors.displayToTransporter ? "is-invalid" : ""}`}
                  >
                    {displayToTransporterOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.displayToTransporter && (
                    <div className="invalid-feedback">
                      {errors.displayToTransporter}
                    </div>
                  )}
                </div>
              </div>

              {/* IMPROVED Transporter Selection with API integration */}
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Select Transporter <span className="color-error">*</span>
                </Label>
                <div className="form-group-with-viewer">
                  <div className="input-container">
                    <div
                      className={`so-based-order-transporter-selector ${errors.selectTransporter ? "border-error border-2" : ""}`}
                      onClick={() => setShowTransporterDropdown(!showTransporterDropdown)}
                    >
                      <span className="so-based-order-transporter-selector-placeholder">
                        {selectedTransporterCount > 0 ? `${selectedTransporterCount} Selected` : 'Select'}
                      </span>
                      <span>
                        <i className="ri-arrow-down-s-line"></i>
                      </span>
                    </div>

                    {/* Transporter dropdown with loading state */}
                    {showTransporterDropdown && (
                      <div className="so-based-order-dropdown">
                        {/* Search header */}
                        <div className="so-based-order-dropdown-header">
                          <div className="dropdown-controls">
                            <div className="checkbox-container">
                              <input
                                type="checkbox"
                                checked={selectAllTransporters}
                                onChange={handleSelectAllTransporters}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Search"
                              value={transporterSearchTerm}
                              onChange={handleTransporterSearchChange}
                              onClick={(e) => e.stopPropagation()}
                              className="so-based-order-dropdown-search"
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

                        {/* Loading indicator for transporters */}
                        {loadingTransporters && (
                          <div className="so-based-order-loading-state">
                            <i className="ri-loader-4-line spin"></i>
                            <div className="loading-text">Loading transporters...</div>
                          </div>
                        )}

                        {/* Empty state message */}
                        {!loadingTransporters && filteredTransporters.length === 0 && (
                          <div className="so-based-order-empty-state">
                            <i className="ri-inbox-line"></i>
                            <div className="empty-text">No transporters found</div>
                          </div>
                        )}

                        {/* Transporter list */}
                        {!loadingTransporters && filteredTransporters.length > 0 && (
                          <div className="so-based-order-dropdown-content">
                            {filteredTransporters.map((transporter) => (
                              <div
                                key={transporter.id}
                                className="so-based-order-dropdown-item"
                                onClick={(e) => handleTransporterToggle(transporter, e)}
                              >
                                <div className="checkbox-container">
                                  <input
                                    type="checkbox"
                                    checked={selectedTransporterIds.has(transporter.id)}
                                    onChange={(e) => handleCheckboxChange(transporter, e)}
                                  />
                                </div>
                                <div className="transporter-id">
                                  {transporter.id}
                                </div>
                                <div className="transporter-name">
                                  {transporter.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* TransporterViewer component */}
                  {values.selectTransporter.length > 0 && (
                    <TransporterViewer
                      selectedTransporters={values.selectTransporter}
                      onRemove={(transporterId) => {
                        handleRemoveTransporter(transporterId, new Event('click'));
                      }}
                    />
                  )}
                </div>
                {errors.selectTransporter && (
                  <div className="invalid-feedback">
                    {errors.selectTransporter}
                  </div>
                )}
              </div>
            </div>

            {/* Improved Accordion Sales Order Selection with API integration */}
            <div className="so-based-order-accordion">
              <div
                className={`so-based-order-accordion-header ${errors.salesOrders ? "border-error border-2" : ""}`}
                onClick={toggleAccordion}
              >
                <span>Select Sales Order Details <span className="color-error">*</span></span>
                <i className={`ri-arrow-${accordionOpen ? 'up' : 'down'}-s-line`}></i>
              </div>

              <div
                className={`so-based-order-accordion-content ${accordionOpen ? 'open' : ''} ${errors.salesOrders ? "border-error border-2" : ""}`}
                style={{
                  display: accordionOpen ? 'block' : 'none',
                }}
              >
                <div className="so-based-order-search-container">
                  <input
                    type="text"
                    placeholder="Search by Order Number, Material, etc."
                    className="so-based-order-search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>

                {/* Loading state for sales orders */}
                {loadingSalesOrders && (
                  <div className="so-sales-orders-loading">
                    <i className="ri-loader-4-line spin"></i>
                    <div className="loading-text">Loading sales orders...</div>
                  </div>
                )}

                {/* Error state for sales orders */}
                {salesOrdersError && !loadingSalesOrders && (
                  <div className="so-sales-orders-error">
                    <i className="ri-error-warning-line"></i>
                    <div className="error-text">
                      Error loading sales orders: {salesOrdersError}
                    </div>
                    <button
                      type="button"
                      onClick={fetchSalesOrders}
                      className="retry-button"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Empty state for no sales orders */}
                {!loadingSalesOrders && !salesOrdersError && filteredOrders.length === 0 && (
                  <div className="so-sales-orders-empty">
                    <i className="ri-file-list-3-line"></i>
                    <div className="empty-text">
                      No sales orders found. {searchTerm ? "Try a different search term." : ""}
                    </div>
                  </div>
                )}

                {/* Sales orders table */}
                {!loadingSalesOrders && !salesOrdersError && filteredOrders.length > 0 && (
                  <table className="so-based-order-table">
                    <thead>
                      <tr>
                        <th className="w-40"></th>
                        <th>Sales Order No.</th>
                        <th>Validity</th>
                        <th>Material</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order.orderNo)}
                              onChange={() => handleOrderSelect(order.orderNo)}
                            />
                          </td>
                          <td>{order.orderNo}</td>
                          <td>{order.validity}</td>
                          <td>{order.material}</td>
                          <td>{order.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Improved pagination with API integration */}
                {!loadingSalesOrders && !salesOrdersError && totalPages > 0 && (
                  <div className="so-based-order-pagination">
                    <div className="so-based-order-pagination-count">
                      Total Results: {totalSalesOrders}
                    </div>
                    <div className="so-based-order-pagination-controls">
                      <button
                        type="button"
                        className={`so-based-order-pagination-prev ${currentPage === 1 ? 'disabled-opacity' : ''}`}
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        <i className="ri-arrow-left-s-line"></i>
                      </button>
                      <div className="so-based-order-pagination-info">
                        Page {currentPage} of {totalPages}
                      </div>
                      <button
                        type="button"
                        className={`so-based-order-pagination-next ${currentPage === totalPages ? 'disabled-opacity' : ''}`}
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <i className="ri-arrow-right-s-line"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Display error for sales order selection */}
            {errors.salesOrders && (
              <div className="invalid-feedback mb-4">
                {errors.salesOrders}
              </div>
            )}

            <div className="so-based-order-button-container">
              <button
                type="button"
                className="so-based-order-button so-based-order-back-button"
                onClick={handleBackPage}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="so-based-order-button so-based-order-next-button"
              >
                Save & Next <i className="ri-arrow-right-line ms-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* Delivery and Allocation Step */}
        {activeStep === 2 && (
          <div className="so-based-order-container">
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Auto Allocate To L1 <span className="color-error">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="select"
                    name="autoAllocateTo"
                    value={values.autoAllocateTo}
                    onChange={handleInputChange}
                  
                    className={`so-based-order-select ${errors.autoAllocateTo ? "is-invalid" : ""}`}
                  >
                    {autoAllocateToOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.autoAllocateTo && (
                    <div className="invalid-feedback">
                      {errors.autoAllocateTo}
                    </div>
                  )}
                </div>
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Interval time for Allocating Vehicle <span className="color-error">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="time"
                    name="intervalTimeForAllocatingVehicle"
                    value={values.intervalTimeForAllocatingVehicle}
                    onChange={handleInputChange}
                  
                    className={`so-based-order-input ${errors.intervalTimeForAllocatingVehicle ? "is-invalid" : ""}`}
                    placeholder="Select Time"
                  />
                  {errors.intervalTimeForAllocatingVehicle && (
                    <div className="invalid-feedback">
                      {errors.intervalTimeForAllocatingVehicle}
                    </div>
                  )}
                </div>
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Interval time for to reach plant <span className="color-error">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="time"
                    name="intervalTimeToReachPlant"
                    value={values.intervalTimeToReachPlant}
                    onChange={handleInputChange}
                   
                    className={`so-based-order-input ${errors.intervalTimeToReachPlant ? "is-invalid" : ""}`}
                    placeholder="Select Time"
                  />
                  {errors.intervalTimeToReachPlant && (
                    <div className="invalid-feedback">
                      {errors.intervalTimeToReachPlant}
                    </div>
                  )}
                </div>
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Grace Period to reach plant <span className="color-error">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="time"
                    name="gracePeriodToReachPlant"
                    value={values.gracePeriodToReachPlant}
                    onChange={handleInputChange}
                   
                    className={`so-based-order-input ${errors.gracePeriodToReachPlant ? "is-invalid" : ""}`}
                    placeholder="Select Time"
                  />
                  {errors.gracePeriodToReachPlant && (
                    <div className="invalid-feedback">
                      {errors.gracePeriodToReachPlant}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="so-based-order-button-container">
              <button
                type="button"
                className="so-based-order-button so-based-order-back-button"
                onClick={handleBackPage}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="so-based-order-button so-based-order-next-button"
              >
                Save & Next <i className="ri-arrow-right-line ms-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* Preview Step (not in stepper but comes after Delivery and Allocation) */}
        {activeStep === 3 && (
          <div className="so-based-order-container">
            {/* Bid Details Section */}
            <div className="so-based-order-section-title">Bid Details</div>
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Bid Starting From</Label>
                <div className="so-based-order-value">{values.bidStartingFrom || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Bid Start To</Label>
                <div className="so-based-order-value">{values.bidStartTo || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Ceiling Amount</Label>
                <div className="so-based-order-value">{values.ceilingAmount || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Interval Amount</Label>
                <div className="so-based-order-value">{values.intervalAmount || "—"}</div>
              </div>
            </div>
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">UOM</Label>
                <div className="so-based-order-value">{values.uom || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Last Minutes Extension</Label>
                <div className="so-based-order-value">{values.lastMinutesExtension || "—"}</div>
              </div>
            </div>

            {/* Material and Transporter Section */}
            <div className="so-based-order-section-title">Material and Transporter</div>
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Extension Quantity</Label>
                <div className="so-based-order-value">{values.extensionQuantity || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Display To Transporter</Label>
                <div className="so-based-order-value">{values.displayToTransporter || "—"}</div>
              </div>

              {/* Updated Transporter Display for Preview */}
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Selected Transporter</Label>
                <div className="preview-transporter-container">
                  <div className="preview-transporter-tags">
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
                                className="preview-transporter-tag"
                              >
                                {t.name}
                              </span>
                            ))}

                            {/* Show ellipsis for additional transporters */}
                            {remaining > 0 && (
                              <span className="preview-transporter-ellipsis">
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
                    <TransporterViewer
                      selectedTransporters={values.selectTransporter}
                      onRemove={(transporterId) => {
                        handleRemoveTransporter(transporterId, new Event('click'));
                      }}
                    />
                  )}

                  {/* {values.selectTransporter.length > 0 && (
                    <span
                      onClick={() => setShowTransporterModal(true)}
                      className="preview-view-icon"
                    >
                      <i className="ri-eye-line"></i>
                    </span>
                  )} */}
                </div>
              </div>
            </div>

            {/* Transporter Preview Modal */}
            {showTransporterModal && (
              <div className="transporter-modal-overlay">
                <div className="transporter-modal-content">
                  <div className="transporter-modal-header">
                    <h3>Selected Transporters</h3>
                    <button
                      onClick={() => setShowTransporterModal(false)}
                      className="transporter-modal-close"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                  <div className="transporter-modal-body">
                    <table className="transporter-modal-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...new Map(values.selectTransporter.map(item => [item.id, item])).values()].map((t, i) => (
                          <tr key={i}>
                            <td>{t.id}</td>
                            <td>{t.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="transporter-modal-footer">
                    <button
                      onClick={() => setShowTransporterModal(false)}
                      className="transporter-modal-close-btn"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Sales Orders Section */}
            <div className="so-based-order-section-title">Selected Sales Orders</div>
            {selectedOrders.length > 0 ? (
              <table className="so-based-order-preview-table so-based-order-table">
                <thead>
                  <tr>
                    <th>Sales Order No.</th>
                    {/* <th>Status</th> */}
                    <th>Validity</th>
                    <th>Material</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrders.map((orderNo, index) => {
                    const orderDetails = salesOrders.find(order => order.orderNo === orderNo);
                    return orderDetails ? (
                      <tr key={index}>
                        <td>{orderDetails.orderNo}</td>
                        {/* <td>
                          <span className={`status-badge ${orderDetails.status === "Confirmed" ? "confirmed" :
                            orderDetails.status === "Processing" ? "processing" :
                              orderDetails.status === "Blocked" ? "blocked" : "default"
                            }`}>
                            {orderDetails.status || "N/A"}
                          </span>
                        </td> */}
                        <td>{orderDetails.validity}</td>
                        <td>{orderDetails.material}</td>
                        <td>{orderDetails.quantity}</td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            ) : (
              <div className="so-based-order-no-data">No sales orders selected</div>
            )}

            {/* Delivery and Allocation Section */}
            <div className="so-based-order-section-title">Delivery and Allocation</div>
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Auto Allocate To L1</Label>
                <div className="so-based-order-value">{values.autoAllocateTo || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Interval time for Allocating Vehicle</Label>
                <div className="so-based-order-value">{values.intervalTimeForAllocatingVehicle || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Interval time to reach plant</Label>
                <div className="so-based-order-value">{values.intervalTimeToReachPlant || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Grace Period to reach plant</Label>
                <div className="so-based-order-value">{values.gracePeriodToReachPlant || "—"}</div>
              </div>
            </div>

            <div className="so-based-order-button-container">
              <button
                type="button"
                className="so-based-order-button so-based-order-back-button"
                onClick={handleBackPage}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className={`so-based-order-button so-based-order-next-button ${isSubmitting ? 'disabled-opacity' : ''}`}
                disabled={isSubmitting}
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
      </Form>

      {/* Add ToastContainer for notifications */}
      <ToastContainer
        closeButton={false}
        limit={1}
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="bg-light"
      />
      {/* Show success modal */}
      {showSuccessModal && <SuccessModal />}
    </>
  );
};

export default SOBasedOrder;