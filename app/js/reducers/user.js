// 已经完成任务
import {
  CURRENT_DAY_TASK_REQUEST,
  CURRENT_DAY_TASK_SUCCESS,
  CURRENT_DAY_TASK_FAILURE,
  CURRENT_DAY_TARGET_REQUEST,
  CURRENT_DAY_TARGET_SUCCESS,
  CURRENT_DAY_TARGET_FAILURE,
} from '../actions/users/currentDayTask';

// 未完成任务
import {
  UNDO_DAY_TASK_REQUEST,
  UNDO_DAY_TASK_SUCCESS,
  UNDO_DAY_TASK_FAILURE,
} from '../actions/users/undoDayTask';

// 门店通知
import {
  STORE_NOTE_REQUEST,
  STORE_NOTE_SUCCESS,
  STORE_NOTE_FAILURE,
  STORE_ALL_NOTE_REQUEST,
  STORE_ALL_NOTE_SUCCESS,
  STORE_ALL_NOTE_FAILURE,
} from '../actions/users/storeNote';

// 本月销售进度
import {
  MONTH_SALE_REQUEST,
  MONTH_SALE_SUCCESS,
  MONTH_SALE_FAILURE,
} from '../actions/users/monthSale';

// 本月会员成交率
import {
  MEMBER_SALE_REQUEST,
  MEMBER_SALE_FAILURE,
  MEMBER_SALE_SUCCESS,
} from '../actions/users/memberSale';

// 我的会员信息(客户管理)
import {
  MY_MEMBER_REQUEST,
  MY_MEMBER_SUCCESS,
  MY_MEMBER_FAILURE,
} from '../actions/members/myMembers';

// 今日实时动态, 昨日实时动态.
import {
  MY_TODAY_ACTIVITY_REQUEST,
  MY_TODAY_ACTIVITY_SUCCESS,
  MY_TODAY_ACTIVITY_FAILURE,
  MY_YESTODAY_ACTIVITY_REQUEST,
  MY_YESTODAY_ACTIVITY_SUCCESS,
  MY_YESTODAY_ACTIVITY_FAILURE,
  INDEX_ACTIVITY_REQUEST,
  INDEX_ACTIVITY_SUCCESS,
  INDEX_ACTIVITY_FAILURE,
  YEAR_ALL_ACTIVITY_REQUEST,
  YEAR_ALL_ACTIVITY_SUCCESS,
  YEAR_ALL_ACTIVITY_FAILURE,
} from '../actions/users/currentActivity';

// 绩效考核
import {
  MY_PERFORMACE_REQUEST,
  MY_PERFORMACE_SUCCESS,
  MY_PERFORMACE_FAILURE,
  MY_RENCENTLY_DEAL_PEOPLES_REQUEST,
  MY_RENCENTLY_DEAL_PEOPLES_SUCCESS,
  MY_RENCENTLY_DEAL_PEOPLES_FAILURE,
  MY_MY_RENCENTLY_ADDED_PEOPLES_REQUEST,
  MY_MY_RENCENTLY_ADDED_PEOPLES_SUCCESS,
  MY_MY_RENCENTLY_ADDED_PEOPLES_FAILURE,
  MY_PERFORMANCE_CHART_REQUEST,
  MY_PERFORMANCE_CHART_SUCCESS,
  MY_PERFORMANCE_CHART_FAILURE,
  MONTH_MEMBER_REWARD_REQUEST,
  MONTH_MEMBER_REWARD_SUCCESS,
  MONTH_MEMBER_REWARD_FAILURE,
  GET_ALL_COUPONS_REQUEST,
  GET_ALL_COUPONS_SUCCESS,
  GET_ALL_COUPONS_FAILURE,
} from '../actions/users/performance';

// 用户任务管理
import {
  CURRENT_DAY_TASK_PAGER_REQUEST,
  CURRENT_DAY_TASK_PAGER_SUCCESS,
  CURRENT_DAY_TASK_PAGER_FAILURE,
  UNDO_TASK_PAGER_REQUEST,
  UNDO_TASK_PAGER_SUCCESS,
  UNDO_TASK_PAGER_FAILURE,
  SINGLE_TASK_PAGER_REQUEST,
  SINGLE_TASK_PAGER_SUCCESS,
  SINGLE_TASK_PAGER_FAILURE,
  TASK_GROUP_REQUEST,
  TASK_GROUP_SUCCESS,
  TASK_GROUP_FAILURE,
} from '../actions/users/allTask';

// 员工评级
import {
  GRADE_PAGER_REQUEST,
  GRADE_PAGER_SUCCESS,
  GRADE_PAGER_FAILURE,
  GRADE_DETAILS_REQUEST,
  GRADE_DETAILS_SUCCESS,
  GRADE_DETAILS_FAILURE,
} from '../actions/users/grade.js';

// 首页公告
import {
  NOTICE_REQUEST,
  NOTICE_SUCCESS,
  NOTICE_FAILURE,
} from '../actions/users/notice.js';


// 微信二维码
import {
  MY_QCODE_REQUEST,
  MY_QCODE_SUCCESS,
  MY_QCODE_FAILURE,
} from '../actions/users/qCode.js';

import {
  CUSTOMER_TASK_TYPE_REQUEST,
  CUSTOMER_TASK_TYPE_SUCCESS,
  CUSTOMER_TASK_TYPE_FAILURE,
  CUSTOMER_GROWTH_TYPE_REQUEST,
  CUSTOMER_GROWTH_TYPE_SUCCESS,
  CUSTOMER_GROWTH_TYPE_FAILURE,
} from '../actions/customers/taskType.js';

const deepAssign = require('deep-assign');

// 初始化用户上下文.(默认用户数据结构)
// 此处包含与用户相关联的数据, 比如: 用户所管理的客户信息, 绩效, 实时数据.
const initialState = {
  currentDayTaskSize: 0,
  currentDayTaskList: [],
  currentDayTarget: {},
  dayTaskType: [{
    contentValue: '',
    ruleName: '',
    type: '',
  }],
  undoTaskSize: 0,
  undoTaskList: [],
  storeNoteSize: 0,
  storeNoteList: [],
  storeAllNoteList: [],
  storeAllNotePager: {},
  currentMonthSaleCompletePrice: 0,
  currentMonthSalePercent: 0,
  currentMonthMemeberDealPercent: 0,
  currentMonthMemeberDealCount: 0,
  myMembers: {
    countTotal: '',
    countNew: 0,
    countSale: 0,
    countSleep: 0,
    countFlown: 0,
    countWebStore: 0,
    consumeRadio: 0,
  },
  myPerformace: {
    targetAmount: 0,
    saleTarget: 0,
    memberTarget: 0,
    saleAmount: 0,
    memberCount: 0,
    memberPrice: 0,
    memberConsume: 0,
  },
  myActivity: {
    today: {
      amount: 0,
      count: 0,
    },
    yestoday: {
      ranking: '',
      completePerformanceAsRadio: '',
      dataMap: {
        countTotal: 0,
        countWhith: 0,
        countNewMember: 0,
        countMember: 0,
        memberAmount: 0,
        amount: 0,
        count: 0,
      },
      monthMap: {
        countTotal: 0,
        countWhith: 0,
        countNewMember: 0,
        countMember: 0,
        memberAmount: 0,
        amount: 0,
        count: 0,
      },
    },
  },
  myTasks: {
    undo: {
      pager: {
        pageSize: 20,
        currentPage: 1,
        totalPage: 1,
        totalItem: 0,
      },
      tasks: [],
    },
    today: {
      pager: {
        pageSize: 20,
        currentPage: 1,
        totalPage: 1,
        totalItem: 0,
      },
      tasks: [],
    },
    single: {
      pager: {
        pageSize: 20,
        currentPage: 1,
        totalPage: 1,
        totalItem: 0,
      },
      tasks: [],
    },
  },
  error: null,
  grade: {
    name: '',
    rank: '',
    pager: {},
    list: [],
  },
  allGrades: {},
  qCodeUrl: '',
  groupTasks: {
    pager: {
      pageSize: 15,
      currentPage: 1,
      totalPage: 1,
      totalItem: 0,
    },
    tasks: [],
  },
  shopActives: {
    pager: {
      currentPage: 1,
      totalPage: 1,
      totalItem: 0,
    },
    actives: [],
  },
  indexActives: {
    pager: {
      currentPage: 1,
      totalPage: 1,
      totalItem: 0,
    },
    actives: [],
  },
  myRecentlyAddedPeoples: {
    isCatching: '',
    newMemberItems: [],
    sleepMemberItems: [],
  },
  myRecentlyDealPeoples: {
    isFetching: '',
    dealMemberList: [],
    otherMemberList: [],
    selfMemberList: [],
    undealMemberList: [],
  },
  performanceTest: {
    assess: [],
    pager: {
      currentMonthReword: '',
      currentPage: 1,
      pageSize: 15,
      totalItem: 3,
      totalPage: 1,
    },
  },
  monthMemberReword: {
    reward: [],
    pager: {
      currentMonthMemberReword: '',
      currentPage: 1,
      pageSize: 15,
      totalItem: 3,
      totalPage: 1,
    },
  },
  isFetching: false,
  isCatching: false,
  isNoticeGet: false,
  noticeList: {
    currentTime: '',
    store: {
      description: '',
      notice: '',
    },
  },
};

// 初始化用户登陆验证上下文的状态.
function initializeState() {
  return Object.assign({}, initialState);
}

export default function User(state = initializeState(), action = {}) {
  switch (action.type) {
    //----------------------------------
    case CUSTOMER_TASK_TYPE_REQUEST:
      return Object.assign({}, state);
    case CUSTOMER_TASK_TYPE_SUCCESS:
      return Object.assign({}, state, {
        dayTaskType: action.dayTaskType,
      });
    case CUSTOMER_TASK_TYPE_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
      });
    // ---------------------------------------
    case MY_MY_RENCENTLY_ADDED_PEOPLES_REQUEST:
      return Object.assign({}, state, {
        isCatching: action.isCatching,
      });
    case MY_MY_RENCENTLY_ADDED_PEOPLES_SUCCESS:
      return deepAssign({}, state, {
        myRecentlyAddedPeoples: {
          code: action.data.code,
          isCatching: action.isCatching,
          newMemberItems: action.data.newMemberItems,
          sleepMemberItems: action.data.sleepMemberItems,
        },
      });
    case MY_MY_RENCENTLY_ADDED_PEOPLES_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case MY_RENCENTLY_DEAL_PEOPLES_REQUEST:
      return Object.assign({}, state, {
        isFetching: action.isFetching,
      });
    case MY_RENCENTLY_DEAL_PEOPLES_SUCCESS:
      return deepAssign({}, state, {
        myRecentlyDealPeoples: {
          code: action.data.code,
          isFetching: action.isFetching,
          dealMemberList: action.data.dealMemberList,
          otherMemberList: action.data.otherMemberList,
          selfMemberList: action.data.selfMemberList,
          undealMemberList: action.data.undealMemberList,
        },
      });
    case MY_RENCENTLY_DEAL_PEOPLES_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case CUSTOMER_GROWTH_TYPE_REQUEST:
      return Object.assign({}, state);
    case CUSTOMER_GROWTH_TYPE_SUCCESS:
      return deepAssign({}, state, {
        growthType: action.growthType,
      });
    case CUSTOMER_GROWTH_TYPE_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case CURRENT_DAY_TARGET_REQUEST:
      return Object.assign({}, state);
    case CURRENT_DAY_TARGET_SUCCESS:
      return deepAssign({}, state, {
        currentDayTarget: action.data,
      });
    case CURRENT_DAY_TARGET_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------

    // ---------------------------------------
    case CURRENT_DAY_TASK_REQUEST:
      return Object.assign({}, state);
    case CURRENT_DAY_TASK_SUCCESS:
      return Object.assign({}, state, { currentDayTaskSize: action.taskSize });
    case CURRENT_DAY_TASK_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case UNDO_DAY_TASK_REQUEST:
      return Object.assign({}, state);
    case UNDO_DAY_TASK_SUCCESS:
      return Object.assign({}, state, { undoTaskSize: action.undoTaskSize });
    case UNDO_DAY_TASK_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case STORE_NOTE_REQUEST:
      return Object.assign({}, state);
    case STORE_NOTE_SUCCESS:
      return Object.assign({}, state, {
        storeNoteList: action.storeNoteList,
        storeNoteSize: action.storeNoteSize,
      });
    case STORE_NOTE_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case STORE_ALL_NOTE_REQUEST:
      return Object.assign({}, state, {
        isStoreAllNoteGet: action.isStoreAllNoteGet,
      });
    case STORE_ALL_NOTE_SUCCESS:
      return Object.assign({}, state, {
        storeAllNoteList: action.pageItems,
        storeAllNotePager: action.pager,
        isStoreAllNoteGet: action.isStoreAllNoteGet,
      });
    case STORE_ALL_NOTE_FAILURE:
      return {
        ...state,
        error: action.error,
        isStoreAllNoteGet: action.isStoreAllNoteGet,
      };
    // ---------------------------------------
    case MONTH_SALE_REQUEST:
      return Object.assign({}, state);
    case MONTH_SALE_SUCCESS:
      return Object.assign({}, state, {
        currentMonthSaleCompletePrice: action.complete,
        currentMonthSalePercent: action.percent,
      });
    case MONTH_SALE_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case MEMBER_SALE_REQUEST:
      return Object.assign({}, state);
    case MEMBER_SALE_SUCCESS:
      return Object.assign({}, state, {
        currentMonthMemeberDealCount: action.complete,
        currentMonthMemeberDealPercent: action.percent,
      });
    case MEMBER_SALE_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case GET_ALL_COUPONS_REQUEST:
      return Object.assign({}, state, {
        isAllCouponGet: action.isAllCouponGet,
      });
    case GET_ALL_COUPONS_SUCCESS:
      return Object.assign({}, state, {
        allCoupons: action.allCoupons,
        isAllCouponGet: action.isAllCouponGet,
      });
    case GET_ALL_COUPONS_FAILURE:
      return {
        ...state,
        error: action.error,
        isAllCouponGet: action.isAllCouponGet,
      };
    // ---------------------------------------
    case MY_MEMBER_REQUEST:
      return Object.assign({}, state);
    case MY_MEMBER_SUCCESS:
      return deepAssign({}, state, {
        myMembers: action.data,
      });
    case MY_MEMBER_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case MY_TODAY_ACTIVITY_REQUEST:
      return Object.assign({}, state);
    case MY_TODAY_ACTIVITY_SUCCESS:
      return deepAssign({}, state, {
        myActivity: {
          today: action.data,
        },
      });
    case MY_TODAY_ACTIVITY_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case MY_YESTODAY_ACTIVITY_REQUEST:
      return Object.assign({}, state);
    case MY_YESTODAY_ACTIVITY_SUCCESS:
      return deepAssign({}, state, {
        myActivity: {
          yestoday: action.data,
        },
      });
    case MY_YESTODAY_ACTIVITY_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case MY_PERFORMACE_REQUEST:
      return Object.assign({}, state);
    case MY_PERFORMACE_SUCCESS:
      return Object.assign({}, state, {
        myPerformace: action.data,
      });
    case MY_PERFORMACE_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case MY_PERFORMANCE_CHART_REQUEST:
      return Object.assign({}, state, {
        isRoyaltiesGet: action.isRoyaltiesGet,
      });
    case MY_PERFORMANCE_CHART_SUCCESS:
      return Object.assign({}, state, {
        isRoyaltiesGet: action.isRoyaltiesGet,
        performanceTest: {
          assess: action.assess,
          pager: action.pager,
        },
      });
    case MY_PERFORMANCE_CHART_FAILURE:
      return {
        ...state,
        isRoyaltiesGet: action.isRoyaltiesGet,
        error: action.error,
      };
    // ---------------------------------------
    case MONTH_MEMBER_REWARD_REQUEST:
      return Object.assign({}, state);
    case MONTH_MEMBER_REWARD_SUCCESS:
      return Object.assign({}, state, {
        monthMemberReword: {
          reward: action.assess,
          pager: action.pager,
        },
      });
    case MONTH_MEMBER_REWARD_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case CURRENT_DAY_TASK_PAGER_REQUEST:
      return Object.assign({}, state);
    case CURRENT_DAY_TASK_PAGER_SUCCESS:
      return deepAssign({}, state, {
        myTasks: {
          today: {
            pager: action.pager,
            tasks: action.todaytasks,
          },
        },
      });
    case CURRENT_DAY_TASK_PAGER_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case UNDO_TASK_PAGER_REQUEST:
      return Object.assign({}, state);
    case UNDO_TASK_PAGER_SUCCESS:
      return deepAssign({}, state, {
        myTasks: {
          undo: {
            pager: action.pager,
            tasks: action.undotasks,
          },
        },
      });
    case UNDO_TASK_PAGER_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case SINGLE_TASK_PAGER_REQUEST:
      return Object.assign({}, state);
    case SINGLE_TASK_PAGER_SUCCESS:
      return deepAssign({}, state, {
        myTasks: {
          single: {
            pager: action.pager,
            tasks: action.singletasks,
          },
        },
      });
    case SINGLE_TASK_PAGER_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case GRADE_PAGER_REQUEST:
      return Object.assign({}, state);
    case GRADE_PAGER_SUCCESS:
      return deepAssign({}, state, {
        allGrades: {
          pager: action.pager,
          list: action.grades,
        },
      });
    case GRADE_PAGER_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case GRADE_DETAILS_REQUEST:
      return Object.assign({}, state);
    case GRADE_DETAILS_SUCCESS:
      return deepAssign({}, state, {
        grade: {
          details: {
            name: action.pager.name,
            rank: action.pager.rank,
          },
          pager: action.pager,
          list: action.grades,
        },
      });
    case GRADE_DETAILS_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case MY_QCODE_REQUEST:
      return Object.assign({}, state);
    case MY_QCODE_SUCCESS:
      return deepAssign({}, state, {
        qCodeUrl: action.url,
      });
    case MY_QCODE_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case TASK_GROUP_REQUEST:
      return Object.assign({}, state);
    case TASK_GROUP_SUCCESS:
      return deepAssign({}, state, {
        groupTasks: {
          pager: action.pager,
          tasks: action.groups,
        },
      });
    case TASK_GROUP_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case YEAR_ALL_ACTIVITY_REQUEST:
      return Object.assign({}, state);
    case YEAR_ALL_ACTIVITY_SUCCESS:
      return deepAssign({}, state, {
        shopActives: {
          pager: action.pager,
          actives: action.shopactives,
        },
      });
    case YEAR_ALL_ACTIVITY_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // ---------------------------------------
    case INDEX_ACTIVITY_REQUEST:
      return Object.assign({}, state, {
        isIndexActivityGet: action.isIndexActivityGet,
      });
    case INDEX_ACTIVITY_SUCCESS:
      return deepAssign({}, state, {
        indexActives: {
          pager: action.pager,
          isIndexActivityGet: action.isIndexActivityGet,
          actives: action.indexActives,
        },
      });
    case INDEX_ACTIVITY_FAILURE:
      return {
        ...state,
        isIndexActivityGet: action.isIndexActivityGet,
        error: action.error,
      }; // ---------------------------------------
    case NOTICE_REQUEST:
      return Object.assign({}, state);
    case NOTICE_SUCCESS:
      return deepAssign({}, state, {
        isNoticeGet: action.isNoticeGet,
        noticeList: action.noticeList,
      });
    case NOTICE_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // .......................................
    default:
      return state;
  }
}
