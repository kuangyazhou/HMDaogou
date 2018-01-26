import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {
  Container,
  View,
  Tabs,
  Grid,
  Col,
} from 'amazeui-touch';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';
import { fetchSaleChangceDetail, resetSaleChangceResult } from '../../../actions/store/staffTask';

import './staffSaleChangce.scss';

class StaffSaleChangce extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOrhide: false,
      result: [],
    };
    this.openSearchInput = this.openSearchInput.bind(this);
    this.cancleSearch = this.cancleSearch.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { type } = this.props.params;
    dispatch(resetSaleChangceResult());
    dispatch(fetchSaleChangceDetail(type));
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
    const { saleChangceDetail } = this.props;
    const txtVal = e.target.value;
    const result = [];
    saleChangceDetail.forEach((item, idx) => {
      if (txtVal !== '' && item.guiderName.indexOf(txtVal) !== -1) {
        result.push(item);
      }
    });
    this.setState({
      result,
    });
  }

  render() {
    const { saleChangceDetail, isSaleChangceDetailGet } = this.props;
    const { type } = this.props.params;
    let title;
    const header = (
      <div className="hm-sale-changce-title">
        <span className="name">名字</span>
        <span className="point">完成度</span>
        <span className="target">已完成/目标</span>
      </div>
    );
    switch (type) {
      case '01':
        title = '今日员工新客转化统计';
        break;
      case '02':
        title = '今日员工阶段营销统计';
        break;
      case '03':
        title = '今日员工流失预警统计';
        break;
      case '04':
        title = '今日员工复购推荐统计';
        break;
      case '05':
        title = '今日员工成长关怀统计';
        break;
      default:
        break;
    }
    let contextJSX;
    if (type !== '05') {
      if (isSaleChangceDetailGet) {
        if (saleChangceDetail.length > 0) {
          contextJSX = saleChangceDetail.map((item, idx) => {
            const key = `idx-${idx}`;
            /* eslint no-mixed-operators: [0] */
            const percent = item.doneValue / item.contentValue * 100;
            return (
              <div className="hm-sale-changce-title-item" key={key}>
                <span className="name">{item.guiderName}</span>
                <div className="progress manager point">
                  <span style={{ width: `${percent}%` }}>
                    <b>{`${percent}%`}</b>
                  </span>
                </div>
                <span className="target"><b>{item.doneValue}</b>/{item.contentValue}</span>
              </div>
            );
          });
        } else {
          contextJSX = <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>;
        }
      } else {
        contextJSX = (<div className="hm-loading-wrapper">
          <i className="iconfont icon-jiazai hm-pulse hm-loading" />
        </div>);
      }
    }
    return (
      <View>
        <Container className="hm-todayCompleteTask" scrollable>
          {
            !this.state.showOrhide &&
            <DefaultHeader
              title={title}
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
              <div className="sale-changce-list">
                {header}
                {
                  this.state.result.map((item, idx) => {
                    const key = `idx-${idx}`;
                    const percent = item.doneValue / item.contentValue * 100;
                    return (
                      <div className="hm-sale-changce-title-item" key={key}>
                        <span className="name">{item.guiderName}</span>
                        <div className="progress manager point">
                          <span style={{ width: `${percent}%` }}>
                            <b>{`${percent}%`}</b>
                          </span>
                        </div>
                        <span className="target">
                          <b>{item.doneValue}</b>
                          /{item.contentValue}
                        </span>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          }
          <div className="growth-wrapper">
            {
              type === '05' ?
                <div className="hm-growth-nav">
                  <Tabs
                    className="hm-manager-home-nav"
                  >
                    <Tabs.Item
                      title="出生"
                      navStyle="alert"
                    >
                      <div className="sale-changce-list">
                        {header}
                        {
                          isSaleChangceDetailGet && saleChangceDetail.map((item, idx) => {
                            const childkey = `key-${idx}`;
                            const percent = item.doneValue / item.contentValue * 100;
                            if (item.type === '0501') {
                              return (
                                <div className="hm-sale-changce-title-item" key={childkey}>
                                  <span className="name">{item.guiderName}</span>
                                  <div className="progress manager point">
                                    <span style={{ width: `${percent}%` }}>
                                      <b>{`${percent}%`}</b>
                                    </span>
                                  </div>
                                  <span className="target">
                                    <b>{item.doneValue}</b>
                                    /{item.contentValue}
                                  </span>
                                </div>
                              );
                            }
                            return '';
                          })
                        }
                      </div>
                    </Tabs.Item>
                    <Tabs.Item
                      title="生日"
                      navStyle="alert"
                    >
                      <div className="sale-changce-list">
                        {header}
                        {
                          isSaleChangceDetailGet && saleChangceDetail.map((item, idx) => {
                            const childkey = `key-${idx}`;
                            const percent = item.doneValue / item.contentValue * 100;
                            if (item.type === '0502') {
                              return (
                                <div className="hm-sale-changce-title-item" key={childkey}>
                                  <span className="name">{item.guiderName}</span>
                                  <div className="progress manager point">
                                    <span style={{ width: `${percent}%` }}>
                                      <b>{`${percent}%`}</b>
                                    </span>
                                  </div>
                                  <span className="target">
                                    <b>{item.doneValue}</b>
                                    /{item.contentValue}
                                  </span>
                                </div>
                              );
                            }
                            return '';
                          })
                        }
                      </div>
                    </Tabs.Item>
                    <Tabs.Item
                      title="满月"
                      navStyle="alert"
                    >
                      <div className="sale-changce-list">
                        {header}
                        {
                          isSaleChangceDetailGet && saleChangceDetail.map((item, idx) => {
                            const childkey = `key-${idx}`;
                            const percent = item.doneValue / item.contentValue * 100;
                            if (item.type === '0503') {
                              return (
                                <div className="hm-sale-changce-title-item" key={childkey}>
                                  <span className="name">{item.guiderName}</span>
                                  <div className="progress manager point">
                                    <span style={{ width: `${percent}%` }}>
                                      <b>{`${percent}%`}</b>
                                    </span>
                                  </div>
                                  <span className="target">
                                    <b>{item.doneValue}</b>
                                    /{item.contentValue}
                                  </span>
                                </div>
                              );
                            }
                            return '';
                          })
                        }
                      </div>
                    </Tabs.Item>
                    <Tabs.Item
                      title="出月子"
                      navStyle="alert"
                    >
                      <div className="sale-changce-list">
                        {header}
                        {
                          isSaleChangceDetailGet && saleChangceDetail.map((item, idx) => {
                            const childkey = `key-${idx}`;
                            const percent = item.doneValue / item.contentValue * 100;
                            if (item.type === '0504') {
                              return (
                                <div className="hm-sale-changce-title-item" key={childkey}>
                                  <span className="name">{item.guiderName}</span>
                                  <div className="progress manager point">
                                    <span style={{ width: `${percent}%` }}>
                                      <b>{`${percent}%`}</b>
                                    </span>
                                  </div>
                                  <span className="target">
                                    <b>{item.doneValue}</b>
                                    /{item.contentValue}
                                  </span>
                                </div>
                              );
                            }
                            return '';
                          })
                        }
                      </div>
                    </Tabs.Item>
                    <Tabs.Item
                      title="一百天"
                      navStyle="alert"
                    >
                      <div className="sale-changce-list">
                        {header}
                        {
                          isSaleChangceDetailGet && saleChangceDetail.map((item, idx) => {
                            const childkey = `key-${idx}`;
                            const percent = item.doneValue / item.contentValue * 100;
                            if (item.type === '0505') {
                              return (
                                <div className="hm-sale-changce-title-item" key={childkey}>
                                  <span className="name">{item.guiderName}</span>
                                  <div className="progress manager point">
                                    <span style={{ width: `${percent}%` }}>
                                      <b>{`${percent}%`}</b>
                                    </span>
                                  </div>
                                  <span className="target">
                                    <b>{item.doneValue}</b>
                                    /{item.contentValue}
                                  </span>
                                </div>
                              );
                            }
                            return '';
                          })
                        }
                      </div>
                    </Tabs.Item>
                    <Tabs.Item
                      title="一周岁"
                      navStyle="alert"
                    >
                      <div className="sale-changce-list">
                        {header}
                        {
                          isSaleChangceDetailGet && saleChangceDetail.map((item, idx) => {
                            const childkey = `key-${idx}`;
                            const percent = item.doneValue / item.contentValue * 100;
                            if (item.type === '0506') {
                              return (
                                <div className="hm-sale-changce-title-item" key={childkey}>
                                  <span className="name">{item.guiderName}</span>
                                  <div className="progress manager point">
                                    <span style={{ width: `${percent}%` }}>
                                      <b>{`${percent}%`}</b>
                                    </span>
                                  </div>
                                  <span className="target">
                                    <b>{item.doneValue}</b>
                                    /{item.contentValue}
                                  </span>
                                </div>
                              );
                            }
                            return '';
                          })
                        }
                      </div>
                    </Tabs.Item>
                  </Tabs>
                </div> :
                <div className="sale-changce-list">
                  {header}
                  {contextJSX}
                </div>
            }
          </div>
        </Container>
      </View>
    );
  }
}


StaffSaleChangce.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  saleChangceDetail: PropTypes.array.isRequired,
  isSaleChangceDetailGet: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  return {
    saleChangceDetail: stores.saleChangceDetail,
    isSaleChangceDetailGet: stores.isSaleChangceDetailGet,
  };
}

export default connect(mapStateToProps)(StaffSaleChangce);

