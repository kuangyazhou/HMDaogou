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
  fetchALLCoupons, performUserList,
} from '../../../actions/users/performance';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../../utils/domUtils';

import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import './performanceCoupon.scss';


/* eslint no-script-url: [0] */

class PerformanceCoupon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.viewDetail = this.viewDetail.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchALLCoupons());
  }

  viewDetail(item, e) {
    if (item.used === 0 && item.num === 0) return;
    let effect = null;
    let arg = {};
    const { dispatch } = this.props;
    if (item.use_end_date < (new Date().valueOf())) {
      effect = '0';
    } else {
      effect = '1';
    }
    switch (e) {
      case 'send':
        arg = {
          bonusType: item.bonus_type_id || null,
          isEffectBonus: effect || null,
          isUsed: 0,
        };
        break;
      case 'use':
        arg = {
          bonusType: item.bonus_type_id || null,
          isEffectBonus: effect || null,
          isUsed: 0,
        };
        break;
      default: arg = {
        bonusType: null,
        isEffectBonus: null,
        isUsed: null,
      };
    }
    // console.log(e);
    dispatch(performUserList(arg));
  }
  render() {
    const { user } = this.props;
    const { allCoupons, isAllCouponGet } = user;
    const valid = [];
    let contentJSX = null;
    let dueJSX = null;
    const dueDate = [];
    if (isAllCouponGet) {
      if (allCoupons && allCoupons.length > 0) {
        allCoupons.forEach((item, i) => {
          if (item.use_end_date > (new Date().valueOf())) {
            valid.push(item);
          } else {
            dueDate.push(item);
          }
        });
        contentJSX = valid.map((item, i) => {
          const key = `key-${i}`;
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
                  <span className="end_date">
                    有效期至：{moment(item.use_end_date).format('YYYY-MM-DD')}
                  </span>
                </div>
                <div className="coupon-link">
                  <div className="send-time" >
                    <a href="javascript:void(0)" onClick={() => this.viewDetail(item, 'send')}>
                      <span className="state">已发放：{item.num}</span>
                      <span className="icon icon-right-nav" />
                    </a>
                  </div>
                  <div className="invalide-time">
                    <a href="javascript:void(0)" onClick={() => this.viewDetail(item, 'use')}>
                      <span className="state">已使用：{item.used || 0}</span>
                      <span className="icon icon-right-nav" />
                    </a>
                  </div>
                </div>
              </div>
              {
                item.remarks && item.remarks !== '' &&
                <div className="remarks">
                  备注：{item.remarks}
                </div>
              }
            </li>
          );
        });
        dueJSX = dueDate.map((item, i) => {
          const key = `key-${i}`;
          return (
            <li key={key} className="time_up">
              <div className="coupon-main">
                <div className="coupon-price-due">
                  <p><span>￥</span><b>{item.money}</b></p>
                  <span>满{item.min}元使用</span>
                </div>
                <div className="coupon-name">
                  <p>{item.bonusName}</p>
                  <p className="state">总券数：{item.count}</p>
                  <span className="end_date">
                    有效期至：{moment(item.use_end_date).format('YYYY-MM-DD')}
                  </span>
                </div>
                <div className="coupon-link">
                  <div className="send-time">
                    <a href="javascript:void(0)" onClick={() => this.viewDetail(item, 'send')}>
                      <span className="state">已发放：{item.num}</span>
                      <span className="icon icon-right-nav" />
                    </a>
                  </div>
                  <div className="invalide-time" >
                    <a href="javascript:void(0)" onClick={() => this.viewDetail(item, 'use')}>
                      <span className="state">已使用：{item.used || 0}</span>
                      <span className="icon icon-right-nav" />
                    </a>
                  </div>
                </div>
              </div>
              {
                item.remarks && item.remarks !== '' &&
                <div className="remarks">
                  备注：{item.remarks}
                </div>
              }
            </li>
          );
        });
        // contentJSX = allCoupons.map((item, idx) => {
        //   const key = `key-${idx}`;
        //   return (
        //     <li key={key}>
        //       <div className="coupon-main">
        //         <div className="coupon-price">
        //           <p><span>￥</span><b>{item.money}</b></p>
        //           <span>满{item.min}元使用</span>
        //         </div>
        //         <div className="coupon-name">
        //           <p>{item.bonusName}</p>
        //           <p className="state">总券数：{item.count}</p>
        //           <span className="end_date">
        //             有效期至：{moment(item.use_end_date).format('YYYY-MM-DD')}
        //           </span>
        //         </div>
        //         <div className="coupon-link">
        //           <div className="send-time">
        //             <a href="#/">
        //               <span className="state">已发放：{item.num}</span>
        //               <span className="icon icon-right-nav" />
        //             </a>
        //           </div>
        //           <div className="invalide-time">
        //             <a href="#/">
        //               <span className="state">已使用：{item.used || 0}</span>
        //               <span className="icon icon-right-nav" />
        //             </a>
        //           </div>
        //         </div>
        //       </div>
        //       {
        //         item.remarks && item.remarks !== '' &&
        //         <div className="remarks">
        //           备注：{item.remarks}
        //         </div>
        //       }
        //     </li>
        //   );
        // });
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
        <Tabs
          className="hm-manager-home-nav"
        >
          <Tabs.Item
            title="有效券"
            navStyle="alert"
          >
            <ul className="hm-performance-coupon-container">
              {contentJSX}
            </ul>
          </Tabs.Item>
          <Tabs.Item
            title="过期券"
            navStyle="alert"
          >
            <ul className="hm-performance-coupon-container">
              {dueJSX}
            </ul>
          </Tabs.Item>
        </Tabs>
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
