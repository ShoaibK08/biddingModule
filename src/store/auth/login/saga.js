
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();

function* loginUser({ payload: { user, history } }) {
  try {
     if (process.env.REACT_APP_API_URL) {
      const response = yield call(postFakeLogin, {
        email: user.email,
        password: user.password,
        captcha: user.captcha
      });
      const set_response = {
        "status": "success",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNWQwOTUyNTU3NThiYjM0YWU4YzAyZSIsImlhdCI6MTY3NDE5NjE4OSwiZXhwIjoxNjgxOTcyMTg5fQ.ZGB5LGqIJqpTe3FN8YR--oDLl0g5BUmDnWaWNieo8ts",
        "data": {
            "_id": response.id,
            "first_name": response.firstname,
            "last_name": response.lastname,
            "login": response.login,
            "email": response.email,
            "phone": response.mobileNumber,
            "plantCode" : response.plantCode,
            "transporterCode" : response.login,
            "password": "$2a$12$OdX.AB8Oiz6PEXohnREMjOtIy8h4/Ha3wPMHVcA/J373tQ0afoco2",
            "role": "admin",
            "confirm_password": "789789789",
            "changePasswordAt": "2022-04-18T06:46:23.839Z",
            "skills": [
                "LARAVEL",
                "NODE"
            ],
            "__v": 0,
            "Description": "",
            "city": "Mumbai",
            "country": "India",
            "designation": "Lead Designer / Developer",
            "joining_date": null,
            "website": "www.velzon.com",
            "zipcode": "90011",
            "passwordtoken": "ca24caf68d9c2a7d570d564473016600ff66ce49218f910d8cabb9a4c2707e0a",
            "passwordtokenexp": "2022-12-22T19:36:39.762Z"
        }
    };
      console.log(response);
      if (response.msg === "FirstTimeLogin") {
        yield put(loginSuccess(response));  //FirstTimeLogin   User Login Successfully message
        history('/change-password');
        sessionStorage.setItem("authUser", JSON.stringify(set_response));        
        sessionStorage.setItem("main_menu_login", JSON.stringify(response));
      }
      else if(response.msg === "User Login Successfully"){
        //history('/MRP-Dashboard');
       // history('/sales-dispatch');
 history('/auction-dashboard');
        sessionStorage.setItem("authUser", JSON.stringify(set_response));
        sessionStorage.setItem("main_menu_login", JSON.stringify(response));
      }
      else if(response.message === "Invalid Credentials"){
        yield put(apiError(response.message));
      }
      else if(response.message === "User Not Found"){
        yield put(apiError(response.message));
      }
      else if(response.message === "login attempts limit exceed, please reset your password before login"){
        yield put(apiError("login attempts limit exceed, Click on forget password."));
      }
      else {
        yield put(apiError(response));
      }
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* logoutUser() {
  try {
    sessionStorage.removeItem("authUser");
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(LOGOUT_USER, response));
    } else {
      yield put(logoutUserSuccess(LOGOUT_USER, true));
    }
  } catch (error) {
    yield put(apiError(LOGOUT_USER, error));
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      const response = yield call(
        fireBaseBackend.socialLoginUser,
        data,
        type,
      );
      sessionStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    } else {
      const response = yield call(postSocialLogin, data);
      sessionStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    }
    history('/dashboard');
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
