import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {
  Container,
  View,
  Tabs,
} from 'amazeui-touch';

import { loadIdToken } from '../../utils/apiUtils';

// Tabs Modules.
import GradeQuality from '../../components/hm-employee-grade/GradeQuality.jsx';
import Sales from '../../components/hm-employee-sales/Sales.jsx';
import Compilation from '../../components/hm-employee-compilation/Compilation.jsx';
import DefaultHeader from '../../components/hm-default-header/DefaultHeader.jsx';

// actions.
import { fetchAllGrades } from '../../actions/users/grade';
import { fetchStoreSales } from '../../actions/store/sales';
import { fetchCustomerCompilations } from '../../actions/customers/compilation';
import { fetchCustomerEvaluate } from '../../actions/customers/evaluate';

import { outerHeight, getViewportHeight } from '../../utils/domUtils.js';

import './cooperative.scss';

class Cooperative extends React.Component {
  constructor(props) {
    super(props);
    this.moduleMapping = {
      compilation: 0, // 客诉管理
      ratings: 1, // 员工评级
      sales: 2, // 门店销售
    };
    this.state = {
      isErrorHappend: false,
      isShowModal: false,
    };
    this.handleToOtherPage = this.handleToOtherPage.bind(this);
  }

  componentDidMount() {
    const { params } = this.props;
    const { dispatch } = this.props;
    // 页面初始化完成后, 需要根据不同的模块加载数据.
    dispatch(fetchAllGrades());
    const viewportHeight = getViewportHeight();
    const tabbarHeight = outerHeight(document.querySelector('.tabbar'));
    const container = document.querySelector('.hm-cooperative-container');
    if (container) {
      container.style.height = `${viewportHeight - tabbarHeight}px`;
    }
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'store') {
        navList[i].addEventListener('click', this.handleToOtherPage);
      }
    }
  }

  componentWillUnmount() {
    const navList = document.querySelectorAll('[data-tab-name]');
    for (let i = 0; i < navList.length; i++) {
      if (navList[i].getAttribute('data-tab-name') !== 'store') {
        navList[i].removeEventListener('click', this.handleToOtherPage);
      }
    }
  }

  handleToOtherPage(e) {
    this.setState({
      isShowModal: true,
    });
  }

  // 渲染标题
  renderTabTitle(iconName, title) {
    return (
      <div className="hm-cooperative-tab-header">
        <i className={iconName} />
        <div className="text">{title}</div>
      </div>
    );
  }

  render() {
    const { params, children, location } = this.props;
    const { user } = this.props;
    const { customerCompilation, customerEvaluate } = this.props;
    const memberId = params.memberId;
    const userName = loadIdToken().name;
    let contentJSX;
    let myRanking = 0;
    let myScore = 0;
    let myEvaluateCount = 0;
    if (memberId) {
      contentJSX = React.cloneElement(children, { key: location.key });
    } else {
      contentJSX = (
        <View className="hm-cooperative-container scrollable">
          <Container className="ks-grid">
            {
              this.state.isShowModal &&
              <div className="loading-modal">
                <i className="iconfont icon-jiazai hm-pulse hm-loading" />
              </div>
            }
            <div>
              <DefaultHeader title="评价" type="normal" />
              <div className="hm-evaluate">
                <div className="evaluate-to-me">
                  <div className="icon-wrapper">
                    <span>{userName}</span>
                    <i className="line" />
                  </div>
                  <div className="other-info">
                    <div>
                      <div>{myRanking}</div>
                      <span>我的排行</span>
                    </div>
                    <div>
                      <div>{myEvaluateCount}</div>
                      <span>评价人数</span>
                    </div>
                    <div>
                      <div>{myScore}</div>
                      <span>平均分</span>
                    </div>
                    <div className="to-evaluate-details">
                      <a href="#/cooperative/compilation/800991/evaluate">
                        详情
                        <span className="icon icon-right-nav" />
                      </a>
                    </div>
                  </div>
                </div>
                <ul className="score-rank-list">
                  {
                    user.allGrades.list && user.allGrades.list.length > 0 &&
                    user.allGrades.list.map((item, idx) => {
                      const key = `key-${idx}`;
                      let iconContent;
                      if (item.name === userName) {
                        myScore = item.commentRank;
                        myRanking = idx;
                        myEvaluateCount = item.count;
                      }
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
                      }
                      return (
                        <li>
                          <div className="icon-wrapper">
                            {iconContent}
                          </div>
                          <div className="staff-wrapper">
                            <div className="staff">
                              <div>
                                {item.name}
                                <span className="workNum">工号{item.workNum}</span>
                              </div>
                              <span className="evaluate-count">评价人数：{item.count}人</span>
                            </div>
                            <div className="average-score">
                              平均分：{item.commentRank}分
                            </div>
                          </div>
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            </div>
          </Container>
        </View>
      );
    }
    return (
      contentJSX
    );
  }
}

Cooperative.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  stores: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  customerCompilation: PropTypes.object.isRequired,
  customerEvaluate: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  const { user } = state;
  const { stores } = state;
  const { customerCompilation, customerEvaluate } = state;
  if (!user) {
    return {
      user: {
        allGrades: [],
      },
      stores: {
        userSales: [],
      },
      customerCompilation: {
        compilations: [],
        pager: {},
      },
      customerEvaluate: [{
        addTime: '',
        clerk: '',
        environment: '',
        evaluate: '',
        name: '',
        phone: '',
        quality: '',
      }],
    };
  }
  return {
    user,
    stores,
    customerCompilation,
    customerEvaluate,
  };
}

export default connect(mapStateToProps)(Cooperative);
