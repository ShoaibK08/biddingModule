import React, { createContext,useState,useEffect } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
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
  Form,
} from "reactstrap";

// Redux
import { useDispatch } from "react-redux";
import { addNewProduct as onAddNewProduct, updateProduct as onUpdateProduct } from "../../../store/ecommerce/action";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import classnames from "classnames";
import Dropzone from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

// Import React FilePond
import { registerPlugin } from "react-filepond";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import Step from "./Step";
import Stepper from "./Stepper";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

//Import actions
import {
  getLeads as onGetLeads,
  getTodos as onGetTodos,
} from "../../../store/actions";
import { useSelector } from "react-redux";
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
export const FormContext = createContext();
const EcommerceAddProduct = (props) => {

  document.title = "Create Material | Nayara";
  
  const history = useNavigate();
  const dispatch = useDispatch();
  
  const { leads,todos } = useSelector((state) => ({
    leads: state.Crm.leads,
    todos: state.Todos.todos,
  }));

  useEffect(() => {
    if (leads && !leads.length) {
      dispatch(onGetLeads());
      console.log("set effect 1");
    }
  }, [dispatch, leads]);

  
  useEffect(() => {
    if (todos && !todos.length) {
      dispatch(onGetTodos());
    }
  }, [dispatch, todos]);

  console.log(todos)
  


  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const [selectedFiles, setselectedFiles] = useState([]);
  const [selectedGroup, setselectedGroup] = useState(null);
  const [selectedCover, setselectedCover] = useState(null);
  const [selectedStatus, setselectedStatus] = useState(null);
  const [selectedVisibility, setselectedVisibility] = useState(null);
  const [selectedMulti, setselectedMulti] = useState([]);
    
  let rows = [];
  const handleMulti = (event) => {
    
    var index = event.target.selectedIndex;
    var optionElement = event.target.childNodes[index];
    var tag = optionElement.getAttribute('tagval');
    var option =  optionElement.getAttribute('tagcolor');
    rows = <div className="class-single-color" style={{ backgroundColor: '#'+option}}>{tag} <span className="class-span-color">x</span></div>;
   // console.log(rows)
   setselectedMulti([...selectedMulti,rows]);
  } 


  console.log(selectedMulti);
  


  function handleAcceptedFiles(files) {
    console.log("file upload",files);
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    //setselectedFiles(...files);
    setselectedFiles(prev => [...prev, ...files]);
  }

  function handleSelectGroup(selectedGroup) {
    setselectedGroup(selectedGroup);
  }

  function handleSelectStatus(selectedStatus) {
    setselectedStatus(selectedStatus);
  }

  function handleSelectVisibility(selectedVisibility) {
    setselectedVisibility(selectedVisibility);
  }

  /**
   * Formats the size
   */
  
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
/*
  const productCategory = [
    {
      options: [
        { label: "All", value: "All" },
        { label: "Appliances", value: "Kitchen Storage & Containers" },
        { label: "Fashion", value: "Clothes" },
        { label: "Electronics", value: "Electronics" },
        { label: "Grocery", value: "Grocery" },
        { label: "Home & Furniture", value: "Furniture" },
        { label: "Kids", value: "Kids" },
        { label: "Mobiles", value: "Mobiles" },
      ],
    },
  ];
*/
  const dateFormat = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let h = (d.getHours() % 12) || 12;
    let ampm = d.getHours() < 12 ? "AM" : "PM";
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear() + ", " + h + ":" + d.getMinutes() + " " + ampm).toString());
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const dateString = e.toString().split(" ");
    let time = dateString[4];
    let H = +time.substr(0, 2);
    let h = (H % 12) || 12;
    h = (h <= 9) ? h = ("0" + h) : h;
    let ampm = H < 12 ? "AM" : "PM";
    time = h + time.substr(2, 3) + " " + ampm;

    const date = dateString[2] + " " + dateString[1] + ", " + dateString[3];
    const orderDate = (date + ", " + time).toString();
    setDate(orderDate);
  };

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

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [formData, setFormData] = useState({});

  const fileSelectedHandler = event => {
    //console.log(event.target.files[0])
    setselectedCover(event.target.files[0]);
  }

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      material_name: "",
      price: "",
      stock: "",
      orders: "",
      category: "",
      publishedDate: "",
      status: "",
      rating: 4.5,
      manufacturer_name: "",
      manufacturer_brand: "",
      product_discount: "",
      meta_title: "",
      meta_keyword: "",
      product_tags: "",
    },
    validationSchema: Yup.object({
      material_name: Yup.string().required("Please Enter a Material Name"),
      material_code: Yup.string().required("Please Enter a Material Code"),
      /*price: Yup.string().required("Please Enter a Product Price"),
      stock: Yup.string().required("Please Enter a Product stock"),
      orders: Yup.string().required("Please Enter a Product orders"),
      category: Yup.string().required("Please Enter a Product category"),
      status: Yup.string().required("Please Enter a Product status"),
      manufacturer_name: Yup.string().required("Please Enter a Manufacturer Name"),
      manufacturer_brand: Yup.string().required("Please Enter a Manufacturer Brand"),
      product_discount: Yup.string().required("Please Enter a Product Discount"),
      meta_title: Yup.string().required("Please Enter a Meta Title"),
      meta_keyword: Yup.string().required("Please Enter a Meta Keyword"),
      product_tags: Yup.string().required("Please Enter a Product Tags"),*/
    }),
    onSubmit: (values) => {
      const newProduct = {
        _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
        material_name: values.material_name,
       /* price: values.price,
        stock: values.stock,
        orders: values.orders,
        category: values.category,
        publishedDate: date,
        status: values.status,
        rating: 4.5,*/
      };

      console.log("cover img ",selectedFiles);
      console.log("cover img 1",selectedCover);

      

      const formData = new FormData();
      for (const selectedFile of Object.keys(selectedFiles)) {
        formData.append('materialImages', selectedFiles[selectedFile])
      }
      //formData.append('materialImages', selectedCover);
      formData.append('material_name', values.material_name);
      formData.append('material_code', values.material_code);
      formData.append('vat_gst', 1);
      formData.append('quota_management', values.material_name);
      formData.append('material_uom', 1);
      formData.append('material_desc', values.material_name);
      formData.append('status', 2);
      formData.append('vehicle_type', values.material_name);
      formData.append('vehicle_document', values.material_name);
      formData.append('visibility', 2);
      formData.append('material_category', 'solid');
      formData.append('tagId', 2);
     // formData.append('materialSubImage', selectedFiles);
      
      // save new product
      dispatch(onAddNewProduct(formData));
      
      history("/apps-nft-explore");
      validation.resetForm();
    }
  });

  const removeFile = (f) => () => {
    console.log('removeFile...')
    selectedFiles.splice(selectedFiles.indexOf(f), 1)
    console.log(selectedFiles)
  }
  return (
      <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Add Material" pageTitle="Master" />
          <FormContext.Provider value={{ activeStepIndex, setActiveStepIndex, formData, setFormData }}>
            <div className="w-screen h-screen flex flex-col items-center justify-start">
              <Stepper />
              <Step />
            </div>
          </FormContext.Provider>
      </Container>
      </div>
  );
};

export default EcommerceAddProduct;
