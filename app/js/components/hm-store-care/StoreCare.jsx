/* eslint max-len: [0] */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { If, Then, Else } from 'react-if';


// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../utils/domUtils';


// API Utils.
import { loadUserProfile } from '../../utils/apiUtils';

// components
import HMCard from '../hm-card/Card.jsx';

import './storeCare.scss';

class StoreCare extends React.Component {
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
    const { staffCompleteList, dealList, isStaffCompleteListGet, isDealListGet,
      totalPercent, totalCount, totalCompleteCount, monthSaleChangce, ismonthSaleChangceStoreGet,
      staffMonthContactTotal, isStaffMonthContactGet,
    } = this.props;
    /* eslint no-mixed-operators: [0] */
    let contentJSX;
    let iconContent;
    if (isDealListGet) {
      if (dealList && dealList.length > 0) {
        contentJSX = dealList.map((item, idx) => {
          const key = `idx-${idx}`;
          const percent = Math.round(item.consult * 100);
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
              <div className="hm-new-progress" key={key}>
                <div className="icon-wrapper rank">
                  {iconContent}
                </div>
                <div className="staff-name">
                  {item.name ? `${item.name}` : '未知姓名'}
                </div>
                <div className="progress manager">
                  <span style={{ width: `${percent}%` }}>
                    <b>{`${percent}%`}</b>
                  </span>
                </div>
                <div className="staff-amount">
                  <span>{item.consumeCount ? `${item.consumeCount}` : 0}</span>/ {item.contactCount ? `${item.contactCount}` : 0}
                </div>
              </div>
            );
          }
          return '';
        });
      } else {
        contentJSX = <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>;
      }
    } else {
      contentJSX = <div className="hm-loading-wrapper"><i className="iconfont icon-jiazai hm-pulse hm-loading" /></div>;
    }
    let monthSaleChangceJSX;
    if (ismonthSaleChangceStoreGet) {
      if (monthSaleChangce.length > 0) {
        monthSaleChangceJSX = monthSaleChangce.map((item, idx) => {
          const key = `idx-${idx}`;
          return (
            <a href={`#/monthTaskComplete/${item.type}`} key={key}>
              <div>
                <span><b>{item.doneValue}</b>/{item.contentValue}</span>
                <p>{item.ruleName}</p>
              </div>
              <span className="icon icon-right-nav" />
            </a>
          );
        });
      } else {
        monthSaleChangceJSX = <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>;
      }
    } else {
      monthSaleChangceJSX = <div className="hm-loading-wrapper"><i className="iconfont icon-jiazai hm-pulse hm-loading" /></div>;
    }
    return (
      <div className="hm-store-care-main">
        <HMCard
          title="月员工客户追踪统计"
          iconName="icon-paixing"
          handleMore="#/contacted"
          cardLinkId="hm_contact_percent_rank_link"
          isManager
        >
          <div className="contact-statistics">
            <div className="by-phone">
              <div>{isStaffMonthContactGet && staffMonthContactTotal.callCount}</div>
              <span>电话回访</span>
            </div>
            <div className="by-message">
              <div>{isStaffMonthContactGet && staffMonthContactTotal.smsCount}</div>
              <span>短信回访</span>
            </div>
            <div className="by-wechat">
              <div>{isStaffMonthContactGet && staffMonthContactTotal.wechatCount}</div>
              <span>微信回访</span>
            </div>
          </div>
        </HMCard>
        <HMCard
          cardLinkId="hm_store_care_task_complete_link"
          title="月门店销售机会跟进统计"
          iconName="icon-wanchengjindu"
          isMoreHide
          isManager
        >
          <div className="sale-changce-wrapper">
            {monthSaleChangceJSX}
          </div>
        </HMCard>
        <HMCard
          cardLinkId="hm_store_care_customer_care_rank_link"
          title="月门店客户维护交易率排行"
          iconName="icon-paixing"
          handleMore="#/customerCareRank"
          isManager
        >
          <div className="hm-progress-rank-title">
            <span className="rank">排名</span>
            <span className="name">姓名</span>
            <span className="point">进度</span>
            <span className="count">交易数/维护数</span>
          </div>
          <div className="hm-new-progress-wrapper">
            {contentJSX}
          </div>
        </HMCard>
      </div>
    );
  }
}

StoreCare.propTypes = {
  dispatch: PropTypes.func.isRequired,
  staffCompleteList: PropTypes.string.isRequired,
  dealList: PropTypes.array,
  isDealListGet: PropTypes.bool,
  isStaffCompleteListGet: PropTypes.bool,
  totalCount: PropTypes.string.isRequired,
  totalPercent: PropTypes.string.isRequired,
  totalCompleteCount: PropTypes.string.isRequired,
  monthSaleChangce: PropTypes.array.isRequired,
  ismonthSaleChangceStoreGet: PropTypes.bool,
  staffMonthContactTotal: PropTypes.object.isRequired,
  isStaffMonthContactGet: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { stores, client } = state;
  return {
    staffCompleteList: stores.stores.staffCompleteList,
    dealList: client.dealList,
    isDealListGet: client.isDealListGet,
    isStaffCompleteListGet: stores.tasks.isStaffCompleteListGet,
    totalCount: stores.tasks.totalCount,
    totalCompleteCount: stores.tasks.totalCompleteCount,
    totalPercent: stores.tasks.totalPercent,
    monthSaleChangce: stores.monthSaleChangce,
    ismonthSaleChangceStoreGet: stores.ismonthSaleChangceStoreGet,
    staffMonthContactTotal: stores.staffMonthContactTotal,
    isStaffMonthContactGet: stores.isStaffMonthContactGet,
  };
}

export default connect(mapStateToProps)(StoreCare);
