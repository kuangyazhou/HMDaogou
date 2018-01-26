import React, { Component, PropTypes } from 'react';
import { If } from 'react-if';
import classNames from 'classnames';
import moment from 'moment';
import {
  Grid,
  Group,
  Col,
  List,
  Modal,
  View,
  Container,
  Accordion,
} from 'amazeui-touch';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../utils/domUtils';

import DefaultHeader from '../../components/hm-default-header/DefaultHeader.jsx';
import DayNames from './Calendar.DayNames.jsx';
import Week from './Calendar.Week.jsx';

import './calendar.scss';

export default class HMCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: this.props.selectedMonth.clone(),
      selectedDay: this.props.selectedMonth.clone(),
      actives: [],
      monthActives: [],
      haveActivity: true,
      activityAlert: {
        title: '',
        content: '',
        createDate: '',
      },
      result: [],
      isShow: false,
    };
    this.select = this.select.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.handleEntryClick = this.handleEntryClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  componentDidMount() {
    const view = document.querySelector('.view');
    view.classList.add('scroll');
  }

  componentWillReceiveProps() {
    const { actives } = this.props.activity;
    const now = moment(moment().format('YYYY-MM-DD'));
    const monthFirstDay = `${this.state.month.startOf('month').format('YYYY-MM-DD')}`;
    const monthLastDay = `${this.state.month.endOf('month').format('YYYY-MM-DD')}`;
    const dayActives = [];
    const monthActives = [];
    const isSameMonth = moment(this.state.month.format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'), 'month');
    /* eslint max-len: [0] */
    if (actives.length > 0) {
      actives.forEach((item, idx) => {
        const isBetween = now.isBetween(new Date(moment(item.startDateAsString).subtract(1, 'days')), new Date(item.endDateAsString));
        if (isBetween) {
          dayActives.push(item);
        }
        // 判断本月活动是否在起始和结束时间是否在本月之间或者包含本月
        const isBetweenMonth = moment().isBetween(item.startDateAsString, item.endDateAsString) ||
          moment(item.startDateAsString).isBetween(monthFirstDay, monthLastDay) ||
          moment(item.endDateAsString).isBetween(monthFirstDay, monthLastDay) ||
          moment(item.startDateAsString).isSame(monthFirstDay) ||
          moment(item.startDateAsString).isSame(monthLastDay) ||
          moment(item.endDateAsString).isSame(monthFirstDay) ||
          moment(item.endDateAsString).isSame(monthLastDay);
        if (isBetweenMonth) { monthActives.push(item); }
      });
      if (dayActives.length > 0 && isSameMonth) {
        this.setState({
          actives: dayActives,
          haveActivity: true,
        });
      } else {
        this.setState({
          actives: [],
          haveActivity: true,
        });
      }
      if (monthActives.length > 0) {
        this.setState({
          monthActives,
          haveActivity: true,
        });
      } else {
        this.setState({
          monthActives: [],
        });
      }
    }
  }

  componentWillUnmount() {
    const view = document.querySelector('.view');
    view.classList.remove('scroll');
  }

  onClose() {
    this.setState({
      isNoticeOpen: false,
      isActivityOpen: false,
    });
  }

  handleFocus() {
    this.setState({
      isShow: true,
    });
  }

  handleClick(e) {
    const { actives } = this.props.activity;
    const txtVal = e.target.textContent;
    const result = [];
    actives.forEach((item, idx) => {
      if (txtVal !== '' && item.tagAttribute && item.tagAttribute.indexOf(txtVal) !== -1) {
        result.push(item);
      }
    });
    this.setState({
      result,
      isShow: false,
    });
  }

  previous() {
    const month = this.state.month;
    month.add(-1, 'M');
    this.props.onPrevOrNext.call(this, month);
    this.setState({ month });
  }

  next() {
    const month = this.state.month;
    month.add(1, 'M');
    this.props.onPrevOrNext.call(this, month);
    this.setState({ month });
  }

  select(day) {
    const { actives, pager } = this.props.activity;
    const events = [];
    const monthActives = [];
    if (actives.length > 0) {
      const monthFirstDay = `${this.state.month.startOf('month').format('YYYY-MM-DD')}`;
      const monthLastDay = `${this.state.month.endOf('month').format('YYYY-MM-DD')}`;
      actives.forEach((item) => {
        const isBetween = day.date
          .isBetween(new Date(moment(item.startDateAsString).subtract(1, 'days')),
          new Date(item.endDateAsString));
        if (isBetween) { events.push(item); }
        const isBetweenMonth = day.date.isBetween(item.startDateAsString, item.endDateAsString) ||
          moment(item.startDateAsString).isBetween(monthFirstDay, monthLastDay) ||
          moment(item.endDateAsString).isBetween(monthFirstDay, monthLastDay) ||
          moment(item.startDateAsString).isSame(monthFirstDay) ||
          moment(item.startDateAsString).isSame(monthLastDay) ||
          moment(item.endDateAsString).isSame(monthFirstDay) ||
          moment(item.endDateAsString).isSame(monthLastDay);
        if (isBetweenMonth) { monthActives.push(item); }
      });
    }
    if (events.length > 0) {
      this.setState({
        selectedDay: day.date,
        actives: events,
        haveActivity: true,
      });
    } else {
      this.setState({
        selectedDay: day.date,
        actives: [],
        haveActivity: false,
      });
    }
    if (monthActives.length > 0) {
      this.setState({
        selectedDay: day.date,
        monthActives,
        haveActivity: true,
      });
    } else {
      this.setState({
        selectedDay: day.date,
        monthActives: [],
      });
    }
  }

  handleEntryClick(alertData) {
    this.setState({
      activityAlert: alertData,
      isActivityOpen: true,
    });
  }


  handleSearch(e) {
    const { actives } = this.props.activity;
    const txtVal = e.target.value;
    const result = [];
    actives.forEach((item, idx) => {
      if (txtVal !== '' &&
        (decodeURIComponent(item.actDesc).replace(/\+/g, ' ').indexOf(txtVal) !== -1 || decodeURIComponent(item.actName).replace(/\+/g, ' ').indexOf(txtVal) !== -1
          || item.endDateAsString.indexOf(txtVal) !== -1 || item.startDateAsString.indexOf(txtVal) !== -1)
      ) {
        result.push(item);
      }
    });
    this.setState({
      result,
    });
  }

  activityModal(alertData) {
    return (
      <Modal
        role="alert"
        title="促销活动详情"
        ref={modal => (this.modal = modal)}
        isOpen={this.state.isActivityOpen}
        onDismiss={this.onClose}
        className="hm_calendar_activity_detail"
        closeViaBackdrop
      >
        <Grid collapse align="between" className="hm-alert-grid">
          <Col cols={2} className="hm-alert-label">活动标题: </Col>
          <Col cols={4} className="hm-alert-content">{decodeURIComponent(alertData.actName).replace(/\+/g, ' ')}</Col>
        </Grid>
        <Grid collapse align="between" className="hm-alert-grid">
          <Col cols={2} className="hm-alert-label">活动日期: </Col>
          <Col cols={4} className="hm-alert-content">
            {`${alertData.startDateAsString} 至 ${alertData.endDateAsString}`}
          </Col>
        </Grid>
        <Grid collapse align="between" className="hm-alert-grid">
          <Col cols={2} className="hm-alert-label">
            {
              decodeURIComponent(alertData.actDesc).replace(/\+/g, ' ') && '活动详情:'
            }
          </Col>
          <Col cols={4} className="hm-alert-content">
            <span>{decodeURIComponent(alertData.actDesc).replace(/\+/g, ' ')}</span>
          </Col>
        </Grid>
      </Modal>
    );
  }

  renderDateAndIcon(active) {
    return (
      <div className="activity-time">
        <span>{`${active.startDateAsString} 至 ${active.endDateAsString}`}</span>
        <span>
          {
            active.isOffline === 0 ?
              <span style={{ color: '#ff474c' }}>线上活动</span> :
              <span>线下活动</span>
          }
        </span>
      </div>
    );
  }

  renderMonthLabel() {
    return <span>{this.state.month.format('YYYY年  MM月')}</span>;
  }

  renderWeeks(actives) {
    const weeks = [];
    const date = this.state.month.clone().startOf('month').day('Sunday');
    let done = false;
    let monthIndex = date.month();
    let count = 0;
    while (!done) {
      weeks.push(
        <Week
          key={date.toString()}
          date={date.clone()}
          month={this.state.month}
          select={this.select}
          selected={this.state.selectedDay}
          actives={actives}
        />
      );
      date.add(1, 'w');
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }

    return weeks;
  }

  renderBadge(actName, tag) {
    let tagList;
    if (tag && tag !== '') {
      if (tag.indexOf(',') !== -1) {
        tagList = tag.split(',').map((item, idx) => {
          const key = `react-${idx}`;
          return (<span key={key}>{item}</span>);
        });
      } else if (tag.indexOf(',') === -1) {
        tagList = <span>{tag}</span>;
      }
    }
    return (
      <div className="active-header">
        <span>{decodeURIComponent(actName).replace(/\+/g, ' ')}</span>
        <div className="tag-list">
          {tagList}
        </div>
      </div>
    );
  }

  renderAcoordingTitle(actName, parentClass, className, length) {
    const iconClass = `iconfont ${className}`;
    return (
      <div className={parentClass}>
        <i className={iconClass} />
        <span>{actName}活动</span>
        ({length}项)
      </div>
    );
  }

  render() {
    const { actives, pager } = this.props.activity;
    const modalFrame = this.activityModal(this.state.activityAlert);
    return (
      <div className="hm-calendar-container">
        <DefaultHeader title="活动详情" history={this.props.history} />
        {modalFrame}
        <div className="hm-calendar">
          <div className="header">
            <i
              id="hm_calendar_previous_month"
              className="icon icon-left-nav"
              onClick={this.previous}
            />
            {this.renderMonthLabel()}
            <i
              id="hm_calendar_next_month"
              className="icon icon-right-nav"
              onClick={this.next}
            />
          </div>
          <DayNames />
          {this.renderWeeks(actives)}
        </div>
        <div className="hm-calendar-day-activity">
          <div className="input-wrapper">
            <span className="iconfont icon-sousuo" />
            <input
              type="text"
              onChange={this.handleSearch}
              onFocus={this.handleFocus}
              ref={c => (this.ipt = c)}
              placeholder="搜索活动"
            />
            <div className={this.state.isShow ? 'activity-tag-container' : 'hide'}>
              <span>选类别快速查找：</span>
              <ul className="tag-list">
                <li onClick={this.handleClick}>奶粉</li>
                <li onClick={this.handleClick}>纸品</li>
                <li onClick={this.handleClick}>用品</li>
                <li onClick={this.handleClick}>车床</li>
                <li onClick={this.handleClick}>玩具</li>
                <li onClick={this.handleClick}>洗护</li>
                <li onClick={this.handleClick}>辅食</li>
                <li onClick={this.handleClick}>营养品</li>
                <li onClick={this.handleClick}>棉品</li>
                <li onClick={this.handleClick}>孕装</li>
              </ul>
            </div>
          </div>
          <div className="search-result">
            <List className="result-list">
              {this.state.result.map((active, idx) => {
                const ikey = `active-${idx}`;
                return (
                  <List.Item
                    key={ikey}
                    id={`hm_calendar_result_${idx}`}
                    title={this.renderBadge(active.actName, active.tagAttribute)}
                    subTitle={this.renderDateAndIcon(active)}
                    onClick={() => this.handleEntryClick(active)}
                  />
                );
              })}
            </List>
          </div>
          <Accordion defaultActiveKey={1}>
            <Accordion.Item
              title={
                this.renderAcoordingTitle(
                  '今日', 'today-activity', 'icon-jin_fill', this.state.actives.length
                )
              }
              eventKey={1}
            >
              {
                this.state.actives.length > 0 &&
                <List className="activity-list">
                  {this.state.actives.map((active, idx) => {
                    const ikey = `active-${idx}`;
                    return (
                      <List.Item
                        key={ikey}
                        id={`hm_calendar_today_${idx}`}
                        title={this.renderBadge(active.actName, active.tagAttribute)}
                        subTitle={this.renderDateAndIcon(active)}
                        onClick={() => this.handleEntryClick(active)}
                      />
                    );
                  })}
                </List>
              }
            </Accordion.Item>
          </Accordion>
          <Accordion defaultActiveKey={1}>
            <Accordion.Item
              title={
                this.renderAcoordingTitle(
                  '本月', 'month-activity', 'icon-round_yue_fill', this.state.monthActives.length
                )
              }
              eventKey={0}
            >
              {
                this.state.monthActives.length > 0 &&
                this.state.haveActivity &&
                <List className="activity-list">
                  {this.state.monthActives.map((active, idx) => {
                    const ikey = `active-${idx}`;
                    return (
                      <List.Item
                        key={ikey}
                        id={`hm_calendar_month_${idx}`}
                        title={this.renderBadge(active.actName, active.tagAttribute)}
                        subTitle={this.renderDateAndIcon(active)}
                        onClick={() => this.handleEntryClick(active)}
                      />
                    );
                  })}
                </List>
              }
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    );
  }
}

HMCalendar.propTypes = {
  selectedMonth: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired,
  onPrevOrNext: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};
