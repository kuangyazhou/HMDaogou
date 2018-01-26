/* eslint func-names: [0] */

import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
} from '../../utils/apiUtils';

// 导购营销原因
export const MARKETING_REASON_REQUEST = 'MARKETING_REASON_REQUEST';
export const MARKETING_REASON_SUCCESS = 'MARKETING_REASON_SUCCESS';
export const MARKETING_REASON_FAILURE = 'MARKETING_REASON_FAILURE';

// 导购营销申请
export const ADD_MARKETING_REQUEST = 'ADD_MARKETING_REQUEST';
export const ADD_MARKETING_SUCCESS = 'ADD_MARKETING_SUCCESS';
export const ADD_MARKETING_FAILURE = 'ADD_MARKETING_FAILURE';

// 导购营销申请列表
export const MARKETING_LIST_REQUEST = 'MARKETING_LIST_REQUEST';
export const MARKETING_LIST_SUCCESS = 'MARKETING_LIST_SUCCESS';
export const MARKETING_LIST_FAILURE = 'MARKETING_LIST_FAILURE';

// 发送优惠卷
export const MARKETING_SEND_COUPON_REQUEST = 'MARKETING_SEND_COUPON_REQUEST';
export const MARKETING_SEND_COUPON_SUCCESS = 'MARKETING_SEND_COUPON_SUCCESS';
export const MARKETING_SEND_COUPON_FAILURE = 'MARKETING_SEND_COUPON_FAILURE';

// 默认查询条件
export const DEFAULT_QUERY_PARAM = {
  pageSize: 15,
  currentPage: 1,
};

function sendMarketingCouponRequest() {
  return {
    type: MARKETING_SEND_COUPON_REQUEST,
    isSmsSended: false,
  };
}
function sendMarketingCouponSuccess(payload) {
  return {
    type: MARKETING_SEND_COUPON_SUCCESS,
    smsReturnCode: payload.code,
    isSmsSended: true,
  };
}
function sendMarketingCouponFailure(error) {
  return {
    type: MARKETING_SEND_COUPON_FAILURE,
    isSmsSended: false,
    error,
  };
}

function marketingListRequest(query) {
  return {
    type: MARKETING_LIST_REQUEST,
    isFetching: true,
    query,
  };
}
function marketingListSuccess() {
  return function (payload) {
    return {
      type: MARKETING_LIST_SUCCESS,
      pager: payload.data.pager,
      marketings: payload.data.pageItems,
      isFetching: false,
    };
  };
}
function marketingListFailure(page) {
  return function (error) {
    return {
      type: MARKETING_LIST_FAILURE,
      isFetching: false,
      error,
    };
  };
}

function addMarketingRequest(query) {
  return {
    type: ADD_MARKETING_REQUEST,
    isReasonFetching: false,
    query,
  };
}
function addMarketingSuccess() {
  return function (payload) {
    return {
      type: ADD_MARKETING_SUCCESS,
      reasonCode: payload.code,
      isReasonFetching: true,
    };
  };
}
function addMarketingFailure(page) {
  return function (error) {
    return {
      type: ADD_MARKETING_FAILURE,
      isReasonFetching: false,
      error,
    };
  };
}

function marketingReasonRequest(query) {
  return {
    type: MARKETING_REASON_REQUEST,
    isFetching: true,
    query,
  };
}
function marketingReasonSuccess() {
  return function (payload) {
    return {
      type: MARKETING_REASON_SUCCESS,
      isFetching: false,
      pager: payload.data.pager,
      reasons: payload.data.pageItems,
    };
  };
}
function marketingReasonFailure(page) {
  return function (error) {
    return {
      type: MARKETING_REASON_FAILURE,
      isFetching: false,
      error,
    };
  };
}

// 发送优惠卷给客户.
/* eslint max-len: [0] */
export function postSendCoupon(offlineId, bonusId, selectedCounts, bonusName) {
  const profile = loadIdToken();
  const userId = profile.userId;
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/MarketingCheck/sendBonus.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      card_no: offlineId, // userId
      bonus_id: bonusId,
      num: selectedCounts.join(','),
      // guider_id: guiderId,
      bonus_name: bonusName,
    }),
  };
  return callApi(url, config, sendMarketingCouponRequest, sendMarketingCouponSuccess, sendMarketingCouponFailure);
}

// 发送请求获得导购营销列表.
/* eslint max-len: [0] */
export function fetchMarketings(memberOfflineId) {
  const profile = loadIdToken();
  const userId = profile.userId;
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/MarketingCheck/MarketingCheckList.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      card_no: memberOfflineId,
    }),
  };
  return callApi(url, config, marketingListRequest(memberOfflineId), marketingListSuccess(userId), marketingListFailure(userId));
}

// 发送导购营销申请
/* eslint max-len: [0] */
export function postAddMarketing(memberOfflineId, note, reason) {
  const profile = loadIdToken();
  const userId = profile.userId;
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/MarketingCheck/addMarketingCheck.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      offline_id: memberOfflineId,
      reason: reason.join(','),
      remark: note,
    }),
  };
  return callApi(url, config, addMarketingRequest(userId), addMarketingSuccess(userId), addMarketingFailure(userId));
}

// 获得营销原因列表
/* eslint max-len: [0] */
export function fetchMarketingReasons() {
  const profile = loadIdToken();
  const userId = profile.userId;
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/MarketingCheck/MarketingApplyReasonList.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
  return callApi(url, config, marketingReasonRequest(userId), marketingReasonSuccess(userId), marketingReasonFailure(userId));
}
