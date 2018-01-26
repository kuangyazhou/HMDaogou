/* eslint max-len: [0] */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../utils/domUtils';

// API Utils.
import { loadUserProfile } from '../../utils/apiUtils';

// components
import HMCard from '../hm-card/Card.jsx';

import './staffSales.scss';

class StaffSales extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  render() {
    const { todayAmount, todayTargetAmount, todayPercent, todayCountMember,
      todayCountOrder, todayMemberAmount, yesterdayCountMember,
      yesterdayCountOrder, yesterdayMemberAmount, today, isTodayTargetGet,
      isSaleDetailGet, isTodaySingleBrandGet, todayTotalAmount, yesterdayTotalAmount,
    } = this.props;
    const todaySingleCustomerPrice = todayMemberAmount && todayMemberAmount.toFixed(2);
    const yesterdaySingleCustomerPrice = yesterdayMemberAmount && yesterdayMemberAmount.toFixed(2);
    const todayComplete = todayAmount;
    const todayTotalComplete = todayTargetAmount;
    const todayTotalTargetPercent = todayPercent ? `${Math.round(Number(todayPercent * 100)).toLocaleString()}%` : '0%';
    let contentJSX;
    let iconContent;
    if (isTodaySingleBrandGet) {
      if (today && today.length > 0 && today[0].amount !== '') {
        contentJSX = (
          today.map((item, idx) => {
            const key = `idx-${idx}`;
            const amount = item.amount ? Math.round(Number(item.amount)).toLocaleString() : 0;
            const count = item.count ? item.count : 0;
            const name = item.name ? item.name : item.value;
            switch (idx) {
              case 0:
                iconContent = <i className="iconfont icon-diyiming" />;
                break;
              case 1:
                iconContent = <i className="iconfont icon-dierming" />;
                break;
              case 2:
                iconContent = <i className="iconfont icon-disanming" />;
                break;
              default:
                break;
            }
            if (idx < 3) {
              return (
                <li key={key}>
                  <div className="icon-wrapper rank">
                    {iconContent}
                  </div>
                  <div className="name">
                    {name}
                  </div>
                  <div className="amount">
                    {amount}
                  </div>
                  <div className="count">
                    {count}
                  </div>
                </li>
              );
            }
            return '';
          })
        );
      } else {
        contentJSX = <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>;
      }
    } else {
      contentJSX = <div className="hm-loading-wrapper"><i className="iconfont icon-jiazai hm-pulse hm-loading" /></div>;
    }
    return (
      <div className="staff-sale-main">
        <HMCard
          cardLinkId="hm_staff_sales_today_target_link"
          title="今日店铺总目标"
          iconName="icon-target"
          handleMore="#/targetTotal"
          isManager
        >
          {
            isTodayTargetGet ?
              <div className="hm-progress-rank marginBottomNone">
                <div className="progress manager">
                  <span style={{ width: `${todayTotalTargetPercent}` }}>
                    <b>{todayTotalTargetPercent}</b>
                  </span>
                </div>
                <div className="bottom-detail marginBottomNone">
                  <strong>今日进度</strong>
                  <span>
                    <b>{todayComplete ? `${Number(todayComplete).toLocaleString()}` : 0}</b>/
                {todayTotalComplete ? `${Number(todayTotalComplete).toLocaleString()}` : 0}
                  </span>
                </div>
              </div> : <div className="hm-loading-wrapper"><i className="iconfont icon-jiazai hm-pulse hm-loading" /></div>
          }
        </HMCard>
        <HMCard
          cardLinkId="hm_staff_sales_today_target_link"
          title="今日会员销售详情"
          iconName="icon-xiaoshoumingxi"
          isMoreHide
          isManager
        >
          <div>
            {
              isSaleDetailGet ?
                <ul className="detail-list">
                  <li>
                    <div className="sale-title">
                      总销售额
                    </div>
                    <div className="sale-money">
                      <p>今日<span>{Number(todayTotalAmount).toLocaleString()}</span></p>
                      <p>昨日<span>{Number(yesterdayTotalAmount).toLocaleString()}</span></p>
                    </div>
                  </li>
                  <li>
                    <div className="sale-title">
                      订单数量
                    </div>
                    <div className="sale-money">
                      <p>今日<span>{todayCountOrder ? `${todayCountOrder}` : 0}</span></p>
                      <p>昨日<span>{yesterdayCountOrder ? `${yesterdayCountOrder}` : 0}</span> </p>
                    </div>
                  </li>
                  <li>
                    <div className="sale-title">
                      交易人数
                    </div>
                    <div className="sale-money">
                      <p>今日<span>{todayCountMember ? `${todayCountMember}` : 0}</span></p>
                      <p>昨日<span>{yesterdayCountMember ? `${yesterdayCountMember}` : 0}</span></p>
                    </div>
                  </li>
                  <li>
                    <div className="sale-title">
                      单客价
                    </div>
                    <div className="sale-money">
                      <p>今日<span>{todaySingleCustomerPrice ? `${Number(todaySingleCustomerPrice).toLocaleString()}` : 0}</span></p>
                      <p>昨日<span>{yesterdaySingleCustomerPrice ? `${Number(yesterdaySingleCustomerPrice).toLocaleString()}` : 0}</span></p>
                    </div>
                  </li>
                </ul> :
                <div className="hm-loading-wrapper">
                  <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                </div>
            }
          </div>
        </HMCard>
        <HMCard
          cardLinkId="hm_staff_sales_single_product_link"
          title="今日单品销售排行"
          iconName="icon-paixing"
          handleMore="#/singleBrandSale"
          isManager
        >
          <div className="hm-progress-rank-title">
            <span className="rank">排名</span>
            <span className="name">名称</span>
            <span className="amount">金额</span>
            <span className="count">数量</span>
          </div>
          <ul className="hm-rank-list">
            {contentJSX}
          </ul>
        </HMCard>
      </div>
    );
  }
}

StaffSales.propTypes = {
  dispatch: PropTypes.func.isRequired,
  todayAmount: PropTypes.string.isRequired,
  todayTargetAmount: PropTypes.string.isRequired,
  todayPercent: PropTypes.string.isRequired,
  todayCountMember: PropTypes.string.isRequired,
  todayCountOrder: PropTypes.string.isRequired,
  todayMemberAmount: PropTypes.string.isRequired,
  yesterdayCountMember: PropTypes.string.isRequired,
  yesterdayCountOrder: PropTypes.string.isRequired,
  yesterdayMemberAmount: PropTypes.string.isRequired,
  today: PropTypes.array.isRequired,
  yesterday: PropTypes.array.isRequired,
  isTodayTargetGet: PropTypes.bool.isRequired,
  isSaleDetailGet: PropTypes.bool.isRequired,
  isTodaySingleBrandGet: PropTypes.bool.isRequired,
  todayTotalAmount: PropTypes.string.isRequired,
  yesterdayTotalAmount: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  return {
    todayCountOrder: stores.stores.todayCountOrder,
    todayMemberAmount: stores.stores.todayMemberAmount,
    todayTotalAmount: stores.stores.todayTotalAmount,
    yesterdayTotalAmount: stores.stores.yesterdayTotalAmount,
    yesterdayCountMember: stores.stores.yesterdayCountMember,
    yesterdayCountOrder: stores.stores.yesterdayCountOrder,
    yesterdayMemberAmount: stores.stores.yesterdayMemberAmount,
    isSaleDetailGet: stores.stores.isSaleDetailGet,
    isTodaySingleBrandGet: stores.stores.isTodaySingleBrandGet,
    todayAmount: stores.stores.todayAmount,
    todayTargetAmount: stores.stores.todayTargetAmount,
    isTodayTargetGet: stores.stores.isTodayTargetGet,
    todayPercent: stores.stores.todayPercent,
    today: stores.stores.today,
    todayCountMember: stores.stores.todayCountMember,
  };
}

export default connect(mapStateToProps)(StaffSales);
