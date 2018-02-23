import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { indexOf, lastIndexOf } from 'lodash';

import './supervisor.scss';

import SaleSchame from './schame';
import HMSelect from '../../components/index.js';
import { setIdToken, loadIdToken } from './../../utils/apiUtils';
import { getTodaySale, getStoreList, getOrderInfo, getmemberInfo, getNewMember, getSingleSale, getSaleChance } from '../../actions/supervisor/supervisor';

/* eslint no-unused-expressions: [0] */
/* eslint arrow-body-style: [0] */
/* eslint react/self-closing-comp: [0] */
/* eslint linebreak-style: [0] */
/* eslint indent: [0] */
/* eslint react/jsx-indent: [0] */
/* eslint max-len: [0] */
/* eslint eol-last: [0] */

class Supervisor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Sale: SaleSchame,
            Order: SaleSchame,
            TransMember: SaleSchame,
            Single: SaleSchame,
            storeList: [],
            newMember: {
                StoreList: [],
                Baby: null,
                Mom: null,
            },
            saleChance: {
            },
            guideNum: null,
            Follow: null,
            Chance: null,
            Percentage: null,
        };
        this.selectClick = this.selectClick.bind(this);
        this.todayClick = this.todayClick.bind(this);
        this.monthClick = this.monthClick.bind(this);
        this.newMemberClick = this.newMemberClick.bind(this);
        this.saleChanceClick = this.saleChanceClick.bind(this);
    }
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(getSaleChance());
        dispatch(getTodaySale());
        dispatch(getStoreList());
        dispatch(getOrderInfo());
        dispatch(getmemberInfo());
        dispatch(getNewMember());
        dispatch(getSingleSale());
    }
    componentDidMount() { }
    componentWillReceiveProps(nextProps) {
        const { todaySale, storeList, orderInfo, memberInfo, newMember, singleSale, saleChance } = nextProps;
        todaySale.status ? this.setState({ Sale: todaySale.todaySale.pager }) : null;
        orderInfo.status ? this.setState({ Order: orderInfo.orderInfo.pager }) : null;
        memberInfo.status ? this.setState({ TransMember: memberInfo.memberInfo.pager }) : null;
        singleSale.status ? this.setState({ Single: singleSale.singleSale.pager }) : null;
        if (newMember.status) {
            // const list = [];
            let baby = 0;
            let mom = 0;
            newMember.newMember.baby.forEach((e, i) => {
                baby += e.newMemberinfo ? e.newMemberinfo : 0;
                mom += newMember.newMember.mom[i].newMemberinfo ? newMember.newMember.mom[i].newMemberinfo : 0;
                // list.push({
                //     name: e.storeName,
                //     baby: e.newMemberinfo ? e.newMemberinfo : 0,
                //     mom: newMember.newMember.mom[i].newMemberinfo ? newMember.newMember.mom[i].newMemberinfo : 0,
                // });
            });
            // console.log(list, baby, mom);
            this.setState({
                newMember: {
                    // StoreList: list,
                    Baby: baby,
                    Mom: mom,
                },
            });
        }
        if (storeList.status && storeList.storeList.pageItems.length > 0) {
            const temp = [];
            storeList.storeList.pageItems.forEach(e => {
                temp.push({
                    label: e.name,
                    value: e.id,
                });
            });
            this.setState({
                storeList: temp,
                guideNum: storeList.storeList.pager.guiderNum,
            });
        }
        if (saleChance.status && saleChance.saleChance.pageItems.length > 0) {
            this.setState({
                saleChance: saleChance.saleChance.pageItems,
            });
            let follow = null;
            let chance = null;
            saleChance.saleChance.pageItems.forEach((e) => {
                follow += e.followChance;
                chance += e.totalChance;
            });
            if (chance) {
                this.setState({
                    Percentage: ((follow / chance) * 100).toFixed(2),
                });
            }
            this.setState({
                Follow: follow,
                Chance: chance,
            });
        }
    }
    componentWillUnmount() { }
    selectClick(e) {
        const token = loadIdToken();
        token.storeOutletId = e.value;
        setIdToken(token);
        const { router } = this.context;
        const storeName = e.label;
        router.push(`/managerHome/${storeName}/staffSales`);
        sessionStorage.setItem('userType', '督导');
    }
    todayClick() {
        const { router } = this.context;
        router.push('/supervisor/todaysale');
    }
    monthClick() {
        const { router } = this.context;
        router.push('/supervisor/monthsale');
    }
    newMemberClick() {
        const { router } = this.context;
        router.push('/supervisor/newmember');
    }
    saleChanceClick() {
        const { router } = this.context;
        router.push('/supervisor/salechance');
    }
    render() {
        const token = loadIdToken();
        return (
            <div className="container-scrollable">
                <div className="supervisor flex column">
                    <div className="flex header column">
                        <div className="flex center between">
                            <span className="flex">{token.name}</span>
                            <span className="flex center font26">督导系统</span>
                            <span className="flex negative-margin w50 end">
                                <HMSelect text="门店" data={this.state.storeList} selectEmit={this.selectClick}></HMSelect>
                                {/* <HMSelect text="test"></HMSelect> */}
                            </span>
                        </div>
                        <div className="flex total around">
                            <div className="flex center column">
                                <span className="flex orange">{this.state.storeList.length}</span>
                                <span className="flex">门店数量</span>
                            </div>
                            <div className="flex center column">
                                <span className="flex orange">{this.state.guideNum}</span>
                                <span className="flex">导购数量</span>
                            </div>
                            {/* <div className="flex w33 center column">
                            <span className="flex orange">0</span>
                            <span className="flex">维护会员数量</span>
                        </div> */}
                        </div>
                    </div>
                    <div className="main">
                        <div className="flex totday-sale radius column">
                            <div className="flex sale-header between center">
                                <span className="flex f12">今日经营数据</span>
                                <span className="flex" onClick={this.todayClick}>></span>
                            </div>
                            <div className="flex sale-table column">
                                <div className="flex row around table-row">
                                    <span className="flex table-item center gray f12">经营项</span>
                                    <span className="flex table-item center gray f12">今日</span>
                                    <span className="flex table-item center gray f12">昨日</span>
                                </div>
                                <div className="flex row around table-row">
                                    <span className="flex table-item center f12">销售额</span>
                                    <span className="flex orange table-item center">{Number(this.state.Sale.today.total).toLocaleString()}</span>
                                    <span className="flex table-item center">{Number(this.state.Sale.yesterday.total).toLocaleString()}</span>
                                </div>
                                <div className="flex row around table-row">
                                    <span className="flex table-item center f12">订单数</span>
                                    <span className="flex orange table-item center">{this.state.Order.today.total}</span>
                                    <span className="flex table-item center">{this.state.Order.yesterday.total}</span>
                                </div>
                                <div className="flex row around table-row">
                                    <span className="flex table-item center f12">交易会员数</span>
                                    <span className="flex orange table-item center">{this.state.TransMember.today.total}</span>
                                    <span className="flex table-item center">{this.state.TransMember.yesterday.total}</span>
                                </div>
                                <div className="flex row around table-row">
                                    <span className="flex table-item center f12">客单价</span>
                                    <span className="flex orange table-item center">{Number(this.state.Single.today.total).toLocaleString()}</span>
                                    <span className="flex table-item center">{Number(this.state.Single.yesterday.total).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex month-sale radius column">
                            <div className="flex sale-header between center">
                                <span className="flex f12">月度经营数据</span>
                                <span className="flex" onClick={this.monthClick}>></span>
                            </div>
                            <div className="flex sale-table column">
                                <div className="flex row around table-row">
                                    <span className="flex table-item center gray f12">经营项</span>
                                    <span className="flex table-item center gray f12">本月<span className="font10 red">截止昨日</span></span>
                                    <span className="flex table-item center gray f12">上月</span>
                                </div>
                                <div className="flex row around table-row">
                                    <span className="flex table-item center f12">销售额</span>
                                    <span className="flex orange table-item center">{Number(this.state.Sale.currentmonth.total).toLocaleString()}</span>
                                    <span className="flex table-item center">{Number(this.state.Sale.lastmonth.total).toLocaleString()}</span>
                                </div>
                                <div className="flex row around table-row">
                                    <span className="flex table-item center f12">订单数</span>
                                    <span className="flex orange table-item center">{this.state.Order.currentmonth.total}</span>
                                    <span className="flex table-item center">{this.state.Order.lastmonth.total}</span>
                                </div>
                                <div className="flex row around table-row">
                                    <span className="flex table-item center f12">交易会员数</span>
                                    <span className="flex orange table-item center">{this.state.TransMember.currentmonth.total}</span>
                                    <span className="flex table-item center">{this.state.TransMember.lastmonth.total}</span>
                                </div>
                                <div className="flex row around table-row">
                                    <span className="flex table-item center f12">客单价</span>
                                    <span className="flex orange table-item center">{Number(this.state.Single.currentmonth.total).toLocaleString()}</span>
                                    <span className="flex table-item center">{Number(this.state.Single.lastmonth.total).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex month-new radius between">
                            <div className="flex around new-text">
                                <div className="flex column center">
                                    <span className="flex orange">{this.state.newMember.Baby + this.state.newMember.Mom}</span>
                                    <span className="flex f12">今日新客开发情况</span>
                                </div>
                                <div className="flex column center">
                                    <span className="flex">{this.state.newMember.Mom} </span>
                                    <span className="flex f12">孕妈</span>
                                </div>
                                <div className="flex column center">
                                    <span className="flex">{this.state.newMember.Baby} </span>
                                    <span className="flex f12">萌宝</span>
                                </div>
                            </div>
                            <div className="flex center">
                                <span className="flex" onClick={this.newMemberClick}>></span>
                            </div>
                        </div>
                        <div className="flex store-sale radius between">
                            <div className="flex column center">
                                <span className="flex f12">销售机会跟进统计</span>
                            </div>
                            <div className="flex column center">
                                <span className="flex orange">{this.state.Follow}</span>
                                <span className="flex f12">跟进数</span>
                            </div>
                            <div className="flex column center">
                                <span className="flex">{this.state.Chance}</span>
                                <span className="flex f12">应跟进数</span>
                            </div>
                            <div className="flex column center">
                                <span className="flex">{this.state.Percentage}%</span>
                                <span className="flex f12">完成度</span>
                            </div>
                            <div className="flex center">
                                <span className="flex" onClick={this.saleChanceClick}>></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Supervisor.contextTypes = {
    router: PropTypes.object.isRequired,
};

Supervisor.propTypes = {
    dispatch: PropTypes.func.isRequired,
    todaySale: PropTypes.Object,
    storeList: PropTypes.Object,
    orderInfo: PropTypes.Object,
    memberInfo: PropTypes.Object,
    newMember: PropTypes.Object,
    singleSale: PropTypes.Object,
    saleChance: PropTypes.Object,
};

function mapStateToProps(state) {
    return {
        todaySale: state.todaySale,
        storeList: state.storeList,
        orderInfo: state.orderInfo,
        memberInfo: state.memberInfo,
        newMember: state.newMember,
        singleSale: state.singleSale,
        saleChance: state.saleChance,
    };
}
export default connect(mapStateToProps)(Supervisor);