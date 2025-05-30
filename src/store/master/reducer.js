import {
    //GET_PRODUCTS,
    //GET_ORDERS,
    //GET_SELLERS,
    GET_CUSTOMERS,
    GET_TRANSPORTERS,
    GET_MATERIAL,
    GET_USERS,
    GET_CLUSTER,
    GET_PROCESS,
    GET_VEHICLE,
    GET_CLEANER,
    GET_DRIVER,
    GET_ROLES,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,
  
    //ADD_ORDER_SUCCESS,
    //ADD_ORDER_FAIL,
    //DELETE_ORDER_SUCCESS,
    //DELETE_ORDER_FAIL,
    //UPDATE_ORDER_SUCCESS,
    //UPDATE_ORDER_FAIL,
  
    ADD_RAISE_INDENT_SUCCESS,
    ADD_RAISE_INDENT_FAIL,
    ADD_CUSTOMER_SUCCESS,
    ADD_CUSTOMER_FAIL,
    ADD_CLEANER_SUCCESS,
    ADD_CLEANER_FAIL,
    ADD_PLANT_SUCCESS,
    ADD_PLANT_FAIL,
    ADD_VEHICLE_SUCCESS,
    ADD_VEHICLE_FAIL,
    ADD_TRANSPORTER_SUCCESS,
    ADD_TRANSPORTER_FAIL,
    ADD_QUOTA_SUCCESS,
    ADD_QUOTA_FAIL,
    ADD_DRIVER_SUCCESS,
    ADD_DRIVER_FAIL,
    ADD_CLUSTER_SUCCESS,
    ADD_CLUSTER_FAIL,
    UPDATE_CUSTOMER_SUCCESS,
    UPDATE_CUSTOMER_FAIL,
    UPDATE_PLANT_SUCCESS,
    UPDATE_PLANT_FAIL,
    DELETE_CUSTOMER_SUCCESS,
    DELETE_CUSTOMER_FAIL,
    UPDATE_VEHICLE_SUCCESS,
    UPDATE_VEHICLE_FAIL,
    UPDATE_CLUSTER_SUCCESS,
    UPDATE_CLUSTER_FAIL,
    DELETE_VEHICLE_SUCCESS,
    DELETE_VEHICLE_FAIL,
    GET_QUOTA,
    GET_PLANT,
  
    //DELETE_PRODUCT,
    //DELETE_PRODUCT_SUCCESS,
    //DELETE_PRODUCT_FAIL,
  
    //ADD_PRODUCT_SUCCESS,
    //ADD_PRODUCT_FAIL,
  
    //UPDATE_PRODUCT_SUCCESS,
    //UPDATE_PRODUCT_FAIL
  } from "./actionType";
  
  const INIT_STATE = {
    products: [],
    orders: [],
    sellers: [],
    customers: [],
    quotas: [],
    transporters: [],
    roles: [],
    drivers: [],
    raiseIndents:[],
    users: [],
    vehicles: [],
    cleaners: [],
    materials: [],
    processings: [],
    clusters: [],
    plants: [],
    error: {},
  };
  
  const Master = (state = INIT_STATE, action) => {
   //console.log("id",action.payload.id);
   console.log("payload",action.payload);
    switch (action.type) {
      case API_RESPONSE_SUCCESS:
        switch (action.payload.actionType) {
          /*case GET_PRODUCTS:
            return {
              ...state,
              products: action.payload.data,
            };
  */
          /*case DELETE_PRODUCT:
            return {
              ...state,
              products: state.products.filter(
                product => (product.id + '') !== (action.payload.data + '')
              ),
            };
  
          case GET_ORDERS:
            return {
              ...state,
              orders: action.payload.data,
              isOrderCreated: false,
              isOrderSuccess: true
            };
          case GET_SELLERS:
            return {
              ...state,
              sellers: action.payload.data,
            };*/
            case GET_CLUSTER:
              return {
                ...state,
                clusters: action.payload.data,
                isClusterCreated: false,
                isClusterSuccess: true
              };
            
              case GET_PLANT:
                return {
                  ...state,
                  plants: action.payload.data,
                  isPlantCreated: false,
                  isPlantSuccess: true
                };
            case GET_CUSTOMERS:
              return {
                ...state,
                customers: action.payload.data,
                isCustomerCreated: false,
                isCustomerSuccess: true
              };
              case GET_PROCESS:
                return {
                  ...state,
                  processings: action.payload.data,
                  isProcessingsCreated: false,
                  isProcessingsSuccess: true
                };
                  case GET_QUOTA:
              return {
                ...state,
                quotas: action.payload.data,
                isquotasCreated: false,
                isquotasSuccess: true
              };
            case GET_TRANSPORTERS:
              return {
                ...state,
                transporters: action.payload.data,
                isTransportersCreated: false,
                isTransportersSuccess: true
              };
              case GET_ROLES:
                return {
                  ...state,
                  roles: action.payload.data,
                  isRolesCreated: false,
                  isRolesSuccess: true
                };
                case GET_USERS:
                  console.log(action.payload);
                  return {
                    ...state,
                    users: action.payload.data,
                    isUsersCreated: false,
                    isUsersSuccess: true
                  };
                  
                  case GET_MATERIAL:
                    return {
                      ...state,
                      materials: action.payload.data,
                      isMaterialsCreated: false,
                      isMaterialsSuccess: true
                    };
                    case GET_VEHICLE:
                      return {
                        ...state,
                        vehicles: action.payload.data,
                        isVehiclesCreated: false,
                        isVehiclesSuccess: true
                      };
                      case GET_CLEANER:
                        return {
                          ...state,
                          cleaners: action.payload.data,
                          isCleanerCreated: false,
                          isCleanerSuccess: true
                        };
                      case GET_DRIVER:
                        return {
                          ...state,
                          drivers: action.payload.data,
                          isDriversCreated: false,
                          isDriversSuccess: true
                        };
  
          default:
            return { ...state };
        }
      case API_RESPONSE_ERROR:
        switch (action.payload.actionType) {
          /*case GET_PRODUCTS:
            return {
              ...state,
              error: action.payload.error,
            };*/
  /*
          case DELETE_PRODUCT:
            return {
              ...state,
              error: action.payload.error,
            };
          case GET_ORDERS:
            return {
              ...state,
              error: action.payload.error,
              isOrderCreated: false,
              isOrderSuccess: false
            };
          case GET_SELLERS:
            return {
              ...state,
              error: action.payload.error,
            };*/
          case GET_CUSTOMERS:
            return {
              ...state,
              error: action.payload.error,
              isCustomerCreated: false,
              isCustomerSuccess: false
            };
            case GET_PROCESS:
              return {
                ...state,
                error: action.payload.error,
                isProcessingsCreated: false,
                isProcessingsSuccess: false
              };
            case GET_QUOTA:
              return {
                ...state,
                error: action.payload.error,
                isquotasCreated: false,
                isquotasSuccess: false
              };
            case GET_TRANSPORTERS:
              return {
                ...state,
                error: action.payload.error,
                isTransportersCreated: false,
                isTransportersSuccess: false
              };
              case GET_ROLES:
              return {
                ...state,
                error: action.payload.error,
                isRolesCreated: false,
                isRolesSuccess: false
              };
              case GET_MATERIAL:
              return {
                ...state,
                error: action.payload.error,
                isMaterialsCreated: false,
                isMaterialsSuccess: false
              };
              case GET_USERS:
              return {
                ...state,
                error: action.payload.error,
                isUsersCreated: false,
                isUsersSuccess: false
              };
              case GET_CLEANER:
              return {
                ...state,
                error: action.payload.error,
                isCleanerCreated: false,
                isCleanerSuccess: false
              };
              case GET_VEHICLE:
              return {
                ...state,
                error: action.payload.error,
                isVehiclesCreated: false,
                isVehiclesSuccess: false
              };
              case GET_DRIVER:
              return {
                ...state,
                error: action.payload.error,
                isDriversCreated: false,
                isDriversSuccess: false
              };
              
              case GET_PLANT:
              return {
                ...state,
                error: action.payload.error,
                isPlantCreated: false,
                isPlantSuccess: false
              };
              case GET_CLUSTER:
              return {
                ...state,
                error: action.payload.error,
                isClusterCreated: false,
                isClusterSuccess: false
              };
          default:
            return { ...state };
        }
  
     /* case GET_PRODUCTS:
        return {
          ...state,
        };
 
      case GET_ORDERS: {
        return {
          ...state,
          isOrderCreated: false,
        };
      }
      case GET_SELLERS: {
        return {
          ...state,
        };
      }
      
  */
      case GET_CUSTOMERS:
        return {
          ...state,
          isCustomerCreated: false
        };
        case GET_CLUSTER:
        return {
          ...state,
          isClusterCreated: false
        };
        case GET_PLANT:
        return {
          ...state,
          isPlantCreated: false
        };
        case GET_PROCESS:
        return {
          ...state,
          isProcessingsCreated: false
        };
        case GET_QUOTA:
        return {
          ...state,
          isquotasCreated: false
        };
        case GET_TRANSPORTERS:
          return {
            ...state,
            isTransportersCreated: false
          };
          case GET_ROLES:
            return {
              ...state,
              isRolesCreated: false
            };
          case GET_DRIVER:
            return {
              ...state,
              isDriversCreated: false
            };
            case GET_VEHICLE:
              return {
                ...state,
                isVehiclesCreated: false
              };
              
            case GET_CLEANER:
              return {
                ...state,
                isCleanerCreated: false
              };
              case GET_MATERIAL:
                return {
                  ...state,
                  isMaterialsCreated: false
                };
                case GET_USERS:
                  return {
                    ...state,
                    isUsersCreated: false
                  };
                              
  /*
      case DELETE_PRODUCT:
        return {
          ...state,
        };
  
      case ADD_PRODUCT_SUCCESS:
        return {
          ...state,
          products: [...state.products, action.payload.data],
  
        };
  
      case ADD_PRODUCT_FAIL:
        return {
          ...state,
          error: action.payload,
  
        };
  
      case UPDATE_PRODUCT_SUCCESS:
        return {
          ...state,
          products: state.products.map(product =>
            product._id.toString() === action.payload.data._id.toString()
              ? { ...product, ...action.payload.data }
              : product
          ),
        };*/
  /*
      case UPDATE_PRODUCT_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case ADD_ORDER_SUCCESS:
        return {
          ...state,
          isOrderCreated: true,
          orders: [...state.orders, action.payload.data],
        };
  
      case ADD_ORDER_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case DELETE_ORDER_SUCCESS:
        return {
          ...state,
          orders: state.orders.filter(
            order => order._id.toString() !== action.payload.order.toString()
          ),
        };
  
      case DELETE_ORDER_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case UPDATE_ORDER_SUCCESS:
        return {
          ...state,
          orders: state.orders.map(order =>
            order._id.toString() === action.payload.data._id.toString()
              ? { ...order, ...action.payload.data }
              : order
          ),
        };
  
      case UPDATE_ORDER_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  */
      case ADD_CLEANER_SUCCESS:
        return {
          ...state,
          isCleanerCreated: true,
          cleaners: [...state.cleaners, action.payload.data],
  
        };
  
      case ADD_CLEANER_FAIL:
        return {
          ...state,
          error: action.payload,
  
        };

      case ADD_PLANT_SUCCESS:
          return {
            ...state,
            isPlantCreated: true,
            plants: [...state.plants, action.payload],
    
          };
    
      case ADD_PLANT_FAIL:
          return {
            ...state,
            error: action.payload,
    
          };
      
      case ADD_CUSTOMER_SUCCESS:
        console.log(action.payload.data.data);
        return {
          ...state,
          isCustomerCreated: true,
          users: [...state.users, action.payload.data.data],
  
        };
  
      case ADD_CUSTOMER_FAIL:
        return {
          ...state,
          error: action.payload,
  
        };
      
        case ADD_VEHICLE_SUCCESS:
          return {
            ...state,
            isVehicleCreated: true,
            vehicles: [...state.vehicles, action.payload.data],
    
          };
    
        case ADD_VEHICLE_FAIL:
          return {
            ...state,
            error: action.payload,
    
          };
    
        case ADD_RAISE_INDENT_SUCCESS:
          return {
            ...state,
            israiseIndentsCreated: true,
            raiseIndents: [...state.raiseIndents, action.payload.data],
    
          };
    
        case ADD_RAISE_INDENT_FAIL:
          return {
            ...state,
            error: action.payload,
    
          };

        case ADD_QUOTA_SUCCESS:
          return {
            ...state,
            isquotasCreated: true,
            quotas: [...state.quotas, action.payload.data],
    
          };
    
        case ADD_QUOTA_FAIL:
          return {
            ...state,
            error: action.payload,
    
          };

        case ADD_TRANSPORTER_SUCCESS:
          return {
            ...state,
            isTransportersCreated: true,
            transporters: [...state.transporters, action.payload.data],
    
          };
    
        case ADD_TRANSPORTER_FAIL:
          return {
            ...state,
            error: action.payload,
    
          };

        case ADD_DRIVER_SUCCESS:
          return {
            ...state,
            isDriversCreated: true,
            drivers: [...state.drivers, action.payload.data],
    
          };

        case ADD_DRIVER_FAIL:
          return {
            ...state,
            error: action.payload,
    
          };
          
        case ADD_CLUSTER_SUCCESS:
          return {
            ...state,
            isClustersCreated: true,
            clusters: [...state.clusters, action.payload],
    
          };

        case ADD_CLUSTER_FAIL:
          return {
            ...state,
            error: action.payload,
    
          };
  
      case UPDATE_CUSTOMER_SUCCESS:
       console.log(action.payload)
        return {
          ...state,
          users: state.users.map(customer =>
            customer.id.toString() === action.payload.id.toString()
              ? { ...customer, ...action.payload }
              : customer
          ),
        };
  
      case UPDATE_CUSTOMER_FAIL:
        return {
          ...state,
          error: action.payload,
        };

        case UPDATE_CLUSTER_SUCCESS:
          return {
            ...state,
            clusters: state.clusters.map(cluster =>
              cluster.id.toString() === action.payload.id.toString()
                ? { ...cluster, ...action.payload }
                : cluster
            ),
          };
    
        case UPDATE_CLUSTER_FAIL:
          return {
            ...state,
            error: action.payload,
          };
      
          case UPDATE_PLANT_SUCCESS:
            //console.log("plant",action.payload)
            return {
              ...state,
              plants: state.plants.map(plant =>
                plant.id.toString() === action.payload.id.toString()
                  ? { ...plant, ...action.payload }
                  : plant
              ),
            };
      
          case UPDATE_PLANT_FAIL:
            return {
              ...state,
              error: action.payload,
            };
            
        
      case UPDATE_VEHICLE_SUCCESS:
        return {
          ...state,
          vehicles: state.vehicles.map(vehicle =>
            vehicle._id.toString() === action.payload.data._id.toString()
              ? { ...vehicle, ...action.payload.data }
              : vehicle
          ),
        };
  
      case UPDATE_VEHICLE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      
        case DELETE_CUSTOMER_SUCCESS:
          console.log(action.payload)
          return {
            ...state,
            users: state.users.filter(
              customer => customer.id.toString() !== action.payload.customer.toString()
            ),
          };
    
        case DELETE_CUSTOMER_FAIL:
          return {
            ...state,
            error: action.payload,
          };
        case DELETE_VEHICLE_SUCCESS:
          return {
            ...state,
            vehicles: state.vehicles.filter(
              vehicle => vehicle._id.toString() !== action.payload.vehicle.toString()
            ),
          };
    
        case DELETE_VEHICLE_FAIL:
          return {
            ...state,
            error: action.payload,
          };
  /*
      case DELETE_PRODUCT_SUCCESS:
        return {
          ...state,
          products: state.products.filter(
            product => product._id.toString() !== action.payload.product.toString()
          ),
        };
  
      case DELETE_PRODUCT_FAIL:
        return {
          ...state,
          error: action.payload,
        };*/
  
      default:
        return { ...state };
    }
  };
  
  export default Master;