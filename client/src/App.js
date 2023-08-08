import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Admin } from './components/admin/Admin';
import { Calendar } from './components/calendar/Calendar';
import { Engineering } from './components/engineering/Engineering';
import { Home } from './components/home/Home';
import { Inventory } from './components/inventory/Inventory';
import { Login } from './components/login/Login';
import { Maintenance } from './components/maintenance/Maintenance';
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