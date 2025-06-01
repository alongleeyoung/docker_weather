import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Weather from './components/Weather';
import Tour from './components/Tour';
import Main from './components/Main';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/tour" element={<Tour />} />
      </Routes>
    </Router>
  );
}

export default App;
