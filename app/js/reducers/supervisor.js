import {
    TODAY_SALE_REQUEST,
    TODAY_SALE_SUCCESS,
    TODAY_SALE_FAIL,
    STORE_LIST_REQUEST,
    STORE_LIST_SUCCESS,
    STORE_LIST_FAIL,
    ORDER_INFO_REQUEST,
    ORDER_INFO_SUCCESS,
    ORDER_INFO_FAIL,
    MEMBER_INFO_REQUEST,
    MEMBER_INFO_SUCCESS,
    MEMBER_INFO_FAIL,
    NEW_MEMBER_REQUEST,
    NEW_MEMBER_SUCCESS,
    NEW_MEMBER_FAIL,
    SINGLE_SALE_REQUEST,
    SINGLE_SALE_SUCCESS,
    SINGLE_SALE_FAIL,
    SALE_CHANCE_REQUEST,
    SALE_CHANCE_SUCCESS,
    SALE_CHANCE_FAIL,
} from '../actions/supervisor/supervisor.js';

/* eslint no-unused-expressions: [0] */
/* eslint arrow-body-style: [0] */
/* eslint react/self-closing-comp: [0] */
/* eslint linebreak-style: [0] */
/* eslint indent: [0] */
/* eslint react/jsx-indent: [0] */
/* eslint max-len: [0] */
/* eslint eol-last: [0] */

const deepAssign = require('deep-assign');

const initialState = {
    status: false,
};

function init() {
    return Object.assign({}, initialState);
}

export function todaySale(state = initialState, action = {}) {
    switch (action.type) {
        case 'TODAY_SALE_SUCCESS':
            return Object.assign({}, state, { todaySale: action.todaySale, status: action.status });
            // return { data: action };
        case 'TODAY_SALE_FAIL':
            return Object.assign({}, state);
        case 'TODAY_SALE_REQUEST':
            return Object.assign({}, state);
        default:
            return state;
    }
}

export function storeList(state = initialState, action = {}) {
    switch (action.type) {
        case 'STORE_LIST_SUCCESS':
            return Object.assign({}, state, { storeList: action.storeList, status: action.status });
        case 'STORE_LIST_FAIL':
            return Object.assign({}, state);
        case 'STORE_LIST_REQUEST':
            return Object.assign({}, state);
        default:
            return state;
    }
}
export function saleChance(state = initialState, action = {}) {
    switch (action.type) {
        case 'SALE_CHANCE_SUCCESS':
            return Object.assign({}, state, { saleChance: action.saleChance, status: action.status });
        case 'SALE_CHANCE_FAIL':
            return Object.assign({}, state);
        case 'SALE_CHANCE_REQUEST':
            return Object.assign({}, state);
        default:
            return state;
    }
}
export function orderInfo(state = initialState, action = {}) {
    switch (action.type) {
        case 'ORDER_INFO_SUCCESS':
            return Object.assign({}, state, { orderInfo: action.orderInfo, status: action.status });
        case 'ORDER_INFO_FAIL':
            return Object.assign({}, state);
        case 'ORDER_INFO_REQUEST':
            return Object.assign({}, state);
        default:
            return state;
    }
}

export function memberInfo(state = initialState, action = {}) {
    switch (action.type) {
        case 'MEMBER_INFO_SUCCESS':
            return Object.assign({}, state, { memberInfo: action.memberInfo, status: action.status });
        case 'MEMBER_INFO_FAIL':
            return Object.assign({}, state);
        case 'MEMBER_INFO_REQUEST':
            return Object.assign({}, state);
        default:
            return state;
    }
}

export function newMember(state = initialState, action = {}) {
    switch (action.type) {
        case 'NEW_MEMBER_SUCCESS':
            return Object.assign({}, state, { newMember: action.newMember, status: action.status });
        case 'NEW_MEMBER_FAIL':
            return Object.assign({}, state);
        case 'NEW_MEMBER_REQUEST':
            return Object.assign({}, state);
        default:
            return state;
    }
}

export function singleSale(state = initialState, action = {}) {
    switch (action.type) {
        case 'SINGLE_SALE_SUCCESS':
            return Object.assign({}, state, { singleSale: action.singleSale, status: action.status });
        case 'SINGLE_SALE_FAIL':
            return Object.assign({}, state);
        case 'SINGLE_SALE_REQUEST':
            return Object.assign({}, state);
        default:
            return state;
    }
}