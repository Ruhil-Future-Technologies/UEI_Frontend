/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import Header from '../Header/index';
import Footer from '../Footer/index';
import Sidebar from '../Sidebar/index';
import { Outlet, useLocation } from 'react-router-dom';
import SessionTracker from '../Tracker';

const Main = () => {
  const location = useLocation();
  const userId = localStorage.getItem('_id');
  const hideFooterRoutes = ["/main/Chat/recentChat", "/main/Chat"]; // Add more routes as needed
  const synth: SpeechSynthesis = window?.speechSynthesis;
  useEffect(() => {
    synth.cancel();
  });
  return (
    <>
      <div className="main_block">
        <div className="header"></div>

        <div className="main_section" id="main-content">
          <Header />
          <Sidebar />
          <SessionTracker userId={userId ? userId : ''} />
          <Outlet />
       
          {!hideFooterRoutes.includes(location.pathname) && <Footer />}
        </div>
      </div>
    </>
  );
};

export default Main;
