/* eslint max-len: [0] */
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
  Container,
  View,
  List,
} from 'amazeui-touch';

// API Utils.
import {
  getToken,
} from '../../../utils/apiUtils';

// actions.
import {
  fetchCoupons,
} from '../../../actions/customers/coupon.js';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../../utils/domUtils';

import './coupon.scss';

class CouponList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCoupons());
  }

  render() {
    const { coupons, isFetching, error } = this.props;
    const { phone, realname, offlineId, isBind } = this.props.params;
    const restUrl = `#/customer/marketing/${isBind}/specifyMarketing/`;
    return (
      <View>
        <Container className="ks-grid scrollable hm-coupon-container">
          <header className="hm-customer-order-coupon-header">
            <div className="top-bar"><p>券包</p></div>
          </header>
          <List className="hm-coupon-list">
            {
              coupons && coupons.length > 0 ?
                coupons.map((coupon, idx) => {
                  const cidx = `coupon-${idx}`;
                  return (
                    <li key={cidx}>
                      <a
                        id={`hm_coupon_click_to_choose_link_${idx}`}
                        href={
                          `${restUrl}${phone}/${offlineId}/${realname}/${coupon.bonus_id}/${coupon.bonus_name}`
                        }
                      >
                        <div className="left">
                          <div className="border">
                            <p>{coupon.bonus_name}</p>
                            <span><b>{`${coupon.num}`}</b>张优惠券</span>
                          </div>
                        </div>
                        <div className="right">
                          <span>立即选取</span>
                          <button>GO</button>
                        </div>
                      </a>
                    </li>
                  );
                }) :
                <p className="hm-null "><i className="iconfont icon-meiyouxiaoxi" />还没有优惠券</p>
            }
          </List>
        </Container>
      </View>
    );
  }
}

CouponList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  coupons: PropTypes.any,
};

function mapStateToProps(state) {
  const { marketing } = state;
  const { coupons, isFetching, error } = marketing;
  return {
    coupons,
    isFetching,
    error,
  };
}

export default connect(mapStateToProps)(CouponList);
