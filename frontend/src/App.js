import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <nav className="navbar">
            <div className="nav-container">
              <Link to="/" className="nav-logo">
                Product Showcase
              </Link>
              <div className="nav-links">
                <Link to="/" className="nav-link">
                  Products
                </Link>
                <Link to="/admin" className="nav-link admin-link">
                  Admin Panel
                </Link>
              </div>
            </div>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="footer-container">
            <p>© 2025 Product Showcase & Enquiry System</p>
            <p>GVCC Solutions Company Assignment</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
