import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

function NavbarWrapper() {
  const location = useLocation();
  const shouldHideNavbar = location.pathname.includes('/youtuber') || location.pathname.includes('/editor/dashboard') || location.pathname.includes('/admin');

  return !shouldHideNavbar ? <Navbar /> : null;
}

export default NavbarWrapper;