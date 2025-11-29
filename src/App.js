import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ShoppingListOverview from './components/ShoppingListOverview';
import ShoppingListDetail from './components/ShoppingListDetail';
import './components/styles.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ShoppingListOverview />} />
          <Route path="/detail/:id" element={<ShoppingListDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
