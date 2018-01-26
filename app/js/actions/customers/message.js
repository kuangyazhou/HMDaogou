/* eslint linebreak-style: [0] */
import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
  TEST_RESTFUL_SERVER,
 } from '../../utils/apiUtils';

// 填写客户信息
export const CUSTOMER_SEND_MESSAGE_REQUEST = 'CUSTOMER_SEND_MESSAGE_REQUEST';
export const CUSTOMER_SEND_MESSAGE_SUCCESS = 'CUSTOMER_SEND_MESSAGE_SUCCESS';
export const CUSTOMER_SEND_MESSAGE_FAILURE = 'CUSTOMER_SEND_MESSAGE_FAILURE';
export const CUSTOMER_SEND_MESSAGE_RESET = 'CUSTOMER_SEND_MESSAGE_RESET';


// 默认查询条件
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 20,
  currentPage: 1,
};

// Actions.
function customerSendMessageRequest(query) {
  return {
    type: CUSTOMER_SEND_MESSAGE_REQUEST,
    isMessageSended: false,
    query,
  };
}

function customerSendMessageSuccess(payload) {
  return {
    type: CUSTOMER_SEND_MESSAGE_SUCCESS,
    isMessageSended: true,
    code: payload.code,
  };
}

function customerSendMessageFailure(error) {
  return {
    type: CUSTOMER_SEND_MESSAGE_FAILURE,
    isMessageSended: false,
    error,
  };
}

function customerSendMessageReset(payload) {
  return {
    type: CUSTOMER_SEND_MESSAGE_RESET,
    isMessageSended: false,
    code: [],
  };
}

// 提交用户发送信息.
export function postCustomerMessage(memberId, comment, mobilePhone, taskRuleType) {
  const profile = loadIdToken();
  const userId = profile.userId;
  const defalutPager = DEFAULT_QUERY_PARAMS;
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
      mbOfflineId: memberId,
      content: comment,
      mobile: mobilePhone,
      taskRuleType,
    }),
  };

  return callApi(`${RESTFUL_SERVER}/crm/customer/send_sms.json?token=${token}`,
    config,
    customerSendMessageRequest(memberId, comment, mobilePhone),
    customerSendMessageSuccess,
    customerSendMessageFailure
  );
}

export function sendMessageReset() {
  return (dispatch) => {
    dispatch(customerSendMessageReset());
  };
}
