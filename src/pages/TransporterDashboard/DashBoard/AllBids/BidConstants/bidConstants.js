// Sample data for testing UI based on the images
export const sampleData = [
    {
        id: 12345,
        bidNo: "B123",
        routeNo: "RN123",
        bidStartTime: "12/02/2025 10:23 AM",
        fromLocation: "Mumbai",
        toLocation: "Delhi",
        distance: "765 KM",
        time: "24 Hours",
        material: "Iron",
        quantity: "130 Tan",
        ceilingPrice: "Iron",
        intervalPrice: "130 Tan",
        cityName: "Iron",
        lineNo: "130 Tan",
        lastBid: "12,00,000",
        multipleOrder: "Yes",
        status: "Completed",
        rank: "Winner",
        transporterName: "Jaya Roadways"
    },
    {
        id: 12346,
        bidNo: "B123",
        routeNo: "RN123",
        bidStartTime: "12/02/2025 10:23 AM",
        fromLocation: "Mumbai",
        toLocation: "Delhi",
        distance: "765 KM",
        time: "24 Hours",
        material: "Iron",
        quantity: "130 Tan",
        ceilingPrice: "Iron",
        intervalPrice: "130 Tan",
        cityName: "Iron",
        lineNo: "130 Tan",
        lastBid: "12,00,000",
        multipleOrder: "Yes",
        status: "Running",
        rank: "1",
        transporterName: "J & K Transporter"
    },
    {
        id: 12347,
        bidNo: "B123",
        routeNo: "RN123",
        bidStartTime: "12/02/2025 10:23 AM",
        fromLocation: "Mumbai",
        toLocation: "Delhi",
        distance: "765 KM",
        time: "24 Hours",
        material: "Iron",
        quantity: "130 Tan",
        ceilingPrice: "Iron",
        intervalPrice: "130 Tan",
        cityName: "Iron",
        lineNo: "130 Tan",
        lastBid: "12,00,000",
        multipleOrder: "Yes",
        status: "To Be Started",
        rank: "Not Started",
        transporterName: ""
    }
];

export const initialValues = {
    bidNo: "",
    routeNo: "",
    bidStartTime: new Date(),
    fromLocation: "",
    toLocation: "",
    distance: "",
    time: "",
    material: "",
    quantity: "",
    ceilingPrice: "",
    intervalPrice: "",
    cityName: "",
    lineNo: "",
    lastBid: "",
    multipleOrder: "Yes",
    status: "Running",
    rank: "",
    transporterName: "",
};

export const statusOptions = [
    {
        options: [
            { label: "Select Status", value: "" },
            { label: "Running", value: "Running" },
            { label: "Completed", value: "Completed" },
            { label: "To Be Started", value: "To Be Started" },
        ],
    },
];

export const materialTypes = [
    {
        options: [
            { label: "Select Material", value: "" },
            { label: "Iron", value: "Iron" },
            { label: "Steel", value: "Steel" },
            { label: "Aluminum", value: "Aluminum" },
            { label: "Copper", value: "Copper" },
        ],
    },
];

export const multipleOrderOptions = [
    {
        options: [
            { label: "Select", value: "" },
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
        ],
    },
];