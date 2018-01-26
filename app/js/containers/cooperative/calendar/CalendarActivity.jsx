import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { If, Then, Else } from 'react-if';
import moment from 'moment';
import {
  Container,
  View,
} from 'amazeui-touch';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from '../../../utils/domUtils';

// actions.
import {
  fetchYearAllShopActivitys,
} from '../../../actions/users/currentActivity';

// Component.
import Calendar from '../../../components/hm-calendar/Calendar.jsx';

import './calendar.scss';

class CalendarActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
    };
    this.loadActives = this.loadActives.bind(this);
  }

  componentDidMount() {
    const { params } = this.props;
    const { dispatch } = this.props;
    dispatch(fetchYearAllShopActivitys());
  }

  loadActives(month) {
    const { dispatch } = this.props;
    dispatch(fetchYearAllShopActivitys(month.format('YYYY-MM')));
  }

  render() {
    const { user } = this.props;
    return (
      <View>
        <Container className="ks-grid">
          <Calendar
            selectedMonth={moment().startOf('day')}
            activity={user.shopActives}
            onPrevOrNext={this.loadActives}
            history={this.props.history}
          />
        </Container>
      </View>
    );
  }
}

CalendarActivity.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { user } = state;
  if (!user) {
    return {
      user: {
        shopActives: {
          pager: {
            currentPage: 1,
            totalPage: 1,
            totalItem: 0,
          },
          actives: [],
        },
      },
    };
  }
  return {
    user,
  };
}

export default connect(mapStateToProps)(CalendarActivity);
