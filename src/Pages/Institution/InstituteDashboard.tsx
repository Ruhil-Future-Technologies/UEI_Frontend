import React, { useEffect, useState } from 'react';
// import React from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
import '../Institution/institution.css';
import profile from '../../assets/img/profile.png';
import studentimg from '../../assets/img/ins-1.png';
import courseImg from '../../assets/img/courses-1.png';
import toperstudent from '../../assets/img/topper-image.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
//import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import InstituteGraphRepo from './institutionGraphRepo';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import MicIcon from '@mui/icons-material/Mic';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import robotimg from '../../assets/img/robot.png';
import glogowhite from '../../assets/img/g-logo-white.svg';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import useApi from '../../hooks/useAPI';
// interface Course {
//     course_id: number;
//     course_name: string;
//     course_image: string;
//     institute_id: string;
// }
// interface Student {
//     student_id: number;
//     student_name: string;
//     student_image: string;
//     institute_id: string;
// }

interface Institute {
  address: string;
  city: string;
  country: string;
  created_at: string;
  created_by: string;
  district: string;
  email_id: string;
  entity_id: string;
  entity_type: string;
  icon: string | null;
  id: string;
  institution_name: string;
  is_active: number;
  mobile_no: string;
  pincode: string;
  state: string;
  university_id: string;
  university_name: string;
  updated_at: string;
  updated_by: string;
  website_url: string;
}

//const instituteId = localStorage.getItem('_id');
const instituteId = '036ca815-ee29-4baa-aaa1-2a4336d416e3';

const InstitutionDash = () => {
  const { getData } = useApi();
  const [instituteInfo, setInstituteInfo] = useState<Institute>({
    address: '',
    city: '',
    country: 'India',
    created_at: '',
    created_by: '',
    district: '',
    email_id: '',
    entity_id: '',
    entity_type: '',
    icon: null,
    id: '',
    institution_name: '',
    is_active: 0,
    mobile_no: '',
    pincode: '',
    state: '',
    university_id: '',
    university_name: '',
    updated_at: '',
    updated_by: '',
    website_url: '',
  });
  const [totelStudents, setTotelStudent] = useState(0);
  const [totleCourse, setTotleCourse] = useState(0);

  useEffect(() => {
    getCourseCount();
    getStudentsCount();
    getInstitutionInfo();
    console.log('getData');
    // eslint-disable-next-line
  }, []);

  const getCourseCount = () => {
    console.log(totleCourse);
    try {
      getData(`course/course-count/${instituteId}`).then((response) => {
        if (response?.status === 200) {
          setTotleCourse(response?.data?.courses_count);
        }
        console.log(response);
      });
      console.log(instituteId);
    } catch (error) {
      console.log(error);
    }
  };
  const getStudentsCount = () => {
    console.log(totelStudents);

    try {
      getData(`student/students-count`).then((response) => {
        if (response?.status === 200) {
          setTotelStudent(response?.data?.students_count);
        }
        console.log(response);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getInstitutionInfo = () => {
    try {
      getData(`institution/get/${instituteId}`).then((response) => {
        if (response?.status === 200) {
          setInstituteInfo(response?.data);
          console.log(response);
          console.log(instituteInfo);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const slides = [
    { subject: 'English', totalStudents: 30, image: courseImg },
    { subject: 'Math', totalStudents: 25, image: courseImg },
    { subject: 'Science', totalStudents: 35, image: courseImg },
    { subject: 'History', totalStudents: 20, image: courseImg },
    { subject: 'Geography', totalStudents: 40, image: courseImg },
  ];

  const Teachers = [
    {
      name: 'atul yadav',
      subject: 'Mathematics',
      image: studentimg,
    },
    {
      name: 'raj kumar',
      subject: 'English',
      image: studentimg,
    },
    {
      name: 'puneet jain',
      subject: 'Data ',
      image: studentimg,
    },
    {
      name: 'Rohit sharma',
      subject: 'Cricket',
      image: studentimg,
    },
  ];
  const topStudent = [
    {
      name: 'Akulya shiva',
      class: '5th',
      image: studentimg,
    },
    {
      name: 'Nitn raj',
      class: '8th',
      image: studentimg,
    },
    {
      name: 'Rovin singh',
      class: '10th',
      image: studentimg,
    },
    {
      name: 'Rohit patel',
      class: '9th',
      image: studentimg,
    },
  ];

  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Dashboard</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <HomeOutlinedIcon
                    sx={{
                      fontSize: '18px',
                    }}
                  />
                  <Link to="/"></Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Report
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          <div className="col-xxl-3 col-xl-6 d-flex align-items-stretch">
            <div className="card w-100 overflow-hidden rounded-4">
              <div className="card-header bg-primary-20">
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={profile}
                        className="rounded-circle bg-grd-info p-1"
                        width="94"
                        height="94"
                        alt="user"
                      />
                      <div className="w-100">
                        <h4 className="fw-semibold mb-0 fs-18 mb-0">
                          {instituteInfo.institution_name}
                        </h4>
                        <small className="mb-3 d-block">
                          {instituteInfo.address + ' '}
                          {instituteInfo.city + ', '}
                          {instituteInfo.district + ' '}
                          {instituteInfo.state + ' '}
                          {instituteInfo.pincode + ', '}
                          {instituteInfo.country}
                        </small>

                        <div className="">
                          <div
                            className="progress mb-0"
                            style={{ height: '5px;' }}
                          >
                            <div
                              className="progress-bar bg-grd-success"
                              role="progressbar"
                              style={{ width: '60%' }}
                              aria-valuenow={25}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
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
                    <input
                      className="form-check-input fs-5 m-0"
                      type="checkbox"
                      id="status"
                      checked={instituteInfo.is_active == 1}
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="flex-grow-1">
                    <h6 className="mb-0 fw-normal">Chat History</h6>
                  </div>
                  <div>
                    <Link to="/">0</Link>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="flex-grow-1">
                    <h6 className="mb-0 fw-normal">Saved Chat</h6>
                  </div>
                  <div>
                    <Link to="/">0</Link>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="flex-grow-1">
                    <h6 className="mb-0 fw-normal">Profile Completed</h6>
                  </div>
                  <div>
                    <Link to="/">90%</Link>
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
                    to{' '}
                    <span className="text-primary d-inline-flex align-items-center gap-1">
                      (2.5%)
                      <ArrowUpwardOutlinedIcon />
                    </span>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table fs-14 align-middle mntable">
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Subject</th>
                    </tr>
                    {Teachers.map((teacher, index) => (
                      <tr key={index}>
                        <td>
                          <img src={teacher.image} alt="" />
                        </td>
                        <td>{teacher.name}</td>
                        <td>{teacher.subject}</td>
                      </tr>
                    ))}
                  </table>
                </div>
                <Link to="/main/Student" className="text-center d-block">
                  See All
                </Link>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-6 d-flex align-items-stretch">
            <div className="card w-100 rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <h5 className="mb-0 fw-semibold fs-6">Total Students</h5>
                  <div className="d-flex align-items-center gap-1 text-dark fw-semibold">
                    {totelStudents}{' '}
                    <span className="text-primary d-inline-flex align-items-center gap-1">
                      (2.5%)
                      <ArrowUpwardOutlinedIcon />
                    </span>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table fs-14 align-middle mntable">
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>className</th>
                    </tr>
                    {topStudent.map((student, index) => (
                      <tr key={index}>
                        <td>
                          <img src={student.image} alt="" />
                        </td>
                        <td>{student.name}</td>
                        <td>{student.class}</td>
                      </tr>
                    ))}
                  </table>
                </div>
                <Link to="/main/Student" className="text-center d-block">
                  See All
                </Link>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-6 d-flex align-items-stretch">
            <div className="card w-100 rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <h5 className="mb-0 fw-semibold fs-6">Total Courses</h5>
                  <div className="d-flex align-items-center gap-1 text-dark fw-semibold">
                    {totleCourse}{' '}
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table fs-14 align-middle mntable">
                    <tr>
                      <th>Course Name</th>
                      <th>Duration (Yr)</th>
                      <th>Enrollment Status</th>
                    </tr>

                    <tr>
                      <td>B.S.C Science</td>
                      <td>4</td>
                      <td>
                        <Link to="/">Enroll Student</Link>
                      </td>
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
                      <td>
                        <Link to="/">Enroll Student</Link>
                      </td>
                    </tr>
                  </table>
                </div>
                <Link to="/" className="text-center d-block">
                  See All
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="d-flex mb-3 justify-content-between align-items-center">
              <h5 className="mb-0">Subject Wise Students</h5>
              <div className="d-flex align-items-center gap-3">
                <div className="swiper-prev d-flex">
                  <ArrowBackOutlinedIcon />
                </div>
                <div className="swiper-next d-flex">
                  <ArrowForwardOutlinedIcon />
                </div>
                <Link to="/" className="d-block text-dark btn rounded-3 btn-sm">
                  See All
                </Link>
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
                            <img
                              src={slide.image}
                              alt={slide.subject}
                              className="img-fluid"
                            />
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

          <InstituteGraphRepo />

          <div className="col-xxl-8 d-flex align-items-stretch">
            <div className="chat-wrapper desk-chat-wrapper rounded-4 mt-lg-5">
              <div className="chat-header d-flex align-items-center start-0 rounded-top-4">
                <div>
                  <img src={robotimg} className="chatroboimg" alt="" />
                </div>
                <div className="chat-top-header-menu ms-auto">
                  <Link
                    to={'/main/Chat/recentChat'}
                    className="btn-outline-primary btn btn-circle rounded-circle d-flex gap-2 wh-32"
                  >
                    <OpenInFullOutlinedIcon sx={{ fontSize: '24px' }} />
                  </Link>
                </div>
              </div>
              <div className="chat-content ms-0 rounded-top-4">
                <div className="chat-content-rightside">
                  <div className="d-flex ms-auto">
                    <div className="flex-grow-1 me-2">
                      <div className="chat-right-msg">
                        <span className="anstext">
                          <SearchOutlinedIcon sx={{ fontSize: '20px' }} />{' '}
                          Question
                        </span>
                        <p className="mb-0">
                          Give me a description of each one
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chat-content-leftside">
                  <div className="d-flex">
                    <img
                      src={glogowhite}
                      width="38"
                      height="38"
                      className="rounded-circle p-2 bg-primary"
                      alt=""
                    />
                    <div className="flex-grow-1 ms-2">
                      <div className="chat-left-msg">
                        <span className="anstext">
                          <DescriptionOutlinedIcon sx={{ fontSize: '20px' }} />{' '}
                          Answer
                        </span>
                        <div className="mb-4">
                          <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Cupiditate alias iste minima! Illo blanditiis
                            minima aspernatur id iste a! Dolore similique
                            voluptate earum dolorem pariatur. Pariatur sint
                            aliquam reiciendis minima.
                          </p>
                        </div>
                        <ul className="ansfooter">
                          <li>
                            <ThumbUpAltOutlinedIcon sx={{ fontSize: '14px' }} />
                          </li>
                          <li>
                            <ThumbDownAltOutlinedIcon
                              sx={{ fontSize: '14px' }}
                            />
                          </li>
                          <li>
                            <ContentCopyOutlinedIcon
                              sx={{ fontSize: '14px' }}
                            />{' '}
                            <span>Copy</span>
                          </li>
                          <li>
                            <VolumeUpOutlinedIcon sx={{ fontSize: '14px' }} />{' '}
                            <span>Read</span>
                          </li>
                          <li>
                            <AutorenewOutlinedIcon sx={{ fontSize: '14px' }} />{' '}
                            <span>Regenerate</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chat-content-rightside">
                  <div className="d-flex ms-auto">
                    <div className="flex-grow-1 me-2">
                      <div className="chat-right-msg">
                        <span className="anstext">
                          <SearchOutlinedIcon sx={{ fontSize: '16px' }} />{' '}
                          Question
                        </span>
                        <p className="mb-0">
                          Give me a description of each one
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat-footer d-flex align-items-center start-0 rounded-bottom-4">
                <div className="flex-grow-1 pe-2">
                  <div className="input-group">
                    <span className="input-group-text">
                      <MicIcon />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type a message"
                    />
                  </div>
                </div>
                <div className="chat-footer-menu">
                  <Link
                    to="/"
                    className="btn btn-outline-light btn-circle rounded-circle d-flex gap-2 wh-48"
                  >
                    <ArrowUpwardOutlinedIcon />
                  </Link>
                </div>
              </div>

              <div className="overlay chat-toggle-btn-mobile"></div>
            </div>
          </div>
          <div className="col-xxl-4 d-flex align-items-stretch topstudent">
            <div className="card w-100">
              <div className="card-body">
                <h6 className="text-center mb-5 fs-18">Top Students</h6>
                <ul className="topper-chart">
                  <li>
                    <div className="topper-image">
                      <img src={toperstudent} alt="" />
                    </div>
                    <span className="name">Andrew</span>
                    <div className="bar">2</div>
                  </li>

                  <li>
                    <div className="topper-image">
                      <img src={toperstudent} alt="" />
                    </div>
                    <span className="name">Joseph</span>
                    <div className="bar">1</div>
                  </li>

                  <li>
                    <div className="topper-image">
                      <img src={toperstudent} alt="" />
                    </div>
                    <span className="name">Kareen</span>
                    <div className="bar">3 </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="overlay btn-toggle"></div>

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
                        <Link to="/" data-bs-dismiss="offcanvas">
                            <CloseOutlinedIcon className="primaery-menu-close" />
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
                </div> */}
    </div>
  );
};

export default InstitutionDash;
