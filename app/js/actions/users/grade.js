import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER } from '../../utils/apiUtils';

// 员工评级列表
export const GRADE_PAGER_REQUEST = 'GRADE_PAGER_REQUEST';
export const GRADE_PAGER_SUCCESS = 'GRADE_PAGER_SUCCESS';
export const GRADE_PAGER_FAILURE = 'GRADE_PAGER_FAILURE';

// 员工评级详情
export const GRADE_DETAILS_REQUEST = 'GRADE_DETAILS_REQUEST';
export const GRADE_DETAILS_SUCCESS = 'GRADE_DETAILS_SUCCESS';
export const GRADE_DETAILS_FAILURE = 'GRADE_DETAILS_FAILURE';

// ---------------------------------------------
function gradePagerRequest() {
  return {
    type: GRADE_PAGER_REQUEST,
  };
}
function gradePagerSuccess(payload) {
  return {
    type: GRADE_PAGER_SUCCESS,
    pager: payload.data.pager,
    grades: payload.data.pageItems,
  };
}
function gradePagerFailure(error) {
  return {
    type: GRADE_PAGER_FAILURE,
    error,
  };
}
// ---------------------------------------------
function gradeDetailsRequest() {
  return {
    type: GRADE_DETAILS_REQUEST,
  };
}
function gradeDetailsSuccess(payload) {
  return {
    type: GRADE_DETAILS_SUCCESS,
    pager: payload.data.pager,
    grades: payload.data.pageItems,
  };
}
function gradeDetailsFailure(error) {
  return {
    type: GRADE_DETAILS_FAILURE,
    error,
  };
}
// ---------------------------------------------
// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 20,
  currentPage: 1,
};

// 获得个人任务指标数据
export function fetchGradesPerPerson(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/employee_evaluation.json?token=${token}`;
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
  return callApi(url, config, gradeDetailsRequest, gradeDetailsSuccess, gradeDetailsFailure);
}

// ---------------------------------------------
// 获得全部人员任务数据
export function fetchAllGrades(pager) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const url = `${RESTFUL_SERVER}/crm/employee_allrank.json?token=${token}`;
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
  return callApi(url, config, gradePagerRequest, gradePagerSuccess, gradePagerFailure);
}
