import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, CardBody, Collapse } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import '../IndentSummary/indentSummary.css';
import 'react-toastify/dist/ReactToastify.css';
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
const useStyles = makeStyles({
    customTextField: {
        "& input::placeholder": {
            fontSize: "0.9rem"
        }
    }
});

const ViewRejectedStatus = (data) => {
    console.log(JSON.stringify(data))
    const classes = useStyles();
    const [col1, setcol1] = useState(true)
    const [col3, setcol3] = useState(true)

    function togglecol1() {
        setcol1(!col1)
    }
    function togglecol3() {
        setcol3(!col3)
    }
    return (
        <React.Fragment>


            <ModalBody>

                <div className="col-lg-4 float-start text-center" style={{width:"200px", marginLeft:"30px"}}>
                    <div className="col-lg-12" >
                        <div className="sticky-side-div">
                            <div className="ribbon-box border shadow-none right card">
                                <div className="ribbon-two ribbon-two-danger"><span><i className="ri-fire-fill align-bottom"></i></span>
                                </div>
                                <img src={process.env.PUBLIC_URL + "/subImage/" + data.data.singleData.material_image} alt="" className="img-fluid rounded" />

                            </div>
                        </div>

                    </div>

                </div>
                <div className="col-lg-8 float-start text-center">
                    <h5 className="mt-3"><b>Indent No : </b>{data.data.singleData.indentNo}</h5>
                    <h6 className="mt-3"><b>Indent Status : </b>{'Rejected'}</h6>
                    <h6 className="mt-3"><b>Remarks : </b>{'Rejected'}</h6>
                    <p className="mt-3"><b>Material Code : </b>{data.data.singleData.product}</p>
                    <p className="mt-3"><b>Material Name : </b>{data.data.singleData.mateialName}</p>
                    
                </div>
            </ModalBody>
        </React.Fragment >
    )
}

export default ViewRejectedStatus;