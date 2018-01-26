import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
} from '../../utils/apiUtils';

// 导购优惠券列表.
export const CUSTOMER_TRACE_REQUEST = 'CUSTOMER_TRACE_REQUEST';
export const CUSTOMER_TRACE_SUCCESS = 'CUSTOMER_TRACE_SUCCESS';
export const CUSTOMER_TRACE_FAILURE = 'CUSTOMER_TRACE_FAILURE';

function customerTraceRequest(query) {
  return {
    type: CUSTOMER_TRACE_REQUEST,
    isTraceGet: false,
    query,
  };
}

/* eslint func-names: [0] */
function customerTraceSuccess() {
  return function (payload) {
    return {
      type: CUSTOMER_TRACE_SUCCESS,
      isTraceGet: true,
      trace: payload.page.allContentInfo,
    };
  };
}

/* eslint func-names: [0] */
function customerTraceFailure(page) {
  return function (error) {
    return {
      type: CUSTOMER_TRACE_FAILURE,
      pager: page,
      isTraceGet: false,
      error,
    };
  };
}

// 获得代购优惠券
export function fetchCustomerTrace(contactType) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/get_contact_recored.json?token=${token}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contactType,
    }),
  };
  return callApi(url, config, customerTraceRequest(), customerTraceSuccess(), customerTraceFailure());
}
