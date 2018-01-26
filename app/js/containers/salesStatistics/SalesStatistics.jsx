/* eslint no-nested-ternary: [0]*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Notification,
  View,
  Tabs,
} from 'amazeui-touch';

// API Utils.
import { loadUserProfile, getToken } from '../../utils/apiUtils';

// Tabs Modules.
import GuideSale from '../../components/hm-guide-sale/GuideSale.jsx';
import CommoditySale from '../../components/hm-commodity-sale/CommoditySale.jsx';
import DefaultHeader from '../../components/hm-default-header/DefaultHeader.jsx';

// components
import HMCard from '../../components/hm-card/Card.jsx';

// actions
import {
  fetchSaleRank,
  fetchWeekAverage,
  fetchMonthSingleSaleRank,
} from '../../actions/store/sales';
import { fetchMonthTotalTarget, fetchMonthSaleTime } from '../../actions/store/totalTarget';
import { fetchMainBrand } from '../../actions/store/mainBrand';
// Assets.
import '../home/home.scss';
import './salesStatistics.scss';

class SalesStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabKey: 0,
      isErrorHappend: false,
      isAlertOpen: false,
      isShowModal: false,
    };
    this.stateMapping = {
      guideSale: 0,
      commoditySale: 1,
    };
    this.changeTab = this.changeTab.bind(this);
    this.handleToOtherPage = this.handleToOtherPage.bind(this);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    const targetModule = params.type;
    if (targetModule === undefined || targetModule === 'guideSale') {
      dispatch(fetchSaleRank());
      dispatch(fetchMonthTotalTarget());
      dispatch(fetchMonthSaleTime());
      dispatch(fetchWeekAverage());
    } else {
      dispatch(fetchMainBrand());
      dispatch(fetchMonthSingleSaleRank());
    }
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'sale') {
        navList[i].addEventListener('click', this.handleToOtherPage);
      }
    }
  }

  componentWillUnmount() {
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'sale') {
        navList[i].removeEventListener('click', this.handleToOtherPage);
      }
    }
  }

  handleToOtherPage(e) {
    this.setState({
      isShowModal: true,
    });
  }

  changeTab(key) {
    const { dispatch } = this.props;
    const { params } = this.props;
    const { history } = this.props;
    switch (key) {
      case 0:
        history.push('/salesStatistics/guideSale');
        break;
      case 1:
        history.push('/salesStatistics/commoditySale');
        break;
      default:
        break;
    }
  }

  render() {
    const { auth, user, params } = this.props;
    return (
      <View>
        <Container scrollable className="ks-grid hm-sales-statistics-container">
          <Notification
            title="请稍后再来!"
            amStyle="alert"
            visible={this.state.isErrorHappend}
            animated
            onDismiss={this.closeNotification}
          >
            服务器正在卖力处理中
          </Notification>
          <DefaultHeader
            title="销售统计"
            type="normal"
            mode
          />
          {
            this.state.isShowModal &&
            <div className="loading-modal">
              <i className="iconfont icon-jiazai hm-pulse hm-loading" />
            </div>
          }
          <div className="hm-sale-main">
            <Tabs
              activeKey={this.stateMapping[params.type]}
              onAction={this.changeTab}
              className="hm-sale-statistics-nav"
            >
              <Tabs.Item
                title="员工销售"
                navStyle="alert"
              >
                <GuideSale />
              </Tabs.Item>
              <Tabs.Item
                title="商品销售"
                navStyle="alert"
              >
                <CommoditySale />
              </Tabs.Item>
            </Tabs>
          </div>
        </Container>
      </View>
    );
  }
}

SalesStatistics.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { user, auth } = state;
  if (!user) {
    // todo: 需要在此处应用应用程序缓存, 在后台数据无法获取的时候, 我们使用保存在应用缓存的数据.
    return {
      auth: { user: { name: '' } },
      user: {
        storeAllNoteList: [],
        storeAllNotePager: {},
      },
    };
  }
  return {
    user,
    auth,
  };
}

export default connect(mapStateToProps)(SalesStatistics);
