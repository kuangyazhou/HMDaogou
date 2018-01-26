import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER } from '../../utils/apiUtils';

// 我的客户明细
export const MY_MEMBER_REQUEST = 'MY_MEMBER_REQUEST';
export const MY_MEMBER_SUCCESS = 'MY_MEMBER_SUCCESS';
export const MY_MEMBER_FAILURE = 'MY_MEMBER_FAILURE';

function myMemberRequest(user) {
  return {
    type: MY_MEMBER_REQUEST,
    user,
  };
}

function myMemberSuccess(payload) {
  return {
    type: MY_MEMBER_SUCCESS,
    data: payload.data,
  };
}

function myMemberFailure(error) {
  return {
    type: MY_MEMBER_FAILURE,
    error,
  };
}

// 请求获得我的客户的信息(客户管理)
export function getMyMember(targetMonth) {
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
    body: JSON.stringify({
      targetMonth,
    }),
  };

  return callApi(`${RESTFUL_SERVER}/crm/member_manage.json?token=${token}`,
    config,
    myMemberRequest(userId),
    myMemberSuccess,
    myMemberFailure
  );
}
