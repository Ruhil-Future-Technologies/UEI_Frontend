import React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import Header from "../../Components/Header";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import logowhite from '../../../assets/img/logo-white.svg';
import { Link } from 'react-router-dom';

const ParentSideVar = () => {
  const handleMouseEnter = () => {
    document.body.classList.add('sidebar-hovered');
  };

  const handleMouseLeave = () => {
    document.body.classList.remove('sidebar-hovered');
  };
  function removeMobileToggle() {
    if (window.innerWidth > 1024) {
      document.querySelector('body')?.classList.add('toggled');
    } else {
      document.querySelector('body')?.classList.remove('toggled');
    }
  }
  function handleClick() {
    const main_content = document.querySelector('body');
    if (main_content) {
      if (main_content.classList.contains('toggled')) {
        main_content.classList.remove('toggled');
      } else {
        main_content.classList.add('toggled');
      }
    }
  }
  return (
    <>
      <aside
        className="sidebar-wrapper"
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        data-simplebar="true"
      >
        <div className="sidebar-header">
          <div className="logo-icon">
            <img src={logowhite} className="logo-img" alt="" />
          </div>
          <div className="logo-name flex-grow-1">
            <h5 className="mb-0">Gyansetu</h5>
          </div>
          <div className="sidebar-close">
            <span className="material-icons-outlined">
              <CloseOutlinedIcon onClick={handleClick} />
            </span>
          </div>
        </div>
        <div className="sidebar-nav">
          {/* <!--navigation--> */}
          <ul className="metismenu" id="sidenav">
            <li>
              <Link to="/parent-dashboard" onClick={removeMobileToggle}>
                <div className="parent-icon">
                  <HomeOutlinedIcon />
                </div>
                <div className="menu-title">Dashboard</div>
              </Link>
            </li>
            <li>
              <Link to="/parent-dashboard/chat" onClick={removeMobileToggle}>
                <div className="parent-icon">
                  <ChatOutlinedIcon />
                </div>
                <div className="menu-title">Chat with AI</div>
              </Link>
            </li>

            <li>
              <Link
                to="/parent-dashboard/feedback"
                onClick={removeMobileToggle}
              >
                <div className="parent-icon">
                  <InfoOutlinedIcon />
                </div>
                <div className="menu-title">Feedback</div>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default ParentSideVar;
