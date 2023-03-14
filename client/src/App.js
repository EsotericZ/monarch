import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Engineering } from './components/engineering/Engineering';
import { Home } from './components/home/Home';
import { Maintenance } from './components/maintenance/Maintenance';

export const App = () => {
  return (
    <>
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/engineering'
          element={<Engineering />}
        />
        <Route
          path='/maintenance'
          element={<Maintenance />}
        />
      </Routes>
    </>
  );
}