/* eslint max-len: [0] */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { If, Then, Else } from 'react-if';


// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../utils/domUtils';

// API Utils.
import { loadUserProfile } from '../../utils/apiUtils';

// components
import HMCard from '../hm-card/Card.jsx';

import './storeSale.scss';

class StoreSale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  render() {
    const { allResult, physiologicalList, averageAmount,
      dealCount, addCount, isMonthDealDetailGet, isPhysiologicalListGet,
      isDealCustomerRank, hadDevelopedCustomer, developTarget,
    } = this.props;
    let physiologicalListJSX;
    let dealCustomerRankJSX;
    if (isPhysiologicalListGet) {
      if (physiologicalList && physiologicalList.length > 0) {
        physiologicalListJSX = physiologicalList.map((item, idx) => {
          const key = `idx-${idx}`;
          let featureName;
          const percent = Math.round(item.hemiaoProportion);
          if (item.featureName.indexOf('~') !== -1) {
            featureName = `宝宝${item.featureName}`;
          } else if (item.featureName.indexOf('孕') !== -1) {
            featureName = `宝妈${item.featureName}`;
          }
          return (
            <div className="hm-progress-rank" key={key}>
              <div className="progress manager">
                <span style={{ width: `${percent}%` }}>
                  <b>{percent}%</b>
                </span>
              </div>
              <div className="bottom-detail">
                <strong>{featureName}</strong>
                <span>{Number(item.hemiaoCount).toLocaleString()}</span>
              </div>
            </div>
          );
        });
      } else {
        physiologicalListJSX = <div className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</div>;
      }
    } else {
      physiologicalListJSX = <div className="hm-loading-wrapper"><i className="iconfont icon-jiazai hm-pulse hm-loading" /></div>;
    }
    if (isDealCustomerRank) {
      if (allResult && allResult.length > 0) {
        dealCustomerRankJSX = allResult.map((item, idx) => {
          const key = `idx-${idx}`;
          const percent = item.hemiaoProportion ? Math.round(item.hemiaoProportion) : 0;
          let level;
          return (
            <div className="hm-progress-rank" key={key}>
              <div className="progress manager">
                <span style={{ width: `${percent}%` }}>
                  <b>{percent}%</b>
                </span>
              </div>
              <div className="bottom-detail">
                <strong>{item.featureName}（{item.hemiaoLevel}）</strong>
                <span>{Number(item.hemiaoCount).toLocaleString()}人</span>
              </div>
            </div>
          );
        });
      } else {
        dealCustomerRankJSX = <div className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</div>;
      }
    } else {
      dealCustomerRankJSX = <div className="hm-loading-wrapper"><i className="iconfont icon-jiazai hm-pulse hm-loading" /></div>;
    }
    return (
      <div className="store-sale-main">
        <HMCard
          title="月交易详情"
          iconName="icon-baojiadan"
          isMoreHide
          isManager
        >
          {
            isMonthDealDetailGet ?
              <div className="deal-detail">
                {/* <div className="added">
                  <span>新增客户数</span>
                  <span>{addCount ? `${Number(addCount).toLocaleString()}` : 0}</span>
                </div> */}
                <div className="deal">
                  <span>{dealCount ? `${dealCount.toLocaleString()}` : 0}</span>
                  <p>交易人数</p>
                </div>
                <div className="single">

                  <span>{averageAmount ? `${averageAmount}` : 0}</span>
                  <p>平均单客价</p>
                </div>
              </div> :
              <div className="hm-loading-wrapper"><i className="iconfont icon-jiazai hm-pulse hm-loading" /></div>
          }
        </HMCard>
        <div className="hm-add-and-deal-wrapper">
          <HMCard
            title="月新增与交易客户增长趋势"
            iconName="icon-qushi"
            handleMore="#/newCustomer"
            isManager
          />
        </div>
        <div className="month-new-customer-wrapper">
          <HMCard
            title="本月新客开发人数"
            iconName="icon-xinzengkehu"
            handleMore="#/monthNewCustomer"
            specialHeader={`${hadDevelopedCustomer || 0}/${developTarget || 0}`}
            isManager
          />
        </div>
        <HMCard
          cardLinkId="hm_store_sale_monetary_more"
          title="月交易客户消费金额等级占比"
          iconName="icon-zhanbilei"
          handleMore="#/monetary"
          isManager
        >
          {dealCustomerRankJSX}
        </HMCard>
        <HMCard
          cardLinkId="hm_store_sale_physiological_shaft_more"
          title="月交易客户生理轴人群占比"
          iconName="icon-zhanbilei"
          handleMore="#/physiologicalShaft"
          isManager
        >
          {physiologicalListJSX}
        </HMCard>
      </div>
    );
  }
}

StoreSale.propTypes = {
  dispatch: PropTypes.func.isRequired,
  allResult: PropTypes.array.isRequired,
  physiologicalList: PropTypes.array.isRequired,
  addCount: PropTypes.string.isRequired,
  dealCount: PropTypes.string.isRequired,
  averageAmount: PropTypes.string.isRequired,
  isMonthDealDetailGet: PropTypes.bool.isRequired,
  isPhysiologicalListGet: PropTypes.bool.isRequired,
  isDealCustomerRank: PropTypes.bool.isRequired,
  hadDevelopedCustomer: PropTypes.string.isRequired,
  developTarget: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  const { client, stores } = state;
  return {
    allResult: client.allResult,
    physiologicalList: client.physiologicalList,
    addCount: client.addCount,
    dealCount: client.dealCount,
    averageAmount: client.averageAmount,
    isMonthDealDetailGet: client.isMonthDealDetailGet,
    isPhysiologicalListGet: client.isPhysiologicalListGet,
    isDealCustomerRank: client.isDealCustomerRank,
    hadDevelopedCustomer: stores.hadDevelopedCustomer,
    developTarget: stores.developTarget,
  };
}

export default connect(mapStateToProps)(StoreSale);
