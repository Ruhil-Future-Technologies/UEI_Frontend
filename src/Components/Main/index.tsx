/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import Header from '../Header/index';
import Footer from '../Footer/index';
import Sidebar from '../Sidebar/index';
import { Outlet } from 'react-router-dom';
import SessionTracker from '../Tracker';

const Main = () => {
  const user_type = localStorage.getItem('user_type');
  let userId: any = '';
  if (user_type == 'student') {
    userId = localStorage.getItem('_id');
  } else if (user_type == 'teacher') {
    userId = localStorage.getItem('teacher_id');
  } else if (user_type == 'institute') {
    userId = localStorage.getItem('institute_id');
  }
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
