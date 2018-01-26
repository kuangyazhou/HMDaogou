import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
} from '../../utils/apiUtils';

// 今日总目标
export const TOTAL_TARGET_REQUEST = 'TOTAL_TARGET_REQUEST';
export const TOTAL_TARGET_SUCCESS = 'TOTAL_TARGET_SUCCESS';
export const TOTAL_TARGET_FAILURE = 'TOTAL_TARGET_FAILURE';

// 今日销售时段销售额平均值
export const TODAY_SALE_TIME_REQUEST = 'TODAY_SALE_TIME_REQUEST';
export const TODAY_SALE_TIME_SUCCESS = 'TODAY_SALE_TIME_SUCCESS';
export const TODAY_SALE_TIME_FAILURE = 'TODAY_SALE_TIME_FAILURE';

// 本月销售时段销售额平均值
export const TOTAL_TARGET_DETAIL_REQUEST = 'TOTAL_TARGET_DETAIL_REQUEST';
export const TOTAL_TARGET_DETAIL_SUCCESS = 'TOTAL_TARGET_DETAIL_SUCCESS';
export const TOTAL_TARGET_DETAIL_FAILURE = 'TOTAL_TARGET_DETAIL_FAILURE';

// 当月总目标
export const MONTH_TOTAL_TARGET_REQUEST = 'MONTH_TOTAL_TARGET_REQUEST';
export const MONTH_TOTAL_TARGET_SUCCESS = 'MONTH_TOTAL_TARGET_SUCCESS';
export const MONTH_TOTAL_TARGET_FAILURE = 'MONTH_TOTAL_TARGET_FAILURE';

// 当月总目标详情
export const MONTH_TOTAL_TARGET_DETAIL_REQUEST = 'MONTH_TOTAL_TARGET_DETAIL_REQUEST';
export const MONTH_TOTAL_TARGET_DETAIL_SUCCESS = 'MONTH_TOTAL_TARGET_DETAIL_SUCCESS';
export const MONTH_TOTAL_TARGET_DETAIL_FAILURE = 'MONTH_TOTAL_TARGET_DETAIL_FAILURE';

// ---------------------------------------------
function totalTargetRequest() {
  return {
    type: TOTAL_TARGET_REQUEST,
    isTodayTargetGet: false,
  };
}
function totalTargetSuccess(payload) {
  return {
    type: TOTAL_TARGET_SUCCESS,
    isTodayTargetGet: true,
    todayAmount: payload.data.pager.amount,
    todayTargetAmount: payload.data.pager.point,
    todayPercent: payload.data.pager.percent,
  };
}
function totalTargetFailure(error) {
  return {
    type: TOTAL_TARGET_FAILURE,
    isTodayTargetGet: false,
    error,
  };
}

// ---------------------------------------------
// 今日销售额时段平均值
function todaySaleTimeRequest() {
  return {
    type: TODAY_SALE_TIME_REQUEST,
    isFetching: false,
  };
}
function todaySaleTimeSuccess(payload) {
  return {
    type: TODAY_SALE_TIME_SUCCESS,
    isFetching: true,
    saleTime: payload.data.pager.time,
    todaySaleDetail: payload.data.pager.today,
    yesterdaySaleDetail: payload.data.pager.yesterday,
    weekSaleDetail: payload.data.pager.seven,
    monthSaleDetail: payload.data.pager.oneMonthList,
    threeMonthSaleDetail: payload.data.pager.threeMonthList,
  };
}
function todaySaleTimeFailure(error) {
  return {
    type: TODAY_SALE_TIME_FAILURE,
    isFetching: false,
    error,
  };
}

// ---------------------------------------------
// 本月销售额时段平均值
function totalTargetDetailRequest() {
  return {
    type: MONTH_TOTAL_TARGET_DETAIL_REQUEST,
    isMonthSaleTimeAverageGet: false,
  };
}
function totalTargetDetailSuccess(payload) {
  return {
    type: MONTH_TOTAL_TARGET_DETAIL_SUCCESS,
    isMonthSaleTimeAverageGet: true,
    thisMonth: payload.data.pager.thisMonth,
    lastMonth: payload.data.pager.lastMonth,
    time: payload.data.pager.time,
  };
}
function totalTargetDetailFailure(error) {
  return {
    type: MONTH_TOTAL_TARGET_DETAIL_FAILURE,
    isMonthSaleTimeAverageGet: false,
    error,
  };
}

// ---------------------------------------------
function monthTotalTargetDetailRequest() {
  return {
    type: TOTAL_TARGET_DETAIL_REQUEST,
    isMonthTargetFetching: false,
  };
}
function monthTotalTargetDetailSuccess(payload) {
  return {
    type: TOTAL_TARGET_DETAIL_SUCCESS,
    isMonthTargetFetching: true,
    thisMonthDetail: payload.data.pager.thisMonth,
    lastMonthDetail: payload.data.pager.lastMonth,
  };
}
function monthTotalTargetDetailFailure(error) {
  return {
    type: TOTAL_TARGET_DETAIL_FAILURE,
    isMonthTargetFetching: false,
    error,
  };
}

// ----------------------------------------------
function monthTotalTargetRequest() {
  return {
    type: MONTH_TOTAL_TARGET_REQUEST,
    isMonthAllTargetGet: false,
  };
}
function monthTotalTargetSuccess(payload) {
  return {
    type: MONTH_TOTAL_TARGET_SUCCESS,
    isMonthAllTargetGet: true,
    monthComplete: payload.data.pager.monthComplete,
    monthTotalComplete: payload.data.pager.monthTotalComplete,
    monthCompletePercent: payload.data.pager.percent,
    lastMonthComplete: payload.data.pager.lastMonthComplete,
    lastMonthTotalComplete: payload.data.pager.lastMonthTotalComplete,
    lastMonthpercent: payload.data.pager.lastMonthpercent,
  };
}
function monthTotalTargetFailure(error) {
  return {
    type: MONTH_TOTAL_TARGET_FAILURE,
    isMonthAllTargetGet: false,
    error,
  };
}

// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 20,
  currentPage: 1,
};

// 获得门店销售数据
export function fetchTotalTarget(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/day_points_progress.json?token=${token}`;
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
  return callApi(url, config, totalTargetRequest, totalTargetSuccess, totalTargetFailure);
}

// 本月全时段销售额平均时段销售额
export function fetchMonthSaleTime(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/month_sale_store_target.json?token=${token}`;
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
  return callApi(url, config, totalTargetDetailRequest, totalTargetDetailSuccess, totalTargetDetailFailure);
}

// 本月全时段销售额平均时段销售额
export function fetchTodaySaleTime(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/store_period_sale_detail.json?token=${token}`;
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
  return callApi(url, config, todaySaleTimeRequest, todaySaleTimeSuccess, todaySaleTimeFailure);
}


export function fetchMonthTotalTarget(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/month_sale_target.json?token=${token}`;
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
  return callApi(url, config, monthTotalTargetRequest, monthTotalTargetSuccess, monthTotalTargetFailure);
}

export function fetchMonthTotalTargetDetail(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/month_sale_target_detail.json?token=${token}`;
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
  return callApi(url, config, monthTotalTargetDetailRequest, monthTotalTargetDetailSuccess, monthTotalTargetDetailFailure);
}
