import React, { useState, useEffect } from "react";
import { Collapse } from "reactstrap";

function CollapsiblePanel({ children, ...props }) {
  const { title, collapse } = props;
  const [isCollapse, setIsCollapse] = useState(collapse);
  const [icon, setIcon] = useState("las la-angle-up");
  const toggle = () => {
    setIsCollapse(!isCollapse);
    setIcon(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
  };

  const animate = collapse => {
    setIsCollapse(collapse);
    setIcon(state => {
      return state === "las la-angle-down"
        ? "las la-angle-up"
        : "las la-angle-down";
    });
  };

  useEffect(() => {
    animate(!collapse);
  }, [collapse]);

  return (
    <div className="">
      <h6
        className="text-muted text-color-blue bg-primary text-uppercase fw-semibold"
        onClick={() => toggle()}
      >
         <span className="margin-left">{title}</span> <i style={{float:"right"}} className={icon} />
      </h6>
      <Collapse className="" isOpen={isCollapse}>
        {children}
      </Collapse>
    </div>
  );
}

CollapsiblePanel.defaultProps = {
  children: "Add node as a child",
  title: "Collapsible Panel",
  collapse: true
};

export default CollapsiblePanel;
