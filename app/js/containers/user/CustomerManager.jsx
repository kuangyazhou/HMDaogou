import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
  Container,
  Grid,
  Col,
  View,
} from 'amazeui-touch';

// actions.
import { getMyMember } from '../../actions/members/myMembers';

// API Utils.
import {
  getToken,
} from '../../utils/apiUtils';

// constants.
// import {
//   CUSTOMER_FILTER,
//   CUSTOMER_FEATURE,
// } from '../../utils/constants';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../utils/domUtils';

import './customerManager.scss';

class CustomerManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { type, month } = this.props.params;
    const context = this;

    // 计算列表容器的实际高度(客户详情列表).
    // 稍微延时下执行, 等待React将数据渲染完成.
    setTimeout(() => {
      const viewportHeight = getViewportHeight();
      const header = outerHeight(document.querySelector('.hm-customer-header'));
      const menu = outerHeight(document.querySelector('.hm-customer-menu'));
      const footer = outerHeight(document.querySelector('.tabbar'));
      const customer = document.querySelector('.hm-customer-list');
      if (customer) { customer.style.height = `${viewportHeight - header - menu - footer}px`; }
    }, 0);
    // 这里需要传递月份作为参数.
    dispatch(getMyMember(month));
  }

  handleClick(e) {
    e.preventDefault();
    return false;
  }

  render() {
    const { user } = this.props;
    const { type, month } = this.props.params;
    return (
      <View>
        <Container className="ks-grid hm-customer-manager-container" scrollable>
          <header className="hm-customer-header">
            <span className="caption">{`${month}月客户详情`}</span>
          </header>
          <Grid className="hm-customer-list">
            <Col cols={6}>
              <ul className="list">
                <li className="item item-linked">
                  {/* <a href={`#/customer/list/task/monthAdd/${month}`}>*/}
                  <a href="#/customer/list/task/monthAdd">
                    <div className="item-before">
                      <span className="icon-hemiao iconfont icon-xinzeng" />
                    </div>
                    <h3 className="item-title">新增客户</h3>
                    <div className="item-after">
                      <span className="text">
                        {user.myMembers.countNew}
                      </span>
                      <i className="icon icon-right-nav" />
                    </div>
                  </a>
                </li>
                <li className="item item-linked">
                  {/* <a href={`#/customer/list/task/monthDeal/${month}`}>*/}
                  <a href="#/customer/list/task/monthDeal">
                    <div className="item-before">
                      <span className="icon-hemiao iconfont icon-chengjiao" />
                    </div>
                    <h3 className="item-title">成交客户</h3>
                    <div className="item-after">
                      <span className="text">
                        {user.myMembers.countSale}
                      </span>
                      <i className="icon icon-right-nav" />
                    </div>
                  </a>
                </li>
                <li className="item item-linked">
                  <a href="#/" onClick={this.handleClick}>
                    <div className="item-before">
                      <span className="icon-hemiao iconfont icon-shuimian" />
                    </div>
                    <h3 className="item-title">沉睡客户</h3>
                    <div className="item-after">
                      <span className="text">
                        {user.myMembers.countSleep}
                      </span>
                      <i className="icon icon-right-nav hide" />
                    </div>
                  </a>
                </li>
                <li className="item item-linked">
                  <a href="#/" onClick={this.handleClick}>
                    <div className="item-before">
                      <span className="icon-hemiao iconfont icon-liushi" />
                    </div>
                    <h3 className="item-title">流失客户</h3>
                    <div className="item-after">
                      <span className="text">
                        {user.myMembers.countFlown}
                      </span>
                      <i className="icon icon-right-nav hide" />
                    </div>
                  </a>
                </li>
                <li className="item item-linked hide">
                  <a href="#/" onClick={this.handleClick}>
                    <div className="item-before">
                      <span className="icon-hemiao iconfont icon-liulan" />
                    </div>
                    <h3 className="item-title">浏览商城客户数</h3>
                    <div className="item-after">
                      <span className="text">
                        {user.myMembers.countWebStore}
                      </span>
                      <i className="icon icon-right-nav hide" />
                    </div>
                  </a>
                </li>
                <li className="item item-linked">
                  <a href="#/" onClick={this.handleClick}>
                    <div className="item-before">
                      <span className="icon-hemiao iconfont icon-zhanbi2" />
                    </div>
                    <h3 className="item-title">消费占比</h3>
                    <div className="item-after">
                      <span className="text">
                        {user.myMembers.consumeRadio}%
                      </span>
                      <i className="icon icon-right-nav invisiable" />
                    </div>
                  </a>
                </li>
              </ul>
            </Col>
          </Grid>
        </Container>
      </View>
    );
  }
}

CustomerManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { user, auth } = state;
  if (!user) {
    // todo: 需要在此处应用应用程序缓存, 在后台数据无法获取的时候, 我们使用保存在应用缓存的数据.
    return {
      auth: { user: { name: '' } },
      user: {
        myMembers: {
          countTotal: '',
          countNew: 0,
          countSale: 0,
          countSleep: 0,
          countFlown: 0,
          countWebStore: 0,
          consumeRadio: 0,
        },
        error: null,
      },
    };
  }
  return {
    user,
    auth,
  };
}

export default connect(mapStateToProps)(CustomerManager);
