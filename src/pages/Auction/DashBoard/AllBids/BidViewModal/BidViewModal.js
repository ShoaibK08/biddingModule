import React, { useMemo } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import TableContainer from "../../../../../Components/Common/TableContainer";
import "./viewModal.css";

const BidViewModal = ({ isOpen, toggle, soNumber }) => {
    // Sample data with all columns from the three images
    const orderDetailsData = [
        {
            id: 1,
            salesOrderNo: "SO23456",
            validityStartDate: "18/02/2025 01:00",
            validityEndDate: "10/02/2025 05:00",
            orderQty: "100 Tan",
            remainingQty: "80 Tan",
            orderType: "Ship",
            blockedSoldId: "SO23456",
            cityDesc: "Mumbai",
            countryDesc: "India",
            distributionChannel: "Road",
            routeCode: "RN102",
            routeDesc: "N/A",
            shipToParty: "Ship1",
            shipToPartyName: "ship name 1",
            shipToRegion: "India",
            division: "N/A"
        },
        {
            id: 2,
            salesOrderNo: "SO45734",
            validityStartDate: "18/02/2025 01:00",
            validityEndDate: "10/02/2025 05:00",
            orderQty: "200 Tan",
            remainingQty: "134 Tan",
            orderType: "Ship",
            blockedSoldId: "SO45734",
            cityDesc: "Delhi",
            countryDesc: "China",
            distributionChannel: "Ship",
            routeCode: "RN103",
            routeDesc: "N/A",
            shipToParty: "Ship2",
            shipToPartyName: "ship name 2",
            shipToRegion: "Malaysia",
            division: "N/A"
        },
        {
            id: 3,
            salesOrderNo: "SO89342",
            validityStartDate: "18/02/2025 01:00",
            validityEndDate: "10/02/2025 05:00",
            orderQty: "250 Tan",
            remainingQty: "125 Tan",
            orderType: "Ship",
            blockedSoldId: "SO89342",
            cityDesc: "Chennai",
            countryDesc: "UAE",
            distributionChannel: "Flight",
            routeCode: "RN108",
            routeDesc: "N/A",
            shipToParty: "Ship3",
            shipToPartyName: "ship name 3",
            shipToRegion: "UAE",
            division: "N/A"
        },
        {
            id: 4,
            salesOrderNo: "SO87344",
            validityStartDate: "18/02/2025 01:00",
            validityEndDate: "10/02/2025 05:00",
            orderQty: "243 Tan",
            remainingQty: "143 Tan",
            orderType: "Ship",
            blockedSoldId: "SO87344",
            cityDesc: "Lucknow",
            countryDesc: "Malaysia",
            distributionChannel: "Road",
            routeCode: "RN104",
            routeDesc: "N/A",
            shipToParty: "Ship4",
            shipToPartyName: "ship name 4",
            shipToRegion: "US",
            division: "N/A"
        },
        {
            id: 5,
            salesOrderNo: "SO87344",
            validityStartDate: "18/02/2025 01:00",
            validityEndDate: "10/02/2025 05:00",
            orderQty: "243 Tan",
            remainingQty: "143 Tan",
            orderType: "Ship",
            blockedSoldId: "SO87344",
            cityDesc: "Lucknow",
            countryDesc: "Malaysia",
            distributionChannel: "Road",
            routeCode: "RN104",
            routeDesc: "N/A",
            shipToParty: "Ship4",
            shipToPartyName: "ship name 4",
            shipToRegion: "US",
            division: "N/A"
        }
    ];

    // All columns from the three images
    const columns = useMemo(() => [
        {
            Header: "Sales Order No.",
            accessor: "salesOrderNo",
            filterable: false,
        },
        {
            Header: "Validity Start Date",
            accessor: "validityStartDate",
            filterable: false,
        },
        {
            Header: "Validity End Date",
            accessor: "validityEndDate",
            filterable: false,
        },
        {
            Header: "Order Qty.",
            accessor: "orderQty",
            filterable: false,
        },
        {
            Header: "Remaining Qty.",
            accessor: "remainingQty",
            filterable: false,
        },
        {
            Header: "Order Type",
            accessor: "orderType",
            filterable: false,
        },
        {
            Header: "Blocked/Solnd",
            accessor: "blockedSoldId",
            filterable: false,
        },
        {
            Header: "City Desc.",
            accessor: "cityDesc",
            filterable: false,
        },
        {
            Header: "Country Desc.",
            accessor: "countryDesc",
            filterable: false,
        },
        {
            Header: "Distribution Channel",
            accessor: "distributionChannel",
            filterable: false,
        },
        {
            Header: "Route Code",
            accessor: "routeCode",
            filterable: false,
        },
        {
            Header: "Route Desc.",
            accessor: "routeDesc",
            filterable: false,
        },
        {
            Header: "Ship to Party",
            accessor: "shipToParty",
            filterable: false,
        },
        {
            Header: "Ship to Party Name",
            accessor: "shipToPartyName",
            filterable: false,
        },
        {
            Header: "Ship to Region",
            accessor: "shipToRegion",
            filterable: false,
        },
        {
            Header: "Division",
            accessor: "division",
            filterable: false,
        }
    ], []);

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered size="xl" className="so-view-modal">
            <ModalHeader toggle={toggle} className="modal-title-header">
                SO Details: {soNumber}
            </ModalHeader>
            <ModalBody>
                <TableContainer
                    columns={columns}
                    data={orderDetailsData}
                    isGlobalFilter={true}
                    isAddUserList={false}
                    customPageSize={5}
                    isGlobalSearch={true}
                    className="custom-header-css"
                    divClass="overflow-auto"
                    tableClass="width-180"
                    SearchPlaceholder='Search for details...'
                />
            </ModalBody>
        </Modal>
    );
};

export default BidViewModal;