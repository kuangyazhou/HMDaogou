import React, { Component, PropTypes } from 'react';
import {
  Grid,
  Group,
  Col,
  Button,
} from 'amazeui-touch';
// API Utils.
import { RESTFUL_SERVER, getToken } from '../../utils/apiUtils';
import { getViewportHeight, outerHeight } from '../../utils/domUtils';

import './activity.scss';

export default class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
    };
    this.toTrain = this.toTrain.bind(this);
  }

  componentDidMount() {
    // const originalViewportHeight = getViewportHeight();
    // const headerHeight = outerHeight(document.querySelector('.tabs-nav'));
    // const navHeight = outerHeight(document.querySelector('.tabbar'));
    // const mainHeight = originalViewportHeight - headerHeight - navHeight;
    // if (mainHeight < 568) {
    //   document.querySelector('.activeWrapper').style.height = `${mainHeight}px`;
    //   document.querySelector('.activeWrapper').style.overflow = 'scroll';
    // }
  }


  handleClick(e) {
    e.preventDefault();
    return false;
  }

  toTrain(e) {
    e.preventDefault();
    const token = getToken();
    window.location.href = `${RESTFUL_SERVER}/crm/exam/exam_crm_link.htm?token=${token}`;
  }

  render() {
    const { user } = this.props;
    return (
      <div className="hm-efficiency-wrapper">
        <div className="hm-efficiency-menu">
          <div className="menu-header">
            <i className="iconfont icon-jin_fill" />今日动态
          </div>
          <div className="menu-body">
            <div className="menu-item">
              <div>
                <i className="iconfont icon-yuezhan" />
                <span className="text small">销售金额</span>
              </div>
              {
                user.myActivity.today.amount ?
                  Number(user.myActivity.today.amount).toLocaleString().toLocaleString() :
                  <i className="iconfont icon-jiazai hm-pulse hm-loading" />
              }
            </div>
            <div className="menu-item">
              <div>
                <i className="iconfont icon-dingdanzongshu-" />
                <span className="text small">订单数</span>
              </div>
              {
                user.myActivity.today.count ?
                  Number(user.myActivity.today.count).toLocaleString() :
                  <i className="iconfont icon-jiazai hm-pulse hm-loading" />
              }
            </div>
            <div className="menu-item">
              <div>
                <i className="iconfont icon-xinzengkehu" />
                <span className="text small">新增客户</span>
              </div>
              {
                user.myActivity.today.countMember ?
                  Number(user.myActivity.today.countMember).toLocaleString() :
                  <i className="iconfont icon-jiazai hm-pulse hm-loading" />
              }
            </div>
            <div className="menu-item">
              <div>
                <i className="iconfont icon-lianxi" />
                <span className="text small">联系客户</span>
              </div>
              {
                user.myActivity.today.contactNum ?
                  Number(user.myActivity.today.contactNum).toLocaleString() :
                  <i className="iconfont icon-jiazai hm-pulse hm-loading" />
              }
            </div>
          </div>
        </div>
        <div className="hm-efficiency-menu-yesterday">
          <div className="menu-header">
            <i className="iconfont icon-zuori" />昨日动态
          </div>
          <div className="menu-body">
            <a className="menu-item" href="#/" onClick={this.handleClick}>
              <div>
                <i className="iconfont icon-yuezhan" />
                <span className="text small">销售金额</span>
              </div>
              {Number(user.myActivity.yestoday.amount).toLocaleString()}
            </a>
            <a className="menu-item" href="#/" onClick={this.handleClick}>
              <div>
                <span className="iconfont icon-dingdanzongshu-" />
                <span className="text small">订单数</span>
              </div>
              {Number(user.myActivity.yestoday.count).toLocaleString()}
            </a>
            <a
              className="menu-item"
              id="hm_activity_dealed_customer"
              href="#/customer/list/task/yesterdayDeal"
            >
              <div>
                <span className="iconfont icon-chengjiaonan" />
                <span className="text small">成交客户</span>
              </div>
              <div>
                {Number(user.myActivity.yestoday.countMember).toLocaleString()}
                <i className="icon icon-right-nav" />
              </div>
            </a>
            <a
              className="menu-item"
              id="hm_activity_dealed_customer"
              href="#/customer/list/task/yesterdayAdd"
            >
              <div>
                <span className="iconfont icon-xinzengkehu" />
                <span className="text small">新增客户</span>
              </div>
              <div>
                {Number(user.myActivity.yestoday.countNewMember).toLocaleString()}
                <i className="icon icon-right-nav" />
              </div>
            </a>
            <a href="#/" className="menu-item" onClick={this.handleClick}>
              <div>
                <span className="iconfont icon-baojiadan" />
                <span className="text small">单客价</span>
              </div>
              {Number(user.myActivity.yestoday.memberAmount).toLocaleString()}
            </a>
          </div>
        </div>
        <div>
          <a
            id="hm_activity_to_train"
            onClick={this.toTrain}
            className="btn"
            href="#/"
          >
            <div>
              <i className="iconfont icon-kaoshi" />
              去考试
          </div>
            <i className="icon icon-right-nav" />
          </a>
        </div>
      </div >
    );
  }
}

Activity.propTypes = {
  user: PropTypes.object.isRequired,
};

