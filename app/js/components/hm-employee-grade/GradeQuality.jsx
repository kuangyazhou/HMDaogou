/* eslint max-len: [0] */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import {
  Grid,
  Col,
} from 'amazeui-touch';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../utils/domUtils';

// actions.
import { fetchAllGrades } from '../../actions/users/grade.js';

// API Utils.
import { loadUserProfile, loadIdToken } from '../../utils/apiUtils';

import './gradeQuality.scss';

class GradeQuality extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    const { history } = this.props;
    const alink = e.currentTarget;
    const name = alink.getAttribute('data-name');
    const id = loadIdToken().name;
    if (name === id) {
      history.push('/cooperative/ratings/800991/details');
    }
  }

  // 渲染评分具体分数.
  renderGradeRatings(commentRank) {
    const maxStarts = 5;
    const ratingsJSX = [];
    let ratings = parseInt(commentRank, 10);
    let emptyStarts = maxStarts - ratings;
    let rankStr;
    if (ratings === -1) { rankStr = (<span>未评价</span>); }
    if (ratings >= 0 && ratings < 3) { rankStr = (<span>差评</span>); }
    if (ratings >= 3 && ratings < 5) { rankStr = (<span>中评</span>); }
    if (ratings === 5) { rankStr = (<span>好评</span>); }
    while (ratings > 0 && ratings <= maxStarts) {
      ratingsJSX.push(<i className="iconfont icon-star" key={`rank-ok-${ratings}`} />);
      ratings--;
    }
    while (emptyStarts > 0 && emptyStarts <= maxStarts) {
      ratingsJSX.push(<i className="iconfont icon-star_off" key={`rank-nok-${emptyStarts}`} />);
      emptyStarts--;
    }
    return (
      <div className="hm-grade-ratings-container">
        <div className="hm-grade-ratings-starts">
          {ratingsJSX}
        </div>
        <div className="hm-grade-ratings-number">
          {rankStr}
        </div>
      </div>
    );
  }

  render() {
    const { grades } = this.props;
    const id = loadIdToken().name;
    return (
      <div className="hm-grade-quality-container stop-overflow">
        <ul inset className="hm-grade-quality-list">
          {
            grades.list && grades.list.map((grade, idx) => {
              const key = `rank-${idx}`;
              return (
                <li className="item item-content" key={key}>
                  <a
                    href="#/"
                    onClick={this.handleClick}
                    data-name={grade.name}
                  >
                    <div className="item-main">
                      <div className="item-title-row">
                        <div className="item-title">
                          <span>{grade.name ? grade.name : '未登记姓名'}</span>
                          {this.renderGradeRatings(grade.commentRank)}
                        </div>
                        <div
                          className={id === grade.name ? 'to-see' : 'hide'}
                        >
                          查看
                        </div>
                      </div>
                      <div className="item-subtitle">{grade.storeName}</div>
                    </div>
                  </a>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}

GradeQuality.propTypes = {
  grades: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default GradeQuality;
