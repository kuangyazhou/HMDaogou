import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER } from '../../utils/apiUtils';

// 员工评级列表
export const LOGIN_COUNT_REQUEST = 'LOGIN_COUNT_REQUEST';
export const LOGIN_COUNT_SUCCESS = 'LOGIN_COUNT_SUCCESS';
export const LOGIN_COUNT_FAILURE = 'LOGIN_COUNT_FAILURE';

// ---------------------------------------------
function loginCountRequest() {
  return {
    type: LOGIN_COUNT_REQUEST,
    isLoginCountGet: false,
  };
}
function loginCountSuccess(payload) {
  return {
    type: LOGIN_COUNT_SUCCESS,
    isLoginCountGet: true,
    count: payload.data.pager.count,
    loginCount: payload.data.pager.loginCount,
    login: payload.data.pageItems.login,
    noLogin: payload.data.pageItems.nologin,
  };
}
function loginCountFailure(error) {
  return {
    type: LOGIN_COUNT_FAILURE,
    isLoginCountGet: false,
    error,
  };
}

// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 20,
  currentPage: 1,
};

// 获得门店销售数据
export function fetchLoginCount(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/manager/login_condition.json?token=${token}`;
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
  return callApi(url, config, loginCountRequest, loginCountSuccess, loginCountFailure);
}
