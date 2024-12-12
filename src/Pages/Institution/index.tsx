import React from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
import "../Institution/institution.css"
import profile from "../../assets/img/profile.png";
import studentimg from "../../assets/img/ins-1.png";
import courseImg from "../../assets/img/courses-1.png";
import toperstudent from "../../assets/img/topper-image.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Header from "../../Components/Header";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import logowhite from "../../assets/img/logo-white.svg";
import InstituteGraphRepo from "./institutionGraphRepo";
import IntitutionChat from "./institutionchat";
import Footer from "../../Components/Footer";
const InstitutionDash = () => {
    const slides = [
        { subject: "English", totalStudents: 30, image: courseImg },
        { subject: "Math", totalStudents: 25, image: courseImg },
        { subject: "Science", totalStudents: 35, image: courseImg },
        { subject: "History", totalStudents: 20, image: courseImg },
        { subject: "Geography", totalStudents: 40, image: courseImg },
    ];

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
    return (
        <>
            <Header />
            <aside className="sidebar-wrapper" 
             onMouseEnter={handleMouseEnter}
             onMouseLeave={handleMouseLeave}
            data-simplebar="true">
                <div className="sidebar-header">
                    <div className="logo-icon">
                        <img src={logowhite} className="logo-img" alt="" />
                    </div>
                    <div className="logo-name flex-grow-1">
                        <h5 className="mb-0">Gyansetu</h5>
                    </div>
                    <div className="sidebar-close">
                        <span className="material-icons-outlined"><CloseOutlinedIcon onClick={removeMobileToggle}/></span>
                    </div>
                </div>
                <div className="sidebar-nav">
                    <ul className="metismenu" id="sidenav">
                        <li>
                            <Link to="/institution-deshboard" onClick={removeMobileToggle}>
                                <div className="parent-icon"><HomeOutlinedIcon /></div>
                                <div className="menu-title">Dashboard</div>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/institution-deshboard/chat"}>
                                <div className="parent-icon"> <ChatOutlinedIcon /></div>
                                <div className="menu-title">Chat with AI</div>
                            </Link>
                        </li>
                        <li>
                            <Link to="study.html">
                                <div className="parent-icon">  <LocalLibraryOutlinedIcon /></div>
                                <div className="menu-title">Study Materials</div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/institution-deshboard/feedback">
                                <div className="parent-icon"><InfoOutlinedIcon /></div>
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

            <div className="main-wrapper">

                <div className="main-content">

                    <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                        <div className="breadcrumb-title pe-3">Dashboard</div>
                        <div className="ps-3">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0 p-0">
                                    <li className="breadcrumb-item"><Link to="javascript:;"><i className="bx bx-home-alt"></i></Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">Report</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="ms-auto">
                            <div className="btn-group">
                                <button type="button" className="btn btn-outline-primary rounded-pill px-lg-4"
                                    data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop">Settings</button>

                            </div>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-xxl-3 col-xl-6 d-flex align-items-stretch">
                            <div className="card w-100 overflow-hidden rounded-4">
                                <div className="card-header bg-primary-20">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="d-flex align-items-center gap-3">
                                                <img src={profile} className="rounded-circle bg-grd-info p-1"
                                                    width="94" height="94" alt="user" />
                                                <div className="w-100">
                                                    <h4 className="fw-semibold mb-0 fs-18 mb-0">RK Institute</h4>
                                                    <small className="mb-3 d-block">A-11 Janakpuri East, Delhi</small>


                                                    <div className="">

                                                        <div className="progress mb-0" style={{ height: "5px;" }}>
                                                            <div
                                                                className="progress-bar bg-grd-success"
                                                                role="progressbar"
                                                                style={{ width: "60%" }}
                                                                aria-valuenow={25}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            >
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                                <div className="card-body position-relative p-4">
                                    <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                                        <div>
                                            <h6 className="mb-0 fw-normal">Status</h6>
                                        </div>

                                        <div className="form-check form-switch mb-0 ">
                                            <input className="form-check-input fs-5 m-0" type="checkbox" id="status" checked />
                                        </div>

                                    </div>

                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 fw-normal">Chat History</h6>
                                        </div>
                                        <div>
                                            <Link to="">0</Link>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 fw-normal">Saved Chat</h6>
                                        </div>
                                        <div>
                                            <Link to="">0</Link>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 fw-normal">Profile Completed</h6>
                                        </div>
                                        <div>
                                            <Link to="profile.html">90%</Link>
                                        </div>
                                    </div>




                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-3 col-xl-6 d-flex align-items-stretch">
                            <div className="card w-100 rounded-4">
                                <div className="card-body">
                                    <div className="d-flex align-items-start justify-content-between mb-3">

                                        <h5 className="mb-0 fw-semibold fs-6">Total Teachers</h5>
                                        <div className="d-flex align-items-center gap-1 text-dark fw-semibold">
                                            70 <span className="text-primary d-inline-flex align-items-center gap-1">(2.5%)<i className="material-icons-outlined fs-6">north</i></span>
                                        </div>

                                    </div>
                                    <div className="table-responsive">

                                        <table className="table fs-14 align-middle mntable">
                                            <tr>
                                                <th >Image</th><th>Name</th><th>Subject</th>
                                            </tr>
                                            <tr>
                                                <td><img src={studentimg} alt="" /></td>
                                                <td>Ajay Chauhan</td>
                                                <td>Science</td>
                                            </tr>
                                            <tr>
                                                <td><img src={studentimg} alt="" /></td>
                                                <td>Ajay Chauhan</td>
                                                <td>Science</td>
                                            </tr>
                                            <tr>
                                                <td><img src={studentimg} alt="" /></td>
                                                <td>Ajay Chauhan</td>
                                                <td>Science</td>
                                            </tr>
                                            <tr>
                                                <td><img src={studentimg} alt="" /></td>
                                                <td>Ajay Chauhan</td>
                                                <td>Science</td>
                                            </tr>
                                        </table>

                                    </div>
                                    <Link to="" className="text-center d-block">See All</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-3 col-xl-6 d-flex align-items-stretch">
                            <div className="card w-100 rounded-4">
                                <div className="card-body">
                                    <div className="d-flex align-items-start justify-content-between mb-3">

                                        <h5 className="mb-0 fw-semibold fs-6">Total Students</h5>
                                        <div className="d-flex align-items-center gap-1 text-dark fw-semibold">
                                            300 <span className="text-primary d-inline-flex align-items-center gap-1">(2.5%)<i className="material-icons-outlined fs-6">north</i></span>
                                        </div>

                                    </div>
                                    <div className="table-responsive">

                                        <table className="table fs-14 align-middle mntable">
                                            <tr>
                                                <th >Image</th><th>Name</th><th>className</th>
                                            </tr>
                                            <tr>
                                                <td><img src={studentimg} alt="" /></td>
                                                <td>Ajay Chauhan</td>
                                                <td>2nd</td>
                                            </tr>
                                            <tr>
                                                <td><img src={studentimg} alt="" /></td>
                                                <td>Rahul Jain</td>
                                                <td>5th</td>
                                            </tr>
                                            <tr>
                                                <td><img src={studentimg} alt="" /></td>
                                                <td>Disha</td>
                                                <td>9th</td>
                                            </tr>
                                            <tr>
                                                <td><img src={studentimg} alt="" /></td>
                                                <td>Neha Gupta</td>
                                                <td>3rd</td>
                                            </tr>
                                        </table>

                                    </div>
                                    <Link to="/main/Student" className="text-center d-block">See All</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-3 col-xl-6 d-flex align-items-stretch">
                            <div className="card w-100 rounded-4">
                                <div className="card-body">
                                    <div className="d-flex align-items-start justify-content-between mb-3">

                                        <h5 className="mb-0 fw-semibold fs-6">Total Courses</h5>
                                        <div className="d-flex align-items-center gap-1 text-dark fw-semibold">
                                            80                                </div>

                                    </div>
                                    <div className="table-responsive">

                                        <table className="table fs-14 align-middle mntable">
                                            <tr>
                                                <th >Course Name</th><th>Duration (Yr)</th><th>Enrollment Status</th>
                                            </tr>

                                            <tr>
                                                <td>B.S.C Science</td>
                                                <td>4</td>
                                                <td><Link to="">Enroll Student</Link></td>
                                            </tr>

                                            <tr>
                                                <td>B.COM</td>
                                                <td>4</td>
                                                <td>25-Dec-2024</td>
                                            </tr>

                                            <tr>
                                                <td>BA English</td>
                                                <td>4</td>
                                                <td>29-Dec-2024</td>
                                            </tr>

                                            <tr>
                                                <td>BCA Computer</td>
                                                <td>4</td>
                                                <td><Link to="">Enroll Student</Link></td>
                                            </tr>
                                        </table>

                                    </div>
                                    <Link to="" className="text-center d-block">See All</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="d-flex mb-3 justify-content-between align-items-center">
                                <h5 className="mb-0">Subject Wise Students</h5>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="swiper-prev d-flex"><i className="material-icons-outlined">west</i></div>
                                    <div className="swiper-next d-flex"><i className="material-icons-outlined">east</i></div>
                                    <Link to="" className="d-block text-dark btn btn-light rounded-3 btn-sm">See All</Link>
                                </div>
                            </div>
                            <div className="swiper studentslider">
                                <Swiper
                                    spaceBetween={10}
                                    slidesPerView={3}
                                    loop={true}
                                    breakpoints={{
                                        768: { slidesPerView: 2 },
                                        1024: { slidesPerView: 3 },
                                    }}
                                >
                                    {slides.map((slide, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="card crcard">
                                                <div className="card-body">
                                                    <div className="row g-3">
                                                        <div className="col-lg-5">
                                                            <img src={slide.image} alt={slide.subject} className="img-fluid" />
                                                        </div>
                                                        <div className="col-lg-7">
                                                            <ul>
                                                                <li>
                                                                    <small>Subject</small>
                                                                    <h6>{slide.subject}</h6>
                                                                </li>
                                                                <li>
                                                                    <small>Total Students</small>
                                                                    <h6>{slide.totalStudents}</h6>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                        
                        <InstituteGraphRepo/>
                       
                        <IntitutionChat/>
                        <div className="col-xxl-4 d-flex align-items-stretch topstudent">
                            <div className="card w-100">
                                <div className="card-body">
                                    <h6 className="text-center mb-5 fs-18">Top Students</h6>
                                    <ul className="topper-chart">
                                        <li>
                                            <div className="topper-image"><img src={toperstudent} alt="" /></div>
                                            <span className="name">Andrew</span>
                                            <div className="bar">2</div>
                                        </li>

                                        <li>
                                            <div className="topper-image"><img src={toperstudent} alt="" /></div>
                                            <span className="name">Joseph</span>
                                            <div className="bar">1</div>
                                        </li>

                                        <li>
                                            <div className="topper-image"><img src={toperstudent} alt="" /></div>
                                            <span className="name">Kareen</span>
                                            <div className="bar">3  </div>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="overlay btn-toggle"></div>

                <div
                    className="offcanvas offcanvas-end"
                    data-bs-scroll="true"
                    tabIndex={-1}
                    id="staticBackdrop"
                >
                    <div className="offcanvas-header border-bottom h-70">
                        <div className="">
                            <h5 className="mb-0">Theme Customizer</h5>
                            <p className="mb-0">Customize your theme</p>
                        </div>
                        <Link to="javascript:;" className="primaery-menu-close" data-bs-dismiss="offcanvas">
                        <CloseOutlinedIcon/>
                        </Link>
                    </div>
                    <div className="offcanvas-body">
                        <div>
                            <p>Theme variation</p>

                            <div className="row g-3">
                                <div className="col-12 col-xl-6">
                                    <input type="radio" className="btn-check" name="theme-options" id="BlueTheme" />
                                    <label
                                        className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                                        htmlFor="BlueTheme"
                                    >
                                        <span className="material-icons-outlined">contactless</span>
                                        <span>Blue</span>
                                    </label>
                                </div>
                                <div className="col-12 col-xl-6">
                                    <input type="radio" className="btn-check" name="theme-options" id="LightTheme" defaultChecked />
                                    <label
                                        className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                                        htmlFor="LightTheme"
                                    >
                                        <span className="material-icons-outlined">light_mode</span>
                                        <span>Light</span>
                                    </label>
                                </div>
                                <div className="col-12 col-xl-6">
                                    <input type="radio" className="btn-check" name="theme-options" id="DarkTheme" />
                                    <label
                                        className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                                        htmlFor="DarkTheme"
                                    >
                                        <span className="material-icons-outlined">dark_mode</span>
                                        <span>Dark</span>
                                    </label>
                                </div>
                                <div className="col-12 col-xl-6">
                                    <input type="radio" className="btn-check" name="theme-options" id="SemiDarkTheme" />
                                    <label
                                        className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                                        htmlFor="SemiDarkTheme"
                                    >
                                        <span className="material-icons-outlined">contrast</span>
                                        <span>Semi Dark</span>
                                    </label>
                                </div>
                                <div className="col-12 col-xl-6">
                                    <input type="radio" className="btn-check" name="theme-options" id="BoderedTheme" />
                                    <label
                                        className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                                        htmlFor="BoderedTheme"
                                    >
                                        <span className="material-icons-outlined">border_style</span>
                                        <span>Bordered</span>
                                    </label>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div >
            <Footer/>
        </>
    )
}

export default InstitutionDash;