import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
 } from '../../utils/apiUtils';

// 联系进度
export const ORDER_CONTACT_REQUEST = 'ORDER_CONTACT_REQUEST';
export const ORDER_CONTACT_SUCCESS = 'ORDER_CONTACT_SUCCESS';
export const ORDER_CONTACT_FAILURE = 'ORDER_CONTACT_FAILURE';
export const ORDER_CONTACT_DETAIL_REQUEST = 'ORDER_CONTACT_DETAIL_REQUEST';
export const ORDER_CONTACT_DETAIL_SUCCESS = 'ORDER_CONTACT_DETAIL_SUCCESS';
export const ORDER_CONTACT_DETAIL_FAILURE = 'ORDER_CONTACT_DETAIL_FAILURE';

// 获取我的回访
export const MY_RELATIONS_REQUEST = 'MY_RELATIONS_REQUEST';
export const MY_RELATIONS_SUCCESS = 'MY_RELATIONS_SUCCESS';
export const MY_RELATIONS_FAILURE = 'MY_RELATIONS_FAILURE';

// 默认查询条件
function ordersCONTACTRequest(query) {
  return {
    type: ORDER_CONTACT_REQUEST,
    isFetching: true,
    query,
  };
}

/* eslint func-names: [0] */

function ordersCONTACTSuccess() {
  return function (payload) {
    // noinspection JSUnresolvedVariable
    return {
      type: ORDER_CONTACT_SUCCESS,
      contactInfo: payload.data.ContactProgressSummary,
    };
  };
}

function ordersCONTACTFailure(page) {
  return function (error) {
    return {
      type: ORDER_CONTACT_FAILURE,
      isFetching: false,
      error,
    };
  };
}

// 默认查询条件的详情
function ordersCONTACTDetailRequest(query) {
  return {
    type: ORDER_CONTACT_DETAIL_REQUEST,
    isFetching: true,
    query,
  };
}

/* eslint func-names: [0] */

function ordersCONTACTDetailSuccess() {
  return function (payload) {
    // noinspection JSUnresolvedVariable
    return {
      type: ORDER_CONTACT_DETAIL_SUCCESS,
      ContactProgressInfo: payload.data.ContactProgressInfo,
    };
  };
}

function ordersCONTACTDetailFailure(page) {
  return function (error) {
    return {
      type: ORDER_CONTACT_DETAIL_FAILURE,
      isFetching: false,
      error,
    };
  };
}

// 我的回访
function myRelationsRequest(query) {
  return {
    type: MY_RELATIONS_REQUEST,
    isRelationsGet: false,
    query,
  };
}

function myRelationsSuccess(payload) {
  return {
    type: MY_RELATIONS_SUCCESS,
    isRelationsGet: true,
    relationsList: payload.data.pageItems,
    pager: payload.data.pager,
  };
}

function myRelationsFailure(error) {
  return {
    type: MY_RELATIONS_FAILURE,
    isRelationsGet: false,
    error,
  };
}

// 获取用户回访
export function fetchMyRelations(type, status, currentPage, startDate, endDate) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_task_rule.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type,
      status,
      currentPage,
      startDate,
      endDate,
      pageSize: 10,
    }),
  };
  return callApi(url, config, myRelationsRequest, myRelationsSuccess, myRelationsFailure);
}

// 获得用户联系进度

export function fetchCustomerContactProgress(uid) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/customer/ContactProgressSummary.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mbOfflineId: uid,
    }),
  };
  return callApi(url, config, ordersCONTACTRequest(uid), ordersCONTACTSuccess(uid), ordersCONTACTFailure(uid));
}

// 获得用户联系进度详情

export function fetchCustomerContactProgressDetail(uid, time) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/customer/ContactProgressInfo.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mbOfflineId: uid,
      thisTime: time,
    }),
  };
  return callApi(url, config, ordersCONTACTDetailRequest(uid, time), ordersCONTACTDetailSuccess(uid, time), ordersCONTACTDetailFailure(uid, time));
}
