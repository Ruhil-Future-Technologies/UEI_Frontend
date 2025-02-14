import React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import Header from "../../Components/Header";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Link } from 'react-router-dom';
import logowhite from '../../assets/img/logo-white.svg';
const InstituteSidevar = () => {
  const handleMouseEnter = () => {
    document.body.classList.add('sidebar-hovered');
  };

  const handleMouseLeave = () => {
    document.body.classList.remove('sidebar-hovered');
  };
  function removeMobileToggle() {
    if (window.innerWidth <= 1024) {
      document.querySelector('body')?.classList.remove('toggled');
    } else {
      document.querySelector('body')?.classList.remove('toggled');
    }
  }
  return (
    <aside
      className="sidebar-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
            <CloseOutlinedIcon onClick={removeMobileToggle} />
          </span>
        </div>
      </div>
      <div className="sidebar-nav">
        <ul className="metismenu" id="sidenav">
          <li>
            <Link to={'/institution-dashboard'} onClick={removeMobileToggle}>
              <div className="parent-icon">
                <HomeOutlinedIcon />
              </div>
              <div className="menu-title">Dashboard</div>
            </Link>
          </li>
          <li>
            <Link to={'/institution-dashboard/chat'}>
              <div className="parent-icon">
                {' '}
                <ChatOutlinedIcon />
              </div>
              <div className="menu-title">Chat with AI</div>
            </Link>
          </li>
          <li>
            <Link to="/">
              <div className="parent-icon">
                {' '}
                <LocalLibraryOutlinedIcon />
              </div>
              <div className="menu-title">Study Materials</div>
            </Link>
          </li>
          <li>
            <Link to="/institution-dashboard/feedback">
              <div className="parent-icon">
                <InfoOutlinedIcon />
              </div>
              <div className="menu-title">Feedback</div>
            </Link>
          </li>
          {/* <!-- <li>
                    <a href="javascript:;" className="has-arrow">
                        <div className="parent-icon"><i className="material-icons-outlined">home</i>
                        </div>
                        <div className="menu-title">Dashboard</div>
                    </a>
                    <ul>
                        <li><a href="index.html"><i className="material-icons-outlined">arrow_right</i>Analysis</a>
                        </li>
                        <li><a href="index2.html"><i className="material-icons-outlined">arrow_right</i>eCommerce</a>
                        </li>
                    </ul>
                </li> --> */}

          {/* <!-- <li className="menu-label">UI Elements</li> --> */}
        </ul>
        {/* <!--end navigation--> */}
      </div>
    </aside>
  );
};

export default InstituteSidevar;
