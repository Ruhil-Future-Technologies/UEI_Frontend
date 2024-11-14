import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import { toast } from "react-toastify";
import SimpleBar from "simplebar-react";
import styled from "styled-components";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import ThreePOutlinedIcon from "@mui/icons-material/ThreePOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Dashboard, Language, MenuOpen } from "@mui/icons-material";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";
import MetisMenu from "@metismenu/react";
import useApi from "../../hooks/useAPI";
import gyansetuLogo from "../../assets/img/logo-white.svg";
import { QUERY_KEYS_MENU } from "../../utils/const";
import sidebarlog from "../../assets/img/logo.svg";
import PerfectScrollbar from "react-perfect-scrollbar";

import "react-perfect-scrollbar/dist/css/styles.css";
// import "../Sidebar/Sidebar.scss";
// import "../../assets/css/newstyle.min.css";
// import "../../assets/css/main.min.css";
// import "../../assets/css/main.css";
import "../../../node_modules/metismenujs/dist/metismenujs.css";
import "simplebar-react/dist/simplebar.min.css";
// import { SidebarContainer } from "./SidebarContainer";

const Sidebar = () => {
  const [prescriptionsopen, setPrescriptionsopenOpen] = useState(false);
  const [testopen, setTestOpen] = useState(false);
  const [test, setTest] = useState(false);
  const [bill, setBill] = useState(false);
  const [menuList, setMenuList] = useState<any>([]);
  const [menuList1, setMenuList1] = useState<any>([]);
  const [setting, setSetting] = useState(false);
  const defaultSelectedIndex = 0;
  const [open, setOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<boolean>(false);

  const [masterCollapsible, setMasterCollapsible] = useState(false);
  const user_type = localStorage.getItem("user_type");
  const [profileCompletion, setProfileCompletion] = useState(
    localStorage.getItem("Profile_completion") || "0"
  );
  const MenuListURL = QUERY_KEYS_MENU.GET_MENU;
  const MenuListURL1 = QUERY_KEYS_MENU.GET_MENULIST;

  const { getData } = useApi();
  const profileData: any = sessionStorage.getItem("profileData");
  let basicinfo: any = {};
  if (profileData !== null) {
    basicinfo = JSON.parse(profileData);
  }
  // const defaultUserType = localStorage.getItem("user_type");
  // const defaultSelectedPath = (user_type === "student" ? "/main/chat" : "/main/Dashboard");

  // const [selectedPath, setSelectedPath] = useState(defaultSelectedPath);
  const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
  // console.log("==========menulistt", pathSegments, lastSegment)
  // const defaultSelectedIndex1 = "Dashboard";
  const [selectedIndex1, setSelectedIndex1] = useState(lastSegment);
  // const [userType, setUserType] = useState(defaultUserType);

  const menuItems = [
    {
      label: "Menu 1",
      children: [
        { label: "Submenu 1", href: "#" },
        { label: "Submenu 2", href: "#" },
      ],
    },
    { label: "Menu 2", href: "#" },
  ];

  useEffect(() => {
    setSelectedIndex(defaultSelectedIndex);
    // setUserType(defaultUserType);
    // setSelectedPath(selectedPath);
    callAPI();
  }, []);



  useEffect(() => {
    console.log("Menu List 1", menuList1);
  }, [menuList1]);

  const callAPI = async () => {
    getData(`${MenuListURL}/${user_type}`)
      .then((data: any) => {
        if (data.data) {
          setMenuList(data.data);
          localStorage.setItem("menulist", JSON.stringify(data?.data));
        }
      })
      .catch((e: any) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  };
  const handleListItemClick1 = (index: any) => {
    // console.log("handleListItem", index);
    setSelectedIndex1(index);
  };
  ///

  const callAPI1 = async () => {
    if (basicinfo?.basic_info !== null) {
      getData(`${MenuListURL1}/${basicinfo?.basic_info?.id}`)
        .then((data: any) => {
          console.log("Call API 1", data.data);

          if (data.data) {
            setMenuList1(data.data);
            localStorage.setItem("menulist1", JSON.stringify(data?.data));
          }
        })
        .catch((e: any) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    }
  };
  useEffect(() => {
    // console.log("test data",profileData !== null,basicinfo?.basic_info !== null)

    setSelectedIndex(defaultSelectedIndex);

    if (profileData !== null && basicinfo?.basic_info !== null) {
      // console.log("test data 11",profileData !== null,basicinfo?.basic_info !== null)
      callAPI1();
    }
  }, [profileData]);

  useEffect(() => {
    const handleProfileCompletionChange = () => {
      const newProfileCompletion =
        localStorage.getItem("Profile_completion") || "0";
      setProfileCompletion(newProfileCompletion);
    };

    // Set up an interval to check for changes every second
    const intervalId = setInterval(handleProfileCompletionChange, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  //  const callAPI1 = useCallback(() => {
  //   const profileData1:any = sessionStorage.getItem('profileData')
  //   if(profileData1!==null)
  //   {
  //     basicinfo = JSON.parse(profileData1)
  //   }
  //   const fetchData = async () => {
  //        await  getData(`${MenuListURL1}/${basicinfo?.basic_info?.id}`).then((data:any) => {
  //         if(data.data)
  //         {
  //           setMenuList1(data.data)
  //           localStorage.setItem('menulist1',JSON.stringify(data?.data));
  //         }
  //     }).catch((e:any) => {
  //         toast.error(e?.message, {
  //             hideProgressBar: true,
  //             theme: "colored",
  //             });
  //     });
  //   }
  //   if (basicinfo?.basic_info?.id !== undefined) {
  //   fetchData();
  //   }
  //     }, [basicinfo?.basic_info?.id]);

  //     useEffect(() => {
  //         callAPI1();
  //     }, [callAPI1]);

  const handleClickp = () => {
    setPrescriptionsopenOpen(!prescriptionsopen);
  };

  const handleClickt = () => {
    setTestOpen(!testopen);
  };

  const handleClicktest = () => {
    setTest(!test);
  };

  const handleClickbill = () => {
    setBill(!bill);
  };

  const handleClicksetting = () => {
    setSetting(!setting);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleMouseEnter = () => {
    document.body.classList.add("sidebar-hovered");
  };

  const handleMouseLeave = () => {
    document.body.classList.remove("sidebar-hovered");
  };
  function removeMobileToggle() {
    if (window.innerWidth <= 1024) {
      document.querySelector("body")?.classList.remove("toggled");
    } else {
      document.querySelector("body")?.classList.remove("toggled");
    }
  }

  const toggleMenu = (id: number) => {
    setOpenMenu((prevOpenMenu) => (prevOpenMenu === id ? null : id));
  };



  // console.log("test hhh",selectedIndex1)
  // const SidebarContainer = styled.aside`
  //   width: 250px;
  //   background-color: ${({ theme }) => theme['--bodybackground']};
  //   color: ${({ theme }) => theme['--bodycolor']};
  //   padding: 1rem;
  //   transition: all 0.3s linear;
  // `;

  return (
    // <SidebarContainer>
    <>
      {/* <div className="sidebar_main">
        <div
          className="offcanvas offcanvas-start"
          data-bs-scroll="true"
          data-bs-backdrop="false"
          tab-index="-1"
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
        > */}
      {/* <div className="offcanvas_header">
            <div className="header_logo">
              <img src={sidebarlog} alt="logo" />
              <span className="logo_txt">Symox</span>
            </div>
          </div> */}

      {/* <div className="offcanvas-body">
            <div className="inner_sidebar">
              <div className="menu_list" id="sidebar">
              <ul className="sidebar-nav" id="sidebar-nav">
                  {user_type === "student" ? (
                    <><ListItemButton
                      component={Link} to="/main/DashBoard"
                      selected={selectedIndex1?.toLowerCase() === "dashboard"}
                      className={selectedIndex1?.toLowerCase() === "dashboard" ? "selecteditem" : "unselecteditem"}
                      // style={{ backgroundColor: selectedIndex1?.toLowerCase() === "dashboard" ? '#024f52' : 'transparent', color: selectedIndex1?.toLowerCase() === "dashboard" ? "#fff" : "#fff" }}
                      onClick={() => handleListItemClick1("Dashboard")}
                    >
                      <ListItemIcon>
                        <Dashboard style={{ color: "#a8b0c5" }} />
                      </ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </ListItemButton>
                    {profileCompletion === "100" ?
                    <>
                    <ListItemButton
                          component={Link} to="/main/Chat/recentChat"
                          selected={selectedIndex1?.toLowerCase() === "recentchat"}
                          className={selectedIndex1?.toLowerCase() === "recentchat" ?"selecteditem" :"unselecteditem"}
                          // style={{ backgroundColor: selectedIndex1?.toLowerCase() === "recentChat" ? '#024f52' : 'transparent', color: selectedIndex1?.toLowerCase() === "recentChat" ? "#fff" : "#fff" }}
                          onClick={() => handleListItemClick1("recentChat")}
                        >
                            <ListItemIcon>
                              <ChatIcon style={{ color: "#a8b0c5" }} />
                            </ListItemIcon>
                            <ListItemText primary="Chat" />
                          </ListItemButton>
                    <ListItemButton
                          component={Link} to="/main/Chat"
                          selected={selectedIndex1?.toLowerCase() === "chat"}
                          className={selectedIndex1?.toLowerCase() === "chat" ?"selecteditem" :"unselecteditem"}
                          // style={{ backgroundColor: selectedIndex1?.toLowerCase() === "chat" ? '#024f52' : 'transparent', color: selectedIndex1?.toLowerCase() === "chat" ? "#fff" : "#fff" }}
                          // style={{ backgroundColor: selectedIndex === 0 ? 'red' : 'yellow' }}
                          onClick={() => handleListItemClick1("Chat")}
                        >
                          <ListItemIcon>
                            <ChatIcon style={{ color: "#a8b0c5" }} />
                          </ListItemIcon>
                          <ListItemText primary="Chat History" />
                          
                        </ListItemButton>
                    <ListItemButton
                          component={Link} to="/main/student-feedback/add-student-feedback"
                          selected={selectedIndex1?.toLowerCase() === "student-feedback"}
                          className={selectedIndex1?.toLowerCase() === "student-feedback" ?"selecteditem" :"unselecteditem"}
                          // style={{ backgroundColor: selectedIndex1?.toLowerCase() === "chat" ? '#024f52' : 'transparent', color: selectedIndex1?.toLowerCase() === "chat" ? "#fff" : "#fff" }}
                          // style={{ backgroundColor: selectedIndex === 0 ? 'red' : 'yellow' }}
                          onClick={() => handleListItemClick1("student-feedback")}
                        >
                          <ListItemIcon>
                            <ChatIcon style={{ color: "#a8b0c5" }} />
                          </ListItemIcon>
                          <ListItemText primary="Feedback" />
                          
                        </ListItemButton>

                        
                          </>
                          
                          :""}
                      </>
                  ) : 
                  (
                    <ListItemButton
                      component={Link} to="/main/DashBoard"
                      selected={selectedIndex1?.toLowerCase() === "dashboard"}
                      className={selectedIndex1?.toLowerCase() === "dashboard" ?"selecteditem" :"unselecteditem"}
                      // style={{ backgroundColor: selectedIndex1?.toLowerCase() === "dashboard" ? '#024f52' : 'transparent', color: selectedIndex1?.toLowerCase() === "dashboard" ? "#fff" : "#fff" }}
                      onClick={() => handleListItemClick1("Dashboard")}
                    >
                      <ListItemIcon>
                        <Dashboard style={{ color: "#a8b0c5" }} />
                      </ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </ListItemButton>
                  )}
                {menuList1 && user_type !== "student"  ?
                menuList1.map((menu:any)=>{
                  return(
                  <li className="nav-item" key={menu.id}>
                    {menu.submenus && menu.submenus.length > 0 ? 
                    <>
                      <a  className="nav-link collapsed" key={menu.id} data-bs-target={`#${menu.id}`} data-bs-toggle="collapse" href="#"> <i className="bi bi-journal-text"></i><span>{menu.menu_name} </span><i className="bi bi-chevron-down ms-auto"></i> </a>
                      <ul id={menu.id} className="nav-content collapse" data-bs-parent="#sidebar-nav">
                        {menu?.submenus?.map((submenu:any)=>{

                          let menulist = submenu.menu_name ==="Sub Menu" ? "SubMenu" : submenu.menu_name ==="Role Vs Form" ? "RoleVsForm": submenu.menu_name ==="Role Vs User" || submenu.menu_name ==='RoleVsUser' ? "RoleVsUser " : submenu.menu_name ==="Hobbies" ? "Hobby":  submenu.menu_name
                             return(
                                <li className="navhover" key={submenu.id}>
                                   <ListItemButton component={Link} to={menulist}
                                  //  <ListItemButton component={Link} to={submenu.url}
                                  className={selectedIndex1?.toLowerCase() === menulist.toLowerCase() ?"selecteditem" :"unselecteditem"}
                                      selected={selectedIndex1?.toLowerCase() === menulist.toLowerCase()}
                                      // style={{ backgroundColor: selectedIndex1?.toLowerCase() === menulist.toLowerCase() ? '#024f52' : 'transparent',color: selectedIndex1?.toLowerCase() === menulist.toLowerCase() ? "#fff":"#fff" }}
                                      onClick={() => handleListItemClick1(menulist)}
                                    >
                                      <ListItemIcon>
                                        <div className="sidebar_icon">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="21"
                                            height="21"
                                            viewBox="0 0 21 21"
                                            fill="#a8b0c5"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M0 10.5158C0 4.98448 4.4205 0 10.521 0C16.485 0 21 4.88983 21 10.4842C21 16.9725 15.708 21 10.5 21C8.778 21 6.867 20.5373 5.334 19.6329C4.7985 19.307 4.347 19.0651 3.7695 19.2544L1.6485 19.8853C1.113 20.0536 0.63 19.6329 0.7875 19.0651L1.491 16.7096C1.6065 16.3836 1.5855 16.0366 1.4175 15.7631C0.5145 14.1017 0 12.2824 0 10.5158ZM9.13574 10.5158C9.13574 11.2624 9.73424 11.8618 10.4797 11.8723C11.2252 11.8723 11.8237 11.2624 11.8237 10.5263C11.8237 9.77966 11.2252 9.18026 10.4797 9.18026C9.74474 9.16975 9.13574 9.77966 9.13574 10.5158ZM13.9775 10.5263C13.9775 11.2624 14.576 11.8723 15.3215 11.8723C16.067 11.8723 16.6655 11.2624 16.6655 10.5263C16.6655 9.77965 16.067 9.18025 15.3215 9.18025C14.576 9.18025 13.9775 9.77965 13.9775 10.5263ZM5.63892 11.8723C4.90392 11.8723 4.29492 11.2624 4.29492 10.5263C4.29492 9.77964 4.89342 9.18024 5.63892 9.18024C6.38442 9.18024 6.98292 9.77964 6.98292 10.5263C6.98292 11.2624 6.38442 11.8618 5.63892 11.8723Z"
                                            />
                                          </svg>
                                        </div>
                                      </ListItemIcon> */}
      {/* <ListItemText primary={submenu.menu_name} /> */}
      {/* <ListItemText primary={menulist} />
                                    </ListItemButton> */}
      {/* <a href={getPath(submenu.url)}> <i className="bi bi-circle"></i><span>{submenu.menu_name}</span> </a> */}
      {/* </li>
                             )

                        })}
                      </ul>
                    </>
                    : 
                    <>
                    <li>
                      <ListItemButton component={Link} to={menu?.form_data?.form_url}
                                        // selected={selectedIndex === 0}
                                        className={selectedIndex1?.toLowerCase() === menu?.form_data?.form_url?.toLowerCase() ?"selecteditem" :"unselecteditem"}
                                        selected={selectedIndex1?.toLowerCase() === menu?.form_data?.form_url.toLowerCase()}
                                        // style={{ backgroundColor: selectedIndex1?.toLowerCase() === menu?.form_data?.form_url?.toLowerCase() ? '#024f52' : 'transparent',color: selectedIndex1.toLowerCase() === menu?.form_data?.form_url.toLowerCase() ? "#fff":"#fff" }}
                                        onClick={() => handleListItemClick1(menu?.form_data?.form_url)}
                                      >
                      <ListItemIcon>
                          <div className="sidebar_icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="#a8b0c5"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0 10.5158C0 4.98448 4.4205 0 10.521 0C16.485 0 21 4.88983 21 10.4842C21 16.9725 15.708 21 10.5 21C8.778 21 6.867 20.5373 5.334 19.6329C4.7985 19.307 4.347 19.0651 3.7695 19.2544L1.6485 19.8853C1.113 20.0536 0.63 19.6329 0.7875 19.0651L1.491 16.7096C1.6065 16.3836 1.5855 16.0366 1.4175 15.7631C0.5145 14.1017 0 12.2824 0 10.5158ZM9.13574 10.5158C9.13574 11.2624 9.73424 11.8618 10.4797 11.8723C11.2252 11.8723 11.8237 11.2624 11.8237 10.5263C11.8237 9.77966 11.2252 9.18026 10.4797 9.18026C9.74474 9.16975 9.13574 9.77966 9.13574 10.5158ZM13.9775 10.5263C13.9775 11.2624 14.576 11.8723 15.3215 11.8723C16.067 11.8723 16.6655 11.2624 16.6655 10.5263C16.6655 9.77965 16.067 9.18025 15.3215 9.18025C14.576 9.18025 13.9775 9.77965 13.9775 10.5263ZM5.63892 11.8723C4.90392 11.8723 4.29492 11.2624 4.29492 10.5263C4.29492 9.77964 4.89342 9.18024 5.63892 9.18024C6.38442 9.18024 6.98292 9.77964 6.98292 10.5263C6.98292 11.2624 6.38442 11.8618 5.63892 11.8723Z"
                              />
                            </svg>
                          </div>
                      </ListItemIcon>
                      <ListItemText primary={menu.menu_name} />
                      </ListItemButton> */}
      {/* <a href={getPath(menu.url)}> <i className="bi bi-circle"></i><span>{menu.menu_name}</span> </a> */}
      {/* </li>
                    </>
                    }
                  </li>
                  )
                })
                 : <></>
                 } */}

      {/* {
                  user_type === "admin"  && (
                    <>
                    <ListItemButton
                     component={Link} to="/main/uploadpdf"
                     selected={selectedIndex1?.toLowerCase() === "uploadpdf"}
                     className={selectedIndex1?.toLowerCase() === "uploadpdf" ?"selecteditem" :"unselecteditem"}
                     // style={{ backgroundColor: selectedIndex1?.toLowerCase() === "uploadpdf" ? '#024f52' : 'transparent', color: selectedIndex1?.toLowerCase() === "uploadpdf" ? "#fff" : "#fff" }}
                     onClick={() => handleListItemClick1("uploadpdf")}
                   >
                       <ListItemIcon>
                         <ChatIcon style={{ color: "#a8b0c5" }} />
                       </ListItemIcon>
                       <ListItemText primary="Upload PDF" />
                     </ListItemButton>
                    <ListItemButton
                     component={Link} to="/main/pdflist"
                     selected={selectedIndex1?.toLowerCase() === "pdflist"}
                     className={selectedIndex1?.toLowerCase() === "pdflist" ?"selecteditem" :"unselecteditem"}
                     // style={{ backgroundColor: selectedIndex1?.toLowerCase() === "uploadpdf" ? '#024f52' : 'transparent', color: selectedIndex1?.toLowerCase() === "uploadpdf" ? "#fff" : "#fff" }}
                     onClick={() => handleListItemClick1("pdflist")}
                    >
                       <ListItemIcon>
                         <ChatIcon style={{ color: "#a8b0c5" }} />
                       </ListItemIcon>
                       <ListItemText primary="PDF List" />
                     </ListItemButton>
                     <ListItemButton
                      component={Link} to="/main/feedback"
                      selected={selectedIndex1?.toLowerCase() === "feedback"}
                      className={selectedIndex1?.toLowerCase() === "feedback" ?"selecteditem" :"unselecteditem"}
                      // style={{ backgroundColor: selectedIndex1?.toLowerCase() === "uploadpdf" ? '#024f52' : 'transparent', color: selectedIndex1?.toLowerCase() === "uploadpdf" ? "#fff" : "#fff" }}
                      onClick={() => handleListItemClick1("feedback")}
                    >
                        <ListItemIcon>
                          <ChatIcon style={{ color: "#a8b0c5" }} />
                        </ListItemIcon>

                        <ListItemText primary="Feedback" />
                      </ListItemButton> 
                     <ListItemButton
                      component={Link} to="/main/student-feedback"
                      selected={selectedIndex1?.toLowerCase() === "student-feedback"}
                      className={selectedIndex1?.toLowerCase() === "student-feedback" ?"selecteditem" :"unselecteditem"}
                      // style={{ backgroundColor: selectedIndex1?.toLowerCase() === "uploadpdf" ? '#024f52' : 'transparent', color: selectedIndex1?.toLowerCase() === "uploadpdf" ? "#fff" : "#fff" }}
                      onClick={() => handleListItemClick1("student-feedback")}
                    >
                        <ListItemIcon>
                          <ChatIcon style={{ color: "#a8b0c5" }} />
                        </ListItemIcon>
                        <ListItemText primary="Student Feedback" />
                      </ListItemButton> 
                    </>
                      
                  )                 
                 } */}
      {/* </ul>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <aside
        className="sidebar-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <PerfectScrollbar>
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
              {user_type === "student" ? (
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
                    </>
                   ) : (
                    ""
                  )} 
                </>
              ) : (
                <>
                  {menuList1 && user_type !== "student" ? (
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
                                {" "}
                                <div className="parent-icon">
                                  <AdminPanelSettingsOutlinedIcon />
                                </div>
                                <div className="menu-title">
                                  {menu.menu_name}{" "}
                                </div>{" "}
                              </a>
                              <ul
                                id={menu.id}
                                className={`mm-collapse ${openMenu === menu.id ? "mm-show" : ""
                                  }`}
                              >
                                {

                                }
                                {/* <li className={`${openSubMenu ? "mm-active" : ""
                                  }`}>
                                  <a className="has-arrow" onClick={() => setOpenSubMenu(!openSubMenu)} >
                                    <ArrowRightIcon />
                                    Institution</a>
                                  <ul className={`mm-collapse ${openSubMenu ? "mm-show" : ""
                                    }`}>
                                    <li>
                                      <Link to="/main/Institute"> <ArrowRightIcon />Institute</Link>
                                    </li>
                                    <li>
                                      <Link to="/main/Course"> <ArrowRightIcon />Course</Link>
                                    </li>
                                    <li>
                                      <Link to="/main/Subject"> <ArrowRightIcon />Semester</Link>
                                    </li>
                                    <li>
                                      <Link to="/main/Subject"> <ArrowRightIcon />Subject</Link>
                                    </li>
                                  </ul>
                                </li> */}
                                {menu?.submenus?.map((submenu: any) => {
                                  let menulist =
                                    submenu.menu_name === "Sub Menu"
                                      ? "SubMenu"
                                      : submenu.menu_name === "Role Vs Form"
                                        ? "RoleVsForm"
                                        : submenu.menu_name === "Role Vs User" ||
                                          submenu.menu_name === "RoleVsUser"
                                          ? "RoleVsUser "
                                          : submenu.menu_name === "Hobbies"
                                            ? "Hobby"
                                            :submenu.menu_name === "Student Feedback" ||
                                            submenu.menu_name === "StudentFeedback"
                                            ? "StudentFeedback"
                                            : submenu.menu_name;
                                            if(  submenu.menu_name.toLowerCase() === "institute"){

                                              return (
                                              <li className={`${openSubMenu ? "mm-active" : ""
                                              }`}>
                                              <a className="has-arrow" onClick={() => setOpenSubMenu(!openSubMenu)} >
                                                <ArrowRightIcon />
                                                Institution</a>
                                              <ul className={`mm-collapse ${openSubMenu ? "mm-show" : ""
                                                }`}>
                                                  <li>
                                                  <Link to="/main/University"> <ArrowRightIcon />University</Link>
                                                </li>
                                                <li>
                                                  <Link to="/main/Institute"> <ArrowRightIcon />Institute</Link>
                                                </li>
                                                <li>
                                                  <Link to="/main/Course"> <ArrowRightIcon />Course</Link>
                                                </li>
                                                <li>
                                                  <Link to="/main/Semester"> <ArrowRightIcon />Semester</Link>
                                                </li>
                                                <li>
                                                  <Link to="/main/Subject"> <ArrowRightIcon />Subject</Link>
                                                </li>
                                              </ul>
                                            </li>
                                              )
                                            }
                                            else if (submenu.menu_name !== "Course" && submenu.menu_name !== "Subject") {
                                              // Render only if it's not "Course" or "Subject"
                                              return (
                                                <li key={submenu.id}>
                                                  <Link to={menulist} onClick={() => handleListItemClick1(menulist)}>
                                                    <ArrowRightIcon />
                                                    <div>{submenu.menu_name}</div>
                                                  </Link>
                                                </li>
                                              );
                                            } else {
                                              // Return null for "Course" and "Subject" to skip rendering
                                              return null;
                                            }
                                            
                                })}
                              </ul>
                            </>
                          ) : (
                            <>
                              <li>
                                <Link
                                  to={menu?.form_data?.form_url}
                                  onClick={() =>
                                    handleListItemClick1(
                                      menu?.form_data?.form_url
                                    )
                                  }
                                >
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
                  {/* {user_type === "admin" && (
                    <>
                      
                      <li>
                        <Link
                          //component={Link}
                          to="/main/uploadpdf"
                          // selected={selectedIndex1?.toLowerCase() === "uploadpdf"}
                          // className={
                          //   selectedIndex1?.toLowerCase() === "uploadpdf"
                          //     ? "selecteditem"
                          //     : "unselecteditem"
                          // }
                          // style={{ backgroundColor: selectedIndex1?.toLowerCase() === "uploadpdf" ? '#024f52' : 'transparent', color: selectedIndex1?.toLowerCase() === "uploadpdf" ? "#fff" : "#fff" }}
                          onClick={() => handleListItemClick1("uploadpdf")}
                        >
                          <UploadFileIcon />
                          <div className="menu-title">Upload PDF</div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          // component={Link}
                          to="/main/pdflist"
                          // selected={selectedIndex1?.toLowerCase() === "pdflist"}
                          // className={
                          //   selectedIndex1?.toLowerCase() === "pdflist"
                          //     ? "selecteditem"
                          //     : "unselecteditem"
                          // }
                          // style={{ backgroundColor: selectedIndex1?.toLowerCase() === "uploadpdf" ? '#024f52' : 'transparent', color: selectedIndex1?.toLowerCase() === "uploadpdf" ? "#fff" : "#fff" }}
                          onClick={() => handleListItemClick1("pdflist")}
                        >
                          <PictureAsPdfOutlinedIcon />

                          <div className="menu-title">PDF List</div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          //component={Link}
                          to="/main/feedback"
                          // selected={selectedIndex1?.toLowerCase() === "feedback"}
                          // className={
                          //   selectedIndex1?.toLowerCase() === "feedback"
                          //     ? "selecteditem"
                          //     : "unselecteditem"
                          // }
                          // style={{ backgroundColor: selectedIndex1?.toLowerCase() === "uploadpdf" ? '#024f52' : 'transparent', color: selectedIndex1?.toLowerCase() === "uploadpdf" ? "#fff" : "#fff" }}
                          onClick={() => handleListItemClick1("feedback")}
                        >
                          <FeedbackOutlinedIcon />

                          <div className="menu-title">Feedback</div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          //component={Link}
                          to="/main/student-feedback"
                          // selected={
                          //   selectedIndex1?.toLowerCase() === "student-feedback"
                          // }
                          // className={
                          //   selectedIndex1?.toLowerCase() === "student-feedback"
                          //     ? "selecteditem"
                          //     : "unselecteditem"
                          // }
                          // style={{ backgroundColor: selectedIndex1?.toLowerCase() === "uploadpdf" ? '#024f52' : 'transparent', color: selectedIndex1?.toLowerCase() === "uploadpdf" ? "#fff" : "#fff" }}
                          onClick={() =>
                            handleListItemClick1("student-feedback")
                          }
                        >
                          <ThreePOutlinedIcon />
                          <div className="menu-title">Student Feedback</div>
                        </Link>
                      </li>
                    </>
                  )} */}
                </>
              )}
              {/* </ul> */}
            </MetisMenu>
          </div>
          {user_type === "student" && (
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
        </PerfectScrollbar>
      </aside>
    </>
    // </SidebarContainer>
  );
};

export default Sidebar;
