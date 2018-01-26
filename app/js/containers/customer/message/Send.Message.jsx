/* eslint max-len: [0] */
/* eslint linebreak-style: [0] */
/* eslint no-undef: [0] */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Container,
  Button,
  Notification,
  View,
  Group,
  Field,
  List,
} from 'amazeui-touch';

// actions.
import {
  postCustomerMessage,
  sendMessageReset,
} from '../../../actions/customers/message.js';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import {
  getMyMember,
} from '../../../actions/members/myMembers.js';

import './send.message.scss';

class SendMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: '',
      isSuccess: false,
      visible: false,
      isSubmit: false,
      amStyle: '',
      isPhoneError: '',
      smsLength: 0,
      isLengthUp: false,
    };
    this.firstLoaded = true;
    this.handleSubmitComment = this.handleSubmitComment.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.closePhoneErrorNotification = this.closePhoneErrorNotification.bind(this);
    this.handleStatistics = this.handleStatistics.bind(this);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    sessionStorage.removeItem('newCode');
    dispatch(sendMessageReset());
    const recommendation = params.content;
    if (recommendation) {
      this.smsContent.value = recommendation;
    }
    this.state.smsLength = this.smsContent.value.length;
    if (this.state.smsLength > 70) {
      this.state.isLengthUp = true;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isMessageSended, code, params } = nextProps;
    if (isMessageSended && code === 0) {
      this.setState({
        isSuccess: true,
        isSubmit: true,
        visible: true,
      });
    }
    const phone = params.phone;
    if (phone) {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
        this.setState({
          isPhoneError: '用户手机号码不正确，请改用其他联系方式！',
          isSubmit: true,
        });
      }
    }
  }

  componentWillUnmount(nextProps) {
  }

  handleStatistics(e) {
    this.setState({
      smsLength: e.target.value.length,
    });
    if (e.target.value.length > 70) {
      this.setState({
        isLengthUp: true,
      });
    } else {
      this.setState({
        isLengthUp: false,
      });
    }
  }

  closeNotification() {
    this.setState({
      isErrorHappend: '',
      isSubmit: false,
      visible: false,
    });
  }

  closePhoneErrorNotification() {
    this.setState({
      isPhoneError: '',
    });
  }

  handleSubmitComment(e) {
    const { dispatch, params, code, isMessageSended } = this.props;
    const memberId = params.memberId;
    const phone = params.phone;
    const taskRuleType = params.taskRuleType;
    let smsContent = this.smsContent.value;
    smsContent = smsContent.replace(/\ud83c[\udc00-\udfff]|\ud83d[\udc00-\udfff]|[\u2000-\u2fff]|\ud83e[\uDD10-\uDD5D]/g, '');
    // 检测的表情符号unicode码
    // console.log(`\\u${smsContent.charCodeAt(0).toString(16)}\\${smsContent.charCodeAt(1).toString(16)}`);
    if (!smsContent || smsContent === '') {
      this.setState({
        isErrorHappend: '发送内容不能为空.',
      });
    } else {
      dispatch(postCustomerMessage(memberId, smsContent, phone, taskRuleType));
      this.smsContent.value = '';
      const newTimer = setInterval(() => {
        const newCode = sessionStorage.getItem('newCode');
        if (newCode) {
          clearInterval(newTimer);
          if (newCode === '-1') {
            this.setState({
              isErrorHappend: '发送失败',
            });
          } else if (newCode === '-3') {
            this.setState({
              isErrorHappend: '发送失败,余额不足',
            });
          }
        }
      }, 100);
    }
  }

  render() {
    const {
      error,
      pager,
      Messages,
      isMessageSended,
      code,
    } = this.props;
    const isOverflow = this.state.smsLength >= 70 ? 'is-overflow' : '';
    return (
      <View>
        <Notification
          title="失败了!"
          amStyle="alert"
          visible={this.state.isErrorHappend !== ''}
          animated
          onDismiss={this.closeNotification}
        >
          {this.state.isErrorHappend}
        </Notification>
        <Notification
          title="无法发送!"
          amStyle="alert"
          visible={this.state.isPhoneError !== ''}
          animated
          onDismiss={this.closePhoneErrorNotification}
        >
          {this.state.isPhoneError}
        </Notification>
        <Notification
          title="恭喜!"
          amStyle="success"
          visible={this.state.visible}
          animated
          onDismiss={this.closeNotification}
        >
          发送信息成功!
        </Notification>
        <DefaultHeader title="信息" history={this.props.history} />
        <div className="ks-grid hm-customer-message">
          <Group
            header="发送信息"
            noPadded
          >
            <textarea
              rows="8"
              ref={(c) => { this.smsContent = c; }}
              disabled={this.state.isSubmit}
              className="smsText"
              onKeyUp={this.handleStatistics}
            />
            <div className="tips">
              <span className={isOverflow}>{this.state.smsLength}</span>/70
            </div>
            {/* <Field
              placeholder="请输入需要发送的信息."
              type="textarea"
              rows="5"
              ref={(c) => { this.smsContent = c; }}
            />*/}
          </Group>
          <Button
            id="hm_send_message_commit"
            amStyle="warning"
            amSize="sm"
            onClick={this.handleSubmitComment}
            disabled={this.state.isSubmit || this.state.isLengthUp}
          >
            <span>发送</span>
          </Button>
          <div className="hm-tips">温馨提示：<br />
            1.信息字数最多输入70字,发送表情符号可能会失败！<br />
            2.由于网络通信审核，您的信息内容到达客户会有时间延迟，审核时间最长30分钟，在此期间请不要重复操作！
          </div>
        </div>
        <Container scrollable className="ks-grid hm-customer-message-list">
          <List>
            {
              Messages && Messages.length !== 0 ?
                Messages.map((Message, idx) => {
                  const reactKey = `Messages-${Messages.id}`;
                  return (
                    <List.Item
                      key={reactKey}
                      after={moment(Messages.MessageDate).format('YYYY年MM月DD号 HH:MM:SS')}
                      desc={Messages.smsContent}
                    />
                  );
                }) : ''
            }
          </List>
        </Container>
      </View>
    );
  }
}

SendMessage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  code: PropTypes.number,
  pager: PropTypes.object.isRequired,
  Messages: PropTypes.array.isRequired,
  isMessageSended: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { customerMessage } = state;
  // if (!customerMessage.code
  //   && customerMessage.code !== 0
  //   && !customerMessage.pager) {
  //   return {
  //     error: {},
  //     pager: {},
  //     Messages: [],
  //     isMessageSended: false,
  //   };
  // }
  return {
    error: state.error || {},
    code: customerMessage.code,
    pager: customerMessage.pager || {},
    Messages: customerMessage.Messages,
    isMessageSended: customerMessage.isMessageSended,
  };
}

export default connect(mapStateToProps)(SendMessage);
