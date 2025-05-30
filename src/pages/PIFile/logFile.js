import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import UiContent from "../../Components/Common/UiContent";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import img6 from "../../assets/images/companies/img-6.png";
import CollapsiblePanel from "../../Components/Common/CollapsiblePanel";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";

const LogFile = () => {
  document.title = "Log File | EPLMS";

  const [documentModal, setDocumentModal] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const [header, setModalHeader] = useState('');
  const [latestHeader, setLatestHeader] = useState('');


  useEffect(() => {
    const HeaderName = localStorage.getItem("HeaderName");
    setLatestHeader(HeaderName);

  }, []);

  const text = `2023-12-02 09:36:48,057 [HikariPool-2 housekeeper] WARN  com.zaxxer.hikari.pool.HikariPool - HikariPool-2 - Thread starvation or clock leap detected (housekeeper delta=17h34m59s839ms878µs100ns).
  2023-12-02 09:36:52,468 [HikariPool-1 housekeeper] WARN  com.zaxxer.hikari.pool.HikariPool - HikariPool-1 - Thread starvation or clock leap detected (housekeeper delta=17h34m59s833ms55µs400ns).
  2023-12-02 09:40:03,649 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 09:45:03,665 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 09:50:03,683 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 09:55:03,698 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 10:00:03,715 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 10:05:03,726 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 10:10:03,732 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 10:13:48,655 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 10:13:48,675 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:13:48,949 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:13:49,621 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:13:49,879 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:13:50,152 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:13:50,442 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:13:50,940 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:13:51,215 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:14:10,439 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - PackerProductMappingController, getAllPackerProductOnSequencing, UL
  2023-12-02 10:14:10,585 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - PackerProductMappingController, getAllPackerProductOnSequencing, <200 OK OK,PackerProductPojoListResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=[PackerProductMappingPojo(id=65, packerLoaderCode=Unloading1, materialTypeCode=OPC, packerLoaderParentCode=Unloading1, packerLoaderChildCode=, status=1, type=UL, queueSize=4, currentQueueCount=4), PackerProductMappingPojo(id=66, packerLoaderCode=Unloading2, materialTypeCode=PPC, packerLoaderParentCode=Unloading2, packerLoaderChildCode=, status=1, type=UL, queueSize=2, currentQueueCount=1)]),[]>
  2023-12-02 10:14:11,541 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - PackerLoaderMasterController, getAllVehicleQueue, Unloading2
  2023-12-02 10:14:11,669 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - PackerLoaderMasterController, getAllVehicleQueue, <200 OK OK,PackerLoaderVehicleQueue(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=[VehicleNoDto(vehicleNo=MP9SBF4633)]),[]>
  2023-12-02 10:14:18,878 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:14:18,911 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 10:14:19,188 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:14:19,529 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:14:19,857 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:14:20,120 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:14:20,521 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:14:20,963 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:14:21,326 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:15:03,745 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 10:20:03,761 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 10:22:20,220 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - PackerProductMappingController, getAllPackerProductOnSequencing, UL
  2023-12-02 10:22:20,281 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - PackerProductMappingController, getAllPackerProductOnSequencing, <200 OK OK,PackerProductPojoListResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=[PackerProductMappingPojo(id=65, packerLoaderCode=Unloading1, materialTypeCode=OPC, packerLoaderParentCode=Unloading1, packerLoaderChildCode=, status=1, type=UL, queueSize=4, currentQueueCount=4), PackerProductMappingPojo(id=66, packerLoaderCode=Unloading2, materialTypeCode=PPC, packerLoaderParentCode=Unloading2, packerLoaderChildCode=, status=1, type=UL, queueSize=2, currentQueueCount=1)]),[]>
  2023-12-02 10:22:24,104 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - PackerLoaderMasterController, getAllVehicleQueue, Unloading2
  2023-12-02 10:22:24,175 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - PackerLoaderMasterController, getAllVehicleQueue, <200 OK OK,PackerLoaderVehicleQueue(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=[VehicleNoDto(vehicleNo=MP9SBF4633)]),[]>
  2023-12-02 10:22:43,205 [http-nio-8082-exec-2] ERROR c.s.e.m.c.a.EplmsSapMasterControllerAdvice - An error occurred:
  org.springframework.web.util.NestedServletException: Handler dispatch failed; nested exception is java.lang.NoSuchMethodError: java.nio.file.Path.of(Ljava/lang/String;[Ljava/lang/String;)Ljava/nio/file/Path;
    at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1087)
    at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:965)
    at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1006)
    at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:898)
    at javax.servlet.http.HttpServlet.service(HttpServlet.java:529)
    at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:883)
    at javax.servlet.http.HttpServlet.service(HttpServlet.java:623)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:209)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:51)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.springframework.boot.actuate.metrics.web.servlet.WebMvcMetricsFilter.doFilterInternal(WebMvcMetricsFilter.java:96)
    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:167)
    at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90)
    at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:481)
    at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:130)
    at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93)
    at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)
    at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:343)
    at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:390)
    at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63)
    at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:926)
    at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1791)
    at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)
    at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191)
    at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
    at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
    at java.lang.Thread.run(Thread.java:748)
  Caused by: java.lang.NoSuchMethodError: java.nio.file.Path.of(Ljava/lang/String;[Ljava/lang/String;)Ljava/nio/file/Path;
    at com.sap.eplms.master.controller.LogsController.logFile(LogsController.java:32)
    at com.sap.eplms.master.controller.LogsController.getCurrentLogFile(LogsController.java:27)
    at com.sap.eplms.master.controller.LogsController$$FastClassBySpringCGLIB$$eff9c771.invoke(<generated>)
    at org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:218)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:793)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:163)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)
    at org.springframework.aop.framework.adapter.AfterReturningAdviceInterceptor.invoke(AfterReturningAdviceInterceptor.java:57)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)
    at org.springframework.aop.framework.adapter.MethodBeforeAdviceInterceptor.invoke(MethodBeforeAdviceInterceptor.java:58)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)
    at org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:97)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)
    at org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:708)
    at com.sap.eplms.master.controller.LogsController$$EnhancerBySpringCGLIB$$f08653aa.getCurrentLogFile(<generated>)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
    at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:205)
    at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:150)
    at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:117)
    at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:895)
    at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:808)
    at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
    at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1072)
    ... 43 common frames omitted
  2023-12-02 10:23:12,534 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - FileServiceController, getAllFileMaster, <200 OK OK,FileMasterListResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=[FileServiceMaster(id=1, uniqueId=SapFile, flag=C, status=1), FileServiceMaster(id=2, uniqueId=InBoundFile, flag=C, status=1), FileServiceMaster(id=3, uniqueId=OutBoundFile, flag=L, status=1), FileServiceMaster(id=4, uniqueId=WeighbridgeFile, flag=L, status=1), FileServiceMaster(id=5, uniqueId=SequencingFile, flag=L, status=1)]),[]>
  2023-12-02 10:23:49,446 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, PLT001
  2023-12-02 10:23:49,614 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, <200 OK OK,GateInDashboardResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=GateInDashboardPojo(totalVehicleInsidePlantCounts=14, vehicleGateInLastOneHourCounts=0, vehicleWaitingForGateInCounts=13)),[]>
  2023-12-02 10:23:49,730 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - StageMasterController, getAllStagesByCode, <200 OK OK,StageMasterListResponse(meta=ResponseMetaData(code=EPLMS-002, message=Stage master fetched successfully), data=[StageMasterDto(id=27, stageCode=GI09441, name=Gate In 1, isPhysical=0, isSkip=0, status=A), StageMasterDto(id=28, stageCode=GI09442, name=Gate In 2, isPhysical=0, isSkip=0, status=A), StageMasterDto(id=29, stageCode=GI09443, name=Gate In 3, isPhysical=0, isSkip=0, status=A)]),[]>
  2023-12-02 10:23:56,078 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, GI09441
  2023-12-02 10:23:56,193 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, <200 OK OK,VehicleDetailsResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=null),[]>
  2023-12-02 10:24:01,230 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, PLT001
  2023-12-02 10:24:01,240 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, GI09441
  2023-12-02 10:24:01,325 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, <200 OK OK,VehicleDetailsResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=null),[]>
  2023-12-02 10:24:01,389 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, <200 OK OK,GateInDashboardResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=GateInDashboardPojo(totalVehicleInsidePlantCounts=14, vehicleGateInLastOneHourCounts=0, vehicleWaitingForGateInCounts=13)),[]>
  2023-12-02 10:24:06,222 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, PLT001
  2023-12-02 10:24:06,224 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, GI09441
  2023-12-02 10:24:06,292 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, <200 OK OK,VehicleDetailsResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=null),[]>
  2023-12-02 10:24:06,389 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, <200 OK OK,GateInDashboardResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=GateInDashboardPojo(totalVehicleInsidePlantCounts=14, vehicleGateInLastOneHourCounts=0, vehicleWaitingForGateInCounts=13)),[]>
  2023-12-02 10:24:10,299 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagIdAndLocationId, E28011700000020ECF84EA46
  2023-12-02 10:24:10,300 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagIdAndLocationId, 24
  2023-12-02 10:24:10,397 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagIdAndLocationId, <200 OK OK,VehicleDetailsResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=VehicleDetailsPojo(locationId=24, vehicleNumber=HR26AB12290, vehicleType=Truck, quantity=null, pollutionExpiryDate=2023-12-31, insuranceExpiryDate=2024-12-31, fitnessExpiryDate=2023-08-10, loadingType=A, materialName=null, movement=OB, driverName=null, driverId=Driver0021, idocNo=0, plantCode=null, mobileNo=null, licenseNo=null, loadingPoint=null, unLoadingPoint=null, grade=null, documentApproval=P)),[]>
  2023-12-02 10:24:11,258 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, GI09441
  2023-12-02 10:24:11,258 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, PLT001
  2023-12-02 10:24:11,390 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, <200 OK OK,VehicleDetailsResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=null),[]>
  2023-12-02 10:24:11,455 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, <200 OK OK,GateInDashboardResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=GateInDashboardPojo(totalVehicleInsidePlantCounts=14, vehicleGateInLastOneHourCounts=0, vehicleWaitingForGateInCounts=13)),[]>
  2023-12-02 10:24:16,086 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, PLT001
  2023-12-02 10:24:16,087 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, GI09441
  2023-12-02 10:24:16,177 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, <200 OK OK,VehicleDetailsResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=null),[]>
  2023-12-02 10:24:16,250 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, <200 OK OK,GateInDashboardResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=GateInDashboardPojo(totalVehicleInsidePlantCounts=14, vehicleGateInLastOneHourCounts=0, vehicleWaitingForGateInCounts=13)),[]>
  2023-12-02 10:24:20,846 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagIdAndLocationId, E28011700000020ECF84EA46
  2023-12-02 10:24:20,847 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagIdAndLocationId, 20
  2023-12-02 10:24:20,916 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagIdAndLocationId, <200 OK OK,VehicleDetailsResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=VehicleDetailsPojo(locationId=20, vehicleNumber=HR26AB12290, vehicleType=Truck, quantity=null, pollutionExpiryDate=2023-12-31, insuranceExpiryDate=2024-12-31, fitnessExpiryDate=2023-08-10, loadingType=A, materialName=null, movement=OB, driverName=null, driverId=Driver0021, idocNo=0, plantCode=null, mobileNo=null, licenseNo=null, loadingPoint=null, unLoadingPoint=null, grade=null, documentApproval=P)),[]>
  2023-12-02 10:24:21,230 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, GI09441
  2023-12-02 10:24:21,233 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, PLT001
  2023-12-02 10:24:21,267 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, <200 OK OK,VehicleDetailsResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=VehicleDetailsPojo(locationId=20, vehicleNumber=HR26AB12290, vehicleType=Truck, quantity=null, pollutionExpiryDate=2023-12-31, insuranceExpiryDate=2024-12-31, fitnessExpiryDate=2023-08-10, loadingType=A, materialName=null, movement=OB, driverName=null, driverId=Driver0021, idocNo=0, plantCode=null, mobileNo=null, licenseNo=null, loadingPoint=null, unLoadingPoint=null, grade=null, documentApproval=P)),[]>
  2023-12-02 10:24:21,348 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, <200 OK OK,GateInDashboardResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=GateInDashboardPojo(totalVehicleInsidePlantCounts=14, vehicleGateInLastOneHourCounts=0, vehicleWaitingForGateInCounts=13)),[]>
  2023-12-02 10:24:26,100 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, GI09441
  2023-12-02 10:24:26,101 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, PLT001
  2023-12-02 10:24:26,169 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, <200 OK OK,VehicleDetailsResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=VehicleDetailsPojo(locationId=20, vehicleNumber=HR26AB12290, vehicleType=Truck, quantity=null, pollutionExpiryDate=2023-12-31, insuranceExpiryDate=2024-12-31, fitnessExpiryDate=2023-08-10, loadingType=A, materialName=null, movement=OB, driverName=null, driverId=Driver0021, idocNo=0, plantCode=null, mobileNo=null, licenseNo=null, loadingPoint=null, unLoadingPoint=null, grade=null, documentApproval=P)),[]>
  2023-12-02 10:24:26,229 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, <200 OK OK,GateInDashboardResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=GateInDashboardPojo(totalVehicleInsidePlantCounts=14, vehicleGateInLastOneHourCounts=0, vehicleWaitingForGateInCounts=13)),[]>
  2023-12-02 10:24:31,084 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, PLT001
  2023-12-02 10:24:31,085 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, GI09441
  2023-12-02 10:24:31,149 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getTripDataByTagId, <200 OK OK,VehicleDetailsResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=VehicleDetailsPojo(locationId=20, vehicleNumber=HR26AB12290, vehicleType=Truck, quantity=null, pollutionExpiryDate=2023-12-31, insuranceExpiryDate=2024-12-31, fitnessExpiryDate=2023-08-10, loadingType=A, materialName=null, movement=OB, driverName=null, driverId=Driver0021, idocNo=0, plantCode=null, mobileNo=null, licenseNo=null, loadingPoint=null, unLoadingPoint=null, grade=null, documentApproval=P)),[]>
  2023-12-02 10:24:31,247 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - GateInDashboardController, getGateInDashboardCounts, <200 OK OK,GateInDashboardResponse(meta=ResponseMetaData(code=EPLMS_SEQUENCING-002, message=Data fetched successfully), data=GateInDashboardPojo(totalVehicleInsidePlantCounts=14, vehicleGateInLastOneHourCounts=0, vehicleWaitingForGateInCounts=13)),[]>
  2023-12-02 10:24:33,500 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:33,551 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 10:24:33,736 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:33,993 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:34,261 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:34,516 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getDocumentExpiredYardIn, <200 OK OK,VehicleMasterListResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=[VehicleMasterDto(id=1, registrationNumber=HR26AB12290, modelNumber=MODEL001, manufacturingDate=2023-01-01, description=Vehicle 1 Description, status=A, vehicleType=Truck, transporter=Transporter 1, noOfWheels=6, certifiedCapacity=5000, pollutionExpiryDate=2023-12-31, fitnessExpiryDate=2023-08-10, insurancePolicyExpiry=2024-12-31, vehicleCapacityMin=5000.00, vehicleCapacityMax=10000.00, chassisNumber=CHASSIS001, imeiNumber=IMEI001, gpsDeviceNumber=GPSDEVICE001, gpsActivated=1, isBackhauling=1, insurancePolicyNumber=POLICY001, companyCode=COMP001, plantCode=PLT002, loadingType=A, registeredState=STATE001, rcNumber=RC001, movementType=MOVEMENT001, taxRenewalDate=2023-12-31, tareWeight=10000.00, grossWeight=20000.00, createdDate=2023-10-03, receivedDate=2023-10-01, documentApproval=P, documentName=null, tripId=null), VehicleMasterDto(id=47, registrationNumber=GH45UH8788, modelNumber=ZTR, manufacturingDate=2023-09-01, description=Test, status=A, vehicleType=Car, transporter=2023-09-01, noOfWheels=3, certifiedCapacity=200, pollutionExpiryDate=2023-09-01, fitnessExpiryDate=2023-09-01, insurancePolicyExpiry=2023-09-01, vehicleCapacityMin=200.00, vehicleCapacityMax=500.00, chassisNumber=222, imeiNumber=2222, gpsDeviceNumber=2222222, gpsActivated=A, isBackhauling=A, insurancePolicyNumber=2023-09-01, companyCode=COMP003, plantCode=PLT001, loadingType=A, registeredState=HR, rcNumber=11111, movementType=TR, taxRenewalDate=2023-09-01, tareWeight=10000.00, grossWeight=20000.00, createdDate=2023-09-01, receivedDate=2023-09-01, documentApproval=Y, documentName=null, tripId=null)]),[]>
  2023-12-02 10:24:34,591 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:34,888 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:35,196 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:35,497 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:35,769 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:36,220 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:36,499 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:36,843 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:37,110 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:37,352 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:37,725 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:38,094 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:39,365 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:39,715 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:40,091 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:24:40,363 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 10:25:03,784 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 10:30:03,823 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 10:35:03,835 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 10:40:03,850 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 10:45:03,856 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 10:50:03,862 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 10:55:03,868 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 11:00:03,886 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 11:05:03,901 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 11:10:03,916 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 11:15:03,929 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 11:20:03,938 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 11:25:03,949 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 11:30:03,968 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 11:35:03,987 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 11:40:04,005 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 11:45:04,019 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 11:50:04,029 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 11:55:04,052 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 11:55:27,756 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 11:55:27,782 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:55:28,060 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:55:28,303 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:55:28,532 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:55:28,834 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:55:29,090 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:55:29,354 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:55:29,620 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:57:59,682 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 11:57:59,684 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:57:59,959 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:58:00,192 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:58:00,425 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:58:00,675 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:58:01,012 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:58:01,312 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 11:58:01,583 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:00:04,086 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 12:05:04,110 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 12:10:04,151 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 12:15:04,197 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 12:17:57,861 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:17:57,907 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 12:17:58,127 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:17:58,521 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:17:58,889 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:17:59,253 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:17:59,531 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:17:59,811 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:18:00,162 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:19:24,533 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:19:24,677 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 12:19:24,887 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:19:25,170 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:19:25,444 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:19:25,700 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:19:25,961 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:19:26,216 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:19:26,463 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:20:04,216 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 12:24:06,408 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:06,503 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 12:24:06,699 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:06,967 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:07,322 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:08,205 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:08,494 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:08,853 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:09,137 [http-nio-8082-exec-7] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:55,215 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:55,291 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 12:24:55,438 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:55,917 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:56,208 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:56,457 [http-nio-8082-exec-9] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:56,707 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:56,972 [http-nio-8082-exec-8] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:24:57,256 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getWaitingVehicleLessThenFourHours, <200 OK OK,WaitingVehicleCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=WaitingVehicles(less4Hours=[], fourToEightHour=[], greaterThen8Hours=[WaitingVehicleCounts(weekDay=null, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Car, vehicleCount=3), WaitingVehicleCounts(weekDay=null, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=null, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=null, vehicleType=Bus, vehicleCount=1)], lessThen24Hours=[WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Truck, vehicleCount=1), WaitingVehicleCounts(weekDay=FRIDAY, vehicleType=Car, vehicleCount=2), WaitingVehicleCounts(weekDay=MONDAY, vehicleType=Car, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Sedan, vehicleCount=2), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Tractor, vehicleCount=1), WaitingVehicleCounts(weekDay=THURSDAY, vehicleType=Bus, vehicleCount=1)])),[]>
  2023-12-02 12:25:04,229 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 12:29:33,286 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - UserMasterController, authenticateUser, LoginRequest(email=admin@amzbizsol.in, password=password@111, otp=null, mobileNumber=null)2023-12-02 12:29:39,420 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 12:30:04,237 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 12:31:53,011 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 12:35:04,246 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 12:40:04,313 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 12:42:01,646 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 12:45:04,364 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 12:45:58,000 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 12:50:04,417 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 12:54:24,987 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 12:55:04,460 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 12:57:33,267 [http-nio-8082-exec-4] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 12:59:42,084 [http-nio-8082-exec-6] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 13:00:04,485 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 13:00:49,362 [http-nio-8082-exec-10] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 13:05:04,510 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 13:05:24,765 [http-nio-8082-exec-5] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 13:06:34,948 [http-nio-8082-exec-1] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 13:06:45,826 [http-nio-8082-exec-2] INFO  c.s.e.m.c.ControllerLoggingAspect - UserMasterController, authenticateUser, LoginRequest(email=admin@amzbizsol.in, password=password@111, otp=null, mobileNumber=null)2023-12-02 13:08:35,700 [http-nio-8082-exec-3] INFO  c.s.e.m.c.ControllerLoggingAspect - YardInController, getYardInCounts, <200 OK OK,YardInCountsResponse(meta=ResponseMetaData(code=eplms-001, message=Yard in data fetched successfully), data=YardInCounts(vehicleYardIn=25, diReceived=9, withoutDiReceived=1, vehicleDocumentExp=2)),[]>
  2023-12-02 13:09:48,047 [http-nio-8082-exec-9] ERROR c.s.e.m.c.a.EplmsSapMasterControllerAdvice - An error occurred:
  org.springframework.web.util.NestedServletException: Handler dispatch failed; nested exception is java.lang.NoSuchMethodError: java.nio.file.Path.of(Ljava/lang/String;[Ljava/lang/String;)Ljava/nio/file/Path;
    at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1087)
    at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:965)
    at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1006)
    at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:898)
    at javax.servlet.http.HttpServlet.service(HttpServlet.java:529)
    at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:883)
    at javax.servlet.http.HttpServlet.service(HttpServlet.java:623)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:209)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:51)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.springframework.boot.actuate.metrics.web.servlet.WebMvcMetricsFilter.doFilterInternal(WebMvcMetricsFilter.java:96)
    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:167)
    at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90)
    at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:481)
    at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:130)
    at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93)
    at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)
    at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:343)
    at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:390)
    at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63)
    at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:926)
    at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1791)
    at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)
    at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191)
    at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
    at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
    at java.lang.Thread.run(Thread.java:748)
  Caused by: java.lang.NoSuchMethodError: java.nio.file.Path.of(Ljava/lang/String;[Ljava/lang/String;)Ljava/nio/file/Path;
    at com.sap.eplms.master.controller.LogsController.logFile(LogsController.java:32)
    at com.sap.eplms.master.controller.LogsController.getCurrentLogFile(LogsController.java:27)
    at com.sap.eplms.master.controller.LogsController$$FastClassBySpringCGLIB$$eff9c771.invoke(<generated>)
    at org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:218)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:793)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:163)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)
    at org.springframework.aop.framework.adapter.AfterReturningAdviceInterceptor.invoke(AfterReturningAdviceInterceptor.java:57)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)
    at org.springframework.aop.framework.adapter.MethodBeforeAdviceInterceptor.invoke(MethodBeforeAdviceInterceptor.java:58)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)
    at org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:97)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)
    at org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:708)
    at com.sap.eplms.master.controller.LogsController$$EnhancerBySpringCGLIB$$f08653aa.getCurrentLogFile(<generated>)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
    at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:205)
    at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:150)
    at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:117)
    at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:895)
    at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:808)
    at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
    at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1072)
    ... 43 common frames omitted
  2023-12-02 13:10:04,536 [AsyncResolver-bootstrap-executor-0] INFO  c.n.d.s.r.aws.ConfigClusterResolver - Resolving eureka endpoints via configuration
  2023-12-02 13:10:16,884 [http-nio-8082-exec-10] ERROR c.s.e.m.c.a.EplmsSapMasterControllerAdvice - An error occurred:
  org.springframework.web.util.NestedServletException: Handler dispatch failed; nested exception is java.lang.NoSuchMethodError: java.nio.file.Path.of(Ljava/lang/String;[Ljava/lang/String;)Ljava/nio/file/Path;
    at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1087)
    at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:965)
    at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1006)
    at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:898)
    at javax.servlet.http.HttpServlet.service(HttpServlet.java:529)
    at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:883)
    at javax.servlet.http.HttpServlet.service(HttpServlet.java:623)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:209)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:51)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.springframework.boot.actuate.metrics.web.servlet.WebMvcMetricsFilter.doFilterInternal(WebMvcMetricsFilter.java:96)
    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:178)
    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:153)
    at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:167)
    at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90)
    at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:481)
    at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:130)
    at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93)
    at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)
    at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:343)
    at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:390)
    at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63)
    at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:926)
    at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1791)
    at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)
    at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191)
    at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
    at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
    at java.lang.Thread.run(Thread.java:748)
  Caused by: java.lang.NoSuchMethodError: java.nio.file.Path.of(Ljava/lang/String;[Ljava/lang/String;)Ljava/nio/file/Path;
    at com.sap.eplms.master.controller.LogsController.logFile(LogsController.java:32)
    at com.sap.eplms.master.controller.LogsController.getCurrentLogFile(LogsController.java:27)
    at com.sap.eplms.master.controller.LogsController$$FastClassBySpringCGLIB$$eff9c771.invoke(<generated>)
    at org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:218)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:793)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:163)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)
    at org.springframework.aop.framework.adapter.AfterReturningAdviceInterceptor.invoke(AfterReturningAdviceInterceptor.java:57)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)
    at org.springframework.aop.framework.adapter.MethodBeforeAdviceInterceptor.invoke(MethodBeforeAdviceInterceptor.java:58)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)
    at org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:97)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)
    at org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:708)
    at com.sap.eplms.master.controller.LogsController$$EnhancerBySpringCGLIB$$f08653aa.getCurrentLogFile(<generated>)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
    at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:205)
    at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:150)
    at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:117)
    at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:895)
    at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:808)
    at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
    at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1072)
    ... 43 common frames omitted
  `;

  const setViewModal = () => {
    setDocumentModal(!documentModal);
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: process.env.REACT_APP_API_USER_NAME,
      password: process.env.REACT_APP_API_PASSWORD,
    },
  };

  const changeTag = async (data) => {
    
    setFileContent('');
    if (data === "Local_Micro_Service") {
      setViewModal();
      setModalHeader("Local Micro Service")
      await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/logs?target=local`, config)
        .then(res => {
          const docURL = res.logFileLocation;
          const docURLRemoveInnitialPath = docURL.replace(process.env.REACT_APP_DOC_URL, '')
          const fetchTextFile = async () => {
            try {
              const response = await fetch(docURLRemoveInnitialPath);
              if (response) {
                const text = await response.text();
                setFileContent(text);
              }
              else {
                setFileContent('Error fetching text file');
              }
            } catch (error) {
              console.error('Error fetching text file:', error);
            }
          };
          fetchTextFile();
        });
    }
    else if (data === "Reader") {
      setViewModal();
      setModalHeader("Reader")
      // axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/logs?target=kafkaProducer`, config)
      //   .then(res => {
      //     const docURL = "C:/eplmsui/public/logs/master/application_dk.log";
      //     const docURLRemoveInnitialPath = docURL.replace('C:/eplmsui/public/', '')
      //     const fetchTextFile = async () => {
      //       try {
      //         const response = await fetch(docURLRemoveInnitialPath);
      //         if (response) {
      //           const text = await response.text();
      //           setFileContent(text);
      //         }
      //         else {
      //           setFileContent('Error fetching text file');
      //         }
      //       } catch (error) {
      //         console.error('Error fetching text file:', error);
      //       }
      //     };
      //     fetchTextFile();
      //   });
      setFileContent(text);
    }
    else if (data === "Weigh_Bridge") {
      setViewModal();
      setModalHeader("Weigh Bridge")
      // axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/logs?target=kafkaProducer`, config)
      //   .then(res => {
      //     const docURL = "C:/eplmsui/public/logs/master/application_dk.log";
      //     const docURLRemoveInnitialPath = docURL.replace('C:/eplmsui/public/', '')
      //     const fetchTextFile = async () => {
      //       try {
      //         const response = await fetch(docURLRemoveInnitialPath);
      //         if (response) {
      //           const text = await response.text();
      //           setFileContent(text);
      //         }
      //         else {
      //           setFileContent('Error fetching text file');
      //         }
      //       } catch (error) {
      //         console.error('Error fetching text file:', error);
      //       }
      //     };
      //     fetchTextFile();
      //   });
      setFileContent(text);
    }
    else if (data === "Master") {
      
      setViewModal();
      setModalHeader("Master")
      await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/logs?target=master`, config)
        .then(res => {
          const docURL = res.logFileLocation;
         // const docURLRemoveInnitialPath = docURL.replace('C:\\eplmsui\\public\\', '')
         const docURLRemoveInnitialPath = docURL.replace(process.env.REACT_APP_DOC_URL, '')
          const fetchTextFile = async () => {
            try {
              const response = await fetch(docURLRemoveInnitialPath);
              if (response) {
                const text = await response.text();
                setFileContent(text);
              }
              else {
                setFileContent('Error fetching text file');
              }
            } catch (error) {
              console.error('Error fetching text file:', error);
            }
          };
          fetchTextFile();
        });
      //setFileContent(text);
    }
    else if (data === "Sequencing") {
      setViewModal();
      setModalHeader("Sequencing")
      await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/logs?target=sequencing`, config)
        .then(res => {
          const docURL = res.logFileLocation;
          const docURLRemoveInnitialPath = docURL.replace(process.env.REACT_APP_DOC_URL, '')
          const fetchTextFile = async () => {
            try {
              const response = await fetch(docURLRemoveInnitialPath);
              if (response) {
                const text = await response.text();
                setFileContent(text);
              }
              else {
                setFileContent('Error fetching text file');
              }
            } catch (error) {
              console.error('Error fetching text file:', error);
            }
          };
          fetchTextFile();
        });
    }
    else if (data === "SAP") {
      setViewModal();
      setModalHeader("SAP")
      await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/logs?target=sap`, config)
        .then(res => {
          const docURL = res.logFileLocation;
          const docURLRemoveInnitialPath = docURL.replace(process.env.REACT_APP_DOC_URL, '')
          const fetchTextFile = async () => {
            try {
              const response = await fetch(docURLRemoveInnitialPath);
              if (response) {
                const text = await response.text();
                setFileContent(text);
              }
              else {
                setFileContent('Error fetching text file');
              }
            } catch (error) {
              console.error('Error fetching text file:', error);
            }
          };
          fetchTextFile();
        });
      //setFileContent(text);
    }
    else if (data === "Kafka_Producer") {
      setViewModal();
      setModalHeader("Kafka Producer")
      await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/logs?target=kafkaProducer`, config)
        .then(res => {
          const docURL = res.logFileLocation;
          const docURLRemoveInnitialPath = docURL.replace(process.env.REACT_APP_DOC_URL, '')
          const fetchTextFile = async () => {
            try {
              const response = await fetch(docURLRemoveInnitialPath);
              if (response) {
                const text = await response.text();
                setFileContent(text);
              }
              else {
                setFileContent('Error fetching text file');
              }
            } catch (error) {
              console.error('Error fetching text file:', error);
            }
          };
          fetchTextFile();
        });
    }
    else if (data === "Kafka_Consumer") {
      setViewModal();
      setModalHeader("Kafka Consumer")
      await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/logs?target=kafkaconsumer`, config)
        .then(res => {
          const docURL = res.logFileLocation;
          const docURLRemoveInnitialPath = docURL.replace(process.env.REACT_APP_DOC_URL, '')
          const fetchTextFile = async () => {
            try {
              const response = await fetch(docURLRemoveInnitialPath);
              if (response) {
                const text = await response.text();
                setFileContent(text);
              }
              else {
                setFileContent('Error fetching text file');
              }
            } catch (error) {
              console.error('Error fetching text file:', error);
            }
          };
          fetchTextFile();
        });
    }
    else if (data === "Central_Microservice") {
      setViewModal();
      setModalHeader("Central Microservice")
      await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/logs?target=central`, config)
        .then(res => {
          const docURL = res.logFileLocation;
          const docURLRemoveInnitialPath = docURL.replace(process.env.REACT_APP_DOC_URL, '')
          const fetchTextFile = async () => {
            try {
              const response = await fetch(docURLRemoveInnitialPath);
              if (response) {
                const text = await response.text();
                setFileContent(text);
              }
              else {
                setFileContent('Error fetching text file');
              }
            } catch (error) {
              console.error('Error fetching text file:', error);
            }
          };
          fetchTextFile();
        });
    }
  }

  const handleDownload = () => {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Log_file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return false;
  };


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid className="container-fluid">
          <BreadCrumb title={latestHeader} pageTitle="Confuguration" />
          <Row className="mb-4">
            <Col xxl={12}><div className=" pi_css">
              <h4 className="card-title1 m-0 ms-0 text-white">LOCAL LOG FILE</h4></div></Col>
          </Row>
          <Row>
            <Col xxl={3}>
              <Card id="company-overview">
                <CardBody className="py-4 px-3 rounded" style={{ border: "3px solid lightblue", fontWeight: "700" }}>
                  <div class="">{"Local Micro Service"}
                    <button class="btn btn-sm btn-soft-info edit-list" style={{ float: "right" }} onClick={() => { changeTag("Local_Micro_Service"); }}><i class="ri-eye-fill align-bottom"></i></button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl={3}>
              <Card id="company-overview">
                <CardBody className="py-4 px-3 rounded" style={{ border: "3px solid lightblue", fontWeight: "700" }}>
                  <div class="">{"Reader"}
                    <button class="btn btn-sm btn-soft-info edit-list" style={{ float: "right" }} onClick={() => { changeTag("Reader"); }}><i class="ri-eye-fill align-bottom"></i></button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl={3}>
              <Card id="company-overview">
                <CardBody className="py-4 px-3 rounded" style={{ border: "3px solid lightblue", fontWeight: "700" }}>
                  <div class="">{"Weigh Bridge"}
                    <button class="btn btn-sm btn-soft-info edit-list" style={{ float: "right" }} onClick={() => { changeTag("Weigh_Bridge"); }}><i class="ri-eye-fill align-bottom"></i></button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col xxl={12}><div className="pi_css">
              <h4 className="card-title1 m-0 ms-0 text-white">CENTRAL LOG FILE</h4></div></Col>
          </Row>
          <Row>
            <Col xxl={3}>
              <Card id="company-overview">
                <CardBody className="py-4 px-3 rounded" style={{ border: "3px solid lightblue", fontWeight: "700" }}>
                  <div class="">{"Master"}
                    <button type="button" class="btn btn-sm btn-soft-info edit-list" style={{ float: "right" }} onClick={() => { changeTag("Master"); }}><i class="ri-eye-fill align-bottom"></i></button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl={3}>
              <Card id="company-overview">
                <CardBody className="py-4 px-3 rounded" style={{ border: "3px solid lightblue", fontWeight: "700" }}>
                  <div class="">{"Sequencing"}
                    <button class="btn btn-sm btn-soft-info edit-list" style={{ float: "right" }} onClick={() => { changeTag("Sequencing"); }}><i class="ri-eye-fill align-bottom"></i></button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl={3}>
              <Card id="company-overview">
                <CardBody className="py-4 px-3 rounded" style={{ border: "3px solid lightblue", fontWeight: "700" }}>
                  <div class="">{"SAP"}
                    <button class="btn btn-sm btn-soft-info edit-list" style={{ float: "right" }} onClick={() => { changeTag("SAP"); }}><i class="ri-eye-fill align-bottom"></i></button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl={3}>
              <Card id="company-overview">
                <CardBody className="py-4 px-3 rounded" style={{ border: "3px solid lightblue", fontWeight: "700" }}>
                  <div class="">{"Kafka Producer"}
                    <button class="btn btn-sm btn-soft-info edit-list" style={{ float: "right" }} onClick={() => { changeTag("Kafka_Producer"); }}><i class="ri-eye-fill align-bottom"></i></button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl={3}>
              <Card id="company-overview">
                <CardBody className="py-4 px-3 rounded" style={{ border: "3px solid lightblue", fontWeight: "700" }}>
                  <div class="">{"Kafka Consumer"}
                    <button class="btn btn-sm btn-soft-info edit-list" style={{ float: "right" }} onClick={() => { changeTag("Kafka_Consumer"); }}><i class="ri-eye-fill align-bottom"></i></button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl={3}>
              <Card id="company-overview">
                <CardBody className="py-4 px-3 rounded" style={{ border: "3px solid lightblue", fontWeight: "700" }}>
                  <div class="">{"Central Microservice"}
                    <button class="btn btn-sm btn-soft-info edit-list" style={{ float: "right" }} onClick={() => { changeTag("Central_Microservice"); }}><i class="ri-eye-fill align-bottom"></i></button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>


          <ToastContainer closeButton={false} limit={1} />
        </Container>
      </div>
      <Modal isOpen={documentModal} role="dialog" autoFocus={true} centered id="removeItemModal" size="xl" toggle={setViewModal}>
        <ModalHeader toggle={() => {
          setViewModal(!documentModal);
        }} className='bg-light p-3 modal-header' style={{ color: "white !important" }}>
          <h5 className="text-white fs-20">{header}</h5>
        </ModalHeader>
        <ModalBody>
          <Form>
            <div className="product-content mt-0">
              <div id={"get-cmd-1"} className="">
                <Row className="mb-3">
                  <Col lg="10"><label>{header} Logs</label></Col>
                  <Col lg="2" className="text-end">
                    <NavLink to="" onClick={() => { handleDownload(); }} className=" btn btn-sm btn-success" id="page-next">
                      <i className="ri-file-download-line align-bottom me-1"></i>
                      Download
                    </NavLink>
                  </Col>
                </Row>
                <textarea className="form-control" name="properties_file" id="properties_file_1" rows="20" defaultValue={fileContent}></textarea>

                <br></br><Row
                  className="g-0 justify-content-right mb-4"
                  id="pagination-element"
                  style={{ width: "40% !important" }}
                >
                  <Col sm="6">
                    <div className="pagination-block pagination pagination-separated mb-sm-0">

                      <div className="page-item">
                        <NavLink to="" onClick={() => { setViewModal(!documentModal); }} className="button-red page-link" id="page-next">
                          Cancel
                        </NavLink>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default LogFile;
