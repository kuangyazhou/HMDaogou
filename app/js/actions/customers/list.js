import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
 } from '../../utils/apiUtils';

// 我的客户列表
export const SELECT_CUSTOMER_PAGE = 'SELECT_CUSTOMER_PAGE';
export const INVALIDATE_CUSTOMER_PAGE = 'INVALIDATE_CUSTOMER_PAGE';

export const CUSTOMER_REQUEST = 'CUSTOMER_REQUEST';
export const CUSTOMER_SUCCESS = 'CUSTOMER_SUCCESS';
export const CUSTOMER_FAILURE = 'CUSTOMER_FAILURE';
export const CUSTOMER_RESET = 'CUSTOMER_RESET';

// 拨打电话的action
export const CUSTOMER_CALL_REQUEST = 'CUSTOMER_CALL_REQUEST';
export const CUSTOMER_CALL_SUCCESS = 'CUSTOMER_CALL_SUCCESS';
export const CUSTOMER_CALL_FAILURE = 'CUSTOMER_CALL_FAILURE';

export const CUSTOMER_CALL_RECORD_REQUEST = 'CUSTOMER_CALL_RECORD_REQUEST';
export const CUSTOMER_CALL_RECORD_SUCCESS = 'CUSTOMER_CALL_RECORD_SUCCESS';
export const CUSTOMER_CALL_RECORD_FAILURE = 'CUSTOMER_CALL_RECORD_FAILURE';

export const CUSTOMER_THIRD_PARTY_CALL_REQUEST = 'CUSTOMER_THIRD_PARTY_CALL_REQUEST';
export const CUSTOMER_THIRD_PARTY_CALL_SUCCESS = 'CUSTOMER_THIRD_PARTY_CALL_SUCCESS';
export const CUSTOMER_THIRD_PARTY_CALL_FAILURE = 'CUSTOMER_THIRD_PARTY_CALL_FAILURE';

// 默认查询条件
export const DEFAULT_QUERY_PARAM = {
  pageSize: 15,
  currentPage: 1,
};

export function selectCustomerPage(query) {
  return {
    type: SELECT_CUSTOMER_PAGE,
    query,
  };
}
export function invalidateCustomerPage(query) {
  return {
    type: INVALIDATE_CUSTOMER_PAGE,
    query,
  };
}
function customerRequest(query) {
  return {
    type: CUSTOMER_REQUEST,
    query,
  };
}

// This is a curried function that takes page as argument,
// and expects payload as argument to be passed upon API call success.
/* eslint func-names: [0] */
function customerSuccess() {
  return function (payload) {
    // noinspection JSUnresolvedVariable
    return {
      type: CUSTOMER_SUCCESS,
      pager: payload.data.pager,
      customers: payload.data.pageItems,
    };
  };
}

// This is a curried function that takes page as argument,
// and expects error as argument to be passed upon API call failure.
/* eslint func-names: [0] */
function customerFailure(page) {
  return function (error) {
    return {
      type: CUSTOMER_FAILURE,
      pager: page,
      error,
    };
  };
}

function customersReset() {
  return {
    type: CUSTOMER_RESET,
    pager: DEFAULT_QUERY_PARAM,
    customers: [],
  };
}

// 拨打电话的action
function customerCallRequest(query) {
  return {
    type: CUSTOMER_CALL_REQUEST,
    query,
  };
}

function customerCallSuccess(payload, successFN) {
  return {
    type: CUSTOMER_CALL_SUCCESS,
    callRecord: payload.data.callRecord,
  };
}

function customerCallFailure(error) {
  return {
    type: CUSTOMER_CALL_FAILURE,
    error,
  };
}

// 电话的记录action
function customerCallRecordRequest(query) {
  return {
    type: CUSTOMER_CALL_RECORD_REQUEST,
    query,
  };
}

function customerCallRecordSuccess(payload) {
  return {
    type: CUSTOMER_CALL_RECORD_SUCCESS,
    code: payload.code,
  };
}

function customerCallRecordFailure(error) {
  return {
    type: CUSTOMER_CALL_RECORD_FAILURE,
    error,
  };
}

// 通过第三方拨打电话
function customerThirdPartyCallRequest(query) {
  return {
    type: CUSTOMER_THIRD_PARTY_CALL_REQUEST,
    isFetching: false,
    query,
  };
}

function customerThirdPartyCallSuccess(payload) {
  return {
    type: CUSTOMER_THIRD_PARTY_CALL_SUCCESS,
    isFetching: true,
    returnCode: payload.code,
    errorMsg: payload.errMsg,
  };
}

function customerThirdPartyCallFailure(error) {
  return {
    type: CUSTOMER_THIRD_PARTY_CALL_FAILURE,
    isFetching: false,
    error,
  };
}

// 由于是简单的接口, 故而没有纳入到redux的体系中.
export function fetchPhoneCall(memberId, taskRuleType) {
  const profile = loadIdToken();
  const userId = profile.userId;
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/customer/customer_call.json?token=${token}&memberOfflineId=${memberId}&taskRuleType=${taskRuleType}`;
  const config = {
    method: 'get',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  return callApi(url,
    config,
    customerCallRequest(userId),
    customerCallSuccess,
    customerCallFailure
  );
}

// 拨打电话备注
export function postCustomerCallRecord(id, recordContent) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      recordContent,
    }),
  };

  return callApi(`${RESTFUL_SERVER}/crm/customer/updateCustomer_call.json?token=${token}`,
    config,
    customerCallRecordRequest(id, recordContent),
    customerCallRecordSuccess,
    customerCallRecordFailure
  );
}

// 通过第三方拨打电话
// export function postThirdPartyCall(id) {
//   const profile = loadIdToken();
//   const userId = profile.userId;
//   /* eslint max-len: [0] */
//   const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
//   const config = {
//     method: 'post',
//     mode: 'cors',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       offline_id: id,
//     }),
//   };

//   return callApi(`${RESTFUL_SERVER}/crm/callBack/callBack.json?token=${token}`,
//     config,
//     customerThirdPartyCallRequest(id),
//     customerThirdPartyCallSuccess,
//     customerThirdPartyCallFailure
//   );
// }
// 离开客户列表模块时, 需要重置State.
export function resetCustomers() {
  return (dispatch) => {
    dispatch(customersReset());
  };
}

// 获得用户数据
export function fetchCustomers(query) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/customer/customer_list_new.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  };
  return callApi(url, config, customerRequest(query), customerSuccess(query), customerFailure(query));
}

// 获得首页用户数据.
export function fetchTopCustomers() {
  return (dispatch, getState) => {
    dispatch(fetchCustomers(DEFAULT_QUERY_PARAM));
  };
}
