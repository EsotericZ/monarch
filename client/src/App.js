import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import { Admin } from './pages/admin/Admin';
import { AdminNew } from './pages/admin/AdminNew';
import { Calendar } from './pages/calendar/Calendar';

import { Programming } from './pages/programming/Programming';
import { Engineering } from './pages/programming/Engineering';
import { Quality } from './pages/programming/Quality';
import { QualityInfo } from './pages/programming/QualityInfo';
import { TubeLaserProg } from './pages/programming/TubeLaserProg';
import { FormingProg } from './pages/programming/FormingProg';
import { BendDeduction } from './pages/programming/BendDeduction';
import { Machining } from './pages/programming/Machining';
import { Hardware } from './pages/programming/Hardware';
import { TapChart } from './pages/programming/TapChart';

import { Departments } from './pages/departments/Departments';
import { FixtureLaser } from './pages/departments/FixtureLaser';
import { Laser } from './pages/departments/Laser';
import { Forming } from './pages/departments/Forming';
import { Punch } from './pages/departments/Punch';
import { Saw } from './pages/departments/Saw';
import { Shear } from './pages/departments/Shear';
import { StaticLaser } from './pages/departments/StaticLaser';
import { TubeLaser } from './pages/departments/TubeLaser';

import { Purchasing } from './pages/purchasing/Purchasing';
import { Supplies } from './pages/supplies/Supplies';

import { Scales } from './pages/scales/Scales';

import { VTiger } from './pages/vtiger/VTiger';

import { Home } from './pages/home/Home';
import { Requests } from './pages/home/Requests';
import { Inventory } from './pages/inventory/Inventory';
import { Login } from './pages/login/Login';
import { Maintenance } from './pages/maintenance/Maintenance';
import { HubHealth } from './pages/inventory/hubHealth/HubHealth';
import { Profile } from './pages/profile/Profile';
import { Shipping } from './pages/shipping/Shipping';
import { Test } from './pages/test/Test';

export const App = () => {
  return (
    <>
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/requests'
          element={<Requests />}
        />
        <Route
          path='/admin'
          element={<Admin />}
        />
        <Route
          path='/adminNew'
          element={<AdminNew />}
        />
        <Route
          path='/calendar'
          element={<Calendar />}
        />

        <Route
          path='/programming'
          element={<Programming />}
        />
        <Route
          path='/engineering'
          element={<Engineering />}
        />
        <Route
          path='/quality'
          element={<Quality />}
        />
        <Route
          path='/qualityinfo'
          element={<QualityInfo />}
        />
        <Route
          path='/tubelaserprog'
          element={<TubeLaserProg />}
        />
        <Route
          path='/formingprog'
          element={<FormingProg />}
        />
        <Route
          path='/benddeduction'
          element={<BendDeduction />}
        />
        <Route
          path='/hardware'
          element={<Hardware />}
        />
        <Route
          path='/machining'
          element={<Machining />}
        />
        <Route
          path='/tapchart'
          element={<TapChart />}
        />

        <Route
          path='/departments'
          element={<Departments />}
        />
        <Route
          path='/fixturelaser'
          element={<FixtureLaser />}
        />
        <Route
          path='/laser'
          element={<Laser />}
        />
        <Route
          path='/forming'
          element={<Forming />}
        />
        <Route
          path='/punch'
          element={<Punch />}
        />
        <Route
          path='/saw'
          element={<Saw />}
        />
        <Route
          path='/shear'
          element={<Shear />}
        />
        <Route
          path='/staticlaser'
          element={<StaticLaser />}
        />
        <Route
          path='/tubelaser'
          element={<TubeLaser />}
        />
        
        <Route
          path='/purchasing'
          element={<Purchasing />}
        />
        <Route
          path='/supplies'
          element={<Supplies />}
        />

        <Route
          path='/scales'
          element={<Scales />}
        />

        <Route
          path='/vtiger'
          element={<VTiger />}
        />

        <Route
          path='/inventory'
          element={<Inventory />}
        />
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/maintenance'
          element={<Maintenance />}
        />
        <Route
          path='/hubHealth'
          element={<HubHealth />}
        />
        <Route
          path='/profile'
          element={<Profile />}
        />
        <Route
          path='/shipping'
          element={<Shipping />}
        />
        <Route
          path='/test'
          element={<Test />}
        />
      </Routes>
    </>
  );
}