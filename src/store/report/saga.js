import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ecoomerce Redux States
import {
  GET_REPORT_INDENT,
  GET_REPORT_CANCEL_INDENT,
  GET_REPORT_SCHEDULE_INDENT,
  GET_QUOTA_CONFIG,
  ADD_NEW_REPORT_INDENT,
  ADD_NEW_SCHEDULE_REPORT_INDENT,
  ADD_NEW_CANCEL_REPORT_INDENT,
  DELETE_REPORT_INDENT,
  UPDATE_REPORT_INDENT,
  GET_REPORT_SCHEDULED,
  ADD_CANCEL_REPORT_INDENT_SUCCESS,
  ADD_CANCEL_REPORT_INDENT_FAIL,  
  ADD_SCHEDULE_REPORT_INDENT_SUCCESS,
  ADD_SCHEDULE_REPORT_INDENT_FAIL,  
  GET_USER_DATA_CODE
} from "./actionType";

import {
  ecommerceApiResponseSuccessReportIndent1,
  ecommerceApiResponseErrorReportIndent1,
  addReportIndentFail1,
  addReportIndentSuccess1,
  addCancelReportIndentFail1,
  addCancelReportIndentSuccess1,
  addScheduleReportIndentFail1,
  addScheduleReportIndentSuccess1,
  updateReportIndentSuccess1,
  updateReportIndentFail1,
  deleteReportIndentSuccess1,
  deleteReportIndentFail1,
} from "./action";

//Include Both Helper File with needed methods
import {
  getReportIndent as getReportIndentApi,
  addNewReportIndent,
  addNewCancelReportIndent,
  addNewScheduleReportIndent,
  updateReportIndent,
  deleteReportIndent,
  getUserDataByCode as getUserDataApi
} from "../../helpers/fakebackend_helper";


function* getUserDataByCode() {
  try {
    const response = yield call(getUserDataApi);
    //console.log(response);
    yield put(ecommerceApiResponseSuccessReportIndent1(GET_USER_DATA_CODE, response));
  } catch (error) {
    yield put(ecommerceApiResponseErrorReportIndent1(GET_USER_DATA_CODE, error));
  }
}

function* getReportIndent() {
  try {
    const response = yield call(getReportIndentApi);
    console.log(response);
    yield put(ecommerceApiResponseSuccessReportIndent1(GET_REPORT_INDENT, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseErrorReportIndent1(GET_REPORT_INDENT, error));
  }
}
function* onUpdateReportIndent({ payload: customer }) {
  try {
    const response = yield call(updateReportIndent, customer);
    yield put(updateReportIndentSuccess1(response));
    toast.success("Customer Updateded Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateReportIndentFail1(error));
    toast.error("Customer Updateded Failed", { autoClose: 3000 });
  }
}

function* onDeleteReportIndent({ payload: customer }) {
  try {
    const response = yield call(deleteReportIndent, customer);
    yield put(deleteReportIndentSuccess1({ customer, ...response }));
    toast.success("Customer Deleted Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteReportIndentFail1(error));
    toast.error("Customer Deleted Failed", { autoClose: 3000 });
  }
}

function* onAddNewReportIndent({ payload: reportIndent }) {
  try {
    
    const response = yield call(addNewReportIndent, reportIndent);
    console.log(response.message);
    const jsonP = response.message;
    const jsonN = jsonP["#result-set-1"];
    yield put(ecommerceApiResponseSuccessReportIndent1(GET_REPORT_INDENT, jsonN));
    //toast.success("Report Indent Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(ecommerceApiResponseErrorReportIndent1(GET_REPORT_INDENT, error));
  }
}

function* onAddNewCancelReportIndent({ payload: reportCancelIndent }) {
  try {
    
    const response = yield call(addNewCancelReportIndent, reportCancelIndent);
    const jsonP = response.message;
    const jsonN = jsonP["#result-set-1"];
    yield put(ecommerceApiResponseSuccessReportIndent1(ADD_CANCEL_REPORT_INDENT_SUCCESS, jsonN));
    //toast.success("Report Indent Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(ecommerceApiResponseErrorReportIndent1(ADD_CANCEL_REPORT_INDENT_FAIL, error));
  }
}

function* onAddNewScheduleReportIndent({ payload: reportScheduleIndent }) {
  try {
    
    const response = yield call(addNewScheduleReportIndent, reportScheduleIndent);
    const jsonP = response.message;
    const jsonN = jsonP["#result-set-1"];
    yield put(ecommerceApiResponseSuccessReportIndent1(ADD_SCHEDULE_REPORT_INDENT_SUCCESS, jsonN));
    //toast.success("Report Indent Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(ecommerceApiResponseErrorReportIndent1(ADD_SCHEDULE_REPORT_INDENT_FAIL, error));
  }
}

export function* watchGetReportIndent() {
  yield takeEvery(GET_REPORT_INDENT, getReportIndent);
}

export function* watchGetUserDataByCode() {
  yield takeEvery(GET_USER_DATA_CODE, getUserDataByCode);
}

export function* watchUpdateReportIndent() {
  yield takeEvery(UPDATE_REPORT_INDENT, onUpdateReportIndent);
}

export function* watchDeleteReportIndent() {
  yield takeEvery(DELETE_REPORT_INDENT, onDeleteReportIndent);
}

export function* watchAddNewReportIndent() {
  yield takeEvery(ADD_NEW_REPORT_INDENT, onAddNewReportIndent);
}

export function* watchAddNewCancelReportIndent() {
  yield takeEvery(ADD_NEW_CANCEL_REPORT_INDENT, onAddNewCancelReportIndent);
}

export function* watchAddNewScheduleReportIndent() {
  yield takeEvery(ADD_NEW_SCHEDULE_REPORT_INDENT, onAddNewScheduleReportIndent);
}

function* reportSaga() {
  yield all([
    fork(watchGetReportIndent),    
    fork(watchDeleteReportIndent),
    fork(watchUpdateReportIndent),
    fork(watchAddNewReportIndent),
    fork(watchAddNewCancelReportIndent),
    fork(watchAddNewScheduleReportIndent),
    fork(watchGetUserDataByCode),
  ]);
}

export default reportSaga;
