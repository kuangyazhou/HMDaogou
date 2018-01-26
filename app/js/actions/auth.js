import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  setIdToken,
  removeIdToken,
  newFetch,
  RESTFUL_SERVER,
} from '../utils/apiUtils';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGIN_CANCEL = 'LOGIN_CANCEL';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export function loginRequest({ username, password }) {
  return {
    type: LOGIN_REQUEST,
    username,
    password,
  };
}

export function loginSuccess(payload) {
  const profile = payload.loginUser;
  setIdToken(profile);
  return {
    type: LOGIN_SUCCESS,
    user: profile,
  };
}

export function loginFailure(error) {
  removeIdToken();
  return {
    type: LOGIN_FAILURE,
    error,
  };
}

export function loginCancel(error) {
  removeIdToken();
  return {
    type: LOGIN_CANCEL,
  };
}

// For redux-thunk middleware use only.
export function login(account, password) {
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      account,
      password,
    }),
  };

  return callApi(`${RESTFUL_SERVER}/crm/login.json`,
    config,
    loginRequest(account),
    loginSuccess,
    loginFailure
  );
}

function logoutRequest(user) {
  removeIdToken();
  return {
    type: LOGOUT_REQUEST,
    user,
  };
}

function logoutSuccess(payload) {
  removeIdToken();
  return {
    type: LOGOUT_SUCCESS,
    user: payload.loginUser,
  };
}

function logoutFailure(error) {
  return {
    type: LOGOUT_FAILURE,
    error,
  };
}

export function logout() {
  const user = loadIdToken();
  const config = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user,
    }),
  };

  return callApi(`${RESTFUL_SERVER}/crm/logout.json`,
    config,
    logoutRequest,
    logoutSuccess,
    logoutFailure
  );
}

// 检测登陆次数
export function checkLogin() {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  return fetch(`${RESTFUL_SERVER}/crm/crm_login_log.json?token=${token}`, {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()).then(res => res).catch(err => err);
}
