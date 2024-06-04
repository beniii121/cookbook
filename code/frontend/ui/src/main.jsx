import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom';
import Layout from './components/Layout.jsx';
/**
 * Main wrapper for the react app
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Layout />
  </Router>,
)
