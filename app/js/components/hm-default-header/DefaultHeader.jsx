import React, { Component, PropTypes } from 'react';
import {
  Icon,
} from 'amazeui-touch';

import './defaultHeader.scss';

export default class DefaultHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleBack = this.handleBack.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleBack(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  handleClick(e) {
    e.preventDefault();
    this.props.openSearchInput();
  }

  render() {
    const {
      title,
      history,
      other,
      type,
      mode,
    } = this.props;
    let contentJSX;
    if (type === 'normal') {
      // 只有标题
      contentJSX = (
        <div className="normal">
          {title}
        </div>
      );
    } else if (type === 'special') {
      // 返回+标题+更多
      contentJSX = (
        <div className="special">
          <span
            id="hm_back"
            href="#/"
            className="icon icon-left-nav"
            onClick={this.handleBack}
          />
          <span className="title">
            {title}
          </span>
          <span className="other">
            <span className="icon icon-search searchButton" onClick={this.handleClick} />
          </span>
        </div>
      );
    } else {
      // 返回+标题
      contentJSX = (
        <div className="default">
          <span
            id="hm_back"
            href="#/"
            className="icon icon-left-nav"
            onClick={this.handleBack}
          />
          <span className="default-title">
            {title}
          </span>
        </div>
      );
    }
    return (
      <header className={mode ? 'hm-default-header manager' : 'hm-default-header'}>
        {contentJSX}
      </header>
    );
  }
}

DefaultHeader.propTypes = {
  title: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  other: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  openSearchInput: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
};
