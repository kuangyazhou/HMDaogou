import React, { Component, PropTypes } from 'react';
import {
  Modal,
} from 'amazeui-touch';

export default class HMModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }

  openModal() {
    this.setState({
      isModalOpen: true,
    });
  }

  closeModal() {
    this.setState({
      isModalOpen: false,
    });
  }

  render() {
    return (
      <Modal
        ref={(c) => { this.modal = c; }}
        isOpen={this.state.isModalOpen}
        onDismiss={this.closeModal}
        closeViaBackdrop
        {...this.props.modalProps}
      />
    );
  }
}

HMModal.propTypes = {
  modalProps: PropTypes.object.isRequired,
};

