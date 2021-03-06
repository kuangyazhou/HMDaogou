import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {
  Container,
  View,
  Grid,
  Col,
} from 'amazeui-touch';

import { fetchStaffNewCustomer } from '../../../actions/store/staffTask';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import './todayNewCustomer.scss';

class TodayNewCustomer extends React.Component {
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
    dispatch(fetchStaffNewCustomer());
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
    const { newCustomerList } = this.props;
    const txtVal = e.target.value;
    const result = [];
    newCustomerList.forEach((item, idx) => {
      if (txtVal !== '' && (item.workNum.indexOf(txtVal) !== -1 ||
        item.name.indexOf(txtVal) !== -1
      )) {
        result.push(item);
      }
    });
    this.setState({
      result,
    });
  }

  render() {
    const { newCustomerList, isStaffNewCustomerGet } = this.props;
    return (
      <View>
        <Container className="hm-today-new-customer" scrollable>
          <div className="taskCard">
            {
              !this.state.showOrhide &&
              <DefaultHeader
                title="今日员工新客开发详情"
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
                    placeholder="可输入姓名或工号"
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
                    <span className="name">名字</span>
                    <span className="num">工号</span>
                    <span className="count">数量</span>
                  </dt>
                  {
                    this.state.result.map((item, idx) => {
                      const key = `idx-${idx}`;
                      return (
                        <dd key={key}>
                          <span className="name">{item.name}</span>
                          <span className="num">{item.workNum}</span>
                          <span className="count">{item.countvalue}</span>
                        </dd>
                      );
                    })
                  }
                </dl>
              </div>
            }
            <dl className="new-customer-list">
              <dt>
                <span className="name">名字</span>
                <span className="num">工号</span>
                <span className="count">数量</span>
              </dt>
              {
                isStaffNewCustomerGet ?
                  newCustomerList.map((item, idx) => {
                    const key = `idx-${idx}`;
                    return (
                      <dd key={key}>
                        <span className="name">{item.name}</span>
                        <span className="num">{item.workNum}</span>
                        <span className="count">{item.countvalue}</span>
                      </dd>
                    );
                  }) :
                  <dd className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</dd>
              }
            </dl>
          </div>
        </Container>
      </View>
    );
  }
}


TodayNewCustomer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isStaffNewCustomerGet: PropTypes.bool.isRequired,
  newCustomerList: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  return {
    isStaffNewCustomerGet: stores.isStaffNewCustomerGet,
    newCustomerList: stores.newCustomerList,
  };
}

export default connect(mapStateToProps)(TodayNewCustomer);

