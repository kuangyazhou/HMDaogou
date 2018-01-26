import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER } from '../../utils/apiUtils';

// 今日任务
export const CURRENT_DAY_TASK_REQUEST = 'CURRENT_DAY_TASK_REQUEST';
export const CURRENT_DAY_TASK_SUCCESS = 'CURRENT_DAY_TASK_SUCCESS';
export const CURRENT_DAY_TASK_FAILURE = 'CURRENT_DAY_TASK_FAILURE';

// 今日目标
export const CURRENT_DAY_TARGET_REQUEST = 'CURRENT_DAY_TARGET_REQUEST';
export const CURRENT_DAY_TARGET_SUCCESS = 'CURRENT_DAY_TARGET_SUCCESS';
export const CURRENT_DAY_TARGET_FAILURE = 'CURRENT_DAY_TARGET_FAILURE';

// 当日任务的请求
function currentDayTaskRequest(user) {
  return {
    type: CURRENT_DAY_TASK_REQUEST,
    user,
  };
}

function currentDayTaskSuccess(payload) {
  return {
    type: CURRENT_DAY_TASK_SUCCESS,
    taskSize: payload.currentDayTaskSize,
  };
}

function currentDayTaskFailure(error) {
  return {
    type: CURRENT_DAY_TASK_FAILURE,
    error,
  };
}


// 请求获得当日的任务
export function getCurrentDayTask() {
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

  return callApi(`${RESTFUL_SERVER}/crm/current_day_task.json?token=${token}`,
    config,
    currentDayTaskRequest(userId),
    currentDayTaskSuccess,
    currentDayTaskFailure
  );
}

//  当日目标的三种请求
function currentDayTargetRequest(user) {
  return {
    type: CURRENT_DAY_TARGET_REQUEST,
    user,
  };
}

function currentDayTargetSuccess(payload) {
  return {
    type: CURRENT_DAY_TARGET_SUCCESS,
    data: payload.data,
  };
}

function currentDayTargetFailure(error) {
  return {
    type: CURRENT_DAY_TARGET_FAILURE,
    error,
  };
}

export function fetchCurrentDayTarget(uid) {
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
      memberOfflineId: uid,
    }),
  };
  return callApi(`${RESTFUL_SERVER}/crm/month_sale_new.json?token=${token}`,
  config,
  currentDayTargetRequest(uid),
  currentDayTargetSuccess,
  currentDayTargetFailure);
}

