import { Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';

const Stripe = React.lazy(() => import('./pages/Stripe'));

function App() {
  return (
    <Suspense fallback="loading">
      <Routes>
        <Route path='/:tid' element={<Stripe />} />
      </Routes>
    </Suspense>
  );
}

export default App;
