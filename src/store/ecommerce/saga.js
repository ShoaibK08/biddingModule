import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ecoomerce Redux States
import {
  GET_PRODUCTS,
  DELETE_PRODUCT,
  GET_ORDERS,
  GET_SELLERS,
  GET_CUSTOMERS,

  DELETE_ORDER,
  UPDATE_ORDER,
  ADD_NEW_ORDER,

  ADD_NEW_CUSTOMER,
  DELETE_CUSTOMER,
  UPDATE_CUSTOMER,

  ADD_NEW_PRODUCT,
  UPDATE_PRODUCT
} from "./actionType";

import {
  ecommerceApiResponseSuccess,
  ecommerceApiResponseError,
  deleteOrderSuccess,
  deleteOrderFail,
  updateOrderSuccess,
  updateOrderFail,
  addOrderSuccess,
  addOrderFail,
  addCustomerFail,
  addCustomerSuccess,
  updateCustomerSuccess,
  updateCustomerFail,
  deleteCustomerSuccess,
  deleteCustomerFail,
  deleteProductSuccess,
  deleteProductFail,
  addProductSuccess,
  addProductFail,
  updateProductSuccess,
  updateProductFail
} from "./action";

//Include Both Helper File with needed methods
import {
  getProducts as getProductsApi,
  deleteProducts as deleteProductsApi,
  getOrders as getOrdersApi,
  getSellers as getSellersApi,
  getCustomers as getCustomersApi,
  updateOrder,
  deleteOrder,
  addNewOrder,
  addNewCustomer,
  updateCustomer,
  deleteCustomer,
  addNewProduct,
  updateProduct
} from "../../helpers/fakebackend_helper";

function* getProducts() {
  try {
    const response = yield call(getProductsApi);
    yield put(ecommerceApiResponseSuccess(GET_PRODUCTS, response.data.data));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_PRODUCTS, error));
  }
}

function* getOrders() {
  try {
    const response = yield call(getOrdersApi);
    yield put(ecommerceApiResponseSuccess(GET_ORDERS, response.data.data));
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

function* getCustomers() {
  try {
    const response = yield call(getCustomersApi);
    /*const response = {
      "status": "success",
      "data": [
          {
              "_id": "625e9b4969b1a759ed942687",
              "customerId": "#VZ2107",
              "customer": "Dheeraj",
              "email": "dheeraj@amazin.com",
              "phone": "9555977778",
              "date": "2021-11-01T18:30:00.000Z",
              "status": "Active"
          },
          {
              "_id": "625e9b4969b1a759ed942689",
              "customerId": "#VZ2109",
              "customer": "Sandeep",
              "email": "sandeep@amazin.com",
              "phone": "9555977778",
              "date": "2021-07-19T18:30:00.000Z",
              "status": "Block"
          },
          {
              "_id": "625e9b4969b1a759ed942685",
              "customerId": "#VZ2105",
              "customer": "Shubham",
              "email": "shubham@amazin.com",
              "phone": "9555977778",
              "date": "2021-04-13T18:30:00.000Z",
              "status": "Active"
          },
          {
              "_id": "625e9b4969b1a759ed942682",
              "customerId": "#VZ2102",
              "customer": "Vivek",
              "email": "vivek@amazin.com",
              "phone": "9555977778",
              "date": "2021-02-14T18:30:00.000Z",
              "status": "Active"
          },
          {
              "_id": "625e9b4969b1a759ed942681",
              "customerId": "#VZ2101",
              "customer": "Deepak",
              "email": "deepak@amazin.com",
              "phone": "9555977778",
              "date": "2021-04-05T18:30:00.000Z",
              "status": "Active"
          },
          {
              "_id": "625e9b4969b1a759ed94268b",
              "customerId": "#VZ21011",
              "customer": "Mukesh",
              "email": "mukesh@amazin.com",
              "phone": "9555977778",
              "date": "2021-09-30T18:30:00.000Z",
              "status": "Block"
          },
          {
              "_id": "625e9b4969b1a759ed94268c",
              "customerId": "#VZ21012",
              "customer": "Nitu",
              "email": "nitu@amazin.com",
              "phone": "9555977778",
              "date": "2021-04-13T18:30:00.000Z",
              "status": "Active"
          }
          
      ]
  };*/
    yield put(ecommerceApiResponseSuccess(GET_CUSTOMERS, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_CUSTOMERS, error));
  }
}

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
    console.log(response)
    yield put(addProductSuccess(response));
   // alert("dfdf")
    toast.success("Material Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addProductFail(error));
    toast.error("Material Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateProduct({ payload: product }) {
  try {
    const response = yield call(updateProduct, product);
    yield put(updateProductSuccess(response));
    toast.success("Material Updateded Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateProductFail(error));
    toast.error("Material Updateded Failed", { autoClose: 3000 });
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
}

// function* onUpdateCustomer({ payload: customer }) {
//   try {
//     const response = yield call(updateCustomer, customer);
//     yield put(updateCustomerSuccess(response));
//     toast.success("Customer Updated Successfully", { autoClose: 3000 });
//   } catch (error) {
//     yield put(updateCustomerFail(error));
//     toast.error("Customer Updated Failed", { autoClose: 3000 });
//   }
// }

// function* onDeleteCustomer({ payload: customer }) {
//   try {
//     const response = yield call(deleteCustomer, customer);
//     yield put(deleteCustomerSuccess({ customer, ...response }));
//     toast.success("Customer Deleted Successfully", { autoClose: 3000 });
//   } catch (error) {
//     yield put(deleteCustomerFail(error));
//     toast.error("Customer Deleted Failed", { autoClose: 3000 });
//   }
// }

// function* onAddNewCustomer({ payload: customer }) {
//   try {
//     const response = yield call(addNewCustomer, customer);
//     yield put(addCustomerSuccess(response));
//     toast.success("Customer Added Successfully", { autoClose: 3000 });
//   } catch (error) {
//     yield put(addCustomerFail(error));
//     toast.error("Customer Added Failed", { autoClose: 3000 });
//   }
// }

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

export function* watchGetCustomers() {
  yield takeEvery(GET_CUSTOMERS, getCustomers);
}

export function* watchUpdateOrder() {
  yield takeEvery(UPDATE_ORDER, onUpdateOrder);
}

export function* watchDeleteOrder() {
  yield takeEvery(DELETE_ORDER, onDeleteOrder);
}

export function* watchAddNewOrder() {
  yield takeEvery(ADD_NEW_ORDER, onAddNewOrder);
}

export function* watchUpdateCustomer() {
  //yield takeEvery(UPDATE_CUSTOMER, onUpdateCustomer);
}

export function* watchDeleteCustomer() {
  //yield takeEvery(DELETE_CUSTOMER, onDeleteCustomer);
}

export function* watchAddNewCustomer() {
  //yield takeEvery(ADD_NEW_CUSTOMER, onAddNewCustomer);
}

export function* watchUpdateProduct() {
  yield takeEvery(UPDATE_PRODUCT, onUpdateProduct);
}

export function* watchAddNewProduct() {
  yield takeEvery(ADD_NEW_PRODUCT, onAddNewProduct);
}

function* ecommerceSaga() {
  yield all([
    fork(watchGetProducts),
    fork(watchDeleteProducts),
    fork(watchGetOrders),
    fork(watchGetSellers),
    fork(watchGetCustomers),
    fork(watchDeleteOrder),
    fork(watchUpdateOrder),
    fork(watchAddNewOrder),
    fork(watchDeleteCustomer),
    fork(watchUpdateCustomer),
    fork(watchAddNewCustomer),
    fork(watchUpdateProduct),
    fork(watchAddNewProduct),
  ]);
}

export default ecommerceSaga;
