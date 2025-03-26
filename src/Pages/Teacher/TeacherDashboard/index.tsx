/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import TeacherGraoh from '../TeacherGraphs';
import profile from '../../../assets/img/profile.png';
import { Link, useNavigate } from 'react-router-dom';
import toperstudent from '../../../assets/img/topper-image.png';
import consultantimg from '../../../assets/img/consultant.png';
import goaling from '../../../assets/img/goal.png';
//import classimg from '../../../assets/img/class.png';

//import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
//import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import MicIcon from '@mui/icons-material/Mic';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import robotimg from '../../../assets/img/robot.png';
import glogowhite from '../../../assets/img/g-logo-white.svg';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PercentIcon from '@mui/icons-material/Percent';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import StreamIcon from '@mui/icons-material/Stream';
import AttractionsIcon from '@mui/icons-material/Attractions';
//import SubjectIcon from '@mui/icons-material/Subject';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import useApi from '../../../hooks/useAPI';
import { QUERY_KEYS_CLASS, QUERY_KEYS_COURSE } from '../../../utils/const';
import { CourseRep0oDTO, IClass } from '../../../Components/Table/columns';
import { toast } from 'react-toastify';
import TeacherDashboardCharts from '../TeacherChart';
import SessionTracker from '../../../Components/Tracker';

// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
interface Teacher {
  teacher_id: number;
  first_name: string;
  last_name: string;
  department: string;
  university_id: string;
  qualifications: string;
  image: string;
  bio: string;
  total_students: number;
  subjects: string[];
}

const TeacherDash = () => {
  const teacherId = localStorage.getItem('user_uuid');
  const userId = localStorage.getItem('teacher_id');
  const ClassURL = QUERY_KEYS_CLASS.GET_CLASS;
  const CourseURL = QUERY_KEYS_COURSE.GET_COURSE;
  const { getData } = useApi();
  const [teacherData, setTeacherData] = useState<Teacher>();
  const [selectedEntity, setSelectedEntity] = useState('');
  const [dataClass, setDataClass] = useState<IClass[]>([]);
  const [coursesData, setCoursesData] = useState<CourseRep0oDTO[]>([]);

  // const [boxes, setBoxes] = useState<Boxes[]>([
  //   {
  //     semester_number: '',
  //     subjects: [],
  //     course_id: '',
  //   },
  // ]);
  const navigate = useNavigate();

  const getTeacherInfo = () => {
    try {
      getData(`/teacher/edit/${teacherId}`).then((data) => {
        if (data?.status) {
          localStorage.setItem('teacher_id', data?.data.id);
          setTeacherData(data.data);
          if (data?.data?.course_semester_subjects != null) {
            setSelectedEntity('college');
            // const output: Boxes[] = Object.keys(
            //   data.data.course_semester_subjects,
            // ).flatMap((CourseKey) =>
            //   Object.keys(data.data.course_semester_subjects[CourseKey]).map(
            //     (semester_number) => ({
            //       course_id: CourseKey,
            //       semester_number: semester_number,
            //       subjects:
            //         data.data.course_semester_subjects[CourseKey][
            //         semester_number
            //         ],
            //     }),
            //   ),
            // );
            const courseIds = Object.keys(
              data.data.course_semester_subjects,
            ).map((CourseKey) => CourseKey);
            getCourses(courseIds);
          } else {
            setSelectedEntity('school');
            const classIds = Object.keys(data.data.class_stream_subjects).map(
              (classKey) => classKey,
            );
            getClasslist(classIds);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTeacherInfo();
  }, []);
  const getCourses = (courseIds: any) => {
    getData(`${CourseURL}`)
      .then((data) => {
        if (data.data) {
          setCoursesData(data?.data);
          const filteredCourses = data.data.course_data.filter((course: any) =>
            courseIds.includes(String(course.id)),
          );
          setCoursesData(filteredCourses);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const getClasslist = (classIds: any) => {
    getData(`${ClassURL}`)
      .then((data) => {
        if (data.data) {
          const filteredClasses = data.data.classes_data.filter((classn: any) =>
            classIds.includes(String(classn.id)),
          );
          setDataClass(filteredClasses);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
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

        <div className="row  g-4 mb-4">
          <div className="col-xxl-4 col-xl-6 d-flex align-items-stretch">
            <div className="card ">
              <div className="card-body position-relative p-4">
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-3 flex-column">
                      <img
                        src={profile}
                        className="rounded-circle bg-grd-info p-1"
                        width="94"
                        height="94"
                        alt="user"
                      />
                      <div className="w-100 text-center">
                        <h4 className="fw-bold mb-1 fs-4">
                          {teacherData?.first_name} {teacherData?.last_name}
                        </h4>
                        <p className="opacity-75 mb-1">
                          {teacherData?.university_id}
                        </p>
                        <p className="planbg">Senior Professor</p>
                      </div>
                      <div className="curcc">
                        {selectedEntity === 'college' ? (
                          <>
                            <h6>CURRENT COURSES</h6>
                            <ul>
                              {coursesData?.map((item, index) => (
                                <li key={index}>{item.course_name}</li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <>
                            <h6>CURRENT CLASSES</h6>
                            <ul>
                              {dataClass?.map((item, index) => (
                                <li key={index}>{item.class_name}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                  <div>
                    <h6 className="mb-0 fw-normal">Status</h6>
                  </div>

                  <div className="form-check form-switch mb-0 ">
                    <input
                      className="form-check-input fs-5 m-0"
                      type="checkbox"
                      id="status"
                      checked
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="flex-grow-1">
                    <h6 className="mb-0 fw-normal">Chat History</h6>
                  </div>
                  <div>
                    <a href="">0</a>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="flex-grow-1">
                    <h6 className="mb-0 fw-normal">Saved Chat</h6>
                  </div>
                  <div>
                    <a href="">0</a>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="flex-grow-1">
                    <h6 className="mb-0 fw-normal">Profile Completed</h6>
                  </div>
                  <div>
                    <a href="profile.html">90%</a>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="col-12">
            <h5 className="mb-1 fw-bold fs-4">Your Classes</h5>
            <p className="text-secondary">
              Manage your classes and view student information
            </p>

            <div className="swiper-container">
              <Swiper
                spaceBetween={24}
                slidesPerView={3}
                loop={true}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                modules={[Navigation]}
                breakpoints={{
                  320: { slidesPerView: 1 }, // Mobile
                  640: { slidesPerView: 1 }, // Tablets
                  1024: { slidesPerView: 2 }, // Laptops
                  1440: { slidesPerView: 3 }, // Large Screens
                }}
              >
                <SwiperSlide>
                  <div className="card mb-0">
                    <div className="card-body">
                      <div className="carddlex">
                        <span>
                          <AttractionsIcon />
                        </span>
                        <div className="">
                          <h6 className="fs-4">Grade 11</h6>
                          <p> Physics</p>
                        </div>
                      </div>

                      <div className="row g-2">
                        <div className="col-lg-6">
                          <div className="totallist">
                            <span>
                              <SupervisedUserCircleIcon />
                            </span>
                            <div className="">
                              <h6>Total Students</h6> <p>50</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="totallist">
                            <span>
                              <StreamIcon />
                            </span>
                            <div className="">
                              <h6>Streem</h6> <p>Science</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-primary mt-4 w-100"
                        onClick={() =>
                          navigate('/teacher-dashboard/student-details')
                        }
                      >
                        View Students
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="card mb-0">
                    <div className="card-body">
                      <div className="carddlex">
                        <span>
                          <PercentIcon />
                        </span>
                        <div className="">
                          <h6 className="fs-4">Grade 10</h6>
                          <p>Maths</p>
                        </div>
                      </div>

                      <div className="totallist">
                        <span>
                          <SupervisedUserCircleIcon />
                        </span>
                        <div className="">
                          <h6>Total Students</h6> <p>50</p>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-primary mt-4 w-100"
                        onClick={() =>
                          navigate('/teacher-dashboard/student-details')
                        }
                      >
                        View Students
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="card mb-0">
                    <div className="card-body">
                      <div className="carddlex">
                        <span>
                          <PercentIcon />
                        </span>
                        <div className="">
                          <h6 className="fs-4">Grade 10</h6>
                          <p>Maths</p>
                        </div>
                      </div>

                      <div className="totallist">
                        <span>
                          <SupervisedUserCircleIcon />
                        </span>
                        <div className="">
                          <h6>Total Students</h6> <p>50</p>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-primary mt-4 w-100"
                        onClick={() =>
                          navigate('/teacher-dashboard/student-details')
                        }
                      >
                        View Students
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="card mb-0">
                    <div className="card-body">
                      <div className="carddlex">
                        <span>
                          <PercentIcon />
                        </span>
                        <div className="">
                          <h6 className="fs-4">Grade 10</h6>
                          <p>Maths</p>
                        </div>
                      </div>

                      <div className="totallist">
                        <span>
                          <SupervisedUserCircleIcon />
                        </span>
                        <div className="">
                          <h6>Total Students</h6> <p>50</p>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-primary mt-4 w-100"
                        onClick={() =>
                          navigate('/teacher-dashboard/student-details')
                        }
                      >
                        View Students
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="card mb-0">
                    <div className="card-body">
                      <div className="carddlex">
                        <span>
                          <PercentIcon />
                        </span>
                        <div className="">
                          <h6 className="fs-4">Grade 10</h6>
                          <p>Maths</p>
                        </div>
                      </div>

                      <div className="totallist">
                        <span>
                          <SupervisedUserCircleIcon />
                        </span>
                        <div className="">
                          <h6>Total Students</h6> <p>50</p>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-primary mt-4 w-100"
                        onClick={() =>
                          navigate('/teacher-dashboard/student-details')
                        }
                      >
                        View Students
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xxl-3 col-xl-6 d-flex align-items-stretch">
            <div className="card w-100">
              <div className="card-body text-center">
                <img src={consultantimg} alt="" />
                <h6 className="fs-18  fw-bold">Get Consultation</h6>
                <small className="d-block mb-3">
                  Take help from our expert AI to Prepare Lectures
                </small>
                <button className="btn btn-outline-secondary rounded-pill btn-sm px-lg-3">
                  Start
                </button>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-6 d-flex align-items-stretch">
            <div className="card w-100">
              <div className="card-body text-center">
                <img src={goaling} alt="" />
                <h6 className="fs-18  fw-bold">Set Target</h6>
                <small className="d-block mb-3">
                  Set Targets, Reminders and your classes times
                </small>
                <button className="btn btn-outline-secondary rounded-pill btn-sm px-lg-3">
                  Start
                </button>
              </div>
            </div>
          </div>

          <TeacherGraoh />
          <TeacherDashboardCharts />
          <div
            className="col-xxl-8 d-flex align-items-stretch "
            style={{ marginBottom: '64px' }}
          >
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
          <div className="col-xxl-4 d-flex align-items-stretch mt-8">
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
      <SessionTracker userId={userId ? userId : ''} />
    </div>
  );
};

export default TeacherDash;
