import React from "react";
import { Link } from "react-router-dom";
import * as moment from "moment";

const handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
};


const OrdersId = (cell) => {
    return (
        <React.Fragment>
            <Link to="/apps-tasks-details" className="fw-medium link-primary">{cell.value}</Link>
        </React.Fragment>
    );
};

const Project = (cell) => {
    return (
        <React.Fragment>
            <Link to="/apps-projects-overview" className="fw-medium link-primary">{cell.value}</Link>
        </React.Fragment>
    );
};

const Tasks = (cell, onEditIconClick, onDeleteIconClick) => {
    return (
        <React.Fragment>
            <div className="d-flex">
                <div className="flex-grow-1 tasks_name">{cell.value}</div>
                <div className="flex-shrink-0 ms-4">
                    <ul className="list-inline tasks-list-menu mb-0">
                        <li className="list-inline-item">
                            <Link to="/apps-tasks-details">
                                <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
                            </Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to="#" onClick={onEditIconClick}>
                                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                            </Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to="#" className="remove-item-btn" onClick={onDeleteIconClick}>
                                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
};

const CreateBy = (cell) => {
    return (
        <React.Fragment>
            {cell.value}
        </React.Fragment>
    );
};

const AssignedTo = (cell) => {
    return (
        <React.Fragment>
            <div className="avatar-group">
                {(cell.value || []).map((item, index) => (
                    <Link key={index} to="#" className="avatar-group-item">
                        <img src={item.img} alt="" className="rounded-circle avatar-xxs" />
                    </Link>
                ))}
            </div>
        </React.Fragment>
    );
};

const DueDate = (cell) => {
    return (
        <React.Fragment>
            {handleValidDate(cell.value)}
        </React.Fragment>
    );
};

const Status = (cell) => {
    return (
        <React.Fragment>
            {cell.value === "B" ?
                <span className="badge badge-soft-secondary text-uppercase">{"Blocked"}</span>
                :
                cell.value === "New" ?
                    <span className="badge badge-soft-info text-uppercase">{cell.value}</span>
                    : cell.value === "A" ?
                        <span className="badge badge-soft-success text-uppercase">{"Active"}</span>
                        : cell.value === "D" ?
                            <span className="badge badge-soft-warning text-uppercase">{"Deactive"}</span>
                            : null
            }
        </React.Fragment>
    );
};
const priorityStatusMap = {
    1: "bg-yellow",     // assigned
    2: "bg-green-commit",     // committed
    3: "bg-turquise",        // truckallocated
    4: "bg-warning",      // rejected
    5: "bg-danger",   // cancelled
    0: "bg-gray",        // notassigned
};

const statusTextMap = {
    1: "Assigned",
    2: "Committed",
    3: "Truck Allocated",
    4: "Rejected",
    5: "Cancelled",
    0: "Not Assigned",
};

const Priority = ({ data }) => {
    const bgClass = priorityStatusMap[data] || "bg-secondary";
    const label = statusTextMap[data] || "unknown";

    return (
        <span style={{padding:"5px",textTransform:"capitalize !important"}} className={`btn ${bgClass}`}>
        {label}
        </span>
    );
};  

// const Priority = (cell) => {
//     return (
//         <React.Fragment>
//             {cell.value === "Inprogress" ?
//                 <span className="badge bg-warning text-uppercase">{cell.value}</span>
//                 :
//                 cell.value === "Pending" ?
//                     <span className="badge bg-danger text-uppercase">{cell.value}</span>
//                     : cell.value === "Assigned" ?
//                         <span className="badge bg-success text-uppercase">{cell.value}</span>
//                         : null
//             }
//         </React.Fragment>
//     );
// };
  
// const Priority = (cell) => {
//     const value = cell.value?.toLowerCase();
//     const badgeClass = priorityStatusMap[value] || "badge-soft-secondary";
  
//     return (
//       <span className={`badge text-uppercase ${badgeClass}`}>
//         {cell.value}
//       </span>
//     );
//   };
  

export { OrdersId, Project, Tasks, CreateBy, AssignedTo, DueDate, Status, Priority };