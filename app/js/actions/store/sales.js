import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
} from '../../utils/apiUtils';

// 员工评级列表
export const SALES_PAGER_REQUEST = 'SALES_PAGER_REQUEST';
export const SALES_PAGER_SUCCESS = 'SALES_PAGER_SUCCESS';
export const SALES_PAGER_FAILURE = 'SALES_PAGER_FAILURE';

// 销售详情
export const SALES_DETAIL_REQUEST = 'SALES_DETAIL_REQUEST';
export const SALES_DETAIL_SUCCESS = 'SALES_DETAIL_SUCCESS';
export const SALES_DETAIL_FAILURE = 'SALES_DETAIL_FAILURE';

// 员工销售额排行
export const SALE_RANK_REQUEST = 'SALE_RANK_REQUEST';
export const SALE_RANK_SUCCESS = 'SALE_RANK_SUCCESS';
export const SALE_RANK_FAILURE = 'SALE_RANK_FAILURE';

// 单品销售排行
export const SINGLE_SALE_RANK_REQUEST = 'SINGLE_SALE_RANK_REQUEST';
export const SINGLE_SALE_RANK_SUCCESS = 'SINGLE_SALE_RANK_SUCCESS';
export const SINGLE_SALE_RANK_FAILURE = 'SINGLE_SALE_RANK_FAILURE';

// 月度单品销售排行
export const MONTH_SINGLE_SALE_RANK_REQUEST = 'MONTH_SINGLE_SALE_RANK_REQUEST';
export const MONTH_SINGLE_SALE_RANK_SUCCESS = 'MONTH_SINGLE_SALE_RANK_SUCCESS';
export const MONTH_SINGLE_SALE_RANK_FAILURE = 'MONTH_SINGLE_SALE_RANK_FAILURE';

// 今日员工进度排行
export const STAFF_PROGRESS_RANK_REQUEST = 'STAFF_PROGRESS_RANK_REQUEST';
export const STAFF_PROGRESS_RANK_SUCCESS = 'STAFF_PROGRESS_RANK_SUCCESS';
export const STAFF_PROGRESS_RANK_FAILURE = 'STAFF_PROGRESS_RANK_FAILURE';

// 月销售周平均值销售趋势
export const WEEK_AVERGE_REQUEST = 'WEEK_AVERGE_REQUEST';
export const WEEK_AVERGE_SUCCESS = 'WEEK_AVERGE_SUCCESS';
export const WEEK_AVERGE_FAILURE = 'WEEK_AVERGE_FAILURE';

// 品类销售金额及占比
export const ORDER_CAT_REQUEST = 'ORDER_CAT_REQUEST';
export const ORDER_CAT_SUCCESS = 'ORDER_CAT_SUCCESS';
export const ORDER_CAT_FAILURE = 'ORDER_CAT_FAILURE';


// 品类销售金额及趋势
export const ORDER_CAT_TREND_REQUEST = 'ORDER_CAT_TREND_REQUEST';
export const ORDER_CAT_TREND_SUCCESS = 'ORDER_CAT_TREND_SUCCESS';
export const ORDER_CAT_TREND_FAILURE = 'ORDER_CAT_TREND_FAILURE';

// ---------------------------------------------
function orderCatTrendRequst() {
  return {
    type: ORDER_CAT_TREND_REQUEST,
    isOrderCatTrendGet: false,
  };
}
function orderCatTrendSuccess(payload) {
  return {
    type: ORDER_CAT_TREND_SUCCESS,
    isOrderCatTrendGet: true,
    orderCatTrend: payload.data,
  };
}
function orderCatTrendFailure() {
  return {
    type: ORDER_CAT_TREND_FAILURE,
    isOrderCatTrendGet: false,
  };
}

// ---------------------------------------------
function orderCatRequest() {
  return {
    type: ORDER_CAT_REQUEST,
    isOrderCatGet: false,
  };
}

function orderCatSuccess(payload) {
  return {
    type: ORDER_CAT_SUCCESS,
    isOrderCatGet: true,
    orderCat: payload.data.pager.pageItems,
  };
}

function orderCatFailure(error) {
  return {
    type: ORDER_CAT_FAILURE,
    isOrderCatGet: false,
    error,
  };
}

// ---------------------------------------------
function salesPagerRequest() {
  return {
    type: SALES_PAGER_REQUEST,
    isSalesPagerGet: false,
  };
}

function salesPagerSuccess(payload) {
  return {
    type: SALES_PAGER_SUCCESS,
    pager: payload.data.pager,
    isSalesPagerGet: true,
    sales: payload.data.pageItems,
  };
}

function salesPagerFailure(error) {
  return {
    type: SALES_PAGER_FAILURE,
    isSalesPagerGet: false,
    error,
  };
}

// ---------------------------------------------
function weekAverageRequest() {
  return {
    type: WEEK_AVERGE_REQUEST,
    isAverageGet: false,
  };
}

function weekAverageSuccess(payload) {
  return {
    type: WEEK_AVERGE_SUCCESS,
    isAverageGet: true,
    average: payload.data.pager.AverageSale,
  };
}

function weekAverageFailure(error) {
  return {
    type: WEEK_AVERGE_FAILURE,
    isAverageGet: false,
    error,
  };
}

// ---------------------------------------------
function saleDetailRequest() {
  return {
    type: SALES_DETAIL_REQUEST,
    isSaleDetailGet: false,
  };
}

function saleDetailSuccess(payload) {
  return {
    type: SALES_DETAIL_SUCCESS,
    isSaleDetailGet: true,
    todayCountMember: payload.data.pager.todaysales.saleNum,
    todayCountOrder: payload.data.pager.todaysales.orderNum,
    todayMemberAmount: payload.data.pager.todaysales.amount,
    todayTotalAmount: payload.data.pager.todaysales.value,
    yesterdayCountMember: payload.data.pager.yeaterdaySales.saleNum,
    yesterdayCountOrder: payload.data.pager.yeaterdaySales.orderNum,
    yesterdayMemberAmount: payload.data.pager.yeaterdaySales.amount,
    yesterdayTotalAmount: payload.data.pager.yeaterdaySales.value,
  };
}

function saleDetailFailure(error) {
  return {
    type: SALES_DETAIL_FAILURE,
    isSaleDetailGet: false,
    error,
  };
}

// ---------------------------------------------
function saleRankRequest() {
  return {
    type: SALE_RANK_REQUEST,
    isRankListFetching: false,
  };
}
function saleRankSuccess(payload) {
  return {
    type: SALE_RANK_SUCCESS,
    pager: payload.data.pager,
    rankList: payload.data.pager.pageItems,
    isRankListFetching: true,
  };
}
function saleRankFailure(error) {
  return {
    type: SALE_RANK_FAILURE,
    isRankListFetching: false,
    error,
  };
}

// ---------------------------------------------
function singleSaleRankRequest() {
  return {
    type: SINGLE_SALE_RANK_REQUEST,
    isTodaySingleBrandGet: false,
  };
}
function singleSaleRankSuccess(payload) {
  return {
    type: SINGLE_SALE_RANK_SUCCESS,
    isTodaySingleBrandGet: true,
    today: payload.data.pager.pageItems.today,
    yesterday: payload.data.pager.pageItems.yesterday,
  };
}
function singleSaleRankFailure(error) {
  return {
    type: SINGLE_SALE_RANK_FAILURE,
    isTodaySingleBrandGet: false,
    error,
  };
}

// ---------------------------------------------
function monthSingleSaleRankRequest() {
  return {
    type: MONTH_SINGLE_SALE_RANK_REQUEST,
    isMonthSingleBrandGet: false,
  };
}
function monthSingleSaleRankSuccess(payload) {
  return {
    type: MONTH_SINGLE_SALE_RANK_SUCCESS,
    isMonthSingleBrandGet: true,
    currentMonth: payload.data.pager.thisMonthSingleSale,
    previousMonth: payload.data.pager.lastMonthSingleSale,
  };
}
function monthSingleSaleRankFailure(error) {
  return {
    type: MONTH_SINGLE_SALE_RANK_FAILURE,
    isMonthSingleBrandGet: false,
    error,
  };
}

// ---------------------------------------------

function staffProgressRankRequest() {
  return {
    isProgressRankFetching: false,
    type: STAFF_PROGRESS_RANK_REQUEST,
  };
}
function staffProgressRankSuccess(payload) {
  return {
    isProgressRankFetching: true,
    type: STAFF_PROGRESS_RANK_SUCCESS,
    progressRank: payload.data.pager.pageItems,
  };
}
function staffProgressRankFailure(error) {
  return {
    isProgressRankFetching: false,
    type: STAFF_PROGRESS_RANK_FAILURE,
    error,
  };
}


// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 20,
  currentPage: 1,
};

// 获得门店销售数据
export function fetchStoreSales(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/store_sale.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
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
  return callApi(url, config, salesPagerRequest, salesPagerSuccess, salesPagerFailure);
}

// 获得门店销售详情
export function fetchSaleDetail(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/sales_details.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
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
  return callApi(url, config, saleDetailRequest, saleDetailSuccess, saleDetailFailure);
}

// 获得日单品销售排行
export function fetchSingleSaleRank(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/goods_day_sale_top.json?token=${token}`;
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
  return callApi(url, config, singleSaleRankRequest, singleSaleRankSuccess, singleSaleRankFailure);
}

// 获得月单品销售排行
export function fetchMonthSingleSaleRank(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/single_goods_sale.json?token=${token}`;
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
  return callApi(url, config, monthSingleSaleRankRequest, monthSingleSaleRankSuccess, monthSingleSaleRankFailure);
}

// 获得门店销售额排行
export function fetchSaleRank(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/emp_sale_rank.json?token=${token}`;
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
  return callApi(url, config, saleRankRequest, saleRankSuccess, saleRankFailure);
}

// 获得今日员工进度排行
export function fetchStaffProgressRank(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_day_progress_top.json?token=${token}`;
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
  return callApi(url, config, staffProgressRankRequest, staffProgressRankSuccess, staffProgressRankFailure);
}

// 获得门店销售数据
export function fetchWeekAverage(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/week_average_sale.json?token=${token}`;
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
  return callApi(url, config, weekAverageRequest, weekAverageSuccess, weekAverageFailure);
}

// 获得门店销售数据
export function fetchOrderCat(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/month_order_cat_rank.json?token=${token}`;
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
  return callApi(url, config, orderCatRequest, orderCatSuccess, orderCatFailure);
}

// 获得门店销售数据
export function fetchOrderCatTrend(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/month_catgoods_sale.json?token=${token}`;
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
  return callApi(url, config, orderCatTrendRequst, orderCatTrendSuccess, orderCatTrendFailure);
}

