import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import moment from 'moment';
import {
  Container,
  List,
  Grid,
  Col,
  View,
  Modal,
} from 'amazeui-touch';

import { getAllStoreNotes } from '../../../actions/users/storeNote.js';
import DefaultHeader from '../../../components/hm-default-header/DefaultHeader.jsx';
import { outerHeight, getViewportHeight } from '../../../utils/domUtils';

import './alert.scss';

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isErrorHappend: false,
      isSucceed: false,
      isModalOpen: false,
      selectedAlert: {
        title: '',
        content: '',
        createDate: '',
      },
    };
    this.handleItemClick = this.handleItemClick.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getAllStoreNotes());
    const viewportHeight = getViewportHeight();
    const footerHeight = outerHeight(document.querySelector('.tabbar'));
    document.querySelector('.hm-alert').style.height =
      `${viewportHeight - footerHeight}px`;
  }

  onClose() {
    this.setState({
      isModalOpen: false,
    });
  }

  handleItemClick(alertData) {
    this.setState({
      selectedAlert: alertData,
      isModalOpen: true,
    });
  }

  createModal(alertData) {
    return (
      <Modal
        role="alert"
        title="门店通知详情"
        ref={modal => (this.modal = modal)}
        isOpen={this.state.isModalOpen}
        onDismiss={this.onClose}
        id="hm_alert_store_notification_modal"
        closeViaBackdrop
      >
        <Grid collapse align="between" className="hm-alert-grid">
          <Col cols={2} className="hm-alert-label">通知标题: </Col>
          <Col cols={4} className="hm-alert-content">{decodeURIComponent(alertData.title)}</Col>
        </Grid>
        <Grid collapse align="between" className="hm-alert-grid alert-content">
          <Col cols={2} className="hm-alert-label">通知详情: </Col>
          <Col cols={4} className="hm-alert-content">{decodeURIComponent(alertData.content)}</Col>
        </Grid>
        <Grid collapse align="between" className="hm-alert-grid">
          <Col cols={2} className="hm-alert-label">发布日期: </Col>
          <Col cols={4} className="hm-alert-content">
            {moment(alertData.createDate).format('YYYY年MM月DD号')}
          </Col>
        </Grid>
      </Modal>
    );
  }

  render() {
    const { user } = this.props;
    const dialog = this.createModal(this.state.selectedAlert);
    let contentJSX;
    if (user.isStoreAllNoteGet) {
      if (user.storeAllNoteList.length > 0) {
        contentJSX = user.storeAllNoteList.map((note, idx) => {
          const noteIdx = `note-${idx}`;
          return (
            <List.Item
              key={noteIdx}
              title={decodeURIComponent(note.title)}
              id={`hm_alert_store_notice_${idx}`}
              subTitle={moment(note.createDate).format('YYYY年MM月DD号')}
              onClick={() => this.handleItemClick(note)}
            />
          );
        });
      } else {
        contentJSX = (
          <li className="hm-null-wrapper">
            <p className="hm-null"><i className="iconfont icon-meiyouxiaoxi" />暂时没有收到门店通知</p>
          </li>
        );
      }
    } else {
      contentJSX = (
        <li className="hm-loading-wrapper">
          <i className="iconfont icon-jiazai hm-pulse hm-loading" />
        </li>
      );
    }
    return (
      <View>
        {dialog}
        <Container scrollable className="ks-grid">
          <div className="hm-alert">
            <DefaultHeader title="通知" history={this.props.history} />
            <List className="hm-alert-list">
              {contentJSX}
            </List>
          </div>
        </Container>
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  if (!user) {
    return {
      user: {
        storeAllNoteList: [],
        storeAllNotePager: {},
        isStoreAllNoteGet: false,
      },
    };
  }

  return {
    user,
  };
}

export default connect(mapStateToProps)(Alert);

Alert.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  error: PropTypes.object,
  history: React.PropTypes.object.isRequired,
};
