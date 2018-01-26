import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  Button,
  Notification,
  Loader,
} from 'amazeui-touch';

import { RESTFUL_SERVER } from '../../utils/apiUtils';

// DOM Utils.
import { getViewportHeight } from '../../utils/domUtils.js';

import '../../../imgs/page-login-logo.png';
import './login.scss';

class NewLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isDisabled: false,
      logging: false,
      errorCode: '',
    };
    this.closeNotification = this.closeNotification.bind(this);
    this.handleLoginByPhone = this.handleLoginByPhone.bind(this);
    this.handleGetCode = this.handleGetCode.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    if (window.location.href.indexOf('code') !== -1) {
      let loginCode;
      if (window.location.href.indexOf('&') !== -1) {
        loginCode = window.location.href.slice(
          window.location.href.indexOf('=') + 1,
          window.location.href.indexOf('&')
        );
      } else {
        loginCode = window.location.href.slice(
          window.location.href.indexOf('=') + 1,
          window.location.href.indexOf('#')
        );
      }
      if (loginCode && loginCode !== '0') {
        switch (loginCode) {
          case '-99':
            this.setState({
              errorCode: '请填写验证码',
            });
            break;
          case '-98':
            this.setState({
              errorCode: '请填写手机号',
            });
            break;
          case '-97':
            this.setState({
              errorCode: '该手机号未登记，请联系管理员',
            });
            break;
          case '-96':
            this.setState({
              errorCode: '该手机号存在重复登记记录，请联系管理员',
            });
            break;
          case '-95':
            this.setState({
              errorCode: '系统参数异常，请联系管理员',
            });
            break;
          case '-93':
            this.setState({
              errorCode: '该用户职位信息读取失败，请联系管理员',
            });
            break;
          case '-92':
            this.setState({
              errorCode: '该用户门店信息读取失败，请联系管理员',
            });
            break;
          case '-91':
            this.setState({
              errorCode: '该用户工号信息读取失败，请联系管理员',
            });
            break;
          case '-90':
            this.setState({
              errorCode: '登陆失败，请联系管理员',
            });
            break;
          case '-1':
            this.setState({
              errorCode: '验证码错误',
            });
            break;
          case '-2':
            this.setState({
              errorCode: '验证码失效',
            });
            break;
          default:
            this.setState({
              errorCode: '未知错误，请联系管理员',
            });
            break;
        }
      } else {
        this.setState({
          logging: false,
        });
      }
    }
  }

  componentDidMount() {
    const viewportHeight = getViewportHeight();
    const { dispatch, params } = this.props;
    // 避免android系统下小键盘会把移动定位或是使用百分比高度的元素顶起.
    document.querySelector('.hm-login-header').style.height = `${viewportHeight * 0.45}px`;
    document.querySelector('.login-by-phone').style.height = `${viewportHeight * 0.35}px`;
    const btn = document.querySelector('.to-login');
    if (this.phone.value === '' && this.code.value === '') {
      btn.setAttribute('disabled', true);
    }
  }

  handleLoginByPhone() {
    this.setState({
      logging: true,
      isDisabled: true,
    });
    let loginCode;
    if (window.location.href.indexOf('&') !== -1) {
      loginCode = window.location.href.slice(
        window.location.href.indexOf('=') + 1,
        window.location.href.indexOf('&')
      );
    } else {
      loginCode = window.location.href.slice(
        window.location.href.indexOf('=') + 1,
        window.location.href.indexOf('#')
      );
    }
    if (loginCode && loginCode !== '0') {
      return true;
    }
    return false;
  }

  handleGetCode(e) {
    const { dispatch } = this.props;
    const mobile = this.phone.value;
    const config = {
      method: 'post',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile,
      }),
    };
    fetch(`${RESTFUL_SERVER}/crm/bind/send_code.json`, config)
      .then(response => response.json())
      .then(json => {
        const result = json.code;
        if (result && result !== 0) {
          switch (result) {
            case -99:
              this.setState({
                errorCode: '网络异常，请联系管理员',
              });
              break;
            case -98:
              this.setState({
                errorCode: '请填写手机号',
              });
              break;
            case -97:
              this.setState({
                errorCode: '该手机号未登记，请联系管理员',
              });
              break;
            case -96:
              this.setState({
                errorCode: '该手机号存在重复登记记录，请联系管理员',
              });
              break;
            case -1:
              this.setState({
                errorCode: '网络异常，请联系管理员',
              });
              break;
            case -2:
              this.setState({
                errorCode: '短信发送失败，请联系管理员',
              });
              break;
            case -3:
              this.setState({
                errorCode: '短信发送失败，请联系管理员',
              });
              break;
            case -4:
              this.setState({
                errorCode: '您今日获取验证码次数已达上限',
              });
              break;
            case -5:
              this.setState({
                errorCode: '短信发送失败，请联系管理员',
              });
              break;
            default:
              this.setState({
                errorCode: '未知错误，请联系管理员',
              });
              break;
          }
        }
      })
      .catch(err => {
        this.setState({
          errorCode: 'err',
        });
      });
    const btn = e.target;
    btn.classList.add('disabled');
    let time = 60;
    btn.textContent = `${time}秒后再次获取`;
    btn.setAttribute('disabled', true);
    const timer = setInterval(() => {
      time--;
      btn.textContent = `${time}秒后再次获取`;
      if (time === 0) {
        clearInterval(timer);
        btn.textContent = '发送验证码';
        btn.removeAttribute('disabled');
        btn.classList.remove('disabled');
      }
    }, 1000);
  }

  handleChange() {
    const btn = document.querySelector('.to-login');
    if (this.phone.value !== '' && this.code.value !== '') {
      btn.removeAttribute('disabled');
    } else {
      btn.setAttribute('disabled', true);
    }
  }

  closeNotification(e) {
    this.setState({
      visible: false,
      errorCode: '',
    });
  }

  render() {
    const { user, loginError } = this.props;
    const requestUrl = `${RESTFUL_SERVER}/crm/bind/check_code.htm`;
    return (
      <div className="hm-login-container">
        <header className="hm-login-header">
          <img src="../imgs/login/page-login-logo.png" alt="" />
          <p className="system-name">禾苗·导购助手</p>
        </header>
        <form
          action={requestUrl}
          method="POST"
          className="login-by-phone"
          onSubmit={this.handleLoginByPhone}
        >
          <div className="phone-wrapper">
            <label htmlFor="phone">
              <i className="iconfont icon-dianhua" />
            </label>
            <input
              type="tel"
              id="phone"
              maxLength="11"
              name="mobile"
              onChange={this.handleChange}
              ref={(c) => { this.phone = c; }}
            />
          </div>
          <div className="validate-code-wrapper">
            <label htmlFor="code">
              <i className="iconfont icon-ziyuan" />
            </label>
            <input
              type="tel"
              id="code"
              name="checkCode"
              maxLength="6"
              onChange={this.handleChange}
              ref={(c) => { this.code = c; }}
            />
            <button className="send-code" onClick={this.handleGetCode}>获取验证码</button>
          </div>
          <Button
            amSize="xl"
            amStyle="warning"
            type="submit"
            className="to-login"
            disabled={this.state.isDisabled}
            hollow
          >登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录
            <Loader
              className={this.state.logging ? '' : 'hide'}
              amStyle="warning"
              rounded
            />
          </Button>
        </form>
        <Notification
          title="登录错误!"
          amStyle="alert"
          visible={this.state.errorCode !== ''}
          animated
          onDismiss={this.closeNotification}
        >
          {this.state.errorCode}
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

NewLogin.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

NewLogin.propTypes = {
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

export default connect(mapStateToProps)(NewLogin);
