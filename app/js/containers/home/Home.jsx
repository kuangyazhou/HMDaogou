/* eslint no-nested-ternary: [0]*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { indexOf, lastIndexOf } from 'lodash';
import { If } from 'react-if';
import moment from 'moment';
import {
  Container,
  Grid,
  Col,
  Badge,
  Notification,
  View,
  Modal,
  List,
  Icon,
  Accordion,
} from 'amazeui-touch';

// API Utils.
import {
  loadUserProfile,
  getToken,
  loadIdToken,
  removeIdToken,
  setLoginTime,
  getLoginTime,
  RESTFUL_SERVER,
  removeLoginTime,
  getIsToday,
  setIsToday,
} from '../../utils/apiUtils';


import { checkLogin } from '../../actions/auth';

// Actions.
import { getAllStoreNotes } from '../../actions/users/storeNote';
import { getQCodeImgUrl } from '../../actions/users/qCode';
import { getMonthSale } from '../../actions/users/monthSale';
import { getCurrentMongthPerformance } from '../../actions/users/performance';
// import { fetchGroupTasks } from '../../actions/users/allTask';
import { getIndexActivity } from '../../actions/users/currentActivity';
import { fetchCurrentDayTarget } from '../../actions/users/currentDayTask';
import { fetchNotice } from '../../actions/users/notice';
import { fetchCustomerDayTaskType } from '../../actions/customers/taskType';

// components
import HMCard from '../../components/hm-card/Card.jsx';

// Assets.
import './home.scss';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      isModalOpen: false,
      isNoticeOpen: false,
      isActivityOpen: false,
      isSucceed: false,
      isAlertOpen: false,
      isShowModal: false,
      isNoticeModalOpen: false,
      isShowTodaySale: false,
      isShowMonthSale: false,
      isShowVerse: false,
      selectedAlert: {
        title: '',
        content: '',
        createDate: '',
      },
      activityAlert: {
        title: '',
        content: '',
        createDate: '',
      },
    };
    this.closeNotification = this.closeNotification.bind(this);
    this.handlePopupQCode = this.handlePopupQCode.bind(this);
    this.closeQCodeModal = this.closeQCodeModal.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.handleEntryClick = this.handleEntryClick.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.logout = this.logout.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleEXchange = this.handleEXchange.bind(this);
    this.noticeModal = this.noticeModal.bind(this);
    this.toSearch = this.toSearch.bind(this);
    this.handleToOtherPage = this.handleToOtherPage.bind(this);
    this.handleShowTodaySale = this.handleShowTodaySale.bind(this);
    this.handleShowMonthSale = this.handleShowMonthSale.bind(this);
    this.handleCloseVerse = this.handleCloseVerse.bind(this);
  }

  componentDidMount() {
    const { dispatch, params, auth } = this.props;
    const userToken = getToken();
    dispatch(getAllStoreNotes());
    dispatch(getMonthSale());
    dispatch(fetchCurrentDayTarget());
    dispatch(getIndexActivity());
    dispatch(fetchNotice());
    dispatch(fetchCustomerDayTaskType());
    // 获得用户二维码的URL地址, 这个延时大约200MS执行,
    // 前面已经执行大约5个请求.
    setTimeout(() => {
      const xhr = new XMLHttpRequest();
      dispatch(getQCodeImgUrl());
      // dispatch(getCurrentMongthPerformance());
    }, 200);
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'today') {
        navList[i].addEventListener('click', this.handleToOtherPage);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user } = this.props;
    const isNoticeGet = user.isNoticeGet;
    const notice = user.noticeList.store.notice;
    if (nextProps.user.error) {
      this.setState({
        isErrorHappend: true,
      });
    }
    const time = getLoginTime();
    // 统计登录次数 关闭浏览器重新统计
    if (!time) {
      checkLogin();
      setLoginTime(0);
    }
    // 弹出公告和鼓励语 一天弹出一次
    const isToday = getIsToday();
    if (!isToday && isNoticeGet) {
      this.setState({
        isNoticeModalOpen: true,
        isShowVerse: true,
      });
      setIsToday(moment().format('YYYY-MM-DD'));
    }
  }

  componentWillUnmount() {
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'today') {
        navList[i].removeEventListener('click', this.handleToOtherPage);
      }
    }
  }

  onClose() {
    this.setState({
      isNoticeOpen: false,
      isActivityOpen: false,
      isNoticeModalOpen: false,
    });
  }

  handleShowTodaySale(e) {
    e.preventDefault();
    this.setState({
      isShowTodaySale: !this.state.isShowTodaySale,
    });
  }

  handleShowMonthSale(e) {
    e.preventDefault();
    this.setState({
      isShowMonthSale: !this.state.isShowMonthSale,
    });
  }

  handleItemClick(alertData) {
    this.setState({
      selectedAlert: alertData,
      isNoticeOpen: true,
    });
  }

  handleToOtherPage(e) {
    this.setState({
      isShowModal: true,
    });
  }

  handleCloseVerse() {
    this.setState({
      isShowVerse: false,
    });
  }

  logout(result) {
    const { router } = this.context;
    this.setState({
      isAlertOpen: false,
    });
    if (result) {
      removeIdToken();
      removeLoginTime();
      localStorage.removeItem('user_time_out');
      window.location.reload(true);
    }
  }

  handleLogout(e) {
    e.preventDefault();
    this.setState({
      isAlertOpen: true,
    });
  }

  handleEXchange(e) {
    e.preventDefault();
    const { history } = this.props;
    history.push('/managerHome');
    sessionStorage.setItem('userType', '店长');
  }

  toSearch() {
    const { history } = this.props;
    // history.push('/customer/list');
    this.setState({
      isShowModal: true,
    });
  }

  createModal(alertData) {
    return (
      <Modal
        role="alert"
        title="门店通知"
        ref={modal => (this.modal = modal)}
        isOpen={this.state.isNoticeOpen}
        closeViaBackdrop
        id="hm_home_store_notification_modal"
        onDismiss={this.onClose}
      >
        <Grid collapse align="between" className="hm-alert-grid">
          <Col cols={2} className="hm-alert-label">通知标题: </Col>
          <Col cols={4} className="hm-alert-content">{alertData.title}</Col>
        </Grid>
        <Grid collapse align="between" className="hm-alert-grid">
          <Col cols={2} className="hm-alert-label">通知: </Col>
          <Col cols={4} className="hm-alert-content">{alertData.content}</Col>
        </Grid>
        <Grid collapse align="between" className="hm-alert-grid">
          <Col cols={2} className="hm-alert-label">发布日期: </Col>
          <Col cols={4} className="hm-alert-content">
            {moment(alertData.createDate).format('YYYY年MM月DD号')}
          </Col>
        </Grid>
      </Modal>
    );
  }

  handleEntryClick(alertData) {
    this.setState({
      activityAlert: alertData,
      isActivityOpen: true,
    });
  }

  activityModal(alertData) {
    return (
      <Modal
        role="alert"
        title="促销活动"
        ref={modal => (this.modal = modal)}
        isOpen={this.state.isActivityOpen}
        onDismiss={this.onClose}
        id="hm_home_activity_modal"
        className="hm_home_activity_modal"
        closeViaBackdrop
      >
        <Grid collapse align="between" className="hm-alert-grid">
          <Col cols={2} className="hm-alert-label">活动标题: </Col>
          <Col cols={4} className="hm-alert-content">{decodeURIComponent(alertData.actName).replace(/\+/g, ' ')}</Col>
        </Grid>
        <Grid collapse align="between" className="hm-alert-grid">
          <Col cols={2} className="hm-alert-label">活动日期: </Col>
          <Col cols={4} className="hm-alert-content">
            {`${alertData.startDateAsString} 至 ${alertData.endDateAsString}`}
          </Col>
        </Grid>
        <Grid collapse align="between" className="hm-alert-grid">
          <Col cols={2} className="hm-alert-label">
            {
              decodeURIComponent(alertData.actDesc).replace(/\+/g, ' ') && '活动:'
            }
          </Col>
          <Col cols={4} className="hm-alert-content">
            <span>{decodeURIComponent(alertData.actDesc).replace(/\+/g, ' ')}</span>
          </Col>
        </Grid>
      </Modal>
    );
  }

  handlePopupQCode(e) {
    e.preventDefault();
    this.setState({
      isModalOpen: true,
    });
  }

  closeQCodeModal(e) {
    this.setState({
      isModalOpen: false,
    });
  }

  closeNotification(e) {
    e.preventDefault();
    this.setState({
      isErrorHappend: false,
    });
  }

  handleMore(e) {
    e.preventDefault();
  }


  closeModal() {
    this.setState({
      isAlertOpen: false,
    });
  }


  noticeModal(noticeList) {
    const notice = decodeURIComponent(noticeList.store.notice).replace(/\+/ig, ' ');
    if (this.notice) {
      this.notice.innerHTML = notice;
    }
    return (
      <Modal
        role="alert"
        title="公告"
        /* title={title}*/
        isOpen={this.state.isNoticeModalOpen}
        closeViaBackdrop
        id="hm_home_notice_modal"
        onDismiss={this.onClose}
      >
        <div className="hm-notice" ref={c => (this.notice = c)} />
      </Modal>
    );
  }

  renderTodayTarget(amount) {
    const groupTask = (amount * 100).toFixed();
    return (
      <span className="hm-today-tips">
        完成进度: <span className="text-red">{groupTask}%</span>
      </span>
    );
  }

  renderLogoutAlert() {
    return (
      <Modal
        className="hm-modal-logout"
        title="温馨提示"
        role="confirm"
        closeViaBackdrop
        id="hm_home_logout_modal"
        onAction={this.logout}
        isOpen={this.state.isAlertOpen}
        onDismiss={this.closeModal}
      >
        <p>是否退出登录？</p>
      </Modal>
    );
  }

  // 渲染时间轴
  renderTimeLine(currentDayWorkTime) {
    const { user } = this.props;
    const targetHour = parseInt(user.currentDayTarget.currentDayTaskBeginTime, 0);
    const workHours = currentDayWorkTime || 0;
    const result = [];
    if (workHours) {
      for (let i = 1; workHours >= i; i++) {
        const key = `workHours-${i}`;
        if (targetHour > 0 && targetHour === i) {
          result.push((
            <li key={key}>
              <i className="active" />
              <span>{i}</span>
            </li>
          ));
        } else if (targetHour > 0 && targetHour > i) {
          result.push((
            <li key={key} className="active">
              <i className="active" />
              <span>{i}</span>
            </li>
          ));
        } else {
          result.push((
            <li key={key} ><i /><span>{i}</span></li>
          ));
        }
      }
    }
    return result;
  }

  renderDateAndIcon(active) {
    return (
      <div>
        <span>{`${active.startDateAsString} 至 ${active.endDateAsString}`}</span>
        <span>
          {
            active.isOffline === 0 ?
              <span style={{ color: '#ff474c' }}>线上活动</span> :
              <span>线下活动</span>
          }
        </span>
      </div>
    );
  }


  render() {
    const { auth, user } = this.props;
    const { undo } = user.myTasks;
    // 获得用户的Token.
    const userToken = getToken();
    // 取得缓存中的用户上下文信息.
    if (!auth.user) { auth.user = loadUserProfile(); }
    const list = user.currentDayTarget.pageItems;
    // 临时的绑定微信的URL地址.
    const bindWXUrl = `${RESTFUL_SERVER}/crm/gotoPage.htm?gotoPage=/store/user/bind_authorize.htm&token=${userToken}`;
    // const wxBeckendUrl = 'http://shop.weihaojiao.com/crm/gotoPage.htm?gotoPage=/store/user/bind_authorize.htm';
    // const bindWXUrl = `${wxBeckendUrl}&token=${userToken}`;
    /* eslint max-len: [0] */
    // 通知模态框
    const dialog = this.createModal(this.state.selectedAlert);
    const modalFrame = this.activityModal(this.state.activityAlert);
    const notice = this.noticeModal(user.noticeList);
    const salePercent = (user.currentMonthSalePercent * 100).toFixed();
    const todayPercent = (user.currentDayTarget.dayPercent * 100).toFixed();
    const dayComplete = user.currentDayTarget.dayComplete;
    const dayPoints = user.currentDayTarget.dayPoints;
    const groupName = user.groupTasks.tasks.length > 0 && user.groupTasks.tasks[0].groupName ?
      user.groupTasks.tasks[user.groupTasks.tasks.length - 1].groupName : '';
    let contentJSX;
    if (user.indexActives.isIndexActivityGet) {
      if (user.indexActives.actives.length > 0) {
        contentJSX = user.indexActives.actives.map((active, index) => {
          const key = `single-active-${index}`;
          // 促销活动 isOffline为0 线上 1 线下
          if (index <= 15) {
            return (
              <List.Item
                key={key}
                title={decodeURIComponent(active.actName).replace(/\+/g, ' ')}
                subTitle={this.renderDateAndIcon(active)}
                onClick={() => this.handleEntryClick(active)}
                id={`hm_home_activity_item_${index}`}
              />
            );
          }
          return '';
        });
      } else {
        contentJSX = (
          <li className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有活动</li>
        );
      }
    } else {
      contentJSX = (
        <li className="hm-loading-wrapper">
          <i className="iconfont icon-jiazai hm-pulse hm-loading" />
        </li>
      );
    }
    return (
      <View>
        {dialog}
        {modalFrame}
        {notice}
        {this.renderLogoutAlert(this.state.isAlertOpen)}
        <Container scrollable className="ks-grid">
          <Notification
            title="请稍后再来!"
            amStyle="alert"
            visible={this.state.isErrorHappend}
            animated
            onDismiss={this.closeNotification}
          >
            服务器正在卖力处理中
          </Notification>
          <Modal
            role="alert"
            className="hm-qrCodeModal"
            title="二维码"
            id="hm_home_qCode_modal"
            isOpen={this.state.isModalOpen}
            onDismiss={this.closeQCodeModal}
            closeViaBackdrop
          >
            <img alt="二维码" src={user.qCodeUrl} />
          </Modal>
          <header className="hm-home-header-wrapper">
            <div className="hm-home-header">
              {/* 通知 */}
              <a href="#/alerts" className="hm-notice-btn" id="hm_home_search_customer_link">
                <div className="btn-wrapper">
                  <i className="iconfont icon-tongzhi" />
                  <span>通知</span>
                  {
                    user.storeAllNoteList && user.storeAllNoteList.length > 0 &&
                    <div
                      className="hm-badge"
                    >
                      {user.storeAllNoteList.length}
                    </div>
                  }
                </div>
              </a>
              {/* 搜索 */}
              <a className="hm-search" href="#/customer/list" onClick={this.toSearch} id="hm_home_search_customer_link">
                <div className="ipt">
                  搜索客户
                  </div>
                <span className="icon icon-search" />
              </a>
              {/* 二维码 */}
              <a id="hm_home_qrcode_button" className="hm-qrcode-btn" onClick={this.handlePopupQCode}>
                <div className="btn-wrapper">
                  <i className="iconfont icon-erweima" aria-hidden="true" />
                  <span className="text">二维码</span>
                </div>
              </a>
              {/* 切换 */}
              {
                auth.user && auth.user.position !== '0' ?
                  <a
                    id="hm_home_exchange_button"
                    onClick={this.handleEXchange}
                  >
                    <div className="btn-wrapper">
                      <i className="iconfont icon-qiehuan" aria-hidden="true" />
                      <span className="text">切换</span>
                    </div>
                  </a> : ''
              }
            </div>
            {
              this.state.isShowModal &&
              <div className="loading-modal">
                <i className="iconfont icon-jiazai hm-pulse hm-loading" />
              </div>
            }
          </header>
          <div className="hm-home-container">
            <div className="hm-home-section-todaytarget">
              <HMCard
                title="我的目标"
                iconName="icon-target"
                handleMore="#/todayTarget"
                cardLinkId="hm_home_today_target_more_link"
                isMoreHide
              >
                {
                  user.currentDayTarget.dayPercent ?
                    <div className="hm-my-target-wrapper">
                      <ul className="progress-container">
                        {this.renderTimeLine(user.currentDayTarget.currentDayWorkTime)}
                      </ul>
                      {
                        user.currentDayTarget.dayPercent &&
                        <div className="today-sale-money">
                          <a href="#/todayTarget/day" onClick={this.handleShowTodaySale}>
                            <div className="sale-wrapper">
                              <span className="today-sale">今日销售：<b className="now-complete">{Number(dayComplete).toLocaleString()}</b></span>
                              <div className="progress">
                                <span style={{ width: `${todayPercent}%` }}>
                                  <b>{`${todayPercent}%`}</b>
                                </span>
                              </div>
                            </div>
                            <div className="describe">
                              <span className="shoul-complete">应该完成：{isNaN(user.currentDayTarget.goalsAchieved) ? 0 : Number(user.currentDayTarget.goalsAchieved).toLocaleString()}</span>
                              <span className="today-target">今日目标：{Number(dayPoints).toLocaleString()}</span>
                              <span className={this.state.isShowTodaySale ? 'icon icon-right-nav rotate' : 'icon icon-right-nav'} />
                            </div>
                          </a>
                          {
                            this.state.isShowTodaySale &&
                            <div className="today-sale-money-item">
                              <div className="tips">
                                <span className="price-target"><i />金额目标</span>
                                <span className="piece-target"><i />计件目标</span>
                              </div>
                              <div className="outside-container">
                                <dl className="all-progress">
                                  {user.currentDayTarget
                                    && user.currentDayTarget.pageItems
                                    && user.currentDayTarget.pageItems.length > 0
                                    && (user.currentDayTarget.pageItems.map((target, idx, arr) => {
                                      const tIdx = `child-target-${idx}`;
                                      let type;
                                      switch (user.currentDayTarget.showType) {
                                        case 'series':
                                          type = 'series';
                                          break;
                                        case 'brand':
                                          type = 'brand';
                                          break;
                                        case 'cat':
                                          type = 'cat';
                                          break;
                                        case 'goods':
                                          type = 'goods';
                                          break;
                                        case 'composition':
                                          type = 'composition';
                                          break;
                                        default:
                                          break;
                                      }
                                      const catList = [];
                                      arr.forEach((item, i) => {
                                        catList.push(item.catValue);
                                      });
                                      const first = indexOf(catList, target.catValue);
                                      const last = lastIndexOf(catList, target.catValue);
                                      let start;
                                      let end;
                                      if (first !== last) {
                                        start = parseInt(first, 10);
                                        end = parseInt(last, 10);
                                      }
                                      if (arr.length > 0 &&
                                        start !== undefined && end !== undefined &&
                                        arr[idx].catValue === arr[start].catValue &&
                                        arr[idx] !== arr[end]) {
                                        return (
                                          <dd
                                            key={tIdx}
                                            className="statistics"
                                          >
                                            <a
                                              href={`#/customer/list/${type}/${target.catValue}`}
                                              id={`hm_home_statistics_price_${idx}`}
                                            >
                                              <div
                                                className={
                                                  arr[end].targetType === '统计数量' ?
                                                    'piece progress' : 'price progress'
                                                }
                                              >
                                                <span style={{ width: `${arr[end].dayPercent * 100}%` }}>
                                                  <b>
                                                    {Number(arr[end].dayComplete).toLocaleString()}
                                                    /{Number(arr[end].dayPoints).toLocaleString()}
                                                  </b>
                                                </span>
                                              </div>
                                              <div
                                                className={
                                                  arr[start].targetType === '统计数量' ?
                                                    'piece progress' : 'price progress'
                                                }
                                              >
                                                <span style={{ width: `${arr[start].dayPercent * 100}%` }}>
                                                  <b>
                                                    {Number(arr[start].dayComplete).toLocaleString()}
                                                    /{Number(arr[start].dayPoints).toLocaleString()}
                                                  </b>
                                                </span>
                                              </div>
                                              <span className="cat-name">{target.catName}</span>
                                            </a>
                                          </dd>
                                        );
                                      } else if (arr[idx] !== arr[end]) {
                                        // 当日目标一般情况
                                        return (
                                          <dd
                                            key={tIdx}
                                            className={
                                              target.targetType === '统计数量' ? 'total-piece' : 'total-price'
                                            }
                                          >
                                            <If condition={target.targetType === '统计数量'}>
                                              <a
                                                href={`#/customer/list/${type}/${target.catValue}`}
                                                id={`hm_home_statistics_count_${idx}`}
                                              >
                                                <div className="progress">
                                                  <span style={{ width: `${target.dayPercent * 100}%` }}>
                                                    <b>
                                                      {Number(target.dayComplete).toLocaleString()}
                                                      /{Number(target.dayPoints).toLocaleString()}
                                                    </b>
                                                  </span>
                                                </div>
                                                <span className="cat-name">{target.catName}</span>
                                              </a>
                                            </If>
                                            <If condition={target.targetType !== '统计数量'}>
                                              <a
                                                href={`#/customer/list/${type}/${target.catValue}`}
                                                id={`hm_home_statistics_count_${idx}`}
                                              >
                                                <div className="progress">
                                                  <span style={{ width: `${target.dayPercent * 100}%` }}>
                                                    <b>
                                                      {Number(target.dayComplete).toLocaleString()}
                                                      /{Number(target.dayPoints).toLocaleString()}
                                                    </b>
                                                  </span>
                                                </div>
                                                <span className="cat-name">{target.catName}</span>
                                              </a>
                                            </If>
                                          </dd>
                                        );
                                      }
                                      return '';
                                    }))}
                                </dl>
                              </div>
                            </div>
                          }
                        </div>
                      }
                      {/* 本月目标 */}
                      {
                        user.currentDayTarget.monthPercent &&
                        <div className="month-sale-money">
                          <a href="#/todayTarget/month" onClick={this.handleShowMonthSale}>
                            <div className="sale-wrapper">
                              <span className="today-sale">本月销售：<b className="now-complete">{Number(user.currentDayTarget.monthComplete).toLocaleString()}</b></span>
                              <div className="progress">
                                <span style={{ width: `${Math.round(Number(user.currentDayTarget.monthPercent) * 100)}%` }}>
                                  <b>{`${Math.round(Number(user.currentDayTarget.monthPercent) * 100)}%`}</b>
                                </span>
                              </div>
                            </div>
                            <div className="describe">
                              <span className="shoul-complete">应该完成：{isNaN(user.currentDayTarget.monthShouldCompleted) ? 0 : Number(user.currentDayTarget.monthShouldCompleted).toLocaleString()}</span>
                              <span className="today-target">本月目标：{Number(user.currentDayTarget.monthPoints).toLocaleString()}</span>
                              <span className={this.state.isShowTodaySale ? 'icon icon-right-nav rotate' : 'icon icon-right-nav'} />
                            </div>
                          </a>
                          {/* 本月目标 */}
                          {
                            this.state.isShowMonthSale &&
                            <div className="today-sale-money-item">
                              <div className="tips">
                                <span className="price-target month"><i />金额目标</span>
                                <span className="piece-target month"><i />计件目标</span>
                              </div>
                              <dl className="all-progress">
                                {user.currentDayTarget
                                  && list
                                  && list.length > 0
                                  && (list.map((target, idx, arr) => {
                                    const tIdx = `child-target-${idx}`;
                                    let type;
                                    switch (user.currentDayTarget.showType) {
                                      case 'series':
                                        type = 'series';
                                        break;
                                      case 'brand':
                                        type = 'brand';
                                        break;
                                      case 'cat':
                                        type = 'cat';
                                        break;
                                      case 'goods':
                                        type = 'goods';
                                        break;
                                      case 'composition':
                                        type = 'composition';
                                        break;
                                      default:
                                        break;
                                    }
                                    const startI = target.monthPercent.indexOf('%');
                                    const result = target.monthPercent.slice(0, startI);
                                    const catList = [];
                                    arr.forEach((item, i) => {
                                      catList.push(item.catValue);
                                    });
                                    const first = indexOf(catList, target.catValue);
                                    const last = lastIndexOf(catList, target.catValue);
                                    let start;
                                    let end;
                                    if (first !== last) {
                                      start = parseInt(first, 10);
                                      end = parseInt(last, 10);
                                    }
                                    if (arr.length > 0 &&
                                      start !== undefined && end !== undefined &&
                                      arr[idx].catValue === arr[start].catValue &&
                                      arr[idx] !== arr[end]) {
                                      return (
                                        <dd
                                          key={tIdx}
                                          className="statistics month"
                                        >
                                          <a
                                            href={`#/customer/list/${type}/${target.catValue}`}
                                            id={`hm_month_target_price_link_${idx}`}
                                          >
                                            <div
                                              className={
                                                arr[end].targetType === '统计数量' ?
                                                  'piece progress' : 'price progress'
                                              }
                                            >
                                              <span style={{ width: arr[end].monthPercent }}>
                                                <b>
                                                  {Number(arr[end].monthComplete).toLocaleString()}
                                                  /{Number(arr[end].monthPoints).toLocaleString()}
                                                </b>
                                              </span>
                                            </div>
                                            <div
                                              className={
                                                arr[start].targetType === '统计数量' ?
                                                  'piece progress' : 'price progress'
                                              }
                                            >
                                              <span style={{ width: arr[start].monthPercent }}>
                                                <b>
                                                  {Number(arr[start].monthComplete).toLocaleString()}
                                                  /{Number(arr[start].monthPoints).toLocaleString()}
                                                </b>
                                              </span>
                                            </div>
                                            <span className="cat-name">{target.catName}</span>
                                          </a>
                                        </dd>
                                      );
                                    } else if (arr[idx] !== arr[end]) {
                                      return (
                                        <dd
                                          key={tIdx}
                                          className={
                                            target.targetType === '统计数量' ? 'total-piece month' : 'total-price month'
                                          }
                                        >
                                          <If condition={target.targetType === '统计数量'}>
                                            <a
                                              href={`#/customer/list/${type}/${target.catValue}`}
                                              id={`hm_month_target_count_link_${idx}`}
                                            >
                                              <div className="progress">
                                                <span style={{ width: `${result}%` }}>
                                                  <b>
                                                    {Number(target.monthComplete).toLocaleString()}
                                                    /{Number(target.monthPoints).toLocaleString()}
                                                  </b>
                                                </span>
                                              </div>
                                              <span className="cat-name">{target.catName}</span>
                                            </a>
                                          </If>
                                          <If condition={target.targetType !== '统计数量'}>
                                            <a
                                              href={`#/customer/list/${type}/${target.catValue}`}
                                              id={`hm_home_statistics_count_${idx}`}
                                            >
                                              <div className="progress">
                                                <span style={{ width: `${result}%` }}>
                                                  <b>
                                                    {Number(target.monthComplete).toLocaleString()}
                                                    /{Number(target.monthPoints).toLocaleString()}
                                                  </b>
                                                </span>
                                              </div>
                                              <span className="cat-name">{target.catName}</span>
                                            </a>
                                          </If>
                                        </dd>
                                      );
                                    }
                                    return '';
                                  })
                                  )}
                              </dl>
                            </div>
                          }
                        </div>
                      }
                      {
                        user.currentDayTarget.newmember &&
                        <div className="month-new-customer">
                          <a href="#/customer/list/newCustomer/RegTimeDesc">
                            <div className="sale-wrapper">
                              <span className="today-sale">本月新客：<b className="now-complete">{`${Number(user.currentDayTarget.newmember.monthComplete)}`}</b></span>
                              <div className="progress">
                                <span style={{ width: `${Math.round(Number(user.currentDayTarget.newmember.monthPercent) * 100)}%` }}>
                                  <b>{Math.round(Number(user.currentDayTarget.newmember.monthPercent) * 100)}%</b>
                                </span>
                              </div>
                            </div>
                            <div className="describe">
                              <span className="shoul-complete" />
                              <span className="today-target">本月目标：{Number(user.currentDayTarget.newmember.monthPoints)}</span>
                              <span className="icon icon-right-nav" />
                            </div>
                          </a>
                        </div>
                      }
                    </div> :
                    <div className="hm-loading-wrapper">
                      <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                    </div>
                }
              </HMCard>
            </div>
            <div className="hm-home-sale-changce">
              <HMCard
                title="销售机会"
                iconName="icon-business_line"
                handleMore="#/customer/relations"
              >
                <div className="hm-sale-changce-link">
                  {
                    user.dayTaskType && user.dayTaskType.length > 1 ? user.dayTaskType.map((item, idx) => {
                      const key = `key-${idx}`;
                      let parentClass;
                      let childClass;
                      let link = `#/customer/list/task/${item.type}`;
                      switch (item.type) {
                        case '01':
                          parentClass = 'new-customer';
                          childClass = 'iconfont icon-xinzengkehu';
                          break;
                        case '02':
                          parentClass = 'stage-sale-customer';
                          childClass = 'iconfont icon-yingxiao';
                          break;
                        case '03':
                          parentClass = 'churn-prewarning';
                          childClass = 'iconfont icon-yujing';
                          break;
                        case '04':
                          parentClass = 'repeat-buy-customer';
                          childClass = 'iconfont icon-tuijian';
                          break;
                        case '05':
                          parentClass = 'care-for-growth';
                          childClass = 'iconfont icon-tubiao05';
                          link = '#/careOfGrowth';
                          break;
                        default:
                          break;
                      }
                      return (
                        <a href={link} className={parentClass} id={`hm_home_changce_link_${idx}`} key={key}>
                          <div className="icon-wrapper">
                            <i className={childClass} />
                            {
                              item.contentValue && item.contentValue !== '0' ?
                                <div
                                  className="hm-badge"
                                >
                                  {item.contentValue}
                                </div>
                                : ''
                            }
                          </div>
                          <span>{item.ruleName}</span>
                        </a>
                      );
                    })
                      : <div className="hm-loading-wrapper">
                        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                      </div>
                  }
                </div>
              </HMCard>
            </div>
            <div className="hm-home-section-actives">
              <Grid>
                <Col cols={6}>
                  <HMCard
                    title="促销活动"
                    iconName="icon-huodong"
                    handleMore="#/calendarActivity"
                    cardLinkId="hm_home_activity_more_link"
                  >
                    <List className="hm-active-list">
                      {contentJSX}
                    </List>
                  </HMCard>
                </Col>
              </Grid>
            </div>
            {
              this.state.isShowVerse &&
              <div className="verse" onClick={this.handleCloseVerse}>
                <div className="verse-wrapper">
                  <i className="iconfont icon-xiaolian" />
                  <span>敢坚持努力下去吗？目标就在你眼前啦~</span>
                </div>
                <div className="close-btn">
                  <span className="icon icon-close" />
                </div>
              </div>
            }
          </div>
        </Container>
      </View>
    );
  }
}

Home.propTypes = {
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

export default connect(mapStateToProps)(Home);
