/* eslint prefer-arrow-callback: ["error", { "allowNamedFunctions": true }] */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { includes, cloneDeep } from 'lodash';
import {
  Grid,
  Group,
  Col,
  Field,
  Button,
  ButtonGroup,
} from 'amazeui-touch';

// DOM Utils.
import { isElementInViewport } from '../../utils/domUtils.js';

import { removeFilterConditions, removeKeyWords } from '../../utils/apiUtils.js';

import './customer.filter.scss';

import originMenus from './menus.js';

export default class HMCustomerFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      isPlaceHolderVisible: 'hm-commbox-placeholder opacity-off', // 是否显示placeholder.
      isTxtFocus: 'no-focus', // material设计风格的下划线动画效果.
      isDropdownVisible: 'hm-commbox-list hide',
      productQueryStr: '',
      newParentList: '',
      menus: originMenus,
    };
    this.clonedMenus = cloneDeep(originMenus);
    this.reset = this.reset.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInputEvt = this.handleInputEvt.bind(this);
    this.handleProductSelected = this.handleProductSelected.bind(this);
  }

  componentDidMount() {
    const shoppingTime = JSON.parse(sessionStorage.getItem('shoppingTime'));
    if (shoppingTime != null) {
      this.shoppingDateStart.refs.field.value = shoppingTime.shoppingDateStart;
      this.shoppingDateEnd.refs.field.value = shoppingTime.shoppingDateEnd;
    }
  }

  onDismiss(e) {
    const queryObj = {};
    if (this.state.isDropdownVisible === 'hm-commbox-list') {
      this.productRef.value = '';
      this.setState({
        isDropdownVisible: 'hm-commbox-list hide',
      });
      return;
    }
    // 首先收集输入框.
    queryObj.shoppingDateStart = this.shoppingDateStart.getValue();
    queryObj.shoppingDateEnd = this.shoppingDateEnd.getValue();
    queryObj.brandId = this.productRef.getAttribute('data-val') ?
      this.productRef.getAttribute('data-val') : '';
    queryObj.goodsSn = this.goodsSn.value;
    // 工具函数.
    function iteration(items, qObj, key) {
      items.forEach((item) => {
        if (item.active === 'active') {
          qObj[key] = item.featureCode;
        }
      });
    }
    // 收集具体的涮选条件.
    this.newParentList.forEach((menu) => {
      switch (menu.featureName) {
        case '宝宝性别': {
          iteration(menu.childrenList, queryObj, 'f01');
          break;
        }
        case '宝宝年龄段': {
          iteration(menu.childrenList, queryObj, 'f02');
          break;
        }
        case '消费能力': {
          iteration(menu.childrenList, queryObj, 'f03');
          break;
        }
        case '孕期': {
          iteration(menu.childrenList, queryObj, 'f04');
          break;
        }
        case '客户活跃度': {
          iteration(menu.childrenList, queryObj, 'f05');
          break;
        }
        case '流失客户': {
          iteration(menu.childrenList, queryObj, 'f06');
          break;
        }
        case '商城会员筛选': {
          iteration(menu.childrenList, queryObj, 'isMemberOnline');
          break;
        }
        default:
          break;
      }
    });
    // // 将条件传递给父容器.
    this.props.onSubmit.call(null, queryObj);
    const shoppingTime = {
      shoppingDateStart: queryObj.shoppingDateStart,
      shoppingDateEnd: queryObj.shoppingDateEnd,
    };
    if (shoppingTime.shoppingDateStart !== '' || shoppingTime.shoppingDateEnd !== '') {
      sessionStorage.setItem('shoppingTime', JSON.stringify(shoppingTime));
    }
  }

  handleProductSelected(e) {
    e.preventDefault();
    const selectedVal = e.currentTarget.getAttribute('data-product-id');
    const selectedTxt = e.target.textContent;
    this.productRef.setAttribute('data-val', selectedVal);
    this.productRef.value = selectedTxt;
    this.close();
  }

  handleInputEvt(e) {
    const eventType = e.type;
    switch (eventType) {
      case 'focus':
        this.setState({
          isTxtFocus: 'is-focus',
        });
        break;
      case 'change': {
        const txtVal = e.target.value;
        if (txtVal !== '') {
          this.setState({
            isPlaceHolderVisible: 'hm-commbox-placeholder opacity-on',
            isDropdownVisible: 'hm-commbox-list',
            productQueryStr: txtVal,
          });
        } else {
          this.setState({
            isPlaceHolderVisible: 'hm-commbox-placeholder opacity-off',
            isDropdownVisible: 'hm-commbox-list hide',
            productQueryStr: '',
          });
        }
        break;
      }
      case 'blur':
        this.setState({
          isTxtFocus: 'is-focus hide',
        });
        break;
      default:
        break;
    }
  }

  handleClick(e) {
    e.preventDefault();
    const aLink = e.currentTarget;
    const section = aLink.getAttribute('data-section');
    const key = aLink.getAttribute('data-value');
    const className = aLink.className;
    this.newParentList.forEach((menu, index) => {
      if (menu.featureName === section) {
        menu.childrenList.forEach((item) => {
          if (item.featureCode === key && item.active !== 'active') {
            item.active = 'active';
          } else if (item.active === 'active' && className.indexOf('active') !== -1) {
            item.active = '';
          } else {
            item.active = '';
          }
        });
      }
    });
    this.setState({
      newParentList: this.newParentList,
    });
    sessionStorage.setItem('activeList', JSON.stringify(this.newParentList));
  }

  close() {
    this.setState({
      isDropdownVisible: 'hm-commbox-list hide',
    });
  }

  reset(e) {
    // 重置输入框
    const { features, isFeaturesGet } = this.props;
    const childrenList = [];
    this.newParentList = [];
    if (isFeaturesGet) {
      features.forEach((item, idx) => {
        if (item.featureType === '0') {
          this.newParentList.push(item);
        } else if (item.featureType === '1') {
          childrenList.push(item);
        }
      });
      for (let i = 0; i < this.newParentList.length; i++) {
        this.newParentList[i].childrenList = [];
        childrenList.forEach((item, idx) => {
          if (this.newParentList[i].featureCode === item.featureCode.slice(0, 3)) {
            this.newParentList[i].childrenList.push(item);
          }
        });
      }
    }
    this.shoppingDateStart.refs.field.value = '';
    this.shoppingDateEnd.refs.field.value = '';
    this.productRef.value = '';
    this.goodsSn.value = '';
    // 重置菜单的状态.
    this.clonedMenus = cloneDeep(originMenus);
    // 重置可涮选的值得状态
    this.newParentList.forEach((menu, index) => {
      menu.childrenList.forEach((item) => {
        item.active = '';
      });
    });
    // 清除所有状态
    this.setState({
      newParentList: this.newParentList,
    });
    sessionStorage.removeItem('activeList');
    sessionStorage.removeItem('shoppingTime');
    removeFilterConditions();
    removeKeyWords();
  }

  render() {
    let filterJSX = null;
    let contentJSX = null;
    const { features, isFeaturesGet } = this.props;
    const childrenList = [];
    this.newParentList = [];
    if (isFeaturesGet) {
      features.forEach((item, idx) => {
        if (item.featureType === '0') {
          this.newParentList.push(item);
        } else if (item.featureType === '1') {
          childrenList.push(item);
        }
      });
      for (let i = 0; i < this.newParentList.length; i++) {
        this.newParentList[i].childrenList = [];
        childrenList.forEach((item, idx) => {
          if (this.newParentList[i].featureCode === item.featureCode.slice(0, 3)) {
            this.newParentList[i].childrenList.push(item);
          }
        });
      }
      const activeList = JSON.parse(sessionStorage.getItem('activeList'));
      if (activeList !== null) {
        this.newParentList = activeList;
      }
      if (this.newParentList && this.newParentList.length > 0) {
        contentJSX = this.newParentList.map((item, idx) => {
          const key = `idx-${idx}`;
          return (
            <Group
              header={item.featureName}
              key={key}
              noPadded={false}
              className="hm-customer-filter-container"
            >
              <Grid
                className="hm-customer-filter-items"
                avg={3}
              >
                {
                  item.childrenList.map((newkey, newidx) => {
                    const children = newkey.featureName;
                    const newKey = `newidx-${newidx}`;
                    return (
                      <Col className="item" key={newKey}>
                        <a
                          id={`hm_customer_filter_label_${newkey.featureCode}`}
                          onClick={this.handleClick}
                          className={newkey.active}
                          data-value={newkey.featureCode}
                          data-section={item.featureName}
                        >
                          <span
                            data-value={newkey.featureCode}
                            data-section={item.featureName}
                          >{children}</span>
                        </a>
                      </Col>
                    );
                  })
                }
              </Grid>
            </Group>
          );
        });
      }
    } else {
      contentJSX = (
        <div className="hm-loading-wrapper">
          <i className="iconfont icon-jiazai hm-pulse hm-loading" />
        </div>
      );
    }
    return (
      <div>
        <div className="hm-customer-filter">
          {contentJSX}
          {this.state.menus.map((menu, index) => {
            const key = `filter-${index}`;
            switch (menu.title) {
              case '购买时间筛选':
                filterJSX = (
                  <div>
                    <Field
                      id="hm_customer_filter_start_time"
                      type="date"
                      name="shoppingDateStart"
                      label="开始时间："
                      className="shoppingDateStart"
                      ref={input => (this.shoppingDateStart = input)}
                    />
                    <Field
                      id="hm_customer_filter_end_time"
                      type="date"
                      name="shoppingDateEnd"
                      label="结束时间："
                      className="shoppingDateEnd"
                      ref={input => (this.shoppingDateEnd = input)}
                    />
                  </div>
                );
                break;
              case '品牌筛选': {
                const items = this.props.products.map((product, idx) => {
                  const pIdx = `product-${idx}`;
                  if (this.state.productQueryStr !== '') {
                    if (includes(product.brandName, this.state.productQueryStr)) {
                      return (
                        <li key={pIdx}>
                          <a
                            id="hm_customer_filter_brand_filter_input"
                            onClick={this.handleProductSelected}
                            data-product-id={product.brandId}
                          >
                            <h3 className="item-title">{product.brandName}</h3>
                          </a>
                        </li>
                      );
                    }
                  }
                  return '';
                });
                filterJSX = (
                  <div className="hm-commbox">
                    <div className="hm-commbox-inner">
                      {/* <div
                        className={this.state.isPlaceHolderVisible}
                      >请输入商品名称</div>*/}
                      <input
                        id="hm_customer_filter_brand_search_input"
                        type="text"
                        autoComplete="off"
                        onFocus={this.handleInputEvt}
                        onBlur={this.handleInputEvt}
                        onChange={this.handleInputEvt}
                        placeholder="请输入品牌名称"
                        ref={(c) => { this.productRef = c; }}
                      />
                      {/* <div className="hm-commbox-bordered">
                        <hr className="no-focus" />
                        <hr className={this.state.isTxtFocus} />
                      </div>*/}
                      <ul className={this.state.isDropdownVisible}>
                        {items}
                      </ul>
                    </div>
                  </div>
                );
                break;
              }
              case '商品筛选':
                filterJSX =
                  (<input
                    id="hm_customer_filter_product_filter_input"
                    type="text"
                    name="goodsSn"
                    placeholder="请输入商品货号"
                    ref={input => (this.goodsSn = input)}
                  />);
                break;
              default:
                break;
            }
            return (
              <Group
                header={menu.title}
                noPadded={false}
                key={key}
                className="hm-customer-filter-container"
              >
                {filterJSX}
              </Group>
            );
          })}
        </div>
        <div className="hm-customer-filter-btn-group">
          <ButtonGroup justify>
            <Button id="hm_customer_filter_reset" onClick={this.reset}>重置</Button>
            <Button
              id="hm_customer_filter_sure"
              amStyle="alert"
              onClick={this.onDismiss}
            >
              确定
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

HMCustomerFilter.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  features: PropTypes.array.isRequired,
  isFeaturesGet: PropTypes.bool.isRequired,
};
