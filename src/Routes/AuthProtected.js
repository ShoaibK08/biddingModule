import React, { useEffect } from "react";
import { Navigate, Route } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch } from "react-redux";

import { useProfile } from "../Components/Hooks/UserHooks";

import { logoutUser } from "../store/actions";

const AuthProtected = (props) => {
  const dispatch = useDispatch();
  const { userProfile, loading, token } = useProfile();
  useEffect(() => {

    if (userProfile && !loading && token) {
      setAuthorization(token);
    } else if (!userProfile && loading && !token) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  /*
    redirect is un-auth access protected routes via url
  */

  if (!userProfile && loading && !token) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }


//disable outside URL start

  // const currentUrl = window.location.href;
  // console.log('Current URL:', currentUrl);
  // if (currentUrl.includes("profile")) {
  //   console.log('Page 404 Disabled.!!');
  // }
  // else {
  //   const current_url = "/" + window.location.href.split('/')[3];
  //   const main_menu = sessionStorage.getItem("main_menu_login");
  //   const obj = JSON.parse(main_menu);
  //   const dataArray = obj.menuItems;
  //   console.log(dataArray);
  //   const urlArray = dataArray.map(user => user.subMenuMaster ? user.subMenuMaster.url : null).filter(url => url !== null);

  //   console.log("URL Array:", urlArray);
  //   const finalRes = urlArray.includes(current_url);
  //   console.log("Final", finalRes);
  //   if (!finalRes) {
  //     return <Navigate to="/auth-404-alt" />;
  //   }
  // }

  //disable outside URL end




  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

export { AuthProtected, AccessRoute };