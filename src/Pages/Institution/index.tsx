import React, { useEffect } from "react";


import InstituteSidevar from "./instituteSidevar";
// import "../Main/Main.scss";
import { Outlet } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
// import "../../assets/css/main.min.css";
// import "../../assets/css/newstyle.min.css";
// import "../../assets/css/newstyle.scss";

const IntituteMain = () => {
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
          <InstituteSidevar />
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

export default IntituteMain;
