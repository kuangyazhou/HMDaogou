import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
} from '../../utils/apiUtils';

// 导购优惠券列表.
export const CUSTOMER_TASK_TYPE_REQUEST = 'CUSTOMER_TASK_TYPE_REQUEST';
export const CUSTOMER_TASK_TYPE_SUCCESS = 'CUSTOMER_TASK_TYPE_SUCCESS';
export const CUSTOMER_TASK_TYPE_FAILURE = 'CUSTOMER_TASK_TYPE_FAILURE';

export const CUSTOMER_GROWTH_TYPE_REQUEST = 'CUSTOMER_GROWTH_TYPE_REQUEST';
export const CUSTOMER_GROWTH_TYPE_SUCCESS = 'CUSTOMER_GROWTH_TYPE_SUCCESS';
export const CUSTOMER_GROWTH_TYPE_FAILURE = 'CUSTOMER_GROWTH_TYPE_FAILURE';

function customerDayTaskTypeRequest(query) {
  return {
    type: CUSTOMER_TASK_TYPE_REQUEST,
    query,
  };
}

/* eslint func-names: [0] */
function customerDayTaskTypeSuccess() {
  return function (payload) {
    return {
      type: CUSTOMER_TASK_TYPE_SUCCESS,
      dayTaskType: payload.data.pageItems,
    };
  };
}

/* eslint func-names: [0] */
function customerDayTaskTypeFailure(page) {
  return function (error) {
    return {
      type: CUSTOMER_TASK_TYPE_FAILURE,
      error,
    };
  };
}

function customerGrowthTypeRequest(query) {
  return {
    type: CUSTOMER_GROWTH_TYPE_REQUEST,
    query,
  };
}

/* eslint func-names: [0] */
function customerGrowthTypeSuccess() {
  return function (payload) {
    return {
      type: CUSTOMER_GROWTH_TYPE_SUCCESS,
      growthType: payload.data.pageItems,
    };
  };
}

/* eslint func-names: [0] */
function customerGrowthTypeFailure(page) {
  return function (error) {
    return {
      type: CUSTOMER_GROWTH_TYPE_FAILURE,
      error,
    };
  };
}


// 获得销售机会数量
export function fetchCustomerDayTaskType() {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_day_task_type.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
  return callApi(url, config, customerDayTaskTypeRequest(), customerDayTaskTypeSuccess(), customerDayTaskTypeFailure());
}

// 获得成长关怀内容
export function fetchCustomerGrowthType() {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_day_task_grow.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
  return callApi(url, config, customerGrowthTypeRequest(), customerGrowthTypeSuccess(), customerGrowthTypeFailure());
}
