import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Header/Header.scss";
import notification from "../../assets/img/notification.svg";
import profile from "../../assets/img/profile_img.svg";
import { toast } from "react-toastify";
import { QUERY_KEYS_ADMIN_BASIC_INFO, QUERY_KEYS_STUDENT } from "../../utils/const";
import useApi from "../../hooks/useAPI";
import NameContext from "../../Pages/Context/NameContext";
import images_man from "../../assets/img/images_man.png";
import images_female from "../../assets/img/images_female.png";
import { CircularProgress, Switch } from "@mui/material";
import ThemeModel from "../../assets/css/themes/ThemeModel";
// import { Button } from '@mui/material';
const Header = () => {
  const context = useContext(NameContext);
  const { namepro,logoutpro,setNamepro,proImage,setProImage,ProPercentage }:any = context;
  const [modalOpen, setModalOpen] = useState(false);
  let StudentId = localStorage.getItem("_id");
  const navigator = useNavigate();
  const profileURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
  const adminProfileURL = QUERY_KEYS_ADMIN_BASIC_INFO.ADMIN_GET_PROFILE;
  const user_type = localStorage.getItem("user_type");
  const [profileImage, setprofileImage]=useState<any>()
  const [profileName, setprofileName]=useState<any>()
  const [gender, setGender]=useState<any>()
  const proFalg = localStorage.getItem('proFalg');
  let synth: SpeechSynthesis;
  synth = window.speechSynthesis;
  const {getData} = useApi()
  const handlogout = () => {
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
    logoutpro()

  };

  function handleClick() {
    let main_content = document.getElementById("main-content");
    if (main_content) {
      if (main_content.classList.contains("toggle-sidebar")) {
        main_content.classList.remove("toggle-sidebar");
        // document.body.classList.toggle("newscreen");
      } else {
        main_content.classList.add("toggle-sidebar");
        // document.body.classList.add("newscreen");
      }
    }
    
  }
  function handleSearchClick() {
    let main_content = document.getElementById("search-toggle");
    console.log(main_content);
    if (main_content) {
      if (main_content.classList.contains("search-bar-show")) {
        main_content.classList.remove("search-bar-show");
      } else {
        main_content.classList.add("search-bar-show");
      }
    }
  }
  const callAPI = async () => {
    getData(`${profileURL}/${StudentId}`).then((data:any) => {
        if(data.data)
        {
            let basic_info = data.data.basic_info
            if(basic_info && Object.keys(basic_info).length >0)
            {
                let name = basic_info.first_name +' '+ basic_info.last_name
                setprofileName(name)
                // setGender(basic_info?.gender)
                setNamepro({ 
                  first_name: basic_info?.first_name,
                  last_name: basic_info?.last_name,
                  gender: basic_info?.gender,})

               if(data.data.pic_path !== ""){

                getData(`${"upload_file/get_image/" +data.data.pic_path }`)
                .then((imgdata: any) => {                  
                  // setprofileImage(imgdata.data)
                  setProImage(imgdata.data)
                }).catch((e) => {
                 
                });
              }



            }
            sessionStorage.setItem('profileData',JSON.stringify(data.data))
        }
    }).catch((e:any) => {
        // toast.error(e?.message, {
        //     hideProgressBar: true,
        //     theme: "colored",
        //     });
    });
}
  const getAdminDetails = () => {
    getData(`${adminProfileURL}/${StudentId}`).then(response => {
      if (response?.data) {
        sessionStorage.setItem('profileData',JSON.stringify(response.data))
        const adminInfo = response.data.basic_info
        if (adminInfo && Object.keys(adminInfo).length > 0) {
          const name = `${adminInfo?.first_name}  ${adminInfo?.last_name}`
          setprofileName(name)
          // setGender(adminInfo?.gender)
          setNamepro({ 
            first_name: adminInfo?.first_name,
            last_name: adminInfo?.last_name,
            gender: adminInfo?.gender,})
            if(response.data.pic_path !== ""){

            
          getData(`${"upload_file/get_image/" + response.data.pic_path}`)
            .then(imgdata => {
              // setprofileImage(imgdata.data)
              setProImage(imgdata.data)
            }).catch(e => {
              
            });
          }
        }
      }
    }).catch(e => {
      toast.error(e?.message, {
        hideProgressBar: true,
        theme: "colored",
      });
    });
  }
useEffect(()=>{
  if (user_type === "admin") {
    getAdminDetails()
  } else {
    callAPI() 
  }
},[])

const defaultImage =
namepro?.gender === "male" || namepro?.gender === "Male"
  ? images_man
  : namepro?.gender === "female" || namepro?.gender === "Female"
  ? images_female
  : images_man;

// const profileImage1:any =( proImage !== "" ||  !== 'undefined')  ? proImage : defaultImage;
const profileImage1: any = (proImage !== "" && proImage !== undefined) ? proImage : defaultImage;

const [theme, setTheme] = useState(localStorage.getItem('theme') || 'default');
useEffect(()=>{
  const theme = localStorage.getItem('theme');
  if(theme){
    // localStorage.getItem('--bodybackground');
    // localStorage.getItem('--bghovercolor');
    // localStorage.getItem('--bodycolor'); 

    if(theme === 'default'){
      document?.documentElement?.setAttribute('data-theme', theme);
      // document?.documentElement?.style.setProperty('--bodybackground', '#003032');
      // document?.documentElement?.style.setProperty('--bghovercolor', '#024f52');
      // document?.documentElement?.style.setProperty('--bodycolor', '#fff');
      // document?.documentElement?.style.setProperty('--buttonbgcolor','#003032');
      
    }else if(theme === 'light'){
      // document?.documentElement?.setAttribute('data-theme', theme);
      // document?.documentElement?.style.setProperty('--bodybackground', '#003032');
      // document?.documentElement?.style.setProperty('--bghovercolor', '#024f52');
      // document?.documentElement?.style.setProperty('--bodycolor', '#fff');
      
    }else if(theme === 'dark'){
      // document?.documentElement?.setAttribute('data-theme', theme);
      // document?.documentElement?.style.setProperty('--bodybackground', '#1d2a35');
      // document?.documentElement?.style.setProperty('--bodycolor', ' #1d2a35');
      // document?.documentElement?.style.setProperty('--bghovercolor', '#2a3c49');
      // document?.documentElement?.style.setProperty('--buttonbgcolor','#1d2a35');
    }else{
      document?.documentElement?.setAttribute('data-theme', theme);
      // document?.documentElement?.style.setProperty('--bodybackground', localStorage?.getItem('--bodybackground'));
      // document?.documentElement?.style.setProperty('--bodycolor', localStorage?.getItem('--bodycolor'));
      // document?.documentElement?.style.setProperty('--bghovercolor',  localStorage?.getItem('--bghovercolor'));
      // document?.documentElement?.style.setProperty('--TitleColor',  localStorage?.getItem('--TitleColor'));
      // document?.documentElement?.style.setProperty('--iconcolor',  localStorage?.getItem('--iconcolor'));
    }
  }

},[])

useEffect(() => {
  if(theme === 'default'){
    document?.documentElement?.setAttribute('data-theme', theme);
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
  }else if(theme === 'light'){
    document?.documentElement?.setAttribute('data-theme', theme);
    // document?.documentElement?.style.setProperty('--bodybackground', '#003032');
    // document?.documentElement?.style.setProperty('--bghovercolor', '#024f52');
    // document?.documentElement?.style.setProperty('--bodycolor', '#fff');
    // document?.documentElement?.style.setProperty('--TitleColor', '#495057');
    // localStorage?.setItem('--bodybackground', '#003032');
    // localStorage?.setItem('--bghovercolor', '#024f52');
    // localStorage?.setItem('--bodycolor', '#fff');
    // localStorage?.setItem('--TitleColor', '#495057');
  }else if(theme === 'dark'){
    document?.documentElement?.setAttribute('data-theme', theme);
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
  }

  // document.documentElement.setAttribute('data-theme', theme);
}, [theme]);

// const toggleTheme = () => {
//   setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
// };
const toggleTheme = () => {
  setTheme((prevTheme) => {
    const newTheme = prevTheme === 'light' ? 'dark' : 'light';
    // Update localStorage with the new theme
    localStorage.setItem('theme', newTheme);
    return newTheme;
  });
};
const handleClickthemes = () => {
  setModalOpen(true);
};
const handleCloseModal = () => {
  setModalOpen(false);
};

  return (
    <>
      <header className="header">
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
            {/* <div className="search-bar" id="search-toggle">

                            <form
                                className="search-form d-flex align-items-center"
                                method="POST"
                                action="#"
                            >
                                <input
                                    type="text"
                                    name="query"
                                    placeholder="Search"
                                    title="Enter search keyword"
                                />
                                <button type="submit" title="Search">
                                    <i className="bi bi-search"></i>
                                </button>
                            </form>
                        </div> */}

            {/* <div className="header_search_bar common_content">

                <div className="input-group input_group">
                  <button className="btn search-btn search_btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 21 21"
                      fill="none"
                    >
                      <circle
                        cx="9.98856"
                        cy="9.98856"
                        r="8.98856"
                        stroke="#495057"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.2402 16.7071L19.7643 20.222"
                        stroke="#495057"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <input
                    type="search"
                    className="form-control form_control"
                    placeholder="Search..."
                    aria-label="Search"
                  />
                </div>
              </div> */}
          </div>
          <div className="right_part">
            <div className="d-block d-lg-none" onClick={handleSearchClick}>
              <a className="nav-link nav-icon search-bar-toggle" href="#">
                <i className="bi bi-search text-white"></i>
              </a>
            </div>
            {/* <div className="notification common_content">

                          <div className= "notification_inner" id="dropdownMenuButton1" data-bs-toggle="dropdown"
                              aria-expanded="false">
                               <img src={notification} alt='notification'/> 
                          </div>
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <p>notification</p>
                          </ul>
                      </div> */}


            
            {/* <Switch
              checked={theme === 'dark'}
              onChange={toggleTheme}
              color="default"
            /> */}

            <div className="user common_content">
              <div
                className="user_inner"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="profile_img_wrapper">

                  <CircularProgress variant="determinate" thickness={0}  value={0} />
                  {/* <CircularProgress variant="determinate" thickness={8} size={40} color="success" value={ProPercentage} /> */}

                  <img className="profile_img" src={profileImage1} alt="profile" />
                </div>
                {/* <div className="profile_img">
                  <img 
                  src={proImage !== "" ? proImage : (namepro?.gender === "male" || namepro?.gender === "Male")? images_man: (namepro?.gender === "female" || namepro?.gender === "Female") ? images_female :images_man} 
                  alt="profile" height="36px" width="40px" />
                </div> */}
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
              {/* <li><a  href="#" className="dropdown-item"><span className="item_text">Profile</span></a></li> */}
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
      </header>
    </>
  );
};

export default Header;

