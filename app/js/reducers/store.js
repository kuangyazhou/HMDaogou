// 门店销售数据
import {
  SALES_DETAIL_REQUEST,
  SALES_DETAIL_SUCCESS,
  SALES_DETAIL_FAILURE,
  SALE_RANK_REQUEST,
  SALE_RANK_SUCCESS,
  SALE_RANK_FAILURE,
  SINGLE_SALE_RANK_REQUEST,
  SINGLE_SALE_RANK_SUCCESS,
  SINGLE_SALE_RANK_FAILURE,
  STAFF_PROGRESS_RANK_REQUEST,
  STAFF_PROGRESS_RANK_SUCCESS,
  STAFF_PROGRESS_RANK_FAILURE,
  MONTH_SINGLE_SALE_RANK_REQUEST,
  MONTH_SINGLE_SALE_RANK_SUCCESS,
  MONTH_SINGLE_SALE_RANK_FAILURE,
  WEEK_AVERGE_REQUEST,
  WEEK_AVERGE_SUCCESS,
  WEEK_AVERGE_FAILURE,
  ORDER_CAT_REQUEST,
  ORDER_CAT_SUCCESS,
  ORDER_CAT_FAILURE,
  ORDER_CAT_TREND_REQUEST,
  ORDER_CAT_TREND_SUCCESS,
  ORDER_CAT_TREND_FAILURE,
} from '../actions/store/sales.js';

import {
  LOGIN_COUNT_REQUEST,
  LOGIN_COUNT_SUCCESS,
  LOGIN_COUNT_FAILURE,
} from '../actions/store/loginCount.js';

import {
  SALE_SEARCH_REQUEST,
  SALE_SEARCH_SUCCESS,
  SALE_SEARCH_FAILURE,
  SALE_SEARCH_RESET,
} from '../actions/store/saleSearch.js';

import {
  TOTAL_TARGET_REQUEST,
  TOTAL_TARGET_SUCCESS,
  TOTAL_TARGET_FAILURE,
  MONTH_TOTAL_TARGET_REQUEST,
  MONTH_TOTAL_TARGET_SUCCESS,
  MONTH_TOTAL_TARGET_FAILURE,
  TOTAL_TARGET_DETAIL_REQUEST,
  TOTAL_TARGET_DETAIL_SUCCESS,
  TOTAL_TARGET_DETAIL_FAILURE,
  MONTH_TOTAL_TARGET_DETAIL_REQUEST,
  MONTH_TOTAL_TARGET_DETAIL_SUCCESS,
  MONTH_TOTAL_TARGET_DETAIL_FAILURE,
  TODAY_SALE_TIME_REQUEST,
  TODAY_SALE_TIME_SUCCESS,
  TODAY_SALE_TIME_FAILURE,
} from '../actions/store/totalTarget.js';

import {
  MAIN_BRAND_REQUEST,
  MAIN_BRAND_SUCCESS,
  MAIN_BRAND_FAILURE,
} from '../actions/store/mainBrand.js';

import {
  MONTH_STAFF_TASK_REQUEST,
  MONTH_STAFF_TASK_SUCCESS,
  MONTH_STAFF_TASK_FAILURE,
  STAFF_SALE_CHANGCE_REQUEST,
  STAFF_SALE_CHANGCE_SUCCESS,
  STAFF_SALE_CHANGCE_FAILURE,
  STAFF_SALE_CHANGCE_DETAIL_REQUEST,
  STAFF_SALE_CHANGCE_DETAIL_SUCCESS,
  STAFF_SALE_CHANGCE_DETAIL_FAILURE,
  STAFF_SALE_CHANGCE_DETAIL_RESET,
  STAFF_NEW_CUSTOMER_REQUEST,
  STAFF_NEW_CUSTOMER_SUCCESS,
  STAFF_NEW_CUSTOMER_FAILURE,
  STAFF_MONTH_NEW_CUSTOMER_REQUEST,
  STAFF_MONTH_NEW_CUSTOMER_SUCCESS,
  STAFF_MONTH_NEW_CUSTOMER_FAILURE,
  MONTH_SALE_CHANGCE_STORE_REQUEST,
  MONTH_SALE_CHANGCE_STORE_SUCCESS,
  MONTH_SALE_CHANGCE_STORE_FAILURE,
  MONTH_SALE_CHANGCE_GUIDER_REQUEST,
  MONTH_SALE_CHANGCE_GUIDER_SUCCESS,
  MONTH_SALE_CHANGCE_GUIDER_FAILURE,
  MONTH_SALE_CHANGCE_GUIDER_RESET,
  STAFF_MONTH_CONTACT_REQUEST,
  STAFF_MONTH_CONTACT_SUCCESS,
  STAFF_MONTH_CONTACT_FAILURE,
} from '../actions/store/staffTask.js';

const deepAssign = require('deep-assign');

const initialState = {
  average: [
    {
      time: '',
      amount: '',
    },
  ],
  isAverageGet: false,
  isOrderCatGet: false,
  saleChangce: [{
    contentValue: '',
    doneValue: '',
    ruleName: '',
    type: '',
  }],
  orderCat: [
    {
      amounts: [],
      counts: [],
      names: [],
      indexLevels: [],
      values: [],
    },
  ],
  stores: {
    monthOfflineOrderSale: {},
    userSales: [],
    count: '',
    todayAmount: '',
    todayTargetAmount: '',
    loginCount: '',
    isLoginCountGet: false,
    login: [],
    noLogin: [],
    isRankListFetching: false,
    complete: '',
    totalComplete: '',
    todayPercent: '',
    isTodayTargetGet: false,
    monthComplete: '',
    todayCountMember: '',
    todayCountOrder: '',
    todayTotalAmount: '',
    yesterdayTotalAmount: '',
    completeCount: '',
    isTodayTaskGet: false,
    totNum: '',
    totalCount: '',
    todayMemberAmount: '',
    yesterdayCountMember: '',
    yesterdayCountOrder: '',
    isSaleDetailGet: false,
    yesterdayMemberAmount: '',
    mainBrandList: [],
    monthTotalComplete: '',
    monthCompletePercent: '',
    lastMonthComplete: '',
    lastMonthTotalComplete: '',
    lastMonthpercent: '',
    isMonthAllTargetGet: false,
    monthPercent: '',
    percent: '',
    todaySaleDetail: [],
    yesterdaySaleDetail: [],
    weekSaleDetail: [],
    monthSaleDetail: [],
    threeMonthSaleDetail: [],
    monthTask: {
      complete: [
        {
          completeCount: '',
          name: '',
        },
      ],
      noComplete: [
        {
          completeCount: '',
          name: '',
        },
      ],
    },
    brandList: [
      {
        amount: '',
        name: '',
      },
    ],
    today: [
      {
        value: '',
        name: '',
        count: '',
        amount: '',
      },
    ],
    isTodaySingleBrandGet: false,
    isFetching: false,
    isMonthTargetFetching: false,
    isProgressRankFetching: false,
    yesterday: [
      {
        value: '',
        name: '',
        count: '',
        amount: '',
      },
    ],
    thisMonth: [
      {
        time: '',
        amount: '',
      },
    ],
    isMonthSaleTimeAverageGet: false,
    lastMonth: [
      {
        time: '',
        amount: '',
      },
    ],
    finished: [
      {
        name: '',
        completeTime: '',
        completeCount: '',
      },
    ],
    currentMonth: [
      {
        value: '',
        name: '',
        count: '',
        amount: '',
      },
    ],
    isMonthSingleBrandGet: false,
    previousMonth: [
      {
        value: '',
        name: '',
        count: '',
        amount: '',
      },
    ],
    searchList: {
      amount: '',
      goodCount: '',
    },
    isBrandFetching: false,
  },
  tasks: {
    isStaffCompleteListGet: false,
    staffCompleteList: [],
    totalCompleteCount: '',
    totalPercent: '',
    totalCount: '',
  },
};

// 初始化用户登陆验证上下文的状态.
function initializeState() {
  return Object.assign({}, initialState);
}

export default function Stores(state = initializeState(), action = {}) {
  switch (action.type) {
    case 'ORDER_CAT_REQUEST': {
      return Object.assign({}, state);
    }
    case 'ORDER_CAT_SUCCESS': {
      return deepAssign({}, state, {
        isOrderCatGet: action.isOrderCatGet,
        orderCat: action.orderCat,
      });
    }
    case 'ORDER_CAT_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    // ---------------------------------------
    case 'ORDER_CAT_TREND_REQUEST': {
      return Object.assign({}, state);
    }
    case 'ORDER_CAT_TREND_SUCCESS': {
      return deepAssign({}, state, {
        isOrderCatTrendGet: action.isOrderCatTrendGet,
        orderCatTrend: action.orderCatTrend,
      });
    }
    case 'ORDER_CAT_TREND_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    // ---------------------------------------
    case 'WEEK_AVERGE_REQUEST': {
      return Object.assign({}, state);
    }
    case 'WEEK_AVERGE_SUCCESS': {
      return deepAssign({}, state, {
        isAverageGet: action.isAverageGet,
        average: action.average,
      });
    }
    case 'WEEK_AVERGE_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    // ---------------------------------------
    case 'STAFF_SALE_CHANGCE_REQUEST ': {
      return Object.assign({}, state, {
        isSaleChangceGet: action.isSaleChangceGet,
      });
    }
    case 'STAFF_SALE_CHANGCE_SUCCESS': {
      return deepAssign({}, state, {
        isSaleChangceGet: action.isSaleChangceGet,
        saleChangce: action.saleChangce,
      });
    }
    case 'STAFF_SALE_CHANGCE_FAILURE': {
      return {
        ...state,
        isStaffMonthContactGet: action.isStaffMonthContactGet,
        error: action.error,
      };
    }
    // ---------------------------------------
    case 'STAFF_MONTH_CONTACT_REQUEST ': {
      return Object.assign({}, state, {
        isStaffMonthContactGet: action.isStaffMonthContactGet,
      });
    }
    case 'STAFF_MONTH_CONTACT_SUCCESS': {
      return deepAssign({}, state, {
        isStaffMonthContactGet: action.isStaffMonthContactGet,
        staffMonthContact: action.staffMonthContact,
        staffMonthContactTotal: action.staffMonthContactTotal,
      });
    }
    case 'STAFF_MONTH_CONTACT_FAILURE': {
      return {
        ...state,
        isSaleChangceGet: action.isSaleChangceGet,
        error: action.error,
      };
    }
    // ---------------------------------------
    case 'MONTH_SALE_CHANGCE_STORE_REQUEST ': {
      return Object.assign({}, state, {
        ismonthSaleChangceStoreGet: action.ismonthSaleChangceStoreGet,
      });
    }
    case 'MONTH_SALE_CHANGCE_STORE_SUCCESS': {
      return deepAssign({}, state, {
        ismonthSaleChangceStoreGet: action.ismonthSaleChangceStoreGet,
        monthSaleChangce: action.monthSaleChangce,
      });
    }
    case 'MONTH_SALE_CHANGCE_STORE_FAILURE': {
      return {
        ...state,
        ismonthSaleChangceStoreGet: action.ismonthSaleChangceStoreGet,
        error: action.error,
      };
    }
    // ---------------------------------------
    case 'MONTH_SALE_CHANGCE_GUIDER_REQUEST ': {
      return Object.assign({}, state, {
        ismonthSaleChangceGuiderGet: action.ismonthSaleChangceGuiderGet,
      });
    }
    case 'MONTH_SALE_CHANGCE_GUIDER_SUCCESS': {
      return deepAssign({}, state, {
        ismonthSaleChangceGuiderGet: action.ismonthSaleChangceGuiderGet,
        monthSaleChangceDetail: action.monthSaleChangceDetail,
      });
    }
    case 'MONTH_SALE_CHANGCE_GUIDER_FAILURE': {
      return {
        ...state,
        ismonthSaleChangceGuiderGet: action.ismonthSaleChangceGuiderGet,
        error: action.error,
      };
    }
    case 'MONTH_SALE_CHANGCE_GUIDER_RESET': {
      return {
        ...state,
        ismonthSaleChangceGuiderGet: action.ismonthSaleChangceGuiderGet,
        monthSaleChangceDetail: action.monthSaleChangceDetail,
        error: action.error,
      };
    }
    // ---------------------------------------
    case 'STAFF_SALE_CHANGCE_DETAIL_REQUEST ': {
      return Object.assign({}, state, {
        isSaleChangceDetailGet: action.isSaleChangceDetailGet,
      });
    }
    case 'STAFF_SALE_CHANGCE_DETAIL_RESET': {
      return Object.assign({}, state, {
        saleChangceDetail: action.saleChangceDetail,
        isSaleChangceDetailGet: action.isSaleChangceDetailGet,
      }
      );
    }
    case 'STAFF_SALE_CHANGCE_DETAIL_SUCCESS': {
      return deepAssign({}, state, {
        saleChangceDetail: action.saleChangceDetail,
        isSaleChangceDetailGet: action.isSaleChangceDetailGet,
      });
    }
    case 'STAFF_SALE_CHANGCE_DETAIL_FAILURE': {
      return {
        ...state,
        error: action.error,
        isSaleChangceDetailGet: action.isSaleChangceDetailGet,
      };
    }
    // ------------------------------------
    case 'LOGIN_COUNT_REQUEST': {
      return Object.assign({}, state);
    }
    case 'LOGIN_COUNT_SUCCESS': {
      return deepAssign({}, state, {
        stores: {
          isLoginCountGet: action.isLoginCountGet,
          count: action.count,
          loginCount: action.loginCount,
          login: action.login,
          noLogin: action.noLogin,
        },
      });
    }
    case 'LOGIN_COUNT_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'SALE_RANK_REQUEST': {
      return Object.assign({}, state);
    }
    case 'SALE_RANK_SUCCESS': {
      return deepAssign({}, state, {
        stores: {
          pager: action.pager,
          rankList: action.rankList,
          isRankListFetching: action.isRankListFetching,
        },
      });
    }
    case 'SALE_RANK_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'TOTAL_TARGET_REQUEST': {
      return Object.assign({}, state);
    }
    case 'TOTAL_TARGET_SUCCESS': {
      return deepAssign({}, state, {
        stores: {
          isTodayTargetGet: action.isTodayTargetGet,
          todayAmount: action.todayAmount,
          todayTargetAmount: action.todayTargetAmount,
          todayPercent: action.todayPercent,
        },
      });
    }
    case 'TOTAL_TARGET_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'TODAY_SALE_TIME_REQUEST': {
      return Object.assign({}, state);
    }
    case 'TODAY_SALE_TIME_SUCCESS': {
      return deepAssign({}, state, {
        stores: {
          saleTime: action.saleTime,
          todaySaleDetail: action.todaySaleDetail,
          yesterdaySaleDetail: action.yesterdaySaleDetail,
          weekSaleDetail: action.weekSaleDetail,
          monthSaleDetail: action.monthSaleDetail,
          threeMonthSaleDetail: action.threeMonthSaleDetail,
          isFetching: action.isFetching,
        },
      });
    }
    case 'TODAY_SALE_TIME_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'MAIN_BRAND_REQUEST': {
      return Object.assign({}, state, {
        isMainBrandListGet: action.isMainBrandListGet,
      });
    }
    case 'MAIN_BRAND_SUCCESS': {
      return deepAssign({}, state, {
        stores: {
          isMainBrandListGet: action.isMainBrandListGet,
          mainBrandList: action.mainBrandList,
        },
      });
    }
    case 'MAIN_BRAND_FAILURE': {
      return {
        ...state,
        isMainBrandListGet: action.isMainBrandListGet,
        error: action.error,
      };
    }
    case 'MONTH_TOTAL_TARGET_REQUEST': {
      return Object.assign({}, state);
    }
    case 'MONTH_TOTAL_TARGET_SUCCESS': {
      return deepAssign({}, state, {
        stores: {
          isMonthAllTargetGet: action.isMonthAllTargetGet,
          monthComplete: action.monthComplete,
          monthTotalComplete: action.monthTotalComplete,
          monthCompletePercent: action.monthCompletePercent,
          lastMonthComplete: action.lastMonthComplete,
          lastMonthTotalComplete: action.lastMonthTotalComplete,
          lastMonthpercent: action.lastMonthpercent,
        },
      });
    }
    case 'MONTH_TOTAL_TARGET_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'TOTAL_TARGET_DETAIL_REQUEST': {
      return Object.assign({}, state);
    }
    case 'TOTAL_TARGET_DETAIL_SUCCESS': {
      return deepAssign({}, state, {
        stores: {
          isMonthTargetFetching: action.isMonthTargetFetching,
          thisMonthDetail: action.thisMonthDetail,
          lastMonthDetail: action.lastMonthDetail,
        },
      });
    }
    case 'TOTAL_TARGET_DETAIL_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'MONTH_TOTAL_TARGET_DETAIL_REQUEST': {
      return Object.assign({}, state);
    }
    case 'MONTH_TOTAL_TARGET_DETAIL_SUCCESS': {
      return deepAssign({}, state, {
        stores: {
          isMonthSaleTimeAverageGet: action.isMonthSaleTimeAverageGet,
          thisMonth: action.thisMonth,
          lastMonth: action.lastMonth,
          time: action.time,
        },
      });
    }
    case 'MONTH_TOTAL_TARGET_DETAIL_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'SALES_DETAIL_REQUEST': {
      return Object.assign({}, state);
    }
    case 'SALES_DETAIL_SUCCESS': {
      return deepAssign({}, state, {
        stores: {
          isSaleDetailGet: action.isSaleDetailGet,
          todayCountMember: action.todayCountMember,
          todayCountOrder: action.todayCountOrder,
          todayMemberAmount: action.todayMemberAmount,
          todayTotalAmount: action.todayTotalAmount,
          yesterdayTotalAmount: action.yesterdayTotalAmount,
          yesterdayCountMember: action.yesterdayCountMember,
          yesterdayCountOrder: action.yesterdayCountOrder,
          yesterdayMemberAmount: action.yesterdayMemberAmount,
        },
      });
    }
    case 'SALES_DETAIL_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'SINGLE_SALE_RANK_REQUEST': {
      return Object.assign({}, state);
    }
    case 'SINGLE_SALE_RANK_SUCCESS': {
      return deepAssign({}, state, {
        stores: {
          isTodaySingleBrandGet: action.isTodaySingleBrandGet,
          today: action.today,
          yesterday: action.yesterday,
        },
      });
    }
    case 'SINGLE_SALE_RANK_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'STAFF_PROGRESS_RANK_REQUEST': {
      return Object.assign({}, state);
    }
    case 'STAFF_PROGRESS_RANK_SUCCESS': {
      return deepAssign({}, state, {
        stores: {
          progressRank: action.progressRank,
          isProgressRankFetching: action.isProgressRankFetching,
        },
      });
    }
    case 'STAFF_PROGRESS_RANK_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'MONTH_SINGLE_SALE_RANK_REQUEST': {
      return Object.assign({}, state);
    }
    case 'MONTH_SINGLE_SALE_RANK_SUCCESS': {
      return deepAssign({}, state, {
        stores: {
          isMonthSingleBrandGet: action.isMonthSingleBrandGet,
          currentMonth: action.currentMonth,
          previousMonth: action.previousMonth,
        },
      });
    }
    case 'MONTH_SINGLE_SALE_RANK_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'SALE_SEARCH_REQUEST': {
      return Object.assign({}, state);
    }
    case 'SALE_SEARCH_SUCCESS': {
      return Object.assign({}, state, {
        stores: {
          isBrandFetching: action.isBrandFetching,
          searchList: action.searchList,
        },
      });
    }
    case 'SALE_SEARCH_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'SALE_SEARCH_RESET':
      return deepAssign({}, state, {
        stores: {
          isBrandFetching: action.isBrandFetching,
          searchList: action.searchList,
        },
      });
    case 'MONTH_STAFF_TASK_REQUEST': {
      return Object.assign({}, state);
    }
    case 'MONTH_STAFF_TASK_SUCCESS': {
      return deepAssign({}, state, {
        tasks: {
          isStaffCompleteListGet: action.isStaffCompleteListGet,
          staffCompleteList: action.staffCompleteList,
          totalCount: action.totalCount,
          totalCompleteCount: action.totalCompleteCount,
          totalPercent: action.totalPercent,
        },
      });
    }
    case 'MONTH_STAFF_TASK_FAILURE': {
      return {
        ...state,
        error: action.error,
      };
    }
    //----------------------------------------
    case 'STAFF_NEW_CUSTOMER_REQUEST': {
      return Object.assign({}, state, {
        isStaffNewCustomerGet: action.isStaffNewCustomerGet,
      });
    }
    case 'STAFF_NEW_CUSTOMER_SUCCESS': {
      return Object.assign({}, state, {
        isStaffNewCustomerGet: action.isStaffNewCustomerGet,
        newCustomerCount: action.newCustomerCount,
        newCustomerList: action.newCustomerList,
      });
    }
    case 'STAFF_NEW_CUSTOMER_FAILURE': {
      return {
        ...state,
        isStaffNewCustomerGet: action.isStaffNewCustomerGet,
        error: action.error,
      };
    }
    //----------------------------------------
    case 'STAFF_MONTH_NEW_CUSTOMER_REQUEST': {
      return Object.assign({}, state, {
        isStaffMonthNewCustomerGet: action.isStaffMonthNewCustomerGet,
      });
    }
    case 'STAFF_MONTH_NEW_CUSTOMER_SUCCESS': {
      return Object.assign({}, state, {
        isStaffMonthNewCustomerGet: action.isStaffMonthNewCustomerGet,
        hadDevelopedCustomer: action.hadDevelopedCustomer,
        developTarget: action.developTarget,
        developCustomerList: action.developCustomerList,
      });
    }
    case 'STAFF_MONTH_NEW_CUSTOMER_FAILURE': {
      return {
        ...state,
        isStaffMonthNewCustomerGet: action.isStaffMonthNewCustomerGet,
        error: action.error,
      };
    }
    // ---------------------------------------
    default:
      return state;
  }
}
