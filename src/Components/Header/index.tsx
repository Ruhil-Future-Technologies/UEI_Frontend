import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "../Header/Header.scss";
import notification from "../../assets/img/notification.svg";
import profile from "../../assets/img/profile_img.svg";
import { toast } from "react-toastify";
import {
  QUERY_KEYS_ADMIN_BASIC_INFO,
  QUERY_KEYS_STUDENT,
} from "../../utils/const";
import useApi from "../../hooks/useAPI";
import NameContext from "../../Pages/Context/NameContext";
import images_man from "../../assets/img/avatars/male.png";
import images_female from "../../assets/img/avatars/female.png";
import maleImage from "../../assets/img/avatars/male.png";
import femaleImage from "../../assets/img/avatars/female.png";
import Country1 from "../../assets/img/country/01.png";
import Country2 from "../../assets/img/country/02.png";
import Country3 from "../../assets/img/country/03.png";
import Country4 from "../../assets/img/country/04.png";
import Country5 from "../../assets/img/country/05.png";
import Country6 from "../../assets/img/country/06.png";
import Country7 from "../../assets/img/country/07.png";
import Country8 from "../../assets/img/country/08.png";
import App13 from "../../assets/img/apps/13.png";
import App14 from "../../assets/img/apps/14.png";
import Avatar6 from "../../assets/img/avatars/06.png";
import MenuIcon from "@mui/icons-material/Menu";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import LocalBarOutlinedIcon from "@mui/icons-material/LocalBarOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import LaptopOutlinedIcon from "@mui/icons-material/LaptopOutlined";
import PerfectScrollbar from "react-perfect-scrollbar";
import { CircularProgress, Switch } from "@mui/material";
// import ThemeModel from "../../assets/css/themes/ThemeModel";
// import "../../assets/css/newstyle.min.css";
// import "../../assets/css/main.min.css";
import "react-perfect-scrollbar/dist/css/styles.css";
// import { Button } from '@mui/material';

const Header = () => {
  const context = useContext(NameContext);
  const {
    namepro,
    logoutpro,
    setNamepro,
    proImage,
    setProImage,
    ProPercentage,
    setProPercentage,
  }: any = context;
  const [modalOpen, setModalOpen] = useState(false);
  let StudentId = localStorage.getItem("_id");
  const navigator = useNavigate();
  const profileURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
  const adminProfileURL = QUERY_KEYS_ADMIN_BASIC_INFO.ADMIN_GET_PROFILE;
  const user_type = localStorage.getItem("user_type");
  const [profileImage, setprofileImage] = useState<any>();
  const [profileName, setprofileName] = useState<any>();
  const [language, setLanguage] = useState<any>("EN");
  const [gender, setGender] = useState<any>("");
  const proFalg = localStorage.getItem("proFalg");
  let synth: SpeechSynthesis;
  synth = window.speechSynthesis;
  const { getData } = useApi();
  const handlogout = () => {
    setProPercentage(0);
    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("userid");
    localStorage.removeItem("pd");
    localStorage.removeItem("userdata");
    localStorage.removeItem("signupdata");
    localStorage.removeItem("_id");
    localStorage.removeItem("menulist");
    localStorage.removeItem("menulist1");
    localStorage.removeItem("proFalg");
    localStorage.removeItem("loglevel");
    sessionStorage.removeItem("profileData");
    localStorage.removeItem("chatsaved");
    localStorage.removeItem("Profile_completion");
    localStorage.removeItem("Profile completion");
    // localStorage.removeItem("currentQuestionIndex");
    // localStorage.removeItem("messages");
    // localStorage.removeItem("answers");
    // localStorage.removeItem("selectedproficiency");
    // localStorage.removeItem("selectedLanguage");
    // localStorage.removeItem("setSelectedHobby");
    // localStorage.removeItem("selectSubject");
    // localStorage.removeItem("selectCourse");
    // localStorage.removeItem("selectedInstitute");
    localStorage.removeItem("tokenExpiry");
    synth.cancel();
    navigator("/");
    logoutpro();
  };

  function handleClick() {
    let main_content = document.querySelector("body");

    if (main_content) {
      if (main_content.classList.contains("toggled")) {
        main_content.classList.remove("toggled");
        // document.body.classList.toggle("newscreen");
      } else {
        main_content.classList.add("toggled");
        // document.body.classList.add("newscreen");
      }
    }
  }

  function handleSearchClick() {
    let main_content = document.getElementById("search-toggle");
    if (main_content) {
      if (main_content.classList.contains("search-bar-show")) {
        main_content.classList.remove("search-bar-show");
      } else {
        main_content.classList.add("search-bar-show");
      }
    }
  }
  const callAPI = async () => {
    getData(`${profileURL}/${StudentId}`)
      .then((data: any) => {
        if (data.data) {
          let basic_info = data.data.basic_info;
          if (basic_info && Object.keys(basic_info).length > 0) {
            // let name = basic_info.first_name + " " + basic_info.last_name;
            let name = basic_info.first_name;
            setprofileName(name);
            setGender(basic_info?.gender);
            setNamepro({
              first_name: basic_info?.first_name,
              last_name: basic_info?.last_name,
              gender: basic_info?.gender,
            });

            if (data?.data?.basic_info?.pic_path !== "") {
              getData(
                `${"upload_file/get_image/" + data?.data?.basic_info?.pic_path}`
              )
                .then((imgdata: any) => {
                  setprofileImage(imgdata.data);
                  setProImage(imgdata.data);
                })
                .catch((e) => {});
            }
          }
          sessionStorage.setItem("profileData", JSON.stringify(data.data));
        }
      })
      .catch((e: any) => {
        // toast.error(e?.message, {
        //     hideProgressBar: true,
        //     theme: "colored",
        //     });
      });
  };
  const getAdminDetails = () => {
    getData(`${adminProfileURL}/${StudentId}`)
      .then((response) => {
        if (response?.data) {
          sessionStorage.setItem("profileData", JSON.stringify(response.data));
          const adminInfo = response.data.basic_info;
          if (adminInfo && Object.keys(adminInfo).length > 0) {
            const name = `${adminInfo?.first_name}  ${adminInfo?.last_name}`;
            setprofileName(name);
            setGender(adminInfo?.gender);
            setNamepro({
              first_name: adminInfo?.first_name,
              last_name: adminInfo?.last_name,
              gender: adminInfo?.gender,
            });
            if (response?.data?.basic_info?.pic_path !== "") {
              getData(
                `${
                  "upload_file/get_image/" +
                  response?.data?.basic_info?.pic_path
                }`
              )
                .then((imgdata) => {
                  setprofileImage(imgdata.data);
                  setProImage(imgdata.data);
                })
                .catch((e) => {});
            }
          }
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  };
  useEffect(() => {
    if (user_type === "admin") {
      getAdminDetails();
    } else {
      callAPI();
    }
  }, []);

  const defaultImage =
    namepro?.gender === "male" || namepro?.gender === "Male"
      ? images_man
      : namepro?.gender === "female" || namepro?.gender === "Female"
      ? images_female
      : images_man;

  // const profileImage1:any =( proImage !== "" ||  !== 'undefined')  ? proImage : defaultImage;
  const profileImage1: any =
    proImage !== "" && proImage !== undefined ? proImage : defaultImage;

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    function toggleOnDesktop() {
      if (window.innerWidth >= 1200) {
        document.querySelector("body")?.classList.add("toggled");
      } else {
        document.querySelector("body")?.classList.remove("toggled");
      }
    }

    // Run the function on load and on resize
    toggleOnDesktop();
    window.addEventListener("resize", toggleOnDesktop);

    const theme = localStorage.getItem("theme");
    if (theme) {
      // localStorage.getItem('--bodybackground');
      // localStorage.getItem('--bghovercolor');
      // localStorage.getItem('--bodycolor');

      if (theme === "default") {
        document?.documentElement?.setAttribute("data-theme", theme);
        // document?.documentElement?.style.setProperty('--bodybackground', '#003032');
        // document?.documentElement?.style.setProperty('--bghovercolor', '#024f52');
        // document?.documentElement?.style.setProperty('--bodycolor', '#fff');
        // document?.documentElement?.style.setProperty('--buttonbgcolor','#003032');
      } else if (theme === "light") {
        // document?.documentElement?.setAttribute('data-theme', theme);
        // document?.documentElement?.style.setProperty('--bodybackground', '#003032');
        // document?.documentElement?.style.setProperty('--bghovercolor', '#024f52');
        // document?.documentElement?.style.setProperty('--bodycolor', '#fff');
      } else if (theme === "dark") {
        // document?.documentElement?.setAttribute('data-theme', theme);
        // document?.documentElement?.style.setProperty('--bodybackground', '#1d2a35');
        // document?.documentElement?.style.setProperty('--bodycolor', ' #1d2a35');
        // document?.documentElement?.style.setProperty('--bghovercolor', '#2a3c49');
        // document?.documentElement?.style.setProperty('--buttonbgcolor','#1d2a35');
      } else {
        document?.documentElement?.setAttribute("data-bs-theme", theme);
        // document?.documentElement?.style.setProperty('--bodybackground', localStorage?.getItem('--bodybackground'));
        // document?.documentElement?.style.setProperty('--bodycolor', localStorage?.getItem('--bodycolor'));
        // document?.documentElement?.style.setProperty('--bghovercolor',  localStorage?.getItem('--bghovercolor'));
        // document?.documentElement?.style.setProperty('--TitleColor',  localStorage?.getItem('--TitleColor'));
        // document?.documentElement?.style.setProperty('--iconcolor',  localStorage?.getItem('--iconcolor'));
      }
    }
  }, []);

  useEffect(() => {
    if (theme === "default") {
      document?.documentElement?.setAttribute("data-theme", theme);
      // document?.documentElement?.style.setProperty('--bodybackground', '#003032');
      // document?.documentElement?.style.setProperty('--bghovercolor', '#024f52');
      // document?.documentElement?.style.setProperty('--bodycolor', '#fff');
      // document?.documentElement?.style.setProperty('--TitleColor', '#495057');
      // document?.documentElement?.style.setProperty('--buttonbgcolor','#003032');
      // localStorage?.setItem('--bodybackground', '#003032');
      // localStorage?.setItem('--bghovercolor', '#024f52');
      // localStorage?.setItem('--bodycolor', '#fff');
      // localStorage?.setItem('--TitleColor', '#495057');
      // localStorage?.setItem('--buttonbgcolor', '#003032');
    } else if (theme === "light") {
      document?.documentElement?.setAttribute("data-bs-theme", theme);
      // document?.documentElement?.style.setProperty('--bodybackground', '#003032');
      // document?.documentElement?.style.setProperty('--bghovercolor', '#024f52');
      // document?.documentElement?.style.setProperty('--bodycolor', '#fff');
      // document?.documentElement?.style.setProperty('--TitleColor', '#495057');
      // localStorage?.setItem('--bodybackground', '#003032');
      // localStorage?.setItem('--bghovercolor', '#024f52');
      // localStorage?.setItem('--bodycolor', '#fff');
      // localStorage?.setItem('--TitleColor', '#495057');
    } else if (theme === "dark") {
      document?.documentElement?.setAttribute("data-bs-theme", theme);
      // document?.documentElement?.style.setProperty('--bodybackground', '#1d2a35');
      // document?.documentElement?.style.setProperty('--bodycolor', ' #1d2a35');
      // document?.documentElement?.style.setProperty('--bghovercolor', '#2a3c49');
      // document?.documentElement?.style.setProperty('--TitleColor', '#495057');
      // document?.documentElement?.style.setProperty('--buttonbgcolor','#1d2a35');

      // localStorage?.setItem('--bodybackground', '#1d2a35');
      // localStorage?.setItem('--bghovercolor', '#1d2a35');
      // localStorage?.setItem('--bodycolor', '#2a3c49');
      // localStorage?.setItem('--TitleColor', '#495057');
      // localStorage?.setItem('--buttonbgcolor', '#1d2a35');
    } else if (theme === "blue-theme")
      document?.documentElement?.setAttribute("data-bs-theme", theme);
    else if (theme === "semi-dark")
      document?.documentElement?.setAttribute("data-bs-theme", theme);
    else if (theme === "bordered-theme")
      document?.documentElement?.setAttribute("data-bs-theme", theme);
    // document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // const toggleTheme = () => {
  //   setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  // };
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      // Update localStorage with the new theme
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };
  const handleClickthemes = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const displaySearchPopup = () => {
    document.getElementsByClassName("search-popup")[0].classList.add("d-block");
    document.getElementsByClassName("search-close")[0].classList.add("d-block");
  };

  const hideSearchPopup = () => {
    document
      .getElementsByClassName("search-popup")[0]
      .classList.remove("d-block");
    document
      .getElementsByClassName("search-close")[0]
      .classList.remove("d-block");
  };

  return (
    <>
      {/* <header className="header">
        <div className="header_inner">
          <div className="left_part">
            
            <button
              className="btn btn-light btn_close "
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample"
              onClick={handleClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 448 512"
              >
                <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
              </svg>
            </button>
            <div className="brand">
              <span className="brand-text">Gyan Setu</span>
            </div>
          </div>
          <div className="right_part">
            <div className="d-block d-lg-none" onClick={handleSearchClick}>
              <a className="nav-link nav-icon search-bar-toggle" href="#">
                <i className="bi bi-search text-white"></i>
              </a>
            </div>
           

            <div className="user common_content">
              <div
                className="user_inner"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="profile_img_wrapper">

                  <CircularProgress variant="determinate" thickness={0}  value={0} />

                  <img className="profile_img" src={profileImage1} alt="profile" />
                </div>
           
                <div className="dropdown-toggle user_wrapper">
                  <div className="user_name d-none d-lg-block">{namepro?.last_name  ? `${namepro?.first_name}`+" "+ `${namepro?.last_name}` : (user_type==='student' ?  'Student' : 'Admin')}</div>
                </div>
              </div>
              <ul
                className="profile dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <Link
                    to={
                      user_type === "admin"
                        ? "/main/adminprofile"
                        : "/main/StudentProfile"
                    }
                    className="dropdown-item"
                  >
                    <span className="item_text">Profile</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={
                      "/main/changepassword"
                    }
                    className="dropdown-item"
                  >
                    <span className="item_text">Change Password</span>
                  </Link>
                </li>
                <li>
                <button
                    className="dropdown-item"
                    onClick={() => handleClickthemes()}
                  >
                    <span className="item_text">Custom theme</span>
                    </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handlogout()}
                  >
                    <span className="item_text">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
            <ul
              className="profile dropdown-menu"
              aria-labelledby="dropdownMenuButton1"
            >
              <li>
                <Link to={"/profile"} className="dropdown-item">
                  <span className="item_text">Profile</span>
                </Link>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => handlogout()}>
                  <span className="item_text">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <ThemeModel
                open={modalOpen}
                handleClose={handleCloseModal}
              />
      </header> */}
      <header className="top-header">
        <nav className="navbar navbar-expand justify-content-between align-items-center gap-lg-4">
          <div
            className="btn-toggle"
            style={{
              cursor: "pointer",
            }}
          >
            {/* <a href="#"> */}
            <MenuIcon onClick={handleClick} />
            {/* </a> */}
          </div>
          {/* <div className="search-bar flex-grow-1">
            <div className="position-relative">
              <input
                className="form-control rounded-5 px-5 search-control d-lg-block d-none"
                type="text"
                placeholder="Search"
                onFocus={displaySearchPopup}
              />
              <span className="position-absolute d-lg-block d-none ms-3 translate-middle-y start-0 top-50">
                <SearchOutlinedIcon />
              </span>
              <span className="position-absolute me-3 translate-middle-y end-0 top-50 search-close">
                <CloseOutlinedIcon onClick={hideSearchPopup} />
              </span>
              <div className="search-popup p-3">
                <div className="card rounded-4 overflow-hidden">
                  <div className="card-header d-lg-none">
                    <div className="position-relative">
                      <input
                        className="form-control rounded-5 px-5 mobile-search-control"
                        type="text"
                        placeholder="Search"
                      />
                      <span className="position-absolute ms-3 translate-middle-y start-0 top-50">
                        <SearchOutlinedIcon />
                      </span>
                      <span className="position-absolute me-3 translate-middle-y end-0 top-50 mobile-search-close">
                        <CloseOutlinedIcon onClick={hideSearchPopup} />
                      </span>
                    </div>
                  </div>
                  <PerfectScrollbar>
                    <div className="card-body search-content">
                      <p className="search-title">Recent Searches</p>
                      <div className="d-flex align-items-start flex-wrap gap-2 kewords-wrapper">
                        <a href="#" className="kewords">
                          <span>Class 10th Science</span>
                          <SearchOutlinedIcon sx={{ fontSize: "1rem" }} />
                        </a>
                        <a href="#" className="kewords">
                          <span>Economics</span>
                          <SearchOutlinedIcon sx={{ fontSize: "1rem" }} />
                        </a>
                        <a href="#" className="kewords">
                          <span>History of India</span>
                          <SearchOutlinedIcon sx={{ fontSize: "1rem" }} />
                        </a>
                        <a href="#" className="kewords">
                          <span>First className math</span>
                          <SearchOutlinedIcon sx={{ fontSize: "1rem" }} />
                        </a>
                        <a href="#" className="kewords">
                          <span>physcology</span>
                          <SearchOutlinedIcon sx={{ fontSize: "1rem" }} />
                        </a>
                        <a href="#" className="kewords">
                          <span>Physics</span>
                          <SearchOutlinedIcon sx={{ fontSize: "1rem" }} />
                        </a>
                        <a href="#" className="kewords">
                          <span>Class 10th Assignments</span>
                          <SearchOutlinedIcon sx={{ fontSize: "1rem" }} />
                        </a>
                      </div>
                      <hr />
                      <p className="search-title">Tutorials</p>
                      <div className="search-list d-flex flex-column gap-2">
                        <div className="search-list-item d-flex align-items-center gap-3">
                          <div className="list-icon">
                            <PlayCircleOutlineOutlinedIcon
                              sx={{ fontSize: "1.25rem" }}
                            />
                          </div>
                          <div className="">
                            <h5 className="mb-0 search-list-title ">
                              Wordpress Tutorials
                            </h5>
                          </div>
                        </div>
                        <div className="search-list-item d-flex align-items-center gap-3">
                          <div className="list-icon">
                            <ShoppingBasketOutlinedIcon
                              sx={{ fontSize: "1.25rem" }}
                            />
                          </div>
                          <div className="">
                            <h5 className="mb-0 search-list-title">
                              eCommerce Website Tutorials
                            </h5>
                          </div>
                        </div>

                        <div className="search-list-item d-flex align-items-center gap-3">
                          <div className="list-icon">
                            <LaptopOutlinedIcon sx={{ fontSize: "1.25rem" }} />
                          </div>
                          <div className="">
                            <h5 className="mb-0 search-list-title">
                              Responsive Design
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PerfectScrollbar>
                </div>
              </div>
            </div>
          </div> */}
          <ul className="navbar-nav gap-1 nav-right-links align-items-center">
            {/* <li className="nav-item d-lg-none mobile-search-btn">
              <a className="nav-link" href="#">
                <SearchOutlinedIcon onClick={displaySearchPopup} />
              </a>
            </li> */}
            {/* <li className="nav-item d-none d-lg-flex">
              <button onClick={() => navigator("/main/Chat/recentChat")} className="btn btn-primary rounded-pill px-lg-4">
                New Chat
              </button>
            </li> */}
            <li className="nav-item">
              <div className="toggle-mode nav-link" role="button">
                <DarkModeOutlinedIcon onClick={toggleTheme} />
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle dropdown-toggle-nocaret"
                href=""
                data-bs-toggle="dropdown"
              >
                {/* <img src={Country2} width="22" height="22" alt="" /> */}
                <span>{language}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li onClick={() => setLanguage("EN")}>
                  <div className="dropdown-item d-flex align-items-center py-2">
                    {/* <img src={Country1} width="20" height="20" alt="" /> */}
                    <span className="ms-2">English</span>
                  </div>
                </li>
                {/* <li>
                  <a
                    className="dropdown-item d-flex align-items-center py-2"
                    href="#"
                  >
                    <img src={Country2} width="20" height="20" alt="" />
                    <span className="ms-2">Catalan</span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center py-2"
                    href="#"
                  >
                    <img src={Country3} width="20" height="20" alt="" />
                    <span className="ms-2">French</span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center py-2"
                    href="#"
                  >
                    <img src={Country4} width="20" height="20" alt="" />
                    <span className="ms-2">Belize</span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center py-2"
                    href="#"
                  >
                    <img src={Country5} width="20" height="20" alt="" />
                    <span className="ms-2">Colombia</span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center py-2"
                    href="#"
                  >
                    <img src={Country6} width="20" height="20" alt="" />
                    <span className="ms-2">Spanish</span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center py-2"
                    href="#"
                  >
                    <img src={Country7} width="20" height="20" alt="" />
                    <span className="ms-2">Georgian</span>
                  </a>
                </li> */}
                {/* <li onClick={() => setLanguage("HN")}>
                  <div className="dropdown-item d-flex align-items-center py-2">
                    <img src={Country8} width="20" height="20" alt="" />
                    <span className="ms-2">Hindi</span>
                  </div>
                </li> */}
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative"
                data-bs-auto-close="outside"
                data-bs-toggle="dropdown"
                href="#"
              >
                <NotificationsOutlinedIcon />
                <span className="badge-notify">5</span>
              </a>
              <div className="dropdown-menu dropdown-notify dropdown-menu-end shadow">
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
                        <div
                          className="dropdown-item d-flex align-items-center gap-2 py-2"
                        >
                          <Inventory2OutlinedIcon
                            style={{ fontSize: "1rem" }}
                          />
                          Archive All
                        </div>
                      </div>
                      <div>
                        <div
                          className="dropdown-item d-flex align-items-center gap-2 py-2"
                        >
                          <DoneAllOutlinedIcon style={{ fontSize: "1rem" }} />
                          Mark all as read
                        </div>
                      </div>
                      <div>
                        <div
                          className="dropdown-item d-flex align-items-center gap-2 py-2"
                        >
                          <MicOffOutlinedIcon style={{ fontSize: "1rem" }} />
                          Disable Notifications
                        </div>
                      </div>
                      <div>
                        <div
                          className="dropdown-item d-flex align-items-center gap-2 py-2"
                        >
                          <GradeOutlinedIcon style={{ fontSize: "1rem" }} />
                          What's new ?
                        </div>
                      </div>
                      <div>
                        <hr className="dropdown-divider" />
                      </div>
                      <div>
                        <div
                          className="dropdown-item d-flex align-items-center gap-2 py-2"
                        >
                          <LeaderboardOutlinedIcon
                            style={{ fontSize: "1rem" }}
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
                      : gender?.toLowerCase() === "female"
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
                          : gender?.toLowerCase() === "female"
                          ? femaleImage
                          : maleImage
                      }
                      className="rounded-circle p-1 shadow mb-3"
                      width="90"
                      height="90"
                      alt=""
                    />
                    <h5 className="user-name mb-0 fw-bold">{`Hello, ${
                      namepro?.first_name || "User"
                    }`}</h5>
                  </div>
                </div>
                <hr className="dropdown-divider" />
                <Link
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  to={
                    user_type === "admin"
                      ? "/main/adminprofile"
                      : "/main/StudentProfile"
                  }
                >
                  <PersonOutlineOutlinedIcon />
                  Profile
                </Link>
                {/* <a
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  //href="#"
                >
                  <LocalBarOutlinedIcon />
                  Setting
                </a> */}
                <Link
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  to="/main/DashBoard"
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
