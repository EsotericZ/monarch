import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import { Admin } from './components/admin/Admin';
import { Calendar } from './components/calendar/Calendar';

import { Programming } from './components/engineering/Programming';
import { Engineering } from './components/engineering/Engineering';
import { Quality } from './components/engineering/Quality';
import { TLaserProg } from './components/engineering/TLaserProg';
import { FormingProg } from './components/engineering/FormingProg';
import { BendDeduction } from './components/engineering/BendDeduction';
import { Machining } from './components/engineering/Machining';
import { Hardware } from './components/engineering/Hardware';
import { TapChart } from './components/engineering/TapChart';

import { Departments } from './components/departments/Departments';
import { FLaser } from './components/departments/FLaser';
import { Laser } from './components/departments/Laser';
import { Punch } from './components/departments/Punch';
import { Saw } from './components/departments/Saw';
import { Shear } from './components/departments/Shear';
import { SLaser } from './components/departments/SLaser';
import { TubeLaser } from './components/departments/TubeLaser';

import { Purchasing } from './components/purchasing/Purchasing';

import { Home } from './components/home/Home';
import { Requests } from './components/home/Requests';
import { Inventory } from './components/inventory/Inventory';
import { Login } from './components/login/Login';
import { Maintenance } from './components/maintenance/Maintenance';
import { HubHealth } from './components/inventory/hubHealth/HubHealth';
import { Profile } from './components/profile/Profile';
import { Shipping } from './components/shipping/Shipping';
import { Test } from './components/test/Test';

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
          path='/tlaserprog'
          element={<TLaserProg />}
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
          element={<FLaser />}
        />
        <Route
          path='/laser'
          element={<Laser />}
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
          element={<SLaser />}
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