import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class DayNames extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="week names">
        <span className="day">日</span>
        <span className="day">一</span>
        <span className="day">二</span>
        <span className="day">三</span>
        <span className="day">四</span>
        <span className="day">五</span>
        <span className="day">六</span>
      </div>
    );
  }
}

