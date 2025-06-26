import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import InterviewSimulator from './components/InterviewSimulator';
import PreparationTools from './components/PreparationTools';
import Analytics from './components/Analytics';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<InterviewSimulator />} />
          <Route path="preparation" element={<PreparationTools />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;