/* eslint max-len: [0] */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  View,
} from 'amazeui-touch';

import { isEmpty, values } from 'lodash';
// 缓存条件.
import {
  addFilterConditions,
} from '../../../utils/apiUtils';

import {
  getProductsById,
  getCustomerFeature,
} from '../../../actions/customers/products';

import HMCustomerFilter from '../../../components/hm-customer-filter/HMCustomerFilter.jsx';

import './customer.filter.scss';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.pathName = '';
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentDidMount() {
    const { dispatch, history, location } = this.props;
    dispatch(getProductsById());
    dispatch(getCustomerFeature());
  }

  componentWillReceiveProps(nextState) {
    this.pathName = nextState.location.state.prevPath;
  }

  handleFilter(condition) {
    const { history } = this.props;
    if (condition.shoppingDateStart !== '' ||
      condition.shoppingDateEnd !== '' ||
      condition.brandId !== '' ||
      condition.goodsSn !== '' ||
      condition.f01 !== '' ||
      condition.f02 !== '' ||
      condition.f03 !== '' ||
      condition.f04 !== '' ||
      condition.f05 !== '' ||
      condition.f06 !== ''
    ) {
      addFilterConditions(condition);
    }
    history.push(this.pathName);
  }

  render() {
    return (
      <View>
        <Container scrollable className="ks-grid hm-customer-filter-container">
          <div className="hm-customer-filter-inner">
            <HMCustomerFilter
              products={this.props.products}
              onSubmit={this.handleFilter}
              features={this.props.features}
              isFeaturesGet={this.props.isFeaturesGet}
            />
          </div>
        </Container>
      </View>
    );
  }
}

Filter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  features: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  isFeaturesGet: PropTypes.bool.isRequired,
  location: React.PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { filtedProductsByCID } = state;
  return {
    products: filtedProductsByCID.products || [],
    features: filtedProductsByCID.features || [],
    isFeaturesGet: filtedProductsByCID.isFeaturesGet || false,
  };
}

export default connect(mapStateToProps)(Filter);
