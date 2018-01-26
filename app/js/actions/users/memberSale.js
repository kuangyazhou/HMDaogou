import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER } from '../../utils/apiUtils';

// 本月客户成交进度
export const MEMBER_SALE_REQUEST = 'MEMBER_SALE_REQUEST';
export const MEMBER_SALE_SUCCESS = 'MEMBER_SALE_SUCCESS';
export const MEMBER_SALE_FAILURE = 'MEMBER_SALE_FAILURE';

function memberSaleRequest(user) {
  return {
    type: MEMBER_SALE_REQUEST,
    user,
  };
}

function memberSaleSuccess(payload) {
  return {
    type: MEMBER_SALE_SUCCESS,
    complete: payload.complete,
    percent: parseFloat(payload.percent, 10) * 100,
  };
}

function memberSaleFailure(error) {
  return {
    type: MEMBER_SALE_FAILURE,
    error,
  };
}

// 请求获得当日的任务
export function getMemberSale() {
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

  return callApi(`${RESTFUL_SERVER}/crm/member_sale.json?token=${token}`,
    config,
    memberSaleRequest(userId),
    memberSaleSuccess,
    memberSaleFailure
  );
}
