import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import {
  Container,
  View,
} from 'amazeui-touch';

import { sortBy } from 'lodash';
import { fetchTodaySaleTime } from '../../../actions/store/totalTarget';

import ReactEcharts from '../../../../../node_modules/echarts-for-react';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import './targetTotal.scss';

class TargetTotal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      isShow: true,
      index: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchTodaySaleTime());
    const addLineChart = this.addLineChart.getEchartsInstance();
  }

  getAddOption() {
    const {
      isFetching,
      todaySaleDetail,
      yesterdaySaleDetail,
      saleTime,
      weekSaleDetail,
      monthSaleDetail,
      threeMonthSaleDetail,
      } = this.props;
    const addOption = {
      tooltip: {
        trigger: 'axis',
        confine: true,
        formatter: (params, ticket, callback) => {
          /* eslint no-undef: [0] */
          let res;
          res = `${params[0].name}点销售额<br/>`;
          params.forEach((item) => {
            res += `
                <span></span>${item.seriesName}：${Number(item.data).toLocaleString()}元<br/>
            `;
          });
          return res;
        },
      },
      legend: {
        data: ['今日', '昨日', '七日', '三十日', '三月'],
        top: '5%',
      },
      grid: {
        top: '20%',
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: {
        snap: true,
        type: 'category',
        boundaryGap: false,
        name: '时间（整点）',
        nameGap: '30',
        nameLocation: 'middle',
        data: saleTime,
      },
      yAxis: {
        type: 'value',
        name: '金额（元）',
      },
      series: [
        {
          name: '今日',
          type: 'line',
          data: todaySaleDetail,
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
          name: '昨日',
          type: 'line',
          data: yesterdaySaleDetail,
          itemStyle: {
            normal: {
              color: '#867BC6',
              lineStyle: {
                color: '#867BC6',
              },
            },
          },
        },
        {
          name: '七日',
          type: 'line',
          data: weekSaleDetail,
          itemStyle: {
            normal: {
              color: '#DD5044',
              lineStyle: {
                color: '#DD5044',
              },
            },
          },
        },
        {
          name: '三十日',
          type: 'line',
          data: monthSaleDetail,
          itemStyle: {
            normal: {
              color: '#1BA261',
              lineStyle: {
                color: '#1BA261',
              },
            },
          },
        },
        {
          name: '三月',
          type: 'line',
          data: threeMonthSaleDetail,
          itemStyle: {
            normal: {
              color: '#FFCE44',
              lineStyle: {
                color: '#FFCE44',
              },
            },
          },
        },
      ],
    };
    return addOption;
  }

  render() {
    const {
       isFetching,
      todaySaleDetail,
      yesterdaySaleDetail,
      saleTime,
      weekSaleDetail,
      monthSaleDetail,
      threeMonthSaleDetail,
      } = this.props;
    let time;
    let thisAmount;
    let lastAmount;
    let weekAmount;
    let monthAmount;
    let threeMonthAmount;
    let content;
    const nowHour = new Date().getHours();
    if (isFetching) {
      if (saleTime && saleTime.length > 0) {
        saleTime.forEach((item, idx, arr) => {
          if (arr[idx] === nowHour) {
            time = saleTime[idx];
            thisAmount = todaySaleDetail[idx];
            lastAmount = yesterdaySaleDetail[idx];
            weekAmount = weekSaleDetail[idx];
            monthAmount = monthSaleDetail[idx];
            threeMonthAmount = threeMonthSaleDetail[idx];
          } else if (nowHour < 7) {
            time = saleTime[0];
            thisAmount = todaySaleDetail[0];
            lastAmount = yesterdaySaleDetail[0];
            weekAmount = weekSaleDetail[0];
            monthAmount = monthSaleDetail[0];
            threeMonthAmount = threeMonthSaleDetail[0];
          }
        });
        content = (
          <div className="hm-chart-tip">
            <div className="tip-title">{time}点销售额</div>
            <div className="tip-items">
              <div className="items">
                <span>{Number(thisAmount).toLocaleString()}</span>
                <p>今日</p>
              </div>
              <div className="items">
                <span> {Number(lastAmount).toLocaleString()}</span>
                <p>昨日</p>
              </div>
              <div className="items">
                <span> {Number(weekAmount).toLocaleString()}</span>
                <p>七日</p>
              </div>
              <div className="items">
                <span> {Number(monthAmount).toLocaleString()}</span>
                <p>三十日</p>
              </div>
              <div className="items">
                <span> {Number(threeMonthAmount).toLocaleString()}</span>
                <p>近三月</p>
              </div>
            </div>
          </div>
        );
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
    return (
      <View>
        <Container className="hm-targetTotal" scrollable>
          <div
            className="main"
          >
            <DefaultHeader title="今日全店销售额时段详情" history={this.props.history} mode />
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
        </Container>
      </View>
    );
  }
}


TargetTotal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  todaySaleDetail: PropTypes.array.isRequired,
  yesterdaySaleDetail: PropTypes.array.isRequired,
  saleTime: PropTypes.array.isRequired,
  weekSaleDetail: PropTypes.array.isRequired,
  monthSaleDetail: PropTypes.array.isRequired,
  threeMonthSaleDetail: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  return {
    saleTime: stores.stores.saleTime,
    todaySaleDetail: stores.stores.todaySaleDetail,
    yesterdaySaleDetail: stores.stores.yesterdaySaleDetail,
    weekSaleDetail: stores.stores.weekSaleDetail,
    monthSaleDetail: stores.stores.monthSaleDetail,
    threeMonthSaleDetail: stores.stores.threeMonthSaleDetail,
    isFetching: stores.stores.isFetching,
  };
}

export default connect(mapStateToProps)(TargetTotal);
