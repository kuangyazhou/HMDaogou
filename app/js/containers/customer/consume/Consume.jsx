/* eslint  no-nested-ternary: [0]*/
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { If } from 'react-if';


import {
  Container,
  View,
} from 'amazeui-touch';

import { getCustomerConsumeRank } from '../../../actions/customers/consume';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import './consume.scss';

class Consume extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: 'today',
    };
    this.checkType = this.checkType.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getCustomerConsumeRank());
  }

  rederTopThree(index) {
    let contentJSX = '';
    if (index + 1 === 1) {
      contentJSX = (
        <div className="top-one">
          <i className="iconfont icon-diyiming" />
        </div>
      );
    } else if (index + 1 === 2) {
      contentJSX = (
        <div className="top-two">
          <i className="iconfont icon-dierming" />
        </div>
      );
    } else if (index + 1 === 3) {
      contentJSX = (
        <div className="top-three">
          <i className="iconfont icon-disanming" />
        </div>
      );
    } else {
      contentJSX = (
        <div>
          {index + 1}
        </div>
      );
    }
    return contentJSX;
  }

  checkType(e) {
    const type = e.currentTarget.getAttribute('data-type');
    switch (type) {
      case 'today':
        this.setState({
          isSelected: 'today',
        });
        break;
      case 'yesterday':
        this.setState({
          isSelected: 'yesterday',
        });
        break;
      case 'lastWeek':
        this.setState({
          isSelected: 'lastWeek',
        });
        break;
      case 'lastMonth':
        this.setState({
          isSelected: 'lastMonth',
        });
        break;
      default:
        break;
    }
  }

  render() {
    const { consumeRank, isConsumeRankGet } = this.props;
    // const userDetailsUrl = `/customer/details/${customer.id}|${customer.idOld}`;
    let todayConsumeRank;
    let yesterdayConsumeRank;
    let lastWeekConsumeRank;
    let lastMonthComsumeRank;
    let contentJSX;
    if (consumeRank) {
      todayConsumeRank = consumeRank.todayConsumeRank;
      yesterdayConsumeRank = consumeRank.yesterdayConsumeRank;
      lastWeekConsumeRank = consumeRank.lastWeekConsumeRank;
      lastMonthComsumeRank = consumeRank.lastMonthComsumeRank;
    }
    if (isConsumeRankGet) {
      if (todayConsumeRank.length > 0) {
        contentJSX = todayConsumeRank.map((item, idx) => {
          const key = `idx-${idx}`;
          return (
            <li key={key}>
              <a href={`#/customer/details/${item.consumeId}`}>
                <div className="left">
                  {this.rederTopThree(idx)}
                  <div className="name">{item.name}</div>
                </div>
                <div className="right">
                  ￥{Number(item.consumeMoney).toLocaleString()}
                  <span className="icon icon-right-nav" />
                </div>
              </a>
            </li>
          );
        });
      } else {
        contentJSX = <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>;
      }
    } else {
      contentJSX = (<div className="hm-loading-wrapper">
        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
      </div>);
    }
    return (
      <View>
        <Container className="hm-consume">
          <DefaultHeader title="消费排行" history={this.props.history} />
          <div className="consume-tab">
            <button
              className={this.state.isSelected === 'today' && 'active'}
              onClick={this.checkType}
              data-type="today"
            >
              今日消费
            </button>
            <button
              className={this.state.isSelected === 'yesterday' && 'active'}
              onClick={this.checkType}
              data-type="yesterday"
            >
              昨日消费
            </button>
            <button
              className={this.state.isSelected === 'lastWeek' && 'active'}
              onClick={this.checkType}
              data-type="lastWeek"
            >
              上周消费
            </button>
            <button
              className={this.state.isSelected === 'lastMonth' && 'active'}
              onClick={this.checkType}
              data-type="lastMonth"
            >
              上月消费
            </button>
          </div>
          <div className="consume-list-wrapper">
            <If condition={this.state.isSelected === 'today'}>
              <ul className="consume-list">
                {contentJSX}
              </ul>
            </If>
            <If condition={this.state.isSelected === 'yesterday'}>
              <ul className="consume-list">
                {
                  yesterdayConsumeRank && yesterdayConsumeRank.length > 0 ?
                    yesterdayConsumeRank.map((item, idx) => {
                      const key = `idx-${idx}`;
                      return (
                        <li key={key}>
                          <a href={`#/customer/details/${item.consumeId}`}>
                            <div className="left">
                              {this.rederTopThree(idx)}
                              <div className="name">{item.name}</div>
                            </div>
                            <div className="right">
                              ￥{Number(item.consumeMoney).toLocaleString()}
                              <span className="icon icon-right-nav" />
                            </div>
                          </a>
                        </li>
                      );
                    }) :
                    <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>
                }
              </ul>
            </If>
            <If condition={this.state.isSelected === 'lastWeek'}>
              <ul className="consume-list">
                {
                  lastWeekConsumeRank && lastWeekConsumeRank.length > 0 ?
                    lastWeekConsumeRank.map((item, idx) => {
                      const key = `idx-${idx}`;
                      return (
                        <li key={key}>
                          <a href={`#/customer/details/${item.consumeId}`}>
                            <div className="left">
                              {this.rederTopThree(idx)}
                              <div className="name">{item.name}</div>
                            </div>
                            <div className="right">
                              ￥{Number(item.consumeMoney).toLocaleString()}
                              <span className="icon icon-right-nav" />
                            </div>
                          </a>
                        </li>
                      );
                    }) :
                    <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>
                }
              </ul>
            </If>
            <If condition={this.state.isSelected === 'lastMonth'}>
              <ul className="consume-list">
                {
                  lastMonthComsumeRank && lastMonthComsumeRank.length > 0 ?
                    lastMonthComsumeRank.map((item, idx) => {
                      const key = `index-${idx}`;
                      return (
                        <li key={key}>
                          <a href={`#/customer/details/${item.consumeId}`}>
                            <div className="left">
                              {this.rederTopThree(idx)}
                              <div className="name">{item.name}</div>
                            </div>
                            <div className="right">
                              ￥{Number(item.consumeMoney).toLocaleString()}
                              <span className="icon icon-right-nav" />
                            </div>
                          </a>
                        </li>
                      );
                    }) :
                    <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>
                }
              </ul>
            </If>
          </div>
        </Container>
      </View >
    );
  }
}

Consume.propTypes = {
  dispatch: PropTypes.func.isRequired,
  consumeRank: PropTypes.object.isRequired,
  isConsumeRankGet: PropTypes.bool,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { customerConsumeRank } = state;
  return {
    consumeRank: customerConsumeRank.consumeRank,
    isConsumeRankGet: customerConsumeRank.isConsumeRankGet,
  };
}

export default connect(mapStateToProps)(Consume);
