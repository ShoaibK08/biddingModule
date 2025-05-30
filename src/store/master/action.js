import {
    //GET_PRODUCTS,
    //GET_ORDERS,
    //GET_SELLERS,
    GET_CUSTOMERS,
    GET_QUOTA,
    GET_TRANSPORTERS,
    GET_PROCESS,
    GET_ROLES,
    GET_DRIVER,
    GET_MATERIAL,
    GET_VEHICLE,
    GET_CLEANER,
    GET_CLUSTER,
    GET_PLANT,
    GET_USERS,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,
  
    //DELETE_ORDER,
    //DELETE_ORDER_SUCCESS,
    //DELETE_ORDER_FAIL,
  
    //UPDATE_ORDER,
    //UPDATE_ORDER_SUCCESS,
    //UPDATE_ORDER_FAIL,
  
    //ADD_NEW_ORDER,
    //ADD_ORDER_SUCCESS,
    //ADD_ORDER_FAIL,
  
    UPDATE_CUSTOMER,
    UPDATE_CUSTOMER_SUCCESS,
    UPDATE_CUSTOMER_FAIL,
    UPDATE_PLANT,
    UPDATE_PLANT_SUCCESS,
    UPDATE_PLANT_FAIL,
    UPDATE_VEHICLE,
    UPDATE_VEHICLE_SUCCESS,
    UPDATE_VEHICLE_FAIL,
    ADD_NEW_CUSTOMER,
    ADD_NEW_CLEANER,
    ADD_NEW_TRANSPORTER,
    ADD_NEW_PLANT,
    ADD_NEW_QUOTA,
    ADD_NEW_DRIVER,
    ADD_NEW_VEHICLE,
    ADD_NEW_CLUSTER,
    ADD_CUSTOMER_SUCCESS,
    ADD_PLANT_SUCCESS,
    ADD_CLUSTER_SUCCESS,
    ADD_CLEANER_SUCCESS,
    ADD_VEHICLE_SUCCESS,
    ADD_CUSTOMER_FAIL,
    ADD_CLUSTER_FAIL,
    ADD_CLEANER_FAIL,
    ADD_VEHICLE_FAIL,
    ADD_PLANT_FAIL,
    ADD_NEW_RAISE_INDENT,
    ADD_RAISE_INDENT_SUCCESS,
    ADD_TRANSPORTER_SUCCESS,
    ADD_TRANSPORTER_FAIL,
    ADD_RAISE_INDENT_FAIL,
    ADD_DRIVER_SUCCESS,
    ADD_DRIVER_FAIL,
    DELETE_CUSTOMER,
    DELETE_CUSTOMER_SUCCESS,
    DELETE_CUSTOMER_FAIL,     
    UPDATE_TRANSPORTER,
    UPDATE_TRANSPORTER_SUCCESS,
    UPDATE_TRANSPORTER_FAIL,     
    UPDATE_CLUSTER,
    UPDATE_CLUSTER_SUCCESS,
    UPDATE_CLUSTER_FAIL,
    DELETE_VEHICLE,
    DELETE_VEHICLE_SUCCESS,
    DELETE_VEHICLE_FAIL,
    ADD_QUOTA_SUCCESS,
    ADD_QUOTA_FAIL,


  
    //DELETE_PRODUCT,
    //DELETE_PRODUCT_SUCCESS,
    //DELETE_PRODUCT_FAIL,
  
    //ADD_NEW_PRODUCT,
    //ADD_PRODUCT_SUCCESS,
    //ADD_PRODUCT_FAIL,
  
    //UPDATE_PRODUCT,
    //UPDATE_PRODUCT_SUCCESS,
    //UPDATE_PRODUCT_FAIL
  } from "./actionType";
  
  // common success
  export const ecommerceApiResponseSuccess1 = (actionType, data) => ({
    type: API_RESPONSE_SUCCESS,
    payload: { actionType, data },
  });
  // common error
  export const ecommerceApiResponseError1 = (actionType, error) => ({
    type: API_RESPONSE_ERROR,
    payload: { actionType, error },
  });
  /*
  export const getProducts = () => ({
    type: GET_PRODUCTS,
  });
  
  export const deleteProducts = product => ({
    type: DELETE_PRODUCT,
    payload: product,
  });
  
  export const deleteProductSuccess = product => ({
    type: DELETE_PRODUCT_SUCCESS,
    payload: product,
  });
  
  export const deleteProductFail = error => ({
    type: DELETE_PRODUCT_FAIL,
    payload: error,
  });
  
  export const updateProduct = product => ({
    type: UPDATE_PRODUCT,
    payload: product,
  });
  
  export const updateProductSuccess = product => ({
    type: UPDATE_PRODUCT_SUCCESS,
    payload: product,
  });
  
  export const updateProductFail = error => ({
    type: UPDATE_PRODUCT_FAIL,
    payload: error,
  });
  
  export const addNewProduct = product => ({
    type: ADD_NEW_PRODUCT,
    payload: product,
  });
  
  export const addProductSuccess = product => ({
    type: ADD_PRODUCT_SUCCESS,
    payload: product,
  });
  
  export const addProductFail = error => ({
    type: ADD_PRODUCT_FAIL,
    payload: error,
  });
  
  export const getOrders = () => ({
    type: GET_ORDERS,
  });
  
  export const getSellers = () => ({
    type: GET_SELLERS,
  });

  */
  export const getCustomers1 = () => ({
    type: GET_CUSTOMERS,
  });

  export const getQuota1 = () => ({
    type: GET_QUOTA,
  });

  export const getPlant = () => ({
    type: GET_PLANT,
  });

  export const getTransporters = () => ({
    type: GET_TRANSPORTERS,
  });
  
  export const getProcessing = () => ({
    type: GET_PROCESS,
  });
  
  export const getRoles = () => ({
    type: GET_ROLES,
  });

  export const getMaterial = () => ({
    type: GET_MATERIAL,
  });

  export const getDriver = () => ({
    type: GET_DRIVER,
  });

  export const getVehicle = () => ({
    type: GET_VEHICLE,
  });

  export const getCleaner = () => ({
    type: GET_CLEANER,
  });

  export const getCluster = () => ({
    type: GET_CLUSTER,
  });

  export const getUsers = () => ({
    type: GET_USERS,
  });


  /*
  export const deleteOrder = order => ({
    type: DELETE_ORDER,
    payload: order,
  });
  
  export const deleteOrderSuccess = order => ({
    type: DELETE_ORDER_SUCCESS,
    payload: order,
  });
  
  export const deleteOrderFail = error => ({
    type: DELETE_ORDER_FAIL,
    payload: error,
  });
  
  export const updateOrder = order => ({
    type: UPDATE_ORDER,
    payload: order,
  });
  
  export const updateOrderFail = error => ({
    type: UPDATE_ORDER_FAIL,
    payload: error,
  });
  
  export const updateOrderSuccess = order => ({
    type: UPDATE_ORDER_SUCCESS,
    payload: order,
  });
  
  export const addNewOrder = order => ({
    type: ADD_NEW_ORDER,
    payload: order,
  });
  
  export const addOrderSuccess = order => ({
    type: ADD_ORDER_SUCCESS,
    payload: order,
  });
  
  export const addOrderFail = error => ({
    type: ADD_ORDER_FAIL,
    payload: error,
  });*/
  
  export const updateCustomer1 = customer => ({
    type: UPDATE_CUSTOMER,
    payload: customer,
  });
  
  export const updateCustomerSuccess1 = customer => ({
    type: UPDATE_CUSTOMER_SUCCESS,
    payload: customer,
  });
  
  export const updateCustomerFail1 = error => ({
    type: UPDATE_CUSTOMER_FAIL,
    payload: error,
  });

  export const updatePlant1 = plant => ({
    type: UPDATE_PLANT,
    payload: plant,
  });
  
  export const updatePlantSuccess1 = plant => ({
    type: UPDATE_PLANT_SUCCESS,
    payload: plant,
  });
  
  export const updatePlantFail1 = error => ({
    type: UPDATE_PLANT_FAIL,
    payload: error,
  });
  
  export const updateCluster1 = cluster => ({
    type: UPDATE_CLUSTER,
    payload: cluster,
  });
  
  export const updateClusterSuccess1 = cluster => ({
    type: UPDATE_CLUSTER_SUCCESS,
    payload: cluster,
  });
  
  export const updateClusterFail1 = error => ({
    type: UPDATE_CLUSTER_FAIL,
    payload: error,
  });
  
  
  export const addNewCustomer1 = customer => ({
    type: ADD_NEW_CUSTOMER,
    payload: customer,
  });

  export const addNewCleaner1 = cleaner => ({
    type: ADD_NEW_CLEANER,
    payload: cleaner,
  });
  
  export const addNewCluster1 = cluster => ({
    type: ADD_NEW_CLUSTER,
    payload: cluster,
  });
  
  export const addNewPlant1 = plant => ({
    type: ADD_NEW_PLANT,
    payload: plant,
  });
  

  export const addNewRaiseIndent1 = raiseIndent => ({
    type: ADD_NEW_RAISE_INDENT,
    payload: raiseIndent,
  });
  
  export const addNewTransporter1 = transporter => ({
    type: ADD_NEW_TRANSPORTER,
    payload: transporter,
  });

  export const addNewVehicle1 = vehicle => ({
    type: ADD_NEW_VEHICLE,
    payload: vehicle,
  });

  export const addNewQuota1 = quota => ({
    type: ADD_NEW_QUOTA,
    payload: quota,
  });
  
  export const addNewDriver1 = driver => ({
    type: ADD_NEW_DRIVER,
    payload: driver,
  });
  
  export const addQuotaSuccess1 = quota => ({
    type: ADD_QUOTA_SUCCESS,
    payload: quota,
  });
  
  export const addQuotaFail1 = error => ({
    type: ADD_QUOTA_FAIL,
    payload: error,
  });


  export const addTransporterSuccess1 = transporter => ({
    type: ADD_TRANSPORTER_SUCCESS,
    payload: transporter,
  });
  
  export const addTransporterFail1 = error => ({
    type: ADD_TRANSPORTER_FAIL,
    payload: error,
  });

  export const addVehicleSuccess1 = vehicle => ({
    type: ADD_VEHICLE_SUCCESS,
    payload: vehicle,
  });
  
  export const addVehicleFail1 = error => ({
    type: ADD_VEHICLE_FAIL,
    payload: error,
  });

  export const addCleanerSuccess1 = cleaner => ({
    type: ADD_CLEANER_SUCCESS,
    payload: cleaner,
  });
  
  export const addCleanerFail1 = error => ({
    type: ADD_CLEANER_FAIL,
    payload: error,
  });

  export const addDriverSuccess1 = driver => ({
    type: ADD_DRIVER_SUCCESS,
    payload: driver,
  });
  
  export const addDriverFail1 = error => ({
    type: ADD_DRIVER_FAIL,
    payload: error,
  });
  
  
  export const addCustomerSuccess1 = customer => ({
    type: ADD_CUSTOMER_SUCCESS,
    payload: customer,
  });
  
  export const addCustomerFail1 = error => ({
    type: ADD_CUSTOMER_FAIL,
    payload: error,
  });

  export const addClusterSuccess1 = cluster => ({
    type: ADD_CLUSTER_SUCCESS,
    payload: cluster,
  });
  
  export const addClusterFail1 = error => ({
    type: ADD_CLUSTER_FAIL,
    payload: error,
  });

  export const addPlantSuccess1 = plant => ({
    type: ADD_PLANT_SUCCESS,
    payload: plant,
  });
  
  export const addPlantFail1 = error => ({
    type: ADD_PLANT_FAIL,
    payload: error,
  });

  
export const addRaiseIndentSuccess1 = raiseIndent => ({
  type: ADD_RAISE_INDENT_SUCCESS,
  payload: raiseIndent,
});

export const addRaiseIndentFail1 = error => ({
  type: ADD_RAISE_INDENT_FAIL,
  payload: error,
});
  
  export const deleteCustomer1 = customer => ({
    type: DELETE_CUSTOMER,
    payload: customer,
  });
  
  export const deleteCustomerSuccess1 = customer => ({
    type: DELETE_CUSTOMER_SUCCESS,
    payload: customer,
  });
  
  export const deleteCustomerFail1 = error => ({
    type: DELETE_CUSTOMER_FAIL,
    payload: error,
  });