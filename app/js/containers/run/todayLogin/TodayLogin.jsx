import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
// import moment from 'moment';
import {
  Container,
  View,
  Tabs,
  Grid,
  Col,
} from 'amazeui-touch';

import { fetchLoginCount } from '../../../actions/store/loginCount';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';
import './todayLogin.scss';

class TodayLogin extends React.Component {
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
    dispatch(fetchLoginCount());
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
    const { login, noLogin } = this.props;
    const txtVal = e.target.value;
    const result = [];
    login.forEach((item, idx) => {
      if (txtVal !== '' && (
        item.name.indexOf(txtVal) !== -1 || item.workNum.indexOf(txtVal) !== -1
      )) {
        result.push(item);
      }
    });
    noLogin.forEach((item, idx) => {
      if (txtVal !== '' && (
        item.name.indexOf(txtVal) !== -1 || item.workNum.indexOf(txtVal) !== -1
      )) {
        result.push(item);
      }
    });
    this.setState({
      result,
    });
  }

  render() {
    const { login, noLogin } = this.props;
    return (
      <View>
        <Container className="hm-todayLogin" scrollable>
          {
            !this.state.showOrhide &&
            <DefaultHeader
              title="今日登录员工人数详情"
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
              <dl className="notLogin">
                <dt>
                  <span>名字</span>
                  <span>工号</span>
                  <span>登录次数</span>
                  <span>最后登录时间</span>
                </dt>
                {
                  this.state.result.map((item, idx) => {
                    const key = `idx-${idx}`;
                    return (
                      <dd key={key}>
                        <span>{item.name}</span>
                        <span>{item.workNum || '无'}</span>
                        <span>{item.count || '无'}</span>
                        <span>{item.lastLoginTime2 || '无'}</span>
                      </dd>
                    );
                  })
                }
              </dl>
            </div>
          }
          <Tabs
            className="hm-customer-care-nav"
          >
            <Tabs.Item
              title={`未登录${noLogin && noLogin.length}人`}
              navStyle="alert"
            >
              <dl className="notLogin">
                <dt>
                  <span>名字</span>
                  <span>工号</span>
                </dt>
                {
                  noLogin && noLogin.length > 0 ? noLogin.map((item, idx) => {
                    const key = `idx-${idx}`;
                    return (
                      <dd key={key}>
                        <span>{item.name}</span>
                        <span>{item.workNum}</span>
                      </dd>
                    );
                  })
                    : <dd className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</dd>
                }
              </dl>
            </Tabs.Item>
            <Tabs.Item
              title={`已登录${login && login.length}人`}
              navStyle="alert"
            >
              <dl className="hasLogin">
                <dt>
                  <span>名字</span>
                  <span>工号</span>
                  <span>登录次数</span>
                  <span>最后登录时间</span>
                </dt>
                {
                  login && login.length > 0 ? login.map((item, idx) => {
                    const key = `idx-${idx}`;
                    return (
                      <dd key={key}>
                        <span>{item.name}</span>
                        <span>{item.workNum}</span>
                        <span>{item.count}</span>
                        <span>{item.lastLoginTime2}</span>
                      </dd>
                    );
                  })
                    : <dd className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</dd>
                }
              </dl>
            </Tabs.Item>
          </Tabs>
        </Container>
      </View>
    );
  }
}

TodayLogin.propTypes = {
  dispatch: PropTypes.func.isRequired,
  login: PropTypes.array.isRequired,
  noLogin: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  const { stores } = state;

  return {
    login: stores.stores.login,
    noLogin: stores.stores.noLogin,
  };
}

export default connect(mapStateToProps)(TodayLogin);

