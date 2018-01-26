/* eslint max-len: [0] */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../utils/domUtils';

// components
import HMCard from '../hm-card/Card.jsx';
import './staffInfo.scss';

class StaffInfo extends React.Component {
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
    const { count, loginCount, saleChangce, progressRank, isProgressRankFetching, isLoginCountGet,
      isSaleChangceGet, newCustomerCount } = this.props;
    let contentJsx;
    let iconContent;
    if (isProgressRankFetching) {
      if (progressRank && progressRank.length > 0) {
        contentJsx = progressRank.map((item, idx) => {
          const key = `idx-${idx}`;
          const percent = item.completePerformanceAsRadio &&
            Math.round(item.completePerformanceAsRadio.slice(0, item.completePerformanceAsRadio.indexOf('%')));
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
                  {item.targetUserName ? `${item.targetUserName}` : ''}
                </div>
                <div className="progress manager">
                  <span style={{ width: `${percent || 0}%` }}>
                    <b>{`${percent || 0}%`}</b>
                  </span>
                </div>
                <div className="staff-amount">
                  <span>{item.completePerformanceAsMoney ? `${Number(item.completePerformanceAsMoney).toLocaleString()}` : 0}</span>/{item.points ? `${Number(item.points).toLocaleString()}` : 0}
                </div>
              </div>
            );
          }
          return '';
        });
      } else {
        contentJsx = <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>;
      }
    } else {
      contentJsx = <div className="hm-loading-wrapper"><i className="iconfont icon-jiazai hm-pulse hm-loading" /></div>;
    }
    let saleChangceJSX;
    if (isSaleChangceGet) {
      if (saleChangce.length > 1) {
        saleChangceJSX = saleChangce.map((item, idx) => {
          const key = `idx-${idx}`;
          return (
            <a href={`#/staffSaleChangce/${item.type}`} key={key}>
              <div>
                <span><b>{item.doneValue}</b>/{item.contentValue}</span>
                <p>{item.ruleName}</p>
              </div>
              <span className="icon icon-right-nav" />
            </a>
          );
        });
      } else {
        saleChangceJSX = <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>;
      }
    } else {
      saleChangceJSX = <div className="hm-loading-wrapper"><i className="iconfont icon-jiazai hm-pulse hm-loading" /></div>;
    }
    return (
      <div className="hm-staff-info-main">
        <div className="today-login-wrapper">
          <HMCard
            cardLinkId="hm_staff_info_today_login_more"
            title="今日登录员工人数"
            iconName="icon-kehu"
            handleMore="#/todayLogin"
            specialHeader={`${loginCount || 0}/${count || 0}`}
            isManager
          />
        </div>
        <div className="today-new-customer-wrapper">
          <HMCard
            cardLinkId="hm_staff_info_today_new_customer_more"
            title="今日新客开发人数"
            iconName="icon-xinzengkehu"
            handleMore="#/todayNewCustomer"
            specialHeader={newCustomerCount}
            isManager
          />
        </div>
        <HMCard
          cardLinkId="hm_staff_info_today_task_complete_more"
          title="今日员工销售机会跟进"
          iconName="icon-wanchengrenwu"
          isManager
          isMoreHide
        >
          <div className="sale-changce-wrapper">
            {saleChangceJSX}
          </div>
        </HMCard>
        <HMCard
          cardLinkId="hm_staff_info_today_progress_more"
          title="今日员工销售进度"
          iconName="icon-paixing"
          isManager
          handleMore="#/ProgressRank"
        >
          <div className="hm-progress-rank-title">
            <span className="rank">排名</span>
            <span className="name">姓名</span>
            <span className="point">进度</span>
            <span className="count">已完成/目标</span>
          </div>
          <div className="hm-new-progress-wrapper">
            {contentJsx}
          </div>
        </HMCard>

      </div>
    );
  }
}

StaffInfo.propTypes = {
  dispatch: PropTypes.func.isRequired,
  count: PropTypes.string.isRequired,
  loginCount: PropTypes.string.isRequired,
  progressRank: PropTypes.array.isRequired,
  isProgressRankFetching: PropTypes.bool.isRequired,
  isLoginCountGet: PropTypes.bool.isRequired,
  saleChangce: PropTypes.array.isRequired,
  isSaleChangceGet: PropTypes.bool.isRequired,
  newCustomerCount: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  return {
    count: stores.stores.count,
    loginCount: stores.stores.loginCount,
    isLoginCountGet: stores.stores.isLoginCountGet,
    progressRank: stores.stores.progressRank,
    saleChangce: stores.saleChangce,
    isSaleChangceGet: stores.isSaleChangceGet,
    isProgressRankFetching: stores.stores.isProgressRankFetching,
    newCustomerCount: stores.newCustomerCount,
  };
}

export default connect(mapStateToProps)(StaffInfo);
