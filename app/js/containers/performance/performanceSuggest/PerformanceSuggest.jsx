import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  View,
  Button,
  Notification,
} from 'amazeui-touch';

import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
} from '../../../utils/apiUtils';

import DeafaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';
import sendSuggest from '../../../actions/users/suggest.js';

import './performanceSuggest.scss';

class PerformanceSuggest extends React.Component {
  constructor(props) {
    super(props);
    this.doughnutChart = {};
    this.state = {
      isSuccess: false,
      isSubmit: true,
      isError: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.handleStatistics = this.handleStatistics.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  handleSubmit() {
    if (this.smsContent.value !== '') {
      const profile = loadIdToken();
      const userId = profile.userId;
      /* eslint max-len: [0] */
      const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
      const config = {
        method: 'post',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };
      fetch(`${RESTFUL_SERVER}/crm/opinionFeedback.json?token=${token}&content=${this.smsContent.value}`, config)
        .then(res => res.json())
        .then((json => {
          if (json.code === 0) {
            this.setState({
              isSuccess: true,
            });
          } else {
            this.setState({
              isError: '请联系管理员',
            });
          }
        }))
        .then(err => err);
    }
  }

  handleStatistics() {
    if (this.smsContent.value !== '') {
      this.setState({
        isSubmit: false,
      });
    } else {
      this.setState({
        isSubmit: true,
      });
    }
  }

  closeNotification() {
    this.setState({
      isSuccess: false,
    });
  }

  render() {
    return (
      <View>
        <Container className="hm-suggest">
          <DeafaultHeader title="意见反馈" history={this.props.history} />
          <Notification
            title="无法发送!"
            amStyle="alert"
            visible={this.state.isError !== ''}
            animated
            onDismiss={this.closeNotification}
          >
            {this.state.isError}
          </Notification>
          <Notification
            title="发送成功!"
            amStyle="success"
            visible={this.state.isSuccess}
            animated
            onDismiss={this.closeNotification}
          >
            感谢您的反馈！
          </Notification>
          <div className="text-wrapper">
            <textarea
              rows="8"
              ref={(c) => { this.smsContent = c; }}
              className="suggestText"
              onKeyUp={this.handleStatistics}
              placeholder="请写下对“禾苗·导购助手”的宝贵意见与建议"
            />
          </div>
          <Button
            id="hm_send_suggest_commit"
            amStyle="warning"
            amSize="sm"
            className="hm-send-suggest"
            onClick={this.handleSubmit}
            disabled={this.state.isSubmit}
          >
            <span>发送</span>
          </Button>
        </Container>
      </View>
    );
  }
}

PerformanceSuggest.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.object,
};

function mapStateToProps(state) {
}

export default connect(mapStateToProps)(PerformanceSuggest);
