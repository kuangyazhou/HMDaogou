/* eslint prefer-arrow-callback: ["error", { "allowNamedFunctions": true }] */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';
import {
  Grid,
  Col,
  Card,
  List,
  View,
  Container,
  Notification,
} from 'amazeui-touch';
import moment from 'moment';

import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import { sortObj } from '../../../utils/apiUtils.js';

import {
  fetchOrders,
} from '../../../actions/customers/orders.js';

import './order.scss';

class HMOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      showOrHide: false,
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.openSearchInput = this.openSearchInput.bind(this);
    this.cancleSearch = this.cancleSearch.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { params } = this.props;
    dispatch(fetchOrders(params.memberId));
  }

  handleSearch(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    const { params } = this.props;
    const queryStr = this.queryStr.value;
    dispatch(fetchOrders(params.memberId, queryStr));
  }

  openSearchInput() {
    this.setState({
      showOrHide: !this.state.showOrHide,
    });
    setTimeout(() => {
      this.queryStr.focus();
    }, 0);
  }

  cancleSearch() {
    this.openSearchInput();
    this.queryStr.blur();
  }

  renderCardHeader(order) {
    return (
      <div className="hm-order-header">
        <div className="hm-order-number">
          <span>订单号:</span>
          <span>{order.orderId}</span>
        </div>
        <div className="hm-order-date">
          <span>时间:</span>
          <span>{moment(order.addTime).format('YYYY-MM-DD')}</span>
        </div>
      </div>
    );
  }

  renderCardFooter(order, orderTotalCounts) {
    return (
      <div className="hm-order-footer">
        <div className="hm-order-status">交易成功</div>
        <div className="hm-order-details">
          共<span className="hm-order-total">{orderTotalCounts}</span>件商品
          合计:&nbsp;<span className="hm-order-total-amount">{order.totPrice}</span>元
        </div>
      </div>
    );
  }

  // 每件商品的小计金额
  renderProductAmount(item) {
    return (
      <div className="hm-order-product-amount">
        <h3>￥&nbsp;{item.shopPrice}</h3>
        <h3>X{item.goodsNumber}</h3>
      </div>
    );
  }

  // 渲染商品的图片
  renderProductImg(item) {
    return (
      <i className="iconfont icon-tupian" />
    );
  }

  render() {
    const { error } = this.props;
    const { orders } = this.props;
    sortObj(orders, 'addTime', 'down');
    return (
      <View className="hm-orders-container">
        <Notification
          title="请稍后再来!"
          amStyle="alert"
          visible={this.state.isErrorHappend}
          animated
          onDismiss={this.closeNotification}
        >
          服务器正卖力处理中
          {/* {error && error.message}.*/}
        </Notification>
        {
          !this.state.showOrHide &&
          <DefaultHeader
            title="订单"
            history={this.props.history}
            type="special"
            openSearchInput={this.openSearchInput}
          />
        }
        {
          this.state.showOrHide &&
          <div className="hm-orders-header">
            <form action="post" onSubmit={this.handleSearch}>
              <Grid>
                <Col cols={5} className="search">
                  <input
                    id="hm_orders_search_input"
                    type="text"
                    name="q"
                    ref={(c) => { this.queryStr = c; }}
                    required
                    placeholder="可输入订单号"
                  />
                  <span
                    id="hm_orders_search_button"
                    className="icon icon-search"
                    onClick={this.handleSearch}
                  />
                </Col>
                <Col cols={1}>
                  <span className="cancle" onClick={this.cancleSearch}>取消</span>
                </Col>
              </Grid>
            </form>
          </div>
        }
        <Container scrollable className="hm-order-grid ks-grid">
          <If condition={orders.length > 0}>
            <Then>
              <div>
                {orders.map((order, idx) => {
                  const key = `order-${idx}-${order.orderId}`;
                  let orderTotalCounts = 0;
                  order.orderDetailOfflineList.forEach((cOrder) => {
                    orderTotalCounts += cOrder.goodsNumber;
                  });
                  return (
                    <Card
                      key={key}
                      className="hm-orders-card"
                      header={this.renderCardHeader(order)}
                      footer={this.renderCardFooter(order, orderTotalCounts)}
                    >
                      <List inset>
                        {order.orderDetailOfflineList.map((item, pidx) => {
                          const pKey = `product-${pidx}-${item.goodsSn}`;
                          return (
                            <List.Item
                              key={pKey}
                              title={item.goodsName || '无产品名'}
                              after={this.renderProductAmount(item)}
                              media={this.renderProductImg(item)}
                            />
                          );
                        })}
                      </List>
                    </Card>
                  );
                })}
              </div>
            </Then>
            <Else>
              <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />用户暂时没有订单</p>
            </Else>
          </If>
        </Container>
      </View>
    );
  }
}

HMOrders.propTypes = {
  error: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  orders: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  if (state.ordersByCustomerOldId && state.ordersByCustomerOldId.orders) {
    return {
      error: {},
      orders: state.ordersByCustomerOldId.orders,
    };
  }
  if (state.error) {
    return {
      error: state.error,
    };
  }
  return {
    orders: [],
    error: {},
  };
}

export default connect(mapStateToProps)(HMOrders);
