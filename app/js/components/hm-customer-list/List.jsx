/* eslint max-len: [0] */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { If } from 'react-if';
import classnames from 'classnames';
import {
  Container,
  Button,
  Icon,
  Loader,
} from 'amazeui-touch';

// API Utils.
import {
  setCustomers,
  getCustomers,
  removeCustomers,
} from '../../utils/apiUtils';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../utils/domUtils';

// component.
import {
  HMScroll,
} from '../hm-scroll/Scroll.jsx';

import './list.scss';

class CustomersList extends Component {
  constructor(props) {
    super(props);
    this.nextOrPrevPage = 1;
    this.state = {
      isFirstPage: true,
      isLastpage: false,
      isPageEnd: classnames('hm-pager fixed'),
    };
    this.loadNextCustomers = this.loadNextCustomers.bind(this);
    this.loadPrevCustomers = this.loadPrevCustomers.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // 计算列表容器的实际高度(scroll-area).
    // 稍微延时下执行, 等待React将数据渲染完成.
    setTimeout(() => {
      const viewportHeight = getViewportHeight();
      const header = outerHeight(document.querySelector('.hm-customerlist-header'));
      const footer = outerHeight(document.querySelector('.tabbar'));
      document.querySelector('.hm-customer-detail-list').style.height = `${viewportHeight - header - footer}px`;
      document.querySelector('.scroll-area').style.height = `${viewportHeight - header - footer}px`;
    }, 0);
    // bind scroll event.
    this.scrollContainer.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    // declare some cache variables.
    const { customers, pager } = nextProps;
    const oldCustomers = this.props.customers;
    const currentPage = this.props.pager.currentPage;
    const cachedCustomers = getCustomers() || [];
    // 需要判定是否后台返回正确的分页页数,
    // 如果没有返回正确的分页, 就维持当前的分页数据.
    if (pager.currentPage <= 1) {
      this.setState({
        isFirstPage: true,
        isLastPage: false,
      });
    }
    if (pager.currentPage > pager.totalPage) {
      this.setState({
        isFirstPage: false,
        isLastPage: true,
      });
    }
    if (pager.currentPage === pager.totalPage) {
      if (pager.totalPage <= 1) {
        this.setState({
          isFirstPage: true,
          isLastPage: true,
        });
      } else {
        this.setState({
          isFirstPage: false,
          isLastPage: true,
        });
      }
    }
    if (pager.currentPage > 1 && pager.currentPage < pager.totalPage) {
      this.setState({
        isFirstPage: false,
        isLastPage: false,
      });
    }

    // 保存当前页的结果到缓存中.
    // 当没有网络的时候也可以查看当前页的数据.
    setCustomers(nextProps);

    return true;
  }

  componentWillUnmount() {
    this.props.resetData();
    this.scrollContainer.removeEventListener('scroll', this.handleScroll);
    // removeCustomers();
  }

  handleClick(e) {
    this.props.handleShowModal();
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
    const pager = this.props.pager;
    const totalPage = pager.totalPage;
    const currentPage = pager.currentPage;
    let targetPage = 1;
    let realPage;
    if (currentPage >= totalPage) {
      if (totalPage <= 1) {
        this.setState({
          isLastPage: true,
          isFirstPage: false,
        });
        realPage = totalPage;
      } else {
        this.setState({
          isLastPage: true,
          isFirstPage: false,
        });
        realPage = totalPage - 1;
      }
      return realPage;
    }

    if (currentPage < 1) {
      this.setState({
        isFirstPage: true,
        isLastPage: false,
      });
      return 1;
    }

    if (nextOrPrev === 'next') {
      targetPage = currentPage + 1;
    } else if (nextOrPrev === 'prev') {
      targetPage = currentPage - 1;
    }

    return targetPage;
  }

  loadNextCustomers() {
    const nextPage = this.turnPage('next');
    this.setState({ logging: true });
    this.props.requestData.call(null, nextPage);
  }

  loadPrevCustomers() {
    const prevPage = this.turnPage('prev');
    this.setState({ logging: true });
    this.props.requestData.call(null, prevPage);
  }

  render() {
    const {
      pager,
      userToken,
      customers,
      isFetching,
      newTaskType,
    } = this.props;

    let listJSX = null;
    // 计算最终的列表结果值.
    if (isFetching) {
      listJSX = (
        <div className="empty-customer-list">
          <i className="iconfont icon-jiazai hm-pulse hm-loading" />
          <span className="sr-only">正在努力加载..</span>
        </div>
      );
    } else if (customers.length === 0 && !isFetching) {
      listJSX = (
        <div className="empty-customer-list">
          <i className="iconfont icon-meiyouxiaoxi" />
          <span className="hm-dblock">没有查找到合适的人...</span>
        </div>
      );
    } else {
      const lists =
        customers.map((customer, index) => {
          if (customer) {
            const userDetailsUrl = `/customer/details/${customer.id}/${newTaskType}`;
            const bindClass = customer.isBind === '已绑定' ? 'item-subtitle-section bind' : 'item-subtitle-section notBind';
            return (
              <li
                className="item item-content"
                key={customer.id}
              >
                <Link
                  id={`hm_customer_list_item_${index}`}
                  to={userDetailsUrl}
                  className="item-Container customer_list_link"
                  onClick={this.handleClick}
                >
                  <div className="item-main">
                    <h3 className="item-title user-name-title">
                      {customer.realName}
                    </h3>
                    <div>
                      <If condition={customer.noReturnVisitDays === -1}>
                        <span className="visite">从未回访</span>
                      </If>
                      <If condition={customer.noReturnVisitDays !== -1}>
                        <span className="visite">
                          {
                            customer.noReturnVisitDays === 0 ? '已回访' :
                              `超过${customer.noReturnVisitDays}天未回访`
                          }
                        </span>
                      </If>
                      {
                        customer.isBind ?
                          <span className={bindClass}>{`${customer.isBind}`}微信</span> : ''
                      }
                    </div>
                    <div className="">
                      最近购买时间: <span className={customer.lastShoppingTime ? 'visite' : 'hide'}>{customer.lastShoppingTime.slice(0, 10)}</span>
                      <span className="">注册时间:{customer.regDate}</span>
                    </div>
                  </div>
                </Link>
              </li >
            );
          }
          return null;
        });
      listJSX = (
        <ul className="list">
          {lists}
        </ul>
      );
    }

    return (
      <div className="hm-customer-detail-list">
        <div className="scroll-area" ref={scroll => (this.scrollContainer = scroll)}>
          {listJSX}
        </div>
        <If condition={!this.props.isFetching && customers.length > 0 && this.props.pager.totalPage > 1}>
          <div className={this.state.isPageEnd}>
            <Button
              id="hm_customer_list_pervious_page_button"
              hollow
              amSize="lg"
              disabled={this.state.isFirstPage}
              onClick={this.loadPrevCustomers}
            >
              <Loader className={this.props.isFetching ? '' : 'hide'} />
              <Icon name="left-nav" />
              上一页
            </Button>
            <Button
              id="hm_customer_list_next_page_button"
              hollow
              amSize="lg"
              disabled={this.state.isLastPage}
              onClick={this.loadNextCustomers}
            >
              <Loader className={this.props.isFetching ? '' : 'hide'} />
              下一页
              <Icon name="right-nav" />
            </Button>
          </div>
        </If>
      </div>
    );
  }
}

CustomersList.propTypes = {
  pager: PropTypes.object.isRequired,
  userToken: PropTypes.string.isRequired,
  customers: PropTypes.array.isRequired,
  requestData: PropTypes.func.isRequired,
  onPhoneCall: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  handleShowModal: PropTypes.func.isRequired,
  newTaskType: PropTypes.string.isRequired,
};

export default CustomersList;
