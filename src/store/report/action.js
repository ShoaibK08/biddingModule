import {
    //GET_PRODUCTS,
    //GET_ORDERS,
    //GET_SELLERS,
    GET_REPORT_INDENT,
    GET_USER_DATA_CODE,
    GET_REPORT_CANCEL_INDENT,
    GET_REPORT_SCHEDULE_INDENT,
    GET_REPORT_ORDER,
    GET_REPORT_SCHEDULED,
    GET_REPORT_QUOTA,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,
    UPDATE_REPORT_INDENT,
    UPDATE_REPORT_INDENT_SUCCESS,
    UPDATE_REPORT_INDENT_FAIL,
    ADD_NEW_REPORT_INDENT,
    ADD_REPORT_INDENT_SUCCESS,
    ADD_REPORT_INDENT_FAIL,
    ADD_NEW_CANCEL_REPORT_INDENT,
    ADD_CANCEL_REPORT_INDENT_SUCCESS,
    ADD_CANCEL_REPORT_INDENT_FAIL,    
    ADD_NEW_SCHEDULE_REPORT_INDENT,
    ADD_SCHEDULE_REPORT_INDENT_SUCCESS,
    ADD_SCHEDULE_REPORT_INDENT_FAIL,
    DELETE_REPORT_INDENT,
    DELETE_REPORT_INDENT_SUCCESS,
    DELETE_REPORT_INDENT_FAIL,

  } from "./actionType";
  
  // common success
  export const ecommerceApiResponseSuccessReportIndent1 = (actionType, data) => ({
    type: API_RESPONSE_SUCCESS,
    payload: { actionType, data },
  });
  // common error
  export const ecommerceApiResponseErrorReportIndent1 = (actionType, error) => ({
    type: API_RESPONSE_ERROR,
    payload: { actionType, error },
  });

  export const getUserDataByCode = () => ({
    type: GET_USER_DATA_CODE,
  });
  
  export const getReportIndent1 = () => ({
    type: GET_REPORT_INDENT,
  });

  export const getReportCancelIndent1 = () => ({
    type: GET_REPORT_CANCEL_INDENT,
  });

  export const getReportQuota1 = () => ({
    type: GET_REPORT_QUOTA,
  });

  export const getReportOrder1 = () => ({
    type: GET_REPORT_ORDER,
  });

  export const getReportScheduled1 = () => ({
    type: GET_REPORT_SCHEDULED,
  });

  export const updateReportIndent1 = customer => ({
    type: UPDATE_REPORT_INDENT,
    payload: customer,
  });
  
  export const updateReportIndentSuccess1 = customer => ({
    type: UPDATE_REPORT_INDENT_SUCCESS,
    payload: customer,
  });
  
  export const updateReportIndentFail1 = error => ({
    type: UPDATE_REPORT_INDENT_FAIL,
    payload: error,
  });
  
  export const addNewReportIndent1 = reportIndent => ({
    type: ADD_NEW_REPORT_INDENT,
    payload: reportIndent,
  });
  
  export const addReportIndentSuccess1 = reportIndent => ({
    type: ADD_REPORT_INDENT_SUCCESS,
    payload: reportIndent,
  });
  
  export const addReportIndentFail1 = error => ({
    type: ADD_REPORT_INDENT_FAIL,
    payload: error,
  });

  
  export const addNewCancelReportIndent1 = reportCancelIndent => ({
    type: ADD_NEW_CANCEL_REPORT_INDENT,
    payload: reportCancelIndent,
  });
  
  export const addCancelReportIndentSuccess1 = reportCancelIndent => ({
    type: ADD_CANCEL_REPORT_INDENT_SUCCESS,
    payload: reportCancelIndent,
  });
  
  export const addCancelReportIndentFail1 = error => ({
    type: ADD_CANCEL_REPORT_INDENT_FAIL,
    payload: error,
  });
  
  export const addNewScheduleReportIndent1 = reportScheduleIndent => ({
    type: ADD_NEW_SCHEDULE_REPORT_INDENT,
    payload: reportScheduleIndent,
  });
  
  export const addScheduleReportIndentSuccess1 = reportScheduleIndent => ({
    type: ADD_SCHEDULE_REPORT_INDENT_SUCCESS,
    payload: reportScheduleIndent,
  });
  
  export const addScheduleReportIndentFail1 = error => ({
    type: ADD_SCHEDULE_REPORT_INDENT_FAIL,
    payload: error,
  });
  
  export const deleteReportIndent1 = customer => ({
    type: DELETE_REPORT_INDENT,
    payload: customer,
  });
  
  export const deleteReportIndentSuccess1 = customer => ({
    type: DELETE_REPORT_INDENT_SUCCESS,
    payload: customer,
  });
  
  export const deleteReportIndentFail1 = error => ({
    type: DELETE_REPORT_INDENT_FAIL,
    payload: error,
  });