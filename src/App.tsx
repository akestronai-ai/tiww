import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import SIPCalculator from './pages/SIPCalculator';
import CAGRCalculator from './pages/CAGRCalculator';

import ShariahScreener from './pages/ShariahScreener';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="sip-calculator" element={<SIPCalculator />} />
        <Route path="cagr-calculator" element={<CAGRCalculator />} />
        <Route path="shariah-screener" element={<ShariahScreener />} />
      </Route>
    </Routes>
  );
}

export default App;
