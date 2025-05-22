import React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import Header from "../../Components/Header";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Link } from 'react-router-dom';
import logowhite from '../../assets/img/logo-white.svg';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
const InstituteSidevar = () => {
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
            <CloseOutlinedIcon onClick={handleClick} />
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
            <Link
              to={'/institution-dashboard/chat'}
              onClick={removeMobileToggle}
            >
              <div className="parent-icon">
                {' '}
                <ChatOutlinedIcon />
              </div>
              <div className="menu-title">Chat with AI</div>
            </Link>
          </li>
          <li>
            <Link
              to="/institution-dashboard/Content"
              onClick={removeMobileToggle}
            >
              <div className="parent-icon">
                {' '}
                <LibraryBooksOutlinedIcon />
              </div>
              <div className="menu-title">Content Library</div>
            </Link>
          </li>
          <li>
            <Link
              to="/institution-dashboard/Teacher"
              onClick={removeMobileToggle}
            >
              <div className="parent-icon">
                {' '}
                <Person2OutlinedIcon />
              </div>
              <div className="menu-title">Teacher</div>
            </Link>
          </li>
          <li>
            <Link
              to="/institution-dashboard/Student"
              onClick={removeMobileToggle}
            >
              <div className="parent-icon">
                {' '}
                <SchoolOutlinedIcon />
              </div>
              <div className="menu-title">Student</div>
            </Link>
          </li>
          <li>
            <Link
              to="/institution-dashboard/bulkupload"
              onClick={removeMobileToggle}
            >
              <div className="parent-icon">
                {' '}
                <LibraryBooksOutlinedIcon />
              </div>
              <div className="menu-title">Bluk Data upload</div>
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
      <div className="sidebar-footer">
        {' '}
        <ul className="metismenu">
          <li>
            <Link to="/institution-dashboard/feedback">
              <div className="parent-icon">
                <InfoOutlinedIcon />
              </div>
              <div className="menu-title">Feedback</div>
            </Link>
          </li>
          <li>
            <Link to="/institution-dashboard/faq" onClick={removeMobileToggle}>
              <div className="parent-icon">
                <LiveHelpOutlinedIcon />
              </div>
              <div className="menu-title">FAQs</div>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default InstituteSidevar;
