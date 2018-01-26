// 所有的任务, 这个action是给项目任务使用, 包含分页能力.
import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER } from '../../utils/apiUtils';

// 今日任务
export const CURRENT_DAY_TASK_PAGER_REQUEST = 'CURRENT_DAY_TASK_PAGER_REQUEST';
export const CURRENT_DAY_TASK_PAGER_SUCCESS = 'CURRENT_DAY_TASK_PAGER_SUCCESS';
export const CURRENT_DAY_TASK_PAGER_FAILURE = 'CURRENT_DAY_TASK_PAGER_FAILURE';

// 未完成任务
export const UNDO_TASK_PAGER_REQUEST = 'UNDO_TASK_PAGER_REQUEST';
export const UNDO_TASK_PAGER_SUCCESS = 'UNDO_TASK_PAGER_SUCCESS';
export const UNDO_TASK_PAGER_FAILURE = 'UNDO_TASK_PAGER_FAILURE';

// 单项任务
export const SINGLE_TASK_PAGER_REQUEST = 'SINGLE_TASK_PAGER_REQUEST';
export const SINGLE_TASK_PAGER_SUCCESS = 'SINGLE_TASK_PAGER_SUCCESS';
export const SINGLE_TASK_PAGER_FAILURE = 'SINGLE_TASK_PAGER_FAILURE';

// 任务分组(包)
export const TASK_GROUP_REQUEST = 'TASK_GROUP_REQUEST';
export const TASK_GROUP_SUCCESS = 'TASK_GROUP_SUCCESS';
export const TASK_GROUP_FAILURE = 'TASK_GROUP_FAILURE';

// --------------------------------------------- //
// --------------------------------------------- //
function undoTaskRequest(pager) {
  return {
    type: UNDO_TASK_PAGER_REQUEST,
    pager,
  };
}
function undoTaskSuccess(payload) {
  return {
    type: UNDO_TASK_PAGER_SUCCESS,
    pager: payload.data.pager,
    undotasks: payload.data.pageItems,
  };
}
function undoTaskFailure(error) {
  return {
    type: UNDO_TASK_PAGER_FAILURE,
    error,
  };
}
// --------------------------------------------- //
// --------------------------------------------- //
function currentDayTaskRequest(pager) {
  return {
    type: CURRENT_DAY_TASK_PAGER_REQUEST,
    pager,
  };
}
function currentDayTaskSuccess(payload) {
  return {
    type: CURRENT_DAY_TASK_PAGER_SUCCESS,
    pager: payload.data.pager,
    todaytasks: payload.data.pageItems,
  };
}
function currentDayTaskFailure(error) {
  return {
    type: CURRENT_DAY_TASK_PAGER_FAILURE,
    error,
  };
}
// --------------------------------------------- //
// --------------------------------------------- //
function singleTaskRequest(pager) {
  return {
    type: SINGLE_TASK_PAGER_REQUEST,
    pager,
  };
}
function singleTaskSuccess(payload) {
  return {
    type: SINGLE_TASK_PAGER_SUCCESS,
    pager: payload.data.pager,
    singletasks: payload.data.pageItems,
  };
}
function singleTaskFailure(error) {
  return {
    type: SINGLE_TASK_PAGER_FAILURE,
    error,
  };
}
// --------------------------------------------- //
function taskGroupRequest(pager) {
  return {
    type: TASK_GROUP_REQUEST,
    pager,
  };
}
function taskGroupSuccess(payload) {
  return {
    type: TASK_GROUP_SUCCESS,
    pager: payload.data.pager,
    groups: payload.data.pageItems,
  };
}
function taskGroupFailure(error) {
  return {
    type: TASK_GROUP_FAILURE,
    error,
  };
}
// --------------------------------------------- //

function fetchUndoTask(url, config, body) {
  return callApi(url, config, undoTaskRequest(body), undoTaskSuccess, undoTaskFailure);
}
function fetchTodayTask(url, config, body) {
  return callApi(url, config, currentDayTaskRequest(body), currentDayTaskSuccess, currentDayTaskFailure);
}
function fetchSingleTask(url, config, body) {
  return callApi(url, config, singleTaskRequest(body), singleTaskSuccess, singleTaskFailure);
}

// --------------------------------------------- //

// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 20,
  currentPage: 1,
};

// 获取任务包
export function fetchGroupTasks(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/current_day_task_new_page.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pageSize: pager ? pager.pageSize : defalutPager.pageSize,
      currentPage: pager ? pager.currentPage : defalutPager.currentPage,
    }),
  };

  return callApi(url, config, taskGroupRequest(pager), taskGroupSuccess, taskGroupFailure);
}

// 获得任务数据
export function fetchTaskByType(type, pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/undo_task_page.json?token=${token}`;
  const singleTaskUrl = `${RESTFUL_SERVER}/crm/single_target_info_month.json?token=${token}`;
  const defalutPager = DEFAULT_QUERY_PARAMS;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sortType: type,
      pageSize: pager ? pager.pageSize : defalutPager.pageSize,
      currentPage: pager ? pager.currentPage : defalutPager.currentPage,
    }),
  };

  switch (type) {
    case 'undo':
      return fetchUndoTask(url, config, config.body);
    case 'today':
      return fetchTodayTask(url, config, config.body);
    case 'single':
      return fetchSingleTask(singleTaskUrl, config, config.body);
    default:
      return {};
  }
}
