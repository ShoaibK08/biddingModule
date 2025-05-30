import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { FORGET_PASSWORD, RESET_PASSWORD } from "./actionTypes";
import { userForgetPasswordSuccess, userForgetPasswordError, userResetPasswordSuccess, userResetPasswordError } from "./actions";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeForgetPwd,
  postFakeResetPwd,
  postJwtForgetPwd,
} from "../../../helpers/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* forgetUser({ payload: { user, history } }) {
  try {
    // if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
    //   const response = yield call(fireBaseBackend.forgetPassword, user.email);
    //   if (response) {
    //     yield put(
    //       userForgetPasswordSuccess(
    //         "Reset link are sended to your mailbox, check there first"
    //       )
    //     );
    //   }
    // } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
    //   const response = yield call(postJwtForgetPwd, "/jwt-forget-pwd", {
    //     email: user.email,
    //   });
    //   if (response) {
    //     yield put(
    //       userForgetPasswordSuccess(
    //         "Reset link are sended to your mailbox, check there first"
    //       )
    //     );
    //   }
    // } 
    if (process.env.REACT_APP_API_URL) {
      const response = yield call(postFakeForgetPwd, user);
      if (response.errorMsg !== "User not found!") {
        yield put(
          userForgetPasswordSuccess(
            "Password reset successfully. Please check your mail."
          )
        );
      }
      else{
        yield put(userForgetPasswordError("User not found!"));
      }
    }
  } catch (error) {
    yield put(userForgetPasswordError(error));
  }
}

function* resetUser({ payload: { user, history } }) {
  try {

    const response = yield call(postFakeResetPwd, user);
    if (response.message === "Password changed successfully") {
      console.log(response.message);
      yield put(userResetPasswordSuccess(response.message));
      history('/login');
    }
    else{
      yield put(userResetPasswordError("Incorrect old password"));
    }
  } catch (error) {
    yield put(userResetPasswordError(error));
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser);
}
export function* watchUserPasswordReset() {
  yield takeEvery(RESET_PASSWORD, resetUser);
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)]);
  yield all([fork(watchUserPasswordReset)]);
}

export default forgetPasswordSaga;
