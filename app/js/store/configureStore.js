import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import createLogger from 'redux-logger';

/* eslint indent: [0] */
/* eslint max-len: [0] */
/* eslint eol-last: [0] */
import auth from '../reducers/auth';
import user from '../reducers/user';
import stores from '../reducers/store';
import client from '../reducers/clientCare';
import { todaySale, storeList, orderInfo, memberInfo, newMember, singleSale, saleChance } from '../reducers/supervisor';
import rootSaga from '../sagas/index';
import {
    customersByPage,
    filtedProductsByCID,
    customerDetailById,
    ordersByCustomerOldId,
    customerCompilation,
    customerRecord,
    orderCategories,
    customerOrdersInfo,
    customerContactProgress,
    customerConsumeRank,
    customerContactProgressDetail,
    customerEvaluate,
    marketing,
    customerMessage,
    customerCallInfo,
    customerCallRecord,
    customerTrace,
    customerThirdPartyCall,
    customerMyRelations,
    getCustomerRecommend,
    sendCustomerCoupon,
    sendCustomerMarketing,
    staffSaleRank,
    customerCaptchaList,
} from '../reducers/customer.js';

const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
    auth,
    user,
    stores,
    client,
    todaySale,
    storeList,
    orderInfo,
    memberInfo,
    newMember,
    singleSale,
    saleChance,
    customersByPage,
    customerDetailById,
    filtedProductsByCID,
    ordersByCustomerOldId,
    customerCompilation,
    customerRecord,
    orderCategories,
    customerOrdersInfo,
    customerContactProgress,
    customerConsumeRank,
    marketing,
    customerMessage,
    customerCallInfo,
    customerEvaluate,
    customerTrace,
    customerContactProgressDetail,
    customerCallRecord,
    customerThirdPartyCall,
    customerMyRelations,
    getCustomerRecommend,
    sendCustomerCoupon,
    sendCustomerMarketing,
    staffSaleRank,
    customerCaptchaList,
});

const initialState = {};

export default function configureStore() {
    let store;

    if (module.hot) {
        store = createStore(rootReducer, initialState, compose(
            applyMiddleware(thunkMiddleware, sagaMiddleware, logger),
            window.devToolsExtension ? window.devToolsExtension() : f => f));
    } else {
        store = createStore(rootReducer, initialState, compose(
            applyMiddleware(thunkMiddleware, sagaMiddleware), f => f));
    }

    sagaMiddleware.run(rootSaga);

    return store;
}