/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MetisMenu from '@metismenu/react';
import useApi from '../../hooks/useAPI';
import gyansetuLogo from '../../assets/img/logo-white.svg';
import { QUERY_KEYS_MENU } from '../../utils/const';
//import PerfectScrollbar from 'react-perfect-scrollbar';
//import 'react-perfect-scrollbar/dist/css/styles.css';
import '../../../node_modules/metismenujs/dist/metismenujs.css';
import 'simplebar-react/dist/simplebar.min.css';

const Sidebar = () => {
  const [menuList1, setMenuList1] = useState<any>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<boolean>(false);

  // const [masterCollapsible, setMasterCollapsible] = useState(false);
  const user_type = localStorage.getItem('user_type');
  const [profileCompletion, setProfileCompletion] = useState(
    localStorage.getItem('Profile_completion') || '0',
  );
  const MenuListURL = QUERY_KEYS_MENU.GET_MENU;
  const MenuListURL1 = QUERY_KEYS_MENU.GET_MENULIST;

  const { getData } = useApi();
  const profileData: any = sessionStorage.getItem('userdata');
  let basicinfo: any = {};
  if (profileData !== null) {
    basicinfo = JSON.parse(profileData);
  }

  useEffect(() => {
    callAPI();
  }, []);

  useEffect(() => {}, [menuList1]);

  const callAPI = async () => {
    getData(`${MenuListURL}/${user_type}`)
      .then((data: any) => {
        if (data.data.sorted_menus) {
          // setMenuList(data.data);
          localStorage.setItem(
            'menulist',
            JSON.stringify(data?.data.sorted_menus),
          );
        }
      })
      .catch((e: any) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const callAPI1 = async () => {
    if (basicinfo?.basic_info !== null) {
      getData(`${MenuListURL1}/${basicinfo?.id}`)
        .then((data: any) => {
          if (data.data) {
            if (data.data.menus_data_list) {
              const menuData = data.data.menus_data_list;
              setMenuList1(menuData);
              localStorage.setItem('menulist1', JSON.stringify(menuData));
            }
            const saved = localStorage.getItem('menulist1');
            if (!saved) {
              console.warn('Failed to save menulist1');
            }
          }
        })
        .catch((e: any) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    }
  };
  useEffect(() => {
    if (profileData !== null && basicinfo?.id !== null) {
      callAPI1();
    }
  }, [profileData]);

  useEffect(() => {
    const handleProfileCompletionChange = () => {
      const newProfileCompletion =
        localStorage.getItem('Profile_completion') || '0';
      setProfileCompletion(newProfileCompletion);
    };

    // Set up an interval to check for changes every second
    const intervalId = setInterval(handleProfileCompletionChange, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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

  const toggleMenu = (id: number) => {
    setOpenMenu((prevOpenMenu) => (prevOpenMenu === id ? null : id));
  };

  return (
    <>
      <aside
        className="sidebar-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="sidebar-header">
          <div className="logo-icon">
            <img src={gyansetuLogo} className="logo-img" alt="" />
          </div>
          <div className="logo-name flex-grow-1">
            <h5 className="mb-0">Gyansetu</h5>
          </div>
          <div className="sidebar-close">
            <CloseOutlinedIcon onClick={removeMobileToggle} />
          </div>
        </div>
        <div className="sidebar-nav">
          <MetisMenu>
            <li>
              <Link to="/main/DashBoard" onClick={removeMobileToggle}>
                <div className="parent-icon">
                  <HomeOutlinedIcon />
                </div>
                <div className="menu-title">Dashboard</div>
              </Link>
            </li>
            {user_type === 'student' ? (
              <>
                {Number(profileCompletion) === 100 ? (
                  <>
                    <li>
                      <Link
                        to="/main/Chat/recentChat"
                        onClick={removeMobileToggle}
                      >
                        <div className="parent-icon">
                          <ChatOutlinedIcon />
                        </div>
                        <div className="menu-title">Chat</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/main/Chat" onClick={removeMobileToggle}>
                        <div className="parent-icon">
                          <LocalLibraryOutlinedIcon />
                        </div>
                        <div className="menu-title">Chat History</div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/main/student/content"
                        onClick={removeMobileToggle}
                      >
                        <div className="parent-icon">
                          <LocalLibraryOutlinedIcon />
                        </div>
                        <div className="menu-title">Content Library</div>
                      </Link>
                    </li>
                  </>
                ) : (
                  ''
                )}
              </>
            ) : (
              <>
                {menuList1 && user_type !== 'student' ? (
                  menuList1.map((menu: any) => {
                    return (
                      <li key={menu.id}>
                        {menu.submenus && menu.submenus.length > 0 ? (
                          <>
                            <a
                              key={menu.id}
                              className="has-arrow"
                              onClick={() => toggleMenu(menu.id)}
                              aria-expanded={openMenu === menu.id}
                            >
                              {' '}
                              <div className="parent-icon">
                                <AdminPanelSettingsOutlinedIcon />
                              </div>
                              <div className="menu-title">
                                {menu.menu_name}{' '}
                              </div>{' '}
                            </a>
                            <ul
                              id={menu.id}
                              className={`mm-collapse ${
                                openMenu === menu.id ? 'mm-show' : ''
                              }`}
                            >
                              {menu?.submenus?.map(
                                (submenu: any, index: number) => {
                                  // const menulist =
                                  //   submenu.menu_name === 'Sub Menu'
                                  //     ? 'SubMenu'
                                  //     : submenu.menu_name === 'Role Vs Form'
                                  //       ? 'RoleVsForm'
                                  //       : submenu.menu_name ===
                                  //             'Role Vs User' ||
                                  //           submenu.menu_name === 'RoleVsUser'
                                  //         ? 'RoleVsUser '
                                  //         : submenu.menu_name === 'Hobbies'
                                  //           ? 'Hobby'
                                  //           : submenu.menu_name ===
                                  //                 'Student Feedback' ||
                                  //               submenu.menu_name ===
                                  //                 'StudentFeedback'
                                  //             ? 'StudentFeedback'
                                  //             : submenu.menu_name;
                                  const menulist = submenu.submenu_url;
                                  if (
                                    submenu.menu_name.toLowerCase() ===
                                    'institute'
                                  ) {
                                    return (
                                      <li
                                        className={`${
                                          openSubMenu ? 'mm-active' : ''
                                        }`}
                                        key={index}
                                      >
                                        <a
                                          className="has-arrow"
                                          onClick={() =>
                                            setOpenSubMenu(!openSubMenu)
                                          }
                                        >
                                          <ArrowRightIcon />
                                          Institution
                                        </a>
                                        <ul
                                          className={`mm-collapse ${
                                            openSubMenu ? 'mm-show' : ''
                                          }`}
                                        >
                                          <li>
                                            <Link to="/main/University">
                                              {' '}
                                              <ArrowRightIcon />
                                              University
                                            </Link>
                                          </li>
                                          <li>
                                            <Link to="/main/Institute">
                                              {' '}
                                              <ArrowRightIcon />
                                              Institute
                                            </Link>
                                          </li>
                                          <li>
                                            <Link to="/main/Teacher">
                                              {' '}
                                              <ArrowRightIcon />
                                              Teacher
                                            </Link>
                                          </li>
                                          <li>
                                            <Link to="/main/Course">
                                              {' '}
                                              <ArrowRightIcon />
                                              Course
                                            </Link>
                                          </li>
                                          <li>
                                            <Link to="/main/Semester">
                                              {' '}
                                              <ArrowRightIcon />
                                              Semester
                                            </Link>
                                          </li>
                                          <li>
                                            <Link to="/main/Subject">
                                              {' '}
                                              <ArrowRightIcon />
                                              Subject
                                            </Link>
                                          </li>
                                        </ul>
                                      </li>
                                    );
                                  } else if (
                                    submenu.menu_name !== 'Course' &&
                                    submenu.menu_name !== 'Subject'
                                  ) {
                                    // Render only if it's not "Course" or "Subject"
                                    return (
                                      <li key={submenu.id}>
                                        <Link to={menulist}>
                                          <ArrowRightIcon />
                                          <div>{submenu.menu_name}</div>
                                        </Link>
                                      </li>
                                    );
                                  } else {
                                    // Return null for "Course" and "Subject" to skip rendering
                                    return null;
                                  }
                                },
                              )}
                            </ul>
                          </>
                        ) : (
                          <>
                            <li>
                              <Link to={menu?.form_data?.form_url}>
                                <div>{menu.menu_name}</div>
                              </Link>
                            </li>
                          </>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <></>
                )}
              </>
            )}
            {/* </ul> */}
          </MetisMenu>
        </div>
        {user_type === 'student' && (
          <div className="sidebar-footer">
            <div className="sidebar-nav">
              <ul className="metismenu">
                {Number(profileCompletion) === 100 && (
                  <li>
                    <Link
                      to="/main/student-feedback/add-student-feedback"
                      onClick={removeMobileToggle}
                    >
                      <div className="parent-icon">
                        <InfoOutlinedIcon />
                      </div>
                      <div className="menu-title">Feedback</div>
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/main/faq" onClick={removeMobileToggle}>
                    <div className="parent-icon">
                      <LiveHelpOutlinedIcon />
                    </div>
                    <div className="menu-title">FAQs</div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
