
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
//import logo
import logoSm from "../assets/images/Logo_light.png";
import logoDark from "../assets/images/Logo_light.png";
import logoLight from "../assets/images/Logo_light.png";

//Import Components
import VerticalLayout from "./VerticalLayouts";
import TwoColumnLayout from "./TwoColumnLayout";
import { Container } from "reactstrap";
import HorizontalLayout from "./HorizontalLayout";

const Sidebar = ({ layoutType }) => {

  const [logo, setLogo] = useState('');

  useEffect(() => {
    sessionStorage.getItem("authUser");
    const obj = JSON.parse(sessionStorage.getItem("main_menu_login"));
    let getLogo = obj.logo;
    if (getLogo) {
      if ((window.location.href).includes("localhost")) {
        setLogo(logoLight);
      } else {
        const docURLRemoveInnitialPath = getLogo.replace(process.env.REACT_APP_DOC_URL, '')
        setLogo(process.env.PUBLIC_URL + docURLRemoveInnitialPath);
      }

    }
    else {
      setLogo(logoLight);
    }


    var verticalOverlay = document.getElementsByClassName("vertical-overlay");
    if (verticalOverlay) {
      verticalOverlay[0].addEventListener("click", function () {
        document.body.classList.remove("vertical-sidebar-enable");
      });
    }
  });

  const addEventListenerOnSmHoverMenu = () => {
    // add listener Sidebar Hover icon on change layout from setting
    if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover') {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover-active');
    } else if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover-active') {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    } else {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    }
  };

  return (
    <React.Fragment>
      <div className="app-menu navbar-menu test">
        <div className="navbar-brand-box">
          <Link to="#" className="logo logo-dark" style={{pointerEvents:"none"}}>
            <span className="logo-sm">
              <img src={logoLight} alt="" height="20" />
            </span>
            <span className="logo-lg">
              <img src={logoLight} alt="" height="80" style={{ margin: "40px" }} />
            </span>
          </Link>

          <Link to="#" className="logo logo-light" style={{pointerEvents:"none"}}>
            <span className="logo-sm">
              <img src={logoLight} alt="" height="20" />
            </span>
            <span className="logo-lg">
              <img src={logoLight} alt="" height="80" style={{ margin: "40px" }} />
            </span>
          </Link>
          <button
            onClick={addEventListenerOnSmHoverMenu}
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
        </div>
        {layoutType === "horizontal" ? (
          <div id="scrollbar">
            <Container fluid>
              <div id="two-column-menu"></div>
              <ul className="navbar-nav" id="navbar-nav">
                <HorizontalLayout />
              </ul>
            </Container>
          </div>
        ) : layoutType === 'twocolumn' ? (
          <React.Fragment>
            <TwoColumnLayout layoutType={layoutType} />
            <div className="sidebar-background"></div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <SimpleBar id="scrollbar" className="h-100">
              <Container fluid>
                <div id="two-column-menu"></div>
                <ul className="navbar-nav sdfs " id="navbar-nav" style={{ lineHeight: "15px", marginBottom: "100px" }}>
                  <VerticalLayout layoutType={layoutType} />
                </ul>
              </Container>
            </SimpleBar>
            <div className="sidebar-background"></div>
          </React.Fragment>
        )}
      </div>
      <div className="vertical-overlay"></div>
    </React.Fragment>
  );
};

export default Sidebar;
