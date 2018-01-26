import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
 } from '../../utils/apiUtils';

// 商品和品牌过滤
export const CUSTOMER_PRODUCT_FILTER_REQUEST = 'CUSTOMER_PRODUCT_FILTER_REQUEST';
export const CUSTOMER_PRODUCT_FILTER_SUCCESS = 'CUSTOMER_PRODUCT_FILTER_SUCCESS';
export const CUSTOMER_PRODUCT_FILTER_FAILURE = 'CUSTOMER_PRODUCT_FILTER_FAILURE';

export const CUSTOMER_FEATURE_REQUEST = 'CUSTOMER_FEATURE_REQUEST';
export const CUSTOMER_FEATURE_SUCCESS = 'CUSTOMER_FEATURE_SUCCESS';
export const CUSTOMER_FEATURE_FAILURE = 'CUSTOMER_FEATURE_FAILURE';


// Actions.
function customerProductFilterRequest(query) {
  return {
    type: CUSTOMER_PRODUCT_FILTER_REQUEST,
    query,
  };
}

function customerProductFilterSuccess(payload) {
  return {
    type: CUSTOMER_PRODUCT_FILTER_SUCCESS,
    data: payload.data.brandList,
  };
}

function customerProductFilterFailure(error) {
  return {
    type: CUSTOMER_PRODUCT_FILTER_FAILURE,
    error,
  };
}

function customerFeatureRequest(query) {
  return {
    type: CUSTOMER_FEATURE_REQUEST,
    isFeaturesGet: false,
    query,
  };
}

function customerFeatureSuccess(payload) {
  return {
    type: CUSTOMER_FEATURE_SUCCESS,
    isFeaturesGet: true,
    data: payload.data,
  };
}

function customerFeatureFailure(error) {
  return {
    type: CUSTOMER_FEATURE_FAILURE,
    isFeaturesGet: false,
    error,
  };
}

// 获得当前门店的可用商品列表, 数目比较多.
export function getProductsById(goodsSn) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/customer/customer_filter.json?token=${token}`;
  const config = {
    method: 'get',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return callApi(url,
    config,
    customerProductFilterRequest(goodsSn),
    customerProductFilterSuccess,
    customerProductFilterFailure
  );
}

export function getCustomerFeature() {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/customer/customer_feature.json?token=${token}`;
  const config = {
    method: 'get',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return callApi(url,
    config,
    customerFeatureRequest(),
    customerFeatureSuccess,
    customerFeatureFailure
  );
}
