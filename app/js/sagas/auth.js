import {
  call,
  put,
  fork,
  take,
  cancel,
  takeEvery,
} from 'redux-saga/effects';

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_CANCEL,
} from '../actions/auth';

import {
  fetchApi,
  RESTFUL_SERVER,
  setIdToken,
} from '../utils/apiUtils';

// 使用saga方式来连接数据库.
function login({ username, password }) {
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      account: username,
      password,
    }),
  };

  return fetchApi(`${RESTFUL_SERVER}/crm/login.json`, config);
}

function loginSuccess(loginUser) {
  setIdToken(loginUser);
  return put({
    type: LOGIN_SUCCESS,
    loginUser,
  });
}

export function* authorize({ username, password }) {
  try {
    const response = yield call(login, {
      username,
      password,
    });
    yield loginSuccess(response.loginUser);
    if (response === -100) {
      yield put({
        type: LOGIN_FAILURE,
        error: '登录失败',
      });
    }
  } catch (error) {
    yield put({
      type: LOGIN_FAILURE,
      error,
    });
  }
}

export function* loginFlow(action) {
  const task = yield fork(authorize, { username: action.username, password: action.password });
  yield take(LOGIN_CANCEL);
  yield cancel(task);
}

export function* watchRequestLogin() {
  yield takeEvery(LOGIN_REQUEST, loginFlow);
}
