/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import Header from '../../Components/Header';
import { Outlet } from 'react-router-dom';
import Footer from '../../Components/Footer';
import ParentSideVar from './ParentSidevar';

const ParentMain = () => {
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
          <ParentSideVar />
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ParentMain;
