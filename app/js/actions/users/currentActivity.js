import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
} from '../../utils/apiUtils';

// 实时动态-今天动态
export const MY_TODAY_ACTIVITY_REQUEST = 'MY_TODAY_ACTIVITY_REQUEST';
export const MY_TODAY_ACTIVITY_SUCCESS = 'MY_TODAY_ACTIVITY_SUCCESS';
export const MY_TODAY_ACTIVITY_FAILURE = 'MY_TODAY_ACTIVITY_FAILURE';

// 实时动态-昨日动态
export const MY_YESTODAY_ACTIVITY_REQUEST = 'MY_YESTODAY_ACTIVITY_REQUEST';
export const MY_YESTODAY_ACTIVITY_SUCCESS = 'MY_YESTODAY_ACTIVITY_SUCCESS';
export const MY_YESTODAY_ACTIVITY_FAILURE = 'MY_YESTODAY_ACTIVITY_FAILURE';

// 首页活动
export const INDEX_ACTIVITY_REQUEST = 'INDEX_ACTIVITY_REQUEST';
export const INDEX_ACTIVITY_SUCCESS = 'INDEX_ACTIVITY_SUCCESS';
export const INDEX_ACTIVITY_FAILURE = 'INDEX_ACTIVITY_FAILURE';

// 首页活动
export const YEAR_ALL_ACTIVITY_REQUEST = 'YEAR_ALL_ACTIVITY_REQUEST';
export const YEAR_ALL_ACTIVITY_SUCCESS = 'YEAR_ALL_ACTIVITY_SUCCESS';
export const YEAR_ALL_ACTIVITY_FAILURE = 'YEAR_ALL_ACTIVITY_FAILURE';

// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 100,
  currentPage: 1,
};

function myTodayActivityRequest(user) {
  return {
    type: MY_TODAY_ACTIVITY_REQUEST,
    user,
  };
}
function myTodayActivitySuccess(payload) {
  return {
    type: MY_TODAY_ACTIVITY_SUCCESS,
    data: payload.data,
  };
}
function myTodayActivityFailure(error) {
  return {
    type: MY_TODAY_ACTIVITY_FAILURE,
    error,
  };
}

function indexActivityRequest(user) {
  return {
    type: INDEX_ACTIVITY_REQUEST,
    isIndexActivityGet: false,
    user,
  };
}
function indexActivitySuccess(payload) {
  return {
    type: INDEX_ACTIVITY_SUCCESS,
    isIndexActivityGet: true,
    indexActives: payload.data.pageItems,
  };
}
function indexActivityFailure(error) {
  return {
    type: INDEX_ACTIVITY_FAILURE,
    isIndexActivityGet: false,
    error,
  };
}

function myYestodayActivityRequest(user) {
  return {
    type: MY_YESTODAY_ACTIVITY_REQUEST,
    user,
  };
}
function myYestodayActivitySuccess(payload) {
  return {
    type: MY_YESTODAY_ACTIVITY_SUCCESS,
    data: payload.data,
  };
}
function myYestodayActivityFailure(error) {
  return {
    type: MY_YESTODAY_ACTIVITY_FAILURE,
    error,
  };
}

function yearAllActivityRequest(user) {
  return {
    type: YEAR_ALL_ACTIVITY_REQUEST,
    user,
  };
}
function yearAllActivitySuccess(payload) {
  return {
    type: YEAR_ALL_ACTIVITY_SUCCESS,
    pager: payload.data.pager,
    shopactives: payload.data.pageItems,
  };
}
function yearAllActivityFailure(error) {
  return {
    type: YEAR_ALL_ACTIVITY_FAILURE,
    error,
  };
}

// 请求获得当天实时销售数据.
export function getCurrentDayActivity() {
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
    data: JSON.stringify({}),
  };

  return callApi(`${RESTFUL_SERVER}/crm/current_day_sale.json?token=${token}`,
    config,
    myTodayActivityRequest(token),
    myTodayActivitySuccess,
    myTodayActivityFailure
  );
}

// 请求获得昨日实时销售数据.
export function getYestodayActivity() {
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
    data: JSON.stringify({}),
  };

  return callApi(`${RESTFUL_SERVER}/crm/last_day_sale.json?token=${token}`,
    config,
    myYestodayActivityRequest(token),
    myYestodayActivitySuccess,
    myYestodayActivityFailure
  );
}

// 首页三条活动.
export function getIndexActivity() {
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
    body: JSON.stringify({}),
  };

  return callApi(`${RESTFUL_SERVER}/crm/all_activity_info_day.json?token=${token}`,
    config,
    indexActivityRequest(token),
    indexActivitySuccess,
    indexActivityFailure
  );
}

// 首页活动详情
export function fetchYearAllShopActivitys(date) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startTime: date || '',
      pageSize: defalutPager.pageSize,
      currentPage: defalutPager.currentPage,
    }),
  };

  return callApi(`${RESTFUL_SERVER}/crm/all_activity_info_month.json?token=${token}`,
    config,
    yearAllActivityRequest(token),
    yearAllActivitySuccess,
    yearAllActivityFailure
  );
}
