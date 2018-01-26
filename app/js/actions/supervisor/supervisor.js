import {
    callApi,
    ID_TOKEN,
    loadIdToken,
    removeIdToken,
    RESTFUL_SERVER,
} from '../../utils/apiUtils';

// import {
//     ORDER_CAT_REQUEST,
// } from '../store/sales';

/* eslint no-unused-expressions: [0] */
/* eslint arrow-body-style: [0] */
/* eslint react/self-closing-comp: [0] */
/* eslint linebreak-style: [0] */
/* eslint indent: [0] */
/* eslint react/jsx-indent: [0] */
/* eslint max-len: [0] */
/* eslint eol-last: [0] */


// const RESTFUL_SERVER = 'http://crmbackservice.weihaojiao.com';
// weihaojiao 'http://crmbackservice.weihaojiao.com'
// 备用服务器 'http://crmbackservice.hemiao100.com';

export const TODAY_SALE_REQUEST = 'TODAY_SALE_REQUEST';
export const TODAY_SALE_SUCCESS = 'TODAY_SALE_SUCCESS';
export const TODAY_SALE_FAIL = 'TODAY_SALE_FAIL';

export const STORE_LIST_REQUEST = 'STORE_LIST_REQUEST';
export const STORE_LIST_SUCCESS = 'STORE_LIST_SUCCESS';
export const STORE_LIST_FAIL = 'STORE_LIST_FAIL';

export const ORDER_INFO_REQUEST = 'ORDER_INFO_REQUEST';
export const ORDER_INFO_SUCCESS = 'ORDER_INFO_SUCCESS';
export const ORDER_INFO_FAIL = 'ORDER_INFO_FAIL';

export const MEMBER_INFO_REQUEST = 'MEMBER_INFO_REQUEST';
export const MEMBER_INFO_SUCCESS = 'MEMBER_INFO_SUCCESS';
export const MEMBER_INFO_FAIL = 'MEMBER_INFO_FAIL';

export const NEW_MEMBER_REQUEST = 'NEW_MEMBER_REQUEST';
export const NEW_MEMBER_SUCCESS = 'NEW_MEMBER_SUCCESS';
export const NEW_MEMBER_FAIL = 'NEW_MEMBER_FAIL';

export const SINGLE_SALE_REQUEST = 'SINGLE_SALE_REQUEST';
export const SINGLE_SALE_SUCCESS = 'SINGLE_SALE_SUCCESS';
export const SINGLE_SALE_FAIL = 'SINGLE_SALE_FAIL';

export const SALE_CHANCE_REQUEST = 'SALE_CHANCE_REQUEST';
export const SALE_CHANCE_SUCCESS = 'SALE_CHANCE_SUCCESS';
export const SALE_CHANCE_FAIL = 'SALE_CHANCE_FAIL';

function todaySaleRequest(data) {
    return {
        type: TODAY_SALE_REQUEST,
        data,
    };
}

function todaySaleSuccess(payload) {
    return {
        type: TODAY_SALE_SUCCESS,
        todaySale: payload.data,
        status: true,
    };
}

function todaySaleFail(err) {
    return {
        type: TODAY_SALE_FAIL,
        err,
    };
}

function storeListRequest(data) {
    return {
        type: STORE_LIST_REQUEST,
        data,
    };
}

function storeListSuccess(payload) {
    return {
        type: STORE_LIST_SUCCESS,
        storeList: payload.data,
        status: true,
    };
}

function storeListFail(err) {
    return {
        type: STORE_LIST_FAIL,
        err,
    };
}

function orderInfoRequest(data) {
    return {
        type: ORDER_INFO_REQUEST,
        data,
    };
}

function orderInfoSuccess(payload) {
    return {
        type: ORDER_INFO_SUCCESS,
        orderInfo: payload.data,
        status: true,
    };
}

function orderInfoFail(err) {
    return {
        type: ORDER_INFO_FAIL,
        err,
    };
}

function memberInfoRequest(data) {
    return {
        type: MEMBER_INFO_REQUEST,
        data,
    };
}

function memberInfoSuccess(payload) {
    return {
        type: MEMBER_INFO_SUCCESS,
        memberInfo: payload.data,
        status: true,
    };
}

function memberInfoFail(err) {
    return {
        type: MEMBER_INFO_FAIL,
        err,
    };
}

function newMemberRequest(data) {
    return {
        type: NEW_MEMBER_REQUEST,
        data,
    };
}

function newMemberSuccess(payload) {
    return {
        type: NEW_MEMBER_SUCCESS,
        newMember: payload.data,
        status: true,
    };
}

function newMemberFail(err) {
    return {
        type: NEW_MEMBER_FAIL,
        err,
    };
}

function singleSaleRequest(data) {
    return {
        type: SINGLE_SALE_REQUEST,
        data,
    };
}

function singleSaleSuccess(payload) {
    return {
        type: SINGLE_SALE_SUCCESS,
        singleSale: payload.data,
        status: true,
    };
}

function singleSaleFail(err) {
    return {
        type: SINGLE_SALE_FAIL,
        err,
    };
}

function saleChanceRequest(data) {
    return {
        type: SALE_CHANCE_REQUEST,
        data,
    };
}

function saleChanceSuccess(payload) {
    return {
        type: SALE_CHANCE_SUCCESS,
        saleChance: payload.data,
        status: true,
    };
}

function saleChanceFail(err) {
    return {
        type: SALE_CHANCE_FAIL,
        err,
    };
}

// 门店销售信息
export function getTodaySale(arg) {
    const token = loadIdToken();
    const userId = token.userId;
    const sym = `${userId},${token.workNum},${token.position},${token.storeCode},${token.storeOutletId}`;
    const url = `${RESTFUL_SERVER}/crm/data/supervisor_store_amount.json?token=${sym}`;
    const config = {
        method: 'post',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    };
    return callApi(url, config, todaySaleRequest, todaySaleSuccess, todaySaleFail);
}
// 门店列表
export function getStoreList(arg) {
    const token = loadIdToken();
    const userId = token.userId;
    const sym = `${userId},${token.workNum},${token.position},${token.storeCode},${token.storeOutletId}`;
    const url = `${RESTFUL_SERVER}/crm/data/supervisor_store_list.json?token=${sym}`;
    const config = {
        method: 'post',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    };
    return callApi(url, config, storeListRequest, storeListSuccess, storeListFail);
}
// 订单信息
export function getOrderInfo(arg) {
    const token = loadIdToken();
    const userId = token.userId;
    const sym = `${userId},${token.workNum},${token.position},${token.storeCode},${token.storeOutletId}`;
    const url = `${RESTFUL_SERVER}/crm/data/supervisor_store_order.json?token=${sym}`;
    const config = {
        method: 'post',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    };
    return callApi(url, config, orderInfoRequest, orderInfoSuccess, orderInfoFail);
}
// 会员信息
export function getmemberInfo(arg) {
    const token = loadIdToken();
    const userId = token.userId;
    const sym = `${userId},${token.workNum},${token.position},${token.storeCode},${token.storeOutletId}`;
    const url = `${RESTFUL_SERVER}/crm/data/supervisor_store_member.json?token=${sym}`;
    const config = {
        method: 'post',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    };
    return callApi(url, config, memberInfoRequest, memberInfoSuccess, memberInfoFail);
}
// 新增会员
export function getNewMember(arg) {
    const token = loadIdToken();
    const userId = token.userId;
    const sym = `${userId},${token.workNum},${token.position},${token.storeCode},${token.storeOutletId}`;
    const url = `${RESTFUL_SERVER}/crm/data/supervisor_store_newmember.json?token=${sym}`;
    const config = {
        method: 'post',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    };
    return callApi(url, config, newMemberRequest, newMemberSuccess, newMemberFail);
}

// 客单价
export function getSingleSale(arg) {
    const token = loadIdToken();
    const userId = token.userId;
    const sym = `${userId},${token.workNum},${token.position},${token.storeCode},${token.storeOutletId}`;
    const url = `${RESTFUL_SERVER}/crm/data/supervisor_store_member_sale.json?token=${sym}`;
    const config = {
        method: 'post',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    };
    return callApi(url, config, singleSaleRequest, singleSaleSuccess, singleSaleFail);
}
// 销售机会跟进
export function getSaleChance(arg) {
    const token = loadIdToken();
    const userId = token.userId;
    const sym = `${userId},${token.workNum},${token.position},${token.storeCode},${token.storeOutletId}`;
    const url = `${RESTFUL_SERVER}/crm/data/supervisor_store_chance.json?token=${sym}`;
    const config = {
        method: 'post',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    };
    return callApi(url, config, saleChanceRequest, saleChanceSuccess, saleChanceFail);
}