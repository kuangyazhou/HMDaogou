import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import {
  Container,
  View,
} from 'amazeui-touch';
import { fetchMainBrand } from '../../../actions/store/mainBrand';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import '../../run/progressRank/progressRank.scss';

class ProgressRank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      isShow: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchMainBrand());
  }

  render() {
    const { mainBrandList, isMainBrandListGet } = this.props;
    let contentJSX;
    if (isMainBrandListGet) {
      if (mainBrandList.length > 0) {
        contentJSX = mainBrandList.map((item, idx) => {
          /* eslint no-mixed-operators: [0] */
          const key = `idx-${idx}`;
          let percent;
          if (item.completePerformance <= '0'
            || item.completePerformance === undefined
            || item.points === undefined
            || item.points <= '0') {
            percent = 0;
          } else {
            percent = Math.round(item.completePerformance / item.points * 100);
          }
          return (
            <div className="hm-progress-rank" key={key}>
              <div className="progress manager">
                <span style={{ width: `${percent}%` }}>
                  <b>{`${percent}%`}</b>
                </span>
              </div>
              <div className="bottom-detail">
                <strong>{item.target}</strong>
                <span>{`${Number(item.completePerformance).toLocaleString()}
                        /${Number(item.points).toLocaleString()}`}</span>
              </div>
            </div>
          );
        });
      } else {
        contentJSX = <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>;
      }
    } else {
      contentJSX = (
        <div className="hm-loadding-wrapper">
          <i className="iconfont icon-jiazai hm-pulse hm-loading" />
        </div>
      );
    }
    return (
      <View>
        <Container className="hm-ProgressRank" scrollable>
          <DefaultHeader title="本月主推品牌目标达成进度" history={this.props.history} mode />
          <div className="month-main-brand-progress">
            {contentJSX}
          </div>
        </Container>
      </View>
    );
  }
}

ProgressRank.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mainBrandList: PropTypes.array.isRequired,
  isMainBrandListGet: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  return {
    mainBrandList: stores.stores.mainBrandList,
    isMainBrandListGet: stores.stores.isMainBrandListGet,
  };
}

export default connect(mapStateToProps)(ProgressRank);
