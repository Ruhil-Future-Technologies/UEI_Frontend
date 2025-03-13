/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  QUERY_KEYS,
  QUERY_KEYS_ADMIN_BASIC_INFO,
  QUERY_KEYS_STUDENT,
} from '../../utils/const';
import useApi from '../../hooks/useAPI';
import NameContext from '../../Pages/Context/NameContext';
import maleImage from '../../assets/img/avatars/male.png';
import femaleImage from '../../assets/img/avatars/female.png';
import App13 from '../../assets/img/apps/13.png';
import App14 from '../../assets/img/apps/14.png';
import Avatar6 from '../../assets/img/avatars/06.png';
import MenuIcon from '@mui/icons-material/Menu';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const Header = () => {
  const context = useContext(NameContext);
  const {
    namepro,
    logoutpro,
    setNamepro,
    proImage,
    setProImage,
    setNamecolor,
    setProPercentage,
    setActiveForm,
  }: any = context;
  const StudentId = localStorage.getItem('user_uuid');
  const navigator = useNavigate();
  const profileURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
  const adminProfileURL = QUERY_KEYS_ADMIN_BASIC_INFO.ADMIN_GET_PROFILE;
  const user_type = localStorage.getItem('user_type');
  const [language, setLanguage] = useState<any>('EN');
  const [gender, setGender] = useState<any>('');
  const synth: SpeechSynthesis = window?.speechSynthesis;
  const { getData, postData } = useApi();
  const [dashboardURL, setDashboardURL] = useState('');

  const chataddconversationurl = QUERY_KEYS.CHAT_HISTORYCON;
  const userdata = JSON.parse(localStorage?.getItem('userdata') || '{}');

  const saveChat = async () => {
    const chatDataString = localStorage?.getItem('chatData');

    let chatData: any;
    if (chatDataString) {
      chatData = JSON.parse(chatDataString);
    } else {
      chatData = null;
    }

    const isChatFlagged =
      chatData?.[0]?.flagged ?? localStorage?.getItem('chatsaved') === 'true';

    let chat_payload;

    if (Array.isArray(chatData)) {
      chat_payload = {
        student_id: userdata.id,
        chat_title: chatData?.[0]?.question,
        chat_conversation: JSON.stringify(chatData),
        flagged: isChatFlagged,
      };

      try {
        await postData(`${chataddconversationurl}`, chat_payload);

        localStorage.removeItem('chatData');
        localStorage.removeItem('chatsaved');
      } catch (e: any) {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      }
    }
  };

  const handlogout = async () => {
    await saveChat();
    setProPercentage(0);
    localStorage.removeItem('theme');
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_uuid');
    localStorage.removeItem('pd');
    localStorage.removeItem('userdata');
    localStorage.removeItem('signupdata');
    localStorage.removeItem('menulist');
    localStorage.removeItem('menulist1');
    localStorage.removeItem('proFalg');
    localStorage.removeItem('loglevel');
    sessionStorage.removeItem('profileData');
    localStorage.removeItem('chatsaved');
    localStorage.removeItem('Profile_completion');
    localStorage.removeItem('Profile completion');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    localStorage.removeItem('_id');
    localStorage.removeItem('id');
    localStorage.removeItem('student_id');
    localStorage.removeItem('hasReloaded');
    synth.cancel();
    navigator('/');
    logoutpro();
  };

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
  const callAPI = async () => {
    getData(`${profileURL}/${StudentId}`)
      .then((data: any) => {
        if (data.data) {
          const basic_info = data.data.basic_info;
          if (basic_info && Object.keys(basic_info).length > 0) {
            setGender(basic_info?.gender);
            setNamepro({
              first_name: basic_info?.first_name,
              last_name: basic_info?.last_name,
              gender: basic_info?.gender,
            });
            if (data?.data?.basic_info?.pic_path !== null) {
              getData(
                `${'upload_file/get_image/' + data?.data?.basic_info?.pic_path}`,
              )
                .then((imgdata: any) => {
                  setProImage(imgdata.data);
                })
                .catch(() => {});
            }
          }
          sessionStorage.setItem('profileData', JSON.stringify(data.data));
        }
      })
      .catch(() => {});
  };
  const getAdminDetails = () => {
    getData(`${adminProfileURL}/${StudentId}`)
      .then((response) => {
        if (response?.data) {
          sessionStorage.setItem('profileData', JSON.stringify(response.data));
          const adminInfo = response.data.basic_info;
          if (adminInfo && Object.keys(adminInfo).length > 0) {
            setGender(adminInfo?.gender);
            setNamepro({
              first_name: adminInfo?.first_name,
              last_name: adminInfo?.last_name,
              gender: adminInfo?.gender,
            });
            if (response?.data?.basic_info?.pic_path !== null) {
              getData(
                `${
                  'upload_file/get_image/' +
                  response?.data?.basic_info?.pic_path
                }`,
              )
                .then((imgdata) => {
                  setProImage(imgdata.data);
                })
                .catch(() => {});
            }
          }
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
  useEffect(() => {
    if (user_type === 'admin') {
      getAdminDetails();
      setDashboardURL('/main/DashBoard');
    } else if (user_type === 'institute') {
      setDashboardURL('/institution-dashboard');
    } else if (user_type === 'teacher') {
      setDashboardURL('/teacher-dashboard');
    } else {
      callAPI();
      setDashboardURL('/main/DashBoard');
    }
  }, []);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  useEffect(() => {
    function toggleOnDesktop() {
      if (window.innerWidth >= 1200) {
        document.querySelector('body')?.classList.add('toggled');
      } else {
        document.querySelector('body')?.classList.remove('toggled');
      }
    }
    toggleOnDesktop();
    window.addEventListener('resize', toggleOnDesktop);

    const theme = localStorage.getItem('theme');
    if (theme) {
      if (theme === 'default') {
        document?.documentElement?.setAttribute('data-theme', theme);
      } else {
        document?.documentElement?.setAttribute('data-bs-theme', theme);
      }
    }
  }, []);

  useEffect(() => {
    setNamecolor(theme);
    if (theme === 'default') {
      document?.documentElement?.setAttribute('data-theme', theme);
    } else if (theme === 'light') {
      document?.documentElement?.setAttribute('data-bs-theme', theme);
    } else if (theme === 'dark') {
      document?.documentElement?.setAttribute('data-bs-theme', theme);
    } else if (theme === 'blue-theme')
      document?.documentElement?.setAttribute('data-bs-theme', theme);
    else if (theme === 'semi-dark')
      document?.documentElement?.setAttribute('data-bs-theme', theme);
    else if (theme === 'bordered-theme')
      document?.documentElement?.setAttribute('data-bs-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const gotoProfile = () => {
    if (user_type === 'admin') {
      getAdminDetails();
      navigator('/main/adminprofile');
      setDashboardURL('/main/DashBoard');
    } else if (user_type === 'institute') {
      navigator('/institution-dashboard/profile');
      setDashboardURL('/institution-dashboard');
    } else if (user_type === 'teacher') {
      navigator('/teacher-dashboard/profile');
      setDashboardURL('/teacher-dashboard');
    } else {
      navigator('/main/StudentProfile');
      callAPI();
      setDashboardURL('/main/DashBoard');
      setTimeout(() => {
        window.location.reload();
      }, 20);
    }
    setActiveForm(0);
  };
  return (
    <>
      <header className="top-header">
        <nav className="navbar navbar-expand justify-content-between align-items-center gap-lg-4">
          <div
            className="btn-toggle"
            style={{
              cursor: 'pointer',
            }}
          >
            <MenuIcon data-testid="btn-toggle" onClick={handleClick} />
          </div>
          <ul className="navbar-nav gap-1 nav-right-links align-items-center">
            <li className="nav-item">
              <div className="toggle-mode nav-link" role="button">
                <DarkModeOutlinedIcon
                  onClick={toggleTheme}
                  data-testid="theme-toggle"
                />
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle dropdown-toggle-nocaret"
                href=""
                data-bs-toggle="dropdown"
              >
                <span>{language}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li onClick={() => setLanguage('EN')}>
                  <div className="dropdown-item d-flex align-items-center py-2">
                    <span className="ms-2">English</span>
                  </div>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative"
                data-bs-auto-close="outside"
                data-bs-toggle="dropdown"
                href="#"
                data-testid="notifications-toggle"
              >
                <NotificationsOutlinedIcon />
                <span className="badge-notify">5</span>
              </a>
              <div
                className="dropdown-menu dropdown-notify dropdown-menu-end shadow"
                data-testid="notifications-dropdown"
              >
                <div className="px-3 py-1 d-flex align-items-center justify-content-between border-bottom">
                  <h5 className="notiy-title mb-0">Notifications</h5>
                  <div className="dropdown">
                    <button
                      className="btn-secondary dropdown-toggle dropdown-toggle-nocaret option"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span>
                        <MoreVertOutlinedIcon />
                      </span>
                    </button>
                    <div className="dropdown-menu dropdown-option dropdown-menu-end shadow">
                      <div>
                        <div className="dropdown-item d-flex align-items-center gap-2 py-2">
                          <Inventory2OutlinedIcon
                            style={{ fontSize: '1rem' }}
                          />
                          Archive All
                        </div>
                      </div>
                      <div>
                        <div className="dropdown-item d-flex align-items-center gap-2 py-2">
                          <DoneAllOutlinedIcon style={{ fontSize: '1rem' }} />
                          Mark all as read
                        </div>
                      </div>
                      <div>
                        <div className="dropdown-item d-flex align-items-center gap-2 py-2">
                          <MicOffOutlinedIcon style={{ fontSize: '1rem' }} />
                          Disable Notifications
                        </div>
                      </div>
                      <div>
                        <div className="dropdown-item d-flex align-items-center gap-2 py-2">
                          <GradeOutlinedIcon style={{ fontSize: '1rem' }} />
                          What&apos;s new ?
                        </div>
                      </div>
                      <div>
                        <hr className="dropdown-divider" />
                      </div>
                      <div>
                        <div className="dropdown-item d-flex align-items-center gap-2 py-2">
                          <LeaderboardOutlinedIcon
                            style={{ fontSize: '1rem' }}
                          />
                          Reports
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <PerfectScrollbar className="notify-list">
                  <div>
                    <div>
                      <div className="dropdown-item border-bottom py-2">
                        <div className="d-flex align-items-center gap-3">
                          <div className="">
                            <img
                              src={maleImage}
                              className="rounded-circle"
                              width="45"
                              height="45"
                              alt=""
                            />
                          </div>
                          <div className="">
                            <h5 className="notify-title">
                              Congratulations Jhon.
                            </h5>
                            <p className="mb-0 notify-desc">
                              Many congtars jhons. You have won the gifts.
                            </p>
                            <p className="mb-0 notify-time">Today</p>
                          </div>
                          <div className="notify-close position-absolute end-0 me-3">
                            <CloseOutlinedIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="dropdown-item border-bottom py-2">
                        <div className="d-flex align-items-center gap-3">
                          <div className="user-wrapper bg-primary text-primary bg-opacity-10">
                            <span>RS</span>
                          </div>
                          <div className="">
                            <h5 className="notify-title">
                              New Account Created
                            </h5>
                            <p className="mb-0 notify-desc">
                              From USA an user has registered.
                            </p>
                            <p className="mb-0 notify-time">Yesterday</p>
                          </div>
                          <div className="notify-close position-absolute end-0 me-3">
                            <CloseOutlinedIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="dropdown-item border-bottom py-2">
                        <div className="d-flex align-items-center gap-3">
                          <div className="">
                            <img
                              src={App13}
                              className="rounded-circle"
                              width="45"
                              height="45"
                              alt=""
                            />
                          </div>
                          <div className="">
                            <h5 className="notify-title">Payment Recived</h5>
                            <p className="mb-0 notify-desc">
                              New payment recived successfully
                            </p>
                            <p className="mb-0 notify-time">1d ago</p>
                          </div>
                          <div className="notify-close position-absolute end-0 me-3">
                            <CloseOutlinedIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="dropdown-item border-bottom py-2">
                        <div className="d-flex align-items-center gap-3">
                          <div className="">
                            <img
                              src={App14}
                              className="rounded-circle"
                              width="45"
                              height="45"
                              alt=""
                            />
                          </div>
                          <div className="">
                            <h5 className="notify-title">New Order Recived</h5>
                            <p className="mb-0 notify-desc">
                              Recived new order from michle
                            </p>
                            <p className="mb-0 notify-time">2:15 AM</p>
                          </div>
                          <div className="notify-close position-absolute end-0 me-3">
                            <CloseOutlinedIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="dropdown-item border-bottom py-2">
                        <div className="d-flex align-items-center gap-3">
                          <div className="">
                            <img
                              src={Avatar6}
                              className="rounded-circle"
                              width="45"
                              height="45"
                              alt=""
                            />
                          </div>
                          <div className="">
                            <h5 className="notify-title">
                              Congratulations Jhon
                            </h5>
                            <p className="mb-0 notify-desc">
                              Many congtars jhon. You have won the gifts.
                            </p>
                            <p className="mb-0 notify-time">Today</p>
                          </div>
                          <div className="notify-close position-absolute end-0 me-3">
                            <CloseOutlinedIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="dropdown-item py-2">
                        <div className="d-flex align-items-center gap-3">
                          <div className="user-wrapper bg-danger text-danger bg-opacity-10">
                            <span>PK</span>
                          </div>
                          <div className="">
                            <h5 className="notify-title">
                              New Account Created
                            </h5>
                            <p className="mb-0 notify-desc">
                              From USA an user has registered.
                            </p>
                            <p className="mb-0 notify-time">Yesterday</p>
                          </div>
                          <div className="notify-close position-absolute end-0 me-3">
                            <CloseOutlinedIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </PerfectScrollbar>
              </div>
            </li>

            <li className="nav-item dropdown">
              <a
                href="javascrpt:;"
                className="dropdown-toggle dropdown-toggle-nocaret"
                data-bs-toggle="dropdown"
              >
                <img
                  src={
                    proImage
                      ? proImage
                      : gender?.toLowerCase() === 'female'
                        ? femaleImage
                        : maleImage
                  }
                  className="rounded-circle p-1 border"
                  width="45"
                  height="45"
                  alt=""
                />
              </a>
              <div className="dropdown-menu dropdown-user dropdown-menu-end shadow">
                <div className="dropdown-item  gap-2 py-2">
                  <div className="text-center">
                    <img
                      src={
                        proImage
                          ? proImage
                          : gender?.toLowerCase() === 'female'
                            ? femaleImage
                            : maleImage
                      }
                      className="rounded-circle p-1 shadow mb-3"
                      width="90"
                      height="90"
                      alt=""
                    />
                    <h5
                      className="user-name mb-0 fw-bold"
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >{`Hello, ${namepro?.first_name || 'User'}`}</h5>
                  </div>
                </div>
                <hr className="dropdown-divider" />
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  onClick={gotoProfile}
                >
                  <PersonOutlineOutlinedIcon />
                  Profile
                </button>
                <Link
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  to={dashboardURL}
                >
                  <DashboardOutlinedIcon />
                  Dashboard
                </Link>
                <Link
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  to="/main/changepassword"
                >
                  <LockResetOutlinedIcon />
                  Change Password
                </Link>

                <hr className="dropdown-divider" />
                <button
                  data-testid="logout-btn"
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  onClick={() => handlogout()}
                >
                  <PowerSettingsNewOutlinedIcon />
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
