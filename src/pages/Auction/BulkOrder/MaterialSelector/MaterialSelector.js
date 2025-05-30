import React, { useState, useEffect, useMemo, useRef } from "react";
import '../BulkOrder.css';

const MaterialSelector = ({ value, onChange, required }) => {
  const [materialOptions, setMaterialOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Filter materials based on search term
  const filteredMaterials = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return materialOptions;
    }

    const searchTermLower = searchTerm.toLowerCase();
    return materialOptions.filter(material =>
      material.name.toLowerCase().includes(searchTermLower)
    );
  }, [materialOptions, searchTerm]);

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

  // Fetch materials from API
  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      
      try {
        // Get plant code from session storage
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantCode = obj?.data?.plantCode || "N205"; // Fallback to N205 if no plant code
        
        // Make API request
        const response = await fetch(
          `${process.env.REACT_APP_LOCAL_URL_8082}/materials?plantCode=${plantCode}`,
          {
            method: 'GET',
            headers: getAuthHeaders()
          }
        );

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const result = await response.json();

        // Parse the response
        if (result?.data && Array.isArray(result.data)) {
          setMaterialOptions(result.data);
        } else {
          console.warn("Unexpected API response format");
          setMaterialOptions([
            { id: 1, name: "PSC BULK" },
            { id: 2, name: "PSC NFR" },
            { id: 3, name: "PSC510" },
            { id: 4, name: "CC HPC" },
            { id: 5, name: "F2R" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
        setMaterialOptions([
          { id: 1, name: "PSC BULK" },
          { id: 2, name: "PSC NFR" },
          { id: 3, name: "PSC510" },
          { id: 4, name: "CC HPC" },
          { id: 5, name: "F2R" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle material selection
  const handleSelectMaterial = (material) => {
    onChange({
      target: {
        name: 'material',
        value: material.name
      }
    });
    setShowDropdown(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      {/* Material selector that mimics a select */}
      <div 
        onClick={() => setShowDropdown(!showDropdown)}
        className="form-select"
        style={{ 
          cursor: "pointer",
          backgroundColor: "#fff",
          color: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "38px"
        }}
      >
        <span>{value || "Select Material"}</span>
        <i className={`ri-arrow-${showDropdown ? 'up' : 'down'}-s-line`}></i>
      </div>

      {/* Dropdown menu */}
      {showDropdown && (
        <div 
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            zIndex: 1050,
            backgroundColor: "#fff",
            border: "1px solid #ced4da",
            borderRadius: "0.25rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            maxHeight: "250px",
            overflowY: "auto"
          }}
        >
          {/* Search box */}
          <div style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="form-control"
            />
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{ textAlign: "center", padding: "10px" }}>
              <span>Loading...</span>
            </div>
          )}

          {/* No results */}
          {!loading && filteredMaterials.length === 0 && (
            <div style={{ padding: "10px", textAlign: "center", color: "#6c757d" }}>
              No materials found
            </div>
          )}

          {/* Material list - only showing names */}
          {!loading && filteredMaterials.map(material => (
            <div
              key={material.id || Math.random()}
              onClick={() => handleSelectMaterial(material)}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                backgroundColor: value === material.name ? "#f8f9fa" : "transparent",
                borderBottom: "1px solid #eee"
              }}
            >
              {material.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialSelector;