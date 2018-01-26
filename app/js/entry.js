import { render } from 'react-dom';

// include the polyfill you need to require it at the top
// of the entry point to your application.
import 'babel-polyfill';

// load files
import '../humans.txt';
import '../manifest.json';
import '../manifest.webapp';
import '../robots.txt';

// load Amaze UI Touch style
// @see https://github.com/jtangelder/sass-loader#imports
// You can just import it in app.scss
// import 'amazeui-touch/scss/amazeui.touch.scss'

// load style
import '../style/app.scss';

// load App
import './App.jsx';

// 数据源和路由
import configureStore from './store/configureStore';
import configureRouter from './store/configureRouter.jsx';

// 初始化批量生产Store.
const store = configureStore();
const routes = configureRouter(store);

document.addEventListener('DOMContentLoaded', () => {
  render(routes, document.getElementById('root'));
});
