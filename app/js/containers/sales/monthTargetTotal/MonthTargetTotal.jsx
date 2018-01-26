import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import {
  Container,
  View,
} from 'amazeui-touch';

import {
  sortBy,
} from 'lodash';

import { fetchMonthTotalTargetDetail } from '../../../actions/store/totalTarget';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import ReactEcharts from '../../../../../node_modules/echarts-for-react';

import '../../run/targetTotal/targetTotal.scss';

class monthTargetTotal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      isShow: true,
    };
    this.handerTouch = this.handerTouch.bind(this);
    this.handerOver = this.handerOver.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchMonthTotalTargetDetail());
    const addLineChart = this.addLineChart.getEchartsInstance();
  }

  getAddOption() {
    const { thisMonthDetail, lastMonthDetail, isMonthTargetFetching } = this.props;
    const thisMonthData = sortBy(thisMonthDetail, (item) => Number(item.time));
    const lastMonthData = sortBy(lastMonthDetail, (item) => Number(item.time));
    const thisMonthAmount = [];
    const lastMonthAmount = [];
    const times = [];
    if (isMonthTargetFetching) {
      if (thisMonthData.length > 0) {
        thisMonthData.forEach((item) => {
          thisMonthAmount.push(item.amount);
          times.push(item.time);
        });
        lastMonthData.forEach((item) => {
          lastMonthAmount.push(item.amount);
        });
      } else if (lastMonthData.length > 0) {
        thisMonthData.forEach((item) => {
          thisMonthAmount.push(item.amount);
        });
        lastMonthData.forEach((item) => {
          lastMonthAmount.push(item.amount);
          times.push(item.time);
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
          const name = params[0].name || params[1].name;
          res = `${name}日销售额<br/>`;
          params.forEach((item) => {
            res += `${item.seriesName}：${Number(item.data).toLocaleString()}元<br/>`;
          });
          return res;
        },
      },
      legend: {
        // 上紫 本蓝
        data: ['本月', '上月'],
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
        name: '日期（日）',
        nameGap: '30',
        nameLocation: 'middle',
        data: times,
      },
      yAxis: {
        type: 'value',
        name: '金额（元）',
      },
      series: [
        {
          name: '本月',
          type: 'line',
          data: thisMonthAmount,
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
          data: lastMonthAmount,
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

  handerTouch() {
    this.setState({
      isShow: false,
    });
  }

  handerOver() {
    this.setState({
      isShow: false,
    });
  }

  render() {
    const { thisMonthDetail, lastMonthDetail, isMonthTargetFetching } = this.props;
    const now = new Date().getDate() - 1 === 0 ? 1 : new Date().getDate() - 1;
    const thisMonthAmount = [];
    const lastMonthAmount = [];
    if (isMonthTargetFetching && thisMonthDetail.length > 0) {
      thisMonthDetail.forEach((item) => {
        thisMonthAmount.push(item.amount);
      });
    }
    if (isMonthTargetFetching && lastMonthDetail.length > 0) {
      lastMonthDetail.forEach((item) => {
        lastMonthAmount.push(item.amount);
      });
    }
    const currentAmount = thisMonthAmount.length > 0 && thisMonthAmount[now - 1] ?
      thisMonthAmount[now - 1] : 0;
    const previousAmount = lastMonthAmount.length > 0 && lastMonthAmount[now - 1] ?
      lastMonthAmount[now - 1] : 0;
    let content;
    if (isMonthTargetFetching) {
      if (thisMonthDetail.length > 0 || lastMonthDetail.length > 0) {
        content = (
          <div className="hm-chart-tip">
            <div className="tip-title">{`${now}日销售额`}</div>
            <div className="tip-items">
              <div className="items">
                <span>{`${Number(currentAmount).toLocaleString()}`}</span>
                <p>本月</p>
              </div>
              <div className="items">
                <span>{`${Number(previousAmount).toLocaleString()}`}</span>
                <p>上月</p>
              </div>
            </div>
          </div>
        );
      } else {
        content = (
          <p className="hm-null">还没有数据</p>
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
            onTouchStart={this.handerTouch}
            onMouseOver={this.handerOver}
          >
            <DefaultHeader title="全店月销售详情" history={this.props.history} mode />
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

monthTargetTotal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  thisMonthDetail: PropTypes.array.isRequired,
  lastMonthDetail: PropTypes.array.isRequired,
  isMonthTargetFetching: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  return {
    thisMonthDetail: stores.stores.thisMonthDetail,
    lastMonthDetail: stores.stores.lastMonthDetail,
    isMonthTargetFetching: stores.stores.isMonthTargetFetching,
  };
}

export default connect(mapStateToProps)(monthTargetTotal);
