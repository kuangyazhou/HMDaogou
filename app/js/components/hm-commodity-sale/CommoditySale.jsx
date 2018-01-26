/* eslint max-len: [0] */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { includes, sortBy } from 'lodash';
import {
  Container,
} from 'amazeui-touch';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../utils/domUtils';

// API Utils.
import { loadUserProfile } from '../../utils/apiUtils';

// actions
import {
  getProductsById,
} from '../../actions/customers/products';
import { fetchSaleSearch, restSaleList } from '../../actions/store/saleSearch';

import {
  fetchOrderCat,
  fetchOrderCatTrend,
} from '../../actions/store/sales';

// components
import HMCard from '../hm-card/Card.jsx';

import ReactEcharts from '../../../../node_modules/echarts-for-react';

import './commoditySale.scss';

class CommoditySale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      isShowBrandSearch: false,
      isShowSingleBrandSearch: false,
      isPlaceHolderVisible: 'hm-commbox-placeholder opacity-off', // 是否显示placeholder.
      isTxtFocus: 'no-focus', // material设计风格的下划线动画效果.
      isDropdownVisible: 'hm-commbox-list hide',
      productQueryStr: '',
      isShowBrand: false,
      isShowSingleBrand: false,
      chartType: '查看占比',
    };
    this.showBrandSearch = this.showBrandSearch.bind(this);
    this.showSingleBrandSearch = this.showSingleBrandSearch.bind(this);
    this.handleInputEvt = this.handleInputEvt.bind(this);
    this.handleProductSelected = this.handleProductSelected.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.switchChart = this.switchChart.bind(this);
  }

  componentDidMount() {
    const { dispatch, isOrderCatGet, isOrderCatTrendGet } = this.props;
    if (isOrderCatGet && this.state.chartType === '查看占比') {
      const topChart = this.topChart.getEchartsInstance();
    }
    if (isOrderCatTrendGet && this.state.chartType === '查看趋势') {
      const trendChart = this.trendChart.getEchartsInstance();
    }
    dispatch(getProductsById());
    dispatch(fetchOrderCat());
  }

  getTopOption() {
    const { orderCat } = this.props;
    let value;
    let name;
    const nameList = [];
    const data = [];
    if (orderCat && orderCat.amounts && orderCat.amounts.length > 0 && orderCat.names && orderCat.names.length > 0) {
      orderCat.amounts.forEach((item, idx, arr) => {
        data[idx] = {
          value: '',
          name: '',
        };
        data[idx].value = Math.round(item);
        data[idx].name = orderCat.names[idx];
        nameList.push(orderCat.names[idx]);
      });
    }
    const weekOption = {
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        x: 'center',
        y: 'top',
        data: nameList,
      },
      color: ['#68B1F2', '#4DC7CA', '#B5A2E1', '#F9B97A', '#8E98B5', '#DF9499'],
      calculable: true,
      series: [
        {
          name: '销售金额及占比',
          type: 'pie',
          radius: [30, 110],
          center: ['50%', '60%'],
          roseType: 'radius',
          x: '50%',               // for funnel
          max: 40,                // for funnel
          sort: 'ascending',     // for funnel
          labelLine: {
            normal: {
              length: 25,
              length2: 0,
            },
          },
          data,
        },
      ],
    };
    return weekOption;
  }

  getTrendOption() {
    const { orderCatTrend, isOrderCatTrendGet } = this.props;
    const data = orderCatTrend.data;
    const catName = orderCatTrend.brand;
    const series = [];
    let month;
    if (isOrderCatTrendGet) {
      month = data[data.length - 1].month.reverse();
      data.forEach((item, idx, arr) => {
        series.push({
          name: catName[idx],
          type: 'line',
          data: item.money.reverse(),
        });
      });
    }
    const trendOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        data: catName,
      },
      grid: {
        left: '3%',
        right: '6%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: month,
          nameRotate: '135',
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series,
    };
    return trendOption;
  }

  handleInputEvt(e) {
    const eventType = e.type;
    switch (eventType) {
      case 'focus': {
        const { dispatch } = this.props;
        this.setState({
          isTxtFocus: 'is-focus',
          isShowBrand: false,
        });
        dispatch(restSaleList());
        break;
      }
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

  handleProductSelected(e) {
    e.preventDefault();
    const { dispatch, searchList, isBrandFetching } = this.props;
    const selectedVal = e.currentTarget.getAttribute('data-product-id');
    const selectedTxt = e.target.textContent;
    this.search.setAttribute('data-val', selectedVal);
    this.search.value = selectedTxt;
    this.close();
    const brandId = this.search.getAttribute('data-val');
    const value = this.search.value;
    dispatch(fetchSaleSearch(null, brandId));
    this.setState({
      isShowBrand: true,
    });
  }

  close() {
    this.setState({
      isDropdownVisible: 'hm-commbox-list hide',
    });
  }

  showBrandSearch() {
    this.setState({
      isShowBrandSearch: !this.state.isShowBrandSearch,
    });
    if (this.state.isShowSingleBrandSearch) {
      this.setState({
        isShowSingleBrandSearch: false,
      });
    }
    setTimeout(() => {
      if (this.state.isShowBrandSearch) {
        this.search.focus();
      }
    }, 0);
  }

  showSingleBrandSearch() {
    this.setState({
      isShowSingleBrandSearch: !this.state.isShowSingleBrandSearch,
    });
    if (this.state.isShowBrandSearch) {
      this.setState({
        isShowBrandSearch: false,
      });
    }
    setTimeout(() => {
      if (this.state.isShowSingleBrandSearch) {
        this.singleSearch.focus();
      }
    }, 0);
  }

  handleFocus() {
    const { dispatch } = this.props;
    this.setState({
      isShowSingleBrand: false,
    });
    dispatch(restSaleList());
  }

  handleClick(e) {
    e.preventDefault();
    const { dispatch, searchList, isBrandFetching } = this.props;
    const value = this.singleSearch.value;
    if (value !== '') {
      dispatch(fetchSaleSearch(value));
      this.setState({
        isShowSingleBrand: true,
      });
    }
  }

  switchChart() {
    const { dispatch, isOrderCatGet, isOrderCatTrendGet } = this.props;
    if (this.state.chartType === '查看占比') {
      this.setState({
        chartType: '查看趋势',
      });
      dispatch(fetchOrderCatTrend());
      if (isOrderCatGet) {
        const topChart = this.topChart.getEchartsInstance();
      }
    } else if (this.state.chartType === '查看趋势') {
      this.setState({
        chartType: '查看占比',
      });
      dispatch(fetchOrderCat());
    }
  }

  render() {
    const { mainBrandList, currentMonth, orderCat, isOrderCatGet, isOrderCatTrendGet, orderCatTrend,
      isMonthSingleBrandGet, isMainBrandListGet, isBrandFetching, amount, goodCount, goodsName } = this.props;
    let contentJSX;
    let iconContent;
    if (isMonthSingleBrandGet) {
      if (currentMonth && currentMonth.length > 1) {
        contentJSX = currentMonth.map((item, idx) => {
          const key = `idx-${idx}`;
          const brandAmount = item.amount ? Number(item.amount).toLocaleString() : 0;
          const name = item.name ? `${item.name}` : item.value;
          const count = item.value ? item.value : 0;
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
              break;
          }
          if (idx < 3) {
            return (
              <li key={key}>
                <div className="icon-wrapper rank">
                  {iconContent}
                </div>
                <div className="name">
                  {name}
                </div>
                <div className="amount">
                  {brandAmount}
                </div>
                <div className="count">
                  {count}
                </div>
              </li>
            );
          }
          return '';
        });
      } else {
        contentJSX = <li className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</li>;
      }
    } else {
      contentJSX = (
        <li className="hm-loadding-wrapper">
          <i className="iconfont icon-jiazai hm-pulse hm-loading" />
        </li>
      );
    }
    let mainBrandJSX;
    if (isMainBrandListGet) {
      if (mainBrandList.length > 0) {
        mainBrandJSX = mainBrandList.map((item, idx) => {
          /* eslint no-mixed-operators: [0] */
          const key = `idx-${idx}`;
          let percent;
          if (item.completePerformance <= '0'
            || item.completePerformance === undefined
            || item.points === undefined
            || item.points <= '0') {
            percent = 0;
          } else {
            percent = Math.round(item.completePerformance / item.points * 100);
          }
          if (idx < 3) {
            return (
              <div className="hm-progress-rank" key={key}>
                <div className="progress manager">
                  <span style={{ width: `${percent}%` }}>
                    <b>{`${percent}%`}</b>
                  </span>
                </div>
                <div className="bottom-detail">
                  <strong>{item.target}</strong>
                  <span>{`${Number(item.completePerformance).toLocaleString()}/${Number(item.points).toLocaleString()}`}</span>
                </div>
              </div>
            );
          }
          return '';
        });
      } else {
        mainBrandJSX = <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</p>;
      }
    } else {
      mainBrandJSX = (
        <div className="hm-loadding-wrapper">
          <i className="iconfont icon-jiazai hm-pulse hm-loading" />
        </div>
      );
    }
    const text = this.search ? this.search.value : '';
    let content;
    let singleContent;
    if (isBrandFetching) {
      content = (
        <div className="brand-detail">
          <div className="brand-header">
            <span className="brand">品牌</span>
            <span className="amount">销售金额</span>
            <span className="count">销售数量</span>
          </div>
          <div className="brand-body">
            <span className="brand">{text ? `${text}` : 0}</span>
            <span className="amount">{amount ? `${Number(amount).toLocaleString()}` : 0}元</span>
            <span className="count">{goodCount ? `${goodCount}` : 0}件</span>
          </div>
        </div>
      );
      singleContent = (
        <div className="brand-detail">
          <div className="brand-header">
            <span className="brand">品牌</span>
            <span className="amount">销售金额</span>
            <span className="count">销售数量</span>
          </div>
          <div className="brand-body">
            <span className="brand">{goodsName ? `${goodsName}` : ''}</span>
            <span className="amount">{amount ? `${Number(amount).toLocaleString()}` : 0}元</span>
            <span className="count">{goodCount ? `${goodCount}` : 0}件</span>
          </div>
        </div>
      );
    } else {
      content = (<div className="hm-loading-wrapper">
        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
      </div>);
      singleContent = (<div className="hm-loading-wrapper">
        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
      </div>);
    }
    const items = this.props.products.map((product, idx) => {
      const pIdx = `product-${idx}`;
      if (this.state.productQueryStr !== '') {
        if (includes(product.brandName, this.state.productQueryStr)) {
          return (
            <li key={pIdx}>
              <a
                onClick={this.handleProductSelected}
                data-product-id={product.brandId}
              >
                <span className="icon icon-search" /><span className="item-title">{product.brandName}</span>
              </a>
            </li>
          );
        }
      }
      return '';
    });
    let proportionJSX;
    let trendJSX;
    if (isOrderCatGet) {
      if (orderCat.amounts && orderCat.amounts.length > 0 && orderCat.names && orderCat.names.length > 0) {
        proportionJSX = (
          <ReactEcharts
            option={this.getTopOption()}
            ref={c => (this.topChart = c)}
            style={{ height: '330px', width: '100%' }}
            className="react_for_echarts"
          />
        );
      } else {
        proportionJSX = <div className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</div>;
      }
    } else {
      proportionJSX = (<div className="hm-loading-wrapper">
        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
      </div>);
    }
    if (isOrderCatTrendGet) {
      if (orderCatTrend.data && orderCatTrend.data.length > 0) {
        trendJSX = (
          <ReactEcharts
            option={this.getTrendOption()}
            ref={c => (this.trendChart = c)}
            style={{ height: '330px', width: '100%' }}
            className="react_for_echarts"
          />
        );
      } else {
        trendJSX = <div className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</div>;
      }
    } else {
      trendJSX = (<div className="hm-loading-wrapper">
        <i className="iconfont icon-jiazai hm-pulse hm-loading" />
      </div>);
    }
    return (
      <Container className="hm-commodity-sale-main">
        <div className="hm-brand-amount-search-wrapper">
          <HMCard
            title="品牌销售额查询"
            iconName="icon-xiaoshouechaxun"
            showBrandSearch={this.showBrandSearch}
            isManager
          >
            {
              this.state.isShowBrandSearch &&
              <div className="search-wrapper">
                <label htmlFor="brandSearch">
                  <input
                    type="text"
                    id="brandSearch"
                    palceholder="请输入品牌名"
                    ref={c => (this.search = c)}
                    autoComplete="off"
                    onFocus={this.handleInputEvt}
                    onBlur={this.handleInputEvt}
                    onChange={this.handleInputEvt}
                  />
                  <span className="icon icon-search" />
                </label>
                <ul className={this.state.isDropdownVisible}>
                  {items}
                </ul>
                {
                  this.state.isShowBrand && content
                }
              </div>
            }
          </HMCard>
        </div>
        <div className="hm-single-brand-search-wrapper">
          <HMCard
            title="单品销售额查询"
            iconName="icon-xiaoshouechaxun"
            isManager
            showSingleBrandSearch={this.showSingleBrandSearch}
          >
            {
              this.state.isShowSingleBrandSearch &&
              <div className="single-search-wrapper">
                <label htmlFor="singleBrandSearch">
                  <input
                    type="text"
                    id="singleBrandSearch"
                    ref={c => (this.singleSearch = c)}
                    palceholder="请输入商品编码"
                    onFocus={this.handleFocus}
                  />
                  <div className="icon-wrapper" onClick={this.handleClick} >
                    <span className="icon icon-search" />
                  </div>
                </label>
                {
                  this.state.isShowSingleBrand && singleContent
                }
              </div>
            }
          </HMCard>
        </div>
        <HMCard
          title="品类销售金额及占比"
          iconName="icon-zhanbilei"
          handleMore="#/"
          switchContent={this.state.chartType}
          switchChart={this.switchChart}
          isManager
        >
          <div className="sale-percent">
            {this.state.chartType === '查看占比' && proportionJSX}
            {this.state.chartType === '查看趋势' && trendJSX}
          </div>
        </HMCard>
        <HMCard
          cardLinkId="hm_commodity_sale_main_brand_more"
          title="月主推品牌目标达成进度"
          iconName="icon-shuju"
          handleMore="#/monthMainBrandProgressRank"
          isManager
        >
          {mainBrandJSX}
        </HMCard>
        <HMCard
          cardLinkId="hm_commodity_sale_month_single_progress_more"
          title="月单品销售额排行"
          iconName="icon-paixing"
          handleMore="#/monthSingleBrandSale"
          isManager
        >
          <div className="hm-rank-title">
            <span className="rank">排名</span>
            <span className="name">名称</span>
            <span className="amount">金额</span>
            <span className="count">数量</span>
          </div>
          <ul className="hm-rank-list">
            {contentJSX}
          </ul>
        </HMCard>
      </Container>
    );
  }
}

CommoditySale.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mainBrandList: PropTypes.array.isRequired,
  currentMonth: PropTypes.array.isRequired,
  orderCat: PropTypes.object.isRequired,
  isOrderCatGet: PropTypes.bool.isRequired,
  isMonthSingleBrandGet: PropTypes.bool.isRequired,
  searchList: PropTypes.object.isRequired,
  isMainBrandListGet: PropTypes.bool.isRequired,
  isBrandFetching: PropTypes.bool.isRequired,
  amount: PropTypes.string.isRequired,
  goodCount: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
  goodsName: PropTypes.string.isRequired,
  orderCatTrend: PropTypes.array.isRequired,
  isOrderCatTrendGet: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { stores, filtedProductsByCID } = state;
  return {
    currentMonth: stores.stores.currentMonth,
    mainBrandList: stores.stores.mainBrandList,
    searchList: stores.stores.searchList,
    isBrandFetching: stores.stores.isBrandFetching,
    orderCat: stores.orderCat,
    orderCatTrend: stores.orderCatTrend || [],
    isOrderCatTrendGet: stores.isOrderCatTrendGet,
    isOrderCatGet: stores.isOrderCatGet,
    isMonthSingleBrandGet: stores.stores.isMonthSingleBrandGet,
    isMainBrandListGet: stores.stores.isMainBrandListGet,
    amount: stores.stores.searchList.amount,
    goodCount: stores.stores.searchList.goodCount,
    goodsName: stores.stores.searchList.goodsName,
    products: filtedProductsByCID.products || [],
  };
}

export default connect(mapStateToProps)(CommoditySale);
