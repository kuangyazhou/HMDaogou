import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER } from '../../utils/apiUtils';

// 品牌销售额查询
export const SALE_SEARCH_REQUEST = 'SALE_SEARCH_REQUEST';
export const SALE_SEARCH_SUCCESS = 'SALE_SEARCH_SUCCESS';
export const SALE_SEARCH_FAILURE = 'SALE_SEARCH_FAILURE';
export const SALE_SEARCH_RESET = 'SALE_SEARCH_RESET';

// ---------------------------------------------
function saleSearchRequest() {
  return {
    type: SALE_SEARCH_REQUEST,
    isBrandFetching: false,
  };
}
function saleSearchSuccess(payload) {
  return {
    type: SALE_SEARCH_SUCCESS,
    isBrandFetching: true,
    searchList: payload.data.pager.pageItems[0],
  };
}
function saleSearchFailure(error) {
  return {
    type: SALE_SEARCH_FAILURE,
    isBrandFetching: false,
    error,
  };
}

function saleSearchReset() {
  return {
    type: SALE_SEARCH_RESET,
    isBrandFetching: false,
    searchList: [],
  };
}

// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 20,
  currentPage: 1,
};

// 搜索品牌
export function fetchSaleSearch(goodSn, brand) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_day_single_sale.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      goodSn,
      brandId: brand,
    }),
  };
  return callApi(url, config, saleSearchRequest, saleSearchSuccess, saleSearchFailure);
}

// 重置搜索结果

export function restSaleList() {
  return (dispatch) => {
    dispatch(saleSearchReset());
  };
}
