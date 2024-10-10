import React, { useEffect } from "react";
import Header from "../Header/index";
import Footer from "../Footer/index";
import Sidebar from "../Sidebar/index";
import "../Main/Main.scss";

import { Outlet } from "react-router-dom";
const Main = () => {
  let synth: SpeechSynthesis;
  synth = window.speechSynthesis;
  useEffect(()=>{
    synth.cancel();
  })
  return (
    <>
      <div className="main_block">
        <div className="header">
          <Header></Header>
        </div>

        <div className="main_section" id="main-content">
          <div className="sidebar_section">
            <Sidebar></Sidebar>
          </div>
          <div className="dashboard_main_content">
            <Outlet />
          </div>
          <div className="footer">
            <Footer></Footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
