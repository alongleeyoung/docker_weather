import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Weather from './components/Weather';
import Tour from './components/Tour';
import Main from './components/Main';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/" element={<Main />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/tour" element={<Tour />} />
      </Routes>
    </Router>
  );
}

export default App;
