import React, { useEffect, useState } from "react";
import Header from "../Header/index";
import Footer from "../Footer/index";
import Sidebar from "../Sidebar/index";
// import "../Main/Main.scss";
import { Outlet } from "react-router-dom";
// import "../../assets/css/main.min.css";
// import "../../assets/css/newstyle.min.css";
// import "../../assets/css/newstyle.scss";

const Main = () => {
  let synth: SpeechSynthesis;
  synth = window.speechSynthesis;
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
          <Sidebar />
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

export default Main;
