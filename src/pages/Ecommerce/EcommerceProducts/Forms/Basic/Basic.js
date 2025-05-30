import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext,useState } from "react";
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
import { FormContext } from "../../../EcommerceProducts/EcommerceAddProduct";
import * as yup from "yup";
import Select from "react-select";

function Basic() {
  const { activeStepIndex, setActiveStepIndex, formData, setFormData } =
    useContext(FormContext);
  const [selectedVisibility, setselectedVisibility] = useState(null);

  const renderError = (message) => (
    <p className="italic text-red-600">{message}</p>
  );

  function handleSelectVisibility(selectedVisibility) {
    setselectedVisibility(selectedVisibility);
  }

  const ValidationSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
  });

  const productStatus = [
    {
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Scheduled", value: "scheduled" },
      ],
    },
  ];
  
  const productVisibility = [
    {
      options: [
        { label: "Hidden", value: "Hidden" },
        { label: "Public", value: "Public" },
      ],
    },
  ];

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
      }}
      validationSchema={ValidationSchema}
      onSubmit={(values) => {
        const data = { ...formData, ...values };
        setFormData(data);
        setActiveStepIndex(activeStepIndex + 1);
      }}
    >
      <Row>
        <Col sm={6}>
          <div className="mb-3">
            <Label
              htmlFor="billinginfo-firstName"
              className="form-label"
            >
              Material Name
            </Label>
            <Input
              type="text"
              className="form-control"
              id="billinginfo-firstName"
              placeholder="Enter material name"
            />
          </div>
        </Col>

        <Col sm={6}>
          <div className="mb-3">
            <Label
              htmlFor="billinginfo-lastName"
              className="form-label"
            >
              Material Code
            </Label>
            <Input
              type="text"
              className="form-control"
              id="billinginfo-lastName"
              placeholder="Enter material code"
            />
          </div>
        </Col>
        <Col sm={6}>

          <div className="mb-3">
          <Label
            htmlFor="choices-publish-status-input"
            className="form-label"
          >
            Status
          </Label>
          <Select
            name="status"
            classNamePrefix="select2-selection form-select"
            id="choices-publish-status-input"
            options={productStatus}
          />
        </div>
      </Col>
      <Col >
    <div>
      <Label
        htmlFor="choices-publish-visibility-input"
        className="form-label"
      >
        Visibility
      </Label>

      <Select
        value={selectedVisibility}
        onChange={() => {
          handleSelectVisibility();
        }}
        options={productVisibility}
        name="choices-publish-visibility-input"
        classNamePrefix="select2-selection form-select"
      />
    </div>

    </Col>
    </Row>
        <Form className="flex flex-col justify-center items-center">
        <div className="text-2xl font-medium self-center mb-2">Welcome!</div>
        <div className="flex flex-col items-start mb-2">
          <label className="font-medium text-gray-900">Name</label>
          <Field
            name="name"
            className="rounded-md border-2 p-2"
            placeholder="John Doe"
          />
        </div>
        <ErrorMessage name="name" render={renderError} />
        <div className="flex flex-col items-start mb-2">
          <label className="font-medium text-gray-900">Email</label>
          <Field
            name="email"
            className="rounded-md border-2 p-2"
            placeholder="john.doe@gmail.com"
          />
        </div>
        <ErrorMessage name="email" render={renderError} />
        <button
          className="rounded-md bg-indigo-500 font-medium text-white my-2 p-2"
          type="submit"
        >
          Continue
        </button>
      </Form>
    </Formik>
  );
}

export default Basic;
