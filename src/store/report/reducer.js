import {
  GET_REPORT_INDENT,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  ADD_REPORT_INDENT_SUCCESS,
  ADD_REPORT_INDENT_FAIL,  
  ADD_CANCEL_REPORT_INDENT_SUCCESS,
  ADD_CANCEL_REPORT_INDENT_FAIL,  
  ADD_SCHEDULE_REPORT_INDENT_SUCCESS,
  ADD_SCHEDULE_REPORT_INDENT_FAIL,
  UPDATE_REPORT_INDENT_SUCCESS,
  UPDATE_REPORT_INDENT_FAIL,
  DELETE_REPORT_INDENT_SUCCESS,
  DELETE_REPORT_INDENT_FAIL,

  GET_REPORT_SCHEDULED
} from "./actionType";

const INIT_STATE = {
  products: [],
  reportCancelIndents:[],
  reportScheduleIndents:[],
  reportIndents: [],
  sellers: [],
  customers: [],
  transporters: [],
  error: {},
  reportScheduled: [],
};

const Report = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {

        case ADD_CANCEL_REPORT_INDENT_SUCCESS:
          return {
            // ...state,
              ...state,
              reportCancelIndents: action.payload.data,
              isreportCancelIndentsCreated: false,
              isreportCancelIndentsSuccess: true
            // isreportIndentsCreated: true,
            //reportIndents: [...state.reportIndents, action.payload.data],

          };

        case ADD_CANCEL_REPORT_INDENT_FAIL:
          return {
            ...state,
            error: action.payload,

          };

          case ADD_SCHEDULE_REPORT_INDENT_SUCCESS:
            return {
              // ...state,
                ...state,
                reportScheduleIndents: action.payload.data,
                isreportScheduleIndentsCreated: false,
                isreportScheduleIndentsSuccess: true
              // isreportIndentsCreated: true,
              //reportIndents: [...state.reportIndents, action.payload.data],
      
            };
      
          case ADD_SCHEDULE_REPORT_INDENT_FAIL:
            return {
              ...state,
              error: action.payload,
      
            };

        case GET_REPORT_INDENT:
          return {
            ...state,
            reportIndents: action.payload.data,
            isreportIndentsCreated: false,
            isreportIndentsSuccess: true
          };

        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_REPORT_INDENT:
          return {
            ...state,
            error: action.payload.error,
            isreportIndentsCreated: false,
            isreportIndentsSuccess: false
          };
        default:
          return { ...state };
      }
    case GET_REPORT_INDENT:
      return {  
        ...state,
        isreportIndentsCreated: false
      };
    case ADD_REPORT_INDENT_SUCCESS:
      return {
       // ...state,
          ...state,
          reportIndents: action.payload.data,
          isreportIndentsCreated: false,
          isreportIndentsSuccess: true
       // isreportIndentsCreated: true,
       //reportIndents: [...state.reportIndents, action.payload.data],

      };

    case ADD_REPORT_INDENT_FAIL:
      return {
        ...state,
        error: action.payload,

      };
    
    
  
    case UPDATE_REPORT_INDENT_SUCCESS:
      return {
        ...state,
        reportIndents: state.reportIndents.map(customer =>
          customer._id.toString() === action.payload.data._id.toString()
            ? { ...customer, ...action.payload.data }
            : customer
        ),
      };

    case UPDATE_REPORT_INDENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };


    case DELETE_REPORT_INDENT_SUCCESS:
      return {
        ...state,
        reportIndents: state.reportIndents.filter(
          customer => customer._id.toString() !== action.payload.customer.toString()
        ),
      };

    case DELETE_REPORT_INDENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return { ...state };

    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {

        case GET_REPORT_SCHEDULED:
          return {
            ...state,
            reportScheduled: action.payload.data,
            isreportScheduledCreated: false,
            isreportScheduledSuccess: true
          };

        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_REPORT_SCHEDULED:
          return {
            ...state,
            error: action.payload.error,
            isreportScheduledCreated: false,
            isreportScheduledSuccess: false
          };
        default:
          return { ...state };
      }
    case GET_REPORT_SCHEDULED:
      return {
        ...state,
        isreportScheduledCreated: false
      };
  }
};

export default Report;