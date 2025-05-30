import {
  FORGET_PASSWORD,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from "./actionTypes";

export const userForgetPassword = (user, history) => {
  return {
    type: FORGET_PASSWORD,
    payload: { user, history },
  };
};

export const userForgetPasswordSuccess = message => {
  return {
    type: FORGET_PASSWORD_SUCCESS,
    payload: message,
  };
};

export const userForgetPasswordError = message => {
  return {
    type: FORGET_PASSWORD_ERROR,
    payload: message,
  };
};


export const userResetPassword = (user, history) => {
  return {
    type: RESET_PASSWORD,
    payload: { user, history }, 
  };
};

export const userResetPasswordSuccess = message => {
  return {
    type: RESET_PASSWORD_SUCCESS,
    payload: message,
  };
};

export const userResetPasswordError = message => {
  return {
    type: RESET_PASSWORD_ERROR,
    payload: message,
  };
};
