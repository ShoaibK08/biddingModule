import React, { useEffect, useState } from "react";
import { Col, Container, Row } from 'reactstrap';

const Footer = () => {

    const [footer, setFooter] = useState('');

    useEffect(() => {
        sessionStorage.getItem("authUser");
          const obj = JSON.parse(sessionStorage.getItem("main_menu_login"));
          let getFooter = obj.footer;
          if(getFooter){
            setFooter(getFooter);
          }
          else{
            setFooter("© All Rights Reserved. FIRLO")
          }
          
    
        var verticalOverlay = document.getElementsByClassName("vertical-overlay");
        if (verticalOverlay) {
          verticalOverlay[0].addEventListener("click", function () {
            document.body.classList.remove("vertical-sidebar-enable");
          });
        }
      });


    return (
        <React.Fragment>
            <footer className="footer text-center">
                <Container fluid>
                    <Row>
                        <Col sm={12}>
                        {/* © All Rights Reserved. Amazin Automation Solution. */}
                        {footer}
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;