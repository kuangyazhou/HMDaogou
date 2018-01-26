/* eslint no-nested-ternary: [0]*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Notification,
  View,
  Modal,
  Tabs,
} from 'amazeui-touch';


// API Utils.
import {
  loadUserProfile,
  getToken,
  removeIdToken,
  loadIdToken,
  RESTFUL_SERVER,
  removeLoginTime,
} from '../../utils/apiUtils';

// Tabs Modules.
import StaffInfo from '../../components/hm-staff-info/StaffInfo.jsx';
import StaffSales from '../../components/hm-staff-sales/StaffSales.jsx';

// components
import HMCard from '../../components/hm-card/Card.jsx';

// action
import { fetchTotalTarget } from '../../actions/store/totalTarget';
import {
  fetchSaleDetail,
  fetchSingleSaleRank,
  fetchStaffProgressRank,
} from '../../actions/store/sales';
import { fetchLoginCount } from '../../actions/store/loginCount';
import { fetchStaffTask, fetchSaleChangce, fetchStaffNewCustomer } from '../../actions/store/staffTask';

// Assets.
import '../home/home.scss';
import './managerHome.scss';

class ManagerHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabKey: 0,
      isErrorHappend: false,
      isAlertOpen: false,
      isShowModal: false,
    };
    this.stateMapping = {
      staffSales: 0,
      staffInfo: 1,
    };
    this.changeTab = this.changeTab.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.logout = this.logout.bind(this);
    this.handleEXchange = this.handleEXchange.bind(this);
    this.handleToOtherPage = this.handleToOtherPage.bind(this);
    this.disabledLink = this.disabledLink.bind(this);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    const targetModule = params.type;
    if (targetModule === undefined || targetModule === 'staffSales') {
      dispatch(fetchTotalTarget());
      dispatch(fetchSaleDetail());
      dispatch(fetchSingleSaleRank());
    } else {
      dispatch(fetchLoginCount());
      // dispatch(fetchStaffTask());
      dispatch(fetchSaleChangce());
      dispatch(fetchStaffProgressRank());
      dispatch(fetchStaffNewCustomer());
    }
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'deal') {
        navList[i].addEventListener('click', this.handleToOtherPage);
      }
    }
  }

  componentWillUnmount() {
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'deal') {
        navList[i].removeEventListener('click', this.handleToOtherPage);
      }
    }
  }

  changeTab(key) {
    const { dispatch } = this.props;
    const { params } = this.props;
    const { history } = this.props;
    switch (key) {
      case 0:
        history.push('/managerHome/staffSales');
        break;
      case 1:
        history.push('/managerHome/staffInfo');
        break;
      default:
        break;
    }
  }

  disabledLink(e) {
    e.preventDefault();
  }

  handleEXchange(e) {
    e.preventDefault();
    const { history } = this.props;
    const { position } = loadIdToken();
    if (position === '2') {
      history.push('/supervisor');
    } else {
      history.push('/home');
    }
    sessionStorage.setItem('userType', '导购');
  }


  logout(result) {
    this.setState({
      isAlertOpen: false,
    });
    if (result) {
      removeIdToken();
      removeLoginTime();
      window.location.reload(true);
    }
  }

  handleToOtherPage(e) {
    this.setState({
      isShowModal: true,
    });
  }

  handleLogout(e) {
    e.preventDefault();
    this.setState({
      isAlertOpen: true,
    });
  }

  renderLogoutAlert() {
    return (
      <Modal
        className="hm-modal-logout manager"
        title="温馨提示"
        role="confirm"
        closeViaBackdrop
        onAction={this.logout}
        isOpen={this.state.isAlertOpen}
        onDismiss={this.closeModal}
      >
        <p>是否退出登录？</p>
      </Modal>
    );
  }

  render() {
    const { params } = this.props;
    const { storeName } = params;
    const { position, userName } = loadIdToken();
    if (storeName) {
      sessionStorage.setItem('storeName', params.storeName);
    } else if (!storeName && position !== '2' && sessionStorage.getItem('storeName')) {
      sessionStorage.removeItem('storeName');
    }
    const storeOutletName = sessionStorage.getItem('storeName') || loadIdToken().storeOutletName;
    // 取得缓存中的用户上下文信息.
    /* eslint max-len: [0] */
    return (
      <View>
        {this.renderLogoutAlert(this.state.isAlertOpen)}
        <Container scrollable className="ks-grid hm-manager-home-container">
          {
            this.state.isShowModal &&
            <div className="loading-modal">
              <i className="iconfont icon-jiazai hm-pulse hm-loading" />
            </div>
          }
          <Notification
            title="请稍后再来!"
            amStyle="alert"
            visible={this.state.isErrorHappend}
            animated
            onDismiss={this.closeNotification}
          >
            服务器正在卖力处理中
          </Notification>
          <header className="hm-manager-home-header">
            <div>
              <i className="iconfont icon-dianchangdaix" />
              <span>店长</span>
            </div>
            <div>
              <span>{storeOutletName}</span>
            </div>
            <a href="#/" onClick={this.handleEXchange}>
              <i className="iconfont icon-qiehuan" />
              <span>切换</span>
            </a>
          </header>
          <div className="hm-manager-home-main">
            <Tabs
              activeKey={this.stateMapping[params.type]}
              onAction={this.changeTab}
              className="hm-manager-home-nav"
            >
              <Tabs.Item
                title="销售相关"
                navStyle="alert"
              >
                <StaffSales />
              </Tabs.Item>
              <Tabs.Item
                title="人员相关"
                navStyle="alert"
              >
                <StaffInfo />
              </Tabs.Item>
            </Tabs>
          </div>
        </Container>
      </View>
    );
  }
}

ManagerHome.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
}

export default connect(mapStateToProps)(ManagerHome);
