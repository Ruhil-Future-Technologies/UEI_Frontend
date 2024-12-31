import React, { useState } from "react";
import TeacherGraoh from "../TeacherGraphs";
import profile from "../../../assets/img/profile.png";
import { Link } from "react-router-dom";
import toperstudent from "../../../assets/img/topper-image.png";
import consultantimg from "../../../assets/img/consultant.png";
import goaling from "../../../assets/img/goal.png";
import classimg from "../../../assets/img/class.png";

import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import MicIcon from '@mui/icons-material/Mic';
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import robotimg from "../../../assets/img/robot.png";
import glogowhite from "../../../assets/img/g-logo-white.svg";
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Card, CardContent, Grid, Tab, Table, TableBody, TableCell, TableRow, Tabs, Typography } from "@mui/material";

// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
const TeacherDash = () => {
    const [activeTab, setActiceTab] = useState(0);
    const tabContent = [
        {
            label: "All",
            lessons: 21,
            duration: "45 min",
            assignments: 2,
            students: 256,
            image: classimg,
            title: "Microbiology Society",
        },
        {
            label: "Design",
            lessons: 18,
            duration: "50 min",
            assignments: 3,
            students: 198,
            image: classimg,
            title: "Creative Design Hub",
        },
        {
            label: "Science",
            lessons: 25,
            duration: "60 min",
            assignments: 4,
            students: 300,
            image: classimg,
            title: "Advanced Science Course",
        },
        {
            label: "Coding",
            lessons: 30,
            duration: "90 min",
            assignments: 5,
            students: 400,
            image: classimg,
            title: "Full-Stack Coding Bootcamp",
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
                                <li className="breadcrumb-item"><HomeOutlinedIcon sx={{
                                    fontSize: "18px",

                                }} /><Link to="/"></Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">Report</li>
                            </ol>
                        </nav>
                    </div>
                </div>


                <div className="row">
                    <div className="col-xxl-4 col-xl-6 d-flex align-items-stretch">
                        <div className="card w-100 overflow-hidden rounded-4">
                            <div className="card-header bg-primary-20">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="d-flex align-items-center gap-3">
                                            <img src={profile} className="rounded-circle bg-grd-info p-1"
                                                width="94" height="94" alt="user" />
                                            <div className="w-100">
                                                <h4 className="fw-semibold  fs-18 ">Rahul Sharma</h4>
                                                <small className=" d-block">24 Course</small>
                                                <small className=" d-block mb-2">18 Certification</small>
                                                <strong className="d-block text-dark fs-12"> 260 Students</strong>


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
                                </div>




                            </div>
                        </div>
                    </div>


                    <div className="col-xxl-4 col-xl-6 d-flex align-items-stretch">
                        <div className="card w-100">
                            <div className="card-body text-center">
                                <img src={consultantimg} alt="" />
                                <h6 className="fs-18  fw-bold">Get Consultation</h6>
                                <small className="d-block mb-3">Take help from our expert AI to Prepare Lactures</small>
                                <button className="btn btn-outline-secondary rounded-pill btn-sm px-lg-3">Start</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-xxl-4 col-xl-6 d-flex align-items-stretch">
                        <div className="card w-100">
                            <div className="card-body text-center">
                                <img src={goaling} alt="" />
                                <h6 className="fs-18  fw-bold">Set Target</h6>
                                <small className="d-block mb-3">Set Targets, Reminders and your classes times</small>
                                <button className="btn btn-outline-secondary rounded-pill btn-sm px-lg-3">Start</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-xxl-4 col-xl-6 d-flex align-items-stretch">
                        <div className="card w-100">
                            <div className="card-body ">
                                <h6 className="fs-18 fw-bold mb-3">Your className</h6>

                                {/* <ul className="nav nav-pills  classtabs" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">All</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Design</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Science</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="pills-disabled-tab" data-bs-toggle="pill" data-bs-target="#pills-disabled" type="button" role="tab" aria-controls="pills-disabled" aria-selected="false">Coding</button>
                                    </li>
                                </ul> */}
                                <Box>
                                    <Tabs
                                        value={activeTab}
                                        onChange={(_, newValue) => setActiceTab(newValue)}
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        aria-label="Navigation Pills"
                                    >
                                        {tabContent.map((tab, index) => (
                                            <Tab key={index} label={tab.label} />
                                        ))}
                                    </Tabs>
                                    <Box sx={{ mt: 3 }}

                                    >
                                        {tabContent.map((tab, index) => (
                                            <Box
                                                key={index}
                                                role="tabpanel"
                                                hidden={activeTab !== index}
                                                id={`tabpanel-${index}`}
                                                aria-labelledby={`tab-${index}`}

                                            >
                                                {activeTab === index && (
                                                    <Card
                                                        sx={{
                                                            boxShadow: 2,
                                                            borderRadius: 2,
                                                            mb: 2,
                                                            p: 2,
                                                            "&:hover": { boxShadow: 4 },
                                                            // backgroundColor: "primary.main"
                                                        }}
                                                        className="card bg-primary-20 rounded-3 mb-0"
                                                    >
                                                        <CardContent>
                                                            <Grid container spacing={2} alignItems="center">
                                                                <Grid item xs={12} md={3}>
                                                                    <img
                                                                        src={tab.image}
                                                                        alt={tab.title}
                                                                        style={{
                                                                            width: "100%",
                                                                            borderRadius: "8px",
                                                                        }}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} md={9}>
                                                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                                                        {tab.title}
                                                                    </Typography>
                                                                    <Table size="small">
                                                                        <TableBody>
                                                                            <TableRow>
                                                                                <TableCell>{tab.lessons} Lessons</TableCell>
                                                                                <TableCell align="right">{tab.duration}</TableCell>
                                                                            </TableRow>
                                                                            <TableRow>
                                                                                <TableCell>{tab.assignments} Assignments</TableCell>
                                                                                <TableCell align="right">{tab.students} Students</TableCell>
                                                                            </TableRow>
                                                                        </TableBody>
                                                                    </Table>
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                                {/* <div className="tab-content clstabcontent" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                                        <div className="card bg-primary-20 rounded-3 mb-0">
                                            <div className="card-body">
                                                <div className="row g-3">
                                                    <div className="col-lg-3"><img src={classimg} alt="" /></div>
                                                    <div className="col-lg-9">
                                                        <h6 >Microbiology Socity</h6>
                                                        <table className="table table-sm table-borderless">
                                                            <tr><td>21 Lesson</td><td>45 min</td></tr>
                                                            <tr><td>2 Assignments</td><td>256 Students</td></tr>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                                        <div className="card bg-primary-20 rounded-3 mb-0">
                                            <div className="card-body">
                                                <div className="row g-3">
                                                    <div className="col-lg-3"><img src=classimg alt="" /></div>
                                                    <div className="col-lg-9">
                                                        <h6 >Microbiology Socity</h6>
                                                        <table className="table table-sm table-borderless">
                                                            <tr><td>21 Lesson</td><td>45 min</td></tr>
                                                            <tr><td>2 Assignments</td><td>256 Students</td></tr>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabIndex={0}>
                                        <div className="card bg-primary-20 rounded-3 mb-0">
                                            <div className="card-body">
                                                <div className="row g-3">
                                                    <div className="col-lg-3"><img src=classimg alt="" /></div>
                                                    <div className="col-lg-9">
                                                        <h6 >Microbiology Socity</h6>
                                                        <table className="table table-sm table-borderless">
                                                            <tr><td>21 Lesson</td><td>45 min</td></tr>
                                                            <tr><td>2 Assignments</td><td>256 Students</td></tr>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-disabled" role="tabpanel" aria-labelledby="pills-disabled-tab" tabIndex={0}>
                                        <div className="card bg-primary-20 rounded-3 mb-0">
                                            <div className="card-body">
                                                <div className="row g-3">
                                                    <div className="col-lg-3"><img src=classimg alt="" /></div>
                                                    <div className="col-lg-9">
                                                        <h6 >Microbiology Socity</h6>
                                                        <table className="table table-sm table-borderless">
                                                            <tr><td>21 Lesson</td><td>45 min</td></tr>
                                                            <tr><td>2 Assignments</td><td>256 Students</td></tr>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="d-flex mb-3 justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold fs-18">Subject Wise Students</h5>
                            <div className="d-flex align-items-center gap-3">
                                <div className="swiper-next d-flex">< ArrowBackOutlinedIcon /></div>
                                <div className="swiper-prev d-flex">< ArrowForwardOutlinedIcon /></div>
                                <a href="" className="d-block text-dark btn btn-light rounded-3 btn-sm">See All</a>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <div className="swiper studentslider ">
                                    <div className="swiper-wrapper">
                                        <Swiper
                                            spaceBetween={10}
                                            slidesPerView={2}
                                            loop={true}
                                        >
                                            <SwiperSlide>

                                                <div className="card crcard">
                                                    <div className="card-body">
                                                        <div className="row g-3 align-items-center">
                                                            <div className="col-lg-4">
                                                                <div className="chart-container2 h-auto">
                                                                    <div id="chart9"></div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <h6 className=" fw-semibold mb-3">Biology Molecular</h6>

                                                                <table className="table table-sm table-borderless">
                                                                    <tr><td>21 Lesson</td><td>45 min</td></tr>
                                                                    <tr><td>2 Assignments</td><td>256 Students</td></tr>
                                                                </table>

                                                                <div className="d-flex gap-3">
                                                                    <button className="btn btn-outline-primary rounded-pill w-100">Skip</button>
                                                                    <button className="btn-primary btn rounded-pill w-100">Continue</button>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </SwiperSlide>
                                            <SwiperSlide>

                                                <div className="card crcard">
                                                    <div className="card-body">
                                                        <div className="row g-3 align-items-center">
                                                            <div className="col-lg-4">
                                                                <div className="chart-container2 h-auto">
                                                                    <div id="chart9"></div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <h6 className=" fw-semibold mb-3">Color Theory</h6>

                                                                <table className="table table-sm table-borderless">
                                                                    <tr><td>21 Lesson</td><td>45 min</td></tr>
                                                                    <tr><td>2 Assignments</td><td>256 Students</td></tr>
                                                                </table>

                                                                <div className="d-flex gap-3">
                                                                    <button className="btn btn-outline-primary rounded-pill w-100">Skip</button>
                                                                    <button className="btn-primary btn rounded-pill w-100">Continue</button>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </SwiperSlide>
                                            <SwiperSlide>

                                                <div className="card crcard">
                                                    <div className="card-body">
                                                        <div className="row g-3 align-items-center">
                                                            <div className="col-lg-4">
                                                                <div className="chart-container2 h-auto">
                                                                    <div id="chart9"></div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <h6 className=" fw-semibold mb-3">Biology Molecular</h6>

                                                                <table className="table table-sm table-borderless">
                                                                    <tr><td>21 Lesson</td><td>45 min</td></tr>
                                                                    <tr><td>2 Assignments</td><td>256 Students</td></tr>
                                                                </table>

                                                                <div className="d-flex gap-3">
                                                                    <button className="btn btn-outline-primary rounded-pill w-100">Skip</button>
                                                                    <button className="btn-primary btn rounded-pill w-100">Continue</button>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </SwiperSlide>
                                        </Swiper>


                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="col-xl-7 d-flex align-items-stretch">
                        <div className="card w-100 rounded-4 mt-lg-0 mt-4">
                            <div className="card-body">
                                <div className="d-flex mb-3 justify-content-between align-items-center">
                                    <h6 className="mb-0 fw-bold ">Learning Activity</h6>
                                    <div className="dropdown">
                                        <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            I 3rd semester
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#">Action</a></li>
                                            <li><a className="dropdown-item" href="#">Another action</a></li>
                                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="chart-container1">
                                    <canvas id="chart10"></canvas>
                                </div>

                            </div>
                        </div>
                    </div>
                    <TeacherGraoh />
                    <div className="col-xxl-8 d-flex align-items-stretch" style={{marginBottom:"64px"}}>
                        <div className="chat-wrapper desk-chat-wrapper rounded-4 mt-lg-5">

                            <div className="chat-header d-flex align-items-center start-0 rounded-top-4">

                                <div>
                                    <img src={robotimg} className="chatroboimg" alt="" />
                                </div>
                                <div className="chat-top-header-menu ms-auto">
                                    <Link
                                        to={"/main/Chat/recentChat"}
                                        className="btn-outline-primary btn btn-circle rounded-circle d-flex gap-2 wh-32"
                                    >
                                        <OpenInFullOutlinedIcon sx={{ fontSize: "24px" }} />
                                    </Link>

                                </div>
                            </div>
                            <div className="chat-content ms-0 rounded-top-4">
                                <div className="chat-content-rightside">
                                    <div className="d-flex ms-auto">
                                        <div className="flex-grow-1 me-2">

                                            <div className="chat-right-msg">
                                                <span className="anstext"><SearchOutlinedIcon sx={{ fontSize: "20px" }} /> Question</span>
                                                <p className="mb-0">
                                                    Give me a description of each one
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="chat-content-leftside">
                                    <div className="d-flex">
                                        <img src={glogowhite} width="38" height="38"
                                            className="rounded-circle p-2 bg-primary" alt="" />
                                        <div className="flex-grow-1 ms-2">
                                            <div className="chat-left-msg">
                                                <span className="anstext"><DescriptionOutlinedIcon sx={{ fontSize: "20px" }} /> Answer</span>
                                                <div className="mb-4">
                                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
                                                        alias iste minima! Illo blanditiis minima aspernatur id iste a!
                                                        Dolore similique voluptate earum dolorem pariatur. Pariatur sint
                                                        aliquam reiciendis minima.</p>

                                                </div>
                                                <ul className="ansfooter">
                                                    <li><ThumbUpAltOutlinedIcon sx={{ fontSize: "14px" }} /></li>
                                                    <li><ThumbDownAltOutlinedIcon sx={{ fontSize: "14px" }} /></li>
                                                    <li><ContentCopyOutlinedIcon sx={{ fontSize: "14px" }} /> <span>Copy</span></li>
                                                    <li><VolumeUpOutlinedIcon sx={{ fontSize: '14px' }} /> <span>Read</span></li>
                                                    <li><AutorenewOutlinedIcon sx={{ fontSize: '14px' }} /> <span>Regenerate</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="chat-content-rightside">
                                    <div className="d-flex ms-auto">
                                        <div className="flex-grow-1 me-2">

                                            <div className="chat-right-msg">
                                                <span className="anstext"><SearchOutlinedIcon sx={{ fontSize: "16px" }} /> Question</span>
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
                                    <div className="input-group"><span className="input-group-text">
                                        <MicIcon />
                                    </span>
                                        <input type="text" className="form-control" placeholder="Type a message" />
                                    </div>
                                </div>
                                <div className="chat-footer-menu">
                                    <Link to="/"
                                        className="btn btn-outline-light btn-circle rounded-circle d-flex gap-2 wh-48">
                                        <ArrowUpwardOutlinedIcon />
                                    </Link>
                                </div>
                            </div>

                            <div className="overlay chat-toggle-btn-mobile"></div>

                        </div>
                    </div>
                    <div className="col-xxl-4 d-flex align-items-stretch">
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
        </div>
    )

}

export default TeacherDash;