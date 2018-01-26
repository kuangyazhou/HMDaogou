import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
} from '../../utils/apiUtils';

// 员工日客情维护任务完成
export const STAFF_TASK_REQUEST = 'STAFF_TASK_REQUEST';
export const STAFF_TASK_SUCCESS = 'STAFF_TASK_SUCCESS';
export const STAFF_TASK_FAILURE = 'STAFF_TASK_FAILURE';

// 员工月客情维护任务完成
export const MONTH_STAFF_TASK_REQUEST = 'MONTH_STAFF_TASK_REQUEST';
export const MONTH_STAFF_TASK_SUCCESS = 'MONTH_STAFF_TASK_SUCCESS';
export const MONTH_STAFF_TASK_FAILURE = 'MONTH_STAFF_TASK_FAILURE';

export const STAFF_SALE_CHANGCE_REQUEST = 'STAFF_SALE_CHANGCE_REQUEST';
export const STAFF_SALE_CHANGCE_SUCCESS = 'STAFF_SALE_CHANGCE_SUCCESS';
export const STAFF_SALE_CHANGCE_FAILURE = 'STAFF_SALE_CHANGCE_FAILURE';

export const STAFF_SALE_CHANGCE_DETAIL_REQUEST = 'STAFF_SALE_CHANGCE_DETAIL_REQUEST';
export const STAFF_SALE_CHANGCE_DETAIL_SUCCESS = 'STAFF_SALE_CHANGCE_DETAIL_SUCCESS';
export const STAFF_SALE_CHANGCE_DETAIL_FAILURE = 'STAFF_SALE_CHANGCE_DETAIL_FAILURE';
export const STAFF_SALE_CHANGCE_DETAIL_RESET = 'STAFF_SALE_CHANGCE_DETAIL_RESET';

export const STAFF_NEW_CUSTOMER_REQUEST = 'STAFF_NEW_CUSTOMER_REQUEST';
export const STAFF_NEW_CUSTOMER_SUCCESS = 'STAFF_NEW_CUSTOMER_SUCCESS';
export const STAFF_NEW_CUSTOMER_FAILURE = 'STAFF_NEW_CUSTOMER_FAILURE';

export const STAFF_MONTH_NEW_CUSTOMER_REQUEST = 'STAFF_MONTH_NEW_CUSTOMER_REQUEST';
export const STAFF_MONTH_NEW_CUSTOMER_SUCCESS = 'STAFF_MONTH_NEW_CUSTOMER_SUCCESS';
export const STAFF_MONTH_NEW_CUSTOMER_FAILURE = 'STAFF_MONTH_NEW_CUSTOMER_FAILURE';

export const MONTH_SALE_CHANGCE_GUIDER_REQUEST = 'MONTH_SALE_CHANGCE_GUIDER_REQUEST';
export const MONTH_SALE_CHANGCE_GUIDER_SUCCESS = 'MONTH_SALE_CHANGCE_GUIDER_SUCCESS';
export const MONTH_SALE_CHANGCE_GUIDER_FAILURE = 'MONTH_SALE_CHANGCE_GUIDER_FAILURE';
export const MONTH_SALE_CHANGCE_GUIDER_RESET = 'MONTH_SALE_CHANGCE_GUIDER_RESET';

export const MONTH_SALE_CHANGCE_STORE_REQUEST = 'MONTH_SALE_CHANGCE_STORE_REQUEST';
export const MONTH_SALE_CHANGCE_STORE_SUCCESS = 'MONTH_SALE_CHANGCE_STORE_SUCCESS';
export const MONTH_SALE_CHANGCE_STORE_FAILURE = 'MONTH_SALE_CHANGCE_STORE_FAILURE';

export const STAFF_MONTH_CONTACT_REQUEST = 'STAFF_MONTH_CONTACT_REQUEST';
export const STAFF_MONTH_CONTACT_SUCCESS = 'STAFF_MONTH_CONTACT_SUCCESS';
export const STAFF_MONTH_CONTACT_FAILURE = 'STAFF_MONTH_CONTACT_FAILURE';

// ---------------------------------------------
function monthSaleChangceGuiderRequest() {
  return {
    type: MONTH_SALE_CHANGCE_GUIDER_REQUEST,
    ismonthSaleChangceGuiderGet: false,
  };
}

function monthSaleChangceGuiderSuccess(payload) {
  return {
    type: MONTH_SALE_CHANGCE_GUIDER_SUCCESS,
    ismonthSaleChangceGuiderGet: true,
    monthSaleChangceDetail: payload.data.pageItems,
  };
}

function monthSaleChangceGuiderFailure() {
  return {
    type: MONTH_SALE_CHANGCE_GUIDER_FAILURE,
    ismonthSaleChangceGuiderGet: false,
  };
}

function monthSaleChangceGuiderReset() {
  return {
    type: MONTH_SALE_CHANGCE_GUIDER_RESET,
    monthSaleChangceDetail: [],
    ismonthSaleChangceGuiderGet: false,
  };
}

export function resetMonthSaleChangceGuider() {
  return (dispatch) => {
    dispatch(monthSaleChangceGuiderReset());
  };
}

// ---------------------------------------------
function staffMonthContactRequest() {
  return {
    type: STAFF_MONTH_CONTACT_REQUEST,
    isStaffMonthContactGet: false,
  };
}

function staffMonthContactSuccess(payload) {
  return {
    type: STAFF_MONTH_CONTACT_SUCCESS,
    isStaffMonthContactGet: true,
    staffMonthContact: payload.data.pageItems,
    staffMonthContactTotal: payload.data.pager,
  };
}

function staffMonthContactFailure() {
  return {
    type: STAFF_MONTH_CONTACT_FAILURE,
    isStaffMonthContactGet: false,
  };
}

// ---------------------------------------------
function monthSaleChangceStoreRequest() {
  return {
    type: MONTH_SALE_CHANGCE_STORE_REQUEST,
    ismonthSaleChangceStoreGet: false,
  };
}

function monthSaleChangceStoreSuccess(payload) {
  return {
    type: MONTH_SALE_CHANGCE_STORE_SUCCESS,
    ismonthSaleChangceStoreGet: true,
    monthSaleChangce: payload.data.pageItems,
  };
}

function monthSaleChangceStoreFailure() {
  return {
    type: MONTH_SALE_CHANGCE_STORE_FAILURE,
    ismonthSaleChangceStoreGet: false,
  };
}

// ---------------------------------------------
function staffNewCustomerRequest() {
  return {
    type: STAFF_NEW_CUSTOMER_REQUEST,
    isStaffNewCustomerGet: false,
  };
}
function staffNewCustomerSuccess(payload) {
  return {
    type: STAFF_NEW_CUSTOMER_SUCCESS,
    isStaffNewCustomerGet: true,
    newCustomerCount: payload.data.pager.count,
    newCustomerList: payload.data.pageItems,
  };
}
function staffNewCustomerFailure(error) {
  return {
    type: STAFF_NEW_CUSTOMER_FAILURE,
    isStaffNewCustomerGet: false,
    error,
  };
}

// ---------------------------------------------
function staffMonthNewCustomerRequest() {
  return {
    type: STAFF_MONTH_NEW_CUSTOMER_REQUEST,
    isStaffMonthNewCustomerGet: false,
  };
}
function staffMonthNewCustomerSuccess(payload) {
  return {
    type: STAFF_MONTH_NEW_CUSTOMER_SUCCESS,
    isStaffMonthNewCustomerGet: true,
    hadDevelopedCustomer: payload.data.pager.pageItems[0].completePerformance,
    developTarget: payload.data.pager.pageItems[0].points,
    developCustomerList: payload.data.pager.pageItems,
  };
}
function staffMonthNewCustomerFailure(error) {
  return {
    type: STAFF_MONTH_NEW_CUSTOMER_FAILURE,
    isStaffMonthNewCustomerGet: false,
    error,
  };
}

// ---------------------------------------------
function staffTaskRequest() {
  return {
    type: STAFF_TASK_REQUEST,
    isTodayTaskGet: false,
  };
}
function staffTaskSuccess(payload) {
  return {
    type: STAFF_TASK_SUCCESS,
    isTodayTaskGet: true,
    completeCount: payload.data.pager.totCountAndCompleteCount[0].molecule,
    totalCount: payload.data.pager.totCountAndCompleteCount[0].denominator,
    finished: payload.data.pager.pageItems.finished,
  };
}
function staffTaskFailure(error) {
  return {
    type: STAFF_TASK_FAILURE,
    isTodayTaskGet: false,
    error,
  };
}

// ---------------------------------------------
function monthStaffTaskRequest() {
  return {
    type: MONTH_STAFF_TASK_REQUEST,
    isStaffCompleteListGet: false,
  };
}
function monthStaffTaskSuccess(payload) {
  return {
    type: MONTH_STAFF_TASK_SUCCESS,
    isStaffCompleteListGet: true,
    staffCompleteList: payload.data.pager.list,
    totalCount: payload.data.pager.count,
    totalCompleteCount: payload.data.pager.completeCount,
    totalPercent: payload.data.pager.percent,
  };
}
function monthStaffTaskFailure(error) {
  return {
    type: MONTH_STAFF_TASK_FAILURE,
    isStaffCompleteListGet: false,
    error,
  };
}


// ---------------------------------------------
function staffSaleChangceRequest() {
  return {
    type: STAFF_SALE_CHANGCE_REQUEST,
    isSaleChangceGet: false,
  };
}
function staffSaleChangceSuccess(payload) {
  return {
    type: STAFF_SALE_CHANGCE_SUCCESS,
    saleChangce: payload.data.pageItems,
    isSaleChangceGet: true,
  };
}
function staffSaleChangceFailure(error) {
  return {
    type: STAFF_SALE_CHANGCE_FAILURE,
    isSaleChangceGet: false,
    error,
  };
}

// ---------------------------------------------
function staffSaleChangceDetailRequest() {
  return {
    type: STAFF_SALE_CHANGCE_DETAIL_REQUEST,
    isSaleChangceDetailGet: false,
  };
}
function staffSaleChangceDetailSuccess(payload) {
  return {
    type: STAFF_SALE_CHANGCE_DETAIL_SUCCESS,
    saleChangceDetail: payload.data.pageItems,
    isSaleChangceDetailGet: true,

  };
}
function staffSaleChangceDetailFailure(error) {
  return {
    type: STAFF_SALE_CHANGCE_DETAIL_FAILURE,
    isSaleChangceDetailGet: false,
    error,
  };
}

function restStaffSaleChangceDetailFailure() {
  return {
    type: STAFF_SALE_CHANGCE_DETAIL_RESET,
    saleChangceDetail: [],
    isSaleChangceDetailGet: false,
  };
}

// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 20,
  currentPage: 1,
};

// 获得门店日客情维护完成数
export function fetchStaffTask(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_day_guider_task.json?token=${token}`;
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
  return callApi(url, config, staffTaskRequest, staffTaskSuccess, staffTaskFailure);
}

// 获得门店月客情维护完成数
export function fetchMonthStaffTask(type) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_month_guider_task.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      goodSn: type,
    }),
  };
  return callApi(url, config, monthStaffTaskRequest, monthStaffTaskSuccess, monthStaffTaskFailure);
}

// 获取销售机会跟进
export function fetchSaleChangce() {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_day_task_outlet_store.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  return callApi(url, config, staffSaleChangceRequest, staffSaleChangceSuccess, staffSaleChangceFailure);
}

// 获取销售机会跟进详情
export function fetchSaleChangceDetail(type) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_day_task_grow_outlet_store.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type,
    }),
  };
  return callApi(url, config, staffSaleChangceDetailRequest, staffSaleChangceDetailSuccess, staffSaleChangceDetailFailure);
}

// 获取月销售机会跟进
export function fetchMonthSaleChangce() {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_month_task_outlet_store.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  return callApi(url, config, monthSaleChangceStoreRequest, monthSaleChangceStoreSuccess, monthSaleChangceStoreFailure);
}

// 获取月销售机会跟进
export function fetchMonthSaleChangceDetail(type) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_month_task_outlet_guider.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type,
    }),
  };
  return callApi(url, config, monthSaleChangceGuiderRequest, monthSaleChangceGuiderSuccess, monthSaleChangceGuiderFailure);
}

// 获取员工今日新客开发
export function fetchStaffNewCustomer(type) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_day_reg_member.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    }),
  };
  return callApi(url, config, staffNewCustomerRequest, staffNewCustomerSuccess, staffNewCustomerFailure);
}

// 获取员工本月新客开发
export function fetchStaffMonthNewCustomer(detail) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/month_new_customer.json?detail=${detail}&token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    }),
  };
  return callApi(url, config, staffMonthNewCustomerRequest, staffMonthNewCustomerSuccess, staffMonthNewCustomerFailure);
}

// 获取员工本月客户追踪
export function fetchStaffMonthContact() {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_month_contact_outlet_guider.json?&token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    }),
  };
  return callApi(url, config, staffMonthContactRequest, staffMonthContactSuccess, staffMonthContactFailure);
}

export function resetSaleChangceResult() {
  return (dispatch) => {
    dispatch(restStaffSaleChangceDetailFailure());
  };
}
