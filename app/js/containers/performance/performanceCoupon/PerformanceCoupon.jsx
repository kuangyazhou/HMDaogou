import React, { Component, PropTypes } from 'react';
import { If } from 'react-if';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import moment from 'moment';
import {
  Tabs,
  List,
  Button,
  Loader,
  Icon,
  Badge,
} from 'amazeui-touch';

import {
  fetchALLCoupons,
} from '../../../actions/users/performance';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../../utils/domUtils';

import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import './performanceCoupon.scss';

class PerformanceCoupon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchALLCoupons());
  }

  handleOpen(e) {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const { user } = this.props;
    const { allCoupons, isAllCouponGet } = user;
    let contentJSX;
    if (isAllCouponGet) {
      if (allCoupons && allCoupons.length > 0) {
        contentJSX = allCoupons.map((item, idx) => {
          const key = `key-${idx}`;
          return (
            <li key={key}>
              <div className="coupon-main">
                <div className="coupon-price">
                  <p><span>￥</span><b>{item.money}</b></p>
                  <span>满{item.min}元使用</span>
                </div>
                <div className="coupon-name">
                  <p>{item.bonusName}</p>
                  <p className="state">总券数：{item.count}</p>
                  <div className="send-time">
                    <span className="state">已发放：{item.num}</span>
                  </div>
                  <div className="invalide-time">
                    <span className="state">已使用：{item.used || 0}</span>
                    <span>有效期至：{moment(item.use_end_date).format('YYYY-MM-DD')}</span>
                  </div>
                </div>
              </div>
              {
                item.remarks && item.remarks !== '' &&
                <div
                  className={this.state.isOpen ? 'coupon-describe' : 'coupon-describe open'}
                  onClick={this.handleOpen}
                >
                  备注：{item.remarks}
                  <span className="icon icon-down-nav" />
                </div>
              }
            </li>
          );
        });
      } else {
        contentJSX = (
          <li className="hm-null">
            <i className="iconfont icon-meiyouxiaoxi" />还没有优惠券
        </li>
        );
      }
    } else {
      contentJSX = (
        <li className="hm-loading-wrapper">
          <i className="iconfont icon-jiazai hm-pulse hm-loading" />
        </li>
      );
    }
    return (
      <div className="hm-performance-coupon-container">
        <DefaultHeader title="优惠券包" history={this.props.history} />
        <ul className="hm-performance-coupon-container">
          {contentJSX}
        </ul>
      </div>
    );
  }
}

PerformanceCoupon.propTypes = {
  user: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  allCoupons: PropTypes.array.isRequired,
  getParentHeight: React.PropTypes.func,
  loadMoreTaskByType: React.PropTypes.func,
  history: PropTypes.object.isRequired,
  isAllCouponGet: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    user,
  };
}

export default connect(mapStateToProps)(PerformanceCoupon);
