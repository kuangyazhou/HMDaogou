import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'amazeui-touch';
import { getNewMember } from '../../actions/supervisor/supervisor';
import './supervisor.scss';
/* eslint no-unused-expressions: [0] */
/* eslint arrow-body-style: [0] */
/* eslint react/self-closing-comp: [0] */
/* eslint linebreak-style: [0] */
/* eslint indent: [0] */
/* eslint react/jsx-indent: [0] */
/* eslint max-len: [0] */
/* eslint eol-last: [0] */

class NewMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newMember: {
                storeList: [],
            },
        };
        this.back = this.back.bind(this);
    }
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(getNewMember());
    }
    componentDidMount() { }
    componentWillReceiveProps(nextProps) {
        const { newMember } = nextProps;
        if (newMember.status) {
            const list = [];
            newMember.newMember.baby.forEach((e, i) => {
                list.push({
                    name: e.storeName,
                    baby: e.newMemberinfo ? e.newMemberinfo : 0,
                    mom: newMember.newMember.mom[i].newMemberinfo ? newMember.newMember.mom[i].newMemberinfo : 0,
                    total: e.newMemberinfo ? e.newMemberinfo : 0 + newMember.newMember.mom[i].newMemberinfo ? newMember.newMember.mom[i].newMemberinfo : 0,
                });
            });
            this.setState({
                newMember: {
                    storeList: list,
                },
            });
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
        // console.log(this.state);
        return (
            <div className="today-sale flex column">
                <div className="super-header flex between center">
                    <span className="flex back f16">
                        <Icon onClick={this.back} name="left" />
                    </span>
                    <span className="flex text">今日新客开发情况</span>
                    <span className="flex"></span>
                </div>
                <div className="today-main flex column">
                    <div className="flex row around list-item">
                        <span className="flex center w15 f12">排行</span>
                        <span className="flex center w40 f12">门店名称</span>
                        <span className="flex center w15 f12">总人数</span>
                        <span className="flex center w15 f12">孕妈</span>
                        <span className="flex center w15 f12">萌宝</span>
                    </div>
                    {this.state.newMember.storeList.sort(this.sortNumber('total')).map((e, i) => {
                        // console.log(e);
                        return (
                            <div className="flex row evenly list-item">
                                <span className="flex center w15 f12">{i < 3 ? this.judgeIcon(i) : i + 1}</span>
                                <span className="flex center w40 f12">{e.name}</span>
                                <span className="flex center w15 f12">{e.baby + e.mom}</span>
                                <span className="flex center w15 f12">{e.mom}</span>
                                <span className="flex center w15 f12">{e.baby}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
NewMember.contextTypes = {
    router: PropTypes.object.isRequired,
};

NewMember.propTypes = {
    dispatch: PropTypes.func.isRequired,
    newMember: PropTypes.Object,
};

function mapStateToProps(state) {
    return {
        newMember: state.newMember,
    };
}

export default connect(mapStateToProps)(NewMember);