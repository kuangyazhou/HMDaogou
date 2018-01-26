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
import StoreSale from '../../components/hm-store-sale/StoreSale.jsx';
import StoreCare from '../../components/hm-store-care/StoreCare.jsx';

// acitons
import {
  fetchMainMonetaryLevel,
  fetchPhysiologicalAxis,
  fetchStoreDealDetail,
  fetchContactCustomerPercent,
  fetchCustomerCareDeal,
} from '../../actions/store/client.js';

import DefaultHeader from '../../components/hm-default-header/DefaultHeader.jsx';

import {
  fetchMonthStaffTask,
  fetchStaffMonthNewCustomer,
  fetchMonthSaleChangce,
  fetchStaffMonthContact,
} from '../../actions/store/staffTask';

// components
import HMCard from '../../components/hm-card/Card.jsx';

import './customerCare.scss';

class CustomerCare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabKey: 0,
      isErrorHappend: false,
      isAlertOpen: false,
      isShowModal: false,
    };
    this.stateMapping = {
      storeSale: 0,
      storeCare: 1,
    };
    this.changeTab = this.changeTab.bind(this);
    this.handleToOtherPage = this.handleToOtherPage.bind(this);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    const targetModule = params.type;
    if (targetModule === undefined || targetModule === 'storeSale') {
      dispatch(fetchMainMonetaryLevel());
      dispatch(fetchPhysiologicalAxis());
      dispatch(fetchStoreDealDetail());
      dispatch(fetchStaffMonthNewCustomer(0));
    } else {
      dispatch(fetchMonthStaffTask(0));
      // dispatch(fetchCustomerCareCount());
      dispatch(fetchMonthSaleChangce());
      dispatch(fetchCustomerCareDeal(0));
      dispatch(fetchStaffMonthContact());
    }
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'care') {
        navList[i].addEventListener('click', this.handleToOtherPage);
      }
    }
  }

  componentWillUnmount() {
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'care') {
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
        history.push('/customerCare/storeSale');
        break;
      case 1:
        history.push('/customerCare/storeCare');
        break;
      default:
        break;
    }
  }

  render() {
    const { auth, user, params } = this.props;
    return (
      <View>
        <Container scrollable className="ks-grid hm-customer-care-container">
          <Notification
            title="请稍后再来!"
            amStyle="alert"
            visible={this.state.isErrorHappend}
            animated
            onDismiss={this.closeNotification}
          >
            服务器正卖力处理中
            {/* {user.error && user.error.message}.*/}
          </Notification>
          {
            this.state.isShowModal &&
            <div className="loading-modal">
              <i className="iconfont icon-jiazai hm-pulse hm-loading" />
            </div>
          }
          <DefaultHeader title="客户维护" type="normal" mode />
          <div className="hm-customer-care-main">
            <Tabs
              activeKey={this.stateMapping[params.type]}
              onAction={this.changeTab}
              className="hm-sale-statistics-nav"
            >
              <Tabs.Item
                title="交易客户"
                navStyle="alert"
              >
                <StoreSale />
              </Tabs.Item>
              <Tabs.Item
                title="维护客户"
                navStyle="alert"
              >
                <StoreCare />
              </Tabs.Item>
            </Tabs>
          </div>
        </Container>
      </View>
    );
  }
}

CustomerCare.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
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

export default connect(mapStateToProps)(CustomerCare);
