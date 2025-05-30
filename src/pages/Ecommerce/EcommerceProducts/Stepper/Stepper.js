import React, { useContext, useEffect } from "react";
import { FormContext } from "../EcommerceAddProduct";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Input,
  Label,
  FormFeedback,
} from "reactstrap";
function Stepper() {
  const { activeStepIndex } = useContext(FormContext);
  useEffect(() => {
    const stepperItems = document.querySelectorAll(".stepper-item");
    stepperItems.forEach((step, i) => {
      if (i <= activeStepIndex) {
        step.classList.add("bg-indigo-500", "text-white");
      } else {
        step.classList.remove("bg-indigo-500", "text-white");
      }
    });
  }, [activeStepIndex]);
  return (
        <Row>
        <Col xl="12">
              <Card>
                <CardBody className="checkout-tab">
                    <div className="step-arrow-nav mt-n3 mx-n3 mb-3">
                      <div className="w-2/3 flex flex-row items-center justify-center px-32 py-16">
                        <div className="stepper-item w-8 h-8 text-center font-medium border-2 rounded-full">
                          1
                        </div>
                        <div className="flex-auto border-t-2"></div>
                        <div className="stepper-item w-8 h-8 text-center font-medium border-2 rounded-full">
                          2
                        </div>
                        <div className="flex-auto border-t-2"></div>
                        <div className="stepper-item w-8 h-8 text-center font-medium border-2 rounded-full">
                          3
                        </div>
                      </div>
                    </div>
                    </CardBody>
                    </Card>
                    </Col>
                   
    
    </Row>

  );
}

export default Stepper;