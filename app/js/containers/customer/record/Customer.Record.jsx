/* eslint max-len: [0] */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Container,
  Button,
  Notification,
  View,
  Group,
  List,
} from 'amazeui-touch';

// actions.
import {
  fetchCustomerRecords,
  postCustomerRecord,
} from '../../../actions/customers/record.js';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import './customer.record.scss';

class Record extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: '',
      isSuccess: false,
      visible: false,
      isSubmit: false,
      amStyle: '',
    };
    this.firstLoaded = true;
    this.handleSubmitComment = this.handleSubmitComment.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { params } = this.props;
    const memerId = params.memberId;
    dispatch(fetchCustomerRecords(memerId));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.code === 0) {
      this.setState({
        isSuccess: true,
      });
    }
    return true;
  }

  closeNotification() {
    this.setState({
      isErrorHappend: '',
      visible: false,
      isSubmit: false,
    });
  }

  handleSubmitComment(e) {
    const { dispatch } = this.props;
    const { params } = this.props;
    const memerId = params.memberId;
    const txtRecord = this.domRecord.value;
    if (!txtRecord || txtRecord === '') {
      this.setState({
        isErrorHappend: '备注内容不能为空.',
      });
    } else {
      this.setState({
        isSubmit: true,
        visible: true,
      });
      this.domRecord.value = '';
      dispatch(postCustomerRecord(memerId, txtRecord));
      setTimeout(() => { dispatch(fetchCustomerRecords(memerId)); }, 500);
    }
  }

  render() {
    const {
      error,
      code,
      pager,
      records,
      submiting,
    } = this.props;

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
          title="恭喜!"
          amStyle="success"
          visible={this.state.visible}
          animated
          onDismiss={this.closeNotification}
        >
          提交备注成功!
        </Notification>
        <DefaultHeader title="备注" history={this.props.history} />
        <div className="ks-grid hm-customer-record">
          <Group
            header="用户备注"
            noPadded
          >
            <textarea
              rows="5"
              placeholder="请输入备注文字信息(最多不超过200字)."
              ref={(c) => { this.domRecord = c; }}
              maxLength="200"
            />
          </Group>
          <Button
            id="hm_customer_record_commit"
            amStyle="warning"
            amSize="lg"
            onClick={this.handleSubmitComment}
            disabled={this.state.isSubmit}
          >
            <span>提交备注</span>
          </Button>
        </div>
        <Container scrollable className="ks-grid hm-customer-record-list">
          <List>
            {
              records.length !== 0 ?
                records.map((record, idx) => {
                  const reactKey = `record-${record.id}`;
                  return (
                    <List.Item
                      key={reactKey}
                      after={moment(record.recordDate).format('YYYY年MM月DD号 HH:MM:SS')}
                      desc={record.recordContent}
                    />
                  );
                }) :
                (<h3>&nbsp;</h3>)
            }
          </List>
        </Container>
      </View>
    );
  }
}

Record.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  code: PropTypes.number,
  pager: PropTypes.object.isRequired,
  records: PropTypes.array.isRequired,
  submiting: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { customerRecord } = state;
  if (!customerRecord.code
    && customerRecord.code !== 0
    && !customerRecord.pager) {
    return {
      error: {},
      code: -999,
      pager: {},
      records: [],
      submiting: false,
    };
  }
  return {
    error: state.error || {},
    code: customerRecord.code,
    pager: customerRecord.pager || {},
    records: customerRecord.records || [],
    submiting: customerRecord.submiting || false,
  };
}

export default connect(mapStateToProps)(Record);
