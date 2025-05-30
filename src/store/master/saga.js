import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ecoomerce Redux States
import {
 // GET_PRODUCTS,
  //DELETE_PRODUCT,
  //GET_ORDERS,
  //GET_SELLERS,
  GET_CUSTOMERS,
  GET_CLUSTER,
  GET_TRANSPORTERS,
  GET_PROCESS,
  //DELETE_ORDER,
 // UPDATE_ORDER,
 // ADD_NEW_ORDER,

  ADD_NEW_CUSTOMER,
  ADD_NEW_CLEANER,
  ADD_NEW_CLUSTER,
  ADD_NEW_PLANT,
  ADD_NEW_VEHICLE,
  ADD_NEW_RAISE_INDENT,
  DELETE_CUSTOMER,
  UPDATE_CUSTOMER,
  UPDATE_PLANT,
  UPDATE_CLUSTER,
  DELETE_VEHICLE,
  UPDATE_VEHICLE,
  ADD_NEW_TRANSPORTER,
  ADD_NEW_QUOTA,
  ADD_NEW_DRIVER,
  GET_VEHICLE,
  GET_MATERIAL,
  GET_CLEANER,
  GET_USERS,
  GET_DRIVER,
  GET_ROLES,
  GET_QUOTA,
  GET_PLANT,

 // ADD_NEW_PRODUCT,
 // UPDATE_PRODUCT
} from "./actionType";

import {
  ecommerceApiResponseSuccess1,
  ecommerceApiResponseError1,
 // deleteOrderSuccess,
 // deleteOrderFail,
 // updateOrderSuccess,
 // updateOrderFail,
 // addOrderSuccess,
 // addOrderFail,
  addCustomerFail1,
  addCustomerSuccess1,  
  addCleanerFail1,
  addCleanerSuccess1,
  addVehicleFail1,
  addVehicleSuccess1,
  addRaiseIndentFail1,
  addRaiseIndentSuccess1,
  addTransporterFail1,
  addTransporterSuccess1,
  addQuotaFail1,
  addQuotaSuccess1,
  addDriverFail1,
  addDriverSuccess1,
  addClusterFail1,
  addClusterSuccess1,
  addPlantFail1,
  addPlantSuccess1,
  updateCustomerSuccess1,
  updateCustomerFail1,  
  updatePlantSuccess1,
  updatePlantFail1,  
  updateClusterSuccess1,
  updateClusterFail1,
  deleteCustomerSuccess1,
  deleteCustomerFail1,
  updateVehicleSuccess1,
  updateVehicleFail1,
  deleteVehicleSuccess1,
  deleteVehicleFail1,
  getCluster,
 // deleteProductSuccess,
 // deleteProductFail,
 // addProductSuccess,
 // addProductFail,
 // updateProductSuccess,
 // updateProductFail
} from "./action";

//Include Both Helper File with needed methods
import {
  //getProducts as getProductsApi,
  //deleteProducts as deleteProductsApi,
 // getOrders as getOrdersApi,
  //getSellers as getSellersApi,
  getCustomers as getCustomersApi,
  getClusters as getClustersApi,
  getPlants as getPlantsApi,
  getProcessingList as getProcessingListApi,
  getQuotas as getQuotasApi,
  getTransporters as getTransportersApi,
  getRoles as getRolesApi,
  getDriver as getDriverApi,
  getMaterial as getMaterialApi,
  getVehicle as getVehicleApi,
  getCleaner as getCleanerApi,
  getUsers as getUsersApi,
 // updateOrder,
 // deleteOrder,
 // addNewOrder,
  addNewCustomer,
  addNewCluster,
  addNewPlant,
  addNewCleaner,
  updateCustomer,
  updateCluster,
  updatePlant,
  deleteCustomer,
  addNewTransporter,
  addNewRaiseIndentData,
  addNewQuota,
  addNewDriver,
  addNewVehicle,
//addNewVehicle,
  //addNewProduct,
 // updateProduct
} from "../../helpers/fakebackend_helper";
/*
function* getProducts() {
  try {
    const response = yield call(getProductsApi);
    yield put(ecommerceApiResponseSuccess(GET_PRODUCTS, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_PRODUCTS, error));
  }
}

function* getOrders() {
  try {
    const response = yield call(getOrdersApi);
    yield put(ecommerceApiResponseSuccess(GET_ORDERS, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_ORDERS, error));
  }
}

function* getSellers() {
  try {
    const response = yield call(getSellersApi);
    yield put(ecommerceApiResponseSuccess(GET_SELLERS, response));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_SELLERS, error));
  }
}
*/
function* getTransporters() {
  try {
    const response = yield call(getTransportersApi);
    yield put(ecommerceApiResponseSuccess1(GET_TRANSPORTERS, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError1(GET_TRANSPORTERS, error));
  }
}

function* getProcessingList() {
  try {
    const response = yield call(getProcessingListApi);
    yield put(ecommerceApiResponseSuccess1(GET_PROCESS, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError1(GET_PROCESS, error));
  }
}

function* getQuotas() {
  try {
    const response = yield call(getQuotasApi);
    yield put(ecommerceApiResponseSuccess1(GET_QUOTA, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError1(GET_QUOTA, error));
  }
}

function* getDriver() {
  try {
    const response = yield call(getDriverApi);
    console.log("driver data : "+response);
    yield put(ecommerceApiResponseSuccess1(GET_DRIVER, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError1(GET_DRIVER, error));
  }
}

function* getUsers() {
  try {
    const response = yield call(getUsersApi);
    console.log("user data : "+JSON.stringify(response));
    yield put(ecommerceApiResponseSuccess1(GET_USERS, response));
  } catch (error) {
    yield put(ecommerceApiResponseError1(GET_USERS, error));
  }
}

function* getMaterial() {
  try {
    const response = yield call(getMaterialApi);
    yield put(ecommerceApiResponseSuccess1(GET_MATERIAL, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError1(GET_MATERIAL, error));
  }
}

function* getCleaner() {
  try {
    const response = yield call(getCleanerApi);
    console.log(response);
    yield put(ecommerceApiResponseSuccess1(GET_CLEANER, response.data.data));
  } catch (error) {
    yield put(ecommerceApiResponseError1(GET_CLEANER, error));
  }
} 

function* getVehicle() {
  try {
    const response = yield call(getVehicleApi);
    yield put(ecommerceApiResponseSuccess1(GET_VEHICLE, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError1(GET_VEHICLE, error));
  }
}

function* getRoles() {
  try {
    const response = yield call(getRolesApi);
    yield put(ecommerceApiResponseSuccess1(GET_ROLES, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError1(GET_ROLES, error));
  }
}

function* getCustomers() {
  try {
    const response = yield call(getCustomersApi);
    yield put(ecommerceApiResponseSuccess1(GET_CUSTOMERS, response.data.data));
  } catch (error) {
    yield put(ecommerceApiResponseError1(GET_CUSTOMERS, error));
  }
}

function* getClusters() {
  try {
    const response = yield call(getClustersApi);
    console.log(response)
    yield put(ecommerceApiResponseSuccess1(GET_CLUSTER, response));
  } catch (error) {
    yield put(ecommerceApiResponseError1(GET_CLUSTER, error));
  }
}

function* getPlants() {
  try {
    const response = yield call(getPlantsApi);
    console.log(response)
    yield put(ecommerceApiResponseSuccess1(GET_PLANT, response));
  } catch (error) {
    yield put(ecommerceApiResponseError1(GET_PLANT, error));
  }
}
/*
function* deleteProducts({ payload: product }) {
  try {
    const response = yield call(deleteProductsApi, product);
    yield put(deleteProductSuccess({ product, ...response }));
    toast.success("Product Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteProductFail(error));
    toast.error("Product Delete Failed", { autoClose: 3000 });
  }
}

function* onAddNewProduct({ payload: product }) {
  try {
    const response = yield call(addNewProduct, product);
    yield put(addProductSuccess(response));
    toast.success("Product Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addProductFail(error));
    toast.error("Product Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateProduct({ payload: product }) {
  try {
    const response = yield call(updateProduct, product);
    yield put(updateProductSuccess(response));
    toast.success("Product Updateded Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateProductFail(error));
    toast.error("Product Updateded Failed", { autoClose: 3000 });
  }
}

function* onUpdateOrder({ payload: order }) {
  try {
    const response = yield call(updateOrder, order);
    yield put(updateOrderSuccess(response));
    toast.success("Order Updateded Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateOrderFail(error));
    toast.error("Order Updateded Failed", { autoClose: 3000 });
  }
}

function* onDeleteOrder({ payload: order }) {
  try {
    const response = yield call(deleteOrder, order);
    yield put(deleteOrderSuccess({ order, ...response }));
    toast.success("Order Deleted Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteOrderFail(error));
    toast.error("Order Deleted Failed", { autoClose: 3000 });
  }
}

function* onAddNewOrder({ payload: order }) {
  try {
    const response = yield call(addNewOrder, order);
    yield put(addOrderSuccess(response));
    toast.success("Order Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addOrderFail(error));
    toast.error("Order Added Failed", { autoClose: 3000 });
  }
}*/

function* onUpdateCustomer({ payload: customer }) {
  try {
    const response = yield call(updateCustomer, customer);
    yield put(updateCustomerSuccess1(response));
    toast.success("User Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateCustomerFail1(error));
    toast.error("User Updated Failed", { autoClose: 3000 });
  }
}


function* onUpdatePlant({ payload: plant }) {
  try {
    const response = yield call(updatePlant, plant);
    yield put(updatePlantSuccess1(response));
    if(response.msg === "Duplicate entry"){
      toast.error("Already Exist", { autoClose: 3000 });
    }else{
      toast.success("Plant Updated Successfully", { autoClose: 3000 });
    }
  } catch (error) {
    yield put(updatePlantFail1(error));
    toast.error("Plant Updated Failed", { autoClose: 3000 });
  }
}


function* onUpdateCluster({ payload: cluster }) {
  try {
    const response = yield call(updateCluster, cluster);
    console.log(response);
    yield put(updateClusterSuccess1(response));
    if(response.msg === "Duplicate entry"){
      toast.error("Already Exist", { autoClose: 3000 });
    }else{
      toast.success("Cluster Updated Successfully", { autoClose: 3000 });
    }
  } catch (error) {
    yield put(updateClusterFail1(error));
    toast.error("Cluster Updated Failed", { autoClose: 3000 });
  }
}

function* onDeleteCustomer({ payload: customer }) {
  try {
    const response = yield call(deleteCustomer, customer);
    yield put(deleteCustomerSuccess1({ customer, ...response }));
    toast.success("User Deleted Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteCustomerFail1(error));
    toast.error("User Deleted Failed", { autoClose: 3000 });
  }
}

function* onAddNewCustomer({ payload: customer }) {
  try {
    const response = yield call(addNewCustomer, customer);
    
    if(response.data.errorMsg === "Mobile number or email already exist!"){
    toast.error("Mobile number or email already exist!", { autoClose: 3000 });
    }
    else{
      yield put(addCustomerSuccess1(response));
      toast.success("User Added Successfully", { autoClose: 3000 });
    }
  } catch (error) {
    yield put(addCustomerFail1(error));
    toast.error("User Added Failed", { autoClose: 3000 });
  }
}

function* onAddNewCleaner({ payload: cleaner }) {
  try {
    const response = yield call(addNewCleaner, cleaner);
    yield put(addCleanerSuccess1(response));
    console.log(response);
    if(response.data.msg ==="updated successfully"){
      toast.success("Cleaner Updated Successfully", { autoClose: 3000 });
    }else{
      toast.success("Cleaner Added Successfully", { autoClose: 3000 });
    }
   // toast.success("Cleaner Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addCleanerFail1(error));
    toast.error("Something went wrong", { autoClose: 3000 });
  }
}
function* onAddNewVehicle({ payload: vehicle }) {
  try {
    const response = yield call(addNewVehicle, vehicle);
    yield put(addVehicleSuccess1(response));
    toast.success("Vehicle Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addVehicleFail1(error));
    toast.error("Vehicle Added Failed", { autoClose: 3000 });
  }
}

function* addNewRaiseIndentApi({ payload: raiseIndent }) {
  try {
    const response = yield call(addNewRaiseIndentData, raiseIndent);
   // alert("fgfgf")
    toast.success("Indent Raised Added Successfully", { autoClose: 3000 });
    yield put(addRaiseIndentSuccess1(response));
  } catch (error) {
    yield put(addRaiseIndentFail1(error));
    toast.error("Indent Raised Added Failed", { autoClose: 3000 });
  }
}

function* onAddNewDriver({ payload: driver }) {
  try {
    const response = yield call(addNewDriver, driver);
    yield put(addDriverSuccess1(response));
    if(response.data.status ==="driver updated successfully"){
      toast.success("Driver Updated Successfully", { autoClose: 3000 });
    }else{
      toast.success("Driver Added Successfully", { autoClose: 3000 });
    }
  } catch (error) {
    yield put(addDriverFail1(error));
    toast.error("Something went wrong", { autoClose: 3000 });
  }
}

function* onAddNewCluster({ payload: cluster }) {
  try {
    const response = yield call(addNewCluster, cluster);
    yield put(addClusterSuccess1(response));
    if(response.msg === "Duplicate entry"){
      toast.error("Already Exist", { autoClose: 3000 });
    }else{
      toast.success("Cluster Added Successfully", { autoClose: 3000 });
    }
  } catch (error) {
    yield put(addClusterFail1(error));
    toast.error("Something went wrong", { autoClose: 3000 });
  }
}


function* onAddNewPlant({ payload: plant }) {
  try {
    const response = yield call(addNewPlant, plant);
    yield put(addPlantSuccess1(response));
      if(response.msg === "Duplicate entry"){
        toast.error("Already Exist", { autoClose: 3000 });
      }else{
        toast.success("Plant Added Successfully", { autoClose: 3000 });
      }
  } catch (error) {
    yield put(addPlantFail1(error));
    toast.error("Something went wrong", { autoClose: 3000 });
  }
}

function* onAddNewQuota({ payload: quota }) {
  try {
    const response = yield call(addNewQuota, quota);
    yield put(addQuotaSuccess1(response));
    toast.success("Quota Added Successfully", { autoClose: 3000 });
    //window.location.reload();
  } catch (error) {
    yield put(addQuotaFail1(error));
    toast.error("Quota Added Failed", { autoClose: 3000 });
  }
}

function* onAddNewTransporter({ payload: transporter }) {
  try {
    const response = yield call(addNewTransporter, transporter);
    yield put(addTransporterSuccess1(response));
    toast.success("Transporter Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addTransporterFail1(error));
    toast.error("Transporter Added Failed", { autoClose: 3000 });
  }
}
/*
export function* watchGetProducts() {
  yield takeEvery(GET_PRODUCTS, getProducts);
}

export function* watchDeleteProducts() {
  yield takeEvery(DELETE_PRODUCT, deleteProducts);
}

export function* watchGetOrders() {
  yield takeEvery(GET_ORDERS, getOrders);
}

export function* watchGetSellers() {
  yield takeEvery(GET_SELLERS, getSellers);
}
*/
export function* watchGetCustomers() {
  yield takeEvery(GET_CUSTOMERS, getCustomers);
}

export function* watchGetProcess() {
  yield takeEvery(GET_PROCESS, getProcessingList);
}

export function* watchGetQuotas() {
  yield takeEvery(GET_QUOTA, getQuotas);
}

export function* watchGetClusters() {
  yield takeEvery(GET_CLUSTER, getClusters);
}

export function* watchGetPlants() {
  yield takeEvery(GET_PLANT, getPlants);
}

export function* watchGetTransporters() {
  yield takeEvery(GET_TRANSPORTERS, getTransporters);
}

export function* watchGetUsers() {
  yield takeEvery(GET_USERS, getUsers);
}

export function* watchGetMaterial() {
  yield takeEvery(GET_MATERIAL, getMaterial);
}

export function* watchGetCleaner() {
  yield takeEvery(GET_CLEANER, getCleaner);
}

export function* watchGetVehicle() {
  yield takeEvery(GET_VEHICLE, getVehicle);
}

export function* watchGetDriver() {
  yield takeEvery(GET_DRIVER, getDriver);
}

export function* watchGetRoles() {
  yield takeEvery(GET_ROLES, getRoles);
}
/*
export function* watchUpdateOrder() {
  yield takeEvery(UPDATE_ORDER, onUpdateOrder);
}

export function* watchDeleteOrder() {
  yield takeEvery(DELETE_ORDER, onDeleteOrder);
}

export function* watchAddNewOrder() {
  yield takeEvery(ADD_NEW_ORDER, onAddNewOrder);
}
*/
export function* watchUpdateCustomer() {
  yield takeEvery(UPDATE_CUSTOMER, onUpdateCustomer);
}

export function* watchUpdateCluster() {
  yield takeEvery(UPDATE_CLUSTER, onUpdateCluster);
}

export function* watchUpdatePlant() {
  yield takeEvery(UPDATE_PLANT, onUpdatePlant);
}

export function* watchDeleteCustomer() {
  yield takeEvery(DELETE_CUSTOMER, onDeleteCustomer);
}

export function* watchAddNewCustomer() {
  yield takeEvery(ADD_NEW_CUSTOMER, onAddNewCustomer);
}

export function* watchAddNewCluster() {
  yield takeEvery(ADD_NEW_CLUSTER,onAddNewCluster);
}

export function* watchAddNewPlant() {
  yield takeEvery(ADD_NEW_PLANT,onAddNewPlant);
}

export function* watchAddNewCleaner() {
  yield takeEvery(ADD_NEW_CLEANER, onAddNewCleaner);
}
export function* watchAddNewVehicle() {
  yield takeEvery(ADD_NEW_VEHICLE, onAddNewVehicle);
}

export function* watchAddNewRaiseIndentApi() {
  yield takeEvery(ADD_NEW_RAISE_INDENT, addNewRaiseIndentApi);
}

export function* watchAddNewTransporter() {
  yield takeEvery(ADD_NEW_TRANSPORTER, onAddNewTransporter);
}

export function* watchAddNewQuota() {
  yield takeEvery(ADD_NEW_QUOTA, onAddNewQuota);
}

export function* watchAddNewDriver() {
  yield takeEvery(ADD_NEW_DRIVER, onAddNewDriver);
}
/*
export function* watchUpdateProduct() {
  yield takeEvery(UPDATE_PRODUCT, onUpdateProduct);
}

export function* watchAddNewProduct() {
  yield takeEvery(ADD_NEW_PRODUCT, onAddNewProduct);
}
*/
function* masterSaga() {
  yield all([
  //  fork(watchGetProducts),
  //  fork(watchDeleteProducts),
  //  fork(watchGetOrders),
 //   fork(watchGetSellers),
    fork(watchGetCustomers),    
    fork(watchGetTransporters),
    fork(watchGetRoles),
    fork(watchGetDriver),
    fork(watchGetMaterial),
    fork(watchGetCleaner),
    fork(watchGetVehicle),
    fork(watchGetClusters),
    fork(watchGetPlants),
    fork(watchGetUsers),
    fork(watchGetQuotas),
    fork(watchGetProcess),
  //  fork(watchDeleteOrder),
  //  fork(watchUpdateOrder),
  //  fork(watchAddNewOrder),
    fork(watchDeleteCustomer),
    fork(watchUpdateCustomer),
    fork(watchUpdateCluster),
    fork(watchUpdatePlant),
    fork(watchAddNewCustomer),
    fork(watchAddNewPlant),
    fork(watchAddNewCluster),
    fork(watchAddNewCleaner),
    fork(watchAddNewVehicle),
    fork(watchAddNewRaiseIndentApi),    
    fork(watchAddNewTransporter),
    fork(watchAddNewDriver),
    fork(watchAddNewQuota),
   // fork(watchUpdateProduct),
   // fork(watchAddNewProduct),
  ]);
}

export default masterSaga;
