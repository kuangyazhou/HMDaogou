import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import {
  Card,
  Icon,
} from 'amazeui-touch';

import './card.scss';

export default class HMCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
  }

  handleClick() {
    if (this.props.showBrandSearch) {
      this.props.showBrandSearch();
    } else if (this.props.showSingleBrandSearch) {
      this.props.showSingleBrandSearch();
    }
    return;
  }

  handleSwitch() {
    this.props.switchChart();
  }

  render() {
    const {
      title,
      handleMore,
      children,
      iconName,
      bgColor,
      isMoreHide,
      isManager,
      handleClick,
      cardLinkId,
      specialHeader,
      switchContent,
    } = this.props;
    const iconClassName = classNames('iconfont', iconName, 'hm-stack-1x', 'hm-color-white');
    const moreClassName = isMoreHide ? 'hide' : '';
    const normalClass = isManager ?
      'hm-circle hm-stack-2x hm-master' : 'hm-circle hm-stack-2x hm-user';
    return (
      <div className="hm-card-container">
        <Card.Child className="hm-card-header">
          <div className="hm-card-header-label">
            <span className="hm-stack">
              <i className={normalClass} />
              <i className={iconClassName} />
            </span>
            <span className="hm-card-title">{title}</span>
          </div>
          {!isMoreHide ? (
            <div className="hm-card-header-more">
              {
                switchContent ?
                  <button
                    className="switch-button"
                    onClick={this.handleSwitch}
                  >
                    {switchContent}
                  </button>
                  : <a id={cardLinkId} href={handleMore} onClick={this.handleClick}>
                    <span className="special-header">{specialHeader}</span>
                    <Icon name="right-nav" />
                  </a>
              }

            </div>
          ) : ''}
        </Card.Child>
        <div className="hm-card-body">
          {children}
        </div>
      </div>
    );
  }
}

HMCard.propTypes = {
  title: PropTypes.string.isRequired,
  handleMore: PropTypes.string,
  tips: PropTypes.object,
  bgColor: PropTypes.any,
  iconName: PropTypes.string.isRequired,
  isMoreHide: PropTypes.any,
  handleClick: PropTypes.func,
  isManager: PropTypes.string,
  cardLinkId: PropTypes.string,
  specialHeader: PropTypes.string,
  showBrandSearch: PropTypes.func,
  showSingleBrandSearch: PropTypes.func,
  switchChart: PropTypes.func,
  switchContent: PropTypes.string,
};
