import React, { Component, PropTypes } from 'react';

class HMScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const {
      firstLoading,
    } = this.props;
    this.ListScroll = this.ListScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(e) {
    const scrollTop = document.body.scrollTop;
    const offsetHeight = document.body.offsetHeight;
    const scrollHeight = document.body.scrollHeight;
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }

}

HMScroll.propTypes = {
  firstLoading: PropTypes.any,
};

export default HMScroll;
