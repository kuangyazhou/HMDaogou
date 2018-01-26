import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
 } from '../../utils/apiUtils';

 // 客户投诉列表请求
export const CUSTOMER_COMPILATION_REQUEST = 'CUSTOMER_COMPILATION_REQUEST';
export const CUSTOMER_COMPILATION_SUCCESS = 'CUSTOMER_COMPILATION_SUCCESS';
export const CUSTOMER_COMPILATION_FAILURE = 'CUSTOMER_COMPILATION_FAILURE';

// Actions.
function customerCompilationRequest(query) {
  return {
    type: CUSTOMER_COMPILATION_REQUEST,
    query,
  };
}

function customerCompilationSuccess(payload) {
  return {
    type: CUSTOMER_COMPILATION_SUCCESS,
    pager: payload.data.pager,
    compilations: payload.data.pageItems,
  };
}

function customerCompilationFailure(error) {
  return {
    type: CUSTOMER_COMPILATION_FAILURE,
    error,
  };
}

// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 20,
  currentPage: 1,
};

// 请求获得我的客户的信息(客户管理)
export function fetchCustomerCompilations(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  const defalutPager = DEFAULT_QUERY_PARAMS;
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
      pageSize: pager ? pager.pageSize : defalutPager.pageSize,
      currentPage: pager ? pager.currentPage : defalutPager.currentPage,
    }),
  };

  return callApi(`${RESTFUL_SERVER}/crm/complaints_suggestion_list.json?token=${token}`,
    config,
    customerCompilationRequest(userId),
    customerCompilationSuccess,
    customerCompilationFailure
  );
}
