import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {
  Container,
  View,
} from 'amazeui-touch';

import ReactEcharts from '../../../../../node_modules/echarts-for-react';

import { fetchMainMonetaryLevel } from '../../../actions/store/client.js';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import './monetary.scss';

class Monetary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      isShow: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const pieChart = this.pieChart.getEchartsInstance();
    dispatch(fetchMainMonetaryLevel());
  }

  getOption() {
    const { allResult, isDealCustomerRank } = this.props;
    const data = [];
    const percentType = [];
    if (isDealCustomerRank) {
      allResult.forEach((item, idx) => {
        data[idx] = {
          value: '',
          name: '',
        };
        percentType.push(item.featureName);
        data[idx].value = item.hemiaoCount;
        data[idx].name = `${item.featureName}`;
      });
    }
    const option = {
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: (params, ticket, callback) => {
          const res = `${params.seriesName}<br />${params.name}:
          ${Number(params.value).toLocaleString()}人（${params.percent}%）`;
          return res;
        },
      },
      legend: {
        x: 'center',
        y: '5%',
        data: percentType,
      },
      color: ['#B5A2E1', '#4DC7CA', '#68B1F2', '#62C42E', '#F76A6C'],
      calculable: true,
      series: [
        {
          name: '消费金额等级占比',
          type: 'pie',
          center: ['50%', '55%'],
          radius: '50%',
          max: 40,                // for funnel
          sort: 'ascending',     // for funnel
          labelLine: {
            normal: {
              length: 25,
              length2: 0,
            },
          },
          data,
        },
      ],
    };
    return option;
  }

  render() {
    const { allResult, isDealCustomerRank } = this.props;
    let maxName;
    let maxPoint;
    let maxPercent;
    let content;
    if (isDealCustomerRank) {
      maxName = allResult[0].featureName;
      maxPoint = allResult[0].hemiaoCount;
      maxPercent = allResult[0].hemiaoProportion;
      if (allResult.length > 0) {
        content = (
          <div className="hm-chart-tip">
            <div className="tip-title">消费金额等级占比</div>
            <div className="tip-items">
              <div className="items">
                <span>{`${maxPoint}人(${maxPercent}%)`}</span>
                <p>{maxName}</p>
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
        <Container className="hm-monetary" scrollable>
          <div
            className="main"
          >
            <DefaultHeader title="本月客户消费金额等级占比" history={this.props.history} mode />
            {content}
            <div className="hm-chart-wrapper">
              <ReactEcharts
                option={this.getOption()}
                ref={c => (this.pieChart = c)}
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

Monetary.propTypes = {
  dispatch: PropTypes.func.isRequired,
  allResult: PropTypes.array.isRequired,
  isDealCustomerRank: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  const { client } = state;
  return {
    allResult: client.allResult,
    isDealCustomerRank: client.isDealCustomerRank,
  };
}

export default connect(mapStateToProps)(Monetary);
