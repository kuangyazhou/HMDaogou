import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import {
  Container,
  View,
  Grid,
  Col,
} from 'amazeui-touch';

import { sortObj } from '../../../utils/apiUtils';

import { fetchSaleRank } from '../../../actions/store/sales';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import '../../run/progressRank/progressRank.scss';

class ProgressRank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOrhide: false,
      result: [],
    };
    this.openSearchInput = this.openSearchInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.cancleSearch = this.cancleSearch.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchSaleRank());
  }

  openSearchInput() {
    this.setState({
      showOrhide: !this.state.showOrhide,
    });
    // state有延迟需要延迟加上定时器
    setTimeout(() => {
      this.queryStr.focus();
    }, 0);
  }

  cancleSearch() {
    this.openSearchInput();
    this.queryStr.blur();
    this.setState({
      result: [],
    });
  }

  handleSearch(e) {
    const { rankList } = this.props;
    const txtVal = e.target.value;
    const result = [];
    rankList.forEach((item, idx) => {
      if (txtVal !== '' && item.workName.indexOf(txtVal) !== -1) {
        result.push(item);
      }
    });
    this.setState({
      result,
    });
  }

  render() {
    const { rankList, isRankListFetching } = this.props;
    let iconContent;
    if (isRankListFetching) {
      sortObj(rankList, 'percent', 'down');
    }
    return (
      <View>
        <Container className="hm-ProgressRank" scrollable>
          <div className="main">
            {
              !this.state.showOrhide &&
              <DefaultHeader
                title="月度员工销售进度详情"
                history={this.props.history}
                type="special"
                openSearchInput={this.openSearchInput}
                mode
              />
            }
            <div className="hm-search-form">
              <Grid className={this.state.showOrhide ? 'show' : 'hide'}>
                <Col cols={5} className="search">
                  <input
                    id="hm_login_search"
                    type="text"
                    name="q"
                    ref={(c) => { this.queryStr = c; }}
                    required
                    onChange={this.handleSearch}
                    placeholder="可输入姓名"
                  />
                  <span
                    id="hm_login_search_icon"
                    className="icon icon-search"
                    onClick={this.handleSearch}
                  />
                </Col>
                <Col cols={1}>
                  <span className="cancle" onClick={this.cancleSearch}>取消</span>
                </Col>
              </Grid>
            </div>
            {
              this.state.result.length > 0 &&
              <div className="hm-search-result">
                <div className="hm-progress-rank-title">
                  <span className="name">姓名</span>
                  <span className="point">进度</span>
                  <span className="count">已完成/目标</span>
                </div>
                <div className="hm-new-progress-wrapper">
                  {
                    this.state.result.map((item, idx) => {
                      const key = `idx-${idx}`;
                      let percent;
                      if (Number(item.percent) === 0 || item.percent === undefined) {
                        percent = 0;
                      } else {
                        percent = Math.round(item.percent);
                      }
                      return (
                        <div className="hm-new-progress" key={key}>
                          <div className="staff-name">
                            {item.workName ? `${item.workName}` : '未知姓名'}
                          </div>
                          <div className="progress manager">
                            <span style={{ width: `${percent}%` }}>
                              <b>{`${percent}%`}</b>
                            </span>
                          </div>
                          <div className="staff-amount">
                            <span>
                              {item.hemiaoAmount ?
                                `${Number(item.hemiaoAmount).toLocaleString()}` : 0}
                            </span>
                            /{item.target ? `${Number(item.target).toLocaleString()}` : 0}
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            }
            <div className="hm-ProgressRank-wrapper">
              <div className="hm-progress-rank-title">
                <span className="rank">排名</span>
                <span className="name">姓名</span>
                <span className="point">进度</span>
                <span className="count">已完成/目标</span>
              </div>
              <div className="hm-new-progress-wrapper">
                {
                  rankList && rankList.length > 0 ? rankList.map((item, idx) => {
                    const key = `idx-${idx}`;
                    /* eslint no-mixed-operators: [0] */
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
                        iconContent = idx + 1;
                        break;
                    }
                    return (
                      <div className="hm-new-progress" key={key}>
                        <div className="icon-wrapper rank">
                          {iconContent}
                        </div>
                        <div className="staff-name">
                          {item.workName ? `${item.workName}` : '未知姓名'}
                        </div>
                        <div className="progress manager">
                          <span style={{ width: `${percent}%` }}>
                            <b>{`${percent}%`}</b>
                          </span>
                        </div>
                        <div className="staff-amount">
                          <span>
                            {item.hemiaoAmount ?
                              `${Number(item.hemiaoAmount).toLocaleString()}` : 0}
                          </span>
                          /{item.target ? `${Number(item.target).toLocaleString()}` : 0}
                        </div>
                      </div>
                    );
                  })
                    : <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>
                }
              </div>

            </div>
          </div>
        </Container>
      </View>
    );
  }
}

ProgressRank.propTypes = {
  dispatch: PropTypes.func.isRequired,
  rankList: PropTypes.array.isRequired,
  isRankListFetching: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  return {
    rankList: stores.stores.rankList,
    isRankListFetching: stores.stores.isRankListFetching,
  };
}

export default connect(mapStateToProps)(ProgressRank);

