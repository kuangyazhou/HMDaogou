import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { If } from 'react-if';
import classnames from 'classnames';
import { browserHistory } from 'react-router';
import moment from 'moment';
import {
  Container,
  List,
  Badge,
  View,
  Tabs,
  Button,
  Icon,
  Loader,
} from 'amazeui-touch';

import PagerNav from '../../../components/hm-pager-status/PagerStatus.jsx';
// actions.
import { fetchMyRelations } from '../../../actions/customers/relations';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

// components.
import HMCard from '../../../components/hm-card/Card.jsx';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../../utils/domUtils';

import './relations.scss';

class Relations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPageEnd: classnames('hm-pager fixed'),
    };
    this.isChecked = '00';
    this.isSelected = 1;
    this.currentPage = 1;
    this.isFirstPage = true;
    this.isLastPage = false;
    this.checkDescribe = this.checkDescribe.bind(this);
    this.checkType = this.checkType.bind(this);
    this.loadPrevCustomers = this.loadPrevCustomers.bind(this);
    this.loadNextCustomers = this.loadNextCustomers.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      const viewportHeight = getViewportHeight();
      const header = outerHeight(document.querySelector('.hm-relations-container .top-tab'));
      const nav = outerHeight(document.querySelector('.hm-relations-container .bottom-tab'));
      const footer = outerHeight(document.querySelector('.tabbar'));
      document.querySelector('.main-container').style.height =
        `${viewportHeight - header - nav - footer}px`;
      document.querySelector('.scroll-area').style.height =
        `${viewportHeight - header - nav - footer}px`;
    }, 0);
    const { dispatch } = this.props;
    const startDate = moment().format('YYYY-MM-DD');
    dispatch(
      fetchMyRelations(
        this.isChecked, this.isSelected, this.currentPage, startDate, ''
      )
    );
    this.scrollContainer.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    const { relationsList, pager } = nextProps;
    const currentPage = pager.currentPage;
    const totalPage = pager.totalPage;
    // 需要判定是否后台返回正确的分页页数,
    // 如果没有返回正确的分页, 就维持当前的分页数据.
    if (currentPage <= 1) {
      this.isFirstPage = true;
      this.isLastPage = false;
    }
    if (currentPage > totalPage) {
      this.isFirstPage = false;
      this.isLastPage = true;
    }
    if (currentPage === totalPage) {
      if (totalPage <= 1) {
        this.isFirstPage = true;
        this.isLastPage = true;
      } else {
        this.isFirstPage = false;
        this.isLastPage = true;
      }
    }
    if (currentPage > 1 && currentPage < totalPage) {
      this.isFirstPage = false;
      this.isLastPage = false;
    }
    return true;
  }

  componentWillUnmount() {
    this.scrollContainer.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(e) {
    const scrollTop = this.scrollContainer.scrollTop;
    const offsetHeight = this.scrollContainer.offsetHeight;
    const scrollHeight = this.scrollContainer.scrollHeight;
    if (scrollTop >= scrollHeight - offsetHeight) {
      this.setState({
        isPageEnd: classnames('hm-pager flowed'),
      });
    } else {
      this.setState({
        isPageEnd: classnames('hm-pager fixed'),
      });
    }
  }

  turnPage(nextOrPrev) {
    const { relationsList, isRelationsGet, pager, dispatch } = this.props;
    const currentPage = pager.currentPage;
    const totalPage = pager.totalPage;
    let targetPage = 1;
    let realPage;
    if (currentPage >= totalPage) {
      if (totalPage <= 1) {
        this.isFirstPage = false;
        this.isLastPage = true;
        realPage = totalPage;
      } else {
        this.isFirstPage = false;
        this.isLastPage = true;
        realPage = totalPage - 1;
      }
      return realPage;
    }
    if (currentPage < 1) {
      this.isFirstPage = true;
      this.isLastPage = false;
      return 1;
    }
    if (nextOrPrev === 'next') {
      targetPage = currentPage + 1;
    } else if (nextOrPrev === 'prev') {
      targetPage = currentPage - 1;
    }
    this.currentPage = targetPage;
    return targetPage;
  }

  loadNextCustomers() {
    const { relationsList, isRelationsGet, pager, dispatch } = this.props;
    const nextPage = this.turnPage('next');
    let startDate;
    let endDate;
    let status = this.isSelected;
    if (this.isSelected === 1) {
      startDate = moment().format('YYYY-MM-DD');
      endDate = '';
    } else if (this.isSelected === 3) {
      startDate = '';
      endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
      status = 1;
    }
    dispatch(fetchMyRelations(this.isChecked, status, nextPage, startDate, endDate));
  }

  loadPrevCustomers() {
    const { relationsList, isRelationsGet, pager, dispatch } = this.props;
    const prevPage = this.turnPage('prev');
    let startDate;
    let endDate;
    let status = this.isSelected;
    if (this.isSelected === 1) {
      startDate = moment().format('YYYY-MM-DD');
      endDate = '';
    } else if (this.isSelected === 3) {
      startDate = '';
      endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
      status = 1;
    }
    dispatch(fetchMyRelations(this.isChecked, status, prevPage, startDate, endDate));
  }

  checkDescribe(e) {
    const { dispatch } = this.props;
    const type = e.currentTarget.getAttribute('data-top');
    switch (type) {
      case '00':
        this.isChecked = '00';
        break;
      case '01':
        this.isChecked = '01';
        break;
      case '02':
        this.isChecked = '02';
        break;
      case '03':
        this.isChecked = '03';
        break;
      case '04':
        this.isChecked = '04';
        break;
      case '05':
        this.isChecked = '05';
        break;
      default:
        break;
    }
    let startDate;
    let endDate;
    let status = this.isSelected;
    if (this.isSelected === 1) {
      startDate = moment().format('YYYY-MM-DD');
      endDate = '';
    } else if (this.isSelected === 3) {
      startDate = '';
      endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
      status = 1;
    }
    dispatch(
      fetchMyRelations(this.isChecked, status, 1, startDate, endDate)
    );
  }

  checkType(e) {
    const { dispatch } = this.props;
    const type = e.currentTarget.getAttribute('data-bottom');
    switch (type) {
      case '1':
        this.isSelected = 1;
        break;
      case '0':
        this.isSelected = 0;
        break;
      case '2':
        this.isSelected = 2;
        break;
      case '3':
        this.isSelected = 3;
        break;
      default:
        break;
    }
    let startDate;
    let endDate;
    let status = this.isSelected;
    if (this.isSelected === 1) {
      startDate = moment().format('YYYY-MM-DD');
      endDate = '';
    } else if (this.isSelected === 3) {
      startDate = '';
      endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
      status = 1;
    }
    dispatch(fetchMyRelations(this.isChecked, status, 1, startDate, endDate));
  }

  render() {
    const { relationsList, isRelationsGet, pager } = this.props;
    let contentJSX;
    if (isRelationsGet) {
      if (relationsList.length > 0) {
        contentJSX = relationsList.map((item, idx) => {
          const rule = item.createRule === '00' ||
            item.createRule === 'RandomContactCustomer' ? '' : item.createRule;
          const userDetailsUrl = `#/customer/details/${item.taskTarget}/${rule}`;
          const key = `key-${idx}`;
          let taskType;
          switch (item.createRule) {
            case 'RandomContactCustomer':
              taskType = '其他';
              break;
            case 'RandomChooseByNewTime':
              taskType = '其他';
              break;
            case '01':
              taskType = '新客转化';
              break;
            case '02':
              taskType = '阶段营销';
              break;
            case '03':
              taskType = '流失预警';
              break;
            case '04':
              taskType = '复购推荐';
              break;
            case '05':
              taskType = '成长关怀';
              break;
            default:
              taskType = '成长关怀';
              break;
          }
          const taskDateClass = moment(moment().format('YYYY-MM-DD'))
            .isSame(item.performDate) ? 'date today' : 'date';
          return (
            <li key={key}>
              <a href={userDetailsUrl}>
                <div className="name">
                  <p>{item.taskContent}</p>
                  {
                    this.isChecked === '00' && <span className="task-type">任务类型：{taskType}</span>
                  }
                  <span className={taskDateClass}>任务日期：{item.performDate}</span>
                </div>
                <div className="arrow">
                  <span className="icon icon-right-nav" />
                </div>
              </a>
            </li>
          );
        });
      } else {
        contentJSX = (<li className="empty-customer-list">
          <i className="iconfont icon-meiyouxiaoxi" />
          <span className="hm-dblock">没有查找到合适的人...</span>
        </li>);
      }
    } else {
      contentJSX = (<li className="hm-loading-wrapper">
        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
        <span className="sr-only">正在努力加载..</span>
      </li>);
    }
    return (
      <View className="hm-relations">
        <Container className="ks-grid hm-relations-container scrollable">
          {
            isRelationsGet &&
            <PagerNav pager={pager} />
          }
          <DefaultHeader title="客户跟进" history={this.props.history} />
          <div className="tab-wrapper">
            <div className="top-tab">
              <button
                id="hm_relations_all"
                className={this.isChecked === '00' && 'active'}
                onClick={this.checkDescribe}
                data-top="00"
              >
                全部
            </button>
              <button
                id="hm_relations_newCustomer"
                className={this.isChecked === '01' && 'active'}
                onClick={this.checkDescribe}
                data-top="01"
              >
                新客转化
              </button>
              <button
                id="hm_relations_stage"
                className={this.isChecked === '02' && 'active'}
                onClick={this.checkDescribe}
                data-top="02"
              >
                阶段营销
            </button>
              <button
                id="hm_relations_lose"
                className={this.isChecked === '03' && 'active'}
                onClick={this.checkDescribe}
                data-top="03"
              >
                流失预警
            </button>
              <button
                id="hm_relations_repeatBuy"
                className={this.isChecked === '04' && 'active'}
                onClick={this.checkDescribe}
                data-top="04"
              >
                复购推荐
            </button>
              <button
                id="hm_relations_growth"
                className={this.isChecked === '05' && 'active'}
                onClick={this.checkDescribe}
                data-top="05"
              >
                成长关怀
            </button>
            </div>
            <div className="bottom-tab">
              <button
                id="hm_relations_ready"
                className={this.isSelected === 1 && 'active'}
                onClick={this.checkType}
                data-bottom="1"
              >
                待跟进
            </button>
              <button
                id="hm_relations_did"
                className={this.isSelected === 0 && 'active'}
                onClick={this.checkType}
                data-bottom="0"
              >
                已跟进
            </button>
              <button
                id="hm_relations_will"
                className={this.isSelected === 2 && 'active'}
                onClick={this.checkType}
                data-bottom="2"
              >
                已转化
            </button>
              <button
                id="hm_relations_will"
                className={this.isSelected === 3 && 'active'}
                onClick={this.checkType}
                data-bottom="3"
              >
                已过期
            </button>
            </div>
          </div>
          <div className="main-container">
            <div className="main scroll-area" ref={scroll => (this.scrollContainer = scroll)}>
              <ul className="customer-list">
                {contentJSX}
              </ul>
            </div>
            <If
              condition={
                isRelationsGet && relationsList && relationsList.length > 0 && pager.totalPage > 1
              }
            >
              <div className={this.state.isPageEnd}>
                <Button
                  id="hm_customer_list_pervious_page_button"
                  hollow
                  amSize="lg"
                  disabled={this.isFirstPage}
                  onClick={this.loadPrevCustomers}
                >
                  <Loader className={!isRelationsGet ? '' : 'hide'} />
                  <Icon name="left-nav" />
                  上一页
              </Button>
                <Button
                  id="hm_customer_list_next_page_button"
                  hollow
                  amSize="lg"
                  disabled={this.isLastPage}
                  onClick={this.loadNextCustomers}
                >
                  <Loader className={!isRelationsGet ? '' : 'hide'} />
                  下一页
                <Icon name="right-nav" />
                </Button>
              </div>
            </If>
          </div>
        </Container>
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { customerMyRelations } = state;
  const { relationsList, pager, isRelationsGet } = customerMyRelations;
  if (!customerMyRelations) {
    return {
      relationsList: [],
      pager: {},
      isRelationsGet: false,
    };
  }
  return {
    relationsList,
    isRelationsGet,
    pager,
  };
}

Relations.propTypes = {
  dispatch: PropTypes.func.isRequired,
  relationsList: PropTypes.array.isRequired,
  pager: PropTypes.object.isRequired,
  isRelationsGet: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Relations);
