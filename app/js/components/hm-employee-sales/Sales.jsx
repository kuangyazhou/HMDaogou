
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import {
  Container,
  Grid,
  Col,
  View,
} from 'amazeui-touch';

import DefaultHeader from '../../components/hm-default-header/DefaultHeader.jsx';

import {
  loadIdToken,
} from '../../utils/apiUtils';

import { fetchStoreSales } from '../../actions/store/sales';

import './sales.scss';

class Sales extends React.Component {
  constructor(props) {
    super(props);
    this.roleMapping = {
      manager: 1, // 管理
      user: 1, // 导购
    };
    this.state = {
      isErrorHappend: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // const height = getViewportHeight();
    // const navHeight = outerHeight(document.querySelector('.tabs-nav'));
    // const menuHeight = outerHeight(document.querySelector('.hm-sales-menu'));
    // const tabBarHeight = outerHeight(document.querySelector('.tabbar'));
    // document.querySelector('.hm-store-sale-tab').style.height =
    //   `${height - navHeight - tabBarHeight}px`;
    dispatch(fetchStoreSales());
  }

  render() {
    const { isSalesPagerGet, pager, userSales } = this.props.staffSaleRank;
    let contextJSX;
    if (isSalesPagerGet) {
      if (userSales.length > 0) {
        contextJSX = userSales.map((sale, sidx) => {
          const reactKey = `sale-${sidx}`;
          const profile = loadIdToken();
          const userId = profile.userId;
          let personalTotalSales;
          if (pager.showDetail === '1') {
            personalTotalSales =
              `￥${parseInt(sale.completePerformanceAsMoney, 10).toLocaleString()}`;
          } else if (pager && pager.showDetail === '0') {
            if (userId === sale.targetUser) {
              personalTotalSales =
                `￥${parseInt(sale.completePerformanceAsMoney, 10).toLocaleString()}`;
            } else {
              personalTotalSales = '无权限查看';
            }
          }
          return (
            <li id={`hm_sales_detail_${sidx}`} className="item item-content" key={reactKey}>
              <div className="item-main">
                <div className="item-title-row">
                  <div className="item-title">
                    <h3 className="hm-grade-customer-name">
                      {sale.target}
                    </h3>
                  </div>
                  <div className="item-after">
                    完成:
                    <span className="percent-txt">
                      {sale.completePerformanceAsRadio}
                    </span>
                  </div>
                </div>
                <div className="item-subtitle">
                  销售额：
                  <span className="sale-money-txt">
                    {personalTotalSales}
                  </span>
                </div>
              </div>
            </li>
          );
        });
      } else {
        contextJSX = (
          <li className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</li>
        );
      }
    } else {
      contextJSX = (<div className="hm-loading-wrapper">
        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
      </div>);
    }
    return (
      <View className="hm-sales-container">
        <Container scrollable className="ks-grid hm-sales-list-container">
          <DefaultHeader title="员工排行" history={this.props.history} />
          <ul className="list list-inset hm-sales-list">
            {contextJSX}
          </ul>
        </Container>
      </View>
    );
  }
}

Sales.propTypes = {
  staffSaleRank: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  isSalesPagerGet: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { staffSaleRank } = state;
  if (!staffSaleRank) {
    return {
      staffSaleRank: {
        isSalesPagerGet: false,
        userSales: [],
        monthOfflineOrderSale: {},
      },
    };
  }
  return {
    staffSaleRank,
  };
}

export default connect(mapStateToProps)(Sales);
