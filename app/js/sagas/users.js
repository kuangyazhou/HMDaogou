// import {
//   call,
//   put,
//   fork,
//   take,
//   cancel,
//   takeEvery,
// } from 'redux-saga/effects';

// // 公共方法
// import {
//   fetchApi,
//   RESTFUL_SERVER,
//   loadIdToken,
//   DEFAULT_QUERY_PARAMS,
// } from '../utils/apiUtils';

// // 门店通知
// import {
//   STORE_NOTE_REQUEST,
//   STORE_NOTE_SUCCESS,
//   STORE_NOTE_FAILURE,
//   STORE_ALL_NOTE_REQUEST,
//   STORE_ALL_NOTE_SUCCESS,
//   STORE_ALL_NOTE_FAILURE,
// } from '../actions/users/storeNote';

// // 请求方法
// function getAllStoreNotes() {
//   const profile = loadIdToken();
//   const userId = profile.userId;
//   /* eslint max-len: [0] */
//   const token = `${userId},${profile.workNum},${profile.position},
// ${profile.storeCode},${profile.storeOutletId}`;
//   const config = {
//     method: 'post',
//     mode: 'cors',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       pageSize: DEFAULT_QUERY_PARAMS.pageSize,
//       currentPage: DEFAULT_QUERY_PARAMS.currentPage,
//     }),
//   };
//   return fetchApi(
//     `${RESTFUL_SERVER}/crm/store_note_list.json?token=${token}`,
//     config
//   );
// }

