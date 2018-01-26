/* eslint max-len: [0] */
// 类库
import React from 'react';
import { Link } from 'react-router';
import { Container } from 'amazeui-touch';
import moment from 'moment';
// API utils
import {
  setIdToken,
  getToken,
  loadUserProfile,
  loadIdToken,
  removeCustomersFlag,
  removeCustomers,
  removeFilterConditions,
  removeKeyWords,
  getIsToday,
  removeIsToday,
} from './utils/apiUtils';

// DOM Utils.
import {
  getViewportHeight,
  outerHeight,
} from './utils/domUtils';

// 程序入口.
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentWillMount() {
    let { user } = this.props;
    const { router } = this.context;
    // 如果当前的状态机没有值, 表明页面已经被刷新, 从localstorage或sessionstore获取.
    if (!user) { user = loadUserProfile(); }
    const path = this.props.location.pathname;
    const newAccount = path.indexOf('idToken');
    if (!user && newAccount === -1) {
      router.push('/login');
      // router.push(`/login?redirect=${path}`);
    } else if (newAccount !== -1) {
      const newPath = decodeURIComponent(window.location.href);
      const idToken = newPath.slice(newPath.indexOf('{'), newPath.indexOf('}') + 1);
      setIdToken(idToken, 'needTrim');
      router.push('/home');
      window.location.reload(true);
    } else {
      this.user = user;
    }
    // 判断是否今天与localstorage里存的相同，否则重新弹出公告与鼓励语
    const isToday = getIsToday();
    const today = moment(moment().format('YYYY-MM-DD'));
    if (!today.isSame(isToday)) {
      removeIsToday();
    }
  }

  componentDidMount() {
    const originalViewportHeight = getViewportHeight();
    window.addEventListener('resize', this.handleResize);
    sessionStorage.setItem('originalViewportHeight', originalViewportHeight);
  }

  componentWillReceiveProps() {
    if (this.props.location.pathname.substr(1, 8) !== 'customer') {
      removeFilterConditions();
      removeKeyWords();
      removeCustomers();
      sessionStorage.removeItem('activeList');
      sessionStorage.removeItem('shoppingTime');
      sessionStorage.removeItem('checkedOrderType');
    }
  }

  componentWillUnmount() {
    removeCustomersFlag();
    window.removeEventListener('resize', this.handleResize);
    sessionStorage.removeItem('originalViewportHeight');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('activeList');
    sessionStorage.removeItem('buyTime');
  }

  handleResize(e) {
    const viewportHeight = getViewportHeight();
    const originalViewportHeight = sessionStorage.getItem('originalViewportHeight');
    if (viewportHeight >= originalViewportHeight) {
      this.setState({
        isShow: true,
      });
    } else {
      this.setState({
        isShow: false,
      });
    }
  }

  render() {
    const {
      location,
      params,
      children,
      history,
      route,
    } = this.props;
    const profile = loadIdToken();
    const { router } = this.context;
    const transition = children.props.transition || 'sfr';
    const pathName = location.pathname;
    const userType = sessionStorage.getItem('userType');
    let content;
    if (userType === null || userType === '导购' || pathName === '/home') {
      content = (
        <nav className="tabbar" ref={c => (this.tabBar = c)}>
          <Link
            title="首页"
            to="/home"
            className="tabbar-item tab-today"
            data-tab-name="today"
            activeClassName="active"
          >
            <span className="iconfont icon-jinri tab-icon" />
            <span className="tabbar-label">今日</span>
          </Link>
          <Link
            title="客户管理"
            className="tabbar-item tab-customer"
            to="/customer"
            data-tab-name="customer"
            activeClassName="active"
          >
            <span className="iconfont icon-kehu tab-icon" />
            <span className="tabbar-label">客户</span>
          </Link>
          <Link
            title="绩效任务"
            className="tabbar-item tab-task"
            data-tab-name="task"
            to="/performance"
            activeClassName="active"
          >
            <span className="iconfont icon-woderenwu tab-icon" />
            <span className="tabbar-label">我的</span>
          </Link>
          <Link
            title="门店协同"
            data-tab-name="store"
            className="tabbar-item tab-store"
            to="/cooperative"
            activeClassName="active"
          >
            <span className="iconfont icon-pingjia- tab-icon" />
            <span className="tabbar-label">评价</span>
          </Link>
        </nav>
      );
    } else if (userType === '店长' || userType === '督导' || pathName === '/managerHome') {
      content = (
        < nav className="tabbar manager" ref={c => (this.tabBar = c)}>
          <Link
            title="首页"
            to="/managerHome"
            className="tabbar-item tab-deal"
            activeClassName="active"
            data-tab-name="deal"
          >
            <span className="iconfont icon-uc_jingyingfenxi tab-icon" />
            <span className="tabbar-label">今日经营</span>
          </Link>
          <Link
            title="销售统计"
            className="tabbar-item tab-sale"
            to="/salesStatistics"
            activeClassName="active"
            data-tab-name="sale"
          >
            <span className="iconfont icon-tongji tab-icon" />
            <span className="tabbar-label">销售统计</span>
          </Link>
          <Link
            title="客户维护"
            className="tabbar-item tab-care"
            to="/customerCare"
            activeClassName="active"
            data-tab-name="care"
          >
            <span className="iconfont icon-weihukehu tab-icon" />
            <span className="tabbar-label">客户维护</span>
          </Link>
        </nav>
      );
    }
    if (this.user) {
      return (
        <Container direction="column" scrollable>
          <Container transition="">
            {React.cloneElement(children, { key: location.key })}
          </Container>
          {content}
        </Container >
      );
    }
    return null;
  }
}
// 定义context静态变量
// @see https://facebook.github.io/react/docs/context.html
App.contextTypes = {
  router: React.PropTypes.object.isRequired,
  user: React.PropTypes.object,
};

// 定义propTypes静态变量
App.propTypes = {
  location: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired,
  route: React.PropTypes.object.isRequired,
  user: React.PropTypes.object,
};

export default App;
