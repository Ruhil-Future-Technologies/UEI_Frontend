import React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import Header from "../../Components/Header";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import logowhite from '../../../assets/img/logo-white.svg';
import { Link } from 'react-router-dom';
const TeacherSideVar = () => {
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
              <Link to="/teacher-dashboard" onClick={removeMobileToggle}>
                <div className="parent-icon">
                  <HomeOutlinedIcon />
                </div>
                <div className="menu-title">Dashboard</div>
              </Link>
            </li>
            <li>
              <Link to="/teacher-dashboard/chat" onClick={removeMobileToggle}>
                <div className="parent-icon">
                  <ChatOutlinedIcon />
                </div>
                <div className="menu-title">Chat History</div>
              </Link>
            </li>
            <li>
              <Link
                to="/teacher-dashboard/Content"
                onClick={removeMobileToggle}
              >
                <div className="parent-icon">
                  <LibraryBooksOutlinedIcon />
                </div>
                <div className="menu-title">Content Library</div>
              </Link>
            </li>

            <li>
              <Link
                to="/teacher-dashboard/assignments"
                onClick={removeMobileToggle}
              >
                <div className="parent-icon">
                  <AssignmentOutlinedIcon />
                </div>
                <div className="menu-title">Assignments</div>
              </Link>
            </li>
            <li>
              <Link
                to="/teacher-dashboard/quizzes"
                onClick={removeMobileToggle}
              >
                <div className="parent-icon">
                  <QuestionAnswerOutlinedIcon />
                </div>
                <div className="menu-title">Quiz</div>
              </Link>
            </li>
          </ul>
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

          {/* <li className="menu-label">UI Elements</li>  */}
          <div className="sidebar-footer">
            {' '}
            <ul className="metismenu">
              <li>
                <Link
                  to="/teacher-dashboard/feedback"
                  onClick={removeMobileToggle}
                >
                  <div className="parent-icon">
                    <InfoOutlinedIcon />
                  </div>
                  <div className="menu-title">Feedback</div>
                </Link>
              </li>
              <li>
                <Link to="/teacher-dashboard/faq" onClick={removeMobileToggle}>
                  <div className="parent-icon">
                    <LiveHelpOutlinedIcon />
                  </div>
                  <div className="menu-title">FAQs</div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TeacherSideVar;
