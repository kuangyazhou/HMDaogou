import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER } from '../../utils/apiUtils';

// 本月客户成交进度
export const MONTH_SALE_REQUEST = 'MONTH_SALE_REQUEST';
export const MONTH_SALE_SUCCESS = 'MONTH_SALE_SUCCESS';
export const MONTH_SALE_FAILURE = 'MONTH_SALE_FAILURE';

function memberSaleRequest(user) {
  return {
    type: MONTH_SALE_REQUEST,
    user,
  };
}

function memberSaleSuccess(payload) {
  return {
    type: MONTH_SALE_SUCCESS,
    complete: payload.complete,
    percent: payload.percent,
  };
}

function memberSaleFailure(error) {
  return {
    type: MONTH_SALE_FAILURE,
    error,
  };
}

// 请求获得当日的任务
export function getMonthSale() {
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

  return callApi(`${RESTFUL_SERVER}/crm/month_sale.json?token=${token}`,
    config,
    memberSaleRequest(userId),
    memberSaleSuccess,
    memberSaleFailure
  );
}
