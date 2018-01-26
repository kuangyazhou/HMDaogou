/* eslint  no-nested-ternary: [0]*/
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import {
  Container,
  View,
  Badge,
} from 'amazeui-touch';

import { fetchCustomerGrowthType } from '../../actions/customers/taskType';

import './careOfGrowth.scss';

class CareOfGrowth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCustomerGrowthType());
  }

  render() {
    const { user } = this.props;
    return (
      <View>
        <Container className="hm-CareOfGrowth-more" scrollable>
          <div className="care-of-growth-header">
            成长关怀
          </div>
          <div className="care-of-growth-body">
            <ul className="care-of-growth-list">
              {
                user.growthType && user.growthType.length > 0 ? user.growthType.map((item, idx) => {
                  const key = 'key-${idx}';
                  let parentClass;
                  let childClass;
                  switch (item.type) {
                    case '0501':
                      parentClass = 'icon-wrapper born';
                      childClass = 'iconfont icon-chusheng';
                      break;
                    case '0502':
                      parentClass = 'icon-wrapper birthday';
                      childClass = 'iconfont icon-36x36shengri';
                      break;
                    case '0503':
                      parentClass = 'icon-wrapper one-month';
                      childClass = 'iconfont icon-yingerglyph_';
                      break;
                    case '0504':
                      parentClass = 'icon-wrapper after-childbirth';
                      childClass = 'iconfont icon-lamafan';
                      break;
                    case '0505':
                      parentClass = 'icon-wrapper hundred-days';
                      childClass = 'iconfont icon-yinger';
                      break;
                    case '0506':
                      parentClass = 'icon-wrapper years-old';
                      childClass = 'iconfont icon-zhousui';
                      break;
                    default:
                      break;
                  }
                  return (
                    <li>
                      <a href={`#/customer/list/task/${item.type}`}>
                        <div className={parentClass}>
                          <i className={childClass} />
                          {
                            item.contentValue && item.contentValue !== '0' &&
                            <Badge
                              rounded
                              amStyle="alert"
                            >
                              {item.contentValue}
                            </Badge>
                          }
                        </div>
                        <span>{item.ruleName}</span>
                      </a>
                    </li>
                  );
                }) : ''
              }
            </ul>
          </div>
        </Container>
      </View>
    );
  }
}

CareOfGrowth.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { user, auth } = state;
  if (!user) {
    // todo: 需要在此处应用应用程序缓存, 在后台数据无法获取的时候, 我们使用保存在应用缓存的数据.
    return {
      user: {
        storeAllNoteList: [],
        storeAllNotePager: {},
      },
    };
  }
  return {
    user,
  };
}

export default connect(mapStateToProps)(CareOfGrowth);
