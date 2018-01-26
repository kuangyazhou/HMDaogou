/* eslint  no-nested-ternary: [0]*/
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';
import {
  Container,
  View,
  Tabs,
} from 'amazeui-touch';

import moment from 'moment';

// API Utils.
import {
  getToken,
} from '../../../utils/apiUtils';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

// actions.
import {
  fetchCustomerContactProgress,
  fetchCustomerContactProgressDetail,
} from '../../../actions/customers/relations';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../../utils/domUtils';

import './contact.scss';

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      activeTab: parseInt(this.props.params.type, 10),
    };
    this.handleAction = this.handleAction.bind(this);
    this.handleDate = this.handleDate.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { params } = this.props;
    const memberId = params.memberId;
    const thisTime = params.time;
    dispatch(fetchCustomerContactProgress(memberId));
    dispatch(fetchCustomerContactProgressDetail(memberId, thisTime));
  }

  handleAction(key) {
    this.setState({
      activeTab: key,
    });
  }

  showTaskType(param) {
    let taskRuleType;
    if (param) {
      switch (param) {
        case '00':
          taskRuleType = null;
          break;
        case '01':
          taskRuleType = '新客转换';
          break;
        case '02':
          taskRuleType = '阶段营销';
          break;
        case '03':
          taskRuleType = '流失预警';
          break;
        case '04':
          taskRuleType = '复购推荐';
          break;
        case '05':
          taskRuleType = '成长关怀';
          break;
        default:
          taskRuleType = '成长关怀';
          break;
      }
    }
    return taskRuleType;
  }

  handleDate(time) {
    const now = new Date(time);
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    return {
      month,
      date,
      day,
      hour,
      minute,
    };
  }
  render() {
    const { error, ContactProgressInfo } = this.props;
    const callRecord = [];
    const msgRecord = [];
    const weChatRecord = [];
    if (ContactProgressInfo && ContactProgressInfo.length > 0) {
      ContactProgressInfo.forEach((item, idx) => {
        switch (item.contact_type) {
          case 1:
            callRecord.push(item);
            break;
          case 2:
            msgRecord.push(item);
            break;
          case 3:
            weChatRecord.push(item);
            break;
          default:
            break;
        }
      });
    }
    return (
      <View className="hm-contact">
        <Container className="ks-grid hm-scrollable-container">
          <DefaultHeader title="联系记录" history={this.props.history} />
          <div className="hm-contact-record-main">
            <Tabs
              activeKey={this.state.activeTab}
              onAction={this.handleAction}
              className="hm-contact-tabs"
            >
              <Tabs.Item
                title="电话"
                key="0"
                navStyle="alert"
                className="record-container"
              >
                <div className="phone">
                  {
                    !ContactProgressInfo ?
                      <div className="hm-loading-wrapper">
                        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                      </div> :
                      (
                        callRecord.length > 0 ? callRecord.map((progress, index) => {
                          const reactKey = `progress-${index}`;
                          return (
                            <div key={reactKey}>
                              <ul className="contact-item">
                                <li>
                                  <div className="date">
                                    {moment(progress.create_time).format('MM-DD HH:mm')}
                                  </div>
                                  <div className="line-box">
                                    <b />
                                    <s />
                                  </div>
                                  <div className="contact-container">
                                    <ul className="contact-way">
                                      <li>
                                        <span>{progress.info}</span>
                                        {
                                          this.showTaskType(
                                            progress.task_rule_type
                                          ) &&
                                          <span className="tag">
                                            {this.showTaskType(
                                              progress.task_rule_type
                                            )}
                                          </span>
                                        }
                                      </li>
                                      <li>{progress.content}</li>
                                    </ul>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          );
                        }) :
                        <div className="hm-null">
                          <i className="iconfont icon-meiyouxiaoxi" />当前没有电话联系记录
                        </div>
                      )
                  }
                </div>
              </Tabs.Item>
              <Tabs.Item
                title="短信"
                key="0"
                navStyle="alert"
                className="record-container"
              >
                <div className="message">
                  {
                    !ContactProgressInfo ?
                      <div className="hm-loading-wrapper">
                        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                      </div> :
                        (
                          msgRecord.length > 0
                            ? msgRecord.map((progress, index) => {
                              const reactKey = `progress-${index}`;
                              return (
                                <div key={reactKey}>
                                  <h6>
                                    {moment(progress.create_time).format('MM-DD HH:mm')}
                                    {
                                      this.showTaskType(
                                        progress.task_rule_type
                                      ) &&
                                      <span className="tag">
                                        {this.showTaskType(
                                          progress.task_rule_type
                                        )}
                                      </span>
                                    }
                                  </h6>
                                  <p className="self">
                                    {progress.content}
                                  </p>
                                </div>
                              );
                            }) :
                            <div className="hm-null">
                              <i className="iconfont icon-meiyouxiaoxi" />当前没有短信联系记录
                            </div>
                        )
                  }
                </div>
              </Tabs.Item>
              <Tabs.Item
                title="微信"
                key="0"
                navStyle="alert"
                className="record-container scrollable"
              >
                <div className="weChat">
                  {
                    !ContactProgressInfo ?
                      <div className="hm-loading-wrapper">
                        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
                      </div> :
                       (
                        weChatRecord.length > 0
                    ? weChatRecord.map((progress, index) => {
                      /* sendDerection  1 导购发送  0 客户返回 */
                      const reactKey = `progress-${index}`;
                      return (
                        <div className="weChat-item" key={reactKey}>
                          <h6>
                            {moment(progress.create_time).format('MM-DD HH:mm')}
                            {
                              this.showTaskType(
                                progress.task_rule_type
                              ) &&
                              <span className="tag">
                                {this.showTaskType(
                                  progress.task_rule_type
                                )}
                              </span>
                            }
                          </h6>
                          {
                            progress.send_direction === '1' ?
                              <div className="pullRight">
                                <span>
                                  <i className="iconfont icon-kefu" />
                                </span>
                                <p className="self">{progress.content}</p>
                              </div> :
                              <div className="weChat-item-detail">
                                <span>
                                  <i className="iconfont icon-kehu" />
                                </span>
                                <p className="other">{progress.content}</p>
                              </div>
                          }
                        </div>
                      );
                    }) :
                    <div className="hm-null">
                      <i className="iconfont icon-meiyouxiaoxi" />当前没有微信联系记录
                    </div>
                    )
                  }
                </div>
              </Tabs.Item>
            </Tabs>
          </div>
        </Container>
      </View>
    );
  }
}

Contact.propTypes = {
  dispatch: PropTypes.func.isRequired,
  ContactProgressInfo: PropTypes.array,
  history: PropTypes.object,
  error: PropTypes.object,
};

function mapStateToProps(state) {
  const { customerContactProgress, customerContactProgressDetail, error } = state;
  return {
    ContactProgressInfo: customerContactProgressDetail.ContactProgressInfo,
    error,
  };
}

export default connect(mapStateToProps)(Contact);
