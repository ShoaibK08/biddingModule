// import React from "react";
// import { Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col, Label, Input } from "reactstrap";

// const EditModal = ({
//     isOpen,
//     toggle,
//     isEdit,
//     values,
//     handleInputChange,
//     handleSubmit
// }) => {
//     // Status options defined in the same format as original code
//     const status = [
//         {
//             options: [
//                 { label: "Select Status", value: "" },
//                 { label: "Active", value: "A" },
//                 { label: "Deactive", value: "D" },
//             ],
//         },
//     ];

//     const validateName = (name) => {
//         if (!name) return true; // Allow empty initially
//         const nameRegex = /^[A-Za-z ]+$/;
//         return nameRegex.test(name);
//     };
//     const validateAddress = (address) => {
//         if (!address) return true; // Allow empty initially
//         const addressRegex = /^[A-Za-z0-9\s,.'-]+$/;  // Example regex to allow alphanumeric and common address symbols
//         return addressRegex.test(address);
//     };
//     const validateContactPerson = (person) => {
//         if (!person) return true;
//         const personRegex = /^[A-Za-z ]+$/;
//         return personRegex.test(person);
//     }

//     const validatePhoneNumber = (phoneNumber) => {
//         if (!phoneNumber) return true; // Allow empty initially
//         const phoneRegex = /^[0-9]{1,10}$/; // Only numbers, max 10 digits
//         return phoneRegex.test(phoneNumber);
//     };
//     // Email validation function
//     const validateEmail = (email) => {
//         if (!email) return true; // Allow empty initially
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         return emailRegex.test(email);
//     };
//     const validatePrice = (price) => {
//         if (!price) return true; // Allow empty initially
//         const priceRegex = /^\d+(\.\d{1,2})?$/; // Accepts numbers with optional 1-2 decimal places
//         return priceRegex.test(price);
//     };
//     const validateTaxInfo = (taxInfo) => {
//         if (!taxInfo) return true; // Allow empty initially
//         const taxInfoRegex = /^[a-zA-Z0-9\s\-\/&. ]+$/; // Letters, numbers, space, -, /, &, .
//         return taxInfoRegex.test(taxInfo);
//     };

//     const validateRegionLocation = (region) => {
//         if (!region) return true;
//         const regionRegex = /^[a-zA-Z\s,.\-()&/ ]{2,100}$/;
//         return regionRegex.test(region);
//     };

//     const validateSLA = (sla) => {
//         if (!sla) return true;
//         const slaRegex = /^[a-zA-Z0-9\s\-\/&.() ]+$/;
//         return slaRegex.test(sla);
//     };

//     const validatePAN = (panNumber) => {
//         if (!panNumber) return true;
//         const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//         return panRegex.test(panNumber);
//     };

//     const validateGST = (gstNumber) => {
//         if (!gstNumber) return true;
//         const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
//         return gstRegex.test(gstNumber);
//     };

//     return (
//         <Modal id="showModal" isOpen={isOpen} toggle={toggle} centered size="lg">
//             <ModalHeader className="bg-light p-3" toggle={toggle}>
//                 {!!isEdit ? "Edit Transporter" : "Add Transporter"}
//             </ModalHeader>
//             <Form className="tablelist-form" onSubmit={handleSubmit}>
//                 <ModalBody className="p-3">
//                     <div>
//                         {/* ROW 1: Transporter Code, Name, Address */}
//                         <Row className="mb-1">
//                             <Col md={4}>
//                                 {/* Add Transporter Code field for both edit and create states */}
//                                 <Label htmlFor="code" className="form-label">
//                                     Transporter Code
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     id="code"
//                                     name="code"
//                                     placeholder="Enter Transporter Code"
//                                     value={values.code || ""}
//                                     onChange={handleInputChange}
//                                     className="form-control"
//                                     maxLength={50}
//                                     disabled={!!isEdit}
//                                 />
//                             </Col>

//                             <Col md={4}>
//                                 <Label htmlFor="name" className="form-label">
//                                     Transporter Name<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="name"
//                                     name="name"
//                                     maxLength={50}
//                                     placeholder="Enter Transporter Name"
//                                     value={values.name || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.name && !validateName(values.name) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.name && !validateName(values.name) && (
//                                     <div className="invalid-feedback">
//                                         Invalid name. Only letters, spaces are allowed.
//                                     </div>
//                                 )}
//                             </Col>

//                             <Col md={4}>
//                                 <Label htmlFor="address" className="form-label">
//                                     Address<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="address"
//                                     name="address"
//                                     placeholder="Enter Address"
//                                     value={values.address || ""}
//                                     maxLength={50}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.address && !validateAddress(values.address) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.address && !validateAddress(values.address) && (
//                                     <div className="invalid-feedback">
//                                         Invalid address. Only letters, numbers, spaces, and basic punctuation are allowed.
//                                     </div>
//                                 )}
//                             </Col>
//                         </Row>

//                         {/* ROW 2: Contact Person, Phone, Email/Mode (based on Edit/Add) */}
//                         <Row className="mb-1">
//                             <Col md={4}>
//                                 <Label htmlFor="contactPerson" className="form-label">
//                                     Contact Person<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="contactPerson"
//                                     name="contactPerson"
//                                     placeholder="Enter Contact Person"
//                                     maxLength={30}
//                                     value={values.contactPerson || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.contactPerson && !validateContactPerson(values.contactPerson) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.contactPerson && !validateContactPerson(values.contactPerson) && (
//                                     <div className="invalid-feedback">
//                                         Invalid details. Only letters, spaces and numbers are allowed.
//                                     </div>
//                                 )}
//                             </Col>

//                             <Col md={4}>
//                                 <Label htmlFor="contactNumber" className="form-label">
//                                     Phone No.<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="contactNumber"
//                                     name="contactNumber"
//                                     placeholder="Enter Phone Number"
//                                     value={values.contactNumber || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.contactNumber && !validatePhoneNumber(values.contactNumber) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.contactNumber && !validatePhoneNumber(values.contactNumber) && (
//                                     <div className="invalid-feedback">
//                                         Invalid phone number. Only numbers allowed and max 10 digits.
//                                     </div>
//                                 )}
//                             </Col>

//                             <Col md={4}>
//                                 {isEdit ? (
//                                     <>
//                                         <Label htmlFor="contactEmail" className="form-label">
//                                             Email ID<span style={{ color: "red" }}>*</span>
//                                         </Label>
//                                         <Input
//                                             type="email"
//                                             required
//                                             id="contactEmail"
//                                             name="contactEmail"
//                                             placeholder="Enter Email ID"
//                                             value={values.contactEmail || ""}
//                                             maxLength={50}
//                                             onChange={handleInputChange}
//                                             className={`form-control ${values.contactEmail && !validateEmail(values.contactEmail) ? 'is-invalid' : ''}`}
//                                         />
//                                         {values.contactEmail && !validateEmail(values.contactEmail) && (
//                                             <div className="invalid-feedback">
//                                                 Please enter a valid email address.
//                                             </div>
//                                         )}
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Label htmlFor="contactEmail" className="form-label">
//                                             Email ID<span style={{ color: "red" }}>*</span>
//                                         </Label>
//                                         <Input
//                                             type="email"
//                                             required
//                                             id="contactEmail"
//                                             name="contactEmail"
//                                             placeholder="Enter Email ID"
//                                             value={values.contactEmail || ""}
//                                             onChange={handleInputChange}
//                                             className={`form-control ${values.contactEmail && !validateEmail(values.contactEmail) ? 'is-invalid' : ''}`}
//                                         />
//                                         {values.contactEmail && !validateEmail(values.contactEmail) && (
//                                             <div className="invalid-feedback">
//                                                 Please enter a valid email address.
//                                             </div>
//                                         )}
//                                     </>
//                                 )}
//                             </Col>
//                         </Row>

//                         {/* ROW 3: Mode of Transport, Price, Term of Payment */}
//                         <Row className="mb-1">
//                             <Col md={4}>
//                                 <Label className="form-label">
//                                     Mode Of Transport<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="select"
//                                     required
//                                     id="modeTransport"
//                                     name="modeTransport"
//                                     value={values.modeTransport || ""}
//                                     onChange={handleInputChange}
//                                     className="form-select"
//                                 >
//                                     <option value="">Select Mode</option>
//                                     <option value="Road">Road</option>
//                                     <option value="Rail">Rail</option>
//                                     <option value="Air">Air</option>
//                                     <option value="Sea">Sea</option>
//                                     <option value="Multimodal">Multimodal</option>
//                                 </Input>
//                             </Col>

//                             <Col md={4}>
//                                 <Label className="form-label">
//                                     Price (Per KM)<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="priceKm"
//                                     name="priceKm"
//                                     placeholder="Enter Price Per KM"
//                                     value={values.priceKm || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.priceKm && !validatePrice(values.priceKm) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.priceKm && !validatePrice(values.priceKm) && (
//                                     <div className="invalid-feedback">
//                                         Price must be a valid number (e.g., 25 or 25.50).
//                                     </div>
//                                 )}
//                             </Col>

//                             <Col md={4}>
//                                 <Label htmlFor="termsOfPayment" className="form-label">
//                                     Term of Payment<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="select"
//                                     required
//                                     id="termPayment"
//                                     name="termPayment"
//                                     value={values.termPayment || ""}
//                                     onChange={handleInputChange}
//                                     className="form-select"
//                                 >
//                                     <option value="">Select Term</option>
//                                     <option value="Online">Online</option>
//                                     <option value="Cash">Cash</option>
//                                 </Input>
//                             </Col>
//                         </Row>

//                         {/* ROW 4: Tax Information, Region, Service Level Agreement */}
//                         <Row className="mb-1">
//                             <Col md={4}>
//                                 <Label htmlFor="taxInformation" className="form-label">
//                                     Tax Information<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="taxInfo"
//                                     name="taxInfo"
//                                     placeholder="Enter Tax Information"
//                                     value={values.taxInfo || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.taxInfo && !validateTaxInfo(values.taxInfo) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.taxInfo && !validateTaxInfo(values.taxInfo) && (
//                                     <div className="invalid-feedback">
//                                         Invalid format. Only letters, numbers, spaces, -, /, &, and . are allowed.
//                                     </div>
//                                 )}
//                             </Col>

//                             <Col md={4}>
//                                 <Label htmlFor="regionLocation" className="form-label">
//                                     Region/Location<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="regionLocation"
//                                     name="regionLocation"
//                                     placeholder="Enter Region/Location"
//                                     value={values.regionLocation || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.regionLocation && !validateRegionLocation(values.regionLocation) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.regionLocation && !validateRegionLocation(values.regionLocation) && (
//                                     <div className="invalid-feedback">
//                                         Invalid format. Only letters, numbers, spaces, -, /, &, and . are allowed.
//                                     </div>
//                                 )}
//                             </Col>

//                             <Col md={4}>
//                                 <Label htmlFor="serviceLevelAgreement" className="form-label">
//                                     Service Level Agreement<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="serviceLevelAgreement"
//                                     name="serviceLevelAgreement"
//                                     placeholder="Enter SLA"
//                                     value={values.serviceLevelAgreement || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.serviceLevelAgreement && !validateSLA(values.serviceLevelAgreement) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.serviceLevelAgreement && !validateSLA(values.serviceLevelAgreement) && (
//                                     <div className="invalid-feedback">
//                                         Invalid format. Only letters, numbers, spaces, -, /, &, ., and () are allowed.
//                                     </div>
//                                 )}
//                             </Col>
//                         </Row>

//                         {/* ROW 5: GST No., PAN No., Allowed Bidding/Rating */}
//                         <Row className="mb-1">
//                             <Col md={4}>
//                                 <Label htmlFor="gstnNo" className="form-label">
//                                     GST No.<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="gstnNo"
//                                     name="gstnNo"
//                                     placeholder="Enter GST No."
//                                     value={values.gstnNo || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.gstnNo && !validateGST(values.gstnNo) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.gstnNo && !validateGST(values.gstnNo) && (
//                                     <div className="invalid-feedback">
//                                         Invalid GST format. Should be like: 27AAPFU0939F1ZV
//                                     </div>
//                                 )}
//                             </Col>

//                             <Col md={4}>
//                                 <Label htmlFor="panNo" className="form-label">
//                                     PAN No.<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="panNo"
//                                     name="panNo"
//                                     placeholder="Enter PAN No."
//                                     value={values.panNo || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.panNo && !validatePAN(values.panNo) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.panNo && !validatePAN(values.panNo) && (
//                                     <div className="invalid-feedback">
//                                         Invalid PAN format. Should be like: ABCDE1234F
//                                     </div>
//                                 )}
//                             </Col>

//                             <Col md={4}>
//                                 {isEdit ? (
//                                     <>
//                                         <Label htmlFor="allowedBidding" className="form-label">
//                                             Allowed for Bidding<span style={{ color: "red" }}>*</span>
//                                         </Label>
//                                         <Input
//                                             type="select"
//                                             required
//                                             id="allowedBidding"
//                                             name="allowedBidding"
//                                             value={values.allowedBidding || ""}
//                                             onChange={handleInputChange}
//                                             className="form-select"
//                                         >
//                                             <option value="">Select Option</option>
//                                             <option value="Yes">Yes</option>
//                                             <option value="No">No</option>
//                                         </Input>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Label htmlFor="allowedBidding" className="form-label">
//                                             Allowed for Bidding<span style={{ color: "red" }}>*</span>
//                                         </Label>
//                                         <Input
//                                             type="select"
//                                             required
//                                             id="allowedBidding"
//                                             name="allowedBidding"
//                                             value={values.allowedBidding || ""}
//                                             onChange={handleInputChange}
//                                             className="form-select"
//                                         >
//                                             <option value="">Select Option</option>
//                                             <option value="Yes">Yes</option>
//                                             <option value="No">No</option>
//                                         </Input>
//                                     </>
//                                 )}
//                             </Col>
//                         </Row>

//                         {/* ROW 6: Rating/Status */}
//                         <Row className="mb-1">
//                             <Col md={4}>
//                                 <Label htmlFor="transporterRating" className="form-label">
//                                     Rating (auto Calculated)
//                                 </Label>
//                                 <div className="mt-2">
//                                     <div className="rating-stars">
//                                         {[1, 2, 3, 4, 5].map((star) => (
//                                             <span key={star} className="star me-1">
//                                                 <i className={`ri-star-${parseInt(values.transporterRating || 0) >= star ? 'fill' : 'line'} text-warning fs-16`}></i>
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </Col>

//                             <Col md={4}>
//                                 {isEdit && (
//                                     <>
//                                         <Label className="form-label">Status<span style={{ color: "red" }}>*</span></Label>
//                                         <Input
//                                             name="status"
//                                             type="select"
//                                             className="form-select"
//                                             value={values.status || ""}
//                                             onChange={handleInputChange}
//                                             required
//                                         >
//                                             {status.map((item, key) => (
//                                                 <React.Fragment key={key}>
//                                                     {item.options.map((item, key) => (
//                                                         <option value={item.value} key={key}>{item.label}</option>
//                                                     ))}
//                                                 </React.Fragment>
//                                             ))}
//                                         </Input>
//                                     </>
//                                 )}
//                             </Col>
//                         </Row>

//                         {/* Hidden fields to maintain compatibility with backend */}
//                         <input type="hidden" name="ownerPerson" value={values.ownerPerson || values.contactPerson} />
//                         <input type="hidden" name="ownerNumber" value={values.ownerNumber || values.contactNumber} />
//                         <input type="hidden" name="ownerEmail" value={values.ownerEmail || values.contactEmail} />
//                     </div>
//                     <div>
//                         <div className="hstack gap-2 justify-content-end" style={{ marginTop: "30px" }}>
//                             <button type="button" className="btn btn-light" onClick={toggle}>Close</button>
//                             <button type="submit" className="btn btn-success">{!!isEdit ? "Update" : "Submit"}</button>
//                         </div>
//                     </div>
//                 </ModalBody>
//             </Form>
//         </Modal>
//     );
// };

// export default EditModal;





import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col, Label, Input } from "reactstrap";

const EditModal = ({
    isOpen,
    toggle,
    isEdit,
    values,
    handleInputChange,
    handleSubmit,
    isFormValid,
    setIsFormValid,
    originalValues,
    hasChanges
}) => {
    const [touched, setTouched] = React.useState({});
    const [submitAttempted, setSubmitAttempted] = React.useState(false);

    // Reset touched state when modal opens/closes
    React.useEffect(() => {
        if (isOpen) {
            setTouched({});
            setSubmitAttempted(false);
        }
    }, [isOpen]);

    // Set default value for allowedBidding when in Add mode
    React.useEffect(() => {
        if (isOpen && !isEdit && !values.allowedBidding) {
            handleInputChange({
                target: {
                    name: 'allowedBidding',
                    value: 'No'
                }
            });
        }
    }, [isOpen, isEdit, values.allowedBidding, handleInputChange]);

    // Status options
    const status = [
        {
            options: [
                { label: "Select Status", value: "" },
                { label: "Active", value: "A" },
                { label: "Deactive", value: "D" },
            ],
        },
    ];

    // Enhanced validation functions
    const validateName = (name) => {
        if (!name || name.trim() === "") return false;
        const nameRegex = /^[A-Za-z]+( [A-Za-z]+)*$/;
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        return nameRegex.test(name.trim()) && !emojiRegex.test(name);
    };

    const validateAddress = (address) => {
        if (!address) return false;
        const addressRegex = /^[A-Za-z0-9\s,.'-]+$/;
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        return addressRegex.test(address) && !emojiRegex.test(address);
    };

    const validateContactPerson = (person) => {
        if (!person) return false;
        const personRegex = /^[A-Za-z ]+$/;
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        return personRegex.test(person) && !emojiRegex.test(person);
    };

    const validatePhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return false;
        const phoneRegex = /^[0-9]{1,10}$/;
        return phoneRegex.test(phoneNumber);
    };

    const validateEmail = (email) => {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        return emailRegex.test(email) && !emojiRegex.test(email);
    };

    const validatePrice = (price) => {
        if (!price) return false;
        const priceRegex = /^\d+(\.\d{1,2})?$/;
        return priceRegex.test(price);
    };

    const validateTaxInfo = (taxInfo) => {
        if (!taxInfo) return false;
        const taxInfoRegex = /^[a-zA-Z0-9\s\-\/&. ]+$/;
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        return taxInfoRegex.test(taxInfo) && !emojiRegex.test(taxInfo);
    };

    const validateRegionLocation = (region) => {
        if (!region) return false;
        const regionRegex = /^[a-zA-Z\s,.\-()&/ ]{2,100}$/;
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        return regionRegex.test(region) && !emojiRegex.test(region);
    };

    const validateSLA = (sla) => {
        if (!sla) return false;
        const slaRegex = /^[a-zA-Z0-9\s\-\/&.() ]+$/;
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        return slaRegex.test(sla) && !emojiRegex.test(sla);
    };

    const validatePAN = (panNumber) => {
        if (!panNumber) return false;
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(panNumber);
    };

    const validateGST = (gstNumber) => {
        if (!gstNumber) return false;
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstRegex.test(gstNumber);
    };

    // Simplified helper function to determine if field should show error
    const shouldShowError = (fieldName, isValid) => {
        return (touched[fieldName] || submitAttempted) && !isValid;
    };

    // Function to validate all required fields
    const validateAllFields = () => {
        const validations = [
            { field: 'name', isValid: validateName(values.name) },
            { field: 'address', isValid: validateAddress(values.address) },
            { field: 'contactPerson', isValid: validateContactPerson(values.contactPerson) },
            { field: 'contactNumber', isValid: validatePhoneNumber(values.contactNumber) },
            { field: 'contactEmail', isValid: validateEmail(values.contactEmail) },
            { field: 'modeTransport', isValid: !!values.modeTransport },
            { field: 'priceKm', isValid: validatePrice(values.priceKm) },
            { field: 'termPayment', isValid: !!values.termPayment },
            { field: 'taxInfo', isValid: validateTaxInfo(values.taxInfo) },
            { field: 'regionLocation', isValid: validateRegionLocation(values.regionLocation) },
            { field: 'serviceLevelAgreement', isValid: validateSLA(values.serviceLevelAgreement) },
            { field: 'gstnNo', isValid: validateGST(values.gstnNo) },
            { field: 'panNo', isValid: validatePAN(values.panNo) },
            { field: 'allowedBidding', isValid: !!(values.allowedBidding || (!isEdit ? "No" : "")) }
        ];

        // Add status validation for edit mode
        if (isEdit) {
            validations.push({ field: 'status', isValid: !!values.status });
        }

        return validations;
    };

    // Enhanced submit handler with validation
    const handleFormSubmit = (e) => {
        e.preventDefault();
        setSubmitAttempted(true);

        const validations = validateAllFields();
        const invalidFields = validations.filter(v => !v.isValid);

        if (invalidFields.length > 0) {
            console.log("Validation errors:", invalidFields);
            return false;
        }

        handleSubmit(e);
    };

    // Enhanced input change handler
    const handleInputChangeWithValidation = (e) => {
        const { name, value } = e.target;

        // Mark field as touched immediately when user starts typing
        setTouched(prev => ({ ...prev, [name]: true }));

        // Prevent leading spaces for text inputs
        const textFields = ['name', 'address', 'contactPerson', 'contactEmail', 'taxInfo', 'regionLocation', 'serviceLevelAgreement', 'code', 'priceKm', 'gstnNo', 'panNo'];
        if (textFields.includes(name)) {
            if (value.startsWith(' ')) {
                return;
            }

            // Check for emojis in text fields
            const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
            if (emojiRegex.test(value)) {
                return;
            }
        }

        // For phone number field, prevent any spaces
        if (name === 'contactNumber' && value.includes(' ')) {
            return;
        }

        // Call original handler
        handleInputChange(e);
    };

    // Handle blur events to mark fields as touched
    const handleBlur = (fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
    };

    return (
        <Modal id="showModal" isOpen={isOpen} toggle={toggle} centered size="lg">
            <ModalHeader className="bg-light p-3" toggle={toggle}>
                {!!isEdit ? "Edit Transporter" : "Add Transporter"}
            </ModalHeader>
            <Form className="tablelist-form" onSubmit={handleFormSubmit}>
                <ModalBody className="p-3">
                    <div>
                        {/* ROW 1: Transporter Code, Name, Address */}
                        <Row className="mb-1">
                            <Col md={4}>
                                <Label htmlFor="code" className="form-label">
                                    Transporter Code
                                </Label>
                                <Input
                                    type="text"
                                    id="code"
                                    name="code"
                                    placeholder="Enter Transporter Code"
                                    value={values.code || ""}
                                    onChange={handleInputChangeWithValidation}
                                    className="form-control"
                                    maxLength={50}
                                    disabled={!!isEdit}
                                />
                            </Col>

                            <Col md={4}>
                                <Label htmlFor="name" className="form-label">
                                    Transporter Name<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="name"
                                    name="name"
                                    maxLength={50}
                                    placeholder="Enter Transporter Name"
                                    value={values.name || ""}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('name')}
                                    className={`form-control ${shouldShowError('name', validateName(values.name)) ? 'is-invalid' : ''}`}
                                />
                                {shouldShowError('name', validateName(values.name)) && (
                                    <div className="invalid-feedback">
                                        Invalid name. Only letters and spaces are allowed. No emojis or special characters.
                                    </div>
                                )}
                            </Col>

                            <Col md={4}>
                                <Label htmlFor="address" className="form-label">
                                    Address<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="address"
                                    name="address"
                                    placeholder="Enter Address"
                                    value={values.address || ""}
                                    maxLength={50}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('address')}
                                    className={`form-control ${shouldShowError('address', validateAddress(values.address)) ? 'is-invalid' : ''}`}
                                />
                                {shouldShowError('address', validateAddress(values.address)) && (
                                    <div className="invalid-feedback">
                                        Invalid address. Only letters, numbers, spaces, and basic punctuation are allowed. No emojis.
                                    </div>
                                )}
                            </Col>
                        </Row>

                        {/* ROW 2: Contact Person, Phone, Email */}
                        <Row className="mb-1">
                            <Col md={4}>
                                <Label htmlFor="contactPerson" className="form-label">
                                    Contact Person<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="contactPerson"
                                    name="contactPerson"
                                    placeholder="Enter Contact Person"
                                    maxLength={30}
                                    value={values.contactPerson || ""}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('contactPerson')}
                                    className={`form-control ${shouldShowError('contactPerson', validateContactPerson(values.contactPerson)) ? 'is-invalid' : ''}`}
                                />
                                {shouldShowError('contactPerson', validateContactPerson(values.contactPerson)) && (
                                    <div className="invalid-feedback">
                                        Invalid contact person. Only letters and spaces are allowed. No emojis.
                                    </div>
                                )}
                            </Col>

                            <Col md={4}>
                                <Label htmlFor="contactNumber" className="form-label">
                                    Phone No.<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="contactNumber"
                                    name="contactNumber"
                                    placeholder="Enter Phone Number"
                                    value={values.contactNumber || ""}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('contactNumber')}
                                    className={`form-control ${shouldShowError('contactNumber', validatePhoneNumber(values.contactNumber)) ? 'is-invalid' : ''}`}
                                />
                                {shouldShowError('contactNumber', validatePhoneNumber(values.contactNumber)) && (
                                    <div className="invalid-feedback">
                                        Invalid phone number. Only numbers allowed and max 10 digits.
                                    </div>
                                )}
                            </Col>

                            <Col md={4}>
                                <Label htmlFor="contactEmail" className="form-label">
                                    Email ID<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="email"
                                    required
                                    id="contactEmail"
                                    name="contactEmail"
                                    placeholder="Enter Email ID"
                                    value={values.contactEmail || ""}
                                    maxLength={50}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('contactEmail')}
                                    className={`form-control ${shouldShowError('contactEmail', validateEmail(values.contactEmail)) ? 'is-invalid' : ''}`}
                                />
                                {shouldShowError('contactEmail', validateEmail(values.contactEmail)) && (
                                    <div className="invalid-feedback">
                                        Please enter a valid email address. No emojis allowed.
                                    </div>
                                )}
                            </Col>
                        </Row>

                        {/* ROW 3: Mode of Transport, Price, Term of Payment */}
                        <Row className="mb-1">
                            <Col md={4}>
                                <Label className="form-label">
                                    Mode Of Transport<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="select"
                                    required
                                    id="modeTransport"
                                    name="modeTransport"
                                    value={values.modeTransport || ""}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('modeTransport')}
                                    className={`form-select ${shouldShowError('modeTransport', !!values.modeTransport) ? 'is-invalid' : ''}`}
                                >
                                    <option value="">Select Mode</option>
                                    <option value="Road">Road</option>
                                    <option value="Rail">Rail</option>
                                    <option value="Air">Air</option>
                                    <option value="Sea">Sea</option>
                                    <option value="Multimodal">Multimodal</option>
                                </Input>
                                {shouldShowError('modeTransport', !!values.modeTransport) && (
                                    <div className="invalid-feedback">
                                        Please select a mode of transport.
                                    </div>
                                )}
                            </Col>

                            <Col md={4}>
                                <Label className="form-label">
                                    Price (Per KM)<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="priceKm"
                                    name="priceKm"
                                    placeholder="Enter Price Per KM"
                                    value={values.priceKm || ""}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('priceKm')}
                                    className={`form-control ${shouldShowError('priceKm', validatePrice(values.priceKm)) ? 'is-invalid' : ''}`}
                                />
                                {shouldShowError('priceKm', validatePrice(values.priceKm)) && (
                                    <div className="invalid-feedback">
                                        Price must be a valid number (e.g., 25 or 25.50).
                                    </div>
                                )}
                            </Col>

                            <Col md={4}>
                                <Label htmlFor="termsOfPayment" className="form-label">
                                    Term of Payment<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="select"
                                    required
                                    id="termPayment"
                                    name="termPayment"
                                    value={values.termPayment || ""}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('termPayment')}
                                    className={`form-select ${shouldShowError('termPayment', !!values.termPayment) ? 'is-invalid' : ''}`}
                                >
                                    <option value="">Select Term</option>
                                    <option value="Online">Online</option>
                                    <option value="Cash">Cash</option>
                                </Input>
                                {shouldShowError('termPayment', !!values.termPayment) && (
                                    <div className="invalid-feedback">
                                        Please select a payment term.
                                    </div>
                                )}
                            </Col>
                        </Row>

                        {/* ROW 4: Tax Information, Region, Service Level Agreement */}
                        <Row className="mb-1">
                            <Col md={4}>
                                <Label htmlFor="taxInformation" className="form-label">
                                    Tax Information<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="taxInfo"
                                    name="taxInfo"
                                    placeholder="Enter Tax Information"
                                    value={values.taxInfo || ""}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('taxInfo')}
                                    className={`form-control ${shouldShowError('taxInfo', validateTaxInfo(values.taxInfo)) ? 'is-invalid' : ''}`}
                                />
                                {shouldShowError('taxInfo', validateTaxInfo(values.taxInfo)) && (
                                    <div className="invalid-feedback">
                                        Invalid format. Only letters, numbers, spaces, -, /, &, and . are allowed. No emojis.
                                    </div>
                                )}
                            </Col>

                            <Col md={4}>
                                <Label htmlFor="regionLocation" className="form-label">
                                    Region/Location<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="regionLocation"
                                    name="regionLocation"
                                    placeholder="Enter Region/Location"
                                    value={values.regionLocation || ""}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('regionLocation')}
                                    className={`form-control ${shouldShowError('regionLocation', validateRegionLocation(values.regionLocation)) ? 'is-invalid' : ''}`}
                                />
                                {shouldShowError('regionLocation', validateRegionLocation(values.regionLocation)) && (
                                    <div className="invalid-feedback">
                                        Invalid format. Only letters, numbers, spaces, and basic punctuation are allowed. No emojis.
                                    </div>
                                )}
                            </Col>

                            <Col md={4}>
                                <Label htmlFor="serviceLevelAgreement" className="form-label">
                                    Service Level Agreement<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="serviceLevelAgreement"
                                    name="serviceLevelAgreement"
                                    placeholder="Enter SLA"
                                    value={values.serviceLevelAgreement || ""}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('serviceLevelAgreement')}
                                    className={`form-control ${shouldShowError('serviceLevelAgreement', validateSLA(values.serviceLevelAgreement)) ? 'is-invalid' : ''}`}
                                />
                                {shouldShowError('serviceLevelAgreement', validateSLA(values.serviceLevelAgreement)) && (
                                    <div className="invalid-feedback">
                                        Invalid format. Only letters, numbers, spaces, -, /, &, ., and () are allowed. No emojis.
                                    </div>
                                )}
                            </Col>
                        </Row>

                        {/* ROW 5: GST No., PAN No., Allowed Bidding */}
                        <Row className="mb-1">
                            <Col md={4}>
                                <Label htmlFor="gstnNo" className="form-label">
                                    GST No.<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="gstnNo"
                                    name="gstnNo"
                                    placeholder="Enter GST No."
                                    value={values.gstnNo || ""}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('gstnNo')}
                                    className={`form-control ${shouldShowError('gstnNo', validateGST(values.gstnNo)) ? 'is-invalid' : ''}`}
                                />
                                {shouldShowError('gstnNo', validateGST(values.gstnNo)) && (
                                    <div className="invalid-feedback">
                                        Invalid GST format. Should be like: 27AAPFU0939F1ZV
                                    </div>
                                )}
                            </Col>

                            <Col md={4}>
                                <Label htmlFor="panNo" className="form-label">
                                    PAN No.<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="panNo"
                                    name="panNo"
                                    placeholder="Enter PAN No."
                                    value={values.panNo || ""}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('panNo')}
                                    className={`form-control ${shouldShowError('panNo', validatePAN(values.panNo)) ? 'is-invalid' : ''}`}
                                />
                                {shouldShowError('panNo', validatePAN(values.panNo)) && (
                                    <div className="invalid-feedback">
                                        Invalid PAN format. Should be like: ABCDE1234F
                                    </div>
                                )}
                            </Col>

                            <Col md={4}>
                                <Label htmlFor="allowedBidding" className="form-label">
                                    Allowed for Bidding<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="select"
                                    required
                                    id="allowedBidding"
                                    name="allowedBidding"
                                    value={values.allowedBidding ?? (isEdit ? "" : "No")}
                                    onChange={handleInputChangeWithValidation}
                                    onBlur={() => handleBlur('allowedBidding')}
                                    className={`form-select ${shouldShowError('allowedBidding', !!(values.allowedBidding || (!isEdit ? "No" : ""))) ? 'is-invalid' : ''}`}
                                >
                                    {!isEdit ? (
                                        <>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="">Select Option</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </>
                                    )}
                                </Input>
                                {shouldShowError('allowedBidding', !!(values.allowedBidding || (!isEdit ? "No" : ""))) && (
                                    <div className="invalid-feedback">
                                        Please select allowed bidding option.
                                    </div>
                                )}
                            </Col>
                        </Row>

                        {/* ROW 6: Rating/Status */}
                        <Row className="mb-1">
                            <Col md={4}>
                                <Label htmlFor="transporterRating" className="form-label">
                                    Rating (auto Calculated)
                                </Label>
                                <div className="mt-2">
                                    <div className="rating-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} className="star me-1">
                                                <i className={`ri-star-${parseInt(values.transporterRating || 0) >= star ? 'fill' : 'line'} text-warning fs-16`}></i>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Col>

                            <Col md={4}>
                                {isEdit && (
                                    <>
                                        <Label className="form-label">Status<span style={{ color: "red" }}>*</span></Label>
                                        <Input
                                            name="status"
                                            type="select"
                                            className={`form-select ${shouldShowError('status', !!values.status) ? 'is-invalid' : ''}`}
                                            value={values.status || ""}
                                            onChange={handleInputChangeWithValidation}
                                            onBlur={() => handleBlur('status')}
                                            required
                                        >
                                            {status.map((item, key) => (
                                                <React.Fragment key={key}>
                                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </Input>
                                        {shouldShowError('status', !!values.status) && (
                                            <div className="invalid-feedback">
                                                Please select a status.
                                            </div>
                                        )}
                                    </>
                                )}
                            </Col>
                        </Row>
                        {/* Hidden fields to maintain compatibility with backend */}
                        <input type="hidden" name="ownerPerson" value={values.ownerPerson || values.contactPerson} />
                        <input type="hidden" name="ownerNumber" value={values.ownerNumber || values.contactNumber} />
                        <input type="hidden" name="ownerEmail" value={values.ownerEmail || values.contactEmail} />
                    </div>
                </ModalBody>
                
                <ModalFooter>
                    <div className="hstack gap-2 justify-content-end w-100">
                        <button type="button" className="btn btn-light" onClick={toggle}>
                            Close
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={
                                isEdit
                                    ? !hasChanges || !validateAllFields().every(v => v.isValid)
                                    : !validateAllFields().every(v => v.isValid)
                            }
                        >
                            {isEdit ? "Submit" : "Submit"}
                        </button>
                    </div>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

export default EditModal;


