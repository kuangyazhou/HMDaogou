import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Icon, Tabs } from 'amazeui-touch';
import { getTodaySale, getOrderInfo, getmemberInfo, getSingleSale } from '../../actions/supervisor/supervisor';

import './supervisor.scss';
/* eslint no-unused-expressions: [0] */
/* eslint arrow-body-style: [0] */
/* eslint react/self-closing-comp: [0] */
/* eslint linebreak-style: [0] */
/* eslint indent: [0] */
/* eslint react/jsx-indent: [0] */
/* eslint max-len: [0] */
/* eslint eol-last: [0] */

class MonthSale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Sale: {
                storeList: [],
                total: null,
            },
            Order: {
                storeList: [],
                total: null,
            },
            Member: {
                storeList: [],
                total: null,
            },
            SingleSale: {
                storeList: [],
                total: null,
            },
        };
        this.tabIndex = {
            sale: 0,
            order: 1,
            member: 2,
            single: 3,
        };
        this.changeTab = this.changeTab.bind(this);
        this.back = this.back.bind(this);
    }
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(getTodaySale());
        dispatch(getOrderInfo());
        dispatch(getmemberInfo());
        dispatch(getSingleSale());
    }
    componentDidMount() { }
    componentWillReceiveProps(props) {
        const { todaySale, orderInfo, memberInfo, singleSale } = props;
        // console.log(todaySale, orderInfo, memberInfo, singleSale);
        todaySale.status ? this.setState({ Sale: todaySale.todaySale.pager.currentmonth }) : null;
        orderInfo.status ? this.setState({ Order: orderInfo.orderInfo.pager.currentmonth }) : null;
        memberInfo.status ? this.setState({ Member: memberInfo.memberInfo.pager.currentmonth }) : null;
        singleSale.status ? this.setState({ SingleSale: singleSale.singleSale.pager.currentmonth }) : null;
        // console.log(todaySale.todaySale.pager.today);
    }
    componentWillUnmount() { }
    changeTab() { }
    back() {
        const { router } = this.context;
        router.push('/supervisor');
    }
    sortNumber(type) {
        return (a, b) => {
            return b[type] - a[type];
        };
    }
    judgeIcon(i) {
        let icon = null;
        switch (i) {
            case 0:
                icon = <i className="iconfont icon-diyiming" />;
                break;
            case 1:
                icon = <i className="iconfont icon-dierming" />;
                break;
            case 2:
                icon = <i className="iconfont icon-disanming" />;
                break;
            default:
                break;
        }
        return icon;
    }
    render() {
        return (
            <div className="today-sale flex column">
                <div className="super-header flex between center">
                    <span className="flex back">
                        <Icon className="f16" onClick={this.back} name="left" />
                    </span>
                    <span className="flex text">月度经营数据详情</span>
                    <span className="flex"></span>
                </div>
                <div className="flex center">
                    <Tabs className="hm-supervisor-statistics-nav" onAction={this.changeTab} >
                        <Tabs.Item title="销售额" navStyle="alert">
                            <div className="today-main flex">
                                <span>所管辖门店本月总销售额<span className="orange m5">{Number(this.state.Sale.total).toLocaleString()}</span>元</span>
                            </div>
                            <div className="flex" style={{ margin: '0.5rem' }}>门店销售额排行</div>
                            <div className="today-main flex column">
                                <div className="flex row around list-item">
                                    <span className="flex center w25">排行</span>
                                    <span className="flex center w50">门店名称</span>
                                    <span className="flex center w25">销售额</span>
                                </div>
                                {this.state.Sale.storeList.sort(this.sortNumber('orderSaleInfo')).map((e, i) => {
                                    return (<div className="flex row evenly list-item">
                                        <span className="flex center w25 f16">{i < 3 ? this.judgeIcon(i) : i + 1}</span>
                                        <span className="flex center w50 f12">{e.storeName}</span>
                                        <span className="flex center w25 f12">{Number(e.orderSaleInfo).toLocaleString()}</span>
                                        {/* <span className="flex evenly">{Number((e.orderSaleInfo / this.state.Sale.total) * 100).toLocaleString()}%</span> */}
                                    </div>);
                                })}
                            </div>
                        </Tabs.Item>
                        <Tabs.Item title="订单数" navStyle="alert">
                            <div className="today-main flex">
                                <span>所管辖门店本月总订单数<span className="orange m5">{this.state.Order.total}</span></span>
                            </div>
                            <div className="flex" style={{ margin: '0.5rem' }}>门店订单数排行
                            </div>
                            <div className="today-main flex column">
                                <div className="flex row around list-item">
                                    <span className="flex center w25">排行</span>
                                    <span className="flex center w50">门店名称</span>
                                    <span className="flex center w25">订单数</span>
                                </div>
                                {this.state.Order.storeList.sort(this.sortNumber('orderCountInfo')).map((e, i) => {
                                    return (<div className="flex row evenly list-item">
                                        <span className="flex center w25 f16">{i < 3 ? this.judgeIcon(i) : i + 1}</span>
                                        <span className="flex center w50 f12">{e.storeName}</span>
                                        <span className="flex center w25 f12">{e.orderCountInfo}</span>
                                    </div>);
                                })}
                            </div></Tabs.Item>
                        <Tabs.Item title="交易会员数" navStyle="alert">
                            <div className="today-main flex">
                                <span>所管辖门店本月总交易会员数<span className="orange m5">{this.state.Member.total}</span></span>
                            </div>
                            <div className="flex" style={{ margin: '0.5rem' }}>门店交易会员数排行</div>
                            <div className="today-main flex column list-item">
                                <div className="flex row around">
                                    <span className="flex center w25">排行</span>
                                    <span className="flex center w50">门店名称</span>
                                    <span className="flex center w25">会员数</span>
                                </div>
                                {this.state.Member.storeList.sort(this.sortNumber('newMemberinfo')).map((e, i) => {
                                    return (<div className="flex row evenly list-item">
                                        <span className="flex center w25 f16">{i < 3 ? this.judgeIcon(i) : i + 1}</span>
                                        <span className="flex center w50 f12">{e.storeName}</span>
                                        <span className="flex center w25 f12">{e.newMemberinfo}</span>
                                    </div>);
                                })}
                            </div></Tabs.Item>
                        <Tabs.Item title="客单价" navStyle="alert">
                            <div className="today-main flex">
                                <span>所管辖门店本月客单价<span className="orange m5">{Number(this.state.SingleSale.total).toLocaleString()}</span></span>
                            </div>
                            <div className="flex" style={{ margin: '0.5rem' }}>门店客单价排行</div>
                            <div className="today-main flex column">
                                <div className="flex row around list-item">
                                    <span className="flex center w25">排行</span>
                                    <span className="flex center w50">门店名称</span>
                                    <span className="flex center w25">客单价</span>
                                </div>
                                {this.state.SingleSale.storeList.sort(this.sortNumber('consumeInfo')).map((e, i) => {
                                    return (<div className="flex row evenly list-item">
                                        <span className="flex center w25 f16">{i < 3 ? this.judgeIcon(i) : i + 1}</span>
                                        <span className="flex center w50 f12">{e.storeName}</span>
                                        <span className="flex center w25 f12">{e.consumeInfoAsMoney}</span>
                                    </div>);
                                })}
                            </div></Tabs.Item>
                    </Tabs>
                </div>

            </div >
        );
    }
}
MonthSale.contextTypes = {
    router: PropTypes.object.isRequired,
};

MonthSale.propTypes = {
    dispatch: PropTypes.func.isRequired,
    todaySale: PropTypes.Object,
    orderInfo: PropTypes.Object,
    memberInfo: PropTypes.Object,
    singleSale: PropTypes.Object,
};

function mapStateToProps(state) {
    return {
        todaySale: state.todaySale,
        orderInfo: state.orderInfo,
        memberInfo: state.memberInfo,
        singleSale: state.singleSale,
    };
}

export default connect(mapStateToProps)(MonthSale);