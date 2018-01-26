import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
 } from '../../utils/apiUtils';

 // 我的客户列表
export const SELECT_ORDERS_PAGE = 'SELECT_ORDERS_PAGE';
export const INVALIDATE_ORDERS_PAGE = 'INVALIDATE_ORDERS_PAGE';

export const ORDERS_REQUEST = 'ORDERS_REQUEST';
export const ORDERS_SUCCESS = 'ORDERS_SUCCESS';
export const ORDERS_FAILURE = 'ORDERS_FAILURE';

// 客户消费信息
export const ORDER_INFO_REQUEST = 'ORDER_INFO_REQUEST';
export const ORDER_INFO_SUCCESS = 'ORDER_INFO_SUCCESS';
export const ORDER_INFO_FAILURE = 'ORDER_INFO_FAILURE';

// 默认查询条件
export const DEFAULT_QUERY_PARAM = {
  pageSize: 20,
  currentPage: 1,
};

export function selectOrdersPage(query) {
  return {
    type: ORDERS_REQUEST,
    query,
  };
}
export function invalidateOrdersPage(query) {
  return {
    type: INVALIDATE_ORDERS_PAGE,
    query,
  };
}

function ordersInfoRequest(query) {
  return {
    type: ORDER_INFO_REQUEST,
    isFetching: true,
    query,
  };
}
/* eslint func-names: [0] */
function ordersInfoSuccess() {
  return function (payload) {
    // noinspection JSUnresolvedVariable
    return {
      type: ORDER_INFO_SUCCESS,
      isFetching: false,
      pager: payload.data.pager,
      ordersinfo: payload.data.pageItems,
    };
  };
}
/* eslint func-names: [0] */
function ordersInfoFailure(page) {
  return function (error) {
    return {
      type: ORDER_INFO_FAILURE,
      isFetching: false,
      error,
    };
  };
}

function ordersRequest(query) {
  return {
    type: ORDERS_REQUEST,
    query,
  };
}
/* eslint func-names: [0] */
function ordersSuccess() {
  return function (payload) {
    // noinspection JSUnresolvedVariable
    return {
      type: ORDERS_SUCCESS,
      pager: payload.data.pager,
      orders: payload.data.pageItems,
    };
  };
}
/* eslint func-names: [0] */
function ordersFailure(page) {
  return function (error) {
    return {
      type: ORDERS_FAILURE,
      pager: page,
      error,
    };
  };
}

// 获得用户消费统计
export function fetchOrdersInfo(uid) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/customer/customer_order_info.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: uid,
    }),
  };
  return callApi(url, config, ordersInfoRequest(uid), ordersInfoSuccess(uid), ordersInfoFailure(uid));
}

// 获得用户订单数据
export function fetchOrders(query, keyword) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/customer/customer_order_list.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: query,
      orderId: keyword || '',
    }),
  };
  return callApi(url, config, ordersRequest(query), ordersSuccess(query), ordersFailure(query));
}

