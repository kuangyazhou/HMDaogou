import {
  loadIdToken,
  RESTFUL_SERVER,
  callApi,
 } from '../../utils/apiUtils';

// 客户交易排行.
export const CUSTOMER_CONSUME_RANK_REQUEST = 'CUSTOMER_CONSUME_RANK_REQUEST';
export const CUSTOMER_CONSUME_RANK_SUCCESS = 'CUSTOMER_CONSUME_RANK_SUCCESS';
export const CUSTOMER_CONSUME_RANK_FAILURE = 'CUSTOMER_CONSUME_RANK_FAILURE';

function customerConsumeRankRequest(query) {
  return {
    type: CUSTOMER_CONSUME_RANK_REQUEST,
    isConsumeRankGet: false,
    query,
  };
}

function customerConsumeRankSuccess(payload) {
  return {
    type: CUSTOMER_CONSUME_RANK_SUCCESS,
    isConsumeRankGet: true,
    consumeRank: payload,
  };
}

function customerConsumeRankFailure(error) {
  return {
    type: CUSTOMER_CONSUME_RANK_FAILURE,
    isConsumeRankGet: false,
    error,
  };
}

export function getCustomerConsumeRank() {
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
  return callApi(`${RESTFUL_SERVER}/crm/show_consume_rank.json?token=${token}`,
    config,
    customerConsumeRankRequest,
    customerConsumeRankSuccess,
    customerConsumeRankFailure
  );
}
