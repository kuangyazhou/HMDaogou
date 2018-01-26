/* eslint max-len: [0] */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  Container,
  View,
} from 'amazeui-touch';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../utils/domUtils';

// API Utils.
import { loadUserProfile, sortObj } from '../../utils/apiUtils';

// components
import HMCard from '../hm-card/Card.jsx';

import ReactEcharts from '../../../../node_modules/echarts-for-react';

import './guideSale.scss';

class GuideSale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
    };
  }

  componentDidMount() {
    const { dispatch, isAverageGet, isMonthSaleTimeAverageGet } = this.props;
    if (isAverageGet) {
      const weekAverageChart = this.weekAverageChart.getEchartsInstance();
    }
    if (isMonthSaleTimeAverageGet) {
      const timeAverageChart = this.timeAverageChart.getEchartsInstance();
    }
  }

  getWeekAverageOption() {
    const { average } = this.props;
    sortObj(average, 'time');
    const rankList = [];
    const time = [];
    const amount = [];
    if (average && average.length > 0) {
      average.forEach((item, idx) => {
        rankList[idx] = {
          amount: item.amount,
          time: `第${item.time}周`,
        };
      });
      rankList.forEach((item, idx) => {
        time.push(item.time);
        amount.push(item.amount);
      });
    }
    const weekOption = {
      tooltip: {
        trigger: 'axis',
        confine: true,
        formatter: (params, ticket, callback) => {
          let res;
          const year = new Date().getFullYear();
          res = `${year}年${params[0].name}销售额<br/>`;
          params.forEach((item) => {
            res += `${item.seriesName}：${Number(item.data).toLocaleString()}元<br/>`;
          });
          return res;
        },
      },
      legend: {
        data: ['金额'],
      },
      calculable: true,
      grid: [{
        left: 60,
      }],
      xAxis: [
        {
          snap: true,
          type: 'category',
          boundaryGap: false,
          data: time,
          name: '日期（周）',
          nameGap: '30',
          nameLocation: 'middle',
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '金额（元）',
        },
      ],
      series: [
        {
          name: '金额',
          type: 'line',
          smooth: true,
          areaStyle: { normal: {} },
          itemStyle: {
            normal: {
              color: '#48B1FF',
              lineStyle: {
                color: '#48B1FF',
              },
            },
          },
          data: amount,
        },
      ],
    };
    return weekOption;
  }

  getTimeAverageOption() {
    const { thisMonth, lastMonth, time } = this.props;
    const thisMonthTargetAmount = [];
    const thisMonthTime = time;
    const lastMonthTargetAmount = [];
    thisMonth.forEach((item, idx) => {
      const amount = item.amount && item.amount.toFixed(2);
      thisMonthTargetAmount.push(amount);
    });
    lastMonth.forEach((item, idx) => {
      const amount = item.amount && item.amount.toFixed(2);
      lastMonthTargetAmount.push(amount);
    });
    const timeOption = {
      tooltip: {
        trigger: 'axis',
        confine: true,
        formatter: (params, ticket, callback) => {
          /* eslint no-undef: [0] */
          let res;
          const name = params[0].name || params[1].name;
          res = `${name}点平均销售额<br/>`;
          params.forEach((item) => {
            res += `${item.seriesName}：${Number(item.data).toLocaleString()}元<br/>
          `;
          });
          return res;
        },
      },
      legend: {
        data: ['本月', '上月'],
      },
      grid: [{
        left: 40,
      }],
      xAxis: {
        snap: true,
        type: 'category',
        boundaryGap: false,
        name: '时间（整点）',
        nameGap: '30',
        nameLocation: 'middle',
        data: thisMonthTime,
      },
      yAxis: {
        type: 'value',
        name: '金额（元）',
      },
      series: [
        {
          name: '本月',
          type: 'line',
          data: thisMonthTargetAmount,
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
          data: lastMonthTargetAmount,
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
    return timeOption;
  }

  render() {
    const { rankList, monthComplete, monthTotalComplete, average,
      monthCompletePercent, isRankListFetching, isMonthAllTargetGet,
      isAverageGet, isMonthSaleTimeAverageGet, lastMonthComplete,
      lastMonthTotalComplete, lastMonthpercent,
    } = this.props;
    /* eslint no-mixed-operators: [0] */
    const monthPercent = Math.round(Number(monthCompletePercent) * 100);
    const lastMonthPercent = Math.round(Number(lastMonthpercent) * 100);
    let iconContent;
    let contentJSX;
    if (isRankListFetching) {
      sortObj(rankList, 'percent', 'down');
      if (rankList && rankList.length > 0) {
        contentJSX = rankList.map((item, idx) => {
          const key = `idx-${idx}`;
          let percent;
          if (Number(item.percent) === 0 || item.percent === undefined) {
            percent = 0;
          } else {
            percent = Math.round(item.percent);
          }
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
                  {item.workName ? `${item.workName}` : ''}
                </div>
                <div className="progress manager">
                  <span style={{ width: `${percent}%` }}>
                    <b>{`${percent}%`}</b>
                  </span>
                </div>
                <div className="staff-amount">
                  <span>{item.hemiaoAmount ? `${Number(item.hemiaoAmount).toLocaleString()}` : 0}</span>/ {item.target ? `${Number(item.target).toLocaleString()}` : 0}
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
    return (
      <div className="hm-guide-sale-main">
        <HMCard
          cardLinkId="hm_sales_statistics_month_target_total_more"
          title="月度店铺总目标"
          iconName="icon-target"
          handleMore="#/monthTargetTotal"
          isManager
        >
          {
            isMonthAllTargetGet ?
              <div className="month-target-wrapper">
                <div className="hm-progress-rank marginBottomNone">
                  <div className="progress manager">
                    <span style={{ width: `${monthPercent}%` }}>
                      <b>{`${monthPercent}%`}</b>
                    </span>
                  </div>
                  <div className="bottom-detail">
                    <strong>本月金额</strong>
                    <span>
                      {monthComplete ? `${Number(monthComplete).toLocaleString()}` : 0}/
                  {monthTotalComplete ? `${Number(monthTotalComplete).toLocaleString()}` : 0}
                    </span>
                  </div>
                </div>
                <div className="hm-progress-rank last-month marginBottomNone">
                  <div className="progress manager">
                    <span style={{ width: `${lastMonthPercent}%` }}>
                      <b>{`${lastMonthPercent}%`}</b>
                    </span>
                  </div>
                  <div className="bottom-detail marginBottomNone">
                    <strong>上月金额</strong>
                    <span>
                      {lastMonthComplete ? `${Number(lastMonthComplete).toLocaleString()}` : 0}/
                      {lastMonthTotalComplete ? `${Number(lastMonthTotalComplete).toLocaleString()}` : 0}
                    </span>
                  </div>
                </div>
              </div> :
              <div className="hm-loading-wrapper"><i className="iconfont icon-jiazai hm-pulse hm-loading" /></div>
          }
        </HMCard>
        <HMCard
          cardLinkId="hm_sales_statistics_month_progress_rank_more"
          title="月度员工销售进度"
          iconName="icon-paixing"
          handleMore="#/monthProgressRank"
          isManager="true"
        >
          <div className="hm-progress-rank-title">
            <span className="rank">排名</span>
            <span className="name">姓名</span>
            <span className="point">进度</span>
            <span className="count">已完成/目标</span>
          </div>
          <div className="hm-new-progress-wrapper">
            {contentJSX}
          </div>
        </HMCard>
        <HMCard
          title="近4周销售趋势"
          iconName="icon-qushi"
          isMoreHide
          isManager
        >
          {
            isAverageGet ?
              <ReactEcharts
                option={this.getWeekAverageOption()}
                ref={c => (this.weekAverageChart = c)}
                style={{ height: '250px', width: '100%' }}
                className="react_for_echarts"
              /> :
              <div className="hm-loading-wrapper"><i className="iconfont icon-jiazai hm-pulse hm-loading" /></div>
          }
        </HMCard>
        <HMCard
          title="月度销售时段平均销售趋势"
          iconName="icon-qushi"
          isMoreHide
          isManager
        >
          {
            isMonthSaleTimeAverageGet ?
              <div className="wrapper">
                <ReactEcharts
                  option={this.getTimeAverageOption()}
                  ref={c => (this.timeAverageChart = c)}
                  style={{ height: '250px', width: '100%' }}
                  className="react_for_echarts"
                />
              </div> :
              <div className="hm-loading-wrapper"><i className="iconfont icon-jiazai hm-pulse hm-loading" /></div>
          }
        </HMCard>
      </div>
    );
  }
}

GuideSale.propTypes = {
  dispatch: PropTypes.func.isRequired,
  rankList: PropTypes.array.isRequired,
  monthComplete: PropTypes.string.isRequired,
  monthTotalComplete: PropTypes.string.isRequired,
  monthCompletePercent: PropTypes.string.isRequired,
  lastMonthComplete: PropTypes.string.isRequired,
  lastMonthTotalComplete: PropTypes.string.isRequired,
  lastMonthpercent: PropTypes.string.isRequired,
  thisMonth: PropTypes.array.isRequired,
  lastMonth: PropTypes.array.isRequired,
  time: PropTypes.array.isRequired,
  average: PropTypes.array.isRequired,
  isAverageGet: PropTypes.bool.isRequired,
  isRankListFetching: PropTypes.bool.isRequired,
  isMonthAllTargetGet: PropTypes.bool.isRequired,
  isMonthSaleTimeAverageGet: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  return {
    rankList: stores.stores.rankList,
    thisMonth: stores.stores.thisMonth,
    lastMonth: stores.stores.lastMonth,
    time: stores.stores.time,
    monthComplete: stores.stores.monthComplete,
    monthTotalComplete: stores.stores.monthTotalComplete,
    average: stores.average,
    isAverageGet: stores.isAverageGet,
    isMonthSaleTimeAverageGet: stores.stores.isMonthSaleTimeAverageGet,
    isMonthAllTargetGet: stores.stores.isMonthAllTargetGet,
    monthCompletePercent: stores.stores.monthCompletePercent,
    isRankListFetching: stores.stores.isRankListFetching,
    lastMonthComplete: stores.stores.lastMonthComplete,
    lastMonthTotalComplete: stores.stores.lastMonthTotalComplete,
    lastMonthpercent: stores.stores.lastMonthpercent,
  };
}

export default connect(mapStateToProps)(GuideSale);
