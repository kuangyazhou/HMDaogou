import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { sortBy } from 'lodash';
import {
  Container,
  View,
  Tabs,
} from 'amazeui-touch';

import { fetchAddedCustomer, fetchDealedCustomer } from '../../../actions/store/client.js';

import ReactEcharts from '../../../../../node_modules/echarts-for-react';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';
import './newCustomer.scss';

class newCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      isShow: true,
      todayCount: '',
      lastMonthTodayCount: '',
      activeTab: 0,
      isShowDeal: true,
    };
    this.handleAction = this.handleAction.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const addLineChart = this.addLineChart.getEchartsInstance();
    dispatch(fetchAddedCustomer());
  }

  getAddOption() {
    const { thisMonthAdd, lastMonthAdd, isMonthAddGet } = this.props;
    const thisMonthData = sortBy(thisMonthAdd, (item) => Number(item.hemiaoDate.substr(-2)));
    const lastMonthData = sortBy(lastMonthAdd, (item) => Number(item.hemiaoDate.substr(-2)));
    const thisMonthTime = [];
    const thisMonthCount = [];
    const lastMonthCount = [];
    if (isMonthAddGet) {
      if (thisMonthAdd && thisMonthAdd.length > 0) {
        thisMonthData.forEach((item, idx) => {
          thisMonthCount.push(item.hemiaoCount || 0);
          thisMonthTime.push(item.hemiaoDate.substr(-2));
        });
        lastMonthData.forEach((item, idx) => {
          lastMonthCount.push(item.hemiaoCount || 0);
        });
      } else if (lastMonthAdd && lastMonthAdd.length > 0) {
        thisMonthData.forEach((item, idx) => {
          thisMonthCount.push(item.hemiaoCount || 0);
        });
        lastMonthData.forEach((item, idx) => {
          lastMonthCount.push(item.hemiaoCount || 0);
          thisMonthTime.push(item.hemiaoDate.substr(-2));
        });
      }
    }
    const addOption = {
      tooltip: {
        trigger: 'axis',
        confine: true,
        formatter: (params, ticket, callback) => {
          /* eslint no-undef: [0] */
          let res;
          let date;
          if (params.length === 1) {
            date = params[0].name.substr(params[0].name.lastIndexOf('-') + 1);
          } else if (params.length === 2) {
            date = params[1].name ? params[1].name.substr(params[1].name.lastIndexOf('-') + 1) :
              params[0].name.substr(params[0].name.lastIndexOf('-') + 1)
              ;
          }
          res = `${date}日新增客户数<br/>`;
          params.forEach((item) => {
            const newData = item.data === undefined ? 0 : item.data;
            res += `${item.seriesName}：${Number(newData)}位<br/>`;
          });
          return res;
        },
      },
      legend: {
        data: ['本月', '上月'],
        top: '5%',
      },
      grid: {
        top: '15%',
        left: '5%',
        right: '4%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: {
        snap: true,
        type: 'category',
        boundaryGap: false,
        name: '日期（日）',
        nameGap: '30',
        nameLocation: 'middle',
        data: thisMonthTime,
      },
      yAxis: {
        type: 'value',
        name: '客户（位）',
      },
      series: [
        {
          name: '本月',
          type: 'line',
          data: thisMonthCount,
          itemStyle: {
            normal: {
              color: '#97E1FB',
              lineStyle: {
                color: '#97E1FB',
              },
            },
          },
        },
        {
          name: '上月',
          type: 'line',
          data: lastMonthCount,
          itemStyle: {
            normal: {
              color: '#867BC6',
              lineStyle: {
                color: '#867BC6',
              },
            },
          },
        },
      ],
    };
    return addOption;
  }

  getOption() {
    const { thisMonthDeal, lastMonthDeal, isMonthDealGet } = this.props;
    const thisMonthData = sortBy(thisMonthDeal, (item) => Number(item.hemiaoDate.substr(-2)));
    const lastMonthData = sortBy(lastMonthDeal, (item) => Number(item.hemiaoDate.substr(-2)));
    const thisMonthTime = [];
    const thisMonthCount = [];
    const lastMonthCount = [];
    if (isMonthDealGet) {
      if (thisMonthDeal && thisMonthDeal.length > 0) {
        thisMonthData.forEach((item, idx) => {
          thisMonthCount.push(item.hemiaoCount);
          thisMonthTime.push(item.hemiaoDate.substr(-2));
        });
        lastMonthData.forEach((item, idx) => {
          lastMonthCount.push(item.hemiaoCount);
        });
      } else if (lastMonthDeal && lastMonthDeal.length > 0) {
        thisMonthData.forEach((item, idx) => {
          thisMonthCount.push(item.hemiaoCount);
        });
        lastMonthData.forEach((item, idx) => {
          lastMonthCount.push(item.hemiaoCount);
          thisMonthTime.push(item.hemiaoDate.substr(-2));
        });
      }
    }
    const addOption = {
      tooltip: {
        trigger: 'axis',
        alwaysShowContent: true,
        formatter: (params, ticket, callback) => {
          /* eslint no-undef: [0] */
          let res;
          let date;
          if (params.length === 1) {
            date = params[0].name.substr(params[0].name.lastIndexOf('-') + 1);
          } else if (params.length === 2) {
            date = params[1].name ? params[1].name.substr(params[1].name.lastIndexOf('-') + 1) :
              params[0].name.substr(params[0].name.lastIndexOf('-') + 1)
              ;
          }
          res = `${date}日交易人数<br/>`;
          params.forEach((item) => {
            const newData = item.data === undefined ? 0 : item.data;
            res += `
              <span></span>${item.seriesName}：${Number(newData)}位<br/>
          `;
          });
          return res;
        },
      },
      legend: {
        data: ['本月', '上月'],
        top: '5%',
      },
      grid: {
        top: '15%',
        left: '5%',
        right: '4%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: {
        snap: true,
        type: 'category',
        boundaryGap: false,
        name: '日期（日）',
        nameGap: '30',
        nameLocation: 'middle',
        data: thisMonthTime,
      },
      yAxis: {
        type: 'value',
        name: '客户（位）',
      },
      series: [
        {
          name: '本月',
          type: 'line',
          data: thisMonthCount,
          itemStyle: {
            normal: {
              color: '#97E1FB',
              lineStyle: {
                color: '#97E1FB',
              },
            },
          },
        },
        {
          name: '上月',
          type: 'line',
          data: lastMonthCount,
          itemStyle: {
            normal: {
              color: '#867BC6',
              lineStyle: {
                color: '#867BC6',
              },
            },
          },
        },
      ],
    };
    return addOption;
  }

  handleAction(key) {
    const { dispatch } = this.props;
    const { params } = this.props;
    const { history } = this.props;
    this.setState({
      activeTab: key,
    });
    switch (key) {
      case 0:
        this.setState({
          isShowDeal: false,
        });
        dispatch(fetchAddedCustomer());
        break;
      case 1:
        this.setState({
          isShow: false,
        });
        dispatch(fetchDealedCustomer());
        break;
      default:
        break;
    }
  }

  render() {
    const { thisMonthAdd, lastMonthAdd, thisMonthDeal,
      lastMonthDeal, isMonthAddGet, isMonthDealGet } = this.props;
    const index = new Date().getDate() - 1 === 0 ? 1 : new Date().getDate() - 1;
    let monthAddTip;
    let lastMonthAddTip;
    let monthDealTip;
    let lastMonthDealTip;
    let content;
    let dealContent;
    if (isMonthAddGet) {
      if (thisMonthAdd || lastMonthAdd) {
        if (thisMonthAdd.length > 0 || lastMonthAdd.length > 0) {
          thisMonthAdd.forEach((item, idx, arr) => {
            monthAddTip = arr[index - 1] ? arr[index - 1].hemiaoCount : 0;
          });
          lastMonthAdd.forEach((item, idx, arr) => {
            lastMonthAddTip = arr[index - 1] ? arr[index - 1].hemiaoCount : 0;
          });
          content = (
            <div className="hm-chart-tip">
              <div className="tip-title">{index}日新增客户</div>
              <div className="tip-items">
                <div className="items">
                  <span>{monthAddTip || 0}</span>
                  <p>本月</p>
                </div>
                <div className="items">
                  <span>{lastMonthAddTip}</span>
                  <p>上月</p>
                </div>
              </div>
            </div>
          );
        }
      } else {
        content = (
          <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>
        );
      }
    } else {
      content = (<div className="hm-loading-wrapper">
        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
      </div>);
    }
    if (isMonthDealGet) {
      if (thisMonthDeal || lastMonthDeal) {
        if (thisMonthDeal.length > 0 || lastMonthDeal.length > 0) {
          thisMonthDeal.forEach((item, idx, arr) => {
            monthDealTip = arr[index - 1] ? arr[index - 1].hemiaoCount : 0;
          });
          lastMonthDeal.forEach((item, idx, arr) => {
            lastMonthDealTip = arr[index - 1] ? arr[index - 1].hemiaoCount : 0;
          });
        }
        dealContent = (
          <div className="hm-chart-tip">
            <div className="tip-title">{index}日交易客户</div>
            <div className="tip-items">
              <div className="items">
                <span>{monthDealTip || 0}</span>
                <p>本月</p>
              </div>
              <div className="items">
                <span>{lastMonthDealTip}</span>
                <p>上月</p>
              </div>
            </div>
          </div>
        );
      } else {
        dealContent = (
          <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>
        );
      }
    } else {
      dealContent = (<div className="hm-loading-wrapper">
        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
      </div>);
    }
    return (
      <View>
        <Container className="hm-newCustomer" scrollable>
          <DefaultHeader title="月新增与交易客户增长趋势" history={this.props.history} mode />
          <div className="hm-customer-care-main">
            <Tabs
              className="hm-sale-statistics-nav"
              activeKey={this.state.activeTab}
              onAction={this.handleAction}
            >
              <Tabs.Item
                title="新增客户"
                navStyle="alert"
              >
                <div
                  className="main"
                >
                  {content}
                  <div className="hm-chart-wrapper">
                    <ReactEcharts
                      option={this.getAddOption()}
                      ref={c => (this.addLineChart = c)}
                      style={{ height: '100%', width: '100%' }}
                      className="react_for_echarts"
                    />
                  </div>
                </div>
              </Tabs.Item>
              <Tabs.Item
                title="交易客户"
                navStyle="alert"
              >
                <div
                  className="main"
                >
                  {dealContent}
                  <div className="hm-chart-wrapper">
                    <ReactEcharts
                      option={this.getOption()}
                      ref={c => (this.lineChart = c)}
                      style={{ height: '100%', width: '100%' }}
                      className="react_for_echarts"
                    />
                  </div>
                </div>
              </Tabs.Item>
            </Tabs>
          </div>
        </Container>
      </View>
    );
  }
}

newCustomer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  thisMonthAdd: PropTypes.array.isRequired,
  lastMonthAdd: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  thisMonthDeal: PropTypes.array.isRequired,
  lastMonthDeal: PropTypes.array.isRequired,
  isMonthAddGet: PropTypes.bool.isRequired,
  isMonthDealGet: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { client } = state;
  return {
    thisMonthAdd: client.thisMonthAdd,
    lastMonthAdd: client.lastMonthAdd,
    thisMonthDeal: client.thisMonthDeal,
    lastMonthDeal: client.lastMonthDeal,
    isMonthAddGet: client.isMonthAddGet,
    isMonthDealGet: client.isMonthAddGet,
  };
}

export default connect(mapStateToProps)(newCustomer);

