import React, { Component, PropTypes } from 'react';
import './pagerStatus.scss';

export default class PagerStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { pager } = this.props;
    return (
      <div className="hm-pagenav-container">
        <div className="hm-pagenav expanded">
          <div className="pagenav-main">
            <span className="currentPage">{`${pager.currentPage}/${pager.totalPage}`}</span>
          </div>
        </div>
      </div>
    );
  }
}

PagerStatus.propTypes = {
  pager: PropTypes.object.isRequired,
};
