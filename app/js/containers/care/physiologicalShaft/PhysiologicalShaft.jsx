import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {
  Container,
  View,
} from 'amazeui-touch';

import { fetchPhysiologicalAxis } from '../../../actions/store/client.js';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';
import ReactEcharts from '../../../../../node_modules/echarts-for-react';

import './physiologicalShaft.scss';

class PhysiologicalShaft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const pieChart = this.pieChart.getEchartsInstance();
    dispatch(fetchPhysiologicalAxis());
  }

  getOption() {
    const { physiologicalList, isPhysiologicalListGet } = this.props;
    let featureName;
    const featureNameData = [];
    const data = [];
    if (physiologicalList && physiologicalList.length > 0) {
      physiologicalList.forEach((item, idx, arr) => {
        const percent = item.hemiaoProportion;
        if (item.featureName.indexOf('~') !== -1) {
          featureName = `宝宝${item.featureName}`;
        } else if (item.featureName.indexOf('孕') !== -1) {
          featureName = `宝妈${item.featureName}`;
        }
        featureNameData.push(featureName);
        data[idx] = {
          value: '',
          name: '',
        };
        data[idx].value = item.hemiaoCount;
        data[idx].name = featureName;
      });
    }
    const option = {
      tooltip: {
        trigger: 'item',
        alwaysShowContent: true,
        formatter: (params, ticket, callback) => {
          const res = `${params.seriesName}<br />${params.name}:
                    ${Number(params.value).toLocaleString()}（${params.percent}%）`;
          return res;
        },
      },
      legend: {
        x: 'center',
        y: '5%',
        data: featureNameData,
      },
      calculable: true,
      series: [
        {
          name: '客户生理轴人群占比',
          type: 'pie',
          center: ['50%', '65%'],
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
    const { physiologicalList, isPhysiologicalListGet } = this.props;
    let maxName;
    let maxPoint;
    let maxPercent;
    let content;
    if (isPhysiologicalListGet && physiologicalList && physiologicalList.length > 0) {
      maxName = physiologicalList[0].featureName;
      maxPoint = physiologicalList[0].hemiaoCount;
      maxPercent = physiologicalList[0].hemiaoProportion;
      if (maxName.indexOf('~') !== -1) {
        maxName = `宝宝${maxName}`;
      } else if (maxName.indexOf('孕') !== -1) {
        maxName = `宝妈${maxName}`;
      }
      if (physiologicalList.length > 0) {
        content = (
          <div className="hm-chart-tip">
            <div className="tip-title">生理轴人群占比</div>
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
          <p className="hm-null"><i className="iconfont icon-meiyoushsuju" />还没有数据</p>
        );
      }
    } else {
      content = (<div className="hm-loading-wrapper">
        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
      </div>);
    }
    return (
      <View>
        <Container className="hm-physiologicalShaft" scrollable>
          <div
            className="main"
          >
            <DefaultHeader title="月交易客户生理轴人群占比" history={this.props.history} mode />
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


PhysiologicalShaft.propTypes = {
  dispatch: PropTypes.func.isRequired,
  physiologicalList: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  isPhysiologicalListGet: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { client } = state;
  return {
    allResult: client.allResult,
    physiologicalList: client.physiologicalList,
    isPhysiologicalListGet: client.isPhysiologicalListGet,
  };
}

export default connect(mapStateToProps)(PhysiologicalShaft);

