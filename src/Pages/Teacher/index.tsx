/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import Header from '../../Components/Header';
import { Outlet } from 'react-router-dom';
import Footer from '../../Components/Footer';
import TeacherSideVar from './TeacherSidevar';
const TeacherMain = () => {
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
          {/* <div className="sidebar_section"> */}
          <TeacherSideVar />
          {/* </div> */}
          {/* <div className="dashboard_main_content"> */}
          <Outlet />
          {/* </div> */}
          {/* <div className="footer"> */}
          {/* </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TeacherMain;
