import React from 'react';
import { CalendarModule } from './components/CalendarModule';

function App() {
  const handleRangeChange = (range) => {
    console.log('Selected Range:', range);
  };

  return (
    <div className="w-full h-full">
      <CalendarModule onRangeChange={handleRangeChange} />
    </div>
  );
}

export default App;
