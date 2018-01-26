import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER } from '../../utils/apiUtils';

// 绩效考核
export const NOTICE_REQUEST = 'NOTICE_REQUEST';
export const NOTICE_SUCCESS = 'NOTICE_SUCCESS';
export const NOTICE_FAILURE = 'NOTICE_FAILURE';

function getNoticeRequest(user) {
  return {
    type: NOTICE_REQUEST,
    isNoticeGet: false,
    user,
  };
}

function getNoticeSuccess(payload) {
  return {
    type: NOTICE_SUCCESS,
    isNoticeGet: true,
    noticeList: payload.data.pager,
  };
}

function getNoticeFailure(error) {
  return {
    type: NOTICE_FAILURE,
    isNoticeGet: false,
    error,
  };
}

// 获取公告
export function fetchNotice() {
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

  return callApi(`${RESTFUL_SERVER}/crm/store_index.json?token=${token}`,
    config,
    getNoticeRequest(),
    getNoticeSuccess,
    getNoticeFailure
  );
}
