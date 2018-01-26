import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {
  Container,
  View,
} from 'amazeui-touch';


import { fetchStaffTask } from '../../../actions/store/staffTask';

import './todayCompleteTask.scss';

class TodayCompleteTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      isShow: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchStaffTask());
  }


  render() {
    const { finished, isTodayTaskGet } = this.props;
    return (
      <View>
        <Container className="hm-todayCompleteTask" scrollable>
          <div className="taskCard">
            <div className="cardHeader">今日员工销售机会跟进统计</div>
            <div className="cardBody">
              <dl className="notComplete">
                <dt>
                  <span>名字</span>
                  <span>已完成任务数/总任务数</span>
                </dt>
                {
                  isTodayTaskGet ?
                  finished.map((item, idx) => {
                    const key = `idx-${idx}`;
                    return (
                      <dd key={key}>
                        <span>{item.guiderName}</span>
                        <span>{item.molecule}/{item.denominator}</span>
                      </dd>
                    );
                  }) :
                  <dd className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />还没有数据</dd>
                }
              </dl>
            </div>
          </div>
        </Container>
      </View>
    );
  }
}


TodayCompleteTask.propTypes = {
  dispatch: PropTypes.func.isRequired,
  finished: PropTypes.array.isRequired,
  isTodayTaskGet: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { stores } = state;
  return {
    finished: stores.stores.finished,
    isTodayTaskGet: stores.stores.isTodayTaskGet,
  };
}

export default connect(mapStateToProps)(TodayCompleteTask);

