import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom';
import Layout from './components/Layout.jsx';
import {QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Main wrapper for the react app
 */

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  </Router>,
)
