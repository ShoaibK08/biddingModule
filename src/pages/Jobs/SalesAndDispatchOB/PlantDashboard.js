import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody, DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown, Table } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderNew from "../../../Components/Common/Loader_new";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import TableContainer from "../../../Components/Common/TableContainer";
import company1 from "../../../assets/images/d-1.png";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";


const PlantDashboard = () => {

    const [isExportCSV, setIsExportCSV] = useState(false);
    const [plantCode, setPlantCode] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedData, setSelectedData] = useState(null);
    const [LocationName, setLocationName] = useState("");
    const [loader, setloader] = useState(false);

    useEffect(() => {
        sessionStorage.getItem("authUser");
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantCode = obj.data.plantCode;
        setPlantCode(plantCode);
        getAllData(plantCode);
    }, []);

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            username: process.env.REACT_APP_API_USER_NAME,
            password: process.env.REACT_APP_API_PASSWORD,
        },
    };

    const getAllData = async (plantCode) => {
        debugger;
        setloader(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sales-dispatch-dashboard/getmaterialWiseStageData/${plantCode}`, config)
                .then(res => {
                    const data = res.message;
                    if (data) {
                        setAllData(data);
                        setOriginalData(data);
                        setloader(false);
                    }
                    else {
                        setAllData([]);
                        setOriginalData([]);
                        setloader(false);
                    }

                });
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        // Function to be executed every 10 seconds
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantCode = obj.data.plantCode;
        const myFunction = () => {
            console.log('Function is running every 10 seconds');
            axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/sales-dispatch-dashboard/getmaterialWiseStageData/${plantCode}`, config)
                .then(res => {
                    const data = res.message;
                    setAllData(data);
                });
        };

        // Set interval to run the function every 10 seconds
        const intervalId = setInterval(myFunction, 10000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this runs only once after the initial render

    const refreshData = async (e) => {
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantCode = obj.data.plantCode;
        setPlantCode(plantCode);
        toast.success("Data refreshed successfully.", { autoClose: 3000 });
        getAllData(plantCode);
    }



    const handleClick = (data, LocationName) => {
        setSelectedData(data);
        setLocationName(LocationName);
        console.log(data);
        setViewModal();
    };

    const [documentModal, setDocumentModal] = useState(false);

    const setViewModal = () => {
        setDocumentModal(!documentModal);
    };

    useEffect(() => {
        const searchData = originalData.filter((material) =>
            material.materialName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setAllData(searchData);
    }, [searchTerm, originalData]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
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
            // {
            //     Header: 'Sr No.',
            //     accessor: (_, index) => tableCountData.length - index, // Calculate index in reverse
            //     disableFilters: true,
            // },
            {
                Header: "Trip Id",
                accessor: "tripId",
                filterable: false,
            },
            {
                Header: "Vehicle Number",
                accessor: "vehicleNumber",
                filterable: false,
            },
            {
                Header: "Material Name",
                accessor: "name",
                filterable: false,
            },
            {
                Header: "Material Code",
                accessor: "code",
                filterable: false,
            },
            {
                Header: "Stage Name",
                accessor: "mapPlantStageLocation",
                filterable: false,
            },
        ],
    );

    const handleDownload = async (e) => {
        e.preventDefault();
        downloadCSV();
        setIsExportCSV(false)
    };

    const downloadCSV = () => {
        const bl = [];
        columns.forEach((row) => {
            if (row.accessor !== undefined && row.accessor !== 'id') {
                bl.push(row.accessor + "$$$" + row.Header);
            }
        });
        const bla = [];
        selectedData.forEach((row1) => {
            const blp = {};
            bl.forEach((rows2) => {
                const pl = rows2.split("$$$");
                if (pl[0] === 'status') {
                    blp[pl[1]] = (row1[pl[0]] === 1 ? 'Active' : 'Deactive');
                } else if (pl[0] === 'quantity') {
                    blp[pl[1]] = row1[pl[0]] + " " + row1["unitMeasurement"];
                } else {
                    blp[pl[1]] = row1[pl[0]];
                }
            });
            bla.push(blp);
        });
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        // Convert the data to a worksheet
        const ws = XLSX.utils.json_to_sheet(bla, { header: Object.keys(bla[0]) });
        // Apply styling to the header row
        ws["!cols"] = [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }]; // Example: Set column widths
        // ws["A1"].s = { // Style for the header cell A1
        //     fill: {
        //         fgColor: { rgb: "FFFF00" } // Yellow background color
        //     },
        //     font: {
        //         bold: true,
        //         color: { rgb: "000000" } // Black font color
        //     }
        // };
        // Add more styling options as needed

        // Add the worksheet to the workbook

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Generate an XLSX file
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Convert binary string to Blob
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        // Save the Blob as a file using FileSaver
        FileSaver.saveAs(blob, `${LocationName}.xlsx`);

        // Utility function to convert a string to an ArrayBuffer
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buf;
        }
    };



    document.title = "Material Wise Dashboard";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Material Wise Dashboard" pageTitle="Dashboard" />
                    <Card>
                        <CardHeader className="border-0 rounded">
                            <Row className="g-2 d-flex align-items-center">
                                <Col xl={4}>
                                    <div className="search-box">
                                        <Input
                                            type="text"
                                            className="form-control search"
                                            placeholder="Search for material name..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </Col>
                                <div className="col-lg-auto ms-auto">
                                    <div className="hstack gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-info"
                                            title="Refresh Data"
                                            onClick={refreshData}
                                        >
                                            <i className="ri-refresh-line align-bottom me-1"></i>{" "}
                                        </button>
                                    </div>
                                </div>
                            </Row>
                        </CardHeader>
                    </Card>
                    <Row className="mt-4">
                    {loader && <LoaderNew></LoaderNew>}
                        {allData.map((data) => (
                            <React.Fragment key={data.materialName}>
                                <Col xl={3} lg={6} sm={6}>
                                    <Card className="ribbon-box right overflow-hidden">
                                        <div className="rotate_div rounded text-center" title={data.materialName}>
                                            <h6 className="mb-1 text-primary text-bold" style={{ padding: "0px 15px", width: "170px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.materialName}</h6>
                                        </div>
                                        <CardBody className="text-center p-3 ps-5">
                                            <div className="ribbon ribbon-info ribbon-shape">
                                                <span className="trending-ribbon-text ">{data.code}</span>
                                            </div>
                                            <div style={{ position: "absolute", top: "8px", left: "10px", borderRadius: "50%" }} className="shadow_light">
                                                <img src={company1} alt="" height="65" />
                                            </div>
                                            <Row style={{ marginTop: "30px" }}>
                                                <Col sm={12}>
                                                    <ul style={{ listStyle: "none", padding: "0", fontSize: "11px", margin: "0" }}>
                                                        <li>
                                                            <span className="badge bg-success text-success align-middle rounded-pill ms-1">M</span> <label className="fw-bold text-primary">With DO</label>
                                                            <span className="badge bg-danger text-danger align-middle rounded-pill ms-1">M</span> <label className="fw-bold text-primary">Without DO</label>
                                                        </li>
                                                    </ul>
                                                </Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col lg={6} className="">
                                                    <span className="text-primary fw-bold">Stages</span>
                                                </Col>
                                                <Col lg={6} className="p-0">
                                                    <span className="text-primary fw-bold">Count Details</span>
                                                </Col>
                                            </Row>


                                            {data.stage.map((stage, index) => (
                                                <Row className="shadow_light rounded m-2" key={index}>
                                                    {stage.location === "YARD-IN" ? (
                                                        <Col lg={6} className="border-end-dashed border-end bg-light">
                                                            <span className="text-muted">{stage.location}</span>
                                                        </Col>
                                                    ) :
                                                        (
                                                            <Col lg={8} className="border-end-dashed border-end bg-light">
                                                                <span className="text-muted">{stage.location}</span>
                                                            </Col>
                                                        )
                                                    }
                                                    {stage.subStage.map((subStage, subIndex) => (
                                                        <div style={{ display: "contents" }} key={subIndex}>
                                                            {stage.location === "YARD-IN" ? (
                                                                <>
                                                                    {subStage.subStage === "With-DO" ? (
                                                                        <Col lg={3} className="border-end-dashed border-end bisque" onClick={() => handleClick(subStage.data, stage.location)} style={{ cursor: "pointer" }}>
                                                                            <span className="text-success fw-bold text-decoration-underline">{subStage.count}</span>
                                                                        </Col>
                                                                    ) :
                                                                        subStage.subStage === "No data" ? (
                                                                            <Col lg={3} className="border-end-dashed border-end bisque" onClick={() => handleClick(subStage.data, stage.location)} style={{ cursor: "pointer" }}>
                                                                                <span className="text-success fw-bold text-decoration-underline">{subStage.count}</span>
                                                                            </Col>
                                                                        ) :
                                                                            (
                                                                                <Col lg={3} className="border-end-dashed border-end bisque" onClick={() => handleClick([], stage.location)} style={{ cursor: "pointer" }}>
                                                                                    <span className="text-success fw-bold text-decoration-underline">{"0"}</span>
                                                                                </Col>
                                                                            )
                                                                    }
                                                                    {subStage.subStage === "WithOut-DO" ? (
                                                                        <Col lg={3} className="border-end-dashed border-end bisque" onClick={() => handleClick(subStage.data, stage.location)} style={{ cursor: "pointer" }}>
                                                                            <span className="text-danger fw-bold text-decoration-underline">{subStage.count}</span>
                                                                        </Col>
                                                                    ) :
                                                                        subStage.subStage === "No data" ? (
                                                                            <Col lg={3} className="border-end-dashed border-end bisque" onClick={() => handleClick(subStage.data, stage.location)} style={{ cursor: "pointer" }}>
                                                                                <span className="text-danger fw-bold text-decoration-underline">{subStage.count}</span>
                                                                            </Col>
                                                                        ) :
                                                                            (
                                                                                <Col lg={3} className="border-end-dashed border-end bisque" onClick={() => handleClick([], stage.location)} style={{ cursor: "pointer" }}>
                                                                                    <span className="text-danger fw-bold text-decoration-underline">{"0"}</span>
                                                                                </Col>
                                                                            )
                                                                    }
                                                                </>
                                                            ) : (
                                                                subStage.subStage === "With-DO" ? (
                                                                    <Col lg={4} className="bisque" onClick={() => handleClick(subStage.data, stage.location)} style={{ cursor: "pointer" }}>
                                                                        <span className="text-success fw-bold text-decoration-underline">{subStage.count}</span>
                                                                    </Col>
                                                                ) :
                                                                    subStage.subStage === "No data" ? (
                                                                        <Col lg={4} className="bisque" onClick={() => handleClick(subStage.data, stage.location)} style={{ cursor: "pointer" }}>
                                                                            <span className="text-success fw-bold text-decoration-underline">{subStage.count}</span>
                                                                        </Col>
                                                                    ) : null
                                                            )}
                                                        </div>
                                                    ))}

                                                </Row>
                                            ))}



                                        </CardBody>
                                    </Card>
                                </Col>
                            </React.Fragment>
                        ))}


                    </Row>
                </Container>
            </div>

            <Modal isOpen={documentModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="xl" toggle={setViewModal}>
                <ModalHeader toggle={setViewModal} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
                    <h5 className="text-white fs-20">{`${LocationName} Details`}</h5>
                </ModalHeader>
                <ModalBody>
                    <div className="product-content mt-0">
                        <ExportCSVModal
                            show={isExportCSV}
                            onCloseClick={() => setIsExportCSV(false)}
                            onDownloadClick={handleDownload}
                            data={selectedData}
                        />
                        {" "}
                        <button style={{ float: "right" }} type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                            <i className="ri-file-download-line align-bottom me-1"></i>
                        </button>
                        <TableContainer
                            columns={columns}
                            data={selectedData}
                            isGlobalFilter={true}
                            isAddUserList={false}
                            customPageSize={5}
                            isGlobalSearch={true}
                            className="custom-header-css"
                            isCustomerFilter={false}
                            SearchPlaceholder='Search...'
                            style={{ maxWidth: '100%', width: '100%', overflowX: 'auto' }}
                        />
                    </div>
                </ModalBody>
            </Modal>

            <ToastContainer closeButton={false} limit={1} />

        </React.Fragment>
    );
};

export default PlantDashboard;
