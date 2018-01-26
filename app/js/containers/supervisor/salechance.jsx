import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'amazeui-touch';

import { getSaleChance } from '../../actions/supervisor/supervisor';
import './supervisor.scss';
/* eslint no-unused-expressions: [0] */
/* eslint arrow-body-style: [0] */
/* eslint react/self-closing-comp: [0] */
/* eslint linebreak-style: [0] */
/* eslint indent: [0] */
/* eslint react/jsx-indent: [0] */
/* eslint max-len: [0] */
/* eslint eol-last: [0] */

class SaleChance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SaleChance: [],
        };
        this.back = this.back.bind(this);
    }
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(getSaleChance());
    }
    componentDidMount() { }
    componentWillReceiveProps(nextProps) {
        const { saleChance } = nextProps;
        // console.log(saleChance);
        // saleChance.status ? this.setState({ SaleChance: saleChance.saleChance.pageItems }) : null;
        if (saleChance.status) {
            const list = [];
            saleChance.saleChance.pageItems.forEach(e => {
                list.push({
                    name: e.storeName,
                    follow: e.followChance,
                    total: e.totalChance,
                    percentage: e.totalChance ? e.followChance / e.totalChance : null,
                });
            });
            this.setState({ SaleChance: list });
        }
    }
    componentWillUnmount() { }
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
                    <span className="flex back f16">
                        <Icon onClick={this.back} name="left" />
                    </span>
                    <span className="flex text">门店销售机会跟进统计</span>
                    <span className="flex"></span>
                </div>
                <div className="today-main flex column">
                    <div className="flex row around list-item">
                        <span className="flex center w15 f12">排行</span>
                        <span className="flex center w30 f12">门店名称</span>
                        <span className="flex center w40 f12">跟进数/应跟进数</span>
                        <span className="flex center w15 f12">完成度</span>
                    </div>
                    {this.state.SaleChance.sort(this.sortNumber('percentage')).map((e, i) => {
                        return (<div className="flex row evenly list-item">
                            <span className="flex center w15 f16">{i < 3 ? this.judgeIcon(i) : i + 1}</span>
                            <span className="flex center w40 f12">{e.name}</span>
                            <span className="flex center w30 f12">{e.follow}/{e.total}</span>
                            <span className="flex center w15 f12">{Number(e.percentage * 100).toLocaleString()}%</span>
                        </div>);
                    })}
                </div>
            </div>
        );
    }
}

SaleChance.contextTypes = {
    router: PropTypes.object.isRequired,
};

SaleChance.propTypes = {
    dispatch: PropTypes.func.isRequired,
    saleChance: PropTypes.Object,
};

function mapStateToProps(state) {
    return {
        saleChance: state.saleChance,
    };
}

export default connect(mapStateToProps)(SaleChance);