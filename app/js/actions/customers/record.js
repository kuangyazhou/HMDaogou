import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
 } from '../../utils/apiUtils';

  // 填写客户备注
export const CUSTOMER_WRITE_RECORD_REQUEST = 'CUSTOMER_WRITE_RECORD_REQUEST';
export const CUSTOMER_WRITE_RECORD_SUCCESS = 'CUSTOMER_WRITE_RECORD_SUCCESS';
export const CUSTOMER_WRITE_RECORD_FAILURE = 'CUSTOMER_WRITE_RECORD_FAILURE';

 // 客户备注列表
export const CUSTOMER_RECORD_PAGER_REQUEST = 'CUSTOMER_RECORD_PAGER_REQUEST';
export const CUSTOMER_RECORD_PAGER_SUCCESS = 'CUSTOMER_RECORD_PAGER_SUCCESS';
export const CUSTOMER_RECORD_PAGER_FAILURE = 'CUSTOMER_RECORD_PAGER_FAILURE';

// Actions.
function customerWriteRecordRequest(query) {
  return {
    type: CUSTOMER_WRITE_RECORD_REQUEST,
    query,
  };
}

function customerWriteRecordSuccess(payload) {
  return {
    type: CUSTOMER_WRITE_RECORD_SUCCESS,
    code: payload.code,
  };
}

function customerWriteRecordFailure(error) {
  return {
    type: CUSTOMER_WRITE_RECORD_FAILURE,
    error,
  };
}

// Actions.
function customerRecordPagerRequest(query) {
  return {
    type: CUSTOMER_RECORD_PAGER_REQUEST,
    query,
  };
}

function customerRecordPagerSuccess(payload) {
  return {
    type: CUSTOMER_RECORD_PAGER_SUCCESS,
    pager: payload.data.pager,
    records: payload.data.pageItems,
  };
}

function customerRecordPagerFailure(error) {
  return {
    type: CUSTOMER_RECORD_PAGER_FAILURE,
    error,
  };
}

// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 20,
  currentPage: 1,
};

// 提交用户评论信息.
export function postCustomerRecord(memberId, comment) {
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
      memberId,
      recordContent: comment,
    }),
  };

  return callApi(`${RESTFUL_SERVER}/crm/customer/record_add.json?token=${token}`,
    config,
    customerWriteRecordRequest(comment),
    customerWriteRecordSuccess,
    customerWriteRecordFailure
  );
}

// 获取指定用户ID的备注信息.
export function fetchCustomerRecords(memberId, pager) {
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
      memberId,
      pageSize: pager ? pager.pageSize : defalutPager.pageSize,
      currentPage: pager ? pager.currentPage : defalutPager.currentPage,
    }),
  };

  return callApi(`${RESTFUL_SERVER}/crm/customer/record_list.json?token=${token}`,
    config,
    customerRecordPagerRequest(memberId),
    customerRecordPagerSuccess,
    customerRecordPagerFailure
  );
}
