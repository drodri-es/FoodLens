import React from 'react';
import { FoodLensProvider } from './context/FoodLensContext';
import { MobileShell } from './components/layout/MobileShell';

export function App() {
  return (
    <FoodLensProvider>
      <MobileShell />
    </FoodLensProvider>
  );
}

export default App;
