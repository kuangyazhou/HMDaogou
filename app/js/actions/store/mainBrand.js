import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER } from '../../utils/apiUtils';

// 员工评级列表
export const MAIN_BRAND_REQUEST = 'MAIN_BRAND_REQUEST';
export const MAIN_BRAND_SUCCESS = 'MAIN_BRAND_SUCCESS';
export const MAIN_BRAND_FAILURE = 'MAIN_BRAND_FAILURE';

// ---------------------------------------------
function mainBrandRequest() {
  return {
    type: MAIN_BRAND_REQUEST,
    isMainBrandListGet: false,
  };
}
function mainBrandSuccess(payload) {
  return {
    type: MAIN_BRAND_SUCCESS,
    isMainBrandListGet: true,
    mainBrandList: payload.data.pager.pageItems,
  };
}
function mainBrandFailure(error) {
  return {
    type: MAIN_BRAND_FAILURE,
    isMainBrandListGet: false,
    error,
  };
}

// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 20,
  currentPage: 1,
};

// 获得门店销售数据
export function fetchMainBrand(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/data/brand_reach_progress.json?token=${token}`;
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
  return callApi(url, config, mainBrandRequest, mainBrandSuccess, mainBrandFailure);
}
