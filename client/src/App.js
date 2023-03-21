import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Admin } from './components/admin/Admin';
import { Engineering } from './components/engineering/Engineering';
import { Home } from './components/home/Home';
import { Maintenance } from './components/maintenance/Maintenance';
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
          path='/engineering'
          element={<Engineering />}
        />
        <Route
          path='/maintenance'
          element={<Maintenance />}
        />
        <Route
          path='/test'
          element={<Test />}
        />
      </Routes>
    </>
  );
}