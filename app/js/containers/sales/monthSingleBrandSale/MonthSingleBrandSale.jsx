import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import {
  Container,
  View,
} from 'amazeui-touch';

import { fetchMonthSingleSaleRank } from '../../../actions/store/sales';
import ReactEcharts from '../../../../../node_modules/echarts-for-react';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import '../../run/singleBrandSale/singleBrandSale.scss';

class MonthSingleBrandSale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchMonthSingleSaleRank());
    const addLineChart = this.addLineChart.getEchartsInstance();
  }

  getAddOption() {
    const { currentMonth, previousMonth } = this.props;
    const currentMonthAmount = [];
    const previousMonthAmount = [];
    const brand = [];
    const now = new Date().toLocaleDateString();
    currentMonth.forEach((item, idx) => {
      currentMonthAmount.push(Math.round(item.amount));
      const name = item.name.length > 20 ? item.name.substr(0, 19) : item.name;
      brand.push(name);
      if (previousMonth.length <= 1) {
        previousMonthAmount.push(0);
      }
    });
    previousMonth.forEach((item, idx) => {
      previousMonthAmount.push(Math.round(item.amount));
    });
    const addOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'line',       // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true,
        formatter: (params, ticket, callback) => {
          /* eslint no-undef: [0] */
          let res;
          res = `${params[0].name}销售额<br/>`;
          params.forEach((item) => {
            res += `
                ${item.seriesName}：${Number(item.data).toLocaleString()}元<br/>
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
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: [
        {
          snap: true,
          type: 'category',
          name: '产品名',
          nameGap: '30',
          nameLocation: 'end',
          data: brand,
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0,
            formatter: (value) => value.split('').join('\n'),
          },
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
          name: '本月',
          type: 'line',
          data: currentMonthAmount,
          itemStyle: {
            normal: {
              color: '#97E1FB',
            },
          },
        },
        {
          name: '上月',
          type: 'line',
          data: previousMonthAmount,
          itemStyle: {
            normal: {
              color: '#867BC6',
            },
          },
        },
      ],
    };
    return addOption;
  }

  render() {
    const { previousMonth, currentMonth, isMonthSingleBrandGet } = this.props;
    let content;
    if (isMonthSingleBrandGet) {
      if (previousMonth.length > 1 || currentMonth.length > 1) {
        content = (
          <div className="hm-chart-tip">
            <div className="tip-title">本月第一：{currentMonth[0].name}</div>
            <div className="tip-items">
              <div className="items">
                <span>{Number(currentMonth[0].amount).toLocaleString()}</span>
                <p>本月</p>
              </div>
              <div className="items">
                <span>{Number(previousMonth[0].amount).toLocaleString()}</span>
                <p>上月</p>
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
      <View className="hm-out">
        <Container className="hm-SingleBrandSale" scrollable>
          <div
            className="main"
          >
            <DefaultHeader title="本月单品销售额TOP20" history={this.props.history} mode />
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


MonthSingleBrandSale.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentMonth: PropTypes.array.isRequired,
  previousMonth: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  isMonthSingleBrandGet: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  return {
    currentMonth: stores.stores.currentMonth,
    previousMonth: stores.stores.previousMonth,
    isMonthSingleBrandGet: stores.stores.isMonthSingleBrandGet,
  };
}

export default connect(mapStateToProps)(MonthSingleBrandSale);

