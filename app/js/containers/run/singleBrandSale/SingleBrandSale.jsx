import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import {
  Container,
  View,
} from 'amazeui-touch';

import { fetchSingleSaleRank } from '../../../actions/store/sales';

import ReactEcharts from '../../../../../node_modules/echarts-for-react';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import './singleBrandSale.scss';

class SingleBrandSale extends React.Component {
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
    dispatch(fetchSingleSaleRank());
    const addLineChart = this.addLineChart.getEchartsInstance();
  }

  getAddOption() {
    const { today, yesterday } = this.props;
    const todayAmount = [];
    const yesterdayAmount = [];
    const brand = [];
    const now = new Date().toLocaleDateString();
    today.forEach((item, idx) => {
      todayAmount.push(Math.round(item.amount));
      brand.push(item.name || item.value);
    });
    yesterday.forEach((item, idx) => {
      yesterdayAmount.push(Math.round(item.amount));
    });
    const addOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            //  坐标轴指示器，坐标轴触发有效
          type: 'shadow',       //  默认为直线，可选为：'line' | 'shadow'
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
        data: ['今日', '昨日'],
        top: '5%',
      },
      grid: {
        top: '20%',
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
          nameTextStyle: {
            align: 'left',
          },
          axisLabel: {
            interval: 0,
            formatter: (value) => {
              let ret = '';//  拼接加\n返回的类目项
              const maxLength = 3;//  每项显示文字个数
              const valLength = value.length;//  X轴类目项的文字个数
              const rowN = Math.ceil(valLength / maxLength);//  类目项需要换行的行数
              if (rowN > 1) { // 如果类目项的文字大于3,
                for (let i = 0; i < rowN; i++) {
                  let temp = '';// 每次截取的字符串
                  const start = i * maxLength;// 开始截取的位置
                  const end = start + maxLength;// 结束截取的位置
                  // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = `${value.substring(start, end)}\n`;
                  ret += temp; // 凭借最终的字符串
                }
                return ret;
              }
              return value;
            },
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
          name: '今日',
          type: 'bar',
          data: todayAmount,
          itemStyle: {
            normal: {
              color: '#97E1FB',
            },
          },
        },
        {
          name: '昨日',
          type: 'bar',
          data: yesterdayAmount,
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
    const { today, yesterday, isTodaySingleBrandGet } = this.props;
    let content;
    if (isTodaySingleBrandGet) {
      content = (
        <div className="hm-chart-tip">
          <div className="tip-title">今日第一：{`${today[0].name}`}点销售额</div>
          <div className="tip-items">
            <div className="items">
              <span>{Number(today[0].amount).toLocaleString()}</span>
              <p>今日</p>
            </div>
            <div className="items">
              <span> {Number(yesterday[0].amount).toLocaleString()}</span>
              <p>昨日</p>
            </div>
          </div>
        </div>
      );
    } else {
      content = (<div className="hm-loading-wrapper">
        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
      </div>);
    }
    return (
      <View>
        <Container className="hm-SingleBrandSale" scrollable>
          <div
            className="main"
            onTouchStart={this.handerTouch}
            onMouseOver={this.handerOver}
          >
            <DefaultHeader title="今日单品销售额TOP5" history={this.props.history} mode />
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

SingleBrandSale.propTypes = {
  dispatch: PropTypes.func.isRequired,
  today: PropTypes.array.isRequired,
  isTodaySingleBrandGet: PropTypes.bool.isRequired,
  yesterday: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  return {
    today: stores.stores.today,
    isTodaySingleBrandGet: stores.stores.isTodaySingleBrandGet,
    yesterday: stores.stores.yesterday,
  };
}

export default connect(mapStateToProps)(SingleBrandSale);
