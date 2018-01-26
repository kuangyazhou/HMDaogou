
import {
  MONETARY_LEVEL_REQUEST,
  MONETARY_LEVEL_SUCCESS,
  MONETARY_LEVEL_FAILURE,
  PHYSIOLOGICAL_AXIS_REQUEST,
  PHYSIOLOGICAL_AXIS_SUCCESS,
  PHYSIOLOGICAL_AXIS_FAILURE,
  CONTACT_CUSTOMER_PERCENT_REQUEST,
  CONTACT_CUSTOMER_PERCENT_SUCCESS,
  CONTACT_CUSTOMER_PERCENT_FAILURE,
  CUSTOMER_CARE_COUNT_REQUEST,
  CUSTOMER_CARE_COUNT_SUCCESS,
  CUSTOMER_CARE_COUNT_FAILURE,
  ADDED_CUSTOMER_REQUEST,
  ADDED_CUSTOMER_SUCCESS,
  ADDED_CUSTOMER_FAILURE,
  CUSTOMER_CARE_DEAL_REQUEST,
  CUSTOMER_CARE_DEAL_SUCCESS,
  CUSTOMER_CARE_DEAL_FAILURE,
  DEALED_CUSTOMER_REQUEST,
  DEALED_CUSTOMER_SUCCESS,
  DEALED_CUSTOMER_FAILURE,
  STORE_DEAL_DETAIL_REQUEST,
  STORE_DEAL_DETAIL_SUCCESS,
  STORE_DEAL_DETAIL_FAILURE,
} from '../actions/store/client.js';

const deepAssign = require('deep-assign');

const initialState = {
  client: {
  },
};

// 初始化用户登陆验证上下文的状态.
function initializeState() {
  return Object.assign({}, initialState);
}

export default function client(state = initializeState(), action = {}) {
  switch (action.type) {
    // ---------------------------------------
    case 'STORE_DEAL_DETAIL_REQUEST': {
      return Object.assign({}, state);
    }
    case 'STORE_DEAL_DETAIL_SUCCESS': {
      return deepAssign({}, state, {
        isMonthDealDetailGet: action.isMonthDealDetailGet,
        addCount: action.addCount,
        dealCount: action.dealCount,
        averageAmount: action.averageAmount,
      });
    }
    case 'STORE_DEAL_DETAIL_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    // ---------------------------------------
    case 'MONETARY_LEVEL_REQUEST': {
      return Object.assign({}, state);
    }
    case 'MONETARY_LEVEL_SUCCESS': {
      return deepAssign({}, state, {
        isDealCustomerRank: action.isDealCustomerRank,
        allResult: action.allResult,
      });
    }
    case 'MONETARY_LEVEL_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'CUSTOMER_CARE_DEAL_REQUEST': {
      return Object.assign({}, state);
    }
    case 'CUSTOMER_CARE_DEAL_SUCCESS': {
      return deepAssign({}, state, {
        isDealListGet: action.isDealListGet,
        dealList: action.dealList,
      });
    }
    case 'CUSTOMER_CARE_DEAL_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'PHYSIOLOGICAL_AXIS_REQUEST': {
      return Object.assign({}, state);
    }
    case 'PHYSIOLOGICAL_AXIS_SUCCESS': {
      return deepAssign({}, state, {
        isPhysiologicalListGet: action.isPhysiologicalListGet,
        physiologicalList: action.physiologicalList,
      });
    }
    case 'PHYSIOLOGICAL_AXIS_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'CONTACT_CUSTOMER_PERCENT_REQUEST': {
      return Object.assign({}, state);
    }
    case 'CONTACT_CUSTOMER_PERCENT_SUCCESS': {
      return deepAssign({}, state, {
        isContactListGet: action.isContactListGet,
        contactList: action.contactList,
      });
    }
    case 'CONTACT_CUSTOMER_PERCENT_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'CUSTOMER_CARE_COUNT_REQUEST': {
      return Object.assign({}, state);
    }
    case 'CUSTOMER_CARE_COUNT_SUCCESS': {
      return deepAssign({}, state, {
        lossCustomer: action.lossCustomer,
        contactCustomer: action.contactCustomer,
        isContactCustomerGet: action.isContactCustomerGet,
      });
    }
    case 'CUSTOMER_CARE_COUNT_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'ADDED_CUSTOMER_REQUEST': {
      return Object.assign({}, state, {
        isMonthAddGet: action.isMonthAddGet,
      });
    }
    case 'ADDED_CUSTOMER_SUCCESS': {
      return deepAssign({}, state, {
        thisMonthAdd: action.thisMonthAdd,
        isMonthAddGet: action.isMonthAddGet,
        lastMonthAdd: action.lastMonthAdd,
      });
    }
    case 'ADDED_CUSTOMER_FAILURE': {
      return {
        ...state,
        isMonthAddGet: action.isMonthAddGet,
        error: action.error,
      };
    }
    case 'DEALED_CUSTOMER_REQUEST': {
      return Object.assign({}, state, {
        isMonthDealGet: action.isMonthDealGet,
      });
    }
    case 'DEALED_CUSTOMER_SUCCESS': {
      return deepAssign({}, state, {
        isMonthDealGet: action.isMonthDealGet,
        thisMonthDeal: action.thisMonthDeal,
        lastMonthDeal: action.lastMonthDeal,
      });
    }
    case 'DEALED_CUSTOMER_FAILURE': {
      return {
        ...state,
        isMonthDealGet: action.isMonthDealGet,
        error: action.error,
      };
    }

    // ---------------------------------------
    default:
      return state;
  }
}
