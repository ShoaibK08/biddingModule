//REGISTER
export const POST_FAKE_REGISTER = "/auth/signup";

//LOGIN
export const POST_FAKE_LOGIN = "/userModule/auth/signin";
export const POST_FAKE_LOGIN_N = "/user-master/login";
export const POST_FAKE_JWT_LOGIN = "/userModule/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/user-master/forgotPassword";
export const POST_FAKE_PASSWORD_RESET = "/user-master/changePassword";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/userModule/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/userModule/social-login";
export const GET_USER_DATA_CODE = "/userModule/users/userData";
export const ADD_NEW_CLUSTER = "/userModule/add/masterCluster";


//OTP
export const POST_FAKE_OTP = "/userModule/users/otpVerification";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/user";
export const GET_INDENT_REPORTS = "/userModule/reports/CurrentIndentReportData";
export const GET_CANCEL_INDENT_REPORTS = "/userModule/reports/CancelledIndentReportData";
export const GET_SCHEDULE_INDENT_REPORTS = "/userModule/reports/ExecutedIndentReportData";


// Calendar
export const GET_EVENTS = "/events";
export const GET_CATEGORIES = "/categories";
export const GET_UPCOMMINGEVENT = "/upcommingevents";
export const ADD_NEW_EVENT = "/add/event";
export const UPDATE_EVENT = "/update/event";
export const DELETE_EVENT = "/delete/event";

// Chat
export const GET_DIRECT_CONTACT = "/chat";
export const GET_MESSAGES = "/messages";
export const ADD_MESSAGE = "add/message";
export const GET_CHANNELS = "/channels";
export const DELETE_MESSAGE = "delete/message";

//Mailbox
export const GET_MAIL_DETAILS = "/mail";
export const DELETE_MAIL = "/delete/mail";

// Ecommerce
// Product
export const GET_PRODUCTS = "/apps/product";
export const DELETE_PRODUCT = "/apps/product";
export const ADD_NEW_PRODUCT = "/sapModule/product";
export const UPDATE_PRODUCT = "/apps/product";

// Orders
//export const GET_ORDERS = "/apps/order";
export const GET_ORDERS = "/sapModule/getAllMaterial";
export const ADD_NEW_ORDER = "/apps/order";
export const UPDATE_ORDER = "/apps/order";
export const DELETE_ORDER = "/apps/order";

// Customers
export const GET_CUSTOMERS = "/sapModule/sap/getAll";
export const GET_CLUSTERS = "/userModule/getAll/masterClusters";
export const GET_PLANTS = "/userModule/get/masterPlant";
export const GET_QUOTA = "/sapModule/getCustomerQuota";
export const ADD_NEW_CUSTOMER = "/user-master";
export const ADD_NEW_CLEANER = "/sapModule/addCleaner";
export const ADD_NEW_VEHICLE = "/sapModule/vehicle";
export const UPDATE_CUSTOMER = "/user-master";
export const UPDATE_CLUSTER = "/userModule/update/masterCluster";
export const UPDATE_PLANT = "/userModule/master";
export const DELETE_CUSTOMER = "/user-master";

//Add plants
export const ADD_NEW_PLANT = "/userModule/add/masterPlant";

export const GET_PROCESS = "/tasklist/Indexing/vikalp";
export const ADD_NEW_RAISE_INDENT = "/rest/server/containers/ApplicationDemo-kjar-1_0-SNAPSHOT/processes/SampleApp.SampleApp/instances";

//Transporters
export const GET_TRANSPORTERS = "/sapModule/getAllPendingTransporter?status=Approved";
export const ADD_NEW_TRANSPORTER = "sapModule/addTransporter";

//Report Indent
export const ADD_NEW_REPORT_INDENT = "/indentModule/indent/placeIndent";

//Driver
export const GET_DRIVERS = "/sapModule/getAllDriver";
export const ADD_NEW_DRIVER = "/sapModule/driver";

//Quota
export const ADD_NEW_QUOTA = "/sapModule/addQuota";

//Vehicle
export const GET_VEHICLES = "/sapModule/getAllVehicle";

// Materials
export const GET_MATERIALS = "/sapModule/getAllMaterial";

// Materials
export const GET_CLEANER = "/sapModule/getAllCleaners";

//Users
export const GET_USERS = "/user-master";

// Sellers
export const GET_SELLERS = "/sellers";

// Project list
export const GET_PROJECT_LIST = "/project/list";

// Task
export const GET_TASK_LIST = "/GateDataController/gateOutDashboardData";
export const ADD_NEW_TASK = "/apps/task";
export const UPDATE_TASK = "/apps/task";
export const DELETE_TASK = "/apps/task";

// CRM
// Conatct
export const GET_CONTACTS = "/apps/contact";
export const ADD_NEW_CONTACT = "/apps/contact";
export const UPDATE_CONTACT = "/apps/contact";
export const DELETE_CONTACT = "/apps/contact";

// Companies
export const GET_COMPANIES = "/apps/company";
export const ADD_NEW_COMPANIES = "/apps/company";
export const UPDATE_COMPANIES = "/apps/company";
export const DELETE_COMPANIES = "/apps/company";

// Lead
export const GET_LEADS = "/sapModule/productCategory/getAllProductCategory";
export const ADD_NEW_LEAD = "/sapModule/productCategory/saveProductCategory";
export const UPDATE_LEAD = "/sapModule/productCategory/updateProductCategory";
export const DELETE_LEAD = "/sapModule/productCategory/deleteProductCategory";

// Deals
export const GET_DEALS = "/deals";

// Crypto
export const GET_TRANSACTION_LIST = "/transaction-list";
export const GET_ORDRER_LIST = "/order-list";

// Invoice
export const GET_INVOICES = "/apps/invoice";
export const ADD_NEW_INVOICE = "/apps/invoice";
export const UPDATE_INVOICE = "/apps/invoice";
export const DELETE_INVOICE = "/apps/invoice";

// TicketsList
export const GET_TICKETS_LIST = "/apps/ticket";
export const ADD_NEW_TICKET = "/apps/ticket";
export const UPDATE_TICKET = "/apps/ticket";
export const DELETE_TICKET = "/apps/ticket";

// Dashboard Analytics

// Sessions by Countries
export const GET_ALL_DATA = "/all-data";
export const GET_HALFYEARLY_DATA = "/halfyearly-data";
export const GET_MONTHLY_DATA = "/monthly-data";

// Audiences Metrics
export const GET_ALLAUDIENCESMETRICS_DATA = "/allAudiencesMetrics-data";
export const GET_MONTHLYAUDIENCESMETRICS_DATA = "/monthlyAudiencesMetrics-data";
export const GET_HALFYEARLYAUDIENCESMETRICS_DATA = "/halfyearlyAudiencesMetrics-data";
export const GET_YEARLYAUDIENCESMETRICS_DATA = "/yearlyAudiencesMetrics-data";

// Users by Device
export const GET_TODAYDEVICE_DATA = "/todayDevice-data";
export const GET_LASTWEEKDEVICE_DATA = "/lastWeekDevice-data";
export const GET_LASTMONTHDEVICE_DATA = "/lastMonthDevice-data";
export const GET_CURRENTYEARDEVICE_DATA = "/currentYearDevice-data";

// Audiences Sessions by Country
export const GET_TODAYSESSION_DATA = "/todaySession-data";
export const GET_LASTWEEKSESSION_DATA = "/lastWeekSession-data";
export const GET_LASTMONTHSESSION_DATA = "/lastMonthSession-data";
export const GET_CURRENTYEARSESSION_DATA = "/currentYearSession-data";

// Dashboard CRM

// Balance Overview
export const GET_TODAYBALANCE_DATA = "/todayBalance-data";
export const GET_LASTWEEKBALANCE_DATA = "/lastWeekBalance-data";
export const GET_LASTMONTHBALANCE_DATA = "/lastMonthBalance-data";
export const GET_CURRENTYEARBALANCE_DATA = "/currentYearBalance-data";

// Deal type
export const GET_TODAYDEAL_DATA = "/todayDeal-data";
export const GET_WEEKLYDEAL_DATA = "/weeklyDeal-data";
export const GET_MONTHLYDEAL_DATA = "/monthlyDeal-data";
export const GET_YEARLYDEAL_DATA = "/yearlyDeal-data";

// Sales Forecast

export const GET_OCTSALES_DATA = "/octSales-data";
export const GET_NOVSALES_DATA = "/novSales-data";
export const GET_DECSALES_DATA = "/decSales-data";
export const GET_JANSALES_DATA = "/janSales-data";

// Dashboard Ecommerce
// Revenue
export const GET_ALLREVENUE_DATA = "/allRevenue-data";
export const GET_MONTHREVENUE_DATA = "/monthRevenue-data";
export const GET_HALFYEARREVENUE_DATA = "/halfYearRevenue-data";
export const GET_YEARREVENUE_DATA = "/yearRevenue-data";

// Dashboard Crypto
// Portfolio
export const GET_BTCPORTFOLIO_DATA = "/btcPortfolio-data";
export const GET_USDPORTFOLIO_DATA = "/usdPortfolio-data";
export const GET_EUROPORTFOLIO_DATA = "/euroPortfolio-data";

// Market Graph
export const GET_ALLMARKETDATA_DATA = "/allMarket-data";
export const GET_YEARMARKET_DATA = "/yearMarket-data";
export const GET_MONTHMARKET_DATA = "/monthMarket-data";
export const GET_WEEKMARKET_DATA = "/weekMarket-data";
export const GET_HOURMARKET_DATA = "/hourMarket-data";

// Dashboard Crypto
// Project Overview
export const GET_ALLPROJECT_DATA = "/allProject-data";
export const GET_MONTHPROJECT_DATA = "/monthProject-data";
export const GET_HALFYEARPROJECT_DATA = "/halfYearProject-data";
export const GET_YEARPROJECT_DATA = "/yearProject-data";

// Project Status
export const GET_ALLPROJECTSTATUS_DATA = "/allProjectStatus-data";
export const GET_WEEKPROJECTSTATUS_DATA = "/weekProjectStatus-data";
export const GET_MONTHPROJECTSTATUS_DATA = "/monthProjectStatus-data";
export const GET_QUARTERPROJECTSTATUS_DATA = "/quarterProjectStatus-data";

// Dashboard NFT
// Marketplace
export const GET_ALLMARKETPLACE_DATA = "/allMarketplace-data";
export const GET_MONTHMARKETPLACE_DATA = "/monthMarketplace-data";
export const GET_HALFYEARMARKETPLACE_DATA = "/halfYearMarketplace-data";
export const GET_YEARMARKETPLACE_DATA = "/yearMarketplace-data";

// Project
export const ADD_NEW_PROJECT = "/add/project";
export const UPDATE_PROJECT = "/update/project";
export const DELETE_PROJECT = "/delete/project";

// Pages > Team
export const GET_TEAMDATA = "/sapModule/getAllMaterial";
export const DELETE_TEAMDATA = "/delete/teamData";
export const ADD_NEW_TEAMDATA = "/add/teamData";
export const UPDATE_TEAMDATA = "/update/teamData";

// File Manager
// Folder
export const GET_FOLDERS = "/folder";
export const DELETE_FOLDER = "/delete/folder";
export const ADD_NEW_FOLDER = "/add/folder";
export const UPDATE_FOLDER = "/update/folder";

// File
export const GET_FILES = "/file";
export const DELETE_FILE = "/delete/file";
export const ADD_NEW_FILE = "/add/file";
export const UPDATE_FILE = "/update/file";

// To do
export const GET_TODOS = "/sapModule/productTag/getAllProductTag";
export const DELETE_TODO = "/sapModule/productTag/deleteProductTagById";
export const ADD_NEW_TODO = "/sapModule/productTag/saveProductTag";
export const UPDATE_TODO = "/sapModule/productTag/updateProductTag";

// To do Project
export const GET_PROJECTS = "/projects";
export const ADD_NEW_TODO_PROJECT = "/add/project";

//JOB APPLICATION
export const GET_APPLICATION_LIST = "/application-list";

//JOB APPLICATION
export const GET_API_KEY = "/api-key";