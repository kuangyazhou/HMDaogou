/* eslint max-len: [0] */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { If } from 'react-if';
import moment from 'moment';
import { Link } from 'react-router';
import {
  Container,
  Grid,
  Col,
  Notification,
  View,
} from 'amazeui-touch';

// actions.
import {
  invalidateCustomerPage,
  selectCustomerPage,
  fetchTopCustomers,
  fetchCustomers,
  fetchPhoneCall,
  resetCustomers,
  DEFAULT_QUERY_PARAM,
} from '../../../actions/customers/list';

// API Utils.
import {
  getToken,
  removeCustomers,
  getFilterConditions,
  getCustomers,
  removeFilterConditions,
  setKeyWords,
  getKeyWords,
  removeKeyWords,
} from '../../../utils/apiUtils';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../../utils/domUtils';

// constants.
// import {
//   CUSTOMER_FILTER,
// } from '../../../utils/constants';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';
import List from '../../../components/hm-customer-list/List.jsx';
import PagerNav from '../../../components/hm-pager-status/PagerStatus.jsx';

// assets.

import './customer.list.scss';

class CustomerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      isSucceed: false,
      BuyTimeOrder: '', // BuyTimeAsc BuyTimeDesc
      RegTimeOrder: '',
      NoBuyOrder: '',
      show: false,
      queryType: '',
      queryObj: '',
      isShowModal: false,
      showOrhide: false,
    };
    this.BuyTimeOrder = '';
    this.RegTimeOrder = '';
    this.NoBuyOrder = '';
    this.BindOrder = '';
    this.RegTimeOrder = '';
    this.containerRect = null;
    this.handleMoreCustomers = this.handleMoreCustomers.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleResetCustomers = this.handleResetCustomers.bind(this);
    this.handleOrderFilter = this.handleOrderFilter.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.openSearchInput = this.openSearchInput.bind(this);
    this.cancleSearch = this.cancleSearch.bind(this);
  }

  componentDidMount() {
    const { dispatch, children } = this.props;
    const { taskType, keyword, brandId, month, seriesId, catId, goodsId, compositionId, contactType } = this.props.params;
    const checkedOrderType = JSON.parse(sessionStorage.getItem('checkedOrderType'));
    const keywords = getKeyWords();
    this.queryStr.value = keywords || '';
    let nextPageNum;
    let orderName;
    let orderType;
    if (getCustomers() !== null) {
      nextPageNum = getCustomers().pager.currentPage;
    }
    if (checkedOrderType !== null) {
      orderName = checkedOrderType.orderName;
      orderType = checkedOrderType.orderType;
      switch (orderName) {
        case 'BuyTimeOrder': {
          this.BuyTimeOrder = orderType;
          this.BindOrder = '';
          this.RegTimeOrder = '';
          break;
        }
        case 'BindOrder': {
          this.BuyTimeOrder = '';
          this.BindOrder = orderType;
          this.RegTimeOrder = '';
          break;
        }
        case 'RegTimeOrder': {
          this.BuyTimeOrder = '';
          this.BindOrder = '';
          this.RegTimeOrder = orderType;
          break;
        }
        default:
      }
    }
    const filterConditions = getFilterConditions();
    this.queryObj = filterConditions;
    if (this.props.params.newCustomer === 'RegTimeDesc') {
      orderType = 'RegTimeDesc';
      this.RegTimeOrder = 'RegTimeDesc';
      dispatch(fetchCustomers(Object.assign({}, DEFAULT_QUERY_PARAM, {
        regStartTime: moment().startOf('month').format('YYYY-MM-DD'),
        sort: 'RegTimeDesc',
      })));
      return;
    }
    // 计算客户列表的宽度, 由于列表是定位元素, 宽度无法从外部容器获取.
    this.containerRect = this.header.getBoundingClientRect();
    // 根据不同的路由获取不同的数据.
    if (isEmpty(taskType) && isEmpty(keyword) && isEmpty(filterConditions) && isEmpty(brandId) && isEmpty(checkedOrderType)
      && isEmpty(seriesId) && isEmpty(catId) && isEmpty(goodsId) && isEmpty(compositionId) && isEmpty(keywords) && isEmpty(this.props.params.newCustomer)
      && isEmpty(contactType)
    ) {
      dispatch(fetchTopCustomers(DEFAULT_QUERY_PARAM));
      // 从过滤列表跳转
    } else {
      let params;
      if (brandId) {
        params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, {
          pageSize: 15,
          currentPage: nextPageNum,
          sort: orderType,
          taskType,
          brandId,
          taskTarget: keyword,
          keywords,
          contactType,
        });
      } else if (seriesId) {
        params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, {
          pageSize: 15,
          currentPage: nextPageNum,
          sort: orderType,
          taskType,
          seriesId,
          taskTarget: keyword,
          keywords,
          contactType,
        });
      } else if (catId) {
        params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, {
          pageSize: 15,
          currentPage: nextPageNum,
          sort: orderType,
          taskType,
          catId,
          taskTarget: keyword,
          keywords,
          contactType,
        });
      } else if (goodsId) {
        params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, {
          pageSize: 15,
          currentPage: nextPageNum,
          sort: orderType,
          taskType,
          goodsId,
          taskTarget: keyword,
          keywords,
          contactType,
        });
      } else if (compositionId) {
        params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, {
          pageSize: 15,
          currentPage: nextPageNum,
          sort: orderType,
          taskType,
          compositionId,
          taskTarget: keyword,
          keywords,
          contactType,
        });
      } else {
        params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, {
          pageSize: 15,
          currentPage: nextPageNum,
          sort: orderType,
          taskType,
          taskTarget: keyword,
          keywords,
          contactType,
        });
      }
      dispatch(
        fetchCustomers(params)
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      show: false,
    });
    if (!isEmpty(nextProps.error)) {
      this.Modal.setState({
        isErrorHappend: true,
      });
    }
    return false;
  }

  handleShowModal() {
    this.setState({
      isShowModal: true,
    });
  }

  handleMoreCustomers(nextPageNum) {
    const { taskType, keyword, brandId, month, seriesId, catId, goodsId, compositionId, contactType, newCustomer } = this.props.params;
    const checkedOrderType = JSON.parse(sessionStorage.getItem('checkedOrderType'));
    const filterConditions = getFilterConditions();
    const keywords = getKeyWords();
    let orderType;
    let params;
    const { dispatch } = this.props;
    if (nextPageNum) {
      if (checkedOrderType !== null) {
        orderType = checkedOrderType.orderType;
        if (brandId) {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: orderType,
            taskType,
            brandId,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        } else if (seriesId) {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: orderType,
            taskType,
            seriesId,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        } else if (catId) {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: orderType,
            taskType,
            catId,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        } else if (goodsId) {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: orderType,
            taskType,
            goodsId,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        } else if (compositionId) {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: orderType,
            taskType,
            compositionId,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        } else if (newCustomer) {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: 'RegTimeDesc',
            regStartTime: moment().startOf('month').format('YYYY-MM-DD'),
            taskType,
            goodsId,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        } else {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: orderType,
            taskType,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        }
      } else if (checkedOrderType === null) {
        if (brandId) {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: this.queryType,
            taskType,
            brandId,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        } else if (seriesId) {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: this.queryType,
            taskType,
            seriesId,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        } else if (catId) {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: this.queryType,
            taskType,
            catId,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        } else if (goodsId) {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: this.queryType,
            taskType,
            goodsId,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        } else if (compositionId) {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: this.queryType,
            taskType,
            compositionId,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        } else if (newCustomer) {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: 'RegTimeDesc',
            regStartTime: moment().startOf('month').format('YYYY-MM-DD'),
            taskType,
            goodsId,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        } else {
          params = Object.assign({}, DEFAULT_QUERY_PARAM, filterConditions, this.queryObj, {
            pageSize: 15,
            currentPage: nextPageNum,
            sort: this.queryType,
            taskType,
            taskTarget: keyword,
            keywords,
            contactType,
          });
        }
      }
      dispatch(fetchCustomers(params));
    }
  }

  handleResetCustomers() {
    const { dispatch } = this.props;
    dispatch(resetCustomers());
  }

  handleOrderFilter(e) {
    e.preventDefault();
    const self = this;
    const { dispatch } = this.props;
    const { taskType, keyword, brandId, month, seriesId, catId, goodsId, compositionId, contactType } = this.props.params;
    const textDOM = e.currentTarget.querySelector('.text');
    const orderName = `${textDOM.getAttribute('data-order-name')}Order`;
    let orderType = textDOM.getAttribute('data-order');
    const checkOrderType = function checkOrderType(oType, oPrefix) {
      if (!orderType) {
        return `${oPrefix}Asc`;
      } else if (orderType === `${oPrefix}Asc`) {
        return `${oPrefix}Desc`;
      } else if (orderType === `${oPrefix}Desc`) {
        return `${oPrefix}Asc`;
      }
      return '';
    };
    switch (orderName) {
      case 'BuyTimeOrder': {
        orderType = checkOrderType(orderType, 'BuyTime');
        this.BuyTimeOrder = orderType;
        this.BindOrder = '';
        this.RegTimeOrder = '';
        break;
      }
      case 'BindOrder': {
        orderType = checkOrderType(orderType, 'Bind');
        this.BuyTimeOrder = '';
        this.BindOrder = orderType;
        this.RegTimeOrder = '';
        break;
      }
      case 'RegTimeOrder': {
        orderType = checkOrderType(orderType, 'RegTime');
        this.BuyTimeOrder = '';
        this.BindOrder = '';
        this.RegTimeOrder = orderType;
        break;
      }
      default:
    }
    this.queryType = orderType;
    const obj = { orderName, orderType };
    sessionStorage.setItem('checkedOrderType', JSON.stringify(obj));
    const filterConditions = getFilterConditions();
    const keywords = getKeyWords();
    setTimeout(() => {
      let queryJSONObj;
      if (filterConditions !== null) {
        if (brandId) {
          queryJSONObj = Object.assign(
            {},
            { sort: orderType },
            DEFAULT_QUERY_PARAM,
            filterConditions,
            { taskType, taskTarget: keyword, brandId, keywords, contactType }
          );
        } else if (seriesId) {
          queryJSONObj = Object.assign(
            {},
            { sort: orderType },
            DEFAULT_QUERY_PARAM,
            filterConditions,
            { taskType, taskTarget: keyword, seriesId, keywords, contactType }
          );
        } else if (catId) {
          queryJSONObj = Object.assign(
            {},
            { sort: orderType },
            DEFAULT_QUERY_PARAM,
            filterConditions,
            { taskType, taskTarget: keyword, catId, keywords, contactType }
          );
        } else if (goodsId) {
          queryJSONObj = Object.assign(
            {},
            { sort: orderType },
            DEFAULT_QUERY_PARAM,
            filterConditions,
            { taskType, taskTarget: keyword, goodsId, keywords, contactType }
          );
        } else if (compositionId) {
          queryJSONObj = Object.assign(
            {},
            { sort: orderType },
            DEFAULT_QUERY_PARAM,
            filterConditions,
            { taskType, taskTarget: keyword, compositionId, keywords, contactType }
          );
        } else {
          queryJSONObj = Object.assign(
            {},
            { sort: orderType },
            DEFAULT_QUERY_PARAM,
            filterConditions,
            { taskType, taskTarget: keyword, keywords, contactType }
          );
        }
      } else if (filterConditions === null) {
        if (brandId) {
          queryJSONObj = Object.assign(
            {},
            { sort: orderType },
            DEFAULT_QUERY_PARAM,
            { taskType, taskTarget: keyword, brandId, keywords, contactType }
          );
        } else if (seriesId) {
          queryJSONObj = Object.assign(
            {},
            { sort: orderType },
            DEFAULT_QUERY_PARAM,
            { taskType, taskTarget: keyword, seriesId, keywords, contactType }
          );
        } else if (catId) {
          queryJSONObj = Object.assign(
            {},
            { sort: orderType },
            DEFAULT_QUERY_PARAM,
            { taskType, taskTarget: keyword, catId, keywords, contactType }
          );
        } else if (goodsId) {
          queryJSONObj = Object.assign(
            {},
            { sort: orderType },
            DEFAULT_QUERY_PARAM,
            { taskType, taskTarget: keyword, goodsId, keywords, contactType }
          );
        } else if (compositionId) {
          queryJSONObj = Object.assign(
            {},
            { sort: orderType },
            DEFAULT_QUERY_PARAM,
            { taskType, taskTarget: keyword, compositionId, keywords, contactType }
          );
        } else {
          queryJSONObj = Object.assign(
            {},
            { sort: orderType },
            DEFAULT_QUERY_PARAM,
            { taskType, taskTarget: keyword, keywords, contactType }
          );
        }
      }
      self.nextOrPrevPage = 0;
      // removeCustomers();
      dispatch(fetchCustomers(queryJSONObj));
    }, 300);
  }

  handleFocus() {
    const { dispatch } = this.props;
    this.setState({
      show: true,
    });
  }

  handleBlur() {
    setTimeout(() => {
      this.setState({
        show: false,
      });
    }, 0);
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
  }

  handleSearch(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    if (this.queryStr && this.queryStr.value !== '') {
      const queryJSONObj = Object.assign({}, DEFAULT_QUERY_PARAM, {
        keywords: this.queryStr.value,
      });
      this.nextOrPrevPage = 0;
      // removeCustomers();
      dispatch(fetchCustomers(queryJSONObj));
      setKeyWords(this.queryStr.value);
      this.allCustomers = []; // 搜索后需要将页面的缓存一并清除
      // this.reloadIScroll();
    }
  }

  // 关闭掉notify栏
  closeNotification(e) {
    e.preventDefault();
    this.setState({
      isErrorHappend: false,
      isSucceed: false,
    });
  }

  render() {
    const { error, list, pager, hotMemberLabelList, params } = this.props;
    const token = getToken();
    const activeList = sessionStorage.getItem('activeList');
    const shoppingTime = sessionStorage.getItem('shoppingTime');
    let filterConditions;
    if (getFilterConditions()) {
      if (getFilterConditions().shoppingDateStart !== '' ||
        getFilterConditions().shoppingDateEnd !== '' ||
        getFilterConditions().brandId !== '' ||
        getFilterConditions().goodsSn !== ''
      ) {
        filterConditions = getFilterConditions();
      }
    }
    let className;
    if (activeList || shoppingTime || filterConditions) {
      className = `${'hm-filter-item'} ${'small'} ${'choose'}`;
    } else {
      className = `${'hm-filter-item'} ${'small'}`;
    }
    return (
      <View>
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
          title="成功了!"
          amStyle="success"
          visible={this.state.isSucceed}
          animated
          onDismiss={this.closeNotification}
        >
          电话拨打记录已经被保存.
        </Notification>
        <If condition={!this.props.isFetching}>
          <PagerNav pager={pager} />
        </If>
        {
          this.state.isShowModal &&
          <div className="loading-modal">
            <i className="iconfont icon-jiazai hm-pulse hm-loading" />
          </div>
        }
        {
          !this.state.showOrhide &&
          <DefaultHeader
            title="客户列表"
            history={this.props.history}
            type="special"
            openSearchInput={this.openSearchInput}
          />
        }
        <div className="hm-customerlist-header" ref={(c) => { this.header = c; }}>
          <form action="post" onSubmit={this.handleSearch}>
            <Grid className={this.state.showOrhide ? 'show' : 'hide'}>
              <Col cols={5} className="search">
                <input
                  id="hm_list_search"
                  type="text"
                  name="q"
                  ref={(c) => { this.queryStr = c; }}
                  required
                  placeholder="可输入姓名、手机号、线下会员卡号"
                />
                <span id="hm_list_search_icon" className="icon icon-search" onClick={this.handleSearch} />
              </Col>
              <Col cols={1}>
                <span className="cancle" onClick={this.cancleSearch}>取消</span>
              </Col>
            </Grid>
          </form>
          <div className="tips-filter">
            <a id="hm_filter_buy_time_button" className="hm-filter-item middle" onClick={this.handleOrderFilter}>
              <If condition={this.BuyTimeOrder === ''}>
                <div className="hm-filter-item-inner">
                  <span className="text" data-order-name="BuyTime" data-order="">购买时间</span>
                  <i className="iconfont icon-shangxiajiantou" />
                </div>
              </If>
              <If condition={this.BuyTimeOrder === 'BuyTimeAsc'}>
                <div className="hm-filter-item-inner">
                  <span className="text active" data-order-name="BuyTime" data-order="BuyTimeAsc">购买时间</span>
                  <i className="iconfont icon-shixinjiantoushang active" />
                </div>
              </If>
              <If condition={this.BuyTimeOrder === 'BuyTimeDesc'}>
                <div className="hm-filter-item-inner">
                  <span className="text active" data-order-name="BuyTime" data-order="BuyTimeDesc">购买时间</span>
                  <i className="iconfont icon-shixinjiantouxia active" />
                </div>
              </If>
            </a>
            <a id="hm_filter_bind_button" className="hm-filter-item middle" onClick={this.handleOrderFilter}>
              <If condition={this.BindOrder === ''}>
                <div className="hm-filter-item-inner">
                  <span className="text" data-order-name="Bind" data-order="">绑定客户</span>
                  <i className="iconfont icon-shangxiajiantou" />
                </div>
              </If>
              <If condition={this.BindOrder === 'BindAsc'}>
                <div className="hm-filter-item-inner">
                  <span className="text active" data-order-name="Bind" data-order="BindAsc">绑定客户</span>
                  <i className="iconfont icon-shixinjiantoushang active" />
                </div>
              </If>
              <If condition={this.BindOrder === 'BindDesc'}>
                <div className="hm-filter-item-inner">
                  <span className="text active" data-order-name="Bind" data-order="BindDesc">绑定客户</span>
                  <i className="iconfont icon-shixinjiantouxia active" />
                </div>
              </If>
            </a>
            <a id="hm_filter_reg_time_button" className="hm-filter-item middle" onClick={this.handleOrderFilter}>
              <If condition={this.RegTimeOrder === ''}>
                <div className="hm-filter-item-inner">
                  <span className="text" data-order-name="RegTime" data-order="">注册时间</span>
                  <i className="iconfont icon-shangxiajiantou" />
                </div>
              </If>
              <If condition={this.RegTimeOrder === 'RegTimeAsc'}>
                <div className="hm-filter-item-inner">
                  <span className="text active" data-order-name="RegTime" data-order="RegTimeAsc">注册时间</span>
                  <i className="iconfont icon-shixinjiantoushang active" />
                </div>
              </If>
              <If condition={this.RegTimeOrder === 'RegTimeDesc'}>
                <div className="hm-filter-item-inner">
                  <span className="text active" data-order-name="RegTime" data-order="RegTimeDesc">注册时间</span>
                  <i className="iconfont icon-shixinjiantouxia active" />
                </div>
              </If>
            </a>
            <Link id="hm_filter_button" to="/customer/filter" className={className} state={{ prevPath: this.props.location.pathname }}>
              <div className="hm-filter-item-inner">
                <span className="text">筛选</span>
                <i className="iconfont icon-shaixuanxuanzhong" />
              </div>
            </Link>
          </div>
        </div>
        <Container scrollable className="ks-grid">
          <List
            pager={pager}
            userToken={token}
            customers={list}
            isFetching={this.props.isFetching}
            onPhoneCall={this.handlePhoneCall}
            requestData={this.handleMoreCustomers}
            resetData={this.handleResetCustomers}
            handleShowModal={this.handleShowModal}
            newTaskType={params.taskType}
          />
        </Container>
      </View>
    );
  }
}

CustomerList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pager: PropTypes.object.isRequired,
  list: PropTypes.array.isRequired,
  error: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  hotMemberLabelList: PropTypes.array,
  location: React.PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { customersByPage } = state;
  const { filtedProductsByCID } = state;
  if (!customersByPage.customers) {
    // todo: 需要在此处应用应用程序缓存, 在后台数据无法获取的时候, 我们使用保存在应用缓存的数据.
    return {
      pager: {
        pageSize: 20,
        pageTotalCount: 0,
        totalItem: 0,
        currentPage: 0,
      },
      list: [],
      isFetching: true,
      didInvalidate: false,
      error: {},
      products: [],
      sort: '',
    };
  }

  return {
    pager: customersByPage.pager,
    list: customersByPage.customers,
    isFetching: customersByPage.isFetching,
    didInvalidate: customersByPage.didInvalidate,
    error: customersByPage.error || {},
  };
}

export default connect(mapStateToProps)(CustomerList);

// 备用, 目前涮选还是直接跳走旧有系统.
// <a className="icon-button" href={`${CUSTOMER_FILTER}${token}`}>
//   <i className="iconfont-customer-list">&#xe601;</i>
//   <span className="text filter">自由筛选</span>
// </a>
