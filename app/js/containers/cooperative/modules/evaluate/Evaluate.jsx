/* eslint  no-nested-ternary: [0]*/
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import moment from 'moment';

import {
  Container,
  View,
  Tabs,
} from 'amazeui-touch';

// API Utils.
import { sortObj } from '../../../../utils/apiUtils';

import DefaultHeader from '../../../../components/hm-default-header/DefaultHeader.jsx';

import { fetchCustomerEvaluate } from '../../../../actions/customers/evaluate';

import './evaluate.scss';

class Evaluate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: 'service',
      isSelected: 'all',
    };
    // this.checkDescribe = this.checkDescribe.bind(this);
    this.checkType = this.checkType.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCustomerEvaluate('1'));
  }

  // checkDescribe(e) {
  //   const type = e.currentTarget.getAttribute('data-top');
  //   switch (type) {
  //     case 'service':
  //       this.setState({
  //         isChecked: 'service',
  //       });
  //       break;
  //     case 'environment':
  //       this.setState({
  //         isChecked: 'environment',
  //       });
  //       break;
  //     case 'quality':
  //       this.setState({
  //         isChecked: 'quality',
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // }

  checkType(e) {
    const type = e.currentTarget.getAttribute('data-bottom');
    switch (type) {
      case 'all':
        this.setState({
          isSelected: 'all',
        });
        break;
      case 'high':
        this.setState({
          isSelected: 'high',
        });
        break;
      case 'middle':
        this.setState({
          isSelected: 'middle',
        });
        break;
      case 'low':
        this.setState({
          isSelected: 'low',
        });
        break;
      default:
        break;
    }
  }

  renderGradeRatings(commentRank) {
    const maxStarts = 5;
    const ratingsJSX = [];
    let ratings = parseInt(commentRank, 10);
    let emptyStarts = maxStarts - ratings;
    while (ratings > 0 && ratings <= maxStarts) {
      ratingsJSX.push(
        <i className="iconfont icon-star" key={`rank-ok-${ratings}`} />
      );
      ratings--;
    }
    while (emptyStarts > 0 && emptyStarts <= maxStarts) {
      ratingsJSX.push(
        <i className="iconfont icon-star_off" key={`rank-nok-${emptyStarts}`} />
      );
      emptyStarts--;
    }
    return (
      <div className="hm-grade-ratings-container">
        <div className="hm-grade-ratings-starts">
          {ratingsJSX}
        </div>
      </div>
    );
  }

  render() {
    const { evaluate, isEvaluateGet } = this.props;
    let newEvaluate = [];
    let contentJSX;
    if (evaluate) {
      if (this.state.isChecked === 'service' && this.state.isSelected === 'all') {
        newEvaluate = sortObj(evaluate, 'clerk', 'down');
      } else if (this.state.isChecked === 'service' && this.state.isSelected === 'high') {
        evaluate.forEach((item, idx) => {
          if (item.clerk === '5') {
            newEvaluate.push(item);
          }
        });
      } else if (this.state.isChecked === 'service' && this.state.isSelected === 'middle') {
        evaluate.forEach((item, idx) => {
          if (item.clerk > '2' && item.clerk < '5') {
            newEvaluate.push(item);
            newEvaluate = sortObj(newEvaluate, 'clerk', 'down');
          }
        });
      } else if (this.state.isChecked === 'service' && this.state.isSelected === 'low') {
        evaluate.forEach((item, idx) => {
          if (item.clerk >= '0' && item.clerk <= '2') {
            newEvaluate.push(item);
            newEvaluate = sortObj(newEvaluate, 'clerk', 'down');
          }
        });
      } else if (this.state.isChecked === 'environment' && this.state.isSelected === 'all') {
        newEvaluate = sortObj(evaluate, 'environment', 'down');
      } else if (this.state.isChecked === 'environment' && this.state.isSelected === 'high') {
        evaluate.forEach((item, idx) => {
          if (item.environment === '5') {
            newEvaluate.push(item);
          }
        });
      } else if (this.state.isChecked === 'environment' && this.state.isSelected === 'middle') {
        evaluate.forEach((item, idx) => {
          if (item.environment > '2' && item.environment < '5') {
            newEvaluate.push(item);
            newEvaluate = sortObj(newEvaluate, 'environment', 'down');
          }
        });
      } else if (this.state.isChecked === 'environment' && this.state.isSelected === 'low') {
        evaluate.forEach((item, idx) => {
          if (item.environment >= '0' && item.environment <= '2') {
            newEvaluate.push(item);
            newEvaluate = sortObj(newEvaluate, 'environment', 'down');
          }
        });
      } else if (this.state.isChecked === 'quality' && this.state.isSelected === 'all') {
        newEvaluate = sortObj(evaluate, 'quality', 'down');
      } else if (this.state.isChecked === 'quality' && this.state.isSelected === 'high') {
        evaluate.forEach((item, idx) => {
          if (item.quality === '5') {
            newEvaluate.push(item);
          }
        });
      } else if (this.state.isChecked === 'quality' && this.state.isSelected === 'middle') {
        evaluate.forEach((item, idx) => {
          if (item.quality > '2' && item.quality < '5') {
            newEvaluate.push(item);
            newEvaluate = sortObj(newEvaluate, 'quality', 'down');
          }
        });
      } else if (this.state.isChecked === 'quality' && this.state.isSelected === 'low') {
        evaluate.forEach((item, idx) => {
          if (item.quality >= '0' && item.quality <= '2') {
            newEvaluate.push(item);
            newEvaluate = sortObj(newEvaluate, 'quality', 'down');
          }
        });
      }
    }
    if (isEvaluateGet) {
      if (newEvaluate.length > 0) {
        contentJSX = (
          newEvaluate.map((item, idx) => {
            const key = `idx-${idx}`;
            return (
              <li key={key}>
                <a onClick={this.handleChick}>
                  <div className="evaluate-wrapper">
                    <div className="evalaute-describe">
                      <div className="type">
                        <div className="top">
                          <span><b>{item.name}</b></span>
                          <span>{moment(item.addTime).format('YYYY-MM-DD')}</span>
                        </div>
                        <div className="bottom">
                          <span>
                            服务态度：{this.renderGradeRatings(item.clerk)}
                          </span>
                          <span>
                            购物环境：{this.renderGradeRatings(item.environment)}
                          </span>
                          <span>商品质量：{this.renderGradeRatings(item.quality)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="evalaute-main">{item.evaluate}</p>
                  </div>
                </a>
              </li>
            );
          })
        );
      } else {
        contentJSX = <li className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</li>;
      }
    } else {
      contentJSX = (<li className="hm-loading-wrapper">
        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
      </li>);
    }
    return (
      <View>
        <Container className="hm-evaluate-more">
          <DefaultHeader title="评价详情" history={this.props.history} />
          {/* <div className="top-tab">
            <button
              id="hm_evaluate_attitude"
              className={this.state.isChecked === 'service' && 'active'}
              onClick={this.checkDescribe}
              data-top="service"
            >
              服务态度
            </button>
            <button
              id="hm_evaluate_environment"
              className={this.state.isChecked === 'environment' && 'active'}
              onClick={this.checkDescribe}
              data-top="environment"
            >
              购物环境
              </button>
            <button
              id="hm_evaluate_quality"
              className={this.state.isChecked === 'quality' && 'active'}
              onClick={this.checkDescribe}
              data-top="quality"
            >
              商品质量
            </button>
          </div> */}
          <div className="bottom-tab">
            <button
              id="hm_evaluate_all"
              className={this.state.isSelected === 'all' && 'active'}
              onClick={this.checkType}
              data-bottom="all"
            >
              全部
            </button>
            <button
              id="hm_evaluate_good"
              className={this.state.isSelected === 'high' && 'active'}
              onClick={this.checkType}
              data-bottom="high"
            >
              好评
            </button>
            <button
              id="hm_evaluate_middle"
              className={this.state.isSelected === 'middle' && 'active'}
              onClick={this.checkType}
              data-bottom="middle"
            >
              中评
            </button>
            <button
              id="hm_evaluate_low"
              className={this.state.isSelected === 'low' && 'active'}
              onClick={this.checkType}
              data-bottom="low"
            >
              差评
            </button>
          </div>
          <ul className="hm-compilation-list">
            {contentJSX}
          </ul>
        </Container>
      </View>
    );
  }
}

Evaluate.propTypes = {
  dispatch: PropTypes.func.isRequired,
  evaluate: PropTypes.array.isRequired,
  isEvaluateGet: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { customerEvaluate } = state;
  return {
    evaluate: customerEvaluate.evaluate,
    isEvaluateGet: customerEvaluate.isEvaluateGet,
  };
}

export default connect(mapStateToProps)(Evaluate);
