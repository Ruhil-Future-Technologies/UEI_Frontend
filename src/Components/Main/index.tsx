import React, { useEffect } from 'react';
import Header from '../Header/index';
import Footer from '../Footer/index';
import Sidebar from '../Sidebar/index';
import { Outlet } from 'react-router-dom';

const Main = () => {
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
          <Outlet />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Main;
