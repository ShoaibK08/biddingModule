import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownMenu, DropdownToggle, Form, Offcanvas, OffcanvasBody, OffcanvasHeader, Button, Row, Col, Card, CardBody } from 'reactstrap';

//import images
import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";

//import Components
import SearchOption from '../Components/Common/SearchOption';
import LanguageDropdown from '../Components/Common/LanguageDropdown';
import WebAppsDropdown from '../Components/Common/WebAppsDropdown';
import MyCartDropdown from '../Components/Common/MyCartDropdown';
import FullScreenDropdown from '../Components/Common/FullScreenDropdown';
import NotificationDropdown from '../Components/Common/NotificationDropdown';
import ProfileDropdown from '../Components/Common/ProfileDropdown';
import LightDark from '../Components/Common/LightDark';
import SimpleBar from 'simplebar-react';

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
    const [isRight, setIsRight] = useState(false);
    const [search, setSearch] = useState(false);
    const [checkFlag, setChecked] = useState("checked");
    const toogleSearch = () => {
        setSearch(!search);
    };

    const toogleMenuBtn = () => {
        var windowSize = document.documentElement.clientWidth;

        if (windowSize > 767)
            document.querySelector(".hamburger-icon").classList.toggle('open');

        //For collapse horizontal menu
        if (document.documentElement.getAttribute('data-layout') === "horizontal") {
            document.body.classList.contains("menu") ? document.body.classList.remove("menu") : document.body.classList.add("menu");
        }

        //For collapse vertical menu
        if (document.documentElement.getAttribute('data-layout') === "vertical") {
            if (windowSize < 1025 && windowSize > 767) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'sm') ? document.documentElement.setAttribute('data-sidebar-size', '') : document.documentElement.setAttribute('data-sidebar-size', 'sm');
            } else if (windowSize > 1025) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'lg') ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'lg');
            } else if (windowSize <= 767) {
                document.body.classList.add('vertical-sidebar-enable');
                document.documentElement.setAttribute('data-sidebar-size', 'lg');
            }
        }

        //Two column menu
        if (document.documentElement.getAttribute('data-layout') === "twocolumn") {
            document.body.classList.contains('twocolumn-panel') ? document.body.classList.remove('twocolumn-panel') : document.body.classList.add('twocolumn-panel');
        }
    };

    const toggleRightCanvas = () => {
        setIsRight(!isRight);
    };

    const onChangeTheme = (value) => {
        if(value === "light"){
            setChecked("checked")
            localStorage.setItem("theme_color", value);
        }
        else if(value === "dark"){
            setChecked("")
            localStorage.setItem("theme_color", value);
        }
        else if(value === "success"){
            setChecked("")
            localStorage.setItem("theme_color", value);
        }
        else if(value === "danger"){
            setChecked("")
            localStorage.setItem("theme_color", value);
        }
        else if(value === "orange"){
            setChecked("")
            localStorage.setItem("theme_color", value);
        }
        else if(value === "purple"){
            setChecked("")
            localStorage.setItem("theme_color", value);
        }
        else if(value === "green"){
            setChecked("")
            localStorage.setItem("theme_color", value);
        }
        else if(value === "corn_blue"){
            setChecked("")
            localStorage.setItem("theme_color", value);
        }
        else if(value === "almighty_green"){
            setChecked("")
            localStorage.setItem("theme_color", value);
        }
        else if(value === "ruby_red"){
            setChecked("")
            localStorage.setItem("theme_color", value);
        }
        onChangeLayoutMode(value);
    }

    return (
        <React.Fragment>
            <header id="page-topbar" className={headerClass}>
                <div className="layout-width">
                    <div className="navbar-header">
                        <div className="d-flex">

                            <div className="navbar-brand-box horizontal-logo">
                                <Link to="/" className="logo logo-dark">
                                    {/* <span className="logo-sm">
                                        <img src={logoSm} alt="" height="22" />
                                    </span> */}
                                    <span className="logo-lg">
                                        <img src={logoDark} alt="" height="17" />
                                    </span>
                                </Link>

                                <Link to="/" className="logo logo-light">
                                    {/* <span className="logo-sm">
                                        <img src={logoSm} alt="" height="22" />
                                    </span> */}
                                    <span className="logo-lg">
                                        <img src={logoLight} alt="" height="17" />
                                    </span>
                                </Link>
                            </div>

                            <button
                                onClick={toogleMenuBtn}
                                type="button"
                                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                                id="topnav-hamburger-icon">
                                <span className="hamburger-icon">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </button>


                            {/* <SearchOption /> */}
                        </div>

                        <div className="d-flex align-items-center">

                            <Dropdown isOpen={search} toggle={toogleSearch} className="d-md-none topbar-head-dropdown header-item">
                                <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                                    <i className="bx bx-search fs-22"></i>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                                    <Form className="p-3">
                                        <div className="form-group m-0">
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Search ..."
                                                    aria-label="Recipient's username" />
                                                <button className="btn btn-primary" type="submit"><i
                                                    className="mdi mdi-magnify"></i></button>
                                            </div>
                                        </div>
                                    </Form>
                                </DropdownMenu>
                            </Dropdown>

                            {/* LanguageDropdown */}
                            {/* <LanguageDropdown /> */}

                            {/* WebAppsDropdown */}
                            {/* <WebAppsDropdown /> */}

                            {/* MyCartDropdwon */}
                            {/* { <MyCartDropdown /> } */}

                            {/* FullScreenDropdown */}
                            <Button className='btn rounded-pill btn-light waves-effect btn btn-secondary btn-sm' onClick={toggleRightCanvas}>Select Theme</Button>
                            <FullScreenDropdown />

                            {/* Dark/Light Mode set */}
                            {/* <LightDark
                                layoutMode={layoutModeType}
                                onChangeLayoutMode={onChangeLayoutMode}
                            /> */}

                            {/* NotificationDropdown */}
                            {/* <NotificationDropdown /> */}

                            {/* ProfileDropdown */}
                            <ProfileDropdown />
                        </div>
                    </div>
                </div>
            </header>
            {/* Right offcanvas */}
            <Offcanvas
                isOpen={isRight}
                direction="end"
                toggle={toggleRightCanvas}
                id="offcanvasRight"
                className="border-bottom"
                style={{ width: "20rem" }}
            >
                <OffcanvasHeader toggle={toggleRightCanvas} id="offcanvasRightLabel" className='bg-light'>
                    Choose Theme...
                </OffcanvasHeader>
                <OffcanvasBody className="p-4 overflow-hidden">
                    <SimpleBar style={{ height: "104vh" }}>
                        <Row>



                            <div className="checkboxes__row">
                                <div className="checkboxes__item" onClick={() => { const value = "light"; onChangeTheme(value); }}>
                                    <label className="checkbox style-h">
                                        <input type="radio" name="check" checked= {checkFlag}/>
                                        <div className="checkbox__checkmark"></div>
                                        <div className="checkbox__body">Default Theme</div>
                                    </label>
                                </div>
                                <div className="checkboxes__item" onClick={() => { const value = "dark"; onChangeTheme(value); }}>
                                    <label className="checkbox style-i">
                                        <input type="radio" name="check"/>
                                        <div className="checkbox__checkmark"></div>
                                        <div className="checkbox__body">Chartreuse Yellow</div>
                                    </label>
                                </div>
                                <div className="checkboxes__item" onClick={() => { const value = "success"; onChangeTheme(value); }}>
                                    <label className="checkbox style-j">
                                        <input type="radio" name="check"/>
                                        <div className="checkbox__checkmark"></div>
                                        <div className="checkbox__body">Chinook Green</div>
                                    </label>
                                </div>
                                <div className="checkboxes__item" onClick={() => { const value = "danger"; onChangeTheme(value); }}>
                                    <label className="checkbox style-k">
                                        <input type="radio" name="check"/>
                                        <div className="checkbox__checkmark"></div>
                                        <div className="checkbox__body">Cerise Red</div>
                                    </label>
                                </div>
                                <div className="checkboxes__item" onClick={() => { const value = "orange"; onChangeTheme(value); }}>
                                    <label className="checkbox style-l">
                                        <input type="radio" name="check"/>
                                        <div className="checkbox__checkmark"></div>
                                        <div className="checkbox__body">Amber Orange</div>
                                    </label>
                                </div>
                                <div className="checkboxes__item" onClick={() => { const value = "purple"; onChangeTheme(value); }}>
                                    <label className="checkbox style-m">
                                        <input type="radio" name="check"/>
                                        <div className="checkbox__checkmark"></div>
                                        <div className="checkbox__body">Periwinkle Purple</div>
                                    </label>
                                </div>
                                <div className="checkboxes__item" onClick={() => { const value = "green"; onChangeTheme(value); }}>
                                    <label className="checkbox style-n">
                                        <input type="radio" name="check"/>
                                        <div className="checkbox__checkmark"></div>
                                        <div className="checkbox__body">Turquoise Green</div>
                                    </label>
                                </div>
                                <div className="checkboxes__item" onClick={() => { const value = "corn_blue"; onChangeTheme(value); }}>
                                    <label className="checkbox style-o">
                                        <input type="radio" name="check"/>
                                        <div className="checkbox__checkmark"></div>
                                        <div className="checkbox__body">Cornflower Blue</div>
                                    </label>
                                </div>
                                <div className="checkboxes__item" onClick={() => { const value = "almighty_green"; onChangeTheme(value); }}>
                                    <label className="checkbox style-p">
                                        <input type="radio" name="check"/>
                                        <div className="checkbox__checkmark"></div>
                                        <div className="checkbox__body">Almighty Green</div>
                                    </label>
                                </div>
                                <div className="checkboxes__item" onClick={() => { const value = "ruby_red"; onChangeTheme(value); }}>
                                    <label className="checkbox style-q">
                                        <input type="radio" name="check"/>
                                        <div className="checkbox__checkmark"></div>
                                        <div className="checkbox__body">Ruby Red</div>
                                    </label>
                                </div>
                            </div>
                            
                        </Row>
                    </SimpleBar>
                </OffcanvasBody>
            </Offcanvas>
        </React.Fragment>
    );
};

export default Header;