import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER } from '../../utils/apiUtils';

// 绩效考核
export const MY_QCODE_REQUEST = 'MY_QCODE_REQUEST';
export const MY_QCODE_SUCCESS = 'MY_QCODE_SUCCESS';
export const MY_QCODE_FAILURE = 'MY_QCODE_FAILURE';

function qCodeRequest(user) {
  return {
    type: MY_QCODE_REQUEST,
    user,
  };
}

function qCodeSuccess(payload) {
  return {
    type: MY_QCODE_SUCCESS,
    url: payload.data.qrPath,
  };
}

function qCodeFailure(error) {
  return {
    type: MY_QCODE_FAILURE,
    // error,
  };
}

// 请求获得当月绩效任务.
export function getQCodeImgUrl() {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const config = {
    method: 'get',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return callApi(`${RESTFUL_SERVER}/crm/guider_qr.json?token=${token}`,
    config,
    qCodeRequest(token),
    qCodeSuccess,
    qCodeFailure
  );
}
