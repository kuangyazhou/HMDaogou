import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {
  Container,
  View,
  Grid,
  Col,
} from 'amazeui-touch';

import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import {
  fetchStaffMonthNewCustomer,
} from '../../../actions/store/staffTask';

import './monthNewCustomer.scss';

class MonthNewCustomer extends React.Component {
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
    dispatch(fetchStaffMonthNewCustomer(1));
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
    const { developCustomerList } = this.props;
    const txtVal = e.target.value;
    const result = [];
    developCustomerList.forEach((item, idx) => {
      if (txtVal !== '' && item.target.indexOf(txtVal) !== -1) {
        result.push(item);
      }
    });
    this.setState({
      result,
    });
  }

  render() {
    const { developCustomerList, isStaffMonthNewCustomerGet } = this.props;
    let iconContent;
    return (
      <View>
        <Container className="hm-today-new-customer" scrollable>
          <div className="taskCard">
            {
              !this.state.showOrhide &&
              <DefaultHeader
                title="本月员工新客开发详情"
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
                <dl className="new-customer-list">
                  <dt>
                    <span className="name">姓名</span>
                    <span className="point">进度</span>
                    <span className="count">已开发/目标</span>
                  </dt>
                  {
                    this.state.result.map((item, idx) => {
                      const key = `idx-${idx}`;
                      return (
                        <dd key={key}>
                          <span className="name">{item.target}</span>
                          <div className="point">
                            <div className="progress manager">
                              <span style={{ width: `${item.completePerformanceAsRadio}` }}>
                                <b>{item.completePerformanceAsRadio}</b>
                              </span>
                            </div>
                          </div>
                          <span className="count">{item.completePerformance}/{item.points}</span>
                        </dd>
                      );
                    })
                  }
                </dl>
              </div>
            }
            <dl className="new-customer-list">
              <dt>
                <span className="rank">排名</span>
                <span className="name">姓名</span>
                <span className="point">进度</span>
                <span className="count">已开发/目标</span>
              </dt>
              {
                !isStaffMonthNewCustomerGet ?
                  <dd className="hm-loading-wrapper">
                    <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                  </dd> : (
                    developCustomerList.length > 0 ?
                      developCustomerList.map((item, idx) => {
                        const key = `idx-${idx}`;
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
                          <dd key={key}>
                            <span className="rank">{iconContent}</span>
                            <span className="name">{item.target}</span>
                            <div className="point">
                              <div className="progress manager">
                                <span style={{ width: `${item.completePerformanceAsRadio}` }}>
                                  <b>{item.completePerformanceAsRadio}</b>
                                </span>
                              </div>
                            </div>
                            <span className="count">{item.completePerformance}/{item.points}</span>
                          </dd>
                        );
                      }) :
                      <dd className="hm-null">
                        <i className="iconfont icon-meiyouxiaoxi" />
                        还没有数据
                      </dd>)
              }
            </dl>
          </div>
        </Container>
      </View>
    );
  }
}


MonthNewCustomer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isStaffMonthNewCustomerGet: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  developCustomerList: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  return {
    isStaffMonthNewCustomerGet: stores.isStaffMonthNewCustomerGet,
    developCustomerList: stores.developCustomerList,
  };
}

export default connect(mapStateToProps)(MonthNewCustomer);

