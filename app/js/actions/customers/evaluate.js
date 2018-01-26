import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
} from '../../utils/apiUtils';

// 导购优惠券列表.
export const CUSTOMER_EVALUATE_REQUEST = 'CUSTOMER_EVALUATE_REQUEST';
export const CUSTOMER_EVALUATE_SUCCESS = 'CUSTOMER_EVALUATE_SUCCESS';
export const CUSTOMER_EVALUATE_FAILURE = 'CUSTOMER_EVALUATE_FAILURE';

function customerEvaluateRequest(query) {
  return {
    type: CUSTOMER_EVALUATE_REQUEST,
    isEvaluateGet: false,
    query,
  };
}

/* eslint func-names: [0] */
function customerEvaluateSuccess() {
  return function (payload) {
    return {
      isEvaluateGet: true,
      type: CUSTOMER_EVALUATE_SUCCESS,
      evaluate: payload.evaluateList,
    };
  };
}

/* eslint func-names: [0] */
function customerEvaluateFailure(page) {
  return function (error) {
    return {
      type: CUSTOMER_EVALUATE_FAILURE,
      isEvaluateGet: false,
      pager: page,
      error,
    };
  };
}

// 获得代购优惠券
export function fetchCustomerEvaluate(status) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/show_consume_evaluate.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
    }),
  };
  return callApi(url, config, customerEvaluateRequest(), customerEvaluateSuccess(), customerEvaluateFailure());
}
