import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import { browserHistory } from 'react-router';
import {
  Container,
  View,
  Tabs,
  Grid,
  Col,
} from 'amazeui-touch';

import { sortObj } from '../../../utils/apiUtils.js';

import { fetchStaffMonthContact } from '../../../actions/store/staffTask.js';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import './contacted.scss';

class Contacted extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOrhide: false,
      result: [],
    };
    this.openSearchInput = this.openSearchInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.cancleSearch = this.cancleSearch.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchStaffMonthContact());
  }

  openSearchInput() {
    this.setState({
      showOrhide: !this.state.showOrhide,
    });
    // state有延迟需要延迟加上定时器
    setTimeout(() => {
      this.queryStr.focus();
    }, 0);
  }

  cancleSearch() {
    this.openSearchInput();
    this.queryStr.blur();
    this.setState({
      result: [],
    });
  }

  handleSearch(e) {
    const { staffMonthContact } = this.props;
    const txtVal = e.target.value;
    const result = [];
    staffMonthContact.forEach((item, idx) => {
      if (txtVal !== '' && item.store_user_name.indexOf(txtVal) !== -1) {
        result.push(item);
      }
    });
    this.setState({
      result,
    });
  }
  render() {
    const { staffMonthContact, isStaffMonthContactGet } = this.props;
    const header = (
      <div className="hm-rank-title">
        <span className="rank">排名</span>
        <span className="name">名称</span>
        <span className="count">交易数/联系数</span>
      </div>
    );
    let byPhone = [];
    let bySms = [];
    let byWechat = [];
    let iconContent;
    staffMonthContact.forEach((item, idx) => {
      switch (item.contact_type) {
        case 'call':
          byPhone.push(item);
          byPhone = sortBy(byPhone, (val) => -(val.sales_sum / val.contacts_sum));
          break;
        case 'sms':
          bySms.push(item);
          bySms = sortBy(bySms, (val) => -(val.sales_sum / val.contacts_sum));
          break;
        case 'wechat':
          byWechat.push(item);
          byWechat = sortBy(byWechat, (val) => -(val.sales_sum / val.contacts_sum));
          break;
        default:
          break;
      }
    });
    return (
      <View>
        <Container className="hm-contacted" scrollable>
          {
            !this.state.showOrhide &&
            <DefaultHeader
              title="月员工客户追踪详情"
              history={this.props.history}
              type="special"
              openSearchInput={this.openSearchInput}
              mode
            />
          }
          <div className="hm-search-form">
            <Grid className={this.state.showOrhide ? 'show' : 'hide'}>
              <Col cols={5} className="search">
                <input
                  id="hm_login_search"
                  type="text"
                  name="q"
                  ref={(c) => { this.queryStr = c; }}
                  required
                  onChange={this.handleSearch}
                  placeholder="可输入姓名"
                />
                <span
                  id="hm_login_search_icon"
                  className="icon icon-search"
                  onClick={this.handleSearch}
                />
              </Col>
              <Col cols={1}>
                <span className="cancle" onClick={this.cancleSearch}>取消</span>
              </Col>
            </Grid>
          </div>
          {
            this.state.result.length > 0 &&
            <div className="hm-search-result">
              <div className="hm-progress-rank-title">
                <span className="name">姓名</span>
                <span className="count">交易数/联系数</span>
              </div>
              <div className="hm-new-progress-wrapper">
                {
                  this.state.result.map((item, idx) => {
                    const key = `idx-${idx}`;
                    return (
                      <div className="hm-new-progress" key={key}>
                        <div className="name">
                          {item.store_user_name}
                        </div>
                        <div className="count">
                          {item.sales_sum}/{item.contacts_sum}
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          }
          <div className="hm-sale-statistics-nav">
            <Tabs
              className="hm-manager-home-nav"
            >
              <Tabs.Item
                title="电话回访"
                navStyle="alert"
              >
                <div className="hm-staff-contact">
                  {header}
                  <ul className="hm-rank-list">
                    {
                      byPhone.length > 0 ? byPhone.map((item, idx) => {
                        const key = `idx-${idx}`;
                        switch (idx) {
                          case 0:
                            iconContent = <i className="iconfont icon-diyiming" />;
                            break;
                          case 1:
                            iconContent = <i className="iconfont icon-dierming" />;
                            break;
                          case 2:
                            iconContent = <i className="iconfont icon-disanming" />;
                            break;
                          default:
                            iconContent = idx + 1;
                            break;
                        }
                        return (
                          <li key={key}>
                            <div className="icon-wrapper rank">
                              {iconContent}
                            </div>
                            <div className="name">
                              {item.store_user_name}
                            </div>
                            <div className="count">
                              {item.sales_sum}/{item.contacts_sum}
                            </div>
                          </li>
                        );
                      })
                        : <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />
                          还没有数据
                        </p>
                    }
                  </ul>
                </div>
              </Tabs.Item>
              <Tabs.Item
                title="短信回访"
                navStyle="alert"
              >
                <div className="hm-staff-contact">
                  {header}
                  <ul className="hm-rank-list">
                    {
                      bySms.length > 0 ? bySms.map((item, idx) => {
                        const key = `idx-${idx}`;
                        switch (idx) {
                          case 0:
                            iconContent = <i className="iconfont icon-diyiming" />;
                            break;
                          case 1:
                            iconContent = <i className="iconfont icon-dierming" />;
                            break;
                          case 2:
                            iconContent = <i className="iconfont icon-disanming" />;
                            break;
                          default:
                            iconContent = idx + 1;
                            break;
                        }
                        return (
                          <li key={key}>
                            <div className="icon-wrapper rank">
                              {iconContent}
                            </div>
                            <div className="name">
                              {item.store_user_name}
                            </div>
                            <div className="count">
                              {item.sales_sum}/{item.contacts_sum}
                            </div>
                          </li>
                        );
                      })
                        : <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />
                          还没有数据
                      </p>
                    }
                  </ul>
                </div>
              </Tabs.Item>
              <Tabs.Item
                title="微信回访"
                navStyle="alert"
              >
                <div className="hm-staff-contact">
                  {header}
                  <ul className="hm-rank-list">
                    {
                      byWechat.length > 0 ? byWechat.map((item, idx) => {
                        const key = `idx-${idx}`;
                        switch (idx) {
                          case 0:
                            iconContent = <i className="iconfont icon-diyiming" />;
                            break;
                          case 1:
                            iconContent = <i className="iconfont icon-dierming" />;
                            break;
                          case 2:
                            iconContent = <i className="iconfont icon-disanming" />;
                            break;
                          default:
                            iconContent = idx + 1;
                            break;
                        }
                        return (
                          <li key={key}>
                            <div className="icon-wrapper rank">
                              {iconContent}
                            </div>
                            <div className="name">
                              {item.store_user_name}
                            </div>
                            <div className="count">
                              {item.sales_sum}/{item.contacts_sum}
                            </div>
                          </li>
                        );
                      })
                        : <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />
                          还没有数据
                      </p>
                    }
                  </ul>
                </div>
              </Tabs.Item>
            </Tabs>
          </div>
        </Container>
      </View>
    );
  }
}

Contacted.propTypes = {
  dispatch: PropTypes.func.isRequired,
  staffMonthContact: PropTypes.array.isRequired,
  isStaffMonthContactGet: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  if (!stores.staffMonthContact) {
    return {
      isStaffMonthContactGet: false,
      staffMonthContact: [],
    };
  }
  return {
    staffMonthContact: stores.staffMonthContact,
    isStaffMonthContactGet: stores.isStaffMonthContactGet,
  };
}

export default connect(mapStateToProps)(Contacted);
