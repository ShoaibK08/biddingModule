import {
  FORGET_PASSWORD,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from "./actionTypes";

const initialState = {
  forgetSuccessMsg: null,
  forgetError: null,
  resetSuccessMsg: null,
  resetError: null,
};

const forgetPassword = (state = initialState, action) => {
  switch (action.type) {
    case FORGET_PASSWORD:
      state = {
        ...state,
        forgetSuccessMsg: null,
        forgetError: null,
      };
      break;
    case FORGET_PASSWORD_SUCCESS:
      state = {
        ...state,
        forgetSuccessMsg: action.payload,
      };
      break;
    case FORGET_PASSWORD_ERROR:
      state = { ...state, forgetError: action.payload };
      break;
      case RESET_PASSWORD:
      state = {
        ...state,
        resetSuccessMsg: null,
        resetError: null,
      };
      break;
    case RESET_PASSWORD_SUCCESS:
      state = {
        ...state,
        resetSuccessMsg: action.payload,
      };
      break;
    case RESET_PASSWORD_ERROR:
      state = { ...state, resetError: action.payload };
      break;
    default:
      state = { ...state };
      break;
  }
  return state; 
};

export default forgetPassword;
