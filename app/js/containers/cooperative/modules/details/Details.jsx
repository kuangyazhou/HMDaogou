import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { If, Then, Else } from 'react-if';
import moment from 'moment';
import {
  Container,
  Grid,
  Col,
  View,
} from 'amazeui-touch';

// actions.
import { fetchGradesPerPerson } from '../../../../actions/users/grade.js';

import './details.scss';


class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
    };
  }

  componentDidMount() {
    const { params } = this.props;
    const { dispatch } = this.props;
    // 默认是员工评级选项卡激活.
    dispatch(fetchGradesPerPerson());
  }

  // 渲染评分具体分数.
  renderGradeRatings(commentRank) {
    const maxStarts = 5;
    const ratingsJSX = [];
    const ratings = parseInt(commentRank, 10);
    let raringsTmp = ratings;
    let emptyStarts = maxStarts - ratings;
    let rankStr = '';
    // 计算具体的星数.
    while (raringsTmp > 0 && raringsTmp <= maxStarts) {
      ratingsJSX.push(
        <i className="iconfont icon-star" key={`r-${raringsTmp}`} />
      );
      raringsTmp--;
    }
    while (emptyStarts > 0 && emptyStarts <= maxStarts) {
      ratingsJSX.push(
        <i className="iconfont icon-star_off" key={`r-${emptyStarts}`} />
      );
      emptyStarts--;
    }
    // 计算好评差评或中评.
    if (ratings === -1) { rankStr = (<span>未评价</span>); }
    if (ratings >= 0 && ratings < 3) { rankStr = (<span>差评</span>); }
    if (ratings >= 3 && ratings < 5) { rankStr = (<span>中评</span>); }
    if (ratings === 5) { rankStr = (<span>好评</span>); }

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

  renderGradeOnlyRatings(commentRank) {
    const maxStarts = 5;
    const ratingsJSX = [];
    let ratings = parseInt(commentRank, 10);
    let emptyStarts = maxStarts - ratings;
    // 计算具体的星数.
    while (ratings > 0 && ratings <= maxStarts) {
      ratingsJSX.push(
        <i className="iconfont icon-star" key={`r-${ratings}`} />
      );
      ratings--;
    }
    while (emptyStarts > 0 && emptyStarts <= maxStarts) {
      ratingsJSX.push(
        <i className="iconfont icon-star_off" key={`r-${emptyStarts}`} />
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

  // 渲染评价日期
  renderGradeDate(timestamp) {
    moment.locale('zh-CN');
    return moment(timestamp).format('YYYY年MM月DD号, hh:mm:ss');
  }


  render() {
    const { user } = this.props;
    return (
      <View>
        <header className="hm-grade-details-header">
          <Grid>
            <Col cols={4}>
              <Grid className="hm-grade-user-profile">
                <Col cols={6}>
                  <span className="text">{user.grade.details && user.grade.details.name}</span>
                  {this.renderGradeOnlyRatings(user.grade.details && user.grade.details.rank)}
                </Col>
              </Grid>
            </Col>
            <Col cols={2} className="hm-grade-user-ranks">
              <Link
                title="查看全部排行"
                to="/cooperative/ratings"
                className="btn-all-grade"
              ><span>查看全部排行</span></Link>
            </Col>
          </Grid>
        </header>
        <Container scrollable className="ks-grid">
          <ul className="list list-inset hm-all-grade-list">
            {user.grade.list.map((rank, idx) => {
              const reactKey = `rank-${idx}`;
              return (
                <li className="item item-content" key={reactKey}>
                  <div className="item-main">
                    <div className="item-title-row">
                      <div className="item-title">
                        <span className="hm-grade-customer-name">{rank.realName}</span>
                        <div className="hm-grade-ratings-details">
                          {this.renderGradeRatings(rank.commentRank)}
                        </div>
                      </div>
                      <div className="item-after">{this.renderGradeDate(rank.addTime)}</div>
                    </div>
                    <div className="item-subtitle">{rank.content}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </View>
    );
  }
}

Details.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { user } = state;
  if (!user) {
    return {
      user: {
        grade: {
          name: '',
          rank: '',
          pager: {},
          list: [],
        },
      },
    };
  }
  return {
    user,
  };
}

export default connect(mapStateToProps)(Details);
