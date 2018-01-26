import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {
  Container,
  View,
  Tabs,
} from 'amazeui-touch';

// actions.
import {
  getCurrentDayActivity,
  getYestodayActivity,
} from '../../actions/users/currentActivity';


import {
  getCurrentMongthPerformance,
  fetchPerformanceTest,
  getmonthMemberReward,
  fetchALLCoupons,
} from '../../actions/users/performance';

import {
  fetchTaskByType,
  DEFAULT_QUERY_PARAMS,
} from '../../actions/users/allTask';

// BL Components.
import Activity from '../../components/hm-performance-activity/Activity.jsx';

// utils.
import { loadIdToken, getToken, RESTFUL_SERVER } from '../../utils/apiUtils';
import { outerHeight, getViewportHeight } from '../../utils/domUtils';
import DefaultHeader from '../../components/hm-default-header/DefaultHeader.jsx';

import './performance.scss';

class Performance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      isShowModal: false,
    };
    this.handleToOtherPage = this.handleToOtherPage.bind(this);
    this.toTrain = this.toTrain.bind(this);
  }

  componentDidMount() {
    const { dispatch, user } = this.props;
    const { params } = this.props;
    const viewportHeight = getViewportHeight();
    const header = outerHeight(document.querySelector('.hm-default-header'));
    const footer = outerHeight(document.querySelector('.tabbar'));
    const mainHeight = `${viewportHeight - header - footer}px`;
    document.querySelector('.hm-performance').style.height = mainHeight;
    dispatch(getCurrentDayActivity());
    dispatch(getYestodayActivity());
    if (!user.allCoupons) {
      dispatch(fetchALLCoupons());
    }
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'task') {
        navList[i].addEventListener('click', this.handleToOtherPage);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.error) {
      this.setState({
        isErrorHappend: true,
      });
    }
  }

  componentWillUnmount() {
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'task') {
        navList[i].removeEventListener('click', this.handleToOtherPage);
      }
    }
    if (document.querySelector('.scroll')) {
      document.querySelector('.activeWrapper').classList.remove('scroll');
    }
  }

  handleToOtherPage(e) {
    this.setState({
      isShowModal: true,
    });
  }

  toTrain(e) {
    e.preventDefault();
    const token = getToken();
    window.location.href = `${RESTFUL_SERVER}/crm/exam/exam_crm_link.htm?token=${token}`;
  }

  render() {
    const { auth, user } = this.props;
    const { params, children, location } = this.props;
    const userToken = getToken();
    const bindWXUrl =
    `${RESTFUL_SERVER}/crm/gotoPage.htm?gotoPage=/store/user/bind_authorize.htm&token=${userToken}`;
    const userName = loadIdToken().name;
    const storeOutletName = loadIdToken().storeOutletName;
    let completePercent = user.myActivity.yestoday.completePerformanceAsRadio;
    if (completePercent) {
      completePercent = completePercent.replace('%', '');
    } else if (completePercent === '') {
      completePercent = 0;
    } else {
      completePercent = <i className="iconfont icon-jiazai hm-pulse hm-loading" />;
    }
    return (
      <div>
        <DefaultHeader title="我的" type="normal" />
        <div className="hm-performance">
          <div className="hm-performance-header">
            <span>{userName}</span>{storeOutletName}
            <a href={bindWXUrl} className="bind">绑定</a>
          </div>
          <div className="hm-performance-nav">
            <a href="#/performance/performanceCoupon" className="coupon">
              <div>
                <b>
                  {user.allCoupons ?
                    user.allCoupons.length :
                    <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                  }</b>类
                </div>
              <span>优惠券</span>
            </a>
            <a href="#/sales" className="complete-rank">
              <div>
                第<b>
                  {user.myActivity.yestoday.ranking ?
                    user.myActivity.yestoday.ranking :
                    <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                  }</b>名
                </div>
              <span>完成率排行</span>
            </a>
            <div href="#/" className="complete-percent">
              <div>
                <b>
                  {completePercent}
                </b>%
                </div>
              <span>完成率</span>
            </div>
          </div>
          <div className="history-sale">
            <div className="icon-wrapper">
              <i className="iconfont icon-yuezhan" />
              <span>销售金额</span>
              <i className="line" />
            </div>
            <div className="sale-wrapper">
              <div className="today-sale">
                <div>
                  {
                    user.myActivity.today.amount ?
                      parseInt(user.myActivity.today.amount, 10).toLocaleString() :
                      <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                  }
                </div>
                <span>今日</span>
              </div>
              <div className="yesterday-sale">
                <div>
                  {
                    user.myActivity.yestoday.dataMap.amount ?
                      parseInt(user.myActivity.yestoday.dataMap.amount, 10).toLocaleString() :
                      <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                  }
                </div>
                <span>昨日</span>
              </div>
              <div className="month-sale">
                <div>
                  {
                    user.myActivity.yestoday.monthMap.amount ?
                      parseInt(
                        user.myActivity.yestoday.monthMap.amount, 10).toLocaleString() :
                      <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                  }
                </div>
                <span>本月</span>
              </div>
            </div>
          </div>
          <div className="other-sale-container">
            <div className="close-deal border">
              <div className="icon-wrapper">
                <i className="iconfont icon-chengjiaonan" />
                <span>成交客户</span>
                <i className="line" />
              </div>
              <div className="sale-wrapper">
                <a className="yesterday-sale">
                  <div>
                    {
                      user.myActivity.today.count ||
                      <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                    }
                  </div>
                  <span>今日</span>
                </a>
                <a className="yesterday-sale">
                  <div>
                    {
                      user.myActivity.yestoday.dataMap.countMember || 0
                    }
                  </div>
                  <span>昨日</span>
                </a>
                <a className="month-sale">
                  <div>
                    {

                      user.myActivity.yestoday.monthMap.countMember || 0
                    }
                  </div>
                  <span>本月</span>
                </a>
              </div>
            </div>
            <div className="new-customer border">
              <div className="icon-wrapper">
                <i className="iconfont icon-xinzengkehu" />
                <span>新增客户</span>
                <i className="line" />
              </div>
              <div className="sale-wrapper">
                <a className="today-sale" href="#/customer/list/task/todayAdd">
                  <div>
                    {
                      user.myActivity.today.countMember ||
                      <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                    }
                  </div>
                  <span>今日</span>
                </a>
                <a className="yesterday-sale" href="#/customer/list/task/yesterdayAdd">
                  <div>
                    {user.myActivity.yestoday.dataMap.countNewMember ||
                      <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                    }
                  </div>
                  <span>昨日</span>
                </a>
                <a className="month-sale" href="#/customer/list/task/monthAdd">
                  <div>
                    {
                      user.myActivity.yestoday.monthMap.countNewMember ||
                      <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                    }</div>
                  <span>本月</span>
                </a>
              </div>
            </div>
            <div className="contacted-customer">
              <div className="icon-wrapper">
                <i className="iconfont icon-lianxi" />
                <span>联系客户</span>
                <i className="line" />
              </div>
              <div className="sale-wrapper">
                <a className="today-sale" href="#/customer/list/task/todayContact">
                  <div>
                    {
                      user.myActivity.today.contactNum ||
                      <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                    }
                  </div>
                  <span>今日</span>
                </a>
                <a className="yesterday-sale" href="#/customer/list/task/yesterdayContact">
                  <div>{
                    user.myActivity.today.yesterdayContact ||
                    <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                  }</div>
                  <span>昨日</span>
                </a>
                <a className="month-sale" href="#/customer/list/task/monthContact">
                  <div>
                    {
                      user.myActivity.today.MonthContact ||
                      <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                    }
                  </div>
                  <span>本月</span>
                </a>
              </div>
            </div>
          </div>
          <div>
            <a
              id="hm_activity_to_performanceTest"
              className="btn border"
              href="#/performance/performanceTest"
            >
              <div>
                <i className="iconfont icon-baojiadan" />
                绩效考核
            </div>
              <i className="icon icon-right-nav" />
            </a>
          </div>
          <div>
            <a
              id="hm_activity_to_suggest"
              className="btn border suggest"
              href="#/performance/performanceSuggest"
            >
              <div>
                <i className="iconfont icon-beizhu" />
                意见反馈
                </div>
              <i className="icon icon-right-nav" />
            </a>
          </div>
          <div>
            <a
              id="hm_activity_to_train"
              onClick={this.toTrain}
              className="btn tranin"
              href="#/"
            >
              <div>
                <i className="iconfont icon-kaoshi" />
                考试系统
            </div>
              <i className="icon icon-right-nav" />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

Performance.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  allCoupons: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  const { user, auth } = state;
  if (!user) {
    // todo: 需要在此处应用应用程序缓存, 在后台数据无法获取的时候, 我们使用保存在应用缓存的数据.
    return {
      auth: { user: { name: '' } },
      user: {
        myActivity: {
          today: {
            amount: '0',
            count: '0',
          },
          yestoday: {
            dataMap: {
              countTotal: '0',
              countWhith: '0',
              countNewMember: '0',
              countMember: '0',
              memberAmount: '0',
              amount: '0',
              count: '0',
            },
            monthMap: {
              countTotal: '0',
              countWhith: '0',
              countNewMember: '0',
              countMember: '0',
              memberAmount: '0',
              amount: '0',
              count: '0',
            },
          },
        },
        myPerformace: {
          targetAmount: '0',
          saleTarget: '0',
          memberTarget: '0',
          saleAmount: '0',
          memberCount: '0',
          memberPrice: '0',
          memberConsume: '0',
        },
        performanceTest: {
          assess: [],
          pager: {
            currentPage: 1,
            pageSize: 15,
            totalItem: 3,
            totalPage: 1,
          },
        },
        monthMemberReword: {
          reward: [],
          pager: {
            currentMonthMemberReword: '',
            currentPage: 1,
            pageSize: 15,
            totalItem: 3,
            totalPage: 1,
          },
        },
        allCoupons: [{
          bonusName: '',
          count: '',
          id: '',
          min: '',
          money: '',
          name: '',
        }],
        error: null,
      },
    };
  }
  return {
    user,
    auth,
  };
}

export default connect(mapStateToProps)(Performance);
