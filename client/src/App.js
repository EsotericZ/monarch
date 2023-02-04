import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Engineering from './components/engineering/Engineering';
import Home from './components/home/Home';

const App = () => {
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
      </Routes>
    </>
  );
}

export default App;