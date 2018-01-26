import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER } from '../../utils/apiUtils';

// 门店通知.
export const STORE_NOTE_REQUEST = 'STORE_NOTE_REQUEST';
export const STORE_NOTE_SUCCESS = 'STORE_NOTE_SUCCESS';
export const STORE_NOTE_FAILURE = 'STORE_NOTE_FAILURE';

// 所有门店通知
export const STORE_ALL_NOTE_REQUEST = 'STORE_ALL_NOTE_REQUEST';
export const STORE_ALL_NOTE_SUCCESS = 'STORE_ALL_NOTE_SUCCESS';
export const STORE_ALL_NOTE_FAILURE = 'STORE_ALL_NOTE_FAILURE';

// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 15,
  currentPage: 1,
};

function storeAllNoteRequest(user) {
  return {
    type: STORE_ALL_NOTE_REQUEST,
    isStoreAllNoteGet: false,
    user,
  };
}

function storeAllNoteSuccess(payload) {
  return {
    type: STORE_ALL_NOTE_SUCCESS,
    pageItems: payload.data.pageItems,
    isStoreAllNoteGet: true,
    pager: payload.data.pager,
  };
}

function storeAllNoteFailure(error) {
  return {
    type: STORE_ALL_NOTE_FAILURE,
    isStoreAllNoteGet: false,
    error,
  };
}

function storeNoteRequest(user) {
  return {
    type: STORE_NOTE_REQUEST,
    user,
  };
}

function storeNoteSuccess(payload) {
  return {
    type: STORE_NOTE_SUCCESS,
    storeNoteSize: payload.storeNoteSize,
    storeNoteList: payload.storeNoteList,
  };
}

function storeNoteFailure(error) {
  return {
    type: STORE_NOTE_FAILURE,
    error,
  };
}

// 请求获得所有的门店通知
export function getAllStoreNotes() {
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
      pageSize: DEFAULT_QUERY_PARAMS.pageSize,
      currentPage: DEFAULT_QUERY_PARAMS.currentPage,
    }),
  };
  return callApi(`${RESTFUL_SERVER}/crm/store_note_list.json?token=${token}`,
    config,
    storeAllNoteRequest(token),
    storeAllNoteSuccess,
    storeAllNoteFailure
  );
}

// 请求获得当日的门店通知
export function getStoreNote() {
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

  return callApi(`${RESTFUL_SERVER}/crm/store_note.json?token=${token}`,
    config,
    storeNoteRequest(token),
    storeNoteSuccess,
    storeNoteFailure
  );
}
