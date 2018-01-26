import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
 } from '../../utils/apiUtils';

// 获取我的回访
export const PRODUCTS_RECOMMEND_REQUEST = 'PRODUCTS_RECOMMEND_REQUEST';
export const PRODUCTS_RECOMMEND_SUCCESS = 'PRODUCTS_RECOMMEND_SUCCESS';
export const PRODUCTS_RECOMMEND_FAILURE = 'PRODUCTS_RECOMMEND_FAILURE';

// 默认查询条件
function getProductsRecommendRequest(query) {
  return {
    type: PRODUCTS_RECOMMEND_REQUEST,
    query,
  };
}

/* eslint func-names: [0] */

function getProductsRecommendSuccess() {
  return function (payload) {
    // noinspection JSUnresolvedVariable
    return {
      type: PRODUCTS_RECOMMEND_SUCCESS,
      recommendation: payload.data.recommendation,
      wiki: payload.data.wiki,
      babyAgeWiki: payload.data.babyAgeWiki,
    };
  };
}

function getProductsRecommendFailure(page) {
  return function (error) {
    return {
      type: PRODUCTS_RECOMMEND_FAILURE,
      error,
    };
  };
}

export function fetchProductsRecommend(memberOfflineId, babyBirthday) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/customer/marketingAndRecommendation.json?memberOfflineId=${memberOfflineId}&babyBirthday=${babyBirthday}&token=${token}`;
  const config = {
    method: 'get',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  return callApi(url, config, getProductsRecommendRequest(), getProductsRecommendSuccess(), getProductsRecommendFailure());
}
