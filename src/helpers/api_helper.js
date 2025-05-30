import axios from "axios";
import { api } from "../config";

// default
axios.defaults.baseURL = process.env.REACT_APP_LOCAL_URL_8082;
// content type

axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

// content type
const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;

if (token)
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

let instance;

instance = axios.create({
  //baseURL: api.APICALL_URL,
  baseURL: process.env.REACT_APP_LOCAL_URL_8082,
  //timeout: 1000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"}
});

let instance_80;

instance_80 = axios.create({
  baseURL: process.env.REACT_APP_LOCAL_URL_8082,
  //timeout: 1000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"}
});

let instancejbpm;

instancejbpm = axios.create({
  baseURL: process.env.REACT_APP_LOCAL_URL_8082,
  //timeout: 1000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8'}
});

let instanceJBPM1;

instanceJBPM1 = axios.create({
  baseURL: process.env.REACT_APP_LOCAL_URL_8082,
  //timeout: 1000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*","Authorization":"Basic d2JhZG1pbjp3YmFkbWlu"}
});

let instance2;

instance2 = axios.create({
  baseURL: process.env.REACT_APP_LOCAL_URL_8082,
  //timeout: 1000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"}
});


let instanceM;

instanceM = axios.create({
  baseURL: process.env.REACT_APP_LOCAL_URL_8082,
  //timeout: 1000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"}
});




class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  
  get = (url, params) => {
    let response;

    let paramKeys = [];

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: process.env.REACT_APP_API_USER_NAME,
        password: process.env.REACT_APP_API_PASSWORD,
      },
    };
    

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`, params, config);
    } else {
      response = axios.get(`${url}`, config);
    }

    return response;
  };
  /**
   * post given data to url
   */

  getJBPMData = (url, params) => {
    let response;
    //
    console.log(url);
    let paramKeys = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });
      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
    //  
      response = instancejbpm.get(`${url}?${queryString}`, params);
    } else {
      response = instancejbpm.get(`${url}`, params);
    }

    return response;
  };

  getDashboardData = (url, params) => {
    let response;
    //
    console.log(url);
    let paramKeys = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });
      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
    //  
      response = instance_80.get(`${url}?${queryString}`, params);
    } else {
      response = instance_80.get(`${url}`, params);
    }

    return response;
  };
   
  
  getTransporterData = (url, params) => {
    let response;
    //
    console.log(url);
    let paramKeys = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });
      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
    //  
      response = instance.get(`${url}?${queryString}`, params);
    } else {
      response = instance.get(`${url}`, params);
    }

    return response;
  };
   
  
  getMaterialData = (url, params) => {
    let response;
    
    console.log(url);
    let paramKeys = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
    //  response = axios.get(`${url}?${queryString}`, params);

     /* var instance = axios.create({
        baseURL: api.APICALL_URL,
        //timeout: 1000,
        headers: { 'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"}
      });*/
      
      response = instanceM.get(`${url}?${queryString}`, params);

      //console.log(axios)
    } else {
      //response = axios.get(`${url}`, params);
      /*
      var instance = axios.create({
        baseURL: api.APICALL_URL,
        headers: { 'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"}        
      });*/
      
      response = instanceM.get(`${url}`, params);
    }

    return response;
  };
  
  /*
  getDriversData = (url, params) => {
    let response;
    let instance1;
    
    console.log(url);
    let paramKeys = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
    //  response = axios.get(`${url}?${queryString}`, params);

      instance1 = axios.create({
        baseURL: api.APICALL_URL,
        //timeout: 1000,
        headers: { 'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"}
      });
      
      response = instance1.get(`${url}?${queryString}`, params);

      console.log(axios)
    } else {
      //response = axios.get(`${url}`, params);

      instance1 = axios.create({
        baseURL: api.APICALL_URL,
        headers: { 'Content-Type': 'application/json;charset=UTF-8',"Access-Control-Allow-Origin": "*"}        
      });
      
      response = instance1.get(`${url}`, params);
    }

    return response;
  };*/

  
  /**
   * post given data to url
   */


  create = (url, data) => {
    return axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
    },
    auth: {
      username: process.env.REACT_APP_API_USER_NAME,
      password: process.env.REACT_APP_API_PASSWORD,
    } 
    });
  };

  createCustomAdd = (url, data) => {
    //    console.log("fdfd");
        return instance.post(url, data, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },
        auth: {
          username: process.env.REACT_APP_API_USER_NAME,
          password: process.env.REACT_APP_API_PASSWORD,
        }
        });
      };
      
      createJBPMAdd = (url, data) => {
        //    console.log("fdfd");
            return instanceJBPM1.post(url, data, {
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                "Authorization":"Basic d2JhZG1pbjp3YmFkbWlu"
            }
            });
          };
      createProductAdd = (url, data) => {
        //    console.log("fdfd");
            return instance.post(url, data, {
              headers: {
                'Content-Type': 'multipart/form-data',
                "Access-Control-Allow-Origin": "*",
            },
            auth: {
              username: process.env.REACT_APP_API_USER_NAME,
              password: process.env.REACT_APP_API_PASSWORD,
            }
            });
          };
            
  
  createReportIndentAdd = (url, data) => {
    //    console.log("fdfd");
        return instance2.post(url, data, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },
        auth: {
          username: process.env.REACT_APP_API_USER_NAME,
          password: process.env.REACT_APP_API_PASSWORD,
        }
        });
      };

      
  createNew = (url, data) => {
    return axios.post(url, null, { params: {
      email: data.email,
      msgOtp: data.mobileOTP,
      email: data.emailOTP
    }});
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.patch(url, data);
  };

  updateData = (url, data) => {
    return instance.patch(url, data);
  };

  putData = (url, data) => {
    return instance.put(url, data);
  };
  put = (url, data) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: process.env.REACT_APP_API_USER_NAME,
        password: process.env.REACT_APP_API_PASSWORD,
      },
    };
    return axios.put(url, data, { ...config });
  };
  /**
   * Delete
   */
  delete = (url) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: process.env.REACT_APP_API_USER_NAME,
        password: process.env.REACT_APP_API_PASSWORD,
      },
    };
    return axios.delete(url, { ...config });
  };

  deleteData = (url, config) => {
    return instance.delete(url, { ...config });
  };
}
const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};
// Create a utility file like 'authUtils.js'
 const getLoginCode = () => {
  try {
      const storedData = sessionStorage.getItem("main_menu_login");
      
      if (storedData) {
          const obj = JSON.parse(storedData);
          
          // Access login directly from the object as shown in your session storage
          if (obj && obj.login) {
              return obj.login;
          } else {
              console.warn("Login data structure is not as expected");
              return null;
          }
      } else {
          console.warn("No login data found in session storage");
          return null;
      }
  } catch (error) {
      console.error("Error accessing login data:", error);
      return null;
  }
};

export { APIClient, setAuthorization, getLoggedinUser,getLoginCode };