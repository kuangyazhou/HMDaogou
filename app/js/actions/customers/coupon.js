import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
 } from '../../utils/apiUtils';

// 导购优惠券列表.
export const CUSTOMER_COUPON_LIST_REQUEST = 'CUSTOMER_COUPON_LIST_REQUEST';
export const CUSTOMER_COUPON_LIST_SUCCESS = 'CUSTOMER_COUPON_LIST_SUCCESS';
export const CUSTOMER_COUPON_LIST_FAILURE = 'CUSTOMER_COUPON_LIST_FAILURE';

// 默认查询条件
export const DEFAULT_QUERY_PARAM = {
  pageSize: 15,
  currentPage: 1,
};

function customerRequest(query) {
  return {
    type: CUSTOMER_COUPON_LIST_REQUEST,
    query,
  };
}

/* eslint func-names: [0] */
function customerSuccess() {
  return function (payload) {
    return {
      type: CUSTOMER_COUPON_LIST_SUCCESS,
      pager: payload.data.pager,
      coupons: payload.data.pageItems,
    };
  };
}

/* eslint func-names: [0] */
function customerFailure(page) {
  return function (error) {
    return {
      type: CUSTOMER_COUPON_LIST_FAILURE,
      pager: page,
      error,
    };
  };
}

// 获得代购优惠券
export function fetchCoupons() {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/MarketingCheck/GuiderbonusList.json?token=${token}`;
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
    }),
  };
  return callApi(url, config, customerRequest(userId), customerSuccess(userId), customerFailure(userId));
}
