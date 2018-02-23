// actions.
import {
  SELECT_CUSTOMER_PAGE,
  INVALIDATE_CUSTOMER_PAGE,
  CUSTOMER_REQUEST,
  CUSTOMER_SUCCESS,
  CUSTOMER_FAILURE,
  CUSTOMER_RESET,
  CUSTOMER_CALL_REQUEST,
  CUSTOMER_CALL_SUCCESS,
  CUSTOMER_CALL_FAILURE,
  CUSTOMER_CALL_RECORD_REQUEST,
  CUSTOMER_CALL_RECORD_SUCCESS,
  CUSTOMER_CALL_RECORD_FAILURE,
  CUSTOMER_THIRD_PARTY_CALL_REQUEST,
  CUSTOMER_THIRD_PARTY_CALL_SUCCESS,
  CUSTOMER_THIRD_PARTY_CALL_FAILURE,
} from '../actions/customers/list';

// 用户详情ACTIONS.
import {
  CUSTOMER_DETAIL_REQUEST,
  CUSTOMER_DETAIL_SUCCESS,
  CUSTOMER_DETAIL_FAILURE,
  CUSTOMER_DETAIL_RESET,
  CUSTOMER_ORDER_CATEGORY_REQUEST,
  CUSTOMER_ORDER_CATEGORY_SUCCESS,
  CUSTOMER_ORDER_CATEGORY_FAILURE,
  CUSTOMER_CAPTCHA_LIST_REQUEST,
  CUSTOMER_CAPTCHA_LIST_SUCCESS,
  CUSTOMER_CAPTCHA_LIST_FAILURE,
  CUSTOMER_CAPTCHA_LIST_RESET,
} from '../actions/customers/details';

// 复购推荐
import {
  PRODUCTS_RECOMMEND_REQUEST,
  PRODUCTS_RECOMMEND_SUCCESS,
  PRODUCTS_RECOMMEND_FAILURE,
} from '../actions/customers/recommend';

// 商品ACTIONS.
import {
  CUSTOMER_PRODUCT_FILTER_REQUEST,
  CUSTOMER_PRODUCT_FILTER_SUCCESS,
  CUSTOMER_PRODUCT_FILTER_FAILURE,
  CUSTOMER_FEATURE_REQUEST,
  CUSTOMER_FEATURE_SUCCESS,
  CUSTOMER_FEATURE_FAILURE,
} from '../actions/customers/products.js';

// 订单ACTIONS
import {
  ORDERS_REQUEST,
  ORDERS_SUCCESS,
  ORDERS_FAILURE,
  ORDER_INFO_REQUEST,
  ORDER_INFO_SUCCESS,
  ORDER_INFO_FAILURE,
} from '../actions/customers/orders.js';

// 客户交易排行ACTIONS
import {
  CUSTOMER_CONSUME_RANK_REQUEST,
  CUSTOMER_CONSUME_RANK_SUCCESS,
  CUSTOMER_CONSUME_RANK_FAILURE,
} from '../actions/customers/consume.js';

// 客户评价ACTIONS
import {
  CUSTOMER_EVALUATE_REQUEST,
  CUSTOMER_EVALUATE_SUCCESS,
  CUSTOMER_EVALUATE_FAILURE,
} from '../actions/customers/evaluate.js';

// 客户评价ACTIONS
import {
  CUSTOMER_TRACE_REQUEST,
  CUSTOMER_TRACE_SUCCESS,
  CUSTOMER_TRACE_FAILURE,
} from '../actions/customers/trace.js';

// 用户投诉详情
import {
  CUSTOMER_COMPILATION_REQUEST,
  CUSTOMER_COMPILATION_SUCCESS,
  CUSTOMER_COMPILATION_FAILURE,
} from '../actions/customers/compilation.js';

import {
  SALES_PAGER_REQUEST,
  SALES_PAGER_SUCCESS,
  SALES_PAGER_FAILURE,
} from '../actions/store/sales.js';

// 用户备注
import {
  CUSTOMER_WRITE_RECORD_REQUEST,
  CUSTOMER_WRITE_RECORD_SUCCESS,
  CUSTOMER_WRITE_RECORD_FAILURE,
  CUSTOMER_RECORD_PAGER_REQUEST,
  CUSTOMER_RECORD_PAGER_SUCCESS,
  CUSTOMER_RECORD_PAGER_FAILURE,
} from '../actions/customers/record.js';

// 用户联系进度
import {
  ORDER_CONTACT_REQUEST,
  ORDER_CONTACT_SUCCESS,
  ORDER_CONTACT_FAILURE,
  ORDER_CONTACT_DETAIL_REQUEST,
  ORDER_CONTACT_DETAIL_SUCCESS,
  ORDER_CONTACT_DETAIL_FAILURE,
  MY_RELATIONS_REQUEST,
  MY_RELATIONS_SUCCESS,
  MY_RELATIONS_FAILURE,
} from '../actions/customers/relations.js';

// 导购营销
import {
  MARKETING_REASON_REQUEST,
  MARKETING_REASON_SUCCESS,
  MARKETING_REASON_FAILURE,
  ADD_MARKETING_REQUEST,
  ADD_MARKETING_SUCCESS,
  ADD_MARKETING_FAILURE,
  MARKETING_LIST_REQUEST,
  MARKETING_LIST_SUCCESS,
  MARKETING_LIST_FAILURE,
  MARKETING_SEND_COUPON_REQUEST,
  MARKETING_SEND_COUPON_SUCCESS,
  MARKETING_SEND_COUPON_FAILURE,
} from '../actions/customers/marketing.js';

// 导购优惠券
import {
  CUSTOMER_COUPON_LIST_REQUEST,
  CUSTOMER_COUPON_LIST_SUCCESS,
  CUSTOMER_COUPON_LIST_FAILURE,
} from '../actions/customers/coupon.js';

// 消息
import {
  CUSTOMER_SEND_MESSAGE_REQUEST,
  CUSTOMER_SEND_MESSAGE_SUCCESS,
  CUSTOMER_SEND_MESSAGE_FAILURE,
  CUSTOMER_SEND_MESSAGE_RESET,
  MESSAGE_TEMPLATE_REQUSET,
  MESSAGE_TEMPLATE_SUCCESS,
  MESSAGE_TEMPLATE_FAILURE,
} from '../actions/customers/message.js';

// 用于扩展assign方法, 支持深拷贝.
const deepAssign = require('deep-assign');

// 客户性别常量
export const SEXMAPPING = {
  0: '保密',
  1: '女',
  2: '男',
};

// 初始化用户数据, 包括分页数据.
const initialState = {
  pager: {
    pageSize: 20,
    pageTotalCount: 0,
    totalItem: 0,
    currentPage: 1,
  },
  list: [],
  isFetching: false,
  isDetailsGet: false,
  didInvalidate: false,
  error: null,
  tags: {},

};

const initialMarketingState = {
  reasons: {},
  marketings: {},
  coupons: [],
  error: null,
  code: -1,
  isFetching: false,
  didInvalidate: false,
};

const inintalCouponState = {
  isSmsSended: false,
  smsReturnCode: '',
};

const inintalMarketingState = {
  isReasonFetching: false,
  reasonCode: '',
};

export function customerMyRelations(state = {}, action) {
  switch (action.type) {
    //----------------------------------
    case MY_RELATIONS_REQUEST:
      return Object.assign({}, state, {
        isRelationsGet: action.isRelationsGet,
      });
    case MY_RELATIONS_SUCCESS:
      return Object.assign({}, state, {
        relationsList: action.relationsList,
        isRelationsGet: action.isRelationsGet,
        pager: action.pager,
      });
    case MY_RELATIONS_FAILURE:
      return Object.assign({}, state, {
        isRelationsGet: action.isRelationsGet,
        error: action.error,
      });
    default:
      return state;
  }
}

// 获取用户消费排行
export function customerConsumeRank(state = {}, action) {
  switch (action.type) {
    case CUSTOMER_CONSUME_RANK_REQUEST:
      return Object.assign({}, state, {
        isConsumeRankGet: action.isConsumeRankGet,
      });
    case CUSTOMER_CONSUME_RANK_SUCCESS:
      return Object.assign({}, state, {
        consumeRank: action.consumeRank,
        isConsumeRankGet: action.isConsumeRankGet,
      });
    case CUSTOMER_CONSUME_RANK_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
        isConsumeRankGet: action.isConsumeRankGet,
      });
    default:
      return state;
  }
}

// 客户追踪
export function customerTrace(state = {}, action) {
  switch (action.type) {
    case CUSTOMER_TRACE_REQUEST:
      return Object.assign({}, state, {
        isTraceGet: action.isTraceGet,
      });
    case CUSTOMER_TRACE_SUCCESS:
      return Object.assign({}, state, {
        isTraceGet: action.isTraceGet,
        trace: action.trace,
      });
    case CUSTOMER_TRACE_FAILURE:
      return Object.assign({}, state, {
        isTraceGet: action.isTraceGet,
        error: action.error,
      });
    default:
      return state;
  }
}

// 获取用户评价
export function customerEvaluate(state = {}, action) {
  switch (action.type) {
    case CUSTOMER_EVALUATE_REQUEST:
      return Object.assign({}, state, {
        isEvaluateGet: action.isEvaluateGet,
      });
    case CUSTOMER_EVALUATE_SUCCESS:
      return Object.assign({}, state, {
        isEvaluateGet: action.isEvaluateGet,
        evaluate: action.evaluate,
      });
    case CUSTOMER_EVALUATE_FAILURE:
      return Object.assign({}, state, {
        isEvaluateGet: action.isEvaluateGet,
        error: action.error,
      });
    default:
      return state;
  }
}


function users(state = initialState, action) {
  switch (action.type) {
    case INVALIDATE_CUSTOMER_PAGE:
      return Object.assign({}, state, {
        didInvalidate: true,
      });
    case CUSTOMER_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
      });
    case CUSTOMER_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        pager: action.pager,
        customers: action.customers,
        error: null,
      });
    case CUSTOMER_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        error: action.error,
      });
    case CUSTOMER_RESET:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        pager: action.pager,
        customers: action.customers,
        error: null,
      });
    // ---------------------------------
    // 需要在此处清空上一次列表的数据状态.
    case CUSTOMER_DETAIL_REQUEST:
      return Object.assign({}, state, {
        isDetailsGet: action.isDetailsGet,
      });
    case CUSTOMER_DETAIL_SUCCESS:
      return Object.assign({}, state, {
        isDetailsGet: action.isDetailsGet,
        detail: action.data,
      });
    case CUSTOMER_DETAIL_FAILURE:
      return Object.assign({}, state, {
        isDetailsGet: action.isDetailsGet,
        error: action.error,
      });
    case CUSTOMER_DETAIL_RESET:
      return Object.assign({}, state, {
        isDetailsGet: action.isDetailsGet,
        detail: action.data,
      });
    default:
      return state;
  }
}

// 获取消费统计的数据
export function customerOrdersInfo(state = {}, action) {
  switch (action.type) {
    case ORDER_INFO_REQUEST:
      return Object.assign({
        isFetching: action.isFetching,
      }, state);
    case ORDER_INFO_SUCCESS:
      return Object.assign({}, state, {
        isFetching: action.isFetching,
        pager: action.pager,
        ordersinfo: action.compilations,
      });
    case ORDER_INFO_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
      });
    default:
      return state;
  }
}

// 获取客户验证码记录
export function customerCaptchaList(state = {}, action) {
  switch (action.type) {
    case CUSTOMER_CAPTCHA_LIST_REQUEST:
      return Object.assign({}, state);
    case CUSTOMER_CAPTCHA_LIST_SUCCESS:
      return Object.assign({}, state, {
        captchaList: action.captchaList,
      });
    case CUSTOMER_CAPTCHA_LIST_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
      });
    case CUSTOMER_CAPTCHA_LIST_RESET:
      return Object.assign({}, state, {
        captchaList: action.captchaList,
      });
    default:
      return state;
  }
}

// 获取用户联系进度
export function customerContactProgress(state = {}, action) {
  switch (action.type) {
    case ORDER_CONTACT_REQUEST:
      return Object.assign({}, state);
    case ORDER_CONTACT_SUCCESS:
      return Object.assign({}, state, {
        pager: action.pager,
        contactInfo: action.contactInfo,
        error: null,
      });
    case ORDER_CONTACT_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
      });
    default:
      return state;
  }
}

// 获取用户联系进度详情
export function customerContactProgressDetail(state = {}, action) {
  switch (action.type) {
    case ORDER_CONTACT_DETAIL_REQUEST:
      return Object.assign({}, state);
    case ORDER_CONTACT_DETAIL_SUCCESS:
      return Object.assign({}, state, {
        ContactProgressInfo: action.ContactProgressInfo,
        error: null,
      });
    case ORDER_CONTACT_DETAIL_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
      });
    default:
      return state;
  }
}

// 获得用户投诉列表
export function customerCompilation(state = {}, action) {
  switch (action.type) {
    case CUSTOMER_COMPILATION_REQUEST:
      return Object.assign({}, state);
    case CUSTOMER_COMPILATION_SUCCESS:
      return Object.assign({}, state, {
        pager: action.pager,
        compilations: action.compilations,
      });
    case CUSTOMER_COMPILATION_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
      });
    default:
      return state;
  }
}

// 用户备注
export function customerRecord(state = {}, action) {
  switch (action.type) {
    case CUSTOMER_WRITE_RECORD_REQUEST:
      return Object.assign({}, state, {
        submiting: true,
      });
    case CUSTOMER_WRITE_RECORD_SUCCESS:
      return Object.assign({}, state, {
        code: action.code,
        submiting: false,
      });
    case CUSTOMER_WRITE_RECORD_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
        submiting: false,
      });
    case CUSTOMER_RECORD_PAGER_REQUEST:
      return Object.assign({}, state);
    case CUSTOMER_RECORD_PAGER_SUCCESS:
      return Object.assign({}, state, {
        pager: action.pager,
        records: action.records,
      });
    case CUSTOMER_RECORD_PAGER_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
      });
    default:
      return state;
  }
}

// 用户信息
export function customerMessage(state = {}, action) {
  switch (action.type) {
    case CUSTOMER_SEND_MESSAGE_REQUEST:
      return Object.assign({}, state, {
        isMessageSended: action.isMessageSended,
      });
    case CUSTOMER_SEND_MESSAGE_SUCCESS:
      return Object.assign({}, state, {
        code: action.code,
        isMessageSended: action.isMessageSended,
      });
    case CUSTOMER_SEND_MESSAGE_FAILURE:
      sessionStorage.setItem('newCode', action.error.status);
      return Object.assign({}, state, {
        error: action.error,
        isMessageSended: action.isMessageSended,
      });
    case CUSTOMER_SEND_MESSAGE_RESET:
      return Object.assign({}, state, {
        code: action.code,
        isMessageSended: action.isMessageSended,
      });
    case MESSAGE_TEMPLATE_REQUSET:
      return Object.assign({}, state, {
        isMessageTemplateGet: action.isMessageTemplateGet,
      });
    case MESSAGE_TEMPLATE_SUCCESS:
      return Object.assign({}, state, {
        templateList: action.templateList,
        isMessageTemplateGet: action.isMessageTemplateGet,
      });
    case MESSAGE_TEMPLATE_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
        isMessageTemplateGet: action.isMessageTemplateGet,
      });
    default:
      return state;
  }
}
// 获得过滤出来的商品列表
export function filtedProductsByCID(state = {}, action) {
  switch (action.type) {
    case CUSTOMER_PRODUCT_FILTER_REQUEST:
      return Object.assign({}, state);
    case CUSTOMER_PRODUCT_FILTER_SUCCESS:
      return Object.assign({}, state, {
        products: action.data,
      });
    case CUSTOMER_PRODUCT_FILTER_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
      });
    case CUSTOMER_FEATURE_REQUEST:
      return Object.assign({}, state, {
        isFeaturesGet: action.isFeaturesGet,
      });
    case CUSTOMER_FEATURE_SUCCESS:
      return Object.assign({}, state, {
        features: action.data,
        isFeaturesGet: action.isFeaturesGet,
      });
    case CUSTOMER_FEATURE_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
        isFeaturesGet: action.isFeaturesGet,
      });
    default:
      return state;
  }
}

// 获取用户详情
export function customerDetailById(state = {}, action) {
  switch (action.type) {
    case CUSTOMER_DETAIL_REQUEST:
    case CUSTOMER_DETAIL_SUCCESS:
    case CUSTOMER_DETAIL_FAILURE:
      return users(state, action);
    default:
      return state;
  }
}

// 获取复购推荐
export function getCustomerRecommend(state = {}, action) {
  switch (action.type) {
    case PRODUCTS_RECOMMEND_REQUEST:
      return Object.assign({}, state, {
      });
    case PRODUCTS_RECOMMEND_SUCCESS:
      return Object.assign({}, state, {
        recommendation: action.recommendation,
        wiki: action.wiki,
        babyAgeWiki: action.babyAgeWiki,
      });
    case PRODUCTS_RECOMMEND_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
      });
    default:
      return state;
  }
}

// 根据页数获取用户数据.
export function customersByPage(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_CUSTOMER_PAGE:
    case CUSTOMER_REQUEST:
    case CUSTOMER_SUCCESS:
    case CUSTOMER_FAILURE:
    case CUSTOMER_RESET:
      return users(state, action);
    default:
      return state;
  }
}

// 菜单数据
// 菜单数据构造成数组,方便后期维护,无需修改DOM只需维护该数组就可以.
export function detailsGridData(data) {
  return [
    {
      icon: 'icon-vipcard',
      value: data.offlineId,
      text: '会员卡号',
    },
    {
      icon: 'icon-ziliao',
      value: data.userName,
      text: '商城ID',
    },
    {
      icon: 'icon-gender',
      customerAge: data.customerAge,
      customerGender: data.customerGender,
      text: '会员资料',
    },
    {
      icon: 'icon-shoujihao',
      value: data.mobilePhone,
      text: '手机号码',
    },
    {
      icon: 'icon-mendian',
      value: data.storeOutletName || '无',
      text: '最近购买门店',
    },
    {
      icon: 'icon-date',
      value: data.regDate,
      text: '开卡日期',
    },
    {
      icon: 'icon-fuzhipeizhi',
      value: `${data.orderCount}个`,
      text: '全部订单',
    },
    {
      icon: 'icon-youhuiquan',
      value: `${data.couponCount}张`,
      text: '优惠券',
    },
  ];
}

// 线下客户订单
export function ordersByCustomerOldId(state = {}, action) {
  switch (action.type) {
    case ORDERS_REQUEST:
      return Object.assign({}, state);
    case ORDERS_SUCCESS:
      return Object.assign({}, state, {
        orders: action.orders,
      });
    case ORDERS_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
      });
    default:
      return state;
  }
}

// 我的用户营销数据推荐.
export function orderCategories(state = initialState, action) {
  switch (action.type) {
    case CUSTOMER_ORDER_CATEGORY_REQUEST:
      return Object.assign({}, state, {
        isCatching: action.isCatching,
        didInvalidate: false,
      });
    case CUSTOMER_ORDER_CATEGORY_SUCCESS:
      return Object.assign({}, state, {
        isCatching: action.isCatching,
        didInvalidate: false,
        pager: action.pager,
        categories: action.customers,
        error: null,
      });
    case CUSTOMER_ORDER_CATEGORY_FAILURE:
      return Object.assign({}, state, {
        isCatching: action.isCatching,
        didInvalidate: false,
        error: action.error,
      });
    default:
      return state;
  }
}

// 我的用户营销数据推荐.
export function marketing(state = initialMarketingState, action) {
  switch (action.type) {
    case MARKETING_REASON_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
      });
    case MARKETING_REASON_SUCCESS:
      return deepAssign({}, state, {
        isFetching: false,
        didInvalidate: false,
        reasons: {
          pager: action.pager,
          pageItems: action.reasons,
        },
        error: null,
      });
    case MARKETING_REASON_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        error: action.error,
      });
    case MARKETING_LIST_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
      });
    case MARKETING_LIST_SUCCESS:
      return deepAssign({}, state, {
        isFetching: false,
        didInvalidate: false,
        marketings: {
          pager: action.pager,
          pageItems: action.marketings,
        },
        error: null,
      });
    case MARKETING_LIST_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        error: action.error,
      });
    case CUSTOMER_COUPON_LIST_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
      });
    case CUSTOMER_COUPON_LIST_SUCCESS:
      return deepAssign({}, state, {
        isFetching: false,
        didInvalidate: false,
        coupons: action.coupons,
        error: null,
      });
    case CUSTOMER_COUPON_LIST_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        error: action.error,
      });
    default:
      return state;
  }
}

export function sendCustomerCoupon(state = inintalCouponState, action) {
  switch (action.type) {
    case MARKETING_SEND_COUPON_REQUEST:
      return Object.assign({}, state, {
        isSmsSended: action.isSmsSended,
      });
    case MARKETING_SEND_COUPON_SUCCESS:
      return Object.assign({}, state, {
        isSmsSended: action.isSmsSended,
        smsReturnCode: action.smsReturnCode,
      });
    case MARKETING_SEND_COUPON_FAILURE:
      return Object.assign({}, state, {
        isSmsSended: action.isSmsSended,
        error: action.error,
      });
    default:
      return state;
  }
}

export function sendCustomerMarketing(state = inintalMarketingState, action) {
  switch (action.type) {
    case ADD_MARKETING_REQUEST:
      return Object.assign({}, state, {
        isReasonFetching: action.isReasonFetching,
      });
    case ADD_MARKETING_SUCCESS:
      return Object.assign({}, state, {
        isReasonFetching: action.isReasonFetching,
        reasonCode: action.reasonCode,
      });
    case ADD_MARKETING_FAILURE:
      return Object.assign({}, state, {
        isReasonFetching: action.isReasonFetching,
        error: action.error,
      });
    default:
      return state;
  }
}

// 用户打电话
export function customerCallInfo(state = {}, action) {
  switch (action.type) {
    case CUSTOMER_CALL_REQUEST:
      return Object.assign({}, state);
    case CUSTOMER_CALL_SUCCESS:
      return deepAssign({}, state, {
        callRecord: action.callRecord,
      });
    case CUSTOMER_CALL_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
      });
    default:
      return state;
  }
}
// 用户拨打电话记录
export function customerCallRecord(state = {}, action) {
  switch (action.type) {
    case CUSTOMER_CALL_RECORD_REQUEST:
      return Object.assign({}, state, {
        submiting: true,
      });
    case CUSTOMER_CALL_RECORD_SUCCESS:
      return Object.assign({}, state, {
        code: action.code,
        submiting: false,
      });
    case CUSTOMER_CALL_RECORD_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
        submiting: false,
      });
    default:
      return state;
  }
}

// 用户通过第三方打电话
export function customerThirdPartyCall(state = {}, action) {
  switch (action.type) {
    case CUSTOMER_THIRD_PARTY_CALL_REQUEST:
      return deepAssign({
        isFetching: action.isFetching,
      }, state);
    case CUSTOMER_THIRD_PARTY_CALL_SUCCESS:
      return deepAssign({}, state, {
        returnCode: action.returnCode,
        isFetching: action.isFetching,
        errorMsg: action.errorMsg,
      });
    case CUSTOMER_THIRD_PARTY_CALL_FAILURE:
      return deepAssign({}, state, {
        error: action.error,
        isFetching: action.isFetching,
      });
    default:
      return state;
  }
}

export function staffSaleRank(state = {}, action) {
  switch (action.type) {
    // ---------------------------------------
    case SALES_PAGER_REQUEST: {
      return Object.assign({}, state, {
        isSalesPagerGet: action.isSalesPagerGet,
      });
    }
    case SALES_PAGER_SUCCESS: {
      return Object.assign({}, state, {
        pager: action.pager,
        isSalesPagerGet: action.isSalesPagerGet,
        userSales: action.sales,
      });
    }
    case SALES_PAGER_FAILURE: {
      return {
        ...state,
        error: action.error,
        isSalesPagerGet: action.isSalesPagerGet,
      };
    }
    default:
      return state;
  }
}
/*
 * 额外优化的功能:
 * 1. 用户当前分页的数据(页数, 数据)缓存到本地缓存中.[已完成]
 */
