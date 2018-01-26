import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';
import {
  Container,
  View,
} from 'amazeui-touch';

import HMCard from '../hm-card/Card.jsx';

import './compilation.scss';

class Compilation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
    };
    this.handleDisabled = this.handleDisabled.bind(this);
  }

  handleDisabled(e) {
    e.preventDefault();
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
    const { dataSource, evaluate, isEvaluateGet } = this.props;
    let contentJSX;
    if (isEvaluateGet) {
      if (evaluate.length > 0) {
        contentJSX = evaluate.map((item, idx) => {
          const key = `idx-${idx}`;
          return (
            <li key={key}>
              <a id={`hm_compilation_${idx}`} href="#/" onClick={this.handleDisabled}>
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
                        <span>购物环境：{this.renderGradeRatings(item.environment)}
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
        });
      } else {
        contentJSX = <li className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</li>;
      }
    } else {
      contentJSX = (
        <li className="hm-loading-wrapper">
          <i className="iconfont icon-jiazai hm-pulse hm-loading" />
        </li>
      );
    }
    return (
      <View className="hm-compilation-container">
        {/* <p style={{ textAlign: 'center', marginTop: '1rem' }}>还没有数据</p> */}
        <Container scrollable className="ks-grid hm-compilation-list-container">
          <div className="">
            <HMCard
              cardLinkId="hm_compilation_more_link"
              title="评价"
              iconName="icon-star"
              handleMore="#/cooperative/compilation/800991/evaluate"
              isEvaluate
            >
              <ul className="hm-compilation-list">
                {contentJSX}
              </ul>
            </HMCard>
          </div>
        </Container>
      </View>
    );
  }
}

Compilation.propTypes = {
  dataSource: PropTypes.object.isRequired,
  evaluate: PropTypes.array.isRequired,
  isEvaluateGet: PropTypes.bool,
  history: PropTypes.object.isRequired,
};

export default Compilation;

