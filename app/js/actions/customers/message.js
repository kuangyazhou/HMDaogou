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
// 获取短信模板
export const MESSAGE_TEMPLATE_REQUSET = 'MESSAGE_TEMPLATE_REQUSET';
export const MESSAGE_TEMPLATE_SUCCESS = 'MESSAGE_TEMPLATE_SUCCESS';
export const MESSAGE_TEMPLATE_FAILURE = 'MESSAGE_TEMPLATE_FAILURE';


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

function getMessageTemplateRequest(query) {
  return {
    type: MESSAGE_TEMPLATE_REQUSET,
    isMessageTemplateGet: false,
    query,
  };
}

function getMessageTemplateSuccess(payload) {
  return {
    type: MESSAGE_TEMPLATE_SUCCESS,
    isMessageTemplateGet: true,
    templateList: payload.data.pageItems,
  };
}

function getMessageTemplateFaulure(error) {
  return {
    type: MESSAGE_TEMPLATE_FAILURE,
    isMessageTemplateGet: false,
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

export function getMessageTemplate() {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const storeCode = profile.storeCode;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      storeCode,
    }),
  };
  return callApi(`${RESTFUL_SERVER}/crm/customer/sms_templet.json?token=${token}`,
    config,
    getMessageTemplateRequest,
    getMessageTemplateSuccess,
    getMessageTemplateFaulure
  );
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
