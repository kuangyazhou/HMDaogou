import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  View,
  Grid,
  Col,
  Tabs,
  Accordion,
} from 'amazeui-touch';
import './monthCoupon.scss';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

class MonthCoupon extends React.Component {
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
    // const { staffMonthContact } = this.props;
    // const txtVal = e.target.value;
    // const result = [];
    // staffMonthContact.forEach((item, idx) => {
    //   if (txtVal !== '' && item.store_user_name.indexOf(txtVal) !== -1) {
    //     result.push(item);
    //   }
    // });
    // this.setState({
    //   result,
    // });
  }

  render() {
    return (
      <View>
        <Container className="hm-store-coupon-container">
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
          <div className="hm-sale-statistics-nav">
            <Tabs
              className="hm-manager-home-nav"
            >
              <Tabs.Item
                title="有效券"
                navStyle="alert"
              >
                <Accordion defaultActiveKey={1}>
                  <Accordion.Item
                    title="十元绑定礼金"
                    eventKey={1}
                  >
                    <dl className="coupon-detail-list">
                      <dt>
                        <span className="name">导购</span>
                        <span className="workNum">工号</span>
                        <span className="total">总券数</span>
                        <span className="sended">已发放</span>
                        <span className="used">已使用</span>
                      </dt>
                      <dd>
                        <span className="name">门湾湾</span>
                        <span className="workNum">62151318</span>
                        <span className="total">85</span>
                        <span className="sended">64</span>
                        <span className="used">64</span>
                      </dd>
                    </dl>
                  </Accordion.Item>
                  <Accordion.Item
                    title="十元绑定礼金"
                    eventKey={2}
                  >
                  1
                  </Accordion.Item>
                </Accordion>
              </Tabs.Item>
              <Tabs.Item
                title="过期券"
                navStyle="alert"
              >
                <Accordion defaultActiveKey={1} className="time_up">
                  <Accordion.Item
                    title="十元绑定礼金"
                    eventKey={1}
                  >
                    <dl className="coupon-detail-list">
                      <dt>
                        <span className="name">导购</span>
                        <span className="workNum">工号</span>
                        <span className="total">总券数</span>
                        <span className="sended">已发放</span>
                        <span className="used">已使用</span>
                      </dt>
                      <dd>
                        <span className="name">门湾湾</span>
                        <span className="workNum">62151318</span>
                        <span className="total">85</span>
                        <span className="sended">64</span>
                        <span className="used">64</span>
                      </dd>
                    </dl>
                  </Accordion.Item>
                  <Accordion.Item
                    title="十元绑定礼金"
                    eventKey={2}
                  >
                  1
                  </Accordion.Item>
                </Accordion>
              </Tabs.Item>
            </Tabs>
          </div>
        </Container>
      </View>
    );
  }
}

MonthCoupon.propTypes = {
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(MonthCoupon);
