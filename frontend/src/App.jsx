import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Rankings from './pages/Rankings';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;