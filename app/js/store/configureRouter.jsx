/* eslint max-len: [0] */
import React from 'react';
import { isEmpty } from 'lodash';
import { Provider } from 'react-redux';
import { Router, Route, Link, IndexRedirect, hashHistory, withRouter } from 'react-router';
import { loadIdToken } from '../utils/apiUtils';

export default function (reducers) {
  const newlogin = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/login/NewLogin.jsx').default);
    });
  };

  const login = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/login/Login.jsx').default);
    });
  };

  const app = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../App.jsx').default);
    });
  };

  const home = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/home/Home.jsx').default);
    });
  };

  const managerHome = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/managerHome/ManagerHome.jsx').default);
    });
  };

  const salesStatistics = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/salesStatistics/SalesStatistics.jsx').default);
    });
  };

  const sales = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../components/hm-employee-sales/Sales.jsx').default);
    });
  };

  const calendarActivity = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/cooperative/calendar/CalendarActivity.jsx').default);
    });
  };

  const relations = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/customer/relations/Relations.jsx').default);
    });
  };

  const careOfGrowth = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/careOfGrowth/CareOfGrowth.jsx').default);
    });
  };

  const alert = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/cooperative/alerts/Alert.jsx').default);
    });
  };

  const targetTotal = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/run/targetTotal/TargetTotal.jsx').default);
    });
  };

  const todayNewCustomer = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/run/todayNewCustomer/TodayNewCustomer.jsx').default);
    });
  };

  const monthNewCustomer = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/care/monthNewCustomer/MonthNewCustomer.jsx').default);
    });
  };

  const monthTargetTotal = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/sales/monthTargetTotal/MonthTargetTotal.jsx').default);
    });
  };

  const monthProgressRank = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/sales/monthProgressRank/MonthProgressRank.jsx').default);
    });
  };

  const singleBrandSale = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/run/singleBrandSale/SingleBrandSale.jsx').default);
    });
  };

  const monthMainBrandProgressRank = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/sales/monthMainBrandProgressRank/MonthMainBrandProgressRank.jsx').default);
    });
  };

  const monthSingleBrandSale = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/sales/monthSingleBrandSale/MonthSingleBrandSale.jsx').default);
    });
  };

  const progressRank = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/run/progressRank/ProgressRank.jsx').default);
    });
  };

  const customer = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/customer/Customer.jsx').default);
    });
  };

  const customerFilter = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/customer/filter/Customer.Filter.jsx').default);
    });
  };

  const customerList = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/customer/list/Customer.List.jsx').default);
    });
  };

  const customerDetail = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/customer/details/Customer.Details.jsx').default);
    });
  };

  const orders = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/customer/orders/Orders.jsx').default);
    });
  };

  const customerRecord = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/customer/record/Customer.Record.jsx').default);
    });
  };

  const sendMessage = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/customer/message/Send.Message.jsx').default);
    });
  };

  const consume = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/customer/consume/Consume.jsx').default);
    });
  };

  const evaluate = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/cooperative/modules/evaluate/Evaluate.jsx').default);
    });
  };

  const contact = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/customer/contact/Contact.jsx').default);
    });
  };

  const customerCare = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/customerCare/CustomerCare.jsx').default);
    });
  };

  const customerManager = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/user/CustomerManager.jsx').default);
    });
  };

  const customerMarketing = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/customer/marketing/Marketing.jsx').default);
    });
  };

  const couponList = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/customer/coupon/Coupon.List.jsx').default);
    });
  };

  const cooperative = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/cooperative/Cooperative.jsx').default);
    });
  };

  const rankDetails = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/cooperative/modules/details/Details.jsx').default);
    });
  };

  const performance = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/performance/Performance.jsx').default);
    });
  };

  const performanceCoupon = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/performance/performanceCoupon/PerformanceCoupon.jsx').default);
    });
  };

  const performanceTest = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/performance/performanceTest/PerformanceTest.jsx').default);
    });
  };

  const performanceSuggest = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/performance/performanceSuggest/PerformanceSuggest.jsx').default);
    });
  };

  const physiologicalShaft = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/care/physiologicalShaft/PhysiologicalShaft.jsx').default);
    });
  };

  const staffSaleChangce = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/run/staffSaleChangce/StaffSaleChangce.jsx').default);
    });
  };

  const todayLogin = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/run/todayLogin/TodayLogin.jsx').default);
    });
  };

  const contacted = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/care/contacted/Contacted.jsx').default);
    });
  };

  const monetary = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/care/monetary/Monetary.jsx').default);
    });
  };

  const monthTaskComplete = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/care/monthTaskComplete/MonthTaskComplete.jsx').default);
    });
  };

  const newCustomer = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/care/newCustomer/NewCustomer.jsx').default);
    });
  };

  const customerCareRank = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/care/customerCareRank/CustomerCareRank.jsx').default);
    });
  };

  const notFound = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/misc/NotFound.jsx').default);
    });
  };

  const supervisor = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/supervisor/supervisor.jsx').default);
    });
  };

  const newmember = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/supervisor/newmember.jsx').default);
    });
  };
  const todaysale = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/supervisor/todaysale.jsx').default);
    });
  };
  const monthsale = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/supervisor/monthsale.jsx').default);
    });
  };
  const salechance = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/supervisor/salechance.jsx').default);
    });
  };
  const monthCoupon = (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/care/monthCoupon/MonthCounpon.jsx').default);
    });
  };

  let position = null;
  if (!isEmpty(loadIdToken())) {
    position = loadIdToken().position;
  }
  const path = position === '2' ? '/supervisor' : '/home';
  // withRouter HoC
  // @see https://github.com/reactjs/react-router/blob/0616f6e14337f68d3ce9f758aa73f83a255d6db3/upgrade-guides/v2.4.0.md#v240-upgrade-guide
  const routes = (
    <Provider store={reducers}>
      <Router history={hashHistory}>
        <Route path="/newlogin" getComponent={newlogin} />
        <Route path="/login" getComponent={login} />
        <Route path="/supervisor" getComponent={supervisor} />
        <Route path="/supervisor/newmember" getComponent={newmember} />
        <Route path="/supervisor/todaysale" getComponent={todaysale} />
        <Route path="/supervisor/monthsale" getComponent={monthsale} />
        <Route path="/supervisor/salechance" getComponent={salechance} />
        <Route path="/" getComponent={app}>
          <IndexRedirect to={path} />
          <Route path="/home" getComponent={home} />
          <Route path="/customerCare" getComponent={customerCare}>
            <Route path="/customerCare/:type" getComponent={customerCare} />
          </Route>
          <Route path="/calendarActivity(/:date)" getComponent={calendarActivity} />
          <Route path="/alerts(/:type)" getComponent={alert} />
          <Route path="/targetTotal" getComponent={targetTotal} />
          <Route path="/todayNewCustomer" getComponent={todayNewCustomer} />
          <Route path="/monthNewCustomer" getComponent={monthNewCustomer} />
          <Route path="/monthTargetTotal" getComponent={monthTargetTotal} />
          <Route path="/monthProgressRank" getComponent={monthProgressRank} />
          <Route path="/singleBrandSale" getComponent={singleBrandSale} />
          <Route path="/monthSingleBrandSale" getComponent={monthSingleBrandSale} />
          <Route path="/monthMainBrandProgressRank" getComponent={monthMainBrandProgressRank} />
          <Route path="/progressRank" getComponent={progressRank} />
          <Route path="/StaffSaleChangce/:type" getComponent={staffSaleChangce} />
          <Route path="/todayLogin" getComponent={todayLogin} />
          <Route path="/physiologicalShaft" getComponent={physiologicalShaft} />
          <Route path="/contacted" getComponent={contacted} />
          <Route path="/monthCoupon" getComponent={monthCoupon} />
          <Route path="/monetary" getComponent={monetary} />
          <Route path="/monthTaskComplete/:type" getComponent={monthTaskComplete} />
          <Route path="/newCustomer" getComponent={newCustomer} />
          <Route path="/physiologicalShaft" getComponent={physiologicalShaft} />
          <Route path="/customerCareRank" getComponent={customerCareRank} />
          <Route path="/consume" getComponent={consume} />
          <Route path="/careOfGrowth" getComponent={careOfGrowth} />
          <Route path="/customer(:index)" getComponent={customer}>
            <Route path="/customer/consume" getComponent={consume} />
            <Route path="/customer/filter" getComponent={customerFilter} />
            <Route path="/customer/relations(/:type)" getComponent={relations} />
            <Route path="/customer/list/newCustomer/:newCustomer" getComponent={customerList} />
            <Route path="/customer/list(:taskType|:keyword)" getComponent={customerList} />
            <Route path="/customer/list/brand/:brandId" getComponent={customerList} />
            <Route path="/customer/list/series/:seriesId" getComponent={customerList} />
            <Route path="/customer/list/cat/:catId" getComponent={customerList} />
            <Route path="/customer/list/goods/:goodsId" getComponent={customerList} />
            <Route path="/customer/list/composition/:compositionId" getComponent={customerList} />
            <Route path="/customer/list/tag/:tagName" getComponent={customerList} />
            <Route path="/customer/list/task/:taskType(/:contactType)" getComponent={customerList} />
            <Route path="/customer/details/:memberId(/:taskType)" getComponent={customerDetail} />
            <Route path="/customer/orders/:memberId" getComponent={orders} />
            <Route path="/customer/comments/:memberId" getComponent={customerRecord} />
            <Route path="/customer/message/:memberId(/:phone)/:taskRuleType(/:content)" getComponent={sendMessage} />
            <Route path="/customer/contact/:memberId/:time(/:type)" getComponent={contact} />
            <Route
              path="/customer/ownerCustomerDetail/:type/:month" getComponent={customerManager}
            />
            <Route
              path="/customer/marketing/:isBind/:type/:phone/:offlineId/:realname/:couponId(/:couponName)"
              getComponent={customerMarketing}
            />
            <Route
              path="/customer/coupon/list/:isBind/:phone/:offlineId/:realname"
              getComponent={couponList}
            />
          </Route>
          {/* 子路由 */}
          <Route path="/salesStatistics" getComponent={salesStatistics}>
            <Route path="/salesStatistics/:type" getComponent={salesStatistics} />
          </Route>
          <Route path="/managerHome" getComponent={managerHome}>
            <Route path="/managerHome(/:storeName)/:type" getComponent={managerHome} />
          </Route>
          <Route path="/cooperative" getComponent={cooperative}>
            <Route path="/cooperative/:module" getComponent={cooperative} />
            <Route path="/cooperative/ratings/:memberId/details" getComponent={rankDetails} />
            <Route path="/cooperative/compilation/:memberId/evaluate" getComponent={evaluate} />
          </Route>
          <Route path="/performance" getComponent={performance} />
          <Router path="/performance/performanceCoupon" getComponent={performanceCoupon} />
          <Router path="/performance/PerformanceTest" getComponent={performanceTest} />
          <Router path="/performance/performanceSuggest" getComponent={performanceSuggest} />
          <Router path="/sales" getComponent={sales} />
          <Route path="*" getComponent={notFound} />
        </Route>
      </Router>
    </Provider >
  );

  return routes;
}
