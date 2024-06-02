import { useState } from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom';

/**
 * Layout component for the CookBook frontend
 * 
 * A simple component that defines the layout of all the pages.
 */

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default Layout
