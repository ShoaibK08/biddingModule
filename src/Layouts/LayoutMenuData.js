// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { setAuthorization } from "../helpers/api_helper";

// const Navdata = () => {
//     const history = useNavigate();
//     //state data
//     const [isDashboard, setIsDashboard] = useState(false);
//     const [isIndentSummary, setIsIndentSummary] = useState(false);
//     const [isIndentDiversion, setIsIndentDiversion] = useState(false);
//     const [isIndentCancellation, setIsIndentCancellation] = useState(false);
//     const [isPassword, setIsPassword] = useState(false);
//     const [isApps, setIsApps] = useState(false);
//     const [isMaster, setIsMaster] = useState(false);
//     const [isReport, setIsReport] = useState(false);
//     const [isSequencing, setIsSequencing] = useState(false);
//     const [isConfiguration, setIsConfiguration] = useState(false);
//     const [isLive, setIsLive] = useState(false);
//     const [isJBPM, setIsJBPM] = useState(false);
//     const [isAuth, setIsAuth] = useState(false);
//     const [isPages, setIsPages] = useState(false);
//     const [isBaseUi, setIsBaseUi] = useState(false);
//     const [isAdvanceUi, setIsAdvanceUi] = useState(false);
//     const [isForms, setIsForms] = useState(false);
//     const [isTables, setIsTables] = useState(false);
//     const [isCharts, setIsCharts] = useState(false);
//     const [isIcons, setIsIcons] = useState(false);
//     const [isMaps, setIsMaps] = useState(false);
//     const [isMultiLevel, setIsMultiLevel] = useState(false);
//     const [Ar, SetAr] = useState([]);

//     const [iscurrentState, setIscurrentState] = useState('Dashboard');
//     // ======================================Start Auto LogOut========================

//     // const [isLoggedIn, setLoggedIn] = useState(true);

//     // useEffect(() => {
//     //     let timeoutId;

//     //     const resetTimeout = () => {
//     //         clearTimeout(timeoutId);
//     //         startTimeout();
//     //     };

//     //     const startTimeout = () => {
//     //         const currentUrl = window.location.href;
//     //         //console.log('Current URL:', currentUrl);
//     //         if(currentUrl.includes("plant360")){
//     //             console.log('Auto Log Off Disabled.!!');
//     //         }
//     //         else{
//     //             timeoutId = setTimeout(() => {
//     //                 // Logout logic here
//     //                 setLoggedIn(false);
//     //                 history('/logout');
//     //                 console.log('User has been inactive for 10 minutes.');
//     //             }, 3600000); // 1 hrs in milliseconds
//     //         }
            
            
//     //     };


//     //     const handleActivity = () => {
//     //         const currentUrl = window.location.href;
//     //         //console.log('Current URL:', currentUrl);
//     //         resetTimeout();
//     //     };

//     //     // Attach event listeners to detect user activity
//     //     document.addEventListener('mousemove', handleActivity);
//     //     document.addEventListener('keydown', handleActivity);

//     //     // Start the initial timeout
//     //     startTimeout();

//     //     // Cleanup event listeners on component unmount
//     //     return () => {
//     //         clearTimeout(timeoutId);
//     //         document.removeEventListener('mousemove', handleActivity);
//     //         document.removeEventListener('keydown', handleActivity);
//     //     };
//     // }, [isLoggedIn]);

//     // ======================================End Auto LogOut========================

//     function updateIconSidebar(e) {
//         if (e && e.target && e.target.getAttribute("subitems")) {
//             const ul = document.getElementById("two-column-menu");
//             const iconItems = ul.querySelectorAll(".nav-icon.active");
//             let activeIconItems = [...iconItems];
//             activeIconItems.forEach((item) => {
//                 item.classList.remove("active");
//                 var id = item.getAttribute("subitems");
//                 if (document.getElementById(id))
//                     document.getElementById(id).classList.remove("show");
//             });
//         }
//     }

//     useEffect(() => {


//         const main_menu = sessionStorage.getItem("main_menu_login");
//         const obj = JSON.parse(main_menu);

//         let result = {};

//         obj.menuItems.forEach(function (item) {
//             if (result[item.mainMenu]) {
//                 result[item.mainMenu].push({
//                     sub_menu: item.subMenuMaster
//                 });
//             } else {
//                 result[item.mainMenu] = [{
//                     sub_menu: item.subMenuMaster
//                 }];
//             }
//         });


//         let finalResult1 = [];


//         console.log(result);

//         for (let key in result) {

//             finalResult1.push({
//                 main_menu: key,
//                 values: result[key]
//             });

//         }

//         console.log("final", finalResult1);
//         const finalResult2 = [];
//         for (let key1 in finalResult1) {

//             console.log(finalResult1[key1]);
//             let finalResult = [];
//             for (let key2 in finalResult1[key1].values) {
//                 console.log(finalResult1[key1].values[key2].sub_menu);
//                 if (finalResult1[key1].values[key2].sub_menu !== null) {
//                     const pl = {};
//                     pl["id"] = finalResult1[key1].values[key2].sub_menu.companyCode;
//                     pl["label"] = finalResult1[key1].values[key2].sub_menu.name;
//                     pl["link"] = finalResult1[key1].values[key2].sub_menu.url;
//                     pl["parentId"] = finalResult1[key1].main_menu;
//                     finalResult.push(pl);
//                 }
//             }

//             const menuIcons = {
//                 Master: "ri-tools-line",
//                 Dashboard: "ri-dashboard-2-line",
//                 Reports: "ri-file-chart-line",
//                 Sequencing: "ri-flow-chart-line",
//                 Configuration: "ri-settings-3-line",
//                 Live: "ri-live-line",
//             };
            
//             finalResult2.push({
//                 id: finalResult1[key1].main_menu,
//                 label: finalResult1[key1].main_menu,
//                 icon: menuIcons[finalResult1[key1].main_menu] || "ri-dashboard-2-line", // Fallback icon
//                 link: "/",
//                 stateVariables: 
//                     finalResult1[key1].main_menu === "Master" ? isMaster : 
//                     finalResult1[key1].main_menu === "Dashboard" ? isDashboard : 
//                     finalResult1[key1].main_menu === "Sequencing" ? isSequencing : 
//                     finalResult1[key1].main_menu === "Configuration" ? isConfiguration : 
//                     finalResult1[key1].main_menu === "Live" ? isLive : 
//                     isReport,
//                 click: function (e) {
//                     e.preventDefault();
//                     switch (finalResult1[key1].main_menu) {
//                         case "Master":
//                             setIsMaster(!isMaster);
//                             break;
//                         case "Dashboard":
//                             setIsDashboard(!isDashboard);
//                             break;
//                         case "Reports":
//                             setIsReport(!isReport);
//                             break;
//                         case "Sequencing":
//                             setIsSequencing(!isSequencing);
//                             break;
//                         case "Configuration":
//                             setIsConfiguration(!isConfiguration);
//                             break;
//                         case "Live":
//                             setIsLive(!isLive);
//                             break;
//                         default:
//                             break;
//                     }
//                     setIscurrentState(finalResult1[key1].main_menu);
//                     updateIconSidebar(e);
//                 },
//                 subItems: finalResult,
//             });
            
//             // alert(isMaster)
//             SetAr(finalResult2);
//         }




//         // sessionStorage.getItem("authUser");


//         document.body.classList.remove('twocolumn-panel');
//         if (iscurrentState !== 'Dashboard') {
//             setIsDashboard(false);
//         }
//         if (iscurrentState !== 'Apps') {
//             setIsApps(false);
//         }
//         if (iscurrentState !== 'Master') {
//             setIsMaster(false);
//         }
//         if (iscurrentState !== 'Reports') {
//             setIsReport(false);
//         }
//         if (iscurrentState !== 'Sequencing') {
//             setIsSequencing(false);
//         }
//         if (iscurrentState !== 'Configuration') {
//             setIsConfiguration(false);
//         }
//         if (iscurrentState !== 'Live') {
//             setIsLive(false);
//         }
//         if (iscurrentState !== 'Auth') {
//             setIsAuth(false);
//         }
//         if (iscurrentState !== 'Pages') {
//             setIsPages(false);
//         }
//         if (iscurrentState !== 'BaseUi') {
//             setIsBaseUi(false);
//         }
//         if (iscurrentState !== 'AdvanceUi') {
//             setIsAdvanceUi(false);
//         }
//         if (iscurrentState !== 'Forms') {
//             setIsForms(false);
//         }
//         if (iscurrentState !== 'Tables') {
//             setIsTables(false);
//         }
//         if (iscurrentState !== 'Charts') {
//             setIsCharts(false);
//         }
//         if (iscurrentState !== 'Icons') {
//             setIsIcons(false);
//         }
//         if (iscurrentState !== 'Maps') {
//             setIsMaps(false);
//         }
//         if (iscurrentState !== 'MuliLevel') {
//             setIsMultiLevel(false);
//         }
//         if (iscurrentState === 'Widgets') {
//             history("/widgets");
//             document.body.classList.add('twocolumn-panel');
//         }
//     }, [
//         history,
//         iscurrentState,
//         isDashboard,
//         isApps,
//         isMaster,
//         isReport,
//         isSequencing,
//         isConfiguration,
//         isLive,
//         isAuth,
//         isPages,
//         isBaseUi,
//         isAdvanceUi,
//         isForms,
//         isTables,
//         isCharts,
//         isIcons,
//         isMaps,
//         isMultiLevel
//     ]);

//     // const menuItems = Ar;
//      const menuItems = [
//          {
//              label: "Menu",
//              isHeader: true,
//          },
//          {
//              id: "dashboard",
//              label: "Demo",
//              icon: "ri-dashboard-2-line",
//              link: "/",
//              stateVariables: isDashboard,
//              click: function (e) {
//                  e.preventDefault();
//                  setIsDashboard(!isDashboard);
//                  setIscurrentState('Dashboard');
//                  updateIconSidebar(e);
//              },
//              subItems: [
//                  {
//                      id: "dashboard-seq",
//                      label: " Create Bid",
//                      link: "/bid-order-confirmation",
//                      parentId: "dashboard",
//                  },
//                  {
//                     id: "transporter",
//                     label: "Transporter Master",
//                     link: "/transporter",
//                     parentId: "dashboard",
//                 },
//                 {
//                     id: "route",
//                     label: "Route Master",
//                     link: "/route",
//                     parentId: "dashboard",
//                 },
//                 {
//                     id: "transporter plant mapping",
//                     label: "Transporter Plant Mapping",
//                     link: "/plant-mapping",
//                     parentId: "dashboard",
//                 },
//                 {
//                     id: "transporter route mapping",
//                     label: "Transporter Route Mapping",
//                     link: "/route-mapping",
//                     parentId: "dashboard",
//                 },
//                 {
//                     id: "slot master",
//                     label: "Slot Master",
//                     link: "/slot",
//                     parentId: "dashboard",
//                 },
//                 {
//                     id: "transporter route details",
//                     label: "Transporter Route Details",
//                     link: "/transporter-route-details",
//                     parentId: "dashboard",
//                 },
//                 {
//                     id: "Logistics Dashboard",
//                     label: "Logistics Dashboard",
//                     link: "/auction-dashboard",
//                     parentId: "dashboard",
//                 },
//                 {
//                     id: "Transporter Dashboard",
//                     label: "Transporter Dashboard",
//                     link: "/transporter-dashboard",
//                     parentId: "dashboard",
//                 },
//                   {
//                     id: "Logistics Order Management",
//                     label: "Logistics Order Management",    
//                     link: "/quota-management",
//                     parentId: "dashboard",
//                 },
//                 {
//                     id: " Transporter Order Management",
//                     label: " Transporter Order Management",
//                     link: "/order-management",
//                     parentId: "dashboard",
//                 },
//                 {
//                     id: "  Transporter Slot Master",
//                     label: "Transporter Slot Master",
//                     link: "/sloc-master",
//                     parentId: "dashboard",
//                 },
             
//              ],
//          }
//         //  {
//         //      id: "apps",
//         //      label: "Master",
//         //      icon: "ri-apps-2-line",
//         //      link: "/#",
//         //      click: function (e) {
//         //          e.preventDefault();
//         //          setIsApps(!isApps);
//         //          setIscurrentState('Apps');
//         //          updateIconSidebar(e);
//         //      },
//         //      stateVariables: isApps,
//         //      subItems: [
           
//         //          {
//         //             id: "transporter",
//         //             label: "Transporter Master",
//         //             link: "/transporter",
//         //             parentId: "apps",
//         //         },
//         //         {
//         //             id: "route",
//         //             label: "Route Master",
//         //             link: "/route",
//         //             parentId: "apps",
//         //         },

//         //      ],
//         //  },{
//         //      id: "reports",
//         //      label: "Mapping",
//         //      icon: "ri-apps-2-line",
//         //      link: "/#",
//         //      click: function (e) {
//         //          e.preventDefault();
//         //          setIsReport(!isReport);
//         //          setIscurrentState('Report');
//         //          updateIconSidebar(e);
//         //      },
//         //      stateVariables: isReport,
//         //      subItems: [
//         //          {
//         //              id: "csr",
//         //              label: "Transporter Plant Mapping",
//         //              link: "/plant-mapping",
//         //              parentId: "reports",
//         //          },
//         //          {
//         //              id: "pmr",
//         //              label: " Transporter Route Mapping",
//         //              link: "/route-mapping",
//         //              parentId: "reports",
//         //          },
//         //         //  {
//         //         //      id: "tag-mapping",
//         //         //      label: "TAG Mapping",
//         //         //      link: "/tagMapping",
//         //         //      parentId: "reports",
//         //         //  },
//         //         //  {
//         //         //      id: "tolerance",
//         //         //      label: "Tolerance Report",
//         //         //      link: "/tolerance",
//         //         //      parentId: "reports",
//         //         //  },
//         //         //  {
//         //         //      id: "weight-approve",
//         //         //      label: "Weight Approve",
//         //         //      link: "/weight-approve",
//         //         //      parentId: "reports",
//         //         //  },
//         //      ],
//         //  },
       
        
//     ];
//     return <React.Fragment>{menuItems}</React.Fragment>;
// };
// export default Navdata;



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { setAuthorization } from "../helpers/api_helper";

// const Navdata = () => {
//     const history = useNavigate();
//     //state data
//     const [isAuction, setIsAuction] = useState(false);
//     const [isMapping, setIsMapping] = useState(false);
//     const [isMaster, setIsMaster] = useState(false);
//     const [isOrderSummery, setIsOrderSummery] = useState(false);
//     const [isReport, setIsReport] = useState(false);
    
//     const [iscurrentState, setIscurrentState] = useState('Dashboard');

//     function updateIconSidebar(e) {
//         if (e && e.target && e.target.getAttribute("subitems")) {
//             const ul = document.getElementById("two-column-menu");
//             const iconItems = ul.querySelectorAll(".nav-icon.active");
//             let activeIconItems = [...iconItems];
//             activeIconItems.forEach((item) => {
//                 item.classList.remove("active");
//                 var id = item.getAttribute("subitems");
//                 if (document.getElementById(id))
//                     document.getElementById(id).classList.remove("show");
//             });
//         }
//     }

//     useEffect(() => {
//         document.body.classList.remove('twocolumn-panel');
//         if (iscurrentState !== 'Auction') {
//             setIsAuction(false);
//         }
//         if (iscurrentState !== 'Mapping') {
//             setIsMapping(false);
//         }
//         if (iscurrentState !== 'Master') {
//             setIsMaster(false);
//         }
//         if (iscurrentState !== 'OrderSummery') {
//             setIsOrderSummery(false);
//         }
//         if (iscurrentState !== 'Report') {
//             setIsReport(false);
//         }
//         if (iscurrentState === 'Widgets') {
//             history("/widgets");
//             document.body.classList.add('twocolumn-panel');
//         }
//     }, [
//         history,
//         iscurrentState,
//         isAuction,
//         isMapping,
//         isMaster,
//         isOrderSummery,
//         isReport
//     ]);

//     const menuItems = [
//         {
//             label: "Menu",
//             isHeader: true,
//         },
//         {
//             id: "auction",
//             label: "Auction",
//             icon: "ri-auction-line",
//             link: "/#",
//             stateVariables: isAuction,
//             click: function (e) {
//                 e.preventDefault();
//                 setIsAuction(!isAuction);
//                 setIscurrentState('Auction');
//                 updateIconSidebar(e);
//             },
//             subItems: [
//                 {
//                     id: "dashboard",
//                     label: "Dashboard",
//                     link: "/auction-dashboard",
//                     parentId: "auction",
//                 },
//                 {
//                     id: "create-bid",
//                     label: "Create Bid",
//                     link: "/bid-order-confirmation",
//                     parentId: "auction",
//                 },
//             ],
//         },
//         {
//             id: "mapping",
//             label: "Mapping",
//             icon: "ri-map-pin-line",
//             link: "/#",
//             stateVariables: isMapping,
//             click: function (e) {
//                 e.preventDefault();
//                 setIsMapping(!isMapping);
//                 setIscurrentState('Mapping');
//                 updateIconSidebar(e);
//             },
//             subItems: [
//                 {
//                     id: "route-mapping",
//                     label: "Route Mapping",
//                     link: "/route-mapping",
//                     parentId: "mapping",
//                 },
//                 {
//                     id: "plant-mapping",
//                     label: "Plant Mapping",
//                     link: "/plant-mapping",
//                     parentId: "mapping",
//                 },
//             ],
//         },
//         {
//             id: "master",
//             label: "Master",
//             icon: "ri-settings-line",
//             link: "/#",
//             stateVariables: isMaster,
//             click: function (e) {
//                 e.preventDefault();
//                 setIsMaster(!isMaster);
//                 setIscurrentState('Master');
//                 updateIconSidebar(e);
//             },
//             subItems: [
//                 {
//                     id: "route-master",
//                     label: "Route Master",
//                     link: "/route",
//                     parentId: "master",
//                 },
//                 {
//                     id: "transporter-master",
//                     label: "Transporter Master",
//                     link: "/transporter",
//                     parentId: "master",
//                 },
//             ],
//         },
//         {
//             id: "order-summery",
//             label: "Order Summery",
//             icon: "ri-file-list-line",
//             link: "/#",
//             stateVariables: isOrderSummery,
//             click: function (e) {
//                 e.preventDefault();
//                 setIsOrderSummery(!isOrderSummery);
//                 setIscurrentState('OrderSummery');
//                 updateIconSidebar(e);
//             },
//             subItems: [
//                 {
//                     id: "order-management",
//                     label: "Order Management",
//                     link: "/quota-management",
//                     parentId: "order-summery",
//                 },
//                 {
//                     id: "slot-master",
//                     label: "SLOT Master",
//                     link: "/slot",
//                     parentId: "order-summery",
//                 },
//             ],
//         }
//         // {
//         //     id: "report",
//         //     label: "Report",
//         //     icon: "ri-file-chart-line",
//         //     link: "/#",
//         //     stateVariables: isReport,
//         //     click: function (e) {
//         //         e.preventDefault();
//         //         setIsReport(!isReport);
//         //         setIscurrentState('Report');
//         //         updateIconSidebar(e);
//         //     },
//         //     subItems: [
//         //         {
//         //             id: "performance-report",
//         //             label: "Performance Report",
//         //             link: "/performance-report",
//         //             parentId: "report",
//         //         },
//         //         {
//         //             id: "outbound-tat-report",
//         //             label: "Outbound TAT Report",
//         //             link: "/outbound-tat-report",
//         //             parentId: "report",
//         //         },
//         //     ],
//         // },
//     ];
//     return <React.Fragment>{menuItems}</React.Fragment>;
// };
// export default Navdata;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";

const Navdata = () => {
    const history = useNavigate();
    //state data
    const [isAuction, setIsAuction] = useState(false);
    const [isMapping, setIsMapping] = useState(false);
    const [isMaster, setIsMaster] = useState(false);
    const [isOrderSummery, setIsOrderSummery] = useState(false);
    const [isTransporterPages, setIsTransporterPages] = useState(false);
    const [isReport, setIsReport] = useState(false);
    
    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    function updateIconSidebar(e) {
        if (e && e.target && e.target.getAttribute("subitems")) {
            const ul = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("subitems");
                if (document.getElementById(id))
                    document.getElementById(id).classList.remove("show");
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Auction') {
            setIsAuction(false);
        }
        if (iscurrentState !== 'Mapping') {
            setIsMapping(false);
        }
        if (iscurrentState !== 'Master') {
            setIsMaster(false);
        }
        if (iscurrentState !== 'OrderSummery') {
            setIsOrderSummery(false);
        }
        if (iscurrentState !== 'TransporterPages') {
            setIsTransporterPages(false);
        }
        if (iscurrentState !== 'Report') {
            setIsReport(false);
        }
        if (iscurrentState === 'Widgets') {
            history("/widgets");
            document.body.classList.add('twocolumn-panel');
        }
    }, [
        history,
        iscurrentState,
        isAuction,
        isMapping,
        isMaster,
        isOrderSummery,
        isTransporterPages,
        isReport
    ]);

    const menuItems = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "auction",
            label: "Auction",
            icon: "ri-auction-line",
            link: "/#",
            stateVariables: isAuction,
            click: function (e) {
                e.preventDefault();
                setIsAuction(!isAuction);
                setIscurrentState('Auction');
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "dashboard",
                    label: "Dashboard",
                    link: "/auction-dashboard",
                    parentId: "auction",
                },
                {
                    id: "create-bid",
                    label: "Create Bid",
                    link: "/bid-order-confirmation",
                    parentId: "auction",
                },
            ],
        },
        {
            id: "mapping",
            label: "Mapping",
            icon: "ri-map-pin-line",
            link: "/#",
            stateVariables: isMapping,
            click: function (e) {
                e.preventDefault();
                setIsMapping(!isMapping);
                setIscurrentState('Mapping');
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "route-mapping",
                    label: "Route Mapping",
                    link: "/route-mapping",
                    parentId: "mapping",
                },
                {
                    id: "plant-mapping",
                    label: "Plant Mapping",
                    link: "/plant-mapping",
                    parentId: "mapping",
                },
            ],
        },
        {
            id: "master",
            label: "Master",
            icon: "ri-settings-line",
            link: "/#",
            stateVariables: isMaster,
            click: function (e) {
                e.preventDefault();
                setIsMaster(!isMaster);
                setIscurrentState('Master');
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "route-master",
                    label: "Route Master",
                    link: "/route",
                    parentId: "master",
                },
                {
                    id: "transporter-master",
                    label: "Transporter Master",
                    link: "/transporter",
                    parentId: "master",
                },
            ],
        },
        {
            id: "order-summery",
            label: "Order Summery",
            icon: "ri-file-list-line",
            link: "/#",
            stateVariables: isOrderSummery,
            click: function (e) {
                e.preventDefault();
                setIsOrderSummery(!isOrderSummery);
                setIscurrentState('OrderSummery');
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "order-management",
                    label: "Order Management",
                    link: "/quota-management",
                    parentId: "order-summery",
                },
                {
                    id: "slot-master",
                    label: "SLOT Master",
                    link: "/slot",
                    parentId: "order-summery",
                },
            ],
        },
        {
            id: "transporter-pages",
            label: "Transporter Pages",
            icon: "ri-truck-line",
            link: "/#",
            stateVariables: isTransporterPages,
            click: function (e) {
                e.preventDefault();
                setIsTransporterPages(!isTransporterPages);
                setIscurrentState('TransporterPages');
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "transporter-dashboard",
                    label: "Transporter Dashboard",
                    link: "/transporter-dashboard",
                    parentId: "transporter-pages",
                },
                {
                    id: "transporter-route-details",
                    label: "Transporter Route Details",
                    link: "/transporter-route-details",
                    parentId: "transporter-pages",
                },
                {
                    id: "transporter-slot-master",
                    label: "Transporter Slot Master",
                    link: "/sloc-master",
                    parentId: "transporter-pages",
                },
                {
                    id: "transporter-order-management",
                    label: "Transporter Order Management",
                    link: "/order-management",
                    parentId: "transporter-pages",
                },
            ],
        }
        // {
        //     id: "report",
        //     label: "Report",
        //     icon: "ri-file-chart-line",
        //     link: "/#",
        //     stateVariables: isReport,
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsReport(!isReport);
        //         setIscurrentState('Report');
        //         updateIconSidebar(e);
        //     },
        //     subItems: [
        //         {
        //             id: "performance-report",
        //             label: "Performance Report",
        //             link: "/performance-report",
        //             parentId: "report",
        //         },
        //         {
        //             id: "outbound-tat-report",
        //             label: "Outbound TAT Report",
        //             link: "/outbound-tat-report",
        //             parentId: "report",
        //         },
        //     ],
        // },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;