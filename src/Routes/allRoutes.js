import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import DashboardAnalytics from "../pages/DashboardAnalytics";
import DashboardCrm from "../pages/DashboardCrm";
import DashboardEcommerce from "../pages/DashboardEcommerce";
import DashboardJob from "../pages/DashboardJob/";
import DashboardCrypto from "../pages/DashboardCrypto";
import DashboardProject from "../pages/DashboardProject";
import DashboardNFT from "../pages/DashboardNFT";

//Calendar
// Email box
import MailInbox from "../pages/EmailInbox";
import BasicAction from "../pages/Email/EmailTemplates/BasicAction";
import EcommerceAction from "../pages/Email/EmailTemplates/EcommerceAction";

//Chat
import Chat from "../pages/Chat";
import Calendar from "../pages/Calendar";

// Project
import ProjectList from "../pages/Projects/ProjectList";
import ProjectOverview from "../pages/Projects/ProjectOverview";
import CreateProject from "../pages/Projects/CreateProject";

//Task
import TaskDetails from "../pages/Tasks/TaskDetails";
import TaskList from "../pages/Tasks/TaskList";

//Transactions
import Transactions from '../pages/Crypto/Transactions';
import BuySell from '../pages/Crypto/BuySell';
import CryproOrder from '../pages/Crypto/CryptoOrder';
import MyWallet from '../pages/Crypto/MyWallet';
import ICOList from '../pages/Crypto/ICOList';
import KYCVerification from '../pages/Crypto/KYCVerification';

//Crm Pages
import CrmCompanies from "../pages/Crm/CrmCompanies";
import CrmContacts from "../pages/Crm/CrmContacts";
import CrmDeals from "../pages/Crm/CrmDeals/index";
import CrmLeads from "../pages/Crm/CrmLeads/index";

//Invoices
import InvoiceList from "../pages/Invoices/InvoiceList";
import InvoiceCreate from "../pages/Invoices/InvoiceCreate";
import InvoiceDetails from "../pages/Invoices/InvoiceDetails";

// Support Tickets
import ListView from '../pages/SupportTickets/ListView';
import TicketsDetails from '../pages/SupportTickets/TicketsDetails';

// //Ecommerce Pages
import EcommerceProducts from "../pages/Ecommerce/EcommerceProducts/index";
import EcommerceProductDetail from "../pages/Ecommerce/EcommerceProducts/EcommerceProductDetail";
import EcommerceAddProduct from "../pages/Ecommerce/EcommerceProducts/EcommerceAddProduct";
import EcommerceEditProduct from "../pages/Ecommerce/EcommerceProducts/EcommerceEditProduct";
import EcommerceOrders from "../pages/Ecommerce/EcommerceOrders/index";
import EcommerceOrderDetail from "../pages/Ecommerce/EcommerceOrders/EcommerceOrderDetail";
import EcommerceCustomers from "../pages/Ecommerce/EcommerceCustomers/index";
import EcommerceCart from "../pages/Ecommerce/EcommerceCart";
import EcommerceCheckout from "../pages/Ecommerce/EcommerceCheckout";
import EcommerceSellers from "../pages/Ecommerce/EcommerceSellers/index";
import EcommerceSellerDetail from "../pages/Ecommerce/EcommerceSellers/EcommerceSellerDetail";


//Masters Pages
//import TestScroll from "../pages/Master/MasterCustomers/TestScroll";
import MasterCustomers from "../pages/Master/MasterCustomers/index";
import MasterPlants from "../pages/Master/MasterPlants";
import MasterRoles from "../pages/Master/MasterRoles";
import MasterDriver from "../pages/Master/MasterDriver/index";
import MasterCleaner from "../pages/Master/MasterCleaner/index";
import MasterVehicle from "../pages/Master/MasterVehicle/index";
import MasterDevice from "../pages/Master/MasterDevice";
import MasterMaterial from "../pages/Master/MasterMaterial/index";
import MasterUsers from "../pages/Master/MasterUsers/index";
import MasterTolerance from "../pages/Master/MasterTolerance";



//Reports Pages
// import ReportIndent from "../pages/Report/ReportIndent/index";
import ReportScheduled from "../pages/Report/ReportScheduled/index";
// import ReportQuota from "../pages/Report/ReportQuota/index";
// import ReportOrders from "../pages/Report/ReportOrders/index";
// import ReportCancelIndent from "../pages/Report/ReportCancelIndent/index";
import AllQuota from "../pages/Master/ReportQuota/index";
import CLusterPlantMap from "../pages/Master/CLusterPlantMap/index";




//JBPM Pages
import MasterJBPMRaiseIndex from "../pages/JBPM/JBPMIntegration/raiseIndent";
import MasterJBPMProcessing from "../pages/JBPM/JBPMIntegration/processing";
import MasterJBPMIndexing from "../pages/JBPM/JBPMIntegration/indexing";

// NFT Marketplace Pages
import Marketplace from "../pages/NFTMarketplace/Marketplace";
import Collections from "../pages/NFTMarketplace/Collections";
import CreateNFT from "../pages/NFTMarketplace/CreateNFT";
import Creators from "../pages/NFTMarketplace/Creators";
import ExploreNow from "../pages/NFTMarketplace/ExploreNow";
import ItemDetails from "../pages/NFTMarketplace/Itemdetails";
import LiveAuction from "../pages/NFTMarketplace/LiveAuction";
import Ranking from "../pages/NFTMarketplace/Ranking";
import WalletConnect from "../pages/NFTMarketplace/WalletConnect";

// Base Ui
import UiAlerts from "../pages/BaseUi/UiAlerts/UiAlerts";
import UiBadges from "../pages/BaseUi/UiBadges/UiBadges";
import UiButtons from "../pages/BaseUi/UiButtons/UiButtons";
import UiColors from "../pages/BaseUi/UiColors/UiColors";
import UiCards from "../pages/BaseUi/UiCards/UiCards";
import UiCarousel from "../pages/BaseUi/UiCarousel/UiCarousel";
import UiDropdowns from "../pages/BaseUi/UiDropdowns/UiDropdowns";
import UiGrid from "../pages/BaseUi/UiGrid/UiGrid";
import UiImages from "../pages/BaseUi/UiImages/UiImages";
import UiTabs from "../pages/BaseUi/UiTabs/UiTabs";
import UiAccordions from "../pages/BaseUi/UiAccordion&Collapse/UiAccordion&Collapse";
import UiModals from "../pages/BaseUi/UiModals/UiModals";
import UiOffcanvas from "../pages/BaseUi/UiOffcanvas/UiOffcanvas";
import UiPlaceholders from "../pages/BaseUi/UiPlaceholders/UiPlaceholders";
import UiProgress from "../pages/BaseUi/UiProgress/UiProgress";
import UiNotifications from "../pages/BaseUi/UiNotifications/UiNotifications";
import UiMediaobject from "../pages/BaseUi/UiMediaobject/UiMediaobject";
import UiEmbedVideo from "../pages/BaseUi/UiEmbedVideo/UiEmbedVideo";
import UiTypography from "../pages/BaseUi/UiTypography/UiTypography";
import UiList from "../pages/BaseUi/UiLists/UiLists";
import UiGeneral from "../pages/BaseUi/UiGeneral/UiGeneral";
import UiRibbons from "../pages/BaseUi/UiRibbons/UiRibbons";
import UiUtilities from "../pages/BaseUi/UiUtilities/UiUtilities";

// Advance Ui
import UiNestableList from "../pages/AdvanceUi/UiNestableList/UiNestableList";
import UiScrollbar from "../pages/AdvanceUi/UiScrollbar/UiScrollbar";
import UiAnimation from "../pages/AdvanceUi/UiAnimation/UiAnimation";
import UiTour from "../pages/AdvanceUi/UiTour/UiTour";
import UiSwiperSlider from "../pages/AdvanceUi/UiSwiperSlider/UiSwiperSlider";
import UiRatings from "../pages/AdvanceUi/UiRatings/UiRatings";
import UiHighlight from "../pages/AdvanceUi/UiHighlight/UiHighlight";

// Widgets
import Widgets from '../pages/Widgets/Index';

//Forms
import BasicElements from "../pages/Forms/BasicElements/BasicElements";
import FormSelect from "../pages/Forms/FormSelect/FormSelect";
import FormEditor from "../pages/Forms/FormEditor/FormEditor";
import CheckBoxAndRadio from "../pages/Forms/CheckboxAndRadio/CheckBoxAndRadio";
import Masks from "../pages/Forms/Masks/Masks";
import FileUpload from "../pages/Forms/FileUpload/FileUpload";
import FormPickers from "../pages/Forms/FormPickers/FormPickers";
import FormRangeSlider from "../pages/Forms/FormRangeSlider/FormRangeSlider";
import Formlayouts from "../pages/Forms/FormLayouts/Formlayouts";
import FormValidation from "../pages/Forms/FormValidation/FormValidation";
import FormWizard from "../pages/Forms/FormWizard/FormWizard";
import FormAdvanced from "../pages/Forms/FormAdvanced/FormAdvanced";
import Select2 from "../pages/Forms/Select2/Select2";

//Tables
import BasicTables from '../pages/Tables/BasicTables/BasicTables';
import GridTables from '../pages/Tables/GridTables/GridTables';
import ListTables from '../pages/Tables/ListTables/ListTables';
import DataTables from "../pages/Tables/DataTables/DataTables";

//Icon pages
import RemixIcons from "../pages/Icons/RemixIcons/RemixIcons";
import BoxIcons from "../pages/Icons/BoxIcons/BoxIcons";
import MaterialDesign from "../pages/Icons/MaterialDesign/MaterialDesign";
import FeatherIcons from "../pages/Icons/FeatherIcons/FeatherIcons";
import LineAwesomeIcons from "../pages/Icons/LineAwesomeIcons/LineAwesomeIcons";
import CryptoIcons from "../pages/Icons/CryptoIcons/CryptoIcons";

//Maps
import GoogleMaps from "../pages/Maps/GoogleMaps/GoogleMaps";
import VectorMaps from "../pages/Maps/VectorMaps/VectorMaps";
import LeafletMaps from "../pages/Maps/LeafletMaps/LeafletMaps";

//AuthenticationInner pages
import BasicSignIn from '../pages/AuthenticationInner/Login/BasicSignIn';
import CoverSignIn from '../pages/AuthenticationInner/Login/CoverSignIn';
import BasicSignUp from '../pages/AuthenticationInner/Register/BasicSignUp';
import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";
import BasicPasswReset from '../pages/AuthenticationInner/PasswordReset/BasicPasswReset';
//pages
import Starter from '../pages/Pages/Starter/Starter';
import SimplePage from '../pages/Pages/Profile/SimplePage/SimplePage';
import Settings from '../pages/Pages/Profile/Settings/Settings';
import Team from '../pages/Pages/Team/Team';
import Timeline from '../pages/Pages/Timeline/Timeline';
import Faqs from '../pages/Pages/Faqs/Faqs';
import Pricing from '../pages/Pages/Pricing/Pricing';
import Gallery from '../pages/Pages/Gallery/Gallery';
import Maintenance from '../pages/Pages/Maintenance/Maintenance';
import ComingSoon from '../pages/Pages/ComingSoon/ComingSoon';
import SiteMap from '../pages/Pages/SiteMap/SiteMap';
import SearchResults from '../pages/Pages/SearchResults/SearchResults';

import CoverPasswReset from '../pages/AuthenticationInner/PasswordReset/CoverPasswReset';
import BasicLockScreen from '../pages/AuthenticationInner/LockScreen/BasicLockScr';
import CoverLockScreen from '../pages/AuthenticationInner/LockScreen/CoverLockScr';
import BasicLogout from '../pages/AuthenticationInner/Logout/BasicLogout';
import CoverLogout from '../pages/AuthenticationInner/Logout/CoverLogout';
import BasicSuccessMsg from '../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg';
import CoverSuccessMsg from '../pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg';
import BasicTwosVerify from '../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify';
import CoverTwosVerify from '../pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify';
import Basic404 from '../pages/AuthenticationInner/Errors/Basic404';
import Cover404 from '../pages/AuthenticationInner/Errors/Cover404';
import Alt404 from '../pages/AuthenticationInner/Errors/Alt404';
import Error500 from '../pages/AuthenticationInner/Errors/Error500';

import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import CoverPasswCreate from "../pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

//APi Key
import APIKey from "../pages/APIKey/index";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import UserDropdownScreen from "../pages/Authentication/UserDropdownScreen";
import AddCustomerFirst from "../pages/Authentication/AddCustomerFirst";
import ChangePassword from "../pages/Authentication/ChangePassword";

//Charts
import LineCharts from "../pages/Charts/ApexCharts/LineCharts";
import AreaCharts from "../pages/Charts/ApexCharts/AreaCharts";
import ColumnCharts from "../pages/Charts/ApexCharts/ColumnCharts";
import BarCharts from "../pages/Charts/ApexCharts/BarCharts";
import MixedCharts from "../pages/Charts/ApexCharts/MixedCharts";
import TimelineCharts from "../pages/Charts/ApexCharts/TimelineCharts";
import CandlestickChart from "../pages/Charts/ApexCharts/CandlestickChart";
import BoxplotCharts from "../pages/Charts/ApexCharts/BoxplotCharts";
import BubbleChart from "../pages/Charts/ApexCharts/BubbleChart";
import ScatterCharts from "../pages/Charts/ApexCharts/ScatterCharts";
import HeatmapCharts from "../pages/Charts/ApexCharts/HeatmapCharts";
import TreemapCharts from "../pages/Charts/ApexCharts/TreemapCharts";
import PieCharts from "../pages/Charts/ApexCharts/PieCharts";
import RadialbarCharts from "../pages/Charts/ApexCharts/RadialbarCharts";
import RadarCharts from "../pages/Charts/ApexCharts/RadarCharts";
import PolarCharts from "../pages/Charts/ApexCharts/PolarCharts";
import ChartsJs from "../pages/Charts/ChartsJs/index";
import Echarts from "../pages/Charts/ECharts/index";
import EchartsOb from "../pages/Charts/EChartsOb/index";

//Job pages
import Statistics from "../pages/Jobs/Statistics";
import JobList from "../pages/Jobs/JobList/List";
import JobGrid from "../pages/Jobs/JobList/Grid";
import JobOverview from "../pages/Jobs/JobList/Overview";
import CandidateList from "../pages/Jobs/CandidateList/ListView";
import CandidateGrid from "../pages/Jobs/CandidateList/GridView";
import NewJobs from "../pages/Jobs/NewJob";
import JobCategories from "../pages/Jobs/JobCategories";
import Application from "../pages/Jobs/Application";
import CompaniesList from "../pages/Jobs/CompaniesList";
import BcpDashboard from "../pages/Jobs/BcpDashboard";
import ApprovalScreen from "../pages/ApprovalScreen";


// Landing Index
import OnePage from "../pages/Landing/OnePage";
import NFTLanding from "../pages/Landing/NFTLanding";

import PrivecyPolicy from '../pages/Pages/PrivacyPolicy';
import TermsCondition from '../pages/Pages/TermsCondition';
import JobLanding from "../pages/Job_Landing/Job";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";

import FileManager from "../pages/FileManager";
import ToDoList from "../pages/ToDo";

//Reports
import Reports_Indents from "../pages/Reports_Indents";
import Reports_Scheduled from "../pages/Reports_Scheduled";
import Reports_Quota_Utilization from "../pages/Reports_Quota_Utilization";
import Reports_Orders from "../pages/Reports_Orders";
import Reports_Cancelled_Indents from "../pages/Reports_Cancelled_Indents";
import OTPScreen from "../pages/Authentication/OTPScreen";
import OTPScreen2 from "../pages/Authentication/OTPScreen2";
import PlaceIndent from "../pages/Ecommerce/PlaceIndent";
import IndentSummary from "../pages/IndentSummary";
import IndentDiversion from "../pages/IndentSummary/indentDiversion";

//Sequence Module

import SequenceModule from "../pages/Master/SequenceModule/index";
import PIFile from "../pages/PIFile/index";

//Indent Cancellation
import IndentCancellationPage from "../pages/IndentCancellation/index";
import MasterDeviceType from "../pages/Master/MasterDeviceType";
import MasterDepartment from "../pages/Master/MasterDepartment";
import MasterCluster from "../pages/Master/MasterCluster";
import MasterCompany from "../pages/Master/MasterCompany";
import MasterCommonConstants from "../pages/Master/MasterCommonConstants";
import MasterCommonShift from "../pages/Master/MasterCommonShift";
import MasterMaterialType from "../pages/Master/MasterMaterialType";
import MasterMainMenu from "../pages/Master/MasterMainMenu";
import MasterSubMenu from "../pages/Master/MasterSubMenu";
import MasterMovement from "../pages/Master/MasterMovement";
import StageLocation from "../pages/Master/StageLocation";
import MasterStage from "../pages/Master/MasterStage";
import MasterVehicleTagMap from "../pages/Master/MasterVehicleTagMap";
import MasterPlan from "../pages/Master/MasterPlan";
import MasterModule from "../pages/Master/MasterModule";
import MasterInterface from "../pages/Master/MasterInterface";
import MasterDocumentType from "../pages/Master/MasterDocumentType";
import CSR from "../pages/Report/CSR";
import PMR from "../pages/Report/PMR";
import StageUpdate from "../pages/Report/StageUpdate";
import VehicleStatus from "../pages/Report/VehicleStatus";
import TagMapping from "../pages/Report/TagMapping";
import Tolerance from "../pages/Report/Tolerance";
import WeightApprove from "../pages/Report/WeightApprove";
import YardDashboard from "../pages/Master/MasterVehicle/yardDashboard";
import PackerLoader from "../pages/Sequencing/PackerLoader";
import PackerLoaderMapping from "../pages/Sequencing/PackerLoaderMapping";
import SequencingPage from "../pages/Sequencing/Sequencing";
import SequencingIBPage from "../pages/Sequencing/SequencingIB";
import OutBoundSequenceModule from "../pages/Master/SequenceModule/outBoundSequenceModule";
import MasterUnit from "../pages/Master/MasterUnit";

import MenuMenuMapping from "../pages/UserMapping/MenuMapping"
import LogFile from "../pages/PIFile/logFile";
import DeviceConfiguration from "../pages/PIFile/deviceConfig";
import SAPDetails from "../pages/SAP Details";

//MRP
import MRPDashboard from "../pages/Master/MasterVehicle/MRPDashboard";
import DispatchReport from "../pages/Report/DispatchReport";
import LoadingWiseReport from "../pages/Report/LoadingWiseReport";
import BagCounter from "../pages/BagCounter";
import MrpPrinter from "../pages/MRPPrinter";
import Reportmrp from "../pages/Report/Reportmrp";
import TruckDetailReport from "../pages/Report/TruckDetails";
import PackerLoaderCharts from "../pages/Master/MasterVehicle/packerLoaderDashboard";
import PlantConfiguration from "../pages/PIFile/plantConfiguration";
import SalesAndDispatchOB from "../pages/Jobs/SalesAndDispatchOB";
import MasterTarget from "../pages/Master/MasterTarget";
import TransactionalLogs from "../pages/PIFile/TransactionalLogs";
import YourComponent from "../pages/PIFile/dheeraj";
import WeighBridge from "../pages/Jobs/WeighBridge";
import LiveTV360 from "../pages/Jobs/SalesAndDispatchOB/LiveTvPlant360";
import TATReport from "../pages/Report/TATReport";
import DriverUpload from "../pages/OCR/DriverUpload";
import VehicleUpload from "../pages/OCR/VehicleUpload";
import AutoMailer from "../pages/PIFile/autoMailer";
import BulkerPage from "../pages/Jobs/WeighBridge/Bulker";
import DODetails from "../pages/Jobs/DODetails";
import VehicleLiveStatus from "../pages/Jobs/VehicleStatus";
import ManualTripClose from "../pages/PIFile/ManualTripClose";
import DOCreation from "../pages/Jobs/DODetails/DOCreation";
import PGI_InvoicingReport from "../pages/Report/PGI_Invoicing";
import PlantDashboard from "../pages/Jobs/SalesAndDispatchOB/PlantDashboard";
import AuditLogs from "../pages/Report/AuditLogs";
import ToleranceAuditReport from "../pages/Report/ToleranceAuditReport";
import TruckMonitoring from "../pages/TruckMonitoring";
import MasterTransporter from "../pages/Master/MasterTransporters";
import MasterRoute from "../pages/Master/MasterRoute";
import SmartLoaderVision from "../pages/TruckMonitoring/smartLoaderVision";
import MapPOWithVehicle from "../pages/Master/MapPoWithVehicle";
import ParkingYardVisiblity from "../pages/Jobs/ParkingYardVisiblity";
import POCreation from "../pages/Master/MapPoWithVehicle/poCreation";
import YardDashboardIB from "../pages/Master/MasterVehicle/yardDashboardIB";
import MasterToleranceBLK from "../pages/Master/MasterTolerance/toleranceMasterBLK";
import LiveYardInDashboard from "../pages/Jobs/SalesAndDispatchOB/LiveYardInDashboard";
import TWApprove from "../pages/Report/WeightApprove/TWApprove";
import ReportTareWeight from "../pages/Report/TareWeightReport";
import SalesOrderCreation from "../pages/Master/SalesOrderCreation";
import TransporterPlantMapping from "../pages/Master/SalesOrderCreation/transporterPlantMapping";
import SalesOrderBiddingConfig from "../pages/Master/SalesOrderCreation/salesOrderBiddingConfig";
import SalesOrderDashboard from "../pages/Master/SalesOrderCreation/salesOrderDashboard";
import BiddingCreation from "../pages/Master/SalesOrderCreation/biddingCreation";
import SAPMasterData from "../pages/Master/IBSap/sapMasterData";
import Plant360IB from "../pages/Jobs/SalesAndDispatchOB/plant360IB";
import PlantMapping from "../pages/Mapping/PlantMapping";
import RouteMapping from "../pages/Mapping/RouteMapping";
import BidOrderConfirmation from "../pages/Auction/BidOrderConfirmation";
import AuctionDashboard from "../pages/Auction/DashBoard";
import ViewAllBids from "../pages/Auction/DashBoard/AllBids";
import TransporterDashboard from "../pages/TransporterDashboard/DashBoard";
import ViewTransporterBids from '../pages/TransporterDashboard/DashBoard/AllBids'
import RouteDetails from "../pages/TransporterDashboard/RouteDetails/RouteDetails";
import SlotMaster from "../pages/Master/MasterSlot";

import SlocMaster from "../pages/Master/SlocMaster";
import QuotaManagement from "../pages/QuotaManagement/index"; 
import OrderManagement from "../pages/QuotaManagement/OrderManagement";

  
const authProtectedRoutes = [
  { path: "/sloc-master", component: <SlocMaster/>},
  { path: "/quota-management",component: <QuotaManagement />},
  { path: "/order-management",component: <OrderManagement />},
  { path: "/dashboard-analytics", component: <DashboardAnalytics /> },
  { path: "/dashboard-crm", component: <DashboardCrm /> },
  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/index", component: <DashboardEcommerce /> },
  { path: "/dashboard-crypto", component: <DashboardCrypto /> },
  { path: "/dashboard-projects", component: <DashboardProject /> },
  { path: "/dashboard-nft", component: <DashboardNFT /> },
  { path: "/dashboard-job", component: <DashboardJob /> },
  { path: "/apps-calendar", component: <Calendar /> },
  { path: "/apps-ecommerce-products", component: <EcommerceProducts /> },
  { path: "/apps-ecommerce-product-details/:_id", component: <EcommerceProductDetail /> },
  { path: "/apps-ecommerce-product-details", component: <EcommerceProductDetail /> },
  //{ path: "/apps-ecommerce-add-product", component: <EcommerceAddProduct /> },
  { path: "/apps-ecommerce-checkout", component: <EcommerceCheckout /> },
  { path: "/place-indent", component: <PlaceIndent /> },
  { /*path: "/apps-ecommerce-add-product", component: <EcommerceAddProduct />*/ },
  { path: "/apps-ecommerce-edit-product/:_id", component: <EcommerceEditProduct /> },
  { path: "/apps-ecommerce-orders", component: <EcommerceOrders /> },
  { path: "/apps-ecommerce-order-details", component: <EcommerceOrderDetail /> },
  { path: "/apps-ecommerce-customers", component: <EcommerceCustomers /> },
  { path: "/apps-ecommerce-cart", component: <EcommerceCart /> },
  { path: "/apps-ecommerce-add-product", component: <EcommerceCheckout /> },
  { path: "/apps-ecommerce-sellers", component: <EcommerceSellers /> },
  { path: "/apps-ecommerce-seller-details", component: <EcommerceSellerDetail /> },
  { path: "/apps-file-manager", component: <FileManager /> },
  { path: "/apps-todo", component: <ToDoList /> },
  { path: "/approval-screen", component: <ApprovalScreen /> },
  { path: "/smart-loader", component: <SmartLoaderVision /> },


  //Master

  //{ path: "/scroll-master", component: <TestScroll /> },
  { path: "/customer-master", component: <MasterCustomers /> },
  { path: "/plants", component: <MasterPlants /> },
  { path: "/transporter", component: <MasterTransporter /> },
  { path: "/route", component: <MasterRoute /> },
  { path: "/slot", component: <SlotMaster /> },

  { path: "/roles", component: <MasterRoles /> },
  { path: "/vehicle", component: <MasterVehicle /> },
  { path: "/device", component: <MasterDevice /> },
  { path: "/deviceType", component: <MasterDeviceType /> },
  { path: "/department", component: <MasterDepartment /> },
  { path: "/cluster", component: <MasterCluster /> },
  { path: "/company", component: <MasterCompany /> },
  { path: "/commonConstant", component: <MasterCommonConstants /> },
  { path: "/commomShift", component: <MasterCommonShift /> },
  { path: "/unit", component: <MasterUnit /> },
  { path: "/target", component: <MasterTarget /> },
  { path: "/cleaner", component: <MasterCleaner /> },
  { path: "/driver", component: <MasterDriver /> },
  { path: "/material", component: <MasterMaterial /> },
  { path: "/material-types", component: <MasterMaterialType /> },
  { path: "/main-menu", component: <MasterMainMenu /> },
  { path: "/sub-menu", component: <MasterSubMenu /> },
  { path: "/movements", component: <MasterMovement /> },
  { path: "/stage-location", component: <StageLocation /> },
  { path: "/stage", component: <MasterStage /> },
  { path: "/vehicle-tag-mapping", component: <MasterVehicleTagMap /> },
  { path: "/plan-master", component: <MasterPlan /> },
  { path: "/module-master", component: <MasterModule /> },
  { path: "/interface", component: <MasterInterface /> },
  { path: "/document-type-mastrer", component: <MasterDocumentType /> },
  { path: "/users", component: <MasterUsers /> },
  { path: "/yard-Dashboard", component: <YardDashboard /> },
  { path: "/yard-Dashboard-IB", component: <YardDashboardIB /> },
  { path: "/MRP-Dashboard", component: <MRPDashboard /> },
  { path: "/tolerance-master", component: <MasterTolerance /> },
  { path: "/tolerance-master-blk", component: <MasterToleranceBLK /> },
  { path: "/menu-sub-pages-role-map", component: <MenuMenuMapping /> },
  { path: "/packer-laoder-Dashboard", component: <PackerLoaderCharts /> },
  { path: "/map-po-vehicle", component: <MapPOWithVehicle /> },
  { path: "/parkingYard-visibility", component: <ParkingYardVisiblity /> },
  { path: "/sales-order", component: <SalesOrderCreation /> },
  { path: "/transporter-plant-mapping", component: <TransporterPlantMapping /> },
  { path: "/sales-order-config", component: <SalesOrderBiddingConfig /> },
  { path: "/sales-order-dashboard", component: <SalesOrderDashboard /> },
  { path: "/bidding-creation", component: <BiddingCreation /> },
  { path: "/sap-master-data", component: <SAPMasterData /> },

  //Mapping

  { path: "/plant-mapping", component: <PlantMapping /> },
  { path: "/route-mapping", component: <RouteMapping /> },

  //Auction
  { path: "/bid-order-confirmation", component: <BidOrderConfirmation /> },
  { path: "/auction-dashboard", component: <AuctionDashboard /> },
  { path: "/view-all-bids", component: <ViewAllBids /> },

    //transporter 
   
    { path: "/transporter-dashboard", component: <TransporterDashboard /> },
    { path: "/view-all-transporter-bids", component: <ViewTransporterBids /> },
    { path: "/transporter-route-details", component: <RouteDetails /> },

  // Sequencing
  { path: "/packer-loader", component: <PackerLoader /> },
  { path: "/packer-loader-mapping", component: <PackerLoaderMapping /> },
  { path: "/sequencing-OB", component: <SequencingPage /> },
  { path: "/sequencing-IB", component: <SequencingIBPage /> },
  { path: "outbound-sequence-module", component: <OutBoundSequenceModule /> },


  //JBPM 
  //{ path: "/raise-indent", component: <MasterJBPMRaiseIndex /> },
  { path: "/processing", component: <MasterJBPMProcessing /> },
  { path: "/indexing", component: <MasterJBPMIndexing /> },

  //Reports
  // { path: "/report-indent", component: <ReportIndent /> },
  { path: "/report-scheduled", component: <ReportScheduled /> },
  // { path: "/report-quota", component: <ReportQuota /> },
  // { path: "/report-orders", component: <ReportOrders /> },
  // { path: "/report-cancel-indent", component: <ReportCancelIndent /> },
  { path: "/configurations", component: <AllQuota /> },
  { path: "/truck-detail-report", component: <TruckDetailReport /> },

  { path: "/report-csr", component: <CSR /> },
  { path: "/report-pmr", component: <PMR /> },
  { path: "/stage-update", component: <StageUpdate /> },
  { path: "/vehicle-status", component: <VehicleStatus /> },
  { path: "/tagMapping", component: <TagMapping /> },
  { path: "/tare-weight-report", component: <ReportTareWeight /> },
  { path: "/tolerance", component: <Tolerance /> },
  { path: "/weight-approve", component: <WeightApprove /> },
  { path: "/tare-weight-approve", component: <TWApprove /> },
  { path: "/tat-reports", component: <TATReport /> },
  { path: "/invoicing-details", component: <PGI_InvoicingReport /> },

  { path: "/dispatch-report", component: <DispatchReport /> },
  { path: "/loading-wise-report", component: <LoadingWiseReport /> },
  { path: "/audit-logs", component: <AuditLogs /> },
  { path: "/tolerance-audit-reports", component: <ToleranceAuditReport /> },

  //Plant cluster mapping
  { path: "/cluster-plant-map", component: <CLusterPlantMap /> },

  //Indent Summary
  // { path: "/indentSummary", component: <IndentSummary /> },
  // { path: "/indentDiversion", component: <IndentDiversion /> },

  //Indent Cancellation
  // { path: "/indent-Cancellation", component: <IndentCancellationPage /> },


  //MRP
  { path: "/bag_bounter", component: <BagCounter /> },
  { path: "/mrp_printer", component: <MrpPrinter /> },
  { path: "/report_mrp", component: <Reportmrp /> },

  //PiFile Module
  { path: "/pi-file", component: <PIFile /> },
  { path: "/log-file", component: <LogFile /> },
  { path: "/device-configuration", component: <DeviceConfiguration /> },
  { path: "/plant-configuration", component: <PlantConfiguration /> },
  { path: "/transactional-logs", component: <TransactionalLogs /> },
  { path: "/auto-mailer", component: <AutoMailer /> },
  { path: "/manual-trip-close", component: <ManualTripClose /> },
  { path: "/dheeraj", component: <YourComponent /> },

  //SAP Details
  { path: "/sap-details", component: <SAPDetails /> },

  //OCR
  { path: "/ocr-driver", component: <DriverUpload /> },
  { path: "/ocr-vehicle", component: <VehicleUpload /> },

  //Sequence Module
  { path: "/sequence-module", component: <SequenceModule /> },

  //Chat
  { path: "/apps-chat", component: <Chat /> },

  //EMail
  { path: "/apps-mailbox", component: <MailInbox /> },
  { path: "/apps-email-basic", component: <BasicAction /> },
  { path: "/apps-email-ecommerce", component: <EcommerceAction /> },

  //Projects
  { path: "/apps-projects-list", component: <ProjectList /> },
  { path: "/apps-projects-overview", component: <ProjectOverview /> },
  { path: "/apps-projects-create", component: <CreateProject /> },
  { path: "/add-product-category", component: <CrmLeads /> },


  //Task
  { path: "/gate-out", component: <TaskList /> },
  { path: "/apps-tasks-details/:_id", component: <TaskDetails /> },

  //Api Key7.6+*02
  { path: "/apps-api-key", component: <APIKey /> },

  //Crm
  { path: "/apps-crm-contacts", component: <CrmContacts /> },
  { path: "/apps-crm-companies", component: <CrmCompanies /> },
  { path: "/apps-crm-deals", component: <CrmDeals /> },
  { path: "/apps-crm-leads", component: <CrmLeads /> },

  //Invoices
  { path: "/apps-invoices-list", component: <InvoiceList /> },
  { path: "/apps-invoices-details", component: <InvoiceDetails /> },
  { path: "/apps-invoices-create", component: <InvoiceCreate /> },

  //Supports Tickets
  { path: "/apps-tickets-list", component: <ListView /> },
  { path: "/apps-tickets-details", component: <TicketsDetails /> },

  //transactions
  { path: "/apps-crypto-transactions", component: <Transactions /> },
  { path: "/apps-crypto-buy-sell", component: <BuySell /> },
  { path: "/apps-crypto-orders", component: <CryproOrder /> },
  { path: "/apps-crypto-wallet", component: <MyWallet /> },
  { path: "/apps-crypto-ico", component: <ICOList /> },
  { path: "/apps-crypto-kyc", component: <MasterJBPMRaiseIndex /> },
  { path: "/raise-indent", component: <KYCVerification /> },

  // NFT Marketplace
  { path: "/apps-nft-marketplace", component: <Marketplace /> },
  { path: "/apps-nft-collections", component: <Collections /> },
  { path: "/apps-nft-create", component: <CreateNFT /> },
  { path: "/apps-nft-creators", component: <Creators /> },
  { path: "/apps-nft-explore", component: <ExploreNow /> },
  { path: "/apps-nft-item-details", component: <ItemDetails /> },
  { path: "/apps-nft-auction", component: <LiveAuction /> },
  { path: "/apps-nft-ranking", component: <Ranking /> },
  { path: "/apps-nft-wallet", component: <WalletConnect /> },

  //charts
  { path: "/charts-apex-line", component: <LineCharts /> },
  { path: "/charts-apex-area", component: <AreaCharts /> },
  { path: "/charts-apex-column", component: <ColumnCharts /> },
  { path: "/charts-apex-bar", component: <BarCharts /> },
  { path: "/charts-apex-mixed", component: <MixedCharts /> },
  { path: "/charts-apex-timeline", component: <TimelineCharts /> },
  { path: "/charts-apex-candlestick", component: <CandlestickChart /> },
  { path: "/charts-apex-boxplot", component: <BoxplotCharts /> },
  { path: "/charts-apex-bubble", component: <BubbleChart /> },
  { path: "/charts-apex-scatter", component: <ScatterCharts /> },
  { path: "/charts-apex-heatmap", component: <HeatmapCharts /> },
  { path: "/charts-apex-treemap", component: <TreemapCharts /> },
  { path: "/charts-apex-pie", component: <PieCharts /> },
  { path: "/charts-apex-radialbar", component: <RadialbarCharts /> },
  { path: "/charts-apex-radar", component: <RadarCharts /> },
  { path: "/charts-apex-polar", component: <PolarCharts /> },

  { path: "/charts-chartjs", component: <ChartsJs /> },
  { path: "/sequence-dashboard", component: <Echarts /> },
  { path: "/sequence-dashboard-ob", component: <EchartsOb /> },


  // Base Ui
  { path: "/ui-alerts", component: <UiAlerts /> },
  { path: "/ui-badges", component: <UiBadges /> },
  { path: "/ui-buttons", component: <UiButtons /> },
  { path: "/ui-colors", component: <UiColors /> },
  { path: "/ui-cards", component: <UiCards /> },
  { path: "/ui-carousel", component: <UiCarousel /> },
  { path: "/ui-dropdowns", component: <UiDropdowns /> },
  { path: "/ui-grid", component: <UiGrid /> },
  { path: "/ui-images", component: <UiImages /> },
  { path: "/ui-tabs", component: <UiTabs /> },
  { path: "/ui-accordions", component: <UiAccordions /> },
  { path: "/ui-modals", component: <UiModals /> },
  { path: "/ui-offcanvas", component: <UiOffcanvas /> },
  { path: "/ui-placeholders", component: <UiPlaceholders /> },
  { path: "/ui-progress", component: <UiProgress /> },
  { path: "/ui-notifications", component: <UiNotifications /> },
  { path: "/ui-media", component: <UiMediaobject /> },
  { path: "/ui-embed-video", component: <UiEmbedVideo /> },
  { path: "/ui-typography", component: <UiTypography /> },
  { path: "/ui-lists", component: <UiList /> },
  { path: "/ui-general", component: <UiGeneral /> },
  { path: "/ui-ribbons", component: <UiRibbons /> },
  { path: "/ui-utilities", component: <UiUtilities /> },

  // Advance Ui
  { path: "/advance-ui-nestable", component: <UiNestableList /> },
  { path: "/advance-ui-scrollbar", component: <UiScrollbar /> },
  { path: "/advance-ui-animation", component: <UiAnimation /> },
  { path: "/advance-ui-tour", component: <UiTour /> },
  { path: "/advance-ui-swiper", component: <UiSwiperSlider /> },
  { path: "/advance-ui-ratings", component: <UiRatings /> },
  { path: "/advance-ui-highlight", component: <UiHighlight /> },

  // Widgets
  { path: "/widgets", component: <Widgets /> },

  // Forms
  { path: "/forms-elements", component: <BasicElements /> },
  { path: "/forms-select", component: <FormSelect /> },
  { path: "/forms-editors", component: <FormEditor /> },
  { path: "/forms-checkboxes-radios", component: <CheckBoxAndRadio /> },
  { path: "/forms-masks", component: <Masks /> },
  { path: "/forms-file-uploads", component: <FileUpload /> },
  { path: "/forms-pickers", component: <FormPickers /> },
  { path: "/forms-range-sliders", component: <FormRangeSlider /> },
  { path: "/forms-layouts", component: <Formlayouts /> },
  { path: "/forms-validation", component: <FormValidation /> },
  { path: "/forms-wizard", component: <FormWizard /> },
  { path: "/forms-advanced", component: <FormAdvanced /> },
  { path: "/forms-select2", component: <Select2 /> },

  //Tables
  { path: "/tables-basic", component: <BasicTables /> },
  { path: "/tables-gridjs", component: <GridTables /> },
  { path: "/tables-listjs", component: <ListTables /> },
  { path: "/tables-datatables", component: <DataTables /> },

  //Icons
  { path: "/icons-remix", component: <RemixIcons /> },
  { path: "/icons-boxicons", component: <BoxIcons /> },
  { path: "/icons-materialdesign", component: <MaterialDesign /> },
  { path: "/icons-feather", component: <FeatherIcons /> },
  { path: "/icons-lineawesome", component: <LineAwesomeIcons /> },
  { path: "/icons-crypto", component: <CryptoIcons /> },

  //Maps
  { path: "/maps-google", component: <GoogleMaps /> },
  { path: "/maps-vector", component: <VectorMaps /> },
  { path: "/maps-leaflet", component: <LeafletMaps /> },

  //Pages
  { path: "/pages-starter", component: <Starter /> },
  { path: "/pages-profile", component: <SimplePage /> },
  { path: "/pages-profile-settings", component: <Settings /> },
  { path: "/products", component: <Team /> },
  // { path: "/pages-team", component: <Team /> },
  { path: "/pages-timeline", component: <Timeline /> },
  { path: "/pages-faqs", component: <Faqs /> },
  { path: "/pages-gallery", component: <Gallery /> },
  { path: "/pages-pricing", component: <Pricing /> },
  { path: "/pages-sitemap", component: <SiteMap /> },
  { path: "/pages-search-results", component: <SearchResults /> },

  //Job pages
  { path: "/apps-job-statistics", component: <Statistics /> },
  { path: "/apps-job-lists", component: <JobList /> },
  { path: "/apps-job-grid-lists", component: <JobGrid /> },
  { path: "/apps-job-details", component: <JobOverview /> },
  { path: "/apps-job-candidate-lists", component: <CandidateList /> },
  { path: "/apps-job-candidate-grid", component: <CandidateGrid /> },
  { path: "/apps-job-application", component: <Application /> },
  { path: "/apps-job-new", component: <NewJobs /> },
  { path: "/gate-in", component: <CompaniesList /> },
  { path: "/apps-job-categories", component: <JobCategories /> },
  { path: "/bcp-dashboard", component: <BcpDashboard /> },
  { path: "/sales-dispatch", component: <SalesAndDispatchOB /> },
  { path: "/plant360", component: <LiveTV360 /> },
  { path: "/plant-dashboard", component: <PlantDashboard /> },
  { path: "/live-YardIN", component: <LiveYardInDashboard /> },
  { path: "/weighBridge", component: <WeighBridge /> },
  { path: "/bulker", component: <BulkerPage /> },
  { path: "/do-details", component: <DODetails /> },
  { path: "/do-creation", component: <DOCreation /> },
  { path: "/po-creation", component: <POCreation /> },
  { path: "/vehicle-live-status", component: <VehicleLiveStatus /> },
  { path: "/truck-operation-monitoring", component: <TruckMonitoring /> },

  { path: "/pages-privacy-policy", component: <PrivecyPolicy /> },
  { path: "/pages-terms-condition", component: <TermsCondition /> },
  { path: "/sales-dispatch-IB", component: <Plant360IB /> },


  //User Profile
  { path: "/profile", component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/login" />,
  },
  { path: "*", component: <Navigate to="/login" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/change-password", component: <ChangePassword /> },
  { path: "/otp-screen", component: <OTPScreen /> },
  { path: "/otp-screen-mobile", component: <OTPScreen2 /> },
  { path: "/register", component: <Register /> },
  { path: "/userDropdownScreen", component: <UserDropdownScreen /> },
  { path: "/addCustomerFirst", component: <AddCustomerFirst /> },

  //AuthenticationInner pages
  { path: "/auth-signin-basic", component: <BasicSignIn /> },
  { path: "/auth-signin-cover", component: <CoverSignIn /> },
  { path: "/auth-signup-basic", component: <BasicSignUp /> },
  { path: "/auth-signup-cover", component: <CoverSignUp /> },
  { path: "/auth-pass-reset-basic", component: <BasicPasswReset /> },
  { path: "/auth-pass-reset-cover", component: <CoverPasswReset /> },
  { path: "/auth-lockscreen-basic", component: <BasicLockScreen /> },
  { path: "/auth-lockscreen-cover", component: <CoverLockScreen /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  { path: "/auth-logout-cover", component: <CoverLogout /> },
  { path: "/auth-success-msg-basic", component: <BasicSuccessMsg /> },
  { path: "/auth-success-msg-cover", component: <CoverSuccessMsg /> },
  { path: "/auth-twostep-basic", component: <BasicTwosVerify /> },
  { path: "/auth-twostep-cover", component: <CoverTwosVerify /> },
  { path: "/auth-404-basic", component: <Basic404 /> },
  { path: "/auth-404-cover", component: <Cover404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> },
  { path: "/pages-maintenance", component: <Maintenance /> },
  { path: "/pages-coming-soon", component: <ComingSoon /> },

  { path: "/landing", component: <OnePage /> },
  { path: "/nft-landing", component: <NFTLanding /> },
  { path: "/job-landing", component: <JobLanding /> },

  { path: "/auth-pass-change-basic", component: <BasicPasswCreate /> },
  { path: "/auth-pass-change-cover", component: <CoverPasswCreate /> },
  { path: "/auth-offline", component: <Offlinepage /> },

];

export { authProtectedRoutes, publicRoutes };