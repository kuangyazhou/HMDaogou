import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER } from '../../utils/apiUtils';

// 客户消费金额等级占比
export const MONETARY_LEVEL_REQUEST = 'MONETARY_LEVEL_REQUEST';
export const MONETARY_LEVEL_SUCCESS = 'MONETARY_LEVEL_SUCCESS';
export const MONETARY_LEVEL_FAILURE = 'MONETARY_LEVEL_FAILURE';

// 客户生理轴占比
export const PHYSIOLOGICAL_AXIS_REQUEST = 'PHYSIOLOGICAL_AXIS_REQUEST';
export const PHYSIOLOGICAL_AXIS_SUCCESS = 'PHYSIOLOGICAL_AXIS_SUCCESS';
export const PHYSIOLOGICAL_AXIS_FAILURE = 'PHYSIOLOGICAL_AXIS_FAILURE';

// 员工联系客户率
export const CONTACT_CUSTOMER_PERCENT_REQUEST = 'CONTACT_CUSTOMER_PERCENT_REQUEST';
export const CONTACT_CUSTOMER_PERCENT_SUCCESS = 'CONTACT_CUSTOMER_PERCENT_SUCCESS';
export const CONTACT_CUSTOMER_PERCENT_FAILURE = 'CONTACT_CUSTOMER_PERCENT_FAILURE';

// 本月导购维护客户数/流失维护客户数
export const CUSTOMER_CARE_COUNT_REQUEST = 'CUSTOMER_CARE_COUNT_REQUEST';
export const CUSTOMER_CARE_COUNT_SUCCESS = 'CUSTOMER_CARE_COUNT_SUCCESS';
export const CUSTOMER_CARE_COUNT_FAILURE = 'CUSTOMER_CARE_COUNT_FAILURE';


// 本月增长趋势新增客户数
export const ADDED_CUSTOMER_REQUEST = 'ADDED_CUSTOMER_REQUEST';
export const ADDED_CUSTOMER_SUCCESS = 'ADDED_CUSTOMER_SUCCESS';
export const ADDED_CUSTOMER_FAILURE = 'ADDED_CUSTOMER_FAILURE';


// 本月增长趋势交易客户
export const DEALED_CUSTOMER_REQUEST = 'DEALED_CUSTOMER_REQUEST';
export const DEALED_CUSTOMER_SUCCESS = 'DEALED_CUSTOMER_SUCCESS';
export const DEALED_CUSTOMER_FAILURE = 'DEALED_CUSTOMER_FAILURE';

// 本月维护客户交易
export const CUSTOMER_CARE_DEAL_REQUEST = 'CUSTOMER_CARE_DEAL_REQUEST';
export const CUSTOMER_CARE_DEAL_SUCCESS = 'CUSTOMER_CARE_DEAL_SUCCESS';
export const CUSTOMER_CARE_DEAL_FAILURE = 'CUSTOMER_CARE_DEAL_FAILURE';

// 本月店铺交易详情
export const STORE_DEAL_DETAIL_REQUEST = 'STORE_DEAL_DETAIL_REQUEST';
export const STORE_DEAL_DETAIL_SUCCESS = 'STORE_DEAL_DETAIL_SUCCESS';
export const STORE_DEAL_DETAIL_FAILURE = 'STORE_DEAL_DETAIL_FAILURE';

// ---------------------------------------------
function mainMonetaryLevelRequest() {
  return {
    type: MONETARY_LEVEL_REQUEST,
    isDealCustomerRank: false,
  };
}
function mainMonetaryLevelSuccess(payload) {
  return {
    type: MONETARY_LEVEL_SUCCESS,
    isDealCustomerRank: true,
    allResult: payload.data.pager.allResult,
  };
}
function mainMonetaryLevelFailure(error) {
  return {
    type: MONETARY_LEVEL_FAILURE,
    isDealCustomerRank: false,
    error,
  };
}

// ---------------------------------------------
function customerCareDealRequest() {
  return {
    type: CUSTOMER_CARE_DEAL_REQUEST,
    isDealListGet: false,
  };
}
function customerCareDealSuccess(payload) {
  return {
    type: CUSTOMER_CARE_DEAL_SUCCESS,
    isDealListGet: true,
    dealList: payload.data.pager.pageItems,
  };
}
function customerCareDealFailure(error) {
  return {
    type: CUSTOMER_CARE_DEAL_FAILURE,
    isDealListGet: false,
    error,
  };
}

// ---------------------------------------------
function physiologicalAxisRequest() {
  return {
    type: PHYSIOLOGICAL_AXIS_REQUEST,
    isPhysiologicalListGet: false,
  };
}
function physiologicalAxisSuccess(payload) {
  return {
    type: PHYSIOLOGICAL_AXIS_SUCCESS,
    isPhysiologicalListGet: true,
    physiologicalList: payload.data.pager.allResult,
  };
}
function physiologicalAxisFailure(error) {
  return {
    type: PHYSIOLOGICAL_AXIS_FAILURE,
    isPhysiologicalListGet: false,
    error,
  };
}

// ---------------------------------------------
function contactCustomerPercentRequest() {
  return {
    type: CONTACT_CUSTOMER_PERCENT_REQUEST,
    isContactListGet: false,
  };
}
function contactCustomerPercentSuccess(payload) {
  return {
    type: CONTACT_CUSTOMER_PERCENT_SUCCESS,
    isContactListGet: true,
    contactList: payload.data.pager.pageItems,
  };
}
function contactCustomerPercentFailure(error) {
  return {
    type: CONTACT_CUSTOMER_PERCENT_FAILURE,
    isContactListGet: false,
    error,
  };
}

// ---------------------------------------------
function customerCareCountRequest() {
  return {
    type: CUSTOMER_CARE_COUNT_REQUEST,
    isContactCustomerGet: false,
  };
}
function customerCareCountSuccess(payload) {
  return {
    type: CUSTOMER_CARE_COUNT_SUCCESS,
    isContactCustomerGet: true,
    lossCustomer: payload.data.pager.lossCustomer,
    contactCustomer: payload.data.pager.contactCustomer,
  };
}
function customerCareCountFailure(error) {
  return {
    type: CUSTOMER_CARE_COUNT_FAILURE,
    isContactCustomerGet: false,
    error,
  };
}

// ---------------------------------------------
function storeDealDetailRequest() {
  return {
    type: STORE_DEAL_DETAIL_REQUEST,
    isMonthDealDetailGet: false,
  };
}
function storeDealDetailSuccess(payload) {
  return {
    type: STORE_DEAL_DETAIL_SUCCESS,
    isMonthDealDetailGet: true,
    addCount: payload.data.pager.add,
    dealCount: payload.data.pager.trade,
    averageAmount: payload.data.pager.avg,
  };
}
function storeDealDetailFailure(error) {
  return {
    type: STORE_DEAL_DETAIL_FAILURE,
    isMonthDealDetailGet: false,
    error,
  };
}

// ---------------------------------------------
// 本月新增客户数

function addedCustomerRequest() {
  return {
    type: ADDED_CUSTOMER_REQUEST,
    isMonthAddGet: false,
  };
}
function addedCustomerSuccess(payload) {
  return {
    type: ADDED_CUSTOMER_SUCCESS,
    isMonthAddGet: true,
    thisMonthAdd: payload.data.pager.currentMonthResult,
    lastMonthAdd: payload.data.pager.lastMonthResult,
  };
}
function addedCustomerFailure(error) {
  return {
    type: ADDED_CUSTOMER_FAILURE,
    isMonthAddGet: false,
    error,
  };
}


// ---------------------------------------------
// 本月交易客户数

function dealedCustomerRequest() {
  return {
    type: DEALED_CUSTOMER_REQUEST,
    isMonthDealGet: false,
  };
}
function dealedCustomerSuccess(payload) {
  return {
    type: DEALED_CUSTOMER_SUCCESS,
    thisMonthDeal: payload.data.pager.currentMonthResult,
    isMonthDealGet: true,
    lastMonthDeal: payload.data.pager.lastMonthResult,
  };
}
function dealedCustomerFailure(error) {
  return {
    type: DEALED_CUSTOMER_FAILURE,
    isMonthDealGet: false,
    error,
  };
}

// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 20,
  currentPage: 1,
};

// 获得销售金额等级占比
export function fetchMainMonetaryLevel(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/month_spending_percentage.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
  return callApi(url, config, mainMonetaryLevelRequest, mainMonetaryLevelSuccess, mainMonetaryLevelFailure);
}


// 获得门店生理轴人群占比
export function fetchPhysiologicalAxis(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/month_customer_phyaxis_percentage.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
  return callApi(url, config, physiologicalAxisRequest, physiologicalAxisSuccess, physiologicalAxisFailure);
}

// 获得联系客户率占比
export function fetchContactCustomerPercent(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/guider_contact_rate_top_ten.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
  return callApi(url, config, contactCustomerPercentRequest, contactCustomerPercentSuccess, contactCustomerPercentFailure);
}

// // 获得联系客户率占比
// export function fetchCustomerCareCount(pager) {
//   const profile = loadIdToken();
//   const userId = profile.userId;
//   /* eslint max-len: [0] */
//   const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
//   const url = `${RESTFUL_SERVER}/crm/contact_and_loss_customer_num.json?token=${token}`;
//   const defalutPager = DEFAULT_QUERY_PARAMS;
//   const config = {
//     method: 'post',
//     mode: 'cors',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({}),
//   };
//   return callApi(url, config, customerCareCountRequest, customerCareCountSuccess, customerCareCountFailure);
// }

// 获得新增客户数
export function fetchAddedCustomer(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/month_store_new_customers.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
  return callApi(url, config, addedCustomerRequest, addedCustomerSuccess, addedCustomerFailure);
}


// 获得本月维护客户
export function fetchCustomerCareDeal(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/month_contact_task_rate_top.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      goodSn: pager,
    }),
  };
  return callApi(url, config, customerCareDealRequest, customerCareDealSuccess, customerCareDealFailure);
}

// 获得新增客户数
export function fetchDealedCustomer(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/month_store_trade_customers.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
  return callApi(url, config, dealedCustomerRequest, dealedCustomerSuccess, dealedCustomerFailure);
}

// 获得门店交易详情
export function fetchStoreDealDetail(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/month_store_trade_details.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
  return callApi(url, config, storeDealDetailRequest, storeDealDetailSuccess, storeDealDetailFailure);
}

