/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import Header from '../Header/index';
import Footer from '../Footer/index';
import Sidebar from '../Sidebar/index';
import { Outlet } from 'react-router-dom';
import SessionTracker from '../Tracker';

const Main = () => {
  const userId = localStorage.getItem('_id');

  console.log({ userId });

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
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Main;
