import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';
import {
  Container,
  Button,
  Notification,
  Icon,
  Field,
  List,
} from 'amazeui-touch';

// actions.
import {
  fetchMarketingReasons,
  postAddMarketing,
  fetchMarketings,
  postSendCoupon,
} from '../../../actions/customers/marketing.js';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

// API Utils.
import {
  getToken,
} from '../../../utils/apiUtils';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../../utils/domUtils';

import './marketing.scss';

class HMMarketing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      isSuccess: false,
      isEmpty: false,
      isChecked: false,
      isNotChecked: false,
      isSubmit: false,
      isReset: true,
      isNotBind: false,
      isSended: false,
      isFailed: false,
      isSubmitReason: false,
      isReasonFailed: false,
    };
    this.handleCommitMarketing = this.handleCommitMarketing.bind(this);
    this.handleSpecifyMarketing = this.handleSpecifyMarketing.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }

  componentDidMount() {
    const { dispatch, marketing } = this.props;
    const { type, phone, realname, offlineId, isBind } = this.props.params;
    if (type === 'memberMarketing') {
      dispatch(fetchMarketingReasons());
      dispatch(fetchMarketings(offlineId));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { sendCustomerCoupon } = this.props;
    const { type, phone, realname, offlineId, isBind } = this.props.params;
    if (isBind === 'notBind' && type === 'specifyMarketing') {
      this.setState({
        isNotBind: true,
        isSubmit: true,
      });
    }
    // 发送优惠券
    switch (type) {
      case 'specifyMarketing':
        if (this.state.isSended && nextProps.sendCustomerCoupon.isSmsSended) {
          if (nextProps.sendCustomerCoupon.smsReturnCode === 0) {
            this.setState({
              isChecked: true,
            });
          } else {
            this.setState({
              isFailed: true,
            });
          }
        }
        break;
      case 'memberMarketing':
        if (this.state.isSubmitReason && nextProps.sendCustomerMarketing.isReasonFetching) {
          if (nextProps.sendCustomerMarketing.reasonCode === 0) {
            this.setState({
              isSuccess: true,
            });
          } else {
            this.setState({
              isReasonFailed: true,
            });
          }
        }
        break;
      default:
        break;
    }
  }


  handleCommitMarketing(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    const { offlineId } = this.props.params;
    const note = this.noteForMarketing.value;
    const selectedReason = this.selectedReason.getSelectedOptions();
    this.setState({
      isSubmit: true,
      isSubmitReason: true,
    });
    this.noteForMarketing.value = '';
    dispatch(postAddMarketing(offlineId, note, selectedReason));
  }

  // 发送优惠券
  handleSpecifyMarketing(e) {
    e.preventDefault();
    const { dispatch, sendCustomerCoupon } = this.props;
    const { couponId, offlineId, couponName } = this.props.params;
    const textForSms = this.textForSms.getValue();
    const selectedCounts = this.selectedcounts.getSelectedOptions();
    const couponType = this.couponType.context;
    if (couponId === '0' || couponType === '') {
      this.setState({
        isNotChecked: true,
      });
    } else {
      this.setState({
        isSubmit: true,
        isReset: false,
        isSended: true, // 检测是否提交了发送优惠券的请求
      });
      dispatch(postSendCoupon(offlineId, couponId, selectedCounts, couponName));
    }
  }

  closeNotification(e) {
    e.preventDefault();
    this.setState({
      isErrorHappend: false,
      isSuccess: false,
      isEmpty: false,
      isChecked: false,
      isFailed: false,
      isNotChecked: false,
      isSubmit: false,
      isReasonFailed: false,
    });
  }

  closeAlert(e) {
    e.preventDefault();
    this.setState({
      isNotBind: false,
    });
  }


  render() {
    const { type, phone, realname, offlineId,
      couponId, couponName, isBind, sendCustomerCoupon } = this.props.params;
    const { marketing, error } = this.props;
    const reasons = marketing.reasons.pageItems;
    const marketings = marketing.marketings.pageItems;
    return (
      <Container className="ks-grid hm-marketing-container">
        <Notification
          title="请稍后再来!"
          amStyle="alert"
          visible={this.state.isErrorHappend}
          animated
          onDismiss={this.closeNotification}
        >
          服务器正在卖力处理中
          {/* {error && error.message}.*/}
        </Notification>
        <Notification
          title="失败了!"
          amStyle="alert"
          visible={this.state.isNotChecked}
          animated
          onDismiss={this.closeNotification}
        >
          未选择优惠券
        </Notification>
        <Notification
          title="失败了!"
          amStyle="alert"
          visible={this.state.isFailed}
          animated
          onDismiss={this.closeNotification}
        >
          发送失败
        </Notification>
        <Notification
          title="成功了!"
          amStyle="success"
          visible={this.state.isChecked}
          animated
          onDismiss={this.closeNotification}
        >
          发送成功
        </Notification>
        <Notification
          title="成功了!"
          amStyle="success"
          visible={this.state.isSuccess}
          animated
          onDismiss={this.closeNotification}
        >
          提交成功
        </Notification>
        <Notification
          title="失败了!"
          amStyle="alert"
          visible={this.state.isReasonFailed}
          animated
          onDismiss={this.closeNotification}
        >
          提交失败
      </Notification>
        <Notification
          title="无法发送!"
          amStyle="alert"
          visible={this.state.isNotBind}
          animated
          onDismiss={this.closeAlert}
        >
          该用户未绑定微信，无法发券
        </Notification>
        {/* 已有券发放 */}
        <If condition={type === 'memberMarketing'}>
          <div>
            <DefaultHeader title="申请券发放" history={this.props.history} />
            <main className="hm-customer-vip-order-main">
              <ul className="marketing-list">
                <li>
                  <p className="label">营销会员</p>
                  {/* <span>{`${phone}(${realname})`}</span>*/}
                  <span>{`${realname}`}</span>
                </li>
                <li>
                  <p className="label">营销原因</p>
                  <Field
                    id="hm_marketing_select"
                    type="select"
                    ref={select => { this.selectedReason = select; }}
                  >
                    {reasons && reasons.map((reason, idx) => {
                      const ridx = `reason-${idx}`;
                      return (
                        <option key={ridx} value={reason.id}>{reason.name}</option>
                      );
                    })}
                  </Field>
                </li>
              </ul>
              <div className="replenish">
                <span className="label">补充说明</span>
                <textarea
                  type="textarea"
                  placeholder="针对该营销手段的补充说明"
                  ref={textarea => { this.noteForMarketing = textarea; }}
                />
              </div>
              <Button
                id="hm_marketing_commit"
                block
                amStyle="alert"
                onClick={this.handleCommitMarketing}
                disabled={this.state.isSubmit}
              >
                提交审核
              </Button>
            </main>
            <List className="hm-market-list">
              {marketings && marketings.map((market, idx) => {
                const midx = `market-${idx}`;
                let state = '';
                switch (market.state) {
                  case '0':
                    state = '通过';
                    break;
                  case '1':
                    state = '不通过';
                    break;
                  case '2':
                    state = '审核中';
                    break;
                  default:
                }
                return (
                  <List.Item
                    key={midx}
                    title={market.reason}
                    subTitle={
                      market.remark === '' ?
                        '未添加备注' :
                        market.remark
                    }
                    after={state}
                  />
                );
              })}
            </List>
          </div>
        </If>
        {/* 已有券发放 */}
        <If condition={type === 'specifyMarketing'}>
          <div>
            <DefaultHeader title="已有券发放" history={this.props.history} />
            <main className="hm-customer-assign-order-main">
              <ul className="marketing-list">
                <li>
                  <p className="label">营销会员</p>
                  <span>{`${realname}`}</span>
                </li>
                <li>
                  <a
                    id="hm_marketing_choose_coupon_link"
                    href={`#/customer/coupon/list/${isBind}/${phone}/${offlineId}/${realname}`}
                  >
                    <p className="label">选择优惠券</p>
                    <p>
                      {
                        this.state.isReset &&
                        <span ref={c => { this.couponType = c; }}>
                          {
                            couponName ? `已选${couponName}` : ''
                          }
                        </span>
                      }
                      <Icon name="right-nav" />
                    </p>
                  </a>
                </li>
                <li>
                  <p className="label">赠送数量</p>
                  <Field
                    id="hm_marketing_coupon_coupon_choose_select"
                    type="select"
                    ref={select => { this.selectedcounts = select; }}
                  >
                    <option value="1">1张/人</option>
                    <option value="2">2张/人</option>
                    <option value="3">3张/人</option>
                    <option value="4">4张/人</option>
                    <option value="5">5张/人</option>
                  </Field>
                </li>
              </ul>
              <div className="replenish hide">
                <span className="label">短信提醒内容</span>
                <Field
                  type="textarea"
                  placeholder="短信提醒内容"
                  ref={textarea => { this.textForSms = textarea; }}
                />
              </div>
              <Button
                id="hm_marketing_send_coupon_button"
                block
                amStyle="alert"
                onClick={this.handleSpecifyMarketing}
                disabled={this.state.isSubmit}
              >发送</Button>
            </main>
          </div>
        </If>
      </Container>
    );
  }
}

HMMarketing.propTypes = {
  dispatch: PropTypes.func,
  error: PropTypes.object,
  marketing: PropTypes.object,
  sendCustomerCoupon: PropTypes.object,
  sendCustomerMarketing: PropTypes.object,
  history: PropTypes.object,
};

function mapStateToProps(state) {
  const { marketing, error, sendCustomerCoupon, sendCustomerMarketing } = state;
  return {
    marketing,
    error,
    sendCustomerCoupon,
    sendCustomerMarketing,
  };
}

export default connect(mapStateToProps)(HMMarketing);
