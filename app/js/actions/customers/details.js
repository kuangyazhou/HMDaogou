import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
 } from '../../utils/apiUtils';

 // 我的客户详情
export const CUSTOMER_DETAIL_REQUEST = 'CUSTOMER_DETAIL_REQUEST';
export const CUSTOMER_DETAIL_SUCCESS = 'CUSTOMER_DETAIL_SUCCESS';
export const CUSTOMER_DETAIL_FAILURE = 'CUSTOMER_DETAIL_FAILURE';
export const CUSTOMER_DETAIL_RESET = 'CUSTOMER_DETAIL_RESET';

// 我的客户营销推荐
export const CUSTOMER_ORDER_CATEGORY_REQUEST = 'CUSTOMER_ORDER_CATEGORY_REQUEST';
export const CUSTOMER_ORDER_CATEGORY_SUCCESS = 'CUSTOMER_ORDER_CATEGORY_SUCCESS';
export const CUSTOMER_ORDER_CATEGORY_FAILURE = 'CUSTOMER_ORDER_CATEGORY_FAILURE';

// 客户验证码查询
export const CUSTOMER_CAPTCHA_LIST_REQUEST = 'CUSTOMER_CAPTCHA_LIST_REQUEST';
export const CUSTOMER_CAPTCHA_LIST_SUCCESS = 'CUSTOMER_CAPTCHA_LIST_SUCCESS';
export const CUSTOMER_CAPTCHA_LIST_FAILURE = 'CUSTOMER_CAPTCHA_LIST_FAILURE';
export const CUSTOMER_CAPTCHA_LIST_RESET = 'CUSTOMER_CAPTCHA_LIST_RESET';

// actions for Customer categories.
function customerOrderCategoriesRequest(query) {
  return {
    type: CUSTOMER_ORDER_CATEGORY_REQUEST,
    isCatching: false,
    query,
  };
}
function customerOrderCategoriesSuccess() {
  return function exec(payload) {
    return {
      type: CUSTOMER_ORDER_CATEGORY_SUCCESS,
      isCatching: true,
      pager: payload.data.pager,
      customers: payload.data.pageItems,
    };
  };
}
function customerOrderCategoriesFailure(page) {
  return function exec(error) {
    return {
      type: CUSTOMER_ORDER_CATEGORY_FAILURE,
      isCatching: false,
      pager: page,
      error,
    };
  };
}

function customerCaptchalistRequest(query) {
  return {
    type: CUSTOMER_CAPTCHA_LIST_REQUEST,
    query,
  };
}
function customerCaptchalistSuccess(payload) {
  return {
    type: CUSTOMER_CAPTCHA_LIST_SUCCESS,
    captchaList: payload.data,
  };
}
function customerCaptchalistFailure(error) {
  return {
    type: CUSTOMER_CAPTCHA_LIST_FAILURE,
    error,
  };
}

function customerCaptchalistReset(error) {
  return {
    type: CUSTOMER_CAPTCHA_LIST_RESET,
    captchaList: '',
    error,
  };
}

// Actions.
function customerDetailRequest(query) {
  return {
    type: CUSTOMER_DETAIL_REQUEST,
    isDetailsGet: false,
    query,
  };
}

function customerDetailSuccess(payload) {
  return {
    type: CUSTOMER_DETAIL_SUCCESS,
    isDetailsGet: true,
    data: payload.data,
  };
}

function customerDetailFailure(error) {
  return {
    type: CUSTOMER_DETAIL_FAILURE,
    isDetailsGet: false,
    error,
  };
}

function customerDetailReset(error) {
  return {
    type: CUSTOMER_DETAIL_RESET,
    isDetailsGet: false,
    data: null,
  };
}

// 重置客户信息
export function resetMyMember() {
  return (dispatch) => {
    dispatch(customerDetailReset());
  };
}

export function resetCaptchaList() {
  return (dispatch) => {
    dispatch(customerCaptchalistReset());
  };
}

// 请求获得我的客户的详细信息(客户管理)
export function queryCustomerCaptchaList(mobile) {
  const profile = loadIdToken();
  /* eslint max-len: [0] */
  const storeCode = profile.storeCode;
  const config = {
    method: 'get',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return callApi(`${RESTFUL_SERVER}/sms/get_sms_verificationcode.json?mobile=${mobile}&storeCode=${storeCode}`,
    config,
    customerCaptchalistRequest,
    customerCaptchalistSuccess,
    customerCaptchalistFailure
  );
}

// 请求获得我的客户的详细信息(客户管理)
export function getMyMember(memberOfflineId, taskType) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const config = {
    method: 'get',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return callApi(`${RESTFUL_SERVER}/crm/customer/customer_detail.json?token=${token}&memberOfflineId=${memberOfflineId}&taskType=${taskType}`,
    config,
    customerDetailRequest(userId),
    customerDetailSuccess,
    customerDetailFailure
  );
}

// 获得用户雷达图数据
export function fetchCustomerOrderCategories(userId, name) {
  const profile = loadIdToken();
  const uid = profile.userId;
  /* eslint max-len: [0] */
  const token = `${uid},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/customer/customer_order_cat_list_new.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pageSize: 15,
      currentPage: 1,
      userId,
      name,
    }),
  };
  return callApi(url,
    config,
    customerOrderCategoriesRequest(userId),
    customerOrderCategoriesSuccess(userId),
    customerOrderCategoriesFailure(userId)
  );
}

