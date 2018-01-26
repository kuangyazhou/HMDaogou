import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  Field,
} from 'amazeui-touch';

import moment from 'moment';

import {
  getCurrentMongthPerformance,
  fetchPerformanceTest,
  getmonthMemberReward,
} from '../../../actions/users/performance';

import DeafaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';

import ReactEcharts from '../../../../../node_modules/echarts-for-react';

import './performanceTest.scss';

class PerformanceTest extends React.Component {
  constructor(props) {
    super(props);
    this.doughnutChart = {};
    this.state = {
      isErrorHappend: false,
      isModalOpen: false,
      selctedDate: moment().format('YYYY年MM月'),
      month: moment(),
      selctedYear: '',
    };

    this.charts = [];
    this.handlePrevMonth = this.handlePrevMonth.bind(this);
    this.handleNextMonth = this.handleNextMonth.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.renderMonthLabel = this.renderMonthLabel.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleShowMonthSelectionModal = this.handleShowMonthSelectionModal.bind(this);
    this.handleAction = this.handleAction.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getmonthMemberReward());
    dispatch(fetchPerformanceTest());
  }

  getOption(percent) {
    const option = {
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          x: '0%', // for funnel
          itemStyle: {
            normal: {
              label: {
                formatter() {
                  return `${percent}%`;
                },
                textStyle: {
                  color: '#ff6978',
                  baseline: 'top',
                },
              },
            },
          },
          data: [
            {
              name: '未完成',
              value: 100 - percent,
              itemStyle: {
                normal: {
                  color: '#ccc',
                  label: {
                    show: true,
                    position: 'center',
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
            },
            {
              name: '已完成',
              value: percent,
              itemStyle: {
                normal: {
                  color: '#ff6978',
                  label: {
                    show: true,
                    position: 'center',
                    formatter: '{b}',
                    textStyle: {
                      baseline: 'bottom',
                    },
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
            },
          ],
        },
      ],
    };
    return option;
  }

  handlePrevMonth(e) {
    e.preventDefault();
    const { handlePrevMonth, dispatch } = this.props;
    const month = this.state.month;
    month.add(-1, 'M');
    this.setState({ month });
    this.setState({
      selctedDate: month.format('YYYY年MM月'),
    });
    const date = month.format('YYYY-MM');
    dispatch(fetchPerformanceTest(date));
    dispatch((getmonthMemberReward(date)));
    this.charts.forEach((chart) => {
      chart.destroy();
    });
    this.charts = [];
  }

  handleNextMonth(e) {
    const { dispatch } = this.props;
    e.preventDefault();
    const month = this.state.month;
    const currentYear = new Date().getFullYear();
    // const { handleNextMonth } = this.props;
    if (month.year() === currentYear && month.month() >= new Date().getMonth()) {
      return;
    }

    month.add(+1, 'M');
    // this.setState({ month });
    this.setState({
      month,
      selctedDate: month.format('YYYY年MM月'),
    });
    const date = month.format('YYYY-MM');
    dispatch(fetchPerformanceTest(date));
    dispatch((getmonthMemberReward(date)));
    this.charts.forEach((chart) => { chart.destroy(); });
    this.charts = [];
  }

  handleShowMonthSelectionModal(e) {
    e.preventDefault();
    this.setState({
      isModalOpen: true,
    });
  }

  handleAction() {
    const { handleChooseMonth, dispatch } = this.props;
    const year = this.yearSelect.getSelectedOptions()[0];
    const month = this.monthSelect.getSelectedOptions()[0] < 10 ?
      0 + this.monthSelect.getSelectedOptions()[0] : this.monthSelect.getSelectedOptions()[0];
    this.setState({ selctedDate: `${year}年${month}月` });
    this.setState({ month: moment(`${year}-${month}`) });
    dispatch(fetchPerformanceTest(`${year}-${month}`));
    dispatch((getmonthMemberReward(`${year}-${month}`)));
  }

  handleCloseModal(e) {
    e.preventDefault();
    this.setState({
      isModalOpen: false,
    });
  }

  handleMonthChange(e) {
    const currentMonth = parseInt(this.yearSelect.getSelectedOptions()[0], 10);
    this.setState({
      selctedYear: currentMonth,
    });
  }

  renderMonthLabel() {
    return (
      <a className="center" onClick={this.handleShowMonthSelectionModal} ref={c => (this.date = c)}>
        {this.state.selctedDate}
      </a>
    );
  }

  renderMonthSelection(selectedYear) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const monthLabel = [];
    if (selectedYear === currentYear) {
      for (let i = 0; i <= currentMonth; i++) {
        const isSelect = i === currentMonth ? 'selected' : '';
        monthLabel.push(
          (<option key={i} value={i + 1} selected={isSelect}>{(i + 1)}月</option>)
        );
      }
    } else {
      for (let i = 0; i <= 11; i++) {
        const isSelect = i === currentMonth ? 'selected' : '';
        monthLabel.push(
          (<option key={i} value={i + 1} selected={isSelect}>{(i + 1)}月</option>)
        );
      }
    }

    return monthLabel;
  }

  renderYearSelection() {
    const now = new Date();
    const year = now.getFullYear();
    const yearLabel = [];
    for (let i = 2003; i < year + 1; i++) {
      const isSelect = i === year ? 'selected' : '';
      yearLabel.push(
        (<option key={i} value={i} selected={isSelect}>{i}</option>)
      );
    }
    return yearLabel;
  }

  renderChooseMonthModal() {
    return (
      <Modal
        title="选择日期"
        ref={modal => (this.chooseMonthModal = modal)}
        role="alert"
        isOpen={this.state.isModalOpen}
        onDismiss={this.handleCloseModal}
        onAction={this.handleAction}
        closeViaBackdrop
      >
        <div className="hm-chooseMonthModal-container">
          <Field
            type="select"
            ref={select => (this.yearSelect = select)}
            label="年份"
            onChange={this.handleMonthChange}
          >
            {this.renderYearSelection()}
          </Field>
          <Field type="select" ref={select => (this.monthSelect = select)} label="月份">
            {this.renderMonthSelection(this.state.selctedYear)}
          </Field>
        </div>
      </Modal>
    );
  }

  render() {
    const { user } = this.props;
    let monthMemberReward;
    let monthDealReward;
    if (user.monthMemberReword.pager.currentMonthMemberReword !== '') {
      monthMemberReward = user.monthMemberReword.pager.currentMonthMemberReword;
    }
    if (!user.performanceTest.pager.currentMonthReword) {
      monthDealReward = <i className="iconfont icon-jiazai hm-pulse hm-loading" />;
    } else if (user.performanceTest.pager.currentMonthReword) {
      monthDealReward =
      parseInt(user.performanceTest.pager.currentMonthReword, 10).toLocaleString();
    }
    return (
      <div className="hm-performance-wrapper">
        <DeafaultHeader title="绩效考核" history={this.props.history} />
        {this.renderChooseMonthModal()}
        <header className="hm-performancetest-header">

          <div className="menu-item">
            <div>
              <i className="iconfont icon-xiaoshoumingxi" />
              <span className="text small">本月交易提成</span>
            </div>
            {monthDealReward}
          </div>
          <div className="menu-item">
            <div>
              <i className="iconfont icon-jiangjin" />
              <span className="text small">本月维护奖金</span>
            </div>
            {monthMemberReward ?
              parseInt(monthMemberReward, 10).toLocaleString() :
              <i className="iconfont icon-jiazai hm-pulse hm-loading" />
            }
          </div>
        </header>
        <div className="hm-performancetest-nav">
          <a id="hm_performance_previous_button" className="left" onClick={this.handlePrevMonth}>
            <i className="icon icon-left-nav" />
          </a>
          {this.renderMonthLabel()}
          <a id="hm_performance_next_button" className="right" onClick={this.handleNextMonth}>
            <i className="icon icon-right-nav" />
          </a>
        </div>
        <div className="hm-performancetest-list">
          <ul className="list">
            {
              user.performanceTest.assess &&
                user.performanceTest.assess.length > 0 ?
                user.performanceTest.assess.map((active, index) => {
                  const reactKey = `active-${index}`;
                  const percent = active.completePecent * 100;
                  return (
                    <li className="item item-content" key={reactKey}>
                      <div className="left">
                        <div className="chartContainer">
                          <ReactEcharts
                            option={this.getOption(percent)}
                            style={{ height: '100%', width: '100%' }}
                          />
                        </div>
                      </div>
                      <div className="right">
                        <div className="title">{active.showName}</div>
                        <div className="subtitle">
                          <p>当前绩效:
                            <span className="red">
                              {parseInt(active.rewardValue, 10).toLocaleString()}
                            </span>
                            元
                          </p>
                          <p>再售
                            {parseInt(active.nextRank, 10).toLocaleString()
                              - parseInt(active.complete, 10).toLocaleString()}元
                          <span className="red">绩效提升到
                            {
                                (parseInt(active.nextRank, 10).toLocaleString() *
                                  parseInt(active.nextLevel, 10)).toLocaleString() / 100
                              }
                          </span>元
                        </p>
                        </div>
                      </div>
                    </li>
                  );
                }) :
                <li className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有绩效</li>
            }
          </ul>
        </div>
      </div>
    );
  }
}

PerformanceTest.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object.isRequired,
  handlePrevMonth: PropTypes.func.isRequired,
  handleNextMonth: PropTypes.func.isRequired,
  handleChooseMonth: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    user,
  };
}

export default connect(mapStateToProps)(PerformanceTest);
