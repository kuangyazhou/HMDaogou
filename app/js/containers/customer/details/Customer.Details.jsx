/* eslint max-len: [0] */
/* eslint no-undef: [0] */
/* eslint  no-nested-ternary: [0]*/
/* eslint key-spacing: [0] */
/* eslint eqeqeq: [0]*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { uniqWith, isEqual, filter, cloneDeep } from 'lodash';
import { If } from 'react-if';

import {
  Container,
  Button,
  Notification,
  View,
  Icon,
  Modal,
  Field,
  Group,
} from 'amazeui-touch';

// actions.
import {
  getMyMember,
  fetchCustomerOrderCategories,
  resetMyMember,
} from '../../../actions/customers/details';

import {
  fetchPhoneCall,
  postCustomerCallRecord,
} from '../../../actions/customers/list';

import ReactEcharts from '../../../../../node_modules/echarts-for-react';

import {
  fetchOrdersInfo,
} from '../../../actions/customers/orders';

import {
  fetchCustomerContactProgress,
} from '../../../actions/customers/relations';

import {
  fetchProductsRecommend,
} from '../../../actions/customers/recommend';

// API Utils.
import {
  getToken,
  loadIdToken,
  RESTFUL_SERVER,
} from '../../../utils/apiUtils';

import {
  getViewportHeight,
} from '../../../utils/domUtils';

// Card组件.
import HMCard from '../../../components/hm-card/Card.jsx';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

// menu datasource.
import {
  SEXMAPPING,
  detailsGridData,
} from '../../../reducers/customer';


import './customer.detail.scss';


class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmpty: '',
      isErrorHappend: false,
      isRecordSucceed: false,
      isCallRecordModalOpen: false,
      isPhoneSucceed: false,
      isCallAlertOpen: false,
      isNextLayer: false,
      isShowTip: false,
      isTimeUp: false,
      isCallError: '',
      now: new Date().getHours(),
    };
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handlePhoneCall = this.handlePhoneCall.bind(this);
    this.closeCallRecordModal = this.closeCallRecordModal.bind(this);
    this.handleCallRecordEdit = this.handleCallRecordEdit.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.handleWeChat = this.handleWeChat.bind(this);
    this.handleCommunicate = this.handleCommunicate.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleToMore = this.handleToMore.bind(this);
    this.handleDisabledClick = this.handleDisabledClick.bind(this);
    this.hadleToRecommend = this.hadleToRecommend.bind(this);
    this.renderAlwaysBuyList = this.renderAlwaysBuyList.bind(this);
  }

  componentDidMount() {
    const viewportHeight = getViewportHeight();
    document.querySelector('.hm-details-container').style.height = `${viewportHeight}px`;
    const { dispatch, details, isCatching, params } = this.props;
    dispatch(getMyMember(params.memberId, params.taskType));
    dispatch(fetchCustomerOrderCategories(params.memberId));
    dispatch(fetchOrdersInfo(params.memberId));
    dispatch(fetchCustomerContactProgress(params.memberId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, details, params } = nextProps;
    const taskType = details.taskType;
    let babyBirthDay;
    if (details.babyList && details.babyList.length > 0) {
      details.babyList.forEach((item, idx) => {
        babyBirthDay = item.babyBirthDay;
      });
    }
    if (taskType === '02' || taskType === '04') {
      if (!sessionStorage.getItem('firstRequest')) {
        dispatch(fetchProductsRecommend(params.memberId, babyBirthDay));
        sessionStorage.setItem('firstRequest', 0);
      }
    }
  }

  componentDidUpdate() {
    this.addEvent();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetMyMember());
    sessionStorage.removeItem('firstRequest');
  }

  setOption(ordercategories) {
    const indicator = [];
    let amounts;
    if (ordercategories && ordercategories.names) {
      for (let i = 0; i < ordercategories.names.length; i++) {
        indicator.push({ text: ordercategories.names[i], max: Number(ordercategories.percents[i]) });
      }
    }
    if (ordercategories && ordercategories.amounts) {
      amounts = ordercategories.amounts;
    }
    const option = {
      tooltip: {
        trigger: 'item',
      },
      radar: {
        indicator,
        name: {
          textStyle: {
            fontSize: 14,
            color: '#6e6e6e',
          },
        },
        triggerEvent: true,
        splitArea: {
          areaStyle: {
            color: ['#fff'],
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 10,
          },
        },
      },
      series: [
        {
          name: '客户营销推荐',
          type: 'radar',
          itemStyle: {
            normal: {
              areaStyle: {
                type: 'default',
              },
            },
          },
          data: [
            {
              value: amounts,
              name: '客户营销推荐',
              itemStyle: {
                normal: {
                  color: 'rgba(255, 105, 120, 0.8)',
                  labelLine: {
                    show: false,
                  },
                },
              },
            },
          ],
        },
      ],
      special: [0, 1, 2, 3, 4, 5],
    };
    return option;
  }

  addEvent() {
    const { ordercategories, dispatch, params, isCatching } = this.props;
    if (isCatching && ordercategories.names && this.radarChart) {
      const catName = ordercategories.names;
      const catValue = ordercategories.values;
      const radarChart = this.radarChart.getEchartsInstance();
      if (ordercategories && ordercategories.indexLevels.length > 0 && ordercategories.indexLevels[0] !== '2') {
        radarChart.on('click', (param) => {
          for (let i = 0; i < catName.length; i++) {
            if (param.name === catName[i]) {
              this.setState({
                isNextLayer: true,
              });
              dispatch(fetchCustomerOrderCategories(params.memberId, catValue[i]));
            }
          }
        });
      }
    }
  }

  handleBack() {
    const { ordercategories, dispatch, params } = this.props;
    dispatch(fetchCustomerOrderCategories(params.memberId));
    this.setState({
      isNextLayer: false,
    });
  }

  handleDisabledClick(e) {
    e.preventDefault();
    return false;
  }

  // 拨打电话
  handlePhoneCall(e) {
    e.preventDefault();
    const { dispatch, details, callRecord, params, isFetching, returnCode } = this.props;
    const memberOfflineid = details.id;
    const taskType = details.taskType;
    if (this.state.now >= 7 && this.state.now < 23) {
      if (details.mobilePhone !== '' && taskType) {
        const profile = loadIdToken();
        const userId = profile.userId;
        const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
        fetch(`${RESTFUL_SERVER}/crm/callBack/callBack.json?token=${token}`, {
          method: 'post',
          mode: 'cors',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            offline_id: memberOfflineid,
          }),
        }).then(response => response.json()).then((json) => {
          const { code, data, errMsg } = json;
          if (code === 0 && errMsg !== 'localcall') {
            setTimeout(() => (
              this.setState({
                isPhoneSucceed: true,
              })
            ), 0);
            setTimeout(() => (
              this.setState({
                isCallRecordModalOpen: true,
              })
            ), 5000);
            this.setState({
              isCallAlertOpen: true,
            });
            dispatch(fetchPhoneCall(memberOfflineid, taskType));
            dispatch(fetchCustomerContactProgress(params.memberId));
          } else if (code === -2 || code === -3) {
            this.setState({
              isCallError: errMsg,
            });
          } else if ((code === 0 && errMsg === 'localcall') || code === '' || code === undefined) {
            window.location.href = this.telNum.getAttribute('href');
            if (details.mobilePhone !== '') {
              dispatch(fetchPhoneCall(memberOfflineid, taskType));
              setTimeout(() => (
                this.setState({
                  isPhoneSucceed: true,
                })
              ), 0);
              setTimeout(() => (
                this.setState({
                  isCallRecordModalOpen: true,
                })
              ), 5000);
            }
          }
        }).catch((err) => {
          throw new Error(err);
        });
      }
    } else {
      this.setState({
        isTimeUp: true,
      });
    }
  }

  // 关闭掉notify栏
  handleCloseNotification(e) {
    e.preventDefault();
    this.setState({
      isPhoneSucceed: false,
      isRecordSucceed: false,
      isTimeUp: false,
    });
  }

  // 通过向他推荐发送短信
  hadleToRecommend(e) {
    const { details, history, wiki, recommendation } = this.props;
    if (this.state.now >= 7 && this.state.now < 23) {
      if (details.mobilePhone === '') {
        e.preventDefault();
      } else {
        const type = e.target.getAttribute('data-type');
        let smsContent = `亲爱的${details.realName}，`;
        switch (type) {
          case 'stage':
            if (wiki && wiki.length > 0) {
              wiki.forEach((item, idx) => {
                smsContent += `${item}|`;
              });
            }
            break;
          case 'repeat':
            if (recommendation && recommendation.length > 0) {
              recommendation.forEach((item, idx) => {
                smsContent += `${idx + 1}.${item},`;
              });
            }
            break;
          default:
            break;
        }
        smsContent = smsContent.slice(0, smsContent.lastIndexOf('|'));
        history.push(`/customer/message/${details.id}/${details.mobilePhone}/${details.taskType}/${smsContent}`);
      }
    } else {
      e.preventDefault();
      this.setState({
        isTimeUp: true,
      });
    }
  }

  handleToMore(e) {
    e.preventDefault();
    const { details, history } = this.props;
    const id = details.id;
    const date = e.currentTarget.getAttribute('data-href');
    const ele = e.currentTarget.firstElementChild.textContent;
    let type;
    switch (ele) {
      case '打电话':
        type = 0;
        break;
      case '发短信':
        type = 1;
        break;
      case '发微信':
        type = 2;
        break;
      default:
    }
    history.push(`/customer/contact/${id}/${date}/${type}`);
  }

  // 提交打电话备注
  handleCallRecordEdit(e) {
    const { dispatch, callRecord } = this.props;
    const { params } = this.props;
    const memerId = params.memberId;
    const txtRecord = this.domRecord.getValue();
    if (txtRecord && txtRecord !== '') {
      this.setState({
        isRecordSucceed: true,
      });
      dispatch(postCustomerCallRecord(callRecord.id, txtRecord));
    }
  }

  handleWeChat(e) {
    e.preventDefault();
    const { ordercategories, details, error, ordersInfo, contactInfo, callRecord, returnCode, isCatching } = this.props;
    const taskRuleType = details.taskType;
    const wechatUrl = `${RESTFUL_SERVER}/crm/customer/customer_wechat.htm?token=${getToken()}&openid=${details.openid}&taskRuleType=${taskRuleType}`;
    // const wechatUrl = `http://shop.weihaojiao.com/crm/customer/customer_wechat.htm?token=${getToken()}&openid=${details.openid}&taskRuleType=${taskRuleType}`;
    if (this.state.now >= 7 && this.state.now < 23) {
      if (details.openid && details.canWechat === '') {
        window.location.href = wechatUrl;
      } else if (details.openid && details.canWechat !== '') {
        if (details.canWechat === 1) {
          window.location.href = wechatUrl;
        } else {
          this.setState({
            isShowTip: true,
          });
          setTimeout(() => {
            this.setState({
              isShowTip: false,
            });
          }, 1000);
        }
      } else {
        this.setState({
          isShowTip: true,
        });
        setTimeout(() => {
          this.setState({
            isShowTip: false,
          });
        }, 1000);
      }
    } else {
      e.preventDefault();
      this.setState({
        isTimeUp: true,
      });
    }
  }

  handleCommunicate(e) {
    const { details } = this.props;
    if (this.state.now >= 7 && this.state.now < 23) {
      if (details.mobilePhone === '') {
        e.preventDefault();
      }
    } else {
      e.preventDefault();
      this.setState({
        isTimeUp: true,
      });
    }
  }

  closeCallRecordModal(e) {
    e.preventDefault();
    this.setState({
      isCallRecordModalOpen: false,
    });
  }

  closeNotification() {
    this.setState({
      isEmpty: '',
      visible: false,
      isCallAlertOpen: false,
      isCallError: '',
    });
  }

  // 渲染打电话备注模态框
  renderCallRecordModal() {
    return (
      <Modal
        className="hm-modal-tags"
        title="添加备注"
        role="confirm"
        confirmText="确定"
        cancelText="取消"
        isOpen={this.state.isCallRecordModalOpen}
        onDismiss={this.closeCallRecordModal}
        onAction={this.handleCallRecordEdit}
        closeViaBackdrop
      >
        <Field
          placeholder="请填写备注"
          ref={input => (this.domRecord = input)}
        />
      </Modal>
    );
  }

  // 渲染打电话提示模态框
  renderCallAlert() {
    return (
      <Modal
        className="hm-modal-tags"
        title="温馨提示"
        role="alert"
        isOpen={this.state.isCallAlertOpen}
        onAction={this.closeNotification}
        closeViaBackdrop
      >
        <p>等待转接中请注意接听电话！</p>
      </Modal>
    );
  }

  renderAlwaysBuyList(params) {
    let list;
    if (params && params.indexOf('、') !== -1) {
      list = params.split('、').map((item, idx) => {
        const key = `key-${idx}`;
        return (
          <span>{item}</span>
        );
      });
    } else {
      list = <span>{params}</span>;
    }
    return list;
  }

  render() {
    const { ordercategories, details, error, ordersInfo, contactInfo, callRecord, returnCode, isCatching, wiki, babyAgeWiki, recommendation } = this.props;
    const menuData = detailsGridData(details);
    const smsContent = `亲爱的${details.realName}，`;
    let parentGender;
    if (document.querySelector('.wiki-item:last-child')) {
      document.querySelector('.wiki-item:last-child').textContent =
        document.querySelector('.wiki-item:last-child').textContent.replace('|', '');
    }
    if (details.customerGender === 0) {
      parentGender = '保密';
    } else if (details.customerGender === 1) {
      parentGender = '女';
    } else if (details.customerGender === 2) {
      parentGender = '男';
    }
    const color = details.openid === '' ? '#cbcbcb' : '';
    let wechatColor;
    let tip;
    let haveNotPhoneColor;
    if (this.state.now >= 7 && this.state.now < 23) {
      haveNotPhoneColor = details.mobilePhone === '' ? '#cbcbcb' : '';
      if (details.openid) {
        if (details.canWechat === 0) {
          wechatColor = '#716843';
          tip = '超过48小时未联系';
        }
      } else {
        wechatColor = '#cbcbcb';
        tip = '未绑定微信';
      }
    } else {
      haveNotPhoneColor = '#cbcbcb';
      wechatColor = '#cbcbcb';
    }
    let realName = details.realName;
    if (realName.indexOf('/')) {
      realName = realName.replace(/\//ig, '&');
    }
    const isAlreadyCalled = (function iife(callCount) {
      if (callCount && callCount === 0) {
        return 'notContacted';
      } else if (callCount && callCount > 0) {
        return '';
      }
      return 'notContacted';
    }(details.callRecordCount));
    const isWechatContacted = (function iife(openid, wechatRecordCount) {
      if (openid === '') {
        return '';
      }
      if (openid !== '' && wechatRecordCount > 0) {
        return '';
      }
      if (openid !== '' && wechatRecordCount < 1) {
        return 'notContacted';
      }
      return '';
    }(details.openid, details.wechatRecordCount));
    const level = details.consumeCapacity;
    let levelClass = 'level-and-points';
    let levelContent;
    if (level === '中消费客户') {
      levelClass = `${levelClass} middle-level`;
      levelContent = '中消费';
    } else if (level === '高消费客户') {
      levelClass = `${levelClass} high-level`;
      levelContent = '高消费';
    } else if (level === '顶级消费客户') {
      levelClass = `${levelClass} top-level`;
      levelContent = '顶级消费';
    } else {
      levelClass = `${levelClass} low-level`;
      levelContent = '低消费';
    }
    let babyGender = '保密';
    let babygenderClass = 'iconfont icon-mibao';
    /* 女宝  icon-nvbaobao 男宝 icon-baobeibaby137 保密 icon-mibao*/
    if (details.babyList && details.babyList.length > 0) {
      details.babyList.forEach((item, idx) => {
        if (item.babyGender === 0) {
          babyGender = '保密';
          babygenderClass = 'iconfont icon-mibao';
        } else if (item.babyGender === 1) {
          babyGender = '女宝';
          babygenderClass = 'iconfont icon-nvbaobao';
        } else if (item.babyGender === 2) {
          babyGender = '男宝';
          babygenderClass = 'iconfont icon-baobeibaby137';
        }
      });
    }
    let btnType;
    switch (details.taskType) {
      case '00':
        btnType = '其他';
        break;
      case '01':
        btnType = '新客转化';
        break;
      case '02':
        btnType = '阶段营销';
        break;
      case '03':
        btnType = '流失预警';
        break;
      case '04':
        btnType = '复购推荐';
        break;
      case '05':
        btnType = '成长关怀';
        break;
      default:
        btnType = '成长关怀';
        break;
    }
    const isBind = details.openid !== '' ? 'bind' : 'notBind';
    return (
      <View className="hm-customer-detail-view">
        <Notification
          title="未填写!"
          amStyle="alert"
          visible={this.state.isEmpty !== ''}
          animated
          onDismiss={this.closeNotification}
        >
          {this.state.isEmpty}
        </Notification>
        <Notification
          title="拨打电话失败!"
          amStyle="alert"
          visible={this.state.isCallError !== ''}
          animated
          onDismiss={this.closeNotification}
        >
          {this.state.isCallError}
        </Notification>
        <Notification
          title="请稍后再来!"
          amStyle="alert"
          visible={this.state.isErrorHappend}
          animated
          onDismiss={this.handleCloseNotification}
        >
          服务器正在卖力处理中
          {/* {error && error.message}.*/}
        </Notification>
        <Notification
          title="成功了!"
          amStyle="success"
          visible={this.state.isPhoneSucceed}
          animated
          onDismiss={this.handleCloseNotification}
        >
          电话拨打记录已经被保存.
        </Notification>
        <Notification
          title="成功了!"
          amStyle="success"
          visible={this.state.isRecordSucceed}
          animated
          onDismiss={this.handleCloseNotification}
        >
          添加备注成功.
        </Notification>
        <Notification
          title="失败了!"
          amStyle="alert"
          visible={this.state.isTimeUp}
          animated
          onDismiss={this.handleCloseNotification}
        >
          为避免打扰用户，23时至6时禁止联系客户.
        </Notification>
        {this.renderCallRecordModal(this.state.isCallRecordModalOpen)}
        {this.renderCallAlert(this.state.isCallAlertOpen)}
        <DefaultHeader title="客户详情" history={this.props.history} />
        <div
          scrollable
          className="ks-grid hm-details-container"
          transition=""
          ref={wrapper => (this.wrapper = wrapper)}
        >
          <div className="hm-customer-detail-new-header">
            <div className={levelClass}>
              <p><span className="iconfont icon-v" />{levelContent}</p>
              <p>积分：{details.points}</p>
            </div>
            <div className="avatar-wrapper">
              <div>
                <i className={babygenderClass} />
              </div>
              <span>{babyGender}</span>
            </div>
            <div className="sale-changce-tag">
              <span>{btnType}</span>
            </div>
            {
              details.babyList && details.babyList.length > 0 ? details.babyList.map((item, idx) => {
                const key = `key-${idx}`;
                let babyAge = '未知';
                babyAge = item.babyAgeAsString === '未知' ? '未知' : item.babyAgeAsString;
                return (
                  <div className="baby-information" key="key">
                    <span>
                      宝宝生日:{item.babyBirthDay || '未知'}&nbsp; 年龄:{babyAge}
                    </span>
                  </div>
                );
              }) : ''
            }
            <p className="customer-name">
              会员姓名：<span>{details.realName}</span>&nbsp;
              孕期：{
                details.weeksOfPregnancy === -1 ? '未怀孕' :
                  `${details.weeksOfPregnancy}周`
              }&nbsp;
              年龄: {details.customerAge || '未知'}
            </p>
            <p className="card-information">
              开卡日期：{details.regDate}&nbsp;卡号：{details.memberNum}
            </p>
          </div>
          <nav className="hm-customer-detail-nav" ref={(ref) => { this.navBar = ref; }}>
            {
              this.state.isShowTip && <span className="hm-tip-wrapper">{tip}</span>
            }
            <ul className="call-list">
              <li>
                <a
                  id="hm_customer_details_phone_call"
                  href={`tel:${details.mobilePhone}`}
                  className={`icon-button phone ${isAlreadyCalled}`}
                  onClick={this.handlePhoneCall}
                  data-member-offline-id={details.id}
                  data-tel="tel"
                  ref={telNum => (this.telNum = telNum)}
                  style={{ color: haveNotPhoneColor }}
                >
                  <i className="iconfont icon-dianhua" style={{ color: haveNotPhoneColor }} />
                  打电话
                </a>
              </li>
              <li>
                <a
                  id="hm_customer_details_send_message"
                  className="icon-button message"
                  href={`#/customer/message/${details.id}/${details.mobilePhone}/${details.taskType}/${smsContent}`}
                  style={{ color: haveNotPhoneColor }}
                  onClick={this.handleCommunicate}
                >
                  <i className="iconfont icon-555" style={{ color: haveNotPhoneColor }} />
                  发短信
                </a>
              </li>
              <li>
                <a
                  id="hm_customer_details_send_wechat"
                  className={`icon-button wechat ${isWechatContacted}`}
                  href="#/"
                  onClick={this.handleWeChat}
                  style={{ color: wechatColor }}
                >
                  <i className="iconfont icon-weixin" style={{ color: wechatColor }} />
                  发微信
                </a>
              </li>
              <li>
                <a
                  id="hm_customer_details_record"
                  className="icon-button note"
                  href={`#/customer/comments/${details.id}`}
                >
                  <i className="iconfont icon-beizhu" />
                  备注
                </a>
              </li>
            </ul>
          </nav>
          <div className="hm-customer-detail-main">
            <ul className="marketing">
              <li>
                <a
                  id="hm_customer_details_special_deal"
                  href={
                    `#/customer/marketing/${isBind}/memberMarketing/${details.mobilePhone || undefined}/${details.offlineId}/${realName}/0`}
                >
                  申请券发放
                </a>
              </li>
              <li>
                <a
                  id="hm_customer_details_assign_deal"
                  href={
                    `#/customer/marketing/${isBind}/specifyMarketing/${details.mobilePhone || undefined}/${details.offlineId}/${realName}/0`}
                >
                  已有券发放
                </a>
              </li>
            </ul>
            {(details.taskType === '02' || details.taskType === '04') &&
              <HMCard
                title="向ta推荐"
                isMoreHide
                iconName="icon-tuijian"
              >
                <div className="stage-sale-customer">
                  <div className="recommend-header">
                    <span>
                      阶段营销：{babyAgeWiki}
                    </span>
                  </div>
                  <div className="recommend-body">
                    {
                      wiki ?
                        <div className="recommend-article">
                          {
                            wiki && wiki.map((item, idx) => {
                              const key = `key-${idx}`;
                              return (
                                <span
                                  key={key}
                                  className="wiki-item"
                                  ref={c => (this.wiki = c)}
                                >
                                  {`${item}|`}
                                </span>
                              );
                            })
                          }
                        </div> :
                        <div className="recommend-article">
                          暂时没有推荐
                        </div>
                    }
                    <div className="recommend-btn-container">
                      <button onClick={this.hadleToRecommend} data-type="stage">通知ta</button>
                    </div>
                  </div>
                </div>
                <div className="repeat-buy-customer">
                  <div className="recommend-header">
                    <span>
                      复购推荐
                    </span>
                  </div>
                  <div className="recommend-body">
                    {
                      recommendation ?
                        <div className="recommend-article">
                          {
                            recommendation && recommendation.map((item, idx) => {
                              const key = `key-${idx}`;
                              return (
                                <span key={key}>{item}</span>
                              );
                            })
                          }
                        </div> :
                        <div className="recommend-article">
                          暂时没有推荐
                        </div>
                    }
                    <div className="recommend-btn-container">
                      <button onClick={this.hadleToRecommend} data-type="repeat">通知ta</button>
                    </div>
                  </div>
                </div>
              </HMCard>
            }
            <HMCard title="客户营销推荐" isMoreHide iconName="icon-tuijian">
              <div className="hm-radar">
                <If condition={isCatching && ordercategories.names && ordercategories.names.length}>
                  <ReactEcharts
                    option={this.setOption(ordercategories)}
                    style={{ height: '300px' }}
                    ref={c => (this.radarChart = c)}
                  />
                </If>
                <If condition={isCatching && !ordercategories.names}>
                  <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还未设置产品数据</p>
                </If>
                <If condition={isCatching == undefined}>
                  <div className="hm-loading-wrapper">
                    <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                  </div>
                </If>

                {
                  this.state.isNextLayer ?
                    <i className="iconfont icon-fanhui" onClick={this.handleBack} /> : ''
                }
                {
                  this.radarChart ? this.addEvent() : ''
                }
              </div>
            </HMCard>
            <div className="record">
              <HMCard
                cardLinkId="hm_customer_details_order_record_more"
                title="订单记录"
                iconName="icon-dingdanzongshu-"
                handleMore={`#/customer/orders/${details.id}`}
              >
                <div className="hm-more">
                  <span className="hm-card-more-tips" />
                </div>
              </HMCard>
            </div>
            <div className="aways-buy">
              <HMCard
                title="经常购买"
                isMoreHide
                iconName="icon-goumai"
              >
                <div className="list-container hm-mostBuyBrands">
                  <If condition={details.buyBrands === ''}>
                    <ul className="list">
                      <li>最近没有购买过商品</li>
                    </ul>
                  </If>
                  <If condition={details.buyBrands !== ''}>
                    <div className="always-buy-list">
                      {this.renderAlwaysBuyList(details.buyBrands)}
                    </div>
                  </If>
                </div>
              </HMCard>
            </div>
            <div className="consume-statistics">
              <HMCard
                title="消费统计"
                isMoreHide
                iconName="icon-tongji"
              >
                <div className=" consume-statistics">
                  <div className="list-container">
                    <ul className="list">
                      <li><span>本月消费金额</span><p>￥{ordersInfo && Number(ordersInfo.currentMonthAmount).toLocaleString()}</p></li>
                      <li><span>本月消费次数</span><p>{ordersInfo && Number(ordersInfo.currentMonthCount)}</p></li>
                      <li><span>上月消费金额</span><p>￥{ordersInfo && Number(ordersInfo.lastMonthAmount).toLocaleString()}</p></li>
                      <li><span>上月消费次数</span><p>{ordersInfo && Number(ordersInfo.lastMonthCount)}</p></li>
                      <li><span>近一年累计消费金额</span><p>￥{ordersInfo && Number(ordersInfo.currentYearAmount).toLocaleString()}</p></li>
                      <li><span>近一年累计消费次数</span><p>{ordersInfo && Number(ordersInfo.currentYearCount)}</p></li>
                    </ul>
                    <ul className="others">
                      <li><span>最近消费门店</span><p>{details.storeOutletName}</p></li>
                      <li className="hide"><span><i className="blue" />注册门店</span><p>商户网店</p></li>
                      <li className="hide"><span><i className="blue" />注册日期</span><p>2016-10-20</p></li>
                    </ul>
                  </div>
                </div>
              </HMCard>
            </div>
            <div className="customer-contact-progress">
              <HMCard
                title="客户联系记录"
                isMoreHide
                iconName="icon-kehulianxijilu"
              >
                <div className="list-container">
                  <ul className="contact-item">
                    {contactInfo && contactInfo.length > 0 ? contactInfo.map((progress, index) => {
                      const reactKey = `progress-${index}`;
                      return (
                        <li key={reactKey}>
                          <div className="date">
                            {progress.thisTime}
                          </div>
                          <div className="line-box">
                            <b />
                            <u />
                          </div>
                          <div className="contact-container">
                            <ul className="contact-way">
                              <li>
                                <a
                                  id={`hm_customer_details_progress_more_${index}`}
                                  href="#/"
                                  data-href={`${progress.thisTime}`}
                                  onClick={this.handleToMore}
                                >
                                  <span className="info">
                                    {progress.info}
                                  </span>
                                  <span className="link">详情</span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </li>
                      );
                    })
                      : <li>
                        <span>还没有联系</span>
                      </li>
                    }
                  </ul>
                </div>
              </HMCard>
            </div>
          </div>
        </div>
      </View>
    );
  }
}

Details.propTypes = {
  dispatch: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired,
  ordercategories: PropTypes.any,
  contactInfo: PropTypes.array,
  ordersInfo: PropTypes.any,
  error: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  callRecord: PropTypes.object,
  returnCode: PropTypes.any,
  errorMsg: PropTypes.any,
  isFetching: PropTypes.bool,
  isCatching: PropTypes.bool,
  isDetailsGet: PropTypes.bool,
  wiki: PropTypes.array,
  recommendation: PropTypes.array,
  babyAgeWiki: PropTypes.array,
};

function mapStateToProps(state) {
  const { customerDetailById, orderCategories, customerOrdersInfo,
    customerContactProgress, customerCallInfo,
    customerThirdPartyCall, isFetching, callRecord, returnCode, errorMsg, getCustomerRecommend } = state;
  if (!customerDetailById.detail
    || !customerDetailById.detail.id
    || !customerDetailById.detail.id > 0) {
    // todo: 需要在此处应用应用程序缓存, 在后台数据无法获取的时候, 我们使用保存在应用缓存的数据.
    return {
      details: {
        id: '',
        onlineId: '',
        openid: '',
        realName: '',
        level: '',
        points: '',
        headPortrait: '',
        userName: '',
        mobilePhone: '',
        storeOutletName: '',
        regDate: '',
        customerAge: 0,
        customerGender: 0,
        weeksOfPregnancy: 0,
        babyList: [],
        orderCount: 0,
        couponCount: 0,
      },
      ordersInfo: {},
      ordercategories: [],
      isCatching: undefined,
      returnCode: '',
      errorMsg: '',
      isFetching: '',
      callRecord: {},
      error: {},
      isDetailsGet: false,
      wiki: [],
      recommendation: [],
      babyAgeWiki: '',
    };
  }
  return {
    details: customerDetailById.detail,
    contactInfo: customerContactProgress.contactInfo,
    callRecord: customerCallInfo.callRecord,
    ordercategories: orderCategories.categories,
    isCatching: orderCategories.isCatching,
    ordersInfo: customerOrdersInfo.pager,
    returnCode: customerThirdPartyCall.returnCode,
    errorMsg: customerThirdPartyCall.errorMsg,
    isFetching: customerThirdPartyCall.isFetching,
    isDetailsGet: customerDetailById.isDetailsGet,
    recommendation: getCustomerRecommend.recommendation,
    wiki: getCustomerRecommend.wiki,
    babyAgeWiki: getCustomerRecommend.babyAgeWiki,
    error: {},
  };
}

export default connect(mapStateToProps)(Details);
