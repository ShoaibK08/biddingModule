import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

const ThemeDropdown = ({ layoutMode, onChangeLayoutMode }) => {

    const ddCSS = {
        width: "13%",
        position: "absolute",
        right: "5%",
        color: "#fff"

    }
    const [values, setValues] = useState("");

    const handleInputChange = (e) => {
        
        const { name, value } = e.target;
        setValues(value);
        onChangeLayoutMode(value)
    };

    return (
        <>
            <div style={ddCSS}>
                <Label className="form-label text-dark" >Select Theme</Label>
                <Input
                    name="status"
                    type="select"
                    className="form-select"
                    value={values.status}
                    onChange={handleInputChange}
                    required
                >
                    <option value="light" style={{backgroundColor:"#405189", color:"white"}}>Default</option>
                    <option value="dark" style={{backgroundColor:"#212529", color:"white"}}>Dark</option>
                    <option value="success" style={{backgroundColor:"#c8efe0", color:"white"}}>Green</option>
                    <option value="danger" style={{backgroundColor:"red", color:"white"}}>Red</option>
                </Input>
            </div>
        </>
    );
};

export default ThemeDropdown;