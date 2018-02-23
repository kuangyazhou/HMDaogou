import 'isomorphic-fetch';
import moment from 'moment';

require('es6-promise').polyfill();

// export const RESTFUL_SERVER = 'http://crmbackservice.weihaojiao.com';
// export const RESTFUL_SERVER = 'http://crmbackservice.hemiao100.com';
// export const RESTFUL_SERVER = 'http://melody.weihaojiao.com/hemiao-crm-backservice';
// export const RESTFUL_SERVER = 'http://crmbackservice.hemiao100.com';
/* eslint no-unused-expressions: [0] */
/* eslint arrow-body-style: [0] */
/* eslint react/self-closing-comp: [0] */
/* eslint linebreak-style: [0] */
/* eslint indent: [0] */
/* eslint react/jsx-indent: [0] */
/* eslint max-len: [0] */
/* eslint eol-last: [0] */
// 熊伟达
export const RESTFUL_SERVER = 'http://192.168.188.167:8070';
// 梁峰
// export const RESTFUL_SERVER = 'http://192.168.188.196:8080/hemiao-crm-backservice';
// 陈红帅
// export const RESTFUL_SERVER = 'http://192.168.188.180:8080/hemiao-back';
// 李思勇
export const RESTFUL_SERVER = 'http://192.168.188.132:8084';
// 全局默认的分页参数
export const DEFAULT_QUERY_PARAMS = {
    pageSize: 15,
    currentPage: 1,
};

// 后端的返回的出错代码映射
export const RESTFUL_ERROR_MESSAGE = {
    '-100': '账号或密码错误，请重新输入',
    '-200': '用户信息有误，请联系管理员',
    '-999': '未知错误',
    '-1': {
        login: '登录人职位不允许登录导购平台(不是导购、督导、店长)',
        current_day_task: '未获取到任何今日任务信息',
        undo_task: '未获取到任何未完成任务信息',
        store_note: '未获取到任何门店通知信息',
        month_sale: '未设置本月销售完成进度',
    },
};

// 根据code返回错误上下文
function errorMsg(errCode, module) {
    switch (errCode) {
        case -100:
            return RESTFUL_ERROR_MESSAGE['-100'];
        case -200:
            return RESTFUL_ERROR_MESSAGE['-200'];
        case -999:
            return RESTFUL_ERROR_MESSAGE['-999'];
        case -1:
            switch (module) {
                case 'login':
                    return RESTFUL_ERROR_MESSAGE['-1'].module;
                case 'current_day_task':
                    return RESTFUL_ERROR_MESSAGE['-1'].module;
                case 'undo_task':
                    return RESTFUL_ERROR_MESSAGE['-1'].module;
                case 'store_note':
                    return RESTFUL_ERROR_MESSAGE['-1'].module;
                case 'month_sale':
                    return RESTFUL_ERROR_MESSAGE['-1'].module;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return RESTFUL_ERROR_MESSAGE['-999'];
}

// 检查响应返回的状态.
export function checkStatus(response) {
    if (response.status < 200 || response.status > 300) { // (!response.ok)
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
    return response;
}

export function parseJSON(response) {
    return response.json();
}

// redux-saga使用的调用后端服务的工具方法.
export function fetchApi(url, config) {
    return fetch(url, config)
        .then(checkStatus)
        .then(parseJSON)
        .then((json) => {
            if (json.code === 0) {
                return json;
            }
            if (json.code === -100) {
                throw new Error('用户名或密码错误');
            }
            if (json.code === -200) {
                throw new Error('用户状态冻结');
            }
            return {};
        })
        .catch((error) => {
            const response = error.response;
            if (error.message === '用户名或密码错误') {
                throw new Error('用户名或密码错误!');
            }
            if (error.message === '用户状态冻结') {
                throw new Error('用户状态冻结!');
            }
            if (response === undefined) {
                throw new Error('未知后台错误......');
            } else {
                error.status = response.status;
                error.statusText = response.statusText;
                response.text().then((text) => {
                    try {
                        const json = JSON.parse(text);
                        error.message = json.message;
                    } catch (ex) {
                        switch (error.status) {
                            case 404:
                            case 415:
                            case 403:
                                error.message = '服务器正在卖力处理中';
                                // error.message = `请求后端数据出现错误, 代码为${error.status}`;
                                break;
                            case 500:
                                error.message = '服务器正在卖力处理中';
                                // error.message = '后端服务出现错误, 代码为500';
                                break;
                            default:
                                error.message = '服务器正在卖力处理中';
                                // error.message = `未知后台错误, 代码为: ${error.status}`;
                        }
                    }
                });
                throw error;
            }
        });
}

export function callApi(url, config, request, onRequestSuccess, onRequestFailure) {
    return (dispatch) => {
        dispatch(request);
        return fetch(url, config)
            .then(checkStatus)
            .then(parseJSON)
            .then((json) => {
                if (json.code !== 0 && json.code !== -2 && json.code !== -3 && json.code !== -7) {
                    const error = {};
                    error.status = json.code;
                    if (json.code === -1) {
                        const module =
                            (url.substr(url.lastIndexOf('/') + 1).replace('.json', '').split('?'))[0];
                        error.message = errorMsg(json.code, module);
                    }
                    error.message = errorMsg(json.code);
                    dispatch(onRequestFailure(error));
                } else {
                    const data = JSON.parse(JSON.stringify(json).replace(/\r/g, '').replace(/\n/g, '').replace(/\s/g, ''));
                    dispatch(onRequestSuccess(data));
                }
            })
            .catch((error) => {
                const response = error.response;
                if (response === undefined) {
                    dispatch(onRequestFailure(error));
                } else {
                    error.status = response.status;
                    error.statusText = response.statusText;
                    response.text().then((text) => {
                        try {
                            const json = JSON.parse(text);
                            error.message = json.message;
                        } catch (ex) {
                            switch (error.status) {
                                case 404:
                                case 415:
                                case 403:
                                    error.message = '服务器正在卖力处理中';
                                    // error.message = `请求后端数据出现错误, 代码为${error.status}`;
                                    break;
                                case 500:
                                    error.message = '服务器正在卖力处理中';
                                    // error.message = '后端服务出现错误, 代码为500';
                                    break;
                                default:
                                    error.message = '服务器正在卖力处理中';
                                    // error.message = `未知后台错误, 代码为: ${error.status}`;
                            }
                        }
                        dispatch(onRequestFailure(error));
                    });
                }
            });
    };
}

export function newFetch(url, config) {
    return fetch(url, config)
        .then(checkStatus)
        .then(parseJSON)
        .then((json) => {
            if (json.code === 0) {
                return json;
            }
            if (json.code === -100) {
                throw new Error('用户名或密码错误');
            }
            if (json.code === -200) {
                throw new Error('用户状态冻结');
            }
            return {};
        })
        .catch((error) => {
            const response = error.response;
            if (error.message === '用户名或密码错误') {
                throw new Error('用户名或密码错误!');
            }
            if (error.message === '用户状态冻结') {
                throw new Error('用户状态冻结!');
            }
            if (response === undefined) {
                throw new Error('未知后台错误......');
            } else {
                error.status = response.status;
                error.statusText = response.statusText;
                response.text().then((text) => {
                    try {
                        const json = JSON.parse(text);
                        error.message = json.message;
                    } catch (ex) {
                        switch (error.status) {
                            case 404:
                            case 415:
                            case 403:
                                error.message = '服务器正在卖力处理中';
                                // error.message = `请求后端数据出现错误, 代码为${error.status}`;
                                break;
                            case 500:
                                error.message = '服务器正在卖力处理中';
                                // error.message = '后端服务出现错误, 代码为500';
                                break;
                            default:
                                error.message = '服务器正在卖力处理中';
                                // error.message = `未知后台错误, 代码为: ${error.status}`;
                        }
                    }
                });
                throw error;
            }
        });
}

// 后端token的标示符以及对应的getter和setter方法.
// 目前后台没有token的实现, 暂时采用userid实现.
// 超时时间暂定为30分钟.
export const USER_ID_TOKEN = 'user_id_token';
export const USER_TIME_OUT = 'user_time_out';
export function setIdToken(idToken, trim) {
    if (!trim) {
        localStorage.setItem(USER_ID_TOKEN, JSON.stringify(idToken));
        localStorage.setItem(USER_TIME_OUT, moment().add(7, 'days').toString());
    } else {
        localStorage.setItem(USER_ID_TOKEN, idToken.replace(/\\/g, ''));
        localStorage.setItem(USER_TIME_OUT, moment().add(7, 'days').toString());
    }
}

// 用来判断用户列表页是否是第一次加载.
export function setLoginTime(param) {
    sessionStorage.setItem('isFirstLogin', param);
}
export function getLoginTime() {
    return sessionStorage.getItem('isFirstLogin');
}
export function removeLoginTime() {
    sessionStorage.removeItem('isFirstLogin');
}

// 设置是否当天第一次弹出鼓励语
export function setIsToday(param) {
    localStorage.setItem('isToday', param);
}
export function getIsToday() {
    return localStorage.getItem('isToday');
}
export function removeIsToday() {
    localStorage.removeItem('isToday');
}

export function setKeyWords(param) {
    sessionStorage.setItem('keyWords', param);
}

export function getKeyWords() {
    return sessionStorage.getItem('keyWords');
}

export function removeKeyWords() {
    sessionStorage.removeItem('keyWords');
}

export function removeIdToken() { localStorage.removeItem(USER_ID_TOKEN); }
export function loadIdToken() { return JSON.parse(localStorage.getItem(USER_ID_TOKEN)); }

// 用来获取用户列表, 此处是缓存.
export function setCustomers(customers) {
    localStorage.setItem('CUSTOMERS', JSON.stringify(customers));
}
export function getCustomers() {
    return JSON.parse(localStorage.getItem('CUSTOMERS'));
}
export function removeCustomers() {
    localStorage.removeItem('CUSTOMERS');
}

// 用来判断用户列表页是否是第一次加载.
export function setCustomersFlag(flag) {
    sessionStorage.setItem('isLoaded', flag);
}
export function getCustomersFlag() {
    return sessionStorage.getItem('isLoaded');
}
export function removeCustomersFlag() {
    sessionStorage.removeItem('isLoaded');
}

// 保存自由涮选的条件.
// 用来获取用户列表, 此处是缓存.
export function addFilterConditions(conditions) {
    localStorage.setItem('CUSTOMER_FILTER_CONDITIONS', JSON.stringify(conditions));
}
export function getFilterConditions() {
    return JSON.parse(localStorage.getItem('CUSTOMER_FILTER_CONDITIONS'));
}
export function removeFilterConditions() {
    localStorage.removeItem('CUSTOMER_FILTER_CONDITIONS');
}
// 保存列表首页三个筛选条件.
export function addIndexFilterConditions(conditions) {
    localStorage.setItem('CUSTOMER_INDEX_FILTER_CONDITIONS', JSON.stringify(conditions));
}
export function getIndexFilterConditions() {
    return JSON.parse(localStorage.getItem('CUSTOMER_INDEX_FILTER_CONDITIONS'));
}
export function removeIndexFilterConditions() {
    localStorage.removeItem('CUSTOMER_INDEX_FILTER_CONDITIONS');
}

// 返回请求需要的token, 给一些硬的页面跳转使用.
/* eslint max-len: [0] */
export function getToken() {
    const profile = loadIdToken();
    if (profile) return `${profile.userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
    return '';
}

// 刷新页面后需要检查用户是否已经登录.
export function loadUserProfile() {
    try {
        const idToken = JSON.parse(localStorage.getItem(USER_ID_TOKEN));
        const now = moment();
        if (now.isAfter(new Date(localStorage.getItem(USER_TIME_OUT)))) {
            // user profile has expired.
            removeIdToken();
            return null;
        }
        return idToken;
    } catch (err) {
        return null;
    }
}

// 排序对象
export function sortObj(obj, key, type) {
    let template;
    if (type === 'down') {
        for (let i = 0; i < obj.length - 1; i++) {
            for (let j = 0; j < obj.length - 1; j++) {
                if (obj[j][key] < obj[j + 1][key]) {
                    template = obj[j];
                    obj[j] = obj[j + 1];
                    obj[j + 1] = template;
                }
            }
        }
    } else {
        for (let i = 0; i < obj.length - 1; i++) {
            for (let j = 0; j < obj.length - 1; j++) {
                if (obj[j][key] > obj[j + 1][key]) {
                    template = obj[j];
                    obj[j] = obj[j + 1];
                    obj[j + 1] = template;
                }
            }
        }
    }
    return obj;
}

// 按百分比排序对象
export function sortObjCalc(obj, firstKey, secondKey, type) {
    let template;
    if (type === 'down') {
        for (let i = 0; i < obj.length - 1; i++) {
            for (let j = 0; j < obj.length - 1; j++) {
                if (obj[j][firstKey] / obj[j][secondKey] < obj[j + 1][firstKey] / obj[j + 1][secondKey]) {
                    template = obj[j];
                    obj[j] = obj[j + 1];
                    obj[j + 1] = template;
                }
            }
        }
    } else {
        for (let i = 0; i < obj.length - 1; i++) {
            for (let j = 0; j < obj.length - 1; j++) {
                if (obj[j][firstKey] / obj[j][secondKey] > obj[j + 1][firstKey] / obj[j + 1][secondKey]) {
                    template = obj[j];
                    obj[j] = obj[j + 1];
                    obj[j + 1] = template;
                }
            }
        }
    }
    return obj;
}