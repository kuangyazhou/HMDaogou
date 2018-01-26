import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';

export default class Week extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const days = [];
    const actives = this.props.actives;
    let date = this.props.date;
    let activesNumbers = 0;
    let classHasActivity = '';
    const { month } = this.props;
    for (let i = 0; i < 7; i++) {
      activesNumbers = 0;
      const day = {
        name: date.format('dd').substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), 'day'),
        date,
      };
      const classIsToday = (day.isToday ? ' today' : '');
      const classIsCurrentMonth = day.isCurrentMonth ? '' : ' different-month';
      const classIsSelected = day.date.isSame(this.props.selected) ? ' selected' : '';

      // 计算这个日子是否有活动以及有多少次活动.
      if (actives.length > 0) {
        for (let j = 0; j < actives.length; j++) {
          const isBetween = day.date
            .isBetween(new Date(moment(actives[j].startDateAsString).subtract(1, 'days')),
                       new Date(actives[j].endDateAsString));
          if (isBetween) {
            activesNumbers += 1;
          }
        }
        // 计算是否显示活动计数的样式.
        for (let j = 0; j < actives.length; j++) {
          const isBetween = day.date
            .isBetween(new Date(moment(actives[j].startDateAsString).subtract(1, 'days')),
                       new Date(actives[j].endDateAsString));
          if (isBetween) {
            classHasActivity = ' color-red small';
            break;
          } else {
            classHasActivity = ' hide';
          }
        }
      }

      days.push(
        <span
          key={day.date.toString()}
          className={`day${classIsToday}${classIsCurrentMonth}${classIsSelected}`}
          onClick={() => this.props.select(day)}
        >
          {day.number}
          <div className={`hm-circle-barget${classHasActivity}`}>
            {
              activesNumbers > 0 ? activesNumbers : ''
            }
          </div>
        </span>);
      date = date.clone();
      date.add(1, 'd');
    }
    return (
      <div className="week" key={days[0].toString()}>
        {days}
      </div>
    );
  }
}

Week.propTypes = {
  date: PropTypes.object.isRequired,
  month: PropTypes.object.isRequired,
  actives: PropTypes.array.isRequired,
  select: PropTypes.func.isRequired,
  selected: PropTypes.object.isRequired,
};

