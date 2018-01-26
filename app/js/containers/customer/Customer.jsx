import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Container,
  Grid,
  Col,
  Notification,
  View,
} from 'amazeui-touch';

import ReactEcharts from '../../../../node_modules/echarts-for-react';

// actions.
import { getMyMember } from '../../actions/members/myMembers';
import {
  fetchRecentlyAddedPeoples,
} from '../../actions/users/performance';
import { queryCustomerCaptchaList, resetCaptchaList } from '../../actions/customers/details';

import { fetchCustomerTrace } from '../../actions/customers/trace';

// Card Components.
import HMCard from '../../components/hm-card/Card.jsx';
import DefaultHeader from '../../components/hm-default-header/DefaultHeader.jsx';

// API Utils.
import {
  getToken,
  setCustomersFlag,
  getCustomersFlag,
  removeFilterConditions,
} from '../../utils/apiUtils';

// constants.
// import {
//   CUSTOMER_FILTER,
//   CUSTOMER_FEATURE,
// } from '../../utils/constants';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../utils/domUtils';

import './customer.scss';

class Customer extends React.Component {
  constructor(props) {
    super(props);
    this.firstLoading = '';
    this.state = {
      isErrorHappend: false,
      isShowModal: false,
      isShowBrandSearch: false,
    };
    this.closeNotification = this.closeNotification.bind(this);
    this.handleToOtherPage = this.handleToOtherPage.bind(this);
    this.showBrandSearch = this.showBrandSearch.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  componentDidMount() {
    const { dispatch, user, history, children } = this.props;
    const context = this;
    // 计算列表容器的实际高度(客户详情列表).
    // 稍微延时下执行, 等待React将数据渲染完成.
    setTimeout(() => {
      const viewportHeight = getViewportHeight();
      const header = outerHeight(document.querySelector('.hm-customer-header'));
      const menu = outerHeight(document.querySelector('.hm-customer-menu'));
      const footer = outerHeight(document.querySelector('.tabbar'));
      const customer = document.querySelector('.hm-customer-list');
      if (customer) { customer.style.height = `${viewportHeight - header - menu - footer}px`; }
    }, 0);
    if (!children) {
      // 如果已经加载完成则切换页面不重新加载
      const isLoaded = getCustomersFlag();
      dispatch(fetchCustomerTrace('0'));
      dispatch(getMyMember());
      if (isLoaded === null) {
        dispatch(fetchRecentlyAddedPeoples());
        this.firstLoading = <i className="iconfont icon-jiazai hm-pulse hm-loading" />;
        setCustomersFlag(0);
      }
      // const addLineChart = this.addLineChart.getEchartsInstance();
      // 暂时屏蔽折线图点击事件
      // addLineChart.on('click', (params) => {
      //   history.push(`/customer/ownerCustomerDetail/2/${params.name}`);
      // });
    }
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'customer') {
        navList[i].addEventListener('click', this.handleToOtherPage);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user } = this.props;
    if (nextProps.user.error) {
      this.setState({
        isErrorHappend: true,
      });
    }
  }

  componentWillUnmount() {
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'customer') {
        navList[i].removeEventListener('click', this.handleToOtherPage);
      }
    }
  }

  getAddOption() {
    const { user } = this.props;
    const newMember = user.myRecentlyAddedPeoples.newMemberItems || [];
    const sleepMember = user.myRecentlyAddedPeoples.sleepMemberItems || [];
    const labels = [];
    const addVal = [];
    const sleepVal = [];
    if (newMember.length > 0 || sleepMember.length > 0) {
      newMember.forEach((item) => {
        labels.push(item.name);
      });
      newMember.forEach((item) => {
        addVal.push(item.value);
      });
      sleepMember.forEach((item) => {
        sleepVal.push(item.value);
      });
    }
    const addOption = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['新增维护客户', '沉睡维护客户'],
      },
      toolbox: {
        show: true,
      },
      calculable: true,
      grid: [{
        left: 40,
      }],
      xAxis: [
        {
          snap: true,
          type: 'category',
          boundaryGap: false,
          data: labels,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '新增维护客户',
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#ff6978',
              lineStyle: {
                color: '#ff6978',
              },
            },
          },
          data: addVal,
        },
        {
          name: '沉睡维护客户',
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#97E1FB',
              lineStyle: {
                color: '#97E1FB',
              },
            },
          },
          data: sleepVal,
        },
      ],
    };
    return addOption;
  }

  closeNotification() {
    this.setState({
      isErrorHappend: false,
    });
  }

  handleToOtherPage(e) {
    this.setState({
      isShowModal: true,
    });
  }

  handleClick(e) {
    e.preventDefault();
    return false;
  }

  showBrandSearch() {
    this.setState({
      isShowBrandSearch: !this.state.isShowBrandSearch,
    });
    if (this.state.isShowSingleBrandSearch) {
      this.setState({
        isShowSingleBrandSearch: false,
      });
    }
  }

  handleSearch() {
    const { dispatch } = this.props;
    // const mobile = 18200147179;
    const mobile = this.singleSearch.value;
    if (mobile !== '') {
      dispatch(queryCustomerCaptchaList(mobile));
    }
  }

  handleFocus() {
    const { dispatch } = this.props;
    dispatch(resetCaptchaList());
  }

  render() {
    const { user, children, location, trace, isTraceGet, captchaList } = this.props;
    let totalCount = <i className="iconfont icon-jiazai hm-pulse hm-loading" />;
    let contentJSX;
    let traceJsx;
    if (isTraceGet) {
      if (trace.length > 0) {
        traceJsx = trace.map((item, idx) => {
          const key = `idx-${idx}`;
          let traceHeader;
          const content = Number(item.content);
          const allBuyBack = Number(item.allBuyBack);
          let traceClass;
          const percent = allBuyBack === 0 ?
            0 : (allBuyBack / content);
          switch (item.contactType) {
            case '1':
              traceHeader = '电话回访';
              traceClass = 'iconfont icon-dianhua';
              break;
            case '2':
              traceHeader = '短信回访';
              traceClass = 'iconfont icon-555';
              break;
            case '3':
              traceHeader = '微信回访';
              traceClass = 'iconfont icon-weixin';
              break;
            default:
              break;
          }
          return (
            <div>
              {
                item.contactType && item.contactType !== '5' &&
                <div className="trace-wrapper" key={key}>
                  <div className="trace-header">
                    <div className="title">
                      <i className={traceClass} /><span>{traceHeader}</span>
                    </div>
                    <div className="trace-progress">
                      完成度：{`${Math.round(percent * 100)}%`}
                    </div>
                  </div>
                  <a
                    href={`#/customer/list/task/visited/${item.contactType}`}
                    className="trace-item top"
                  >
                    <span>目标转化人数</span>
                    <div>
                      <span>{item.content || 0}</span>
                      <span className="icon icon-right-nav" />
                    </div>
                  </a>
                  <a
                    href={`#/customer/list/task/purchased/${item.contactType}`}
                    className="trace-item"
                  >
                    <span>已转化人数</span>
                    <div>
                      <span>{item.allBuyBack}</span>
                      <span className="icon icon-right-nav" />
                    </div>
                  </a>
                </div>
              }
            </div>
          );
        });
      } else {
        traceJsx = <div className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</div>;
      }
    } else {
      traceJsx = (
        <div className="hm-loading-wrapper">
          <i className="iconfont icon-jiazai hm-pulse hm-loading" />
        </div>
      );
    }
    if (user.myRecentlyDealPeoples.isFetching) {
      // 解决页面元素在iphone6p 7p 上隐藏的问题
      if (document.querySelector('.outContainer')) {
        document.querySelector('.outContainer').style.display = 'block';
      }
    }
    if (user.myRecentlyAddedPeoples.isCatching) {
      this.firstLoading = (
        <ReactEcharts
          option={this.getAddOption()}
          ref={c => (this.addLineChart = c)}
          style={{ height: '250px', width: '100%' }}
          className="react_for_echarts"
        />
      );
    }
    if (user.myMembers.countTotal) {
      totalCount = user.myMembers.countTotal;
    }
    if (children) {
      contentJSX = React.cloneElement(children, { key: location.key });
    } else {
      contentJSX = (
        <View className="outContainer">
          <Container className="ks-grid hm-customer-container">
            <Notification
              title="请稍后再来!"
              amStyle="alert"
              visible={this.state.isErrorHappend}
              animated
              onDismiss={this.closeNotification}
            >
              服务器正在卖力处理中
              {/* {user.error && user.error.message}.*/}
            </Notification>
            {
              this.state.isShowModal &&
              <div className="loading-modal">
                <i className="iconfont icon-jiazai hm-pulse hm-loading" />;
              </div>
            }
            <DefaultHeader title="客户" type="normal" />
            <div className="hm-total-customer-header">
              <a
                href="#/customer/list"
                id="hm_customer_total_link"
              >
                <div>
                  <span className="hm-stack">
                    <i className="hm-circle hm-stack-2x hm-user" />
                    <i className="iconfont icon-kehu hm-stack-1x hm-color-white" />
                  </span>
                  累计客户
                </div>
                <div>
                  {totalCount}人<span className="icon icon-right-nav" />
                </div>
              </a>
            </div>
            <div className="hm-customer-menu">
              <a
                id="hm_customer_month_buy_link"
                className="menu-item"
                // href={`#/customer/ownerCustomerDetail/3/${moment().month() + 1}`}
                href="#/customer/list/task/monthBuy"
              >
                <div>
                  <span className="hm-stack">
                    <i className="hm-circle hm-stack-2x hm-user" />
                    <i className="iconfont icon-wangluozhongduan hm-stack-1x hm-color-white" />
                  </span>
                  本月未持续购买客户
                </div>
                <span className="icon icon-right-nav" />
              </a>
              <a
                id="hm_customer_month_unbuy_link"
                title="本月未购买新客户"
                className="menu-item"
                // href={`/customer/ownerCustomerDetail/4/${moment().month() + 1}`}
                href="#/customer/list/task/monthUnBuy"
              >
                <div>
                  <span className="hm-stack">
                    <i className="hm-circle hm-stack-2x hm-user" />
                    <i className="iconfont icon-yonghu hm-stack-1x hm-color-white" />
                  </span>
                  本月未购买新客户
                </div>
                <span className="icon icon-right-nav" />
              </a>
            </div>
            <div className="hm-consume-rank-header">
              <a
                href="#/customer/consume"
                id="hm_customer_to_rank__link"
              >
                <div>
                  <span className="hm-stack">
                    <i className="hm-circle hm-stack-2x hm-user" />
                    <i className="iconfont icon-paixing hm-stack-1x hm-color-white" />
                  </span>
                  客户消费排行
                </div>
                <span className="icon icon-right-nav" />
              </a>
            </div>
            <div className="hm-ivalid-code" id="hmInvalidCode">
              <HMCard
                title="验证码发送查询"
                iconName="icon-tupian"
                showBrandSearch={this.showBrandSearch}
              >
                {
                  this.state.isShowBrandSearch &&
                  <div className="single-search-wrapper">
                    <label htmlFor="singleBrandSearch">
                      <input
                        type="text"
                        id="singleBrandSearch"
                        ref={c => (this.singleSearch = c)}
                        palceholder="请输入商品编码"
                        onFocus={this.handleFocus}
                      />
                      <div className="icon-wrapper" onClick={this.handleSearch} >
                        <span className="icon icon-search" />
                      </div>
                    </label>
                    <span className="captcha">验证码：{captchaList || '无'}</span>
                  </div>
                }
              </HMCard>
            </div>
            <div className="hm-lineChartContainer">
              <HMCard
                title="近期维护客户新增数量统计"
                iconName="icon-xinzengkehu"
                isMoreHide
              >
                <div className="hm-lineChart">
                  {this.firstLoading}
                </div>
              </HMCard>
              <div className="trace-container-wrapper">
                <HMCard
                  title="客户追踪"
                  iconName="iconfont icon-yonghu"
                  isMoreHide
                >
                  <div className="trace-container">
                    {traceJsx}
                  </div>
                </HMCard>
              </div>
            </div>
          </Container>
        </View>
      );
    }
    return (
      <div>{contentJSX}</div>
    );
  }
}

Customer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  myRecentlyAddedPeoples: PropTypes.object,
  myRecentlyDealPeoples: PropTypes.object,
  isFetching: PropTypes.bool,
  isCatching: PropTypes.bool,
  trace: PropTypes.array,
  isTraceGet: PropTypes.bool,
  captchaList: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  const { user, auth, customerTrace, customerCaptchaList } = state;
  const trace = customerTrace.trace;
  const isTraceGet = customerTrace.isTraceGet;
  const captchaList = customerCaptchaList.captchaList;
  if (!user) {
    // todo: 需要在此处应用应用程序缓存, 在后台数据无法获取的时候, 我们使用保存在应用缓存的数据.
    return {
      auth: { user: { name: '' } },
      user: {
        myMembers: {
          countTotal: 0,
          countNew: 0,
          countSale: 0,
          countSleep: 0,
          countFlown: 0,
          countWebStore: 0,
          consumeRadio: 0,
        },
        error: null,
        myRecentlyDealPeoples: {
          isFetching: '',
          dealMemberList: [],
          otherMemberList: [],
          selfMemberList: [],
          undealMemberList: [],
        },
        myRecentlyAddedPeoples: {
          isCatching: '',
          newMemberItems: [],
          sleepMemberItems: [],
        },
        captchaList: '',
      },
    };
  }
  return {
    user,
    auth,
    trace,
    isTraceGet,
    captchaList,
  };
}

export default connect(mapStateToProps)(Customer);
