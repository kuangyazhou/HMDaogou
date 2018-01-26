import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
} from '../../utils/apiUtils';

// 绩效考核
export const MY_PERFORMACE_REQUEST = 'MY_PERFORMACE_REQUEST';
export const MY_PERFORMACE_SUCCESS = 'MY_PERFORMACE_SUCCESS';
export const MY_PERFORMACE_FAILURE = 'MY_PERFORMACE_FAILURE';

// 近期维护客户交易人数统计
export const MY_RENCENTLY_DEAL_PEOPLES_REQUEST = 'MY_RENCENTLY_DEAL_PEOPLES_REQUEST';
export const MY_RENCENTLY_DEAL_PEOPLES_SUCCESS = 'MY_RENCENTLY_DEAL_PEOPLES_SUCCESS';
export const MY_RENCENTLY_DEAL_PEOPLES_FAILURE = 'MY_RENCENTLY_DEAL_PEOPLES_FAILURE';

// 近期维护客户新增数量统计
export const MY_MY_RENCENTLY_ADDED_PEOPLES_REQUEST = 'MY_MY_RENCENTLY_ADDED_PEOPLES_REQUEST';
export const MY_MY_RENCENTLY_ADDED_PEOPLES_SUCCESS = 'MY_MY_RENCENTLY_ADDED_PEOPLES_SUCCESS';
export const MY_MY_RENCENTLY_ADDED_PEOPLES_FAILURE = 'MY_MY_RENCENTLY_ADDED_PEOPLES_FAILURE';

// 绩效考核图
export const MY_PERFORMANCE_CHART_REQUEST = 'MY_PERFORMANCE_CHART_REQUEST';
export const MY_PERFORMANCE_CHART_SUCCESS = 'MY_PERFORMANCE_CHART_SUCCESS';
export const MY_PERFORMANCE_CHART_FAILURE = 'MY_PERFORMANCE_CHART_FAILURE';

// 获取本月维护奖金
export const MONTH_MEMBER_REWARD_REQUEST = 'MONTH_MEMBER_REWARD_REQUEST';
export const MONTH_MEMBER_REWARD_SUCCESS = 'MONTH_MEMBER_REWARD_SUCCESS';
export const MONTH_MEMBER_REWARD_FAILURE = 'MONTH_MEMBER_REWARD_FAILURE';

// 获取所有优惠券信息
export const GET_ALL_COUPONS_REQUEST = 'GET_ALL_COUPONS_REQUEST';
export const GET_ALL_COUPONS_SUCCESS = 'GET_ALL_COUPONS_SUCCESS';
export const GET_ALL_COUPONS_FAILURE = 'GET_ALL_COUPONS_FAILURE';

function myPerformanceChartRequest(user) {
  return {
    type: MY_PERFORMANCE_CHART_REQUEST,
    isRoyaltiesGet: false,
    user,
  };
}

function myPerformanceChartSuccess(payload) {
  return {
    type: MY_PERFORMANCE_CHART_SUCCESS,
    isRoyaltiesGet: true,
    pager: payload.data.pager,
    assess: payload.data.pageItems,
  };
}

function myPerformanceChartFailure(error) {
  return {
    type: MY_PERFORMANCE_CHART_FAILURE,
    isRoyaltiesGet: false,
    error,
  };
}

function monthMemberRewardRequest(user) {
  return {
    type: MONTH_MEMBER_REWARD_REQUEST,
    user,
  };
}

function monthMemberRewardSuccess(payload) {
  return {
    type: MONTH_MEMBER_REWARD_SUCCESS,
    pager: payload.data.pager,
    reward: payload.data.pageItems,
  };
}

function monthMemberRewardFailure(error) {
  return {
    type: MONTH_MEMBER_REWARD_FAILURE,
    error,
  };
}

function myRecentlyAddedPeoplesRequest(user) {
  return {
    type: MY_MY_RENCENTLY_ADDED_PEOPLES_REQUEST,
    isCatching: false,
    user,
  };
}

function myRecentlyAddedPeoplesSuccess(payload) {
  return {
    type: MY_MY_RENCENTLY_ADDED_PEOPLES_SUCCESS,
    isCatching: true,
    code: payload.code,
    data: payload.data,
  };
}

function myRecentlyAddedPeoplesFailure(error) {
  return {
    type: MY_MY_RENCENTLY_ADDED_PEOPLES_FAILURE,
    isCatching: false,
    error,
  };
}

function myRecentlyDealPeoplesRequest(user) {
  return {
    type: MY_RENCENTLY_DEAL_PEOPLES_REQUEST,
    isFetching: false,
    user,
  };
}

function myRecentlyDealPeoplesSuccess(payload) {
  return {
    type: MY_RENCENTLY_DEAL_PEOPLES_SUCCESS,
    isFetching: true,
    code: payload.code,
    data: payload.data,
  };
}

function myRecentlyDealPeoplesFailure(error) {
  return {
    type: MY_RENCENTLY_DEAL_PEOPLES_FAILURE,
    isFetching: false,
    error,
  };
}

function undoDayTaskRequest(user) {
  return {
    type: MY_PERFORMACE_REQUEST,
    user,
  };
}

function undoDayTaskSuccess(payload) {
  return {
    type: MY_PERFORMACE_SUCCESS,
    data: payload.data,
  };
}

function undoDayTaskFailure(error) {
  return {
    type: MY_PERFORMACE_FAILURE,
    error,
  };
}

// 优惠券包
function getAllCouponsRequest() {
  return {
    type: GET_ALL_COUPONS_REQUEST,
    isAllCouponGet: false,
  };
}

function getAllCouponsSuccess(payload) {
  return {
    type: GET_ALL_COUPONS_SUCCESS,
    allCoupons: payload.data.pageItems,
    isAllCouponGet: true,
  };
}

function getAllCouponsFailure() {
  return {
    type: GET_ALL_COUPONS_FAILURE,
    isAllCouponGet: false,
  };
}

// 请求近期维护客户新增数量统计.
export function fetchRecentlyAddedPeoples() {
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
    data: JSON.stringify({
      pageSize: 15,
      currentPage: 1,
    }),
  };

  return callApi(`${RESTFUL_SERVER}/crm/customer/consume_record_add_count.json?token=${token}`,
    config,
    myRecentlyAddedPeoplesRequest(token),
    myRecentlyAddedPeoplesSuccess,
    myRecentlyAddedPeoplesFailure
  );
}

// 请求获得近期维护客户交易人数统计.
export function fetchRecentlyDealPeoples() {
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
    data: JSON.stringify({
      pageSize: 15,
      currentPage: 1,
    }),
  };

  return callApi(`${RESTFUL_SERVER}/crm/customer/consume_record_count.json?token=${token}`,
    config,
    myRecentlyDealPeoplesRequest(token),
    myRecentlyDealPeoplesSuccess,
    myRecentlyDealPeoplesFailure
  );
}

// 请求获得当月绩效任务.
export function getCurrentMongthPerformance() {
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

  return callApi(`${RESTFUL_SERVER}/crm/target_info_month.json?token=${token}`,
    config,
    undoDayTaskRequest(token),
    undoDayTaskSuccess,
    undoDayTaskFailure
  );
}


// 请求获得所有优惠券
export function fetchALLCoupons() {
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
  };

  return callApi(`${RESTFUL_SERVER}/crm/MarketingCheck/GuiderbonusLink.json?token=${token}`,
    config,
    getAllCouponsRequest,
    getAllCouponsSuccess,
    getAllCouponsFailure
  );
}

// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 15,
  currentPage: 1,
};


// 获取绩效考核图的内容
export function fetchPerformanceTest(date) {
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
      startDate: date || '',
      pageSize: defalutPager.pageSize,
      currentPage: defalutPager.currentPage,
    }),
  };

  return callApi(`${RESTFUL_SERVER}/crm/month_reward_info.json?token=${token}`,
    config,
    myPerformanceChartRequest(token),
    myPerformanceChartSuccess,
    myPerformanceChartFailure
  );
}

// 获取绩效考核图的内容
export function getmonthMemberReward(date) {
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
      startDate: date || '',
      pageSize: defalutPager.pageSize,
      currentPage: defalutPager.currentPage,
    }),
  };

  return callApi(`${RESTFUL_SERVER}/crm/month_member_reward_info.json?token=${token}`,
    config,
    monthMemberRewardRequest(token),
    monthMemberRewardSuccess,
    monthMemberRewardFailure
  );
}
