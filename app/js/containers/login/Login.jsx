import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  Button,
  Notification,
  Loader,
} from 'amazeui-touch';

import { loginRequest, loginCancel } from '../../actions/auth';

import { parseJSON, loadIdToken } from '../../utils/apiUtils';

// DOM Utils.
import { getViewportHeight } from '../../utils/domUtils.js';

import '../../../imgs/page-login-logo.png';
import './login.scss';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isDisabled: false,
      logging: false,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
  }

  componentDidMount() {
    const viewportHeight = getViewportHeight();
    const { dispatch, params } = this.props;
    // 避免android系统下小键盘会把移动定位或是使用百分比高度的元素顶起.
    document.querySelector('.hm-login-header').style.height = `${viewportHeight * 0.45}px`;
    document.querySelector('.hm-login-form').style.height = `${viewportHeight * 0.35}px`;
    // 初始化登陆方法和取消登陆的方法.
    this.sendLoginRequest =
      ({ username, password }) => dispatch(loginRequest({ username, password }));
    this.cancel = () => dispatch(loginCancel());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      // logged in, let's show redirect if any, or show home
      try {
        const redirect = this.props.location.query.redirect;
        this.context.router.replace(redirect);
      } catch (err) {
        const { position } = loadIdToken();
        if (position === '2') {
          this.context.router.replace('/supervisor');
        } else {
          this.context.router.replace('/home');
        }
      }
    }
    // 显示登陆出错信息
    if (!nextProps.user && nextProps.loginError) {
      this.setState({
        visible: true,
        isDisabled: false,
        logging: false,
      });
    }
  }

  handleLogin(e) {
    e.preventDefault();
    this.setState({ isDisabled: true, logging: true });
    this.sendLoginRequest({
      username: this.accountRef.value,
      password: this.passwordRef.value,
    });
    return false;
  }

  closeNotification(e) {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { user, loginError } = this.props;
    return (
      <div className="hm-login-container">
        <header className="hm-login-header">
          <img src="../imgs/login/page-login-logo.png" alt="" />
          <p className="system-name">禾苗·导购助手</p>
        </header>
        <form action="post" className="hm-login-form" onSubmit={this.handleLogin}>
          <div className="field-group hm-login-form-text">
            <span className="field-group-label">
              <span className="iconfont icon-yonghu" />
            </span>
            <input
              type="text"
              name="account"
              ref={(c) => { this.accountRef = c; }}
              placeholder="请输入用户名"
              className="field"
            /* value={
              localStorage.getItem()
            }*/
            />
          </div>
          <div className="field-group hm-login-form-text">
            <span className="field-group-label">
              <span className="iconfont icon-ziyuan" />
            </span>
            <input
              type="password"
              name="password"
              ref={(c) => { this.passwordRef = c; }}
              placeholder="请输入密码"
              className="field"
            />
          </div>
          <Button
            amSize="xl"
            amStyle="warning"
            type="submit"
            disabled={this.state.isDisabled}
            hollow
          >登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录
            <Loader className={this.state.logging ? '' : 'hide'} amStyle="warning" rounded />
          </Button>
        </form>
        <Notification
          title="登录错误!"
          amStyle="alert"
          visible={this.state.visible}
          animated
          onDismiss={this.closeNotification}
        >
          {loginError && loginError.message}.
        </Notification>
        <ul className="hm-top-circle">
          <li className="first" />
          <li className="second" />
          <li className="third" />
          <li className="fourth" />
          <li className="fifth" />
          <li className="sixth" />
          <li className="seventh" />
          <li className="eighth" />
          <li className="ninth" />
          <li className="tenth" />
        </ul>
      </div>
    );
  }
}

Login.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

Login.propTypes = {
  user: PropTypes.object,
  loginError: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object,
};

function mapStateToProps(state) {
  const { auth } = state;
  if (auth) {
    return { user: auth.user, loginError: auth.loginError };
  }

  return { user: null };
}

export default connect(mapStateToProps)(Login);
