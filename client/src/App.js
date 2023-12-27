import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import { Admin } from './components/admin/Admin';
import { Calendar } from './components/calendar/Calendar';

import { Engineering } from './components/engineering/Engineering';
import { EngJobs } from './components/engineering/EngJobs';
import { BendDeduction } from './components/engineering/BendDeduction';
import { Hardware } from './components/engineering/Hardware';
import { Machining } from './components/engineering/Machining';
import { Nesting } from './components/engineering/Nesting';
import { TapChart } from './components/engineering/TapChart';

import { Departments } from './components/departments/Departments';
import { TubeLaser } from './components/departments/TubeLaser';
import { Punch } from './components/departments/Punch';

import { Home } from './components/home/Home';
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
          path='/admin'
          element={<Admin />}
        />
        <Route
          path='/calendar'
          element={<Calendar />}
        />

        <Route
          path='/engineering'
          element={<Engineering />}
        />
        <Route
          path='/engjobs'
          element={<EngJobs />}
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
          path='/nesting'
          element={<Nesting />}
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
          path='/tubelaser'
          element={<TubeLaser />}
        />
        <Route
          path='/punch'
          element={<Punch />}
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